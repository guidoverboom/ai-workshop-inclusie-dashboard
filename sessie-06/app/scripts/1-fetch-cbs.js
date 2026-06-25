import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE = 'https://opendata.cbs.nl/ODataApi/odata'

async function haal(url) {
  console.log('Fetching', url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CBS gaf status ${res.status}`)
  const json = await res.json()
  return json.value
}

async function buildData() {
  const f = '%24format=json'

  // Haal beschikbare perioden op
  const periodenUrl = `${BASE}/80794ned/Perioden?${f}`
  const periodenRows = await haal(periodenUrl)
  
  if (periodenRows.length < 60) {
    throw new Error('Niet genoeg historische data (minder dan 60 maanden beschikbaar)')
  }

  // Bepaal de huidige maand, vorig jaar, en 5 jaar geleden (60 maanden)
  const laatstePeriodeRegio = periodenRows[periodenRows.length - 1].Key.trim()
  const vorigJaarPeriodeRegio = periodenRows[periodenRows.length - 13].Key.trim()
  const startPeriodeRegio = periodenRows[periodenRows.length - 60].Key.trim()
  
  // Filter op de afgelopen 5 jaar (Perioden ge startPeriode) EN alleen provincies + Nederland
  const regioFilter = encodeURIComponent(`Perioden ge '${startPeriodeRegio}' and (substringof('PV',RegioS) or substringof('NL01',RegioS))`)
  
  // We halen TotDeAOWLeeftijd_2 (Totaal), Werkloosheid_4 (WW), BijstandTotDeAOWLeeftijd_7 (Bijstand), ArbeidsongeschiktheidTotaal_8 (AO), en WajongUitkering_11 (Wajong)
  const regioSelect = 'Perioden,RegioS,TotDeAOWLeeftijd_2,Werkloosheid_4,BijstandTotDeAOWLeeftijd_7,ArbeidsongeschiktheidTotaal_8,WajongUitkering_11'
  
  // Haal uitkeringen en bevolking tegelijk op
  const [regioRows, bevolkingRows] = await Promise.all([
    haal(`${BASE}/80794ned/TypedDataSet?${f}&%24filter=${regioFilter}&%24select=${regioSelect}`),
    haal(`${BASE}/37230ned/TypedDataSet?${f}&%24filter=${regioFilter}&%24select=Perioden,RegioS,BevolkingAanHetEindeVanDePeriode_15`).catch(() => [])
  ])

  const rawData = {
    laatstePeriodeRegio,
    vorigJaarPeriodeRegio,
    regioRows,
    bevolkingRows
  }

  const dest = path.join(__dirname, '../public/raw-data.json')
  fs.writeFileSync(dest, JSON.stringify(rawData, null, 2))
  console.log(`\n✅ Extract: Ruwe data succesvol opgeslagen in ${dest}`)
}

buildData().catch(console.error)

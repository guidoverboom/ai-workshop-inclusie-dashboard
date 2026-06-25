import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE = 'https://opendata.cbs.nl/ODataApi/odata'

const maandVol = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']

function parsePeriode(code) {
  const jaar = code.slice(0, 4)
  const mm = parseInt(code.slice(6), 10)
  return { jaar, mm }
}

const labelVol = (code) => {
  const { jaar, mm } = parsePeriode(code)
  return `${maandVol[mm - 1]} ${jaar}`
}

const PROVINCIES = {
  PV20: 'Groningen', PV21: 'Fryslân', PV22: 'Drenthe', PV23: 'Overijssel',
  PV24: 'Flevoland', PV25: 'Gelderland', PV26: 'Utrecht', PV27: 'Noord-Holland',
  PV28: 'Zuid-Holland', PV29: 'Zeeland', PV30: 'Noord-Brabant', PV31: 'Limburg',
  NL01: 'Heel Nederland',
}

async function haal(url) {
  console.log('Fetching', url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CBS gaf status ${res.status}`)
  const json = await res.json()
  return json.value
}

async function buildData() {
  const f = '%24format=json'

  const periodenUrl = `${BASE}/80794ned/Perioden?${f}`
  const periodenRows = await haal(periodenUrl)
  
  const laatstePeriodeRegio = periodenRows[periodenRows.length - 1].Key.trim()
  const peilmaandRegio = labelVol(laatstePeriodeRegio)
  const regioFilter = encodeURIComponent(`Perioden eq '${laatstePeriodeRegio}' and (substringof('PV',RegioS) or substringof('NL01',RegioS))`)
  const regioSelect = 'RegioS,TotDeAOWLeeftijd_2,Werkloosheid_4,BijstandTotDeAOWLeeftijd_7,ArbeidsongeschiktheidTotaal_8,WajongUitkering_11'
  
  const [regioRows, bevolkingRows] = await Promise.all([
    haal(`${BASE}/80794ned/TypedDataSet?${f}&%24filter=${regioFilter}&%24select=${regioSelect}`),
    haal(`${BASE}/37230ned/TypedDataSet?${f}&%24filter=${regioFilter}&%24select=RegioS,BevolkingAanHetEindeVanDePeriode_15`).catch(() => [])
  ])

  const bevolkingMap = Object.fromEntries(bevolkingRows.map(r => [r.RegioS.trim(), r.BevolkingAanHetEindeVanDePeriode_15]))

  const regios = regioRows
    .map((r) => {
      const totaal = r.TotDeAOWLeeftijd_2 ?? 0
      const arbeidsongeschikt = r.ArbeidsongeschiktheidTotaal_8 ?? 0
      const populatie = bevolkingMap[r.RegioS.trim()] || 0
      const bijstand = r.BijstandTotDeAOWLeeftijd_7 ?? 0
      const ww = r.Werkloosheid_4 ?? 0
      
      const ratio = (val) => populatie ? Math.round((val / populatie) * 10000) / 10 : 0

      return {
        regio: PROVINCIES[r.RegioS.trim()] ?? r.RegioS.trim(),
        totaal,
        per1000: ratio(totaal),
        bijstand,
        bijstandPer1000: ratio(bijstand),
        ww,
        wwPer1000: ratio(ww),
        arbeidsongeschikt,
        aoPer1000: ratio(arbeidsongeschikt),
        wajong: r.WajongUitkering_11 ?? 0,
        aandeelAO: totaal ? Math.round((arbeidsongeschikt / totaal) * 100) : 0,
      }
    })
    .filter((r) => r.totaal > 0)

  const data = { peilmaandRegio, regios }

  const dest = path.join(__dirname, '../public/data.json')
  fs.writeFileSync(dest, JSON.stringify(data, null, 2))
  console.log(`\n✅ Data succesvol opgeslagen in ${dest}`)
}

buildData().catch(console.error)

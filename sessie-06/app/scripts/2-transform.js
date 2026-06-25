import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

function transformData() {
  const source = path.join(__dirname, '../public/raw-data.json')
  if (!fs.existsSync(source)) {
    throw new Error('raw-data.json niet gevonden. Draai eerst 1-fetch-cbs.js')
  }

  const rawData = JSON.parse(fs.readFileSync(source, 'utf-8'))
  const { laatstePeriodeRegio, vorigJaarPeriodeRegio, regioRows, bevolkingRows } = rawData

  const peilmaandRegio = labelVol(laatstePeriodeRegio)

  // Map bevolking: { "Perioden_RegioS": bevolking }
  const bevolkingMap = Object.fromEntries(
    bevolkingRows.map(r => [`${r.Perioden.trim()}_${r.RegioS.trim()}`, r.BevolkingAanHetEindeVanDePeriode_15])
  )

  // Sorteer regioRows zodat we makkelijk kunnen groeperen op regio
  const regioMap = {}
  for (const r of regioRows) {
    const regioId = r.RegioS.trim()
    if (!regioMap[regioId]) {
      regioMap[regioId] = { huidig: null, vorig: null }
    }
    
    if (r.Perioden.trim() === laatstePeriodeRegio) {
      regioMap[regioId].huidig = r
    } else if (r.Perioden.trim() === vorigJaarPeriodeRegio) {
      regioMap[regioId].vorig = r
    }
  }

  const regios = Object.entries(regioMap)
    .map(([regioId, data]) => {
      const h = data.huidig
      const v = data.vorig

      if (!h) return null // Geen actuele data

      const totaal = h.TotDeAOWLeeftijd_2 ?? 0
      const arbeidsongeschikt = h.ArbeidsongeschiktheidTotaal_8 ?? 0
      const populatie = bevolkingMap[`${laatstePeriodeRegio}_${regioId}`] || 0
      const bijstand = h.BijstandTotDeAOWLeeftijd_7 ?? 0
      const ww = h.Werkloosheid_4 ?? 0
      
      const ratio = (val) => populatie ? Math.round((val / populatie) * 10000) / 10 : 0

      // YoY berekenen
      let totaalYoY = 0
      if (v && v.TotDeAOWLeeftijd_2) {
        totaalYoY = ((totaal - v.TotDeAOWLeeftijd_2) / v.TotDeAOWLeeftijd_2) * 100
      }

      return {
        regio: PROVINCIES[regioId] ?? regioId,
        totaal,
        totaalYoY: Math.round(totaalYoY * 10) / 10, // Afronden op 1 decimaal
        per1000: ratio(totaal),
        bijstand,
        bijstandPer1000: ratio(bijstand),
        ww,
        wwPer1000: ratio(ww),
        arbeidsongeschikt,
        aoPer1000: ratio(arbeidsongeschikt),
        wajong: h.WajongUitkering_11 ?? 0,
        aandeelAO: totaal ? Math.round((arbeidsongeschikt / totaal) * 100) : 0,
      }
    })
    .filter(Boolean)
    .filter((r) => r.totaal > 0)

  const data = { peilmaandRegio, regios }

  const dest = path.join(__dirname, '../public/data.json')
  fs.writeFileSync(dest, JSON.stringify(data, null, 2))
  
  // Optioneel: gooi raw-data.json weg als je die niet in je build map wilt hebben
  // fs.unlinkSync(source)

  console.log(`✅ Transform: Data succesvol berekend en opgeslagen in ${dest}`)
}

transformData()

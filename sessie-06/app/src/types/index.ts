export type Richting = 'goed' | 'slecht'

export interface Kpi {
  id: string
  label: string
  waarde: number
  eenheid: string
  vorigePeriode: number
  richting: Richting
  toelichting: string
}

export interface TrendPunt {
  maand: string
  bijstand: number
  ww: number
  wajong: number
  wia: number
  wao: number
}

export interface Verdeling {
  naam: string
  aantal: number
  kleur: string
}

export interface FlowPunt {
  kwartaal: string
  instroom: number
  uitstroom: number
}

export interface RegioRij {
  regio: string
  totaal: number
  per1000: number
  bijstand: number
  bijstandPer1000: number
  ww: number
  wwPer1000: number
  arbeidsongeschikt: number
  aoPer1000: number
  wajong: number
  aandeelAO: number
}

export interface Signaal {
  id: string
  niveau: 'kans' | 'aandacht' | 'urgent'
  titel: string
  beschrijving: string
  regio: string
  actie: string
}

export interface DashboardData {
  peilmaandSoort: string
  peilmaandRegio: string
  peilkwartaalFlow: string
  kpis: Kpi[]
  trend: TrendPunt[]
  bijstandFlow: FlowPunt[]
  soortVerdeling: Verdeling[]
  aoRegeling: Verdeling[]
  regios: RegioRij[]
  signalen: Signaal[]
}

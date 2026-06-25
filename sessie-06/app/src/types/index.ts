export interface RegioData {
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

export interface DashboardData {
  peilmaandRegio: string
  regios: RegioData[]
}

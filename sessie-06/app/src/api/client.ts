import type { DashboardData } from '../types'

export async function haalDashboardData(): Promise<DashboardData> {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const fetchUrl = `${baseUrl}data.json`.replace('//', '/')
  const res = await fetch(fetchUrl)
  if (!res.ok) {
    throw new Error('Kan data.json niet inladen. Heb je `npm run update-data` gedraaid?')
  }
  return res.json()
}

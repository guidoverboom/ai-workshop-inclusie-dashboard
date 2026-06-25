import type { DashboardData } from '../types'

export async function haalDashboardData(): Promise<DashboardData> {
  const res = await fetch('/data.json')
  if (!res.ok) {
    throw new Error('Kan data.json niet inladen. Heb je `npm run update-data` gedraaid?')
  }
  return res.json()
}

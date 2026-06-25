import { useState, useEffect } from 'react'
import type { DashboardData } from '../types'
import { haalDashboardData } from '../api/client'

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    haalDashboardData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { data, error, loading }
}

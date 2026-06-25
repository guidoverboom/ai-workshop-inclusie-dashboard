import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { RegioData } from '../../types'

interface VergelijkingsGrafiekProps {
  geselecteerdeRegioIds: string[]
  alleRegios: RegioData[]
}

const COLORS = [
  '#4f46e5', // Indigo 600
  '#ea580c', // Orange 600
  '#16a34a', // Green 600
  '#dc2626', // Red 600
  '#9333ea', // Purple 600
  '#0284c7', // Sky 600
  '#ca8a04', // Yellow 600
  '#db2777', // Pink 600
  '#0d9488', // Teal 600
  '#4f46e5',
  '#ea580c',
]

export function VergelijkingsGrafiek({ geselecteerdeRegioIds, alleRegios }: VergelijkingsGrafiekProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fout, setFout] = useState<string | null>(null)

  useEffect(() => {
    if (geselecteerdeRegioIds.length === 0) {
      setData([])
      return
    }

    setLoading(true)
    setFout(null)

    const baseUrl = import.meta.env.BASE_URL || '/'
    
    // Ophalen van alle benodigde JSON bestanden
    const fetches = geselecteerdeRegioIds.map(id => 
      fetch(`${baseUrl}historie/${id}.json`.replace('//', '/'))
        .then(res => {
          if (!res.ok) throw new Error(`Netwerkfout bij ${id}`)
          return res.json()
        })
        .then(json => ({ id, data: json }))
    )

    Promise.all(fetches)
      .then(results => {
        // We moeten de data samenvoegen per 'maand'
        const mergedData: Record<string, any> = {}
        
        results.forEach(result => {
          result.data.forEach((row: any) => {
            if (!mergedData[row.periode]) {
              mergedData[row.periode] = {
                periode: row.periode,
                maand: row.maand
              }
            }
            mergedData[row.periode][result.id] = row.per1000
          })
        })

        // Sorteer op periode (bijv 2021MM01)
        const sortedData = Object.values(mergedData).sort((a, b) => a.periode.localeCompare(b.periode))
        setData(sortedData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Fout bij ophalen vergelijkingsdata:', err)
        setFout('Kon historische data niet inladen.')
        setLoading(false)
      })
  }, [geselecteerdeRegioIds])

  if (geselecteerdeRegioIds.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
        <p className="text-slate-500">Vink een of meerdere provincies aan in de tabel om de trend te bekijken.</p>
      </div>
    )
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Sorteer payload van hoog naar laag voor leesbaarheid
      const sortedPayload = [...payload].sort((a, b) => b.value - a.value)
      
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-200 shadow-xl rounded-lg text-sm min-w-[200px]">
          <p className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2">{label}</p>
          <div className="space-y-1.5">
            {sortedPayload.map((entry: any) => {
              const regio = alleRegios.find(r => r.id === entry.dataKey)
              return (
                <div key={entry.dataKey} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span className={`text-slate-600 ${entry.dataKey === 'NL01' ? 'font-semibold' : ''}`}>
                      {regio?.regio || entry.dataKey}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {entry.value.toLocaleString('nl-NL', {minimumFractionDigits: 1})}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[450px]">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : fout ? (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
          <p>{fout}</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="maand" 
              tickFormatter={(val) => {
                if (val.startsWith('januari')) return val.split(' ')[1]
                return ''
              }}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              minTickGap={30}
            />
            <YAxis 
              domain={['auto', 'auto']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(val) => val.toLocaleString('nl-NL')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={(value) => {
                const regio = alleRegios.find(r => r.id === value)
                return <span className="text-slate-700 font-medium ml-1">{regio?.regio || value}</span>
              }}
            />
            
            {geselecteerdeRegioIds.map((id, index) => {
              const isNederland = id === 'NL01'
              const color = isNederland ? '#475569' : COLORS[index % COLORS.length]
              
              return (
                <Line 
                  key={id}
                  type="monotone" 
                  dataKey={id} 
                  stroke={color} 
                  strokeWidth={isNederland ? 3 : 2}
                  strokeDasharray={isNederland ? '5 5' : undefined}
                  dot={false}
                  activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

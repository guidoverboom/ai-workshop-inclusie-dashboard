import { useEffect, useState } from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  ReferenceArea
} from 'recharts'
import type { RegioData } from '../../types'

interface KwadrantenGrafiekProps {
  alleRegios: RegioData[]
}

interface ScatterData {
  id: string
  regio: string
  x: number // Trend (deltaLast - deltaFirst)
  y: number // Positie (deltaLast)
  firstDelta: number
  color: string
}

const COLORS = [
  '#4f46e5', '#ea580c', '#16a34a', '#dc2626', '#9333ea', 
  '#0284c7', '#ca8a04', '#db2777', '#0d9488', '#4f46e5', '#ea580c', '#16a34a'
]

export function KwadrantenGrafiek({ alleRegios }: KwadrantenGrafiekProps) {
  const [data, setData] = useState<ScatterData[]>([])
  const [loading, setLoading] = useState(false)
  const [fout, setFout] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setFout(null)

    const baseUrl = import.meta.env.BASE_URL || '/'
    const provincieIds = alleRegios.map(r => r.id).filter(id => id !== 'NL01')
    const idsToFetch = ['NL01', ...provincieIds]

    const fetches = idsToFetch.map(id =>
      fetch(`${baseUrl}historie/${id}.json`.replace('//', '/'))
        .then(res => {
          if (!res.ok) throw new Error(`Netwerkfout bij ${id}`)
          return res.json()
        })
        .then(json => ({ id, data: json }))
    )

    Promise.all(fetches)
      .then(results => {
        const nlResult = results.find(r => r.id === 'NL01')
        if (!nlResult) throw new Error("Nederland data ontbreekt")

        const nlData = nlResult.data
        const nlFirst = nlData[0].per1000
        const nlLast = nlData[nlData.length - 1].per1000

        const scatterData: ScatterData[] = []

        results.forEach((result, index) => {
          if (result.id === 'NL01') return

          const provData = result.data
          const provFirst = provData[0].per1000
          const provLast = provData[provData.length - 1].per1000

          const deltaFirst = provFirst - nlFirst
          const deltaLast = provLast - nlLast
          const trend = deltaLast - deltaFirst

          const regioInfo = alleRegios.find(r => r.id === result.id)

          scatterData.push({
            id: result.id,
            regio: regioInfo?.regio || result.id,
            x: Number(trend.toFixed(2)),
            y: Number(deltaLast.toFixed(2)),
            firstDelta: Number(deltaFirst.toFixed(2)),
            color: COLORS[(index - 1) % COLORS.length]
          })
        })

        setData(scatterData)
        setLoading(false)
      })
      .catch(err => {
        console.error('Fout bij ophalen data:', err)
        setFout('Kon historische data niet inladen voor de kwadranten.')
        setLoading(false)
      })
  }, [alleRegios])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as ScatterData
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-200 shadow-xl rounded-lg text-sm max-w-xs z-50 relative">
          <p className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dataPoint.color }}></span>
            {dataPoint.regio}
          </p>
          <div className="space-y-2">
            <div>
              <span className="text-slate-500 text-xs block uppercase tracking-wide">Huidige Positie (Y)</span>
              <span className={`font-semibold ${dataPoint.y > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {dataPoint.y > 0 ? '+' : ''}{dataPoint.y.toLocaleString('nl-NL')} per 1.000 inw.
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block uppercase tracking-wide">Trend sinds 2021 (X)</span>
              <span className={`font-semibold ${dataPoint.x > 0 ? 'text-orange-600' : 'text-blue-600'}`}>
                {dataPoint.x > 0 ? '+' : ''}{dataPoint.x.toLocaleString('nl-NL')} (t.o.v. NL gem.)
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, payload } = props
    const dx = payload.x > 0 ? 8 : -8
    const textAnchor = payload.x > 0 ? 'start' : 'end'
    return (
      <text x={cx + dx} y={cy} dy={4} textAnchor={textAnchor} fill="#334155" fontSize={12} fontWeight={600}>
        {payload.regio}
      </text>
    )
  }

  return (
    <div className="w-full h-[600px] relative">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : fout ? (
        <div className="flex flex-col items-center justify-center h-full text-red-500">
          <p>{fout}</p>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 pointer-events-none p-[60px] flex flex-col justify-between z-0">
            <div className="flex justify-between h-1/2">
              <div className="w-1/2 pl-12 pt-8">
                <span className="text-sm font-bold text-blue-500/50 uppercase tracking-widest">De Inhaalslagers</span>
                <p className="text-xs text-blue-500/40">Boven gemiddelde, dalende trend</p>
              </div>
              <div className="w-1/2 text-right pr-4 pt-8">
                <span className="text-sm font-bold text-red-500/50 uppercase tracking-widest">Structureel Belast</span>
                <p className="text-xs text-red-500/40">Boven gemiddelde, stijgende trend</p>
              </div>
            </div>
            <div className="flex justify-between h-1/2 items-end">
              <div className="w-1/2 pl-12 pb-16">
                <span className="text-sm font-bold text-emerald-500/50 uppercase tracking-widest">De Solide Basis</span>
                <p className="text-xs text-emerald-500/40">Onder gemiddelde, dalende trend</p>
              </div>
              <div className="w-1/2 text-right pr-4 pb-16">
                <span className="text-sm font-bold text-orange-500/50 uppercase tracking-widest">De Waakzamen</span>
                <p className="text-xs text-orange-500/40">Onder gemiddelde, stijgende trend</p>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="100%" className="relative z-10">
            <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              
              {/* Achtergrond kleuren */}
              <ReferenceArea x1={-15} x2={0} y1={0} y2={20} fill="#eff6ff" fillOpacity={0.6} /> 
              <ReferenceArea x1={0} x2={15} y1={0} y2={20} fill="#fef2f2" fillOpacity={0.6} /> 
              <ReferenceArea x1={-15} x2={0} y1={-20} y2={0} fill="#f0fdf4" fillOpacity={0.6} /> 
              <ReferenceArea x1={0} x2={15} y1={-20} y2={0} fill="#fff7ed" fillOpacity={0.6} /> 

              <ReferenceLine y={0} stroke="#475569" strokeWidth={2} />
              <ReferenceLine x={0} stroke="#475569" strokeWidth={2} />

              <XAxis 
                type="number" 
                dataKey="x" 
                name="Trend" 
                domain={[-15, 15]} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                label={{ value: '← Verbetert sneller dan NL gem. (Trend) Verslechtert sneller dan NL gem. →', position: 'bottom', offset: 20, fill: '#64748b', fontSize: 13, fontWeight: 500 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Positie" 
                domain={[-18, 18]} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Huidige positie t.o.v. NL Gemiddelde', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 13, fontWeight: 500, dy: 120, offset: 0 }}
              />
              
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              
              <Scatter data={data} label={renderCustomizedLabel}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  )
}

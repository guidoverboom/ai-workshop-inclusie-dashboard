import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface HistorieData {
  periode: string
  maand: string
  totaal: number
  per1000: number
}

interface ProvincieModalProps {
  regioId: string
  regioNaam: string
  onClose: () => void
}

export function ProvincieModal({ regioId, regioNaam, onClose }: ProvincieModalProps) {
  const [data, setData] = useState<HistorieData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/historie/${regioId}.json`)
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error('Fout bij ophalen historie:', err)
        setLoading(false)
      })
  }, [regioId])

  // Custom tooltip voor een schonere UI
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-md text-sm">
          <p className="font-semibold text-slate-800 mb-1">{label}</p>
          <p className="text-slate-600">
            Uitkeringen: <span className="font-medium text-slate-900">{payload[0].payload.totaal.toLocaleString('nl-NL')}</span>
          </p>
          <p className="text-slate-600">
            Per 1.000 inw: <span className="font-medium text-slate-900">{payload[0].value.toLocaleString('nl-NL', {minimumFractionDigits: 1})}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{regioNaam}</h2>
            <p className="text-sm text-slate-500">Ontwikkeling uitkeringen per 1.000 inwoners (afgelopen 5 jaar)</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="maand" 
                    tickFormatter={(val) => {
                      // Simpele formatter: alleen het jaartal tonen als het januari is, of anders leeg (voorkomt overlap)
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
                  <Line 
                    type="monotone" 
                    dataKey="per1000" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import type { RegioData } from '../../types'

type Kolom = 'regio' | 'totaal' | 'per1000' | 'bijstand' | 'bijstandPer1000' | 'ww' | 'wwPer1000' | 'arbeidsongeschikt' | 'aoPer1000' | 'aandeelAO'

interface RegioTabelProps {
  data: RegioData[]
  geselecteerdeRegios?: string[]
  onToggleRegio?: (id: string) => void
  variant?: 'totaal' | 'ww' | 'ao'
}

export function RegioTabel({ 
  data, 
  geselecteerdeRegios = [], 
  onToggleRegio,
  variant = 'totaal'
}: RegioTabelProps) {
  // Standaard sortering is afhankelijk van de variant
  const defaultSort: Kolom = variant === 'ww' ? 'ww' : variant === 'ao' ? 'arbeidsongeschikt' : 'totaal'
  const [sortKey, setSortKey] = useState<Kolom>(defaultSort)
  const [asc, setAsc] = useState(false)

  const rijen = useMemo(() => {
    return [...data].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)
      return asc ? cmp : -cmp
    })
  }, [data, sortKey, asc])

  const sorteer = (k: Kolom) => {
    if (k === sortKey) setAsc(!asc)
    else {
      setSortKey(k)
      setAsc(false)
    }
  }

  const Th = ({ k, label, rechts }: { k: Kolom; label: string; rechts?: boolean }) => (
    <th
      onClick={() => sorteer(k)}
      className={`cursor-pointer select-none px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-rijk-600 ${
        rechts ? 'text-right' : 'text-left'
      }`}
    >
      {label} {sortKey === k ? (asc ? '▲' : '▼') : ''}
    </th>
  )

  const getal = (n: number) => n.toLocaleString('nl-NL')

  const isTotaal = variant === 'totaal'
  const isWW = variant === 'ww'
  const isAO = variant === 'ao'

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {isTotaal && <th className="w-8 px-2 py-2"></th>}
            <Th k="regio" label="Provincie" />
            
            {isTotaal && (
              <>
                <Th k="totaal" label="Uitkeringen (< AOW)" rechts />
                <Th k="per1000" label="Per 1.000 inw." rechts />
                <Th k="bijstand" label="Bijstand" rechts />
                <Th k="bijstandPer1000" label="/ 1.000 inw." rechts />
              </>
            )}

            {isWW && (
              <>
                <Th k="ww" label="WW" rechts />
                <Th k="wwPer1000" label="/ 1.000 inw." rechts />
              </>
            )}

            {isAO && (
              <>
                <Th k="arbeidsongeschikt" label="Arbeidsongeschikt" rechts />
                <Th k="aoPer1000" label="/ 1.000 inw." rechts />
                <Th k="aandeelAO" label="Aandeel AO" rechts />
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {rijen.map((r) => {
            const isChecked = geselecteerdeRegios.includes(r.id)
            
            return (
              <tr
                key={r.regio}
                onClick={() => isTotaal && onToggleRegio && onToggleRegio(r.id)}
                className={`border-b group transition-colors ${
                  isTotaal ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/40'
                } ${isTotaal && isChecked ? 'bg-indigo-50/60' : ''} ${
                  r.regio === 'Heel Nederland' ? 'border-slate-300 shadow-sm z-10 relative bg-slate-50/50' : 'border-slate-100'
                }`}
              >
                {isTotaal && (
                  <td className="px-2 py-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => {}} // afgehandeld via tr onClick
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer pointer-events-none"
                    />
                  </td>
                )}
                <td className={`px-3 py-3 text-slate-800 ${r.regio === 'Heel Nederland' ? 'font-bold' : 'font-medium'}`}>
                  {r.regio}
                </td>
                
                {isTotaal && (
                  <>
                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <span className="tabular-nums text-slate-600">{getal(r.totaal)}</span>
                        {r.totaalYoY !== 0 && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-semibold ${
                            r.totaalYoY > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {r.totaalYoY > 0 ? '+' : ''}{r.totaalYoY.toLocaleString('nl-NL', {minimumFractionDigits: 1})}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-500 bg-slate-50/50">{r.per1000 > 0 ? r.per1000.toLocaleString('nl-NL', {minimumFractionDigits: 1}) : '-'}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">{getal(r.bijstand)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-500 bg-slate-50/50">{r.bijstandPer1000 > 0 ? r.bijstandPer1000.toLocaleString('nl-NL', {minimumFractionDigits: 1}) : '-'}</td>
                  </>
                )}

                {isWW && (
                  <>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">{getal(r.ww)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-500 bg-slate-50/50">{r.wwPer1000 > 0 ? r.wwPer1000.toLocaleString('nl-NL', {minimumFractionDigits: 1}) : '-'}</td>
                  </>
                )}

                {isAO && (
                  <>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-600">{getal(r.arbeidsongeschikt)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-500 bg-slate-50/50">{r.aoPer1000 > 0 ? r.aoPer1000.toLocaleString('nl-NL', {minimumFractionDigits: 1}) : '-'}</td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          r.aandeelAO >= 55
                            ? 'bg-red-100 text-red-700'
                            : r.aandeelAO >= 45
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {r.aandeelAO}%
                      </span>
                    </td>
                  </>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
      {isAO && (
        <p className="mt-3 text-xs text-slate-400">
          “Aandeel AO” = deel van de uitkeringen (&lt; AOW-leeftijd) dat een
          arbeidsongeschiktheidsuitkering is. Kleur: groen &lt; 45%, oranje 45–54%, rood ≥ 55%.
        </p>
      )}
    </div>
  )
}

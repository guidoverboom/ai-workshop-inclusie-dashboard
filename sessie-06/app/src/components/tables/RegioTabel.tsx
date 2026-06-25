import { useMemo, useState } from 'react'
import type { RegioRij } from '../../types'

type Kolom = 'regio' | 'totaal' | 'per1000' | 'bijstand' | 'bijstandPer1000' | 'ww' | 'wwPer1000' | 'arbeidsongeschikt' | 'aoPer1000' | 'aandeelAO'

export function RegioTabel({ data }: { data: RegioRij[] }) {
  const [sortKey, setSortKey] = useState<Kolom>('totaal')
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <Th k="regio" label="Provincie" />
            <Th k="totaal" label="Uitkeringen (< AOW)" rechts />
            <Th k="per1000" label="Per 1.000 inw." rechts />
            <Th k="bijstand" label="Bijstand" rechts />
            <Th k="bijstandPer1000" label="/ 1.000 inw." rechts />
            <Th k="ww" label="WW" rechts />
            <Th k="wwPer1000" label="/ 1.000 inw." rechts />
            <Th k="arbeidsongeschikt" label="Arbeidsongeschikt" rechts />
            <Th k="aoPer1000" label="/ 1.000 inw." rechts />
            <Th k="aandeelAO" label="Aandeel AO" rechts />
          </tr>
        </thead>
        <tbody>
          {rijen.map((r) => (
            <tr
              key={r.regio}
              className={`border-b hover:bg-slate-50 ${
                r.regio === 'Heel Nederland' ? 'bg-slate-100/80 border-slate-300 shadow-sm z-10 relative' : 'border-slate-100'
              }`}
            >
              <td className={`px-3 py-3 text-slate-800 ${r.regio === 'Heel Nederland' ? 'font-bold' : 'font-medium'}`}>
                {r.regio}
              </td>
              <td className="px-3 py-3 text-right tabular-nums text-slate-600">{getal(r.totaal)}</td>
              <td className="px-3 py-3 text-right tabular-nums text-slate-500 bg-slate-50/50">{r.per1000 > 0 ? r.per1000.toLocaleString('nl-NL', {minimumFractionDigits: 1}) : '-'}</td>
              <td className="px-3 py-3 text-right tabular-nums text-slate-600">{getal(r.bijstand)}</td>
              <td className="px-3 py-3 text-right tabular-nums text-slate-500 bg-slate-50/50">{r.bijstandPer1000 > 0 ? r.bijstandPer1000.toLocaleString('nl-NL', {minimumFractionDigits: 1}) : '-'}</td>
              <td className="px-3 py-3 text-right tabular-nums text-slate-600">{getal(r.ww)}</td>
              <td className="px-3 py-3 text-right tabular-nums text-slate-500 bg-slate-50/50">{r.wwPer1000 > 0 ? r.wwPer1000.toLocaleString('nl-NL', {minimumFractionDigits: 1}) : '-'}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-slate-400">
        “Aandeel AO” = deel van de uitkeringen (&lt; AOW-leeftijd) dat een
        arbeidsongeschiktheidsuitkering is. Kleur: groen &lt; 45%, oranje 45–54%, rood ≥ 55%.
      </p>
    </div>
  )
}

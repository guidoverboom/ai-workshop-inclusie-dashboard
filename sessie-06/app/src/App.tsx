import { useState } from 'react'
import { useDashboardData } from './hooks/useDashboardData'
import { RegioTabel } from './components/tables/RegioTabel'
import { VergelijkingsGrafiek } from './components/charts/VergelijkingsGrafiek'

function App() {
  const { data, error, loading } = useDashboardData()
  const fout = error ? error.message : null
  const [geselecteerdeRegios, setGeselecteerdeRegios] = useState<string[]>(['NL01'])

  const toggleRegio = (id: string) => {
    setGeselecteerdeRegios(prev => {
      if (prev.includes(id)) {
        return prev.filter(r => r !== id)
      }
      // Limiteer tot max 5 lijnen voor leesbaarheid, behalve als het NL01 is
      if (prev.length >= 5 && !prev.includes(id)) {
        return [...prev.slice(1), id]
      }
      return [...prev, id]
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-rijk-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-rijk-100">
                Live CBS-cijfers
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Regionaal Dashboard Inclusieve Arbeidsmarkt
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-rijk-100">
                Aantal uitkeringen tot de AOW-leeftijd per provincie, inclusief
                verhouding per 1.000 inwoners.
              </p>
            </div>
            {data && (
              <div className="text-right text-sm text-rijk-100">
                <div className="rounded-lg bg-rijk-600 px-3 py-2">
                  <div className="text-xs uppercase tracking-wide">Peilmaand</div>
                  <div className="text-base font-semibold text-white">
                    {data.peilmaandRegio}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {fout && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-semibold">Kon de CBS-cijfers niet ophalen</p>
            <p className="mt-1 text-sm">{fout}</p>
            <p className="mt-1 text-sm">Controleer de internetverbinding en herlaad de pagina.</p>
          </div>
        )}

        {loading && !fout && <Laadscherm />}

        {data && (
          <>
            <section className="mb-8">
              <Card
                title="Historische Ontwikkeling"
                subtitle="Vergelijk de uitkeringen per 1.000 inwoners over de afgelopen 5 jaar. Vink regio's aan in de tabel hieronder."
              >
                <VergelijkingsGrafiek geselecteerdeRegioIds={geselecteerdeRegios} alleRegios={data.regios} />
              </Card>
            </section>

            <section>
              <Card
                title="Actueel Overzicht per Provincie"
                subtitle={`Uitkeringen tot AOW-leeftijd · ${data.peilmaandRegio} · CBS 80794ned — klik op een checkbox om toe te voegen aan de grafiek`}
              >
                <RegioTabel 
                  data={data.regios} 
                  geselecteerdeRegios={geselecteerdeRegios} 
                  onToggleRegio={toggleRegio} 
                />
              </Card>
            </section>

            <footer className="pb-8 pt-2 text-center text-xs text-slate-400">
              Live data: CBS StatLine Open Data (tabel 80794ned) ·
              Vite + React + Tailwind + Recharts
            </footer>
          </>
        )}
      </main>
    </div>
  )
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Laadscherm() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-rijk-500" />
      <p className="text-sm">Actuele cijfers ophalen bij CBS StatLine…</p>
    </div>
  )
}

export default App

import { useState } from 'react'
import { useDashboardData } from './hooks/useDashboardData'
import { RegioTabel } from './components/tables/RegioTabel'
import { VergelijkingsGrafiek } from './components/charts/VergelijkingsGrafiek'
import { KwadrantenGrafiek } from './components/charts/KwadrantenGrafiek'

function App() {
  const { data, error, loading } = useDashboardData()
  const fout = error ? error.message : null
  const [geselecteerdeRegios, setGeselecteerdeRegios] = useState<string[]>(['NL01'])

  const toggleRegio = (id: string) => {
    setGeselecteerdeRegios(prev => {
      if (prev.includes(id)) {
        return prev.filter(r => r !== id)
      }
      return [...prev, id]
    })
  }

  const selecteerAlles = () => {
    if (data) setGeselecteerdeRegios(data.regios.map(r => r.id))
  }

  const deselecteerAlles = () => {
    setGeselecteerdeRegios([])
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

        {/* Loading screen omitted for brevity */}
        {loading && !fout && (
          <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-sm text-slate-500">CBS-data ophalen...</p>
            </div>
          </div>
        )}

        {data && (
          <>
            <section className="mb-8">
              <Card
                title="Historische Ontwikkeling (Totale Uitkeringen)"
                subtitle="Vergelijk de totale uitkeringen per 1.000 inwoners over de afgelopen 5 jaar. Vink regio's aan in de Algemene Tabel hieronder."
              >
                <VergelijkingsGrafiek geselecteerdeRegioIds={geselecteerdeRegios} alleRegios={data.regios} />
              </Card>
            </section>

            <section className="space-y-6">
              <Card
                title="Algemeen & Bijstand"
                subtitle={`Totale uitkeringen en bijstand · ${data.peilmaandRegio} · CBS 80794ned`}
                action={
                  <div className="flex gap-2">
                    <button 
                      onClick={selecteerAlles}
                      className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                    >
                      Selecteer Alles
                    </button>
                    <button 
                      onClick={deselecteerAlles}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      Deselecteer Alles
                    </button>
                  </div>
                }
              >
                <RegioTabel 
                  variant="totaal"
                  data={data.regios} 
                  geselecteerdeRegios={geselecteerdeRegios} 
                  onToggleRegio={toggleRegio} 
                />
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card
                  title="Werkloosheidswet (WW)"
                  subtitle="Aantal lopende WW-uitkeringen"
                >
                  <RegioTabel 
                    variant="ww"
                    data={data.regios} 
                  />
                </Card>

                <Card
                  title="Arbeidsongeschiktheid (AO)"
                  subtitle="WAO, WIA, WAZ, Wajong"
                >
                  <RegioTabel 
                    variant="ao"
                    data={data.regios} 
                  />
                </Card>
              </div>
            </section>

            {/* Nieuwe sectie: Diepgaande Analyse */}
            <section className="mt-8 pt-6 border-t border-slate-200">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">Diepgaande Analyse: Socioloog & Demograaf</h2>
                <p className="text-sm text-slate-600 mt-1 max-w-3xl">
                  In deze kwadrantengrafiek verdelen we de provincies op basis van hun structurele positie en hun trend sinds 2021. 
                  Staat een stipje hoog? Dan heeft die provincie veel uitkeringen. Staat een stipje ver naar rechts? Dan verslechtert de situatie sneller dan gemiddeld.
                </p>
              </div>
              <Card
                title="Kwadrantenanalyse van de Inclusieve Arbeidsmarkt"
                subtitle="Elke stip is een provincie. De Y-as is de huidige positie ten opzichte van het landelijk gemiddelde. De X-as toont de ontwikkeling (trend) sinds begin 2021."
              >
                <KwadrantenGrafiek alleRegios={data.regios} />
              </Card>
            </section>

            <footer className="pb-8 pt-8 text-center text-xs text-slate-400">
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
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  )
}

export default App

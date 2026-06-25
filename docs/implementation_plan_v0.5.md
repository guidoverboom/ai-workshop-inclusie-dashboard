# Multi-Provincie Vergelijkingsdashboard (v0.5)

De Product Owner heeft verzocht de grafiek centraal bovenaan de pagina te plaatsen, en de Waardeduider heeft hier teamconsensus voor bereikt (zie `docs/debat_waarden_expert.md`). We integreren de historische trend niet meer in een weggestopte modal, maar maken het het hoofd-narratief bovenaan de pagina, met behoud van cognitieve rust.

## User Review Required

> [!IMPORTANT]
> Dit is een substantiële aanpassing van de architectuur van de interface. De tabel krijgt selectievakjes en de modal verdwijnt volledig. Ben je het eens met de onderstaande technische stappen?

## Proposed Changes

We gaan de applicatiestructuur (in `App.tsx`) omdraaien: een grote grafiek bovenaan, en de detail-tabel eronder.

### 1. VergelijkingsGrafiek.tsx (Nieuwe Component)
- We verwijderen de `ProvincieModal.tsx`.
- We creëren een nieuwe component `VergelijkingsGrafiek.tsx` die bovenaan in `App.tsx` wordt geplaatst.
- Deze component krijgt een array van `geselecteerdeRegioIds` als input.
- Hij haalt asynchroon (via `Promise.all`) de historische bestanden (`/historie/[ID].json`) op voor alle geselecteerde regio's.
- De data wordt samengevoegd in een array die Recharts begrijpt (bijv. `{ maand: "jan 2021", "NL01": 78.8, "PV20": 91.2 }`).
- We genereren dynamisch meerdere `<Line />` elementen, elk met een eigen Tailwind-kleur voor visueel onderscheid. "Heel Nederland" krijgt een opvallende, dikke grijze stippellijn.

### 2. Statusbeheer in App.tsx
- We voegen state toe aan `App.tsx`: `const [geselecteerdeRegios, setGeselecteerdeRegios] = useState<string[]>(['NL01'])`. 
- Hierdoor start de applicatie rustig (Cognitieve Rust) met enkel de landelijke trend.

### 3. RegioTabel.tsx Aanpassen
- De tabel krijgt aan de linkerkant (of door de hele rij klikbaar te maken) een "Aan/Uit" status. We kunnen hiervoor een visuele checkbox toevoegen.
- Wanneer een gebruiker een provincie aanklikt, voegt dit de provincie toe aan de grafiek (of verwijdert het deze).
- De tabel dient als het bedieningspaneel ("Keuzevrijheid en Eigenaarschap") voor de grafiek daarboven.

### Bestandsaanpassingen samengevat

#### [DELETE] src/components/modals/ProvincieModal.tsx
#### [NEW] src/components/charts/VergelijkingsGrafiek.tsx
#### [MODIFY] src/App.tsx
#### [MODIFY] src/components/tables/RegioTabel.tsx

## Verification Plan

### Manual Verification
1. Open het dashboard. Bovenin staat direct een grafiek, met enkel "Heel Nederland" geplot.
2. De tabel eronder bevat selectievakjes (of klikbare rijen met duidelijke actieve statussen). "Heel Nederland" is standaard aangevinkt.
3. Klik op "Gelderland" in de tabel. De grafiek update onmiddellijk en voegt een blauwe lijn toe.
4. Klik op "Groningen". Er verschijnt direct een tweede, gekleurde provincielijn.
5. Klik nogmaals op "Gelderland" en de lijn verdwijnt weer uit de grafiek.

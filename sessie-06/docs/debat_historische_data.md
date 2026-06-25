# 💬 Gezamenlijk Gesprek: Historische Data Toevoegen?

**Onderwerp:** De wens om historische data toe te voegen aan het (momenteel zeer gestripte v0.2) Inclusie Dashboard.
**Proces:** De vier expertrollen hebben de vraag eerst individueel onderzocht en komen nu samen in een overleg om tot consensus te komen.

---

## 1. Individuele Evaluaties (Logische Volgorde)

### 📖 De Verhalenverteller (Waarom willen we dit?)
"We hebben v0.2 gestript tot een pure momentopname. Dat is clean, maar we missen nu de context van *beweging*. Als de gemeente Groningen 50 uitkeringen per 1.000 inwoners heeft, is dat dan goed of slecht? We kunnen die vraag pas beantwoorden als we weten of dat cijfer daalt of stijgt ten opzichte van vorig jaar. Historische data is dus cruciaal voor een sterk narratief en om beleidsmakers 'in actie' te laten komen."

### 📊 De Data Analist (Is het meetbaar?)
"Ja, CBS tabel `80794ned` heeft data op jaar- en maandniveau. We kunnen probleemloos terugkijken naar 2015. Echter, de wet- en regelgeving (zoals de introductie van de Participatiewet in 2015) maakt dat we niet alles 1-op-1 kunnen vergelijken over 10 jaar. Mijn advies is om alleen *Year-over-Year (YoY)* (het huidige moment vs. exact 12 maanden geleden) of *Month-over-Month (MoM)* te berekenen, zodat we seizoensinvloeden uitsluiten."

### 🏗️ De Architect (Is het bouwbaar?)
"Technische waarschuwing! Onze huidige v0.2 pipeline is bliksemsnel omdat `fetch-data.js` maar 1 momentopname ophaalt. Als we voor 12 provincies 120 maanden aan data gaan inladen, explodeert onze `data.json` van 5 kilobyte naar 5 megabyte. Dat gaat ten koste van de laadtijd en de SPA architectuur. We moeten voorkomen dat de React frontend traag wordt door het in het geheugen moeten filteren van honderden json-objecten."

### 🎨 De UX Specialist (Is het bruikbaar?)
"De huidige `RegioTabel` is heerlijk rustig. Als we 12 maanden aan historie tonen per provincie in de tabel, wordt het een onleesbare muur van getallen. We zouden een *sparkline* (mini-grafiekje in de tabelrij) kunnen gebruiken, maar zelfs dat maakt de tabel erg druk op mobiel."

---

## 2. Gezamenlijk Overleg & Het Debat

**UX Specialist:** "Ik stel voor dat we een simpele toggle-knop ('Toon trend') bovenaan zetten die de huidige getallen vervangt door percentages."
**Verhalenverteller:** "Nee, de kracht is juist dat je het áántal en de trénd tegelijk ziet. Anders moet je de hele tijd heen en weer klikken om het verhaal te snappen."
**Architect:** "Een sparkline grafiek in elke tabelrij betekent dat we per cel 12 datapunten nodig hebben. Dat vertienvoudigt de data.json grootte. Waarom doen we de berekening niet alvast in `fetch-data.js` in de backend?"
**Data Analist:** "Dat is briljant. `fetch-data.js` kan 13 maanden aan data ophalen bij het CBS, berekent vervolgens zelf het verschil tussen 'nu' en 'precies één jaar geleden' (YoY), en gooit de resterende 11 maanden van de historische data gewoon weg vóórdat `data.json` gemaakt wordt!"
**UX Specialist:** "Als we alleen het percentage hebben, kan ik dat mooi en onopvallend direct náást het ruwe getal zetten in de cel. Bijvoorbeeld: **1.240** `(+2.1%)` in een klein groen of rood lettertype."

---

## 3. Consensus & Besluit

Het expertteam bereikt unaniem de volgende consensus over de architectuur en het design voor de volgende iteratie (v0.3):

✅ **Conclusie:** We voegen **geen interactieve historische grafieken of sparklines** toe. We voegen uitsluitend een **Year-over-Year (YoY)** %-verschil toe aan de huidige tabel.

**Concrete Taakverdeling:**
1. **Architect:** Past `fetch-data.js` aan zodat deze 2 specifieke periodes ophaalt (actueel en -12 maanden). De 12 maanden ertussen worden genegeerd om `data.json` minuscuul te houden.
2. **Data Analist:** Definieert de exacte berekening: `((Waarde Nu - Waarde Vorig Jaar) / Waarde Vorig Jaar) * 100`.
3. **UX Specialist:** Ontwerpt een kleine badge in de tabelcellen om het %-verschil te tonen (met toegankelijk groen/rood voor respectievelijk een daling/stijging van uitkeringen).
4. **Verhalenverteller:** Verwerkt deze beslissing in `VERHAALLIJN.md` als "De Trend-Context" waarmee gemeenten kunnen zien of beleid lijkt te werken.

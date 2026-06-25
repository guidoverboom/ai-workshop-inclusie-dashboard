# Gebruikerslog (UX)

## Datum: 25 Juni 2026

**Observatie:**
- De gebruiker klikt op een provincie in de hoofd-tabel (bijv. Gelderland).
- Een modal opent over het scherm heen met de correcte titel en subtitel ("Ontwikkeling uitkeringen per 1.000 inwoners").
- **Probleem:** De ruimte waar de grafiek hoort te staan is een volledig wit vlak. Geen grafiek, geen laad-icoon, geen foutmelding.
- **Ervaring:** "Het zijn nu heel veel cijfers. Ik klik op een provincie en krijg een wit veld." Dit zorgt voor frustratie en verlies van vertrouwen in de applicatie.

**Oorzaak:**
- Een conflict tussen de CSS flexbox eigenschappen van Tailwind (`flex-1`) en de manier waarop de `ResponsiveContainer` van Recharts zijn hoogte berekent. Hierdoor kreeg de container een hoogte van 0 pixels, waardoor de grafiek onzichtbaar werd.

**Oplossing:**
- De flexbox styling rondom de grafiek is verwijderd en vervangen door een expliciete hardcoded hoogte (`h-[400px]`). Dit dwingt de browser en Recharts om de grafiek exact 400 pixels hoog te renderen, ongeacht de flex-layout van het ouderelement.

---

## Overweging Waardeduider: "Datadissonantie" (v0.6)
**Context:** De gebruiker wil alle limieten van de grafiek verwijderen en de tabel opsplitsen in losse tabellen voor WW en AO.
**Afweging:** 
- Het weghalen van limieten versterkt de **Autonomie** van de gebruiker (alles kunnen zien).
- Het splitsen van de tabellen bevordert de **Cognitieve Rust** en **Focus**.
- **Cruciaal ethisch conflict (Datadissonantie):** De vergelijkingsgrafiek toont uitsluitend de *totale* uitkeringen (gebrek aan specifieke CBS historie voor WW/AO). Als we interactieve checkboxes plaatsen in een "WW-tabel" om de grafiek te besturen, suggereren we onterecht dat de grafiek de historische WW-trend toont. Dit schendt de waarde **Betrouwbaarheid**.
**Besluit:** Om misleiding te voorkomen, plaatsen we interactieve checkboxes ("Selecteer alles" / "Deselecteer alles" en rij-selecties) uitsluitend in de Algemene "Totaal" tabel. De WW- en AO-tabellen fungeren als rustige, pure leesweergaves zonder besturingselementen.

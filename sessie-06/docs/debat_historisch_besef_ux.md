# 💬 Gezamenlijk Gesprek: Meer Historisch Besef (Geleid door UX & Waardeduider)

**Onderwerp:** Hoe brengen we méér historisch besef in het Inclusie Dashboard, voorbij de simpele Year-over-Year badge, zónder de rustige v0.3 UI te verstoren?
**Proces:** De vijf expertrollen komen samen onder leiding van de UX Specialist en de kersverse Waardeduider.

---

## 1. Introductie van het Dilemma

**UX Specialist:** "Iedereen is blij met de v0.3 update. De provincietabel is super clean en de kleine groene/rode procent-badges geven direct een beetje context. Maar de Verhalenverteller gaf gisteren aan dat we de échte lange-termijn trend missen. Een daling van 2% is leuk, maar als dat na 5 jaar van stijgingen komt, is het verhaal compleet anders. We hebben meer tabellen en grafieken nodig, maar ik weiger de hoofdpagina te overladen."

**Verhalenverteller:** "Precies. De hoofdpagina is nu een perfecte momentopname, maar ik wil dat een beleidsmaker kan inzoomen. Ik wil een grafiek zien van de afgelopen 5 jaar per provincie."

---

## 2. Het Debat: Hoe en Wat?

**Architect:** "Een grafiek met 60 maanden historie voor 12 provincies betekent dat onze payload massaal groeit. Als we dat in de initiële pageload stoppen, gaat de performance omlaag. Dat druist in tegen onze architectuurprincipes."

**Data Analist:** "De data is wél beschikbaar. Het CBS script kan 60 periodes inlezen, dat duurt hooguit 2 seconden tijdens de build (`npm run update-data`)."

**Waardeduider:** "Wacht even, laten we een stap terug doen. *Wat* is de waarde die we hier nastreven? 
1. Het doel is **lokale verdieping** (Waarom werkt het beleid hier wel/niet?). 
2. De voorwaarde is **toegankelijkheid** (De UX mag niet overweldigend zijn). 
Dus het *hoe* moet zijn: de gebruiker kiest zelf wanneer hij de diepte in gaat. Het mag geen opgedrongen informatie zijn."

**UX Specialist:** "Mooi! Wat als we de rijen in de hoofdtabel klikbaar maken? Als je op 'Groningen' klikt, schuift er een elegant 'Provincie Profiel' paneel open (of een modal). Alleen dáár tonen we een gedetailleerde interactieve lijngrafiek (5 jaar historie) en wellicht een tabelletje met de instroom/uitstroom balans."

**Architect:** "Ah! Dat lost mijn probleem ook op. Tijdens het bouwen (`2-transform.js`) genereren we de grote `data.json` met alleen de hoofdtabel-data (zodat de pageload 1 milliseconde blijft). Daarnaast genereren we 12 losse JSON bestandjes: `historie-groningen.json`, `historie-drenthe.json`, etc. Als de gebruiker op Groningen klikt, laadt de browser op de achtergrond razendsnel dat specifieke bestand in."

**Data Analist:** "Dat is heel strak. Ik zorg dan dat de historische JSON uitsluitend de geaggregeerde ratio's (per 1.000 inwoners) bevat, zodat de grafiek-bibliotheek in React er direct een vloeiende lijn van kan tekenen."

---

## 3. Consensus & Besluit

Het vijfkoppige expertteam is unaniem akkoord. Ze slagen erin om extra tabellen en grafieken toe te voegen en de maatschappelijke waarde (context en verdieping) te vergroten, zonder de technische performance en visuele rust te beschadigen.

✅ **Conclusie:** We introduceren een **"Provincie Profiel Modal"** in de UI met een 5-jaar trendgrafiek.

**Concrete Taakverdeling (Iteratie v0.4):**
1. **Waardeduider:** Bewaakt tijdens de bouw of de getoonde trends daadwerkelijk helpen om regionaal beleid te evalueren (zijn de assen eerlijk? Is er geen misleidende uitsnede?).
2. **Architect:** Breidt de Node.js data pipeline uit zodat hij, naast de hoofd-JSON, ook 12 losse 'deep-dive' JSON bestanden genereert (statische API).
3. **Data Analist:** Bepaalt exact welke variabelen over de afgelopen 5 jaar berekend worden en levert dit aan de Architect.
4. **UX Specialist:** Ontwerpt de klik-interactie op de tabelrijen en de lay-out van het uitklapbare paneel/modal, inclusief de visualisatie van de grafiek.
5. **Verhalenverteller:** Schrijft een kleine tekstuele conclusie of tooltip in de modal die de gebruiker helpt om de grafiek te lezen.

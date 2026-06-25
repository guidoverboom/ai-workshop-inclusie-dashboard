# 📊 Consistency Review: Senior Data Analist

**Versie:** v0.2 (Live Dashboard)
**Oordeel:** ⚠️ Grote kloof tussen `DEFINITIES.md` en de daadwerkelijke data pipeline.

## ✅ Wat klopt er?
- **Berekeningen:** De berekening in `fetch-data.js` voor de ratio's (bijv. "aantal uitkeringen per 1.000 inwoners") en het Aandeel Arbeidsongeschiktheid wordt nog steeds exact volgens de specificaties uitgerekend en stuit niet op *divide by zero* fouten.
- **Datamodel:** Het datamodel (`RegioData`) weerspiegelt de output precies. Geen loze velden meer in de JSON.

## ⚠️ Inconsistenties & Waarschuwingen
Tijdens de migratie naar v0.2 is de data-pipeline gestript, maar ons 'datawoordenboek' (`DEFINITIES.md`) is blijven staan in het v0.1 tijdperk.

1. **Overbodige Data-definities:**
   In `DEFINITIES.md` staat heel veel theorie uitgelegd over:
   - Hoe WW conjunctuurgevoelig is (KPI).
   - Het saldo van instroom vs. uitstroom (Bijstand).
   - De maand-op-maand verandering van het bestand.
   Omdat `fetch-data.js` deze data (CBS tabellen `37789ksz` en `85615NED`) nu volledig negeert, wekt dit documentatie-bestand ten onrechte de suggestie dat we deze berekeningen uitvoeren.

2. **CBS Bronnen:**
   De inleiding van `DEFINITIES.md` noemt drie tabellen. De v0.2 applicatie gebruikt er echter nog maar één (plus de bevolkings-tabel `37230ned` die wel wordt genoemd in theorie, maar niet bovenaan de definities staat).

## 🔧 Actiepunten voor de Data Analist
- **Sanering van `DEFINITIES.md`:** Herschrijf het document zodat alleen de begrippen uit de `RegioTabel` overblijven (Uitkeringen < AOW, Bijstand, WW, Arbeidsongeschikt en per 1.000 inwoners). 
- **Oude definities archiveren:** De secties over instroom/uitstroom en maand-op-maand trends moeten verplaatst worden naar een archief, want ze zaaien nu verwarring over wat er werkelijk wordt berekend in `fetch-data.js`.

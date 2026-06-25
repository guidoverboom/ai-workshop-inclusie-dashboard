# Definities — Regionaal Dashboard Inclusieve Arbeidsmarkt (v0.2)

Dit document legt uit wat elk getal op het dashboard betekent en waar het vandaan komt.

> **Let op (v0.2):** Het dashboard bestaat momenteel uitsluitend uit de *Provincietabel*. De definities en documentatie over trendlijnen, in- en uitstroom, en KPI's zijn gearchiveerd (zie de branch `20260625` voor de v0.1 specificaties).

## Bronnen (CBS StatLine Open Data)

De data wordt opgehaald bij de openbare CBS API, zonder sleutel.

| Tabel | Titel | Gebruikt voor |
|-------|-------|---------------|
| **80794ned** | Personen met een uitkering; uitkeringsontvangers per regio | De absolute aantallen per uitkering per provincie. |
| **37230ned** | Bevolkingsontwikkeling; regio per maand | Het berekenen van het aantal uitkeringen per 1.000 inwoners. |

---

## Provincietabel — "Per provincie & Landelijk"

De tabel toont de nieuwst beschikbare cijfers, gegroepeerd per provincie en voor heel Nederland als benchmark.

| Kolom | Betekenis | CBS-veld (80794ned) |
|-------|-----------|---------------------|
| **Provincie** | Een van de 12 provincies (en de rij 'Heel Nederland'). | `RegioS` |
| **Uitkeringen (< AOW)** | Het totale aantal unieke uitkeringsontvangers onder de AOW-leeftijd. | `TotDeAOWLeeftijd_2` |
| **Per 1.000 inw.** | Aantal uitkeringsontvangers per duizend inwoners in de regio. | `(TotDeAOWLeeftijd / Bevolking 37230ned) * 1000` |
| **Bijstand** | Mensen in de Participatiewet onder de AOW-leeftijd (inkomensvangnet). | `BijstandTotDeAOWLeeftijd_7` |
| **WW** | Lopende werkloosheidsuitkeringen na baanverlies. | `Werkloosheid_4` |
| **Arbeidsongeschikt** | Totaal arbeidsongeschiktheidsuitkeringen (WAO + WIA + Wajong). | `ArbeidsongeschiktheidTotaal_8` |
| **Aandeel AO** | Afgeleid percentage: arbeidsongeschikt ÷ totaal (< AOW). Kleur: groen < 45%, oranje 45–54%, rood ≥ 55%. | *berekend* |

> **Let op bij het optellen:** De som van Bijstand + WW + Arbeidsongeschikt komt niet exact uit op het totaal onder "Uitkeringen (< AOW)".
> Dit heeft twee redenen:
> 1. **Samenloop:** Het totaal telt *unieke personen*. Iemand met twee uitkeringen (bijv. WIA én WW) telt in het totaal 1x mee, maar staat wel in beide kolommen.
> 2. **Bijstandsgerelateerde regelingen:** Regelingen zoals IOAW, IOAZ en Bbz zitten wél in het totale cijfer, maar niet in de specifieke kolom "Bijstand" (Participatiewet).

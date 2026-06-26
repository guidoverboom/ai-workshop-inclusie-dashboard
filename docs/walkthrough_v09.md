# Walkthrough: Van v0.8 naar v0.9 (Grafieken per Uitkeringssoort)

In deze update hebben we een enorme verdiepingsslag gemaakt in de analyse van de arbeidsmarkt. Voorheen keken we in de grafieken (de historische lijnen én de kwadranten) alleen naar de **Totale Uitkeringen**. 

Vanaf versie 0.9 hebben we de interface (en de onderliggende data) gesplitst in drie aparte pijlers!

## Wat is er veranderd?

1. **Drie Aparte Analysesecties**
   - **Totaal & Bijstand:** Biedt het algemene overzicht.
   - **Werkloosheidswet (WW):** Laat zien welke provincies volatiel zijn op de korte termijn en meebewegen met lokale faillissementen of seizoenswerk.
   - **Arbeidsongeschiktheid (AO):** Toont de veel rodere, structurele lijnen (WIA/Wajong/WAO). Deze zijn sterk gebonden aan vergrijzing en het historische type industrie in de provincie.

2. **Data Regeneratie**
   We hebben het backend-script (`2-transform.js`) herschreven. Dit script haalde al wel historische totalen op, maar sloeg vanaf nu óók de historische WW- en AO-waarden (en hun verhouding per 1.000 inwoners) per maand op in de `.json` bestanden.

3. **Herbruikbare Componenten**
   We hebben de componenten `VergelijkingsGrafiek.tsx`, `KwadrantenGrafiek.tsx` en `RegioTabel.tsx` voorzien van een `variant` prop (`'totaal' | 'ww' | 'ao'`). Hierdoor konden we de grafieken met minimale code-duplicatie herbruiken voor compleet andere datasets.

4. **Kruisbestuiving Selecties**
   Als je in de WW-tabel op een provincie klikt, verschijnt de historische trend van die provincie nu in *alle* grafieken (WW, AO én Totaal) tegelijk. Zo kun je direct zien of een piek in WW ook resulteert in een latere piek in Bijstand of AO.

## Visuele Veranderingen
De applicatie scrollt nu een stuk verder door, maar biedt per onderdeel (Totaal, WW, AO) een complete set aan analyse-tools:
1. De historische lijngrafiek (absoluut of relatief).
2. De kwadrantenanalyse (geduide waarden: Relatieve Stijgers vs Dalers).
3. De detailtabel met ruwe cijfers.

*Draai lokaal en selecteer een 'uitdagende' provincie zoals Groningen of Limburg om de enorme contrasten tussen hun WW-dynamiek en hun AO-dynamiek te zien!*

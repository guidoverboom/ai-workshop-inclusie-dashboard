# Waarden Assessment (v0.6) - Waardeduider

**Door:** De Waardeduider
**Onderwerp:** Assessment van de v0.6 voorstellen (Opsplitsen tabel, "Selecteer Alles", en limieten opheffen).

Voor we blindelings functionaliteit toevoegen, moeten we stilstaan bij wat dit ontwerp met onze gebruikers doet. Ik heb de voorgestelde wijzigingen gewogen langs de meetlat van onze kernwaarden.

### 1. Opsplitsen van de grote tabel in drie losse tabellen (Totaal, WW, AO)
*Waarden in het geding: Cognitieve Rust vs. Totaalbeeld*

**Positief:** 
Het opsplitsen van één gigantische tabel naar drie specifieke tabellen is een enorme overwinning voor de waarde **Cognitieve Rust** en **Doelgerichtheid**. Een grote tabel met 10 kolommen vol cijfers intimideert en overweldigt (data-vermoeidheid). Door data te clusteren (WW bij WW, AO bij AO) vergroten we de **Toegankelijkheid**. De gebruiker hoeft niet meer horizontaal te scrollen en kolommen te ontcijferen; hij krijgt precies de context die hij zoekt.

**Risico:** 
Het risico is dat het **Totaalbeeld** (holistisch perspectief) fragmenteert. Een gebruiker die de correlatie tussen WW en AO wil zien, moet nu verticaal scrollen tussen tabellen in plaats van de waarden direct naast elkaar af te lezen op één regel.

### 2. "Selecteer Alles" en de grafiek-limiet verwijderen
*Waarden in het geding: Autonomie vs. Zorgplicht (voorkomen van chaos)*

**Positief:** 
Het weghalen van de kunstmatige limiet van 5 provincies bedient de waarde **Gebruikersautonomie** (Regie) en **Vrijheid**. De tool is niet langer de 'betweterige poortwachter' die zegt wat de gebruiker mag zien. De "Selecteer Alles" knop is de ultieme vorm van **Transparantie**: "Hier is álle data, doe ermee wat je wilt."

**Risico:** 
We dreigen onze **Zorgplicht** (als ontwerper) te verzaken. Een grafiek met 13 kruisende lijnen is een onleesbare bak spaghetti. We offeren **Helderheid** op voor *Vrijheid*. 

### 3. De Datadissonantie (Het grootste waarden-conflict)
*Waarden in het geding: Betrouwbaarheid & Waarheidsvinding*

Er is een ernstig conflict: De grafiek bovenaan toont uitsluitend de *Totale* uitkeringen. Als we de gebruiker toestaan om in de 'WW-tabel' of 'AO-tabel' op een provincie te klikken om deze aan de grafiek toe te voegen, creëren we een schadelijke illusie. De gebruiker dénkt dat hij de historische trend van de WW bekijkt, terwijl we hem de totale trend serveren. Dit is in strijd met de waarde **Betrouwbaarheid**. Het schendt het vertrouwen tussen systeem en mens.

---

### Advies van de Waardeduider aan het team:

We mogen deze wijzigingen doorvoeren, mits we de volgende waarden-gedreven spelregels hanteren:

1. **Begeleide Autonomie:** Akkoord met het opheffen van de limiet en de "Selecteer Alles" knop. Echter, als de gebruiker alles selecteert, móet de UI niet breken en de lijnen (hoewel druk) moeten duidelijk van elkaar te onderscheiden zijn.
2. **Waakzaamheid voor Dissonantie:** Om verwarring (en schending van de betrouwbaarheid) te voorkomen, stel ik voor dat we in versie v0.6 de selectievakjes voor de grafiek **alléén in de Algemene Tabel** (Totaalcijfers) tonen. De WW- en AO-tabellen worden puur 'lees-tabellen' zonder checkboxes, tenzij we ook echt historische data voor WW en AO aan de grafiek kunnen leveren.

*Hoe kijkt de Product Owner naar dit advies? Mogen we door met bouwen onder deze voorwaarden?*

# Interne Consistency Checker

Dit document beschrijft het proces om de interne consistentie van het Inclusie Dashboard te bewaken. Het project wordt geëvalueerd door een virtueel team van vier expertrollen. Deze rollen vullen elkaar aan om te zorgen dat de code, data, de visuele flow en de verhaallijn 100% met elkaar in balans zijn.

## Het Expertteam

De check wordt uitgevoerd door de volgende vier rollen:

1. 🏗️ **[Senior Code & Architecture Reviewer](./rol_architect.md)** 
   Bewaakt de technische flow, code hygiëne en controleert of de implementatie de `ARCHITECTUUR.md` volgt.
2. 📊 **[Senior Data Analist](./rol_data_analist.md)** 
   Verifieert of berekeningen accuraat zijn, edge-cases worden afgevangen en of dit overeenkomt met `DEFINITIES.md`.
3. 📖 **[Senior Verhalenverteller](./rol_verhalenverteller.md)** 
   Kijkt door de ogen van de eindgebruiker. Zorgt ervoor dat UI-labels logisch zijn en het narratief uit `VERHAALLIJN.md` waarmaken.
4. 🎨 **[Senior UX Specialist](./rol_ux_specialist.md)** 
   Bewaakt de visuele rust, de toegankelijkheid (kleuren/contrast) en de intuïtieve interactie van het dashboard.

*(Klik op de links hierboven voor de volledige briefing per rol).*

---

## Hoe werkt de Consistency Check?

Wanneer je een (AI) agent of sub-agent de opdracht geeft om een Consistency Check te doen, doorlopen zij het volgende proces:

### 1. Individuele Evaluatie
De vier experts bekijken de actuele codebase en de documentatie (`docs/`) vanuit hun eigen specifieke focusgebied. Ze doen onafhankelijk van elkaar onderzoek (lezen bestanden in, controleren npm-scripts) en trekken hun eigen conclusies.

### 2. De Groepsdynamiek (Samenwerking)
Nadat ze individueel hebben gekeken, leggen de experts hun bevindingen naast elkaar. Ze zijn getraind om overlappende problemen op te lossen. Voorbeelden van hun groepsdynamiek:
- De **Verhalenverteller** wil misschien een nieuwe KPI in het dashboard, maar de **Data Analist** stelt een veto omdat CBS die data niet live levert.
- De **Architect** wil een extra tabel bouwen voor prestatiewinst, maar de **Verhalenverteller** geeft aan dat dit het dashboard onoverzichtelijk maakt voor de eindgebruiker.
Samen zoeken ze naar de ideale balans tussen *technische haalbaarheid, feitelijke accuratesse en gebruikersgemak*.

### 3. Het Gezamenlijke Rapport
De output van de consistency checker is altijd een **gezamenlijk, gestructureerd Markdown rapport**. Dit rapport bevat:
- **✅ Wat klopt er perfect?** (Waar sluiten de 3 expertises naadloos op elkaar aan).
- **⚠️ Inconsistenties & Waarschuwingen** (Waar spreken de code, theorie of UI elkaar tegen).
- **🔧 Actiepunten per Rol** (Concrete voorstellen, duidelijk toegewezen aan een expert, zodat de ontwikkelaar weet wie de wijziging voorstelt en waarom).

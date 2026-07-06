# Förklara AI — föreläsningsverktyg

Ett levande bibliotek i stället för en PowerPoint. Byggt för att hoppa dit publiken
pekar — och för att minnas åt dig.

Du landar alltid på **den röda tråden**: hela berättelsen i ett andetag — tretton
kapitel, tretton bärande meningar. Tryck `Enter` för att fortsätta där du var,
eller klicka ett kapitel för att börja där. Tråden bor i `manifest.js` som
`tes` (kapitlets mening) och `nyckel` (kapitlets bild) på varje sektion.

## Starta

Dubbelklicka på **`Starta föreläsningen.command`** — eller öppna `index.html`
direkt i Safari/Chrome. Allt fungerar utan internet.

## Tangenter

| Tangent | Gör |
|---|---|
| `→` `PgDn` `mellanslag` | nästa bild (fjärrklickare fungerar) |
| `←` `PgUp` | föregående bild |
| `/` eller `⌘K` | **sök** — skriv "Fei", "primtal", "AlphaFold" … |
| `1` `2` `3` | **nivå**: Kärnan (~15 bilder) · Berättelsen (standard) · Fördjupning (allt) |
| `R` | röda tråden — berättelsen i ett andetag |
| `G` | översikt över hela föreläsningen |
| `N` | visa/dölj anteckningar & länkar |
| `B` | bara bilden — allt annat försvinner |
| `F` | helskärm |
| `Esc` | stäng / tillbaka |

Verktyget minns var du var mellan gångerna (och panelläget).

## Dela med andra — webblänken

Föreläsningen ligger live på **https://annamalmberg2.github.io/forklara-ai/**

- Länken är en utställning: besökare kan titta, söka och bläddra — men aldrig
  ändra din källa (det finns ingen server att skriva till).
- Efter att du sparat ändringar: dubbelklicka **`Publicera uppdatering.command`**
  så går de live inom någon minut.

## Redigera direkt i verktyget

Klicka **Redigera** i verktygsraden (knappen finns bara på din dator, aldrig på
webblänken). Då kan du på varje kort:

- ändra **titel** och **anteckningar**
- flytta kortet till ett annat **kapitel** (foton som hamnat i fel serie!)
- knuffa det **tidigare/senare** i kapitlet
- byta **nivå** (kärnan/berättelsen/fördjupning)

Ändringar sparas direkt som utkast i webbläsaren (du kan stänga och fortsätta).
När du är nöjd: **"Spara till manifest.js"** — välj filen
`content/forklara-ai/manifest.js` första gången, sedan sparar den dit direkt.
**"Släng utkastet"** läser om från filen om du ångrar allt.

## Lägga till / ändra innehåll i filen

Allt innehåll bor i `content/forklara-ai/`:

1. Släpp bilden i `content/forklara-ai/bilder/`
2. Öppna `content/forklara-ai/manifest.js` och lägg till ett kort —
   kopiera ett befintligt och ändra. Instruktioner finns överst i filen.

Kort utan `bild` blir **textkort** (som "Filmtips" och "ImageNet & Fei-Fei Li").

**Nivåer:** ge ett kort `djup: 1` (kärnan — med i den korta versionen) eller
`djup: 3` (fördjupning — bara i det fulla flödet). Utan `djup` är kortet med i
standardberättelsen (nivå 2). Nivån styr bara pilbläddringen — sökningen ser
alltid allt. Byt nivå mitt i föreläsningen med tangenterna `1`/`2`/`3`.

Sektionerna `900 Dokumentation` och `950 Reserv` är märkta `bakom: true` —
de nås via sök och översikt men ligger utanför pilbläddringen.

## Ny föreläsning (samma verktyg)

1. Kopiera mappen `content/forklara-ai` → `content/min-nya-forelasning`
2. Byt ut bilder och innehåll i manifest.js
3. Öppna `index.html?lecture=min-nya-forelasning`

## Vanliga frågor

**Måste jag döpa om foton för att de ska hamna rätt?**
Nej — aldrig. Filnamnet är bara en etikett. Var ett foto hamnar styrs av kortets
*kapitel* och *plats*, och det ändrar du i Redigera-läget (kapitel-väljaren och
▲/▼-knapparna). Numren i filnamnen är städhjälp för mappen, inte styrsystem.

**Hur lägger jag in ett nytt foto?**
1. Lägg fotot i skrivbordsmappen *Förklara AI* som vanligt.
2. Dubbelklicka **`Hämta nya bilder från skrivbordet.command`**.
3. Öppna verktyget → **Redigera** → **+ Nytt kort (välj bild)** → peka ut fotot.
   Kortet skapas efter det du står på — flytta det sedan vart du vill.

**Hur ändrar jag länkar?**
Redigera-läget har fältet **Länkar**: rubrik + adress per rad, ✕ tar bort,
"+ Lägg till länk" ger en ny rad. Länkarna visas klickbara i anteckningspanelen.

**Var lägger jag fördjupning?**
Fyra vägar, välj efter tyngd:
- *Lite mer att säga om en bild* → kortets **Anteckningar** (dina minnesstöd).
- *En rejäl fördjupning för den som vill nörda* → kortets **Fördjupning**-fält
  i Redigera-läget. Texten visas hopfälld i panelen under rubriken
  "Fördjupning — för den som vill nörda" — även på webblänken, så publiken
  kan gräva vidare hemma. Tom rad = nytt stycke. (Exempel: primtalskortet 060-10.)
- *En bild som bara ska visas för tekniska publiker* → sätt kortets **Nivå**
  till "3 · Fördjupning" (syns bara i fulla flödet, men är alltid sökbar).
- *En källa, bloggpost eller video* → kortets **Länkar**
  (t.ex. till Wisdom Streamer, där berättelserna bakom bilderna bor).

**Var är publicera-knappen?**
På skrivbordet: **"Förklara AI – publicera.command"** (och tvillingen
"Förklara AI – starta.command" som öppnar verktyget). Originalen ligger i
projektmappen `~/Projects/forklara-ai` — genvägarna går att flytta vart du vill.

## Källmaterial

Originalbilderna ligger kvar i `~/Desktop/Förklara AI` (omdöpta enligt samma
struktur — `omdöpningslogg.csv` där visar gammalt → nytt namn).
Om du byter namn eller lägger till bilder på skrivbordet: kopiera in dem i
`content/forklara-ai/bilder/` också, så att verktyget ser dem.

# Förklara AI — föreläsningsverktyg

Ett levande bibliotek i stället för en PowerPoint. Byggt för Anna Malmberg
(AiNNOVA) som följer publiken, inte manuset — och för att minnas åt henne.

**Live:** https://annamalmberg2.github.io/forklara-ai/
(webblänken är en utställning — besökare kan aldrig ändra något)

> **Repot rymmer två saker:** föreläsningsverktyget (nedan) **och** Annas nio
> böcker, som publiceras som egna HTML-sidor från samma repo (länkade från
> erbjudanden.ainnova.se/bocker). Se **Böckerna** och **Skripten** längre ned,
> och masterkartan `SANNINGSKARTA.md` i skrivbordsmappen *Senaste md till böcker*.

## Grundidéerna

- **Labbet** är den enda startsidan: hälsning, den stora frågan, sökfält,
  stigval och alla kapitel (som går att fälla ut). Allt börjar där.
- **Ett kort = en berättelse = en eller flera bilder.** Pilarna bläddrar
  först berättelsens bildspel (prickraden visar var du är), sedan nästa
  berättelse.
- **Stigar** i stället för nivåer: Tekniska, Historiska, Filosofiska och
  Kom igång-stigen — samma skog, olika vandringar. Väljs på startsidan.
  "Hela berättelsen" är standard. Allt är alltid sökbart oavsett stig.
- **Ordningen bor i verktyget, inte i filnamnen.** Bildfiler heter det de
  föreställer ("Svampskogen – mycelet.png") — inga nummer.
- **Inga dubbletter.** Ratat hamnar i ARKIV, aldrig i papperskorgen.

## Mapparna (allt bor i projektet)

| Mapp/fil | Vad |
|---|---|
| `content/forklara-ai/bilder/` | ALLA bilder som används — enda källan |
| `content/forklara-ai/manifest.js` | hela föreläsningen (kort, stigar, texter) |
| `INKORG/` | släpp nya bilder + ev. txt-lapp här; säg "töm inkorgen" till din AI |
| `ARKIV/` | ratade bilder vilar här (publiceras aldrig) |
| `LOGG.txt` | läsbar förändringshistorik |
| `server.py` | den lokala motorn (Spara/Publicera/bilduppladdning) |

Skrivbordsmappen "Förklara AI" är pensionerad — den rörs inte längre.
Nya bilder går via INKORG eller direkt via Redigera-läget.

## Starta & använda

Dubbelklicka **"Förklara AI"** på skrivbordet (eller `Starta föreläsningen.command`).
Motorn startar och verktyget öppnas. Låt terminalfönstret vara — det ÄR motorn.

| Knapp/tangent | Gör |
|---|---|
| pilar, `PgDn`, mellanslag | nästa bild i berättelsen → nästa berättelse (fjärrklickare funkar) |
| `/`, `⌘K` eller sökfältet | sök — personer, begrepp, bilder, allt |
| **Hem** (`R`) | labbet: stigval, kapitel, sök |
| **Översikt** (`G`) | alla berättelser, kapitel för kapitel |
| **Kortet** (`N`) | presentationskortet: anteckningar, fördjupning, länkar |
| **Scenläge** | helskärm med bara bilden (`Esc` avslutar) |
| `B` / `F` | bara bild / helskärm (för den som vill) |

## Redigera (bara på Annas dator — aldrig på webblänken)

**Redigera**-knappen öppnar editorn på varje kort:
titel · kapitel · plats · **bilder** (lägg till/ta bort/ordna — välj filer var
som helst, motorn kopierar in dem) · **stigar** (kryssrutor) · anteckningar ·
fördjupning (syns för publiken, hopfälld) · länkar · **Se även** (koppla ihop
berättelser: skriv titel, välj i listan) · nytt kort · ta bort kort ·
**Startsidan** (hälsning & stora frågan).

Ändringar sparas direkt som utkast i webbläsaren. Sedan:
**Spara** (skriver till projektet) → **Publicera till webben** (git push,
live inom minuter). Vid start frågar verktyget om ev. gammalt utkast —
"Släng" läser om från filen.

## Biblioteket uppdaterar sig från Google-arket

Biblioteket (sektion 130) byggs från arket **"Länkar till Förklara AI"**
(delat "alla med länken kan visa"). Varje flik blir en hylla, med flikens
inledningstext och länkarna grupperade på kolumnen **Notis**.

Arkets kolumner: **Innehåll · Länkar · Beskrivning · Notis · Flik eller sida**.

Så uppdaterar du: fyll på i arket → i verktyget **Redigera →
"⟳ Uppdatera biblioteket från arket"** → biblioteket hämtas färskt och byggs
om → **Publicera till webben**. Ingen nedladdning behövs; motorn hämtar arket
direkt (`scripts/bibliotek.py`, endpoint `/api/biblioteket`).

## Ny föreläsning (samma verktyg)

Kopiera `content/forklara-ai` → `content/min-forelasning`, byt innehåll,
öppna `index.html?lecture=min-forelasning`. Stigarna definieras i manifestets
`stigar`-lista och kan heta vad som helst.

## Böckerna (bor i samma repo)

Utöver föreläsningsverktyget publiceras Annas **nio böcker** härifrån, som egna
HTML-sidor. Varje bok har knapparna **"Dela med AI"** (kopierar boken som ren
text) och **Skriv ut** — och de ger *alltid* exakt den bok man läser.

Det finns **två regimer** (full karta: `SANNINGSKARTA.md` i skrivbordsmappen
*Senaste md till böcker*):

- **Drömmen-trilogin** (`drommen`, `drommen-nu`, `drommen-stovlarna`) — här är
  **markdown källan**. Filerna bor i *Senaste md till böcker/Drömmen-trilogin/*
  och byggs med `python3 scripts/bygg_bok.py`. Boken, `.md`:n, "Dela med AI" och
  utskriften är samma text. Daterad historik skrivs till en separat
  `Ändringslogg.md` (aldrig in i boken).
- **De sex handbyggda** (`en-bibel`, `motvikten`, `mega`, `forklara-ai`,
  `utblickar`, `naturlag`) — här är den **publicerade HTML:en sanningen**;
  mappens gamla md speglar den inte. `mega` byggs av `bygg_mega_bok.py`.
  "Dela med AI" härleder texten direkt ur HTML:en, så den speglar alltid boken.

**Sidfoten "Av samma författare":** de sex delar en gemensam fot via
`scripts/bokfot.py` (ändra där + kör om → alla sex ändras). Drömmens fot är
ännu handskriven i varje boks käll-md.

## Skripten — levande vs arkiverade

**Levande (rör dem inte i onödan — byggena hänger på dem):**

| Skript | Vad |
|---|---|
| `bygg_bok.py` | bygger Drömmen-trilogin ur käll-md |
| `bygg_mega_bok.py` | bygger *En rörelse* (mega) |
| `bokfot.py` | gemensam "Av samma författare"-fot i de sex handbyggda |
| `cc_licens.py` | CC-märkning i kolofonen (importeras av båda byggena) |
| `gor_toc_klickbar.py`, `lagg_docs_knapp.py` | importeras av mega-bygget |
| `gor_omslag.py`, `appikoner.py` | ritar omslag resp. app-ikoner/delningsbild |
| `bibliotek.py` | bygger bibliotekshyllorna från Google-arket |
| `synka_bilder.py` | skriver bildbankens lista |
| `tankstreck.py` | tunnar tankstreck snyggt i innehållet |
| `skorda_samlingar.py` | bygger samlingsböckerna (*naturlag*/*utblickar*) ur stämplade rutor |
| `andringslogg.json`, `bok_state.json` | data: Drömmens ändringslogg + hash-vakt |

**Arkiverade** i `ARKIV/spenderade-engangsskript-2026-11-03/` (spenderade
engångskirurgier, redan inympade i den publicerade HTML:en — sparade, ej
raderade): de fyra `box_*_krockar.py`, `stampla_metadata.py`, samt de gamla
säkerhetskopiorna `app.css.bak` och `index.html.bak`.

## Om något strular

- "Jag sparade men ser inget" → utkast-frågan vid start: välj "Släng utkastet".
- Motorn svarar inte → dubbelklicka "Förklara AI" på skrivbordet igen.
- Publicering felar → `Publicera uppdatering.command` i projektmappen (reserv),
  eller be din AI. GitHub Pages-bygget kan behöva knuffas:
  `gh api -X POST repos/Annamalmberg2/forklara-ai/pages/builds`.
- Full historik över alla beslut finns i LOGG.txt och i git-historiken.

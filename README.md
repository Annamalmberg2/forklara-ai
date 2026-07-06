# Förklara AI — föreläsningsverktyg

Ett levande bibliotek i stället för en PowerPoint. Byggt för Anna Malmberg
(AiNNOVA) som följer publiken, inte manuset — och för att minnas åt henne.

**Live:** https://annamalmberg2.github.io/forklara-ai/
(webblänken är en utställning — besökare kan aldrig ändra något)

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

## Ny föreläsning (samma verktyg)

Kopiera `content/forklara-ai` → `content/min-forelasning`, byt innehåll,
öppna `index.html?lecture=min-forelasning`. Stigarna definieras i manifestets
`stigar`-lista och kan heta vad som helst.

## Om något strular

- "Jag sparade men ser inget" → utkast-frågan vid start: välj "Släng utkastet".
- Motorn svarar inte → dubbelklicka "Förklara AI" på skrivbordet igen.
- Publicering felar → `Publicera uppdatering.command` i projektmappen (reserv),
  eller be din AI. GitHub Pages-bygget kan behöva knuffas:
  `gh api -X POST repos/Annamalmberg2/forklara-ai/pages/builds`.
- Full historik över alla beslut finns i LOGG.txt och i git-historiken.

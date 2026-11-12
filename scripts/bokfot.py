#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
bokfot.py — en återanvändbar injektor för bokfoten "Av samma författare +
Vidare läsning" i de fristående, handbyggda böckerna (En Bibel, Ett parti,
En rörelse, Förklara AI, Utblickar, Är det en naturlag?).

EN kanonisk fot, definierad här. Blocket skrivs som rena <p> med inline-stil
(inga CSS-tillägg, inga beroenden på per-bok-klasser) så att:
  • det renderas snyggt i läsvyn och respekterar ljust/mörkt tema (via var(--*)),
  • det fångas automatiskt av böckernas befintliga "Dela med AI" (toMD plockar
    alla <p> i .efter-sektionen) — alltså utan att röra toMD,
  • det skrivs ut fint (ligger i .efter som redan har page-break-skydd).

Idempotent: ett tidigare injicerat block (mellan markörerna) ersätts vid ny
körning. Framtida bok eller ny titel = ändra BOCKER/TEXT nedan och kör om.

Drömmen-trilogin har redan foten (byggs av bygg_bok.py) och rörs INTE här.

    python3 scripts/bokfot.py            # kör på standarduppsättningen
"""
import re, sys, os

HÄR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

GAMLA = ["en-bibel", "motvikten", "mega", "forklara-ai", "utblickar", "naturlag"]

# Alla böcker, i serieordning. (title, url, desc)
ANDRA = [
    ("Drömmen om den tänkande maskinen", "drommen.html",
     "tusentals år av mönster, människor och AI, från världens alla hörn. Hur vi hamnade här."),
    ("Drömmen och var vi står", "drommen-nu.html",
     "vad AI kan i dag, var gränserna går och vem som bestämmer."),
    ("Drömmen med stövlarna på", "drommen-stovlarna.html",
     "så kommer du i gång med AI, och behåller omdömet."),
]
FORSTA = [
    ("En bibel", "en-bibel.html",
     "en bibel som inte kräver din tro. Ändå rymmer den det som varje tro borde vila på."),
    ("En rörelse", "mega.html",
     "en rörelse som inte går att följa. Ändå visar den vart varje rörelse borde gå."),
    ("Ett parti", "motvikten.html",
     "ett parti som inte går att rösta på. Ändå är det vad varje parti borde ha i åtanke."),
]

# ── Den gemensamma fotens TEXT (enda källan — ändra HÄR, slår igenom i alla nio
#    böcker: de sex handbyggda via HTML nedan, Drömmen via fot_markdown()) ──────
ERBJUDANDE = ("Alla finns att läsa gratis på "
              "[erbjudanden.ainnova.se/bocker](https://erbjudanden.ainnova.se/bocker).")
VIDARE = ("Frågorna tar inte slut när boken gör det. Jag skriver vidare på "
          "[hurdetfunkar.se](https://hurdetfunkar.se/), och allt samlas på "
          "[erbjudanden.ainnova.se/bocker](https://erbjudanden.ainnova.se/bocker) — "
          "böckerna, texterna och det som är på väg.")
OM_AINNOVA = ("De här böckerna är en del av AiNNOVA: mitt sätt att göra AI begripligt för fler, "
              "med vardagsbilder i stället för facktermer. De är skrivna på det moderna sättet, "
              "av människa och maskin tillsammans, med omdömet kvar hos människan. "
              "Mer på [ainnova.se](https://ainnova.se/).")
ANVAND = ("Allt jag skriver är fritt att läsa, skriva ut och bygga vidare på, gratis, på "
          "[erbjudanden.ainnova.se/bocker](https://erbjudanden.ainnova.se/bocker). Du hittar inga "
          "fotnoter. I stället finns knappen **Dela med AI**: ett tryck ger dig hela boken som text, "
          "färdig för vilken AI du vill. Be den gräva fram källorna, syna ett påstående eller väga det "
          "jag skriver mot det du själv varit med om, och skilja på det som är belagt, det som är min "
          "tolkning och det som är en gissning. En AI som hittar på källor hjälper ingen. Knappen "
          "**Skriv ut** gör en PDF, och på webben översätter de flesta webbläsare boken till ditt språk. "
          "Ett kort stycke kan bli fröet till en hel bok, en låt eller ett filmmanus — gör du något av "
          "det, nämn gärna mig och AiNNOVA.")
CC_RAD = ("*Fri att läsa, dela och bygga vidare på under Creative Commons CC BY 4.0. "
          "Nämn gärna Anna Malmberg och* [AiNNOVA](https://ainnova.se/)*.*")

def _md2html(s):
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    return re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)

def fot_markdown():
    """Den gemensamma foten som ren markdown — för Drömmen-bygget, så att
    'Dela med AI' (BOK_MD) == den publicerade .md:n == boken. Samma INNEHÅLL som
    HTML-foten (bygg_block) nedan; renderas bara i Drömmens egna hus-stil."""
    r = ["# **Av samma författare**", "", "Jag har skrivit två trilogier.", "",
         "**Drömmen-trilogin**", ""]
    r += ["* **%s** – %s" % (t, d) for (t, u, d) in ANDRA]
    r += ["", "**Institutionstrilogin**", ""]
    r += ["* **%s** – %s" % (t, d) for (t, u, d) in FORSTA]
    r += ["",
          "# **Vidare läsning**", "", VIDARE, "",
          "# **Fri att läsa och dela**", "", ANVAND, "",
          "# **Om AiNNOVA**", "", OM_AINNOVA, "", CC_RAD, ""]
    return "\n".join(r)

START = "<!-- BOKFOT_START -->"
SLUT  = "<!-- BOKFOT_END -->"

# inline-stilar (med fallbacks så blocket aldrig ser trasigt ut om en var saknas)
S_ORN  = "text-align:center;color:var(--gold,#b08a3e);margin:34px 0 4px;letter-spacing:.3em;"
S_EYE  = ("font-family:var(--sans,system-ui,sans-serif);font-size:12px;font-weight:700;"
          "letter-spacing:.08em;text-transform:uppercase;color:var(--taupe,#8a7f6d);"
          "margin:6px 0 10px;")
S_SUB  = ("font-family:var(--sans,system-ui,sans-serif);font-size:12px;font-weight:700;"
          "letter-spacing:.08em;text-transform:uppercase;color:var(--gold,#b08a3e);"
          "margin:22px 0 4px;")
S_BOOK = "margin:.45em 0;"
S_NOTE = "margin:1em 0;"
# riktig rubrik: samma serif som brödtexten (--serif), närvarande — matchar trilogins fot
S_RUBRIK = ("font-family:var(--serif,Georgia,serif);font-size:1.5em;font-weight:600;"
            "color:var(--ink,#23201A);text-align:center;letter-spacing:.01em;"
            "text-transform:none;margin:1.5em 0 .4em;line-height:1.25;")

def _p(text, style=None):
    return '<p%s>%s</p>' % ((' style="%s"' % style) if style else "", text)

def _book(title, url, desc):
    return _p('<strong><a href="%s">%s</a></strong> – %s' % (url, title, desc), S_BOOK)

def _h(text):
    return '<h2 style="%s">%s</h2>' % (S_RUBRIK, text)

def bygg_block(orn=True, usage=False):
    d = []
    if orn:   # hoppa över eget ornament om boken redan slutar med ett (undvik dubbel)
        d.append('<div class="rule-orn" style="%s">✦ ❋ ✦</div>' % S_ORN)
    d.append(_h("Av samma författare"))
    d.append(_p("Jag har skrivit två trilogier."))
    d.append(_p("Drömmen-trilogin", S_SUB))
    d += [_book(*b) for b in ANDRA]
    d.append(_p("Institutionstrilogin", S_SUB))
    d += [_book(*b) for b in FORSTA]
    d.append(_h("Vidare läsning"))
    d.append(_p(_md2html(VIDARE)))
    if usage:
        d.append(_h("Fri att läsa och dela"))
        d.append(_p(_md2html(ANVAND)))
    d.append(_h("Om AiNNOVA"))
    d.append(_p(_md2html(OM_AINNOVA)))
    return "\n    " + START + "\n    " + "\n    ".join(d) + "\n    " + SLUT + "\n    "

def injicera(slug):
    f = os.path.join(HÄR, slug + ".html")
    s = open(f, encoding="utf-8").read()

    # 1) ta bort ev. tidigare block (idempotent)
    s = re.sub(re.escape(START) + r".*?" + re.escape(SLUT), "", s, flags=re.S)
    # städa blanka rader som kan ha blivit kvar
    s = re.sub(r'\n[ \t]*\n[ \t]*\n(\s*<div class="colophon")', r'\n\1', s)

    # 2) hitta SISTA colophon-diven och den omslutande sektionen
    ci = s.rfind('<div class="colophon"')
    if ci < 0:
        raise SystemExit("%s: ingen colophon-div hittad" % slug)
    sot = s.rfind("<section", 0, ci)
    sectag = s[sot:s.find(">", sot) + 1]
    if 'class="efter"' not in sectag and 'efter' not in sectag:
        raise SystemExit("%s: sista colophon ligger inte i en .efter-sektion (%s) — "
                         "avbryter för säkerhets skull" % (slug, sectag.strip()[:60]))

    # 3) lägg blocket direkt före colophon-diven.
    #    Slutar boken redan med ett ornament här? Hoppa då över bokens eget ledande
    #    ornament, annars blir det dubbelt (gällde forklara-ai och naturlag).
    before = s[:ci].rstrip()
    orn = not re.search(r'rule-orn[^>]*>\s*✦ ❋ ✦\s*</div>\s*$', before)
    s = s[:ci] + bygg_block(orn, slug in ("en-bibel", "motvikten", "mega")).strip("\n") + "\n    " + s[ci:]
    open(f, "w", encoding="utf-8").write(s)

    # kontroll
    kyr = sum(s.count(c) for c in "аеорсухіјѕАЕОРСТНКМВ")
    return sectag.strip()[:40], s.count(START), kyr

if __name__ == "__main__":
    mål = sys.argv[1:] or GAMLA
    for slug in mål:
        sek, n, kyr = injicera(slug)
        status = "OK" if (n == 1 and kyr == 0) else "⚠"
        print("  %-12s %s  (sektion=%s · block=%d · KYR=%d)" % (slug, status, sek, n, kyr))
    print("Klart. Drömmen-trilogin hanteras av bygg_bok.py och rördes inte.")

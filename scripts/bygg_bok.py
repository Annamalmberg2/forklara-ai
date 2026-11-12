#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""bygg_bok.py — bygg "Drömmen"-trilogin (andra trilogin) som böcker + kort.

Generaliserar bygg_drommen.py till alla tre böckerna. MARKDOWN är originalet.
Pipeline per bok: läs md → städa (avescape, CC-rad om den saknas) → spara
<slug>.md → husets HTML (CSS ur motvikten) → bädda in ordagrann md för
"Dela med AI" → Kopiera-för-Docs + CC-stämpel → omslag → sektionskort.
Sist: EN manifest-uppdatering för alla tre sektionerna.

Ny md-dialekt som hanteras: fet `**` i rubriker, `*`/`- `-punkter, numrerade
listor, "Avslutning", "Vidare läsning", "Personer och nycklar", backslash-
escapes (\\. \\) …) från Docs-exporten.

  python3 scripts/bygg_bok.py
"""
import io, os, re, json, hashlib, datetime

ROOT = "/Users/ainnova/Projects/forklara-ai"
SRC  = "/Users/ainnova/Desktop/Senaste md till böcker/Drömmen-trilogin"
BASE = "https://annamalmberg2.github.io/forklara-ai"

# ── ändringslogg (daterad, syns i md + html) + ändringsvakt ──────────────────
# Källan till böckerna bor i SRC. Loggen bor i andringslogg.json, i Annas ord.
# Bygget jämför texten mot förra bygget (bok_state.json) och stämplar dagens
# datum BARA när texten faktiskt ändrats — aldrig falskt när inget hänt.
LOGG_PATH  = ROOT + "/scripts/andringslogg.json"
STATE_PATH = ROOT + "/scripts/bok_state.json"
def _load(p, d):
    try: return json.loads(io.open(p, encoding="utf-8").read())
    except Exception: return d
LOGG  = _load(LOGG_PATH, {})
STATE = _load(STATE_PATH, {})
TODAY = datetime.date.today().isoformat()

# ── bokspecar ──────────────────────────────────────────────────────────────
BOCKER = [
  dict(slug="drommen", src=SRC + "/1 Drömmen om den tänkande maskinen.md",
       sek_id="drommen", sek_namn="13 · Drömmen om den tänkande maskinen",
       cover="Drömmen.png", tema="ljus", app="Drömmen",
       title_html='Drömmen om den <span class="em">tänkande</span> maskinen',
       cover_l1="Drömmen om den", cover_l2="tänkande maskinen",
       cover_eye="TUSENTALS ÅR · FRÅN VÄRLDENS ALLA HÖRN",
       cover_sub="Från smedjan till nattduksbordet.",
       notebooklm=[
         ["NotebookLM · 12 okt 2026", "https://notebook.google.com/notebook/a3f17bf2-76b3-4b7b-8eb8-e7889a5d4161", "Boken som ljudöversikt och kringmaterial (nyare).", "NotebookLM"],
         ["NotebookLM · 30 sep 2026", "https://notebook.google.com/notebook/ec6e8826-9e7f-4abc-a7f5-035f04775a8d", "Boken som ljudöversikt och kringmaterial (version 1).", "NotebookLM"],
       ]),
  dict(slug="drommen-nu", src=SRC + "/2 Drömmen och var vi står.md",
       sek_id="drommen-nu", sek_namn="14 · Drömmen och var vi står",
       cover="Drommen-var-vi-star.png", tema="mork", app="Var vi står",
       title_html='Drömmen och <span class="em">var vi står</span>',
       cover_l1="Drömmen och", cover_l2="var vi står",
       cover_eye="VAR AI STÅR I DAG · OCH VEM SOM BESTÄMMER",
       cover_sub="Vad maskinerna kan, var gränsen går.",
       notebooklm=[]),
  dict(slug="drommen-stovlarna", src=SRC + "/3 Drömmen med stövlarna på.md",
       sek_id="drommen-stovlarna", sek_namn="15 · Drömmen med stövlarna på",
       cover="Drommen-stovlarna.png", tema="ljus", app="Stövlarna på",
       title_html='Drömmen med <span class="em">stövlarna på</span>',
       cover_l1="Drömmen med", cover_l2="stövlarna på",
       cover_eye="KOM I GÅNG · BEHÅLL OMDÖMET",
       cover_sub="Så arbetar du med en maskin.",
       notebooklm=[]),
]

# systerböcker som ska bli klickbara i "Av samma författare" (bara i HTML)
SYSTRAR = [
  ("Drömmen om den tänkande maskinen", "drommen.html"),
  ("Drömmen och var vi står", "drommen-nu.html"),
  ("Drömmen med stövlarna på", "drommen-stovlarna.html"),
  ("En bibel", "en-bibel.html"), ("En Bibel", "en-bibel.html"),
  ("En rörelse", "mega.html"), ("Ett parti", "motvikten.html"),
]

ROM_ = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI"]
ROM2N = {r: i + 1 for i, r in enumerate(ROM_)}
RAKNEORD = {7:"Sju",8:"Åtta",9:"Nio",10:"Tio",11:"Elva",12:"Tolv",13:"Tretton",14:"Fjorton"}
KYR = set("аеорсухіјѕАЕОРСТНКМВ")

# ── md-hjälpare ────────────────────────────────────────────────────────────
def avbold(t):
    """Ta bort fet-markering runt en rubriktext: **Titel** → Titel."""
    t = t.strip()
    if t.startswith("**") and t.endswith("**"):
        t = t[2:-2].strip()
    return t

def inline(t):
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<!\*)\*(?!\s)([^*]+?)\*(?!\*)', r'<em>\1</em>', t)
    # avescape Docs-export: \. \) \( \! \- \: \; \, → tecknet självt
    t = re.sub(r'\\([.()!\-:;,])', r'\1', t)
    return t

def paras(lines):
    """Stycken + listor. Hanterar '* '/'- ' (ul) och 'N. ' (ol)."""
    out = []; para = []; lst = []; lst_typ = None
    def fp():
        if para: out.append("<p>" + inline(" ".join(para).strip()) + "</p>"); para[:] = []
    def fl():
        if lst:
            tag = lst_typ[0]
            out.append("<%s>%s</%s>" % (tag, "".join("<li>"+inline(x)+"</li>" for x in lst), tag))
            lst[:] = []
    for ln in lines:
        s = ln.rstrip()
        if not s.strip():
            fp(); fl(); lst_typ = None; continue
        mnum = re.match(r'^\s*(\d+)\.\s+(.*)$', s)
        mbul = re.match(r'^\s*[*\-]\s+(.*)$', s)
        if mnum:
            fp()
            if lst_typ != ("ol",): fl(); lst_typ = ("ol",)
            lst.append(mnum.group(2))
        elif mbul:
            fp()
            if lst_typ != ("ul",): fl(); lst_typ = ("ul",)
            lst.append(mbul.group(1))
        else:
            fl(); lst_typ = None; para.append(s.strip())
    fp(); fl()
    return "".join(out)

def chapter_body(lines):
    subs = []; sh = None; buf = []
    for ln in lines:
        m = re.match(r'^## (.+)$', ln)
        if m:
            if sh is not None or buf: subs.append((sh, buf))
            sh = avbold(m.group(1)); buf = []
        else:
            buf.append(ln)
    if sh is not None or buf: subs.append((sh, buf))
    html = []
    for sh, buf in subs:
        inner = paras(buf)
        if not inner: continue
        if sh is None:
            html.append('<div class="body">%s</div>' % inner)
        else:
            html.append('<div class="section"><div class="section-head">'
                        '<span class="concept">%s</span></div>'
                        '<div class="body">%s</div></div>' % (inline(sh), inner))
    return "\n".join(html)

def subtitles(lines):
    return [avbold(m.group(1)) for m in (re.match(r'^## (.+)$', l) for l in lines) if m]

def first_sentence(lines):
    for ln in lines:
        s = ln.strip()
        if not s or s.startswith("## ") or s.startswith(("* ", "- ")) or re.match(r'^\d+\.', s):
            continue
        s = avbold(s)
        m = re.match(r'(.+?[.!?])(\s|$)', s)
        return inline((m.group(1) if m else s).strip())
    return ""

def list_section(lines, label, klass="efter", orn=True):
    """'Av samma författare' / 'Vidare läsning': intro, **etiketter** och punkter.
    Systerböcker länkas i HTML (inte i md)."""
    def linka(li):
        for namn, url in SYSTRAR:
            if li.startswith("<strong>%s</strong>" % namn):
                return li.replace("<strong>%s</strong>" % namn,
                                  '<strong><a href="%s">%s</a></strong>' % (url, namn), 1)
        return li
    html = []; lst = []
    def fl():
        if lst:
            html.append('<ul class="books-list">%s</ul>'
                        % "".join("<li>"+linka(inline(x))+"</li>" for x in lst)); lst[:] = []
    for ln in lines:
        s = ln.strip()
        if not s: continue
        mbul = re.match(r'^[*\-]\s+(.*)$', s)
        if mbul:
            lst.append(mbul.group(1)); continue
        fl()
        sb = avbold(s)
        if s.startswith("**") and s.endswith("**"):
            html.append('<div class="extra-head">%s</div>' % inline(sb))
        else:
            html.append('<p>%s</p>' % inline(s))
    fl()
    orn_html = '    <div class="rule-orn">✦ ❋ ✦</div>\n' if orn else ''
    from bokfot import S_RUBRIK
    return ('  <section class="%s" id="%s">\n%s'
            '    <h2 style="%s">%s</h2>\n%s\n  </section>\n\n'
            % (klass, re.sub(r'\s+', '-', label.lower()), orn_html, S_RUBRIK, label, "\n".join(html)))

def timeline_section(lines):
    intro = []; rows = []
    for ln in lines:
        s = ln.strip()
        if not s: continue
        mbul = re.match(r'^[*\-]\s+(.*)$', s)
        if mbul:
            item = mbul.group(1)
            m = re.match(r'\*\*(.+?)\*\*\s*(.*)$', item)
            if m:
                rows.append('<div class="tl-row"><span class="tl-year">%s</span>'
                            '<span class="tl-text">%s</span></div>'
                            % (inline(m.group(1)), inline(m.group(2))))
            else:
                rows.append('<div class="tl-row"><span class="tl-text">%s</span></div>' % inline(item))
        else:
            intro.append(s)
    return ('  <section id="tidslinje">\n    <span class="label">Tidslinje</span>\n'
            '    <p class="intro">%s</p>\n    <div class="timeline">\n%s\n    </div>\n  </section>\n\n'
            % (inline(" ".join(intro)), "\n".join(rows)))

def persons_section(lines, label):
    intro = []; rows = []
    for ln in lines:
        s = ln.strip()
        if not s: continue
        mbul = re.match(r'^[*\-]\s+(.*)$', s)
        if mbul: rows.append('<p class="person">%s</p>' % inline(mbul.group(1)))
        else: intro.append(s)
    return ('  <section id="personer">\n    <span class="label">%s</span>\n'
            '    <p class="intro">%s</p>\n    <div class="persons">\n%s\n    </div>\n  </section>\n\n'
            % (label, inline(" ".join(intro)), "\n".join(rows)))

def timeline_inner(lines):
    rows = []
    for ln in lines:
        m0 = re.match(r'^[*\-]\s+(.*)$', ln.strip())
        if not m0: continue
        m = re.match(r'\*\*(.+?)\*\*\s*(.*)$', m0.group(1))
        if m:
            rows.append('<div class="tl-row"><span class="tl-year">%s</span>'
                        '<span class="tl-text">%s</span></div>'
                        % (inline(m.group(1)), inline(m.group(2))))
    return '<div class="timeline">%s</div>' % "".join(rows)

def persons_inner(lines):
    rows = []
    for ln in lines:
        m0 = re.match(r'^[*\-]\s+(.*)$', ln.strip())
        if m0: rows.append('<p class="person">%s</p>' % inline(m0.group(1)))
    return '<div class="persons">%s</div>' % "".join(rows)

# ── ändringslogg → md + html ────────────────────────────────────────────────
def logg_md(entries):
    if not entries: return ""
    out = ["# Ändringslogg", "",
           "Här kan du följa vad som ändrats i boken och när. "
           "Ändringar som rör fakta flaggas alltid.", ""]
    for e in entries:
        out.append("- %s – %s" % (e.get("datum", ""), e.get("text", "")))
    return "\n".join(out) + "\n"

def logg_section(entries):
    if not entries: return ""
    rows = "\n".join(
        '      <div class="logg-rad"><span class="logg-datum">%s</span>'
        '<span class="logg-text">%s</span></div>' % (e.get("datum", ""), inline(e.get("text", "")))
        for e in entries)
    return ('  <section class="andringslogg" id="andringslogg">\n'
            '    <span class="label" style="color:var(--taupe)">Ändringslogg</span>\n'
            '    <p class="intro">Här kan du följa vad som ändrats i boken och när. '
            'Ändringar som rör fakta flaggas alltid.</p>\n'
            '    <div class="logg">\n%s\n    </div>\n  </section>\n\n' % rows)

# ── omslag ─────────────────────────────────────────────────────────────────
def smid_omslag(spec):
    import math
    from PIL import Image, ImageDraw, ImageFont
    W, H = 1280, 800
    SERIF = "/System/Library/Fonts/Supplemental/Iowan Old Style.ttc"
    SANS  = "/System/Library/Fonts/Avenir Next.ttc"
    def sans(sz):
        for i in (0,1,2,3,4):
            try: return ImageFont.truetype(SANS, sz, index=i)
            except Exception: pass
        return ImageFont.truetype(SANS, sz)
    if spec["tema"] == "ljus":
        P = dict(bg=(246,241,231), eye=(138,129,114), roman=(35,32,26),
                 gold=(176,138,62), sub=(74,69,59), foot=(138,129,114))
    else:
        P = dict(bg=(27,25,21), eye=(150,140,122), roman=(236,230,216),
                 gold=(198,162,90), sub=(201,195,181), foot=(138,129,114))
    im = Image.new("RGB", (W,H), P["bg"]); d = ImageDraw.Draw(im); cx = W/2
    def tracked(y, txt, f, fill, tr):
        w = sum(d.textlength(c, font=f) + tr for c in txt) - (tr if txt else 0); x = cx - w/2
        for c in txt: d.text((x, y), c, font=f, fill=fill); x += d.textlength(c, font=f) + tr
    def star4(x, y, r, fill):
        d.polygon([(x,y-r),(x+r*.32,y-r*.32),(x+r,y),(x+r*.32,y+r*.32),(x,y+r),(x-r*.32,y+r*.32),(x-r,y),(x-r*.32,y-r*.32)], fill=fill)
    def aster(x, y, r, fill, wd=3):
        for k in range(6):
            a = math.pi/2 + k*math.pi/3; d.line([(x,y),(x+math.cos(a)*r, y-math.sin(a)*r)], fill=fill, width=wd)
    # radstorlek anpassas så långa titler får plats
    def fit(txt, start, lo=52):
        sz = start
        while sz > lo:
            f = ImageFont.truetype(SERIF, sz, index=1)
            if d.textlength(txt, font=f) <= W - 180: break
            sz -= 2
        return sz
    f_eye = sans(21); f_foot = sans(17)
    sz = fit(spec["cover_l2"], 80); sz = min(sz, fit(spec["cover_l1"], 80))
    f_rom = ImageFont.truetype(SERIF, sz, index=1); f_ita = ImageFont.truetype(SERIF, sz, index=2)
    f_sub = ImageFont.truetype(SERIF, 29, index=2)
    y = 168
    tracked(y, spec["cover_eye"], f_eye, P["eye"], 5); y += 70
    d.text((cx - d.textlength(spec["cover_l1"], font=f_rom)/2, y), spec["cover_l1"], font=f_rom, fill=P["roman"]); y += sz + 14
    d.text((cx - d.textlength(spec["cover_l2"], font=f_ita)/2, y), spec["cover_l2"], font=f_ita, fill=P["gold"]); y += sz + 38
    d.text((cx - d.textlength(spec["cover_sub"], font=f_sub)/2, y), spec["cover_sub"], font=f_sub, fill=P["sub"]); y += 66
    star4(cx-44, y+6, 9, P["gold"]); aster(cx, y+6, 10, P["gold"], 3); star4(cx+44, y+6, 9, P["gold"]); y += 60
    tracked(y, "AV ANNA MALMBERG · UR FÖRKLARA AI", f_foot, P["foot"], 3)
    im.save(ROOT + "/content/forklara-ai/bilder/" + spec["cover"])
    print("  omslag (%s): %s" % (spec["tema"], spec["cover"]))

# ── bygg en bok → (html, kort-lista) ───────────────────────────────────────
def bygg_en(spec):
    slug = spec["slug"]; URL = "%s/%s.html" % (BASE, slug)
    import urllib.parse
    IMG = "%s/content/forklara-ai/bilder/%s" % (BASE, urllib.parse.quote(spec["cover"]))
    src_md = io.open(spec["src"], encoding="utf-8").read()
    # Gemensam fot (enda källan = bokfot.py): klipp ev. gammal fot och sätt på den
    # delade. Så "ändra en bok/rad = ändras i alla nio". Foten ligger i md:n, så
    # "Dela med AI" (BOK_MD) == den publicerade .md:n == boken.
    from bokfot import fot_markdown
    m_fot = re.search(r'(?m)^#\s+\*{0,2}Av samma författare', src_md)
    if m_fot:
        src_md = src_md[:m_fot.start()]
    src_md = src_md.rstrip() + "\n\n" + fot_markdown()
    if "Creative Commons" not in src_md:
        src_md = src_md.rstrip() + ("\n\n---\n\n*Fri att läsa, dela och bygga vidare på under "
            "[Creative Commons CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). "
            "Nämn gärna Anna Malmberg och AiNNOVA.*\n")
    # ändringsvakt: stämpla dagens datum bara när texten faktiskt ändrats
    h = hashlib.sha1(src_md.encode("utf-8")).hexdigest()
    entries = LOGG.setdefault(slug, [])
    prev = STATE.get(slug)
    if prev is not None and prev != h and not any(e.get("datum") == TODAY for e in entries):
        entries.insert(0, {"datum": TODAY, "text": "Texten uppdaterad."})
        print("  · ändring upptäckt → ny loggrad %s (förfina gärna texten i andringslogg.json)" % TODAY)
    STATE[slug] = h
    # BOKEN HÅLLS REN — ändringsloggen ligger INTE i böckerna, så att "Dela med AI"
    # (BOK_MD) == den publicerade .md:n == boken du läser. Loggen skrivs separat.
    md = src_md
    io.open(ROOT + "/" + slug + ".md", "w", encoding="utf-8").write(md)

    # dela i topp-block på '# '
    blocks = []; title = None; cur = []
    for ln in md.split("\n"):
        m = re.match(r'^# (.+)$', ln)
        if m:
            if title is not None: blocks.append((title, cur))
            title = avbold(m.group(1)); cur = []
        else:
            cur.append(ln)
    if title is not None: blocks.append((title, cur))

    header = forord = howto = tidslinje = personer = avsamma = vidare = friatt = ainnova = ""
    chapters = []; toc_rows = []
    n_kap = n_mell = n_avsl = 0

    for h1, body in blocks:
        if h1.startswith("Drömmen"):                         # titelblock
            it = [avbold(l.strip().strip("*")) for l in body if l.strip()]
            subtitle = it[0] if it else ""
            ver = ""
            for x in it[1:]:
                if x.lower().startswith("senast") or "version" in x.lower(): ver = x
            ver = re.sub(r'\\([.()])', r'\1', ver).rstrip(".")
            header = (
                '  <header class="title fade">\n'
                '    <div class="mark">En bok ur Förklara AI</div>\n'
                '    <h1>%s</h1>\n'
                '    <div class="sub">%s</div>\n'
                '    <div class="rule-orn">✦ ❋ ✦</div>\n'
                '    <div class="by">av Anna Malmberg%s</div>\n'
                '  </header>\n\n' % (spec["title_html"], inline(subtitle),
                                     (" · " + inline(ver)) if ver else ""))
        elif h1 == "Förord":
            forord = ('  <section class="foreword" id="forord">\n'
                      '    <span class="label">Förord</span>\n    %s\n  </section>\n\n' % paras(body))
        elif h1 == "Så kan du använda boken":
            howto = ('  <section class="foreword" id="sa-kan-du">\n'
                     '    <span class="label">Så kan du använda boken</span>\n    %s\n  </section>\n\n' % paras(body))
        elif h1.startswith("Kapitel") or h1.startswith("Mellanspel") or h1.startswith("Avslutning"):
            parts = re.split(r'\s[–-]\s', h1, 1)
            left = parts[0].strip(); ttl = parts[1].strip() if len(parts) > 1 else ""
            bits = left.split(); kapword = bits[0]; numtok = bits[1] if len(bits) > 1 else ""
            if kapword == "Kapitel":
                n_kap += 1; rom = ROM_[int(numtok)-1]
                anchor = "kap-" + numtok; opennum = rom
                toc_rows.append('      <li><span class="n">%s</span><span class="t">'
                                '<a href="#%s">%s</a></span></li>' % (rom, anchor, inline(ttl)))
            elif kapword == "Mellanspel":
                n_mell += 1; anchor = "mellanspel-%d" % ROM2N.get(numtok, n_mell); opennum = numtok
                toc_rows.append('      <li><span class="n">✦</span><span class="t">'
                                '<a href="#%s">%s</a></span></li>' % (anchor, left + " — " + inline(ttl)))
            else:  # Avslutning
                n_avsl += 1; anchor = "avslutning"; opennum = "✦"
                toc_rows.append('      <li><span class="n">✦</span><span class="t">'
                                '<a href="#%s">Avslutning — %s</a></span></li>' % (anchor, inline(ttl)))
            chapters.append(
                '  <section id="%s">\n    <div class="opener" data-rubrik="%s">\n'
                '      <div class="num">%s</div>\n      <div class="kap">%s</div>\n'
                '      <h2>%s</h2>\n    </div>\n    <div class="ford">\n%s\n    </div>\n  </section>\n'
                % (anchor, h1.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;"),
                   opennum, kapword, inline(ttl), chapter_body(body)))
        elif h1 == "Tidslinje":
            tidslinje = timeline_section(body)
        elif h1.startswith("Personer"):
            personer = persons_section(body, h1)
        elif h1 == "Av samma författare":
            avsamma = list_section(body, "Av samma författare")
        elif h1 == "Vidare läsning":
            vidare = list_section(body, "Vidare läsning", orn=False)
        elif h1 == "Fri att läsa och dela":
            friatt = list_section(body, "Fri att läsa och dela", orn=False)
        elif h1 == "Om AiNNOVA":
            ainnova = list_section(body, "Om AiNNOVA", orn=False)

    # dynamisk TOC-rubrik
    bitar = ["%s kapitel" % RAKNEORD.get(n_kap, n_kap)]
    if n_mell: bitar.append(("ett" if n_mell == 1 else "två") + " mellanspel")
    if n_avsl: bitar.append("en avslutning")
    toc_rubrik = bitar[0] if len(bitar) == 1 else ", ".join(bitar[:-1]) + " och " + bitar[-1]
    toc = ('  <section class="toc" id="innehall">\n    <span class="label">Innehåll</span>\n'
           '    <h2 class="h">%s</h2>\n    <ol>\n%s\n    </ol>\n  </section>\n\n'
           % (toc_rubrik[0].upper() + toc_rubrik[1:], "\n".join(toc_rows)))

    colophon = ('  <div class="colophon">\n'
                '    Av Anna Malmberg<br>\n    Fri att läsa, skriva ut och dela. ✦\n  </div>\n')

    # head ur motvikten
    mot = io.open(ROOT + "/motvikten.html", encoding="utf-8").read()
    head = mot[:mot.index("</head>")]
    rentitel = re.sub(r'<[^>]+>', '', spec["title_html"])
    repl = [
      (r'<title>.*?</title>', '<title>%s</title>' % rentitel),
      (r'<meta name="description"[^>]*>', '<meta name="description" content="%s — av Anna Malmberg, ur Förklara AI.">' % rentitel),
      (r'<meta property="og:title"[^>]*>', '<meta property="og:title" content="%s">' % rentitel),
      (r'<meta property="og:description"[^>]*>', '<meta property="og:description" content="En bok ur Förklara AI av Anna Malmberg.">'),
      (r'<meta property="og:url"[^>]*>', '<meta property="og:url" content="%s">' % URL),
      (r'<meta property="og:image"[^>]*>', '<meta property="og:image" content="%s">' % IMG),
      (r'<meta property="og:image:alt"[^>]*>', '<meta property="og:image:alt" content="Omslag: %s">' % rentitel),
      (r'<link rel="canonical"[^>]*>', '<link rel="canonical" href="%s">' % URL),
      (r'<meta name="twitter:title"[^>]*>', '<meta name="twitter:title" content="%s">' % rentitel),
      (r'<meta name="twitter:description"[^>]*>', '<meta name="twitter:description" content="En bok ur Förklara AI av Anna Malmberg.">'),
      (r'<meta name="twitter:image"[^>]*>', '<meta name="twitter:image" content="%s">' % IMG),
      (r'<meta name="apple-mobile-web-app-title"[^>]*>', '<meta name="apple-mobile-web-app-title" content="%s">' % spec["app"]),
    ]
    for pat, rep in repl:
        head = re.sub(pat, rep.replace("\\", "\\\\"), head, count=1, flags=re.S)
    EXTRA_CSS = """
  /* ---- Drömmen-trilogin: tidslinje, personregister, boklista ---- */
  .timeline{margin:10px 0 0;}
  .tl-row{display:flex;gap:16px;align-items:baseline;padding:9px 0;border-top:1px solid var(--hair);}
  .tl-row:last-child{border-bottom:1px solid var(--hair);}
  .tl-year{font-family:var(--sans);font-size:12.5px;font-weight:700;letter-spacing:.02em;color:var(--gold);min-width:150px;flex:none;}
  .tl-text{color:var(--ink);}
  .persons{columns:2;column-gap:36px;margin:12px 0 0;}
  .person{break-inside:avoid;margin:0 0 .7em;font-size:15.5px;line-height:1.5;}
  .person strong{color:var(--green);}
  .person em{color:var(--taupe);font-style:italic;}
  .books-list{list-style:none;margin:16px 0 0;padding:0;}
  .books-list li{padding:11px 0;border-top:1px solid var(--hair);font-size:19px;}
  .books-list li:last-child{border-bottom:1px solid var(--hair);}
  .books-list a{color:var(--green);}
  .efter .extra-head{font-family:var(--sans);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin:22px 0 2px;}
  .ford ol{margin:1em 0;padding-left:1.4em;}
  .ford ol li{margin:.5em 0;}
  .intro{color:var(--ink-soft);font-style:italic;max-width:none;}
  .toc .t a{color:inherit;}
  @media(max-width:620px){.persons{columns:1;}.tl-year{min-width:92px;}}
  @media print{.persons{columns:2;}.tl-row,.person{page-break-inside:avoid;}}
  .logg{margin:10px 0 0;}
  .logg-rad{display:flex;gap:16px;align-items:baseline;padding:9px 0;border-top:1px solid var(--hair);}
  .logg-rad:last-child{border-bottom:1px solid var(--hair);}
  .logg-datum{font-family:var(--sans);font-size:12.5px;font-weight:700;letter-spacing:.02em;color:var(--gold);min-width:110px;flex:none;}
  .logg-text{color:var(--ink);}
  @media(max-width:620px){.logg-datum{min-width:84px;}}
  @media print{.logg-rad{page-break-inside:avoid;}}
"""
    head = head.replace("</style>", EXTRA_CSS + "\n</style>")

    buttons = ('<button class="dela-ai" id="delaai" title="Kopiera hela boken som Markdown — klistra in i valfri AI">Dela med AI</button>\n'
               '<button class="skriv-ut" id="skrivut" title="Skriv ut hela boken">Skriv ut</button>\n'
               '<button class="tema-vaxel" id="tema" title="Ljust eller mörkt läge">☀</button>\n')
    md_js = json.dumps(md, ensure_ascii=False).replace("</", "<\\/")
    tail = """
<script>window.BOK_MD = %s;</script>
<script>
(function(){
  var KEY="forklara-ai:tema", b=document.getElementById("tema");
  function paint(){var d=document.documentElement.dataset.theme==="dark"; if(b)b.textContent=d?"\\u2600":"\\u263e";}
  paint();
  if(b)b.addEventListener("click",function(){
    var next=document.documentElement.dataset.theme==="dark"?"light":"dark";
    document.documentElement.dataset.theme=next;
    try{localStorage.setItem(KEY,next);}catch(e){}
    paint();
  });
  var su=document.getElementById("skrivut");
  if(su)su.addEventListener("click",function(){window.print();});
  var da=document.getElementById("delaai");
  if(da)da.addEventListener("click",function(){
    var md=window.BOK_MD||"", o=da.textContent;
    function done(){da.textContent="Kopierat \\u2713"; setTimeout(function(){da.textContent=o;},1800);}
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(md).then(done).catch(function(){window.open("%s.md","_blank");});
    } else { window.open("%s.md","_blank"); }
  });
})();
</script>
</body>
</html>
""" % (md_js, slug, slug)

    out = (head + "</head>\n<body>\n" + buttons + '<div class="wrap">\n\n'
           + header + forord + howto + toc + "".join(chapters) + "\n"
           + tidslinje + personer + avsamma + vidare + friatt + ainnova + colophon + "\n</div>\n" + tail)
    io.open(ROOT + "/" + slug + ".html", "w", encoding="utf-8").write(out)
    from lagg_docs_knapp import installera; installera(ROOT + "/" + slug + ".html")
    from cc_licens import stampla; stampla(ROOT + "/" + slug + ".html")
    from lagg_sok import installera as installera_sok; installera_sok(ROOT + "/" + slug + ".html")

    print("  %-18s %d tecken | kap %d · mell %d · avsl %d | TOC %d | KYR %d"
          % (slug + ".html", len(out), n_kap, n_mell, n_avsl, len(toc_rows),
             sum(1 for c in out if c in KYR)))
    renderad = out.split("<script>window.BOK_MD")[0]   # utan den inbäddade råa md:n
    assert out.count("<section") == out.count("</section>"), "section-obalans i " + slug
    assert renderad.count("<em>") == renderad.count("</em>"), "em-obalans i " + slug
    assert renderad.count("<strong>") == renderad.count("</strong>"), "strong-obalans i " + slug
    assert "**" not in renderad, "** läckte i renderad HTML i " + slug
    assert "\\." not in renderad.replace("\\\\", ""), "backslash-escape läckte i " + slug
    smid_omslag(spec)

    # ── sektionskort ──
    sakan  = next((b for h, b in blocks if h == "Så kan du använda boken"), [])
    fbody  = next((b for h, b in blocks if h == "Förord"), [])
    fford  = paras(fbody)
    if sakan:
        fford += ('\n<hr>\n<div class="section"><div class="section-head">'
                  '<span class="concept">Så kan du använda boken</span></div>'
                  '<div class="body">' + paras(sakan) + '</div></div>')
    specs = [["%s-0" % spec["sek_id"], "Förord", first_sentence(fbody), fford, [], "forord"]]
    for h1, body in blocks:
        if h1.startswith("Kapitel"):
            parts = re.split(r'\s[–-]\s', h1, 1); ttl = parts[1].strip() if len(parts) > 1 else ""
            numtok = parts[0].split()[1]
            specs.append(["%s-%s" % (spec["sek_id"], numtok), "Kapitel %s · %s" % (numtok, ttl),
                          first_sentence(body), chapter_body(body), subtitles(body), "kap-%s" % numtok])
        elif h1.startswith("Mellanspel"):
            parts = re.split(r'\s[–-]\s', h1, 1); ttl = parts[1].strip() if len(parts) > 1 else ""
            bits = parts[0].split(); numtok = bits[1] if len(bits) > 1 else ""
            etikett = ("Mellanspel %s — %s" % (numtok, ttl)) if numtok else ("Mellanspel — %s" % ttl)
            prev = specs[-1]
            prev[3] += ('\n<hr>\n<div class="extra-head">%s</div>\n%s' % (etikett, chapter_body(body)))
            prev[4] = prev[4] + subtitles(body)
        elif h1.startswith("Avslutning"):
            parts = re.split(r'\s[–-]\s', h1, 1); ttl = parts[1].strip() if len(parts) > 1 else ""
            specs.append(["%s-avslutning" % spec["sek_id"], "Avslutning · " + ttl,
                          first_sentence(body), chapter_body(body), subtitles(body), "avslutning"])
        elif h1 == "Tidslinje":
            specs.append(["%s-tidslinje" % spec["sek_id"], "Tidslinje", first_sentence(body), timeline_inner(body), [], "tidslinje"])
        elif h1.startswith("Personer"):
            specs.append(["%s-personer" % spec["sek_id"], h1, first_sentence(body), persons_inner(body), [], "personer"])

    kort = []
    for idx, (cid, titel, svar, ford, begrepp, anchor) in enumerate(specs):
        lankar = []
        if idx > 0: p = specs[idx-1]; lankar.append(["◂ " + p[1], "#" + p[0], "", "Kapitel"])
        if idx < len(specs) - 1: n = specs[idx+1]; lankar.append([n[1] + " ▸", "#" + n[0], "", "Kapitel"])
        lankar.append(["Läs i boken ▸", "%s.html#%s" % (slug, anchor), "Hela avsnittet i bokform.", "Läs som bok"])
        lankar.append(["Hela boken – %s" % rentitel, "%s.html" % slug, "Läs allt, skriv ut, eller Dela med AI.", "Läs som bok"])
        for nb in spec["notebooklm"]: lankar.append(list(nb))
        kort.append({"id": cid, "sektion": spec["sek_id"], "titel": titel, "begrepp": begrepp,
                     "anteckningar": "", "lankar": lankar, "bilder": [spec["cover"]],
                     "svar": svar or titel, "fordjupning": ford})
    print("    sektion '%s': %d kort → %s" % (spec["sek_id"], len(kort), [k["id"] for k in kort]))
    return kort


# ── kör alla tre + EN manifest-uppdatering ─────────────────────────────────
if __name__ == "__main__":
    alla_kort = []
    for spec in BOCKER:
        print("\n━━━ %s ━━━" % spec["sek_id"])
        alla_kort += bygg_en(spec)

    MAN = ROOT + "/content/forklara-ai/manifest.js"
    s = io.open(MAN, encoding="utf-8").read()
    PRE = "window.LECTURE = "
    h2, t2 = s[:s.index(PRE) + len(PRE)], s[s.rfind(";"):]
    L = json.loads(s[s.index(PRE) + len(PRE):s.rfind(";")])

    sek_ids = [b["sek_id"] for b in BOCKER]
    # rensa gamla trilogi-kort + ev. pekarkort
    L["kort"] = [k for k in L["kort"]
                 if not str(k.get("id", "")).startswith("drommen") and k.get("id") != "mer-drommen"]
    for k in L["kort"]:
        if isinstance(k.get("relaterat"), list):
            k["relaterat"] = [r for r in k["relaterat"] if r != "mer-drommen"]
    # sätt in korten efter sista 'rorelse'-kortet
    sist = max((i for i, k in enumerate(L["kort"]) if str(k.get("sektion")) == "rorelse"),
               default=len(L["kort"]) - 1)
    L["kort"][sist + 1:sist + 1] = alla_kort

    # sektions-metadata: 13/14/15 direkt efter 'rorelse'
    L["sektioner"] = [sek for sek in L["sektioner"] if sek.get("id") not in sek_ids]
    ri = next((i for i, sek in enumerate(L["sektioner"]) if sek.get("id") == "rorelse"), len(L["sektioner"]) - 1)
    for off, b in enumerate(BOCKER):
        L["sektioner"].insert(ri + 1 + off,
            {"id": b["sek_id"], "namn": b["sek_namn"], "bakom": True, "nyckel": None})

    man_out = h2 + json.dumps(L, ensure_ascii=False, indent=2) + t2
    json.loads(man_out[man_out.index(PRE) + len(PRE):man_out.rfind(";")])
    assert sum(1 for c in man_out if c in KYR) == 0, "KYR i manifest!"
    io.open(MAN, "w", encoding="utf-8").write(man_out)
    print("\n✦ MANIFEST: %d kort i tre sektioner (%s)" % (len(alla_kort), ", ".join(sek_ids)))
    print("  KYR i manifest:", sum(1 for c in man_out if c in KYR))

    io.open(LOGG_PATH, "w", encoding="utf-8").write(json.dumps(LOGG, ensure_ascii=False, indent=2) + "\n")
    io.open(STATE_PATH, "w", encoding="utf-8").write(json.dumps(STATE, ensure_ascii=False, indent=2) + "\n")
    print("  ändringslogg + state sparade")

    # läsbar, SEPARAT ändringslogg i sanningsmappen (ligger medvetet INTE i böckerna)
    TITLAR = {"drommen": "Drömmen om den tänkande maskinen",
              "drommen-nu": "Drömmen och var vi står",
              "drommen-stovlarna": "Drömmen med stövlarna på"}
    rader = ["# Ändringslogg – Drömmen-trilogin", "",
             "Vad som ändrats i böckerna och när. Detta är en separat logg; den ligger "
             "medvetet INTE i själva böckerna, så att \"Dela med AI\" och utskriften "
             "alltid är ren boktext.", ""]
    for b in BOCKER:
        s = b["slug"]; es = LOGG.get(s, [])
        rader += ["## " + TITLAR.get(s, s), ""]
        rader += (["- %s – %s" % (e.get("datum", ""), e.get("text", "")) for e in es]
                  or ["- (inget loggat än)"])
        rader += [""]
    LOGG_MD = os.path.join(os.path.dirname(SRC), "Ändringslogg.md")
    io.open(LOGG_MD, "w", encoding="utf-8").write("\n".join(rader) + "\n")
    print("  separat läsbar ändringslogg:", LOGG_MD)

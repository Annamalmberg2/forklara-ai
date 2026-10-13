#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bygg drommen.html — 'Drömmen om den tänkande maskinen' som bok.

Till skillnad från de andra böckerna är MARKDOWN-filen originalet (så sa
överlämningen). Pipeline: läs md → fixa länkar/[länk kommer] → konvertera
till husets HTML (CSS lånad från motvikten.html) → bädda in den ORDAGRANNA
markdownen så 'Dela med AI' ger exakt originalet → smid omslag.

  python3 scripts/bygg_drommen.py
"""
import io, re, json, math

ROOT = "/Users/ainnova/Projects/forklara-ai"
SRC  = "/Users/ainnova/Downloads/Drommen_om_den_tankande_maskinen.md"
URL  = "https://annamalmberg2.github.io/forklara-ai/drommen.html"
IMG  = "https://annamalmberg2.github.io/forklara-ai/content/forklara-ai/bilder/Dr%C3%B6mmen.png"

# ---- 1. läs + processa markdownen -----------------------------------------
md = io.open(SRC, encoding="utf-8").read()

# [länk kommer] → publiceringsadressen (öppen punkt i överlämningen)
md = md.replace("[länk kommer]", URL)

# FIX: 'Av samma författare'-länkarna var förväxlade (En rörelse↔Ett parti)
md = md.replace(
    "[En rörelse](https://annamalmberg2.github.io/forklara-ai/index.html#motvikten-0)",
    "[En rörelse](https://annamalmberg2.github.io/forklara-ai/index.html#rorelse-0)")
md = md.replace(
    "[Ett parti](https://annamalmberg2.github.io/forklara-ai/index.html#rorelse-0)",
    "[Ett parti](https://annamalmberg2.github.io/forklara-ai/index.html#motvikten-0)")

# CC BY 4.0-märkning sist (följer med i "Dela med AI")
md = md.rstrip() + ("\n\n---\n\n*Fri att läsa, dela och bygga vidare på under "
    "[Creative Commons CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). "
    "Nämn gärna Anna Malmberg och Förklara AI.*\n")

# spara den processade markdownen som bokens original i repot
io.open(ROOT + "/drommen.md", "w", encoding="utf-8").write(md)

# ---- 2. inline + block-konvertering ---------------------------------------
def inline(t):
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'\*(.+?)\*', r'<em>\1</em>', t)
    return t

def paras(lines):
    out = []; para = []; lst = []
    def fp():
        if para: out.append("<p>" + inline(" ".join(para).strip()) + "</p>"); para[:] = []
    def fl():
        if lst: out.append("<ul>" + "".join("<li>"+inline(x)+"</li>" for x in lst) + "</ul>"); lst[:] = []
    for ln in lines:
        s = ln.rstrip()
        if not s.strip():
            fp(); fl(); continue
        if s.lstrip().startswith("- "):
            fp(); lst.append(s.lstrip()[2:])
        else:
            fl(); para.append(s.strip())
    fp(); fl()
    return "".join(out)

def chapter_body(lines):
    subs = []; sh = None; buf = []
    for ln in lines:
        m = re.match(r'^## (.+)$', ln)
        if m:
            if sh is not None or buf: subs.append((sh, buf))
            sh = m.group(1).strip(); buf = []
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

# ---- 3. dela upp md i topp-block (# rubriker) -----------------------------
blocks = []; title = None; cur = []
for ln in md.split("\n"):
    m = re.match(r'^# (.+)$', ln)
    if m:
        if title is not None: blocks.append((title, cur))
        title = m.group(1).strip(); cur = []
    else:
        cur.append(ln)
if title is not None: blocks.append((title, cur))

# ---- 4. rendera blocken i ordning + samla TOC -----------------------------
ROM2N = {"I": 1, "II": 2, "III": 3}
header_html = forord = howto = tidslinje = personer = avsamma = ""
chapters_html = []
toc_rows = []
ROM_ = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]  # stiligare kapitelnr

def esc_attr(t): return t

for h1, body in blocks:
    if h1.startswith("Drömmen om den"):           # titelblock
        it = [l.strip().strip("*") for l in body if l.strip()]
        subtitle = it[0] if len(it) > 0 else ""
        version  = it[2] if len(it) > 2 else "Version 1, oktober 2026"
        header_html = (
            '  <header class="title fade">\n'
            '    <div class="mark">En bok ur Förklara AI</div>\n'
            '    <h1>Drömmen om den <span class="em">tänkande</span> maskinen</h1>\n'
            '    <div class="sub">%s</div>\n'
            '    <div class="rule-orn">✦ ❋ ✦</div>\n'
            '    <div class="by">av Anna Malmberg · %s</div>\n'
            '  </header>\n\n' % (inline(subtitle), inline(version)))
    elif h1 == "Förord":
        forord = ('  <section class="foreword" id="forord">\n'
                  '    <span class="label">Förord</span>\n    %s\n  </section>\n\n'
                  % paras(body))
    elif h1 == "Så kan du använda boken":
        howto = ('  <section class="foreword" id="sa-kan-du">\n'
                 '    <span class="label">Så kan du använda boken</span>\n    %s\n  </section>\n\n'
                 % paras(body))
    elif h1.startswith("Kapitel") or h1.startswith("Mellanspel"):
        parts = re.split(r'\s[–-]\s', h1, 1)
        left = parts[0].strip(); ttl = parts[1].strip() if len(parts) > 1 else ""
        bits = left.split()
        kapword = bits[0]; numtok = bits[1] if len(bits) > 1 else ""
        if kapword == "Kapitel":
            rom = ROM_[int(numtok) - 1]
            anchor = "kap-" + numtok; tocnum = rom; opennum = rom
        else:
            anchor = "mellanspel-%d" % ROM2N.get(numtok, 0); tocnum = "✦"; opennum = numtok
        chapters_html.append(
            '  <section id="%s">\n'
            '    <div class="opener">\n'
            '      <div class="num">%s</div>\n'
            '      <div class="kap">%s</div>\n'
            '      <h2>%s</h2>\n'
            '    </div>\n'
            '    <div class="ford">\n%s\n    </div>\n'
            '  </section>\n' % (anchor, opennum, kapword, inline(ttl), chapter_body(body)))
        toc_label = inline(ttl) if kapword == "Kapitel" else (left + " — " + inline(ttl))
        toc_rows.append('      <li><span class="n">%s</span>'
                        '<span class="t"><a href="#%s">%s</a></span></li>'
                        % (tocnum, anchor, toc_label))
    elif h1 == "Tidslinje":
        intro = []; rows = []
        for ln in body:
            s = ln.strip()
            if not s: continue
            if s.startswith("- "):
                item = s[2:]
                m = re.match(r'\*\*(.+?)\*\*\s*(.*)$', item)
                if m:
                    rows.append('<div class="tl-row"><span class="tl-year">%s</span>'
                                '<span class="tl-text">%s</span></div>'
                                % (inline(m.group(1)), inline(m.group(2))))
                else:
                    rows.append('<div class="tl-row"><span class="tl-text">%s</span></div>' % inline(item))
            else:
                intro.append(s)
        tidslinje = ('  <section id="tidslinje">\n    <span class="label">Tidslinje</span>\n'
                     '    <p class="intro">%s</p>\n    <div class="timeline">\n%s\n    </div>\n  </section>\n\n'
                     % (inline(" ".join(intro)), "\n".join(rows)))
    elif h1 == "Personer i boken":
        intro = []; rows = []
        for ln in body:
            s = ln.strip()
            if not s: continue
            if s.startswith("- "):
                rows.append('<p class="person">%s</p>' % inline(s[2:]))
            else:
                intro.append(s)
        personer = ('  <section id="personer">\n    <span class="label">Personer i boken</span>\n'
                    '    <p class="intro">%s</p>\n    <div class="persons">\n%s\n    </div>\n  </section>\n\n'
                    % (inline(" ".join(intro)), "\n".join(rows)))
    elif h1 == "Av samma författare":
        intro = []; links = []
        for ln in body:
            s = ln.strip()
            if not s: continue
            if s.startswith("- "):
                links.append('<li>%s</li>' % inline(s[2:]))
            else:
                intro.append(s)
        avsamma = ('  <section class="efter" id="av-samma">\n'
                   '    <div class="rule-orn">✦ ❋ ✦</div>\n'
                   '    <span class="label" style="color:var(--taupe)">Av samma författare</span>\n'
                   '    <p>%s</p>\n    <ul class="books-list">\n%s\n    </ul>\n  </section>\n\n'
                   % (inline(" ".join(intro)), "\n".join(links)))

toc = ('  <section class="toc" id="innehall">\n'
       '    <span class="label">Innehåll</span>\n'
       '    <h2 class="h">Tolv kapitel och två mellanspel</h2>\n'
       '    <ol>\n%s\n    </ol>\n  </section>\n\n' % "\n".join(toc_rows))

colophon = ('  <div class="colophon">\n'
            '    Drömmen om den tänkande maskinen · Version 1, oktober 2026<br>\n'
            '    Av Anna Malmberg · ur Förklara AI<br>\n'
            '    Fri att läsa, skriva ut och dela. ✦\n  </div>\n')

# ---- 5. head (CSS ur motvikten) + extra CSS -------------------------------
mot = io.open(ROOT + "/motvikten.html", encoding="utf-8").read()
head = mot[:mot.index("</head>")]

repl = [
 (r'<title>.*?</title>', '<title>Drömmen om den tänkande maskinen</title>'),
 (r'<meta name="description"[^>]*>', '<meta name="description" content="Drömmen om den tänkande maskinen — tretusen år av tankar om AI, från världens alla hörn. Av Anna Malmberg.">'),
 (r'<meta property="og:title"[^>]*>', '<meta property="og:title" content="Drömmen om den tänkande maskinen">'),
 (r'<meta property="og:description"[^>]*>', '<meta property="og:description" content="Tretusen år av tankar om AI, från världens alla hörn. Av Anna Malmberg.">'),
 (r'<meta property="og:url"[^>]*>', '<meta property="og:url" content="%s">' % URL),
 (r'<meta property="og:image"[^>]*>', '<meta property="og:image" content="%s">' % IMG),
 (r'<meta property="og:image:width"[^>]*>', '<meta property="og:image:width" content="1280">'),
 (r'<meta property="og:image:height"[^>]*>', '<meta property="og:image:height" content="800">'),
 (r'<meta property="og:image:alt"[^>]*>', '<meta property="og:image:alt" content="Omslag: Drömmen om den tänkande maskinen">'),
 (r'<link rel="canonical"[^>]*>', '<link rel="canonical" href="%s">' % URL),
 (r'<meta name="twitter:title"[^>]*>', '<meta name="twitter:title" content="Drömmen om den tänkande maskinen">'),
 (r'<meta name="twitter:description"[^>]*>', '<meta name="twitter:description" content="Tretusen år av tankar om AI, från världens alla hörn. Av Anna Malmberg.">'),
 (r'<meta name="twitter:image"[^>]*>', '<meta name="twitter:image" content="%s">' % IMG),
 (r'<meta name="apple-mobile-web-app-title"[^>]*>', '<meta name="apple-mobile-web-app-title" content="Drömmen">'),
]
for pat, rep in repl:
    head = re.sub(pat, rep.replace("\\", "\\\\"), head, count=1, flags=re.S)

EXTRA_CSS = """
  /* ---- Drömmen: tidslinje, personregister, boklista ---- */
  .timeline{margin:10px 0 0;}
  .tl-row{display:flex;gap:16px;align-items:baseline;padding:9px 0;border-top:1px solid var(--hair);}
  .tl-row:last-child{border-bottom:1px solid var(--hair);}
  .tl-year{font-family:var(--sans);font-size:12.5px;font-weight:700;letter-spacing:.02em;color:var(--gold);min-width:120px;flex:none;}
  .tl-text{color:var(--ink);}
  .persons{columns:2;column-gap:36px;margin:12px 0 0;}
  .person{break-inside:avoid;margin:0 0 .7em;font-size:15.5px;line-height:1.5;}
  .person strong{color:var(--green);}
  .person em{color:var(--taupe);font-style:italic;}
  .books-list{list-style:none;margin:16px 0 0;padding:0;}
  .books-list li{padding:11px 0;border-top:1px solid var(--hair);font-size:20px;}
  .books-list li:last-child{border-bottom:1px solid var(--hair);}
  .books-list a{color:var(--green);}
  .intro{color:var(--ink-soft);font-style:italic;max-width:none;}
  .toc .t a{color:inherit;}
  @media(max-width:620px){.persons{columns:1;}.tl-year{min-width:92px;}}
  @media print{.persons{columns:2;}.tl-row,.person{page-break-inside:avoid;}}
"""
head = head.replace("</style>", EXTRA_CSS + "\n</style>")

# ---- 6. knappar + tail-script (ren: tema + skriv ut + dela ordagrann md) ---
buttons = ('<button class="dela-ai" id="delaai" title="Kopiera hela boken som Markdown — klistra in i valfri AI">Dela med AI</button>\n'
           '<button class="skriv-ut" id="skrivut" title="Skriv ut hela boken">Skriv ut</button>\n'
           '<button class="tema-vaxel" id="tema" title="Ljust eller mörkt läge">☀</button>\n')

md_js = json.dumps(md, ensure_ascii=False).replace("</", "<\\/")
tail = """
<script>window.BOK_MD = %s;</script>
<script>
(function(){
  var KEY="forklara-ai:tema", b=document.getElementById("tema");
  function paint(){var d=document.documentElement.dataset.theme==="dark"; if(b)b.textContent=d?"☀":"☾";}
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
      navigator.clipboard.writeText(md).then(done).catch(function(){window.open("drommen.md","_blank");});
    } else { window.open("drommen.md","_blank"); }
  });
})();
</script>
</body>
</html>
""" % md_js

# ---- 7. montera + skriv ----------------------------------------------------
out = (head + "</head>\n<body>\n" + buttons + '<div class="wrap">\n\n'
       + header_html + forord + howto + toc
       + "".join(chapters_html) + "\n" + tidslinje + personer + avsamma
       + colophon + "\n</div>\n" + tail)
io.open(ROOT + "/drommen.html", "w", encoding="utf-8").write(out)
from lagg_docs_knapp import installera          # Kopiera för Google Docs-knapp
installera(ROOT + "/drommen.html")
from cc_licens import stampla
stampla(ROOT + "/drommen.html")

# ---- 8. validering ---------------------------------------------------------
kyr = set("аеорсухіјѕАЕОРСТНКМВ")
print("skrev drommen.html:", len(out), "tecken")
print("sections:", out.count("<section"), "/", out.count("</section>"),
      "| opener:", out.count('class="opener"'),
      "| kapitel+mellanspel:", len(chapters_html))
print("em open/close:", out.count("<em>"), out.count("</em>"),
      "| strong:", out.count("<strong>"), out.count("</strong>"))
print("KYR homoglyfer:", sum(1 for c in out if c in kyr))
print("TOC-rader:", len(toc_rows))

# ---- 9. generera sektion "13 · Drömmen" som KORT i manifestet --------------
COVER = "Drömmen.png"

# ---- omslag (LJUS, för alterneringen MÖRK/LJUS i översikten) --------------
def _smid_omslag(tema="ljus"):
    import math
    from PIL import Image, ImageDraw, ImageFont
    W, H = 1280, 800
    SERIF = "/System/Library/Fonts/Supplemental/Iowan Old Style.ttc"
    SANS  = "/System/Library/Fonts/Avenir Next.ttc"
    def sans(sz):
        for i in (0, 1, 2, 3, 4):
            try: return ImageFont.truetype(SANS, sz, index=i)
            except Exception: pass
        return ImageFont.truetype(SANS, sz)
    if tema == "ljus":
        P = dict(bg=(246,241,231), eye=(138,129,114), roman=(35,32,26),
                 gold=(176,138,62), sub=(74,69,59), foot=(138,129,114))
    else:
        P = dict(bg=(27,25,21), eye=(150,140,122), roman=(236,230,216),
                 gold=(198,162,90), sub=(201,195,181), foot=(138,129,114))
    im = Image.new("RGB", (W, H), P["bg"]); d = ImageDraw.Draw(im); cx = W/2
    def tracked(y, txt, f, fill, tr):
        w = sum(d.textlength(c, font=f) + tr for c in txt) - (tr if txt else 0); x = cx - w/2
        for c in txt: d.text((x, y), c, font=f, fill=fill); x += d.textlength(c, font=f) + tr
    def star4(x, y, r, fill):
        d.polygon([(x,y-r),(x+r*.32,y-r*.32),(x+r,y),(x+r*.32,y+r*.32),(x,y+r),(x-r*.32,y+r*.32),(x-r,y),(x-r*.32,y-r*.32)], fill=fill)
    def aster(x, y, r, fill, wd=3):
        for k in range(6):
            a = math.pi/2 + k*math.pi/3; d.line([(x,y),(x+math.cos(a)*r, y-math.sin(a)*r)], fill=fill, width=wd)
    f_eye = sans(21); f_rom = ImageFont.truetype(SERIF, 80, index=1); f_ita = ImageFont.truetype(SERIF, 80, index=2)
    f_sub = ImageFont.truetype(SERIF, 29, index=2); f_foot = sans(17)
    y = 168
    tracked(y, "TRETUSEN ÅR AV TANKAR OM AI", f_eye, P["eye"], 6); y += 70
    l1 = "Drömmen om den"; d.text((cx - d.textlength(l1, font=f_rom)/2, y), l1, font=f_rom, fill=P["roman"]); y += 94
    l2 = "tänkande maskinen"; d.text((cx - d.textlength(l2, font=f_ita)/2, y), l2, font=f_ita, fill=P["gold"]); y += 118
    sub = "Från smedjan till nattduksbordet."; d.text((cx - d.textlength(sub, font=f_sub)/2, y), sub, font=f_sub, fill=P["sub"]); y += 66
    star4(cx-44, y+6, 9, P["gold"]); aster(cx, y+6, 10, P["gold"], 3); star4(cx+44, y+6, 9, P["gold"]); y += 60
    tracked(y, "AV ANNA MALMBERG · UR FÖRKLARA AI", f_foot, P["foot"], 3)
    im.save(ROOT + "/content/forklara-ai/bilder/" + COVER)
    print("omslag (%s):" % tema, COVER)

_smid_omslag("ljus")


def first_sentence(lines):
    for ln in lines:
        s = ln.strip()
        if not s or s.startswith("## ") or s.startswith("- "):
            continue
        m = re.match(r'(.+?[.!?])(\s|$)', s)
        return (m.group(1) if m else s).strip()
    return ""

def subtitles(lines):
    out = []
    for ln in lines:
        m = re.match(r'^## (.+)$', ln)
        if m: out.append(m.group(1).strip())
    return out

def timeline_inner(lines):
    rows = []
    for ln in lines:
        s = ln.strip()
        if s.startswith("- "):
            m = re.match(r'\*\*(.+?)\*\*\s*(.*)$', s[2:])
            if m:
                rows.append('<div class="tl-row"><span class="tl-year">%s</span>'
                            '<span class="tl-text">%s</span></div>'
                            % (inline(m.group(1)), inline(m.group(2))))
    return '<div class="timeline">%s</div>' % "".join(rows)

def persons_inner(lines):
    rows = []
    for ln in lines:
        s = ln.strip()
        if s.startswith("- "):
            rows.append('<p class="person">%s</p>' % inline(s[2:]))
    return '<div class="persons">%s</div>' % "".join(rows)

# Förord + "Så kan du använda boken" → ETT förordskort (drommen-0, som en-bibel-0)
sakan_body  = next((b for h, b in blocks if h == "Så kan du använda boken"), [])
forord_body = next((b for h, b in blocks if h == "Förord"), [])
forord_ford = (paras(forord_body)
    + '\n<hr>\n<div class="section"><div class="section-head">'
      '<span class="concept">Så kan du använda boken</span></div>'
      '<div class="body">' + paras(sakan_body) + '</div></div>')

specs = []   # [id, titel, svar, fordjupning, begrepp, bokanchor] — listor (muterbara)
specs.append(["drommen-0", "Förord", first_sentence(forord_body), forord_ford, [], "forord"])
for h1, body in blocks:
    if h1.startswith("Kapitel"):
        parts = re.split(r'\s[–-]\s', h1, 1)
        ttl = parts[1].strip() if len(parts) > 1 else ""
        numtok = parts[0].split()[1]
        specs.append(["drommen-%s" % numtok, "Kapitel %s · %s" % (numtok, ttl),
                      first_sentence(body), chapter_body(body), subtitles(body), "kap-%s" % numtok])
    elif h1.startswith("Mellanspel"):
        # foga in mellanspelet i FÖREGÅENDE kapitelkorts fördjupning (I→kap 7, II→kap 8)
        parts = re.split(r'\s[–-]\s', h1, 1)
        ttl = parts[1].strip() if len(parts) > 1 else ""
        numtok = parts[0].split()[1]
        prev = specs[-1]
        prev[3] += ('\n<hr>\n<div class="extra-head">Mellanspel %s — %s</div>\n%s'
                    % (numtok, ttl, chapter_body(body)))
        prev[4] = prev[4] + subtitles(body)
    elif h1 == "Tidslinje":
        specs.append(["drommen-tidslinje", "Tidslinje", first_sentence(body), timeline_inner(body), [], "tidslinje"])
    elif h1 == "Personer i boken":
        specs.append(["drommen-personer", "Personer i boken", first_sentence(body), persons_inner(body), [], "personer"])

# bygg kort-dictar med omslag + grann-navigation
kort_nya = []
for idx, (cid, titel, svar, ford, begrepp, anchor) in enumerate(specs):
    lankar = []
    if idx > 0:
        p = specs[idx - 1]; lankar.append(["◂ " + p[1], "#" + p[0], "", "Kapitel"])
    if idx < len(specs) - 1:
        n = specs[idx + 1]; lankar.append([n[1] + " ▸", "#" + n[0], "", "Kapitel"])
    lankar.append(["Läs i boken ▸", "drommen.html#" + anchor, "Hela avsnittet i bokform.", "Läs som bok"])
    lankar.append(["Hela boken – Drömmen", "drommen.html", "Läs allt, skriv ut, eller Dela med AI.", "Läs som bok"])
    kort_nya.append({
        "id": cid, "sektion": "drommen", "titel": titel,
        "begrepp": begrepp, "anteckningar": "",
        "lankar": lankar, "bilder": [COVER],
        "svar": svar or titel, "fordjupning": ford,
    })

# uppdatera manifestet
MAN = ROOT + "/content/forklara-ai/manifest.js"
s2 = io.open(MAN, encoding="utf-8").read()
PRE = "window.LECTURE = "
h2, t2 = s2[:s2.index(PRE) + len(PRE)], s2[s2.rfind(";"):]
L = json.loads(s2[s2.index(PRE) + len(PRE):s2.rfind(";")])

# rensa gammalt (idempotent): gamla drommen-kort + pekar-kortet mer-drommen
L["kort"] = [k for k in L["kort"] if not str(k.get("id", "")).startswith("drommen-") and k.get("id") != "mer-drommen"]
for k in L["kort"]:
    if isinstance(k.get("relaterat"), list) and "mer-drommen" in k["relaterat"]:
        k["relaterat"] = [r for r in k["relaterat"] if r != "mer-drommen"]

# sätt in de nya korten efter sista 'rorelse'-kortet (grupperat)
sist_ror = max((i for i, k in enumerate(L["kort"]) if str(k.get("sektion")) == "rorelse"),
               default=len(L["kort"]) - 1)
L["kort"][sist_ror + 1:sist_ror + 1] = kort_nya

# sektions-metadata: '13 · Drömmen...' direkt efter '12 · En rörelse' (id rorelse)
L["sektioner"] = [sek for sek in L["sektioner"] if sek.get("id") != "drommen"]
sek_ny = {"id": "drommen", "namn": "13 · Drömmen om den tänkande maskinen", "bakom": True, "nyckel": None}
ri = next((i for i, sek in enumerate(L["sektioner"]) if sek.get("id") == "rorelse"), len(L["sektioner"]) - 1)
L["sektioner"].insert(ri + 1, sek_ny)

man_out = h2 + json.dumps(L, ensure_ascii=False, indent=2) + t2
json.loads(man_out[man_out.index(PRE) + len(PRE):man_out.rfind(";")])
assert sum(1 for c in man_out if c in kyr) == 0, "KYR i manifest!"
io.open(MAN, "w", encoding="utf-8").write(man_out)
print("\nSEKTION 13: skrev", len(kort_nya), "kort till manifestet (sektion 'drommen')")
print("  ordning:", [k["id"] for k in kort_nya])
print("  alla har omslag:", all(k["bilder"] == [COVER] for k in kort_nya),
      "| begrepp är listor:", all(isinstance(k["begrepp"], list) for k in kort_nya))
print("  manifest KYR:", sum(1 for c in man_out if c in kyr))

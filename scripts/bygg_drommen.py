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
            anchor = "kap-" + numtok; tocnum = numtok
        else:
            anchor = "mellanspel-%d" % ROM2N.get(numtok, 0); tocnum = "✦"
        chapters_html.append(
            '  <section id="%s">\n'
            '    <div class="opener">\n'
            '      <div class="num">%s</div>\n'
            '      <div class="kap">%s</div>\n'
            '      <h2>%s</h2>\n'
            '    </div>\n'
            '    <div class="ford">\n%s\n    </div>\n'
            '  </section>\n' % (anchor, numtok, kapword, inline(ttl), chapter_body(body)))
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

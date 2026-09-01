#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bygg mega.html — 'En rörelse' som bok, syskon till motvikten.html/en-bibel.html."""
import json, re, io

ROOT = "/Users/ainnova/Projects/forklara-ai"
mot = io.open(ROOT+"/motvikten.html", encoding="utf-8").read()

# ---- 1. hämta korten -------------------------------------------------------
s = io.open(ROOT+"/content/forklara-ai/manifest.js", encoding="utf-8").read()
pre = "window.LECTURE = "
L = json.loads(s[s.index(pre)+len(pre):s.rfind(";")])
kort = {k["id"]: k for k in L["kort"] if k.get("sektion") == "rorelse"}

ROM = ["I","II","III","IV","V","VI","VII","VIII","IX","X"]

# ---- 2. head + CSS (från motvikten) ---------------------------------------
head = mot[:mot.index("</head>")]
head = head.replace("<title>Motvikten", "<title>En rörelse")
head = head.replace(
    '<meta name="description" content="Motvikten — ett parti av en tanke. Inte höger, inte vänster, utan de test varje förslag måste tåla. Av Anna Malmberg.">',
    '<meta name="description" content="En rörelse — MEGA, Make Everybody Great Again. Inte America. Everybody. Av Anna Malmberg.">')
# säkerställ description-byte även om exakt sträng skiljer sig
head = re.sub(r'<meta name="description"[^>]*>',
    '<meta name="description" content="En rörelse — MEGA, Make Everybody Great Again. Inte America. Everybody. Av Anna Malmberg.">',
    head, count=1)

# injicera .ford .maga-CSS före </style>
maga_css = """
  /* ---- Maga-ruta (röd): 'Här har Maga tappat det' ---- */
  .ford .maga{background:var(--paper-2);border-left:3px solid #C0392B;border-radius:0 4px 4px 0;padding:14px 20px;margin:16px 0;}
  .ford .maga-label{font-family:var(--sans);font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#C0392B;margin-bottom:5px;}
  .ford .maga-text{margin:0;}
  :root[data-theme="dark"] .ford .maga-label{color:#E8897A;}
  :root[data-theme="dark"] .ford .maga{border-color:#B24A3C;}
  @media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .ford .maga-label{color:#E8897A;}:root:not([data-theme="light"]) .ford .maga{border-color:#B24A3C;}}
  @media print{.ford .maga{page-break-inside:avoid;}}
"""
head = head.replace("  </style>", maga_css + "\n  </style>")

# ---- 3. knappar + titel + förord ------------------------------------------
top = """</head>
<body>
<button class="dela-ai" id="delaai" title="Kopiera hela boken som Markdown — klistra in i valfri AI">Dela med AI</button>
<button class="skriv-ut" id="skrivut" title="Skriv ut hela boken">Skriv ut</button>
<button class="tema-vaxel" id="tema" title="Ljust eller mörkt läge">☀</button>
<div class="wrap">

  <header class="title fade">
    <div class="mark">Make Everybody Great Again</div>
    <h1>En&nbsp;<span class="em">rörelse</span></h1>
    <div class="sub">Gör alla stora igen — ingen på någon annans bekostnad.</div>
    <div class="rule-orn">✦ ❋ ✦</div>
    <div class="by">av Anna Malmberg · ur Förklara AI</div>
  </header>

  <section class="foreword">
    <span class="label">Förord</span>
    <h2 class="h">Stjäl elden, inte hatet</h2>
    <p>Den här rörelsen började med ett felsagt ord. Min pappa skulle säga <em>MAGA</em> och sa <em>mega</em> — och plötsligt låg något där på bordet som var för bra för att inte plocka upp. För tänk om man tog känslan MAGA lever på, men vände på vem den gäller?</p>
    <p>MAGA vilar på en äkta känsla: att något gått förlorat, att vanligt folk blivit osedda, att eliterna talar om dem men inte till dem. Den känslan ska tas på blodigt allvar — det gör den här boken. Felet är inte att MAGA är arg. Felet är <em>vart</em> ilskan riktas: nedåt och utåt, mot invandraren, grannlandet, den som är annorlunda. MEGA behåller känslan och byter måltavla. Inte <em>America first</em>. <em>Everybody counts.</em></p>
    <p>Därför är den här boken vass — men på ett bestämt sätt. I varje kapitel finns en röd ruta: <strong>"Här har Maga tappat det."</strong> Där namnger jag exakt var rörelsen svek sin egen känsla, och jag belägger det. Men jag drar en skarp gräns: att granska en rörelse är inte att hata dem som röstar på den. De flesta MAGA-väljare vill precis det alla vill — ett värdigt liv, en trygg plats, att räknas. Dem vänder sig MEGA <em>till</em>, inte emot. <strong>Demonisera ingen — men namnge exakt var makten tappat det.</strong></p>
    <p>Grundbulten är enkel: storhet är inte en tårta. Att du blir större kräver inte att jag blir mindre. Nästan varje gång någon säljer dig motsatsen — att din vinst måste vara någon annans förlust — säljer de dig en lögn för att du lättare ska gå med på att någon trycks ner. MEGA vägrar den affären.</p>
    <p>En sista ärlighet: en maskin har varit med och skrivit den här boken. Men den är inte slop — varje mening gick genom mig, och jag menar varje ord. Håll inte med om allt. Pröva det i stället.</p>
    <div class="keep" style="margin-top:30px;">
      <span class="label">Det enda löftet</span>
      <p>Vi lovar inte att göra dig stor på någon annans bekostnad. Vi lovar att aldrig be dig bli liten.</p>
    </div>
  </section>

"""

# ---- 4. innehåll (TOC) -----------------------------------------------------
def esc(t): return t
toc_rader = []
def toc_li(num, titel, fraga):
    return ('      <li><span class="n">%s</span><span class="t">%s'
            '<span class="q">%s</span></span></li>') % (num, esc(titel), esc(fraga))

order = ["rorelse-0"] + ["rorelse-%d"%i for i in range(1,11)] + ["rorelse-test","rorelse-slut"]
labels = {}
labels["rorelse-0"]   = ("✦", "Upptakt")
for i in range(1,11): labels["rorelse-%d"%i] = (ROM[i-1], "Kapitel "+ROM[i-1])
labels["rorelse-test"]= ("✦", "Prövningen")
labels["rorelse-slut"]= ("",  "Final")

toc_rows = []
toc_rows.append(toc_li("·", "Upptakt: En rörelse som började med ett felsagt ord", kort["rorelse-0"]["svar"]))
for i in range(1,11):
    k = kort["rorelse-%d"%i]
    toc_rows.append(toc_li(ROM[i-1], k["titel"], k["svar"]))
toc_rows.append(toc_li("✦", "MEGA-testet", kort["rorelse-test"]["svar"]))
toc_rows.append(toc_li("✦", "Final: En rörelse som ingen får äga", kort["rorelse-slut"]["svar"]))

toc = """  <section class="toc">
    <span class="label">Innehåll</span>
    <h2 class="h">Tio byten, ett test och ett löfte</h2>
    <ol>
%s
    </ol>
  </section>

""" % "\n".join(toc_rows)

# ---- 5. kapitel ------------------------------------------------------------
def kapitel(kid, h2titel):
    num, kap = labels[kid]
    k = kort[kid]
    ford = k["fordjupning"]
    numdiv = ('      <div class="num">%s</div>\n' % num) if num else ""
    return """  <section>
    <div class="opener">
%s      <div class="kap">%s</div>
      <h2>%s</h2>
      <div class="karn">%s</div>
    </div>
    <div class="ford">
%s
    </div>
  </section>
""" % (numdiv, kap, esc(h2titel), esc(k["svar"]), ford)

body_chapters = []
body_chapters.append(kapitel("rorelse-0", "En rörelse som började med ett felsagt ord"))
for i in range(1,11):
    body_chapters.append(kapitel("rorelse-%d"%i, kort["rorelse-%d"%i]["titel"]))
body_chapters.append(kapitel("rorelse-test", "MEGA-testet"))
body_chapters.append(kapitel("rorelse-slut", kort["rorelse-slut"]["titel"]))

# ---- 6. efterord -----------------------------------------------------------
efter = """  <section class="efter">
    <div class="rule-orn">✦ ❋ ✦</div>
    <span class="label" style="color:var(--taupe)">Efterord</span>
    <h2 class="h" style="text-align:center">Kompassen</h2>
    <p style="margin-left:auto;margin-right:auto;text-align:left;">MEGA lämnar dig inte med ett tjugopunktsprogram, utan med en kompass — samma som styr allt annat jag bygger:</p>
    <div class="compass">Se människan. Bygg möjligheten. Granska makten.<br>Följ konsekvensen. Lyft generöst. Demonisera ingen.<br>Lämna ingen liten för att själv få känna dig stor.<br>Var aldrig naiv. Och kom alltid ihåg att du själv kan ha fel.</div>
    <div class="honest" style="text-align:left;max-width:54ch;margin-left:auto;margin-right:auto;">
      <span class="label">Ärlig ram</span>
      Det här är en <strong>rörelse av en tanke och ett pågående bygge</strong>, inte en färdig ideologi. Poängen är inte ett namn att skandera — den är bytet: från <em>tillbaka</em> till <em>framåt</em>, från <em>någons bekostnad</em> till <em>tillsammans</em>. Testen gäller MEGA själv först. Ingen får äga den. Stjäl gärna.
    </div>
    <div class="colophon">
      En rörelse · MEGA — Make Everybody Great Again<br>
      Av Anna Malmberg — samma verkstad som Förklara AI, En Bibel och Motvikten.<br>
      Inte America. Everybody. (Och till mitt försvar: min pappa sa bara ett ord fel.) ✦
    </div>
  </section>

</div>
"""

# ---- 7. tail-script (från motvikten, med utökad toMD för maga/shield/naturlag)
# OBS: första <script> ligger i <head> (tema-init). Ta de AVSLUTANDE scripten:
_anchor = mot.index('var k = "forklara-ai:tema", b = document.getElementById("tema")')
tail = mot[mot.rindex("<script>", 0, _anchor):]

# 7a. Ersätt section-hanteraren i toMD så ALLA nästlade rutor (maga/shield/why/
#     insight/naturlag/lost + ev. extra-grid) kommer med — inte bara .lost.
old_section = (
    'else if(ch.classList.contains("section")){\n'
    '            var c=ch.querySelector(".concept"); if(c)o.push("### "+T(c));\n'
    '            var b=ch.querySelector(".body");\n'
    '            if(b){ var bc=b.cloneNode(true); var lost=bc.querySelector(".lost"); if(lost)lost.remove();\n'
    '              o.push(T(bc));\n'
    '              var L=b.querySelector(".lost"); if(L)o.push("> **"+T(L.querySelector(".lost-label"))+":** "+T(L.querySelector(".lost-text"))); } }'
)
new_section = (
    'else if(ch.classList.contains("section")){\n'
    '            var c=ch.querySelector(".concept"); if(c)o.push("### "+T(c));\n'
    '            var b=ch.querySelector(".body");\n'
    '            if(b){ var bc=b.cloneNode(true);\n'
    '              bc.querySelectorAll(".lost,.maga,.shield,.why,.insight,.naturlag,.utblick,.extra-grid").forEach(function(x){x.remove();});\n'
    '              var bt=T(bc); if(bt)o.push(bt); }\n'
    '            ch.querySelectorAll(".lost,.maga,.shield,.why,.insight,.naturlag,.utblick").forEach(function(cx){\n'
    '              var lab=cx.querySelector(\'[class$="-label"]\'), txt=cx.querySelector(\'[class$="-text"],[class$="-body"]\');\n'
    '              if(lab&&txt)o.push("> **"+T(lab)+":** "+T(txt)); });\n'
    '            var eg=ch.querySelector(".extra-grid");\n'
    '            if(eg)Array.prototype.forEach.call(eg.children,function(g){var n=g.querySelector(".extra-name"),d=g.querySelector(".extra-desc"); if(n&&d)o.push("- **"+T(n)+":** "+T(d));}); }'
)
assert old_section in tail, "hittade inte section-hanteraren i toMD"
tail = tail.replace(old_section, new_section, 1)

# 7b. Lägg maga/shield/naturlag som topp-nivå-grenar bredvid utblick (för rutor
#     som ligger direkt under .ford, ej i en section).
inject = ('else if(ch.classList.contains("utblick")) o.push("> **"+T(ch.querySelector(".utblick-label"))+":** "+T(ch.querySelector(".utblick-text")));')
addition = inject + '\n' + \
    'else if(ch.classList.contains("maga")) o.push("> **"+T(ch.querySelector(".maga-label"))+":** "+T(ch.querySelector(".maga-text")));\n' + \
    'else if(ch.classList.contains("naturlag")) o.push("> **"+T(ch.querySelector(".naturlag-label"))+":** "+T(ch.querySelector(".naturlag-text")));\n' + \
    'else if(ch.classList.contains("shield")) o.push("> **"+T(ch.querySelector(".shield-label"))+":** "+T(ch.querySelector(".shield-body")));'
assert inject in tail, "hittade inte utblick-grenen i toMD"
tail = tail.replace(inject, addition, 1)

# ---- 8. montera ------------------------------------------------------------
out = head + top + toc + "".join(body_chapters) + efter + tail
io.open(ROOT+"/mega.html","w",encoding="utf-8").write(out)
print("skrev mega.html:", len(out), "tecken")

# validering
import html
assert out.count("<section") == out.count("</section>"), "section obalans"
print("sections:", out.count('<section'), " maga-rutor:", out.count('class="maga"'))
# KYR-vakt
kyr=set('аеорсухіјѕАЕОРСТНКМВ')
print("KYR homoglyfer:", sum(1 for c in out if c in kyr))
# em-balans grovt
print("em open/close:", out.count("<em>"), out.count("</em>"))

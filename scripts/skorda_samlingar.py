#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""skorda_samlingar.py — bygger samlingsböckerna ur fördjupningarna (sanningskällan).

Skördar alla stämplade rutor i ursprungskorten:
  naturlag  (data-typ 1-4, data-amne) -> full skörd, grupperas på illusionstyp
  utblick   (data-utblick 1-7)        -> kurerad, grupperas på världsregion
Härleder källraden automatiskt:  → ur ‹Källa› · ‹kortets namn›  (mittprick, utan serie)

Bygger om: samlingskorten naturlag-1..4 + utblickar-1..7 i manifestet, och
kapitelkropparna i naturlag.html + utblickar.html. Kör när som helst efter att en
ruta ändrats/lagts till. (Metadatan stämplas av scripts/stampla_metadata.py.)
"""
import json, re, io

ROOT = "/Users/ainnova/Projects/forklara-ai"
PATH = ROOT + "/content/forklara-ai/manifest.js"
gen = json.load(io.open(ROOT + "/content/forklara-ai/samlingar_meta.json", encoding="utf-8"))
NATIVES = gen["natives"]          # utblickar utan ursprungskort (bok-egna)

s = io.open(PATH, encoding="utf-8").read()
PRE = "window.LECTURE = "
i = s.index(PRE) + len(PRE); j = s.rfind(";")
head, tail = s[:i], s[j:]
L = json.loads(s[i:j])
kort = {k["id"]: k for k in L["kort"]}

# ---- källa + rent kortnamn -------------------------------------------------
KALLA = {"950":"Extra föreläsning","960":"Egna byggen","970":"En Bibel","980":"Ett parti","rorelse":"En rörelse"}
def kalla(sek): return KALLA.get(sek, "Förklara AI")
def ren_titel(t):
    t = t.strip()
    m = re.split(r"\.\s", t, 1)      # klipp vid första mening (drar bort ev. frågeklausul)
    return m[0].strip()

SEK_RANK = {s: n for n, s in enumerate(
    ["000","010","020","030","040","050","060","070","950","960","970","980","rorelse"])}
def rank(k): return (SEK_RANK.get(k["sektion"], 99),)

def kalla_titel(k):
    return "%s · %s" % (kalla(k["sektion"]), ren_titel(k["titel"]))

# ---- skörda ----------------------------------------------------------------
nat_typ = {1: [], 2: [], 3: [], 4: []}    # typ -> [(amne, text, kalla_titel)]
utb_reg = {n: [] for n in range(1, 8)}    # region -> [(label, text, kalla_titel|None)]

ordered = sorted([k for k in L["kort"] if k["sektion"] in SEK_RANK], key=rank)
for k in ordered:
    f = k.get("fordjupning") or ""
    kt = kalla_titel(k)
    for m in re.finditer(r'<div class="naturlag" data-typ="(\d)" data-amne="([^"]*)"><div class="naturlag-label">.*?</div><div class="naturlag-text">(.*?)</div></div>', f, re.S):
        amne = m.group(2).replace("&quot;", '"')
        nat_typ[int(m.group(1))].append((amne, m.group(3), kt))
    for m in re.finditer(r'<div class="utblick" data-utblick="(\d)"><div class="utblick-label">(.*?)</div><div class="utblick-text">(.*?)</div></div>', f, re.S):
        utb_reg[int(m.group(1))].append((m.group(2), m.group(3), kt))

# kurerade utblickar (adapterade för boken) sist i sin region — med sin källrad
for nv in NATIVES:
    utb_reg[nv["region"]].append((nv["label"], nv["text"], nv.get("kt")))

# ---- rendera reflektionsblock ---------------------------------------------
def kalla_p(kt, pad):
    return '<p style="font-size:12.5px;margin:2px 0 %dpx %dpx;opacity:.%d;font-style:italic">→ ur %s</p>' % (
        (18 if pad == 20 else 16), pad, (62 if pad == 20 else 65), kt)

def nat_block(amne, text, kt):
    return ('<div class="naturlag"><div class="naturlag-label">%s</div>'
            '<div class="naturlag-text">%s</div></div>\n%s') % (amne, text, kalla_p(kt, 20))

def utb_block(label, text, kt):
    s = '<div class="utblick"><div class="utblick-label">%s</div><div class="utblick-text">%s</div></div>' % (label, text)
    return s + ("\n" + kalla_p(kt, 30) if kt else "")

# ---- bygg samlingskortens fordjupning (bevara ingressen) ------------------
def med_ingress(kid, blocks, sep):
    ing = gen["ingress"].get(kid, "")
    body = sep.join(blocks)
    return (ing + "\n\n" + body) if ing else body

nat_ford = {}
for typ in range(1, 5):
    blocks = [nat_block(a, t, kt) for (a, t, kt) in nat_typ[typ]]
    nat_ford["naturlag-%d" % typ] = med_ingress("naturlag-%d" % typ, blocks, "\n\n")

utb_ford = {}
for reg in range(1, 8):
    blocks = [utb_block(lb, tx, kt) for (lb, tx, kt) in utb_reg[reg]]
    utb_ford["utblickar-%d" % reg] = med_ingress("utblickar-%d" % reg, blocks, "\n")

# skriv in i manifestet
for kid, ford in list(nat_ford.items()) + list(utb_ford.items()):
    kort[kid]["fordjupning"] = ford

out = head + json.dumps(L, ensure_ascii=False, indent=2) + tail
json.loads(out[out.index(PRE)+len(PRE):out.rfind(";")])
io.open(PATH, "w", encoding="utf-8").write(out)

# ---- bygg om böckerna: ersätt HELA kapitelblocket (mellan förord och efterord)
#      med färska sektioner — städar bort originalens felplacerade rutor -----
OPENER_RE = r'<div class="num">(.*?)</div>\s*<div class="kap">(.*?)</div>\s*<h2>(.*?)</h2>\s*<div class="karn">(.*?)</div>'

def opener_html(num, kap, h2, karn):
    return ('    <div class="opener">\n'
            '      <div class="num">%s</div>\n'
            '      <div class="kap">%s</div>\n'
            '      <h2>%s</h2>\n'
            '      <div class="karn">%s</div>\n'
            '    </div>') % (num, kap, h2, karn)

def strip_utblick(label):
    return re.sub(r'^\s*Utblick\s*[—–-]\s*', '', re.sub(r'<[^>]+>', '', label)).strip()

def kort_label(label, kt):
    # rörelsens utblickar har formen "beskrivning (Plats)" -> korta till Plats,
    # så bokens feta rubriker blir lika korta som de kurerade ("Bagdad", "Iran").
    lab = strip_utblick(label)
    if kt and kt.startswith("En rörelse"):
        m = re.search(r'\(([^)]+)\)\s*$', lab)
        if m: return m.group(1)
    return lab

def uwin_body(region):
    out = []
    for (label, text, kt) in utb_reg[region]:
        src = ('<div class="src">→ ur %s</div>' % kt) if kt else ''
        out.append('    <div class="uwin"><div class="ul">%s</div><p class="ut">%s</p>%s</div>'
                   % (kort_label(label, kt), text, src))
    return "\n".join(out)

def rebuild(fname, bodies, n_kap):
    p = ROOT + "/" + fname
    html = io.open(p, encoding="utf-8").read()
    openers = re.findall(OPENER_RE, html, re.S)
    assert len(openers) == n_kap, "%s: hittade %d openers (väntade %d)" % (fname, len(openers), n_kap)
    secs = []
    for k in range(n_kap):
        num, kap, h2, karn = openers[k]
        secs.append("  <section>\n%s\n%s\n  </section>" % (opener_html(num, kap, h2, karn), bodies[k]))
    block = "\n\n" + "\n\n".join(secs) + "\n\n  "
    new, n = re.subn(r'(<section class="foreword">.*?</section>)(.*?)(<section class="efter">)',
                     lambda m: m.group(1) + block + m.group(3), html, count=1, flags=re.S)
    assert n == 1, "%s: hittade inte förord/efterord-ankaret" % fname
    io.open(p, "w", encoding="utf-8").write(new)
    return new

# naturlag: kapitelkropp = <div class="ford">…</div> (speglar samlingskortet)
nat_bodies = ['    <div class="ford">\n%s\n    </div>' % nat_ford["naturlag-%d" % n] for n in range(1, 5)]
nb = rebuild("naturlag.html", nat_bodies, 4)
# utblickar: kapitelkropp = rad av <div class="uwin">…</div>
ub = rebuild("utblickar.html", [uwin_body(n) for n in range(1, 8)], 7)

# ---- rapport ---------------------------------------------------------------
print("NATURLAG per typ:", {t: len(v) for t, v in nat_typ.items()}, "= ", sum(len(v) for v in nat_typ.values()))
print("UTBLICKAR per region:", {r: len(v) for r, v in utb_reg.items()}, "= ", sum(len(v) for v in utb_reg.values()))
kyr = set("аеорсухіјѕАЕОРСТНКМВ")
print("KYR manifest:", sum(1 for c in out if c in kyr))
for nm, b in (("naturlag.html", nb), ("utblickar.html", ub)):
    print(nm, "→ ur-rader:", b.count("→ ur"), "| KYR:", sum(1 for c in b if c in kyr))
print("KLART.")

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""stampla_metadata.py — engångskörning.

Stämplar in metadata i ursprungskortens fördjupningar så att FÖRDJUPNINGEN blir
sanningskällan för samlingsböckerna "Är det en naturlag?" och "Utblickar":

  <div class="naturlag" data-typ="1" data-amne="Algoritmen"> ...
  <div class="utblick"  data-utblick="6"> ...

- data-typ (1-4)  = illusionstyp (bara naturlag). ALLA naturlag-rutor skördas.
- data-amne       = ämnesetikett som visas i naturlag-boken (relabel).
- data-utblick (1-7) = världsregion-kapitel. BARA rutor med attributet tas med
  i Utblickar-boken (den är kurerad — alla utblickar i korten hör inte dit).

Härleder typ/ämne/region för de befintliga rutorna ur NUVARANDE samlingskort
(textmatchning), och lägger rörelsens 13 naturlag + 12 utblickar ur tabellen nedan.
Osynligt i all rendering. Kör EN gång; sedan äger scripts/skorda_samlingar.py flödet.
"""
import json, re, unicodedata, io

ROOT = "/Users/ainnova/Projects/forklara-ai"
PATH = ROOT + "/content/forklara-ai/manifest.js"

s = io.open(PATH, encoding="utf-8").read()
PRE = "window.LECTURE = "
i = s.index(PRE) + len(PRE); j = s.rfind(";")
head, tail = s[:i], s[j:]
L = json.loads(s[i:j])
kort = {k["id"]: k for k in L["kort"]}

def clean(t): return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", t)).strip()
def key(t):   return unicodedata.normalize("NFC", clean(t))[:80].lower()

# ---- rörelsens klassning (min redaktörsbedömning) -------------------------
ROR_NAT = {  # kort -> (typ, ämne)
    "rorelse-0":  (4, "Nollsumman"),
    "rorelse-1":  (3, "Automatiseringen"),
    "rorelse-2":  (1, "Kärnfamiljen"),
    "rorelse-3":  (3, "Anonymiteten"),
    "rorelse-4":  (4, "Trygghet genom övervakning"),
    "rorelse-5":  (2, "Frihet — för vem?"),
    "rorelse-6":  (4, "Nationernas nollsumma"),
    "rorelse-7":  (3, "Billigast är bäst"),
    "rorelse-8":  (3, "Tekniken gynnar alla"),
    "rorelse-9":  (3, "Oliktänkande blir fiender"),
    "rorelse-10": (1, "Förr var bättre"),
    "rorelse-test": (1, "Höger eller vänster först"),
    "rorelse-slut": (3, "Den starka ledaren"),
}
ROR_UTB = {  # kort -> region
    "rorelse-0": 6, "rorelse-1": 6, "rorelse-2": 4, "rorelse-3": 6, "rorelse-4": 6,
    "rorelse-5": 2, "rorelse-6": 4, "rorelse-7": 7, "rorelse-8": 7, "rorelse-9": 6,
    "rorelse-10": 7, "rorelse-test": 7,
}

# ---- lär av nuvarande samlingar -------------------------------------------
nat_lookup = {}   # key(text) -> (typ, amne)
utb_lookup = {}   # key(text) -> region

for idx in range(1, 5):
    f = kort["naturlag-%d" % idx]["fordjupning"]
    for m in re.finditer(r'<div class="naturlag"><div class="naturlag-label">(.*?)</div><div class="naturlag-text">(.*?)</div></div>', f, re.S):
        nat_lookup[key(m.group(2))] = (idx, clean(m.group(1)))

regmap = {"utblickar-%d" % n: n for n in range(1, 8)}
for kid, reg in regmap.items():
    f = kort[kid]["fordjupning"]
    for m in re.finditer(r'<div class="utblick"><div class="utblick-label">(.*?)</div><div class="utblick-text">(.*?)</div></div>', f, re.S):
        utb_lookup[key(m.group(2))] = reg

# rörelsens rutor: nyckla på deras egen text
for kid, (typ, amne) in ROR_NAT.items():
    f = kort[kid]["fordjupning"]
    m = re.search(r'<div class="naturlag-text">(.*?)</div>', f, re.S)
    if m: nat_lookup[key(m.group(1))] = (typ, amne)
for kid, reg in ROR_UTB.items():
    f = kort[kid]["fordjupning"]
    m = re.search(r'<div class="utblick-text">(.*?)</div>', f, re.S)
    if m: utb_lookup[key(m.group(1))] = reg

# ---- stämpla ursprungskorten ----------------------------------------------
ORIGIN_SEK = {"000","010","020","030","040","050","060","070","950","960","970","980","rorelse"}
def esc(v): return str(v).replace('"', "&quot;")

n_nat = n_utb = n_nat_miss = 0
for k in L["kort"]:
    if k["sektion"] not in ORIGIN_SEK: continue
    f = k.get("fordjupning") or ""
    if not f: continue

    def nat_sub(m):
        global n_nat, n_nat_miss
        text = m.group(2)
        hit = nat_lookup.get(key(text))
        if not hit:
            n_nat_miss += 1
            return m.group(0)
        typ, amne = hit; n_nat += 1
        return '<div class="naturlag" data-typ="%d" data-amne="%s"><div class="naturlag-label">%s</div><div class="naturlag-text">%s</div></div>' % (typ, esc(amne), m.group(1), text)
    f = re.sub(r'<div class="naturlag"><div class="naturlag-label">(.*?)</div><div class="naturlag-text">(.*?)</div></div>', nat_sub, f, flags=re.S)

    def utb_sub(m):
        global n_utb
        text = m.group(2)
        reg = utb_lookup.get(key(text))
        if not reg:
            return m.group(0)               # ej kurerad -> ingen region, stannar i föreläsningen
        n_utb += 1
        return '<div class="utblick" data-utblick="%d"><div class="utblick-label">%s</div><div class="utblick-text">%s</div></div>' % (reg, m.group(1), text)
    f = re.sub(r'<div class="utblick"><div class="utblick-label">(.*?)</div><div class="utblick-text">(.*?)</div></div>', utb_sub, f, flags=re.S)

    k["fordjupning"] = f

print("Stämplade naturlag-rutor:", n_nat, "(omatchade:", n_nat_miss, ")")
print("Stämplade utblick-rutor :", n_utb)

out = head + json.dumps(L, ensure_ascii=False, indent=2) + tail
json.loads(out[out.index(PRE)+len(PRE):out.rfind(";")])   # validera
io.open(PATH, "w", encoding="utf-8").write(out)
kyr = set("аеорсухіјѕАЕОРСТНКМВ")
print("KYR:", sum(1 for c in out if c in kyr))
print("OK — manifest stämplat.")

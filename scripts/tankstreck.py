#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""tankstreck.py — tunnar tankstreck (—) smart och snyggt i allt innehåll.

REGEL (medvetet konservativ): bara PARENTES-PAR " — kort inskott — " görs om
till kommatecken ", kort inskott, ". De ENSAMMA, dramatiska tankstrecken
(Dickinson-röstens — det som är stil, inte slop) lämnas orörda. Inskottet får
inte innehålla komma, annat tankstreck, menings-slut eller HTML-tagg, och max
40 tecken — så vi aldrig rör en dramatisk paus eller skapar kommasallad.

  python3 scripts/tankstreck.py            # TORRKÖRNING: rapport + exempel
  python3 scripts/tankstreck.py --apply    # skriv manifest + handböcker, skörda om
"""
import json, io, re, sys, subprocess

ROOT = __file__.rsplit("/scripts/", 1)[0]
MAN  = ROOT + "/content/forklara-ai/manifest.js"
HANDBOOKS = ["forklara-ai.html", "en-bibel.html", "motvikten.html", "mega.html"]  # naturlag/utblickar skördas
FIELDS = ("fordjupning", "svar", "anteckningar")   # INTE titel (medvetna klartitlar)
EM = "—"
PAIR = re.compile(r" %s ([^%s,.;:!?<>]{1,40}?) %s " % (EM, EM, EM))

KONJ = re.compile(r" %s (och|men|eller|för|så|utan|fast) " % EM)   # streck före konjunktion → komma

def reduce(text):
    n = 0; prev = None
    while prev != text:                         # A: parentes-par " — inskott — " → komma
        prev = text
        text, c = PAIR.subn(lambda m: ", %s, " % m.group(1), text, count=1)
        n += c
    text, c2 = KONJ.subn(lambda m: ", %s " % m.group(1), text)   # B: " — och/men/så… " → ", och… "
    n += c2
    return text, n

def samples(text, k=3):
    out = []
    for m in PAIR.finditer(text):
        a = max(0, m.start()-30); b = min(len(text), m.end()+30)
        before = re.sub(r"\s+", " ", text[a:b])
        after  = re.sub(r"\s+", " ", (text[a:m.start()] + ", "+m.group(1)+", " + text[m.end():b]))
        out.append((before, after))
        if len(out) >= k: break
    return out

def run(apply):
    s = io.open(MAN, encoding="utf-8").read()
    PRE = "window.LECTURE = "; i = s.index(PRE)+len(PRE); j = s.rfind(";")
    head, tail = s[:i], s[j:]; L = json.loads(s[i:j])
    tot = 0; ex = []
    for k in L["kort"]:
        for f in FIELDS:
            v = k.get(f)
            if not isinstance(v, str) or EM not in v: continue
            if len(ex) < 12: ex += samples(v, 12-len(ex))
            nv, c = reduce(v)
            if c: tot += c; k[f] = nv
    print("MANIFEST: %d par-tankstreck → kommatecken" % tot)
    print("\nEXEMPEL (före → efter):")
    for b, a in ex[:12]:
        print("  •", b); print("    →", a)
    bok = {}
    for fn in HANDBOOKS:
        h = io.open(ROOT+"/"+fn, encoding="utf-8").read()
        nh, c = reduce(h); bok[fn] = (c, nh)
    print("\nHANDBÖCKER:", {fn: bok[fn][0] for fn in HANDBOOKS})

    if not apply:
        print("\n(TORRKÖRNING — inget skrivet. Kör med --apply för att verkställa.)")
        return
    kyr = set("аеорсухіјѕАЕОРСТНКМВ")
    out = head + json.dumps(L, ensure_ascii=False, indent=2) + tail
    json.loads(out[out.index(PRE)+len(PRE):out.rfind(";")])
    io.open(MAN, "w", encoding="utf-8").write(out)
    for fn in HANDBOOKS:
        io.open(ROOT+"/"+fn, "w", encoding="utf-8").write(bok[fn][1])
    print("KYR manifest:", sum(1 for c in out if c in kyr))
    print("SKRIVET. Kör skorda_samlingar.py för naturlag/utblickar…")
    subprocess.run([sys.executable, ROOT+"/scripts/skorda_samlingar.py"])

run("--apply" in sys.argv)

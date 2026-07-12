#!/usr/bin/env python3
"""Bygger Bibliotekets hyllor (sektion 130) från Annas Google-ark.

Arket är delat "alla med länken kan visa", så vi hämtar det direkt som xlsx —
ingen inloggning, ingen nedladdning. Varje flik blir en hylla: rubrik +
inledningstext (Annas röst) + länkar med beskrivning, grupperade på "Notis".

Kan köras fristående (python bibliotek.py) eller anropas av motorn (server.py).
Ger en lokal fil som argument för att bygga offline: python bibliotek.py fil.xlsx
"""
import io
import json
import os
import re
import sys
import unicodedata
import urllib.request
import zipfile
from xml.etree import ElementTree as ET

DOC_ID = "1UfMXhSCwotO_wXCpMbi4dQa1_Mzbd3odeVDp8uOU9mc"
EXPORT_URL = f"https://docs.google.com/spreadsheets/d/{DOC_ID}/export?format=xlsx"
ROT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROT, "content", "forklara-ai", "manifest.js")

M = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"


def hämta_xlsx():
    req = urllib.request.Request(EXPORT_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def _colnum(ref):
    s = "".join(ch for ch in ref if ch.isalpha())
    n = 0
    for ch in s:
        n = n * 26 + (ord(ch) - 64)
    return n - 1


def läs_flikar(data):
    z = zipfile.ZipFile(io.BytesIO(data))
    try:
        ss = ["".join(t.text or "" for t in si.iter(M + "t"))
              for si in ET.parse(z.open("xl/sharedStrings.xml")).getroot()]
    except KeyError:
        ss = []
    wb = ET.parse(z.open("xl/workbook.xml")).getroot()
    rels = {r.get("Id"): r.get("Target")
            for r in ET.parse(z.open("xl/_rels/workbook.xml.rels")).getroot()}
    flikar = []
    for sh in wb.iter(M + "sheet"):
        namn = sh.get("name")
        root = ET.parse(z.open("xl/" + rels[sh.get(R + "id")])).getroot()
        rader = []
        for rad in root.iter(M + "row"):
            celler = {}
            for c in rad.iter(M + "c"):
                v = c.find(M + "v")
                if v is None:
                    continue
                celler[_colnum(c.get("r"))] = ss[int(v.text)] if c.get("t") == "s" else v.text
            maxc = max(celler) if celler else -1
            rader.append([celler.get(i, "") for i in range(maxc + 1)])
        while rader and not any(str(x).strip() for x in rader[-1]):
            rader.pop()
        flikar.append((namn, rader))
    return flikar


def bygg_hyllor(data):
    hyllor = []
    for i, (fliknamn, rader) in enumerate(läs_flikar(data)):
        if not rader:
            continue
        # Fliknamnet är den pålitliga rubriken (Excel kapar det vid 31 tecken —
        # återställ full titel från rad 1 om den börjar likadant, t.ex. "…företag").
        titel = fliknamn.strip()
        r0 = rader[0][0].strip() if rader and rader[0] else ""
        if r0 and r0.lower().startswith(titel.lower()[:15]) and len(r0) <= len(titel) + 12:
            titel = r0
        # Inledningstexten: första meningen som inte är rubriken
        intro = ""
        for cand in ([rader[1][0]] if len(rader) > 1 and rader[1] else []) + [r0]:
            cand = cand.strip()
            if cand and cand.lower() != titel.lower() and len(cand) > 25:
                intro = cand
                break
        # Datarader: allt med en http-länk i kolumn B (hoppa rubrikraden)
        länkar = []
        for r in rader[2:]:
            r = (r + [""] * 5)[:5]
            namn, url, beskr, notis = r[0].strip(), r[1].strip(), r[2].strip(), r[3].strip()
            if not url.lower().startswith("http"):
                continue
            länk = [namn or url, url]
            if beskr or notis:
                länk.append(beskr)
            # Gruppen = Notis före ev. komma (så "…AI, Länk inkluderad" hamnar
            # i samma grupp som "…AI"). Rena undergrupper i stället för spretiga.
            grupp = notis.split(",")[0].strip()
            if grupp and grupp.lower() != titel.strip().lower():
                if not beskr:
                    länk.append("")  # håll platsen så gruppen blir 4:e fältet
                länk.append(grupp)
            länkar.append(länk)
        if not länkar:
            continue
        hyllor.append({
            "id": "130-%d" % ((i + 1) * 10),
            "sektion": "130",
            "titel": titel,
            "text": intro or ("Länkar i " + titel + "."),
            "lankar": länkar,
            "anteckningar": "Hylla i biblioteket — %d länkar, hämtade från ditt ark." % len(länkar),
        })
    return hyllor


def uppdatera_manifest(data=None):
    if data is None:
        data = hämta_xlsx()
    hyllor = bygg_hyllor(data)
    src = io.open(MANIFEST, encoding="utf-8").read()
    huvud, _, resten = src.partition("window.LECTURE = ")
    js = resten.rsplit(";", 1)[0]
    L = json.loads(js)
    # Ersätt alla kort i sektion 130 med de nya hyllorna
    L["kort"] = [k for k in L["kort"] if k.get("sektion") != "130"]
    # Sätt in hyllorna där sektion 130 började (efter sista 120-kortet)
    sist120 = max((idx for idx, k in enumerate(L["kort"]) if k.get("sektion") == "120"), default=len(L["kort"]) - 1)
    L["kort"][sist120 + 1:sist120 + 1] = hyllor
    io.open(MANIFEST, "w", encoding="utf-8").write(huvud + "window.LECTURE = " + json.dumps(L, ensure_ascii=False, indent=2) + ";\n")
    return hyllor


if __name__ == "__main__":
    if len(sys.argv) > 1:
        data = io.open(sys.argv[1], "rb").read()
    else:
        print("Hämtar arket …")
        data = hämta_xlsx()
    hyllor = uppdatera_manifest(data)
    tot = sum(len(h["lankar"]) for h in hyllor)
    print("Biblioteket byggt: %d hyllor, %d länkar." % (len(hyllor), tot))
    for h in hyllor:
        print("  %s  %-38s %d länkar" % (h["id"], h["titel"][:38], len(h["lankar"])))

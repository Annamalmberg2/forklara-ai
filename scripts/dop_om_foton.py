#!/usr/bin/env python3
"""Döper om foton och kort så att namnen följer berättelsen.

Filnamn styr ALDRIG var ett kort visas — det gör kortets kapitel och plats.
Men det är trevligt när mappen speglar verkligheten. Det här skriptet läser
manifest.js och gör två saker:

  1. Kort som flyttats till ett annat kapitel får ett nytt id i sin nya
     serie (t.ex. 010-30 som flyttats till kapitel 040 blir 040-40),
     och alla korsreferenser ("se även", trådens nyckelbilder) uppdateras.
  2. Bildfiler döps om till "<id> <titel>.<ändelse>" så att nummer och
     namn stämmer — både i verktygets bilder-mapp och i skrivbordsmappen
     "Förklara AI" (inkl. 950 Reserv). Allt loggas i omdöpningslogg.csv.

Kan köras hur ofta som helst — gör inget om allt redan stämmer.
"""
import io
import os
import re
import unicodedata

ROT = os.environ.get("FORKLARA_ROT") or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROT, "content", "forklara-ai", "manifest.js")
BILDER = os.path.join(ROT, "content", "forklara-ai", "bilder")
SKRIVBORD = os.environ.get("FORKLARA_SKRIVBORD") or os.path.expanduser("~/Desktop/Förklara AI")
LOGG = os.path.join(SKRIVBORD, "omdöpningslogg.csv")


def nfc(s):
    return unicodedata.normalize("NFC", s)


def hitta(mapp, namn):
    """Hitta en fil oavsett hur macOS normaliserat å/ä/ö i namnet."""
    if not os.path.isdir(mapp):
        return None
    mål = nfc(namn)
    for f in os.listdir(mapp):
        if nfc(f) == mål:
            return os.path.join(mapp, f)
    return None


def städa(titel):
    return re.sub(r'[/\\:*?"<>|]', "", titel).strip()


src = io.open(MANIFEST, encoding="utf-8").read()

# Läs alla kort: id, sektion, titel, ev. bild
kort = []
for block in re.finditer(r"\{[^{}]*?\}", src, re.S):
    b = block.group(0)
    m_id = re.search(r'["\']?id["\']?\s*:\s*"([^"]+)"', b)
    m_sek = re.search(r'["\']?sektion["\']?\s*:\s*"([^"]+)"', b)
    m_titel = re.search(r'["\']?titel["\']?\s*:\s*"([^"]+)"', b)
    m_bild = re.search(r'["\']?bild["\']?\s*:\s*"([^"]+)"', b)
    if m_id and m_sek and m_titel:
        kort.append({
            "id": m_id.group(1), "sektion": m_sek.group(1),
            "titel": m_titel.group(1),
            "bild": m_bild.group(1) if m_bild else None,
        })

# Vilka positionsnummer är upptagna i varje kapitel?
upptagna = {}
for k in kort:
    pre, _, suffix = k["id"].partition("-")
    if pre == k["sektion"] and suffix.isdigit():
        upptagna.setdefault(pre, set()).add(int(suffix))


def nästa_lediga(sektion):
    tagna = upptagna.setdefault(sektion, set())
    n = (max(tagna) // 10 * 10 + 10) if tagna else 10
    while n in tagna:
        n += 10
    tagna.add(n)
    return n


id_byten = []
fil_byten = []

for k in kort:
    # 1. Flyttat kapitel → nytt id i den nya serien
    if not k["id"].startswith(k["sektion"] + "-"):
        nytt_id = f"{k['sektion']}-{nästa_lediga(k['sektion'])}"
        src = src.replace('"' + k["id"] + '"', '"' + nytt_id + '"')
        id_byten.append((k["id"], nytt_id))
        print(f"  kort {k['id']} bor nu i kapitel {k['sektion']} → nytt id {nytt_id}")
        k["id"] = nytt_id

    # 2. Filnamn som inte följer kortets id → döp om filen
    if not k["bild"]:
        continue
    bild = k["bild"]
    ext = os.path.splitext(bild)[1]
    nytt_namn = f"{k['id']} {städa(k['titel'])}{ext}"
    if nfc(bild).startswith(k["id"] + " "):
        continue  # prefixet stämmer — låt resten av namnet vara
    if nfc(nytt_namn) == nfc(bild):
        continue

    källa = hitta(BILDER, bild)
    if not källa:
        print(f"  ! hittar inte filen: {bild} — hoppar över")
        continue
    if hitta(BILDER, nytt_namn):
        print(f"  ! målnamnet finns redan: {nytt_namn} — hoppar över")
        continue

    os.rename(källa, os.path.join(BILDER, nytt_namn))
    src = src.replace('"' + bild + '"', '"' + nytt_namn + '"')
    for mapp in (SKRIVBORD, os.path.join(SKRIVBORD, "950 Reserv")):
        d = hitta(mapp, bild)
        if d and not hitta(mapp, nytt_namn):
            os.rename(d, os.path.join(mapp, nytt_namn))
    fil_byten.append((bild, nytt_namn))
    print(f"  {bild}\n    → {nytt_namn}")

if id_byten or fil_byten:
    io.open(MANIFEST, "w", encoding="utf-8").write(src)
    if fil_byten and os.path.isdir(SKRIVBORD):
        with io.open(LOGG, "a", encoding="utf-8") as f:
            for gammalt, nytt in fil_byten:
                f.write(f'"{gammalt}";"{nytt}"\n')
    print(f"\nKlart: {len(id_byten)} kort fick nya serienummer, {len(fil_byten)} foton omdöpta.")
    print("Glöm inte: dubbelklicka 'Förklara AI – publicera' för att uppdatera webblänken.")
else:
    print("Alla namn följer redan berättelsen — inget att döpa om.")

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gor_omslag.py — Omslagssmedja för Förklara AI:s böcker/linser.

Ritar ett bokomslag (1280×800 PNG) i husets designspråk direkt till disk,
så vi kan göra nya omslag när nästa kapitel-idé dyker upp. Samma mall som
"Ett parti", "Utblickar", "En Bibel", "Naturlag".

Använd:
    python3 scripts/gor_omslag.py            # ritar alla i OMSLAG nedan
    python3 scripts/gor_omslag.py en-rorelse # ritar bara ett (nyckeln)

Lägg till ett nytt omslag: klistra in en post i OMSLAG-dicten och kör.
Färger/typsnitt matchar bokmallen (--serif Iowan Old Style, guld, gräddvit/svart).
"""
import sys, math
from PIL import Image, ImageDraw, ImageFont

W, H = 1280, 800
BILDER = __file__.rsplit("/scripts/", 1)[0] + "/content/forklara-ai/bilder"

SERIF = "/System/Library/Fonts/Supplemental/Iowan Old Style.ttc"
SANS  = "/System/Library/Fonts/Avenir Next.ttc"
I_ROMAN, I_BOLD, I_ITALIC = 0, 1, 2          # Iowan-ttc-index
# Avenir Next.ttc: hitta en medium/regular-face för etikettext
def _sans(size):
    for idx in (0, 1, 2, 3, 4):
        try:
            return ImageFont.truetype(SANS, size, index=idx)
        except Exception:
            continue
    return ImageFont.truetype(SANS, size)

# ---- paletter -------------------------------------------------------------
LJUS = dict(bg=(246,241,231), eyebrow=(138,129,114), roman=(35,32,26),
            gold=(176,138,62), sub=(74,69,59), footer=(138,129,114),
            div=(176,138,62))
MORK = dict(bg=(27,25,21),   eyebrow=(138,129,114), roman=(236,230,216),
            gold=(198,162,90), sub=(201,195,181), footer=(138,129,114),
            div=(198,162,90))

# ---- omslagen -------------------------------------------------------------
OMSLAG = {
    "en-rorelse": dict(
        fil="En rörelse.png", tema="mork",
        eyebrow="MAKE EVERYBODY GREAT AGAIN",
        titel_roman="En ", titel_kursiv="rörelse",
        subtitel=["Gör alla stora igen — ingen på någon",
                  "annans bekostnad. Född ur ett felsagt ord."],
    ),
}

# ---- ritmotor -------------------------------------------------------------
def tracked_width(draw, text, font, tracking):
    w = 0
    for ch in text:
        w += draw.textlength(ch, font=font) + tracking
    return w - tracking if text else 0

def draw_tracked(draw, cx, y, text, font, fill, tracking):
    w = tracked_width(draw, text, font, tracking)
    x = cx - w/2
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking

def star4(draw, cx, cy, r, fill):          # ✦ liten fyruddig stjärna
    draw.polygon([(cx, cy-r), (cx+r*0.32, cy-r*0.32), (cx+r, cy),
                  (cx+r*0.32, cy+r*0.32), (cx, cy+r), (cx-r*0.32, cy+r*0.32),
                  (cx-r, cy), (cx-r*0.32, cy-r*0.32)], fill=fill)

def asterisk(draw, cx, cy, r, fill, wd=2):  # ✳ liten asterisk
    for k in range(6):
        a = math.pi/2 + k*math.pi/3
        draw.line([(cx, cy), (cx+math.cos(a)*r, cy-math.sin(a)*r)], fill=fill, width=wd)

def rita(nyckel, spec):
    P = MORK if spec["tema"] == "mork" else LJUS
    im = Image.new("RGB", (W, H), P["bg"])
    d = ImageDraw.Draw(im)
    cx = W/2

    f_eye  = _sans(21)
    f_rom  = ImageFont.truetype(SERIF, 96, index=I_BOLD)
    f_ita  = ImageFont.truetype(SERIF, 96, index=I_ITALIC)
    f_sub  = ImageFont.truetype(SERIF, 30, index=I_ITALIC)
    f_foot = _sans(17)

    # mät blockhöjd för vertikal centrering (grupp centrerad kring y≈410)
    eye_h, title_h, sub_lh = 26, 104, 40
    n_sub = len(spec["subtitel"])
    gaps = dict(after_eye=46, after_title=34, after_sub=52, after_div=30)
    total = (eye_h + gaps["after_eye"] + title_h + gaps["after_title"]
             + n_sub*sub_lh + gaps["after_sub"] + 24 + gaps["after_div"] + 22)
    y = 410 - total/2

    # eyebrow
    draw_tracked(d, cx, y, spec["eyebrow"], f_eye, P["eyebrow"], 6)
    y += eye_h + gaps["after_eye"]

    # titel: roman + kursiv guld på en rad, centrerad
    tr, ti = spec["titel_roman"], spec["titel_kursiv"]
    wr = d.textlength(tr, font=f_rom)
    wi = d.textlength(ti, font=f_ita)
    x0 = cx - (wr+wi)/2
    # baslinjejustering: rita på samma topp-y
    d.text((x0, y), tr, font=f_rom, fill=P["roman"])
    d.text((x0+wr, y), ti, font=f_ita, fill=P["gold"])
    y += title_h + gaps["after_title"]

    # subtitel
    for line in spec["subtitel"]:
        w = d.textlength(line, font=f_sub)
        d.text((cx-w/2, y), line, font=f_sub, fill=P["sub"])
        y += sub_lh
    y += gaps["after_sub"] - sub_lh + sub_lh   # (håll läsbart)
    y = y  # divider-rad
    # divider ✦ ✳ ✦
    dy = y + 8
    star4(d, cx-42, dy, 9, P["div"])
    asterisk(d, cx, dy, 10, P["div"], wd=3)
    star4(d, cx+42, dy, 9, P["div"])
    y += 24 + gaps["after_div"]

    # footer
    draw_tracked(d, cx, y, "AV ANNA MALMBERG · UR FÖRKLARA AI", f_foot, P["footer"], 3)

    out = BILDER + "/" + spec["fil"]
    im.save(out)
    print("skrev", out, im.size)

if __name__ == "__main__":
    vald = sys.argv[1:] or list(OMSLAG)
    for k in vald:
        if k not in OMSLAG:
            print("okänt omslag:", k, "— finns:", ", ".join(OMSLAG)); continue
        rita(k, OMSLAG[k])

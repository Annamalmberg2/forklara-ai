#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""appikoner.py — smider app-ikoner + delningsbild (Open Graph) i husets stil.

Ikonen = husets märke (favicon.svg): gyllene nod på röd tråd, skogsgrön botten.
Renderas i 4× och skalas ned (Lanczos) så kanterna blir len.

  python3 scripts/appikoner.py

Skriver till repo-roten:  icon-192.png  icon-512.png  icon-512-maskable.png
                          apple-touch-icon.png
och till bilder/:         og-forklara.png (1200×630 delningskort)
"""
import math
from PIL import Image, ImageDraw, ImageFont

ROOT   = __file__.rsplit("/scripts/", 1)[0]
BILDER = ROOT + "/content/forklara-ai/bilder"

GREEN = (45, 106, 79)     # #2D6A4F skogsgrön
RED   = (169, 59, 42)     # #A93B2A röda tråden
CREAM = (251, 250, 247)   # #FBFAF7 noden
GOLD  = (184, 137, 46)    # #B8892E guldringen

def blend(bg, fg, a):
    return tuple(round(bg[i]*(1-a) + fg[i]*a) for i in range(3))

# ---- ikon ----------------------------------------------------------------
def icon(size, rounded=True):
    S = size * 4
    im = Image.new("RGB", (S, S), GREEN)
    d = ImageDraw.Draw(im)
    c = S / 2
    # röda tråden (lodrät, 6..58 av 64, 75% opacitet mot grönt)
    tw = S * 4 / 64
    d.rectangle([c-tw/2, S*6/64, c+tw/2, S*58/64], fill=blend(GREEN, RED, 0.75))
    # noden: gräddvit fyllning + guldring
    r    = S * 11 / 64
    ring = round(S * 5 / 64)
    d.ellipse([c-r, c-r, c+r, c+r], fill=CREAM, outline=GOLD, width=ring)
    im = im.resize((size, size), Image.LANCZOS)
    if rounded:
        rad = round(size * 14 / 64)
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, size-1, size-1], radius=rad, fill=255)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(im, (0, 0), mask)
        return out
    return im

def spara_ikoner():
    icon(192).save(ROOT + "/icon-192.png")
    icon(512).save(ROOT + "/icon-512.png")
    icon(512, rounded=False).save(ROOT + "/icon-512-maskable.png")  # full ruta = säker zon
    icon(180, rounded=False).save(ROOT + "/apple-touch-icon.png")   # iOS rundar själv
    print("skrev icon-192/512, icon-512-maskable, apple-touch-icon")

# ---- delningskort (Open Graph 1200×630) ----------------------------------
SERIF = "/System/Library/Fonts/Supplemental/Iowan Old Style.ttc"
SANS  = "/System/Library/Fonts/Avenir Next.ttc"
I_BOLD, I_ITALIC = 1, 2

def _sans(size):
    for idx in (0, 1, 2, 3, 4):
        try: return ImageFont.truetype(SANS, size, index=idx)
        except Exception: continue
    return ImageFont.truetype(SANS, size)

def tracked(d, cx, y, text, font, fill, tr):
    w = sum(d.textlength(ch, font=font) + tr for ch in text) - (tr if text else 0)
    x = cx - w/2
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill); x += d.textlength(ch, font=font) + tr

def star4(d, cx, cy, r, fill):
    d.polygon([(cx, cy-r), (cx+r*.32, cy-r*.32), (cx+r, cy), (cx+r*.32, cy+r*.32),
               (cx, cy+r), (cx-r*.32, cy+r*.32), (cx-r, cy), (cx-r*.32, cy-r*.32)], fill=fill)

def asterisk(d, cx, cy, r, fill, wd=3):
    for k in range(6):
        a = math.pi/2 + k*math.pi/3
        d.line([(cx, cy), (cx+math.cos(a)*r, cy-math.sin(a)*r)], fill=fill, width=wd)

def og_kort():
    SS = 2
    W, H = 1200*SS, 630*SS
    BG=(246,241,231); INK=(35,32,26); GRN=(45,106,79); SUB=(74,69,59)
    TAUPE=(138,129,114); GOLD_=(176,138,62)
    im = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(im); cx = W/2
    f_eye  = _sans(22*SS)
    f_rom  = ImageFont.truetype(SERIF, 120*SS, index=I_BOLD)
    f_ita  = ImageFont.truetype(SERIF, 120*SS, index=I_ITALIC)
    f_sub  = ImageFont.truetype(SERIF, 36*SS, index=I_ITALIC)
    f_foot = _sans(19*SS)
    y = 150*SS
    tracked(d, cx, y, "EN FOLKBILDNING FÖR AI-ÅLDERN", f_eye, TAUPE, 6*SS); y += 66*SS
    tr, ti = "Förklara ", "AI"
    wr = d.textlength(tr, font=f_rom); wi = d.textlength(ti, font=f_ita)
    x0 = cx - (wr+wi)/2
    d.text((x0, y), tr, font=f_rom, fill=INK)
    d.text((x0+wr, y), ti, font=f_ita, fill=GRN)
    y += 150*SS
    sub = "Maskinen gör mönster. Du gör mening."
    d.text((cx - d.textlength(sub, font=f_sub)/2, y), sub, font=f_sub, fill=SUB); y += 74*SS
    star4(d, cx-46*SS, y+8*SS, 10*SS, GOLD_)
    asterisk(d, cx, y+8*SS, 11*SS, GOLD_, wd=3*SS)
    star4(d, cx+46*SS, y+8*SS, 10*SS, GOLD_); y += 62*SS
    tracked(d, cx, y, "AV ANNA MALMBERG · AINNOVA", f_foot, TAUPE, 3*SS)
    im = im.resize((1200, 630), Image.LANCZOS)
    out = BILDER + "/og-forklara.png"; im.save(out); print("skrev", out, im.size)

if __name__ == "__main__":
    spara_ikoner()
    og_kort()

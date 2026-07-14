#!/usr/bin/env python3
"""Skriver bildbankens lista (content/<föreläsning>/bilder.js) från bilder-mappen.

Listan bor i en EGEN fil, inte i manifestet — så en vanlig "Spara" i verktyget
kan aldrig råka radera den. Kör om närhelst bilder lagts till eller tagits bort.
"""
import io
import json
import os
import sys

FÖRELÄSNING = sys.argv[1] if len(sys.argv) > 1 else "forklara-ai"
ROT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAPP = os.path.join(ROT, "content", FÖRELÄSNING, "bilder")
FIL = os.path.join(ROT, "content", FÖRELÄSNING, "bilder.js")


def lista():
    bilder = [f for f in os.listdir(MAPP)
              if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif"))]
    bilder.sort(key=lambda s: s.lower())
    return bilder


if __name__ == "__main__":
    bilder = lista()
    io.open(FIL, "w", encoding="utf-8").write(
        "window.BILDER = " + json.dumps(bilder, ensure_ascii=False) + ";\n")
    print("Bildbanken synkad: %d bilder." % len(bilder))

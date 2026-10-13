#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""cc_licens.py — stämplar CC BY 4.0-märkning i sidornas kolofon.

Lägger en rad sist i <div class="colophon"> (idempotent). Snäll standard:
fri att läsa, dela och bygga vidare på, bara man nämner Anna.

  python3 scripts/cc_licens.py en-bibel.html start.html ...
"""
import io, re, sys

ROOT = __file__.rsplit("/scripts/", 1)[0]

CC = ('<br><span class="cc-licens">Fri att läsa, dela och bygga vidare på under '
      '<a href="https://creativecommons.org/licenses/by/4.0/" rel="license">Creative Commons CC BY 4.0</a>. '
      'Nämn gärna Anna Malmberg och Förklara AI.</span>')


def stampla(path):
    html = io.open(path, encoding="utf-8").read()
    if 'class="cc-licens"' in html:
        print("  %-18s redan stämplad" % path.rsplit("/", 1)[-1]); return True
    html, n = re.subn(r'(<div class="colophon">.*?)(</div>)',
                      lambda m: m.group(1) + CC + m.group(2), html, count=1, flags=re.S)
    if n != 1:
        print("  %-18s ⚠ hittade ingen .colophon" % path.rsplit("/", 1)[-1]); return False
    # liten stil för länken (ärver annars colophon; guld + diskret)
    if ".cc-licens{" not in html:
        html = html.replace("</style>",
            "  .cc-licens{display:inline-block;margin-top:4px;}\n"
            "  .cc-licens a{color:var(--gold);}\n</style>", 1)
    io.open(path, "w", encoding="utf-8").write(html)
    print("  %-18s stämplad CC BY 4.0" % path.rsplit("/", 1)[-1])
    return True


if __name__ == "__main__":
    allok = True
    for f in sys.argv[1:]:
        p = f if "/" in f else ROOT + "/" + f
        allok &= stampla(p)
    sys.exit(0 if allok else 1)

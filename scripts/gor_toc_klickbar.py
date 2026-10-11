#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""gor_toc_klickbar.py — gör böckernas innehållsförteckning klickbar.

För en bok där TOC-raderna och kapitel-sektionerna är lika många och i samma
ordning (verifierat): varje kapitel-<section> får ett id (kap-1, kap-2 …) och
varje TOC-rads titel lindas i en länk dit. Idempotent (nollställer först).

  python3 scripts/gor_toc_klickbar.py en-bibel.html motvikten.html mega.html ...
"""
import io, re, sys

ROOT = __file__.rsplit("/scripts/", 1)[0]


def klickbar(path):
    html = io.open(path, encoding="utf-8").read()

    # 0) nollställ ev. tidigare körning (idempotent)
    html = re.sub(r'<section id="kap-\d+">', '<section>', html)
    html = re.sub(r'<span class="t"><a href="#kap-\d+">(.*?)</a></span>',
                  r'<span class="t">\1</span>', html, flags=re.S)

    # 1) ge varje kapitel-section (de med .opener direkt efter) ett id
    sec = {"n": 0}
    def id_section(m):
        sec["n"] += 1
        return '<section id="kap-%d">%s' % (sec["n"], m.group(1))
    html = re.sub(r'<section>(\s*<div class="opener">)', id_section, html)

    # 2) linda varje TOC-rads titel i en länk till rätt kapitel
    toc = {"n": 0}
    def link_toc(m):
        toc["n"] += 1
        return '%s<a href="#kap-%d">%s</a>%s' % (m.group(1), toc["n"], m.group(2), m.group(3))
    html = re.sub(r'(<li><span class="n">[^<]*</span><span class="t">)(.*?)(</span></li>)',
                  link_toc, html, flags=re.S)

    # 3) TOC-länkar ärver färg (ingen blå understruken), guld vid hovring
    if ".toc a{color:inherit" not in html:
        html = html.replace("</style>",
                            "  .toc a{color:inherit;}\n  .toc .t a:hover{color:var(--gold);}\n</style>", 1)

    io.open(path, "w", encoding="utf-8").write(html)
    ok = sec["n"] == toc["n"] and sec["n"] > 0
    print("  %-18s kapitel=%d  toc-länkar=%d  %s"
          % (path.rsplit("/", 1)[-1], sec["n"], toc["n"], "OK" if ok else "⚠ MATCHAR EJ"))
    return ok


if __name__ == "__main__":
    allok = True
    for f in sys.argv[1:]:
        p = f if "/" in f else ROOT + "/" + f
        allok &= klickbar(p)
    sys.exit(0 if allok else 1)

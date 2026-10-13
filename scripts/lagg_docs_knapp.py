#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""lagg_docs_knapp.py — lägger knappen "Kopiera för Google Docs" i böckerna.

Knappen kopierar hela boken som RICH TEXT (markerar städat innehåll och kör
copy), så man kan klistra rakt in i Google Docs/Word — rubriker, fet och
kursiv följer med, ingen md-konvertering behövs. Idempotent.

  python3 scripts/lagg_docs_knapp.py en-bibel.html motvikten.html ...
"""
import io, re, sys

ROOT = __file__.rsplit("/scripts/", 1)[0]

NY_KNAPP = ('<button class="kopiera-docs" id="kopieradocs" '
            'title="Kopiera hela boken som rich text — klistra in i Google Docs eller Word">'
            'Kopiera för Google Docs</button>')

CSS = """
  /* ---- knapprad + Kopiera för Google Docs ---- */
  .bok-knappar{position:fixed;top:14px;right:14px;z-index:60;display:flex;gap:8px;
    flex-wrap:wrap;justify-content:flex-end;max-width:calc(100% - 28px);}
  .bok-knappar button{position:static;top:auto;right:auto;}
  .kopiera-docs{font-family:var(--sans);font-size:12px;letter-spacing:.03em;height:38px;
    padding:0 15px;border-radius:19px;border:1px solid var(--hair);background:var(--paper);
    color:var(--gold);cursor:pointer;}
  .kopiera-docs:hover{border-color:var(--gold);}
  @media print{.bok-knappar{display:none;}}"""

HANDLER = """
<script>
/* KOPIERA_DOCS_HANDLER */
(function(){
  var kd=document.getElementById("kopieradocs"); if(!kd) return;
  kd.addEventListener("click", function(){
    var wrap=document.querySelector(".wrap").cloneNode(true);
    wrap.querySelectorAll("button,script,.bok-knappar,.toc,.rule-orn,.num,.tag")
        .forEach(function(e){e.remove();});
    wrap.querySelectorAll(".opener").forEach(function(op){
      var h=op.querySelector("h2"), t=h?h.textContent:"";
      var n=document.createElement("h2"); n.textContent=t; op.parentNode.replaceChild(n,op);
    });
    wrap.querySelectorAll(".concept").forEach(function(c){
      var h=document.createElement("h3"); h.textContent=c.textContent;
      var head=c.closest(".section-head")||c; head.parentNode.replaceChild(h,head);
    });
    wrap.querySelectorAll(".label").forEach(function(l){
      var h=document.createElement("h2"); h.textContent=l.textContent; l.parentNode.replaceChild(h,l);
    });
    var holder=document.createElement("div");
    holder.style.cssText="position:fixed;left:-99999px;top:0;";
    holder.appendChild(wrap); document.body.appendChild(holder);
    var sel=getSelection(); sel.removeAllRanges();
    var r=document.createRange(); r.selectNodeContents(wrap); sel.addRange(r);
    var ok=false; try{ok=document.execCommand("copy");}catch(e){}
    sel.removeAllRanges(); document.body.removeChild(holder);
    var o=kd.getAttribute("data-label")||kd.textContent; kd.setAttribute("data-label",o);
    kd.textContent = ok ? "Kopierat \\u2713 — klistra in i Docs" : "Kunde ej kopiera";
    setTimeout(function(){kd.textContent=o;},2400);
  });
})();
</script>"""


def installera(path):
    html = io.open(path, encoding="utf-8").read()
    andrat = False

    # 1) linda de tre knapparna i .bok-knappar och lägg Kopiera-knappen först
    if 'class="bok-knappar"' not in html:
        pat = (r'(<button class="dela-ai".*?</button>\s*'
               r'<button class="skriv-ut".*?</button>\s*'
               r'<button class="tema-vaxel".*?</button>)')
        html, n = re.subn(pat,
                          lambda m: '<div class="bok-knappar">\n' + NY_KNAPP + "\n" + m.group(1) + "\n</div>",
                          html, count=1, flags=re.S)
        andrat = andrat or n == 1

    # 2) CSS
    if ".bok-knappar{" not in html:
        html = html.replace("</style>", CSS + "\n</style>", 1); andrat = True

    # 3) handler
    if "KOPIERA_DOCS_HANDLER" not in html:
        html = html.replace("</body>", HANDLER + "\n</body>", 1); andrat = True

    io.open(path, "w", encoding="utf-8").write(html)
    har_knapp = 'id="kopieradocs"' in html
    har_css = ".bok-knappar{" in html
    har_handler = "KOPIERA_DOCS_HANDLER" in html
    print("  %-18s knapp=%s css=%s handler=%s" %
          (path.rsplit("/", 1)[-1], har_knapp, har_css, har_handler))
    return har_knapp and har_css and har_handler


if __name__ == "__main__":
    allok = True
    for f in sys.argv[1:]:
        p = f if "/" in f else ROOT + "/" + f
        allok &= installera(p)
    sys.exit(0 if allok else 1)

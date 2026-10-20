#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""lagg_docs_knapp.py — knappen "Kopiera för Google Docs" i böckerna.

Kopierar boken som REN semantisk HTML (bara rubriker, stycken, fet/kursiv,
listor och citat), inte den renderade boken med alla rutor och divar. Då
klistras den lika rent i Google Docs/Word som dedikerade md-till-docs-verktyg.
Idempotent; uppdaterar handlern vid varje körning.

  python3 scripts/lagg_docs_knapp.py en-bibel.html motvikten.html ...
"""
import io, re, sys

ROOT = __file__.rsplit("/scripts/", 1)[0]

NY_KNAPP = ('<button class="kopiera-docs" id="kopieradocs" '
            'title="Kopiera hela boken som ren text — klistra in i Google Docs eller Word">'
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
  @media print{.bok-knappar{display:none;}
    .opener{page-break-inside:avoid;break-inside:avoid;}
    .toc{page-break-before:always;}
    .toc li{page-break-inside:avoid;break-inside:avoid;}
    .foreword,.efter,.colophon{page-break-inside:avoid;}}"""

HANDLER = r"""
<script>
/* KOPIERA_DOCS_HANDLER */
(function(){
  var kd=document.getElementById("kopieradocs"); if(!kd) return;
  function docsHTML(){
    var w=document.querySelector(".wrap").cloneNode(true);
    // bort med icke-innehåll
    w.querySelectorAll("button,script,.bok-knappar,.toc,.rule-orn,.num,.tag,.cc-licens,.mark,.by")
     .forEach(function(e){e.remove();});
    // rutor (lost/shield/insight/…) -> blockquote med etiketten som fet inledning
    w.querySelectorAll(".lost,.shield,.insight,.why,.future-box,.maga,.naturlag,.utblick,.keep,.honest")
     .forEach(function(b){
       var lab=b.querySelector('[class$="-label"],[class$="-head"],.label');
       var txt=b.querySelector('[class$="-text"],[class$="-body"]');
       var bq=document.createElement("blockquote");
       bq.innerHTML=(lab?"<strong>"+lab.textContent.trim()+":</strong> ":"")+(txt?txt.innerHTML:b.innerHTML);
       b.parentNode.replaceChild(bq,b);
     });
    // kapitelöppning -> H2, underrubrik -> H3, etikett -> H2
    w.querySelectorAll(".opener").forEach(function(o){var h=o.querySelector("h2");var n=document.createElement("h2");n.textContent=h?h.textContent:o.textContent;o.parentNode.replaceChild(n,o);});
    w.querySelectorAll(".section-head").forEach(function(s){var c=s.querySelector(".concept");var h=document.createElement("h3");h.textContent=c?c.textContent:s.textContent;s.parentNode.replaceChild(h,s);});
    w.querySelectorAll(".extra-head").forEach(function(e){var h=document.createElement("h3");h.textContent=e.textContent;e.parentNode.replaceChild(h,e);});
    w.querySelectorAll(".label").forEach(function(l){var h=document.createElement("h2");h.textContent=l.textContent;l.parentNode.replaceChild(h,l);});
    // begrepp-grid -> lista
    w.querySelectorAll(".extra-grid").forEach(function(g){var ul=document.createElement("ul");Array.prototype.forEach.call(g.children,function(it){var n=it.querySelector(".extra-name"),d=it.querySelector(".extra-desc");var li=document.createElement("li");li.innerHTML=(n?"<strong>"+n.textContent+":</strong> ":"")+(d?d.textContent:it.textContent);ul.appendChild(li);});g.parentNode.replaceChild(ul,g);});
    // undertitel -> kursivt stycke
    w.querySelectorAll(".sub").forEach(function(s){var p=document.createElement("p");p.innerHTML="<em>"+s.textContent.trim()+"</em>";s.parentNode.replaceChild(p,s);});
    // rensa alla class/style/id-attribut
    w.querySelectorAll("*").forEach(function(e){e.removeAttribute("class");e.removeAttribute("style");e.removeAttribute("id");});
    // packa upp alla strukturella behållare + tomma spans -> platt, ren HTML
    var again=true;
    while(again){again=false;
      var ds=w.querySelectorAll("div,section,header,article,aside,figure,figcaption,span");
      for(var i=0;i<ds.length;i++){var d=ds[i],p=d.parentNode;if(!p)continue;while(d.firstChild)p.insertBefore(d.firstChild,d);p.removeChild(d);again=true;}
    }
    return w;
  }
  kd.addEventListener("click",function(){
    var node=docsHTML(), html=node.innerHTML, plain=node.textContent;
    var o=kd.getAttribute("data-label")||kd.textContent; kd.setAttribute("data-label",o);
    function done(){kd.textContent="Kopierat ✓ — klistra in i Docs"; setTimeout(function(){kd.textContent=o;},2400);}
    function fallback(){
      var h=document.createElement("div"); h.style.cssText="position:fixed;left:-99999px;top:0;"; h.innerHTML=html;
      document.body.appendChild(h); var r=document.createRange(); r.selectNodeContents(h);
      var sel=getSelection(); sel.removeAllRanges(); sel.addRange(r);
      try{document.execCommand("copy");done();}catch(e){}
      sel.removeAllRanges(); document.body.removeChild(h);
    }
    if(navigator.clipboard&&window.ClipboardItem){
      try{
        navigator.clipboard.write([new ClipboardItem({
          "text/html":new Blob([html],{type:"text/html"}),
          "text/plain":new Blob([plain],{type:"text/plain"})
        })]).then(done).catch(fallback);
      }catch(e){fallback();}
    } else fallback();
  });
})();
</script>"""


def installera(path):
    html = io.open(path, encoding="utf-8").read()
    # uppdatera handlern: ta bort ev. gammal version först
    html = re.sub(r'\n?<script>\s*/\* KOPIERA_DOCS_HANDLER \*/.*?</script>', '', html, flags=re.S)
    # 1) linda de tre knapparna i .bok-knappar + lägg Kopiera-knappen (idempotent)
    if 'class="bok-knappar"' not in html:
        pat = (r'(<button class="dela-ai".*?</button>\s*'
               r'<button class="skriv-ut".*?</button>\s*'
               r'<button class="tema-vaxel".*?</button>)')
        html = re.sub(pat, lambda m: '<div class="bok-knappar">\n' + NY_KNAPP + "\n" + m.group(1) + "\n</div>",
                      html, count=1, flags=re.S)
    # 2) CSS (idempotent)
    if ".bok-knappar{" not in html:
        html = html.replace("</style>", CSS + "\n</style>", 1)
    # 3) handler (alltid färsk)
    html = html.replace("</body>", HANDLER + "\n</body>", 1)

    io.open(path, "w", encoding="utf-8").write(html)
    ok = 'id="kopieradocs"' in html and ".bok-knappar{" in html and "KOPIERA_DOCS_HANDLER" in html
    print("  %-18s %s" % (path.rsplit("/", 1)[-1], "OK (ren Docs-kopiering)" if ok else "⚠"))
    return ok


if __name__ == "__main__":
    allok = True
    for f in sys.argv[1:]:
        p = f if "/" in f else ROOT + "/" + f
        allok &= installera(p)
    sys.exit(0 if allok else 1)

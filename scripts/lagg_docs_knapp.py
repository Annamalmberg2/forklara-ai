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
  var kd=document.getElementById("kopieradocs");
  var da=document.getElementById("delaai");
  if(!kd && !da) return;
  function docsHTML(){
    var w=document.querySelector(".wrap").cloneNode(true);
    // bort med icke-innehåll
    w.querySelectorAll("button,script,.bok-knappar,.rule-orn,.tag,.cc-licens,.mark,.by")
     .forEach(function(e){e.remove();});
    // innehållsförteckning -> "Innehåll" + ren lista (romerska siffror, som i HTML)
    w.querySelectorAll(".toc").forEach(function(toc){
      var frag=document.createDocumentFragment();
      var h=document.createElement("h2"); h.textContent="Innehåll"; frag.appendChild(h);
      var ul=document.createElement("ul");
      toc.querySelectorAll("li").forEach(function(li){
        var n=li.querySelector(".n"), t=li.querySelector(".t");
        var nn=n?n.textContent.trim():"", tt=t?t.textContent.trim():li.textContent.trim();
        var row=document.createElement("li");
        row.textContent=(nn&&nn!=="✦"?nn+" — ":"")+tt;
        ul.appendChild(row);
      });
      frag.appendChild(ul);
      toc.parentNode.replaceChild(frag,toc);
    });
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
    w.querySelectorAll(".opener").forEach(function(o){
      var num=o.querySelector(".num"), kap=o.querySelector(".kap"), h=o.querySelector("h2");
      var titel=(h?h.textContent:(o.getAttribute("data-rubrik")||o.textContent)).trim();
      var kapw=kap?kap.textContent.trim():"", n=num?num.textContent.trim():"";
      var label=kapw;                                   // ".kap" kan redan bära siffran
      if(n&&n!=="✦"&&label.indexOf(n)===-1){label=label?(label+" "+n):n;}
      var head=document.createElement("h2");
      head.textContent=(label?label+" — ":"")+titel;
      o.parentNode.replaceChild(head,o);
    });
    w.querySelectorAll(".section-head").forEach(function(s){var c=s.querySelector(".concept");var h=document.createElement("h3");h.textContent=c?c.textContent:s.textContent;s.parentNode.replaceChild(h,s);});
    w.querySelectorAll(".extra-head").forEach(function(e){var h=document.createElement("h3");h.textContent=e.textContent;e.parentNode.replaceChild(h,e);});
    w.querySelectorAll(".label").forEach(function(l){var h=document.createElement("h2");h.textContent=l.textContent;l.parentNode.replaceChild(h,l);});
    // begrepp-grid -> lista
    w.querySelectorAll(".extra-grid").forEach(function(g){var ul=document.createElement("ul");Array.prototype.forEach.call(g.children,function(it){var n=it.querySelector(".extra-name"),d=it.querySelector(".extra-desc");var li=document.createElement("li");li.innerHTML=(n?"<strong>"+n.textContent+":</strong> ":"")+(d?d.textContent:it.textContent);ul.appendChild(li);});g.parentNode.replaceChild(ul,g);});
    // tidslinje -> lista, en rad per händelse (annars klistras årtal+text ihop till gröt)
    w.querySelectorAll(".timeline").forEach(function(tl){var ul=document.createElement("ul");tl.querySelectorAll(".tl-row").forEach(function(r){var y=r.querySelector(".tl-year"),t=r.querySelector(".tl-text");var li=document.createElement("li");li.innerHTML=(y?"<strong>"+y.textContent.trim()+"</strong> — ":"")+(t?t.innerHTML.trim():r.innerHTML);ul.appendChild(li);});tl.parentNode.replaceChild(ul,tl);});
    // undertitel -> kursivt stycke
    w.querySelectorAll(".sub").forEach(function(s){var p=document.createElement("p");p.innerHTML="<em>"+s.textContent.trim()+"</em>";s.parentNode.replaceChild(p,s);});
    // städa ev. kvarvarande numreringsspans så inga lösa siffror klistras in
    w.querySelectorAll(".num,.kap").forEach(function(e){e.remove();});
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
  /* ---- samma rena kärna -> Markdown (för "Dela med AI") ---- */
  function inlineMD(node){
    var out="";
    Array.prototype.forEach.call(node.childNodes,function(c){
      if(c.nodeType===3){ out+=c.nodeValue.replace(/\s+/g," "); return; }
      if(c.nodeType!==1) return;
      var t=c.tagName.toLowerCase(), inner=inlineMD(c);
      if(t==="strong"||t==="b"){ out+="**"+inner.trim()+"**"; }
      else if(t==="em"||t==="i"){ out+="*"+inner.trim()+"*"; }
      else if(t==="a"){ var href=c.getAttribute("href")||""; out+=href?("["+inner.trim()+"]("+href+")"):inner; }
      else if(t==="br"){ out+="  \n"; }
      else { out+=inner; }
    });
    return out;
  }
  function blockMD(root){
    var parts=[];
    Array.prototype.forEach.call(root.childNodes,function(n){
      if(n.nodeType===3){ var tx=n.nodeValue.replace(/\s+/g," ").trim(); if(tx)parts.push(tx); return; }
      if(n.nodeType!==1) return;
      var t=n.tagName.toLowerCase();
      if(/^h[1-6]$/.test(t)){ parts.push("######".slice(0,+t.charAt(1))+" "+inlineMD(n).trim()); }
      else if(t==="p"){ var s=inlineMD(n).trim(); if(s)parts.push(s); }
      else if(t==="hr"){ parts.push("---"); }
      else if(t==="blockquote"){ parts.push(blockMD(n).split("\n").map(function(l){return l?"> "+l:">";}).join("\n")); }
      else if(t==="ul"||t==="ol"){
        var i=0, rows=[];
        Array.prototype.forEach.call(n.children,function(li){
          if(li.tagName.toLowerCase()!=="li") return;
          i++; rows.push((t==="ol"?i+". ":"* ")+inlineMD(li).trim());
        });
        if(rows.length)parts.push(rows.join("\n"));
      }
      else { var inner=blockMD(n); if(inner)parts.push(inner); }
    });
    return parts.join("\n\n");
  }
  function docsMD(){ return blockMD(docsHTML()).replace(/\n{3,}/g,"\n\n").trim()+"\n"; }
  /* ---- kopiering ---- */
  function flash(btn,txt){ var o=btn.getAttribute("data-label")||btn.textContent; btn.setAttribute("data-label",o);
    btn.textContent=txt; setTimeout(function(){btn.textContent=o;},2400); }
  function copyRich(html,plain,btn){
    function done(){flash(btn,"Kopierat ✓ — klistra in i Docs");}
    function fallback(){
      var h=document.createElement("div"); h.style.cssText="position:fixed;left:-99999px;top:0;"; h.innerHTML=html;
      document.body.appendChild(h); var r=document.createRange(); r.selectNodeContents(h);
      var sel=getSelection(); sel.removeAllRanges(); sel.addRange(r);
      try{document.execCommand("copy");done();}catch(e){}
      sel.removeAllRanges(); document.body.removeChild(h);
    }
    if(navigator.clipboard&&window.ClipboardItem){
      try{ navigator.clipboard.write([new ClipboardItem({
        "text/html":new Blob([html],{type:"text/html"}),
        "text/plain":new Blob([plain],{type:"text/plain"})
      })]).then(done).catch(fallback); }catch(e){fallback();}
    } else fallback();
  }
  function copyText(md,btn){
    function done(){flash(btn,"Kopierat ✓ — klistra in i din AI");}
    function fallback(){
      var ta=document.createElement("textarea"); ta.value=md;
      ta.style.cssText="position:fixed;left:-99999px;top:0;"; document.body.appendChild(ta);
      ta.focus(); ta.select(); try{document.execCommand("copy");done();}catch(e){}
      document.body.removeChild(ta);
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(md).then(done).catch(fallback);
    } else fallback();
  }
  /* Google Docs -> HTML ur kärnan */
  if(kd) kd.addEventListener("click",function(){ var n=docsHTML(); copyRich(n.innerHTML,n.textContent,kd); });
  /* Dela med AI -> Markdown ur SAMMA kärna. Klona bort böckernas egna
     delaai-lyssnare (BOK_MD / toMD) så allt kommer ur en enda källa. */
  if(da){ var nb=da.cloneNode(true); nb.removeAttribute("onclick");
    da.parentNode.replaceChild(nb,da);
    nb.addEventListener("click",function(){ copyText(docsMD(),nb); }); }
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

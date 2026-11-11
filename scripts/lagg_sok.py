#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lägg in sök-i-boken (BOK_SOK) i en färdig bok-HTML — idempotent efterbehandlare,
syskon till lagg_docs_knapp.installera och cc_licens.stampla.

Självstartande drop-in strax före </body>: en 🔍-knapp i .bok-knappar öppnar ett
sökfält som gulmarkerar och räknar träffar i .wrap (n / m), Enter = nästa,
Skift+Enter = föregående, Esc stänger; fångar även cmd/ctrl+F. Släcker
markeringarna före Dela med AI / Kopiera / Skriv ut. Kräver bara att sidan har
.bok-knappar och .wrap (gäller alla böckerna)."""
import io, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BLOCK = r'''<!-- BOK_SOK: sök-i-boken (likriktad drop-in, dator + telefon) -->
<style>
  .bok-sok-knapp{font-family:var(--sans);font-size:15px;line-height:1;width:38px;height:38px;
    border-radius:50%;border:1px solid var(--hair);background:var(--paper);color:var(--gold);cursor:pointer;}
  .bok-sok-knapp:hover{border-color:var(--gold);}
  .bok-sok{position:fixed;top:60px;right:14px;z-index:70;display:flex;align-items:center;gap:6px;
    background:var(--paper);border:1px solid var(--hair);border-radius:22px;padding:5px 8px 5px 14px;
    box-shadow:0 6px 24px rgba(0,0,0,.14);max-width:calc(100% - 28px);}
  .bok-sok[hidden]{display:none;}
  .bok-sok input{font-family:var(--sans);font-size:15px;border:0;outline:0;background:transparent;
    color:var(--ink);width:40vw;max-width:220px;min-width:110px;}
  .bok-sok input::placeholder{color:var(--taupe);}
  .bok-sok input::-webkit-search-cancel-button{-webkit-appearance:none;appearance:none;}
  .bok-sok-rakn{font-family:var(--sans);font-size:12px;color:var(--taupe);white-space:nowrap;
    min-width:44px;text-align:right;}
  .bok-sok-nav,.bok-sok-stang{font-family:var(--sans);font-size:14px;line-height:1;width:30px;height:30px;
    border-radius:50%;border:1px solid var(--hair);background:var(--paper);color:var(--gold);cursor:pointer;flex:0 0 auto;}
  .bok-sok-nav:hover,.bok-sok-stang:hover{border-color:var(--gold);}
  mark.bok-traff{background:rgba(156,122,48,.22);color:inherit;border-radius:3px;padding:0 1px;}
  mark.bok-traff.aktuell{background:var(--gold);color:var(--paper);}
  @media print{.bok-sok-knapp,.bok-sok{display:none !important;}
    mark.bok-traff{background:none !important;color:inherit !important;}}
</style>
<script>
(function(){
  var knappar=document.querySelector('.bok-knappar');
  var innehall=document.querySelector('.wrap');
  if(!knappar||!innehall) return;

  var sokKnapp=document.createElement('button');
  sokKnapp.className='bok-sok-knapp'; sokKnapp.id='boksokknapp';
  sokKnapp.title='Sök i boken (cmd/ctrl+F)'; sokKnapp.setAttribute('aria-label','Sök i boken');
  sokKnapp.textContent='🔍';
  knappar.insertBefore(sokKnapp, knappar.firstChild);

  var panel=document.createElement('div');
  panel.className='bok-sok'; panel.id='boksok'; panel.hidden=true;
  panel.innerHTML='<input type="search" id="boksokinput" placeholder="Sök i boken…" autocomplete="off" spellcheck="false" aria-label="Sökord">'+
    '<span class="bok-sok-rakn" id="boksokrakn"></span>'+
    '<button class="bok-sok-nav" id="boksokforra" title="Föregående (Skift+Enter)" aria-label="Föregående">↑</button>'+
    '<button class="bok-sok-nav" id="boksoknasta" title="Nästa (Enter)" aria-label="Nästa">↓</button>'+
    '<button class="bok-sok-stang" id="boksokstang" title="Stäng (Esc)" aria-label="Stäng">✕</button>';
  document.body.appendChild(panel);

  var input=panel.querySelector('#boksokinput');
  var rakn=panel.querySelector('#boksokrakn');
  var traffar=[], index=-1;

  function rensa(){
    traffar=[]; index=-1;
    var marks=innehall.querySelectorAll('mark.bok-traff');
    for(var i=0;i<marks.length;i++){
      var m=marks[i], p=m.parentNode;
      p.replaceChild(document.createTextNode(m.textContent), m);
      p.normalize();
    }
  }

  function skip(node){
    for(var el=node.parentNode; el && el!==innehall.parentNode; el=el.parentNode){
      var t=el.nodeName;
      if(t==='SCRIPT'||t==='STYLE'||t==='MARK') return true;
      if(el.classList && (el.classList.contains('bok-knappar')||el.classList.contains('bok-sok'))) return true;
    }
    return false;
  }

  function sok(term){
    rensa();
    term=(term||'').trim();
    if(term.length<2){ rakn.textContent=''; return; }
    var low=term.toLowerCase();
    var walker=document.createTreeWalker(innehall, NodeFilter.SHOW_TEXT, {
      acceptNode:function(n){
        if(!n.nodeValue || n.nodeValue.toLowerCase().indexOf(low)<0) return NodeFilter.FILTER_REJECT;
        if(skip(n)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var noder=[], nn;
    while((nn=walker.nextNode())) noder.push(nn);
    for(var i=0;i<noder.length;i++){
      var node=noder[i], text=node.nodeValue, lower=text.toLowerCase(),
          frag=document.createDocumentFragment(), pos=0, idx;
      while((idx=lower.indexOf(low,pos))>=0){
        if(idx>pos) frag.appendChild(document.createTextNode(text.slice(pos,idx)));
        var mk=document.createElement('mark'); mk.className='bok-traff';
        mk.textContent=text.slice(idx, idx+term.length);
        frag.appendChild(mk); traffar.push(mk);
        pos=idx+term.length;
      }
      if(pos<text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
      node.parentNode.replaceChild(frag, node);
    }
    if(traffar.length){ index=0; markeraAktuell(true); }
    else rakn.textContent='0 träffar';
  }

  function markeraAktuell(scrolla){
    for(var i=0;i<traffar.length;i++) traffar[i].classList.toggle('aktuell', i===index);
    rakn.textContent=(index+1)+' / '+traffar.length;
    if(scrolla && traffar[index]) traffar[index].scrollIntoView({block:'center', behavior:'smooth'});
  }

  function stega(d){
    if(!traffar.length) return;
    index=(index+d+traffar.length)%traffar.length;
    markeraAktuell(true);
  }

  function oppna(){ panel.hidden=false; input.focus(); input.select(); }
  function stang(){ panel.hidden=true; rensa(); input.value=''; rakn.textContent=''; }

  sokKnapp.addEventListener('click', function(){ panel.hidden?oppna():stang(); });
  panel.querySelector('#boksokstang').addEventListener('click', stang);
  panel.querySelector('#boksoknasta').addEventListener('click', function(){ stega(1); });
  panel.querySelector('#boksokforra').addEventListener('click', function(){ stega(-1); });

  var deb;
  input.addEventListener('input', function(){ clearTimeout(deb); deb=setTimeout(function(){ sok(input.value); }, 180); });
  input.addEventListener('keydown', function(e){
    if(e.key==='Enter'){ e.preventDefault(); if(e.shiftKey) stega(-1); else stega(1); }
    else if(e.key==='Escape'){ e.preventDefault(); stang(); }
  });

  document.addEventListener('keydown', function(e){
    if((e.metaKey||e.ctrlKey) && (e.key==='f'||e.key==='F')){ e.preventDefault(); oppna(); }
  });

  ['kopieradocs','delaai','skrivut'].forEach(function(id){
    var b=document.getElementById(id);
    if(b) b.addEventListener('click', rensa, true);
  });
  window.addEventListener('beforeprint', rensa);
})();
</script>
'''

KYR = set("аеорсухіјѕАЕОРСТНКМВ")

def installera(path):
    """Idempotent: lägg BOK_SOK före </body> om det inte redan finns. Returnerar True om sidan har söket."""
    html = io.open(path, encoding="utf-8").read()
    if "BOK_SOK:" not in html:
        assert html.count("</body>") >= 1, "%s: saknar </body>" % path
        html = html.replace("</body>", BLOCK + "</body>", 1)
        io.open(path, "w", encoding="utf-8").write(html)
    ok = "BOK_SOK:" in html and 'id="boksokknapp"' not in html.split("BOK_SOK:")[0]
    assert sum(1 for c in html if c in KYR) == 0, "%s: KYR != 0 efter sök" % path
    return "BOK_SOK:" in html

if __name__ == "__main__":
    mal = sys.argv[1:]
    if not mal:
        print("Användning: python3 lagg_sok.py <fil.html> [...]"); raise SystemExit(1)
    for f in mal:
        p = f if os.path.isabs(f) else os.path.join(ROOT, f)
        fanns = "BOK_SOK:" in io.open(p, encoding="utf-8").read()
        installera(p)
        print("  %-20s  %s  (sök=ja, KYR=0)" % (os.path.basename(p), "redan fanns" if fanns else "lagt till"))
    print("KLART.")

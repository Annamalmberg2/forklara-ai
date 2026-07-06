/* ============================================================
   FÖRKLARA AI — motorn
   Ren vanilla-JS. Inget nätberoende, ingen byggkedja.
   Innehållet bor i content/<föreläsning>/manifest.js
   ============================================================ */
(function () {
  "use strict";

  const L = window.LECTURE;
  if (!L || !Array.isArray(L.kort) || L.kort.length === 0) {
    document.body.innerHTML =
      '<div style="padding:60px;font-family:Georgia,serif;font-size:20px">' +
      "Hittade ingen innehållsfil. Kontrollera content/" +
      (window.LECTURE_ID || "?") + "/manifest.js</div>";
    return;
  }

  const BILDVAG = "content/" + window.LECTURE_ID + "/bilder/";
  const MINNE = "forklara-ai:" + window.LECTURE_ID;

  const sektioner = new Map(L.sektioner.map(s => [s.id, s]));
  const kort = L.kort; // delas med redigeringsläget — samma array
  let index;
  function byggIndex() { index = new Map(kort.map((k, i) => [k.id, i])); }
  byggIndex();

  // ---------- nivåer: skala ner och skala upp med stövlar på ----------
  // djup 1 = kärnan (den korta versionen), 2 = berättelsen (standard),
  // 3 = fördjupning (biblioteket, teknik-extra). Nivån styr vad pilarna
  // bläddrar genom — ALLT är alltid sökbart oavsett nivå.
  const NIVANAMN = { 1: "Kärnan", 2: "Berättelsen", 3: "Fördjupning" };
  let nivå = 2;
  let stigMärke = null; // kortet vi lämnade stigen ifrån — vägen hem

  const iBerättelsen = k =>
    !(sektioner.get(k.sektion) || {}).bakom && (k.djup || 2) <= nivå;
  const berättelseKort = () => kort.filter(iBerättelsen);

  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const bildUrl = k => BILDVAG + encodeURIComponent(k.bild);

  // ---------- tillstånd ----------
  let aktuellId = null;

  function sparat() {
    try { return JSON.parse(localStorage.getItem(MINNE)) || {}; }
    catch (e) { return {}; }
  }
  function spara(patch) {
    try {
      localStorage.setItem(MINNE, JSON.stringify(Object.assign(sparat(), patch)));
    } catch (e) { /* privat läge — ingen fara */ }
  }

  // ---------- visa ett kort ----------
  function visa(id, frånHash) {
    const k = kort[index.get(id)];
    if (!k) return;
    const föregående = aktuellId;
    aktuellId = id;
    if (!frånHash) history.replaceState(null, "", "#" + encodeURIComponent(id));
    spara({ senast: id });

    const sek = sektioner.get(k.sektion) || { namn: "" };

    // Bild eller textkort
    const ram = $("bildram");
    ram.innerHTML = "";
    if (k.bild) {
      const img = el("img");
      img.src = bildUrl(k);
      img.alt = k.titel;
      ram.appendChild(img);
    } else {
      const t = el("div", "textkort");
      String(k.text || "").split(/\n\s*\n/).forEach(stycke => {
        t.appendChild(el("p", null, stycke.replace(/\n/g, " ")));
      });
      ram.appendChild(t);
    }

    $("eyebrow").textContent = k.sektion + " · " + sek.namn;
    $("korttitel").textContent = k.titel;
    $("sektionsnamn").textContent = sek.namn;

    // Panelen
    fyllPanel(k);

    // Statusrad — position i berättelsen på aktuell nivå
    const lista = berättelseKort();
    const bi = lista.findIndex(x => x.id === id);
    $("progress").textContent = NIVANAMN[nivå] + " · " + (bi >= 0
      ? (bi + 1) + " / " + lista.length + " · " + sek.namn
      : "utanför nivån · " + sek.namn);

    // Grundstigen: står vi på stigen eller på en avstickare?
    const påStigen = bi >= 0;
    if (!påStigen) {
      const f = föregående != null && index.has(föregående) ? kort[index.get(föregående)] : null;
      if (f && iBerättelsen(f)) stigMärke = föregående;
    } else {
      stigMärke = null;
    }
    $("avstickare").hidden = påStigen;
    uppdateraRail(k.sektion);
    document.dispatchEvent(new CustomEvent("kortbyte", { detail: id }));

    // Ladda grannbilderna i förväg — aldrig vänta på scen
    [nästaKort(1), nästaKort(-1)].forEach(g => {
      if (g && g.bild) { const i = new Image(); i.src = bildUrl(g); }
    });
  }

  function fyllPanel(k) {
    const ant = $("panel-anteckningar");
    ant.textContent = k.anteckningar || "";
    $("panel-anteckningar-block").hidden = !k.anteckningar;

    // Fördjupningen — hopfälld tills någon vill nörda
    const ford = $("panel-fordjupning");
    ford.innerHTML = "";
    if (k.fordjupning) {
      String(k.fordjupning).split(/\n\s*\n/).forEach(st =>
        ford.appendChild(el("p", null, st.replace(/\n/g, " "))));
    }
    $("fordjupning-details").open = false;
    $("panel-fordjupning-block").hidden = !k.fordjupning;

    const ul = $("panel-lankar");
    ul.innerHTML = "";
    (k.lankar || []).forEach(([titel, url]) => {
      const a = el("a", null, titel);
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      const li = el("li"); li.appendChild(a); ul.appendChild(li);
    });
    $("panel-lankar-block").hidden = !(k.lankar && k.lankar.length);

    const amnen = $("panel-amnen");
    amnen.innerHTML = "";
    (k.personer || []).forEach(p => amnen.appendChild(sökChip(p, "chip person")));
    (k.begrepp || []).forEach(b => amnen.appendChild(sökChip(b, "chip")));
    $("panel-amnen-block").hidden = amnen.childElementCount === 0;

    const rel = $("panel-relaterat");
    rel.innerHTML = "";
    (k.relaterat || []).forEach(rid => {
      const rk = kort[index.get(rid)];
      if (!rk) return;
      const b = el("button", "relaterat-chip", rk.titel);
      b.onclick = () => visa(rid);
      rel.appendChild(b);
    });
    $("panel-relaterat-block").hidden = rel.childElementCount === 0;
  }

  function sökChip(text, cls) {
    const b = el("button", cls, text);
    b.title = 'Sök på "' + text + '"';
    b.onclick = () => öppnaPalett(text);
    return b;
  }

  // ---------- navigation ----------
  function nästaKort(riktning) {
    const lista = berättelseKort();
    let bi = lista.findIndex(x => x.id === aktuellId);
    if (bi < 0) {
      // Vi står utanför nivån (djupare kort, reserv, dokumentation) —
      // hitta närmsta hemväg tillbaka in i berättelsen.
      const i = index.get(aktuellId);
      for (let j = i + riktning; j >= 0 && j < kort.length; j += riktning) {
        if (iBerättelsen(kort[j])) return kort[j];
      }
      return lista[riktning > 0 ? 0 : lista.length - 1];
    }
    return lista[bi + riktning] || null;
  }
  function sättNivå(n) {
    if (nivå === n) return;
    nivå = n;
    spara({ niva: n });
    uppdateraNivåUI();
    if (aktuellId) visa(aktuellId, true);
    if (!$("oversikt").hidden) byggÖversikt();
  }
  function stega(riktning) {
    const g = nästaKort(riktning);
    if (g) visa(g.id);
  }

  // ---------- översikten ----------
  function byggÖversikt() {
    $("oversikt-titel").textContent = L.titel;
    $("oversikt-undertitel").textContent = L.undertitel || "";

    const nav = $("kapitelnav");
    nav.innerHTML = "";
    const yta = $("oversikt-sektioner");
    yta.innerHTML = "";

    let bakomTillagd = false;
    L.sektioner.forEach(sek => {
      const korten = kort.filter(k => k.sektion === sek.id);
      if (!korten.length) return;

      if (sek.bakom && !bakomTillagd) {
        yta.appendChild(el("div", null, "Bakom scenen — nås via sök och översikt, ligger utanför pilbläddringen"))
          .id = "bakom-scenen-rubrik";
        bakomTillagd = true;
      }

      const chip = el("button", "chip", sek.id + " " + sek.namn);
      chip.onclick = () => $("sek-" + sek.id).scrollIntoView({ block: "start" });
      nav.appendChild(chip);

      const del = el("section", "oversikt-sektion");
      del.id = "sek-" + sek.id;

      const rubrik = el("div", "oversikt-sektionsrubrik");
      rubrik.appendChild(el("span", "nr", sek.id));
      rubrik.appendChild(el("h2", null, sek.namn));
      rubrik.appendChild(el("span", "antal", korten.length + (korten.length === 1 ? " kort" : " kort")));
      del.appendChild(rubrik);

      const grid = el("div", "kortgrid");
      korten.forEach(k => {
        const mk = el("button", "minikort" + (k.id === aktuellId ? " aktuell" : ""));
        const tumme = el("div", "tumnagel");
        if (k.bild) {
          const img = el("img");
          img.loading = "lazy";
          img.src = bildUrl(k);
          img.alt = "";
          tumme.appendChild(img);
        } else {
          tumme.appendChild(el("div", "textmark", "❡ " + k.titel));
        }
        mk.appendChild(tumme);
        const titelrad = el("div", "mtitel", k.titel);
        const d = k.djup || 2;
        if (d === 1) titelrad.appendChild(el("span", "mniva karna", " · kärnan"));
        if (d === 3) titelrad.appendChild(el("span", "mniva", " · fördjupning"));
        mk.appendChild(titelrad);
        mk.onclick = () => { stängAllt(); visa(k.id); };
        grid.appendChild(mk);
      });
      del.appendChild(grid);
      yta.appendChild(del);
    });
  }

  function växlaÖversikt() {
    const o = $("oversikt");
    if (o.hidden) {
      byggÖversikt();
      o.hidden = false;
      const akt = o.querySelector(".minikort.aktuell");
      if (akt) akt.scrollIntoView({ block: "center" });
    } else {
      o.hidden = true;
    }
  }

  // ---------- den gyllene röda tråden ----------
  // Kapitel med en "tes" bär berättelsen. Läser man teserna uppifrån
  // och ner har man hört hela föreläsningen — det är landningssidan.
  const trådKapitel = L.sektioner.filter(s => s.tes);
  let trådVal = -1;

  function hoppaTillKapitel(sekId) {
    const first = kort.find(k => k.sektion === sekId && iBerättelsen(k)) ||
                  kort.find(k => k.sektion === sekId);
    stängAllt();
    if (first) visa(first.id);
  }

  function byggTråd() {
    $("trad-brand").textContent = L.titel;
    $("trad-halsning").textContent = L.halsning || "";
    $("trad-halsning").hidden = !L.halsning;
    $("trad-titel").textContent = L.fraga || L.titel;
    $("trad-under").textContent =
      (L.undertitel ? L.undertitel + ". " : "") +
      "Den röda tråden — hela berättelsen i ett andetag. Varje stig går att fälla ut.";
    const yta = $("trad-lista");
    yta.innerHTML = "";
    trådKapitel.forEach((sek, i) => {
      const kapitel = el("div", "trad-kapitel");
      const rad = el("div", "trad-rad" + (i === trådVal ? " aktiv" : ""));
      rad.setAttribute("role", "button");
      rad.tabIndex = 0;
      rad.appendChild(el("span", "trad-nod"));
      rad.appendChild(el("span", "trad-nr", sek.id));
      const txt = el("div", "trad-text");
      txt.appendChild(el("h3", null, sek.namn));
      txt.appendChild(el("p", null, sek.tes));
      const antal = kort.filter(k => k.sektion === sek.id).length;
      const visaKnapp = el("button", "trad-visa", "▸ fäll ut stigen — " + antal + " kort");
      visaKnapp.onclick = e => { e.stopPropagation(); växlaUtfall(kapitel, sek, visaKnapp); };
      txt.appendChild(visaKnapp);
      rad.appendChild(txt);
      const nyckel = sek.nyckel != null ? kort[index.get(sek.nyckel)] : null;
      if (nyckel && nyckel.bild) {
        const img = el("img", "trad-bild");
        img.loading = "lazy";
        img.src = bildUrl(nyckel);
        img.alt = "";
        rad.appendChild(img);
      } else {
        rad.appendChild(el("span"));
      }
      rad.onclick = () => hoppaTillKapitel(sek.id);
      rad.onmousemove = () => { if (trådVal !== i) { trådVal = i; ritaTrådVal(); } };
      kapitel.appendChild(rad);
      yta.appendChild(kapitel);
    });
  }

  // Fäll ut en stig direkt på startsidan — alla kort utan att lämna labbet
  function växlaUtfall(kapitel, sek, knapp) {
    const gammal = kapitel.querySelector(".trad-utfall");
    const korten = kort.filter(k => k.sektion === sek.id);
    if (gammal) {
      gammal.remove();
      knapp.textContent = "▸ fäll ut stigen — " + korten.length + " kort";
      return;
    }
    const grid = el("div", "trad-utfall kortgrid");
    korten.forEach(k => {
      const mk = el("button", "minikort");
      const tumme = el("div", "tumnagel");
      if (k.bild) {
        const im = el("img");
        im.loading = "lazy";
        im.src = bildUrl(k);
        im.alt = "";
        tumme.appendChild(im);
      } else {
        tumme.appendChild(el("div", "textmark", "❡ " + k.titel));
      }
      mk.appendChild(tumme);
      mk.appendChild(el("div", "mtitel", k.titel));
      mk.onclick = () => { stängAllt(); visa(k.id); };
      grid.appendChild(mk);
    });
    kapitel.appendChild(grid);
    knapp.textContent = "▾ fäll ihop";
  }

  function ritaTrådVal() {
    [...$("trad-lista").children].forEach((n, i) => {
      const rad = n.querySelector(".trad-rad");
      if (rad) rad.classList.toggle("aktiv", i === trådVal);
    });
    const akt = $("trad-lista").children[trådVal];
    if (akt) akt.scrollIntoView({ block: "nearest" });
  }

  function öppnaTråd() {
    trådVal = -1;
    byggTråd();
    $("trad").hidden = false;
    $("trad").scrollTop = 0;
  }
  function stängTråd() { $("trad").hidden = true; }

  // ---------- kapitelrälsen: grundstigen, alltid synlig ----------
  function byggRail() {
    const rail = $("kapitelrail");
    rail.innerHTML = "";
    trådKapitel.forEach(sek => {
      const b = el("button", "rail-seg");
      b.title = sek.id + " · " + sek.namn;
      b.onclick = () => hoppaTillKapitel(sek.id);
      rail.appendChild(b);
    });
  }
  function uppdateraRail(sekId) {
    const cur = trådKapitel.findIndex(s => s.id === sekId);
    [...$("kapitelrail").children].forEach((n, i) => {
      n.classList.toggle("aktuell", i === cur);
      n.classList.toggle("passerad", cur >= 0 && i < cur);
    });
  }

  // ---------- sökningen: det levande biblioteket ----------
  function normalisera(s) { return (s || "").toLowerCase(); }

  let sökbas;
  function byggSökbas() {
    sökbas = kort.map(k => {
      const sek = sektioner.get(k.sektion) || { namn: "" };
      return {
        k,
        titel: normalisera(k.titel),
        alias: (k.alias || []).map(normalisera),
        personer: (k.personer || []).map(normalisera),
        begrepp: (k.begrepp || []).map(normalisera),
        sektion: normalisera(sek.namn),
        brödtext: normalisera((k.anteckningar || "") + " " + (k.text || "") +
          " " + (k.fordjupning || "") +
          " " + (k.lankar || []).map(l => l[0]).join(" "))
      };
    });
  }
  byggSökbas();

  function sök(fråga) {
    const tokens = normalisera(fråga).split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    const träffar = [];
    for (const post of sökbas) {
      let poäng = 0;
      let träfftext = null;
      let alla = true;
      for (const t of tokens) {
        let p = 0;
        if (post.titel.startsWith(t)) p = 10;
        else if (post.titel.includes(t)) p = 7;
        const iAlias = post.alias.find(x => x.includes(t));
        const iPerson = post.personer.find(x => x.includes(t));
        const iBegrepp = post.begrepp.find(x => x.includes(t));
        if (iAlias) { p = Math.max(p, 9); träfftext = träfftext || post.k.alias[post.alias.indexOf(iAlias)]; }
        if (iPerson) { p = Math.max(p, 9); träfftext = träfftext || post.k.personer[post.personer.indexOf(iPerson)]; }
        if (iBegrepp) { p = Math.max(p, 8); träfftext = träfftext || post.k.begrepp[post.begrepp.indexOf(iBegrepp)]; }
        if (!p && post.sektion.includes(t)) p = 4;
        if (!p && post.brödtext.includes(t)) p = 3;
        if (!p) { alla = false; break; }
        poäng += p;
      }
      if (alla) träffar.push({ post, poäng, träfftext });
    }
    träffar.sort((a, b) => b.poäng - a.poäng || index.get(a.post.k.id) - index.get(b.post.k.id));
    return träffar.slice(0, 12);
  }

  let palettVal = 0;
  let palettTräffar = [];

  function öppnaPalett(förifyllt) {
    $("palett").hidden = false;
    const inp = $("palett-input");
    inp.value = förifyllt || "";
    ritaPalett();
    inp.focus();
    inp.select();
  }
  function stängPalett() { $("palett").hidden = true; }

  function ritaPalett() {
    const ul = $("palett-resultat");
    ul.innerHTML = "";
    const q = $("palett-input").value.trim();
    palettTräffar = q ? sök(q) : [];
    palettVal = Math.min(palettVal, Math.max(0, palettTräffar.length - 1));

    if (q && !palettTräffar.length) {
      const li = el("li");
      li.id = "palett-tomt";
      li.textContent = "Inget hittat — prova ett annat ord.";
      li.style.cursor = "default";
      ul.appendChild(li);
      return;
    }

    palettTräffar.forEach((t, i) => {
      const k = t.post.k;
      const li = el("li", i === palettVal ? "aktiv" : "");
      if (k.bild) {
        const img = el("img", "r-tumme");
        img.loading = "lazy";
        img.src = bildUrl(k);
        img.alt = "";
        li.appendChild(img);
      } else {
        li.appendChild(el("div", "r-tumme-text", "❡"));
      }
      const txt = el("div", "r-text");
      txt.appendChild(el("div", "r-titel", k.titel));
      if (t.träfftext) {
        const rad = el("div", "r-traff");
        rad.innerHTML = "träff: <b></b>";
        rad.querySelector("b").textContent = t.träfftext;
        txt.appendChild(rad);
      }
      li.appendChild(txt);
      li.appendChild(el("span", "r-sektion", (sektioner.get(k.sektion) || {}).namn || k.sektion));
      li.onclick = () => { stängAllt(); visa(k.id); };
      li.onmousemove = () => { if (palettVal !== i) { palettVal = i; ritaPalett(); } };
      ul.appendChild(li);
    });
  }

  // ---------- lägen ----------
  function växlaPanel() {
    document.body.classList.toggle("panel-dold");
    const dold = document.body.classList.contains("panel-dold");
    $("btn-panel").setAttribute("aria-pressed", String(!dold));
    spara({ panelDold: dold });
  }
  function växlaBaraBild() { document.body.classList.toggle("bara-bild"); }
  function scenläge(på) {
    document.body.classList.toggle("bara-bild", på);
    if (på) document.documentElement.requestFullscreen().catch(() => {});
    else if (document.fullscreenElement) document.exitFullscreen();
  }
  function uppdateraNivåUI() {
    document.querySelectorAll("#nivavaljare button").forEach(b =>
      b.classList.toggle("aktiv", Number(b.dataset.niva) === nivå));
  }
  function växlaHelskärm() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }
  function stängAllt() {
    stängPalett();
    $("hjalp").hidden = true;
    $("oversikt").hidden = true;
    stängTråd();
  }

  // ---------- tangentbord ----------
  document.addEventListener("keydown", e => {
    const iPalett = !$("palett").hidden;

    // Sökpaletten fångar sina egna tangenter
    if (iPalett) {
      if (e.key === "Escape") { stängPalett(); e.preventDefault(); }
      else if (e.key === "ArrowDown") { palettVal++; ritaPalett(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { palettVal = Math.max(0, palettVal - 1); ritaPalett(); e.preventDefault(); }
      else if (e.key === "Enter") {
        const t = palettTräffar[palettVal];
        if (t) { stängAllt(); visa(t.post.k.id); }
        e.preventDefault();
      }
      return;
    }

    // Skriver man i ett fält (t.ex. redigeringsläget) är tangenterna DINA —
    // inga genvägar får stjäla mellanslag eller pilar mitt i en mening.
    const mål = e.target;
    if (mål && (mål.tagName === "INPUT" || mål.tagName === "TEXTAREA" ||
                mål.tagName === "SELECT" || mål.isContentEditable)) {
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      öppnaPalett(); e.preventDefault(); return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // Röda tråden fångar sina egna tangenter
    if (!$("trad").hidden) {
      switch (e.key) {
        case "Escape": case "r": case "R": stängTråd(); e.preventDefault(); break;
        case "ArrowDown": case "ArrowRight":
          trådVal = Math.min(trådVal + 1, trådKapitel.length - 1); ritaTrådVal(); e.preventDefault(); break;
        case "ArrowUp": case "ArrowLeft":
          trådVal = Math.max(0, trådVal - 1); ritaTrådVal(); e.preventDefault(); break;
        case "Enter": case " ":
          if (trådVal >= 0) hoppaTillKapitel(trådKapitel[trådVal].id);
          else stängTråd();
          e.preventDefault(); break;
        case "/": öppnaPalett(); e.preventDefault(); break;
        case "g": case "G": stängTråd(); växlaÖversikt(); break;
        case "?": $("hjalp").hidden = false; break;
        case "1": sättNivå(1); break;
        case "2": sättNivå(2); break;
        case "3": sättNivå(3); break;
        default:
          // Börja bara skriva på startsidan — så öppnas sökningen
          if (e.key.length === 1) { öppnaPalett(e.key); e.preventDefault(); }
      }
      return;
    }

    switch (e.key) {
      case "/": öppnaPalett(); e.preventDefault(); break;
      case "ArrowRight": case "PageDown": case " ": stega(1); e.preventDefault(); break;
      case "ArrowLeft": case "PageUp": stega(-1); e.preventDefault(); break;
      case "Home": visa(berättelseKort()[0].id); e.preventDefault(); break;
      case "g": case "G": växlaÖversikt(); break;
      case "r": case "R": öppnaTråd(); break;
      case "1": sättNivå(1); break;
      case "2": sättNivå(2); break;
      case "3": sättNivå(3); break;
      case "n": case "N": växlaPanel(); break;
      case "b": case "B": växlaBaraBild(); break;
      case "f": case "F": växlaHelskärm(); break;
      case "?": $("hjalp").hidden = !$("hjalp").hidden; break;
      case "Escape":
        if (!$("hjalp").hidden) $("hjalp").hidden = true;
        else if (!$("oversikt").hidden) $("oversikt").hidden = true;
        else if (document.body.classList.contains("bara-bild")) växlaBaraBild();
        break;
    }
  });

  $("palett-input").addEventListener("input", () => { palettVal = 0; ritaPalett(); });
  $("palett").addEventListener("click", e => { if (e.target.id === "palett") stängPalett(); });
  $("hjalp").addEventListener("click", e => { if (e.target.id === "hjalp") $("hjalp").hidden = true; });
  $("wordmark").onclick = öppnaTråd;
  document.querySelectorAll(".trad-lank").forEach(b => {
    b.onclick = () => hoppaTillKapitel(b.dataset.sek);
  });

  // Verktygsraden — allt klickbart, inget att memorera
  $("btn-sok").onclick = () => öppnaPalett();
  $("btn-trad").onclick = öppnaTråd;
  $("btn-oversikt").onclick = () => { stängTråd(); växlaÖversikt(); };
  $("trad-sok").onclick = () => öppnaPalett();
  $("btn-panel").onclick = växlaPanel;
  $("btn-scen").onclick = () => scenläge(true);
  $("btn-avsluta-scen").onclick = () => scenläge(false);
  $("btn-stig").onclick = () => {
    if (stigMärke != null && index.has(stigMärke)) visa(stigMärke);
    else { const hem = nästaKort(-1) || berättelseKort()[0]; if (hem) visa(hem.id); }
  };
  document.querySelectorAll("#nivavaljare button").forEach(b => {
    b.onclick = () => sättNivå(Number(b.dataset.niva));
  });
  $("klickzon-fram").onclick = () => stega(1);
  $("klickzon-bak").onclick = () => stega(-1);
  $("hjalptips").style.cursor = "pointer";
  $("hjalptips").onclick = () => { $("hjalp").hidden = false; };
  window.addEventListener("hashchange", () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (index.has(id) && id !== aktuellId) visa(id, true);
  });

  // ---------- klockan: alltid veta hur länge man pratat ----------
  function uppdateraKlocka() {
    $("klocka").textContent = new Date().toLocaleTimeString("sv-SE",
      { hour: "2-digit", minute: "2-digit" });
  }
  setInterval(uppdateraKlocka, 20000);
  uppdateraKlocka();

  // ---------- start ----------
  document.title = L.titel + " — föreläsningsverktyg";
  const minne = sparat();
  if (minne.panelDold) document.body.classList.add("panel-dold");
  $("btn-panel").setAttribute("aria-pressed", String(!minne.panelDold));
  if ([1, 2, 3].includes(minne.niva)) nivå = minne.niva;
  uppdateraNivåUI();
  byggRail();

  const hadeDjuplänk = index.has(decodeURIComponent(location.hash.slice(1)));
  const startId = (() => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (index.has(h)) return h;
    if (minne.senast && index.has(minne.senast)) return minne.senast;
    return berättelseKort()[0].id;
  })();
  visa(startId);

  // Man landar alltid på den röda tråden — hela historien först,
  // detaljerna ett Enter bort. (Djuplänkar med #kort-id går direkt.)
  if (!hadeDjuplänk) öppnaTråd();

  // Liten API-yta för redigeringsläget (redigering.js)
  window.APP = {
    aktuellt: () => aktuellId,
    visa: id => visa(id),
    uppdatera: () => {
      byggIndex();
      byggSökbas();
      byggRail();
      if (aktuellId && index.has(aktuellId)) visa(aktuellId, true);
      else visa(berättelseKort()[0].id);
      if (!$("oversikt").hidden) byggÖversikt();
    }
  };
})();

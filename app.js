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

  // ---------- stigar: samma skog, olika vandringar ----------
  // stig = null betyder hela berättelsen. En vald stig styr bara vad
  // pilarna bläddrar genom — ALLT är alltid sökbart oavsett stig.
  const STIGAR = L.stigar || [];
  let stig = null;
  let stigMärke = null; // kortet vi lämnade stigen ifrån — vägen hem

  const stigNamn = () => (STIGAR.find(s => s.id === stig) || {}).namn || "Hela berättelsen";
  const iBerättelsen = k =>
    !(sektioner.get(k.sektion) || {}).bakom &&
    (!stig || (k.stigar || []).includes(stig));
  const berättelseKort = () => kort.filter(iBerättelsen);

  function sättStig(s) {
    stig = s;
    spara({ stig: s });
    uppdateraStigUI();
    if (aktuellId) {
      const k = index.has(aktuellId) ? kort[index.get(aktuellId)] : null;
      // Står vi utanför den valda stigen? Börja då från stigens start.
      if (k && !iBerättelsen(k)) {
        const första = berättelseKort()[0];
        if (första) visa(första.id);
      } else {
        visa(aktuellId, true);
      }
    }
    if (!$("trad").hidden) byggTråd();
    if (!$("oversikt").hidden) byggÖversikt();
  }
  function uppdateraStigUI() {
    document.querySelectorAll("#stigval .stig-chip").forEach(b =>
      b.classList.toggle("aktiv", (b.dataset.stig || null) === (stig || null)));
    $("stigmeny").value = stig || "";
  }
  function byggStigmeny() {
    const m = $("stigmeny");
    m.innerHTML = "";
    const o0 = el("option", null, "Hela berättelsen");
    o0.value = "";
    m.appendChild(o0);
    STIGAR.forEach(s => {
      const o = el("option", null, s.namn);
      o.value = s.id;
      m.appendChild(o);
    });
    m.onchange = () => sättStig(m.value || null);
  }

  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  // Ett kort = en berättelse = en eller flera bilder
  const bilderAv = k => k.bilder || (k.bild ? [k.bild] : []);
  const bildUrl = (k, i) => BILDVAG + encodeURIComponent(bilderAv(k)[i || 0]);

  // ---------- tillstånd ----------
  let aktuellId = null;
  let bildIx = 0; // vilken av berättelsens bilder som visas

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
    bildIx = 0;
    if (!frånHash) history.replaceState(null, "", "#" + encodeURIComponent(id));
    spara({ senast: id });

    const sek = sektioner.get(k.sektion) || { namn: "" };

    // Bild eller textkort
    const ram = $("bildram");
    ram.innerHTML = "";
    if (bilderAv(k).length) {
      const img = el("img");
      img.src = bildUrl(k, 0);
      img.alt = k.titel;
      ram.appendChild(img);
    } else {
      const t = el("div", "textkort");
      String(k.text || "").split(/\n\s*\n/).forEach(stycke => {
        t.appendChild(el("p", null, stycke.replace(/\n/g, " ")));
      });
      // Textkortets länkar hör hemma på scenen — med beskrivning,
      // grupperade på Notis (4:e fältet) när sådan finns.
      if ((k.lankar || []).length) {
        const grupper = new Map();
        k.lankar.forEach(par => {
          const notis = par[3] || "";
          if (!grupper.has(notis)) grupper.set(notis, []);
          grupper.get(notis).push(par);
        });
        const flera = grupper.size > 1 || [...grupper.keys()][0];
        grupper.forEach((par, notis) => {
          if (flera && notis) t.appendChild(el("h4", "lank-grupp", notis));
          const grid = el("div", "textkort-lankar");
          par.forEach(([rubrik, url, beskr]) => {
            const a = el("a", "scenlank", null);
            a.href = url;
            a.target = "_blank";
            a.rel = "noopener";
            a.appendChild(el("span", "sl-titel", rubrik));
            if (beskr) a.appendChild(el("span", "sl-desc", beskr));
            grid.appendChild(a);
          });
          t.appendChild(grid);
        });
      }
      ram.appendChild(t);
    }
    ritaPrickar(k);

    $("eyebrow").textContent = k.sektion + " · " + sek.namn;
    $("korttitel").textContent = k.titel;
    $("sektionsnamn").textContent = sek.namn;

    // Panelen
    fyllPanel(k);

    // Statusrad — position i berättelsen på aktuell nivå
    const lista = berättelseKort();
    const bi = lista.findIndex(x => x.id === id);
    $("progress").textContent = stigNamn() + " · " + (bi >= 0
      ? (bi + 1) + " / " + lista.length + " · " + sek.namn
      : "utanför stigen · " + sek.namn);

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

    // Ladda berättelsens och grannarnas bilder i förväg — aldrig vänta på scen
    bilderAv(k).slice(1).forEach((_, j) => { const im = new Image(); im.src = bildUrl(k, j + 1); });
    [nästaKort(1), nästaKort(-1)].forEach(g => {
      if (g && bilderAv(g).length) { const im = new Image(); im.src = bildUrl(g, 0); }
    });
  }

  // Prickraden — var i berättelsens bildspel vi står
  function ritaPrickar(k) {
    const p = $("bildprickar");
    const n = bilderAv(k).length;
    p.innerHTML = "";
    p.hidden = n < 2;
    for (let i = 0; i < n; i++) {
      const d = el("button", "prick" + (i === bildIx ? " aktiv" : ""));
      d.title = "Bild " + (i + 1) + " av " + n;
      d.onclick = () => { bildIx = i; visaBildIx(); };
      p.appendChild(d);
    }
  }
  function visaBildIx() {
    const k = kort[index.get(aktuellId)];
    const img = $("bildram").querySelector("img");
    if (img && k) img.src = bildUrl(k, bildIx);
    if (k) ritaPrickar(k);
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
    // På textkort visas länkarna redan stort på scenen — dubblera inte i panelen
    const länkarPåScenen = !bilderAv(k).length && (k.lankar || []).length > 0;
    $("panel-lankar-block").hidden = !(k.lankar && k.lankar.length) || länkarPåScenen;

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
  function stega(riktning) {
    // Först: bläddra inom berättelsens bildspel
    const k = aktuellId != null && index.has(aktuellId) ? kort[index.get(aktuellId)] : null;
    const antal = k ? bilderAv(k).length : 0;
    if (riktning > 0 && bildIx < antal - 1) { bildIx++; visaBildIx(); return; }
    if (riktning < 0 && bildIx > 0) { bildIx--; visaBildIx(); return; }
    // Sedan: nästa berättelse
    const g = nästaKort(riktning);
    if (g) visa(g.id);
  }

  // ---------- översikten ----------
  let oversiktFilter = null; // null = hela översikten, annars en sektion (t.ex. biblioteket)

  function byggÖversikt() {
    const filtrerad = oversiktFilter
      ? L.sektioner.filter(s => s.id === oversiktFilter)
      : L.sektioner;
    const rubrikSek = oversiktFilter && sektioner.get(oversiktFilter);
    $("oversikt-titel").textContent = rubrikSek ? rubrikSek.namn : L.titel;
    $("oversikt-undertitel").textContent = rubrikSek
      ? "Välj en hylla — allt är också sökbart."
      : (L.undertitel || "");

    const nav = $("kapitelnav");
    nav.innerHTML = "";
    nav.hidden = !!oversiktFilter;
    const yta = $("oversikt-sektioner");
    yta.innerHTML = "";

    let bakomTillagd = false;
    filtrerad.forEach(sek => {
      const korten = kort.filter(k => k.sektion === sek.id);
      if (!korten.length) return;

      if (sek.bakom && !bakomTillagd && !oversiktFilter) {
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
        if (bilderAv(k).length) {
          const img = el("img");
          img.loading = "lazy";
          img.src = bildUrl(k, 0);
          img.alt = "";
          tumme.appendChild(img);
        } else {
          tumme.appendChild(el("div", "textmark",
            "❡" + ((k.lankar || []).length ? "  " + k.lankar.length + " länkar" : "")));
        }
        mk.appendChild(tumme);
        const titelrad = el("div", "mtitel", k.titel);
        if (bilderAv(k).length > 1) {
          titelrad.appendChild(el("span", "mniva", " · " + bilderAv(k).length + " bilder"));
        }
        mk.appendChild(titelrad);
        mk.onclick = () => { stängAllt(); visa(k.id); };
        grid.appendChild(mk);
      });
      del.appendChild(grid);
      yta.appendChild(del);
    });
  }

  function öppnaÖversikt(filter) {
    oversiktFilter = filter || null;
    stängTråd();
    byggÖversikt();
    $("oversikt").hidden = false;
    $("oversikt").scrollTop = 0;
    if (!filter) {
      const akt = $("oversikt").querySelector(".minikort.aktuell");
      if (akt) akt.scrollIntoView({ block: "center" });
    }
  }
  function växlaÖversikt() {
    if ($("oversikt").hidden) öppnaÖversikt(null);
    else $("oversikt").hidden = true;
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
      "Välj en stig — eller vandra hela berättelsen. Varje kapitel går att fälla ut.";

    // Stigvalet — samma skog, olika vandringar
    const val = $("stigval");
    val.innerHTML = "";
    const chip = (id, namn, beskrivning) => {
      const b = el("button", "stig-chip" + (((id || null) === (stig || null)) ? " aktiv" : ""));
      b.dataset.stig = id || "";
      const antal = kort.filter(k => !(sektioner.get(k.sektion) || {}).bakom &&
        (!id || (k.stigar || []).includes(id))).length;
      b.appendChild(el("span", "stig-namn", namn));
      b.appendChild(el("span", "stig-info",
        (beskrivning ? beskrivning + " · " : "") + antal + " berättelser"));
      b.onclick = () => sättStig(id || null);
      val.appendChild(b);
    };
    chip(null, "Hela berättelsen", "Alla kapitel, i din ordning");
    STIGAR.forEach(s => chip(s.id, s.namn, s.beskrivning));

    // Startknappen — vandringen börjar med ett klick
    const startKnapp = $("stig-start");
    const startLista = berättelseKort();
    startKnapp.textContent = startLista.length
      ? "→ Börja vandringen: " + startLista[0].titel
      : "Inga berättelser på den här stigen ännu";
    startKnapp.onclick = () => { if (startLista.length) { stängAllt(); visa(startLista[0].id); } };

    const yta = $("trad-lista");
    yta.innerHTML = "";
    trådKapitel.forEach((sek, i) => {
      const kapitelKort = kort.filter(k => k.sektion === sek.id &&
        (!stig || (k.stigar || []).includes(stig)));
      if (stig && !kapitelKort.length) return; // kapitlet ligger inte på vald stig
      const kapitel = el("div", "trad-kapitel");
      const rad = el("div", "trad-rad" + (i === trådVal ? " aktiv" : ""));
      rad.setAttribute("role", "button");
      rad.tabIndex = 0;
      rad.appendChild(el("span", "trad-nod"));
      rad.appendChild(el("span", "trad-nr", sek.id));
      const txt = el("div", "trad-text");
      txt.appendChild(el("h3", null, sek.namn));
      txt.appendChild(el("p", null, sek.tes));
      const antal = kapitelKort.length;
      const visaKnapp = el("button", "trad-visa",
        "▸ fäll ut — " + antal + (antal === 1 ? " berättelse" : " berättelser"));
      visaKnapp.onclick = e => { e.stopPropagation(); växlaUtfall(kapitel, sek, visaKnapp); };
      txt.appendChild(visaKnapp);
      rad.appendChild(txt);
      const nyckel = sek.nyckel != null ? kort[index.get(sek.nyckel)] : null;
      if (nyckel && bilderAv(nyckel).length) {
        const img = el("img", "trad-bild");
        img.loading = "lazy";
        img.src = bildUrl(nyckel, 0);
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
    const korten = kort.filter(k => k.sektion === sek.id &&
      (!stig || (k.stigar || []).includes(stig)));
    if (gammal) {
      gammal.remove();
      knapp.textContent = "▸ fäll ut — " + korten.length +
        (korten.length === 1 ? " berättelse" : " berättelser");
      return;
    }
    const grid = el("div", "trad-utfall kortgrid");
    korten.forEach(k => {
      const mk = el("button", "minikort");
      const tumme = el("div", "tumnagel");
      if (bilderAv(k).length) {
        const im = el("img");
        im.loading = "lazy";
        im.src = bildUrl(k, 0);
        im.alt = "";
        tumme.appendChild(im);
      } else {
        tumme.appendChild(el("div", "textmark",
            "❡" + ((k.lankar || []).length ? "  " + k.lankar.length + " länkar" : "")));
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
          " " + (k.lankar || []).map(l => l[0] + " " + (l[2] || "")).join(" "))
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
      if (bilderAv(k).length) {
        const img = el("img", "r-tumme");
        img.loading = "lazy";
        img.src = bildUrl(k, 0);
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
  $("btn-oversikt").onclick = () => öppnaÖversikt(null);
  $("btn-bibliotek").onclick = () => öppnaÖversikt("130");
  $("trad-sok").onclick = () => öppnaPalett();
  $("btn-panel").onclick = växlaPanel;
  $("btn-scen").onclick = () => scenläge(true);
  $("btn-avsluta-scen").onclick = () => scenläge(false);
  $("btn-stig").onclick = () => {
    if (stigMärke != null && index.has(stigMärke)) visa(stigMärke);
    else { const hem = nästaKort(-1) || berättelseKort()[0]; if (hem) visa(hem.id); }
  };
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
  if (typeof minne.stig === "string" && STIGAR.some(s => s.id === minne.stig)) stig = minne.stig;
  byggStigmeny();
  uppdateraStigUI();
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

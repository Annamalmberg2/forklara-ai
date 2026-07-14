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
    nollställZoom();
    spara({ senast: id });   // adressen sätts av uppdateraNav (en enda plats)

    const sek = sektioner.get(k.sektion) || { namn: "" };

    // Bild, bildförslag (fråga som väntar på bild) eller textkort
    const ram = $("bildram");
    ram.innerHTML = "";
    if (bilderAv(k).length) {
      const img = el("img");
      img.src = bildUrl(k, 0);
      img.alt = k.titel;
      ram.appendChild(img);
    } else if (k.bildforslag && !k.text) {
      const f = el("div", "bildforslag");
      f.appendChild(el("div", "bf-etikett", "Bildförslag"));
      f.appendChild(el("div", "bf-text", k.bildforslag));
      ram.appendChild(f);
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

    $("eyebrow").textContent = sek.bakom ? sek.namn : sek.id + " · " + sek.namn;
    $("eyebrow").onclick = () => {
      if (sek.bakom) öppnaÖversikt(k.sektion);       // biblioteket/dokumentation → egen översikt
      else {
        öppnaÖversikt(null);
        const s = document.getElementById("sek-" + k.sektion);
        if (s) s.scrollIntoView({ block: "start" });
      }
    };
    $("korttitel").textContent = k.titel;
    $("kortsvar").textContent = k.svar || "";
    $("kortsvar").hidden = !k.svar;
    $("sektionsnamn").textContent = sek.namn;

    // Panelen
    fyllPanel(k);

    // Grundstigen: står vi på stigen eller på en avstickare?
    const påStigen = berättelseKort().some(x => x.id === id);
    if (!påStigen) {
      const f = föregående != null && index.has(föregående) ? kort[index.get(föregående)] : null;
      if (f && iBerättelsen(f)) stigMärke = föregående;
    } else {
      stigMärke = null;
    }
    $("avstickare").hidden = påStigen;
    uppdateraNav();   // både övre menyn och sidfoten på en gång
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

    // Genvägar — samma på varje kort (interna hoppar i verktyget, externa i ny flik)
    const gv = $("panel-genvagar");
    gv.innerHTML = "";
    (L.standardlankar || []).forEach(([namn, url]) => {
      const a = el("a", null, namn);
      a.href = url;
      if (!url.startsWith("#")) { a.target = "_blank"; a.rel = "noopener"; }
      const li = el("li"); li.appendChild(a); gv.appendChild(li);
    });
    $("panel-genvagar-block").hidden = gv.childElementCount === 0;
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

      const chip = el("button", "chip", (sek.bakom ? "" : sek.id + " ") + sek.namn);
      chip.onclick = () => $("sek-" + sek.id).scrollIntoView({ block: "start" });
      nav.appendChild(chip);

      const del = el("section", "oversikt-sektion");
      del.id = "sek-" + sek.id;

      const rubrik = el("div", "oversikt-sektionsrubrik");
      if (!sek.bakom) rubrik.appendChild(el("span", "nr", sek.id));
      rubrik.appendChild(el("h2", null, sek.namn));
      const bildAntal = korten.reduce((s, k) => s + bilderAv(k).length, 0);
      rubrik.appendChild(el("span", "antal",
        korten.length + (korten.length === 1 ? " berättelse" : " berättelser") +
        " · " + bildAntal + (bildAntal === 1 ? " bild" : " bilder")));
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

    // Bildbanken längst ner — alla bilder vi har, fria att välja ur (bara i full översikt)
    if (!oversiktFilter && (window.BILDER || []).length) {
      const använda = new Set(kort.flatMap(k => k.bilder || []));
      const del = el("section", "oversikt-sektion");
      const rubrik = el("div", "oversikt-sektionsrubrik");
      rubrik.appendChild(el("h2", null, "Alla bilder"));
      rubrik.appendChild(el("span", "antal", window.BILDER.length + " bilder · fria att välja ur"));
      del.appendChild(rubrik);
      const grid = el("div", "bildbank");
      window.BILDER.forEach(fil => {
        const ruta = el("a", "bankbild" + (använda.has(fil) ? "" : " fri"));
        ruta.href = BILDVAG + encodeURIComponent(fil);
        ruta.target = "_blank"; ruta.rel = "noopener";
        ruta.title = fil + (använda.has(fil) ? "" : "  (används inte ännu)");
        const img = el("img"); img.loading = "lazy"; img.src = BILDVAG + encodeURIComponent(fil); img.alt = "";
        ruta.appendChild(img);
        grid.appendChild(ruta);
      });
      del.appendChild(grid);
      yta.appendChild(del);
    }
  }

  function öppnaÖversikt(filter) {
    oversiktFilter = filter || null;
    stängTråd();
    byggÖversikt();
    $("oversikt").hidden = false;
    $("oversikt").scrollTop = 0;   // öppna alltid i toppen — förutsägbart
    uppdateraNav();
  }
  function växlaÖversikt() {
    if ($("oversikt").hidden) öppnaÖversikt(null);
    else { $("oversikt").hidden = true; uppdateraNav(); }
  }

  // Varje VY har en egen adress (#hem, #oversikt, #biblioteket) — precis som
  // varje berättelse har sitt #kort-id. Så visar länken alltid var man är.
  let _router = false;
  function nuvarandeHash() {
    if (!$("trad").hidden) return "hem";
    if (!$("oversikt").hidden) return oversiktFilter === "130" ? "biblioteket" : "oversikt";
    if (aktuellId != null) return aktuellId;
    return "hem";
  }

  // Menyn ska visa VAR du är — markera Hem / Översikt / Biblioteket
  // ETT enda ställe som styr både övre menyn OCH sidfoten — de kan aldrig
  // säga olika saker. Var du än är: toppen och botten berättar detsamma.
  function uppdateraNav() {
    if (!_router) history.replaceState(null, "", "#" + encodeURIComponent(nuvarandeHash()));
    const påLabbet = !$("trad").hidden;
    const påÖversikt = !påLabbet && !$("oversikt").hidden;
    const bibÖversikt = påÖversikt && oversiktFilter === "130";
    const prog = $("progress");
    const rensaRäls = () => [...$("kapitelrail").children].forEach(n => n.classList.remove("aktuell", "passerad"));

    // Var är vi? Ett enda svar som styr både toppen och botten.
    const kortNu = (!påLabbet && !påÖversikt && aktuellId != null && index.has(aktuellId))
      ? kort[index.get(aktuellId)] : null;
    const påBibliotek = bibÖversikt || (kortNu && kortNu.sektion === "130");

    const set = (id, på) => { const b = $(id); if (b) b.setAttribute("aria-pressed", String(!!på)); };
    set("btn-trad", påLabbet);
    set("btn-oversikt", påÖversikt && !oversiktFilter);
    set("btn-bibliotek", påBibliotek);

    if (påLabbet) {
      prog.textContent = "Labbet — välj en fråga eller följ berättelsen";
      prog.onclick = () => öppnaÖversikt(null);
      rensaRäls();
    } else if (bibÖversikt) {
      prog.textContent = "Biblioteket — " + kort.filter(k => k.sektion === "130").length + " hyllor";
      prog.onclick = null;
      rensaRäls();
    } else if (påÖversikt) {
      prog.textContent = "Översikt — alla kapitel och hyllor";
      prog.onclick = null;
      rensaRäls();
    } else if (kortNu) {
      const sek = sektioner.get(kortNu.sektion) || { namn: "" };
      if (sek.bakom) {
        // En hylla eller dokumentationssida — hör till sin plats, inte en stig
        prog.textContent = sek.namn + " · " + kortNu.titel;
        prog.onclick = () => öppnaÖversikt(kortNu.sektion);
        rensaRäls();
      } else {
        const lista = berättelseKort();
        const bi = lista.findIndex(x => x.id === aktuellId);
        const pos = bi >= 0 ? (bi + 1) + " / " + lista.length : "utanför";
        prog.textContent = STIGAR.length
          ? stigNamn() + " · " + pos + " · " + sek.namn
          : sek.namn + " · " + pos;
        prog.onclick = () => öppnaÖversikt(null);
        uppdateraRail(kortNu.sektion);
      }
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
      (STIGAR.length
        ? "Välj en stig — eller vandra hela berättelsen. Varje kapitel går att fälla ut."
        : "Sök din fråga, eller fäll ut ett tema. Allt är också sökbart.");

    // Stigvalet — samma skog, olika vandringar (döljs om inga stigar finns)
    const val = $("stigval");
    val.innerHTML = "";
    val.hidden = !STIGAR.length;
    if (STIGAR.length) {
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
    }

    // Startknappen — börja där berättelsen börjar
    const startKnapp = $("stig-start");
    const startLista = berättelseKort();
    startKnapp.textContent = startLista.length
      ? "→ Börja från början: " + startLista[0].titel
      : "Inga berättelser ännu";
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
      if (!sek.bakom) rad.appendChild(el("span", "trad-nr", sek.id));
      const txt = el("div", "trad-text");
      txt.appendChild(el("h3", null, sek.namn));
      txt.appendChild(el("p", null, sek.tes));
      const antal = kapitelKort.length;
      const bilder = kapitelKort.reduce((s, k) => s + bilderAv(k).length, 0);
      const visaKnapp = el("button", "trad-visa",
        "▸ fäll ut — " + antal + (antal === 1 ? " berättelse" : " berättelser") +
        " · " + bilder + (bilder === 1 ? " bild" : " bilder"));
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
    $("oversikt").hidden = true;   // Hem stänger översikten
    oversiktFilter = null;
    byggTråd();
    $("trad").hidden = false;
    $("trad").scrollTop = 0;
    uppdateraNav();
  }
  function stängTråd() { $("trad").hidden = true; uppdateraNav(); }

  // ---------- kapitelrälsen: grundstigen, alltid synlig ----------
  function byggRail() {
    const rail = $("kapitelrail");
    rail.innerHTML = "";
    trådKapitel.forEach(sek => {
      const b = el("button", "rail-seg", sek.id);   // visa kapitelnumret (000, 010 …)
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
        brödtext: normalisera((k.svar || "") + " " + (k.anteckningar || "") + " " + (k.text || "") +
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
  function växlaBaraBild() {
    document.body.classList.toggle("bara-bild");
    if (!document.body.classList.contains("bara-bild")) nollställZoom();
  }

  // ---------- zoom i scenläget: pinch (fingrar), mushjul, klicka & dra ----------
  // Bilden ritas i naturlig upplösning och transformeras (translate+scale) — så
  // kan man zooma djupt och panorera runt. scale = Z.fit betyder "passa skärmen".
  const Z = { fit: 1, scale: 1, tx: 0, ty: 0, klar: false };
  const zoomImg = () => $("bildram").querySelector("img");
  const maxScale = () => Math.max(4, Z.fit * 2);   // ända upp till 4× naturlig storlek

  function initZoom() {
    const ram = $("bildram"), img = zoomImg();
    if (!img || !img.naturalWidth) return;
    const cw = ram.clientWidth, ch = ram.clientHeight;
    if (cw < 20 || ch < 20) return;   // containern inte färdigmätt ännu — försök igen nästa gång
    const nw = img.naturalWidth, nh = img.naturalHeight;
    Z.fit = Math.min(cw / nw, ch / nh);
    Z.scale = Z.fit;
    Z.tx = (cw - nw * Z.fit) / 2;
    Z.ty = (ch - nh * Z.fit) / 2;
    img.style.cssText = "position:absolute;left:0;top:0;max-width:none;max-height:none;" +
      "width:" + nw + "px;height:" + nh + "px;transform-origin:0 0;box-shadow:none;";
    Z.klar = true;
    tillämpaZoom();
  }
  function säkerställInit() { if (!Z.klar) initZoom(); return Z.klar; }
  function tillämpaZoom() {
    const img = zoomImg();
    if (!img) return;
    img.style.transform = "translate(" + Z.tx + "px," + Z.ty + "px) scale(" + Z.scale + ")";
    const inzoomad = Z.scale > Z.fit * 1.01;
    document.body.classList.toggle("zoomad", inzoomad);
    img.style.cursor = inzoomad ? "grab" : "zoom-in";
  }
  function zoomaVid(cx, cy, faktor) {
    const ram = $("bildram"), img = zoomImg();
    if (!img) return;
    const ns = Math.max(Z.fit, Math.min(maxScale(), Z.scale * faktor));
    Z.tx = cx - (cx - Z.tx) * (ns / Z.scale);
    Z.ty = cy - (cy - Z.ty) * (ns / Z.scale);
    Z.scale = ns;
    if (Z.scale <= Z.fit * 1.001) {   // snäpp tillbaka till centrerad passform
      Z.scale = Z.fit;
      Z.tx = (ram.clientWidth - img.naturalWidth * Z.fit) / 2;
      Z.ty = (ram.clientHeight - img.naturalHeight * Z.fit) / 2;
    }
    tillämpaZoom();
  }
  function nollställZoom() {
    document.body.classList.remove("zoomad");
    Z.klar = false;
    const img = zoomImg();
    if (img) img.style.cssText = "";
  }
  function växlaZoom() {   // Z-tangent: snabbväxla passform ↔ 3×
    if (!säkerställInit()) return;
    const ram = $("bildram");
    zoomaVid(ram.clientWidth / 2, ram.clientHeight / 2,
      Z.scale > Z.fit * 1.01 ? 0.001 : 3 / Z.scale);
  }
  function scenläge(på) {
    document.body.classList.toggle("bara-bild", på);
    if (på) {
      Z.klar = false;   // frisk zoom-init vid nästa interaktion
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      nollställZoom();
      if (document.fullscreenElement) document.exitFullscreen();
    }
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
      case "z": case "Z": if (document.body.classList.contains("bara-bild")) växlaZoom(); break;
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
  $("progress").title = "Klicka för att zooma ut till översikten";

  // Zoom & panorering i scenläget — pinch, mushjul, klicka & dra
  (function () {
    const ram = $("bildram");
    const iScen = () => document.body.classList.contains("bara-bild");
    let drag = { on: false, flyttad: false, x: 0, y: 0, tx: 0, ty: 0 };

    ram.addEventListener("wheel", e => {
      if (!iScen()) return;
      e.preventDefault();                 // pinch (ctrl+wheel) och hjul zoomar
      if (!säkerställInit()) return;
      const r = ram.getBoundingClientRect();
      zoomaVid(e.clientX - r.left, e.clientY - r.top, Math.pow(1.0022, -e.deltaY));
    }, { passive: false });

    ram.addEventListener("pointerdown", e => {
      if (!iScen() || !säkerställInit()) return;
      drag.on = true; drag.flyttad = false;
      drag.x = e.clientX; drag.y = e.clientY; drag.tx = Z.tx; drag.ty = Z.ty;
      try { ram.setPointerCapture(e.pointerId); } catch (x) {}
    });
    ram.addEventListener("pointermove", e => {
      if (!drag.on) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 5) drag.flyttad = true;
      if (Z.scale > Z.fit * 1.01) { Z.tx = drag.tx + dx; Z.ty = drag.ty + dy; tillämpaZoom(); }
    });
    ram.addEventListener("pointerup", () => { drag.on = false; });

    ram.addEventListener("click", e => {
      if (!iScen()) return;
      if (drag.flyttad) { drag.flyttad = false; return; }   // det var en panorering
      if (!säkerställInit()) return;
      const r = ram.getBoundingClientRect();
      const cx = e.clientX - r.left, cy = e.clientY - r.top;
      zoomaVid(cx, cy, Z.scale > Z.fit * 1.01 ? 0.001 : 2.6 / Z.scale);  // in mot punkten / ut
    });
  })();
  $("trad-sok").onclick = () => öppnaPalett();
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
    const h = decodeURIComponent(location.hash.slice(1));
    _router = true;
    if (h === "hem") öppnaTråd();
    else if (h === "oversikt") öppnaÖversikt(null);
    else if (h === "biblioteket") öppnaÖversikt("130");
    else if (index.has(h)) {
      $("trad").hidden = true; $("oversikt").hidden = true;
      if (h !== aktuellId) visa(h); else uppdateraNav();
    }
    _router = false;
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
  document.body.classList.remove("panel-dold");  // panelen ska alltid synas (som för besökaren)
  if (typeof minne.stig === "string" && STIGAR.some(s => s.id === minne.stig)) stig = minne.stig;
  byggStigmeny();
  $("stigmeny").hidden = !STIGAR.length;   // ingen stigväljare i menyn utan stigar
  uppdateraStigUI();
  byggRail();

  // Routa efter adressen: #hem / #oversikt / #biblioteket / #kort-id
  const h0 = decodeURIComponent(location.hash.slice(1));
  const kortUnder = (minne.senast && index.has(minne.senast)) ? minne.senast : berättelseKort()[0].id;
  visa(index.has(h0) ? h0 : kortUnder);
  if (h0 === "oversikt") öppnaÖversikt(null);
  else if (h0 === "biblioteket") öppnaÖversikt("130");
  else if (!index.has(h0)) öppnaTråd();   // #hem, tomt eller okänt → labbet
  // (är h0 ett kort-id visas kortet redan, utan lager ovanpå)

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

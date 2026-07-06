/* ============================================================
   FÖRKLARA AI — redigeringsläget
   Syns bara lokalt (aldrig på den publika github.io-länken).
   Ändringar sparas direkt som utkast i webbläsaren och kan
   sedan skrivas till content/<föreläsning>/manifest.js.
   ============================================================ */
(function () {
  "use strict";

  // Den publika länken är en utställning — där finns ingen redigering.
  if (/\.github\.io$/.test(location.hostname)) return;
  if (!window.LECTURE || !window.APP) return;

  const L = window.LECTURE;
  const UTKAST = "forklara-ai:" + window.LECTURE_ID + ":utkast";
  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  let filHandle = null;

  // ---------- utkast ----------
  function sparaUtkast() {
    try { localStorage.setItem(UTKAST, JSON.stringify(L)); } catch (e) {}
    visaStatus("● Utkast — sparat i webbläsaren, inte i filen än");
  }
  function harUtkast() { return !!localStorage.getItem(UTKAST); }

  // ---------- skriv till fil ----------
  function generera() {
    return (
      "// ============================================================\n" +
      "// FÖRKLARA AI — innehållsfil (sparad från redigeringsläget " +
      new Date().toLocaleString("sv-SE") + ")\n" +
      "// Fält per kort: id, sektion, bild (eller text för textkort),\n" +
      "// personer, begrepp, alias, anteckningar, lankar [[rubrik, url]],\n" +
      "// relaterat (id:n), djup (1 = kärnan, 3 = fördjupning).\n" +
      "// ============================================================\n" +
      "window.LECTURE = " + JSON.stringify(L, null, 2) + ";\n"
    );
  }

  async function sparaTillFil() {
    const innehåll = generera();
    if (window.showSaveFilePicker) {
      try {
        if (!filHandle) {
          filHandle = await window.showSaveFilePicker({
            suggestedName: "manifest.js",
            types: [{ description: "JavaScript", accept: { "text/javascript": [".js"] } }]
          });
        }
        const w = await filHandle.createWritable();
        await w.write(innehåll);
        await w.close();
        localStorage.removeItem(UTKAST); // filen är nu sanningen
        visaStatus("✓ Sparat till fil " + new Date().toLocaleTimeString("sv-SE",
          { hour: "2-digit", minute: "2-digit" }));
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
        filHandle = null; // försök på nytt nästa gång
      }
    }
    // Reservväg: ladda ner filen — läggs sedan i content-mappen (ersätt den gamla)
    const blob = new Blob([innehåll], { type: "text/javascript" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "manifest.js";
    a.click();
    visaStatus("↓ Nedladdad — ersätt content/" + window.LECTURE_ID + "/manifest.js");
  }

  function slängUtkast() {
    if (!confirm("Släng alla osparade ändringar och läs om från filen?")) return;
    localStorage.removeItem(UTKAST);
    location.reload();
  }

  // ---------- redigeringsknappen ----------
  const btn = el("button", "vbtn", harUtkast() ? "Redigera ●" : "Redigera");
  btn.id = "btn-redigera";
  btn.title = "Ändra texter, flytta kort mellan kapitel — syns bara på din dator";
  $("verktyg").insertBefore(btn, $("nivavaljare"));
  btn.onclick = växlaRedigering;

  function växlaRedigering() {
    const på = document.body.classList.toggle("redigerar");
    btn.setAttribute("aria-pressed", String(på));
    if (på) {
      document.body.classList.remove("panel-dold"); // panelen behövs för editorn
      $("btn-panel").setAttribute("aria-pressed", "true");
      byggEditor();
    } else {
      const red = $("redigerare");
      if (red) red.remove();
    }
  }

  // ---------- editorn (bor överst i anteckningspanelen) ----------
  function fält(labelText, node) {
    const w = el("div", "red-falt");
    w.appendChild(el("label", "red-label", labelText));
    w.appendChild(node);
    return w;
  }

  function byggEditor() {
    const gammal = $("redigerare");
    if (gammal) gammal.remove();
    const id = window.APP.aktuellt();
    const k = L.kort.find(x => x.id === id);
    if (!k) return;

    const box = el("div");
    box.id = "redigerare";
    box.appendChild(el("div", "panel-label", "Redigera detta kort"));

    // Titel
    const titel = el("input");
    titel.value = k.titel;
    titel.onchange = () => { k.titel = titel.value; sparaUtkast(); window.APP.uppdatera(); };
    box.appendChild(fält("Titel", titel));

    // Kapitel — flytta kortet till rätt serie
    const val = el("select");
    L.sektioner.forEach(s => {
      const o = el("option", null, s.id + " · " + s.namn);
      o.value = s.id;
      if (s.id === k.sektion) o.selected = true;
      val.appendChild(o);
    });
    val.onchange = () => {
      const i = L.kort.indexOf(k);
      L.kort.splice(i, 1);
      let sista = -1;
      L.kort.forEach((x, j) => { if (x.sektion === val.value) sista = j; });
      k.sektion = val.value;
      L.kort.splice(sista + 1, 0, k); // hamnar sist i sitt nya kapitel
      sparaUtkast();
      window.APP.uppdatera();
    };
    box.appendChild(fält("Kapitel", val));

    // Plats i kapitlet
    const flytt = el("div", "red-flytt");
    const upp = el("button", "vbtn", "▲ Tidigare");
    const ner = el("button", "vbtn", "▼ Senare");
    const flytta = riktning => {
      const i = L.kort.indexOf(k);
      for (let j = i + riktning; j >= 0 && j < L.kort.length; j += riktning) {
        if (L.kort[j].sektion === k.sektion) {
          [L.kort[i], L.kort[j]] = [L.kort[j], L.kort[i]];
          sparaUtkast();
          window.APP.uppdatera();
          return;
        }
      }
    };
    upp.onclick = () => flytta(-1);
    ner.onclick = () => flytta(1);
    flytt.appendChild(upp);
    flytt.appendChild(ner);
    box.appendChild(fält("Plats i kapitlet", flytt));

    // Nivå
    const niv = el("select");
    [["1", "1 · Kärnan — med i korta versionen"],
     ["2", "2 · Berättelsen — standard"],
     ["3", "3 · Fördjupning — bara i fulla flödet"]].forEach(([v, t]) => {
      const o = el("option", null, t);
      o.value = v;
      if (String(k.djup || 2) === v) o.selected = true;
      niv.appendChild(o);
    });
    niv.onchange = () => {
      if (niv.value === "2") delete k.djup; else k.djup = Number(niv.value);
      sparaUtkast();
      window.APP.uppdatera();
    };
    box.appendChild(fält("Nivå", niv));

    // Anteckningar
    const ant = el("textarea");
    ant.rows = 6;
    ant.value = k.anteckningar || "";
    ant.onchange = () => {
      if (ant.value.trim()) k.anteckningar = ant.value; else delete k.anteckningar;
      sparaUtkast();
      window.APP.uppdatera();
    };
    box.appendChild(fält("Anteckningar (dina minnesstöd)", ant));

    // Spara-raden
    const rad = el("div", "red-spara");
    const spar = el("button", "vbtn", "Spara till manifest.js");
    spar.onclick = sparaTillFil;
    const slang = el("button", "vbtn", "Släng utkastet");
    slang.onclick = slängUtkast;
    rad.appendChild(spar);
    rad.appendChild(slang);
    box.appendChild(rad);

    const status = el("div");
    status.id = "red-status";
    status.textContent = harUtkast() ? "● Utkast — sparat i webbläsaren, inte i filen än" : "";
    box.appendChild(status);

    $("panel").prepend(box);
  }

  function visaStatus(text) {
    const s = $("red-status");
    if (s) s.textContent = text;
    btn.textContent = harUtkast() ? "Redigera ●" : "Redigera";
  }

  // Byt kort → bygg om editorn (om redigeringsläget är på)
  document.addEventListener("kortbyte", () => {
    if (document.body.classList.contains("redigerar")) byggEditor();
  });
})();

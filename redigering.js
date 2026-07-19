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

  // Kör den lokala motorn (server.py)? Då kan vi spara och publicera
  // direkt — ingen filväljare, ingen terminal.
  let motorFinns = false;
  fetch("/api/status").then(r => r.json()).then(j => {
    motorFinns = !!(j && j.ok);
    // Med motorn igång är FILEN sanningen (allt autosparas dit). Ligger det ändå
    // kvar ett gammalt utkast är det en skugga från förr — läs om från filen så
    // inget spökar, och så att en gammal version aldrig skriver över den färska.
    if (motorFinns && harUtkast()) {
      localStorage.removeItem(UTKAST);
      location.reload();
      return;
    }
    if (motorFinns && document.body.classList.contains("redigerar")) byggEditor();
  }).catch(() => {});

  // ---------- utkast + autospar ----------
  const klockan = () => new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });

  // Med motorn igång sparas varje ändring direkt i filen (och utkastet rensas)
  // så inget gammalt utkast kan byggas upp och spöka nästa gång.
  let autoTimer = null;
  function autoSpara() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(async () => {
      try {
        const svar = await fetch("/api/spara/" + window.LECTURE_ID, { method: "POST", body: generera() });
        const j = await svar.json();
        if (j.ok) { localStorage.removeItem(UTKAST); visaStatus("✓ Sparat " + klockan() + " — klicka Publicera när du vill uppdatera webblänken."); }
        else visaStatus("✗ " + (j.fel || "Kunde inte spara automatiskt."));
      } catch (e) { visaStatus("✗ Motorn svarar inte — starta om via 'Förklara AI.command'."); }
    }, 800);
  }

  function sparaUtkast() {
    try { localStorage.setItem(UTKAST, JSON.stringify(L)); } catch (e) {}
    if (motorFinns) { visaStatus("✎ Sparar …"); autoSpara(); }
    else visaStatus("● Utkast — sparat i webbläsaren, inte i filen än (motorn är inte igång)");
  }
  function harUtkast() { return !!localStorage.getItem(UTKAST); }

  // ---------- skriv till fil ----------
  function generera() {
    return (
      "// ============================================================\n" +
      "// FÖRKLARA AI — innehållsfil (sparad från redigeringsläget " +
      new Date().toLocaleString("sv-SE") + ")\n" +
      "// Ett kort = en berättelse = en eller flera bilder (fältet bilder).\n" +
      "// stigar: teknisk / historisk / filosofisk / komigang — kryssas per kort.\n" +
      "// Övriga fält: id, sektion, titel, text (textkort), personer, begrepp,\n" +
      "// alias, anteckningar, fordjupning, lankar [[rubrik, url]], relaterat.\n" +
      "// ============================================================\n" +
      "window.LECTURE = " + JSON.stringify(L, null, 2) + ";\n"
    );
  }

  async function sparaTillFil() {
    const innehåll = generera();

    // Bästa vägen: motorn skriver på exakt rätt plats i projektet.
    if (motorFinns) {
      try {
        const svar = await fetch("/api/spara/" + window.LECTURE_ID, { method: "POST", body: innehåll });
        const j = await svar.json();
        if (j.ok) {
          localStorage.removeItem(UTKAST);
          visaStatus("✓ Sparat i projektet " + new Date().toLocaleTimeString("sv-SE",
            { hour: "2-digit", minute: "2-digit" }) + " — klicka Publicera när du vill uppdatera webblänken.");
          return true;
        }
        visaStatus("✗ " + (j.fel || "Kunde inte spara."));
        return false;
      } catch (e) {
        visaStatus("✗ Motorn svarar inte — starta om via 'Förklara AI.command'.");
        return false;
      }
    }

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
          { hour: "2-digit", minute: "2-digit" }) +
          " — vill du uppdatera webblänken? Dubbelklicka 'Förklara AI – publicera' på skrivbordet.");
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

  // ---------- bilder ----------
  // Med motorn igång läggs den valda bilden in i projektets bilder-mapp
  // automatiskt — välj den var den än ligger. Utan motor måste filen
  // redan ligga i bilder-mappen (då används bara namnet).
  // Ladda upp en bild till banken → returnerar {ok, filnamn, bank} eller null
  async function laddaUppBild(fil) {
    if (!motorFinns) { visaStatus("✗ Starta motorn (Förklara AI.command) för att lägga till bilder."); return null; }
    try {
      const svar = await fetch("/api/bild/" + window.LECTURE_ID, {
        method: "POST",
        headers: { "X-Filnamn": encodeURIComponent(fil.name) },
        body: fil
      });
      const j = await svar.json();
      if (j.ok) return j;
      visaStatus("✗ " + (j.fel || "Kunde inte ta emot bilden."));
      return null;
    } catch (e) {
      visaStatus("✗ Motorn svarar inte — starta om via 'Förklara AI.command'.");
      return null;
    }
  }

  // Färsk banklista in i minnet + rita om översikten om den syns
  function nyBank(bank) {
    if (Array.isArray(bank)) window.BILDER = bank;
    window.APP.uppdatera();
  }

  // Ta bort en bild ur banken (motorn flyttar filen till ARKIV — raderar aldrig)
  async function taBortUrBanken(fil) {
    if (!motorFinns) { visaStatus("✗ Starta motorn (Förklara AI.command) för att ändra banken."); return null; }
    const iKort = L.kort.filter(k => (k.bilder || []).includes(fil)).map(k => k.titel);
    let text = 'Ta bort "' + fil + '" ur bildbanken?\n(Filen flyttas till mappen ARKIV — inget raderas.)';
    if (iKort.length) text += "\n\nOBS: bilden används i " + iKort.length + " kort:\n• " + iKort.join("\n• ");
    if (!confirm(text)) return null;
    try {
      const svar = await fetch("/api/bild-bort/" + window.LECTURE_ID,
        { method: "POST", headers: { "X-Filnamn": encodeURIComponent(fil) } });
      const j = await svar.json();
      if (j.ok) { visaStatus("✓ " + j.meddelande); return j.bank; }
      visaStatus("✗ " + (j.fel || "Kunde inte ta bort bilden.")); return null;
    } catch (e) { visaStatus("✗ Motorn svarar inte."); return null; }
  }

  // Välj ur bildbanken — och hantera den (lägg till / ta bort). vidVal=null → bara hantera
  function visaBankVal(vidVal) {
    const bakgrund = el("div", "bank-overlay");
    const ruta = el("div", "bank-box");
    const rubrik = el("div", "panel-label");
    const grid = el("div", "bildbank");

    function rita() {
      const bilder = window.BILDER || [];
      const använda = new Set(L.kort.flatMap(k => k.bilder || []));
      rubrik.textContent = (vidVal ? "Välj ur banken" : "Bildbanken") + " — " + bilder.length + " bilder";
      grid.textContent = "";
      bilder.forEach(fil => {
        const cell = el("div", "bankcell" + (använda.has(fil) ? "" : " fri"));
        const b = el("button", "bankbild");
        const img = el("img"); img.loading = "lazy";
        img.src = "content/" + window.LECTURE_ID + "/bilder/" + encodeURIComponent(fil); img.alt = "";
        b.appendChild(img);
        b.title = vidVal ? "Välj den här bilden" : fil;
        if (vidVal) b.onclick = () => { bakgrund.remove(); vidVal(fil); };
        else b.onclick = () => window.open("content/" + window.LECTURE_ID + "/bilder/" + encodeURIComponent(fil), "_blank");
        const bort = el("button", "bank-bort", "✕");
        bort.title = "Ta bort ur banken";
        bort.onclick = async e => { e.stopPropagation(); const nb = await taBortUrBanken(fil); if (nb) { nyBank(nb); rita(); } };
        cell.append(b, bort);
        grid.appendChild(cell);
      });
    }

    const verktyg = el("div", "red-spara");
    const läggTill = el("button", "vbtn", "＋ Lägg till bild i banken");
    läggTill.title = "Välj en bild var den än ligger — motorn kopierar in den och den dyker upp i banken";
    läggTill.onclick = () => {
      const fil = el("input"); fil.type = "file"; fil.accept = "image/*";
      fil.onchange = async () => {
        const f = fil.files[0]; if (!f) return;
        const j = await laddaUppBild(f);
        if (j) { nyBank(j.bank); rita(); visaStatus("✓ " + j.filnamn + " tillagd i banken."); }
      };
      fil.click();
    };
    const klar = el("button", "vbtn", "Stäng");
    klar.onclick = () => bakgrund.remove();
    verktyg.append(läggTill, klar);

    ruta.append(rubrik, verktyg, grid);
    rita();
    bakgrund.appendChild(ruta);
    bakgrund.onclick = e => { if (e.target === bakgrund) bakgrund.remove(); };
    document.body.appendChild(bakgrund);
  }

  // Nås även direkt från "Alla bilder" i Översikten (app.js), inte bara inifrån ett kort
  window.oppnaBankhantering = () => visaBankVal(null);

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

    // Bibliotekshyllor hämtas från Google-arket — allt om dem redigeras DÄR,
    // inte här (annars skulle t.ex. Personer rita hundratals fält). Ark-knappen
    // hör hemma just här — inte på berättelsekort.
    if (k.sektion === "130") {
      const hint = el("div", "red-arkhint");
      hint.innerHTML = "<b>" + k.titel + "</b> är en hylla i biblioteket med " +
        (k.lankar || []).length + " länkar.<br><br>Hela hyllan — rubrik, " +
        "inledningstext och länkar — hämtas från ditt Google Sheet (fliken med " +
        "samma namn). Ändra i arket och tryck knappen nedan.";
      box.appendChild(hint);
      if (motorFinns) {
        const arkRad = el("div", "red-ark");
        const arkBtn = el("button", "vbtn", "⟳ Uppdatera biblioteket från arket");
        arkBtn.onclick = async () => {
          arkBtn.disabled = true; arkBtn.textContent = "Hämtar arket …";
          try {
            const j = await (await fetch("/api/biblioteket", { method: "POST" })).json();
            if (j.ok) {
              if (harUtkast() && !confirm("Biblioteket är uppdaterat i filen. Du har osparade ändringar i webbläsaren — slänga dem och läsa in det färska biblioteket?")) {
                arkBtn.textContent = "✓ " + j.meddelande + " (syns när utkastet sparats/slängts)";
                arkBtn.disabled = false; return;
              }
              localStorage.removeItem(UTKAST); location.reload();
            } else { arkBtn.textContent = "✗ " + (j.fel || "Kunde inte hämta"); arkBtn.disabled = false; }
          } catch (e) { arkBtn.textContent = "✗ Motorn svarar inte"; arkBtn.disabled = false; }
        };
        arkRad.appendChild(arkBtn);
        box.appendChild(arkRad);
      }
      $("panel").prepend(box);
      return;
    }

    // Titel (frågan)
    const titel = el("input");
    titel.value = k.titel;
    titel.onchange = () => { k.titel = titel.value; sparaUtkast(); window.APP.uppdatera(); };
    box.appendChild(fält("Frågan (titel)", titel));

    // Svaret på ett andetag
    const svar = el("textarea");
    svar.rows = 2;
    svar.value = k.svar || "";
    svar.placeholder = "En mening — det du säger om du bara har tio sekunder.";
    svar.onchange = () => {
      if (svar.value.trim()) k.svar = svar.value.trim(); else delete k.svar;
      sparaUtkast(); window.APP.uppdatera();
    };
    box.appendChild(fält("Svaret på ett andetag", svar));

    // Bildförslag (om bild saknas)
    const bf = el("input");
    bf.value = k.bildforslag || "";
    bf.placeholder = "Beskriv bilden som skulle bära frågan (tills du lägger in en riktig).";
    bf.onchange = () => {
      if (bf.value.trim()) k.bildforslag = bf.value.trim(); else delete k.bildforslag;
      sparaUtkast(); window.APP.uppdatera();
    };
    box.appendChild(fält("Bildförslag", bf));

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

    // Stigar — var berättelsen går att nå
    const stigBox = el("div", "red-stigar");
    (L.stigar || []).forEach(s => {
      const lab = el("label", "red-stig");
      const cb = el("input");
      cb.type = "checkbox";
      cb.checked = (k.stigar || []).includes(s.id);
      cb.onchange = () => {
        let st = k.stigar || [];
        st = cb.checked ? [...new Set([...st, s.id])] : st.filter(x => x !== s.id);
        if (st.length) k.stigar = st; else delete k.stigar;
        sparaUtkast();
        window.APP.uppdatera();
      };
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(s.namn));
      stigBox.appendChild(lab);
    });
    box.appendChild(fält("Stigar (Hela berättelsen har alltid med kortet)", stigBox));

    // Se även — koppla ihop berättelser precis som tanken går
    const relBox = el("div");
    (k.relaterat || []).forEach((rid, i) => {
      const mål = L.kort.find(x => x.id === rid);
      const chipEl = el("span", "red-rel", mål ? mål.titel : rid);
      const x = el("button", "vbtn", "✕");
      x.title = "Koppla isär";
      x.onclick = () => {
        k.relaterat.splice(i, 1);
        if (!k.relaterat.length) delete k.relaterat;
        sparaUtkast();
        window.APP.uppdatera();
      };
      chipEl.appendChild(x);
      relBox.appendChild(chipEl);
    });
    const relInp = el("input");
    relInp.placeholder = "Skriv en korttitel och välj i listan …";
    relInp.setAttribute("list", "alla-kort-lista");
    let dl = document.getElementById("alla-kort-lista");
    if (!dl) { dl = el("datalist"); dl.id = "alla-kort-lista"; document.body.appendChild(dl); }
    dl.innerHTML = "";
    L.kort.filter(x => x.id !== k.id).forEach(x => {
      const o = el("option");
      o.value = x.titel;
      dl.appendChild(o);
    });
    relInp.onchange = () => {
      const mål = L.kort.find(x => x.titel === relInp.value.trim() && x.id !== k.id);
      if (!mål) return;
      k.relaterat = [...new Set([...(k.relaterat || []), mål.id])];
      sparaUtkast();
      window.APP.uppdatera();
    };
    relBox.appendChild(relInp);
    box.appendChild(fält("Se även (koppla ihop berättelser)", relBox));

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

    // Fördjupning — för publiken som vill nörda (syns även på webblänken)
    const ford = el("textarea");
    ford.rows = 8;
    ford.placeholder = "Skriv fritt — tom rad ger nytt stycke. Visas hopfälld under 'Fördjupning' i panelen.";
    ford.value = k.fordjupning || "";
    ford.onchange = () => {
      if (ford.value.trim()) k.fordjupning = ford.value; else delete k.fordjupning;
      sparaUtkast();
      window.APP.uppdatera();
    };
    box.appendChild(fält("Fördjupning (för den som vill nörda — syns för publiken)", ford));

    // Länkar — rubrik + adress, så många du vill
    const lankBox = el("div");
    const ritaLankar = () => {
      lankBox.innerHTML = "";
      (k.lankar || []).forEach((par, i) => {
        const lrad = el("div", "red-lank");
        const rub = el("input");
        rub.placeholder = "Rubrik (t.ex. HurDetFunkar)";
        rub.value = par[0] || "";
        rub.onchange = () => { par[0] = rub.value; sparaUtkast(); window.APP.uppdatera(); };
        const url = el("input");
        url.placeholder = "https://…";
        url.value = par[1] || "";
        url.onchange = () => { par[1] = url.value.trim(); sparaUtkast(); window.APP.uppdatera(); };
        const bort = el("button", "vbtn", "✕");
        bort.title = "Ta bort länken";
        bort.onclick = () => {
          k.lankar.splice(i, 1);
          if (!k.lankar.length) delete k.lankar;
          sparaUtkast();
          window.APP.uppdatera();
        };
        lrad.append(rub, url, bort);
        lankBox.appendChild(lrad);
        // Beskrivningsrad — så besökaren vet vad den hittar
        const desc = el("input");
        desc.className = "red-lankdesc";
        desc.placeholder = "Beskrivning — vad hittar besökaren här?";
        desc.value = par[2] || "";
        desc.onchange = () => {
          if (desc.value.trim()) par[2] = desc.value; else if (par.length > 2) par.length = 2;
          sparaUtkast(); window.APP.uppdatera();
        };
        lankBox.appendChild(desc);
      });
      const ny = el("button", "vbtn", "+ Lägg till länk");
      ny.onclick = () => { (k.lankar = k.lankar || []).push(["", ""]); ritaLankar(); };
      lankBox.appendChild(ny);
    };
    ritaLankar();
    box.appendChild(fält("Länkar (klickbara i anteckningspanelen)", lankBox));

    // Bilderna — berättelsens bildspel (motorn tar hand om filerna)
    const bildlista = el("div");
    const bl = k.bilder || (k.bild ? [k.bild] : []);
    const sparaBilder = () => {
      if (bl.length) k.bilder = bl; else delete k.bilder;
      delete k.bild;
      sparaUtkast();
      window.APP.uppdatera();
    };
    bl.forEach((namn, i) => {
      const rad = el("div", "red-bildrad");
      rad.appendChild(el("span", "red-bildinfo", (i + 1) + ". " + namn));
      const upp = el("button", "vbtn", "▲");
      upp.onclick = () => { if (i > 0) { [bl[i - 1], bl[i]] = [bl[i], bl[i - 1]]; sparaBilder(); } };
      const ner = el("button", "vbtn", "▼");
      ner.onclick = () => { if (i < bl.length - 1) { [bl[i + 1], bl[i]] = [bl[i], bl[i + 1]]; sparaBilder(); } };
      const bort = el("button", "vbtn", "✕");
      bort.title = "Ta bort ur berättelsen (filen ligger kvar i mappen)";
      bort.onclick = () => { bl.splice(i, 1); sparaBilder(); };
      rad.append(upp, ner, bort);
      bildlista.appendChild(rad);
    });
    const läggTill = namn => { bl.push(namn); if (k.text) delete k.text; delete k.bildforslag; sparaBilder(); };
    const knapprad = el("div", "red-spara");
    const banken = el("button", "vbtn", "Välj ur banken");
    banken.title = "Kortets bilder väljs alltid ur bildbanken";
    banken.onclick = () => visaBankVal(läggTill);
    const hanteraBank = el("button", "vbtn", "Hantera banken …");
    hanteraBank.title = "Lägg till nya bilder i banken eller ta bort bilder ur den";
    hanteraBank.onclick = () => visaBankVal(null);
    knapprad.append(banken, hanteraBank);
    bildlista.appendChild(knapprad);
    box.appendChild(fält("Bilder (berättelsens bildspel — pilarna bläddrar dem först)", bildlista));

    // Nytt kort · ta bort detta kort
    const kortRad = el("div", "red-spara");
    const nytt = el("button", "vbtn", "+ Nytt kort");
    nytt.title = "Skapar ett tomt kort direkt efter det här — du fyller i det själv";
    nytt.onclick = () => {
      const nyK = {
        id: k.sektion + "-ny" + Date.now().toString(36),
        sektion: k.sektion,
        titel: "Ny fråga",
        svar: "",
        bildforslag: "Beskriv bilden som skulle bära frågan.",
        relaterat: [k.id]           // koppla tillbaka till kortet du kom ifrån
      };
      L.kort.splice(L.kort.indexOf(k) + 1, 0, nyK);   // direkt till höger om det gamla
      sparaUtkast();
      window.APP.uppdatera();
      window.APP.visa(nyK.id);
    };
    const bortKort = el("button", "vbtn", "Ta bort kortet");
    bortKort.onclick = () => {
      if (!confirm('Ta bort "' + k.titel + '" ur föreläsningen?\n(Bildfilen ligger kvar i mappen — inget raderas på disken.)')) return;
      const i = L.kort.indexOf(k);
      L.kort.splice(i, 1);
      const granne = L.kort[Math.min(i, L.kort.length - 1)];
      sparaUtkast();
      window.APP.uppdatera();
      if (granne) window.APP.visa(granne.id);
    };
    kortRad.append(nytt, bortKort);
    box.appendChild(fält("Kort", kortRad));

    // Startsidan — hälsningen och den stora frågan (gäller hela föreläsningen)
    const start = el("details", "red-start");
    start.appendChild(el("summary", null, "Startsidan — hälsning & den stora frågan"));
    [["Hälsning", "halsning"],
     ["Den stora frågan (rubriken på startsidan)", "fraga"],
     ["Titel", "titel"],
     ["Underrubrik", "undertitel"]].forEach(([rubrik, nyckel]) => {
      const inp = el("input");
      inp.value = L[nyckel] || "";
      inp.onchange = () => {
        if (inp.value.trim()) L[nyckel] = inp.value; else delete L[nyckel];
        sparaUtkast();
        window.APP.uppdatera();
      };
      start.appendChild(fält(rubrik, inp));
    });
    box.appendChild(start);

    // Spara-raden
    const rad = el("div", "red-spara");
    const spar = el("button", "vbtn", motorFinns ? "Spara" : "Spara till manifest.js");
    spar.onclick = sparaTillFil;
    rad.appendChild(spar);
    if (motorFinns) {
      const publ = el("button", "vbtn", "Publicera till webben");
      publ.title = "Sparar och skickar allt till webblänken";
      publ.onclick = async () => {
        publ.disabled = true;
        publ.textContent = "Publicerar …";
        try {
          if (await sparaTillFil() === false) return;
          const svar = await fetch("/api/publicera", { method: "POST" });
          const j = await svar.json();
          visaStatus(j.ok ? "✓ " + j.meddelande : "✗ " + (j.fel || "Kunde inte publicera."));
        } catch (e) {
          visaStatus("✗ Motorn svarar inte — starta om via 'Förklara AI.command'.");
        } finally {
          publ.disabled = false;
          publ.textContent = "Publicera till webben";
        }
      };
      rad.appendChild(publ);
    }
    const slang = el("button", "vbtn", "Släng utkastet");
    slang.onclick = slängUtkast;
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

  // Finns ett utkast? Fråga tydligt — annars undrar man varför
  // nya saker i filen inte syns (utkastet går före filen).
  if (harUtkast()) {
    const bar = el("div");
    bar.id = "utkast-banner";
    bar.appendChild(el("span", null,
      "Du har ett utkast med osparade ändringar — det visas i stället för filen."));
    const forts = el("button", "vbtn", "Fortsätt med utkastet");
    forts.onclick = () => bar.remove();
    const slang = el("button", "vbtn", "Släng utkastet – läs från filen");
    slang.onclick = slängUtkast;
    bar.append(forts, slang);
    document.body.appendChild(bar);
  }
})();

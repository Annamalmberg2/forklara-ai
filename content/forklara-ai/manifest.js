// ============================================================
// FÖRKLARA AI — innehållsfil
// Detta är din föreläsning. Allt annat är bara motor.
//
// Så lägger du till en bild:
//   1. Släpp bilden i mappen "bilder"
//   2. Kopiera ett kort nedan och ändra id, titel, bild, m.m.
// Fält:
//   id         unikt, styr ordningen (sektion-position)
//   sektion    vilket avsnitt kortet hör till
//   bild       filnamn i bilder-mappen (utelämna för textkort)
//   text       används för textkort utan bild
//   personer   namn som ska vara sökbara
//   begrepp    ämnen/nyckelord som ska vara sökbara
//   alias      extra sökord (smeknamn, stavningar)
//   anteckningar  dina minnesstöd — syns bara i anteckningsläget
//   lankar     [rubrik, url] — klickbara under anteckningarna
//   relaterat  id:n till kort som hör ihop ("se även")
// ============================================================

window.LECTURE = {
  titel: "Förklara AI",
  undertitel: "Logik är universell",

  // "tes" = kapitlets bärande mening på röda tråden.
  // Läser man bara teserna uppifrån och ner har man hört hela föreläsningen.
  // "nyckel" = kortet vars bild representerar kapitlet på tråden.
  sektioner: [
    { id: "000", namn: "Intro – varför förklara AI?",
      tes: "En lärare byter klassrum — världen behöver förstå AI.", nyckel: "000-30" },
    { id: "010", namn: "Exponentiell utveckling",
      tes: "AI växer exponentiellt men vår intuition är linjär — trettio steg räcker till månen.", nyckel: "010-10" },
    { id: "020", namn: "Historien",
      tes: "Varje ny kunskapsteknik har mött samma oro — från Sokrates till Ada.", nyckel: "020-40" },
    { id: "030", namn: "Spelen – genombrotten",
      tes: "Spelen var träningsläger. Sedan lämnade intelligensen spelbordet.", nyckel: "030-20" },
    { id: "040", namn: "Vad är AI?",
      tes: "AI är ingen maskin och inget bolag — det är ett växande ekosystem.", nyckel: "040-30" },
    { id: "050", namn: "Under huven – LLM",
      tes: "Under huven: tokens, kontext och miljarder parametrar.", nyckel: "050-20" },
    { id: "060", namn: "Mönster & matematik",
      tes: "Mönster är vackra. Bevis är sanning. Skillnaden är hela poängen.", nyckel: "060-10" },
    { id: "070", namn: "Bild-AI & konst",
      tes: "Maskinen målar. Frågan är vem som håller penseln.", nyckel: "070-10" },
    { id: "080", namn: "AI i praktiken",
      tes: "Från revisorn till schackbrädet — riktig nytta i riktig vardag.", nyckel: "080-20" },
    { id: "090", namn: "Människa + AI",
      tes: "Varken människa eller AI når framtiden ensam — värdet skapas i mötet.", nyckel: "090-10" },
    { id: "100", namn: "Etik & vägval",
      tes: "Samma teknik, två vägar: strid eller Astrid. Vi väljer.", nyckel: "100-10" },
    { id: "110", namn: "Framtiden",
      tes: "Våga ha fel — snabbare. Där börjar lärandet.", nyckel: "110-10" },
    { id: "120", namn: "Avslut",
      tes: "Tack — och på återseende.", nyckel: "120-10" },
    { id: "130", namn: "Biblioteket" },
    { id: "900", namn: "Dokumentation", bakom: true },
    { id: "950", namn: "Reserv", bakom: true }
  ],

  kort: [
    // ---------- 000 INTRO ----------
    {
      id: "000-10", djup: 1, sektion: "000", titel: "Logik är universell",
      bild: "000-10 Logik är universell – header.jpg",
      begrepp: ["logik"],
      anteckningar: "Öppningsbilden. Matten, fysiken och AI talar samma språk.\nJag är lärare — jag byter inte yrke, jag byter klassrum.",
      relaterat: ["000-50"]
    },
    {
      id: "000-20", sektion: "000", titel: "AI Anna Intelligens",
      bild: "000-20 AI Anna Intelligens.jpg",
      begrepp: ["AiNNOVA"], alias: ["Anna Malmberg"],
      anteckningar: "Vem jag är: lärare i matematik och fysik → AiNNOVA.\nAI = Anna Intelligens. Skratta först, förklara sen.",
      lankar: [["ainnova.se", "https://ainnova.se"], ["LinkedIn", "https://www.linkedin.com/in/annamalmberg2/"]]
    },
    {
      id: "000-30", djup: 1, sektion: "000", titel: "Hedvig behövs",
      bild: "000-30 Hedvig behövs.png",
      personer: ["Hedvig"], begrepp: ["folkbildning", "Från A till Ö"],
      anteckningar: "1975 satt barn på golvet och försökte förstå vuxna.\n2026 sitter vuxna och försöker förstå teknik.\nFrån A till Ö var mitt första sci-fi-äventyr: videosamtal med mor, inte låta sig luras av svåra ord.\nVi behövde Hedvig då. Vi behöver henne igen — och hon håller."
    },
    {
      id: "000-50", sektion: "000", titel: "Logik är universell – AI Sverige",
      bild: "000-50 Logik är universell – AI Sverige.png",
      begrepp: ["AI Sverige", "community"],
      anteckningar: "Vi lär oss tillsammans. AI Sverige — samtal, delande, folkbildning.",
      lankar: [["AI Sverige på Facebook", "https://www.facebook.com/groups/594222752463207"]],
      relaterat: ["000-10"]
    },

    // ---------- 010 EXPONENTIELL UTVECKLING ----------
    {
      id: "010-10", djup: 1, sektion: "010", titel: "30 steg – två sätt att växa",
      bild: "010-10 30 steg – två sätt att växa.png",
      begrepp: ["exponentiell utveckling", "linjärt", "geometrisk summa"],
      anteckningar: "30 linjära steg = 30 meter. 30 exponentiella steg = förbi månen (1,07 miljoner km).\nVår intuition är linjär. AI-utvecklingen är det inte.\nMatte på tavlan: aritmetisk vs geometrisk summa — läraren i mig får glänsa.",
      relaterat: ["010-20", "950-50"]
    },
    {
      id: "010-20", sektion: "010", titel: "Rallyt – gamla kartan gäller ej",
      bild: "010-20 Rallyt – gamla kartan gäller ej.png",
      begrepp: ["förändring", "gamla kartan"],
      anteckningar: "Kartläsaren läser gårdagens karta — skylten säger 'gammal karta gäller ej'.\nErfarenhet hjälper bara om kartan uppdateras. Gäller oss alla.",
      relaterat: ["010-30", "010-40"]
    },
    {
      id: "010-30", sektion: "010", titel: "Kaptenen till sjöss",
      bild: "010-30 Kaptenen till sjöss.png",
      begrepp: ["förändring"],
      anteckningar: "Samma hav — nya farleder. Sjökortet ritas om medan vi seglar.",
      relaterat: ["010-20"]
    },
    {
      id: "010-40", sektion: "010", titel: "Orienteraren på vift",
      bild: "010-40 Orienteraren på vift.png",
      begrepp: ["förändring"],
      anteckningar: "Terrängen stämmer inte längre med kartan.\nDå gäller det att kunna orientera — inte att ha memorerat vägen.",
      relaterat: ["010-20"]
    },

    // ---------- 020 HISTORIEN ----------
    {
      id: "020-10", djup: 1, sektion: "020", titel: "Kunskapens fyra epoker",
      bild: "020-10 Kunskapens fyra epoker – Sokrates.jpg",
      personer: ["Sokrates"], begrepp: ["skriftspråket", "boktryckarkonsten", "internet", "kunskapens epoker"],
      anteckningar: "Handskrift → tryckpress → internet → AI.\nSokrates var skeptisk till det skrivna ordet: 'det försvagar minnet'.\nVarje epok fick samma kritik. AI är nästa steg på samma resa.",
      relaterat: ["020-20", "100-20"]
    },
    {
      id: "020-20", sektion: "020", titel: "Aristoteles – first principles",
      bild: "020-20 Aristoteles – first principles.png",
      personer: ["Aristoteles"], begrepp: ["first principles"],
      anteckningar: "Bygg från grunden: vad vet vi säkert?\nSamma metod som fysiken — och samma metod jag använder på AI.",
      relaterat: ["020-10", "020-30"]
    },
    {
      id: "020-30", djup: 3, sektion: "020", titel: "Aristoteles – reel",
      bild: "020-30 Aristoteles – reel.png",
      personer: ["Aristoteles"],
      anteckningar: "Kortversionen för sociala medier — filosofi i stående format.",
      relaterat: ["020-20"]
    },
    {
      id: "020-40", sektion: "020", titel: "Ada och Alan – tidslinjen",
      bild: "020-40 Ada och Alan – tidslinjen.png",
      personer: ["Ada Lovelace", "Alan Turing", "Grace Hopper", "John von Neumann"],
      begrepp: ["algoritm", "Turingtest", "Analytical Engine"],
      anteckningar: "Ada Lovelace (1815–1852): den första algoritmen — såg att maskinen kunde mer än räkna.\nAlan Turing (1912–1954): 'kan maskiner tänka?'\nLinjen Ada → Alan → Grace Hopper → von Neumann → idag.\nKvinnorna fanns där från början.",
      relaterat: ["130-20", "130-30"]
    },

    // ---------- 030 SPELEN ----------
    {
      id: "030-10", sektion: "030", titel: "När intelligensen lämnade spelbordet",
      bild: "030-10 När intelligensen lämnade spelbordet.jpg",
      begrepp: ["spel", "AGI"],
      anteckningar: "Spelen var träningsläger.\nSedan lämnade intelligensen spelbordet — ut i proteiner, språk och vardag.",
      relaterat: ["950-60", "030-40"]
    },
    {
      id: "030-20", djup: 1, sektion: "030", titel: "Deep Blue vs Kasparov 1997",
      bild: "030-20 Deep Blue vs Kasparov 1997.png",
      personer: ["Garry Kasparov", "Judit Polgár"], begrepp: ["schack", "Deep Blue", "IBM"],
      anteckningar: "1997: maskinen slår världsmästaren. Rå beräkningskraft + regler.\nKasparov efteråt: 'jag kunde känna en ny sorts intelligens'.\n(Judit Polgár — schackhistoriens starkaste kvinna — hör till samma berättelse.)",
      relaterat: ["030-30", "080-80", "130-20", "950-90"]
    },
    {
      id: "030-30", djup: 1, sektion: "030", titel: "AlphaGo vs Lee Sedol 2016",
      bild: "030-30 AlphaGo vs Lee Sedol 2016.png",
      personer: ["Lee Sedol", "Demis Hassabis"], begrepp: ["Go", "AlphaGo", "drag 37", "DeepMind"],
      anteckningar: "2016: AlphaGo vinner 4–1. Go har fler positioner än atomer i universum.\nDrag 37 — draget ingen människa skulle spela. Kreativitet? Eller statistik?\nLee Sedol slutade senare som proffs.",
      relaterat: ["030-20", "030-40", "950-90"]
    },
    {
      id: "030-40", djup: 1, sektion: "030", titel: "AlphaFold – proteinernas gåta",
      bild: "030-40 AlphaFold – proteinernas gåta.png",
      personer: ["Demis Hassabis", "John Jumper"], begrepp: ["AlphaFold", "proteinveckning", "Nobelpriset"],
      anteckningar: "50 år av proteingåta — löst.\n200 miljoner proteinstrukturer, fritt tillgängliga för världens forskare.\nNobelpriset i kemi 2024. Spelen blev vetenskap.",
      relaterat: ["130-10", "030-30"]
    },

    // ---------- 040 VAD ÄR AI? ----------
    {
      id: "040-10", sektion: "040", titel: "Inte en maskin i traditionell betydelse",
      bild: "040-10 Inte en maskin i traditionell betydelse.png",
      begrepp: ["neurala nätverk"],
      anteckningar: "Ingen skruv, ingen ritning.\nEtt AI programmeras inte rad för rad — det tränas, växer och överraskar.\nDärför beter det sig inte som maskiner vi känner.",
      relaterat: ["040-20", "050-10"]
    },
    {
      id: "040-20", sektion: "040", titel: "AI är ett växande mycel",
      bild: "040-20 AI är ett växande mycel.png",
      begrepp: ["mycel", "ekosystem"],
      anteckningar: "Osynligt under ytan — plötsligt överallt.\nSammankopplat, organiskt, svårt att gräva bort.",
      relaterat: ["040-10", "040-30"]
    },
    {
      id: "040-30", djup: 1, sektion: "040", titel: "Inte bara ett bolag – hela armén",
      bild: "040-30 Inte bara ett bolag – hela armén.png",
      begrepp: ["Claude", "ChatGPT", "Gemini", "DeepSeek", "Qwen", "Mistral", "Llama", "öppna modeller", "Hugging Face"],
      anteckningar: "AI ≠ ett bolag. Ungefär 3 miljoner modeller på Hugging Face.\nDu är befälhavaren — modellerna är soldaterna.\nVälj rätt soldat för rätt uppgift.",
      lankar: [["ChatGPT", "https://chatgpt.com"], ["Google Gemini", "https://gemini.google.com"]],
      relaterat: ["040-20"]
    },

    // ---------- 050 UNDER HUVEN ----------
    {
      id: "050-10", sektion: "050", titel: "Från regler till språk – maskinens resa",
      bild: "050-10 Från regler till språk – maskinens resa.jpg",
      begrepp: ["regelbaserad AI", "maskininlärning", "LLM"],
      anteckningar: "Hårda regler → lärande ur exempel → språk.\nVi slutade programmera svar och började träna förståelse.",
      relaterat: ["050-20", "040-10"]
    },
    {
      id: "050-20", sektion: "050", titel: "Tokens, kontext och det svåraste jobbet",
      bild: "050-20 Tokens, kontext och det svåraste jobbet.jpg",
      begrepp: ["tokens", "kontextfönster"],
      anteckningar: "AI läser i tokens, inte i ord.\nKontextfönstret = arbetsminnet. Det svåraste jobbet: hålla tråden.\n(Precis som jag på scen.)",
      relaterat: ["050-10", "050-30"]
    },
    {
      id: "050-30", sektion: "050", titel: "Under huven – hårdvara och mjukvara",
      bild: "050-30 Under huven – hårdvara och mjukvara.jpg",
      begrepp: ["GPU", "NVIDIA", "träning", "inferens"],
      anteckningar: "Hårdvaran: GPU:er — därför pratar alla om NVIDIA.\nMjukvaran: miljarder parametrar.\nTräningen tar månader och kostar miljarder. Att fråga tar sekunder.",
      relaterat: ["050-40"]
    },
    {
      id: "050-40", sektion: "050", titel: "Patent – kunskapens ekonomi",
      bild: "050-40 Patent – kunskapens ekonomi.jpg",
      begrepp: ["patent", "kunskapens ekonomi", "öppna vikter"],
      anteckningar: "Vem äger kunskapen? Patent, öppna vikter, licenser.\nAktuellt just nu: priserna på minne och hårdvara går upp (sommaren 2026).",
      relaterat: ["050-30", "040-30"]
    },

    // ---------- 060 MÖNSTER & MATEMATIK ----------
    {
      id: "060-10", djup: 1, sektion: "060", titel: "Mönster är vackra, bevis är sanning",
      bild: "060-10 Mönster är vackra, bevis är sanning – 333 333 331.png",
      begrepp: ["primtal", "mönster", "bevis", "Miller-Rabin", "333333331"],
      alias: ["hur jag startade"],
      anteckningar: "31, 331, 3331, 33331 … alla primtal!\nAI:n: '333 333 331 är troligen primtal — 98,7 % säkert.'\nSanningen: 333 333 331 = 17 × 19 607 843.\nMönster är vackra. Bevis är sanning. Så startade jag — och så granskar jag AI.",
      fordjupning: "Följden bildas genom att skjuta in en trea i taget: 31, 331, 3331, 33331 … De åtta första talen är alla primtal. Det nionde, 333 333 331, ser precis likadant ut — men är 17 × 19 607 843.\n\nSå ser AI:s misstag ofta ut: mönstret håller precis länge nog för att vi ska sluta kontrollera. Ett snabbt primtalstest (som Miller–Rabin) svarar 'troligen primtal' med hög säkerhet — men 'troligen' är inte 'bevisat'. Skillnaden mellan statistik och bevis är exakt skillnaden mellan en språkmodells gissning och matematikens sanning.\n\nNörddetalj: att pröva delbarhet med små primtal (7, 11, 13, 17 …) avslöjar bluffen snabbt — redan 17 fäller talet. Det som ser oövervinnerligt ut faller ofta för det enklaste verktyget i lådan.",
      relaterat: ["060-20", "130-30"]
    },
    {
      id: "060-20", sektion: "060", titel: "Bias – när mönstret lurar oss",
      bild: "060-20 Bias – när mönstret lurar oss.jpg",
      begrepp: ["bias", "träningsdata"],
      anteckningar: "AI ärver våra skevheter ur datan.\nMönstret ser övertygande ut — precis som primtalen.\nFråga alltid: vad tränades den på?",
      relaterat: ["060-10", "100-10"]
    },

    // ---------- 070 BILD-AI & KONST ----------
    {
      id: "070-10", djup: 1, sektion: "070", titel: "Mona Lisa Anna",
      bild: "070-10 Mona Lisa Anna.png",
      begrepp: ["bild-AI", "remix"], alias: ["Mona Lisa"],
      anteckningar: "Klassikern remixad. Bild-AI:n har 'sett' hela konsthistorien —\noch sätter in mig i den. Var går gränsen mellan hyllning och stöld?",
      relaterat: ["070-70", "070-20"]
    },
    {
      id: "070-20", sektion: "070", titel: "Jocke – en kvinna i dans",
      bild: "070-20 Jocke – en kvinna i dans.png",
      personer: ["Joakim Johansson"], alias: ["Jocke"],
      anteckningar: "Joakim 'Jocke' Johansson — konstnären.\nVad händer med konsten när maskinen målar?",
      relaterat: ["070-30", "070-40"]
    },
    {
      id: "070-30", sektion: "070", titel: "Jocke – med pensel",
      bild: "070-30 Jocke – med pensel.jpg",
      personer: ["Joakim Johansson"], alias: ["Jocke"],
      anteckningar: "Människan bakom verket.\nAI:n kan imitera stilen — men vem håller penseln?",
      relaterat: ["070-20", "070-40"]
    },
    {
      id: "070-40", sektion: "070", titel: "Målningen – kvinnan lyfter mannen",
      bild: "070-40 Målningen – kvinnan lyfter mannen.png",
      personer: ["Joakim Johansson"], begrepp: ["konst"],
      anteckningar: "Riktig olja på duk — kvinnan i rött lyfter kostymmannen.\nStäll frågan till publiken: kan en maskin mena något?",
      relaterat: ["070-20", "070-30"]
    },
    {
      id: "070-50", sektion: "070", titel: "Mitt profilfoto som grund",
      bild: "070-50 Mitt profilfoto som grund.jpeg",
      begrepp: ["bildgenerering", "träningsbild"],
      anteckningar: "Ett dåligt pixlat foto räckte.\nAlla AI-bilder av mig i föreläsningen utgår från det här originalet.\nVisa originalet — visa sedan varianterna. Publiken brukar flämta.",
      relaterat: ["070-10", "040-30"]
    },
    {
      id: "070-60", sektion: "070", titel: "Skaparkaos",
      bild: "070-60 Skaparkaos.png",
      begrepp: ["kreativitet", "iteration"],
      anteckningar: "Så ser skapandet faktiskt ut: hundra utkast, en robotarm som säger ERROR.\nGuldkorn i kaoset — det som verkar dåligt idag kan vara guld imorgon.",
      relaterat: ["080-95"]
    },
    {
      id: "070-70", djup: 3, sektion: "070", titel: "ImageNet & Fei-Fei Li",
      personer: ["Fei-Fei Li"], begrepp: ["ImageNet", "datorseende", "AlexNet"], alias: ["Fei"],
      text: "2009 bygger Fei-Fei Li ImageNet — 14 miljoner märkta bilder. Idén: intelligensen sitter i datan, inte bara i algoritmen.\n\n2012 vinner AlexNet tävlingen med djupinlärning. Startskottet för den moderna AI-vågen — och vägen till dagens bild-AI.",
      anteckningar: "Bryggan: utan ImageNet ingen bild-AI, ingen Mona Lisa Anna.\nÄnnu en kvinna som byggde grunden.",
      lankar: [["Fei-Fei Li på TED", "https://www.ted.com/talks/fei_fei_li_how_we_re_teaching_computers_to_understand_pictures"]],
      relaterat: ["070-10", "020-40"]
    },

    // ---------- 080 AI I PRAKTIKEN ----------
    {
      id: "080-10", sektion: "080", titel: "Bokföring med AI",
      bild: "080-10 Bokföring med AI.png",
      begrepp: ["bokföring", "vardagsnytta"],
      anteckningar: "Mitt skarpaste test: hela bolagets bokföring, byggd tillsammans med AI.\nInte en demo — verklighet, med revisor och allt.",
      relaterat: ["080-15", "080-20"]
    },
    {
      id: "080-15", sektion: "080", titel: "Verkligheten kommer på besök",
      bild: "080-15 Verkligheten kommer på besök.png",
      personer: ["Jerry"],
      anteckningar: "'På onsdag kommer revisorn. Då får vi se om det vi byggt håller.'\nIdéer → verklighet: underlag, system, kontroll, ansvar.\nAI gör jobbet snabbare. Jag gör valen. Tillsammans blir det bättre.",
      relaterat: ["080-10", "080-20"]
    },
    {
      id: "080-20", djup: 1, sektion: "080", titel: "Verkligheten kom – vi firade med burgare",
      bild: "080-20 Verkligheten kom – vi firade med burgare.png",
      personer: ["Jerry"],
      anteckningar: "Det höll! Revisorn nöjd, Anna nöjd, AI:n nöjd — burgare nöjd.\nPoängen: människor träffas, AI levererar, allt blir klart.",
      relaterat: ["080-15", "090-20"]
    },
    {
      id: "080-30", sektion: "080", titel: "HurDetFunkar",
      bild: "080-30 HurDetFunkar.png",
      begrepp: ["skolan", "experiment"],
      anteckningar: "Min gamla skolhjälpssida — nu mitt experimentlabb.",
      lankar: [["hurdetfunkar.se", "https://hurdetfunkar.se"], ["Pluton B", "https://sites.google.com/view/hurdetfunkar/pluton-b"]],
      relaterat: ["130-40"]
    },
    {
      id: "080-40", sektion: "080", titel: "Traktens",
      bild: "080-40 Traktens.png",
      begrepp: ["Google Sites", "kartautomation"],
      anteckningar: "Byns sida — Google Sites med kartautomation. Gratis verktyg, riktig nytta.",
      lankar: [["traktens.se", "https://www.traktens.se/om-traktens"]],
      relaterat: ["130-40"]
    },
    {
      id: "080-50", sektion: "080", titel: "Notion som anteckningar",
      bild: "080-50 Notion som anteckningar.png",
      begrepp: ["Notion", "skolan", "fria studier"],
      anteckningar: "Anteckningsblocket som blev skolplattform.\nFria studier om AI — välj din stig.",
      lankar: [["Fria studier om AI", "https://delicate-neighbor-37a.notion.site/Fria-studier-om-AI-v-lj-din-stig-1839c8142e3f804bb689ee34f7e30cf0"]],
      relaterat: ["130-40"]
    },
    {
      id: "080-60", sektion: "080", titel: "Bloggen",
      bild: "080-60 Bloggen.png",
      begrepp: ["Wisdom Streamer", "blogg"],
      anteckningar: "Där tankarna landar mellan föreläsningarna — 120 poster, taggade och sökbara.\nBerättelserna bakom många av bilderna bor här.",
      lankar: [["Wisdom Streamer – bloggen", "https://wisdom-streamer.lovable.app/"], ["ainnova.se", "https://ainnova.se"]],
      relaterat: ["130-40"]
    },
    {
      id: "080-70", sektion: "080", titel: "Veckolåtar",
      bild: "080-70 Veckolåtar.png",
      begrepp: ["fredagslåtar", "musik"],
      anteckningar: "Musiken som återkommande inslag — varje vecka en låt med AI-koppling.\nAI:n hjälper till, men glädjen är min.",
      lankar: [["Musiksidan", "https://sites.google.com/ainnova.se/aisverige/musik"], ["Fredagslåt på YouTube", "https://www.youtube.com/watch?v=a7_jig8MxiU"]],
      relaterat: ["130-40"]
    },
    {
      id: "080-80", sektion: "080", titel: "Sköldbondens schack",
      bild: "080-80 Sköldbondens schack.png",
      begrepp: ["schack", "spel"],
      anteckningar: "Mitt eget schack med egna regler: drottningen högst, bonden med sköld.\nByggt med AI — och en fin cirkel tillbaka till Deep Blue.",
      lankar: [["Spela Sköldbondens schack", "https://annamalmberg2.github.io/skoldbondens-schack/"]],
      relaterat: ["030-20", "950-20"]
    },
    {
      id: "080-85", sektion: "080", titel: "Handslaget – appen",
      bild: "080-85 Handslaget – appen.png",
      begrepp: ["avtal", "Handslaget"],
      anteckningar: "Avtalsverktyget: enkla överenskommelser mellan människor.\nEtt handslag — fast digitalt.",
      lankar: [["Handslaget", "https://handshake-echo-world.lovable.app"]],
      relaterat: ["080-90", "090-10"]
    },
    {
      id: "080-90", djup: 3, sektion: "080", titel: "Handslag på svenska",
      bild: "080-90 Handslag på svenska.png",
      begrepp: ["avtal", "Handslaget"],
      anteckningar: "Samma idé, på svenska. Förtroende är lokalt.",
      relaterat: ["080-85", "090-10"]
    },
    {
      id: "080-95", sektion: "080", titel: "Lovable – bygg med en mening",
      bild: "080-95 Lovable affiliate.png",
      personer: ["Andrej Karpathy", "Mauri"], begrepp: ["Lovable", "vibe coding"],
      anteckningar: "Verktyget som bygger webbappar av en mening ('vibe coding' — Karpathys ord).\nAllt ni sett ikväll kan ni börja bygga själva — ikväll.",
      lankar: [["Lovable", "https://lovable.dev"], ["Mauri presenterar Lovable", "https://youtu.be/0NDFrrQXPkk"]],
      relaterat: ["070-60", "130-40"]
    },

    // ---------- 090 MÄNNISKA + AI ----------
    {
      id: "090-10", djup: 1, sektion: "090", titel: "Framtiden byggs tillsammans – bron",
      bild: "090-10 Framtiden byggs tillsammans – bron.png",
      begrepp: ["samarbete", "förtroende", "handslag"],
      anteckningar: "Varken människor eller AI når framtiden själva — värdet skapas i mötet.\nMänniskor: erfarenhet, intuition, empati, ansvar. AI: data, mönster, hastighet.\nDet som håller bron uppe: lyssna, fråga, samverka, ansvara, lära, överlämna.",
      relaterat: ["090-20", "080-85"]
    },
    {
      id: "090-20", sektion: "090", titel: "Tillsammans för bästa beslut",
      bild: "090-20 Tillsammans för bästa beslut.png",
      begrepp: ["beslut", "samarbete"],
      anteckningar: "Människan väljer. AI:n räknar.\nBäst blir det när båda gör det de är bäst på.",
      relaterat: ["090-10", "080-20"]
    },
    {
      id: "090-30", sektion: "090", titel: "Tre lager – en livsresa",
      bild: "090-30 Tre lager – en livsresa.png",
      personer: ["Ada"], begrepp: ["minne", "arkiv", "AI-assistent"],
      anteckningar: "Min AI-assistent Ada och minnet i tre lager:\n1. AI:ns arbetsminne  2. Min aktiva position  3. Det fullständiga arkivet.\nAllt fångas, inget raderas, jag bestämmer.\nFrån barnets första tankar till visdomens sista råd.",
      relaterat: ["100-20", "090-10"]
    },

    // ---------- 100 ETIK & VÄGVAL ----------
    {
      id: "100-10", djup: 1, sektion: "100", titel: "Strid eller Astrid",
      bild: "100-10 Strid eller Astrid.png",
      personer: ["Astrid Lindgren"], begrepp: ["säkerhet", "rädsla", "folkvett"],
      anteckningar: "Samma teknik — två vägar.\nStrid: rå kapacitet, rädsla, varningsskyltar.\nAstrid: mänsklig värme, folkvett, sagor för barnen.\nVi väljer. Det är hela poängen.",
      relaterat: ["100-20", "060-20"]
    },
    {
      id: "100-20", sektion: "100", titel: "Momo och de grå herrarna",
      bild: "100-20 Momo och de grå herrarna.png",
      personer: ["Michael Ende", "Momo"], begrepp: ["tid", "effektivitet", "de grå herrarna"],
      anteckningar: "Michael Endes 'Momo': de grå herrarna stjäl tid i effektivitetens namn —\nportföljerna är märkta ROI, growth, efficiency.\nOm AI ger oss tid tillbaka: låt ingen stjäla den.\nMomo lyssnade. Det är superkraften.",
      relaterat: ["100-10", "090-30"]
    },

    // ---------- 110 FRAMTIDEN ----------
    {
      id: "110-10", djup: 1, sektion: "110", titel: "Nobelpriset i ekonomi 2026",
      bild: "110-10 Nobelpriset i ekonomi 2026.png",
      personer: ["Claude"], begrepp: ["humor", "Pluton B"],
      anteckningar: "Med glimten i ögat: 'för upptäckten att människor hellre misslyckas med att ha rätt\nän lyckas efter att ha haft fel.'\nAlla vill ha rätt från början. AI låter oss ha fel — snabbare och billigare.\nDärför lär vi oss mer.",
      relaterat: ["130-10"]
    },

    // ---------- 120 AVSLUT ----------
    {
      id: "120-10", djup: 1, sektion: "120", titel: "AiNNOVA – vad jag erbjuder",
      bild: "120-10 AiNNOVA – vad jag erbjuder.png",
      begrepp: ["AiNNOVA", "konsultation", "utbildning"],
      anteckningar: "Sex ben: AI-konsultation, utbildning & coachning, innehållsproduktion,\nwebb & kommunikation, marknadsföring, specialiserade AI-lösningar.\nTack — och på återseende!",
      lankar: [["ainnova.se", "https://ainnova.se"], ["anna@ainnova.se", "mailto:anna@ainnova.se"], ["LinkedIn", "https://www.linkedin.com/in/annamalmberg2/"]],
      relaterat: ["000-20"]
    },

    // ---------- 130 BIBLIOTEKET ----------
    {
      id: "130-10", djup: 3, sektion: "130", titel: "Nobelprisen 2024",
      personer: ["John Hopfield", "Geoffrey Hinton", "Demis Hassabis", "John Jumper"],
      begrepp: ["Nobelpriset", "maskininlärning"],
      text: "Fysik: John Hopfield & Geoffrey Hinton — grunden för maskininlärning i neurala nätverk.\n\nKemi: Demis Hassabis & John Jumper (DeepMind) — AlphaFold och proteinstrukturerna.\n\nEtablissemangets kvitto: AI är vetenskap.",
      anteckningar: "Hinton kallas 'AI:s gudfader' — och är numera en av de tydligaste varnarna.",
      relaterat: ["030-40"]
    },
    {
      id: "130-20", djup: 3, sektion: "130", titel: "Filmtips",
      begrepp: ["filmer"], personer: ["Alan Turing"],
      text: "The Queen's Gambit — schackets skönhet.\n\nHidden Figures — kvinnorna bakom rymdprogrammet.\n\nThe Imitation Game — Alan Turing och koden.\n\nIron Man (JARVIS) — drömmen om den personliga assistenten.",
      anteckningar: "Bra svar när publiken frågar 'var ska jag börja?' — börja i soffan.",
      relaterat: ["020-40", "030-20"]
    },
    {
      id: "130-30", djup: 3, sektion: "130", titel: "Se & lyssna",
      personer: ["Marcus du Sautoy"], begrepp: ["matematik", "dokumentärer"],
      text: "Fördjupning för den nyfikna — matematiken bakom alltihop.",
      anteckningar: "The wisdom of the crowd: gissa oxens vikt — snittet slår experten.\nSamma princip som i maskininlärning.",
      lankar: [
        ["BBC: The Story of Maths", "https://www.youtube.com/playlist?list=PLonhd8B9fP9u6TiZWKK1bhPD6JKoio6N8"],
        ["BBC: The CODE", "https://youtu.be/iOucwX7Z1HU"],
        ["The wisdom of the crowd – Marcus du Sautoy", "https://youtu.be/s7tngG2kAik?t=265"]
      ],
      relaterat: ["060-10", "020-40"]
    },
    {
      id: "130-40", djup: 3, sektion: "130", titel: "Länkbiblioteket",
      begrepp: ["projekt", "länkar"],
      text: "Allt jag byggt och visar — samlat på ett ställe.",
      anteckningar: "Publiken kan klicka hemifrån — dela länksamlingen på tavlan eller i chatten.",
      lankar: [
        ["Länksamlingen", "https://erbjudanden.ainnova.se/länkar"],
        ["HurDetFunkar", "https://hurdetfunkar.se"],
        ["Traktens", "https://www.traktens.se/om-traktens"],
        ["En Kullen", "https://enkullen.se"],
        ["Rissäters loppis", "https://rissaeters-loppis.com"],
        ["Wisdom Streamer", "https://wisdom-streamer.lovable.app"],
        ["Open Weave AI – etiskt ramverk", "https://open-weave-ai.lovable.app/"],
        ["Vision Setter", "https://vision-setter.lovable.app/"],
        ["Handslaget", "https://handshake-echo-world.lovable.app"],
        ["Sköldbondens schack", "https://annamalmberg2.github.io/skoldbondens-schack/"],
        ["Pluton B", "https://sites.google.com/view/hurdetfunkar/pluton-b"],
        ["Fria studier om AI (Notion)", "https://delicate-neighbor-37a.notion.site/Fria-studier-om-AI-v-lj-din-stig-1839c8142e3f804bb689ee34f7e30cf0"]
      ],
      relaterat: ["080-30"]
    },

    // ---------- 900 DOKUMENTATION ----------
    {
      id: "900-10", sektion: "900", titel: "Under föreläsningen",
      bild: "900-10 Under föreläsningen.jpg",
      anteckningar: "Från en tidigare föreläsning — bra till marknadsföring och som avslutningsbild."
    },
    {
      id: "900-20", sektion: "900", titel: "Anna framför sin roll-up",
      bild: "900-20 Anna framför sin roll-up.jpg",
      anteckningar: "Pressbild."
    },
    {
      id: "900-30", sektion: "900", titel: "Engagerad publik",
      bild: "900-30 Engagerad publik.jpg",
      anteckningar: "Publiken jobbar — bevis på att formatet funkar."
    },
    {
      id: "900-40", sektion: "900", titel: "Fikaföreläsning",
      bild: "900-40 Fikaföreläsning.jpg",
      anteckningar: "Det lilla formatet: fika, samtal, AI."
    },

    // ---------- 950 RESERV ----------
    {
      id: "950-10", sektion: "950", titel: "Detektiven",
      bild: "950-10 Detektiven.png",
      anteckningar: "Reserv: källkritik — var detektiv, lita men verifiera.",
      relaterat: ["060-20"]
    },
    {
      id: "950-20", sektion: "950", titel: "Konst – schack",
      bild: "950-20 Konst – schack.png",
      anteckningar: "Reserv: konstvariant på schacktemat.",
      relaterat: ["080-80"]
    },
    {
      id: "950-30", sektion: "950", titel: "Anna goo",
      bild: "950-30 Anna goo.jpg",
      anteckningar: "Reserv: porträttvariant."
    },
    {
      id: "950-40", sektion: "950", titel: "Ett spel – vem ska man lita på",
      bild: "950-40 Ett spel – vem ska man lita på.png",
      begrepp: ["förtroende", "källkritik"],
      anteckningar: "Reserv: förtroendespelet — vem litar du på, människan eller maskinen?",
      relaterat: ["100-10", "060-20"]
    },
    {
      id: "950-50", sektion: "950", titel: "Exponentiellt tänkande",
      bild: "950-50 Exponentiellt tänkande.png",
      begrepp: ["exponentiell utveckling"],
      anteckningar: "Reserv: alternativ bild till exponentiell utveckling.",
      relaterat: ["010-10"]
    },
    {
      id: "950-60", sektion: "950", titel: "Från spel till AGI",
      bild: "950-60 Från spel till AGI.png",
      begrepp: ["AGI", "spel"],
      anteckningar: "Reserv: bryggan spel → AGI, alternativ till 'lämnade spelbordet'.",
      relaterat: ["030-10"]
    },
    {
      id: "950-70", sektion: "950", titel: "Läror och mönster",
      bild: "950-70 Läror och mönster.png",
      begrepp: ["mönster"],
      anteckningar: "Reserv: mönstertemat i konstform.",
      relaterat: ["060-10"]
    },
    {
      id: "950-80", sektion: "950", titel: "Stjärnnatt – infografik",
      bild: "950-80 Stjärnnatt – infografik.png",
      anteckningar: "Reserv: stämningsbild, bred infografik."
    },
    {
      id: "950-90", sektion: "950", titel: "Schack vs Go",
      bild: "950-90 Schack vs Go.png",
      begrepp: ["schack", "Go"],
      anteckningar: "Reserv: jämförelsen schack vs Go — bra om publiken vill fördjupa spelhistorien.",
      relaterat: ["030-20", "030-30"]
    }
  ]
};

// ============================================================
// FÖRKLARA AI — innehållsfil (sparad från redigeringsläget 2026-07-06 18:57:03)
// Fält per kort: id, sektion, bild (eller text för textkort),
// personer, begrepp, alias, anteckningar (dina minnesstöd),
// fordjupning (längre text för publiken, hopfälld), lankar [[rubrik, url]],
// relaterat (id:n), djup (1 = kärnan, 3 = fördjupning).
// ============================================================
window.LECTURE = {
  "titel": "Förklara AI",
  "undertitel": "Logik är universell",
  "halsning": "Welcome to the Lab! Welcome to AiNNOVA.",
  "fraga": "Gör AI oss dummare — eller tvingas vi bli smartare?",
  "sektioner": [
    {
      "id": "000",
      "namn": "Intro – varför förklara AI?",
      "tes": "En lärare byter klassrum — världen behöver förstå AI.",
      "nyckel": "000-30"
    },
    {
      "id": "010",
      "namn": "Exponentiell utveckling",
      "tes": "AI växer exponentiellt men vår intuition är linjär — trettio steg räcker till månen.",
      "nyckel": "010-10"
    },
    {
      "id": "020",
      "namn": "Historien",
      "tes": "Varje ny kunskapsteknik har mött samma oro — från Sokrates till Ada.",
      "nyckel": "020-40"
    },
    {
      "id": "030",
      "namn": "Spelen – genombrotten",
      "tes": "Spelen var träningsläger. Sedan lämnade intelligensen spelbordet.",
      "nyckel": "030-20"
    },
    {
      "id": "040",
      "namn": "Vad är AI?",
      "tes": "AI är ingen maskin och inget bolag — det är ett växande ekosystem.",
      "nyckel": "040-30"
    },
    {
      "id": "050",
      "namn": "Under huven – LLM",
      "tes": "Under huven: tokens, kontext och miljarder parametrar.",
      "nyckel": "050-20"
    },
    {
      "id": "060",
      "namn": "Mönster & matematik",
      "tes": "Mönster är vackra. Bevis är sanning. Skillnaden är hela poängen.",
      "nyckel": "060-10"
    },
    {
      "id": "070",
      "namn": "Bild-AI & konst",
      "tes": "Maskinen målar. Frågan är vem som håller penseln.",
      "nyckel": "070-10"
    },
    {
      "id": "080",
      "namn": "AI i praktiken",
      "tes": "Från revisorn till schackbrädet — riktig nytta i riktig vardag.",
      "nyckel": "080-20"
    },
    {
      "id": "090",
      "namn": "Människa + AI",
      "tes": "Varken människa eller AI når framtiden ensam — värdet skapas i mötet.",
      "nyckel": "090-10"
    },
    {
      "id": "100",
      "namn": "Etik & vägval",
      "tes": "Samma teknik, två vägar: strid eller Astrid. Vi väljer.",
      "nyckel": "100-10"
    },
    {
      "id": "110",
      "namn": "Framtiden",
      "tes": "Våga ha fel — snabbare. Där börjar lärandet.",
      "nyckel": "110-10"
    },
    {
      "id": "120",
      "namn": "Avslut",
      "tes": "Tack — och på återseende.",
      "nyckel": "120-10"
    },
    {
      "id": "130",
      "namn": "Biblioteket"
    },
    {
      "id": "900",
      "namn": "Dokumentation",
      "bakom": true
    },
    {
      "id": "950",
      "namn": "Reserv",
      "bakom": true
    }
  ],
  "kort": [
    {
      "id": "000-10",
      "fordjupning": "Matematikens språk är detsamma i Kiruna som i Kalifornien — och detsamma inuti en dator som i ett klassrum. Ett neuralt nätverk bryter inte mot logikens lagar; det är byggt av dem: addition, multiplikation, derivator. Det är därför en matte- och fysiklärare kan förklara AI utan att vara programmerare.\n\nDet är också tröstande: AI är inte magi som kräver invigda. Den som förstår procent, sannolikhet och funktioner har redan verktygen för att förstå det viktigaste.",
      "djup": 1,
      "sektion": "000",
      "titel": "Logik är universell",
      "bild": "000-10 Logik är universell – header.jpg",
      "begrepp": [
        "logik"
      ],
      "anteckningar": "Öppningsbilden. Matten, fysiken och AI talar samma språk.\nJag är lärare — jag byter inte yrke, jag byter klassrum.",
      "relaterat": [
        "000-50"
      ]
    },
    {
      "id": "000-20",
      "sektion": "000",
      "titel": "AI Anna Intelligens",
      "bild": "000-20 AI Anna Intelligens.jpg",
      "begrepp": [
        "AiNNOVA"
      ],
      "alias": [
        "Anna Malmberg"
      ],
      "anteckningar": "Vem jag är: lärare i matematik och fysik → AiNNOVA.\nAI = Anna Intelligens. Skratta först, förklara sen.\n\nVad är egentligen AI?",
      "lankar": [
        [
          "ainnova.se",
          "https://ainnova.se"
        ],
        [
          "LinkedIn",
          "https://www.linkedin.com/in/annamalmberg2/"
        ],
        [
          "Blogg",
          "https://wisdom-streamer.lovable.app/"
        ]
      ],
      "fordjupning": "Djupdykning i AI:s värld.\n\n1. Vad är egentligen AI?\nI grunden handlar AI om att skapa datorsystem som kan utföra uppgifter som normalt kräver mänsklig intelligens. Det handlar inte om att maskinerna \"tänker\" eller har ett medvetande som vi, utan om att de är extremt duktiga på att:\n\nKänna igen mönster i enorma mängder data.\n\nDra slutsatser och fatta beslut baserat på dessa mönster.\n\nLära sig och anpassa sig när de matas med ny information.\n\n2. De tre nivåerna av AI\nInom forskningen delar man upp AI i tre olika mognadsfaser:\n\nSnäv AI (Artificial Narrow AI - ANI): Detta är den AI vi har idag. Den är specialiserad på en specifik uppgift. Exempel är system som översätter text, ansiktsigenkänning i din telefon, eller schackdatorer. Den kan vara utomordentligt smart på just sin uppgift, men är helt värdelös på allt annat.\n\nGenerell AI (Artificial General Intelligence - AGI): Detta är en AI som har en mänsklig intellektuell kapacitet. Den skulle kunna lära sig, förstå och applicera kunskap inom vilket område som helst – precis som en människa. AGI existerar inte ännu, utan är fortfarande på forskningsstadiet.\n\nSuperintelligens (Artificial Superintelligence - ASI): En hypotetisk framtid där AI:n blir betydligt smartare än hela mänskligheten kombinerat, inom alla områden (inklusive vetenskaplig kreativitet, social förmåga och visdom).\n\n3. Hur fungerar det? (Kärnteknologierna)\nDet som har drivit på AI-revolutionen de senaste åren är framför allt underkategorier till AI:\n\nMaskininlärning (Machine Learning)\nIstället för att en programmerare skriver exakta regler för hur datorn ska bete sig (\"Om A händer, gör B\"), så matar man datorn med data och låter den själv räkna ut reglerna.\n\nDjupinlärning (Deep Learning)\nDetta är en avancerad form av maskininlärning som använder artificiella neurala nätverk, inspirerade av hur den mänskliga hjärnan är uppbyggd med sammankopplade neuroner. Det är djupinlärning som ligger bakom att datorer nu kan \"se\" vad som finns på en bild eller förstå mänskligt tal.\n\nGenerativ AI och LLM (Stora språkmodeller)\nDetta är tekniken bakom verktyg som mig (Gemini) eller ChatGPT. Genom att analysera gigantiska mängder text har modellen lärt sig sannolikheten för vilket ord som statistiskt sett borde följa efter ett annat. Det gör att den kan skapa helt ny text, kod eller bilder som ser ut att vara skapade av en människa.\n\n4. Varför sker revolutionen just NU?\nAI som koncept föddes redan på 1950-talet, men det är först nu det har exploderat. Det beror på tre saker:\n\nDatamängden: Internet har gett oss de enorma mängder data som krävs för att träna moderna AI-modeller.\n\nDatorkraften: Särskilda chip (framför allt GPU:er) har blivit tillräckligt kraftfulla för att hantera de miljarder beräkningar som krävs.\n\nAlgoritmerna: Genombrott inom matematik och programmering (som exempelvis Transformer-arkitekturen som introducerades 2017) har gjort modellerna extremt effektiva.\n\n5. Utmaningar och Etik\nMedan AI erbjuder fantastiska möjligheter (som att upptäcka cancersjukdomar tidigare eller effektivisera energiförbrukning), för det också med sig stora utmaningar:\n\n\"Black Box\"-problemet: Moderna AI-system är så komplexa att inte ens skaparna alltid kan förklara exakt varför en AI fattade ett visst beslut.\n\nBias (Skevhet): En AI blir bara så bra som den data den tränas på. Om träningsdatan innehåller mänskliga fördomar, kommer AI:n att ärva och förstärka dessa fördomar.\n\nJobbmarknaden: Automatiseringen förändrar arbetsmarknaden i grunden. Det handlar inte längre bara om att ersätta fysiskt arbete, utan även kognitivt arbete (skribenter, programmerare, analytiker).\n\nSammanfattningsvis är AI inte en \"levande varelse\", utan ett otroligt kraftfullt matematiskt verktyg för mönsterigenkänning. Det är en teknik som håller på att rita om spelreglerna för hur vi arbetar, skapar och löser problem."
    },
    {
      "id": "000-30",
      "fordjupning": "På 70-talet tog svensk tv folkbildningen på allvar: teknik och samhälle förklarades så att både barn och vuxna hängde med — utan att någon kände sig dum. Det är den traditionen AI-Sverige behöver nu. Inte fler experter som imponerar, utan fler Hedvig som förklarar.\n\nGapet idag är nämligen inte tekniskt utan pedagogiskt: de flesta vuxna använder redan AI dagligen (sökmotorer, autokorrigering, rekommendationer) utan att veta om det.",
      "djup": 1,
      "sektion": "000",
      "titel": "Hedvig behövs",
      "bild": "000-30 Hedvig behövs.png",
      "personer": [
        "Hedvig"
      ],
      "begrepp": [
        "folkbildning",
        "Från A till Ö"
      ],
      "anteckningar": "1975 satt barn på golvet och försökte förstå vuxna.\n2026 sitter vuxna och försöker förstå teknik.\nFrån A till Ö var mitt första sci-fi-äventyr: videosamtal med mor, inte låta sig luras av svåra ord.\nVi behövde Hedvig då. Vi behöver henne igen — och hon håller."
    },
    {
      "id": "000-50",
      "fordjupning": "Ny teknik lärs bäst i sällskap. När många delar misstag och genombrott samtidigt går inlärningen fort — samma nätverkseffekt som tekniken själv bygger på.\n\nVuxna lär sig ny teknik bäst tillsammans; det sociala sammanhanget avgör om den fastnar. Fråga gärna publiken: vem är din AI-kompis?",
      "sektion": "000",
      "titel": "Logik är universell – AI Sverige",
      "bild": "000-50 Logik är universell – AI Sverige.png",
      "begrepp": [
        "AI Sverige",
        "community"
      ],
      "anteckningar": "Vi lär oss tillsammans. AI Sverige — samtal, delande, folkbildning.",
      "lankar": [
        [
          "AI Sverige på Facebook",
          "https://www.facebook.com/groups/594222752463207?locale=sv_SE"
        ],
        [
          "Blockad på AI Sverige",
          "https://sites.google.com/ainnova.se/aisverige/startsida"
        ],
        [
          "Fredagslåtar",
          "https://sites.google.com/ainnova.se/aisverige/musik"
        ],
        [
          "Blogg",
          "https://wisdom-streamer.lovable.app/"
        ]
      ],
      "relaterat": [
        "000-10"
      ]
    },
    {
      "id": "010-10",
      "fordjupning": "Räkningen: 30 linjära steg à en meter är 30 meter. 30 exponentiella steg med fördubbling är 2⁰ + 2¹ + … + 2²⁹ = 2³⁰ − 1 ≈ 1,07 miljarder meter — över en miljon kilometer. Månen ligger på 384 000.\n\nPoängen är psykologisk, inte matematisk: hjärnan är tränad på linjära förlopp (gå, växa, spara). Exponentiella förlopp känns fel ända tills de plötsligt är överallt — därför överraskar både pandemier och teknikskiften oss.\n\nKlassikern att bjuda på: schackbrädet och riskornen. Ett korn på första rutan, dubbelt på nästa — vid ruta 64 behövs mer ris än världen producerar.",
      "djup": 1,
      "sektion": "010",
      "titel": "30 steg – två sätt att växa",
      "bild": "010-10 30 steg – två sätt att växa.png",
      "begrepp": [
        "exponentiell utveckling",
        "linjärt",
        "geometrisk summa"
      ],
      "anteckningar": "30 linjära steg = 30 meter. 30 exponentiella steg = förbi månen (1,07 miljoner km).\nVår intuition är linjär. AI-utvecklingen är det inte.\nMatte på tavlan: aritmetisk vs geometrisk summa — läraren i mig får glänsa.",
      "relaterat": [
        "010-20",
        "950-50"
      ]
    },
    {
      "id": "010-20",
      "fordjupning": "Kartläsarens jobb är inte att minnas vägen — det är att läsa rätt karta i rätt ögonblick. När terrängen ritas om blir gamla meriter en risk: man svänger självsäkert åt fel håll.\n\nÖversatt till arbetslivet: erfarenhet är fortfarande guld, men som förmåga att navigera — inte som memorerad väg. Fråga inte 'vad kan jag?' utan 'hur uppdaterar jag min karta?'.",
      "sektion": "010",
      "titel": "Rallyt – gamla kartan gäller ej",
      "bild": "010-20 Rallyt – gamla kartan gäller ej.png",
      "begrepp": [
        "förändring",
        "gamla kartan"
      ],
      "anteckningar": "Kartläsaren läser gårdagens karta — skylten säger 'gammal karta gäller ej'.\nErfarenhet hjälper bara om kartan uppdateras. Gäller oss alla.",
      "relaterat": [
        "010-30",
        "010-40"
      ]
    },
    {
      "id": "010-30",
      "fordjupning": "Sjökort uppdateras ständigt — grund flyttar sig, farleder muddras om. En kapten som seglar på förra årets kort är inte erfaren, bara farlig.\n\nSamma sak med AI: det som var sant om verktygen i fjol (priser, förmågor, begränsningar) är ofta fel i år. Kolla datumet på din kunskap.",
      "sektion": "010",
      "titel": "Kaptenen till sjöss",
      "bild": "010-30 Kaptenen till sjöss.png",
      "begrepp": [
        "förändring"
      ],
      "anteckningar": "Samma hav — nya farleder. Sjökortet ritas om medan vi seglar.",
      "relaterat": [
        "010-20"
      ]
    },
    {
      "id": "010-40",
      "fordjupning": "I orientering vinner inte den som springer fortast, utan den som hittar rätt när kartan och verkligheten skaver. Färdigheten heter kartkontakt: att ständigt jämföra det man ser med det man tror.\n\nDet är kanske den viktigaste AI-färdigheten också: jämför alltid modellens svar med verkligheten. Springer du fort på fel kurs kommer du snabbt — fel.",
      "sektion": "010",
      "titel": "Orienteraren på vift",
      "bild": "010-40 Orienteraren på vift.png",
      "begrepp": [
        "förändring"
      ],
      "anteckningar": "Terrängen stämmer inte längre med kartan.\nDå gäller det att kunna orientera — inte att ha memorerat vägen.",
      "relaterat": [
        "010-20"
      ]
    },
    {
      "id": "020-10",
      "fordjupning": "I Platons dialog Faidros varnar Sokrates för skriften: den ger 'sken av visdom' och försvagar minnet. Han fick delvis rätt — vi minns sämre utantill — och ändå fel: skriften byggde vetenskapen.\n\nSamma mönster vid varje skifte: tryckpressen skulle dränka världen i dåliga böcker (det gjorde den — och i oumbärliga), internet skulle göra oss ytliga. Varje gång förlorade vi något och vann mer. Frågan är aldrig 'är den nya tekniken farlig?' utan 'vad väljer vi att bevara medvetet?'.",
      "djup": 1,
      "sektion": "020",
      "titel": "Kunskapens fyra epoker",
      "bild": "020-10 Kunskapens fyra epoker – Sokrates.jpg",
      "personer": [
        "Sokrates"
      ],
      "begrepp": [
        "skriftspråket",
        "boktryckarkonsten",
        "internet",
        "kunskapens epoker"
      ],
      "anteckningar": "Handskrift → tryckpress → internet → AI.\nSokrates var skeptisk till det skrivna ordet: 'det försvagar minnet'.\nVarje epok fick samma kritik. AI är nästa steg på samma resa.",
      "relaterat": [
        "020-20",
        "100-20"
      ]
    },
    {
      "id": "020-20",
      "fordjupning": "First principles: skala bort allt du antagit och bygg från det som bevisligen är sant. Aristoteles gjorde det med naturen; dagens ingenjörer gör det med raketer och batterier.\n\nPå AI: i stället för att fråga 'vad säger folk om ChatGPT?' — fråga 'vad ÄR det här i grunden?'. Svaret (en funktion som gissar nästa ord, tränad på enorma mängder text) förklarar både styrkorna och misstagen bättre än all hajp.",
      "sektion": "020",
      "titel": "Aristoteles – first principles",
      "bild": "020-20 Aristoteles – first principles.png",
      "personer": [
        "Aristoteles"
      ],
      "begrepp": [
        "first principles"
      ],
      "anteckningar": "Bygg från grunden: vad vet vi säkert?\nSamma metod som fysiken — och samma metod jag använder på AI.",
      "relaterat": [
        "020-10",
        "020-30"
      ]
    },
    {
      "id": "020-30",
      "djup": 3,
      "sektion": "020",
      "titel": "Aristoteles – reel",
      "bild": "020-30 Aristoteles – reel.png",
      "personer": [
        "Aristoteles"
      ],
      "anteckningar": "Kortversionen för sociala medier — filosofi i stående format.",
      "relaterat": [
        "020-20"
      ]
    },
    {
      "id": "020-40",
      "fordjupning": "Ada Lovelace skrev 1843 det som brukar räknas som världens första datorprogram — en algoritm för Bernoulli-tal, till en maskin som aldrig hann byggas. Viktigare ändå: hon såg att maskinen i princip kunde bearbeta allt som går att skriva som symboler — musik, språk — hundra år före sin tid.\n\nAlan Turing ställde 1950 frågan 'kan maskiner tänka?' och föreslog imitationsspelet: om du inte kan avgöra om du samtalar med människa eller maskin — spelar skillnaden roll? Vi lever mitt i den frågan nu.\n\nOch Grace Hopper byggde kompilatorn: idén att människor ska kunna tala med maskiner på något som liknar vanligt språk. Det är den raka linjen till dagens chattbottar.",
      "sektion": "020",
      "titel": "Ada och Alan – tidslinjen",
      "bild": "020-40 Ada och Alan – tidslinjen.png",
      "personer": [
        "Ada Lovelace",
        "Alan Turing",
        "Grace Hopper",
        "John von Neumann"
      ],
      "begrepp": [
        "algoritm",
        "Turingtest",
        "Analytical Engine"
      ],
      "anteckningar": "Ada Lovelace (1815–1852): den första algoritmen — såg att maskinen kunde mer än räkna.\nAlan Turing (1912–1954): 'kan maskiner tänka?'\nLinjen Ada → Alan → Grace Hopper → von Neumann → idag.\nKvinnorna fanns där från början.",
      "relaterat": [
        "130-20",
        "130-30"
      ]
    },
    {
      "id": "030-10",
      "fordjupning": "Varför just spel? För att de har tydliga regler och tydlig vinst — perfekta träningsläger där en AI kan öva mot sig själv miljontals gånger, dygnet runt. Schack, go, tv-spel: alla föll i tur och ordning.\n\nDet stora skiftet var när samma metoder klev från brädet ut i verkligheten — proteiner, språk, kod. Spelen var aldrig målet. De var körskolan.",
      "sektion": "030",
      "titel": "När intelligensen lämnade spelbordet",
      "bild": "030-10 När intelligensen lämnade spelbordet.jpg",
      "begrepp": [
        "spel",
        "AGI"
      ],
      "anteckningar": "Spelen var träningsläger.\nSedan lämnade intelligensen spelbordet — ut i proteiner, språk och vardag.",
      "relaterat": [
        "950-60",
        "030-40"
      ]
    },
    {
      "id": "030-20",
      "fordjupning": "Deep Blue räknade omkring 200 miljoner ställningar i sekunden — rå styrka och handbyggda schackregler, ingen 'förståelse'. Kasparov vann mötet 1996; returmatchen 1997 slutade 3,5–2,5 till maskinen.\n\nIntressantast är Kasparovs slutsats efteråt: han blev förespråkare för 'centaur-schack' — människa och maskin som lag, vilket ofta slår båda var för sig. Det är fortfarande den bästa arbetsmodellen, långt utanför schacket.",
      "djup": 1,
      "sektion": "030",
      "titel": "Deep Blue vs Kasparov 1997",
      "bild": "030-20 Deep Blue vs Kasparov 1997.png",
      "personer": [
        "Garry Kasparov",
        "Judit Polgár"
      ],
      "begrepp": [
        "schack",
        "Deep Blue",
        "IBM"
      ],
      "anteckningar": "1997: maskinen slår världsmästaren. Rå beräkningskraft + regler.\nKasparov efteråt: 'jag kunde känna en ny sorts intelligens'.\n(Judit Polgár — schackhistoriens starkaste kvinna — hör till samma berättelse.)",
      "relaterat": [
        "030-30",
        "080-80",
        "130-20",
        "950-90"
      ]
    },
    {
      "id": "030-30",
      "fordjupning": "Go kan inte råräknas — brädet rymmer fler möjliga ställningar än det finns atomer i universum. AlphaGo tränade i stället upp mönsterkänsla genom miljontals partier mot sig själv.\n\nDrag 37 i parti två: kommentatorerna dömde först ut det som ett misstag — sedan tystnade de. Maskinen bedömde själv att en människa bara hade spelat det en gång på tiotusen. Lee Sedol svarade i parti fyra med drag 78 — 'Guds beröring' — och vann människans enda parti.\n\nBåda dragen hör till berättelsen: maskinen överraskade oss, och pressad av maskinen överträffade människan sig själv.",
      "djup": 1,
      "sektion": "030",
      "titel": "AlphaGo vs Lee Sedol 2016",
      "bild": "950-90 Schack vs Go 2.png",
      "personer": [
        "Lee Sedol",
        "Demis Hassabis"
      ],
      "begrepp": [
        "Go",
        "AlphaGo",
        "drag 37",
        "DeepMind"
      ],
      "anteckningar": "2016: AlphaGo vinner 4–1. Go har fler positioner än atomer i universum.\nDrag 37 — draget ingen människa skulle spela. Kreativitet? Eller statistik?\nLee Sedol slutade senare som proffs.",
      "relaterat": [
        "030-20",
        "030-40",
        "950-90"
      ]
    },
    {
      "id": "030-40",
      "fordjupning": "Ett proteins form avgör dess funktion — och att förutsäga formen ur aminosyrasekvensen stod olöst i 50 år. 2020 krossade AlphaFold utvärderingen CASP med nära experimentell precision.\n\nDeepMind släppte sedan strukturförutsägelser för över 200 miljoner proteiner fritt till världens forskare. Nobelpriset i kemi 2024 delades av Demis Hassabis och John Jumper (AlphaFold) och David Baker (proteindesign).\n\nPoängen för publiken: detta är inte chatt-AI som kan hitta på — det är AI som vetenskapligt verktyg, där varje svar kan kontrolleras mot verkligheten.",
      "djup": 1,
      "sektion": "030",
      "titel": "AlphaFold – proteinernas gåta",
      "bild": "030-40 AlphaFold – proteinernas gåta.png",
      "personer": [
        "Demis Hassabis",
        "John Jumper"
      ],
      "begrepp": [
        "AlphaFold",
        "proteinveckning",
        "Nobelpriset"
      ],
      "anteckningar": "50 år av proteingåta — löst.\n200 miljoner proteinstrukturer, fritt tillgängliga för världens forskare.\nNobelpriset i kemi 2024. Spelen blev vetenskap.",
      "relaterat": [
        "130-10",
        "030-30"
      ]
    },
    {
      "id": "040-10",
      "fordjupning": "En bil gör vad ritningen säger. Ett neuralt nätverk 'ritas' inte — det tränas: miljarder små vikter justeras tills beteendet växer fram. Ingen, inte ens skaparna, kan peka på skruven där en viss kunskap sitter.\n\nDärför beter sig AI mer som något odlat än något byggt: förmågor dyker upp (och brister visar sig) på sätt som förvånar även forskarna. Och därför är testning — inte ritningsläsning — sättet att ta reda på vad en modell faktiskt kan.",
      "sektion": "040",
      "titel": "Inte en maskin i traditionell betydelse",
      "bild": "040-10 Inte en maskin i traditionell betydelse.png",
      "begrepp": [
        "neurala nätverk"
      ],
      "anteckningar": "Ingen skruv, ingen ritning.\nEtt AI programmeras inte rad för rad — det tränas, växer och överraskar.\nDärför beter det sig inte som maskiner vi känner.",
      "relaterat": [
        "040-20",
        "050-10"
      ]
    },
    {
      "id": "040-20",
      "fordjupning": "På skogspromenaden ser du svamparna — men organismen är mycelet: kilometervis av trådar under marken. AI är likadant. Chattbotten du ser är fruktkroppen; mycelet är datacenter, forskningslabb, öppna modeller och miljontals utvecklare.\n\nDärför går det inte att 'stänga av AI:n' — det finns ingen enskild svamp att plocka. Och därför fortsätter det växa även när enskilda bolag snubblar.",
      "sektion": "040",
      "titel": "AI är ett växande mycel",
      "bild": "040-20 AI är ett växande mycel.png",
      "begrepp": [
        "mycel",
        "ekosystem"
      ],
      "anteckningar": "Osynligt under ytan — plötsligt överallt.\nSammankopplat, organiskt, svårt att gräva bort.",
      "relaterat": [
        "040-10",
        "040-30"
      ]
    },
    {
      "id": "040-30",
      "fordjupning": "Kartan att ha i huvudet: några stora stängda modeller (Claude, GPT, Gemini), en snabbt växande öppen värld (Llama, Mistral, Qwen, DeepSeek) och miljontals specialiserade varianter på Hugging Face.\n\nFör dig som användare: du är befälhavaren. Olika soldater för olika uppdrag — en modell för skrivande, en för kod, en liten lokal modell för känslig data. Att välja rätt modell blir en vardagskompetens, som att välja verktyg ur lådan.",
      "djup": 1,
      "sektion": "040",
      "titel": "Inte bara ett bolag – hela armén",
      "bild": "040-30 Inte bara ett bolag – hela armén.png",
      "begrepp": [
        "Claude",
        "ChatGPT",
        "Gemini",
        "DeepSeek",
        "Qwen",
        "Mistral",
        "Llama",
        "öppna modeller",
        "Hugging Face"
      ],
      "anteckningar": "AI ≠ ett bolag. Ungefär 3 miljoner modeller på Hugging Face.\nDu är befälhavaren — modellerna är soldaterna.\nVälj rätt soldat för rätt uppgift.",
      "lankar": [
        [
          "ChatGPT",
          "https://chatgpt.com"
        ],
        [
          "Google Gemini",
          "https://gemini.google.com"
        ]
      ],
      "relaterat": [
        "040-20"
      ]
    },
    {
      "id": "050-10",
      "fordjupning": "Den gamla AI:n (expertsystem) fick sina regler av oss: 'OM feber OCH utslag SÅ …'. Den kollapsade under verklighetens alla undantag. Maskininlärningen vände på steken: visa exempel och låt maskinen hitta reglerna själv.\n\nSpråkmodellerna tog sista steget: träna på ofattbara mängder text med en enda uppgift — gissa nästa ord. Det visade sig att den som gissar nästa ord riktigt, riktigt bra måste 'kunna' grammatik, fakta, logik och stil. Inte för att vi la in det — utan för att gissningen kräver det.",
      "sektion": "050",
      "titel": "Från regler till språk – maskinens resa",
      "bild": "050-10 Från regler till språk – maskinens resa.jpg",
      "begrepp": [
        "regelbaserad AI",
        "maskininlärning",
        "LLM"
      ],
      "anteckningar": "Hårda regler → lärande ur exempel → språk.\nVi slutade programmera svar och började träna förståelse.",
      "relaterat": [
        "050-20",
        "040-10"
      ]
    },
    {
      "id": "050-20",
      "fordjupning": "Modellen läser inte ord utan tokens — bitar av ord. 'Föreläsning' kan bli tre bitar. Svenska kostar ofta fler tokens än engelska; därför kan modeller kännas lite 'dummare' på svenska.\n\nKontextfönstret är modellens arbetsminne: allt den ser just nu. Det som inte ryms finns inte för modellen — den 'minns' inte ert förra samtal om det inte skickas med igen. Många AI-besvikelser är egentligen kontextmissar: modellen fick aldrig se det du trodde den visste.",
      "sektion": "050",
      "titel": "Tokens, kontext och det svåraste jobbet",
      "bild": "050-20 Tokens, kontext och det svåraste jobbet.jpg",
      "begrepp": [
        "tokens",
        "kontextfönster"
      ],
      "anteckningar": "AI läser i tokens, inte i ord.\nKontextfönstret = arbetsminnet. Det svåraste jobbet: hålla tråden.\n(Precis som jag på scen.)",
      "relaterat": [
        "050-10",
        "050-30"
      ]
    },
    {
      "id": "050-30",
      "fordjupning": "Träningen: månader, tiotusentals grafikkort, kostnader i miljardklassen — en gång. Användningen: millisekunder och ören — miljarder gånger om dagen. Den ekonomin formar hela branschen.\n\nDärför NVIDIA: neurala nätverk är i grunden gigantisk matrismultiplikation, och grafikkort råkar vara byggda för exakt det. Spelindustrin subventionerade AI-revolutionens hårdvara i tjugo år utan att veta om det.",
      "sektion": "050",
      "titel": "Under huven – hårdvara och mjukvara",
      "bild": "050-30 Under huven – hårdvara och mjukvara.jpg",
      "begrepp": [
        "GPU",
        "NVIDIA",
        "träning",
        "inferens"
      ],
      "anteckningar": "Hårdvaran: GPU:er — därför pratar alla om NVIDIA.\nMjukvaran: miljarder parametrar.\nTräningen tar månader och kostar miljarder. Att fråga tar sekunder.",
      "relaterat": [
        "050-40"
      ]
    },
    {
      "id": "050-40",
      "fordjupning": "Vem äger kunskap som en maskin destillerat ur mänsklighetens samlade texter? Frågorna staplas på varandra: upphovsrätt på träningsdata, patent på arkitekturer, licensvillkor på öppna modeller — och juridiken springer efter tekniken.\n\nSamtidigt märks kunskapens nya ekonomi i plånboken: efterfrågan på beräkningskraft och minne pressar priserna (sommaren 2026: uppåt). Kunskap har bokstavligen blivit en råvara med dagspris.",
      "sektion": "050",
      "titel": "Patent – kunskapens ekonomi",
      "bild": "050-40 Patent – kunskapens ekonomi.jpg",
      "begrepp": [
        "patent",
        "kunskapens ekonomi",
        "öppna vikter"
      ],
      "anteckningar": "Vem äger kunskapen? Patent, öppna vikter, licenser.\nAktuellt just nu: priserna på minne och hårdvara går upp (sommaren 2026).",
      "relaterat": [
        "050-30",
        "040-30"
      ]
    },
    {
      "id": "060-10",
      "djup": 1,
      "sektion": "060",
      "titel": "Mönster är vackra, bevis är sanning",
      "bild": "060-10 Mönster är vackra, bevis är sanning – 333 333 331.png",
      "begrepp": [
        "primtal",
        "mönster",
        "bevis",
        "Miller-Rabin",
        "333333331"
      ],
      "alias": [
        "hur jag startade"
      ],
      "anteckningar": "31, 331, 3331, 33331 … alla primtal!\nAI:n: '333 333 331 är troligen primtal — 98,7 % säkert.'\nSanningen: 333 333 331 = 17 × 19 607 843.\nMönster är vackra. Bevis är sanning. Så startade jag — och så granskar jag AI.",
      "fordjupning": "Följden bildas genom att skjuta in en trea i taget: 31, 331, 3331, 33331 … De åtta första talen är alla primtal. Det nionde, 333 333 331, ser precis likadant ut — men är 17 × 19 607 843.\n\nSå ser AI:s misstag ofta ut: mönstret håller precis länge nog för att vi ska sluta kontrollera. Ett snabbt primtalstest (som Miller–Rabin) svarar 'troligen primtal' med hög säkerhet — men 'troligen' är inte 'bevisat'. Skillnaden mellan statistik och bevis är exakt skillnaden mellan en språkmodells gissning och matematikens sanning.\n\nNörddetalj: att pröva delbarhet med små primtal (7, 11, 13, 17 …) avslöjar bluffen snabbt — redan 17 fäller talet. Det som ser oövervinnerligt ut faller ofta för det enklaste verktyget i lådan.",
      "relaterat": [
        "060-20",
        "130-30"
      ]
    },
    {
      "id": "060-20",
      "fordjupning": "En modell lär sig av det vi gjort — inklusive det vi borde sluta göra. Klassikern: rekryteringsverktyget som lärde sig av historiska anställningar och därför sorterade bort kvinnor. Mönstret var korrekt inlärt — och fel.\n\nBias syns sällan i ett enskilt svar; den syns i statistiken över tusen. Därför två frågor att alltid ställa: Vad tränades den på? Och vem finns inte i datan? En modell tränad mest på engelska ser världen genom engelska ögon.",
      "sektion": "060",
      "titel": "Bias – när mönstret lurar oss",
      "bild": "060-20 Bias – när mönstret lurar oss.jpg",
      "begrepp": [
        "bias",
        "träningsdata"
      ],
      "anteckningar": "AI ärver våra skevheter ur datan.\nMönstret ser övertygande ut — precis som primtalen.\nFråga alltid: vad tränades den på?",
      "relaterat": [
        "060-10",
        "100-10"
      ]
    },
    {
      "id": "070-10",
      "fordjupning": "Bild-AI har 'sett' miljontals konstverk och lärt sig sambanden mellan ord och bild. Den lagrar inga kopior — men den bär stilarna. Att sätta in ett nytt ansikte i en klassiker tar sekunder.\n\nDet öppnar tre frågor på en gång: Vad är ett original? Var går gränsen mellan hyllning och stöld? Och kan någon äga en stil? Jurister och konstnärer sliter med alla tre. Publiken kan börja med den enklaste: blev det konst?",
      "djup": 1,
      "sektion": "070",
      "titel": "Mona Lisa Anna",
      "bild": "070-10 Mona Lisa Anna.png",
      "begrepp": [
        "bild-AI",
        "remix"
      ],
      "alias": [
        "Mona Lisa"
      ],
      "anteckningar": "Klassikern remixad. Bild-AI:n har 'sett' hela konsthistorien —\noch sätter in mig i den. Var går gränsen mellan hyllning och stöld?",
      "relaterat": [
        "070-70",
        "070-20"
      ]
    },
    {
      "id": "070-20",
      "sektion": "070",
      "titel": "Jocke – en kvinna i dans",
      "bild": "070-20 Jocke – en kvinna i dans.png",
      "personer": [
        "Joakim Johansson"
      ],
      "alias": [
        "Jocke"
      ],
      "anteckningar": "Joakim 'Jocke' Johansson — konstnären.\nVad händer med konsten när maskinen målar?",
      "relaterat": [
        "070-30",
        "070-40"
      ]
    },
    {
      "id": "070-30",
      "sektion": "070",
      "titel": "Jocke – med pensel",
      "bild": "070-30 Jocke – med pensel.jpg",
      "personer": [
        "Joakim Johansson"
      ],
      "alias": [
        "Jocke"
      ],
      "anteckningar": "Människan bakom verket.\nAI:n kan imitera stilen — men vem håller penseln?",
      "relaterat": [
        "070-20",
        "070-40"
      ]
    },
    {
      "id": "070-40",
      "fordjupning": "Den här hänger i en ateljé på riktigt: olja, duk, veckor av arbete. Häng den bredvid AI-bilderna i samma kapitel och känn efter var skillnaden sitter — kanske inte i ytan, men i avsikten.\n\nMin arbetstes: AI:n kan härma uttryck men inte mena något. Konstnären väljer, ångrar, offrar. Om någon i publiken protesterar — utmärkt, då har vi ett samtal.",
      "sektion": "070",
      "titel": "Målningen – kvinnan lyfter mannen",
      "bild": "070-40 Målningen – kvinnan lyfter mannen.png",
      "personer": [
        "Joakim Johansson"
      ],
      "begrepp": [
        "konst"
      ],
      "anteckningar": "Riktig olja på duk — kvinnan i rött lyfter kostymmannen.\nStäll frågan till publiken: kan en maskin mena något?",
      "relaterat": [
        "070-20",
        "070-30"
      ]
    },
    {
      "id": "070-50",
      "fordjupning": "Ett enda suddigt foto räcker som utgångspunkt för en modern bildmodell — den 'vet' redan hur människor ser ut och fyller i resten. Det är verktygets styrka och dess varning i samma mening.\n\nVarningen konkret: samma teknik gör förfalskade bilder och röster till vardagsmat, och ett foto från sociala medier räcker. Rimlig husregel hemma: lita inte på bild eller röst som identitetsbevis — bestäm ett kodord i familjen redan idag.",
      "sektion": "070",
      "titel": "Mitt profilfoto som grund",
      "bild": "070-50 Mitt profilfoto som grund.jpeg",
      "begrepp": [
        "bildgenerering",
        "träningsbild"
      ],
      "anteckningar": "Ett dåligt pixlat foto räckte.\nAlla AI-bilder av mig i föreläsningen utgår från det här originalet.\nVisa originalet — visa sedan varianterna. Publiken brukar flämta.",
      "relaterat": [
        "070-10",
        "040-30"
      ]
    },
    {
      "id": "070-60",
      "fordjupning": "Så här ser AI-skapande faktiskt ut: hundra varianter, nittiosju i papperskorgen. Maskinen är generös men omdömeslös — urvalet är fortfarande hantverket.\n\nDet gäller all AI-användning: värdet uppstår i din gallring, din smak, ditt nej. Guldkorn i kaos — men bara för den som orkar sålla.",
      "sektion": "070",
      "titel": "Skaparkaos",
      "bild": "070-60 Skaparkaos.png",
      "begrepp": [
        "kreativitet",
        "iteration"
      ],
      "anteckningar": "Så ser skapandet faktiskt ut: hundra utkast, en robotarm som säger ERROR.\nGuldkorn i kaoset — det som verkar dåligt idag kan vara guld imorgon.",
      "relaterat": [
        "080-95"
      ]
    },
    {
      "id": "070-70",
      "fordjupning": "Fei-Fei Lis insikt var kontroversiell på sin tid: kollegorna jagade bättre algoritmer — hon byggde bättre data. 14 miljoner bilder, märkta för hand av tusentals människor.\n\n2012 vann AlexNet (Geoffrey Hintons studenter) tävlingen med djupinlärning på grafikkort och sänkte felprocenten dramatiskt. Tre ingredienser möttes: data (ImageNet), beräkningskraft (GPU:er) och algoritm (neurala nät). Ingen av dem var ny. Kombinationen förändrade allt.",
      "djup": 3,
      "sektion": "070",
      "titel": "ImageNet & Fei-Fei Li",
      "personer": [
        "Fei-Fei Li"
      ],
      "begrepp": [
        "ImageNet",
        "datorseende",
        "AlexNet"
      ],
      "alias": [
        "Fei"
      ],
      "text": "2009 bygger Fei-Fei Li ImageNet — 14 miljoner märkta bilder. Idén: intelligensen sitter i datan, inte bara i algoritmen.\n\n2012 vinner AlexNet tävlingen med djupinlärning. Startskottet för den moderna AI-vågen — och vägen till dagens bild-AI.",
      "anteckningar": "Bryggan: utan ImageNet ingen bild-AI, ingen Mona Lisa Anna.\nÄnnu en kvinna som byggde grunden.",
      "lankar": [
        [
          "Fei-Fei Li på TED",
          "https://www.ted.com/talks/fei_fei_li_how_we_re_teaching_computers_to_understand_pictures"
        ]
      ],
      "relaterat": [
        "070-10",
        "020-40"
      ]
    },
    {
      "id": "080-10",
      "fordjupning": "Varför bokföring som testfall? För att den är obarmhärtig: siffrorna stämmer eller stämmer inte, och en revisor granskar resultatet. En perfekt miljö för att testa om AI håller i verkligheten — inte bara i demon.\n\nArbetsmodellen: AI:n gör grovjobbet (sortera, kontera, stämma av), människan äger besluten och ansvaret, och allt kontrolleras mot källorna. Mönster är vackra, bevis är sanning — även i ekonomin.",
      "sektion": "080",
      "titel": "Bokföring med AI",
      "bild": "080-10 Bokföring med AI.png",
      "begrepp": [
        "bokföring",
        "vardagsnytta"
      ],
      "anteckningar": "Mitt skarpaste test: hela bolagets bokföring, byggd tillsammans med AI.\nInte en demo — verklighet, med revisor och allt.",
      "relaterat": [
        "080-15",
        "080-20"
      ]
    },
    {
      "id": "080-15",
      "sektion": "080",
      "titel": "Verkligheten kommer på besök",
      "bild": "080-15 Verkligheten kommer på besök.png",
      "personer": [
        "Jerry"
      ],
      "anteckningar": "'På onsdag kommer revisorn. Då får vi se om det vi byggt håller.'\nIdéer → verklighet: underlag, system, kontroll, ansvar.\nAI gör jobbet snabbare. Jag gör valen. Tillsammans blir det bättre.",
      "relaterat": [
        "080-10",
        "080-20"
      ]
    },
    {
      "id": "080-20",
      "fordjupning": "Facit från revisorsbesöket: det AI-byggda höll. Men lärdomen är större än bokföringen. Det som avgjorde var arbetsdelningen — maskinen räknade, människorna granskade, ingen litade blint på någon.\n\nOch burgarna är också en poäng: om AI tar grovjobbet ska den frigjorda tiden bli mänsklig tid — samtal, skratt, kaffe. Annars gjorde vi fel på köpet.",
      "djup": 1,
      "sektion": "080",
      "titel": "Verkligheten kom – vi firade med burgare",
      "bild": "080-20 Verkligheten kom – vi firade med burgare.png",
      "personer": [
        "Jerry"
      ],
      "anteckningar": "Det höll! Revisorn nöjd, Anna nöjd, AI:n nöjd — burgare nöjd.\nPoängen: människor träffas, AI levererar, allt blir klart.",
      "relaterat": [
        "080-15",
        "090-20"
      ]
    },
    {
      "id": "080-30",
      "sektion": "080",
      "titel": "HurDetFunkar",
      "bild": "080-30 HurDetFunkar.png",
      "begrepp": [
        "skolan",
        "experiment"
      ],
      "anteckningar": "Min gamla skolhjälpssida — nu mitt experimentlabb.",
      "lankar": [
        [
          "hurdetfunkar.se",
          "https://hurdetfunkar.se"
        ],
        [
          "Pluton B",
          "https://sites.google.com/view/hurdetfunkar/pluton-b"
        ]
      ],
      "relaterat": [
        "130-40"
      ]
    },
    {
      "id": "080-40",
      "sektion": "080",
      "titel": "Traktens",
      "bild": "080-40 Traktens.png",
      "begrepp": [
        "Google Sites",
        "kartautomation"
      ],
      "anteckningar": "Byns sida — Google Sites med kartautomation. Gratis verktyg, riktig nytta.",
      "lankar": [
        [
          "traktens.se",
          "https://www.traktens.se/om-traktens"
        ]
      ],
      "relaterat": [
        "130-40"
      ]
    },
    {
      "id": "080-50",
      "sektion": "080",
      "titel": "Notion som anteckningar",
      "bild": "080-50 Notion som anteckningar.png",
      "begrepp": [
        "Notion",
        "skolan",
        "fria studier"
      ],
      "anteckningar": "Anteckningsblocket som blev skolplattform.\nFria studier om AI — välj din stig.",
      "lankar": [
        [
          "Fria studier om AI",
          "https://delicate-neighbor-37a.notion.site/Fria-studier-om-AI-v-lj-din-stig-1839c8142e3f804bb689ee34f7e30cf0"
        ]
      ],
      "relaterat": [
        "130-40"
      ]
    },
    {
      "id": "080-60",
      "sektion": "080",
      "titel": "Bloggen",
      "bild": "080-60 Bloggen.png",
      "begrepp": [
        "Wisdom Streamer",
        "blogg"
      ],
      "anteckningar": "Där tankarna landar mellan föreläsningarna — 120 poster, taggade och sökbara.\nBerättelserna bakom många av bilderna bor här.",
      "lankar": [
        [
          "Wisdom Streamer – bloggen",
          "https://wisdom-streamer.lovable.app/"
        ],
        [
          "ainnova.se",
          "https://ainnova.se"
        ]
      ],
      "relaterat": [
        "130-40"
      ]
    },
    {
      "id": "080-70",
      "sektion": "080",
      "titel": "Veckolåtar",
      "bild": "080-70 Veckolåtar.png",
      "begrepp": [
        "fredagslåtar",
        "musik"
      ],
      "anteckningar": "Musiken som återkommande inslag — varje vecka en låt med AI-koppling.\nAI:n hjälper till, men glädjen är min.",
      "lankar": [
        [
          "Musiksidan",
          "https://sites.google.com/ainnova.se/aisverige/musik"
        ],
        [
          "Fredagslåt på YouTube",
          "https://www.youtube.com/watch?v=a7_jig8MxiU"
        ]
      ],
      "relaterat": [
        "130-40"
      ]
    },
    {
      "id": "080-80",
      "sektion": "080",
      "titel": "Sköldbondens schack",
      "bild": "080-80 Sköldbondens schack.png",
      "begrepp": [
        "schack",
        "spel"
      ],
      "anteckningar": "Mitt eget schack med egna regler: drottningen högst, bonden med sköld.\nByggt med AI — och en fin cirkel tillbaka till Deep Blue.",
      "lankar": [
        [
          "Spela Sköldbondens schack",
          "https://annamalmberg2.github.io/skoldbondens-schack/"
        ]
      ],
      "relaterat": [
        "030-20",
        "950-20"
      ]
    },
    {
      "id": "080-85",
      "sektion": "080",
      "titel": "Handslaget – appen",
      "bild": "080-85 Handslaget – appen.png",
      "begrepp": [
        "avtal",
        "Handslaget"
      ],
      "anteckningar": "Avtalsverktyget: enkla överenskommelser mellan människor.\nEtt handslag — fast digitalt.",
      "lankar": [
        [
          "Handslaget",
          "https://handshake-echo-world.lovable.app"
        ]
      ],
      "relaterat": [
        "080-90",
        "090-10"
      ]
    },
    {
      "id": "080-90",
      "djup": 3,
      "sektion": "080",
      "titel": "Handslag på svenska",
      "bild": "080-90 Handslag på svenska.png",
      "begrepp": [
        "avtal",
        "Handslaget"
      ],
      "anteckningar": "Samma idé, på svenska. Förtroende är lokalt.",
      "relaterat": [
        "080-85",
        "090-10"
      ]
    },
    {
      "id": "080-95",
      "fordjupning": "'Vibe coding' — Andrej Karpathys ord för att bygga program genom att beskriva vad man vill ha, på vanligt språk. Tröskeln som föll var inte teknisk utan språklig: svenska blev ett programmeringsspråk.\n\nRealistisk förväntan: prototyper och personliga verktyg på en kväll. Riktiga produkter kräver fortfarande omsorg om säkerhet, data och underhåll. Men avståndet från idé till 'titta, den funkar!' har aldrig varit kortare.",
      "sektion": "080",
      "titel": "Lovable – bygg med en mening",
      "bild": "080-95 Lovable affiliate.png",
      "personer": [
        "Andrej Karpathy",
        "Mauri"
      ],
      "begrepp": [
        "Lovable",
        "vibe coding"
      ],
      "anteckningar": "Verktyget som bygger webbappar av en mening ('vibe coding' — Karpathys ord).\nAllt ni sett ikväll kan ni börja bygga själva — ikväll.",
      "lankar": [
        [
          "Lovable",
          "https://lovable.dev"
        ],
        [
          "Mauri presenterar Lovable",
          "https://youtu.be/0NDFrrQXPkk"
        ]
      ],
      "relaterat": [
        "070-60",
        "130-40"
      ]
    },
    {
      "id": "090-10",
      "fordjupning": "Forskning om människa–AI-samarbete visar ett obekvämt mönster: människa plus AI kan bli sämre än AI ensam — när människan bara gummistämplar maskinens förslag. Laget vinner först när rollerna är tydliga: maskinen föreslår, människan förstår uppgiften och äger beslutet.\n\nDet som håller bron uppe är alltså inte tekniken utan arbetsformen: lyssna, fråga, granska, ansvara. Förtroende är en konstruktion — bokstavligen.",
      "djup": 1,
      "sektion": "090",
      "titel": "Framtiden byggs tillsammans – bron",
      "bild": "090-10 Framtiden byggs tillsammans – bron.png",
      "begrepp": [
        "samarbete",
        "förtroende",
        "handslag"
      ],
      "anteckningar": "Varken människor eller AI når framtiden själva — värdet skapas i mötet.\nMänniskor: erfarenhet, intuition, empati, ansvar. AI: data, mönster, hastighet.\nDet som håller bron uppe: lyssna, fråga, samverka, ansvara, lära, överlämna.",
      "relaterat": [
        "090-20",
        "080-85"
      ]
    },
    {
      "id": "090-20",
      "sektion": "090",
      "titel": "Tillsammans för bästa beslut",
      "bild": "090-20 Tillsammans för bästa beslut.png",
      "begrepp": [
        "beslut",
        "samarbete"
      ],
      "anteckningar": "Människan väljer. AI:n räknar.\nBäst blir det när båda gör det de är bäst på.",
      "relaterat": [
        "090-10",
        "080-20"
      ]
    },
    {
      "id": "090-30",
      "fordjupning": "Tanken bakom de tre lagren: ett arbetsminne (det AI:n ser just nu), en aktiv position (mina mål och beslut) och ett arkiv (allt, för alltid). Det är samma arkitektur som språkmodellernas kontextfönster plus databas — fast för ett människoliv.\n\nDe svåra frågorna är inte tekniska: Vem äger arkivet? Vad får AI:n lyfta fram ur det — och åt vem? Och vad händer med det när jag inte längre finns? Jag vill hinna välja svaren själv.",
      "sektion": "090",
      "titel": "Tre lager – en livsresa",
      "bild": "090-30 Tre lager – en livsresa.png",
      "personer": [
        "Ada"
      ],
      "begrepp": [
        "minne",
        "arkiv",
        "AI-assistent"
      ],
      "anteckningar": "Min AI-assistent Ada och minnet i tre lager:\n1. AI:ns arbetsminne  2. Min aktiva position  3. Det fullständiga arkivet.\nAllt fångas, inget raderas, jag bestämmer.\nFrån barnets första tankar till visdomens sista råd.",
      "relaterat": [
        "100-20",
        "090-10"
      ]
    },
    {
      "id": "100-10",
      "fordjupning": "Tekniken i vänstra och högra bilden är samma teknik. Skillnaden är beställningen. AI optimerar det vi ber om — så den verkliga frågan är vad vi som samhälle beställer: övervakning eller folkbildning, rädsla eller folkvett.\n\nDärför är AI-politik ingen teknikfråga utan en värderingsfråga, och 'vi väljer' är bokstavligt: upphandlingar, lagar, skolplaner. Astrid-vägen kräver att vanligt folk förstår tekniken. Annars väljer någon annan åt oss.",
      "djup": 1,
      "sektion": "100",
      "titel": "Strid eller Astrid",
      "bild": "100-10 Strid eller Astrid.png",
      "personer": [
        "Astrid Lindgren"
      ],
      "begrepp": [
        "säkerhet",
        "rädsla",
        "folkvett"
      ],
      "anteckningar": "Samma teknik — två vägar.\nStrid: rå kapacitet, rädsla, varningsskyltar.\nAstrid: mänsklig värme, folkvett, sagor för barnen.\nVi väljer. Det är hela poängen.",
      "relaterat": [
        "100-20",
        "060-20"
      ]
    },
    {
      "id": "100-20",
      "fordjupning": "Michael Endes 'Momo' kom 1973: de grå herrarna övertalar människor att 'spara tid' — och stjäl den. De sparade timmarna kommer aldrig tillbaka. Känns det igen? Varje effektivitetsteknik har lovat oss fritid och levererat högre tempo.\n\nAI blir det stora testet: om den gör din vecka fyra timmar snabbare — vart går timmarna? Om svaret är 'fler möten' har de grå herrarna vunnit igen. Momos superkraft var att lyssna på riktigt. Behåll den.",
      "sektion": "100",
      "titel": "Momo och de grå herrarna",
      "bild": "100-20 Momo och de grå herrarna.png",
      "personer": [
        "Michael Ende",
        "Momo"
      ],
      "begrepp": [
        "tid",
        "effektivitet",
        "de grå herrarna"
      ],
      "anteckningar": "Michael Endes 'Momo': de grå herrarna stjäl tid i effektivitetens namn —\nportföljerna är märkta ROI, growth, efficiency.\nOm AI ger oss tid tillbaka: låt ingen stjäla den.\nMomo lyssnade. Det är superkraften.",
      "relaterat": [
        "100-10",
        "090-30"
      ]
    },
    {
      "id": "110-10",
      "fordjupning": "Skämtet har en udd: rädslan att ha fel är den dyraste känslan i en exponentiell tid. Den som måste ha rätt från början vågar aldrig testa.\n\nAI sänker priset på misstag dramatiskt — ett utkast kostar sekunder, en prototyp en kväll. Då blir modet att ha fel snabbt en konkurrensfördel. Felen är inte motsatsen till kunskap. De är råvaran.",
      "djup": 1,
      "sektion": "110",
      "titel": "Nobelpriset i ekonomi 2026",
      "bild": "110-10 Nobelpriset i ekonomi 2026.png",
      "personer": [
        "Claude"
      ],
      "begrepp": [
        "humor",
        "Pluton B"
      ],
      "anteckningar": "Med glimten i ögat: 'för upptäckten att människor hellre misslyckas med att ha rätt\nän lyckas efter att ha haft fel.'\nAlla vill ha rätt från början. AI låter oss ha fel — snabbare och billigare.\nDärför lär vi oss mer.",
      "relaterat": [
        "130-10"
      ]
    },
    {
      "id": "120-10",
      "djup": 1,
      "sektion": "120",
      "titel": "AiNNOVA – vad jag erbjuder",
      "bild": "120-10 AiNNOVA – vad jag erbjuder.png",
      "begrepp": [
        "AiNNOVA",
        "konsultation",
        "utbildning"
      ],
      "anteckningar": "Sex ben: AI-konsultation, utbildning & coachning, innehållsproduktion,\nwebb & kommunikation, marknadsföring, specialiserade AI-lösningar.\nTack — och på återseende!",
      "lankar": [
        [
          "ainnova.se",
          "https://ainnova.se"
        ],
        [
          "anna@ainnova.se",
          "mailto:anna@ainnova.se"
        ],
        [
          "LinkedIn",
          "https://www.linkedin.com/in/annamalmberg2/"
        ]
      ],
      "relaterat": [
        "000-20"
      ]
    },
    {
      "id": "130-10",
      "djup": 3,
      "sektion": "130",
      "titel": "Nobelprisen 2024",
      "personer": [
        "John Hopfield",
        "Geoffrey Hinton",
        "Demis Hassabis",
        "John Jumper"
      ],
      "begrepp": [
        "Nobelpriset",
        "maskininlärning"
      ],
      "text": "Fysik: John Hopfield & Geoffrey Hinton — grunden för maskininlärning i neurala nätverk.\n\nKemi: Demis Hassabis & John Jumper (DeepMind) — AlphaFold och proteinstrukturerna.\n\nEtablissemangets kvitto: AI är vetenskap.",
      "anteckningar": "Hinton kallas 'AI:s gudfader' — och är numera en av de tydligaste varnarna.",
      "relaterat": [
        "030-40"
      ]
    },
    {
      "id": "130-20",
      "djup": 3,
      "sektion": "130",
      "titel": "Filmtips",
      "begrepp": [
        "filmer"
      ],
      "personer": [
        "Alan Turing"
      ],
      "text": "The Queen's Gambit — schackets skönhet.\n\nHidden Figures — kvinnorna bakom rymdprogrammet.\n\nThe Imitation Game — Alan Turing och koden.\n\nIron Man (JARVIS) — drömmen om den personliga assistenten.",
      "anteckningar": "Bra svar när publiken frågar 'var ska jag börja?' — börja i soffan.",
      "relaterat": [
        "020-40",
        "030-20"
      ]
    },
    {
      "id": "130-30",
      "djup": 3,
      "sektion": "130",
      "titel": "Se & lyssna",
      "personer": [
        "Marcus du Sautoy"
      ],
      "begrepp": [
        "matematik",
        "dokumentärer"
      ],
      "text": "Fördjupning för den nyfikna — matematiken bakom alltihop.",
      "anteckningar": "The wisdom of the crowd: gissa oxens vikt — snittet slår experten.\nSamma princip som i maskininlärning.",
      "lankar": [
        [
          "BBC: The Story of Maths",
          "https://www.youtube.com/playlist?list=PLonhd8B9fP9u6TiZWKK1bhPD6JKoio6N8"
        ],
        [
          "BBC: The CODE",
          "https://youtu.be/iOucwX7Z1HU"
        ],
        [
          "The wisdom of the crowd – Marcus du Sautoy",
          "https://youtu.be/s7tngG2kAik?t=265"
        ]
      ],
      "relaterat": [
        "060-10",
        "020-40"
      ]
    },
    {
      "id": "130-40",
      "djup": 3,
      "sektion": "130",
      "titel": "Länkbiblioteket",
      "begrepp": [
        "projekt",
        "länkar"
      ],
      "text": "Allt jag byggt och visar — samlat på ett ställe.",
      "anteckningar": "Publiken kan klicka hemifrån — dela länksamlingen på tavlan eller i chatten.",
      "lankar": [
        [
          "Länksamlingen",
          "https://erbjudanden.ainnova.se/länkar"
        ],
        [
          "HurDetFunkar",
          "https://hurdetfunkar.se"
        ],
        [
          "Traktens",
          "https://www.traktens.se/om-traktens"
        ],
        [
          "En Kullen",
          "https://enkullen.se"
        ],
        [
          "Rissäters loppis",
          "https://rissaeters-loppis.com"
        ],
        [
          "Wisdom Streamer",
          "https://wisdom-streamer.lovable.app"
        ],
        [
          "Open Weave AI – etiskt ramverk",
          "https://open-weave-ai.lovable.app/"
        ],
        [
          "Vision Setter",
          "https://vision-setter.lovable.app/"
        ],
        [
          "Handslaget",
          "https://handshake-echo-world.lovable.app"
        ],
        [
          "Sköldbondens schack",
          "https://annamalmberg2.github.io/skoldbondens-schack/"
        ],
        [
          "Pluton B",
          "https://sites.google.com/view/hurdetfunkar/pluton-b"
        ],
        [
          "Fria studier om AI (Notion)",
          "https://delicate-neighbor-37a.notion.site/Fria-studier-om-AI-v-lj-din-stig-1839c8142e3f804bb689ee34f7e30cf0"
        ]
      ],
      "relaterat": [
        "080-30"
      ]
    },
    {
      "id": "900-10",
      "sektion": "900",
      "titel": "Under föreläsningen",
      "bild": "900-10 Under föreläsningen.jpg",
      "anteckningar": "Från en tidigare föreläsning — bra till marknadsföring och som avslutningsbild."
    },
    {
      "id": "900-20",
      "sektion": "900",
      "titel": "Anna framför sin roll-up",
      "bild": "900-20 Anna framför sin roll-up.jpg",
      "anteckningar": "Pressbild."
    },
    {
      "id": "900-30",
      "sektion": "900",
      "titel": "Engagerad publik",
      "bild": "900-30 Engagerad publik.jpg",
      "anteckningar": "Publiken jobbar — bevis på att formatet funkar."
    },
    {
      "id": "900-40",
      "sektion": "900",
      "titel": "Fikaföreläsning",
      "bild": "900-40 Fikaföreläsning.jpg",
      "anteckningar": "Det lilla formatet: fika, samtal, AI."
    },
    {
      "id": "950-10",
      "sektion": "950",
      "titel": "Detektiven",
      "bild": "950-10 Detektiven.png",
      "anteckningar": "Reserv: källkritik — var detektiv, lita men verifiera.",
      "relaterat": [
        "060-20"
      ]
    },
    {
      "id": "950-20",
      "sektion": "950",
      "titel": "Konst – schack",
      "bild": "950-20 Konst – schack.png",
      "anteckningar": "Reserv: konstvariant på schacktemat.",
      "relaterat": [
        "080-80"
      ]
    },
    {
      "id": "950-30",
      "sektion": "950",
      "titel": "Anna goo",
      "bild": "950-30 Anna goo.jpg",
      "anteckningar": "Reserv: porträttvariant."
    },
    {
      "id": "950-40",
      "sektion": "950",
      "titel": "Ett spel – vem ska man lita på",
      "bild": "950-40 Ett spel – vem ska man lita på.png",
      "begrepp": [
        "förtroende",
        "källkritik"
      ],
      "anteckningar": "Reserv: förtroendespelet — vem litar du på, människan eller maskinen?",
      "relaterat": [
        "100-10",
        "060-20"
      ]
    },
    {
      "id": "950-50",
      "sektion": "950",
      "titel": "Exponentiellt tänkande",
      "bild": "950-50 Exponentiellt tänkande.png",
      "begrepp": [
        "exponentiell utveckling"
      ],
      "anteckningar": "Reserv: alternativ bild till exponentiell utveckling.",
      "relaterat": [
        "010-10"
      ]
    },
    {
      "id": "950-60",
      "sektion": "950",
      "titel": "Från spel till AGI",
      "bild": "950-60 Från spel till AGI.png",
      "begrepp": [
        "AGI",
        "spel"
      ],
      "anteckningar": "Reserv: bryggan spel → AGI, alternativ till 'lämnade spelbordet'.",
      "relaterat": [
        "030-10"
      ]
    },
    {
      "id": "950-70",
      "sektion": "950",
      "titel": "Läror och mönster",
      "bild": "950-70 Läror och mönster.png",
      "begrepp": [
        "mönster"
      ],
      "anteckningar": "Reserv: mönstertemat i konstform.",
      "relaterat": [
        "060-10"
      ]
    },
    {
      "id": "950-80",
      "sektion": "950",
      "titel": "Stjärnnatt – infografik",
      "bild": "950-80 Stjärnnatt – infografik.png",
      "anteckningar": "Reserv: stämningsbild, bred infografik."
    },
    {
      "id": "950-90",
      "sektion": "950",
      "titel": "Schack vs Go",
      "bild": "950-90 Schack vs Go.png",
      "begrepp": [
        "schack",
        "Go"
      ],
      "anteckningar": "Reserv: jämförelsen schack vs Go — bra om publiken vill fördjupa spelhistorien.",
      "relaterat": [
        "030-20",
        "030-30"
      ]
    }
  ]
};

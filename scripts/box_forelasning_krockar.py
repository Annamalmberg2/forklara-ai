#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Föreläsningens 'Var vi krockar' -> steelmannad knivskarp prosa (VERKTYGET/manifest).
Boken forklara-ai.html synkas separat i ett ordnat svep när alla kärn- + extrakort är klara.
Kör om med fler kort i K allteftersom."""
import json, re, io
ROOT="/Users/ainnova/Projects/forklara-ai/"
K={
# --- 000 ---
"vem-ar-jag":'Fråga vem som borde få uttala sig om AI, så delar sig rummet — och det säger något om vad vi tror kunskap är. Den ena litar på experten med djup i ämnet. Den andra på den som lever med tekniken varje dag och ser vad den gör med vanligt folk. Krocken: sitter rätten att tala i djupet eller i erfarenheten — och vad missar vi om vi bara lyssnar på det ena?',
"vem-bildar-oss":'Fråga vem som borde bilda oss, så skiljer sig blickarna — mellan världsdelar och tvärs genom samma kök. Den ena vill värna de gamla källorna: läraren, boken, samtalet. Den andra ser att barnbarnet redan formas mer av flödet än av far. Krocken: ska vi försvara de gamla bildarna eller lära oss styra de nya — och hinner vi välja innan valet är gjort åt oss?',
"dummare-eller-smartare":'Alla är överens om att något står på spel — men inte om vad man ska göra. Den ena ser en utvidgad hjärna: verktyg har alltid gjort oss kapablare, det här är nästa steg. Den andra ser en avlastad hjärna som slutar öva det den lämnar bort. Krocken: gör tekniken oss dummare eller smartare — eller är det vi som avgör, beroende på om vi lutar oss mot den eller bryner oss mot den?',
"starka-kanslor":'Samma teknik, helt olika platser att stå på — och därför helt olika känslor. Den ena vill sakta ner inför en kraft vi inte förstår. Den andra vill skynda på mot allt gott den kan göra. Båda drivs av omtanke om samma framtid. Krocken: är den största faran att gå för fort, eller att gå för långsamt medan andra springer?',
# --- 010 ---
"aristoteles-first-principles":'Fråga vad tänkande djupast är, så delar sig leden — och det är i själva verket AI:s stora vetenskapsstrid. Den ena ser tänkande som regler och logik, något man kan skriva ner. Den andra ser det som mönster som växer fram, omöjliga att helt fånga i regler. Krocken: är förnuftet steg att följa eller något som uppstår — och kan en maskin ha det senare?',
"vem-uppfann-ai":'Fråga vem som ska få äran, så delar sig rummet — och det säger ofta mer om berättaren än om historien. Den ena vill peka ut geniet, ögonblicket, namnet. Den andra ser en kedja av tusen händer över sekler, där ingen enskild uppfann något. Krocken: föds genombrott ur enstaka snillen eller ur ett kollektiv vi glömmer att räkna — och vem skrivs bort när vi förenklar?',
"bara-man-som-kodar":'Just den här frågan väcker starka, spretiga känslor — och det är värt att förstå varför. Den ena hör "kvot" och rycker till: talang ska avgöra, inte kön. Den andra pekar på att bilden av det ensamma manliga geniet helt enkelt är historiskt fel — de första programmerarna var kvinnor. Krocken: handlar det om att kvotera in någon, eller om att sluta kvotera bort dem som redan fanns där?',
"nar-blev-maskinen-battre":'Samma parti, men vad man ser i det skiljer sig helt. Den ena beundrar drag 37 — maskinen gjorde något ingen människa tänkt, ren skönhet. Den andra oroar sig: en maskin som optimerar mot ett mål vi satt kan hitta vägar vi aldrig menade. Krocken: är ett övermänskligt drag ett under att hylla, eller en varning om vad som händer när vi inte längre förstår hur den vann?',
"nar-blev-den-vetenskap":'Även ett genombrott alla vinner på väcker olika blickar — på vem som äger och får del av frukten. Den ena firar öppen vetenskap: kunskapen ska vara allas. Den andra ser att den som byggde den också vill, och kanske borde, få igen sin insats. Krocken: ska frukten av ett genombrott vara fri för alla eller belöna dem som bekostade det — och vad händer med nästa genombrott om vi väljer fel?',
"radsla-for-det-nya":'Samma skifte, helt olika grundton — beroende på var man står. Den ena vill stanna upp; varje ny kraft har missbrukats innan vi lärde oss tygla den. Den andra vill skynda på; varje ny kraft har också lyft fler än den skadat. Krocken: är försiktigheten det som räddar oss eller det som lämnar oss efter — och hur vet vi skillnaden i stunden?',
# --- 020 ---
"ar-ai-en-maskin":'Samma system, men vilken bild man väljer skiljer sig helt — och bilden avslöjar hållningen. Den ena säger "bara en maskin", en avancerad räknedosa utan förstånd. Den andra ser något mer organiskt, som odlats fram och överraskar sina egna byggare. Krocken: avdramatiserar "bara en maskin" det som behövs, eller blundar det för något vi faktiskt inte längre helt förstår?',
"ett-enda-foretag":'Ekosystemet är allt annat än neutralt — det dras i flera riktningar samtidigt. Den ena vill ha öppna modeller, fria för alla att bygga på. Den andra menar att de kraftfullaste systemen måste hållas stängda, för säkerheten och för att någon ska ha råd att bygga dem. Krocken: blir AI bäst och säkrast av att vara öppet för alla, eller av att några få håller i tyglarna — och vem vaktar dem då?',
"hur-larde-den-sig":'Bakom den prydliga trappan låg ett riktigt inbördeskrig om hur man ens borde bygga tänkande maskiner. Det ena laget ville skriva in reglerna för hand — logik, symboler, ordning. Det andra ville låta maskinen lära sig själv ur exempel, utan att vi säger hur. Krocken: byggs intelligens bäst uppifrån av regler vi förstår, eller nedifrån av mönster vi inte kan följa — och vad offrar vi med varje väg?',
"tokens-och-konstiga-ord":'Samma verktyg, men vad du får ut hänger på vilken bild du bär in. Den ena tror på hemliga trollformler — rätt prompt låser upp magin. Den andra ser en samtalspartner: du får ut ungefär det du orkar tänka in. Krocken: är skickligheten en uppsättning knep att lära sig, eller ett sätt att tänka klart — och vilken av dem lär dig något som består?',
"hur-snabbt-gar-utvecklingen":'Alla ser samma branta kurva — men drar helt olika slutsatser. Den ena vill skynda på; ju snabbare, desto snabbare kommer lösningarna. Den andra vill bromsa; det som växer exponentiellt hinner vi sällan förstå förrän det passerat oss. Krocken: är farten vårt hopp eller vår risk — och vem hinner sätta reglerna medan kurvan stiger?',
}
SEC=re.compile(r'<div class="section">\s*<div class="section-head"><span class="num">(\d+)</span><span class="concept">Var vi krockar</span><span class="tag">([^<]*)</span></div>\s*<div class="body">.*?</div>\s*</div>(?=\s*(?:<hr>|<div class="section">|<div class="extra-head">|<div class="future-box">))', re.S)
def newsec(num,tag,prose):
    return '<div class="section">\n  <div class="section-head"><span class="num">%s</span><span class="concept">Var vi krockar</span><span class="tag">%s</span></div>\n  <div class="body">%s</div>\n</div>'%(num,tag,prose)
P=ROOT+"content/forklara-ai/manifest.js"; s=io.open(P,encoding="utf-8").read();PRE="window.LECTURE = "
i=s.index(PRE)+len(PRE);j=s.rfind(";");head,tail=s[:i],s[j:]
L=json.loads(s[i:j]);k={x["id"]:x for x in L["kort"]}
n=0
for kid,prose in K.items():
    f=k[kid]["fordjupning"]; m=SEC.search(f); assert m,"manifest %s"%kid
    k[kid]["fordjupning"]=f.replace(m.group(0), newsec(m.group(1),m.group(2),prose),1); n+=1
out=head+json.dumps(L,ensure_ascii=False,indent=2)+tail
json.loads(out[out.index(PRE)+len(PRE):out.rfind(";")]); io.open(P,"w",encoding="utf-8").write(out)
print("Föreläsning (verktyg): %d krockar omgjorda"%n)
print("KYR:",sum(1 for c in out if c in set('аеорсухіјѕАЕОРСТНКМВ')))

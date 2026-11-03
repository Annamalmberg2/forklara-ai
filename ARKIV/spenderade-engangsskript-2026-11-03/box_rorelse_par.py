#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Perfektionera rörelsens 'Var vi alltid möts' + 'Var vi krockar' som par (verktyg + bok)."""
import json, re, io
ROOT="/Users/ainnova/Projects/forklara-ai/"

MOTS={
"rorelse-0":'Under all politik vill nästan alla samma enkla sak: att få räknas, behövas och höra hemma. Det är inte höger eller vänster — det är mänskligt. Oenigheten gäller sällan <em>om</em> människor ska få bli stora, utan det lilla ordet efteråt: bara <em>våra</em>? Där möts vi.',
"rorelse-1":'Alla vill känna sig behövda — bidra med något, gå hem och känna att dagen betydde något. Att bli överflödig gör ont på ett sätt ingen check kan laga. Där möts vi, oavsett var vi står om handel, migration eller robotar.',
"rorelse-2":'Nästan alla bär samma längtan: att höra hemma hos några få som är <em>ens egna</em>. Att vilja skydda det man älskar är urmänskligt. Där möts vi — oavsett hur våra familjer råkar se ut. Skillnaden är bara om vi unnar andra detsamma.',
"rorelse-3":'Att bli sedd av någon som känner en är ingen lyx — det är biologi. I alla tider vilade tryggheten på ansikten: byns äldste, gårdens fadder, grannen över staketet. Ett samhälle där ingen känner dig är inte bara kallt — det är otryggt på riktigt. Där möts vi.',
"rorelse-4":'Alla vill kunna sova tryggt — och alla känner obehaget av att ständigt vara bevakad. Att vilja skydda sina barn, och att vilja ha en vrå som är ens egen, är lika mänskligt. Ingen vill leva vare sig i skräck eller helt genomlyst. Där möts vi.',
"rorelse-5":'Alla vill få säga vad de tänker, tro vad de tror, leva som de vill. Ingen vill bli tystad. Just därför är frihetstestet så svårt: det kräver att vi unnar andra exakt det vi kräver själva — också när vi avskyr vad de gör av det. Där möts vi, om vi vågar.',
"rorelse-6":'Nästan alla vill vara stolta över var de kommer ifrån — och nästan ingen vill vara den lilla som körs över av den stora. Längtan efter ett hem, och avskyn mot att förödmjukas, är lika gamla som de första byarna. Där möts vi, under alla flaggor.',
"rorelse-7":'Nästan alla vill att den som sliter och skapar ska få sitt — och nästan ingen vill se några få håva in medan andra betalar i tysthet. Rättvisan i "den som ställer till det får städa upp" bär varje barn. Där möts vi, bakom all ekonomisk teori.',
"rorelse-8":'Nästan alla vill att tekniken ska göra livet lättare, inte tommare. Och nästan ingen vill vara den vars arbete, data eller uppmärksamhet blev någon annans förmögenhet — utan att man ens tillfrågades. Längtan efter verktyg som tjänar oss är lika gammal som den första yxan. Där möts vi.',
"rorelse-9":'Nästan alla har känt smärtan i att avfärdas som dum, farlig eller mindre värd bara för att man tänkte annorlunda. Och nästan alla vet, innerst inne, att den man är oense med sällan är ett monster — bara en människa som ser en annan del av elefanten. Där möts vi, om vi orkar minnas det i stridens hetta.',
"rorelse-10":'Nästan alla längtar ibland tillbaka till något som kändes tryggt och helt — barndomen, en tid, en plats. Den längtan är öm och mänsklig. Där möts vi. Frågan är bara om vi låter den bli en cell av <em>förr</em> — eller ett bränsle för att bygga något bättre, den här gången för fler.',
"rorelse-slut":'Under allt vill nästan alla samma enkla sak: att få räknas, behövas och höra hemma — och att ens barn ska få det bättre. Det är inte höger eller vänster. Det är människa. MEGA är bara den längtan satt fri från det lilla ordet som förgiftar den: bara <em>våra</em>. Där möts vi. Resten är detaljer vi får bråka ärligt om.',
}
KROCK={
"rorelse-0":'Hur man ska tänka om storhet drar isär oss — och båda sidor säger något sant. Mark, makt och budget <em>är</em> begränsade: där kräver din bit min. Men kunskap, trygghet och värdighet växer när fler får del. Striden gäller vilket som är vilket — och hur ofta "din vinst är min förlust" säljs in där det inte ens stämmer.',
"rorelse-1":'Vad vi ska göra när maskinen kan göra jobbet drar isär oss. Den ena vill sakta ner förändringen för att skydda dem som lever på de gamla jobben — omtanke, inte bakåtsträvande. Den andra säger att man inte kan mura mot en robotarm, så tryggheten måste byggas kring människan, inte jobbet. Båda vill skydda — de är oense om <em>vad</em>, hur snabbt det får gå, och vem som bär kostnaden under tiden.',
"rorelse-2":'Vad en familj är — och vem som bestämmer det — drar isär oss. Den som håller fast vid en mall gör det ofta av verklig omsorg; barn behöver stabilitet. Den som vill lämna formen öppen pekar på att kärlek och trygghet burits i tusen slags hushåll genom historien. Krocken: skyddar vi barnet bäst genom en bestämd form, eller genom att vaka över <em>relationerna</em> oavsett form?',
"rorelse-3":'Vad vi ska göra med känslan att något gått förlorat drar isär oss. Den som vill vrida klockan tillbaka sörjer något äkta — banken som kände ditt namn, torget, föreningen. Den som vägrar nostalgin minns att det gamla också stängde ute många. Frågan: kan närheten bara återuppstå bakåt, eller byggas på nytt — digital <em>och</em> mänsklig på en gång?',
"rorelse-4":'Hur mycket vi ska se varandra för att känna oss trygga drar isär oss. Den som vill ha fler kameror och register vill på riktigt skydda folk från fara. Den som ryggar frågar vem som hamnar i sökljuset — och märker att det nästan alltid pekar nedåt, mot de maktlösa, sällan uppåt mot makten själv. Ingen är emot trygghet; striden gäller vem som ska bli genomlyst, och vem som slipper.',
"rorelse-5":'Hur långt friheten ska gå — och för vem — drar isär oss. Nästan alla säger sig älska frihet; skiljelinjen visar sig först när den används av någon vi ogillar. Den ena vill ha en princip som gäller även motståndaren. Den andra försvarar den helst för sin egen sida. Där ligger hela testet: är det frihet du bär, eller bara ditt lag?',
"rorelse-6":'Vad det betyder att älska sitt land drar isär oss. Den ena hör "vi vinner om de förlorar" och menar stolthet och självförsvar — inget fult i det. Den andra ser hur lätt "jag älskar mitt" glider till "därför måste ditt vara mindre värt". Krocken: kan man vara stolt över sitt eget utan att göra grannens litet?',
"rorelse-7":'Vad ett framgångsrikt företagande är drar isär oss. Den ena litar på sista raden — vinst är ofta beviset på att något skapar värde. Den andra frågar efter kostnaden som aldrig kom med på fakturan: slitna människor, förgiftad natur, en nota som betalas i tysthet av andra. Krocken: räknar vi bara det som syns i bokföringen, eller också det som hamnar utanför?',
"rorelse-8":'Vad tekniken ska göra med människan drar isär oss. Den ena ser maskinen som en förstärkning — den som gör oss klokare, snabbare, större. Den andra ser risken att den gör människan överflödig i stället för rikare. Samma verktyg, två utfall; striden gäller vem det byggs <em>för</em> — och vem som får bära om det slår fel.',
"rorelse-9":'Hur vi bär oenigheten drar isär oss. Den som längtar efter enighet vill ha lugn och sammanhållning — begripligt. Den som värnar mångfalden vet att en rörelse för <em>everybody</em> måste tåla att alla inte tycker lika. Krocken: kräver gemenskap att vi tänker likadant, eller att vi står ut med att låta bli — utan att göra motståndaren mindre mänsklig?',
"rorelse-10":'Vart vi ska rikta blicken drar isär oss. Den som vänder sig bakåt söker något tryggt och känt — <em>förr</em> känns alltid stadigare. Den andra minns att guldåldern aldrig fanns för alla; barnadödlighet, svält och ofrihet låg också där bak. Krocken: ska vi återställa en tid som aldrig var, eller bygga en som ännu inte varit?',
"rorelse-test":'Vad vi bör mäta ett förslag på drar isär oss. Den vane frågar först: höger eller vänster? Och färgen <em>säger</em> något — den bär värderingar värda att ta på allvar. Men den frågan avgör sällan om förslaget faktiskt gör världen större för fler. Krocken: mäter vi ett förslag på vilket lag det tillhör, eller på vem det gör större och vem det gör mindre?',
}

def sec_re(concept):
    return re.compile(r'<div class="section">\s*<div class="section-head"><span class="num">(\d+)</span><span class="concept">'+re.escape(concept)+r'</span><span class="tag">([^<]*)</span></div>\s*<div class="body">.*?</div>\s*</div>(?=\s*(?:<hr>|<div class="section">))', re.S)

P=ROOT+"content/forklara-ai/manifest.js"
s=io.open(P,encoding="utf-8").read(); PRE="window.LECTURE = "
i=s.index(PRE)+len(PRE); j=s.rfind(";"); head,tail=s[:i],s[j:]
L=json.loads(s[i:j]); k={x["id"]:x for x in L["kort"]}
mega=io.open(ROOT+"mega.html",encoding="utf-8").read()

def apply(concept, D):
    R=sec_re(concept); n=0
    for kid,prose in D.items():
        f=k[kid]["fordjupning"]; m=R.search(f)
        assert m, "%s / %s: ingen sektion"%(kid,concept)
        num,tag=m.group(1),m.group(2); old=m.group(0)
        new='<div class="section">\n  <div class="section-head"><span class="num">%s</span><span class="concept">%s</span><span class="tag">%s</span></div>\n  <div class="body">%s</div>\n</div>'%(num,concept,tag,prose)
        k[kid]["fordjupning"]=f.replace(old,new,1)
        assert mega.count(old)==1, "mega %s/%s: %d"%(kid,concept,mega.count(old))
        globals()['mega']=mega.replace(old,new,1); n+=1
    return n

n1=apply("Var vi alltid möts", MOTS)
n2=apply("Var vi krockar", KROCK)
out=head+json.dumps(L,ensure_ascii=False,indent=2)+tail
json.loads(out[out.index(PRE)+len(PRE):out.rfind(";")])
io.open(P,"w",encoding="utf-8").write(out)
io.open(ROOT+"mega.html","w",encoding="utf-8").write(mega)
print("möts:",n1,"| krockar:",n2)
print("KYR:",sum(1 for c in out if c in set('аеорсухіјѕАЕОРСТНКМВ')),"| mega em:",mega.count("<em>"),mega.count("</em>"))

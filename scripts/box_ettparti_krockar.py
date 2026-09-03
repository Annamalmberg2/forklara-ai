#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ett partis 'Var vi krockar': tunna binärer -> steelmannad knivskarp prosa (verktyg + bok)."""
import json, re, io
ROOT="/Users/ainnova/Projects/forklara-ai/"
K={
"motvikten-0":'Ett parti utan åsikt i sak väcker en rimlig fråga: går det att rösta på en metod? Den som vill veta <em>var partiet står</em> har en poäng — man vill veta vad man får. Men Motvikten håller sin övertygelse för sig själv och prövar allas förslag med samma test, sitt eget först. Krocken: vill du ha ett parti som talar om vad du ska tycka, eller ett som gör det svårare för alla att lura dig?',
"motvikten-1":'Hur mycket makt vi vågar samla på ett ställe drar isär oss. Den ena litar på att en hygglig, kompetent ledning får mer gjort utan spärrar i vägen — och ibland stämmer det. Den andra bygger hellre för dagen då fel människa sitter där, för den dagen kommer. Krocken: konstruerar vi för den goda ledaren vi hoppas på, eller för dretstöveln vi förr eller senare får?',
"motvikten-2":'Vad slöjan borde leda till drar isär oss. Den ena säger att den som lyckas ska få behålla frukten — annars dör drivkraften, och det är sant nog. Den andra väljer reglerna som om den själv kunde födas till den svagaste, och bygger så att ingen faller för djupt. Krocken: skulle du välja samma fördelning om du inte visste var i den du själv skulle hamna?',
"motvikten-3":'Vem som räknas när konsekvenserna vägs drar isär oss. Den som fattar beslutet ser sällan priset — det betalas av någon annan, någon annanstans, senare. Nästan alla håller med om att den som ställer till det borde stå för notan; oenigheten börjar när vi ska peka ut vem som egentligen bär den. Krocken: om vi har fel, vem får leva med följderna — och satt hen med vid bordet?',
"motvikten-4":'Var motvikten "kommer ifrån" drar isär oss. Den ena ser den grekisk-romerska maktdelningen som urkällan, och det finns en verklig tråd dit. Den andra påminner om att människor tyglat makt i varje hörn av världen — hövdingar avsatta av klanmödrar, härskare granskade av lärde. Krocken: är motvikt en västlig uppfinning att exportera, eller ett mänskligt påfund vi alla ärvt?',
"motvikten-5":'Hur AI:n ska förhålla sig till makten delar oss djupt. Den ena ser ett verktyg som äntligen kan göra makten granskningsbar — visa skälen, hitta mönstret, syna beslutet. Den andra ser risken att modellen inte granskar makten utan <em>blir</em> den nya makten, bortom insyn. Krocken: bygger vi AI som en lykta riktad mot makten, eller låter vi den bli en tron ingen når upp till?',
"motvikten-6":'Hur ett parti ska förhålla sig till sin egen makt drar isär oss. Den ena vet att en rörelse som grälar öppet försvagar sig själv — sammanhållning är en styrka, inte en synd. Den andra menar att kritik inifrån inte är svek utan livförsäkring; det parti som tystar sina egna tvivel blir det det bekämpar. Krocken: håller vi ihop utåt till varje pris, eller är den obekväma frågan inifrån just det som räddar oss?',
"motvikten-7":'Där går den djupaste skiljelinjen: bud eller kompass. Den ena vill ha färdiga order att lyda — det är tryggt att slippa väga själv, och i kaos kan en tydlig regel rädda liv. Den andra litar hellre på riktningar att tolka, för ingen budordslista överlever alla lägen den möter. Krocken: vill du ha ett facit att följa, eller ett omdöme att öva — också när ansvaret blir ditt eget?',
"motvikten-8":'Hur hårt makten ska tyglas — och hur snabbt den ska få handla — drar isär oss. Den ena vill ha en handlingskraftig ledning som får saker gjort innan tillfället glider förbi. Den andra bygger med flit in spärrar och långsamhet, för det som går snabbt att besluta går ofta snabbt att missbruka. Krocken: vad kostar oss mest — en makt som handlar för trögt, eller en som handlar för lätt?',
"motvikten-9":'Hur världens värden ska fördelas drar isär oss djupare än nästan allt. Den ena litar på marknaden som frihetens och drivkraftens motor — den som får behålla frukten anstränger sig. Den andra pekar på allt vi valt att äga och bära tillsammans, så att ingen faller ur botten. Krocken: var går gränsen mellan det som blir bäst av att konkurreras om, och det som blir bäst av att delas?',
"motvikten-18":'Vad vi ska göra när maskinen kan göra jobbet drar isär oss. Den ena ser effektivitetens vinst — mer görs med mindre, och det har lyft mänskligheten förr. Den andra ser tryggheten i att behövas gå förlorad, och en människa reducerad till en kostnad. Krocken: räknar vi bara vad automationen sparar, eller också vad den kostar den som blir kvar utanför?',
"motvikten-10":'Hur mycket vi är skyldiga varandra drar isär oss. Den ena menar att var och en bör bära sitt — ansvar gör oss starka, och en trygghet som aldrig kräver något gör oss svaga. Den andra svarar att ingen klarar sig ensam, och att ett samhälle mäts på hur det bär dem som inte kan. Krocken: var går linjen mellan att kräva av varandra och att svika varandra?',
"motvikten-11":'Vad skolan är till för drar isär oss. Den ena vill rusta barn för jobbet och försörjningen — det är omtanke, inte kyla. Den andra vill odla en hel människa som kan tänka, tvivla och känna, inte bara producera. Krocken: ska skolan göra dig anställbar eller fri — och måste det ens vara ett val?',
"motvikten-12":'Hur mycket vi ska offra nu för en framtid vi inte får se drar isär oss. Den ena vill skydda planeten, för det finns ingen ekonomi på en obeboelig jord. Den andra vill skydda jobb och välstånd idag, för familjen som inte får ihop månaden kan inte vänta till 2070. Krocken: hur väger vi ett barnbarns värld mot en förälders räkningar — utan att låtsas att valet är enkelt?',
"motvikten-13":'Hur mycket vi ska se varandra för att känna oss trygga drar isär oss. Den ena vill gardera mot faran — en kamera, ett register, ett öga som fångar hotet i tid. Den andra vill inte kväva den fria människan, som slutar leva fullt när någon alltid tittar. Krocken: hur mycket frihet är vi beredda att lämna för en trygghet som ändå aldrig blir hel?',
"motvikten-14":'Hur vi möter den som kommer drar isär oss djupare än nästan allt. Den ena bär plikten mot den i nöd — gästfriheten finns i varje kultur, och att vända ryggen skaver i något urgammalt. Den andra vet att ett hem behöver ramar som håller, och att ordning inte är hjärtlöshet. Krocken: kan vi öppna dörren utan att tappa golvet under den — och vem betalar om vi väljer fel?',
"motvikten-16":'Vad straffet är till för drar isär oss. Den ena vill att den skyldige ska lida — rättskänslan kräver att orätt får ett pris, och det är inte primitivt, det är mänskligt. Den andra vill att skadan ska läkas, offret upprättas och färre nya brott begås. Krocken: mäter vi rättvisa i hur ont vi gör den skyldige, eller i hur helt vi gör det som gick sönder?',
"motvikten-17":'Var makten ska bo drar isär oss. Den ena vill styra sig själv — makt nära folket går att ställa till svars, och ingen vill fjärrstyras. Den andra vet att de största krafterna — klimatet, kapitalet, krigsmakten — skrattar åt landsgränser och bara kan tyglas tillsammans. Krocken: hur nära människan kan makten sitta och ändå vara stor nog att hejda det som hotar oss alla?',
"motvikten-15":'Hur vi ska bära svärdet utan att bli det drar isär oss. Den ena vill aldrig slå först — den som lyfter handen blir det den bekämpar. Den andra vill aldrig lämna den svage oskyddad, för en fred som låter förtryckaren härja är ingen fred. Krocken: hur håller vi ett värn starkt nog att skydda, utan att det blir det hot det byggdes emot?',
}
SEC=re.compile(r'<div class="section">\s*<div class="section-head"><span class="num">(\d+)</span><span class="concept">Var vi krockar</span><span class="tag">([^<]*)</span></div>\s*<div class="body">.*?</div>\s*</div>(?=\s*(?:<hr>|<div class="section">|<div class="extra-head">|<div class="future-box">))', re.S)

P=ROOT+"content/forklara-ai/manifest.js"
s=io.open(P,encoding="utf-8").read();PRE="window.LECTURE = "
i=s.index(PRE)+len(PRE);j=s.rfind(";");head,tail=s[:i],s[j:]
L=json.loads(s[i:j]);k={x["id"]:x for x in L["kort"]}
mega=io.open(ROOT+"motvikten.html",encoding="utf-8").read()
n=0
for kid,prose in K.items():
    f=k[kid]["fordjupning"]; m=SEC.search(f)
    assert m, "%s: ingen krockar-sektion"%kid
    num,tag=m.group(1),m.group(2); old=m.group(0)
    new='<div class="section">\n  <div class="section-head"><span class="num">%s</span><span class="concept">Var vi krockar</span><span class="tag">%s</span></div>\n  <div class="body">%s</div>\n</div>'%(num,tag,prose)
    k[kid]["fordjupning"]=f.replace(old,new,1)
    assert mega.count(old)==1, "mega %s: %d"%(kid,mega.count(old))
    mega=mega.replace(old,new,1); n+=1
out=head+json.dumps(L,ensure_ascii=False,indent=2)+tail
json.loads(out[out.index(PRE)+len(PRE):out.rfind(";")])
io.open(P,"w",encoding="utf-8").write(out)
io.open(ROOT+"motvikten.html","w",encoding="utf-8").write(mega)
print("Ett parti krockar omgjorda:",n)
print("KYR:",sum(1 for c in out if c in set('аеорсухіјѕАЕОРСТНКМВ')),"| motvikten em:",mega.count("<em>"),mega.count("</em>"))

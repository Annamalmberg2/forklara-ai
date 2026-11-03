#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""En Bibels 'Var vi krockar': tunna binärer -> steelmannad knivskarp prosa (verktyg + bok)."""
import json, re, io
ROOT="/Users/ainnova/Projects/forklara-ai/"
K={
"en-bibel-0":'Vad en sådan här bok ska göra med läsaren drar isär oss. Den ena vill ha färdiga svar att luta sig mot — i en förvirrad värld är en tydlig regel en gåva, inte en boja. Den andra vill ha pennan i handen och tänka själv, för varje svar någon annan gett dig är också en tanke du slutade tänka. Krocken: vill du ha en bok som talar om vad du ska tro, eller en som gör dig svårare att lura — också av sig själv?',
"en-bibel-1":'Vad kunskapen om kosmos gör med oss drar isär oss. Den ena känner att vetenskapen avförtrollar världen — en regnbåge blir tråkigare när man kan ekvationen. Den andra ser tvärtom: att förstå hur ljuset bryts stjäl inte undret, det fördjupar det (Feynmans blomma). Krocken: dödar förklaringen magin, eller är det bara den som aldrig lärt sig det svåra som tror att den gör det?',
"en-bibel-2":'Hur vi bär tiden och minnet drar isär oss. Den ena ser tiden som en pil framåt — framsteg, en väg som aldrig upprepas. Den andra ser kretsloppet, årstiderna, mönstren som återkommer generation efter generation. Krocken: går historien någonstans, eller vänder den ständigt tillbaka — och vad blir vi blinda för om vi bara ser det ena?',
"en-bibel-3":'Vad som gör oss starka och fria besvaras olika. Den ena vill laga det trasiga — hitta såret, förstå det, hela det. Den andra vill odla det friska — bygga på styrkorna i stället för att gräva i bristerna. Krocken: blir vi hela av att förstå vad som gick sönder, eller av att vattna det som ändå växer — och när behöver vi vilket?',
"en-bibel-4":'Hur vi når sanning när tanken kan bedra oss drar isär oss. Den ena litar på magkänslan — intuitionen är hopvikt erfarenhet, och den har ofta rätt fortare än förnuftet. Den andra misstänker den mest just när den känns som starkast, för det är där våra egna fördomar bor. Krocken: när ska du lita på det du känner, och när är själva känslan av visshet varningen?',
"en-bibel-5":'Hur vi förhåller oss till de stora frågorna drar isär oss. Den ena tror att livet har en färdig mening att upptäcka — den finns där, vi ska bara hitta den. Den andra menar att vi gör meningen själva, att den inte väntar utan skapas. Krocken: hittar vi meningen eller uppfinner vi den — och är en mening vi själva byggt värd mindre för det, eller kanske mer?',
"en-bibel-6":'Vad konst är, och vem den är till för, drar isär oss. Den ena mäter hantverket — vad handen faktiskt kan, skickligheten man ser. Den andra mäter avsikten — vad någon menade, känslan som bärs fram, också när tekniken är enkel. Krocken: sitter konsten i vad som gjordes, eller i vad det betyder — och vem får avgöra?',
"en-bibel-7":'Vad tekniken gör med människan drar isär oss. Den ena ser hur den förslöar — vi googlar i stället för att minnas, skrollar i stället för att tänka. Den andra ser hur samma verktyg skärper den nyfikne, som aldrig förr kunnat nå så mycket. Krocken: gör tekniken oss dummare eller klokare — eller beror allt på vanan vi möter den med?',
"en-bibel-8":'Hur vi fördelar världens värden drar isär oss djupt. Den ena ser marknaden som ett lysande fördelningsverktyg — inget har lyft fler ur fattigdom. Den andra ser den som ett uselt riktmärke för vad något faktiskt är värt — kärlek, natur och värdighet har inget pris. Krocken: var slutar det marknaden gör bäst, och var börjar det den aldrig borde få sätta pris på?',
"en-bibel-9":'Vad som händer när tillit byts mot transaktioner drar isär oss. Den ena väljer bekvämligheten — den snabba appen, den friktionsfria tjänsten, allt en knapptryckning bort. Den andra saknar värmen — den mänskliga knutpunkten, ansiktet som kände en. Krocken: vinner vi mer på smidigheten än vi förlorar i värme — och märker vi förlusten förrän den redan skett?',
"en-bibel-10":'Hur man ens ska tänka om lyckan drar isär oss. Den ena söker njutningens topp — glädjen i stunden, det som känns gott nu. Den andra söker det djupare livet, det som känns <em>rätt</em> även när det är svårt. Krocken: är lyckan en känsla att jaga eller ett liv att bygga — och kan man ha det ena helt utan det andra?',
}
SEC=re.compile(r'<div class="section">\s*<div class="section-head"><span class="num">(\d+)</span><span class="concept">Var vi krockar</span><span class="tag">([^<]*)</span></div>\s*<div class="body">.*?</div>\s*</div>(?=\s*(?:<hr>|<div class="section">|<div class="extra-head">|<div class="future-box">))', re.S)
def newsec(num,tag,prose):
    return '<div class="section">\n  <div class="section-head"><span class="num">%s</span><span class="concept">Var vi krockar</span><span class="tag">%s</span></div>\n  <div class="body">%s</div>\n</div>'%(num,tag,prose)

P=ROOT+"content/forklara-ai/manifest.js"; s=io.open(P,encoding="utf-8").read();PRE="window.LECTURE = "
i=s.index(PRE)+len(PRE);j=s.rfind(";");head,tail=s[:i],s[j:]
L=json.loads(s[i:j]);k={x["id"]:x for x in L["kort"]}
for kid,prose in K.items():
    f=k[kid]["fordjupning"]; m=SEC.search(f); assert m,"manifest %s"%kid
    k[kid]["fordjupning"]=f.replace(m.group(0), newsec(m.group(1),m.group(2),prose),1)
out=head+json.dumps(L,ensure_ascii=False,indent=2)+tail
json.loads(out[out.index(PRE)+len(PRE):out.rfind(";")]); io.open(P,"w",encoding="utf-8").write(out)

order=['en-bibel-%d'%n for n in range(1,11)]
book=io.open(ROOT+"en-bibel.html",encoding="utf-8").read(); it=iter(order)
book=SEC.sub(lambda m: newsec(m.group(1),m.group(2),K[next(it)]), book)
assert not list(it), "bok kvar"
io.open(ROOT+"en-bibel.html","w",encoding="utf-8").write(book)
print("En Bibel: manifest 11 + bok 10 klara")
print("tunna kvar:", sum(book.count(x) for x in ['Bud / kompass','Linjär / cyklisk','Marknad / moral','Hedonía / eudaimonía']))
print("KYR:",sum(1 for c in out if c in set('аеорсухіјѕАЕОРСТНКМВ')),"| bok em:",book.count("<em>"),book.count("</em>"))

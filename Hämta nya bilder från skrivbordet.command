#!/bin/bash
# Kopierar nya bilder från skrivbordsmappen "Förklara AI" in i verktyget.
# Inget skrivs över — bara bilder som saknas hämtas.
cd "$(dirname "$0")"
KALLA="$HOME/Desktop/Förklara AI"
MAL="content/forklara-ai/bilder"
antal=0
shopt -s nullglob
for f in "$KALLA"/*.{png,jpg,jpeg,PNG,JPG,JPEG} "$KALLA/950 Reserv"/*.{png,jpg,jpeg,PNG,JPG,JPEG}; do
  namn="$(basename "$f")"
  if [ ! -e "$MAL/$namn" ]; then
    cp "$f" "$MAL/"
    echo "+ $namn"
    antal=$((antal+1))
  fi
done
echo ""
if [ "$antal" -eq 0 ]; then
  echo "Inga nya bilder hittades — allt är redan hämtat."
else
  echo "$antal nya bilder hämtade."
  echo "Öppna verktyget → Redigera → '+ Nytt kort (välj bild)' för att lägga in dem i berättelsen."
fi
read -p "Tryck Enter för att stänga."

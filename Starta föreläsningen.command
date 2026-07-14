#!/bin/bash
# Startar Förklara AI: den lokala motorn + verktyget i webbläsaren.
#
# Stänger ALLTID en motor som redan kör innan den nya startar. Annars lever den
# gamla vidare med gammal kod, och nya funktioner syns inte — det såg ut som att
# omstarten inte gjorde något alls.
cd "$(dirname "$0")"

gammal=$(lsof -ti :8765 2>/dev/null)
if [ -n "$gammal" ]; then
  echo "Stänger motorn som redan kör …"
  kill $gammal 2>/dev/null
  sleep 1
  kill -9 $gammal 2>/dev/null
  sleep 1
fi

python3 server.py

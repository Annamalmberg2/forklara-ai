#!/bin/bash
# Har du flyttat kort mellan kapitel? Det här döper om bildfilerna
# så att nummer och namn följer berättelsens nya ordning.
cd "$(dirname "$0")"
python3 scripts/dop_om_foton.py
echo ""
read -p "Tryck Enter för att stänga."

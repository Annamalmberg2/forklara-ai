#!/bin/bash
# Publicerar dina senaste ändringar till webblänken.
cd "$(dirname "$0")"
git add -A
if git diff --cached --quiet; then
  echo "Inget nytt att publicera — allt är redan uppe."
else
  git commit -m "Uppdaterat innehåll $(date '+%Y-%m-%d %H:%M')"
  git push
  echo ""
  echo "✓ Publicerat! Länken uppdateras inom någon minut:"
  echo "  https://annamalmberg2.github.io/forklara-ai/"
fi
read -p "Tryck Enter för att stänga."

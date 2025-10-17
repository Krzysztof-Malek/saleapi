#!/usr/bin/env bash
set -euo pipefail

# === ŚCIEŻKI ===
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT="$SCRIPT_DIR"
FRONTEND_DIR="$ROOT/salesapi/frontend"
DIST_DIR="$FRONTEND_DIR/dist"
STATIC_DIR="$ROOT/salesapi/src/main/resources/static"

echo "→ Buduję frontend w: $FRONTEND_DIR"
cd "$FRONTEND_DIR"

# Instalacja zależności (preferuj 'ci', gdy jest package-lock.json)
if [ -f "package-lock.json" ]; then
  npm ci
else
  npm install
fi

npm run build

echo "→ Przygotowuję katalog statyczny backendu: $STATIC_DIR"
mkdir -p "$STATIC_DIR"

echo "→ Przerzucam pliki z '$DIST_DIR' do '$STATIC_DIR'..."
# Preferuj rsync (szybki i bezpieczny sync), w razie braku — użyj rm/cp
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$DIST_DIR"/ "$STATIC_DIR"/
else
  rm -rf "$STATIC_DIR"/*
  # Kopiowanie także ukrytych plików/katalogów (np. .well-known)
  cp -a "$DIST_DIR"/. "$STATIC_DIR"/
fi

echo "✅ Gotowe! Frontend zbudowany i skopiowany do: $STATIC_DIR"
echo "ℹ️ Teraz możesz uruchomić backend (w $ROOT/salesapi):"
echo "   mvn spring-boot:run    # albo ./gradlew bootRun – zależnie od builda"


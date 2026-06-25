#!/bin/bash
# Script om een backup te maken van een specifiek bestand voordat je het aanpast

if [ -z "$1" ]; then
  echo "Gebruik: $0 <pad-naar-bestand>"
  echo "Voorbeeld: $0 app/src/App.tsx"
  exit 1
fi

FILE="$1"
if [ ! -f "$FILE" ]; then
  echo "Fout: Bestand '$FILE' niet gevonden!"
  exit 1
fi

# Haal de bestandsnaam en extensie op
BASENAME=$(basename "$FILE")
EXTENSION="${BASENAME##*.}"
FILENAME="${BASENAME%.*}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Bepaal de archief map relatief aan dit script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
SESSIE_DIR="$(dirname "$DIR")"
ARCHIEF_DIR="$SESSIE_DIR/archief"

mkdir -p "$ARCHIEF_DIR"

# Maak de backup bestandsnaam, bijv: App_20260625_211500.tsx
BACKUP_NAME="${FILENAME}_${TIMESTAMP}.${EXTENSION}"
BACKUP_PATH="$ARCHIEF_DIR/$BACKUP_NAME"

cp "$FILE" "$BACKUP_PATH"

echo "✅ Backup van '$BASENAME' succesvol opgeslagen als:"
echo "   $BACKUP_PATH"

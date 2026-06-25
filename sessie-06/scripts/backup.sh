#!/bin/bash
# Script om een volledige backup van sessie-06 te maken in de archief map

# Huidige map is de root van het project (waar dit script wordt aangeroepen, of forceer naar sessie-06)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
SESSIE_DIR="$(dirname "$DIR")"
ARCHIEF_DIR="$SESSIE_DIR/archief"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$ARCHIEF_DIR/backup_${TIMESTAMP}.tar.gz"

echo "Maken van backup: $BACKUP_FILE ..."

# Maak de archiefmap aan als deze nog niet bestaat
mkdir -p "$ARCHIEF_DIR"

# Maak een tar.gz van de hele sessie-06 map, behalve node_modules, dist en archief zelf
tar -czvf "$BACKUP_FILE" \
    --exclude="node_modules" \
    --exclude="dist" \
    --exclude=".git" \
    --exclude="archief" \
    -C "$SESSIE_DIR" .

echo "✅ Backup succesvol aangemaakt in archief/backup_${TIMESTAMP}.tar.gz"

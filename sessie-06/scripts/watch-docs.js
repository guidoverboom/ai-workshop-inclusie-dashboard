const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const docsDir = path.join(__dirname, '../docs');
const backupScript = path.join(__dirname, 'backup-item.sh');

let debounceTimers = {};

console.log(`👀 Actief aan het letten op wijzigingen in: ${docsDir}`);
console.log(`Houd deze terminal open. Druk op Ctrl+C om te stoppen.\n`);

fs.watch(docsDir, (eventType, filename) => {
  if (!filename || !filename.endsWith('.md')) return;

  // Debounce (wacht 1 seconde) om te voorkomen dat 1x opslaan (Cmd+S) 
  // leidt tot 3 backups (VS Code schrijft soms bestanden in meerdere snelle stappen).
  if (debounceTimers[filename]) {
    clearTimeout(debounceTimers[filename]);
  }

  debounceTimers[filename] = setTimeout(() => {
    const filePath = path.join(docsDir, filename);
    
    // Zeker weten dat het bestand nog bestaat (bijv. niet verwijderd is)
    if (!fs.existsSync(filePath)) return;

    console.log(`\n✏️ Opgeslagen: ${filename} -> Maken van backup...`);
    exec(`"${backupScript}" "${filePath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Fout bij backup: ${err.message}`);
        return;
      }
      if (stderr) console.error(stderr);
      console.log(stdout.trim());
    });
  }, 1000);
});

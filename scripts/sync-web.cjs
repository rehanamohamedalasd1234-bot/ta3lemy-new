const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = path.join(root, 'www');
const excluded = new Set(['.git', 'android', 'www', 'node_modules', 'functions', 'scripts']);

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (excluded.has(entry.name) || entry.name === 'package-lock.json' || entry.name === 'package.json' || entry.name === 'capacitor.config.ts') continue;
  const source = path.join(root, entry.name);
  const destination = path.join(target, entry.name);
  fs.cpSync(source, destination, { recursive: true });
}

// Android opens the bundled site at the root of the WebView.
const manifestPath = path.join(target, 'manifest.json');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.start_url = './';
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
}

console.log(`Prepared ${target}`);

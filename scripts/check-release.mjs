import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const required = [
  'index.html', 'animaties.html', 'motorrit/index.html',
  'manifest.webmanifest', 'sw.js', 'traffic.php',
  'marsie/portret.png', 'marsie/icon-192.png', 'marsie/icon-512.png',
];
const scenes = ['zon', 'wandelen', 'regen', 'storm', 'kou', 'auto', 'motor', 'wijk-stormregen'];
for (const scene of scenes) {
  required.push('marsie/' + scene + '.webp', 'marsie/' + scene + '-stil.png');
}
for (const rel of required) {
  const p = path.join(root, rel);
  assert.ok(fs.existsSync(p), 'Ontbrekend bestand: ' + rel);
  assert.ok(fs.statSync(p).size > 0, 'Leeg bestand: ' + rel);
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(html, /Freaky Weer/);
assert.match(html, /marsie\/portret\.png/);
assert.match(html, /function renderTraffic\(/);
assert.match(html, /function render\(\)\{if\(!state\.weather\)\{if\(state\.tab==='verkeer'\)/,
  'Routeplanner moet toegankelijk blijven wanneer gewoon weer niet laadt.');
const gallery = fs.readFileSync(path.join(root, 'animaties.html'), 'utf8');
for (const scene of scenes) assert.ok(gallery.includes('marsie/' + scene + '.webp'), 'Ontbrekende galerijscene: ' + scene);
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
assert.ok(manifest.name || manifest.short_name, 'PWA-manifest mist naam');
for (const rel of ['index.html', 'animaties.html', 'motorrit/index.html']) {
  const source = fs.readFileSync(path.join(root, rel), 'utf8');
  const scripts = [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(m => m[1]).filter(Boolean);
  const { Script } = await import('node:vm');
  scripts.forEach((script, i) => new Script(script, { filename: rel + ':inline-script-' + i }));
}
console.log('Freaky Weer: ' + required.length + ' bestanden en JavaScript-syntax gecontroleerd.');

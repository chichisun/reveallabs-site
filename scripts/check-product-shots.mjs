/* check-product-shots.mjs — the hero's two product frames are real, sized, sourced, and clean.
 * PRODUCT-SHOTS-PLAN-2026-09-15.md step A item 4 (Codex PS-006/009/011).
 *
 *   npm run check:shots
 *
 * Asserts: both PNGs exist at the manifest's dimensions; the manifest names a real oxygen
 * commit (40 hex, and `git cat-file -e` when the oxygen checkout is on this machine); the
 * ring re-cut sits in Kase's ranges; both <Image>s in HomeV2.tsx carry alt text naming the
 * screen; and, when the local swap table is present, its real column has zero hits in the
 * manifest's saved phone text. The swap table is gitignored in oxygen; without it the privacy
 * scan cannot run and this check FAILS rather than passing quietly.
 */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'public/product');
let bad = 0;
const is = (c, w) => { console.log(`${c ? 'ok  ' : 'FAIL'}  ${w}`); if (!c) bad++; };

const png = (f) => { // IHDR: 8-byte signature, 4-byte length, "IHDR", width, height
  const b = readFileSync(f);
  if (b.readUInt32BE(12) !== 0x49484452) throw new Error(`${f} is not a PNG`);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};

const mPath = path.join(DIR, 'SHOT-MANIFEST.json');
is(existsSync(mPath), 'SHOT-MANIFEST.json exists');
if (!existsSync(mPath)) process.exit(1);
const M = JSON.parse(readFileSync(mPath, 'utf8'));

for (const key of ['desktop', 'live']) {
  const s = M[key];
  is(!!s, `manifest has the ${key} frame`);
  if (!s) continue;
  const f = path.join(DIR, s.file);
  is(existsSync(f), `${s.file} exists`);
  if (!existsSync(f)) continue;
  const { w, h } = png(f);
  is(w === s.width && h === s.height, `${s.file} is ${w}×${h} (manifest says ${s.width}×${s.height})`);
}

is(/^[0-9a-f]{40}$/.test(M.oxygenCommit || ''), `manifest names an oxygen commit: ${M.oxygenCommit}`);
if (M.oxygenRepo && existsSync(path.join(M.oxygenRepo, '.git'))) {
  let found = false;
  try { execFileSync('git', ['cat-file', '-e', `${M.oxygenCommit}^{commit}`], { cwd: M.oxygenRepo, stdio: 'ignore' }); found = true; } catch {}
  is(found, `that commit exists in ${M.oxygenRepo}`);
} else console.log('note  oxygen checkout not on this machine; commit existence not verified');

if (M.desktop?.recut) {
  const r = M.desktop.recut, R = { profitPct: [1, 9], foodPct: [28, 32], laborPct: [34, 38] };
  for (const [k, [lo, hi]] of Object.entries(R)) { const p = Math.round(r[k]); is(p >= lo && p <= hi, `${k} ${r[k].toFixed(2)} → ${p}% within ${lo}–${hi}`); }
  is(r.salesCents - r.expensesCents === r.profitCents, 'profit = sales − expenses');
}

const tsx = readFileSync(path.join(ROOT, 'src/components/home-v2/HomeV2.tsx'), 'utf8');
for (const [file, must] of [['ns-home-1440.png', /alt="Reveal's Home for Tuk Tuk Thai Grill, desktop[^"]*"/], ['live-home-390.png', /alt="Reveal's Home for Tuk Tuk Thai Grill on a phone[^"]*"/]]) {
  const i = tsx.indexOf(`/product/${file}`);
  is(i > 0 && must.test(tsx.slice(i, i + 400)), `HomeV2.tsx places ${file} with alt text naming the screen`);
}
is(!/dash-desk|className="kpi"|className="leak"/.test(tsx), 'the hand-drawn dashboard is gone from HomeV2.tsx');

if (M.live) {
  const swapPath = M.oxygenRepo ? path.join(M.oxygenRepo, 'dashboard/.product-shots-swap.json') : null;
  if (swapPath && existsSync(swapPath)) {
    const swap = JSON.parse(readFileSync(swapPath, 'utf8'));
    const text = M.live.text || '';
    const digits = (s) => s.replace(/[^0-9]/g, '');
    const hits = swap.rows.filter((r) => text.includes(r.real) || (digits(r.real).length >= 4 && digits(text).includes(digits(r.real))));
    is(hits.length === 0, `swap table's real column (${swap.rows.length} rows) has zero hits in the saved phone text${hits.length ? ': ' + hits.map((r) => r.fake).join(', ') : ''}`);
    is(M.live.swapVersion <= swap.version, `shot with swap table v${M.live.swapVersion}; the table is v${swap.version} now (it only grows, and the scan above ran on the current one)`);
  } else is(false, `swap table not found at ${swapPath}; privacy scan cannot run`);
  is(Array.isArray(M.live.assertions) && M.live.assertions.length >= 6, `phone shot passed ${M.live.assertions?.length ?? 0} fail-closed assertions`);
}

console.log(bad ? `\n${bad} FAIL` : '\nall green');
process.exit(bad ? 1 : 0);

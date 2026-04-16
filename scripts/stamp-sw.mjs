/**
 * Replaces __CACHE_VERSION__ in public/sw.js with a timestamp-based build ID.
 * Run before `next build` so every deploy gets a unique SW cache version,
 * causing browsers to evict stale assets automatically.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const swPath = join(__dirname, '..', 'public', 'sw.js');

const buildId = `v${Date.now()}`;
const original = readFileSync(swPath, 'utf8');
const stamped = original.replace(/__CACHE_VERSION__/g, buildId);
writeFileSync(swPath, stamped, 'utf8');

console.log(`[stamp-sw] Cache version set to: ${buildId}`);

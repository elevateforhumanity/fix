/**
 * Prune .next/standalone before the Netlify plugin copies it into the handler.
 * See inline comments for what is removed and why.
 */

import { rm, readdir } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

const STANDALONE_DIR = resolve('.next/standalone');

// IMPORTANT: Do NOT add @swc/helpers — Next.js loads it at runtime.
const PRUNE_PACKAGES = [
  '@next/swc-linux-x64-gnu', '@next/swc-linux-x64-musl',
  '@next/swc-darwin-x64', '@next/swc-darwin-arm64', '@next/swc-win32-x64-msvc',
  '@swc/core', '@swc/core-linux-x64-gnu', '@swc/core-linux-x64-musl',
  '@swc/core-darwin-x64', '@swc/core-darwin-arm64', '@swc/core-win32-x64-msvc',
  '@swc/counter', '@swc/types',
  '@esbuild', 'esbuild', 'webpack', 'webpack-sources',
  'googleapis', 'google-auth-library', 'google-gax',
  'tesseract.js', 'tesseract.js-core',
  'sharp', '@img', '@napi-rs',
  'canvas',
  'pdf-lib', '@pdf-lib', 'pdf-parse', 'pdfkit', 'pdfjs-dist', 'jspdf', 'jspdf-autotable', '@react-pdf',
  '@ffmpeg-installer', '@ffprobe-installer', 'fluent-ffmpeg',
  'puppeteer', 'puppeteer-core', 'playwright', 'playwright-core',
  'chromium-bidi', '@playwright', '@sparticuz', 'chrome-aws-lambda',
  'monaco-editor', 'node-pty',
  'video.js', 'hls.js',
  '@mediapipe',
  'three', 'three-stdlib', 'three-mesh-bvh', '@react-three',
  'lucide-react',
  'recharts', 'd3',
  'html2canvas',
  '@sentry/cli-linux-x64', '@sentry/cli',
  'typescript', 'core-js', 'prettier', 'tailwindcss', 'autoprefixer',
  'postcss', 'eslint', '@typescript-eslint', 'vitest', 'jest',
  'jsdom', 'happy-dom',
  'docx', 'mammoth', 'xlsx',
  'yjs', 'y-protocols', 'lib0',
  '@webcontainer',
  '@mailchimp', 'csv-parse', 'csv-stringify', 'sitemap', 'jszip',
  'fast-xml-parser', 'marked', 'cheerio', 'node-html-parser',
  'framer-motion', 'lottie-web', '@lottiefiles',
  'prismjs', 'highlight.js', 'shiki',
  'codemirror', '@codemirror', 'ace-builds', 'quill',
  '@tiptap', 'prosemirror-model', 'prosemirror-state', 'prosemirror-view',
  'es-toolkit', 'web-streams-polyfill',
];

// Verified safe via NFT trace analysis — none appear in any .nft.json.
// DO NOT add lms-content/ or lms-data/ — imported at runtime.
const PRUNE_SOURCE_DIRS = [
  'scripts', 'cloudflare-workers', 'fly-containers',
  'documents', 'outreach', 'tools', 'branding',
];

const PRUNE_ROOT_FILES = [
  'package-lock.json', 'stub-audit-report.json', 'tsconfig.json', 'components.json',
];

function matchesPruneList(entry) {
  return PRUNE_PACKAGES.some(pkg => {
    if (pkg.startsWith('@') && !pkg.includes('/')) {
      const ns = pkg.slice(1);
      return entry.startsWith('@' + ns + '+') || entry.startsWith('@' + ns + '@');
    }
    const pnpmPkg = pkg.startsWith('@') ? pkg.replace('/', '+') : pkg;
    return entry.startsWith(pnpmPkg + '@') || entry === pnpmPkg;
  });
}

async function pruneNodeModules(dir) {
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const pkg of PRUNE_PACKAGES) {
    const p = join(dir, pkg);
    if (existsSync(p)) { await rm(p, { recursive: true, force: true }); console.log(`  [prune] removed ${pkg}`); n++; }
  }
  return n;
}

async function prunePnpmStore(pnpmDir) {
  if (!existsSync(pnpmDir)) return 0;
  let n = 0;
  for (const entry of await readdir(pnpmDir)) {
    if (matchesPruneList(entry)) {
      await rm(join(pnpmDir, entry), { recursive: true, force: true });
      console.log(`  [prune] removed .pnpm/${entry}`);
      n++;
    }
  }
  return n;
}

async function main() {
  if (!existsSync(STANDALONE_DIR)) {
    console.log('[prune-standalone] .next/standalone not found — skipping'); return;
  }
  console.log('[prune-standalone] pruning .next/standalone...');

  // 1. Delete .nft.json trace manifests — 400+ MB, no runtime use
  const nft = parseInt(execSync(`find "${STANDALONE_DIR}" -name "*.nft.json" -type f -delete -print | wc -l`, { encoding: 'utf8' }).trim(), 10) || 0;
  console.log(`[prune-standalone] deleted ${nft} .nft.json files`);

  // 2. Delete public/ — Netlify copies it to CDN separately
  const pub = join(STANDALONE_DIR, 'public');
  if (existsSync(pub)) { await rm(pub, { recursive: true, force: true }); console.log('[prune-standalone] removed public/'); }

  // 3. Delete .js.map sourcemaps
  try {
    const maps = execSync(`find "${STANDALONE_DIR}" -name "*.js.map" -type f -delete -print | wc -l`, { encoding: 'utf8' }).trim();
    console.log(`[prune-standalone] deleted ${maps} .js.map files`);
  } catch { /* non-fatal */ }

  // 4. Delete source directories not needed at runtime
  for (const dir of PRUNE_SOURCE_DIRS) {
    const t = join(STANDALONE_DIR, dir);
    if (existsSync(t)) { await rm(t, { recursive: true, force: true }); console.log(`[prune-standalone] removed ${dir}/`); }
  }

  // 5. Delete non-essential root files
  for (const file of PRUNE_ROOT_FILES) {
    const t = join(STANDALONE_DIR, file);
    if (existsSync(t)) { await rm(t, { force: true }); console.log(`[prune-standalone] removed ${file}`); }
  }

  // 6. Prune heavy packages from node_modules
  const topNM = join(STANDALONE_DIR, 'node_modules');
  let total = await pruneNodeModules(topNM) + await prunePnpmStore(join(topNM, '.pnpm'));
  for (const entry of await readdir(STANDALONE_DIR).catch(() => [])) {
    if (entry === 'node_modules') continue;
    const nested = join(STANDALONE_DIR, entry, 'node_modules');
    if (existsSync(nested)) total += await pruneNodeModules(nested) + await prunePnpmStore(join(nested, '.pnpm'));
  }

  const mb = execSync(`find "${STANDALONE_DIR}" -type f | xargs du -b 2>/dev/null | awk '{sum+=$1} END {printf "%.0f", sum/1024/1024}'`, { encoding: 'utf8' }).trim();
  console.log(`[prune-standalone] done — removed ${total} packages, final size: ${mb} MB`);
}

main().catch(err => { console.error('[prune-standalone] error:', err.message); process.exit(0); });

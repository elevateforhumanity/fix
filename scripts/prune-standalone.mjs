/**
 * Prune heavy packages from .next/standalone after Next.js build.
 *
 * The Netlify plugin copies .next/standalone into the handler zip. If that
 * directory is too large the deploy OOMs or exceeds Lambda's 250 MB limit.
 * This script removes packages that are build-time only, browser-only, or
 * handled by separate Netlify functions — before the plugin runs.
 *
 * Runs as `postbuild` in package.json, after `next build`, before the
 * Netlify plugin's onBuild hook packages the handler.
 */

import { rm, readdir } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';

const STANDALONE_DIR = resolve('.next/standalone');

const PRUNE_PACKAGES = [
  // Next.js SWC compiler binaries (113 MB — build-time only, never needed at runtime)
  '@next/swc-linux-x64-gnu', '@next/swc-linux-x64-musl',
  '@next/swc-darwin-x64', '@next/swc-darwin-arm64', '@next/swc-win32-x64-msvc',
  // esbuild, webpack, swc — build-only
  '@esbuild', 'esbuild', 'webpack', 'webpack-sources', '@swc',
  // Google APIs (194 MB)
  'googleapis', 'google-auth-library', 'google-gax',
  // OCR (44 MB wasm)
  'tesseract.js', 'tesseract.js-core',
  // Sharp / image native binaries
  'sharp', '@img', '@napi-rs',
  // Canvas (24 MB native)
  'canvas',
  // PDF libraries
  'pdf-lib', '@pdf-lib', 'pdf-parse', 'pdfkit', 'pdfjs-dist', 'jspdf', 'jspdf-autotable', '@react-pdf',
  // FFmpeg binaries (66 MB + 76 MB)
  '@ffmpeg-installer', '@ffprobe-installer', 'fluent-ffmpeg',
  // Browser automation
  'puppeteer', 'puppeteer-core', 'playwright', 'playwright-core',
  'chromium-bidi', '@playwright', '@sparticuz', 'chrome-aws-lambda',
  // Editor / terminal (75 MB + 63 MB)
  'monaco-editor', 'node-pty',
  // Video / media (browser-only)
  'video.js', 'hls.js',
  // MediaPipe (20 MB, browser-only)
  '@mediapipe',
  // 3D (browser-only)
  'three', 'three-stdlib', '@react-three',
  // Icons (42 MB, browser-only)
  'lucide-react',
  // Charting (browser-only)
  'recharts', 'd3',
  // Screenshot (browser-only)
  'html2canvas',
  // Sentry CLI binary (21 MB)
  '@sentry/cli-linux-x64', '@sentry/cli',
  // Build / dev tools
  'typescript', 'core-js', 'prettier', 'tailwindcss', 'autoprefixer',
  'postcss', 'eslint', '@typescript-eslint', 'vitest', 'jest',
  // DOM / test
  'jsdom', 'happy-dom',
  // Document generation
  'docx', 'mammoth', 'xlsx',
  // Collaborative editing (browser-only)
  'yjs', 'y-protocols', 'lib0',
  // WebContainer (browser-only)
  '@webcontainer',
  // Misc
  '@mailchimp', 'csv-parse', 'csv-stringify', 'sitemap', 'jszip',
  'fast-xml-parser', 'marked', 'cheerio', 'node-html-parser',
  // Animation / editors (browser-only)
  'framer-motion', 'lottie-web', '@lottiefiles',
  'prismjs', 'highlight.js', 'shiki',
  'codemirror', '@codemirror', 'ace-builds', 'quill',
  '@tiptap', 'prosemirror-model', 'prosemirror-state', 'prosemirror-view',
  // es-toolkit (9.5 MB, not needed at runtime)
  'es-toolkit',
  // web-streams-polyfill (8.8 MB, Node has native streams)
  'web-streams-polyfill',
];

async function pruneNodeModules(nodeModulesDir) {
  if (!existsSync(nodeModulesDir)) return 0;
  let removed = 0;
  for (const pkg of PRUNE_PACKAGES) {
    const pkgPath = join(nodeModulesDir, pkg);
    if (existsSync(pkgPath)) {
      await rm(pkgPath, { recursive: true, force: true });
      console.log(`  [prune] removed ${pkg}`);
      removed++;
    }
  }
  return removed;
}

async function prunePnpmStore(pnpmDir) {
  if (!existsSync(pnpmDir)) return 0;
  let removed = 0;
  const entries = await readdir(pnpmDir);
  for (const entry of entries) {
    const matches = PRUNE_PACKAGES.some(pkg => {
      const pnpmPkg = pkg.startsWith('@')
        ? pkg.replace('/', '+')
        : pkg;
      return entry.startsWith(pnpmPkg + '@') || entry === pnpmPkg;
    });
    if (matches) {
      await rm(join(pnpmDir, entry), { recursive: true, force: true });
      console.log(`  [prune] removed .pnpm/${entry}`);
      removed++;
    }
  }
  return removed;
}

async function main() {
  if (!existsSync(STANDALONE_DIR)) {
    console.log('[prune-standalone] .next/standalone not found — skipping');
    return;
  }
  console.log('[prune-standalone] pruning heavy packages from .next/standalone...');

  const topNM = join(STANDALONE_DIR, 'node_modules');
  const r1 = await pruneNodeModules(topNM);
  const r2 = await prunePnpmStore(join(topNM, '.pnpm'));

  // Also check monorepo-style nested path
  const entries = await readdir(STANDALONE_DIR);
  let rNested = 0;
  for (const entry of entries) {
    if (entry === 'node_modules') continue;
    const nested = join(STANDALONE_DIR, entry, 'node_modules');
    if (existsSync(nested)) {
      rNested += await pruneNodeModules(nested);
      rNested += await prunePnpmStore(join(nested, '.pnpm'));
    }
  }

  console.log(`[prune-standalone] done — removed ${r1 + r2 + rNested} entries`);
}

main().catch(err => {
  // Never fail the build — a large bundle is better than a broken deploy
  console.error('[prune-standalone] error:', err.message);
  process.exit(0);
});

/**
 * Prune heavy packages from node_modules/.pnpm after next build.
 *
 * The Netlify plugin copies .next/standalone which contains symlinks into
 * node_modules/.pnpm/. When Netlify zips the handler it resolves those
 * symlinks, pulling in the full package content. This script deletes the
 * heavy packages from .pnpm so the zip stays under 250 MB.
 *
 * Runs after `next build` in the Netlify build command, before the plugin
 * copies the standalone directory.
 *
 * IMPORTANT: This only runs on Netlify (CI=true). Never runs locally.
 */

import { rm, readdir } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';

if (!process.env.CI && !process.env.NETLIFY) {
  console.log('[prune-node-modules] not on CI — skipping');
  process.exit(0);
}

const PNPM_DIR = resolve('node_modules/.pnpm');

const PRUNE_PACKAGES = [
  // Next.js SWC compiler binaries (113 MB — build-time only)
  '@next+swc-linux-x64-gnu', '@next+swc-linux-x64-musl',
  '@next+swc-darwin-x64', '@next+swc-darwin-arm64', '@next+swc-win32-x64-msvc',
  // esbuild, webpack, swc
  '@esbuild', 'esbuild', 'webpack', 'webpack-sources', '@swc+core-linux-x64-gnu',
  // Google APIs (194 MB)
  'googleapis', 'google-auth-library', 'google-gax',
  // OCR (44 MB wasm)
  'tesseract.js', 'tesseract.js-core',
  // Sharp / image
  'sharp', '@img', '@napi-rs+canvas-linux-x64-gnu', '@img+sharp-libvips-linux-x64',
  // Canvas (24 MB)
  'canvas',
  // PDF
  'pdf-lib', 'pdf-parse', 'pdfkit', 'pdfjs-dist', 'jspdf', 'jspdf-autotable', '@react-pdf+renderer',
  // FFmpeg (66 MB + 76 MB)
  '@ffmpeg-installer+linux-x64', '@ffprobe-installer+linux-x64', 'fluent-ffmpeg',
  // Browser automation
  'puppeteer', 'puppeteer-core', 'playwright', 'playwright-core',
  'chromium-bidi', '@playwright+test', '@sparticuz+chromium', 'chrome-aws-lambda',
  // Editor / terminal (75 MB + 63 MB)
  'monaco-editor', 'node-pty',
  // Video / media
  'video.js', 'hls.js',
  // MediaPipe (20 MB)
  '@mediapipe+tasks-vision',
  // 3D
  'three', 'three-stdlib', '@react-three+fiber', '@react-three+drei',
  // Icons (42 MB)
  'lucide-react',
  // Charting
  'recharts', 'd3',
  // Screenshot
  'html2canvas',
  // Sentry CLI (21 MB)
  '@sentry+cli-linux-x64', '@sentry+cli',
  // Build / dev tools
  'typescript', 'core-js', 'prettier', 'tailwindcss', 'autoprefixer',
  'postcss', 'eslint', '@typescript-eslint+eslint-plugin', '@typescript-eslint+parser',
  'vitest', 'jest',
  // DOM / test
  'jsdom', 'happy-dom',
  // Document generation
  'docx', 'mammoth', 'xlsx',
  // Collaborative editing
  'yjs', 'y-protocols', 'lib0',
  // WebContainer
  '@webcontainer+api',
  // Misc
  '@mailchimp+mailchimp_marketing', 'csv-parse', 'csv-stringify',
  'sitemap', 'jszip', 'fast-xml-parser', 'marked', 'cheerio', 'node-html-parser',
  // Animation / editors
  'framer-motion', 'lottie-web', 'prismjs', 'highlight.js', 'shiki',
  'codemirror', 'ace-builds', 'quill',
  // Large runtime deps not needed in SSR
  'es-toolkit', 'web-streams-polyfill',
];

async function main() {
  if (!existsSync(PNPM_DIR)) {
    console.log('[prune-node-modules] node_modules/.pnpm not found — skipping');
    return;
  }

  console.log('[prune-node-modules] pruning heavy packages from node_modules/.pnpm...');
  const entries = await readdir(PNPM_DIR);
  let removed = 0;

  for (const entry of entries) {
    const matches = PRUNE_PACKAGES.some(pkg => {
      // pnpm dir format: pkg@version or @scope+pkg@version
      return entry.startsWith(pkg + '@') || entry === pkg ||
             entry.startsWith(pkg.replace('@', '').replace('/', '+') + '@');
    });
    if (matches) {
      try {
        await rm(join(PNPM_DIR, entry), { recursive: true, force: true });
        console.log(`  removed .pnpm/${entry}`);
        removed++;
      } catch (err) {
        console.warn(`  failed to remove .pnpm/${entry}: ${err.message}`);
      }
    }
  }

  console.log(`[prune-node-modules] done — removed ${removed} entries`);
}

main().catch(err => {
  console.error('[prune-node-modules] error:', err.message);
  process.exit(0); // never fail the build
});

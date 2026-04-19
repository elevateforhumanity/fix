/**
 * Netlify build plugin: prune-handler
 *
 * Runs onPostBuild — after @netlify/plugin-nextjs onBuild has copied
 * .next/standalone into the handler directory, but before Netlify zips
 * and uploads the function.
 *
 * Removes heavy packages that are not needed at Lambda runtime.
 */

const { rm, readdir } = require('fs/promises');
const { join, resolve } = require('path');
const { existsSync, readdirSync, statSync } = require('fs');

const PRUNE_PACKAGES = [
  // Next.js build-time SWC binaries (~113 MB each)
  '@next/swc-linux-x64-gnu', '@next/swc-linux-x64-musl',
  '@next/swc-darwin-x64', '@next/swc-darwin-arm64', '@next/swc-win32-x64-msvc',
  // Build tools
  '@esbuild', 'esbuild', 'webpack', 'webpack-sources',
  // @swc/core and @swc/cli are build-only — @swc/helpers is required by Next.js at runtime, never prune it
  '@swc/core', '@swc/cli',
  'typescript', 'prettier', 'tailwindcss', 'autoprefixer', 'postcss',
  'eslint', '@typescript-eslint', 'turbopack', 'rollup', 'vite',
  // Test / dev
  'vitest', 'jest', '@jest', 'jsdom', 'happy-dom', '@storybook',
  // Google APIs (194 MB)
  'googleapis', 'google-auth-library',
  // OCR (44 MB wasm)
  'tesseract.js', 'tesseract.js-core',
  // Image / native binaries
  'sharp', '@img', '@napi-rs', 'canvas', '@napi-rs/canvas',
  // PDF
  'pdf-lib', 'pdf-parse', 'pdfkit', 'pdfjs-dist', 'jspdf', 'jspdf-autotable', '@react-pdf',
  // FFmpeg binaries
  '@ffmpeg-installer', '@ffprobe-installer', 'fluent-ffmpeg',
  // Browser automation
  'puppeteer', 'puppeteer-core', 'playwright', 'playwright-core',
  'chromium-bidi', '@playwright', '@sparticuz', 'chrome-aws-lambda',
  // Editor / terminal
  'monaco-editor', '@monaco-editor', 'node-pty',
  // Browser-only media / 3D
  'video.js', 'hls.js', '@mediapipe',
  'three', 'three-stdlib', '@react-three',
  // Browser-only UI
  'lucide-react', 'recharts', 'html2canvas', 'framer-motion',
  // Heavy SDKs (externalized — available in node_modules at runtime)
  'openai', 'stripe',
  '@aws-sdk', '@smithy',
  'ioredis', 'redis', '@upstash',
  '@sendgrid', 'nodemailer',
  'socket.io', 'socket.io-client', 'engine.io',
  // Observability — not needed in Lambda
  '@sentry', '@sentry/cli-linux-x64',
  '@opentelemetry',
  // Misc large packages
  'core-js', 'zod', 'date-fns', 'lodash', 'axios',
  'docx', 'mammoth',
  'yjs', 'y-protocols', 'lib0',
  '@webcontainer', '@mailchimp',
  'csv-parse', 'sitemap', 'jszip', 'fast-xml-parser', 'marked', 'cheerio',
];

async function pruneNodeModules(nodeModulesDir) {
  if (!existsSync(nodeModulesDir)) return 0;
  let removed = 0;
  for (const pkg of PRUNE_PACKAGES) {
    const pkgPath = join(nodeModulesDir, pkg);
    if (existsSync(pkgPath)) {
      await rm(pkgPath, { recursive: true, force: true });
      console.log(`  [prune-handler] removed ${pkg}`);
      removed++;
    }
  }
  // Also prune pnpm virtual store entries
  const pnpmDir = join(nodeModulesDir, '.pnpm');
  if (existsSync(pnpmDir)) {
    const entries = await readdir(pnpmDir);
    for (const entry of entries) {
      const matches = PRUNE_PACKAGES.some(pkg => {
        const pnpmPkg = pkg.startsWith('@') ? pkg.replace('/', '+') : pkg;
        return entry.startsWith(pnpmPkg + '@') || entry === pnpmPkg;
      });
      if (matches) {
        await rm(join(pnpmDir, entry), { recursive: true, force: true });
        console.log(`  [prune-handler] removed .pnpm/${entry}`);
        removed++;
      }
    }
  }
  return removed;
}

// Walk .netlify/ and prune every node_modules directory found
async function pruneAll(netlifyDir) {
  if (!existsSync(netlifyDir)) return 0;
  let total = 0;

  function findNodeModules(dir, depth = 0) {
    if (depth > 6) return [];
    const results = [];
    let entries;
    try { entries = readdirSync(dir); } catch { return results; }
    for (const entry of entries) {
      if (entry === 'node_modules') {
        results.push(join(dir, entry));
        continue; // don't recurse into node_modules itself
      }
      const full = join(dir, entry);
      try {
        if (statSync(full).isDirectory()) {
          results.push(...findNodeModules(full, depth + 1));
        }
      } catch {}
    }
    return results;
  }

  const nodeModulesDirs = findNodeModules(netlifyDir);
  console.log(`[prune-handler] found ${nodeModulesDirs.length} node_modules dirs under .netlify/`);
  for (const nm of nodeModulesDirs) {
    console.log(`[prune-handler] pruning ${nm}`);
    total += await pruneNodeModules(nm);
  }
  return total;
}

module.exports = {
  onPostBuild: async ({ constants }) => {
    const cwd = process.cwd();
    const netlifyDir = join(cwd, '.netlify');

    if (!existsSync(netlifyDir)) {
      console.log('[prune-handler] .netlify/ not found — skipping');
      return;
    }

    // Log the handler path for diagnosis
    const handlerPath = join(netlifyDir, 'functions-internal', '___netlify-server-handler');
    console.log(`[prune-handler] handler exists: ${existsSync(handlerPath)}`);
    console.log(`[prune-handler] handler path: ${handlerPath}`);

    const total = await pruneAll(netlifyDir);
    console.log(`[prune-handler] done — removed ${total} packages total`);
  },
};

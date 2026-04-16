/**
 * End-to-end admin test — logs in as testadmin and exercises every major
 * admin surface: dashboard, applications (list + review + status change),
 * program holders (list + detail + verification), and checks for marketing
 * chrome bleed on admin routes.
 */

import { chromium } from 'playwright';

const BASE = 'https://3000--019d8ed1-d172-7d34-b6f7-79996bb5b30c.us-east-1-01.gitpod.dev';
const EMAIL = 'testadmin@elevateforhumanity.org';
const PASSWORD = 'TestAdmin2026!';

const results = [];
function pass(name, detail = '') { results.push({ status: '✅', name, detail }); }
function fail(name, detail = '') { results.push({ status: '❌', name, detail }); }
function warn(name, detail = '') { results.push({ status: '⚠️ ', name, detail }); }

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await ctx.newPage();

  // Capture console errors
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push('PAGE ERROR: ' + err.message));

  try {
    // ── 1. LOGIN ──────────────────────────────────────────────────────
    console.log('\n── LOGIN ──');
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    // admin role lands on /my-dashboard per role-destinations.ts — that's correct
    await page.waitForURL(/\/(my-dashboard|admin|learner|dashboard)/, { timeout: 15000 });
    const postLoginUrl = page.url();
    console.log('  Landed on:', postLoginUrl);
    if (postLoginUrl.includes('/login') || postLoginUrl.includes('/unauthorized')) {
      fail('Login failed', postLoginUrl);
      await browser.close();
      return;
    }
    pass('Login succeeded', postLoginUrl);

    // ── 2. ADMIN DASHBOARD ────────────────────────────────────────────
    console.log('\n── ADMIN DASHBOARD ──');
    await page.goto(`${BASE}/admin/dashboard`, { waitUntil: 'networkidle', timeout: 20000 });
    const dashUrl = page.url();
    if (dashUrl.includes('/unauthorized') || dashUrl.includes('/login')) {
      fail('Admin dashboard access', `redirected to ${dashUrl}`);
    } else {
      pass('Admin dashboard access', dashUrl);
    }

    // Check for marketing header bleed
    const marketingHeader = await page.$('header[data-marketing-chrome], [data-marketing-chrome] header');
    const headerVisible = marketingHeader ? await marketingHeader.isVisible() : false;
    if (headerVisible) fail('No marketing header bleed on /admin/dashboard');
    else pass('No marketing header bleed on /admin/dashboard');

    const adminNav = await page.$('[data-admin-nav], nav.admin-nav, #admin-nav, [class*="AdminNav"]');
    if (adminNav) pass('Admin nav present');
    else warn('Admin nav', 'could not find admin nav element');

    // ── 3. APPLICATIONS LIST ──────────────────────────────────────────
    console.log('\n── APPLICATIONS ──');
    await page.goto(`${BASE}/admin/applications`, { waitUntil: 'networkidle', timeout: 20000 });
    const appsUrl = page.url();
    if (appsUrl.includes('/unauthorized') || appsUrl.includes('/login')) {
      fail('Applications list access', `redirected to ${appsUrl}`);
    } else {
      pass('Applications list access');
    }

    // Check for marketing bleed
    const appsHeaderVisible = await page.evaluate(() => {
      const chrome = document.querySelectorAll('[data-marketing-chrome]');
      return Array.from(chrome).some(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none';
      });
    });
    if (appsHeaderVisible) fail('No marketing chrome bleed on /admin/applications');
    else pass('No marketing chrome bleed on /admin/applications');

    // Check table renders
    const tableRows = await page.$$('tbody tr');
    console.log(`  Application rows: ${tableRows.length}`);
    if (tableRows.length > 0) pass('Applications table has rows', `${tableRows.length} rows`);
    else warn('Applications table', 'no rows — DB may be empty');

    // ── 4. APPLICATION REVIEW PAGE ────────────────────────────────────
    console.log('\n── APPLICATION REVIEW ──');
    // Get first application link
    const firstViewLink = await page.$('a[href*="/admin/applications/review/"]');
    if (firstViewLink) {
      const href = await firstViewLink.getAttribute('href');
      await page.goto(`${BASE}${href}`, { waitUntil: 'networkidle', timeout: 20000 });
      const reviewUrl = page.url();
      if (reviewUrl.includes('/unauthorized') || reviewUrl.includes('/login')) {
        fail('Application review page', `redirected to ${reviewUrl}`);
      } else {
        pass('Application review page loads', reviewUrl);

        // Check actions panel renders
        const actionsPanel = await page.$('button:has-text("Approve"), button:has-text("Reject"), button:has-text("Start Review")');
        if (actionsPanel) pass('Application action buttons present');
        else warn('Application action buttons', 'not found — may be terminal status');

        // Check no marketing chrome
        const reviewHeaderVisible = await page.evaluate(() => {
          const chrome = document.querySelectorAll('[data-marketing-chrome]');
          return Array.from(chrome).some(el => window.getComputedStyle(el).display !== 'none');
        });
        if (reviewHeaderVisible) fail('No marketing chrome bleed on review page');
        else pass('No marketing chrome bleed on review page');
      }
    } else {
      warn('Application review page', 'no review links found in table');
    }

    // ── 5. STATUS CHANGE (in_review) ──────────────────────────────────
    console.log('\n── STATUS CHANGE API ──');
    // Find a pending/submitted app and try to move it to in_review via the inline button
    await page.goto(`${BASE}/admin/applications?status=submitted`, { waitUntil: 'networkidle', timeout: 20000 });
    const reviewBtn = await page.$('button:has-text("Review")');
    if (reviewBtn) {
      await reviewBtn.click();
      await page.waitForTimeout(2000);
      const errText = await page.$('text=/error|failed|forbidden/i');
      if (errText) fail('Inline status → in_review', await errText.textContent());
      else pass('Inline status → in_review succeeded');
    } else {
      warn('Inline status change', 'no submitted apps with Review button found');
    }

    // ── 6. PROGRAM HOLDERS LIST ───────────────────────────────────────
    console.log('\n── PROGRAM HOLDERS ──');
    await page.goto(`${BASE}/admin/program-holders`, { waitUntil: 'networkidle', timeout: 20000 });
    const phUrl = page.url();
    if (phUrl.includes('/unauthorized') || phUrl.includes('/login')) {
      fail('Program holders list access', `redirected to ${phUrl}`);
    } else {
      pass('Program holders list access');
    }

    const phRows = await page.$$('tbody tr');
    console.log(`  Program holder rows: ${phRows.length}`);
    if (phRows.length > 0) pass('Program holders table has rows', `${phRows.length} rows`);
    else warn('Program holders table', 'no rows — DB may be empty');

    // ── 7. PROGRAM HOLDER DETAIL ──────────────────────────────────────
    console.log('\n── PROGRAM HOLDER DETAIL ──');
    const firstHolderLink = await page.$('a[href*="/admin/program-holders/"]:not([href*="verification"])');
    if (firstHolderLink) {
      const href = await firstHolderLink.getAttribute('href');
      if (href && !href.endsWith('/program-holders/')) {
        await page.goto(`${BASE}${href}`, { waitUntil: 'networkidle', timeout: 20000 });
        const detailUrl = page.url();
        if (detailUrl.includes('/unauthorized') || detailUrl.includes('/login')) {
          fail('Program holder detail', `redirected to ${detailUrl}`);
        } else {
          pass('Program holder detail loads', detailUrl);
        }
      }
    } else {
      warn('Program holder detail', 'no holder links found');
    }

    // ── 8. VERIFICATION QUEUE ─────────────────────────────────────────
    console.log('\n── VERIFICATION QUEUE ──');
    await page.goto(`${BASE}/admin/program-holders/verification`, { waitUntil: 'networkidle', timeout: 20000 });
    const verUrl = page.url();
    if (verUrl.includes('/unauthorized') || verUrl.includes('/login')) {
      fail('Verification queue access', `redirected to ${verUrl}`);
    } else {
      pass('Verification queue access');
    }

    // ── 9. TRANSITION API ─────────────────────────────────────────────
    console.log('\n── TRANSITION API ──');
    const cookies = await ctx.cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    const transResp = await page.evaluate(async ({ base, cookie }) => {
      const r = await fetch(`${base}/api/admin/applications/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ application_id: '00000000-0000-0000-0000-000000000001', next_status: 'in_review' }),
      });
      return { status: r.status, body: await r.json() };
    }, { base: BASE, cookie: cookieHeader });
    console.log('  Transition API response:', transResp.status, JSON.stringify(transResp.body));
    if (transResp.status === 401 || transResp.status === 403) {
      fail('Transition API auth', `got ${transResp.status} — session not passing through`);
    } else if (transResp.status === 404 || transResp.body?.error?.includes('not found')) {
      pass('Transition API auth works', '404 = auth passed, app not found (expected)');
    } else if (transResp.status === 422) {
      pass('Transition API auth works', '422 = auth passed, invalid transition (expected)');
    } else {
      warn('Transition API', `status ${transResp.status}: ${JSON.stringify(transResp.body)}`);
    }

    // ── 10. PATCH APPLICATION API ─────────────────────────────────────
    console.log('\n── PATCH APPLICATION API ──');
    const patchResp = await page.evaluate(async (base) => {
      const r = await fetch(`${base}/api/admin/applications/00000000-0000-0000-0000-000000000001`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'in_review' }),
      });
      return { status: r.status, body: await r.json() };
    }, BASE);
    console.log('  PATCH API response:', patchResp.status, JSON.stringify(patchResp.body));
    if (patchResp.status === 401 || patchResp.status === 403) {
      fail('PATCH application API auth', `got ${patchResp.status}`);
    } else if (patchResp.status === 404) {
      pass('PATCH application API auth works', '404 = auth passed, app not found (expected)');
    } else {
      warn('PATCH application API', `status ${patchResp.status}`);
    }

    // ── 10b. DIAGNOSE 403 ─────────────────────────────────────────────
    console.log('\n── COOKIE DIAGNOSIS ──');
    const allCookies = await ctx.cookies(BASE);
    const authCookies = allCookies.filter(c => c.name.includes('auth') || c.name.includes('sb-'));
    console.log('  Auth cookies present:', authCookies.map(c => c.name));
    if (authCookies.length === 0) fail('No auth cookies found — session not persisted');
    else pass('Auth cookies present', authCookies.map(c => c.name).join(', '));

    // ── 11. CONSOLE ERRORS ────────────────────────────────────────────
    console.log('\n── CONSOLE ERRORS ──');
    if (consoleErrors.length === 0) {
      pass('No browser console errors');
    } else {
      const filtered = consoleErrors.filter(e =>
        !e.includes('favicon') && !e.includes('404') && !e.includes('net::ERR')
      );
      if (filtered.length === 0) warn('Console errors', 'only minor 404/network errors');
      else fail('Console errors', filtered.slice(0, 3).join(' | '));
    }

  } catch (err) {
    fail('Test runner', err.message);
  } finally {
    await browser.close();
  }

  // ── SUMMARY ───────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('RESULTS');
  console.log('═'.repeat(60));
  results.forEach(r => console.log(`${r.status} ${r.name}${r.detail ? ' — ' + r.detail : ''}`));
  const passed = results.filter(r => r.status === '✅').length;
  const failed = results.filter(r => r.status === '❌').length;
  const warned = results.filter(r => r.status.includes('⚠')).length;
  console.log('═'.repeat(60));
  console.log(`${passed} passed  ${failed} failed  ${warned} warnings`);
  if (failed > 0) process.exit(1);
}

run().catch(err => { console.error(err); process.exit(1); });

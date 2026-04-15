#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ELEVATE FOR HUMANITY — COURSE VIDEO GENERATOR  (Golden Standard)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * GOLDEN MODEL: Barber Apprenticeship Program
 * ─────────────────────────────────────────────
 * Course ID:    3fb5ce19-1cde-434c-a8c6-f138d7d7aa17
 * Table:        course_lessons
 * order_index:  module * 1000 + position  (e.g. Module 2 Lesson 3 = 2003)
 * 69 lessons across 8 modules
 * Output:       public/videos/barber-lessons/<slug>.mp4
 *               → uploaded to Supabase course-videos bucket → CDN URL in DB
 *
 * HOW IT WORKS
 * ─────────────
 * 1. Pull lesson rows from course_lessons for a given course
 * 2. Split each lesson's markdown content into scenes by ## headings
 * 3. Per scene: pickClip() matches heading + body text to a b-roll clip key
 *    - Tries heading first, falls back to body text
 *    - Generic headings ("Introduction", "Summary") get matched by body content
 * 4. Per scene: TTS narration via OpenAI gpt-4o-mini-tts (voice: onyx)
 *    - Persona: Brandon Williams, master barber instructor, Indianapolis IN
 * 5. Per scene: trim b-roll clip to exact audio duration
 *    - clipOffsets ensures consecutive scenes using same clip never repeat footage
 * 6. Concat all scenes → 1280x720 / 24fps / AAC 192k / +faststart MP4
 * 7. Upload to Supabase course-videos bucket → write CDN URL to DB
 *
 * B-ROLL LIBRARY
 * ───────────────
 * public/videos/broll/<key>.mp4 — 39 barber-specific clips, 75-190s each
 * Built by: pnpm tsx scripts/fetch-broll-clips.ts
 * Sources:  Pexels (primary) + Pixabay (fallback), both filtered to barber content
 *
 * ADDING A NEW COURSE
 * ────────────────────
 * 1. Add entry to COURSES map below
 * 2. Add new b-roll topics to fetch-broll-clips.ts if needed, re-run it
 * 3. Add keyword rules to matchText() for new subject areas
 * 4. Run: pnpm tsx scripts/generate-course-videos.ts --course <key>
 * 5. Run: pnpm tsx scripts/upload-videos-to-supabase.ts
 *
 * USAGE
 * ──────
 * pnpm tsx scripts/generate-course-videos.ts --course barber
 * pnpm tsx scripts/generate-course-videos.ts --course barber --module 1
 * pnpm tsx scripts/generate-course-videos.ts --course barber --slug barber-lesson-1
 * pnpm tsx scripts/generate-course-videos.ts --course barber --force
 * pnpm tsx scripts/generate-course-videos.ts --course barber --dry-run
 * pnpm tsx scripts/generate-course-videos.ts --course barber --module 1 --chapter
 *
 * REQUIREMENTS
 * ─────────────
 * OPENAI_API_KEY                  TTS generation
 * NEXT_PUBLIC_SUPABASE_URL        DB read/write
 * SUPABASE_SERVICE_ROLE_KEY       DB read/write
 * ffmpeg + ffprobe                Video assembly
 * public/videos/broll/*.mp4       B-roll library (run fetch-broll-clips.ts first)
 */

import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env.local') });

import fs from 'fs';
import os from 'os';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';

// ─── Supabase ─────────────────────────────────────────────────────────────────

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Course registry ──────────────────────────────────────────────────────────

interface CourseConfig {
  id: string;
  label: string;
  table: 'course_lessons' | 'curriculum_lessons';
  idColumn: string;
  orderColumn: string;
  outDir: string;
  storageBucket: string;
  storagePrefix: string;
}

const COURSES: Record<string, CourseConfig> = {
  // ── GOLDEN MODEL ──────────────────────────────────────────────────────────
  barber: {
    id:            '3fb5ce19-1cde-434c-a8c6-f138d7d7aa17',
    label:         'Barber Apprenticeship',
    table:         'course_lessons',
    idColumn:      'course_id',
    orderColumn:   'order_index',
    outDir:        path.join(process.cwd(), 'public/videos/barber-lessons'),
    storageBucket: 'course-videos',
    storagePrefix: 'barber',
  },
  // ── ADD NEW COURSES HERE ──────────────────────────────────────────────────
  // hvac: {
  //   id:            '<course_id>',
  //   label:         'HVAC EPA 608',
  //   table:         'curriculum_lessons',
  //   idColumn:      'course_id',
  //   orderColumn:   'module_order',
  //   outDir:        path.join(process.cwd(), 'public/videos/hvac-lessons'),
  //   storageBucket: 'course-videos',
  //   storagePrefix: 'hvac',
  // },
};

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const COURSE_KEY    = getArg('--course') ?? 'barber';
const SLUG_FILTER   = getArg('--slug');
const MODULE_FILTER = getArg('--module') ? parseInt(getArg('--module')!) : null;
const FORCE         = args.includes('--force');
const DRY_RUN       = args.includes('--dry-run');
const CHAPTER_MODE  = args.includes('--chapter');
const UPLOAD        = args.includes('--upload');  // upload to Supabase after generating

// ─── B-roll library ───────────────────────────────────────────────────────────

const BROLL = path.join(process.cwd(), 'public/videos/broll');
const clip  = (key: string) => path.join(BROLL, `${key}.mp4`);

/**
 * matchText — keyword rules for scene → b-roll clip matching.
 * Runs against heading text first, then body text as fallback.
 * Rules ordered most-specific first.
 * Add new rules here when adding new course subject areas.
 */
function matchText(t: string): string | null {
  // ── Program operations ──
  if (/logging hours|clocking in|clock out|timesheet|ojt hours|recording hours/.test(t))  return clip('logging-hours-timesheet');
  if (/dol apprenticeship|apprenticeship structure|apprentice|rapids/.test(t))             return clip('apprentice-training');
  if (/2000.hour|licensure|license requirement/.test(t))                                   return clip('barber-license-exam');
  if (/indiana.*law|ipla|license renewal|continuing education|scope of practice/.test(t)) return clip('indiana-license-renewal');
  if (/state board exam|exam preparation|board prep|written exam/.test(t))                return clip('state-board-exam-prep');

  // ── Sanitation & safety ──
  if (/disinfecting clipper|clipper disinfect|clipper spray|contact time/.test(t))         return clip('disinfecting-clippers');
  if (/disinfecting scissor|cleaning scissor/.test(t))                                     return clip('disinfecting-scissors');
  if (/washing hands|hand hygiene|handwash/.test(t))                                       return clip('washing-hands-barber');
  if (/cleaning station|reset.*station|station between|sanitizing.*station/.test(t))      return clip('cleaning-barber-station');
  if (/neck strip|cape|draping/.test(t))                                                   return clip('neck-strip-cape');
  if (/single.use|dispos.*item|sharps|porous item/.test(t))                               return clip('disposing-single-use');
  if (/blood exposure|bloodborne|blood protocol/.test(t))                                  return clip('blood-exposure-protocol');
  if (/\bosha\b|hazcom|hazard communication/.test(t))                                      return clip('osha-barbershop');
  if (/\bppe\b|personal protective equipment/.test(t))                                     return clip('ppe-barber');
  if (/chemical handling|safe chemical|chemical procedure/.test(t))                       return clip('chemical-handling');
  if (/patch test/.test(t))                                                                return clip('patch-test');
  if (/safety data sheet|\bsds\b/.test(t))                                                return clip('sds-safety-data-sheet');
  if (/\bsteriliz|\binfection control|pre.service clean|barbicide/.test(t))               return clip('disinfecting-clippers');
  if (/\bdisinfect|\bsanit/.test(t))                                                      return clip('disinfecting-clippers');

  // ── Chemistry ──
  if (/ph scale|hair chemistry|chemical.*hair|hair.*chemical/.test(t))                    return clip('ph-scale-hair');
  if (/relaxer|texturiz|permanent wave|chemical texture/.test(t))                         return clip('relaxer-texturizer');
  if (/hair color|haircolor|\btint\b|\bbleach\b|highlight/.test(t))                       return clip('hair-color-chemical');

  // ── Life skills & professionalism ──
  if (/smart goal|goal setting|career goal/.test(t))                                      return clip('smart-goals-planning');
  if (/time management|scheduling|busy barbershop/.test(t))                               return clip('time-management-barber');
  if (/\bethic|\bobligation\b|\bintegrity\b/.test(t))                                     return clip('ethics-professional');
  if (/professional image|personal hygiene|hygiene.*barber/.test(t))                      return clip('professional-appearance');
  if (/first impression/.test(t))                                                         return clip('first-impression-barber');
  if (/client trust|client retention|loyal client/.test(t))                               return clip('client-retention');
  if (/ergonomic|posture|standing.*barber/.test(t))                                       return clip('ergonomics-posture');
  if (/burnout|wellness|self.care|physical demand/.test(t))                               return clip('burnout-wellness');

  // ── Client services ──
  if (/consultation|managing.*expectation|client.*expectation/.test(t))                   return clip('client-consultation');
  if (/complaint|client concern|conflict resolution/.test(t))                             return clip('handling-complaints');
  if (/long.term.*client|client relationship|building.*client/.test(t))                   return clip('client-retention');

  // ── Technical skills ──
  if (/straight razor|\bshav|\bhot towel|\blather\b/.test(t))                             return clip('barber-shaving');
  if (/\bbeard\b|mustache|facial hair/.test(t))                                           return clip('barber-beard-trim');
  if (/shampoo|scalp massage|scalp treatment|hair wash/.test(t))                          return clip('barber-shampoo');
  if (/\bstyling\b|\bpomade\b|product application/.test(t))                              return clip('barber-styling');
  if (/\blineup\b|\bedge up\b|hairline detail/.test(t))                                  return clip('barber-lineup');
  if (/\bfade\b|\btaper\b|\bblend\b/.test(t))                                            return clip('barber-cutting-hair');
  if (/\bscissor\b|\bshear\b|cutting technique/.test(t))                                 return clip('barber-cutting-hair');
  if (/\bclipper\b|\btrimmer\b|tool maintenance/.test(t))                                return clip('barber-cutting-hair');
  if (/hair.*cut|cut.*hair|haircut/.test(t))                                             return clip('barber-cutting-hair');

  return null;
}

/**
 * pickClip — heading first, body fallback, barbershop-intro default.
 * Never returns a missing file — falls back gracefully.
 */
function pickClip(heading: string, body: string): string {
  const result = matchText(heading.toLowerCase())
              ?? matchText(body.toLowerCase())
              ?? clip('barbershop-intro');
  return fs.existsSync(result) ? result : clip('barbershop-intro');
}

// ─── Scene splitting ──────────────────────────────────────────────────────────

interface Scene { heading: string; body: string; }

/**
 * splitIntoScenes — splits markdown content into narration scenes.
 * Each ## heading = one scene. Short scenes (<25 words) merge into previous.
 * Always appends a closing summary scene.
 */
function splitIntoScenes(title: string, moduleName: string, content: string): Scene[] {
  const raw: Scene[] = [];
  let heading = `Introduction to ${title}`;
  let lines: string[] = [`Welcome to this lesson on ${title}, part of ${moduleName}.`];

  const flush = () => {
    const body = lines.join(' ').replace(/\s+/g, ' ').trim();
    if (body) raw.push({ heading, body });
    lines = [];
  };

  for (const line of content.split('\n')) {
    const h = line.match(/^#{1,3}\s+(.+)/);
    if (h) { flush(); heading = h[1].replace(/\*\*/g, '').trim(); }
    else {
      const clean = line.replace(/^[\s]*[-*+]\s+/, '').replace(/^[\s]*\d+\.\s+/, '').replace(/\*\*/g, '').trim();
      if (clean) lines.push(clean);
    }
  }
  flush();

  raw.push({
    heading: 'Summary',
    body: `That covers everything for this lesson on ${title}. Complete the quiz and review your flashcards before moving on.`,
  });

  // Merge scenes under 25 words into previous
  const merged: Scene[] = [];
  for (const s of raw) {
    if (s.body.split(/\s+/).length < 25 && merged.length > 0) {
      merged[merged.length - 1].body += ' ' + s.body;
    } else {
      merged.push({ ...s });
    }
  }
  return merged;
}

// ─── TTS ──────────────────────────────────────────────────────────────────────

/**
 * generateTTS — Brandon Williams persona, voice: onyx.
 * Consistent across every lesson in the barber program.
 * Sounds like a master barber teaching on the shop floor, not reading a textbook.
 */
async function generateTTS(text: string, outPath: string): Promise<void> {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      input: text,
      voice: 'onyx',
      instructions: `You are Brandon Williams, a master barber with 12 years of experience teaching at a DOL-registered barbering apprenticeship program in Indianapolis, Indiana.
Speak directly to your apprentices — confident, clear, and practical.
Steady professional pace. Emphasize key terms when you say them.
Natural pauses between paragraphs. Sound like you are in the shop teaching, not reading from a textbook.
Never rush. Never sound robotic.`,
      response_format: 'mp3',
      speed: 1.0,
    }),
  });
  if (!res.ok) throw new Error(`TTS failed (${res.status}): ${await res.text()}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
}

// ─── Video assembly ───────────────────────────────────────────────────────────

// Tracks position in each b-roll clip across scenes — no repeated footage
const clipOffsets = new Map<string, number>();

function getFileDur(f: string): number {
  return parseFloat(
    execSync(`ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${f}"`, { encoding: 'utf8' }).trim()
  );
}

/**
 * buildScene — trims b-roll to exact audio duration, 1280x720/24fps.
 * Advances clipOffsets so next scene using same clip picks up where this left off.
 */
function buildScene(clipPath: string, audioPath: string, outPath: string): void {
  const audioDur = getFileDur(audioPath);
  const clipDur  = getFileDur(clipPath);
  const offset   = clipOffsets.get(clipPath) ?? 0;
  const startAt  = (offset + audioDur <= clipDur) ? offset : 0;

  execSync(
    `ffmpeg -y -ss ${startAt.toFixed(3)} -i "${clipPath}" -i "${audioPath}" ` +
    `-map 0:v -map 1:a -t ${audioDur.toFixed(3)} ` +
    `-vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black,setsar=1,fps=24" ` +
    `-c:v libx264 -preset fast -crf 20 -c:a aac -b:a 192k -movflags +faststart "${outPath}"`,
    { stdio: 'pipe', maxBuffer: 200 * 1024 * 1024 }
  );
  clipOffsets.set(clipPath, startAt + audioDur);
}

function concatScenes(scenePaths: string[], outPath: string, tmpDir: string): void {
  const list = path.join(tmpDir, 'scenes.txt');
  fs.writeFileSync(list, scenePaths.map(p => `file '${p}'`).join('\n'));
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${list}" -c copy -movflags +faststart "${outPath}"`,
    { stdio: 'pipe', maxBuffer: 500 * 1024 * 1024 }
  );
}

// ─── Supabase upload ──────────────────────────────────────────────────────────

async function uploadToSupabase(localPath: string, course: CourseConfig, slug: string): Promise<string> {
  const file = fs.readFileSync(localPath);
  const storagePath = `${course.storagePrefix}/${slug}.mp4`;
  const { error } = await sb.storage.from(course.storageBucket).upload(storagePath, file, { contentType: 'video/mp4', upsert: true });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = sb.storage.from(course.storageBucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const course = COURSES[COURSE_KEY];
  if (!course) {
    console.error(`Unknown course: "${COURSE_KEY}". Available: ${Object.keys(COURSES).join(', ')}`);
    process.exit(1);
  }

  fs.mkdirSync(course.outDir, { recursive: true });

  const { data: lessons, error } = await sb
    .from(course.table)
    .select(`id, title, slug, content, ${course.orderColumn}`)
    .eq(course.idColumn, course.id)
    .order(course.orderColumn);

  if (error) { console.error('DB error:', error.message); process.exit(1); }
  if (!lessons?.length) { console.error('No lessons found'); process.exit(1); }

  let targets = lessons as any[];
  if (SLUG_FILTER)   targets = targets.filter(l => l.slug === SLUG_FILTER);
  if (MODULE_FILTER) targets = targets.filter(l => Math.floor(l[course.orderColumn] / 1000) === MODULE_FILTER);
  if (!targets.length) { console.error('No lessons matched filters'); process.exit(1); }

  console.log(`\n═══ ${course.label} — ${targets.length} lesson(s) ═══\n`);

  let ok = 0, skipped = 0, failed = 0;

  for (let i = 0; i < targets.length; i++) {
    const lesson = targets[i];
    const modNum  = Math.floor(lesson[course.orderColumn] / 1000);
    const outPath = path.join(course.outDir, `${lesson.slug}.mp4`);
    const prefix  = `[${i + 1}/${targets.length}] ${lesson.slug}`;

    if (!FORCE && fs.existsSync(outPath) && getFileDur(outPath) > 60) {
      console.log(`  SKIP  ${prefix}`); skipped++; continue;
    }

    if (!lesson.content || lesson.content.length < 50) {
      console.log(`  ❌    ${prefix} — no content`); failed++; continue;
    }

    const scenes = splitIntoScenes(lesson.title, `${course.label} Module ${modNum}`, lesson.content);

    if (DRY_RUN) {
      console.log(`  DRY   ${prefix} — ${scenes.length} scenes`);
      scenes.forEach((s, si) => console.log(`         ${si + 1}. "${s.heading}" → ${path.basename(pickClip(s.heading, s.body), '.mp4')}`));
      continue;
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `elevate-${lesson.slug}-`));

    try {
      console.log(`\n  GEN   ${prefix} — ${scenes.length} scenes`);
      const scenePaths: string[] = [];

      for (let si = 0; si < scenes.length; si++) {
        const scene     = scenes[si];
        const clipPath  = pickClip(scene.heading, scene.body);
        const audioPath = path.join(tmpDir, `s${si}.mp3`);
        const scenePath = path.join(tmpDir, `s${si}.mp4`);
        const words     = scene.body.split(/\s+/).length;

        process.stdout.write(`        scene ${si + 1}/${scenes.length} [${path.basename(clipPath, '.mp4')}] "${scene.heading}" (${words}w)...`);
        await generateTTS(scene.body, audioPath);
        const dur = getFileDur(audioPath);
        buildScene(clipPath, audioPath, scenePath);
        process.stdout.write(` ${Math.round(dur)}s ✓\n`);
        scenePaths.push(scenePath);
        try { fs.unlinkSync(audioPath); } catch {}
      }

      process.stdout.write(`        concat ${scenePaths.length} scenes...`);
      concatScenes(scenePaths, outPath, tmpDir);
      const finalDur = getFileDur(outPath);
      process.stdout.write(` ${Math.round(finalDur)}s ✅\n`);
      fs.rmSync(tmpDir, { recursive: true, force: true });

      // Upload to Supabase CDN if --upload flag set
      let videoUrl = `/videos/${path.basename(course.outDir)}/${lesson.slug}.mp4`;
      if (UPLOAD) {
        process.stdout.write(`        uploading to CDN...`);
        videoUrl = await uploadToSupabase(outPath, course, lesson.slug);
        process.stdout.write(` ✅\n`);
      }

      const { error: upErr } = await sb.from(course.table).update({ video_url: videoUrl }).eq('id', lesson.id);
      if (upErr) process.stdout.write(`        ⚠️  DB: ${upErr.message}\n`);
      else       process.stdout.write(`        DB ✅\n`);

      ok++;
    } catch (err: any) {
      console.error(`  ❌    ${prefix} — ${err.message}`);
      try { fs.unlinkSync(outPath); } catch {}
      fs.rmSync(tmpDir, { recursive: true, force: true });
      failed++;
    }
  }

  console.log(`\n═══ Done: ${ok} generated, ${skipped} skipped, ${failed} failed ═══\n`);

  // Chapter mode — concat all module lessons into one file
  if (CHAPTER_MODE && MODULE_FILTER) {
    const chapterPath = path.join(course.outDir, `module-${MODULE_FILTER}-chapter.mp4`);
    const files = targets.map(l => path.join(course.outDir, `${l.slug}.mp4`)).filter(f => fs.existsSync(f));
    if (files.length) {
      const tmpList = path.join(os.tmpdir(), `chapter-${MODULE_FILTER}.txt`);
      const rawPath = path.join(os.tmpdir(), `chapter-${MODULE_FILTER}-raw.mp4`);
      fs.writeFileSync(tmpList, files.map(f => `file '${f}'`).join('\n'));
      execSync(`ffmpeg -y -f concat -safe 0 -i "${tmpList}" -c copy "${rawPath}"`, { stdio: 'pipe', maxBuffer: 2000 * 1024 * 1024 });
      execSync(`ffmpeg -y -i "${rawPath}" -c copy -movflags +faststart "${chapterPath}"`, { stdio: 'pipe', maxBuffer: 2000 * 1024 * 1024 });
      try { fs.unlinkSync(rawPath); fs.unlinkSync(tmpList); } catch {}
      const dur = getFileDur(chapterPath);
      console.log(`Chapter: ${Math.floor(dur / 60)}m ${Math.round(dur % 60)}s → ${chapterPath}\n`);
    }
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });

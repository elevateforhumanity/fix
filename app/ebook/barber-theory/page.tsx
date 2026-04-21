export const revalidate = 86400;

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Indiana Barber Theory Ebook | Elevate for Humanity',
  description: 'Complete barber theory study guide for the Indiana State Board exam. 8 chapters covering infection control, hair science, tools, haircutting, shaving, chemical services, professional skills, and exam prep.',
};

const CHAPTERS = [
  { id: 'infection-control',     n: 1, title: 'Infection Control & Safety',        lessons: 6,  color: 'bg-red-600',     topics: ['Sanitation standards', 'Disinfection protocols', 'OSHA compliance', 'Bloodborne pathogens', 'Workplace safety', 'Client consultation'] },
  { id: 'hair-science',          n: 2, title: 'Hair Science & Scalp Analysis',      lessons: 6,  color: 'bg-amber-600',   topics: ['Hair structure', 'Growth cycle', 'Texture & porosity', 'Scalp disorders', 'Shampoo & massage'] },
  { id: 'tools-equipment',       n: 3, title: 'Tools, Equipment & Ergonomics',      lessons: 6,  color: 'bg-orange-600',  topics: ['Clippers & guards', 'Scissors & shears', 'Straight razor', 'Blade maintenance', 'Ergonomics', 'Draping'] },
  { id: 'haircutting',           n: 4, title: 'Haircutting Techniques',             lessons: 6,  color: 'bg-slate-700',   topics: ['Head shape & sections', 'Low/mid/high fade', 'Clipper over comb', 'Scissor over comb', 'Lineup & edging', 'Classic cuts'] },
  { id: 'shaving-beard',         n: 5, title: 'Shaving & Beard Services',           lessons: 5,  color: 'bg-stone-700',   topics: ['Hot towel prep', 'Straight razor technique', 'Beard design', 'Post-shave care', 'Mustache styling'] },
  { id: 'chemical-services',     n: 6, title: 'Chemical Services',                  lessons: 4,  color: 'bg-violet-700',  topics: ['Color theory', 'Chemical safety & patch test', 'Relaxers & texturizers', 'Scalp treatments'] },
  { id: 'professional-skills',   n: 7, title: 'Professional & Business Skills',     lessons: 5,  color: 'bg-brand-blue-700', topics: ['Building clientele', 'Booth rental vs commission', 'Pricing & finances', 'Professionalism', 'Styling products'] },
  { id: 'state-board-prep',      n: 8, title: 'State Board Exam Preparation',       lessons: 4,  color: 'bg-brand-green-700', topics: ['Indiana exam overview', 'Sanitation & science review', 'Techniques & laws review', 'Practical exam prep'] },
];

export default function BarberEbookCover() {
  return (
    <div className="min-h-screen bg-slate-50 print:bg-white">

      {/* Print button */}
      <div className="print:hidden flex justify-end px-6 pt-6">
        <button
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          Print / Save PDF
        </button>
      </div>

      {/* Cover */}
      <div className="max-w-4xl mx-auto px-6 py-12 print:py-0">

        {/* Cover page */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden mb-12 print:rounded-none print:mb-0 print:min-h-screen print:flex print:flex-col print:justify-between">
          <div className="p-10 md:p-16">
            {/* Logo / brand */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">E</span>
              </div>
              <span className="text-white/70 text-sm font-semibold tracking-widest uppercase">Elevate for Humanity</span>
            </div>

            {/* Title block */}
            <div className="mb-12">
              <p className="text-orange-400 text-sm font-bold tracking-widest uppercase mb-4">Indiana DOL Registered Apprenticeship</p>
              <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
                Barber Theory<br />
                <span className="text-orange-400">Ebook</span>
              </h1>
              <p className="text-slate-300 text-xl max-w-lg leading-relaxed">
                Complete theory study guide for the Indiana State Board exam. 8 chapters · 50 lessons · 200+ practice questions.
              </p>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-4 border-t border-white/10 pt-8">
              <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
                <Image
                  src="/images/team/instructors/instructor-barber.jpg"
                  alt="Brandon Williams"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <p className="text-white font-bold">Brandon Williams</p>
                <p className="text-slate-400 text-sm">Master Barber · 12 years experience</p>
                <p className="text-slate-400 text-sm">Indiana Licensed Barber Instructor</p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="bg-orange-500 px-10 md:px-16 py-4 flex items-center justify-between">
            <span className="text-white text-sm font-semibold">Indiana Barber License Prep</span>
            <span className="text-white/80 text-sm">elevateforhumanity.org</span>
          </div>
        </div>

        {/* How to use this ebook */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-12 print:break-before-page">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use This Ebook</h2>
          <div className="grid md:grid-cols-2 gap-6 text-slate-700">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">For Digital Study</h3>
              <ul className="space-y-2 text-sm leading-relaxed">
                <li>• Read each chapter in order — content builds on itself</li>
                <li>• Use the chapter quiz at the end of each section to test retention</li>
                <li>• Watch the linked lesson videos in the LMS for visual demonstrations</li>
                <li>• State Board Focus boxes highlight what Indiana actually tests</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-2">For Print / PDF</h3>
              <ul className="space-y-2 text-sm leading-relaxed">
                <li>• Print individual chapters or the full ebook</li>
                <li>• Fill in the blanks and answer review questions by hand</li>
                <li>• Use the Key Terms boxes as flashcard source material</li>
                <li>• Bring to your shop — review between clients</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-sm text-orange-900">
              <strong>Indiana State Board:</strong> The written exam requires a <strong>75% passing score</strong>. Every chapter in this ebook maps directly to the Indiana State Board exam content outline. "State Board Focus" callouts mark the highest-priority topics.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="print:break-before-page">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Table of Contents</h2>
          <p className="text-slate-500 mb-8">8 chapters · 42 lessons · 7 module checkpoints · 1 final exam</p>

          <div className="space-y-3">
            {CHAPTERS.map(ch => (
              <Link
                key={ch.id}
                href={`/ebook/barber-theory/${ch.id}`}
                className="group flex items-start gap-5 bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all p-5"
              >
                {/* Chapter number */}
                <div className={`${ch.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-black text-lg">{ch.n}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-orange-700 transition-colors">{ch.title}</h3>
                    <span className="text-xs text-slate-400 flex-shrink-0">{ch.lessons} lessons</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ch.topics.map(t => (
                      <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page { margin: 0.75in; size: letter; }
          body { font-size: 11pt; }
          a { color: inherit; text-decoration: none; }
        }
      `}</style>
    </div>
  );
}

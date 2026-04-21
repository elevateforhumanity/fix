'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Share2, Users, Heart, Mail, MessageCircle, Copy, CheckCircle, Instagram, Play } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const SHARE_URL = 'https://www.elevateforhumanity.org/programs';

const SHARE_OPTIONS = [
  {
    title: 'Refer a Friend or Family Member',
    desc: 'Know someone looking for career training? Many programs are available at no cost through WIOA and DOL funding.',
    icon: Users,
    href: '/enroll',
    cta: 'Send to Enrollment',
  },
  {
    title: 'Share with a Case Manager',
    desc: 'If you work with a workforce agency, WorkOne office, or reentry program, share our training catalog with your clients.',
    icon: MessageCircle,
    href: '/partners/join',
    cta: 'Partner With Us',
  },
  {
    title: 'Email Our Programs Page',
    desc: 'Send a direct link so someone can browse available training options.',
    icon: Mail,
    href: `mailto:?subject=Check out Elevate for Humanity&body=I thought you might be interested in career training programs: ${SHARE_URL}`,
    cta: 'Send via Email',
  },
];

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    handle: '@elevateforhumanity',
    href: 'https://www.instagram.com/elevateforhumanity',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
  },
  {
    name: 'TikTok',
    handle: '@elevateforhumanity',
    href: 'https://www.tiktok.com/@elevateforhumanity',
    color: 'bg-gray-900',
  },
  {
    name: 'Facebook',
    handle: 'Elevate for Humanity',
    href: 'https://www.facebook.com/elevateforhumanity',
    color: 'bg-blue-600',
  },
];

export default function SharePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SHARE_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: 'Share' }]} />
      </div>

      {/* Hero */}
      <section className="relative w-full">
        <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
          <Image
            src="/images/pages/share-page-1.jpg"
            alt="Share Elevate for Humanity"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-slate-900/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Share Elevate</h1>
            <p className="text-lg text-slate-200 max-w-xl">
              Help someone access career training and change their life.
            </p>
          </div>
        </div>
      </section>

      {/* Quick copy */}
      <section className="bg-slate-50 border-b py-6 px-4">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <span className="text-slate-700 text-sm flex-1 truncate font-mono bg-white border rounded-lg px-4 py-2.5">
            {SHARE_URL}
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition shrink-0"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </section>

      {/* Share options */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Ways to Share</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {SHARE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <div key={opt.title} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
                  <Icon className="w-9 h-9 text-brand-blue-600 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{opt.title}</h3>
                  <p className="text-slate-600 text-sm mb-6 flex-1">{opt.desc}</p>
                  <Link
                    href={opt.href}
                    className="bg-brand-blue-600 text-white text-center px-4 py-3 rounded-lg font-semibold hover:bg-brand-blue-700 transition text-sm"
                  >
                    {opt.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Follow on social + link to reels */}
      <section className="bg-slate-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2">Follow &amp; Share on Social</h2>
          <p className="text-slate-400 mb-8">
            Share our posts, tag a friend, or repost a reel — every share reaches someone who may need it.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${s.color} rounded-xl p-5 flex flex-col gap-1 hover:opacity-90 transition`}
              >
                <span className="text-white font-bold">{s.name}</span>
                <span className="text-white/70 text-sm">{s.handle}</span>
              </a>
            ))}
          </div>
          <Link
            href="/reels"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-blue-600 px-6 py-3 text-white font-semibold hover:bg-brand-blue-700 transition"
          >
            <Play className="w-4 h-4" /> Watch Our Reels
          </Link>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <Heart className="w-10 h-10 text-brand-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Referral Matters</h2>
          <p className="text-slate-600 text-lg">
            Many of our students found us through someone who cared enough to share. A single referral can lead to a career, a certification, and a better future for an entire family.
          </p>
        </div>
      </section>
    </div>
  );
}

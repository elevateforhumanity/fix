'use client';

import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import CanonicalVideo from '@/components/video/CanonicalVideo';

const POSTER = '/images/pages/workone-partner-packet-page-1.jpg';
const VIDEO_SRC = '/videos/partner-join-narrated.mp4';

export default function WorkOneHeroVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);

  function toggleMute() {
    const video = wrapperRef.current?.querySelector('video');
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted && video.paused) video.play().catch(() => {});
    setMuted(video.muted);
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden bg-slate-900"
      style={{ minHeight: 'clamp(480px, 60vw, 680px)' }}
    >
      <CanonicalVideo
        src={VIDEO_SRC}
        poster={POSTER}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlayOnMount
        loop
      />

      {/* Gradient scrim — bottom-heavy so overlay text is readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 pointer-events-none" />

      {/* Text overlay anchored to bottom */}
      <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 pb-12 pt-20">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-brand-green-600/90 rounded-full text-xs font-bold text-white uppercase tracking-wide">
            Registered Apprenticeship Sponsor
          </span>
          <span className="px-3 py-1 bg-brand-blue-600/90 rounded-full text-xs font-bold text-white uppercase tracking-wide">
            ETPL Approved
          </span>
          <span className="px-3 py-1 bg-brand-blue-600/90 rounded-full text-xs font-bold text-white uppercase tracking-wide">
            WIOA · WRG Eligible
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight drop-shadow-md">
          WorkOne Partner Packet
        </h1>
        <p className="text-lg text-white/90 max-w-3xl leading-relaxed drop-shadow">
          Everything WorkOne regions need to refer participants to our ETPL-approved
          training programs and registered apprenticeships. We handle enrollment,
          training delivery, and outcome reporting with full transparency.
        </p>
      </div>

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors backdrop-blur-sm border border-white/20"
      >
        {muted ? (
          <>
            <VolumeX className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Tap to hear</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 flex-shrink-0 text-brand-red-400" />
            <span className="hidden sm:inline">Mute</span>
          </>
        )}
      </button>
    </div>
  );
}

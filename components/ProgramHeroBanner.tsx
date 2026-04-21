'use client';

import CanonicalVideo from '@/components/video/CanonicalVideo';

// Poster images keyed by video src — avoids the generic og-default.jpg flash.
// Add entries here when new program videos are introduced.
const POSTER_BY_VIDEO: Record<string, string> = {
  '/videos/electrician-trades.mp4':   '/hero-images/skilled-trades-cat-new.jpg',
  '/videos/welding-trades.mp4':       '/hero-images/skilled-trades-cat-new.jpg',
  '/videos/hvac-technician.mp4':      '/hero-images/skilled-trades-cat-new.jpg',
  '/videos/hvac-hero-final.mp4':      '/hero-images/skilled-trades-cat-new.jpg',
  '/videos/it-technology.mp4':        '/hero-images/technology-cat-new.jpg',
  '/videos/healthcare-cna.mp4':       '/hero-images/healthcare-cat-new.jpg',
  '/videos/cna-hero.mp4':             '/hero-images/healthcare-cat-new.jpg',
  '/videos/program-hero.mp4':         '/hero-images/healthcare-cat-new.jpg',
  '/videos/cosmetology-salon.mp4':    '/hero-images/barber-beauty-cat-new.jpg',
  '/videos/beauty-cosmetology.mp4':   '/hero-images/barber-beauty-cat-new.jpg',
  '/videos/barber-hero-final.mp4':    '/hero-images/barber-hero.jpg',
  '/videos/business-finance.mp4':     '/hero-images/business-hero.jpg',
  '/videos/cdl-hero.mp4':             '/hero-images/cdl-transportation-category.jpg',
};

interface ProgramHeroBannerProps {
  videoSrc: string;
  posterImage?: string;
  title?: string;
  voiceoverSrc?: string;
}

export default function ProgramHeroBanner({ videoSrc, posterImage }: ProgramHeroBannerProps) {
  // Explicit prop wins; fall back to the video-keyed map; last resort: category image
  const poster = posterImage ?? POSTER_BY_VIDEO[videoSrc] ?? '/hero-images/skilled-trades-cat-new.jpg';

  return (
    <div className="relative w-full overflow-hidden bg-slate-900" style={{ height: 'clamp(340px, 48vw, 620px)' }}>
      <CanonicalVideo
        src={videoSrc}
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover object-center"
        autoPlayOnMount
        loop
        preloadFull
      />
    </div>
  );
}

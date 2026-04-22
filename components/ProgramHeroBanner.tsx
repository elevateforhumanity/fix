'use client';

import CanonicalVideo from '@/components/video/CanonicalVideo';
import heroBanners from '@/content/heroBanners';

interface ProgramHeroBannerProps {
  videoSrc: string;
  /** Explicit poster image. If omitted, falls back to heroBanners[pageKey].posterImage. */
  posterImage?: string;
  /** heroBanners pageKey — used to look up the correct poster when posterImage is not passed. */
  pageKey?: string;
  title?: string;
  voiceoverSrc?: string;
}

export default function ProgramHeroBanner({
  videoSrc,
  posterImage,
  pageKey,
  voiceoverSrc,
}: ProgramHeroBannerProps) {
  // Resolve poster: explicit prop → heroBanners lookup → generic fallback
  const resolvedPoster =
    posterImage ??
    (pageKey ? heroBanners[pageKey]?.posterImage : undefined) ??
    '/hero-images/pathways-hero.jpg';

  return (
    <div className="relative w-full" style={{ height: 'clamp(320px, 45vw, 560px)' }}>
      <CanonicalVideo
        src={videoSrc}
        poster={resolvedPoster}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlayOnMount
        playThrough
      />
    </div>
  );
}

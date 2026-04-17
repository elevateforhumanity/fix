'use client';

import CanonicalVideo from '@/components/video/CanonicalVideo';

export default function ProgramsHeroVideo() {
  return (
    <CanonicalVideo
      src="https://pub-23811be4d3844e45a8bc2d3dc5e7aaec.r2.dev/videos/hero-home-fast.mp4"
      className="absolute inset-0 w-full h-full object-cover"
      autoPlayOnMount
      preloadFull
      playThrough={false}
    />
  );
}

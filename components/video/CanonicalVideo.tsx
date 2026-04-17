'use client';

/**
 * CanonicalVideo — the only component allowed to render a background video.
 *
 * - No poster. Video fades in from transparent when first frame is ready.
 * - autoPlayOnMount=true  → preload="auto", sources in initial HTML (hero use)
 * - autoPlayOnMount=false → preload="none", sources deferred post-mount (below fold)
 * - Respects prefers-reduced-motion (renders nothing).
 * - On error renders nothing.
 */

import { useEffect, useRef, useState } from 'react';

type Props = {
  src: string;
  srcMobile?: string;
  className?: string;
  threshold?: number;
  playThrough?: boolean;
  autoPlayOnMount?: boolean;
};

export default function CanonicalVideo({
  src,
  srcMobile,
  className = '',
  threshold = 0.1,
  playThrough = true,
  autoPlayOnMount = false,
}: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    setLoaded(true);
    if (!autoPlayOnMount || reducedMotion || failed) return;
    const video = ref.current;
    if (!video) return;
    if (video.readyState >= 2) {
      video.play().catch(() => {});
    } else {
      const onReady = () => { video.play().catch(() => {}); };
      video.addEventListener('canplay', onReady, { once: true });
      return () => video.removeEventListener('canplay', onReady);
    }
  }, [autoPlayOnMount, reducedMotion, failed]);

  useEffect(() => {
    if (autoPlayOnMount || reducedMotion || failed) return;
    const video = ref.current;
    if (!video) return;
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        video.play().catch(() => {});
        if (playThrough) observer.disconnect();
      } else if (!entry.isIntersecting && !playThrough) {
        video.pause();
        started = false;
      }
    }, { threshold });
    observer.observe(video);
    return () => observer.disconnect();
  }, [autoPlayOnMount, reducedMotion, failed, threshold, playThrough]);

  if (reducedMotion || failed) return null;

  return (
    <video
      ref={ref}
      className={`${className} transition-opacity duration-700 ${playing ? 'opacity-100' : 'opacity-0'}`}
      muted
      playsInline
      preload={autoPlayOnMount ? 'auto' : 'none'}
      aria-hidden="true"
      onCanPlay={() => setPlaying(true)}
      onError={() => setFailed(true)}
    >
      {autoPlayOnMount ? (
        <>
          {srcMobile && <source src={srcMobile} type="video/mp4" media="(max-width: 767px)" />}
          <source src={src} type="video/mp4" />
        </>
      ) : (
        <>
          {loaded && srcMobile && <source src={srcMobile} type="video/mp4" media="(max-width: 767px)" />}
          {loaded && <source src={src} type="video/mp4" />}
        </>
      )}
    </video>
  );
}

'use client';
import VideoHeroBanner from '@/components/ui/VideoHeroBanner';
import { VIDEO_HEROES } from '@/lib/hero-config';

export default function MissionHeroVideo() {
  return <VideoHeroBanner videoSrc={VIDEO_HEROES.homepage} posterSrc="/images/pages/mission-video-poster.jpg" posterAlt="Our mission" />;
}

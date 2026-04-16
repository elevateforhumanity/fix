import type { Metadata } from 'next';
import { getProgramsByCategory } from '@/lib/lms/api';
import HealthcarePageClient from './HealthcarePageClient';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Healthcare Programs | Elevate for Humanity',
  description: 'Start your healthcare career with free, WIOA-funded training. CNA, Phlebotomy, Medical Assistant, and more for eligible Indiana residents.',
};

export default async function HealthcareProgramsPage() {
  const programs = await getProgramsByCategory('healthcare');
  return <HealthcarePageClient programs={programs} />;
}

export const revalidate = 86400;

import { Metadata } from 'next';
import { ProgramStructuredData } from '@/components/seo/CourseStructuredData';
import ProgramDetailPage from '@/components/programs/ProgramDetailPage';
import { TAX_PREPARATION } from '@/data/programs/tax-preparation';
import { validateProgram } from '@/lib/programs/program-schema';

const p = TAX_PREPARATION;

const errors = validateProgram(p);
if (errors.length > 0) {
  throw new Error(
    `Tax Preparation program schema validation failed:\n${errors.map((e) => `  ${e.field}: ${e.message}`).join('\n')}`
  );
}

export const metadata: Metadata = {
  title: p.metaTitle,
  description: p.metaDescription,
  alternates: { canonical: '/programs/tax-preparation' },
};

export default function TaxPreparationPage() {
  return (
    <>
      <ProgramStructuredData
        program={{
          id: p.slug,
          title: p.title,
          description: p.metaDescription ?? p.subtitle,
          image_url: p.heroImage,
          duration_weeks: p.durationWeeks,
          price: 0,
          category: p.category,
        }}
      />
      <ProgramDetailPage program={p} />
    </>
  );
}

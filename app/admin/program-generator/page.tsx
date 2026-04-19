import { Metadata } from 'next';
import { requireRole } from '@/lib/auth/require-role';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import Image from 'next/image';
import Link from 'next/link';
import { AutoProgramGenerator } from '@/components/admin/AutoProgramGenerator';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Program Generator | Elevate For Humanity',
  description: 'AI-powered program structure generation.',
};

export default async function ProgramGeneratorPage() {
  await requireRole(['admin', 'super_admin']);

  return (
    <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Program Generator" }]} />
        </div>
      {/* Hero Section */}
      <section className="relative h-48 md:h-64 overflow-hidden">
        <Image
          src="/images/pages/admin-program-gen-detail.jpg"
          alt="Program Generator"
          fill
          className="object-cover"
          quality={100}
          priority
          sizes="100vw"
        />

      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <AutoProgramGenerator />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-blue-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Program Generator
                        </h2>
            <p className="text-base md:text-lg text-brand-blue-100 mb-8">
              Auto-generate program structures from templates and requirements.
                        </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/admin/program-generator"
                className="bg-white text-brand-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 text-lg"
              >
                Generate Program
              </Link>
              <Link
                href="/admin/programs"
                className="bg-brand-blue-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-brand-blue-600 border-2 border-white text-lg"
              >
                View Programs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

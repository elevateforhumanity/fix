import Link from 'next/link';
import SupersonicPageHero from '@/components/supersonic/SupersonicPageHero';

export const metadata = {
  title: 'Smart Document Upload | Supersonic Fast Cash',
};

export default function SmartUploadPage() {
  return (
    <>
      <SupersonicPageHero
        image="/images/supersonic-page-7.jpg"
        alt="Securely upload your tax documents"
        title="Smart Document Upload"
        subtitle="Securely upload your tax documents to your preparer — from any device."
      />

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600 leading-relaxed mb-5">
            Our secure document upload system lets you send your tax documents directly to your preparer
            without visiting an office. All files are encrypted in transit and at rest.
          </p>
          <ol className="space-y-4">
            {[
              'Gather your documents — W-2s, 1099s, last year\'s return, and any other income records',
              'Scan or photograph each document clearly (PDFs and JPGs accepted)',
              'Use the upload portal below to send files directly to your preparer',
              'Your preparer will confirm receipt and contact you with any questions',
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-red-600 text-white font-black text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-slate-600 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What to Upload</h2>
          <ul className="space-y-2 text-slate-600">
            {[
              'W-2 forms from all employers',
              '1099 forms (1099-NEC, 1099-MISC, 1099-INT, 1099-DIV)',
              'Last year\'s tax return (if available)',
              'Social Security cards or ITIN letters for all household members',
              'Government-issued photo ID',
              'Records of deductible expenses (if itemizing)',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-red-500 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
          <p className="text-slate-600 mb-4">
            Ready to upload your documents? Head to the secure upload portal to get started.
          </p>
          <Link
            href="/supersonic-fast-cash/upload-documents"
            className="inline-block bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors"
          >
            Go to Document Upload Portal
          </Link>
        </div>
      </div>
    </>
  );
}

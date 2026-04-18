import Link from 'next/link';
import { FileText, DollarSign, Monitor, Shield, BookOpen, Users } from 'lucide-react';
import SupersonicPageHero from '@/components/supersonic/SupersonicPageHero';

const services = [
  {
    icon: FileText,
    title: 'Tax Preparation',
    description: 'PTIN-certified preparers handle every return type — W-2, 1099, self-employed, and more.',
    href: '/supersonic-fast-cash/services/tax-preparation',
  },
  {
    icon: DollarSign,
    title: 'Refund Advance',
    description: 'Get up to $7,500 same day. Zero interest, zero fees — available the day you file.',
    href: '/supersonic-fast-cash/services/refund-advance',
  },
  {
    icon: Monitor,
    title: 'DIY Tax Filing',
    description: 'Guided online interview walks you through every step at your own pace.',
    href: '/supersonic-fast-cash/diy-taxes',
  },
  {
    icon: Shield,
    title: 'Audit Protection',
    description: 'Every return includes one year of audit support from a credentialed preparer.',
    href: '/supersonic-fast-cash/services/audit-protection',
  },
  {
    icon: BookOpen,
    title: 'Bookkeeping',
    description: 'Monthly bookkeeping and year-round financial records for individuals and small businesses.',
    href: '/supersonic-fast-cash/services/bookkeeping',
  },
  {
    icon: Users,
    title: 'Payroll',
    description: 'Payroll processing, filings, and compliance for small businesses and nonprofits.',
    href: '/supersonic-fast-cash/services/payroll',
  },
];

const stats = [
  { value: '15,000+', label: 'Returns Filed' },
  { value: '$12M+', label: 'in Refunds Delivered' },
  { value: 'Up to $7,500', label: 'Same-Day Advance' },
  { value: 'IRS PTIN', label: 'Credentialed Preparers' },
];

const trustItems = [
  'PTIN Certified',
  'IRS Authorized e-File Provider',
  'Secure 256-bit Encryption',
  'Same-Day Advances Available',
];

export default function SupersonicHomePage() {
  return (
    <>
      <SupersonicPageHero
        image="/images/pages/supersonic-page-1.jpg"
        alt="Supersonic Fast Cash tax preparation office"
        title="Professional Tax Preparation & Same-Day Refund Advances"
      />

      {/* Stats strip */}
      <section className="bg-brand-blue-900 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-sm text-blue-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Our Services</h2>
          <p className="text-slate-600 text-center mb-10">Everything you need to file accurately and get your money fast.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={svc.href}
                  href={svc.href}
                  className="group border border-slate-200 rounded-xl p-6 hover:border-brand-red-600 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-red-600 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-brand-red-600 transition-colors">{svc.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{svc.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-brand-blue-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to File?</h2>
          <p className="text-blue-200 mb-8 text-lg">Get your taxes done right — and your refund fast.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/supersonic-fast-cash/start"
              className="inline-block bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Start Tax Prep
            </Link>
            <Link
              href="/supersonic-fast-cash/calculator"
              className="inline-block border border-white text-white hover:bg-white hover:text-brand-blue-900 font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Calculate My Refund
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-slate-50 py-6 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {trustItems.map((item, i) => (
              <div key={item} className="flex items-center gap-3">
                {i > 0 && <span className="w-1.5 h-1.5 rounded-full bg-brand-red-500 hidden sm:block" />}
                <span className="text-sm font-medium text-slate-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

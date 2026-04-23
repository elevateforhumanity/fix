import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Users, Award, ArrowRight, CheckCircle, BookOpen, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'K-12 Workforce Solutions | Elevate for Humanity',
  description: 'Career and technical education pathways for high school students. Dual enrollment, industry credentials, and registered apprenticeships that count toward graduation.',
};

const PROGRAMS = [
  { name: 'Barber Apprenticeship', credential: 'Indiana Barber License', hours: '3,000 OJT', href: '/programs/barber-apprenticeship' },
  { name: 'Cosmetology Apprenticeship', credential: 'Indiana Cosmetology License', hours: '2,000 OJT', href: '/programs/cosmetology-apprenticeship' },
  { name: 'HVAC Technician', credential: 'EPA 608 Certification', hours: '95 lessons', href: '/programs/hvac-technician' },
  { name: 'IT Help Desk', credential: 'CompTIA A+', hours: '120 hours', href: '/programs/it-help-desk' },
  { name: 'Medical Assistant', credential: 'NHA CCMA', hours: '160 hours', href: '/programs/medical-assistant' },
  { name: 'Tax Preparation', credential: 'IRS PTIN', hours: '80 hours', href: '/programs/tax-preparation' },
];

const BENEFITS = [
  'USDOL Registered Apprenticeships count toward graduation requirements in Indiana',
  'Students earn industry credentials before they graduate',
  'No tuition cost to students — WIOA and DOL funding available',
  'Paid on-the-job training from day one of apprenticeship',
  'Dual enrollment credit available at partner community colleges',
  'Dedicated career coach assigned to each student cohort',
];

export default function K12SolutionsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-800 rounded-full px-4 py-2 text-blue-200 text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" />
            K-12 Workforce Development
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight">
            Career-ready credentials<br />before graduation.
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Elevate partners with Indiana high schools to deliver USDOL Registered Apprenticeships and industry certifications that count toward graduation — at no cost to students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/partners/training" className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
              Partner With Us
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors">
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-50 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '6', label: 'Career Pathways' },
            { value: '$0', label: 'Cost to Students' },
            { value: '100%', label: 'Online + Hybrid' },
            { value: 'DOL', label: 'Registered Sponsor' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-black text-blue-700">{value}</p>
              <p className="text-slate-600 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Available career pathways</h2>
          <p className="text-slate-600 mb-10">Each program leads to a nationally recognized credential students can use immediately after graduation.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {PROGRAMS.map((p) => (
              <Link key={p.name} href={p.href} className="group border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{p.name}</p>
                    <p className="text-sm text-slate-500 mt-1">{p.credential}</p>
                    <p className="text-xs text-blue-600 font-medium mt-2">{p.hours}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-10">Why schools partner with Elevate</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-10">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, step: '1', title: 'Partnership agreement', desc: 'We sign an MOU with your school or district. No cost, no obligation beyond the agreement.' },
              { icon: BookOpen, step: '2', title: 'Students enroll', desc: 'Eligible juniors and seniors enroll in their chosen career pathway. WIOA funding covers tuition.' },
              { icon: Briefcase, step: '3', title: 'Earn while they learn', desc: 'Apprentices are placed with local employers and earn wages from day one of OJT.' },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Step {step}</p>
                <p className="font-bold text-slate-900 mb-2">{title}</p>
                <p className="text-slate-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <Award className="w-12 h-12 text-blue-300 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-4">Ready to bring career pathways to your students?</h2>
          <p className="text-blue-200 mb-8">We handle curriculum, credentialing, employer partnerships, and compliance. You focus on your students.</p>
          <Link href="/partners/training" className="inline-block bg-white text-blue-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
            Become a Partner School →
          </Link>
        </div>
      </section>

    </div>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Client Portal Demo | Elevate for Humanity',
  description: 'See how Elevate for Humanity helps employers track workforce development, apprenticeships, and training outcomes.',
  alternates: {
    canonical: 'https://www.elevateforhumanity.org/start/demo',
  },
};

const DEMO_STATS = [
  { label: 'Active Apprentices', value: '24', change: '+3 this month' },
  { label: 'Hours Logged', value: '1,842', change: 'Avg 76.7 hrs/apprentice' },
  { label: 'Programs Enrolled', value: '3', change: 'HVAC · Barbering · Electrical' },
  { label: 'Certifications Earned', value: '11', change: 'This quarter' },
];

const DEMO_APPRENTICES = [
  { name: 'Marcus Johnson', program: 'HVAC Technician', hours: 312, target: 1500, status: 'On Track' },
  { name: 'Destiny Williams', program: 'Barbering', hours: 890, target: 1500, status: 'On Track' },
  { name: 'Jamal Carter', program: 'HVAC Technician', hours: 1480, target: 1500, status: 'Near Complete' },
  { name: 'Aaliyah Brooks', program: 'Electrical', hours: 204, target: 2000, status: 'On Track' },
  { name: 'Darius Thompson', program: 'Barbering', hours: 1500, target: 1500, status: 'Complete' },
];

const FEATURES = [
  {
    title: 'Real-Time Hour Tracking',
    description: 'Log and verify apprentice hours with QR check-in. Automatic DOL compliance reporting.',
  },
  {
    title: 'Program Enrollment Management',
    description: 'Enroll workers in DOL-registered apprenticeship programs and track progress toward credentials.',
  },
  {
    title: 'Certification Pathways',
    description: 'Monitor each apprentice\'s path to licensure. Automated alerts when milestones are reached.',
  },
  {
    title: 'Funding & Incentive Tracking',
    description: 'Track OJT reimbursements, tax credits, and workforce development grants in one place.',
  },
];

export default function ClientPortalDemoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200 px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Employer Portal — Interactive Demo
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Workforce Development, Simplified
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            See how leading employers use Elevate to manage apprenticeships, track training hours,
            and unlock workforce funding — all in one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/client-portal/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Demo dashboard preview */}
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center mb-2">
          <p className="text-sm text-gray-400 uppercase tracking-wide font-medium">
            Sample Dashboard — Acme Construction Co.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DEMO_STATS.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-sm font-medium text-gray-800 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Apprentice table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Apprentice Progress</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">Demo Data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Program</th>
                  <th className="px-6 py-3 text-left">Progress</th>
                  <th className="px-6 py-3 text-right">Hours</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {DEMO_APPRENTICES.map((a) => {
                  const pct = Math.min(100, Math.round((a.hours / a.target) * 100));
                  return (
                    <tr key={a.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{a.name}</td>
                      <td className="px-6 py-4 text-gray-500">{a.program}</td>
                      <td className="px-6 py-4 w-48">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${pct >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700 font-medium">
                        {a.hours.toLocaleString()} / {a.target.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          a.status === 'Complete'
                            ? 'bg-green-100 text-green-700'
                            : a.status === 'Near Complete'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Everything you need to manage your workforce
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Join employers across the region using Elevate to build a skilled, credentialed workforce
            while accessing available funding and incentives.
          </p>
          <Link
            href="/client-portal/signup"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </main>
  );
}

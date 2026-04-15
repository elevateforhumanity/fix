// Server Component - NO 'use client'
// This header renders on the server and is visible even with JS disabled

import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/ui/Logo';
import LogoImage from '@/components/site/LogoImage';
import HeaderMobileMenu from './HeaderMobileMenu.client';
import HeaderDesktopNav from './HeaderDesktopNav';

// Marketing site navigation.
//
// Rule: this header is for first-time visitors — brand, mission, trust, outcomes,
// partners, and a single clear entry point into the LMS.
//
// Anything tied to studying, enrolling, accessing courses, or navigating programs
// belongs in the LMS navigation (components/lms/LMSNavigation.tsx), not here.
export const NAV_ITEMS = [
  {
    name: 'Programs',
    href: '/programs',
    subItems: [
      { name: '— Healthcare —', href: '/programs/healthcare', isHeader: true },
      { name: 'CNA / Nursing Assistant', href: '/programs/cna' },
      { name: 'Medical Assistant', href: '/programs/medical-assistant' },
      { name: 'Peer Recovery Specialist', href: '/programs/peer-recovery-specialist' },
      { name: 'All Healthcare Programs', href: '/programs/healthcare' },
      { name: '— Skilled Trades —', href: '/programs/skilled-trades', isHeader: true },
      { name: 'HVAC Technician', href: '/programs/hvac-technician' },
      { name: 'CDL / Commercial Driving', href: '/programs/cdl-training' },
      { name: 'Electrical', href: '/programs/electrical' },
      { name: 'Welding', href: '/programs/welding' },
      { name: 'All Trades Programs', href: '/programs/skilled-trades' },
      { name: '— Beauty & Barbering —', href: '/programs/apprenticeships', isHeader: true },
      { name: 'Barber Apprenticeship', href: '/programs/barber-apprenticeship' },
      { name: 'Cosmetology Apprenticeship', href: '/programs/cosmetology-apprenticeship' },
      { name: 'Nail Technician', href: '/programs/nail-technician-apprenticeship' },
      { name: 'Esthetician', href: '/programs/esthetician' },
      { name: '— Technology & Business —', href: '/programs/technology', isHeader: true },
      { name: 'IT Help Desk', href: '/programs/it-help-desk' },
      { name: 'Tax Preparation', href: '/programs/tax-preparation' },
      { name: 'All Programs →', href: '/programs' },
    ],
  },
  {
    name: 'Partners',
    href: '/partners',
    subItems: [
      { name: '— Apprenticeship Hosts —', href: '/partners', isHeader: true },
      { name: 'Barbershop Partners', href: '/partners/barbershop-apprenticeship' },
      { name: 'Cosmetology & Salon Partners', href: '/partners/cosmetology-apprenticeship' },
      { name: '— Workforce & Reentry —', href: '/partners/workforce', isHeader: true },
      { name: 'Workforce Agencies', href: '/partners/workforce' },
      { name: 'Reentry Organizations', href: '/partners/reentry' },
      { name: 'JRI Partners', href: '/partners/jri' },
      { name: '— Employers —', href: '/for-employers', isHeader: true },
      { name: 'Hire Our Graduates', href: '/hire-graduates' },
      { name: 'OJT & Employer Partners', href: '/for-employers' },
      { name: 'Training Sites & Facilities', href: '/partners/training-sites' },
      { name: '— Training Providers —', href: '/partners/training-provider', isHeader: true },
      { name: 'Training Providers', href: '/partners/training-provider' },
      { name: 'Program Holders', href: '/program-holder' },
      { name: 'Sign an MOU', href: '/partners/mou' },
      { name: 'All Partner Types →', href: '/partners' },
    ],
  },
  {
    name: 'Funding',
    href: '/financial-aid',
    subItems: [
      { name: '— How It Works —', href: '/financial-aid', isHeader: true },
      { name: 'Financial Aid Overview', href: '/financial-aid' },
      { name: 'How Funding Works', href: '/how-it-works' },
      { name: 'Check Eligibility', href: '/start' },
      { name: '— Funding Sources —', href: '/financial-aid', isHeader: true },
      { name: 'WIOA / WorkOne', href: '/agencies#wioa' },
      { name: 'Job Ready Indy', href: '/partners/jri' },
      { name: 'Next Level Jobs', href: '/financial-aid#next-level' },
      { name: 'WorkOne Partner Packet', href: '/workone-partner-packet' },
    ],
  },
  {
    name: 'Testing',
    href: '/testing',
    subItems: [
      { name: '— Certification Exams —', href: '/testing', isHeader: true },
      { name: 'All Testing Providers', href: '/testing' },
      { name: 'NHA Healthcare Exams', href: '/testing/nha' },
      { name: 'EPA 608 Certification', href: '/testing/epa608' },
      { name: 'Certiport (Microsoft, Adobe)', href: '/testing/certiport' },
      { name: 'WorkKeys / NCRC', href: '/testing/workkeys' },
      { name: '— Schedule —', href: '/testing/book', isHeader: true },
      { name: 'Book a Testing Session', href: '/testing/book' },
      { name: 'Verify a Credential', href: '/verify-credentials' },
    ],
  },
  {
    name: 'About',
    href: '/about',
    subItems: [
      { name: '— Organization —', href: '/about', isHeader: true },
      { name: 'About Us', href: '/about' },
      { name: 'Our Mission', href: '/mission' },
      { name: 'Our Team', href: '/about/team' },
      { name: 'Outcomes', href: '/outcomes/indiana' },
      { name: 'Accreditation', href: '/accreditation' },
      { name: '— More —', href: '/about', isHeader: true },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Rise Foundation', href: '/rise-foundation' },
    ],
  },
  {
    name: 'Sign In',
    href: '/login',
    subItems: [
      { name: '— Students —', href: '/learner/dashboard', isHeader: true },
      { name: 'Learner Dashboard', href: '/learner/dashboard' },
      { name: 'My Courses (LMS)', href: '/lms/dashboard' },
      { name: '— Partners & Employers —', href: '/partner/dashboard', isHeader: true },
      { name: 'Partner Shop Dashboard', href: '/partner/dashboard' },
      { name: 'Employer Portal', href: '/employer/dashboard' },
      { name: 'Workforce Board Portal', href: '/workforce-board/dashboard' },
      { name: '— Instructors & Staff —', href: '/instructor/dashboard', isHeader: true },
      { name: 'Instructor Portal', href: '/instructor/dashboard' },
      { name: 'Staff Portal', href: '/staff-portal/dashboard' },
      { name: 'Program Holder Portal', href: '/program-holder/dashboard' },
      { name: 'Admin Dashboard', href: '/admin/dashboard' },
    ],
  },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-[70px] bg-white z-[9999] shadow-md" role="banner">
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between px-4 sm:px-6">
        {/* Logo - Always visible */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Elevate for Humanity home">
          <LogoImage
            alt="Elevate"
            width={40}
            height={60}
            className="w-auto h-10"
            priority
          />
          <span className="font-bold text-lg text-slate-900 hidden sm:block">
            Elevate
          </span>
        </Link>

        {/* Desktop Navigation - Server rendered */}
        <HeaderDesktopNav items={NAV_ITEMS} />

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/start"
            className="bg-brand-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-red-700 transition-colors"
          >
            Check Eligibility
          </Link>
        </div>

        {/* Mobile Menu Toggle - Client component for interactivity */}
        <HeaderMobileMenu items={NAV_ITEMS} />
      </div>
    </header>
  );
}

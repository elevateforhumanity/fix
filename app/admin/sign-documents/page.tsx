import { Metadata } from 'next';
import { SignDocumentsClient } from './SignDocumentsClient';

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Sign Documents | Elevate for Humanity',
  description: 'Draw and save your signature, then apply it to W-9 and ACH enrollment forms.',
};

export default async function SignDocumentsPage() {
  return <SignDocumentsClient />;
}

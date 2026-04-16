import { Metadata } from 'next';
import EnvManagerClient from './EnvManagerClient';

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Integration Settings | Admin | Elevate LMS',
  robots: { index: false },
};

export default async function EnvManagerPage() {
  return <EnvManagerClient />;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your profile and accommodation ads.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}

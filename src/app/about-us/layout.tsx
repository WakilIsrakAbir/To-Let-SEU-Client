import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Student-to-student bachelor accommodation portal for SEU.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

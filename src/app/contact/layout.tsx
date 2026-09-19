import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the To Let SEU team for help and inquiries.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

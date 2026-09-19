import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent Posts',
  description: 'Browse available bachelor seats and rooms near SEU campus.',
};

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

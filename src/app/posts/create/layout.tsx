import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Post an Ad',
  description: 'Post a bachelor seat or room rent ad for SEU students.',
};

export default function CreatePostLayout({ children }: { children: React.ReactNode }) {
  return children;
}

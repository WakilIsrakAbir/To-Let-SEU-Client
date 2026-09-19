import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Posts',
  description: 'View, edit, and manage your posted accommodation ads.',
};

export default function MyPostsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

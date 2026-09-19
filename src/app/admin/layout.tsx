import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Manage users, posts, and platform moderation.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}

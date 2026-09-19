import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Banner',
  description: 'Generate rent posters and social media banners easily.',
};

export default function CreateBannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}

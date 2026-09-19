import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopLoadingBar from "@/components/common/TopLoadingBar";

export const metadata: Metadata = {
  title: {
    default: "To Let SEU | Bachelor Housing",
    template: "%s | To Let SEU",
  },
  description: "Find bachelor seats, rooms, and flats near Southeast University campus.",
  keywords: ["SEU", "Southeast University", "To Let SEU", "Bachelor Room Rent", "Student Mess"],
  icons: {
    icon: "/seu-logo.png",
    shortcut: "/seu-logo.png",
    apple: "/seu-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased">
        <ClientProviders>
          <TopLoadingBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopLoadingBar from "@/components/common/TopLoadingBar";

export const metadata: Metadata = {
  title: "TO-LET SEU | Southeast University Bachelor Room & Seat Rent",
  description: "Dedicated bachelor room, seat, and flat rental portal for Southeast University (SEU) students in Tejgaon, Mohakhali, Banani, and Dhaka.",
  keywords: ["SEU", "Southeast University", "To Let SEU", "Bachelor Room Rent", "SEU Hostel", "Dhaka Bachelor Mess"],
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

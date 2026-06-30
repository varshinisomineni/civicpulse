import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CivicPulse AI — Community Issue Reporting",
  description: "AI-powered hyperlocal community issue reporting and resolution platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MPBN — Membership Professional Business Network",
  description: "Complete membership & business networking management platform with chapters, referrals, visitors, events, and TYFCB tracking.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

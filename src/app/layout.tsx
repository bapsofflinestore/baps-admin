import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BAPS Admin Panel",
  description: "BAPS Offline Rewards - Super Admin Dashboard",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

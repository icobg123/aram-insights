import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GoogleAnalytics from "@/components/google-analytics/GoogleAnalytics";
import Header from "@/components/header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aram Balance",
  description: "Aram and URF League of Legends changes",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { path: string };
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <GoogleAnalytics GA_TRACKING_ID={process.env.GA_TRACKING_ID as string} />
      <body className={inter.className + " min-h-screen"}>
        <Header />
        {children}
      </body>
    </html>
  );
}

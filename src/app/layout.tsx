import "./globals.css";
import "animate.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GoogleAnalytics from "@/components/google-analytics/GoogleAnalytics";
import Header from "@/components/header/Header";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cn } from "@/lib/cn";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ARAM Insights - League of Legends Balance Changes",
    template: "%s | ARAM Insights",
  },
  description:
    "Track League of Legends champion, item, and rune balance changes for ARAM, Arena, and URF game modes. Stay updated with the latest nerfs and buffs.",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  openGraph: {
    title: "ARAM Insights - League of Legends Balance Changes",
    description:
      "Track League of Legends champion, item, and rune balance changes for ARAM, Arena, and URF game modes.",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { path: string };
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics GA_TRACKING_ID={process.env.GA_TRACKING_ID as string} />
      <body className={inter.className + " min-h-screen"}>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="forest"
        enableSystem={false}
        themes={[
          "light",
          "dark",
          "cupcake",
          "bumblebee",
          "emerald",
          "corporate",
          "synthwave",
          "retro",
          "cyberpunk",
          "valentine",
          "halloween",
          "garden",
          "forest",
          "aqua",
          "lofi",
          "pastel",
          "fantasy",
          "wireframe",
          "black",
          "luxury",
          "dracula",
          "cmyk",
          "autumn",
          "business",
          "acid",
          "lemonade",
          "night",
          "coffee",
          "winter",
          "dim",
          "nord",
          "sunset",
        ]}
      >
          <NuqsAdapter>
            <Header />
            {children}
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}

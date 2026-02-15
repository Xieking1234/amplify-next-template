
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnimatedBackground from "@/components/animata/background/animated-background";
import "./globals.css"
import "@/amplify/configure";
import InspectorShield from '@/components/inspectorshield';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "University Emplotment Rate",
  description: "Employment statistics for UK universities.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",

  },
  applicationName: "UniStats",
  creator: "Ramkrishna"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" absolute ">
          <AnimatedBackground />
        </div>
        <main>
          <InspectorShield />
          {children}
        </main>
      </body>
    </html>
  );
}

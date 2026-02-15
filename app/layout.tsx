
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnimatedBackground from "@/components/animata/background/animated-background";
import "./globals.css"
import InspectorShield from '@/components/inspectorshield';
import AmplifyProvider from "./amplify-provider";
import AuthenticatorWrapper from "./authenticator-wrapper";
import "@aws-amplify/ui-react/styles.css";
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
      <AmplifyProvider>
        <AuthenticatorWrapper>
        <div>
          <AnimatedBackground />
        </div>
        <main>
          <InspectorShield />
          {children}
        </main>
          </AuthenticatorWrapper>
        </AmplifyProvider>
      </body>
    </html>
  );
}

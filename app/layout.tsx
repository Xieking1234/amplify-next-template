import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutContent from "@/components/layout-content"
import "./globals.css";
import AmplifyProvider from "./amplify-provider";
import AuthenticatorWrapper from "./authenticator-wrapper";
import "@aws-amplify/ui-react/styles.css";
import InspectorShield from "@/components/inspectorshield"
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <AmplifyProvider>
        <AuthenticatorWrapper>
           <InspectorShield/>
          <LayoutContent>{children}</LayoutContent>
        </AuthenticatorWrapper>
      </AmplifyProvider>
      </body>
      </html>
  );
}



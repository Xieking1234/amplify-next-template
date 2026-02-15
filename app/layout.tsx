// layout.tsx
"use client"; // Ensure this is at the top since we're using hooks

import { Inter } from "next/font/google";
import { useAuthenticator } from "@aws-amplify/ui-react";
import AnimatedBackground from "@/components/animata/background/animated-background";
import "./globals.css";
import AmplifyProvider from "./amplify-provider";
import AuthenticatorWrapper from "./authenticator-wrapper";
import "@aws-amplify/ui-react/styles.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <AmplifyProvider>
        <AuthenticatorWrapper>
          <LayoutContent>{children}</LayoutContent>
        </AuthenticatorWrapper>
      </AmplifyProvider>
      </body>
      </html>
  );
}

// Separate component to safely use the useAuthenticator hook
function LayoutContent({ children }: { children: React.ReactNode }) {
  // Use a selector to avoid unnecessary re-renders
  const { signOut, user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);

  return (
      <>
        {/* ⭐ Sign Out Button: Only visible if authenticated */}
        {authStatus === "authenticated" && (
            <div className="fixed top-5 right-5 z-[100]">
              <button
                  onClick={signOut}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20
                       text-white rounded-full hover:bg-red-500/20 hover:border-red-500/50 
                       transition-all text-sm font-medium shadow-lg"
              >
                Sign Out
              </button>
            </div>
        )}

        <div className="fixed inset-0 -z-10">
          <AnimatedBackground />
        </div>

        <main className="relative z-10 min-h-screen">
          {children}
        </main>
      </>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/context/AppContext";
import { SocketProvider } from "@/context/SocketContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "vartaX",
  description:
    "Chat, share, and stay connected with friends — built using Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var key='vartax-theme';var t=localStorage.getItem(key);var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',t?t==='dark':d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={inter.className}>
        <AppProvider>
          <SocketProvider>{children}</SocketProvider>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}

import { WhichlyProvider } from "@whichly/react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Whichly — Live variant picker for React",
  description:
    "Show clients multiple block variants on a real staging page and let them toggle live. Open source React picker.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("dark font-sans", inter.variable)}>
      <body>
        <WhichlyProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </WhichlyProvider>
      </body>
    </html>
  );
}

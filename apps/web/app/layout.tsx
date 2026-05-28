import { OpenPanelComponent } from "@openpanel/nextjs";
import { WhichlyProvider } from "@whichly/react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const title = "Whichly — Live variant picker for React";
const description =
  "Show clients multiple block variants on a real staging page and let them toggle live. Open source React picker.";

export const metadata: Metadata = {
  metadataBase: new URL("https://whichly.xyz"),
  title,
  description,
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    siteName: "Whichly",
    images: [
      {
        url: "/hero.png",
        width: 2880,
        height: 1614,
        alt: "Whichly — Let your clients choose for themselves",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/hero.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("dark scheme-only-dark antialiased font-sans", inter.variable)}>
      <body>
        <WhichlyProvider floating={false}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </WhichlyProvider>
        <OpenPanelComponent
          clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID as string}
          apiUrl="/api/op"
          scriptUrl="/api/op/op1.js"
          trackScreenViews
          trackAttributes
          trackOutgoingLinks
        />
      </body>
    </html>
  );
}

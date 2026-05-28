import type { Metadata } from "next";
import type { ReactNode } from "react";
import { WhichlyProvider } from "@whichly/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Whichly — Live variant picker for React",
  description:
    "Show clients multiple block variants on a real staging page and let them toggle live. Open source React picker.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WhichlyProvider>{children}</WhichlyProvider>
      </body>
    </html>
  );
}

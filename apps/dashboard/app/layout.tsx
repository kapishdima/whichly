import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Optio Dashboard",
  description: "Optio admin dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
        <Script src="https://ui.sh/ui-picker.js" />
      </body>
    </html>
  );
}

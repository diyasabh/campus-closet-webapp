// app/layout.tsx
import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/auth-provider";
import SupabaseAnalyticsProvider from "@/components/SupabaseAnalyticsProvider";
import { inter, playfair } from "./fonts";

export const metadata: Metadata = {
  title: "Campus Closet | Stanford P2P Clothing Rentals",
  description: "Rent clothes from fellow Stanford students or list your own items for rent.",
  manifest: "/manifest.json",
  themeColor: "#8c1515",
  generator: "v0.dev"
};

export const viewport = {
  themeColor: "#8c1515",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light">
            <SupabaseAnalyticsProvider>
              <Header />
              {children}
              <Footer />
            </SupabaseAnalyticsProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
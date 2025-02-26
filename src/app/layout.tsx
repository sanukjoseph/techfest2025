import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import Footer from "@/components/home/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMASH Tech Fest",
  description: "Think, learn, code, and win exciting prizes at SMASH Tech Fest.",
  openGraph: {
    title: "SMASH Tech Fest",
    description: "Think, learn, code, and win exciting prizes at SMASH Tech Fest.",
    url: "https://www.smash.net.in/", // Replace with your deployed URL
    // images: [
    //   {
    //     url: "/hero.svg", // Replace with your og image
    //     width: 1200,
    //     height: 630,
    //     alt: "SMASH Tech Fest Hero Image",
    //   },
    // ],
    siteName: "SMASH Tech Fest",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SMASH Tech Fest",
    description: "Think, learn, code, and win exciting prizes at SMASH Tech Fest.",
    // images: ["/hero.svg"], // Replace with your twitter image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <ThemeProvider attribute="class" defaultTheme="system" forcedTheme="dark" enableSystem disableTransitionOnChange>
          <main>{children}</main>
          <Footer />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}

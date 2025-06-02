import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GiftBuilderProvider } from '@/context/GiftBuilderContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gift Finder - Build the Perfect Gift Message",
  description: "Create personalized gift messages with style and fun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <GiftBuilderProvider>
          {children}
        </GiftBuilderProvider>
      </body>
    </html>
  );
}

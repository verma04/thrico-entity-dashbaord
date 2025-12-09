"use client";

import { Space_Grotesk, Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/graphql/hoc/ApolloWrapper";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.className} ${inter.variable} ${playfair.variable} ${outfit.variable} font-sans`}>
        <ApolloWrapper host={"https://admin.thrico.app/graphql "}>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}

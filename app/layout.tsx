import {
  Space_Grotesk,
  Inter,
  Playfair_Display,
  Outfit,
} from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/graphql/hoc/ApolloWrapper";
import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: {
    default: "Thrico Entity Dashboard",
    template: "%s | Thrico",
  },
  description:
    "Manage your community, members, and content with Thrico's powerful entity dashboard. Build engaging websites, forums, and member experiences.",
  keywords: [
    "community management",
    "entity dashboard",
    "member management",
    "website builder",
    "thrico",
  ],
  authors: [{ name: "Thrico" }],
  creator: "Thrico",
  publisher: "Thrico",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://admin.thrico.app"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Thrico Entity Dashboard",
    description:
      "Manage your community, members, and content with Thrico's powerful entity dashboard.",
    siteName: "Thrico",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thrico Entity Dashboard",
    description:
      "Manage your community, members, and content with Thrico's powerful entity dashboard.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.className} ${inter.variable} ${playfair.variable} ${outfit.variable} font-sans`}
      >
        <ApolloWrapper host={"http://localhost:1111/graphql"}>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}

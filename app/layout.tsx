import { Figtree } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/graphql/hoc/ApolloWrapper";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { BrandStyles } from "@/components/layout/brand-styles";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
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
    process.env.NEXT_PUBLIC_BASE_URL || "https://admin.thrico.app",
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
      <body className={`${figtree.className} ${figtree.variable} antialiased`}>
        <Toaster position="top-right" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "system", "brand"]}
        >
          <ApolloWrapper>
            <BrandStyles />
            {children}
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

import localFont from "next/font/local";
import {
  Space_Grotesk,
  Inter,
  Playfair_Display,
  Outfit,
  Fira_Code,
  Roboto,
  Open_Sans,
  Montserrat,
  Lato,
  Poppins,
  Nunito,
  Source_Sans_3,
  Work_Sans,
  Ubuntu,
  Merriweather,
  Lora,
  Cormorant_Garamond,
  Bitter,
  Oswald,
  Raleway,
  Bebas_Neue,
  Cinzel,
  Pacifico,
  Plus_Jakarta_Sans,
  Mona_Sans,
} from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/graphql/hoc/ApolloWrapper";
import type { Metadata } from "next";
import { Toaster } from "sonner";

const roobert = localFont({
  src: [
    {
      path: "../public/font/Roobert-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/font/Roobert-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/font/Roobert-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/font/Roobert-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/font/Roobert-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/font/Roobert-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/font/Roobert-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/font/Roobert-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/font/Roobert-Heavy.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/font/Roobert-HeavyItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-roobert",
});

const avantGarde = localFont({
  src: [
    {
      path: "../public/font/ITC Avant Garde Gothic LT Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/font/ITC Avant Garde Gothic LT Demi.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/font/ITC Avant Garde Gothic LT Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/font/ITC Avant Garde Gothic LT Bold Oblique.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-avant-garde",
});

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

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
});

const bitter = Bitter({
  subsets: ["latin"],
  variable: "--font-bitter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const bebasNeue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const pacifico = Pacifico({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-pacifico",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const monaSans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona-sans",
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
      <body
        className={`${monaSans.variable} ${plusJakartaSans.variable} ${roobert.variable} ${avantGarde.variable} ${monaSans.className} ${inter.variable} ${playfair.variable} ${outfit.variable} ${firaCode.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${lato.variable} ${poppins.variable} ${nunito.variable} ${sourceSans3.variable} ${workSans.variable} ${ubuntu.variable} ${merriweather.variable} ${lora.variable} ${cormorantGaramond.variable} ${bitter.variable} ${oswald.variable} ${raleway.variable} ${bebasNeue.variable} ${cinzel.variable} ${pacifico.variable} antialiased`}
      >
        <Toaster position="top-right" />
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}

"use client";
import localFont from "next/font/local";
import {
  Space_Grotesk,
  Figtree,
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
} from "next/font/google";

const roobert = localFont({
  src: [
    {
      path: "../../../../public/font/Roobert-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../../public/font/Roobert-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../../../public/font/Roobert-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../public/font/Roobert-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../../../public/font/Roobert-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../../public/font/Roobert-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../../../public/font/Roobert-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../../public/font/Roobert-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../../../public/font/Roobert-Heavy.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../../../public/font/Roobert-HeavyItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-roobert",
});

const avantGarde = localFont({
  src: [
    {
      path: "../../../../public/font/ITC Avant Garde Gothic LT Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../../public/font/ITC Avant Garde Gothic LT Demi.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../../public/font/ITC Avant Garde Gothic LT Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../../public/font/ITC Avant Garde Gothic LT Bold Oblique.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-avant-garde",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
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

import BuilderLayout from "@/components/website-layout/builder-layout";
import { useRouter } from "next/navigation";
import { LayoutTemplate, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const WebsiteBuilderPage = () => {
  const router = useRouter();

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#f6f6f7] dark:bg-zinc-950 w-screen h-screen p-0 m-0 flex flex-col overflow-hidden ${plusJakartaSans.variable} ${figtree.variable} ${roobert.variable} ${avantGarde.variable} ${spaceGrotesk.variable} ${inter.variable} ${playfair.variable} ${outfit.variable} ${firaCode.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${lato.variable} ${poppins.variable} ${nunito.variable} ${sourceSans3.variable} ${workSans.variable} ${ubuntu.variable} ${merriweather.variable} ${lora.variable} ${cormorantGaramond.variable} ${bitter.variable} ${oswald.variable} ${raleway.variable} ${bebasNeue.variable} ${cinzel.variable} ${pacifico.variable}`}
    >
      {/* ─── Zero-Clutter Polaris Studio Header ─── */}
      <header className="flex flex-row items-center justify-between px-4 sm:px-6 py-2.5 border-b border-[#d2d5d9] dark:border-zinc-800 shrink-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md relative z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/app-layout")}
            className="h-8 w-8 rounded-lg border border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 flex items-center justify-center text-[#616161] hover:text-[#303030] dark:text-zinc-400 dark:hover:text-zinc-100 transition-all cursor-pointer shrink-0 shadow-2xs"
            aria-label="Back to Pages"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <LayoutTemplate className="h-4 w-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold text-[#303030] dark:text-zinc-100 tracking-tight leading-none">
                Website Builder Studio
              </h1>
              <Badge
                variant="outline"
                className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold px-1.5 py-0"
              >
                Linear CMS
              </Badge>
            </div>
            <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-snug mt-0.5 hidden sm:block">
              Visual page layout builder and interactive module studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10.5px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Live Canvas</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/app-layout")}
            className="h-8 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[#303030] dark:text-zinc-200 gap-1.5 cursor-pointer shadow-2xs font-medium"
          >
            <span>Exit Studio</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full h-full relative overflow-hidden bg-[#f6f6f7] dark:bg-zinc-950">
        <BuilderLayout />
      </main>
    </div>
  );
};

export default WebsiteBuilderPage;

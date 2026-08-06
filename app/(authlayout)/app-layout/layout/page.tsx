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
import { redirect } from "next/navigation";

const WebsiteBuilderPage = () => {
  return (
    <div className={`fixed inset-0 z-50 bg-background w-screen h-screen p-0 m-0 flex flex-col overflow-hidden animate-in fade-in duration-500 ${plusJakartaSans.variable} ${figtree.variable} ${roobert.variable} ${avantGarde.variable} ${spaceGrotesk.variable} ${inter.variable} ${playfair.variable} ${outfit.variable} ${firaCode.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${lato.variable} ${poppins.variable} ${nunito.variable} ${sourceSans3.variable} ${workSans.variable} ${ubuntu.variable} ${merriweather.variable} ${lora.variable} ${cormorantGaramond.variable} ${bitter.variable} ${oswald.variable} ${raleway.variable} ${bebasNeue.variable} ${cinzel.variable} ${pacifico.variable}`}>
      <header className="flex flex-row items-center justify-between px-8 py-4 border-b shrink-0 bg-background/80 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Website Builder
            </h1>
            <p className="text-muted-foreground text-xs font-medium">
              Enterprise CMS & Layout Manager
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              Live Preview
            </span>
          </div>

          <button
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-300"
            aria-label="Close"
            onClick={() => redirect("/app-layout/")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:rotate-90 transition-transform duration-300"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full h-full relative overflow-hidden bg-muted/20">
        <BuilderLayout />
      </main>
    </div>
  );
};

export default WebsiteBuilderPage;

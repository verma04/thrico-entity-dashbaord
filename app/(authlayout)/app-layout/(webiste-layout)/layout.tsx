"use client";
import * as React from "react";

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

import MenuItemsLayout from "@/components/layout/menu-items-layout";
import { PlanDrawer } from "@/components/layout/plan-drawer";
import { useGetWebsite } from "@/graphql/actions";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent } from "@/components/ui/card";
import { Layout, Menu, PanelBottom, Globe, Settings, Plus } from "lucide-react";

function RootLayout({ children }: { children: React.ReactNode }) {
  const { data, loading } = useGetWebsite();
  const website = data?.getWebsite;
  const initializeWebsiteData = useWebsiteBuilderStore(
    (state) => state.initializeWebsiteData,
  );

  React.useEffect(() => {
    if (website && !loading) {
      initializeWebsiteData({
        ...website,
        globalFooter: {
          ...website?.footer,
          id: "footer",
          type: "footer",
          name: "Footer",
        },
        globalHeader: {
          ...website?.navbar,
          id: "navbar",
          type: "navbar",
          name: "Navbar",
        },

        currentPageId: website?.pages?.[0]?.id || null,
      });
    }
  }, [website, loading, initializeWebsiteData]);

  const items = [
    {
      key: "",
      label: "Pages",
      icon: <Layout className="h-4 w-4" />,
    },
    {
      key: "create",
      label: "Create Page",
      icon: <Plus className="h-4 w-4" />,
    },
    {
      key: "navigation",
      label: "Navigation",
      icon: <Menu className="h-4 w-4" />,
    },
    {
      key: "footer",
      label: "Footer",
      icon: <PanelBottom className="h-4 w-4" />,
    },
    {
      key: "seo",
      label: "SEO",
      icon: <Globe className="h-4 w-4" />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${plusJakartaSans.variable} ${figtree.variable} ${roobert.variable} ${avantGarde.variable} ${spaceGrotesk.className} ${inter.variable} ${playfair.variable} ${outfit.variable} ${firaCode.variable} ${roboto.variable} ${openSans.variable} ${montserrat.variable} ${lato.variable} ${poppins.variable} ${nunito.variable} ${sourceSans3.variable} ${workSans.variable} ${ubuntu.variable} ${merriweather.variable} ${lora.variable} ${cormorantGaramond.variable} ${bitter.variable} ${oswald.variable} ${raleway.variable} ${bebasNeue.variable} ${cinzel.variable} ${pacifico.variable}`}>
      <PlanDrawer />
      <MenuItemsLayout
        active="app-layout"
        items={items}
        hideDefaultTabs={true}
        showAdminTabs={false}
      >
        {children}
      </MenuItemsLayout>
    </div>
  );
}

export default RootLayout;

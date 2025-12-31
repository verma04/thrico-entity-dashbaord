"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import {
  Settings,
  ScrollText,
  MessageCircleQuestion,
  ShoppingBag,
} from "lucide-react";

function ShopSettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Extract active tab from pathname
  const getActiveTab = () => {
    if (pathname.endsWith("/settings")) return "settings";
    if (pathname.includes("/term_and_conditions")) return "terms";
    if (pathname.includes("/faq")) return "faq";
    return "settings";
  };

  const activeTab = getActiveTab();

  const handleTabChange = (value: string) => {
    const basePath = "/shop/settings";
    switch (value) {
      case "settings":
        router.push(basePath);
        break;
      case "terms":
        router.push(`${basePath}/term_and_conditions`);
        break;
      case "faq":
        router.push(`${basePath}/faq`);
        break;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Shop Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Configure shop module settings, terms, and FAQs
          </p>
        </div>
      </div>

      {/* Tabs & Content */}
      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="m-4 grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>

            <TabsTrigger value="terms" className="gap-2">
              <ScrollText className="h-4 w-4" />
              <span className="hidden sm:inline">Terms</span>
            </TabsTrigger>

            <TabsTrigger value="faq" className="gap-2">
              <MessageCircleQuestion className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="p-6">{children}</div>
      </Card>
    </div>
  );
}

export default ShopSettingsLayout;

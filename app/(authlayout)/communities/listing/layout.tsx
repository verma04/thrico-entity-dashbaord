"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { Star, TrendingUp } from "lucide-react";

function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.replace("/communities/listing/", "") || "featured";

  const onChange = (key: string) => {
    if (key === "featured") router.push(`/communities/listing`);
    else router.push(`/communities/listing/${key}`);
  };

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={onChange}>
        <TabsList className="m-4">
          <TabsTrigger value="featured" className="gap-2">
            <Star className="h-4 w-4" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="trending" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="p-4">{children}</div>
    </Card>
  );
}

export default RootLayout;

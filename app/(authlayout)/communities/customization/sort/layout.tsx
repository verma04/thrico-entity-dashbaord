"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { ListOrdered, TrendingUp } from "lucide-react";

function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab =
    pathname.replace("/communities/customization/sort/", "") || "featured";

  const onChange = (key: string) => {
    if (key === "featured") router.push(`/communities/customization/sort`);
    else router.push(`/communities/customization/sort/${key}`);
  };

  return (
    <Card>
      <div className="flex">
        <Tabs
          value={activeTab}
          onValueChange={onChange}
          orientation="vertical"
          className="w-48"
        >
          <TabsList className="flex-col h-auto m-4">
            <TabsTrigger value="featured" className="w-full gap-2">
              <ListOrdered className="h-4 w-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="trending" className="w-full gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex-1 p-4">{children}</div>
      </div>
    </Card>
  );
}

export default RootLayout;

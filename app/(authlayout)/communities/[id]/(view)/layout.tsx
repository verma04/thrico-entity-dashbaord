"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, usePathname, useRouter } from "next/navigation";
import { MessageSquare, Star, Info } from "lucide-react";
import { getCommunityById } from "../../../../../graphql/actions/group";
import CommunityDetails from "../../../../../components/communities/details/Details";

function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const id = params?.id;
  const activeTab = pathname.split("/").pop() || "discussion";

  const onChange = (key: string) => {
    router.push(key);
  };

  const { data, loading } = getCommunityById({
    variables: {
      input: {
        communityId: id,
      },
    },
  });

  return (
    <Sheet open={true} onOpenChange={() => router.back()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-full overflow-y-auto"
      >
        {!loading && <CommunityDetails data={data?.getCommunityById} />}

        <div className="mx-10 mt-5">
          <Tabs value={activeTab} onValueChange={onChange}>
            <TabsList>
              <TabsTrigger value="discussion" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Discussion
              </TabsTrigger>
              <TabsTrigger value="rating" className="gap-2">
                <Star className="h-4 w-4" />
                Rating
              </TabsTrigger>
              <TabsTrigger value="about" className="gap-2">
                <Info className="h-4 w-4" />
                About
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-4">{children}</div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default RootLayout;

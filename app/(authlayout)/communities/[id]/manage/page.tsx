"use client";

import React from "react";
import Manage from "../../../../../components/communities/settings/Manage";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { getCommunityById } from "../../../../../graphql/actions/group";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const manage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  // Replace with your actual data fetching logic
  const { data, loading } = getCommunityById({
    variables: {
      input: {
        communityId: id,
      },
    },
  });

  return (
    <>
      {loading && <></>}
      {!loading && (
        <Sheet open={true} onOpenChange={() => router.back()}>
          <SheetContent className="w-full sm:max-w-full" side="right">
            <SheetHeader>
              <SheetTitle>Community Management</SheetTitle>
            </SheetHeader>
            <div className="mt-4 h-full overflow-y-auto pb-10">
              <Manage data={data?.getCommunityById} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default manage;

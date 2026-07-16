"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { FormValues } from "../ts-types";
import { addCommunity } from "../../../graphql/actions/group";
import { CommunityCreationForm } from "./community-creation-form";

const Create = ({}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<string>();

  const onClose = () => {
    setOpen(false);
  };

  const [add, { loading }] = addCommunity({
    onCompleted: () => {
      onClose();
    },
  });

  const onFinish = (values: any) => {
    add({
      variables: {
        input: { ...values, cover },
      },
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create</Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="h-screen p-0 border-none flex flex-col"
        >
          <CommunityCreationForm
            initialValues={{
              requireAdminApprovalForPosts: false,
              allowMemberInvites: false,
              enableEvents: false,
              enableRatingsAndReviews: false,
            }}
            loading={loading}
            onFinish={onFinish}
            onCancel={onClose}
            cover={cover}
            setCover={setCover}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Create;

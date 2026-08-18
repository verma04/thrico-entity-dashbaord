"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CtaButton } from "@/components/ui/cta-button";
import { FixedInsetMotionContainer } from "@/components/ui/fixed-inset-motion-container";
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
      <CtaButton onClick={() => setOpen(true)}>Create</CtaButton>

      <FixedInsetMotionContainer
        open={open}
        onClose={onClose}
        zIndex="z-50"
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
      </FixedInsetMotionContainer>
    </>
  );
};

export default Create;

"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITY_BY_ID } from "@/graphql/quries/group/approval";
import CommunityChat from "@/components/communities/chat/community-chat";

export default function CommunityChatPage() {
  const { id } = useParams() as { id: string };

  const { data } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: { input: { communityId: id } },
    skip: !id,
  });

  const community = data?.getCommunityById;

  return (
    <CommunityChat
      communityId={id}
      communityTitle={community?.title}
    />
  );
}

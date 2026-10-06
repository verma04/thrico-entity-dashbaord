"use client";

import User from "@/components/members/manage/members-manage";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";

const Page = () => {
  const { data: subData } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;

  return <User status={"ALL"} subscriptionInfo={subscriptionInfo} />;
};

export default withModulePermission(Page, "MEMBERS_ALL", "canRead");

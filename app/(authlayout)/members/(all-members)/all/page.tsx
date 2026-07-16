"use client";

import User from "@/components/members/users/user";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useCheckMemberSubscription } from "@/graphql/actions/membership/membership-queries";

const page = () => {
  const { data: subData, loading: subLoading } = useCheckMemberSubscription();
  const subscriptionInfo = subData?.checkMemberSubscription;
  const hasReachedLimit = subscriptionInfo?.hasReachedLimit;

  return <User status={"ALL"} subscriptionInfo={subscriptionInfo} />;
};

export default withModulePermission(page, "NETWORK", "canRead");

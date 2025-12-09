"use client";

import PaidPlan from "@/components/subscription/paid-plan";
import Trail from "@/components/subscription/trail";
import { useCheckEntitySubscription } from "@/graphql/actions";

const Page = () => {
  const { data } = useCheckEntitySubscription();

  const subscription = data?.checkEntitySubscription;

  return (
    <>
      {subscription?.subscriptionType === "trial" && <Trail />}
      {subscription?.subscriptionType === "paid" && <PaidPlan />}
    </>
  );
};

export default Page;

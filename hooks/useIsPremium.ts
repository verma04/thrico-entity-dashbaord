import { useGetEntity } from "@/graphql/actions";

export const useIsPremium = () => {
  const { data, loading } = useGetEntity();
  console.log(data);

  // Logic: Premium if status is active AND subscription type is NOT trial
  const isPremium =
    data?.getEntity?.subscription?.status &&
    data?.getEntity?.subscription?.subscriptionType !== "trial";
  console.log("isPremium:", isPremium);
  return {
    isPremium: !!isPremium,
    loading,
    subscription: data?.getEntity?.subscription,
  };
};

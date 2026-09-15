"use client";

import React from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import { useToast } from "@/hooks/use-toast";
import { useCreateReward } from "@/graphql/actions/rewards";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { RewardFormSections } from "@/components/rewards/coupons/form/reward-form-sections";
import { RewardPreviewSidebar } from "@/components/rewards/coupons/form/reward-preview-sidebar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Ticket, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { couponSchema } from "@/components/rewards/coupons/types";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";

export default function CreateCouponPage() {
  const { toast } = useToast();
  const router = useRouter();
  const client = useApolloClient();
  const [createReward, { loading }] = useCreateReward();
  const [saved, setSaved] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshCache = async () => {
    try {
      setIsRefreshing(true);
      client.cache.evict({ fieldName: "getManualVouchers" });
      client.cache.evict({ fieldName: "getStoreDiscountRules" });
      client.cache.evict({ fieldName: "getDigitalCardRules" });
      client.cache.evict({ fieldName: "getEntityRewardWallet" });
      client.cache.evict({ fieldName: "getMembershipTiers" });
      client.cache.evict({ fieldName: "getCommunities" });
      client.cache.gc();
      await client.refetchQueries({
        include: [
          "GetManualVouchers",
          "GetStoreDiscountRules",
          "GetDigitalCardRules",
          "GetEntityRewardWallet",
          "GetMembershipTiers",
          "GetCommunities",
        ],
      });
      toast({
        title: "Cache Refreshed",
        description: "Blueprint rules, vouchers, and member tiers synchronized.",
      });
    } catch (err: any) {
      toast({
        title: "Refresh Warning",
        description: err.message || "Failed to fully refresh cache.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      tcCost: 1,
      discountType: "Flat",
      discountValue: "",
      validityDays: 350,
      totalUsageLimit: 0,
      perUserLimit: 0,
      minAccountAge: 0,
      minActivityRequired: 0,
      blockWarnedUsers: false,
      cooldownPeriod: 0,
      inventoryRequired: false,
      image: "",
      mechanism: "INTERNAL",
      rewardPillar: "INTERNAL",
      selectedRuleId: "",
      rewardMechanism: [],
      storeDiscountType: "FIXED_AMOUNT",
      storeCodePrefix: "THRICO-",
      storeMinCart: 0,
      customerLock: true,
      giftCardBrand: "Amazon Pay",
      giftCardValue: 500,
      giftCardFee: 25,
      url: "",
      howToClaim: "",
      couponType: "ONE_TO_ONE",
      couponCode: "",
      memberEligibility: "ALL",
      membershipTierId: [],
      eligibleTierIds: [],
      eligibleUserIds: [],
      showToAllMembers: true,
      isActive: true,
      status: "ACTIVE",
      expiryDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 350);
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().slice(0, 16);
      })(),
    },
    validationSchema: couponSchema,
    onSubmit: async (values) => {
      try {
        const tierIds = Array.isArray(values.membershipTierId)
          ? values.membershipTierId
          : values.membershipTierId
            ? [values.membershipTierId]
            : values.eligibleTierIds || [];

        await createReward({
          variables: {
            input: {
              title: values.title,
              description: values.description,
              howToClaim: values.howToClaim,
              tcCost: values.tcCost,
              expiryDays: Number(values.validityDays || 30),
              inventoryRequired: values.inventoryRequired,
              image: values.image,
              url: values.url,
              couponCode: values.couponCode,
              eligibility: {
                memberEligibility: values.memberEligibility || "ALL",
                membershipTierId: tierIds,
                eligibleTierIds: tierIds,
                eligibleUserIds: values.eligibleUserIds || [],
                totalUsageLimit: values.totalUsageLimit,
                perUserLimit: values.perUserLimit,
                minAccountAge: values.minAccountAge,
                minActivityRequired: values.minActivityRequired,
                blockWarnedUsers: values.blockWarnedUsers,
                cooldownPeriod: values.cooldownPeriod,
                showToAllMembers: values.showToAllMembers ?? true,
              },
              mechanism: {
                type:
                  values.rewardPillar === "ECOMMERCE" ||
                  values.mechanism === "ECOMMERCE"
                    ? "STORE_DISCOUNT"
                    : values.rewardPillar === "DIGITAL_GIFT_CARD" ||
                        values.mechanism === "DIGITAL_GIFT_CARD"
                      ? "DIGITAL_GIFT_CARD"
                      : "INTERNAL_VOUCHER",
                ruleId: values.selectedRuleId || null,
                manualBatchId:
                  values.rewardPillar === "INTERNAL" ||
                  values.mechanism === "INTERNAL"
                    ? values.selectedRuleId || null
                    : null,
                storeDiscountRuleId:
                  values.rewardPillar === "ECOMMERCE" ||
                  values.mechanism === "ECOMMERCE"
                    ? values.selectedRuleId || null
                    : null,
                digitalCardRuleId:
                  values.rewardPillar === "DIGITAL_GIFT_CARD" ||
                  values.mechanism === "DIGITAL_GIFT_CARD"
                    ? values.selectedRuleId || null
                    : null,
              },
              isActive: values.isActive,
              status: values.status,
              expiryDate: values.expiryDate || null,
            },
          },
        });
        // Invalidate and refetch rewards catalog cache
        client.cache.evict({ fieldName: "getRewards" });
        client.cache.evict({ fieldName: "getRewardStats" });
        client.cache.evict({ fieldName: "getPopularRewards" });
        client.cache.gc();
        await client.refetchQueries({
          include: ["GetRewards", "GetRewardStats", "GetPopularRewards"],
        });

        toast({
          title: "Reward Published",
          description: `${values.title} has been added to the catalog.`,
        });
        setSaved(true);
        setTimeout(() => {
          router.push("/gamification/rewards/coupons");
          router.refresh();
        }, 1200);
      } catch (err: any) {
        toast({
          title: "Failed to create reward",
          description: err.message,
          variant: "destructive",
        });
      }
    },
  });

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Create Reward Coupon"
        badgeText="Reward Studio"
        description="Design and publish coupon rewards redeemable by community members."
        icon={Ticket}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Coupons", href: "/gamification/rewards/coupons" },
          { label: "Create" },
        ]}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefreshCache}
            disabled={isRefreshing}
            className="h-8 px-3 text-xs font-medium gap-1.5 bg-card border-border shadow-2xs hover:bg-muted"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Cache"}</span>
          </Button>
        }
      />
      <EcosystemContainer className="h-full w-full border-none shadow-none bg-transparent p-0 ring-0">
        <PolarisFormLayout
          sidebar={<RewardPreviewSidebar formik={formik} showStrategy />}
        >
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <RewardFormSections formik={formik} />
          </form>
        </PolarisFormLayout>
      </EcosystemContainer>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Reward"
        description="You have pending changes to this reward configuration."
        buttonText="Publish Reward"
      />
    </EcosystemWrapper>
  );
}

"use client";

import React, { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CURRENCY_AUTOMATION_RULE,
  UPDATE_CURRENCY_AUTOMATION_RULE,
  GET_CURRENCY_AUTOMATION_RULES,
  CurrencyAutomationRule,
} from "@/graphql/gamification-automation";
import { CurrencyAutomationForm } from "@/components/gamification/currency/automation/currency-automation-form";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { Coins, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

function EditCurrencyAutomationRulePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, loading: fetching } = useQuery(GET_CURRENCY_AUTOMATION_RULE, {
    variables: { id },
    skip: !id,
    fetchPolicy: "network-only",
  });

  const [updateRule, { loading: updating }] = useMutation(
    UPDATE_CURRENCY_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_CURRENCY_AUTOMATION_RULES }],
    }
  );

  const initialValues: CurrencyAutomationRule | null = useMemo(() => {
    return data?.getCurrencyAutomationRule || null;
  }, [data]);

  const handleSave = async (input: any) => {
    try {
      await updateRule({
        variables: {
          id,
          input,
        },
      });
      toast.success("Currency automation rule updated successfully!");
      router.push("/gamification/currency/automation");
    } catch (err: any) {
      toast.error(err.message || "Failed to update currency rule.");
      throw err;
    }
  };

  const handleCancel = () => {
    router.push("/gamification/currency/automation");
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={
          initialValues
            ? `Edit "${initialValues.name}"`
            : "Edit Currency Automation Rule"
        }
        badgeText="Currency Engine"
        description="Update trigger events, balance milestone criteria, and reward pipelines."
        icon={Coins}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Currency", href: "/gamification/currency" },
          {
            label: "Automation",
            href: "/gamification/currency/automation",
          },
          { label: "Edit Rule" },
        ]}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Rules
          </Button>
        }
      />

      <EcosystemContainer className="py-2">
        {fetching ? (
          <div className="flex items-center justify-center p-16 text-muted-foreground gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Loading currency rule…
          </div>
        ) : initialValues ? (
          <CurrencyAutomationForm
            initialValues={initialValues}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={updating}
            isEdit={true}
          />
        ) : (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Currency rule not found.
          </div>
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withModulePermission(
  EditCurrencyAutomationRulePage,
  "CURRENCY",
  "canUpdate"
);

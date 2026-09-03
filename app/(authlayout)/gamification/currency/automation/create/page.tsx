"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import {
  CREATE_CURRENCY_AUTOMATION_RULE,
  GET_CURRENCY_AUTOMATION_RULES,
} from "@/graphql/gamification-automation";
import { CURRENCY_BLUEPRINTS } from "@/components/gamification/currency/automation/currency-blueprints";
import { CurrencyAutomationForm } from "@/components/gamification/currency/automation/currency-automation-form";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { Coins, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CreateCurrencyAutomationRuleContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blueprintId = searchParams.get("blueprint");

  const [initialDraft, setInitialDraft] = useState<any | null>(null);

  useEffect(() => {
    if (blueprintId) {
      const bp = CURRENCY_BLUEPRINTS.find((b) => b.id === blueprintId);
      if (bp) {
        setInitialDraft({
          id: "draft",
          name: bp.title,
          description: bp.description,
          trigger: bp.trigger,
          conditionOperator: bp.conditionOperator,
          conditions: bp.conditions,
          actions: bp.actions,
          isActive: true,
          priority: 1,
        });
      }
    }
  }, [blueprintId]);

  const [createRule, { loading }] = useMutation(
    CREATE_CURRENCY_AUTOMATION_RULE,
    {
      refetchQueries: [{ query: GET_CURRENCY_AUTOMATION_RULES }],
    },
  );

  const handleSave = async (input: any) => {
    try {
      await createRule({
        variables: { input },
      });
      toast.success("Currency automation rule created successfully!");
      router.push("/gamification/currency/automation");
    } catch (err: any) {
      toast.error(err.message || "Failed to create currency rule.");
      throw err;
    }
  };

  const handleCancel = () => {
    router.push("/gamification/currency/automation");
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Create Currency Automation Rule"
        badgeText="Currency Engine"
        description="Configure automated actions triggered by EC/TC earnings, conversions, balance milestones, or reward redemptions."
        icon={Coins}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Currency", href: "/gamification/currency" },
          {
            label: "Automation",
            href: "/gamification/currency/automation",
          },
          { label: "Create" },
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
        <CurrencyAutomationForm
          initialValues={initialDraft}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={loading}
          isEdit={false}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

function CreateCurrencyAutomationPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-muted-foreground">
          Loading rule builder…
        </div>
      }
    >
      <CreateCurrencyAutomationRuleContent />
    </Suspense>
  );
}

export default withModulePermission(
  CreateCurrencyAutomationPage,
  "CURRENCY",
  "canCreate",
);

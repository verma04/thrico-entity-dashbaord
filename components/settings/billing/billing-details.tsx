"use client";

import React from "react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { MapPin } from "lucide-react";
import BillingDetailsForm from "../general/billing-details-form";

export default function BillingDetails() {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Billing Details"
        description="Manage account type, tax information, and billing address for invoicing."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Billing Details" },
        ]}
        badgeText="Billing"
        icon={MapPin}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-4 space-y-8">
          <div className="max-w-4xl">
            <SectionCard
              icon={MapPin}
              title="Billing Details"
              description="Manage account type, tax information, and billing address for invoicing."
            >
              <div className="p-2">
                <BillingDetailsForm />
              </div>
            </SectionCard>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: any;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-start gap-3 px-5 py-4 border-b border-border bg-muted/30">
        <div className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
          <Icon size={13} strokeWidth={2} />
        </div>
        <div>
          <p className="text-[13.5px] font-semibold text-foreground leading-none">
            {title}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground leading-snug">
            {description}
          </p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

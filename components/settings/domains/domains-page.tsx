"use client";

import { Button } from "@/components/ui/button";
import {
  Globe,
  Lock,
  Zap,
  ArrowUpRight,
  Plus,
  ExternalLink,
} from "lucide-react";

import { ThricoDomain } from "./thrico-domain";
import { CustomDomain } from "./custom-domain";
import { AddDomain } from "./add-domain";
import Link from "next/link";
import { getCustomDomain } from "@/graphql/actions/domain";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Design Tokens
// ---------------------------------------------------------------------------
const STYLES = {
  card: "rounded-lg border border-border/50 bg-card",
  heading:
    "text-[14px] font-semibold tracking-tight text-foreground leading-none",
  subtext: "text-[12px] text-muted-foreground font-medium leading-none",
};

export const DomainsPage = () => {
  const { data: domainData } = getCustomDomain();
  const hasCustomDomain = !!domainData?.getCustomDomain?.id;

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Domains"
        description="Configure your workspace identity, manage DNS records, and secure your traffic with automated TLS."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Domains" },
        ]}
        icon={Globe}
        badgeText="Infrastructure"
        showLiveIndicator={false}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-8 space-y-8">
          {/* Main Provisioning Card (Empty State or Upsell) */}
          {!hasCustomDomain && (
            <div className={cn(STYLES.card, "overflow-hidden")}>
              <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between gap-4 bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground  flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4 text-white " />
                  </div>
                  <div>
                    <h2 className={STYLES.heading}>Domain Provisioning</h2>
                    <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                      Set up your custom namespace
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AddDomain />
                  <Link
                    href="https://www.godaddy.com/domains/searchresults.aspx?domainToCheck=yourdomain"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="ghost"
                      className="h-8 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground gap-1.5"
                    >
                      Buy Domain
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <p className="text-[13px] text-muted-foreground leading-relaxed max-w-2xl font-medium">
                  Connect a domain you already own or procure a new one. A custom
                  domain ensures your brand remains consistent and trusted by your
                  global user base.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FeatureCard
                    icon={Globe}
                    iconColor="text-muted-foreground"
                    title="DNS Resolution"
                    desc="Edge-weighted resolution for main domains and subdomains."
                  />
                  <FeatureCard
                    icon={Lock}
                    iconColor="text-muted-foreground"
                    title="TLS Encryption"
                    desc="Automated provisioning of managed TLS certificates."
                  />
                  <FeatureCard
                    icon={Zap}
                    iconColor="text-muted-foreground"
                    title="Edge Delivery"
                    desc="Global Anycast network for sub-millisecond traffic routing."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Domains List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                Active Domains
              </p>
              <span className="text-[10px] font-bold text-muted-foreground tabular-nums uppercase tracking-widest">
                {hasCustomDomain ? "2" : "1"} Total
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <ThricoDomain />
              <CustomDomain />
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

const FeatureCard = ({ icon: Icon, iconColor, title, desc }: any) => (
  <div className="p-4 rounded-lg bg-card border border-border/50 space-y-3 transition-colors hover:bg-muted/50">
    <div className="flex items-center gap-2">
      <div className="h-7 w-7 rounded-md bg-muted border border-border/50 flex items-center justify-center shrink-0">
        <Icon className={cn("h-3.5 w-3.5", iconColor)} />
      </div>
      <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
        {title}
      </span>
    </div>
    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
      {desc}
    </p>
  </div>
);

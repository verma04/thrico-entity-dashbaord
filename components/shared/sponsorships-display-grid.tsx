"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { getMediaUrl } from "@/utils/utils";

export interface Sponsor {
  id: string;
  sponsorName: string;
  sponsorLogo?: string;
  sponsorUrl?: string;
}

export interface SponsorshipTier {
  id: string;
  sponsorType: string;
  sponsors: Sponsor[];
}

interface SponsorshipsDisplayGridProps {
  sponsorships: SponsorshipTier[];
  title?: string;
  className?: string;
}

export function SponsorshipsDisplayGrid({
  sponsorships,
  title = "Sponsors",
  className = "",
}: SponsorshipsDisplayGridProps) {
  // Only show tiers that have at least one approved/active sponsor if needed
  // Here we just show what's passed in.
  const activeTiers = sponsorships.filter(
    (tier) => tier.sponsors && tier.sponsors.length > 0
  );

  if (activeTiers.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="flex flex-wrap gap-x-12 gap-y-10">
        {activeTiers.map((tier) => (
          <div key={tier.id} className="flex flex-col space-y-3">
            <h3 className="font-bold text-sm text-foreground text-center">
              {tier.sponsorType}
            </h3>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {tier.sponsors.map((sponsor) => {
                const logoSrc = sponsor.sponsorLogo?.startsWith("http")
                  ? sponsor.sponsorLogo
                  : sponsor.sponsorLogo
                  ? (getMediaUrl(sponsor.sponsorLogo) || "")
                  : null;

                const CardContent = (
                  <div className="group relative flex items-center justify-center w-40 h-20 bg-[#F5F5F5] border border-transparent hover:border-border/60 rounded-md transition-all duration-300 p-4">
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={sponsor.sponsorName}
                        className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <span className="font-bold text-muted-foreground text-center line-clamp-2">
                        {sponsor.sponsorName}
                      </span>
                    )}
                    {sponsor.sponsorUrl && (
                      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );

                if (sponsor.sponsorUrl) {
                  return (
                    <a
                      key={sponsor.id}
                      href={sponsor.sponsorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block shrink-0"
                      title={sponsor.sponsorName}
                    >
                      {CardContent}
                    </a>
                  );
                }

                return (
                  <div key={sponsor.id} className="shrink-0" title={sponsor.sponsorName}>
                    {CardContent}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

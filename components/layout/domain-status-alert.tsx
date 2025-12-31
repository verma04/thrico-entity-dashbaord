"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, AlertTriangle } from "lucide-react";
// Adjust import path if needed aliases are usually @/
import Link from "next/link";
import { getCustomDomain } from "@/graphql/actions/domain";

export default function DomainStatusAlert() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { data, loading } = getCustomDomain();

  const domain = data?.getCustomDomain;

  // Logic to determine if we should show the alert
  // Show if:
  // 1. Data is loaded
  // 2. We have a domain
  // 3. The domain is NOT verified
  const shouldShow = useMemo(() => {
    if (loading || !domain) return false;
    // If domain exists but is not verified, show alert
    // If check logic needs to be more complex (e.g. DNS issues), add here
    return !domain.isVerified;
  }, [loading, domain]);

  if (!shouldShow) return null;

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    // Positioning it above the TrialBanner if both exist, or similar position.
    // Using bottom-5 right-5 might overlap if TrialBanner is there.
    // Maybe stack them? specific offset?
    // For now, let's put it at fixed bottom-5 left-5 to avoid collision or stack vertically.
    // The requirement said "hightlisght that your cutsom domain or things... like system erro elert".
    // A bottom-right stack is common. TrialBanner is bottom-5 right-5.
    // Let's put this one slightly higher or on the left.
    // Let's try bottom-5 left-5 for now to differentiate "System/Config" (left) vs "Marketing/Trial" (right).
    <div className="fixed bottom-5 right-5 w-full max-w-sm z-[20]">
      <Card
        className={`overflow-hidden bg-white border border-amber-200 shadow-xl transition-all duration-300 ${
          isExpanded ? "shadow-amber-100/50" : "shadow-gray-200/50"
        }`}
      >
        <div
          className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-b border-amber-100 p-4 cursor-pointer group"
          onClick={toggleExpand}
        >
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 border border-amber-200">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-amber-700/80 text-xs font-medium uppercase tracking-wide">
                  System Alert
                </p>
                <p className="text-gray-900 text-sm font-semibold">
                  Domain Verification Pending
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50 hover:bg-white transition-colors border border-amber-100">
              {isExpanded ? (
                <ChevronDown className="text-amber-600 w-5 h-5" />
              ) : (
                <ChevronUp className="text-amber-600 w-5 h-5" />
              )}
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <div
          className={`bg-white overflow-hidden transition-all duration-300 ease-out ${
            isExpanded ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-5">
            <p className="text-gray-600 text-sm mb-4">
              Your custom domain <strong>{domain?.domain}</strong> is not yet
              verified. features may be limited until DNS records are
              propagated.
            </p>

            <Link href={"/settings/domains"}>
              <Button
                variant="outline"
                className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
              >
                Verify Domain
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

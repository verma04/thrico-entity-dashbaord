"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useTriggerCRMSync,
  CRMProvider,
  CRMSyncType,
  CRM_PROVIDERS_CONFIG,
} from "@/graphql/actions";

export default function CRMCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [triggerSync] = useTriggerCRMSync();

  const [status, setStatus] = useState("Finalizing CRM connection...");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const connectedProvider = searchParams.get(
      "connected",
    ) as CRMProvider | null;
    const error =
      searchParams.get("error") || searchParams.get("error_description");
    const message = searchParams.get("message");

    if (error) {
      setIsSuccess(false);
      setStatus("CRM connection failed");
      toast.error("Failed to connect CRM", {
        description:
          error || message || "Authentication was rejected or timed out.",
      });
      setTimeout(() => {
        router.push("/settings/integrations");
      }, 2500);
      return;
    }

    if (connectedProvider) {
      const config = CRM_PROVIDERS_CONFIG[connectedProvider];
      const providerName = config?.name || connectedProvider;

      setIsSuccess(true);
      setStatus(`${providerName} connected successfully!`);
      toast.success(`${providerName} has been connected!`);

      // Trigger initial sync in background
      try {
        triggerSync({
          variables: {
            provider: connectedProvider,
            syncType: CRMSyncType.INITIAL,
            async: true,
          },
        }).catch((err) => {
          console.warn("Initial CRM sync background trigger warning:", err);
        });
      } catch (e) {
        console.warn("Sync error:", e);
      }

      setTimeout(() => {
        router.push("/settings/integrations");
      }, 1500);
      return;
    }

    // Default fallback
    router.push("/settings/integrations");
  }, [searchParams, router, triggerSync]);

  return (
    <div className="flex h-[75vh] w-full flex-col items-center justify-center space-y-4 text-center px-4">
      {isSuccess === true ? (
        <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="h-6 w-6" />
        </div>
      ) : isSuccess === false ? (
        <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center animate-in zoom-in-75 duration-300">
          <AlertCircle className="h-6 w-6" />
        </div>
      ) : (
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      )}

      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {status}
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          {isSuccess === false
            ? "Redirecting back to integrations settings..."
            : "Completing authorization and preparing initial data synchronization..."}
        </p>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCheckWhatsAppTemplateStatus } from "@/graphql/actions/settings/whatsapp";

interface CheckTemplateStatusButtonProps {
  templateId: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  onStatusUpdated?: (status: string) => void;
}

export function CheckTemplateStatusButton({
  templateId,
  className = "",
  size = "sm",
  onStatusUpdated,
}: CheckTemplateStatusButtonProps) {
  const [checkStatus, { loading }] = useCheckWhatsAppTemplateStatus({
    onCompleted(data) {
      const status = data.checkWhatsAppTemplateStatus.status;
      toast.success(`Template status updated: ${status}`);
      onStatusUpdated?.(status);
    },
    onError(err) {
      toast.error(`Status check failed: ${err.message}`);
    },
  });

  return (
    <Button
      variant="outline"
      size={size}
      disabled={loading}
      onClick={(e) => {
        e.stopPropagation();
        checkStatus({ variables: { templateId } });
      }}
      className={`gap-1.5 text-xs ${className}`}
    >
      <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
      Verify Status
    </Button>
  );
}

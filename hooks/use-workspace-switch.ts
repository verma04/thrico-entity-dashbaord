"use client";

import * as React from "react";
import { useSwitchToOtherAccount } from "@/graphql/actions";
import { useWorkspaceStore } from "@/store/store";
import { toast } from "sonner";

export function useWorkspaceSwitch() {
  const [mutate] = useSwitchToOtherAccount();
  const { isSwitching, targetName, setIsSwitching } = useWorkspaceStore();

  const handleSwitch = async (entityId: string, name: string) => {
    setIsSwitching(true, name);

    try {
      const { data } = await mutate({
        variables: { entityId },
      });

      if (data?.switchToOtherAccount?.token) {
        // Slack-style pause before redirection for better feel
        setTimeout(() => {
          window.location.href = `/auth/callback?code=${data.switchToOtherAccount.token}`;
        }, 1500);
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      setIsSwitching(false);
      toast.error("Account switch failed", {
        description: "Please try again or contact support if the issue persists.",
      });
    }
  };

  return {
    isSwitching,
    targetName,
    handleSwitch,
  };
}

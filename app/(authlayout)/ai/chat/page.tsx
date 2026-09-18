"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetAiWalletOverview } from "@/graphql/actions/ai";

export default function AIChatRootPage() {
  const router = useRouter();
  const { data, loading } = useGetAiWalletOverview();

  useEffect(() => {
    if (loading) return;
    const balance = data?.getAiWalletOverview?.quota?.balance;
    if (balance !== undefined && balance <= 0) {
      router.replace("/ai/usage?insufficient_balance=true");
    } else {
      router.replace("/ai/chat/new");
    }
  }, [data, loading, router]);

  return null;
}

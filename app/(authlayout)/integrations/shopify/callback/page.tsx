"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCallbackShopify } from "@/graphql/actions";

export default function ShopifyCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [callbackShopify] = useCallbackShopify();
  const [status, setStatus] = useState("Connecting your Shopify store...");

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    
    const code = searchParams.get("code");
    const shop = searchParams.get("shop");

    if (!code || !shop) {
      toast.error("Invalid callback from Shopify");
      router.push("/settings/integrations");
      return;
    }
    
    hasRun.current = true;

    const processCallback = async () => {
      try {
        await callbackShopify({
          variables: {
            shopDomain: shop,
            code: code,
          },
        });
        toast.success("Successfully connected to Shopify!");
        router.push("/settings/integrations");
      } catch (error: any) {
        toast.error(error.message || "Failed to finalize Shopify connection");
        setStatus("Failed to connect. Redirecting...");
        setTimeout(() => router.push("/settings/integrations"), 3000);
      }
    };

    processCallback();
  }, [searchParams, router, callbackShopify]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <h2 className="text-xl font-semibold tracking-tight">{status}</h2>
      <p className="text-sm text-muted-foreground">
        Please wait while we verify your connection. You will be redirected
        shortly.
      </p>
    </div>
  );
}

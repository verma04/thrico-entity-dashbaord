"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function GoogleMeetCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "true") {
      toast.success("Google Meet successfully connected!");
    } else if (error) {
      toast.error("Failed to connect Google Meet", {
        description: error,
      });
    }

    // Redirect back to integrations page
    router.push("/settings/integrations");
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-4 text-sm text-muted-foreground">
        Completing Google Meet connection...
      </p>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsMarketingWhatsspTypoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/marketing/whatsapp");
  }, [router]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <span className="h-4 w-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span>Redirecting to WhatsApp Marketing Hub...</span>
      </div>
    </div>
  );
}

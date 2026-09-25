"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SettingsMarketingWhatsAppSubrouteRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const slug = params?.slug;
    const subpath = Array.isArray(slug) ? slug.join("/") : slug || "";
    router.replace(`/marketing/whatsapp/${subpath}`);
  }, [router, params]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <span className="h-4 w-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
        <span>Redirecting to WhatsApp Marketing Hub...</span>
      </div>
    </div>
  );
}

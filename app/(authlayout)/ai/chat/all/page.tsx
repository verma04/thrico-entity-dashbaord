"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AllChatsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/ai/chat");
  }, [router]);

  return null;
}

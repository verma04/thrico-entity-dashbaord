"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AutomationRedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/members/automation");
  }, [router]);

  return null;
};

export default AutomationRedirectPage;

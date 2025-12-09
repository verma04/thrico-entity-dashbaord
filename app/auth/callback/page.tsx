"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useTokenStore } from "@/store/store";

const Auth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("code");
  const path = searchParams.get("path");
  const storeToken = useTokenStore((state) => state.storeToken);

  useEffect(() => {
    if (token) {
      storeToken(token.replaceAll(" ", "+"));
      router.push(path ?? "/");
    } else {
      router.push("/login");
    }
  }, [token, path, storeToken, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <Loader2Icon
        size={48}
        className="animate-spin text-gray-500 mb-4"
        aria-label="Loading"
        role="status"
      />
      <div className="text-center">
        <div>Just a moment,</div>
        <div>we&apos;re setting things up...</div>
      </div>
    </div>
  );
};

export default Auth;

"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppLoading from "@/components/layout/loading";
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
      if (searchParams.get("choose-plan") !== null) {
        router.push("/?choose-plan");
      } else {
        router.push(path ?? "/");
      }
    } else {
      router.push("/login");
    }
  }, [token, path, storeToken, router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <AppLoading />
      <div className="text-center">
        <div>Just a moment,</div>
        <div>we&apos;re setting things up...</div>
      </div>
    </div>
  );
};

export default Auth;

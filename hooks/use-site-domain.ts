"use client";

import { useMemo } from "react";
import { getCustomDomain, getThricoDomain } from "@/graphql/actions/domain";

export function useSiteDomain() {
  const { data: thricoData, loading: thricoLoading } = getThricoDomain();
  const { data: customData, loading: customLoading } = getCustomDomain();

  const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "thrico.community";

  const hasThricoDomain = Boolean(thricoData?.getThricoDomain?.domain);
  const hasCustomDomain = Boolean(customData?.getCustomDomain?.domain);

  const thricoDomain = thricoData?.getThricoDomain?.domain || "";
  const customDomain = customData?.getCustomDomain?.domain || "";

  const thricoDomainUrl = hasThricoDomain
    ? `https://${thricoDomain}.${NEXT_PUBLIC_SITE_URL}`
    : null;

  const customDomainUrl = hasCustomDomain
    ? `https://${customDomain}`
    : null;

  // Primary URL: prefers custom domain if configured, else thrico subdomain, else fallback
  const primaryUrl = useMemo(() => {
    if (customDomainUrl) return customDomainUrl;
    if (thricoDomainUrl) return thricoDomainUrl;
    return `https://${NEXT_PUBLIC_SITE_URL}`;
  }, [customDomainUrl, thricoDomainUrl, NEXT_PUBLIC_SITE_URL]);

  const domainHost = useMemo(() => {
    if (hasCustomDomain) return customDomain;
    if (hasThricoDomain) return `${thricoDomain}.${NEXT_PUBLIC_SITE_URL}`;
    return NEXT_PUBLIC_SITE_URL;
  }, [hasCustomDomain, customDomain, hasThricoDomain, thricoDomain, NEXT_PUBLIC_SITE_URL]);

  const getDestinationUrl = useMemo(() => {
    return (type: "SIGNUP" | "LOGIN" | "CUSTOM", customBaseUrl?: string) => {
      const base = (customBaseUrl || primaryUrl).replace(/\/+$/, "");
      if (type === "SIGNUP") return `${base}/auth/signup`;
      if (type === "LOGIN") return `${base}/auth/login`;
      return `${base}/`;
    };
  }, [primaryUrl]);

  return {
    loading: thricoLoading || customLoading,
    hasThricoDomain,
    hasCustomDomain,
    thricoDomain,
    customDomain,
    thricoDomainUrl,
    customDomainUrl,
    primaryUrl,
    domainHost,
    getDestinationUrl,
  };
}

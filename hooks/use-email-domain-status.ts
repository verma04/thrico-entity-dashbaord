import { useGetEmailDomain, EmailDomain } from "@/graphql/actions/email";

export interface EmailDomainStatus {
  domain: EmailDomain | null | undefined;
  loading: boolean;
  refetch: () => void;
  isConfigured: boolean;
  isVerified: boolean;
  isPending: boolean;
  isFailed: boolean;
  status: "pending" | "verified" | "failed" | null;
}

export function useEmailDomainStatus(): EmailDomainStatus {
  const { data, loading, refetch } = useGetEmailDomain();
  const domain = data?.getEmailDomain ?? null;
  const isConfigured = !!domain && !!domain.domain;
  const isVerified = domain?.status === "verified";
  const isPending = domain?.status === "pending";
  const isFailed = domain?.status === "failed";
  const status = domain?.status ?? null;

  return {
    domain,
    loading,
    refetch,
    isConfigured,
    isVerified,
    isPending,
    isFailed,
    status,
  };
}

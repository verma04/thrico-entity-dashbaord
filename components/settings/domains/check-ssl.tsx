"use client";
import { Spinner } from "@/components/ui/spinner";
import { checkSSl } from "@/graphql/actions/domain";

interface CheckSslProps {
  ssl: boolean;
}

export const CheckSsl = ({ ssl }: CheckSslProps) => {
  const { data } = checkSSl({
    pollInterval: 10000,
  });

  if (ssl) return null;

  return (
    <div className="flex items-center gap-2">
      <Spinner className="h-4 w-4" />
      <span className="text-sm text-muted-foreground">Generating SSL...</span>
    </div>
  );
};

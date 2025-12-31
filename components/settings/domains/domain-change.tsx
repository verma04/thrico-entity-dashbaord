"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCheckDomain, useChangeEntityDomain } from "@/graphql/actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DomainChange() {
  const [isOpen, setIsOpen] = useState(false);
  const [domain, setDomain] = useState("");

  const {
    loading: checkLoading,
    refetch,
    error,
  } = useCheckDomain({
    variables: {
      input: { domain },
    },
    skip: !domain,
  });

  const [changeDomain, { loading: changeLoading }] = useChangeEntityDomain({
    onCompleted: (data: any) => {
      if (data?.changeEntityDomain?.success) {
        toast.success("Domain updated successfully");
        setIsOpen(false);
        setDomain("");
      } else {
        toast.error("Failed to update domain");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update domain");
    },
  });

  useEffect(() => {
    if (domain) {
      const timer = setTimeout(() => {
        refetch({ input: { domain } });
      }, 500); // Debounce domain check
      return () => clearTimeout(timer);
    }
  }, [domain, refetch]);

  const isDomainAvailable = useMemo(() => {
    return domain && !error && !checkLoading;
  }, [domain, error, checkLoading]);

  const isDomainTaken = useMemo(() => {
    return domain && error && !checkLoading;
  }, [domain, error, checkLoading]);

  const handleSubmit = () => {
    changeDomain({
      variables: {
        input: {
          domain: domain,
        },
      },
    });
  };

  const handleDomainChange = (value: string) => {
    let sanitized = value.toLowerCase();
    sanitized = sanitized.replace(/\s+/g, "-"); // spaces → hyphen
    sanitized = sanitized.replace(/[^a-z0-9-]/g, ""); // allowed chars only
    setDomain(sanitized);
  };

  const fullDomain = domain ? `https://${domain}.thrico.community` : "";

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        Change Domain
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change to a new domain</DialogTitle>
            <DialogDescription>
              You can only change this domain name once. Your original
              thrico.community domain will still be visible in your admin.
            </DialogDescription>
          </DialogHeader>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              There is no cost to make this change.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-muted-foreground">
                https://
              </div>
              <Input
                placeholder="mydomain"
                value={domain}
                onChange={(e) => handleDomainChange(e.target.value)}
                className="flex-1"
              />
              <div className="text-sm font-medium text-muted-foreground">
                .thrico.community
              </div>
            </div>

            {/* Availability Status */}
            <div>
              {checkLoading && domain && (
                <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Checking availability...
                </div>
              )}

              {isDomainAvailable && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                  <span className="text-green-700 dark:text-green-400">
                    {fullDomain} is available!
                  </span>
                </div>
              )}

              {isDomainTaken && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-destructive">
                    {fullDomain} is already taken
                  </span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !domain || !isDomainAvailable || checkLoading || changeLoading
              }
            >
              {changeLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

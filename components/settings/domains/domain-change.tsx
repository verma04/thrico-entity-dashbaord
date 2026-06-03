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
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="h-8 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground border-border/50 hover:bg-muted shadow-none transition-all"
      >
        Change Domain
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border/50 rounded-lg shadow-none">
          <div className="px-6 py-5 border-b border-border/50 bg-muted/30">
            <DialogHeader>
              <DialogTitle className="text-[15px] font-semibold text-foreground tracking-tight">
                Update subdomain
              </DialogTitle>
              <DialogDescription className="text-[12px] text-muted-foreground mt-1 font-medium">
                You can change your default system domain once. This will update your public URL.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 border border-border/50">
              <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-[11px] font-semibold text-muted-foreground">
                There is no overhead cost for this migration.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="text-[12px] font-mono text-muted-foreground/50 select-none">
                  https://
                </div>
                <Input
                  placeholder="mydomain"
                  value={domain}
                  onChange={(e) => handleDomainChange(e.target.value)}
                  className="flex-1 h-10 border-border/50 focus:border-foreground focus:ring-0 rounded-md text-[13px] font-mono shadow-none transition-all"
                />
                <div className="text-[12px] font-mono text-muted-foreground/50 select-none">
                  .thrico.community
                </div>
              </div>

              {/* Availability Status */}
              <div className="min-h-[40px]">
                {checkLoading && domain && (
                  <div className="flex items-center gap-2 px-1 text-[11px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Checking...
                  </div>
                )}

                {isDomainAvailable && (
                  <div className="flex items-center gap-2.5 p-3 rounded-md bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                      Available: <span className="lowercase font-mono ml-1">{fullDomain}</span>
                    </span>
                  </div>
                )}

                {isDomainTaken && (
                  <div className="flex items-center gap-2.5 p-3 rounded-md bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20">
                    <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                    <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                      Taken: <span className="lowercase font-mono ml-1">{domain}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-2 pt-4 border-t border-border/50">
              <Button 
                variant="ghost" 
                onClick={() => setIsOpen(false)}
                className="h-9 px-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !domain || !isDomainAvailable || checkLoading || changeLoading
                }
                className="h-9 px-6 text-[11px] font-bold uppercase tracking-wider bg-slate-900 dark:bg-slate-100 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900 gap-2 rounded-md transition-all active:scale-[0.98]"
              >
                {changeLoading && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                Update Domain
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

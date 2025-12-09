"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Link2,
  Upload,
  Shield,
  ExternalLink,
} from "lucide-react";
import { useCheckDomain } from "@/graphql/actions";
import LogoUpload from "./logo-upload";
import KycFooter from "./kyc-footer";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { generateSlug } from "random-word-slugs";

interface KycDomainProps {
  setCurrent: (step: number) => void;
  domain: string;
  setDomain: (domain: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  logo: File | null;
  setLogo: (file: File) => void;
  logoPreview: string;
  setLogoPreview: (preview: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const KycDomain: React.FC<KycDomainProps> = ({
  domain,
  setDomain,
  setLogo,
  logoPreview,
  setLogoPreview,
}) => {
  const [agreement, setAgreement] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

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

  const generateSuggestions = () => {
    const newSuggestions = Array.from({ length: 3 }, () =>
      generateSlug(3, { format: "kebab" })
    );
    setSuggestions(newSuggestions);
  };

  const handleDomainChange = (value: string) => {
    let sanitized = value;
    sanitized = sanitized.replace(/\s+/g, "-"); // spaces → hyphen
    sanitized = sanitized.replace(/[^a-zA-Z0-9-]/g, ""); // allowed chars only
    sanitized = sanitized.replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens
    sanitized = sanitized.replace(/-{2,}/g, "-"); // multiple hyphens → single
    setDomain(sanitized.toLowerCase());
  };

  const fullDomain = domain ? `https://${domain}.thrico.community` : "";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-2xl mx-auto flex flex-col gap-6 mt-8"
    >
      {/* Logo Upload Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Brand Identity</h3>
        </div>
        <LogoUpload
          setCover={setLogo}
          imageUrl={logoPreview}
          setImageUrl={setLogoPreview}
        />
        <p className="text-sm text-muted-foreground">
          Upload your organization's logo (recommended: square image, min
          200x200px)
        </p>
      </motion.div>

      {/* Domain Selection Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Link2 className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Choose Your Domain</h3>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium flex items-center gap-2">
              Subdomain *
              <Badge variant="secondary" className="text-xs font-normal">
                Permanent
              </Badge>
            </label>

            <div className="flex gap-2 items-center bg-muted/30 p-1 rounded-lg border">
              <span className="text-sm text-muted-foreground pl-3 font-mono">
                https://
              </span>

              <Input
                type="text"
                value={domain}
                placeholder="your-community-name"
                className="flex-1 border-0 bg-background shadow-none focus-visible:ring-1"
                onChange={(e) => handleDomainChange(e.target.value)}
                maxLength={63}
              />

              <span className="text-sm text-muted-foreground pr-3 font-mono">
                .thrico.community
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Choose a unique subdomain for your community (letters, numbers,
              and hyphens only)
            </p>
          </div>

          {/* Domain Status */}
          <AnimatePresence mode="wait">
            {checkLoading && domain && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border"
              >
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Checking availability...
                </span>
              </motion.div>
            )}

            {isDomainAvailable && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Domain is available!
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500 font-mono truncate">
                    {fullDomain}
                  </p>
                </div>
              </motion.div>
            )}

            {isDomainTaken && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-destructive">
                      Domain is already taken
                    </p>
                    <p className="text-xs text-destructive/80 font-mono truncate">
                      {fullDomain}
                    </p>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      Try these suggestions:
                    </p>
                    <button
                      type="button"
                      onClick={generateSuggestions}
                      className="text-xs text-primary hover:underline"
                    >
                      Generate more
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.length === 0 && generateSuggestions()}
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setDomain(suggestion)}
                        className="px-3 py-1.5 text-xs font-mono bg-muted hover:bg-accent rounded-md transition-colors border"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Character count */}
          {domain && (
            <div className="flex justify-end">
              <span
                className={cn(
                  "text-xs text-muted-foreground",
                  domain.length > 50 && "text-orange-500",
                  domain.length > 60 && "text-destructive"
                )}
              >
                {domain.length}/63 characters
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Agreement Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Terms & Conditions</h3>
        </div>

        <div
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg border transition-colors",
            agreement
              ? "bg-primary/5 border-primary/20"
              : "bg-muted/30 border-border"
          )}
        >
          <Checkbox
            id="agreement"
            checked={agreement}
            onCheckedChange={(checked) => setAgreement(Boolean(checked))}
            className="mt-0.5"
          />
          <label
            htmlFor="agreement"
            className="text-sm leading-relaxed cursor-pointer flex-1"
          >
            I have read and accept the{" "}
            <a
              href="https://thrico.com/privacy-policy/"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline font-medium inline-flex items-center gap-1"
            >
              Terms of Service and Privacy Policy
              <ExternalLink className="h-3 w-3" />
            </a>
          </label>
        </div>

        {!agreement && (
          <p className="text-xs text-muted-foreground italic">
            Please accept the terms to continue
          </p>
        )}
      </motion.div>

      {/* Actions */}
      <KycFooter disabled={!agreement || !isDomainAvailable || !logoPreview} />
    </motion.div>
  );
};

export default React.memo(KycDomain);

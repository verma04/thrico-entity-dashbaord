"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useGetEmailOverview,
  useGetEmailTemplates,
  useSendEmail,
  useGetEmailDomain,
  useGetEmailUserGroups,
} from "@/graphql/actions/email";

import { StepIndicator } from "./send-email/step-indicator";
import { TemplateSelector } from "./send-email/template-selector";
import { RecipientManager } from "./send-email/recipient-manager";
import { ContentRefinement } from "./send-email/content-refinement";
import { FinalDeployment } from "./send-email/final-deployment";
import { InfrastructureSidebar } from "./send-email/infrastructure-sidebar";
import { RecipientMode } from "./send-email/types";

export default function SendEmail() {
  const router = useRouter();

  const { data: overviewData } = useGetEmailOverview();
  const { data: templatesData, loading: templatesLoading } =
    useGetEmailTemplates();
  const { data: domainData } = useGetEmailDomain();
  const [sendEmail, { loading: isSending }] = useSendEmail();
  const { data: userGroupsData, loading: userGroupsLoading } =
    useGetEmailUserGroups();

  const [step, setStep] = useState(0);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [recipientMode, setRecipientMode] = useState<RecipientMode>("manual");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [subject, setSubject] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const templates = useMemo(
    () => templatesData?.getEmailTemplates || [],
    [templatesData],
  );
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId),
    [templates, selectedTemplateId],
  );
  const domain = domainData?.getEmailDomain;
  const isDomainVerified = domain?.status === "verified";
  const usage = overviewData?.getEmailOverview?.usage;
  const remainingQuota = usage ? usage.remaining : 0;
  const userGroups = userGroupsData?.getEmailUserGroups || [];

  const totalRecipientCount = useMemo(() => {
    let count = 0;
    recipients.forEach((item) => {
      if (item.startsWith("GROUP:")) {
        const groupName = item.split("GROUP:")[1];
        const group = userGroups.find((g) => g.name === groupName);
        if (group) {
          count += group.count;
        }
      } else {
        count += 1;
      }
    });
    return count;
  }, [recipients, userGroups]);

  const checks = [
    {
      label: "Sender Domain",
      ok: isDomainVerified,
      message: isDomainVerified
        ? `Verified — noreply@${domain?.domain}`
        : "Domain not verified",
    },
    {
      label: "Email Credits",
      ok: remainingQuota >= totalRecipientCount && totalRecipientCount > 0,
      message:
        remainingQuota >= totalRecipientCount
          ? `${totalRecipientCount} recipients within quota`
          : "Exceeds your remaining quota",
    },
    {
      label: "Template",
      ok: !!selectedTemplateId,
      message: !!selectedTemplateId
        ? "Template selected"
        : "No template chosen",
    },
    {
      label: "Recipients",
      ok: totalRecipientCount > 0,
      message:
        totalRecipientCount > 0
          ? `${totalRecipientCount} recipients added`
          : "No recipients added",
    },
  ];

  const addEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email address.");
      return;
    }
    if (recipients.includes(email)) {
      toast.error("Email already in list.");
      return;
    }
    setRecipients([...recipients, email]);
    setEmailInput("");
  };

  const handleSend = async () => {
    if (!selectedTemplateId || !subject || totalRecipientCount === 0) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (totalRecipientCount > remainingQuota) {
      toast.error("Recipient count exceeds your remaining quota.");
      return;
    }
    try {
      const { data } = await sendEmail({
        variables: { templateId: selectedTemplateId!, to: recipients, subject },
      });
      if (data?.sendEmail.success) {
        toast.success("Email campaign sent successfully.");
        router.push("/email/usage");
      } else {
        toast.error(data?.sendEmail.message || "Failed to send campaign.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  const canProceed = () => {
    if (step === 0) return !!selectedTemplateId;
    if (step === 1)
      return totalRecipientCount > 0 && totalRecipientCount <= remainingQuota;
    if (step === 2) return !!subject;
    return true;
  };

  const stepNames = ["Template", "Recipients", "Subject", "Review"];

  return (
    <div className="max-w-6xl mx-auto w-full py-8 px-6 space-y-8 animate-in fade-in duration-500">
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Step Indicator */}
          <div className="bg-card rounded-2xl border border-border/50 p-5">
            <StepIndicator currentStep={step} steps={stepNames} />
          </div>

          {/* Step Content */}
          <div className="min-h-[420px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="template"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <TemplateSelector
                    templates={templates}
                    selectedTemplateId={selectedTemplateId}
                    onSelect={(id, sub) => {
                      setSelectedTemplateId(id);
                      setSubject(sub);
                    }}
                    loading={templatesLoading}
                  />
                </motion.div>
              )}
              {step === 1 && (
                <motion.div
                  key="recipients"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <RecipientManager
                    recipients={recipients}
                    setRecipients={setRecipients}
                    recipientMode={recipientMode}
                    setRecipientMode={setRecipientMode}
                    emailInput={emailInput}
                    setEmailInput={setEmailInput}
                    addEmail={addEmail}
                    userGroups={userGroups}
                    userGroupsLoading={userGroupsLoading}
                    remainingQuota={remainingQuota}
                    totalRecipientCount={totalRecipientCount}
                  />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div
                  key="subject"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <ContentRefinement
                    subject={subject}
                    setSubject={setSubject}
                    selectedTemplate={selectedTemplate || null}
                  />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <FinalDeployment
                    checks={checks}
                    selectedTemplate={selectedTemplate || null}
                    recipientsCount={totalRecipientCount}
                    isDomainVerified={isDomainVerified}
                    domain={domain || null}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={cn(
                "flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold transition-all border",
                step === 0
                  ? "opacity-30 cursor-not-allowed border-border/50 bg-card text-muted-foreground/80"
                  : "border-border/50 bg-card text-foreground/90 hover:bg-muted",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={cn(
                  "flex items-center gap-2 h-11 px-8 rounded-xl text-sm font-semibold transition-all",
                  canProceed()
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-black dark:hover:bg-white shadow-sm"
                    : "bg-muted/50 text-muted-foreground/80 border border-border/50 cursor-not-allowed",
                )}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={
                  !isDomainVerified ||
                  totalRecipientCount === 0 ||
                  totalRecipientCount > remainingQuota
                }
                className={cn(
                  "flex items-center gap-2 h-11 px-8 rounded-xl text-sm font-semibold transition-all",
                  !isDomainVerified ||
                    totalRecipientCount === 0 ||
                    totalRecipientCount > remainingQuota
                    ? "bg-muted/50 text-muted-foreground/80 border border-border/50 cursor-not-allowed"
                    : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-black dark:hover:bg-white shadow-sm",
                )}
              >
                Send Campaign
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 hidden lg:block">
          <InfrastructureSidebar
            usage={usage || null}
            remainingQuota={remainingQuota}
          />
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm p-6"
            onClick={() => !isSending && setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 10 }}
              className="bg-card rounded-3xl shadow-xl max-w-md w-full overflow-hidden border border-border/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 text-center space-y-5">
                <div className="h-16 w-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">
                    Send this campaign?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This will send to{" "}
                    <span className="font-semibold text-foreground">
                      {totalRecipientCount.toLocaleString()} recipients
                    </span>
                    . This cannot be undone once sent.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-muted/30 flex gap-3 border-t border-border/50">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isSending}
                  className="flex-1 h-11 rounded-xl border border-border/50 bg-card text-sm font-semibold text-foreground/80 hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className={cn(
                    "flex-1 h-11 rounded-xl text-sm font-semibold text-white dark:text-slate-900 transition-all flex items-center justify-center gap-2 shadow-sm",
                    isSending
                      ? "bg-slate-400"
                      : "bg-emerald-600 hover:bg-emerald-700",
                  )}
                >
                  {isSending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Confirm & Send
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

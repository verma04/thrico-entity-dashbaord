"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  Users,
  PenLine,
  CheckCircle2,
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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Button } from "@/components/ui/button";

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
    null
  );
  const [subject, setSubject] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const templates = useMemo(
    () => templatesData?.getEmailTemplates || [],
    [templatesData]
  );
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId),
    [templates, selectedTemplateId]
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
          ? `${totalRecipientCount.toLocaleString()} recipients within quota`
          : "Exceeds your remaining quota",
    },
    {
      label: "Template",
      ok: !!selectedTemplateId,
      message: !!selectedTemplateId
        ? `Selected: ${selectedTemplate?.name || "Template ready"}`
        : "No template chosen",
    },
    {
      label: "Recipients",
      ok: totalRecipientCount > 0,
      message:
        totalRecipientCount > 0
          ? `${totalRecipientCount.toLocaleString()} recipients targeted`
          : "No recipients added",
    },
  ];

  const addEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (recipients.includes(email)) {
      toast.error("This email is already in the recipient list.");
      return;
    }
    setRecipients([...recipients, email]);
    setEmailInput("");
  };

  const handleSend = async () => {
    if (!selectedTemplateId || !subject || totalRecipientCount === 0) {
      toast.error("Please complete all required fields before broadcasting.");
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
        toast.success("Email campaign dispatched successfully!");
        setShowConfirm(false);
        router.push("/email/usage");
      } else {
        toast.error(data?.sendEmail.message || "Failed to dispatch campaign.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  const canProceed = () => {
    if (step === 0) return !!selectedTemplateId;
    if (step === 1)
      return totalRecipientCount > 0 && totalRecipientCount <= remainingQuota;
    if (step === 2) return !!subject.trim();
    return true;
  };

  const stepNames = [
    "1. Template",
    "2. Audience",
    "3. Subject & Content",
    "4. Review & Dispatch",
  ];

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-300">
      {/* ── Top Action & Progress Bar ──────────────────────────────────── */}
      <EcosystemActionBar>
        <EcosystemActionBar.Group>
          <StepIndicator
            currentStep={step}
            steps={stepNames}
            onStepClick={(i) => setStep(i)}
          />
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Status active={remainingQuota > 0}>
            {remainingQuota.toLocaleString()} Credits Remaining
          </EcosystemActionBar.Status>

          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(Math.max(0, step - 1))}
              className="h-[30px] gap-1 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button
              type="button"
              disabled={!canProceed()}
              onClick={() => setStep(step + 1)}
              className="h-[30px] gap-1.5 shrink-0 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-3 rounded-[4px] cursor-pointer disabled:opacity-50"
            >
              Continue
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={
                !isDomainVerified ||
                totalRecipientCount === 0 ||
                totalRecipientCount > remainingQuota
              }
              onClick={() => setShowConfirm(true)}
              className="h-[30px] gap-1.5 shrink-0 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-3 rounded-[4px] cursor-pointer disabled:opacity-50"
            >
              <Send className="h-3 w-3" />
              Dispatch Campaign
            </Button>
          )}
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Main Layout: Content Grid + Infrastructure Sidebar ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* Left 3 Columns: Active Step Form */}
        <div className="lg:col-span-3 space-y-4">
          <div className="min-h-[460px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="template"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <TemplateSelector
                    templates={templates}
                    selectedTemplateId={selectedTemplateId}
                    onSelect={(id, sub) => {
                      setSelectedTemplateId(id);
                      if (sub) setSubject(sub);
                    }}
                    loading={templatesLoading}
                  />
                </motion.div>
              )}
              {step === 1 && (
                <motion.div
                  key="recipients"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
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
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
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
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
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

          {/* Bottom Navigation Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep(Math.max(0, step - 1))}
              className="h-[32px] gap-1 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-3 rounded-[4px] cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous Step
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
                className="h-[32px] gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-4 rounded-[4px] cursor-pointer disabled:opacity-40"
              >
                Continue to Step {step + 2}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={
                  !isDomainVerified ||
                  totalRecipientCount === 0 ||
                  totalRecipientCount > remainingQuota
                }
                onClick={() => setShowConfirm(true)}
                className="h-[32px] gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-5 rounded-[4px] cursor-pointer disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
                Dispatch Campaign
              </Button>
            )}
          </div>
        </div>

        {/* Right 1 Column: Infrastructure & Quota Sidebar */}
        <div className="lg:col-span-1 hidden lg:block">
          <InfrastructureSidebar
            usage={usage || null}
            remainingQuota={remainingQuota}
          />
        </div>
      </div>

      {/* ── Confirm Dispatch Polaris Modal ─────────────────────────────── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
            onClick={() => !isSending && setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 8 }}
              className="bg-white dark:bg-zinc-900 rounded-[8px] shadow-2xl max-w-md w-full overflow-hidden border border-[#d2d5d9] dark:border-zinc-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-[6px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <Send className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-foreground">
                      Confirm Campaign Broadcast
                    </h3>
                    <p className="text-[12px] text-muted-foreground">
                      Review transmission details before final execution.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#f6f6f7] dark:bg-zinc-800/60 rounded-[6px] border border-border/60 space-y-1.5 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Audience:</span>
                    <span className="font-bold text-foreground">
                      {totalRecipientCount.toLocaleString()} Recipients
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Template:</span>
                    <span className="font-bold text-foreground truncate max-w-[220px]">
                      {selectedTemplate?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subject:</span>
                    <span className="font-bold text-foreground truncate max-w-[220px]">
                      {subject}
                    </span>
                  </div>
                </div>

                <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                  Dispatched campaigns immediately enter the sending queue and consume credits from your monthly quota.
                </p>
              </div>

              <div className="p-3.5 bg-[#f6f6f7] dark:bg-zinc-900 border-t border-border/60 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  disabled={isSending}
                  className="h-[30px] px-3 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px] cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending}
                  className="h-[30px] px-4 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 text-[12px] font-semibold rounded-[4px] cursor-pointer gap-1.5"
                >
                  {isSending ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                      Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Confirm &amp; Broadcast
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronRight, ChevronLeft, AlertTriangle, RefreshCw } from "lucide-react";
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
  const { data: templatesData, loading: templatesLoading } = useGetEmailTemplates();
  const { data: domainData } = useGetEmailDomain();
  const [sendEmail, { loading: isSending }] = useSendEmail();
  const { data: userGroupsData, loading: userGroupsLoading } = useGetEmailUserGroups();

  const [step, setStep] = useState(0);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [recipientMode, setRecipientMode] = useState<RecipientMode>("manual");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const templates = useMemo(() => templatesData?.getEmailTemplates || [], [templatesData]);
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId),
    [templates, selectedTemplateId]
  );
  const domain = domainData?.getEmailDomain;
  const isDomainVerified = domain?.status === "verified";
  const usage = overviewData?.getEmailOverview?.usage;
  const remainingQuota = usage ? usage.remaining : 0;
  const userGroups = userGroupsData?.getEmailUserGroups || [];

  const checks = [
    {
      label: "Sender Domain",
      ok: isDomainVerified,
      message: isDomainVerified ? `Verified — noreply@${domain?.domain}` : "Domain not verified",
    },
    {
      label: "Email Credits",
      ok: remainingQuota >= recipients.length && recipients.length > 0,
      message: remainingQuota >= recipients.length ? `${recipients.length} recipients within quota` : "Exceeds your remaining quota",
    },
    {
      label: "Template",
      ok: !!selectedTemplateId,
      message: !!selectedTemplateId ? "Template selected" : "No template chosen",
    },
    {
      label: "Recipients",
      ok: recipients.length > 0,
      message: recipients.length > 0 ? `${recipients.length} recipients added` : "No recipients added",
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
    if (!selectedTemplateId || !subject || recipients.length === 0) {
      toast.error("Please complete all required fields.");
      return;
    }
    if (recipients.length > remainingQuota) {
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
    if (step === 1) return recipients.length > 0 && recipients.length <= remainingQuota;
    if (step === 2) return !!subject;
    return true;
  };

  const stepNames = ["Template", "Recipients", "Subject", "Review"];

  return (
    <div className="w-full flex flex-col gap-10 p-8 lg:p-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 pb-8 border-b border-slate-100">
        <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0">
          <Send className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Send Campaign</h1>
          <p className="text-sm text-slate-500 mt-0.5">Select a template, add recipients, and send your email.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        <div className="lg:col-span-3 flex flex-col gap-8">
          {/* Step Indicator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <StepIndicator currentStep={step} steps={stepNames} />
          </div>

          {/* Step Content */}
          <div className="min-h-[420px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="template" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  <TemplateSelector templates={templates} selectedTemplateId={selectedTemplateId} onSelect={(id, sub) => { setSelectedTemplateId(id); setSubject(sub); }} loading={templatesLoading} />
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="recipients" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
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
                  />
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="subject" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  <ContentRefinement subject={subject} setSubject={setSubject} selectedTemplate={selectedTemplate || null} />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="review" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  <FinalDeployment checks={checks} selectedTemplate={selectedTemplate || null} recipientsCount={recipients.length} isDomainVerified={isDomainVerified} domain={domain || null} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={cn(
                "flex items-center gap-2 h-11 px-6 rounded-xl text-sm font-semibold transition-all border",
                step === 0
                  ? "opacity-30 cursor-not-allowed border-slate-200 bg-white text-slate-400"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
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
                    ? "bg-slate-900 text-white hover:bg-black shadow-sm"
                    : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                )}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!isDomainVerified || recipients.length === 0 || recipients.length > remainingQuota}
                className={cn(
                  "flex items-center gap-2 h-11 px-8 rounded-xl text-sm font-semibold transition-all",
                  (!isDomainVerified || recipients.length === 0 || recipients.length > remainingQuota)
                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-black shadow-sm"
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
          <InfrastructureSidebar usage={usage || null} remainingQuota={remainingQuota} />
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
              className="bg-white rounded-3xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 text-center space-y-5">
                <div className="h-16 w-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mx-auto">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Send this campaign?</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    This will send to <span className="font-semibold text-slate-900">{recipients.length.toLocaleString()} recipients</span>. This cannot be undone once sent.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-slate-50/50 flex gap-3 border-t border-slate-100">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isSending}
                  className="flex-1 h-11 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className={cn(
                    "flex-1 h-11 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-sm",
                    isSending ? "bg-slate-400" : "bg-emerald-600 hover:bg-emerald-700"
                  )}
                >
                  {isSending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Confirm & Send</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

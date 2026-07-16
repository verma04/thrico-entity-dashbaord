import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type EmailPlan = "FREE" | "PRO" | "ENTERPRISE";
export type DomainStatus = "none" | "pending" | "verified" | "failed";
export type EmailStatus = "sent" | "delivered" | "bounced" | "complained" | "failed";

export interface DnsRecord {
  type: "TXT" | "CNAME" | "MX" | "A";
  name: string;
  value: string;
  verified: boolean;
}

export interface EmailDomain {
  domain: string;
  status: DomainStatus;
  dnsRecords: DnsRecord[];
  addedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  json: string;
  thumbnail?: string;
  updatedAt: string;
}

export interface EmailUsage {
  used: number;
  limit: number;
  sent: number;
  delivered: number;
  bounced: number;
  complaints: number;
  resetDate: string;
}

export interface TopUpPack {
  id: string;
  label: string;
  emails: number;
  price: number;
  currency: string;
}

export interface EmailNotification {
  id: string;
  type: "domain_unverified" | "quota_warning" | "quota_exceeded" | "email_failed" | "info";
  message: string;
  timestamp: string;
  read: boolean;
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
interface EmailState {
  // Subscription
  plan: EmailPlan;
  setPlan: (plan: EmailPlan) => void;

  // Domain
  domain: EmailDomain | null;
  setDomain: (domain: EmailDomain | null) => void;
  updateDomainStatus: (status: DomainStatus) => void;

  // Templates
  templates: EmailTemplate[];
  setTemplates: (templates: EmailTemplate[]) => void;
  addTemplate: (template: EmailTemplate) => void;
  updateTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  removeTemplate: (id: string) => void;

  // Usage
  usage: EmailUsage;
  setUsage: (usage: EmailUsage) => void;

  // Top-up
  topUpPacks: TopUpPack[];
  showTopUpModal: boolean;
  setShowTopUpModal: (show: boolean) => void;

  // Notifications
  notifications: EmailNotification[];
  addNotification: (notification: EmailNotification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Send flow
  sendStep: number;
  setSendStep: (step: number) => void;
  selectedTemplateId: string | null;
  setSelectedTemplateId: (id: string | null) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useEmailStore = create<EmailState>()(
  devtools(
    (set) => ({
      // Subscription
      plan: "FREE",
      setPlan: (plan) => set({ plan }),

      // Domain
      domain: null,
      setDomain: (domain) => set({ domain }),
      updateDomainStatus: (status) =>
        set((state) => ({
          domain: state.domain ? { ...state.domain, status } : null,
        })),

      // Templates
      templates: [],
      setTemplates: (templates) => set({ templates }),
      addTemplate: (template) =>
        set((state) => ({ templates: [...state.templates, template] })),
      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      removeTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      // Usage
      usage: {
        used: 3200,
        limit: 10000,
        sent: 3200,
        delivered: 3050,
        bounced: 120,
        complaints: 30,
        resetDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
      setUsage: (usage) => set({ usage }),

      // Top-up
      topUpPacks: [
        { id: "pack-1", label: "Starter", emails: 2000, price: 199, currency: "₹" },
        { id: "pack-2", label: "Growth", emails: 5000, price: 499, currency: "₹" },
        { id: "pack-3", label: "Scale", emails: 10000, price: 999, currency: "₹" },
      ],
      showTopUpModal: false,
      setShowTopUpModal: (show) => set({ showTopUpModal: show }),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // Send flow
      sendStep: 0,
      setSendStep: (step) => set({ sendStep: step }),
      selectedTemplateId: null,
      setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
    }),
    { name: "email-store" }
  )
);

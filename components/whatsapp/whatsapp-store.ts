import { create } from "zustand";
import {
  WhatsAppTemplate,
  WhatsAppMessage,
  WhatsAppAnalytics,
  INITIAL_TEMPLATES,
  INITIAL_MESSAGES,
  INITIAL_ANALYTICS,
} from "./types";

interface WhatsAppStore {
  templates: WhatsAppTemplate[];
  messages: WhatsAppMessage[];
  analytics: WhatsAppAnalytics;
  isSyncingTemplates: boolean;
  setTemplates: (templates: WhatsAppTemplate[]) => void;
  setMessages: (messages: WhatsAppMessage[]) => void;
  setAnalytics: (analytics: WhatsAppAnalytics) => void;
  addMessage: (message: WhatsAppMessage) => void;
  syncTemplates: () => Promise<void>;
}

export const useWhatsAppStore = create<WhatsAppStore>((set) => ({
  templates: INITIAL_TEMPLATES,
  messages: INITIAL_MESSAGES,
  analytics: INITIAL_ANALYTICS,
  isSyncingTemplates: false,

  setTemplates: (templates) => set({ templates }),
  setMessages: (messages) => set({ messages }),
  setAnalytics: (analytics) => set({ analytics }),

  addMessage: (message: WhatsAppMessage) => {
    set((state) => {
      const newMessages = [message, ...state.messages];
      const newTotalSent = state.analytics.totalSent + 1;
      const newTotalDelivered = state.analytics.totalDelivered + 1;
      return {
        messages: newMessages,
        analytics: {
          ...state.analytics,
          totalSent: newTotalSent,
          totalDelivered: newTotalDelivered,
          deliveryRate: Number(((newTotalDelivered / newTotalSent) * 100).toFixed(1)),
        },
      };
    });
  },

  syncTemplates: async () => {
    set({ isSyncingTemplates: true });
    set((state) => ({
      isSyncingTemplates: false,
      templates: state.templates.map((tpl) => ({
        ...tpl,
        lastSyncedAt: new Date().toISOString(),
      })),
    }));
  },
}));


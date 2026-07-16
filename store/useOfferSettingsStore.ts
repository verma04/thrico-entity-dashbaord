import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OfferSettings } from "@/types/offer-types";

interface OfferSettingsStore extends OfferSettings {
  setSettings: (settings: Partial<OfferSettings>) => void;
  toggleUserSubmissions: () => void;
  toggleAutoApprove: () => void;
  setTermsAndConditions: (terms: string) => void;
  setSubmissionGuidelines: (guidelines: string) => void;
}

const DEFAULT_SETTINGS: OfferSettings = {
  acceptUserSubmissions: true,
  autoApproveOffers: false,
  termsAndConditions: "<p>Please read and agree to our terms before submitting an offer.</p>",
  submissionGuidelines: "<p>Ensure your offer is accurate and includes all necessary details.</p>",
};

export const useOfferSettingsStore = create<OfferSettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setSettings: (settings) => set(settings),

      toggleUserSubmissions: () =>
        set((state) => ({
          acceptUserSubmissions: !state.acceptUserSubmissions,
        })),

      toggleAutoApprove: () =>
        set((state) => ({
          autoApproveOffers: !state.autoApproveOffers,
        })),

      setTermsAndConditions: (terms) =>
        set({ termsAndConditions: terms }),

      setSubmissionGuidelines: (guidelines) =>
        set({ submissionGuidelines: guidelines }),
    }),
    {
      name: "offer-settings-storage",
    }
  )
);

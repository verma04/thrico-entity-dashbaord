import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MentorSettings } from "@/types/mentor-types";

interface MentorSettingsStore extends MentorSettings {
  setSettings: (settings: Partial<MentorSettings>) => void;
  toggleMentorRequests: () => void;
  toggleAutoApprove: () => void;
  setTermsAndConditions: (terms: string) => void;
  setSubmissionGuidelines: (guidelines: string) => void;
}

const DEFAULT_SETTINGS: MentorSettings = {
  acceptMentorRequests: true,
  autoApproveMentors: false,
  termsAndConditions: "<p>Please read and agree to our terms before submitting a mentor request.</p>",
  submissionGuidelines: "<p>Ensure your profile is complete and includes all necessary details about your expertise and availability.</p>",
};

export const useMentorSettingsStore = create<MentorSettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setSettings: (settings) => set(settings),

      toggleMentorRequests: () =>
        set((state) => ({
          acceptMentorRequests: !state.acceptMentorRequests,
        })),

      toggleAutoApprove: () =>
        set((state) => ({
          autoApproveMentors: !state.autoApproveMentors,
        })),

      setTermsAndConditions: (terms) =>
        set({ termsAndConditions: terms }),

      setSubmissionGuidelines: (guidelines) =>
        set({ submissionGuidelines: guidelines }),
    }),
    {
      name: "mentor-settings-storage",
    }
  )
);

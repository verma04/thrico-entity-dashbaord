import { create } from "zustand";

interface TeamRequirements {
  teamSize: string;
  currentSolution: string;
  painPoints: string[];
}

interface Features {
  features: string[];
}

interface TimeLine {
  budget: string;
  timeline: string;
  decisionMakers: string;
}

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  contactMethod: string;
}

interface Security {
  technicalRequirements: string;
  additionalInfo: string;
  referral: string;
}
interface CustomFormState {
  teamRequirements: TeamRequirements;
  features: Features;
  timeLine: TimeLine;
  contact: Contact;

  setTeamRequirements: (data: TeamRequirements) => void;
  setFeatures: (data: Features) => void;
  setTimeLine: (data: TimeLine) => void;
  setContact: (data: Contact) => void;
  security: Security;
  setSecurity: (data: Security) => void;
}

export const useCustomFormStore = create<CustomFormState>((set) => ({
  teamRequirements: {
    teamSize: "",
    currentSolution: "",
    painPoints: [],
  },
  features: {
    features: [],
  },
  timeLine: {
    budget: "",
    timeline: "",
    decisionMakers: "",
  },
  contact: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    contactMethod: "",
  },
  security: {
    technicalRequirements: "",
    additionalInfo: "",
    referral: "",
  },

  setTeamRequirements: (data) => set({ teamRequirements: data }),
  setFeatures: (data) => set({ features: data }),
  setTimeLine: (data) => set({ timeLine: data }),
  setContact: (data) => set({ contact: data }),
  setSecurity: (data) => set({ security: data }),
}));

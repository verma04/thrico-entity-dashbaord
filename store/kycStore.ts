import { generateSlug } from "random-word-slugs";
import { create } from "zustand";
const randomDomain = generateSlug();
interface KycFormStore {
  current: number;
  setCurrent: (current: number) => void;
  profile: {
    designation: string;
    phone: string;
    country: string;
    language: string;
  };
  setProfile: (profile: Partial<KycFormStore["profile"]>) => void;
  organization: {
    name: string;
    entityType: string;
    industryType: string;
    website: string;
    address: string;
    language: string;
    agreement: boolean;
    logo: any;
  };
  setOrganization: (
    organization: Partial<KycFormStore["organization"]>
  ) => void;
  domain: string;
  setDomain: (domain: string) => void;
  logo: any;
  setLogo: (logo: any) => void;
  logoPreview: string;
  setLogoPreview: (logoPreview: string) => void;
}

export const useKycFormStore = create<KycFormStore>((set) => ({
  current: 0,
  setCurrent: (current) => set({ current }),
  profile: {
    designation: "",
    phone: "",
    country: "",
    language: "",
  },
  setProfile: (profile) =>
    set((state) => ({
      profile: { ...state.profile, ...profile },
    })),
  organization: {
    name: "",
    entityType: "",
    industryType: "",
    website: "",
    address: "",
    language: "",
    agreement: false,
    logo: null,
  },
  setOrganization: (organization) =>
    set((state) => ({
      organization: { ...state.organization, ...organization },
    })),
  domain: randomDomain,
  setDomain: (domain) => set({ domain }),
  logo: null,
  setLogo: (logo) => set({ logo }),
  logoPreview: "https://cdn.thrico.network/thricoLogo.png",
  setLogoPreview: (logoPreview) => set({ logoPreview }),
}));

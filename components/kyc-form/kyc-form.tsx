"use client";

import React from "react";

import KycProfile from "./kyc-profile";
import KycEntity from "./kyc-entity";
import KycDomain from "./kyc-domain";
import KycWelcome from "./kyc-welcome";
import KycPreview from "./preview/kyc-preview";

import KycHeader from "./kyc-header";

import {
  useGetEntity,
  useKycCountries,
  useRegisterOrganization,
} from "@/graphql/actions";

import { toast } from "sonner";
import { User, Building, Globe, Sparkles } from "lucide-react";

import { useRouter } from "next/navigation";

import { useKycFormStore } from "@/store/kycStore";

interface KycFormData {
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: StepConfig[] = [
  {
    id: 0,
    title: "Welcome",
    description: "Let's build your community together",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: 1,
    title: "Profile Info",
    description: "Bring your organization into the community",
    icon: <User className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "Entity Details",
    description: "Help us understand your organization better",
    icon: <Building className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "Choose Domain",
    description: "Set-up your domain",
    icon: <Globe className="h-5 w-5" />,
  },
];

const KycForm = ({ data }: { data: KycFormData }) => {
  const router = useRouter();
  const { refetch } = useGetEntity();
  const user = data.user;

  const {
    current,
    setCurrent,
    profile,
    setProfile,
    organization,
    setOrganization,
    domain,
    setDomain,
    logo,
    setLogo,
    logoPreview,
    setLogoPreview,
  } = useKycFormStore();

  const { data: countries } = useKycCountries();

  const [register, { loading }] = useRegisterOrganization({
    onCompleted() {
      toast.success("Organization registered successfully!");
      refetch();
      router.push("/?choose-plan");
    },
  });

  const onSubmit = () => {
    register({
      variables: {
        input: {
          ...organization,
          ...profile,
          domain,
          logo,
        },
      },
    });
  };

  const actualSteps = steps.length - 1;
  const currentStepIndex = current >= 0 ? current : 0;
  const progress = current === -1 ? 0 : (currentStepIndex / actualSteps) * 100;

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pb-24">
      {/* Header */}

      <div className=" overflow-hidden">
        <KycHeader />
        <div className="container mx-auto px-4 py-8 pb-32    ">
          <div
            className={`flex gap-8 w-full ${
              current === 0 ? "justify-center" : ""
            }`}
          >
            {/* Main */}
            <div className={`space-y-6  0 w-1/2`}>
              {current === 0 && <KycWelcome onStart={() => setCurrent(1)} />}

              {current === 1 && (
                <KycProfile
                  fullName={`${user?.firstName || ""} ${user?.lastName || ""}`}
                  email={user?.email || ""}
                  data={user}
                  profile={profile}
                  setProfile={setProfile}
                  countries={countries?.getKycCountries}
                  setCurrent={setCurrent}
                />
              )}

              {current === 2 && (
                <KycEntity
                  organization={organization}
                  setOrganization={setOrganization}
                  setCurrent={setCurrent}
                />
              )}

              {current === 3 && (
                <KycDomain
                  domain={domain}
                  setDomain={setDomain}
                  setCurrent={setCurrent}
                  onSubmit={onSubmit}
                  loading={loading}
                  logo={logo}
                  setLogo={setLogo}
                  logoPreview={logoPreview}
                  setLogoPreview={setLogoPreview}
                />
              )}
            </div>

            {/* Right Sidebar - Preview - 50% */}

            <div className="w-1/2 min-h-[20rem] sticky top-20 ">
              <KycPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycForm;

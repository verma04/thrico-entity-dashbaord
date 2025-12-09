"use client";

import { Check, User, Building, Globe, Sparkles } from "lucide-react";
import { useKycFormStore } from "@/store/kycStore";
import StartCommunity from "./start-community";
import GlobeEarth from "./globe-earth";

import PhonePreview from "./phone-preview";
import EntityPreview, {
  AnimatedBeamMultipleOutputDemo,
} from "./entity-preview";

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

const KycPreview = () => {
  const { current } = useKycFormStore();

  return (
    <div className="space-6 sticky top-0  relative flex w-full  items-center justify-center ">
      {current === 0 && <StartCommunity />}
      {current === 1 && <GlobeEarth />}
      {current === 2 && <EntityPreview />}
      {current === 3 && <PhonePreview />}
    </div>
  );
};

export default KycPreview;

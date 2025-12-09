"use client";

import { Badge } from "@/components/ui/badge";
import { ChevronRight, User, Building, Globe, Sparkles } from "lucide-react";
import { useKycFormStore } from "@/store/kycStore";
import { LightRays } from "@/components/ui/light-rays";
import Image from "next/image";

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

const KycHeader = () => {
  const { current } = useKycFormStore();

  const actualSteps = steps.length - 1;
  const currentStepIndex = current >= 0 ? current : 0;
  const progress = current === -1 ? 0 : (currentStepIndex / actualSteps) * 100;

  return (
    <>
      <LightRays />
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg dark:bg-slate-950/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/thrico-logo.svg"
                alt="Thrico"
                width={100}
                height={60}
                className="h-15 w-30"
                priority
              />
            </div>

            {current >= 0 && (
              <Badge variant="outline" className="gap-1.5">
                Step {current + 1} of {actualSteps}
                <ChevronRight className="h-3 w-3" />
                {Math.round(progress)}%
              </Badge>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default KycHeader;

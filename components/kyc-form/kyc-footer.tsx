"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useKycFormStore } from "@/store/kycStore";
import { useGetEntity, useRegisterOrganization } from "@/graphql/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface KycFooterProps {
  onSubmit?: () => void;
}

const KycFooter: React.FC<KycFooterProps> = ({ onSubmit }) => {
  const router = useRouter();
  const { refetch } = useGetEntity();

  const { current, setCurrent, profile, organization, domain, logo } =
    useKycFormStore();

  const [register, { loading }] = useRegisterOrganization({
    onCompleted() {
      toast.success("Organization registered successfully!");
      refetch();
      router.push("/?choose-plan");
    },
  });

  const onFinish = () => {
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

  const handleNext = () => {
    if (onSubmit) {
      onSubmit();
    } else {
      setCurrent(current + 1);
    }
  };

  const handlePrevious = () => {
    setCurrent(current - 1);
  };

  const actualSteps = 4; // 0: Welcome, 1: Profile, 2: Entity, 3: Domain
  const currentStepIndex = current >= 0 ? current : 0;
  const progress =
    current === 0 ? 0 : (currentStepIndex / (actualSteps - 1)) * 100;

  if (current === 0) return null;

  return (
    <div className="fixed bottom-0 z-30 inset-x-0 border-t bg-white/95 backdrop-blur dark:bg-slate-950/95">
      <Progress value={progress} className="h-2 mb-4" />
      <div className="container mx-auto px-4 py-4 flex justify-between">
        <Button
          variant="outline"
          disabled={current === 1}
          onClick={handlePrevious}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {current < 3 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={onFinish} disabled={loading}>
            {loading ? "Submitting..." : "Complete Setup"}
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default KycFooter;

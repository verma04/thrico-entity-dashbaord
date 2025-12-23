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

const FullScreenLoader = () => (
  <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          Setting up your Entity
        </h3>
        <p className="text-sm text-gray-500">
          Please wait while we configure your workspace...
        </p>
      </div>
    </div>
  </div>
);

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
    <>
      {loading && <FullScreenLoader />}
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
    </>
  );
};

export default KycFooter;

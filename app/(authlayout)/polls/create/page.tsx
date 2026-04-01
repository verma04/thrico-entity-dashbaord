"use client";

import React from "react";
import NewPoll from "@/components/polls/new-poll";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreatePollPage() {
  const router = useRouter();

  const handleCompleted = (id: string | number) => {
    // Redirect to the newly created poll or the polls list
    router.push("/polls");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <EcosystemWrapper anonymized-1="create-poll">
      <EcosystemHeader
        title="Create New Poll"
        badgeText="Community Engagement"
        description="Launch a new poll to gather community feedback and insights."
        icon={BarChart3}
      />

      <EcosystemContainer className="max-w-[800px] mx-auto p-8 lg:p-12">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
          <NewPoll 
            standalone={false} 
            onCompletedAction={handleCompleted}
            onCancel={handleCancel}
          />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

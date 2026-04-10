"use client";

import React from "react";
import NewPoll from "@/components/polls/new-poll";
import { useRouter } from "next/navigation";

export default function CreatePollPage() {
  const router = useRouter();

  const handleCompleted = (id: string | number) => {
    router.push("/polls");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <NewPoll
      standalone={false}
      fullPage={true}
      onCompletedAction={handleCompleted}
      onCancel={handleCancel}
    />
  );
}

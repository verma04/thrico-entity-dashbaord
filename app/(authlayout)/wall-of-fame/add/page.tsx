"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { InductionForm } from "@/components/wall-of-fame/add/induction-form";
import { useAddToWallOfFame } from "@/graphql/wall-of-fame";
import { notify } from "@/lib/notify";

const AddToWallOfFamePage = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [addEntry, { loading }] = useAddToWallOfFame();

  const onFinish = async (values: any) => {
    setSubmitError(null);
    try {
      await addEntry({
        variables: {
          input: {
            userId: values.userId,
            title: values.title,
            achievement: values.achievement,
            year: values.year,
            categoryId: values.categoryId,
            recognitionDate: values.recognitionDate,
            order: values.order,
          },
        },
      });
      notify.success("Member inducted into Wall of Fame successfully!");
      router.push("/wall-of-fame/all");
    } catch (error: any) {
      const message = error.message || "Failed to induct member";
      setSubmitError(message);
      notify.error(message);
    }
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="h-full overflow-hidden bg-white">
      <InductionForm
        loading={loading}
        onFinish={onFinish}
        onCancel={onCancel}
        submitError={submitError}
        onDismissError={() => setSubmitError(null)}
      />
    </div>
  );
};

export default AddToWallOfFamePage;

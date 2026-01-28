"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetCustomForm } from "@/graphql/surveys/survey-queries";
import { useEditSurvey } from "@/graphql/surveys/survey-mutations";
import { useFormStore } from "@/store/useFormStore";
import NewFormPage from "@/components/feedback-form/create";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function EditSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    loadForm,

    formTitle,
    formDescription,

    startDate,
    endDate,
  } = useFormStore();

  const { data, loading, error } = useGetCustomForm({
    variables: { id },
    skip: !id,
  });

  const [editSurvey, { loading: isUpdating }] = useEditSurvey({
    onCompleted: () => {
      toast.success("Survey published successfully!");
      router.push("/surveys/all");
    },
    onError: (err) => {
      l;
      toast.error(err.message || "Failed to update survey");
    },
  });

  useEffect(() => {
    if (data?.getCustomForm) {
      loadForm(data.getCustomForm);
    }
  }, [data, loadForm]);

  const handlePublish = () => {
    editSurvey({
      variables: {
        id,
        input: {
          title: formTitle,
          description: formDescription,
          startDate: startDate ? startDate.toISOString() : undefined,
          endDate: endDate ? endDate.toISOString() : undefined,
          // Note: If EditSurveyInput doesn't support fields/appearance, they won't be saved here.
          // We'll follow the provided schema for now.
        },
      },
    });
  };

  const handleClose = () => {
    router.push("/surveys/all");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-destructive font-medium">Failed to load survey</p>
        <button
          onClick={() => router.push("/surveys")}
          className="text-sm underline"
        >
          Back to Surveys
        </button>
      </div>
    );
  }

  return (
    <Sheet open={true} onOpenChange={(val) => !val && handleClose()}>
      <SheetContent
        side="top"
        className="h-[100dvh] w-screen p-0 border-none outline-none dark:bg-zinc-950"
      >
        <div className="h-full w-full">
          <NewFormPage onPublish={handlePublish} onClose={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

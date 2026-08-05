"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetSurvey } from "@/graphql/surveys/survey-queries";
import { useEditSurvey } from "@/graphql/surveys/survey-mutations";
import { useFormStore } from "@/store/useFormStore";
import { useModuleStore } from "@/store/useModuleStore";
import NewFormPage from "@/components/feedback-form/create";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

function EditSurveyPage() {
  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);
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

  const { data, loading, error } = useGetSurvey({
    variables: { getSurveyId: id },
    skip: !id,
    pollInterval: 4000,
  });

  const [editSurvey, { loading: isUpdating }] = useEditSurvey({
    onCompleted: () => {
      toast.success(`${singularName} published successfully!`);
      router.push("/surveys/all");
    },
    onError: (err) => {
      toast.error(
        err.message || `Failed to update ${singularName.toLowerCase()}`,
      );
    },
  });

  useEffect(() => {
    if (data?.getSurvey) {
      loadForm({
        title: data.getSurvey.title,
        description: data.getSurvey.description,
        startDate: data.getSurvey.startDate,
        endDate: data.getSurvey.endDate,
        previewType: data.getSurvey.form?.previewType,
        appearance: data.getSurvey.form?.appearance,
        questions: data.getSurvey.form?.questions,
      });
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
        <p className="text-destructive font-medium">
          Failed to load {singularName.toLowerCase()}
        </p>
        <button
          onClick={() => router.push("/surveys")}
          className="text-sm underline"
        >
          Back to {moduleName}
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

export default withSubscriptionCheck(
  withModulePermission(EditSurveyPage, "SURVEYS", "canRead"),
  "surveys",
);

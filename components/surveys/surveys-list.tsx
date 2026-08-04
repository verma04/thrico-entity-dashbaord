"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { useGetSurveys, Survey } from "@/graphql/surveys/survey-queries";
import { toast } from "sonner";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import NewForm from "../feedback-form/new-feed-back-form";
import {
  useDeleteSurvey,
  useEditSurvey,
  usePublishSurvey,
  useDraftSurvey,
  useShareSurveyAsFeed,
} from "@/graphql/surveys/survey-mutations";
import { SurveysTable } from "./surveys-table";
import { SurveySheet } from "./survey-sheet";
import { SurveyDialogs } from "./survey-dialogs";
import { SurveyAIAgentButton } from "./survey-ai-agent";
import { useModuleStore } from "@/store/useModuleStore";

export function SurveysList({
  shareSurveyAsFeed,
}: {
  shareSurveyAsFeed?: boolean;
}) {
  const moduleName = useModuleStore((state) => state.surveyModuleName);
  const singularName = useModuleStore((state) => state.surveySingularName);
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);
  const [editingDetailsSurvey, setEditingDetailsSurvey] =
    useState<Survey | null>(null);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Details form state
  const [details, setDetails] = useState({
    title: "",
    description: "",
    startDate: null as moment.Moment | null,
    endDate: null as moment.Moment | null,
  });

  const [sharingSurvey, setSharingSurvey] = useState<Survey | null>(null);
  const [shareDescription, setShareDescription] = useState("");

  const [shareSurvey, { loading: isSharing }] = useShareSurveyAsFeed({
    onCompleted: () => {
      toast.success(`${singularName} shared to feed successfully`);
      setSharingSurvey(null);
      setShareDescription("");
    },
    onError: (error) => {
      toast.error(
        error.message || `Failed to share ${singularName.toLowerCase()}`,
      );
    },
  });

  useEffect(() => {
    if (editingDetailsSurvey) {
      setDetails({
        title: editingDetailsSurvey.title || "",
        description: editingDetailsSurvey.description || "",
        startDate: editingDetailsSurvey.startDate
          ? moment(editingDetailsSurvey.startDate)
          : null,
        endDate: editingDetailsSurvey.endDate
          ? moment(editingDetailsSurvey.endDate)
          : null,
      });
    }
  }, [editingDetailsSurvey]);

  const [deleteSurvey, { loading: isDeleting }] = useDeleteSurvey({
    onCompleted: () => {
      toast.success(`${singularName} deleted successfully`);
      setSurveyToDelete(null);
    },
    onError: (error) => {
      toast.error(
        error.message || `Failed to delete ${singularName.toLowerCase()}`,
      );
    },
  });

  const [editSurvey, { loading: isUpdating }] = useEditSurvey({
    onCompleted: () => {
      toast.success(`${singularName} updated successfully`);
      setEditingDetailsSurvey(null);
    },
    onError: (error) => {
      toast.error(
        error.message || `Failed to update ${singularName.toLowerCase()}`,
      );
    },
  });

  const [publishSurvey] = usePublishSurvey({
    onCompleted: () => {
      toast.success(`${singularName} published successfully`);
    },
    onError: (error) => {
      toast.error(
        error.message || `Failed to publish ${singularName.toLowerCase()}`,
      );
    },
  });

  const [draftSurvey] = useDraftSurvey({
    onCompleted: () => {
      toast.success(`${singularName} moved to draft successfully`);
    },
    onError: (error) => {
      toast.error(
        error.message ||
          `Failed to move ${singularName.toLowerCase()} to draft`,
      );
    },
  });

  const { data, loading, error } = useGetSurveys({
    variables: {
      input: {
        limit: 10,
        offset: 0,
        search: null,
        status: null,
      },
    },
  });

  const surveys = data?.getSurveys?.surveys || [];

  const handleUpdateDetails = () => {
    if (!editingDetailsSurvey || !canUpdate) return;
    editSurvey({
      variables: {
        id: editingDetailsSurvey.id,
        input: {
          title: details.title,
          description: details.description,
          startDate: details.startDate?.toISOString(),
          endDate: details.endDate?.toISOString(),
        },
      },
    });
  };

  const isDateRangeInvalid =
    details.startDate && details.endDate
      ? !details.endDate.isAfter(details.startDate)
      : false;

  const canUpdate =
    !!details.title &&
    !!details.startDate &&
    !!details.endDate &&
    !isDateRangeInvalid &&
    !isUpdating;

  return (
    <>
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        <SurveysTable
          surveys={surveys}
          loading={loading}
          onEditDetails={setEditingDetailsSurvey}
          onDelete={setSurveyToDelete}
          onPublish={(id) =>
            publishSurvey({ variables: { publishSurveyId: id } })
          }
          onDraft={(id) => draftSurvey({ variables: { draftSurveyId: id } })}
          onShare={setSharingSurvey}
          shareSurveyAsFeed={shareSurveyAsFeed}
        />
        {error && (
          <div className="p-4 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-tight border border-rose-100 shadow-sm mt-4">
            Synchronization error: Failed to retrieve interaction registry.
          </div>
        )}
      </EcosystemContainer>

      <SurveySheet
        survey={editingDetailsSurvey}
        isOpen={!!editingDetailsSurvey}
        onClose={() => setEditingDetailsSurvey(null)}
        details={details}
        onDetailsChange={setDetails}
        onUpdate={handleUpdateDetails}
        isUpdating={isUpdating}
        isDateRangeInvalid={isDateRangeInvalid}
        canUpdate={canUpdate}
      />

      <SurveyDialogs
        surveyToDelete={surveyToDelete}
        onCancelDelete={() => setSurveyToDelete(null)}
        onConfirmDelete={() => {
          if (surveyToDelete)
            deleteSurvey({ variables: { id: surveyToDelete } });
        }}
        isDeleting={isDeleting}
        sharingSurvey={sharingSurvey}
        onCancelShare={() => setSharingSurvey(null)}
        onConfirmShare={() => {
          if (sharingSurvey) {
            shareSurvey({
              variables: {
                surveyId: sharingSurvey.id,
                shouldShare: true,
                description: shareDescription,
              },
            });
          }
        }}
        isSharing={isSharing}
        shareDescription={shareDescription}
        onShareDescriptionChange={setShareDescription}
      />
    </>
  );
}

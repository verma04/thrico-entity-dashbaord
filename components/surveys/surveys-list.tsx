"use client";

import { useEffect, useState } from "react";
import moment from "moment";
import { useGetSurveys, Survey } from "@/graphql/surveys/survey-queries";
import { toast } from "sonner";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { ClipboardList, Sparkles, Filter, Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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

export function SurveysList({
  shareSurveyAsFeed,
}: {
  shareSurveyAsFeed?: boolean;
}) {
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);
  const [editingDetailsSurvey, setEditingDetailsSurvey] =
    useState<Survey | null>(null);

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
      toast.success("Survey shared to feed successfully");
      setSharingSurvey(null);
      setShareDescription("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to share survey");
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
      toast.success("Survey deleted successfully");
      setSurveyToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete survey");
    },
  });

  const [editSurvey, { loading: isUpdating }] = useEditSurvey({
    onCompleted: () => {
      toast.success("Survey updated successfully");
      setEditingDetailsSurvey(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update survey");
    },
  });

  const [publishSurvey] = usePublishSurvey({
    onCompleted: () => {
      toast.success("Survey published successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to publish survey");
    },
  });

  const [draftSurvey] = useDraftSurvey({
    onCompleted: () => {
      toast.success("Survey moved to draft successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to move survey to draft");
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
    <EcosystemWrapper anonymized-1="surveys-registry">
      <EcosystemHeader
        title="Feedback Registry"
        badgeText="Community Insights"
        description="Review interaction datasets, sentiment tracking, and global response protocols."
        icon={ClipboardList}
        actions={
          <div className="flex items-center gap-3 relative ml-auto">
            <Link href="/surveys/templates">
              <Button variant="outline" className="font-bold text-[10px] uppercase tracking-widest px-6 h-9 rounded-lg shadow-sm gap-2 border-zinc-200 text-zinc-600">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Templates
              </Button>
            </Link>
            <NewForm />
          </div>
        }
      />

      <EcosystemActionBar shadow="none">
        <div className="relative w-full md:max-w-[360px] group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search registry nodes..."
            className="pl-10 h-10 bg-white border-zinc-200 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500/10 transition-all font-medium text-zinc-700 placeholder:text-zinc-400 border shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-lg border border-zinc-200 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-50 shadow-sm md:hidden">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            {surveys.length} Active Datasets
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
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
        </div>
        {error && (
          <div className="p-4 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-tight border border-rose-100 shadow-sm">
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
    </EcosystemWrapper>
  );
}

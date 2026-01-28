"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { useGetSurveys, Survey } from "@/graphql/surveys/survey-queries";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useDeleteSurvey,
  useEditSurvey,
  usePublishSurvey,
  useDraftSurvey,
} from "@/graphql/surveys/survey-mutations";
import Link from "next/link";
import {
  Check,
  FileText,
  BarChart3,
  MessageSquare,
  Copy,
  Loader2,
} from "lucide-react";

export function SurveysList() {
  const router = useRouter();
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

  const [publishSurvey, { loading: isPublishing }] = usePublishSurvey({
    onCompleted: () => {
      toast.success("Survey published successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to publish survey");
    },
  });

  const [draftSurvey, { loading: isDrafting }] = useDraftSurvey({
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

  const columns: ColumnDef<Survey>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {row.getValue("title")}
          </span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {row.original.description || "No description"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "PUBLISHED"
                ? "default"
                : status === "DRAFT"
                  ? "secondary"
                  : "outline"
            }
            className="capitalize"
          >
            {status.toLowerCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const date = row.getValue("startDate");
        return (
          <span className="text-sm text-muted-foreground">
            {date ? format(new Date(date as string), "PPP") : "No start date"}
          </span>
        );
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const date = row.getValue("endDate");
        return (
          <span className="text-sm text-muted-foreground">
            {date ? format(new Date(date as string), "PPP") : "No end date"}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setEditingDetailsSurvey(row.original)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/surveys/${row.original.formId}`}
                  className="w-full flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Form
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original.id)}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy survey ID
              </DropdownMenuItem>
              {row.original.status === "DRAFT" ? (
                <DropdownMenuItem
                  className="gap-2"
                  disabled={isPublishing}
                  onClick={() =>
                    publishSurvey({
                      variables: { publishSurveyId: row.original.id },
                    })
                  }
                >
                  <Check className="h-4 w-4" />
                  {isPublishing ? "Publishing..." : "Publish Survey"}
                </DropdownMenuItem>
              ) : row.original.status === "PUBLISHED" ? (
                <DropdownMenuItem
                  className="gap-2"
                  disabled={isDrafting}
                  onClick={() =>
                    draftSurvey({
                      variables: { draftSurveyId: row.original.id },
                    })
                  }
                >
                  <FileText className="h-4 w-4" />
                  {isDrafting ? "Moving to Draft..." : "Move to Draft"}
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem asChild>
                <Link
                  href={`/surveys/${row.original.id}/results`}
                  className="w-full flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  View Results
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/surveys/${row.original.id}/responses`}
                  className="w-full flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  View Responses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive gap-2"
                onClick={() => setSurveyToDelete(row.original.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete survey
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleDelete = () => {
    if (surveyToDelete) {
      deleteSurvey({ variables: { id: surveyToDelete } });
    }
  };

  const isDateRangeInvalid =
    details.startDate && details.endDate
      ? !details.endDate.isAfter(details.startDate)
      : false;

  const canUpdate =
    details.title &&
    details.startDate &&
    details.endDate &&
    !isDateRangeInvalid &&
    !isUpdating;

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

  return (
    <div className="px-6 py-6">
      <DataTable
        columns={columns}
        data={surveys}
        isLoading={loading}
        skeletonCount={5}
      />
      {error && (
        <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          Failed to load surveys. Please try again later.
        </div>
      )}

      <AlertDialog
        open={!!surveyToDelete}
        onOpenChange={(val) => !val && setSurveyToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              survey and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white gap-2"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet
        open={!!editingDetailsSurvey}
        onOpenChange={(val) => !val && setEditingDetailsSurvey(null)}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-[500px] overflow-y-auto p-0"
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-2xl">Edit Survey Details</SheetTitle>
            <SheetDescription>
              Update the basic information for your survey.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100vh-140px)]">
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">
                      Survey Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="edit-title"
                      value={details.title}
                      onChange={(e) =>
                        setDetails((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-desc">Description</Label>
                    <Textarea
                      id="edit-desc"
                      rows={3}
                      value={details.description}
                      onChange={(e) =>
                        setDetails((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-startDate">
                        Start Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-startDate"
                        type="date"
                        value={
                          details.startDate
                            ? details.startDate.format("YYYY-MM-DD")
                            : ""
                        }
                        onChange={(e) =>
                          setDetails((prev) => ({
                            ...prev,
                            startDate: e.target.value
                              ? moment(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-endDate">
                        End Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-endDate"
                        type="date"
                        value={
                          details.endDate
                            ? details.endDate.format("YYYY-MM-DD")
                            : ""
                        }
                        onChange={(e) =>
                          setDetails((prev) => ({
                            ...prev,
                            endDate: e.target.value
                              ? moment(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
                  </div>
                  {isDateRangeInvalid && (
                    <p className="text-sm text-destructive">
                      End date must be after the start date.
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="mt-6 flex flex-col gap-3">
                <Button
                  variant="secondary"
                  className="w-full justify-start gap-2 h-12"
                  onClick={() => {
                    router.push(`/surveys/${editingDetailsSurvey?.formId}`);
                    setEditingDetailsSurvey(null);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                  Edit Form Questions (Full Editor)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-12"
                  onClick={() => {
                    router.push(`/surveys/${editingDetailsSurvey?.id}/results`);
                    setEditingDetailsSurvey(null);
                  }}
                >
                  <BarChart3 className="h-4 w-4" />
                  View Survey Results & Analytics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 h-12"
                  onClick={() => {
                    router.push(
                      `/surveys/${editingDetailsSurvey?.id}/responses`,
                    );
                    setEditingDetailsSurvey(null);
                  }}
                >
                  <MessageSquare className="h-4 w-4" />
                  View Individual Responses
                </Button>
              </div>
            </div>

            <Separator />

            <SheetFooter className="px-6 py-4 bg-muted/30">
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="ghost"
                  onClick={() => setEditingDetailsSurvey(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateDetails}
                  disabled={!canUpdate || isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Details"}
                </Button>
              </div>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

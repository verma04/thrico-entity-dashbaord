"use client";

import React, { useState } from "react";
import {
  useGetFunctions,
  useAddFunction,
  useUpdateFunction,
  useDeleteFunction,
  MemberFunction,
  useBulkAddFunctions,
} from "@/graphql/quries/functions/function-queries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  Briefcase,
  Loader2,
  UserCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { notify } from "@/lib/notify";
import { Input } from "@/components/ui/input";

// ── Color palette for functions ──
const FUNCTION_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#6366f1", // Indigo
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#14b8a6", // Teal
  "#f97316", // Orange
];

function getFunctionColor(index: number) {
  return FUNCTION_COLORS[index % FUNCTION_COLORS.length];
}

// ── Add/Edit Dialog ──
function FunctionDialog({
  open,
  onOpenChange,
  editingFunction,
  isLoading,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingFunction: MemberFunction | null;
  isLoading: boolean;
  onSave: (values: { title: string }) => void;
}) {
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTitle(editingFunction?.title || "");
    }
  }, [open, editingFunction]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-border">
        <DialogHeader>
          <DialogTitle className="font-bold text-foreground">
            {editingFunction ? "Edit Job Function" : "Add Job Function"}
          </DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            {editingFunction
              ? "Update the job function name"
              : "Create a new job function to classify your members' professional roles"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label
              htmlFor="function-title"
              className="text-sm font-semibold text-foreground"
            >
              Function Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="function-title"
              placeholder="e.g., Engineering, Marketing, Operations"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-border focus-visible:ring-indigo-500/20"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            className="rounded-lg font-semibold border-border"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isLoading}
            className="rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingFunction ? "Update" : "Save Function"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Functions Grid ──
function FunctionsGrid({
  functions,
  isLoading,
  onEdit,
  onDelete,
}: {
  functions: MemberFunction[];
  isLoading: boolean;
  onEdit: (func: MemberFunction) => void;
  onDelete: (func: MemberFunction) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Card
              key={i}
              className="border border-border rounded-xl overflow-hidden"
            >
              <Skeleton className="h-1.5 w-full" />
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (functions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-xl border border-border border-dashed m-4">
        <Briefcase className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          No job functions found
        </h3>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-sm">
          Try adding a new job function or adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
      {functions.map((func, index) => {
        const color = getFunctionColor(index);
        return (
          <Card
            key={func.id}
            className="border border-border shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden rounded-xl hover:border-indigo-500/20 hover:-translate-y-1 bg-card cursor-pointer"
          >
            {/* Color bar */}
            <div
              className="h-1.5 w-full opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: color }}
            />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                    }}
                  >
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-md w-full text-foreground group-hover:text-indigo-600 transition-colors">
                      {func.title}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                      Job Function
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(func);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(func);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── Recommended Job Functions ──
const RECOMMENDED_FUNCTIONS = [
  "Accounting & Finance",
  "Administration",
  "Advertising",
  "Advisory",
  "Analytics",
  "Architecture",
  "Art & Culture",
  "Automotive",
  "Audit",
  "Banking",
  "Board Member",
  "Branding",
  "Business Analysis",
  "Business Development",
  "Civil Engineering",
  "Cloud Computing",
  "Community Management",
  "Compliance",
  "Construction",
  "Content Writing",
  "Consulting",
  "Copywriting",
  "Corporate Strategy",
  "Creative Direction",
  "Customer Services",
  "Cybersecurity",
  "Communications",
  "Data Analytics",
  "Data Engineering",
  "Data Entry",
  "Data Science",
  "Design (Graphic, Product, UI/UX)",
  "DevOps",
  "Digital Marketing",
  "Documentation",
  "E-commerce Operations",
  "Editorial",
  "Education & Training",
  "Engineering",
  "Entrepreneurship",
  "Event Management",
  "Facility Management",
  "Fashion Design",
  "Fintech",
  "Finance",
  "Food & Beverage Services",
  "Front-end Development",
  "Fundraising",
  "Game Development",
  "Government & Policy",
  "Graphic Design",
  "Growth Strategy",
  "Hardware Engineering",
  "Health & Safety",
  "Helpdesk Support",
  "Hospitality Services",
  "Human Resources (HR)",
  "Illustration",
  "Information Security",
  "Infrastructure Management",
  "Information Technology (IT)",
  "Instructional Design",
  "Insurance Services",
  "Investment Banking",
  "Inventory Management",
  "Java Development",
  "Journalism",
  "Judicial Services",
  "Kindergarten & Early Childhood Education",
  "Knowledge Management",
  "Lab Technician",
  "Language Translation",
  "Learning & Development",
  "Legal Services",
  "Librarians & Library Management",
  "Logistics",
  "Management",
  "Manufacturing",
  "Market Research",
  "Marketing",
  "Mechanical Engineering",
  "Media & Communication",
  "Medical Services",
  "Merchandising",
  "Military & Protective Services",
  "Mobile App Development",
  "Motion Graphics",
  "Network Engineering",
  "NGO & Social Work",
  "Nursing",
  "Office Management",
  "Oil & Gas",
  "Online Tutoring",
  "Operations",
  "Outreach Coordination",
  "Payroll",
  "Performance Marketing",
  "Pharmaceutical / Biotechnology",
  "Photography",
  "Procurement",
  "Product Management",
  "Program Management",
  "Project Management",
  "Programming",
  "Public Relations (PR)",
  "Purchasing",
  "Quality Assurance",
  "Quantitative Analysis",
  "Real Estate Management",
  "Recruitment",
  "Relationship Management",
  "Renewable Energy",
  "Research",
  "Retail Services",
  "Risk Management",
  "SAAS",
  "Sales",
  "Security Services",
  "SEO/SEM",
  "Social Media Management",
  "Software Development",
  "Sport & Recreation",
  "Strategy & Planning",
  "Supply Chain",
  "Support Services",
  "Taxation",
  "Teaching",
  "Technology",
  "Telecommunications",
  "Testing (QA/Automation)",
  "Training",
  "Translation",
  "Travel/Airlines",
  "UI/UX Design",
  "Underwriting",
  "User Research",
  "Urban Planning & Zoning",
  "Veterinary Services",
  "Video Editing",
  "Visual Design",
  "Voiceover / Voice Acting",
  "Warehouse Operations",
  "Web Development",
  "Wellness Coaching",
  "Writing & Editing",
  "XML/Data Structuring",
  "Youth Program Coordination",
  "YouTube Channel Management",
  "CRM Management"
];

// ── Main Page ──
export default function FunctionsPage() {
  const { data, loading, refetch } = useGetFunctions();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFunction, setEditingFunction] = useState<MemberFunction | null>(null);
  const [functionToDelete, setFunctionToDelete] = useState<MemberFunction | null>(
    null,
  );

  const [addFunction, { loading: creating }] = useAddFunction({
    onCompleted: () => {
      notify.success("Job function created successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to create job function"),
  });

  const [updateFunction, { loading: updating }] = useUpdateFunction({
    onCompleted: () => {
      notify.success("Job function updated successfully");
      setIsDialogOpen(false);
      setEditingFunction(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to update job function"),
  });

  const [deleteFunction, { loading: deleting }] = useDeleteFunction({
    onCompleted: () => {
      notify.success("Job function deleted successfully");
      setFunctionToDelete(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to delete job function"),
  });

  const [bulkAddFunctions, { loading: bulkAdding }] = useBulkAddFunctions({
    onCompleted: (res) => {
      const addedCount = res.bulkAddFunctions?.length || 0;
      if (addedCount > 0) {
        notify.success(`Successfully added ${addedCount} job functions`);
      } else {
        notify.info("All recommended job functions already exist");
      }
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to bulk add job functions"),
  });

  const handleSave = async (values: { title: string }) => {
    if (editingFunction) {
      await updateFunction({
        variables: { input: { id: editingFunction.id, title: values.title } },
      });
    } else {
      await addFunction({
        variables: { input: values },
      });
    }
  };

  const handleDelete = async () => {
    if (!functionToDelete) return;
    await deleteFunction({
      variables: { input: { id: functionToDelete.id } },
    });
  };

  const handleBulkAdd = async () => {
    await bulkAddFunctions({
      variables: { input: { titles: RECOMMENDED_FUNCTIONS } },
    });
  };

  const functions = data?.getFunctions || [];
  const filteredFunctions = functions.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <EcosystemActionBar shadow="none" className="rounded-xl border border-border">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-[360px]">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search job functions..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="font-semibold text-xs px-4 h-9 rounded-lg shadow-sm gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              onClick={handleBulkAdd}
              disabled={bulkAdding}
            >
              {bulkAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Recommended
            </Button>
            <Button
              className="font-semibold text-xs px-6 h-9 rounded-lg shadow-sm gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                setEditingFunction(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Function
            </Button>
          </div>

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-border bg-card text-muted-foreground hover:text-foreground shadow-none"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredFunctions.length > 0}>
            {filteredFunctions.length} Functions
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        <FunctionsGrid
          functions={filteredFunctions}
          isLoading={loading}
          onEdit={(func) => {
            setEditingFunction(func);
            setIsDialogOpen(true);
          }}
          onDelete={(func) => setFunctionToDelete(func)}
        />
      </EcosystemContainer>

      {/* Add/Edit Dialog */}
      <FunctionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingFunction={editingFunction}
        isLoading={creating || updating}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!functionToDelete}
        onOpenChange={(open) => !open && setFunctionToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-foreground">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              This will permanently delete the job function{" "}
              <span className="font-bold text-foreground">
                "{functionToDelete?.title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="rounded-lg font-semibold border-border"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold gap-2"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete Function"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

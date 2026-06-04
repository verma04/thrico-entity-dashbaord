"use client";

import React, { useState } from "react";
import {
  useGetSkills,
  useAddSkill,
  useUpdateSkill,
  useDeleteSkill,
  Skill,
  useBulkAddSkills,
  useGetUsersBySkillNeo4j,
} from "@/graphql/quries/skills/skill-queries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  Loader2,
  Award,
  Sparkles,
  Users,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ── Color palette for skills ──
const SKILL_COLORS = [
  "#8b5cf6", // Purple
  "#14b8a6", // Teal
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#6366f1", // Indigo
  "#f97316", // Orange
];

function getSkillColor(index: number) {
  return SKILL_COLORS[index % SKILL_COLORS.length];
}

// ── Add/Edit Dialog ──
function SkillDialog({
  open,
  onOpenChange,
  editingSkill,
  isLoading,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSkill: Skill | null;
  isLoading: boolean;
  onSave: (values: { title: string }) => void;
}) {
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTitle(editingSkill?.title || "");
    }
  }, [open, editingSkill]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-border">
        <DialogHeader>
          <DialogTitle className="font-bold text-foreground">
            {editingSkill ? "Edit Skill" : "Add Skill"}
          </DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            {editingSkill
              ? "Update the skill name"
              : "Create a new professional skill to classify your members' areas of expertise"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label
              htmlFor="skill-title"
              className="text-sm font-semibold text-foreground"
            >
              Skill Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="skill-title"
              placeholder="e.g., React, TypeScript, Product Strategy"
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
            {editingSkill ? "Update" : "Save Skill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Skill Users Sheet ──
function SkillUsersSheet({
  skill,
  open,
  onOpenChange,
}: {
  skill: Skill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, loading } = useGetUsersBySkillNeo4j({
    variables: { skillId: skill?.id || "", limit: 50 },
    skip: !skill,
  });

  const users = data?.getUsersBySkillNeo4j?.data || [];
  const totalCount = data?.getUsersBySkillNeo4j?.totalCount || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            {skill?.title} Users
          </SheetTitle>
          <SheetDescription>
            {loading
              ? "Loading..."
              : `Found ${totalCount} users with this skill`}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
          ) : users.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p>No users found for this skill.</p>
            </div>
          ) : (
            users.map((user) => (
              <UserProfileHoverCard
                key={user.id}
                user={{ ...user, id: user.id }}
              >
                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage
                      src={
                        user.avatar
                          ? `https://cdn.thrico.network/${user.avatar}`
                          : ""
                      }
                      alt={user.firstName || ""}
                    />
                    <AvatarFallback className="bg-indigo-50 text-indigo-600 font-semibold">
                      {user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    {user.headline && (
                      <p className="text-xs text-muted-foreground truncate">
                        {user.headline}
                      </p>
                    )}
                  </div>
                </div>
              </UserProfileHoverCard>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Skills Grid ──
function SkillsGrid({
  skills,
  isLoading,
  onEdit,
  onDelete,
  onViewUsers,
}: {
  skills: Skill[];
  isLoading: boolean;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
  onViewUsers: (skill: Skill) => void;
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

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-muted/50 rounded-xl border border-border border-dashed m-4">
        <Sparkles className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          No skills found
        </h3>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-sm">
          Try adding a new skill or adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
      {skills.map((skill, index) => {
        const color = getSkillColor(index);
        return (
          <Card
            key={skill.id}
            onClick={() => onViewUsers(skill)}
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
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-md w-full text-foreground group-hover:text-indigo-600 transition-colors">
                      {skill.title}
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                      Skill
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(skill);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(skill);
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

// ── Recommended Skills ──
const RECOMMENDED_SKILLS = [
  "Accounting",
  "Adobe Photoshop",
  "Agile Methodology",
  "API Development",
  "Budgeting",
  "Business Analysis",
  "Branding",
  "Bookkeeping",
  "Coding",
  "CRM Management",
  "Copywriting",
  "CAD",
  "Data Analysis",
  "Digital Marketing",
  "Database Management (SQL)",
  "Debugging",
  "Excel",
  "Email Marketing",
  "ERP Systems",
  "Editing",
  "Financial Modeling",
  "Front End Development",
  "Figma",
  "Forecasting",
  "Google Analytics",
  "Graphic Design",
  "Git/GitHub",
  "HTML/CSS",
  "HRIS (Human Resource information system)",
  "Hadoop",
  "Illustration",
  "iOS Development",
  "Inventory Management",
  "Java",
  "JSON Handling",
  "Jira",
  "Journalism Techniques",
  "Kubernetes",
  "Keyword Research",
  "Knowledge Management",
  "Linux",
  "Laravel",
  "Lead Generation",
  "Legal Drafting",
  "Microsoft Office Suite",
  "Market Research",
  "Motion Graphics",
  "MySQL",
  "Networking (IT)",
  "Negotiation Tools",
  "Node.js",
  "Outlook",
  "Onboarding Process",
  "Oracle DB",
  "Operations Management",
  "Python",
  "Project Management",
  "Photoshop",
  "Power BI",
  "QA Testing",
  "QuickBooks",
  "Quantitative Analysis",
  "React.js",
  "Risk Analysis",
  "Reporting Tools",
  "Research",
  "SEO",
  "Social Media Management",
  "SQL",
  "Software Testing",
  "Tableau",
  "Technical Writing",
  "Time Tracking Tools",
  "Troubleshooting",
  "UI/UX Design",
  "Usability Testing",
  "Unreal Engine",
  "Video Editing",
  "Visual Design",
  "VMware",
  "Web Development",
  "WordPress",
  "Wireframing",
  "XML",
  "Xamarin",
  "YouTube Channel Management",
  "YAML",
  "Zoho CRM",
  "Zendesk",
  "Zapier Automation",
  "Adaptability",
  "Attention to detail",
  "Collaboration",
  "Communication",
  "Critical Thinking",
  "Creativity",
  "Decision Making",
  "Emotional Intelligence",
  "Leadership",
  "Multitasking",
  "Negotiation",
  "Organization",
  "Problem Solving",
  "Teamwork",
  "Time Management",
  "Work Ethic",
  "Conflict Resolution",
  "Flexibility",
  "Self-motivation",
];

// ── Main Page ──
export default function SkillsPage() {
  const { data, loading, refetch } = useGetSkills();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [viewingSkill, setViewingSkill] = useState<Skill | null>(null);

  const [addSkill, { loading: creating }] = useAddSkill({
    onCompleted: () => {
      notify.success("Skill created successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) => notify.error(error.message || "Failed to create skill"),
  });

  const [updateSkill, { loading: updating }] = useUpdateSkill({
    onCompleted: () => {
      notify.success("Skill updated successfully");
      setIsDialogOpen(false);
      setEditingSkill(null);
      refetch();
    },
    onError: (error) => notify.error(error.message || "Failed to update skill"),
  });

  const [deleteSkill, { loading: deleting }] = useDeleteSkill({
    onCompleted: () => {
      notify.success("Skill deleted successfully");
      setSkillToDelete(null);
      refetch();
    },
    onError: (error) => notify.error(error.message || "Failed to delete skill"),
  });

  const [bulkAddSkills, { loading: bulkAdding }] = useBulkAddSkills({
    onCompleted: (res) => {
      const addedCount = res.bulkAddSkills?.length || 0;
      if (addedCount > 0) {
        notify.success(`Successfully added ${addedCount} skills`);
      } else {
        notify.info("All recommended skills already exist");
      }
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to bulk add skills"),
  });

  const handleSave = async (values: { title: string }) => {
    if (editingSkill) {
      await updateSkill({
        variables: { input: { id: editingSkill.id, title: values.title } },
      });
    } else {
      await addSkill({
        variables: { input: values },
      });
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    await deleteSkill({
      variables: { input: { id: skillToDelete.id } },
    });
  };

  const handleBulkAdd = async () => {
    await bulkAddSkills({
      variables: { input: { titles: RECOMMENDED_SKILLS } },
    });
  };

  const skills = data?.getSkills || [];
  const filteredSkills = skills.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <EcosystemActionBar
        shadow="none"
        className="rounded-xl border border-border"
      >
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-[360px]">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search skills..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="font-semibold text-xs px-4 h-9 rounded-lg shadow-sm gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
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
                setEditingSkill(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Skill
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

          <EcosystemActionBar.Status active={filteredSkills.length > 0}>
            {filteredSkills.length} Skills
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        <SkillsGrid
          skills={filteredSkills}
          isLoading={loading}
          onEdit={(skill) => {
            setEditingSkill(skill);
            setIsDialogOpen(true);
          }}
          onDelete={(skill) => setSkillToDelete(skill)}
          onViewUsers={(skill) => setViewingSkill(skill)}
        />
      </EcosystemContainer>

      {/* Add/Edit Dialog */}
      <SkillDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingSkill={editingSkill}
        isLoading={creating || updating}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!skillToDelete}
        onOpenChange={(open) => !open && setSkillToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-foreground">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              This will permanently delete the skill{" "}
              <span className="font-bold text-foreground">
                "{skillToDelete?.title}"
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
              {deleting ? "Deleting..." : "Delete Skill"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Users Sheet */}
      <SkillUsersSheet
        skill={viewingSkill}
        open={!!viewingSkill}
        onOpenChange={(open) => !open && setViewingSkill(null)}
      />
    </>
  );
}

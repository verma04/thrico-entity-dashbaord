"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  MoreVertical,
  User,
  Upload,
  Linkedin,
  LayoutGrid,
  List as ListIcon,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  EventTeamMember,
  useEventTeam,
  useAddEventTeamMember,
  useUpdateEventTeamMember,
  useDeleteEventTeamMember,
} from "@/graphql/actions/events";
import { toast } from "sonner";

const teamSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  linkedin: Yup.string().url("Must be a valid URL"),
});

function TeamModal({
  eventId,
  member,
  open,
  onOpenChange,
}: {
  eventId: string;
  member?: EventTeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  React.useEffect(() => {
    if (open) {
      if (member?.avatar) {
        setImagePreview(`https://cdn.thrico.network/${member.avatar}`);
      } else {
        setImagePreview(null);
      }
      formik.resetForm();
    }
  }, [open, member]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("avatarImage", file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const [addTeamMember, { loading: adding }] = useAddEventTeamMember({
    onCompleted: () => {
      toast.success("Team member added");
      onOpenChange(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const [updateTeamMember, { loading: updating }] = useUpdateEventTeamMember({
    onCompleted: () => {
      toast.success("Team member updated");
      onOpenChange(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const loading = adding || updating;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: member?.firstName || "",
      lastName: member?.lastName || "",
      linkedin: member?.linkedin || "",
      avatarImage: null as any,
    },
    validationSchema: teamSchema,
    onSubmit: (values) => {
      const input = {
        eventId,
        firstName: values.firstName,
        lastName: values.lastName,
        linkedin: values.linkedin,
        avatarImage: values.avatarImage,
      };

      if (member) {
        updateTeamMember({
          variables: {
            teamMemberId: member.id,
            input: {
              ...input,
              avatar: member.avatar,
            },
          },
        });
      } else {
        addTeamMember({
          variables: {
            input,
          },
        });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          <DialogDescription>
            {member ? "Update team member details." : "Add a new member to your event team."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-2">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={imagePreview || "/placeholder.svg"} />
              <AvatarFallback>
                <User className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <label htmlFor="team-avatar-upload">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 cursor-pointer"
                type="button"
                onClick={() =>
                  document.getElementById("team-avatar-upload")?.click()
                }
              >
                <Upload className="h-3 w-3" />
                Upload Photo
              </Button>
            </label>
            <input
              id="team-avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-xs text-destructive">
                  {formik.errors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-xs text-destructive">
                  {formik.errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              name="linkedin"
              placeholder="https://linkedin.com/in/username"
              value={formik.values.linkedin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.linkedin && formik.errors.linkedin && (
              <p className="text-xs text-destructive">{formik.errors.linkedin}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : member ? "Save Changes" : "Add Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function EventTeam({ eventId }: { eventId: string }) {
  const { data, loading } = useEventTeam(eventId);
  const team: EventTeamMember[] = data?.getEventTeam || [];

  const [deleteTeamMember] = useDeleteEventTeamMember({
    onCompleted: () => toast.success("Team member removed"),
    onError: (err) => toast.error(err.message),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<EventTeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const [view, setView] = useState<"grid" | "list">("grid");

  const handleEdit = (member: EventTeamMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (memberToDelete) {
      deleteTeamMember({ variables: { teamMemberId: memberToDelete } });
      setMemberToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            Event Team
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage staff members, coordinators, and operational crew for this event.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Grid / List */}
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "grid" | "list")}
            className="bg-muted p-0.5 rounded-lg border border-border shrink-0"
          >
            <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
              <TabsTrigger
                value="grid"
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1"
              >
                <LayoutGrid className="h-3 w-3" />
                Grid
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1"
              >
                <ListIcon className="h-3 w-3" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button size="sm" className="gap-1.5 h-8 text-xs font-medium" onClick={handleAdd}>
            <Plus className="h-3.5 w-3.5" />
            Add Team Member
          </Button>
        </div>
      </div>

      <TeamModal
        eventId={eventId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        member={editingMember}
      />

      {team.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-12 text-center text-xs text-muted-foreground bg-card/40">
          <User className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="font-semibold text-foreground">No team members yet</p>
          <p className="text-muted-foreground mt-0.5">Click &ldquo;Add Team Member&rdquo; to start building your crew.</p>
        </div>
      ) : view === "grid" ? (
        /* ─── GRID VIEW ─────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-card border border-border/80 hover:border-border rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 group transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Avatar className="h-11 w-11 rounded-lg border border-border/60">
                    <AvatarImage
                      src={
                        member.avatar
                          ? `https://cdn.thrico.network/${member.avatar}`
                          : ""
                      }
                      alt={`${member.firstName} ${member.lastName}`}
                    />
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-muted"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-foreground truncate">
                    {member.firstName} {member.lastName}
                  </h4>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    Event Staff
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px] flex-1"
                  onClick={() => handleEdit(member)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setMemberToDelete(member.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ─── LIST VIEW ─────────────────────────────────────────────────── */
        <div className="border border-border/80 rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs">Team Member</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Social / LinkedIn</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 rounded-lg border border-border/60">
                        <AvatarImage
                          src={
                            member.avatar
                              ? `https://cdn.thrico.network/${member.avatar}`
                              : ""
                          }
                          alt={`${member.firstName} ${member.lastName}`}
                        />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                          {member.firstName?.[0]}{member.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold text-foreground truncate">
                        {member.firstName} {member.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-3">
                    Event Staff
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-3">
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Linkedin className="h-3 w-3" />
                        LinkedIn
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2"
                        onClick={() => handleEdit(member)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setMemberToDelete(member.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the event team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

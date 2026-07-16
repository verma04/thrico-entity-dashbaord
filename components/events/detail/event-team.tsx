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
  Plus,
  MoreVertical,
  User,
  Upload,
  Linkedin,
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
          <p className="text-sm">Loading team...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Team</h2>
        <Button className="gap-2" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      <TeamModal
        eventId={eventId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        member={editingMember}
      />

      {team.length === 0 ? (
        <Card className="flex h-48 items-center justify-center bg-muted/20 border-dashed">
          <CardContent className="flex flex-col items-center gap-2 pt-6">
            <User className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              No team members yet. Click "Add Team Member" to start building your team.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((member) => (
            <Card key={member.id} className="relative group hover:shadow-md transition-shadow">
              <CardHeader className="pb-4 pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4 border-2 border-background shadow-sm">
                    <AvatarImage
                      src={
                        member.avatar
                          ? `https://cdn.thrico.network/${member.avatar}`
                          : ""
                      }
                      alt={`${member.firstName} ${member.lastName}`}
                    />
                    <AvatarFallback className="bg-primary/5 text-primary text-xl">
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-center text-lg">
                    {member.firstName} {member.lastName}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-4 flex justify-center">
                {member.linkedin ? (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                ) : (
                  <div className="h-5" />
                )}
              </CardContent>
              <CardFooter className="flex gap-2 pt-0 border-t p-2 bg-muted/20">
                <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={() => handleEdit(member)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setMemberToDelete(member.id)}>
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
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

"use client";

import React, { useState } from "react";
import { Mentor } from "@/types/mentor-types";
import { useMentorStore } from "@/store/useMentorStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit,
  Trash2,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Linkedin,
  Globe,
  Mail,
  Award,
  Loader2,
} from "lucide-react";

interface MentorListProps {
  onEdit: (mentor: Mentor | any) => void;
  mentors: any[];
  isLoading?: boolean;
  onRefetch?: () => void;
}

export const MentorList: React.FC<MentorListProps> = ({
  onEdit,
  mentors,
  isLoading,
  onRefetch,
}) => {
  const {
    deleteMentor,
    toggleActive,
    toggleFeatured,
    toggleTrending,
    approveMentor,
    rejectMentor,
  } = useMentorStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState<any | null>(null);

  const handleDeleteClick = (mentor: Mentor) => {
    setMentorToDelete(mentor);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (mentorToDelete) {
      deleteMentor(mentorToDelete.id);
      setDeleteDialogOpen(false);
      setMentorToDelete(null);
    }
  };

  const getStatusBadge = (status: Mentor["status"]) => {
    const variants = {
      approved: { variant: "default" as const, label: "Approved" },
      pending: { variant: "secondary" as const, label: "Pending" },
      rejected: { variant: "destructive" as const, label: "Rejected" },
      inactive: { variant: "outline" as const, label: "Inactive" },
    };
    return variants[status];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading mentors...</p>
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">No mentors found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="p-5 border rounded-lg bg-card hover:shadow-md transition"
          >
            {/* Image */}
            {mentor.image && (
              <div className="mb-4 rounded-full overflow-hidden w-20 h-20 mx-auto">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 text-center">
                  <h3 className="font-semibold text-lg">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {mentor.title}
                  </p>
                </div>
                <div className="flex gap-1">
                  {mentor.isFeatured && (
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  )}
                  {mentor.isTrending && (
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge {...getStatusBadge(mentor.status)}>
                  {getStatusBadge(mentor.status).label}
                </Badge>
                <Badge variant="outline">
                  {mentor.source === "admin" ? "Admin" : "User"}
                </Badge>
                <Badge variant="outline">{mentor.categoryName}</Badge>
                {mentor.yearsOfExperience && (
                  <Badge variant="secondary" className="gap-1">
                    <Award className="h-3 w-3" />
                    {mentor.yearsOfExperience}y exp
                  </Badge>
                )}
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground line-clamp-2 text-center">
                {mentor.bio}
              </p>

              {/* Expertise */}
              {mentor.expertise && mentor.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {mentor.expertise
                    .slice(0, 3)
                    .map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full bg-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  {mentor.expertise.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-muted">
                      +{mentor.expertise.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Contact Info */}
              <div className="flex gap-2 justify-center text-xs text-muted-foreground">
                {mentor.email && (
                  <a
                    href={`mailto:${mentor.email}`}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    <Mail className="h-3 w-3" />
                  </a>
                )}
                {mentor.linkedin && (
                  <a
                    href={mentor.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    <Linkedin className="h-3 w-3" />
                  </a>
                )}
                {mentor.website && (
                  <a
                    href={mentor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    <Globe className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Availability */}
              {mentor.availability && (
                <p className="text-xs text-center text-muted-foreground">
                  Status: {mentor.availability}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t flex-wrap justify-center">
                <Switch
                  checked={mentor.isActive}
                  onCheckedChange={() => toggleActive(mentor.id)}
                  className="mr-auto"
                />

                {mentor.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => approveMentor(mentor.id)}
                      className="text-green-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rejectMentor(mentor.id)}
                      className="text-red-600"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFeatured(mentor.id)}
                  className={mentor.isFeatured ? "text-yellow-500" : ""}
                >
                  <Star
                    className={`h-4 w-4 ${mentor.isFeatured ? "fill-current" : ""}`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleTrending(mentor.id)}
                  className={mentor.isTrending ? "text-blue-500" : ""}
                >
                  <TrendingUp className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(mentor)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(mentor)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Mentor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{mentorToDelete?.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

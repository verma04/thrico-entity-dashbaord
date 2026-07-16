"use client";

import React, { useState } from "react";
import { WallOfFameEntry } from "@/types/wall-of-fame-types";
import { useWallOfFameStore } from "@/store/useWallOfFameStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, GripVertical, Award, Star, Globe, Linkedin, Twitter } from "lucide-react";

interface EntryListProps {
  onEdit: (entry: WallOfFameEntry) => void;
}

export const EntryList: React.FC<EntryListProps> = ({ onEdit }) => {
  const { getFilteredEntries, deleteEntry, toggleStatus, toggleFeatured } = useWallOfFameStore();
  const entries = getFilteredEntries();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<WallOfFameEntry | null>(null);

  const handleDeleteClick = (entry: WallOfFameEntry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (entryToDelete) {
      deleteEntry(entryToDelete.id);
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg">
        <Award className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No entries found</h3>
        <p className="text-sm text-muted-foreground">Add your first wall of fame entry</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="relative p-5 border rounded-lg bg-card hover:shadow-md transition-shadow"
          >
            {/* Drag Handle */}
            <div className="absolute top-3 left-3">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
            </div>

            {/* Featured Badge */}
            {entry.isFeatured && (
              <div className="absolute top-3 right-3">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </div>
            )}

            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-4 mt-2">
              <Avatar className="h-20 w-20 mb-3">
                <AvatarImage src={entry.image} alt={entry.name} />
                <AvatarFallback>
                  {entry.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <h3 className="font-semibold text-lg">{entry.name}</h3>
              <p className="text-sm text-muted-foreground">{entry.title}</p>

              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{entry.category}</Badge>
                {entry.year && <Badge variant="secondary">{entry.year}</Badge>}
                <Badge variant={entry.isActive ? "default" : "secondary"}>
                  {entry.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {entry.description}
            </p>

            {/* Achievement */}
            {entry.achievement && (
              <div className="flex items-start gap-2 mb-4 p-2 bg-muted/50 rounded">
                <Award className="h-4 w-4 text-primary mt-0.5" />
                <p className="text-sm">{entry.achievement}</p>
              </div>
            )}

            {/* Social Links */}
            {(entry.socialLinks?.linkedin ||
              entry.socialLinks?.twitter ||
              entry.socialLinks?.website) && (
              <div className="flex gap-2 mb-4">
                {entry.socialLinks.linkedin && (
                  <a
                    href={entry.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-muted rounded"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {entry.socialLinks.twitter && (
                  <a
                    href={entry.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-muted rounded"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {entry.socialLinks.website && (
                  <a
                    href={entry.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-muted rounded"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}

            {/* Tags */}
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {entry.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t">
              <Switch
                checked={entry.isActive}
                onCheckedChange={() => toggleStatus(entry.id)}
                className="mr-auto"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFeatured(entry.id)}
                className={entry.isFeatured ? "text-yellow-500" : ""}
              >
                <Star className={`h-4 w-4 ${entry.isFeatured ? "fill-current" : ""}`} />
              </Button>

              <Button variant="ghost" size="icon" onClick={() => onEdit(entry)}>
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(entry)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{entryToDelete?.name}" from the Wall of Fame?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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

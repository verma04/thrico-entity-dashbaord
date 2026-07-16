"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2, Megaphone, Loader2, Eye, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, gql } from "@apollo/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const GET_ALL_ANNOUNCEMENTS = gql`
  query GetAllAnnouncements {
    getAllAnnouncements {
      id
      subject
      description
      category
      allowReplies
      isActive
      createdAt
    }
  }
`;

const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($id: ID!, $input: UpdateAnnouncementInput!) {
    updateAnnouncement(id: $id, input: $input) {
      id
      subject
      description
      category
      allowReplies
    }
  }
`;

const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id)
  }
`;

export function AnnouncementsManager() {
  const { data, loading, refetch } = useQuery(GET_ALL_ANNOUNCEMENTS);
  const [deleteMutation] = useMutation(DELETE_ANNOUNCEMENT);
  const [updateMutation] = useMutation(UPDATE_ANNOUNCEMENT);
  const router = useRouter();

  const [deletingId, setDeletingId] = useState<string | null>(null);



  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation({ variables: { id: deletingId } });
      toast.success("Announcement deleted successfully");
      refetch();
    } catch (e: any) {
      toast.error(e.message || "Failed to delete announcement");
    } finally {
      setDeletingId(null);
    }
  };

  const announcements = data?.getAllAnnouncements || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Announcements Manager
          </h2>
        </div>
        <Button onClick={() => router.push("/trust-center/announcements/create")} size="sm" className="h-8 gap-2">
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No announcements found.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground text-[11px]">
                  Subject
                </th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-[11px]">
                  Category
                </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-[11px]">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-[11px]">
                    Date
                  </th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-[11px] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {announcements.map((ann: any) => (
                <tr
                  key={ann.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 text-foreground font-medium">
                    {ann.subject}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-[11px]">
                    <span className="bg-muted px-2 py-0.5 rounded-full border border-border">
                      {ann.category}
                    </span>
                  </td>
                    <td className="px-4 py-3 text-muted-foreground text-[11px]">
                      <span className={`px-2 py-0.5 rounded-full border ${ann.isActive ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900' : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900'}`}>
                        {ann.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {ann.createdAt
                        ? format(new Date(ann.createdAt), "MMM d, yyyy")
                        : "N/A"}
                    </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => router.push(`/trust-center/announcements/view/${ann.id}`)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => router.push(`/trust-center/announcements/edit/${ann.id}`)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingId(ann.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Edit2, Trash2, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { 
  useGetMentorTestimonials, 
  useUpdateMentorTestimonial, 
  useDeleteMentorTestimonial,
  MentorTestimonial
} from "@/graphql/mentorship/mentorship-quiries";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MentorTestimonialsDialogProps {
  mentorId: string;
  mentorName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MentorTestimonialsDialog({
  mentorId,
  mentorName,
  open,
  onOpenChange,
}: MentorTestimonialsDialogProps) {
  const { data, loading, refetch } = useGetMentorTestimonials({
    variables: { mentorshipId: mentorId },
    skip: !open,
    fetchPolicy: "network-only",
  });

  const [deleteTestimonial] = useDeleteMentorTestimonial({
    onCompleted: () => {
      toast.success("Testimonial deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete testimonial");
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (deletingId) {
      await deleteTestimonial({ variables: { id: deletingId } });
      setDeletingId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) setEditingId(null);
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Testimonials</DialogTitle>
          <DialogDescription>
            View, edit, or delete testimonials for {mentorName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : data?.getMentorTestimonials?.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No testimonials found for this mentor.
            </div>
          ) : (
            <div className="space-y-4">
              {data?.getMentorTestimonials.map((testimonial) => (
                editingId === testimonial.id ? (
                  <EditTestimonialForm 
                    key={testimonial.id}
                    testimonial={testimonial}
                    onCancel={() => setEditingId(null)}
                    onSuccess={() => {
                      setEditingId(null);
                      refetch();
                    }}
                  />
                ) : (
                  <div key={testimonial.id} className="p-4 border border-slate-200 rounded-lg shadow-sm space-y-2 bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-slate-800">{testimonial.from}</div>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "w-4 h-4",
                                testimonial.rating >= star
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-300 fill-slate-300"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600" onClick={() => setEditingId(testimonial.id)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600" onClick={() => setDeletingId(testimonial.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{testimonial.testimonial}</p>
                    <div className="text-[10px] text-slate-400 text-right mt-2">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </DialogContent>
      
      <Dialog open={!!deletingId} onOpenChange={(val) => !val && setDeletingId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

function EditTestimonialForm({ 
  testimonial, 
  onCancel, 
  onSuccess 
}: { 
  testimonial: MentorTestimonial, 
  onCancel: () => void,
  onSuccess: () => void 
}) {
  const [from, setFrom] = useState(testimonial.from);
  const [desc, setDesc] = useState(testimonial.testimonial);
  const [rating, setRating] = useState(testimonial.rating);
  const [hoverRating, setHoverRating] = useState(0);

  const [updateTestimonial, { loading }] = useUpdateMentorTestimonial({
    onCompleted: () => {
      toast.success("Testimonial updated successfully!");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update testimonial");
    },
  });

  const handleSave = async () => {
    if (!from.trim() || !desc.trim()) {
      toast.error("Name and description are required.");
      return;
    }
    await updateTestimonial({
      variables: {
        input: {
          id: testimonial.id,
          from,
          testimonial: desc,
          rating,
        }
      }
    });
  };

  return (
    <div className="p-4 border border-indigo-200 rounded-lg shadow-sm space-y-3 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-bold text-indigo-700">Edit Testimonial</h4>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500" onClick={onCancel} disabled={loading}>
            <X className="h-4 w-4" />
          </Button>
          <Button variant="default" size="sm" className="h-8 px-2 bg-indigo-600 hover:bg-indigo-700" onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Save
          </Button>
        </div>
      </div>
      
      <Input 
        value={from} 
        onChange={(e) => setFrom(e.target.value)} 
        placeholder="User Name" 
        className="text-sm"
        disabled={loading}
      />
      
      <div className="flex gap-1 py-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-5 h-5 cursor-pointer transition-colors",
              (hoverRating || rating) >= star
                ? "text-amber-400 fill-amber-400"
                : "text-slate-200 fill-slate-200"
            )}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          />
        ))}
      </div>

      <Textarea 
        value={desc} 
        onChange={(e) => setDesc(e.target.value)} 
        placeholder="Description" 
        rows={3}
        className="text-sm resize-none"
        disabled={loading}
      />
    </div>
  );
}

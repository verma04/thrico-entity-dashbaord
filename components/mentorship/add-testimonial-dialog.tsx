"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useAddMentorTestimonial } from "@/graphql/mentorship/mentorship-quiries";
import { cn } from "@/lib/utils";

interface AddTestimonialDialogProps {
  mentorId: string;
  mentorName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTestimonialDialog({
  mentorId,
  mentorName,
  open,
  onOpenChange,
}: AddTestimonialDialogProps) {
  const [from, setFrom] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const [addTestimonial, { loading }] = useAddMentorTestimonial({
    onCompleted: () => {
      toast.success("Testimonial added successfully!");
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add testimonial");
    },
  });

  const handleClose = () => {
    setFrom("");
    setTestimonial("");
    setRating(5);
    setHoverRating(0);
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim()) {
      toast.error("Please provide the user name.");
      return;
    }
    if (!testimonial.trim()) {
      toast.error("Please provide a description.");
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error("Please provide a valid rating.");
      return;
    }

    await addTestimonial({
      variables: {
        input: {
          mentorshipId: mentorId,
          from,
          testimonial,
          rating,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Testimonial</DialogTitle>
          <DialogDescription>
            Add a testimonial for {mentorName} with a star rating.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="from">User Name <span className="text-destructive">*</span></Label>
            <Input
              id="from"
              placeholder="e.g. John Doe"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="testimonial">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="testimonial"
              placeholder="Write the testimonial here..."
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Rating <span className="text-destructive">*</span></Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-6 h-6 cursor-pointer transition-colors",
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
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !from.trim() || !testimonial.trim()}>
              {loading ? "Adding..." : "Add Testimonial"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

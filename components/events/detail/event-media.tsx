"use client";

import React, { useState, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { Upload, Plus, Video, Trash2 } from "lucide-react";
import {
  useEventMedia,
  useAddEventMedia,
  useUpdateEventMediaVisibility,
  useDeleteEventMedia,
  EventMedia as EventMediaType,
} from "@/graphql/actions/events";
import { toast } from "sonner";

function MediaCard({
  item,
  onDelete,
  onToggleVisibility,
}: {
  item: EventMediaType;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
}) {
  return (
    <Card className="group overflow-hidden border-none shadow-sm ring-1 ring-border/50 hover:shadow-md hover:ring-border/80 transition-all duration-300 flex flex-col">
      <CardHeader className="p-0 relative">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {item.mediaType?.toUpperCase() === "IMAGE" ? (
            <img
              src={`https://cdn.thrico.network/${item.url}` || "/placeholder.svg"}
              alt={item.title || "Media"}
              className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5">
              <div className="rounded-full bg-background/80 p-3 shadow-sm backdrop-blur-md border">
                <Video className="h-6 w-6 text-foreground/70" />
              </div>
            </div>
          )}
          
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <Badge
              variant={item.isPublic ? "default" : "secondary"}
              className={
                item.isPublic
                  ? "bg-green-500/90 hover:bg-green-600 text-white border-none cursor-pointer shadow-sm backdrop-blur-md font-medium"
                  : "bg-background/90 text-foreground hover:bg-background border-none cursor-pointer shadow-sm backdrop-blur-md font-medium"
              }
              onClick={() => onToggleVisibility(item.id, !item.isPublic)}
            >
              {item.isPublic ? "Public" : "Private"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-sm line-clamp-1 flex-1 leading-relaxed">
              {item.title || (item.mediaType?.toUpperCase() === "IMAGE" ? "Untitled Image" : "Untitled Video")}
            </h3>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1.5 -mr-2 shrink-0 transition-colors"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {item.tags && item.tags.length > 0 ? (
              item.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted/60 text-muted-foreground font-normal">
                  #{tag}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground/50 italic">No tags</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EventMedia({ eventId }: { eventId: string }) {
  const { data, loading, refetch } = useEventMedia(eventId);
  const mediaItems = data?.getEventMedia || [];

  const [addMedia, { loading: adding }] = useAddEventMedia({
    onCompleted: () => {
      toast.success("Media added successfully");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const [updateVisibility] = useUpdateEventMediaVisibility({
    onCompleted: () => {
      toast.success("Visibility updated");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const [deleteMedia] = useDeleteEventMedia({
    onCompleted: () => {
      toast.success("Media deleted");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await addMedia({
        variables: {
          input: {
            eventId,
            mediaFile: file,
            mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
            title: file.name,
            tags: ["upload"],
            isPublic: true,
          },
        },
      });
    } finally {
      // Reset input so the same file can be uploaded again if deleted
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (mediaToDelete) {
      deleteMedia({ variables: { mediaId: mediaToDelete } });
      setMediaToDelete(null);
    }
  };

  const handleToggleVisibility = (id: string, isPublic: boolean) => {
    updateVisibility({ variables: { mediaId: id, isPublic } });
  };

  const filteredItems = {
    all: mediaItems,
    public: mediaItems.filter((i) => i.isPublic),
    private: mediaItems.filter((i) => !i.isPublic),
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Media Gallery</h2>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileUpload}
          />
          <Button
            className="gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={adding}
          >
            <Upload className="h-4 w-4" />
            {adding ? "Uploading..." : "Upload Media"}
          </Button>
        
        </div>
      </div>

      <Tabs defaultValue="all">
       
        {(["all", "public", "private"] as const).map((key) => (
          <TabsContent key={key} value={key} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems[key].map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onDelete={(id) => setMediaToDelete(id)}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
              <Card
                className="border-dashed flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Button variant="ghost" className="gap-2 pointer-events-none">
                  <Plus className="h-4 w-4" />
                  Add Media
                </Button>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <AlertDialog open={!!mediaToDelete} onOpenChange={(open) => !open && setMediaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this media from the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Media
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

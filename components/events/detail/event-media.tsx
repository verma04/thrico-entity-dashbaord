"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Upload, Plus, Video, Trash2, Edit } from "lucide-react";
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
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          {item.mediaType === "IMAGE" ? (
            <Image
              src={item.url || "/placeholder.svg"}
              alt={item.title || "Media"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="rounded-full bg-white/80 p-3">
                <Video className="h-8 w-8" />
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">{item.title}</span>
          <Badge
            variant={item.isPublic ? "default" : "secondary"}
            className={
              item.isPublic
                ? "bg-green-500/10 text-green-600 border-green-500/20 cursor-pointer"
                : "bg-gray-500/10 text-gray-600 border-gray-500/20 cursor-pointer"
            }
            onClick={() => onToggleVisibility(item.id, !item.isPublic)}
          >
            {item.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button size="sm" variant="outline" className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="flex-1"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
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

  const handleAddDemoMedia = async () => {
    await addMedia({
      variables: {
        input: {
          eventId,
          url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
          mediaType: "IMAGE",
          title: "Main Stage",
          tags: ["stage", "day1"],
          isPublic: true,
        },
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this media?")) {
      deleteMedia({ variables: { mediaId: id } });
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
          <Button
            className="gap-2"
            onClick={handleAddDemoMedia}
            disabled={adding}
          >
            <Upload className="h-4 w-4" />
            {adding ? "Uploading..." : "Upload Media"}
          </Button>
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Import from Social
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Media</TabsTrigger>
          <TabsTrigger value="public">Public Media</TabsTrigger>
          <TabsTrigger value="private">Private Media</TabsTrigger>
        </TabsList>

        {(["all", "public", "private"] as const).map((key) => (
          <TabsContent key={key} value={key} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems[key].map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
                />
              ))}
              <Card
                className="border-dashed flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={handleAddDemoMedia}
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
    </div>
  );
}

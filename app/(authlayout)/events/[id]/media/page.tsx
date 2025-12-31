"use client";

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
import { Upload, Plus, Video } from "lucide-react";

const mediaItems = [
  {
    id: "1",
    type: "image",
    title: "Opening Keynote",
    url: "/placeholder.svg",
    tags: ["keynote", "day1"],
    isPublic: true,
  },
  {
    id: "2",
    type: "image",
    title: "Workshop Session",
    url: "/placeholder.svg",
    tags: ["workshop", "day1"],
    isPublic: true,
  },
  {
    id: "3",
    type: "image",
    title: "Networking Event",
    url: "/placeholder.svg",
    tags: ["networking", "day1"],
    isPublic: true,
  },
  {
    id: "4",
    type: "image",
    title: "Panel Discussion",
    url: "/placeholder.svg",
    tags: ["panel", "day2"],
    isPublic: false,
  },
  {
    id: "5",
    type: "video",
    title: "Closing Remarks",
    url: "/placeholder.svg",
    tags: ["closing", "day3"],
    isPublic: false,
  },
  {
    id: "6",
    type: "image",
    title: "Sponsor Booth",
    url: "/placeholder.svg",
    tags: ["sponsor", "day2"],
    isPublic: true,
  },
];

function MediaCard({ item }: { item: (typeof mediaItems)[number] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={item.url}
            alt={item.title}
            fill
            className="object-cover"
          />
          {item.type === "video" && (
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
                ? "bg-green-500/10 text-green-600 border-green-500/20"
                : "bg-gray-500/10 text-gray-600 border-gray-500/20"
            }
          >
            {item.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button size="sm" variant="outline" className="flex-1">
          Edit
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          {item.isPublic ? "Make Private" : "Make Public"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function EventMedia() {
  const filteredItems = {
    all: mediaItems,
    public: mediaItems.filter((i) => i.isPublic),
    private: mediaItems.filter((i) => !i.isPublic),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Media Gallery</h2>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Media
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
                <MediaCard key={item.id} item={item} />
              ))}
              <Card className="border-dashed flex items-center justify-center min-h-[200px]">
                <Button variant="ghost" className="gap-2">
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

export default EventMedia;

"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Lock } from "lucide-react";
import { useModuleStore } from "@/store/useModuleStore";

interface CommunityPreviewProps {
  formData: {
    name?: string;
    title?: string;
    tagline?: string;
    description?: string;
    privacy?: string;
    coverImage?: string;
    enableEvents?: boolean;
  };
  imageUrl: string | null;
}

export function CommunityPreview({
  formData,
  imageUrl,
}: CommunityPreviewProps) {
  const singularName = useModuleStore((state) => state.communitySingularName);

  return (
    <Card className="overflow-hidden shadow-md">
      <CardContent className="p-0">
        <div className="aspect-3/2 overflow-hidden bg-muted rounded-t-lg">
          <Image
            src={
              imageUrl || `https://cdn.thrico.network/default_communities.png`
            }
            alt={`${singularName} cover`}
            width={1536}
            height={1024}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg flex-1 truncate">
              {formData?.name || formData?.title || `${singularName} Name`}
            </h3>
            {formData?.privacy === "PUBLIC" ||
            formData?.privacy === "public" ? (
              <Globe className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          {formData?.tagline && (
            <p className="text-sm text-muted-foreground mb-4">
              {formData.tagline}
            </p>
          )}

          <Tabs defaultValue="discussion" className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="discussion" className="flex-1">
                Discussion
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex-1">
                Featured
              </TabsTrigger>
              <TabsTrigger value="people" className="flex-1">
                People
              </TabsTrigger>
              <TabsTrigger value="media" className="flex-1">
                Media
              </TabsTrigger>
              <TabsTrigger value="events" className="flex-1">
                Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discussion" className="mt-4">
              <div className="grid grid-cols-3 text-center mb-4">
                <div>
                  <div className="text-2xl font-semibold">0</div>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold">0</div>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold">0</div>
                  <p className="text-xs text-muted-foreground">Events</p>
                </div>
              </div>

              {formData?.description ? (
                <p className="text-sm leading-relaxed">
                  {formData.description}
                </p>
              ) : (
                <div className="flex items-center justify-center h-20 border-2 border-dashed rounded-md bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    {singularName} description will appear here
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured" className="mt-4">
              <p className="text-sm text-muted-foreground">Featured content</p>
            </TabsContent>

            <TabsContent value="people" className="mt-4">
              <p className="text-sm text-muted-foreground">People content</p>
            </TabsContent>

            <TabsContent value="media" className="mt-4">
              <p className="text-sm text-muted-foreground">Media content</p>
            </TabsContent>

            <TabsContent value="events" className="mt-4">
              <p className="text-sm text-muted-foreground">Events content</p>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}

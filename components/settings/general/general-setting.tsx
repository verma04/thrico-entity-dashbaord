"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

import { Store, Loader2 } from "lucide-react";
import BillingAddress from "./billing-address";
import {
  useGetEntity,
  useUpdateEntityProfile,
  useUploadEntityLogo,
} from "@/graphql/actions";

export default function GeneralSettings() {
  const { toast } = useToast();
  const { data: entityData, loading: entityLoading } = useGetEntity();

  const [isEditingName, setIsEditingName] = useState(false);
  const [communityName, setCommunityName] = useState(
    entityData?.getEntity?.name || "My Page"
  );
  const [tempName, setTempName] = useState(communityName);
  const [communityImage, setCommunityImage] = useState<string>("");

  const [updateProfile, { loading: updatingProfile }] = useUpdateEntityProfile({
    onCompleted: (data: any) => {
      if (data.updateEntityProfile.success) {
        toast({
          title: "Success",
          description:
            data.updateEntityProfile.message || "Profile updated successfully!",
        });
        setCommunityName(data.updateEntityProfile.name);
      } else {
        toast({
          title: "Error",
          description:
            data.updateEntityProfile.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const [uploadEntityLogo] = useUploadEntityLogo({
    onCompleted: (data: any) => {
      // Handled in customUploadHandler
    },
    onError: (error: any) => {
      // Handled in customUploadHandler
    },
  });

  useEffect(() => {
    if (entityData?.getEntity) {
      setCommunityName(entityData.getEntity.name || "My Page");
      setTempName(entityData.getEntity.name || "My Page");
      setCommunityImage(
        `https://cdn.thrico.network/${entityData.getEntity.logo}` || ""
      );
    }
  }, [entityData]);

  const handleNameEdit = () => {
    setTempName(communityName);
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (tempName.trim() && tempName !== communityName) {
      updateProfile({
        variables: {
          input: {
            name: tempName.trim(),
          },
        },
      });
    }
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(communityName);
    setIsEditingName(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Entity Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <Card className="border-0 bg-muted/30 p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Avatar className="w-16 h-16 flex-shrink-0">
                  <AvatarImage src={communityImage} alt="Entity" />
                  <AvatarFallback>
                    <Store className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>

                {isEditingName ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="font-semibold"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleNameSave}
                      disabled={updatingProfile}
                    >
                      {updatingProfile && (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      )}
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNameCancel}
                      disabled={updatingProfile}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{communityName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Entity name and image
                    </p>
                  </div>
                )}
              </div>

              {!isEditingName && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNameEdit}
                  disabled={updatingProfile}
                  className="self-end md:self-auto"
                >
                  Edit
                </Button>
              )}
            </div>
          </Card>

          <Separator />

          {/* Entity Logo Upload */}
          <div>
            <h3 className="text-sm font-medium mb-4">Entity Logo</h3>
            <ImageUploadWithCrop
              currentImage={communityImage}
              onImageUpdate={setCommunityImage}
              label="Logo"
              recommendedWidth={512}
              recommendedHeight={512}
              aspectRatio={1}
              circularCrop={true}
              showAspectRatioPresets={true}
              showQualitySlider={true}
              showFormatSelector={true}
              enableDragDrop={true}
              enableZoom={true}
              maxFileSize={5}
              defaultQuality={90}
              defaultFormat="webp"
              uploadButtonText="Upload Entity Logo"
              changeButtonText="Change Logo"
              maxWidth={2048}
              maxHeight={2048}
              minWidth={256}
              minHeight={256}
              customDescription="Square logo recommended for best results. Drag & drop or click to upload."
              customUploadHandler={async (file) => {
                try {
                  const { data } = await uploadEntityLogo({
                    variables: { file },
                  });
                  if (data?.uploadEntityLogo?.success) {
                    toast({
                      title: "Success",
                      description:
                        data.uploadEntityLogo.message ||
                        "Logo updated successfully!",
                    });
                    // Return the full URL for the preview update
                    return `https://cdn.thrico.network/${data.uploadEntityLogo.logo}`;
                  } else {
                    throw new Error(
                      data?.uploadEntityLogo?.message || "Failed to upload logo"
                    );
                  }
                } catch (error: any) {
                  throw new Error(error.message || "Failed to upload logo");
                }
              }}
            />
          </div>

          <Separator />

          {/* Billing Address */}
          <BillingAddress />
        </CardContent>
      </Card>
    </div>
  );
}

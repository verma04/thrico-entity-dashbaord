"use client";

import { useUploadEntityLogo } from "@/graphql/actions";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface EntityLogoUploadProps {
  currentImage: string;
  onImageUpdate: (url: string) => void;
}

export const EntityLogoUpload = ({
  currentImage,
  onImageUpdate,
}: EntityLogoUploadProps) => {
  const { toast } = useToast();
  const [uploadEntityLogo] = useUploadEntityLogo({
    onCompleted: (data: any) => {},
    onError: (error: any) => {},
  });

  return (
    <div className="w-full">
      <ImageUploadWithCrop
        currentImage={currentImage}
        onImageUpdate={onImageUpdate}
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
                  data.uploadEntityLogo.message || "Logo updated successfully!",
              });
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
  );
};

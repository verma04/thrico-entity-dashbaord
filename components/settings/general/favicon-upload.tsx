"use client";

import { useUploadImage } from "@/graphql/actions";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface FaviconUploadProps {
  currentImage: string;
  onImageUpdate: (url: string) => void;
}

export const FaviconUpload = ({
  currentImage,
  onImageUpdate,
}: FaviconUploadProps) => {
  const { toast } = useToast();
  const [uploadImage] = useUploadImage();

  return (
    <div className="w-full">
      <ImageUploadWithCrop
        currentImage={currentImage}
        onImageUpdate={onImageUpdate}
        label="Favicon"
        recommendedWidth={32}
        recommendedHeight={32}
        aspectRatio={1}
        circularCrop={false}
        showAspectRatioPresets={false}
        showQualitySlider={false}
        showFormatSelector={false}
        enableDragDrop={true}
        enableZoom={true}
        maxFileSize={2}
        defaultQuality={100}
        defaultFormat="png"
        uploadButtonText="Upload Favicon"
        changeButtonText="Change Favicon"
        maxWidth={512}
        maxHeight={512}
        minWidth={32}
        minHeight={32}
        customDescription="32x32 PNG recommended. Used for browser tabs and bookmarks."
        customUploadHandler={async (file) => {
          try {
            const { data } = await uploadImage({
              variables: { file },
            });

            if (data?.uploadImage) {
              toast({
                title: "Success",
                description: "Favicon uploaded successfully!",
              });
              return `${process.env.NEXT_PUBLIC_CDN_URL}/${data.uploadImage}`;
            } else {
              throw new Error("Failed to upload favicon");
            }
          } catch (error: any) {
            throw new Error(error.message || "Failed to upload favicon");
          }
        }}
      />
    </div>
  );
};

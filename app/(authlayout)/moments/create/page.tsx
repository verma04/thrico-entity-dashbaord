"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import React from "react";
import { useRouter } from "next/navigation";
import { MomentCreationForm } from "@/components/moments/add/moment-creation-form";
import { useToast } from "@/components/ui/use-toast";
import { useAdminGenerateMomentUploadUrl, useAdminConfirmMomentUpload } from "@/graphql/actions/moments";

const CreateMomentPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = React.useState(1);
  const [uploadedAssets, setUploadedAssets] = React.useState<any>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadStatus, setUploadStatus] = React.useState<string | null>(null);

  const [generateUploadUrl] = useAdminGenerateMomentUploadUrl();
  const [confirmUpload, { loading: confirming }] = useAdminConfirmMomentUpload({
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Moment published successfully!",
      });
      router.push("/moments/all");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to publish moment",
        variant: "destructive",
      });
    }
  });

  const uploadFileWithProgress = (url: string, file: File, onProgress: (pct: number) => void) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("Content-Type", file.type || "video/mp4");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status} ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(file);
    });
  };

  const handleUploadAssets = async (files: any) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const { videoFile, thumbnailFile } = files;

      // 1. Generate Pre-signed URLs
      setUploadStatus("Initializing upload channels...");
      
      const { data: uploadData } = await generateUploadUrl({
        variables: {
          input: {
            videoFileName: videoFile.name,
            videoFileType: videoFile.type,
            videoFileSize: videoFile.size,
            thumbnailFileName: thumbnailFile?.name || "thumbnail.jpg",
            thumbnailFileType: thumbnailFile?.type || "image/jpeg",
            thumbnailFileSize: thumbnailFile?.size || 0,
          }
        }
      });

      const { 
        videoUploadUrl, 
        thumbnailUploadUrl, 
        videoFileUrl, 
        thumbnailFileUrl 
      } = uploadData.adminGenerateMomentUploadUrl;

      // 2. Upload to S3
      setUploadStatus("Uploading Moment...");
      
      // Upload thumbnail first (smaller)
      if (thumbnailFile && thumbnailUploadUrl) {
        await uploadFileWithProgress(thumbnailUploadUrl, thumbnailFile, () => {});
      }

      // Upload video with progress tracking
      await uploadFileWithProgress(videoUploadUrl, videoFile, (pct) => {
        setUploadProgress(pct);
      });

      // Store results and move to next step
      setUploadedAssets({
        videoUrl: videoFileUrl,
        thumbnailUrl: thumbnailFileUrl,
      });
      setStep(2);
      toast({ title: "Assets Staged", description: "Media transmission successful." });

    } catch (error: any) {
      console.error("Upload flow error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "An error occurred during the upload process",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setUploadStatus("Finalizing Moment...");
      setIsUploading(true);
      
      await confirmUpload({
        variables: {
          input: {
            fileUrl: values.videoUrl,
            thumbnailUrl: values.thumbnailUrl,
            caption: values.caption,
            shareInFeed: values.shareInFeed,
            isAiContent: values.isAiContent
          }
        }
      });

    } catch (error: any) {
      console.error("Finalization error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during finalization",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadStatus(null);
    }
  };

  const onCancel = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  };

  return (
    <div className="h-full overflow-hidden bg-white">
      <MomentCreationForm
        loading={isUploading || confirming}
        onUploadAssets={handleUploadAssets}
        onFinish={onFinish}
        onCancel={onCancel}
        step={step}
        uploadedAssets={uploadedAssets}
        uploadProgress={uploadProgress}
        uploadStatus={uploadStatus}
      />
    </div>
  );
};



export default withSubscriptionCheck(
  withModulePermission(CreateMomentPage, "MOMENTS", "canCreate"),
  "moments"
);

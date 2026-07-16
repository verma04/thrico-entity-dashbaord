"use client";

import React, { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAddMediaGalleryImage } from "@/graphql/actions/mediaGallery";

export function UploadZone({
  albumId,
  imageCount,
  onUploaded,
}: {
  albumId: string;
  imageCount: number;
  onUploaded: () => void;
}) {
  const [addImage] = useAddMediaGalleryImage(albumId);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList) => {
    setUploading(true);
    const fileArray = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );

    if (fileArray.length === 0) {
      setUploading(false);
      return;
    }

    let successCount = 0;

    // Upload in parallel
    await Promise.all(
      fileArray.map(async (file, index) => {
        try {
          await addImage({
            variables: {
              input: {
                albumId,
                imageUpload: file,
                order: imageCount + index,
              },
            },
          });
          successCount++;
        } catch (err: any) {
          toast.error(`Failed to upload ${file.name}`);
        }
      }),
    );

    if (successCount > 0) {
      toast.success(
        `${successCount} image${successCount > 1 ? "s" : ""} uploaded`,
      );
      onUploaded();
    }
    setUploading(false);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
        dragOver
          ? "border-indigo-400 bg-indigo-50"
          : "border-gray-200 bg-gray-50/50 hover:border-indigo-200 hover:bg-gray-50"
      }`}
      onClick={() => fileRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />
      {uploading ? (
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      ) : (
        <>
          <Upload className="w-8 h-8 text-gray-300" />
          <span className="text-xs text-gray-400 text-center px-2">
            Click or drag images here
          </span>
        </>
      )}
    </div>
  );
}

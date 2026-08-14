"use client";

import type React from "react";
import { useState } from "react";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PhotoUploadFile } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ImageUpload({
  fileList,
  onFilesChange,
}: {
  fileList: PhotoUploadFile[];
  onFilesChange: (files: PhotoUploadFile[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const MAX_FILES = 4;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files as File[]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = (newFiles: File[]) => {
    const availableSlots = MAX_FILES - (fileList?.length || 0);
    const filesToAdd = newFiles.slice(0, availableSlots);

    const newFileList: PhotoUploadFile[] = filesToAdd.map((file, index) => ({
      uid: `${Date.now()}-${index}`,
      name: file.name,
      thumbUrl: URL.createObjectURL(file),
      file,
    }));

    onFilesChange([...(fileList || []), ...newFileList]);
  };

  const removeFile = (uid: string) => {
    onFilesChange((fileList || []).filter((f) => f.uid !== uid));
  };

  const slotsRemaining = MAX_FILES - (fileList?.length || 0);

  return (
    <div className="space-y-3">
      {slotsRemaining > 0 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("listing-file-input")?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all",
            isDragging
              ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900/5 dark:bg-zinc-100/5"
              : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/40 dark:bg-zinc-900/40",
          )}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={slotsRemaining <= 0}
            className="hidden"
            id="listing-file-input"
          />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
              <Upload className="h-4 w-4" />
            </div>
            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              Drag photos here or <span className="underline">browse files</span>
            </p>
            <p className="text-[10px] text-zinc-400">
              PNG, JPG, WEBP · {slotsRemaining} of {MAX_FILES} slots remaining
            </p>
          </div>
        </div>
      )}

      {fileList && fileList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {fileList.map((file, idx) => (
            <div
              key={file.uid}
              className="relative group rounded-xl overflow-hidden aspect-square border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
            >
              <img
                src={file.thumbUrl || "/placeholder.svg"}
                alt={file.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
              />
              {idx === 0 && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-zinc-900/80 text-white backdrop-blur-md text-[9px] font-bold">
                  Primary
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.uid);
                  }}
                  className="h-7 w-7 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 text-white border-none shadow-md"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

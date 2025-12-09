"use client";

import type React from "react";
import { Aperture as Picture } from "lucide-react";

import { Button as UIButton } from "@/components/ui/button";

export default function Media({
  fileList,
  setFileList,
}: {
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFileList([
        ...fileList,
        ...newFiles.map((file) => ({
          uid: Math.random().toString(),
          name: file.name,
          status: "done" as const,
          originFileObj: file,
        })),
      ]);
    }
  };

  return (
    <div>
      <label htmlFor="media-upload">
        <UIButton variant="ghost" size="sm" className="cursor-pointer" asChild>
          <span>
            <Picture className="h-4 w-4" />
          </span>
        </UIButton>
      </label>
      <input
        id="media-upload"
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

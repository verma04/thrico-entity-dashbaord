"use client";

import { X } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { UploadFile } from "./types";



function AllMedia({
  fileList,
  setFileList,
}: {
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}) {
  const allImages = useMemo(() => {
    return fileList.map((file) => ({
      uid: file.uid,
      name: file.name || "",
      url:
        file.url ||
        (file.originFileObj ? URL.createObjectURL(file.originFileObj) : ""),
      status: file.status as "done" | "uploading" | "error",
      isExternalUrl: false,
    }));
  }, [fileList]);

  return (
    <>
      {allImages.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {allImages.map((img) => (
            <div key={img.uid} className="relative">
              <img
                src={img.url || "/placeholder.svg"}
                alt={img.name}
                width={100}
                height={100}
                className="object-cover rounded"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 p-1 bg-background/80 rounded-full hover:bg-background"
                onClick={() =>
                  setFileList((prev) =>
                    prev.filter((file) => file.uid !== img.uid)
                  )
                }
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default AllMedia;

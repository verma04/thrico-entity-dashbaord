"use client"

import type React from "react"
import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PhotoUploadFile } from "@/lib/utils"

export function ImageUpload({
  fileList,
  onFilesChange,
}: {
  fileList: PhotoUploadFile[]
  onFilesChange: (files: PhotoUploadFile[]) => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const MAX_FILES = 4

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    addFiles(files as File[])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addFiles(files)
  }

  const addFiles = (newFiles: File[]) => {
    const availableSlots = MAX_FILES - (fileList?.length || 0)
    const filesToAdd = newFiles.slice(0, availableSlots)

    const newFileList: PhotoUploadFile[] = filesToAdd.map((file, index) => ({
      uid: `${Date.now()}-${index}`,
      name: file.name,
      thumbUrl: URL.createObjectURL(file),
      file,
    }))

    onFilesChange([...(fileList || []), ...newFileList])
  }

  const removeFile = (uid: string) => {
    onFilesChange((fileList || []).filter((f) => f.uid !== uid))
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          disabled={(fileList?.length || 0) >= MAX_FILES}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="font-medium text-foreground">Drop images or click to upload</p>
          <p className="text-sm text-muted-foreground">{MAX_FILES - (fileList?.length || 0)} slots remaining</p>
        </label>
      </div>

      {fileList && fileList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {fileList.map((file) => (
            <div key={file.uid} className="relative group rounded-lg overflow-hidden bg-muted">
              <img src={file.thumbUrl || "/placeholder.svg"} alt={file.name} className="w-full h-24 object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.uid)}
                  className="text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

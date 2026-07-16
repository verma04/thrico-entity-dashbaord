import React, { useRef } from "react";
import { UploadCloud, FileIcon, CheckCircle2 } from "lucide-react";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

export const FileUploadBox = ({ label, desc, accept, onFileSelect, selectedFile, error, existingPath, showPreview, recommendedWidth, recommendedHeight, aspectRatio, lockDimensions }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const previewUrl = React.useMemo(() => {
    if (!showPreview) return null;
    if (selectedFile && selectedFile.type?.startsWith("image/")) {
      return URL.createObjectURL(selectedFile);
    }
    return existingPath ? getPreferredMediaUrl(existingPath) : null;
  }, [selectedFile, existingPath, showPreview]);

  if (showPreview && accept?.includes("image")) {
    return (
      <div className="space-y-2 w-full h-full">
        <ImageUploadWithCrop
          currentImage={previewUrl || ""}
          onImageUpdate={(cdnUrl, url) => {
            if (!url) onFileSelect(null);
          }}
          onFileChange={onFileSelect}
          returnFileOnly={true}
          allowedFormats={accept.split(",")}
          hideRecommendedSize={false}
          recommendedWidth={recommendedWidth}
          recommendedHeight={recommendedHeight}
          aspectRatio={aspectRatio}
          showAspectRatioPresets={!lockDimensions}
          showDimensions={!lockDimensions}
          enforceExactDimensions={lockDimensions}
          label={label}
          customDescription={desc}
          className={`h-full w-full ${error ? 'border-red-500 rounded-xl border-2' : ''}`}
          dropzoneClassName="h-full min-h-[160px] border-2"
          previewClassName="h-full min-h-[160px]"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <div 
        className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer relative overflow-hidden group ${error ? 'border-red-500 hover:bg-red-50' : 'border-border hover:bg-muted/50 text-muted-foreground'} ${previewUrl ? 'p-0 h-40 border-0' : 'p-8'}`}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={inputRef} 
          accept={accept} 
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileSelect(e.target.files[0]);
            }
          }} 
          className="hidden" 
        />
        {previewUrl ? (
          <div className="absolute inset-0 w-full h-full bg-black/5">
            <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <UploadCloud className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Click to replace</span>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="flex flex-col items-center">
            <FileIcon className={`w-8 h-8 mb-2 ${error ? 'text-red-500' : 'text-primary'}`} />
            <span className={`text-sm font-medium ${error ? 'text-red-500' : 'text-foreground'}`}>{selectedFile.name}</span>
            <span className={`text-xs mt-1 ${error ? 'text-red-500' : ''}`}>{(selectedFile.size / 1024).toFixed(1)} KB</span>
          </div>
        ) : existingPath ? (
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 mb-2 text-green-500" />
            <span className="text-sm font-medium text-foreground">File Uploaded</span>
            <span className="text-xs text-center max-w-sm mt-1 text-muted-foreground">Click to upload a new replacement file</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCloud className={`w-8 h-8 mb-2 ${error ? 'text-red-500' : ''}`} />
            <span className={`text-sm font-medium ${error ? 'text-red-500' : ''}`}>{label}</span>
            <span className={`text-xs text-center max-w-sm mt-1 ${error ? 'text-red-500' : ''}`}>{desc}</span>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

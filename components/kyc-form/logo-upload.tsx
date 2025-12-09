"use client";

import type React from "react";
import { useState } from "react";
import { Loader2, LayoutList as PlusOutlined } from "lucide-react";

interface LogoUploadProps {
  imageUrl?: string;
  setImageUrl: (url: string) => void;
  setCover: (file: File) => void;
  buttonText?: string;
}

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};

const beforeUpload = (file: File) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    alert("You can only upload JPG, PNG, or WEBP files!");
    return false;
  }

  if (file.size / 1024 / 1024 > 2) {
    alert("Image must be smaller than 2MB!");
    return false;
  }

  return true;
};

const LogoUpload: React.FC<LogoUploadProps> = ({
  imageUrl,
  setImageUrl,
  setCover,
  buttonText = "Upload Logo",
}) => {
  const [loading, setLoading] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!beforeUpload(file)) return;

    setLoading(true);
    try {
      setCover(file);
      const preview = await getBase64(file);
      setImageUrl(preview);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Upload Logo</label>

      <label className="cursor-pointer block">
        <input
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          disabled={loading}
        />

        <div className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-accent transition-colors">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="logo"
              className="w-full h-24 object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <PlusOutlined className="h-8 w-8 text-muted-foreground" />
              )}
              <div className="text-sm font-medium">{buttonText}</div>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};

export default LogoUpload;

import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Demo showcasing the enhanced ImageUploadWithCrop component
 * with various customization options
 */
export function ImageUploadDemo() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Image Upload Demos</h1>
        <p className="text-muted-foreground">
          Explore the enhanced features of the ImageUploadWithCrop component
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 1. Avatar Upload - Circular Crop */}
        <Card>
          <CardHeader>
            <CardTitle>Avatar Upload</CardTitle>
            <CardDescription>
              Circular crop, aspect ratio presets, drag & drop enabled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploadWithCrop
              currentImage={avatarUrl}
              onImageUpdate={setAvatarUrl}
              label="Profile Picture"
              recommendedWidth={256}
              recommendedHeight={256}
              circularCrop={true}
              showAspectRatioPresets={true}
              aspectRatio={1}
              enableDragDrop={true}
              uploadButtonText="Upload Avatar"
              changeButtonText="Change"
              customDescription="Square image works best"
            />
          </CardContent>
        </Card>

        {/* 2. Banner Upload - Quality & Format Control */}
        <Card>
          <CardHeader>
            <CardTitle>Banner Upload</CardTitle>
            <CardDescription>
              Quality slider, format selector, wide aspect ratio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploadWithCrop
              currentImage={bannerUrl}
              onImageUpdate={setBannerUrl}
              label="Banner Image"
              recommendedWidth={1920}
              recommendedHeight={1080}
              aspectRatio={16 / 9}
              maxFileSize={10}
              showQualitySlider={true}
              showFormatSelector={true}
              defaultQuality={85}
              defaultFormat="webp"
              enableDragDrop={true}
            />
          </CardContent>
        </Card>

        {/* 3. Product Image - Full Featured */}
        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
            <CardDescription>
              All features: presets, quality, format, zoom
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploadWithCrop
              currentImage={productUrl}
              onImageUpdate={setProductUrl}
              label="Product Photo"
              recommendedWidth={800}
              recommendedHeight={800}
              showAspectRatioPresets={true}
              showQualitySlider={true}
              showFormatSelector={true}
              enableZoom={true}
              maxWidth={3000}
              maxHeight={3000}
              minWidth={400}
              minHeight={400}
              defaultQuality={90}
              defaultFormat="jpeg"
              onUploadStart={() => console.log("Upload started")}
              onUploadComplete={(url) => console.log("Upload complete:", url)}
              onUploadError={(error) => console.error("Upload error:", error)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Current Image URLs */}
      <Card>
        <CardHeader>
          <CardTitle>Current Image URLs</CardTitle>
          <CardDescription>
            Images uploaded via the enhanced component
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <strong>Avatar:</strong>{" "}
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {avatarUrl || "Not uploaded"}
            </code>
          </div>
          <div>
            <strong>Banner:</strong>{" "}
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {bannerUrl || "Not uploaded"}
            </code>
          </div>
          <div>
            <strong>Product:</strong>{" "}
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {productUrl || "Not uploaded"}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

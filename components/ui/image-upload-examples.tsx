/**
 * Example usage of ImageUploadWithCrop component
 * These examples demonstrate various use cases
 */

import { useState } from "react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

// ============================================
// Example 1: Logo Upload (3:1 Aspect Ratio)
// ============================================
export function LogoUploadExample() {
  const [logo, setLogo] = useState("");

  return (
    <ImageUploadWithCrop
      label="Company Logo"
      currentImage={logo}
      onImageUpdate={setLogo}
      recommendedWidth={150}
      recommendedHeight={50}
      aspectRatio={3}
      maxFileSize={2}
      allowedFormats={["image/png", "image/jpeg"]}
    />
  );
}

// ============================================
// Example 2: Square Profile Picture
// ============================================
export function ProfilePictureExample() {
  const [avatar, setAvatar] = useState("");

  return (
    <ImageUploadWithCrop
      label="Profile Picture"
      currentImage={avatar}
      onImageUpdate={setAvatar}
      recommendedWidth={200}
      recommendedHeight={200}
      aspectRatio={1} // Square
      maxFileSize={5}
    />
  );
}

// ============================================
// Example 3: Banner/Cover Image (16:9)
// ============================================
export function BannerImageExample() {
  const [banner, setBanner] = useState("");

  return (
    <ImageUploadWithCrop
      label="Cover Image"
      currentImage={banner}
      onImageUpdate={setBanner}
      recommendedWidth={1920}
      recommendedHeight={1080}
      aspectRatio={16 / 9}
      maxFileSize={10}
    />
  );
}

// ============================================
// Example 4: Product Image (Free Crop)
// ============================================
export function ProductImageExample() {
  const [productImage, setProductImage] = useState("");

  return (
    <ImageUploadWithCrop
      label="Product Image"
      currentImage={productImage}
      onImageUpdate={setProductImage}
      recommendedWidth={800}
      recommendedHeight={800}
      // No aspectRatio = free crop
      maxFileSize={5}
    />
  );
}

// ============================================
// Example 5: Thumbnail (4:3)
// ============================================
export function ThumbnailExample() {
  const [thumbnail, setThumbnail] = useState("");

  return (
    <ImageUploadWithCrop
      label="Video Thumbnail"
      currentImage={thumbnail}
      onImageUpdate={setThumbnail}
      recommendedWidth={640}
      recommendedHeight={480}
      aspectRatio={4 / 3}
      maxFileSize={2}
    />
  );
}

// ============================================
// Example 6: Multiple Images in Form
// ============================================
export function MultipleImagesForm() {
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");
  const [avatar, setAvatar] = useState("");

  return (
    <div className="space-y-6">
      <ImageUploadWithCrop
        label="Profile Picture"
        currentImage={avatar}
        onImageUpdate={setAvatar}
        recommendedWidth={200}
        recommendedHeight={200}
        aspectRatio={1}
      />

      <ImageUploadWithCrop
        label="Company Logo"
        currentImage={logo}
        onImageUpdate={setLogo}
        recommendedWidth={150}
        recommendedHeight={50}
        aspectRatio={3}
      />

      <ImageUploadWithCrop
        label="Banner Image"
        currentImage={banner}
        onImageUpdate={setBanner}
        recommendedWidth={1200}
        recommendedHeight={400}
        aspectRatio={3}
      />
    </div>
  );
}

// ============================================
// Example 7: Integration with Form State
// ============================================
export function FormIntegrationExample() {
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    banner: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form className="space-y-6">
      <div>
        <label>Company Name</label>
        <input
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>

      <ImageUploadWithCrop
        label="Company Logo"
        currentImage={formData.logo}
        onImageUpdate={(url) => updateField("logo", url)}
        recommendedWidth={150}
        recommendedHeight={50}
        aspectRatio={3}
      />

      <ImageUploadWithCrop
        label="Banner"
        currentImage={formData.banner}
        onImageUpdate={(url) => updateField("banner", url)}
        recommendedWidth={1200}
        recommendedHeight={400}
        aspectRatio={3}
      />
    </form>
  );
}

// ============================================
// Example 8: With Custom Styling
// ============================================
export function CustomStyledExample() {
  const [image, setImage] = useState("");

  return (
    <ImageUploadWithCrop
      label="Custom Styled Image"
      currentImage={image}
      onImageUpdate={setImage}
      recommendedWidth={400}
      recommendedHeight={400}
      aspectRatio={1}
      className="border-2 border-primary rounded-xl p-4"
    />
  );
}

// ============================================
// Example 9: Conditional Rendering
// ============================================
export function ConditionalExample() {
  const [showUpload, setShowUpload] = useState(false);
  const [image, setImage] = useState("");

  return (
    <div>
      <button onClick={() => setShowUpload(!showUpload)}>
        {showUpload ? "Hide" : "Show"} Upload
      </button>

      {showUpload && (
        <ImageUploadWithCrop
          label="Optional Image"
          currentImage={image}
          onImageUpdate={setImage}
          recommendedWidth={300}
          recommendedHeight={300}
        />
      )}
    </div>
  );
}

// ============================================
// Example 10: With Validation Callback
// ============================================
export function ValidationExample() {
  const [image, setImage] = useState("");

  const handleImageUpdate = (url: string) => {
    console.log("Image uploaded:", url);
    setImage(url);
    // Additional validation or processing
  };

  return (
    <ImageUploadWithCrop
      label="Validated Image"
      currentImage={image}
      onImageUpdate={handleImageUpdate}
      recommendedWidth={500}
      recommendedHeight={500}
      maxFileSize={3}
      allowedFormats={["image/png"]} // Only PNG
    />
  );
}

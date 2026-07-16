# ImageUploadWithCrop - Usage Examples

## Overview
The enhanced `ImageUploadWithCrop` component now includes extensive customization options for a professional image upload experience.

## New Features

### 🎨 **Drag & Drop Support**
- Drag image files directly onto the upload area
- Visual feedback during drag operations
- Can be disabled if needed

### 🔧 **Advanced Crop Controls**
- **Aspect Ratio Presets**: Quick selection of common aspect ratios (Square, Portrait, Landscape, etc.)
- **Circular Crop**: Perfect for profile pictures and avatars
- **Free Crop**: Unconstrained cropping

### ⚙️ **Image Quality & Format**
- **Quality Slider**: Control from 1-100% (affects file size)
- **Format Selection**: Choose between PNG, JPEG, or WebP
- **Smart Defaults**: 90% quality and PNG format by default

### 🔍 **Zoom Controls**
- Scale output from 50% to 300%
- Live preview of final dimensions
- Smooth zoom transitions

### 🎯 **Customizable UI**
- Custom button text for all actions
- Custom dropzone styling
- Custom preview styling
- Circular preview support
- Custom descriptions and labels

### 📐 **Dimension Controls**
- Min/max width and height constraints
- Live validation
- Clear range indicators

---

## Basic Usage

```tsx
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { useState } from "react";

export function BasicExample() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <ImageUploadWithCrop
      currentImage={imageUrl}
      onImageUpdate={setImageUrl}
      label="Profile Picture"
      recommendedWidth={300}
      recommendedHeight={300}
    />
  );
}
```

---

## Advanced Examples

### 1. Avatar Upload (Circular with Presets)

```tsx
<ImageUploadWithCrop
  currentImage={avatarUrl}
  onImageUpdate={setAvatarUrl}
  label="Avatar"
  recommendedWidth={256}
  recommendedHeight={256}
  circularCrop={true}
  showAspectRatioPresets={true}
  aspectRatio={1} // Force square
  enableDragDrop={true}
  uploadButtonText="Upload Avatar"
  changeButtonText="Change"
  removeButtonText="Remove"
/>
```

### 2. Banner Image (with Quality & Format Control)

```tsx
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
  customDescription="Upload a high-quality banner for your profile"
/>
```

### 3. Product Image (with Zoom & Advanced Controls)

```tsx
<ImageUploadWithCrop
  currentImage={productUrl}
  onImageUpdate={setProductUrl}
  label="Product Image"
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
/>
```

### 4. Logo Upload (PNG Only, No Dimensions)

```tsx
<ImageUploadWithCrop
  currentImage={logoUrl}
  onImageUpdate={setLogoUrl}
  label="Company Logo"
  recommendedWidth={512}
  recommendedHeight={512}
  aspectRatio={1}
  circularCrop={false}
  showDimensions={false}
  allowedFormats={["image/png"]}
  maxFileSize={2}
  hideRecommendedSize={true}
  customDescription="Upload your company logo (PNG only, transparent background recommended)"
/>
```

### 5. Custom Styled Upload

```tsx
<ImageUploadWithCrop
  currentImage={imageUrl}
  onImageUpdate={setImageUrl}
  label="Custom Styled Upload"
  recommendedWidth={600}
  recommendedHeight={400}
  className="my-custom-wrapper"
  dropzoneClassName="border-blue-500 hover:border-blue-700 bg-blue-50/50"
  previewClassName="bg-gradient-to-br from-blue-50 to-purple-50"
  uploadButtonText="📸 Click or Drop Image Here"
  saveButtonText="💾 Save & Upload"
  cancelButtonText="✕ Cancel"
/>
```

### 6. With Callbacks

```tsx
<ImageUploadWithCrop
  currentImage={imageUrl}
  onImageUpdate={setImageUrl}
  label="Event Cover"
  recommendedWidth={1200}
  recommendedHeight={630}
  onUploadStart={() => {
    console.log("Upload started...");
    setUploading(true);
  }}
  onUploadComplete={(url) => {
    console.log("Upload completed:", url);
    setUploading(false);
    toast.success("Image uploaded successfully!");
  }}
  onUploadError={(error) => {
    console.error("Upload error:", error);
    setUploading(false);
    toast.error("Failed to upload image");
  }}
/>
```

### 7. Minimal Upload (No Preview)

```tsx
<ImageUploadWithCrop
  currentImage={imageUrl}
  onImageUpdate={setImageUrl}
  label="Quick Upload"
  recommendedWidth={500}
  recommendedHeight={500}
  disablePreview={true}
  showDimensions={false}
  enableDragDrop={true}
/>
```

---

## All Available Props

```tsx
interface ImageUploadWithCropProps {
  // Required
  currentImage?: string;
  onImageUpdate: (imageUrl: string) => void;

  // Basic
  label?: string;
  recommendedWidth?: number;
  recommendedHeight?: number;
  aspectRatio?: number;
  maxFileSize?: number; // in MB
  allowedFormats?: string[];
  showDimensions?: boolean;
  className?: string;

  // Drag & Drop
  enableDragDrop?: boolean;

  // Crop Options
  circularCrop?: boolean;
  showAspectRatioPresets?: boolean;
  aspectRatioPresets?: AspectRatioPreset[];

  // Quality & Format
  showQualitySlider?: boolean;
  showFormatSelector?: boolean;
  defaultQuality?: number; // 0-100
  defaultFormat?: "png" | "jpeg" | "webp";

  // Zoom
  enableZoom?: boolean;

  // Dimension Constraints
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;

  // UI Customization
  uploadButtonText?: string;
  changeButtonText?: string;
  removeButtonText?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  previewClassName?: string;
  dropzoneClassName?: string;
  hideRecommendedSize?: boolean;
  customDescription?: string;
  disablePreview?: boolean;

  // Callbacks
  onUploadStart?: () => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
}
```

---

## Custom Aspect Ratio Presets

```tsx
import { Square, Circle, Maximize2 } from "lucide-react";

const customPresets = [
  { label: "Free", value: undefined, icon: <Maximize2 className="h-4 w-4" /> },
  { label: "1:1", value: 1, icon: <Square className="h-4 w-4" /> },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "21:9", value: 21 / 9 },
  { label: "9:16", value: 9 / 16 }, // Stories/Reels
];

<ImageUploadWithCrop
  {...props}
  showAspectRatioPresets={true}
  aspectRatioPresets={customPresets}
/>
```

---

## Tips & Best Practices

### Performance
- Use `defaultQuality={85}` for web images (good balance)
- Use `defaultFormat="webp"` for best compression with modern browsers
- Set appropriate `maxFileSize` to prevent large uploads

### User Experience
- Enable `enableDragDrop` for better UX
- Provide clear `customDescription` for specific requirements
- Use `circularCrop` for profile pictures/avatars
- Show `showAspectRatioPresets` when users need multiple options

### Accessibility
- Component includes ARIA labels automatically
- Keyboard navigation supported (Enter/Space to trigger upload)
- Clear visual feedback for all states

### Recommended Settings by Use Case

**Profile Picture:**
- `circularCrop={true}`
- `aspectRatio={1}`
- `recommendedWidth={256}`
- `defaultFormat="webp"`

**Banner/Cover:**
- `aspectRatio={16/9}` or `aspectRatio={21/9}`
- `showQualitySlider={true}`
- `defaultQuality={85}`
- `maxFileSize={10}`

**Product Images:**
- `showAspectRatioPresets={true}`
- `enableZoom={true}`
- `showQualitySlider={true}`
- `defaultFormat="jpeg"`

**Logo:**
- `aspectRatio={1}`
- `allowedFormats={["image/png"]}`
- `showDimensions={false}`
- `defaultFormat="png"`
- `defaultQuality={100}`

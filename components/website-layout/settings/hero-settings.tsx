"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Plus,
  Trash2,
  Sparkles,
  Type,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { LayoutType } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";

interface HeroActionButton {
  text?: string;
  link?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

interface HeroSlideItem {
  title?: string;
  subtitle?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface HeroFeatureItem {
  title?: string;
  description?: string;
}

interface HeroSettingsProps {
  content: Record<string, unknown>;
  onChange: (updates: Record<string, unknown>) => void;
  layout: LayoutType;
}

interface HeroFormValues {
  title: string;
  description: string;
  badge: string;
  image: string;
  buttons: HeroActionButton[];
  autoPlayDuration: number;
  slides: HeroSlideItem[];
  videoUrl: string;
  features: HeroFeatureItem[];
  placeholder: string;
  buttonText: string;
  subscribersCount: string;
  trustBadge1: string;
  trustBadge2: string;
  appScreenshot: string;
  appScreen2: string;
  appStoreLink: string;
  playStoreLink: string;
  downloadsText: string;
  rating: string;
  creators: Array<{ name?: string; role?: string; avatar?: string }>;
  ctaText: string;
  ctaLink: string;
  subtext: string;
  cards: Array<{ title?: string; image?: string; tag?: string }>;
  titleAccent: string;
  eventDate: string;
  eventLocation: string;
}

const heroValidationSchema = Yup.object().shape({
  title: Yup.string().nullable(),
  description: Yup.string().nullable(),
  badge: Yup.string().nullable(),
});

export const HeroSettings: React.FC<HeroSettingsProps> = ({
  content,
  onChange,
  layout,
}) => {
  const formik = useFormik<HeroFormValues>({
    enableReinitialize: true,
    initialValues: {
      title: (content?.title as string) || "",
      description: (content?.description as string) || "",
      badge: (content?.badge as string) || "",
      image: (content?.image as string) || "",
      buttons: (content?.buttons as HeroActionButton[]) || [],
      // Carousel
      autoPlayDuration: (content?.autoPlayDuration as number) || 5,
      slides: (content?.slides as HeroSlideItem[]) || [],
      // Video
      videoUrl: (content?.videoUrl as string) || "",
      // Split
      features: (content?.features as HeroFeatureItem[]) || [],
      // Newsletter
      placeholder:
        (content?.placeholder as string) || "Enter your email address...",
      buttonText: (content?.buttonText as string) || "Subscribe Now",
      subscribersCount: (content?.subscribersCount as string) || "12,847",
      trustBadge1: (content?.trustBadge1 as string) || "No spam, ever",
      trustBadge2: (content?.trustBadge2 as string) || "Unsubscribe anytime",
      // App Showcase
      appScreenshot: (content?.appScreenshot as string) || "",
      appScreen2: (content?.appScreen2 as string) || "",
      appStoreLink: (content?.appStoreLink as string) || "#",
      playStoreLink: (content?.playStoreLink as string) || "#",
      downloadsText: (content?.downloadsText as string) || "50K+ downloads",
      rating: (content?.rating as string) || "4.8",
      // Creator Showcase
      creators:
        (content?.creators as Array<{
          name?: string;
          role?: string;
          avatar?: string;
        }>) || [],
      ctaText: (content?.ctaText as string) || "Join 15,000+ Creators",
      ctaLink: (content?.ctaLink as string) || "#",
      subtext:
        (content?.subtext as string) || "Free to join • No credit card required",
      // Dark Cinematic
      cards:
        (content?.cards as Array<{
          title?: string;
          image?: string;
          tag?: string;
        }>) ||
        (content?.slides as Array<{
          title?: string;
          image?: string;
          tag?: string;
        }>) ||
        [],
      // Globe
      titleAccent: (content?.titleAccent as string) || "",
      // Event Countdown
      eventDate: (content?.eventDate as string) || "October 24-26, 2026",
      eventLocation:
        (content?.eventLocation as string) ||
        "San Francisco, CA & Global Stream",
    },
    validationSchema: heroValidationSchema,
    onSubmit: (values) => {
      onChange(values as unknown as Record<string, unknown>);
    },
  });

  // Immediate sync helper between Formik and parent builder
  const handleUpdate = <K extends keyof typeof formik.values>(
    key: K,
    value: (typeof formik.values)[K]
  ) => {
    formik.setFieldValue(key, value);
    onChange({
      ...formik.values,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      {/* ─── SECTION 1: CORE HERO TYPOGRAPHY & VISUALS ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            1
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Core Typography & Visuals
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Primary headline, narrative copy, and background visuals
            </p>
          </div>
        </div>

        {/* Optional Eyebrow / Badge */}
        <div className="space-y-1.5">
          <Label
            htmlFor="hero-badge"
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            <Sparkles className="h-3 w-3 text-indigo-500" />
            Badge / Eyebrow Text
          </Label>
          <Input
            id="hero-badge"
            value={formik.values.badge}
            onChange={(e) => handleUpdate("badge", e.target.value)}
            placeholder="e.g. New Feature 2.0 or Welcome"
            className="h-9 text-xs"
          />
          <p className="text-[11px] text-muted-foreground leading-snug">
            Small highlight pill displayed above the main heading
          </p>
        </div>

        {/* Main Heading */}
        <div className="space-y-1.5">
          <Label
            htmlFor="hero-title"
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            <Type className="h-3 w-3 text-indigo-500" />
            Main Heading
          </Label>
          <Input
            id="hero-title"
            value={formik.values.title}
            onChange={(e) => handleUpdate("title", e.target.value)}
            placeholder="Welcome to Our Platform"
            className="h-9 text-xs font-medium"
          />
        </div>

        {/* Subtitle / Description */}
        <div className="space-y-1.5">
          <Label
            htmlFor="hero-description"
            className="text-xs font-semibold text-foreground"
          >
            Subtitle / Description
          </Label>
          <Textarea
            id="hero-description"
            value={formik.values.description}
            onChange={(e) => handleUpdate("description", e.target.value)}
            placeholder="Discover extraordinary opportunities and connect with our thriving community."
            className="text-xs min-h-[70px] leading-relaxed resize-none"
            rows={3}
          />
        </div>

        {/* Background / Main Image */}
        {layout !== "video" && layout !== "newsletter-focus" && (
          <div className="pt-2 border-t border-border/50">
            <ImageUploadWithCrop
              label="Primary / Background Image"
              currentImage={formik.values.image}
              onImageUpdate={(imageUrl: string) => handleUpdate("image", imageUrl)}
              recommendedWidth={1920}
              recommendedHeight={1080}
              aspectRatio={16 / 9}
              maxFileSize={8}
            />
          </div>
        )}
      </div>

      {/* ─── SECTION 2: CALL-TO-ACTION BUTTONS ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
              2
            </span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
                Action Buttons
              </h4>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Configure primary and secondary conversion actions
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const currentButtons = [...(formik.values.buttons || [])];
              currentButtons.push({
                text: "Get Started",
                link: "/signup",
                variant: currentButtons.length === 0 ? "primary" : "outline",
              });
              handleUpdate("buttons", currentButtons);
            }}
            className="h-7 text-xs gap-1 border-dashed"
          >
            <Plus className="h-3 w-3" />
            Add Action
          </Button>
        </div>

        <div className="space-y-2.5">
          {(formik.values.buttons || []).map((button: HeroActionButton, index: number) => (
            <div
              key={index}
              className="p-3 bg-muted/20 rounded-lg border border-border/60 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  Action {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentButtons = [...(formik.values.buttons || [])];
                    currentButtons.splice(index, 1);
                    handleUpdate("buttons", currentButtons);
                  }}
                  className="h-6 w-6 p-0 hover:bg-destructive/10 text-destructive cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    Label
                  </Label>
                  <Input
                    value={button.text || ""}
                    onChange={(e) => {
                      const updated = [...(formik.values.buttons || [])];
                      updated[index] = { ...updated[index], text: e.target.value };
                      handleUpdate("buttons", updated);
                    }}
                    placeholder="Get Started"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    URL or Section Link
                  </Label>
                  <Input
                    value={button.link || ""}
                    onChange={(e) => {
                      const updated = [...(formik.values.buttons || [])];
                      updated[index] = { ...updated[index], link: e.target.value };
                      handleUpdate("buttons", updated);
                    }}
                    placeholder="/signup or #features"
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">
                  Button Style Variant
                </Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["primary", "secondary", "outline", "ghost"] as const).map(
                    (variant) => (
                      <button
                        type="button"
                        key={variant}
                        onClick={() => {
                          const updated = [...(formik.values.buttons || [])];
                          updated[index] = { ...updated[index], variant };
                          handleUpdate("buttons", updated);
                        }}
                        className={cn(
                          "py-1 text-[11px] font-medium rounded-md border text-center capitalize transition-colors cursor-pointer",
                          button.variant === variant
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs font-semibold"
                            : "bg-background text-muted-foreground border-border/70 hover:border-indigo-300"
                        )}
                      >
                        {variant}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}

          {(formik.values.buttons || []).length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3 border border-dashed rounded-lg bg-muted/10">
              No buttons configured. Click &quot;Add Action&quot; above.
            </p>
          )}
        </div>
      </div>

      {/* ─── SECTION 3: LAYOUT CUSTOMIZATION ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            3
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Layout Customization
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Settings tailored specifically for the{" "}
              <span className="font-semibold text-foreground uppercase">
                {layout.replace(/-/g, " ")}
              </span>{" "}
              variant
            </p>
          </div>
        </div>

        {/* 1. CAROUSEL LAYOUT */}
        {layout === "carousel" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Auto-play Duration (seconds)
              </Label>
              <Input
                type="number"
                min="2"
                max="15"
                value={formik.values.autoPlayDuration}
                onChange={(e) =>
                  handleUpdate("autoPlayDuration", Number(e.target.value))
                }
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-border/50">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-bold text-foreground">
                  Carousel Slides ({(formik.values.slides || []).length})
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentSlides = [...(formik.values.slides || [])];
                    currentSlides.push({
                      title: "Discover Innovation",
                      subtitle: "Connect and elevate your journey with us.",
                      image:
                        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
                      ctaText: "Get Started",
                      ctaLink: "/signup",
                    });
                    handleUpdate("slides", currentSlides);
                  }}
                  className="h-7 text-xs gap-1 border-dashed"
                >
                  <Plus className="h-3 w-3" />
                  Add Slide
                </Button>
              </div>

              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {(formik.values.slides || []).map((slide: HeroSlideItem, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-muted/20 rounded-lg border border-border/60 space-y-2.5"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-foreground">
                        Slide #{index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const currentSlides = [...(formik.values.slides || [])];
                          currentSlides.splice(index, 1);
                          handleUpdate("slides", currentSlides);
                        }}
                        className="h-6 w-6 p-0 hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">
                        Slide Title
                      </Label>
                      <Input
                        value={slide.title || ""}
                        onChange={(e) => {
                          const updated = [...(formik.values.slides || [])];
                          updated[index] = { ...updated[index], title: e.target.value };
                          handleUpdate("slides", updated);
                        }}
                        placeholder="Slide Headline"
                        className="h-8 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground">
                        Subtitle
                      </Label>
                      <Input
                        value={slide.subtitle || ""}
                        onChange={(e) => {
                          const updated = [...(formik.values.slides || [])];
                          updated[index] = {
                            ...updated[index],
                            subtitle: e.target.value,
                          };
                          handleUpdate("slides", updated);
                        }}
                        placeholder="Slide description..."
                        className="h-8 text-xs"
                      />
                    </div>

                    <ImageUploadWithCrop
                      label="Slide Backdrop Image"
                      currentImage={slide.image}
                      onImageUpdate={(imageUrl) => {
                        const updated = [...(formik.values.slides || [])];
                        updated[index] = { ...updated[index], image: imageUrl };
                        handleUpdate("slides", updated);
                      }}
                      recommendedWidth={1920}
                      recommendedHeight={1080}
                      aspectRatio={16 / 9}
                      maxFileSize={8}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">
                          Button Text
                        </Label>
                        <Input
                          value={slide.ctaText || ""}
                          onChange={(e) => {
                            const updated = [...(formik.values.slides || [])];
                            updated[index] = {
                              ...updated[index],
                              ctaText: e.target.value,
                            };
                            handleUpdate("slides", updated);
                          }}
                          placeholder="Explore"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">
                          Button URL
                        </Label>
                        <Input
                          value={slide.ctaLink || ""}
                          onChange={(e) => {
                            const updated = [...(formik.values.slides || [])];
                            updated[index] = {
                              ...updated[index],
                              ctaLink: e.target.value,
                            };
                            handleUpdate("slides", updated);
                          }}
                          placeholder="/explore"
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. SPLIT LAYOUT */}
        {layout === "split" && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-xs font-bold text-foreground">
                  Feature Highlights & Metrics
                </Label>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Key statistics and bullet metrics displayed below the copy
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentFeatures = [...(formik.values.features || [])];
                  currentFeatures.push({
                    title: "10K+ Members",
                    description: "Active contributors",
                  });
                  handleUpdate("features", currentFeatures);
                }}
                className="h-7 text-xs gap-1 border-dashed"
              >
                <Plus className="h-3 w-3" />
                Add Metric
              </Button>
            </div>

            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {(formik.values.features || []).map((feat: HeroFeatureItem | string, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 bg-muted/20 rounded-lg border border-border/60 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-semibold text-foreground">
                      Metric #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const currentFeatures = [...(formik.values.features || [])];
                        currentFeatures.splice(idx, 1);
                        handleUpdate("features", currentFeatures);
                      }}
                      className="h-6 w-6 p-0 hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">
                        Value / Title
                      </Label>
                      <Input
                        value={typeof feat === "string" ? feat : feat.title || ""}
                        onChange={(e) => {
                          const updated = [...(formik.values.features || [])];
                          updated[idx] = {
                            ...(typeof updated[idx] === "object"
                              ? updated[idx]
                              : {}),
                            title: e.target.value,
                          };
                          handleUpdate("features", updated);
                        }}
                        placeholder="100K+ or Global"
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">
                        Description
                      </Label>
                      <Input
                        value={typeof feat === "object" ? feat.description || "" : ""}
                        onChange={(e) => {
                          const updated = [...(formik.values.features || [])];
                          updated[idx] = {
                            ...(typeof updated[idx] === "object"
                              ? updated[idx]
                              : {}),
                            description: e.target.value,
                          };
                          handleUpdate("features", updated);
                        }}
                        placeholder="Active participants"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. VIDEO LAYOUT */}
        {layout === "video" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Video Stream URL
              </Label>
              <Input
                value={formik.values.videoUrl}
                onChange={(e) => handleUpdate("videoUrl", e.target.value)}
                placeholder="https://commondatastorage.googleapis.com/... or MP4 link"
                className="h-9 text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground leading-snug">
                Supports direct MP4 streaming links, webm, or CDN video URLs.
              </p>
            </div>
          </div>
        )}

        {/* 4. SAAS-MODERN LAYOUT */}
        {layout === "saas-modern" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Dashboard Preview Screenshot
              </Label>
              <ImageUploadWithCrop
                label="App Interface Window"
                currentImage={formik.values.image}
                onImageUpdate={(imageUrl) => handleUpdate("image", imageUrl)}
                recommendedWidth={1200}
                recommendedHeight={800}
                aspectRatio={3 / 2}
                maxFileSize={8}
              />
              <p className="text-[11px] text-muted-foreground leading-snug">
                Displays inside a stylized browser mockup frame with soft backdrop glow.
              </p>
            </div>
          </div>
        )}

        {/* 5. BENTO-GRID LAYOUT */}
        {layout === "bento-grid" && (
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Bento Grid presents a four-quadrant feature matrix highlighting Real-Time Analytics, Themeable Layouts, Edge Performance, and Global Community. Main headline and description from Section 1 drive the primary banner.
            </p>
          </div>
        )}

        {/* 6. CREATOR-SHOWCASE LAYOUT */}
        {layout === "creator-showcase" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Primary CTA Label
                </Label>
                <Input
                  value={formik.values.ctaText}
                  onChange={(e) => handleUpdate("ctaText", e.target.value)}
                  placeholder="Join 15,000+ Creators"
                  className="h-8 text-xs font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Trust Subtext
                </Label>
                <Input
                  value={formik.values.subtext}
                  onChange={(e) => handleUpdate("subtext", e.target.value)}
                  placeholder="Free to join • No credit card required"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* 7. DARK-CINEMATIC LAYOUT */}
        {layout === "dark-cinematic" && (
          <div className="space-y-4">
            <p className="text-[11px] text-muted-foreground leading-snug">
              Displays three vertical 9:16 aspect ratio poster cards beneath an ultra-bold cinematic title.
            </p>
          </div>
        )}

        {/* 8. NEWSLETTER-FOCUS LAYOUT */}
        {layout === "newsletter-focus" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Email Placeholder
                </Label>
                <Input
                  value={formik.values.placeholder}
                  onChange={(e) => handleUpdate("placeholder", e.target.value)}
                  placeholder="Enter your email address..."
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Submit Button Label
                </Label>
                <Input
                  value={formik.values.buttonText}
                  onChange={(e) => handleUpdate("buttonText", e.target.value)}
                  placeholder="Subscribe Now"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-border/50">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">
                  Subscriber Count
                </Label>
                <Input
                  value={formik.values.subscribersCount}
                  onChange={(e) =>
                    handleUpdate("subscribersCount", e.target.value)
                  }
                  placeholder="12,847"
                  className="h-8 text-xs font-semibold"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">
                  Trust Badge 1
                </Label>
                <Input
                  value={formik.values.trustBadge1}
                  onChange={(e) => handleUpdate("trustBadge1", e.target.value)}
                  placeholder="No spam, ever"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">
                  Trust Badge 2
                </Label>
                <Input
                  value={formik.values.trustBadge2}
                  onChange={(e) => handleUpdate("trustBadge2", e.target.value)}
                  placeholder="Unsubscribe anytime"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* 9. APP-SHOWCASE LAYOUT */}
        {layout === "app-showcase" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  App Store Link
                </Label>
                <Input
                  value={formik.values.appStoreLink}
                  onChange={(e) => handleUpdate("appStoreLink", e.target.value)}
                  placeholder="https://apps.apple.com/..."
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Google Play Link
                </Label>
                <Input
                  value={formik.values.playStoreLink}
                  onChange={(e) => handleUpdate("playStoreLink", e.target.value)}
                  placeholder="https://play.google.com/..."
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">
                  Download Count
                </Label>
                <Input
                  value={formik.values.downloadsText}
                  onChange={(e) => handleUpdate("downloadsText", e.target.value)}
                  placeholder="50K+ downloads"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">
                  Rating Score
                </Label>
                <Input
                  value={formik.values.rating}
                  onChange={(e) => handleUpdate("rating", e.target.value)}
                  placeholder="4.8"
                  className="h-8 text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        )}

        {/* 10. GLOBE-INTERACTIVE LAYOUT */}
        {layout === "globe-interactive" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Headline Highlight Accent
              </Label>
              <Input
                value={formik.values.titleAccent}
                onChange={(e) => handleUpdate("titleAccent", e.target.value)}
                placeholder="Worldwide"
                className="h-8 text-xs"
              />
              <p className="text-[11px] text-muted-foreground leading-snug">
                Accent keyword highlighted alongside the main heading.
              </p>
            </div>
          </div>
        )}

        {/* 11. SINGLE-IMAGE LAYOUT */}
        {layout === "single-image" && (
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Full-width background image with deep gradient overlay, centered headline, actions, and feature indicators. Configure background image and actions in Sections 1 & 2 above.
            </p>
          </div>
        )}

        {/* 12. GRADIENT-MESH LAYOUT */}
        {layout === "gradient-mesh" && (
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              High-velocity dark layout featuring radial mesh blur glow spots, dot grid background, glowing badge pill, and floating live edge metrics (&lt; 15ms Edge, 99.99% Uptime).
            </p>
          </div>
        )}

        {/* 13. EVENT-COUNTDOWN LAYOUT */}
        {layout === "event-countdown" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Event Dates
                </Label>
                <Input
                  value={formik.values.eventDate}
                  onChange={(e) => handleUpdate("eventDate", e.target.value)}
                  placeholder="October 24-26, 2026"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Event Location
                </Label>
                <Input
                  value={formik.values.eventLocation}
                  onChange={(e) => handleUpdate("eventLocation", e.target.value)}
                  placeholder="San Francisco, CA & Global Stream"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Displays real-time countdown blocks (Days, Hours, Minutes, Seconds) and attendee social proof stack.
            </p>
          </div>
        )}

        {/* 14. PRODUCT-SHOWCASE LAYOUT */}
        {layout === "product-showcase" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                3D Product / Course Cover Mockup
              </Label>
              <ImageUploadWithCrop
                label="Product Cover Image"
                currentImage={formik.values.image}
                onImageUpdate={(imageUrl) => handleUpdate("image", imageUrl)}
                recommendedWidth={800}
                recommendedHeight={1000}
                aspectRatio={4 / 5}
                maxFileSize={8}
              />
              <p className="text-[11px] text-muted-foreground leading-snug">
                Displayed with a perspective floating angle, dark gradient overlay, and soft backlight.
              </p>
            </div>
          </div>
        )}

        {/* 15. MINIMAL-EDITORIAL LAYOUT */}
        {layout === "minimal-editorial" && (
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Refined editorial aesthetic with tracked uppercase eyebrow, serif headline, monochrome pill buttons, and partner logotypes trust strip.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

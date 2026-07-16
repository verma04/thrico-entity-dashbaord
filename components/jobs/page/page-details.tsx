"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  InfoIcon,
  Upload,
  Globe,
  ChevronDown,
  MapPin,
  Hash,
  Building,
  Eye,
  Trash2,
  ExternalLink,
  Users,
} from "lucide-react";

interface PageDetailsProps {
  formik: any;
  onFinish: (values: any) => void;
}

function PageDetails({ formik }: PageDetailsProps) {
  const { values, errors, touched, setFieldValue, handleChange, handleBlur } =
    formik;

  const [logoPreview, setLogoPreview] = useState<string | null>(
    values.logo?.url || null
  );

  const beforeUpload = (file: File) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";
    if (!isJpgOrPng) {
      alert("You can only upload JPG/PNG/WEBP file!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      alert("Image must be smaller than 2MB!");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && beforeUpload(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setLogoPreview(url);
        setFieldValue("logo", { file, url });
      };
      reader.readAsDataURL(file);
    }
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const userEditedSlug = useRef(false);

  // Auto-generate slug from name if not manually edited
  useEffect(() => {
    if (!userEditedSlug.current && values.name) {
      const slug = slugify(values.name);
      setFieldValue("url", slug);
    }
  }, [values.name, setFieldValue]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-700">
      {/* Form Section */}
      <div className="lg:col-span-7 space-y-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b">
            <Building className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold tracking-tight">
              Organization Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold flex items-center gap-2"
              >
                Organization Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Acme Corporation"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={cn(
                  "bg-muted/30 focus-visible:ring-primary/20",
                  touched.name &&
                    errors.name &&
                    "border-destructive ring-1 ring-destructive/20"
                )}
              />
              {touched.name && errors.name && (
                <p className="text-xs text-destructive font-medium">
                  {String(errors.name)}
                </p>
              )}
            </div>

            {/* URL Field */}
            <div className="space-y-2">
              <Label
                htmlFor="url"
                className="text-sm font-semibold flex items-center gap-2"
              >
                Public URL <span className="text-destructive">*</span>
                <InfoIcon className="h-3 w-3 text-muted-foreground" />
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-medium border-r pr-2 group-focus-within:text-primary transition-colors">
                  thrico.com/
                </div>
                <Input
                  id="url"
                  name="url"
                  placeholder="acme-corp"
                  className={cn(
                    "pl-[95px] bg-muted/30",
                    touched.url &&
                      errors.url &&
                      "border-destructive ring-1 ring-destructive/20"
                  )}
                  value={values.url}
                  onChange={(e) => {
                    userEditedSlug.current = true;
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                />
              </div>
              {touched.url && errors.url && (
                <p className="text-xs text-destructive font-medium">
                  {String(errors.url)}
                </p>
              )}
            </div>
          </div>

          {/* Website Field */}
          <div className="space-y-2">
            <Label
              htmlFor="website"
              className="text-sm font-semibold flex items-center gap-2"
            >
              Official Website
              <Globe className="h-3 w-3 text-muted-foreground" />
            </Label>
            <Input
              id="website"
              name="website"
              placeholder="https://www.example.com"
              value={values.website}
              onChange={handleChange}
              onBlur={handleBlur}
              className="bg-muted/30"
            />
            {touched.website && errors.website && (
              <p className="text-xs text-destructive font-medium">
                {String(errors.website)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Industry Field */}
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-sm font-semibold">
                Industry <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(val) => setFieldValue("industry", val)}
                value={values.industry}
              >
                <SelectTrigger
                  className={cn(
                    "bg-muted/30",
                    touched.industry && errors.industry && "border-destructive"
                  )}
                >
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">
                    Information Technology
                  </SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {touched.industry && errors.industry && (
                <p className="text-xs text-destructive font-medium">
                  {String(errors.industry)}
                </p>
              )}
            </div>

            {/* Size Field */}
            <div className="space-y-2">
              <Label htmlFor="size" className="text-sm font-semibold">
                Company Size <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(val) => setFieldValue("size", val)}
                value={values.size}
              >
                <SelectTrigger
                  className={cn(
                    "bg-muted/30",
                    touched.size && errors.size && "border-destructive"
                  )}
                >
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Self-employed</SelectItem>
                  <SelectItem value="2-10">2-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="501+">501+ employees</SelectItem>
                </SelectContent>
              </Select>
              {touched.size && errors.size && (
                <p className="text-xs text-destructive font-medium">
                  {String(errors.size)}
                </p>
              )}
            </div>
          </div>

          {/* Type Field */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-semibold">
              Organization Type <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(val) => setFieldValue("type", val)}
              value={values.type}
            >
              <SelectTrigger
                className={cn(
                  "bg-muted/30",
                  touched.type && errors.type && "border-destructive"
                )}
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public Company</SelectItem>
                <SelectItem value="private">Private Company</SelectItem>
                <SelectItem value="nonprofit">Nonprofit</SelectItem>
                <SelectItem value="government">Government Agency</SelectItem>
              </SelectContent>
            </Select>
            {touched.type && errors.type && (
              <p className="text-xs text-destructive font-medium">
                {String(errors.type)}
              </p>
            )}
          </div>
        </div>

        {/* Branding Section */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center gap-3 pb-2 border-b">
            <Upload className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold tracking-tight">
              Branding & Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 flex flex-col items-center">
              <Label className="text-sm font-semibold mb-4 w-full">
                Company Logo
              </Label>
              <div className="relative group">
                <div
                  className={cn(
                    "h-32 w-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 overflow-hidden bg-muted/20 hover:bg-muted/30",
                    values.logo?.url
                      ? "border-solid border-primary/40 shadow-inner"
                      : "border-muted-foreground/20"
                  )}
                >
                  {logoPreview ? (
                    <>
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="h-full w-full object-cover animate-in fade-in zoom-in-95 duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => {
                            setLogoPreview(null);
                            setFieldValue("logo", { file: null, url: null });
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                        Click to upload
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-3 font-medium">
                  Recommended: 400x400px
                </p>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="tagline"
                  className="text-sm font-semibold flex justify-between items-center"
                >
                  Tagline
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      (values.tagline?.length || 0) > 100
                        ? "bg-amber-100 text-amber-700"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {values.tagline?.length || 0}/120
                  </span>
                </Label>
                <Textarea
                  id="tagline"
                  name="tagline"
                  placeholder="e.g. Innovating the future of digital commerce."
                  className="bg-muted/30 min-h-[100px] resize-none focus-visible:ring-primary/20"
                  maxLength={120}
                  value={values.tagline}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Agreement Section */}
        <div className="pt-6 relative">
          <div
            className={cn(
              "p-6 rounded-2xl transition-all duration-300 border-2",
              values.agreement
                ? "bg-primary/5 border-primary/20 shadow-sm"
                : "bg-muted/10 border-transparent hover:bg-muted/20"
            )}
          >
            <div className="flex items-start gap-4">
              <Checkbox
                id="agreement"
                checked={values.agreement}
                onCheckedChange={(val) => setFieldValue("agreement", val)}
                className="mt-1 transition-transform data-[state=checked]:scale-110"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="agreement"
                  className="text-sm font-medium leading-relaxed cursor-pointer"
                >
                  I verify that I am an authorized representative of this
                  organization and have the right to act on its behalf.
                </Label>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">
                    Read the
                  </span>
                  <button
                    type="button"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    Pages Terms <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {touched.agreement && errors.agreement && (
            <p className="text-xs text-destructive font-bold mt-2 ml-10 animate-in slide-in-from-left-2 transition-all">
              {String(errors.agreement)}
            </p>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="lg:col-span-5">
        <div className="sticky top-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Eye className="h-4 w-4" /> Live Page Preview
            </h4>
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>

          <Card className="overflow-hidden border-none shadow-2xl ring-1 ring-border/50 bg-gradient-to-b from-card to-background">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            </div>

            <CardContent className="px-8 pb-10 relative">
              <div className="absolute -top-12 left-8 p-1.5 bg-background rounded-2xl shadow-xl ring-1 ring-border/30">
                <div className="h-24 w-24 rounded-xl bg-muted flex items-center justify-center overflow-hidden border">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building className="h-10 w-10 text-muted-foreground/40" />
                  )}
                </div>
              </div>

              <div className="pt-16 space-y-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-foreground truncate">
                    {values.name || "Enterprise Identity"}
                  </h2>
                  <p className="text-primary font-bold text-sm tracking-wide mt-1">
                    {values.industry
                      ? values.industry.charAt(0).toUpperCase() +
                        values.industry.slice(1)
                      : "Sector Exploration"}
                  </p>
                </div>

                <p className="text-sm text-foreground/80 leading-relaxed min-h-[3rem] line-clamp-2 italic italic-muted">
                  {values.tagline ||
                    "Your tagline will appear here to succinctly describe your mission."}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <Users className="h-4 w-4 text-primary/60" />
                    <span>{values.size || "Scale Pending"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <MapPin className="h-4 w-4 text-primary/60" />
                    <span>India</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 shadow-md shadow-primary/20 font-bold"
                    disabled
                  >
                    Follow
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    disabled
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tip */}
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4 items-start">
            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
              <InfoIcon className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              <span className="font-bold block mb-1">Impactful Taglines</span>
              Keep your tagline clear and benefit-oriented. Pages with
              descriptive taglines receive 24% more engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageDetails;

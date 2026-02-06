"use client";

import { useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikProvider,
  useFormik,
} from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import {
  Camera,
  Info,
  Globe,
  Lock,
  Laptop,
  MapPin,
  RefreshCw,
  Users,
  ChevronRight,
  Save,
} from "lucide-react";
import { CommunityPreview } from "./community-preview";
import { ImageCropper } from "./image-cropper";
import { cn } from "@/lib/utils";

export function CommunityCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
  cover,
  setCover,
}: any) {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const communitySchema = Yup.object({
    title: Yup.string()
      .required("Community name is required")
      .max(50, "Max 50 characters"),
    tagline: Yup.string().max(100, "Max 100 characters"),
    description: Yup.string().max(300, "Max 300 characters"),
    privacy: Yup.string().required("Privacy setting is required"),
    communityType: Yup.string().required("Community type is required"),
    joiningTerms: Yup.string().required("Joining terms are required"),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      title: "",
      tagline: "",
      description: "",
      privacy: "",
      communityType: "",
      joiningTerms: "",
      requireAdminApprovalForPosts: false,
      allowMemberInvites: false,
      enableEvents: false,
      enableRatingsAndReviews: false,
    },
    validationSchema: communitySchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setCropModalVisible(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImage: any, croppedUrl: string) => {
    setCover(croppedImage);
    setImageUrl(croppedUrl);
    setCropModalVisible(false);
    setSelectedImage(null);
    toast({
      title: "Success",
      description: "Cover image updated successfully!",
    });
  };

  const handleInputChange = (field: string, value: any) => {
    formik.setFieldValue(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <FormikProvider value={formik}>
      <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
        {/* Header section - Sticky */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 py-4">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Create Community
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
                <span>Communities</span>
                <ChevronRight className="h-3 w-3" />
                <span>Create New Community</span>
              </div>
            </div>
            <div className="hidden sm:flex gap-3">
              <Button
                variant="outline"
                type="button"
                size="sm"
                onClick={() => (onCancel ? onCancel() : window.history.back())}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={loading}
                className="shadow-sm border-primary/20"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Create Community
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Info */}
                  <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <CardTitle className="text-xl">
                        Basic Information
                      </CardTitle>
                      <CardDescription>
                        Core details about your community
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      {/* Cover Image Section */}
                      <div className="space-y-2">
                        <Label>Cover Image</Label>
                        <div className="relative">
                          <div className="aspect-3/2 overflow-hidden rounded-lg bg-muted border-2 border-dashed">
                            <Image
                              src={
                                imageUrl ||
                                "https://cdn.thrico.network/default_communities.png"
                              }
                              alt="Community cover"
                              width={1536}
                              height={1024}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <label htmlFor="cover-upload">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="absolute bottom-4 right-4 gap-2"
                              onClick={() =>
                                document.getElementById("cover-upload")?.click()
                              }
                            >
                              <Camera className="h-4 w-4" />
                              Update Cover
                            </Button>
                          </label>
                          <input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Recommended size: 1536 x 1024px (3:2 ratio). Max file
                          size: 5MB.
                        </p>
                      </div>

                      {/* Name Field */}
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Enter community name"
                          maxLength={50}
                          value={formik.values.title || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          required
                        />
                        {formik.touched.title && formik.errors.title && (
                          <p className="text-xs text-destructive">
                            {formik.errors.title as string}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          This will be the main name of your community.
                        </p>
                      </div>

                      {/* Tagline Field */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="tagline"
                            className="text-sm font-medium"
                          >
                            Tagline
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  A short, catchy headline that appears below
                                  your community name.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="tagline"
                          name="tagline"
                          placeholder="Enter a catchy headline for your community"
                          maxLength={100}
                          value={formik.values.tagline || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.tagline && formik.errors.tagline && (
                          <p className="text-xs text-destructive">
                            {formik.errors.tagline as string}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          A brief tagline that describes your community's
                          purpose.
                        </p>
                      </div>

                      {/* Description Field */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe what your community is about"
                          maxLength={300}
                          rows={4}
                          className="resize-none"
                          value={formik.values.description || ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.description &&
                          formik.errors.description && (
                            <p className="text-xs text-destructive">
                              {formik.errors.description as string}
                            </p>
                          )}
                        <p className="text-xs text-muted-foreground">
                          Tell potential members what your community is about
                          and why they should join.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Community Settings */}
                  <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <CardTitle className="text-xl">
                        Community Settings
                      </CardTitle>
                      <CardDescription>
                        Configure privacy, type, and joining requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      {/* Privacy Settings */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <Globe className="h-4 w-4 text-primary" />
                          </div>
                          <Label className="text-base font-semibold">
                            Privacy Settings{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                        </div>
                        <RadioGroup
                          value={formik.values.privacy}
                          onValueChange={(value) =>
                            handleInputChange("privacy", value)
                          }
                          className="space-y-3"
                        >
                          <div className="flex items-start space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="PUBLIC" id="public" />
                            <Label
                              htmlFor="public"
                              className="font-normal cursor-pointer flex-1"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Globe className="h-4 w-4" />
                                <span className="font-medium">Public</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Anyone can see and join this community
                              </p>
                            </Label>
                          </div>
                          <div className="flex items-start space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="PRIVATE" id="private" />
                            <Label
                              htmlFor="private"
                              className="font-normal cursor-pointer flex-1"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Lock className="h-4 w-4" />
                                <span className="font-medium">Private</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Only invited members can see and join
                              </p>
                            </Label>
                          </div>
                        </RadioGroup>
                        {formik.touched.privacy && formik.errors.privacy && (
                          <p className="text-xs text-destructive">
                            {formik.errors.privacy as string}
                          </p>
                        )}
                      </div>

                      <Separator />

                      {/* Community Type */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <Laptop className="h-4 w-4 text-primary" />
                          </div>
                          <Label className="text-base font-semibold">
                            Community Type{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                        </div>
                        <RadioGroup
                          value={formik.values.communityType}
                          onValueChange={(value) =>
                            handleInputChange("communityType", value)
                          }
                          className="space-y-3"
                        >
                          <div className="flex items-start space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="VIRTUAL" id="virtual" />
                            <Label
                              htmlFor="virtual"
                              className="font-normal cursor-pointer flex-1"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Laptop className="h-4 w-4" />
                                <span className="font-medium">Virtual</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Online-only community
                              </p>
                            </Label>
                          </div>
                          <div className="flex items-start space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="INPERSON" id="inperson" />
                            <Label
                              htmlFor="inperson"
                              className="font-normal cursor-pointer flex-1"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin className="h-4 w-4" />
                                <span className="font-medium">In Person</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Meets physically at a location
                              </p>
                            </Label>
                          </div>
                          <div className="flex items-start space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="HYBRID" id="hybrid" />
                            <Label
                              htmlFor="hybrid"
                              className="font-normal cursor-pointer flex-1"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <RefreshCw className="h-4 w-4" />
                                <span className="font-medium">Hybrid</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Both online and in-person
                              </p>
                            </Label>
                          </div>
                        </RadioGroup>
                        {formik.touched.communityType &&
                          formik.errors.communityType && (
                            <p className="text-xs text-destructive">
                              {formik.errors.communityType as string}
                            </p>
                          )}
                      </div>

                      <Separator />

                      {/* Joining Terms */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-primary/10">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <Label className="text-base font-semibold">
                            Joining Terms{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                        </div>
                        <RadioGroup
                          value={formik.values.joiningTerms}
                          onValueChange={(value) =>
                            handleInputChange("joiningTerms", value)
                          }
                          className="space-y-3"
                        >
                          <div className="flex items-start space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem
                              value="ANYONE_CAN_JOIN"
                              id="anyone"
                            />
                            <Label
                              htmlFor="anyone"
                              className="font-normal cursor-pointer flex-1"
                            >
                              <div className="font-medium mb-1">
                                Anyone Can Join
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Anyone can join this community directly
                              </p>
                            </Label>
                          </div>
                          <div className="flex items-start space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <RadioGroupItem
                              value="ADMIN_ONLY_ADD"
                              id="admin-only"
                            />
                            <Label
                              htmlFor="admin-only"
                              className="font-normal cursor-pointer flex-1"
                            >
                              <div className="font-medium mb-1">
                                Admin Only Add
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Only admins can add members to this community
                              </p>
                            </Label>
                          </div>
                        </RadioGroup>
                        {formik.touched.joiningTerms &&
                          formik.errors.joiningTerms && (
                            <p className="text-xs text-destructive">
                              {formik.errors.joiningTerms as string}
                            </p>
                          )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional Settings */}
                  <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <CardTitle className="text-xl">
                        Additional Settings
                      </CardTitle>
                      <CardDescription>
                        Optional features to enhance your community
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="space-y-0.5 flex-1">
                          <Label
                            htmlFor="approval"
                            className="text-sm font-medium"
                          >
                            Require admin approval for new posts
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            All posts will need to be approved by an admin
                            before being published
                          </p>
                        </div>
                        <Switch
                          id="approval"
                          checked={formik.values.requireAdminApprovalForPosts}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "requireAdminApprovalForPosts",
                              checked,
                            )
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="space-y-0.5 flex-1">
                          <Label
                            htmlFor="invites"
                            className="text-sm font-medium"
                          >
                            Allow members to invite others
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Members can invite friends to join the community
                          </p>
                        </div>
                        <Switch
                          id="invites"
                          checked={formik.values.allowMemberInvites}
                          onCheckedChange={(checked) =>
                            handleInputChange("allowMemberInvites", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="space-y-0.5 flex-1">
                          <Label
                            htmlFor="events"
                            className="text-sm font-medium"
                          >
                            Enable community events
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Allow creating and managing events within the
                            community
                          </p>
                        </div>
                        <Switch
                          id="events"
                          checked={formik.values.enableEvents}
                          onCheckedChange={(checked) =>
                            handleInputChange("enableEvents", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="space-y-0.5 flex-1">
                          <Label
                            htmlFor="ratings"
                            className="text-sm font-medium"
                          >
                            Enable community ratings and reviews
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Allow members to rate and review community content
                          </p>
                        </div>
                        <Switch
                          id="ratings"
                          checked={formik.values.enableRatingsAndReviews}
                          onCheckedChange={(checked) =>
                            handleInputChange(
                              "enableRatingsAndReviews",
                              checked,
                            )
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </div>

              {/* Live Preview Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Community Preview</h3>
                    <Badge
                      variant="outline"
                      className="bg-green-500/5 text-green-600 border-green-500/20"
                    >
                      Live Preview
                    </Badge>
                  </div>

                  <CommunityPreview
                    imageUrl={imageUrl}
                    formData={formik.values}
                  />

                  <Card className="border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Info className="h-5 w-5" />
                        Tips for Success
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm">
                        <li className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            Choose a clear, descriptive name that reflects your
                            community's purpose
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            Add a compelling headline that captures interest
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            Upload a high-quality cover image that represents
                            your community
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            Write a detailed description explaining the benefits
                            of joining
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            Consider your privacy settings carefully based on
                            your community goals
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons - Sticky at bottom */}
        <div className="sm:hidden sticky bottom-0 z-30 bg-background border-t px-6 py-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              type="button"
              className="flex-1"
              onClick={() => (onCancel ? onCancel() : window.history.back())}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>

        {/* Image Cropper Modal */}
        {selectedImage && (
          <ImageCropper
            cropModalVisible={cropModalVisible}
            image={selectedImage}
            onCropComplete={handleCropComplete}
            onCancel={() => {
              setCropModalVisible(false);
              setSelectedImage(null);
            }}
          />
        )}
      </div>
    </FormikProvider>
  );
}

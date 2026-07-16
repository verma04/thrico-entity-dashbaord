"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Settings, Image as ImageIcon, Store, Palette } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StoreInfoForm } from "@/components/mobile-app/store-info-form";
import { FileUploadBox } from "@/components/mobile-app/file-upload-box";
import { BrandingForm } from "@/components/mobile-app/branding-form";

import {
  useSaveAndroidStoreInfo,
  useSaveAndroidGraphics,
  useGetAndroidStoreInfo,
  useGetAndroidGraphics,
  useGetAndroidBranding,
  useSaveAndroidBranding,
} from "@/graphql/actions/mobileApp/androidSetup.action";

export default function SettingsPage() {
  const { data: storeInfoData, loading: storeLoading } =
    useGetAndroidStoreInfo();
  const { data: graphicsData, loading: graphicsLoading } =
    useGetAndroidGraphics();
  const { data: brandingData, loading: brandingLoading } =
    useGetAndroidBranding();

  const [saveStoreInfo] = useSaveAndroidStoreInfo();
  const [saveGraphics] = useSaveAndroidGraphics();
  const [saveBranding] = useSaveAndroidBranding();
  const initialBranding = brandingData?.getAndroidBranding || {};
  const hasAppIcon = !!initialBranding.appIconPath;
  const hasSplashScreen = !!initialBranding.splashScreenPath;

  const brandingForm = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      primaryColor: initialBranding.primaryColor || "#6366f1",
      secondaryColor: initialBranding.secondaryColor || "#a855f7",
      accentColor: initialBranding.accentColor || "#ec4899",
      appIcon: null as File | null,
      splashScreen: null as File | null,
    },
    validationSchema: Yup.object({
      primaryColor: Yup.string().required("Primary Color is required"),
      secondaryColor: Yup.string().required("Secondary Color is required"),
      accentColor: Yup.string().required("Accent Color is required"),
      appIcon: hasAppIcon
        ? Yup.mixed().nullable()
        : Yup.mixed().required("App Icon is required"),
      splashScreen: hasSplashScreen
        ? Yup.mixed().nullable()
        : Yup.mixed().required("Splash Screen Background is required"),
    }),
    onSubmit: async (values) => {
      try {
        await saveBranding({ variables: { input: values } });
        toast.success("Branding updated successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to update branding");
      }
    },
  });

  const initialStoreInfo = storeInfoData?.getAndroidStoreInfo || {};
  const storeInfoForm = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      appTitle: initialStoreInfo.appTitle || "",
      shortDescription: initialStoreInfo.shortDescription || "",
      fullDescription: initialStoreInfo.fullDescription || "",
      keywords: "",
      copyrightText: initialStoreInfo.copyrightText || "",
      supportUrl: initialStoreInfo.supportUrl || "",
      marketingUrl: initialStoreInfo.marketingUrl || "",
    },
    validationSchema: Yup.object({
      appTitle: Yup.string()
        .max(30, "Max 30 characters")
        .required("App Title is required"),
      shortDescription: Yup.string()
        .max(80, "Max 80 characters")
        .required("Short Description is required"),
      fullDescription: Yup.string()
        .max(4000, "Max 4000 characters")
        .required("Full Description is required"),
      copyrightText: Yup.string().required("Copyright Text is required"),
      supportUrl: Yup.string()
        .url("Must be a valid URL")
        .required("Support URL is required"),
      marketingUrl: Yup.string().url("Must be a valid URL").nullable(),
    }),
    onSubmit: async (values) => {
      try {
        await saveStoreInfo({ variables: { input: values } });
        toast.success("Store info updated successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to update store info");
      }
    },
  });

  const initialGraphics = graphicsData?.getAndroidGraphics || {};
  const hasGraphicsAppIcon = !!initialGraphics.appIconPath;
  const hasFeatureGraphic = !!initialGraphics.featureGraphicPath;
  const hasPhoneScreenshots =
    (initialGraphics.phoneScreenshots?.length || 0) > 0;
  const hasTablet7Screenshots =
    (initialGraphics.tablet7Screenshots?.length || 0) > 0;
  const hasTablet10Screenshots =
    (initialGraphics.tablet10Screenshots?.length || 0) > 0;

  const graphicsForm = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      appIcon: null as File | null,
      featureGraphic: null as File | null,
      videoUrl: initialGraphics.videoUrl || "",
      phoneScreenshots: [] as File[],
      tablet7Screenshots: [] as File[],
      tablet10Screenshots: [] as File[],
    },
    validationSchema: Yup.object({
      appIcon: hasGraphicsAppIcon
        ? Yup.mixed().nullable()
        : Yup.mixed().required("App icon is required"),
      featureGraphic: hasFeatureGraphic
        ? Yup.mixed().nullable()
        : Yup.mixed().required("Feature graphic is required"),
      videoUrl: Yup.string().url("Must be a valid URL").nullable(),
    }),
    onSubmit: async (values) => {
      try {
        await saveGraphics({ variables: { input: values } });
        toast.success("Graphics updated successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to update graphics");
      }
    },
  });

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="mb-4 flex-wrap h-auto">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Settings className="w-4 h-4" /> General
        </TabsTrigger>

        <TabsTrigger value="store" className="flex items-center gap-2">
          <Store className="w-4 h-4" /> Store Information
        </TabsTrigger>
        <TabsTrigger value="graphics" className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Graphics & Screenshots
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Customize colors and assets</CardDescription>
          </CardHeader>
          <CardContent>
            {brandingLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <form onSubmit={brandingForm.handleSubmit} className="space-y-6">
                <BrandingForm
                  platform="android"
                  {...brandingForm}
                  initialBranding={initialBranding}
                />
                <Button
                  type="submit"
                  disabled={!brandingForm.isValid || brandingForm.isSubmitting}
                >
                  Save Branding
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="store">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Google Play Store listing details</CardDescription>
          </CardHeader>
          <CardContent>
            {storeLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <form onSubmit={storeInfoForm.handleSubmit} className="space-y-6">
                <StoreInfoForm platform="android" {...storeInfoForm} />
                <Button
                  type="submit"
                  disabled={
                    !storeInfoForm.isValid || storeInfoForm.isSubmitting
                  }
                >
                  Save Store Info
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="graphics">
        <Card>
          <CardHeader>
            <CardTitle>Graphics & Screenshots</CardTitle>
            <CardDescription>
              Manage your app icon, screenshots, and videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {graphicsLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              <form onSubmit={graphicsForm.handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium border-b pb-2">
                    App icon {!hasGraphicsAppIcon && "*"}
                  </h4>
                  <p className="text-sm text-muted-foreground">Your app icon must be a PNG or JPEG, up to 1 MB, 512 px by 512 px</p>
                  <div className="w-full max-w-sm aspect-square">
                    <FileUploadBox
                      label="Upload"
                      desc=""
                      accept="image/png,image/jpeg"
                      selectedFile={graphicsForm.values.appIcon}
                      onFileSelect={(f: File) =>
                        graphicsForm.setFieldValue("appIcon", f)
                      }
                      error={
                        graphicsForm.touched.appIcon &&
                        (graphicsForm.errors.appIcon as string)
                      }
                      existingPath={initialGraphics.appIconPath}
                      showPreview={true}
                      recommendedWidth={512}
                      recommendedHeight={512}
                      aspectRatio={1}
                      lockDimensions={true}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium border-b pb-2">
                    Feature graphic {!hasFeatureGraphic && "*"}
                  </h4>
                  <p className="text-sm text-muted-foreground">Your feature graphic must be a PNG or JPEG, up to 15 MB, and 1,024 px by 500 px</p>
                  <div className="w-full max-w-2xl aspect-[1024/500]">
                    <FileUploadBox
                      label="Upload"
                      desc=""
                      accept="image/png,image/jpeg"
                      selectedFile={graphicsForm.values.featureGraphic}
                      onFileSelect={(f: File) =>
                        graphicsForm.setFieldValue("featureGraphic", f)
                      }
                      error={
                        graphicsForm.touched.featureGraphic &&
                        (graphicsForm.errors.featureGraphic as string)
                      }
                      existingPath={initialGraphics.featureGraphicPath}
                      showPreview={true}
                      recommendedWidth={1024}
                      recommendedHeight={500}
                      aspectRatio={1024 / 500}
                      lockDimensions={true}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium border-b pb-2">Video</h4>
                  <div className="max-w-xl">
                    <Input
                      {...graphicsForm.getFieldProps("videoUrl")}
                      placeholder="https://www.youtube.com/watch?v="
                    />
                    {graphicsForm.touched.videoUrl &&
                      graphicsForm.errors.videoUrl && (
                        <p className="text-sm text-red-500 mt-1">
                          {graphicsForm.errors.videoUrl as string}
                        </p>
                      )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium border-b pb-2">
                    Phone screenshots {!hasPhoneScreenshots && "*"}
                  </h4>
                  <p className="text-sm text-muted-foreground">Upload 2-8 phone screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840 px</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="aspect-[9/16]">
                        <FileUploadBox
                          label="Upload"
                          desc=""
                          accept="image/png,image/jpeg"
                          selectedFile={graphicsForm.values.phoneScreenshots[i]}
                          onFileSelect={(f: File) => {
                            const newScreenshots = [
                              ...graphicsForm.values.phoneScreenshots,
                            ];
                            newScreenshots[i] = f;
                            graphicsForm.setFieldValue(
                              "phoneScreenshots",
                              newScreenshots,
                            );
                          }}
                          existingPath={initialGraphics.phoneScreenshots?.[i]}
                          showPreview={true}
                          recommendedWidth={1080}
                          recommendedHeight={1920}
                          aspectRatio={9 / 16}
                          lockDimensions={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium border-b pb-2">
                    7-inch tablet screenshots {!hasTablet7Screenshots && "*"}
                  </h4>
                  <p className="text-sm text-muted-foreground">Upload up to eight 7-inch tablet screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840 px</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[0, 1].map((i) => (
                      <div key={i} className="aspect-[9/16]">
                        <FileUploadBox
                          label="Upload"
                          desc=""
                          accept="image/png,image/jpeg"
                          selectedFile={
                            graphicsForm.values.tablet7Screenshots[i]
                          }
                          onFileSelect={(f: File) => {
                            const newScreenshots = [
                              ...graphicsForm.values.tablet7Screenshots,
                            ];
                            newScreenshots[i] = f;
                            graphicsForm.setFieldValue(
                              "tablet7Screenshots",
                              newScreenshots,
                            );
                          }}
                          existingPath={initialGraphics.tablet7Screenshots?.[i]}
                          showPreview={true}
                          recommendedWidth={1200}
                          recommendedHeight={2133}
                          aspectRatio={9 / 16}
                          lockDimensions={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium border-b pb-2">
                    10-inch tablet screenshots {!hasTablet10Screenshots && "*"}
                  </h4>
                  <p className="text-sm text-muted-foreground">Upload up to eight 10-inch tablet screenshots. Screenshots must be PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between 1,080 px and 7,680 px</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[0, 1].map((i) => (
                      <div key={i} className="aspect-[9/16]">
                        <FileUploadBox
                          label="Upload"
                          desc=""
                          accept="image/png,image/jpeg"
                          selectedFile={
                            graphicsForm.values.tablet10Screenshots[i]
                          }
                          onFileSelect={(f: File) => {
                            const newScreenshots = [
                              ...graphicsForm.values.tablet10Screenshots,
                            ];
                            newScreenshots[i] = f;
                            graphicsForm.setFieldValue(
                              "tablet10Screenshots",
                              newScreenshots,
                            );
                          }}
                          existingPath={initialGraphics.tablet10Screenshots?.[i]}
                          showPreview={true}
                          recommendedWidth={1600}
                          recommendedHeight={2844}
                          aspectRatio={9 / 16}
                          lockDimensions={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!graphicsForm.isValid || graphicsForm.isSubmitting}
                >
                  Save Graphics
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

"use client";

import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SetupWizard, WizardStep } from "@/components/mobile-app/setup-wizard";
import { BrandingForm } from "@/components/mobile-app/branding-form";
import { StoreInfoForm } from "@/components/mobile-app/store-info-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUploadBox } from "@/components/mobile-app/file-upload-box";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  useSaveAndroidAppInfo,
  useSaveAndroidPushNotifications,
  useSaveAndroidSetup,
  useSaveAndroidGooglePlayConnect,
  useSaveAndroidStoreInfo,
  useSaveAndroidGraphics,
  useGetAndroidAppInfo,
  useGetAndroidBranding,
  useGetAndroidPushNotifications,
  useGetAndroidSetup,
  useGetAndroidGooglePlayConnect,
  useGetAndroidStoreInfo,
  useGetAndroidGraphics,
  useSaveAndroidBranding,
} from "@/graphql/actions/mobileApp/androidSetup.action";

export default function AndroidSetupPage() {
  const router = useRouter();

  // Queries
  const { data: appInfoData } = useGetAndroidAppInfo();
  const { data: brandingData } = useGetAndroidBranding();
  const { data: pushData } = useGetAndroidPushNotifications();
  const { data: setupData } = useGetAndroidSetup();
  const { data: playConnectData } = useGetAndroidGooglePlayConnect();
  const { data: storeInfoData } = useGetAndroidStoreInfo();
  const { data: graphicsData } = useGetAndroidGraphics();

  // Mutations
  const [saveAppInfo] = useSaveAndroidAppInfo();
  const [saveBranding] = useSaveAndroidBranding();
  const [savePushNotifications] = useSaveAndroidPushNotifications();
  const [saveSetup] = useSaveAndroidSetup();
  const [savePlayConnect] = useSaveAndroidGooglePlayConnect();
  const [saveStoreInfo] = useSaveAndroidStoreInfo();
  const [saveGraphics] = useSaveAndroidGraphics();

  // Helper to mark all fields as touched
  const touchAll = (formik: any) => {
    formik.setTouched(
      Object.keys(formik.values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      ),
    );
  };

  // --- Step 1 Formik ---
  const initialAppInfo = appInfoData?.getAndroidAppInfo || {};
  const appInfoForm = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      appName: initialAppInfo.appName || "",
      shortName: initialAppInfo.shortName || "",
      orgName: initialAppInfo.orgName || "",
      website: initialAppInfo.website || "",
      supportEmail: initialAppInfo.supportEmail || "",
      privacyPolicyUrl: initialAppInfo.privacyPolicyUrl || "",
    },
    validationSchema: Yup.object({
      appName: Yup.string().required("Application Name is required"),
      shortName: Yup.string().required("Short Name is required"),
      orgName: Yup.string().required("Organization Name is required"),
      website: Yup.string()
        .url("Must be a valid URL")
        .required("Website is required"),
      supportEmail: Yup.string()
        .email("Must be a valid email")
        .required("Support Email is required"),
      privacyPolicyUrl: Yup.string()
        .url("Must be a valid URL")
        .required("Privacy Policy URL is required"),
    }),
    onSubmit: async () => {},
  });

  // --- Step 2 Formik ---
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
    onSubmit: async () => {},
  });

  // --- Step 3 Formik ---
  const initialPush = pushData?.getAndroidPushNotifications || {};
  const hasExistingServicesJson = !!initialPush.googleServicesJsonPath;
  const pushNotificationsForm = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      firebaseEnabled: initialPush.firebaseEnabled !== false ? "yes" : "no",
      googleServicesJson: null as File | null,
    },
    validationSchema: Yup.object({
      firebaseEnabled: Yup.string().required(),
      googleServicesJson: Yup.mixed().when("firebaseEnabled", {
        is: "yes",
        then: (schema) =>
          hasExistingServicesJson
            ? schema.nullable()
            : schema.required("google-services.json is required"),
        otherwise: (schema) => schema.nullable(),
      }),
    }),
    onSubmit: async () => {},
  });

  // --- Step 4 Formik ---
  const initialSetup = setupData?.getAndroidSetup || {};
  const hasExistingKeystore = !!initialSetup.keystorePath;
  const setupForm = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      packageName: initialSetup.packageName || "com.thrico.thricosocial",
      keystore: null as File | null,
    },
    validationSchema: Yup.object({
      packageName: Yup.string()
        .matches(
          /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/,
          "Must be a valid Android package name",
        )
        .required("Package Name is required"),
      keystore: hasExistingKeystore
        ? Yup.mixed().nullable()
        : Yup.mixed().required("Keystore file is required"),
    }),
    onSubmit: async () => {},
  });

  // --- Step 5 Formik ---
  const initialPlayConnect = playConnectData?.getAndroidGooglePlayConnect || {};
  const hasExistingServiceJson = !!initialPlayConnect.serviceJsonPath;
  const playConnectForm = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      serviceJson: null as File | null,
    },
    validationSchema: Yup.object({
      serviceJson: hasExistingServiceJson
        ? Yup.mixed().nullable()
        : Yup.mixed().required("service.json is required"),
    }),
    onSubmit: async () => {},
  });

  // --- Step 6 Formik ---
  const initialStoreInfo = storeInfoData?.getAndroidStoreInfo || {};
  const storeInfoForm = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      appTitle: initialStoreInfo.appTitle || "",
      shortDescription: initialStoreInfo.shortDescription || "",
      fullDescription: initialStoreInfo.fullDescription || "",
      keywords: "", // Not tracked in DB schema currently
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
    onSubmit: async () => {},
  });

  // --- Step 7 Formik ---
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
    onSubmit: async () => {},
  });

  const handleComplete = () => {
    toast.success("Android setup complete! Your app is ready to build.");
    router.push("/mobile-app/android");
  };

  const steps: WizardStep[] = [
    {
      id: "app-info",
      title: "Application Information",
      description: "Basic details about your application",
      isValid: appInfoForm.isValid,
      component: (
        <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="appName">Application Name *</Label>
              <Input
                id="appName"
                {...appInfoForm.getFieldProps("appName")}
                placeholder="e.g. My Community"
              />
              {appInfoForm.touched.appName && appInfoForm.errors.appName && (
                <p className="text-sm text-red-500">
                  {appInfoForm.errors.appName}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortName">Short Name *</Label>
              <Input
                id="shortName"
                {...appInfoForm.getFieldProps("shortName")}
                placeholder="e.g. Community"
              />
              {appInfoForm.touched.shortName &&
                appInfoForm.errors.shortName && (
                  <p className="text-sm text-red-500">
                    {appInfoForm.errors.shortName}
                  </p>
                )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                {...appInfoForm.getFieldProps("orgName")}
                placeholder="e.g. Acme Corp"
              />
              {appInfoForm.touched.orgName && appInfoForm.errors.orgName && (
                <p className="text-sm text-red-500">
                  {appInfoForm.errors.orgName}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website *</Label>
              <Input
                id="website"
                type="url"
                {...appInfoForm.getFieldProps("website")}
                placeholder="https://"
              />
              {appInfoForm.touched.website && appInfoForm.errors.website && (
                <p className="text-sm text-red-500">
                  {appInfoForm.errors.website}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supportEmail">Support Email *</Label>
              <Input
                id="supportEmail"
                type="email"
                {...appInfoForm.getFieldProps("supportEmail")}
                placeholder="support@example.com"
              />
              {appInfoForm.touched.supportEmail &&
                appInfoForm.errors.supportEmail && (
                  <p className="text-sm text-red-500">
                    {appInfoForm.errors.supportEmail}
                  </p>
                )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="privacyPolicyUrl">Privacy Policy URL *</Label>
              <Input
                id="privacyPolicyUrl"
                type="url"
                {...appInfoForm.getFieldProps("privacyPolicyUrl")}
                placeholder="https://"
              />
              {appInfoForm.touched.privacyPolicyUrl &&
                appInfoForm.errors.privacyPolicyUrl && (
                  <p className="text-sm text-red-500">
                    {appInfoForm.errors.privacyPolicyUrl}
                  </p>
                )}
            </div>
          </div>
        </form>
      ),
      onNext: async () => {
        touchAll(appInfoForm);
        const errors = await appInfoForm.validateForm();
        if (Object.keys(errors).length > 0) return false;

        try {
          await saveAppInfo({ variables: { input: appInfoForm.values } });
          return true;
        } catch (error: any) {
          toast.error(error.message);
          return false;
        }
      },
    },
    {
      id: "android-setup",
      title: "Android Setup",
      description: "Package name and signing credentials",
      isValid: setupForm.isValid,
      component: (
        <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="packageName">Package Name *</Label>
            <Input
              id="packageName"
              {...setupForm.getFieldProps("packageName")}
              placeholder="com.company.community"
            />
            {setupForm.touched.packageName && setupForm.errors.packageName && (
              <p className="text-sm text-red-500">
                {setupForm.errors.packageName}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              This is the unique identifier for your app on the Play Store. It
              cannot be changed later.
            </p>
          </div>

          <div className="grid gap-2 mt-4">
            <Label>
              Android Signing Key (Keystore) {!hasExistingKeystore && "*"}
            </Label>
            <FileUploadBox
              label="Upload Keystore File"
              desc=".jks or .keystore file"
              accept=".jks,.keystore"
              selectedFile={setupForm.values.keystore}
              onFileSelect={(f: File) => setupForm.setFieldValue("keystore", f)}
              error={
                setupForm.touched.keystore &&
                (setupForm.errors.keystore as string)
              }
              existingPath={initialSetup.keystorePath}
            />
          </div>
        </form>
      ),
      onNext: async () => {
        touchAll(setupForm);
        const errors = await setupForm.validateForm();
        if (Object.keys(errors).length > 0) return false;

        try {
          await saveSetup({ variables: { input: setupForm.values } });
          return true;
        } catch (error: any) {
          toast.error(error.message);
          return false;
        }
      },
    },
    {
      id: "branding",
      title: "Branding",
      description: "Customize colors and assets",
      isValid: brandingForm.isValid,
      component: (
        <BrandingForm
          platform="android"
          {...brandingForm}
          initialBranding={initialBranding}
        />
      ),
      onNext: async () => {
        touchAll(brandingForm);
        const errors = await brandingForm.validateForm();
        if (Object.keys(errors).length > 0) return false;

        try {
          await saveBranding({ variables: { input: brandingForm.values } });
          return true;
        } catch (error: any) {
          toast.error(error.message);
          return false;
        }
      },
    },
    {
      id: "push-notifications",
      title: "Push Notifications",
      description: "Configure Firebase for Android",
      isValid: pushNotificationsForm.isValid,
      isOptional: true,
      component: (
        <form className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Does your organization already use Firebase?
            </Label>
            <RadioGroup
              value={pushNotificationsForm.values.firebaseEnabled}
              onValueChange={(v) =>
                pushNotificationsForm.setFieldValue("firebaseEnabled", v)
              }
              className="flex flex-col gap-3 mt-2"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="yes" id="fb-yes" />
                <Label
                  htmlFor="fb-yes"
                  className="font-normal cursor-pointer w-full"
                >
                  Yes, we have our own Firebase project
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-4 rounded-lg">
                <RadioGroupItem value="no" id="fb-no" />
                <Label
                  htmlFor="fb-no"
                  className="font-normal cursor-pointer w-full"
                >
                  No, guide me through setting it up
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2 mt-6">
            <Label>
              google-services.json{" "}
              {pushNotificationsForm.values.firebaseEnabled === "yes" &&
                !hasExistingServicesJson &&
                "*"}
            </Label>
            <FileUploadBox
              label="Upload Android Configuration"
              desc="JSON file from Firebase"
              accept=".json"
              selectedFile={pushNotificationsForm.values.googleServicesJson}
              onFileSelect={(f: File) =>
                pushNotificationsForm.setFieldValue("googleServicesJson", f)
              }
              error={
                pushNotificationsForm.touched.googleServicesJson &&
                pushNotificationsForm.errors.googleServicesJson
              }
              existingPath={initialPush.googleServicesJsonPath}
            />
          </div>
        </form>
      ),
      onNext: async () => {
        touchAll(pushNotificationsForm);
        const errors = await pushNotificationsForm.validateForm();
        if (Object.keys(errors).length > 0) return false;

        try {
          await savePushNotifications({
            variables: {
              input: {
                firebaseEnabled:
                  pushNotificationsForm.values.firebaseEnabled === "yes",
                googleServicesJson:
                  pushNotificationsForm.values.googleServicesJson,
              },
            },
          });
          return true;
        } catch (error: any) {
          toast.error(error.message);
          return false;
        }
      },
    },
    {
      id: "google-play-connect",
      title: "Connect Google Play Console",
      description: "Upload your service.json file",
      isValid: playConnectForm.isValid,
      component: (
        <form className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Connecting your Google Play Console allows us to automate app
              deployments and updates directly to the Play Store on your behalf.
            </p>
          </div>
          <div className="grid gap-2 mt-4">
            <Label>
              Service Account Key (service.json){" "}
              {!hasExistingServiceJson && "*"}
            </Label>
            <FileUploadBox
              label="Upload service.json"
              desc="JSON file containing your Google Play Developer Service Account credentials"
              accept=".json"
              selectedFile={playConnectForm.values.serviceJson}
              onFileSelect={(f: File) =>
                playConnectForm.setFieldValue("serviceJson", f)
              }
              error={
                playConnectForm.touched.serviceJson &&
                (playConnectForm.errors.serviceJson as string)
              }
              existingPath={initialPlayConnect.serviceJsonPath}
            />
          </div>
        </form>
      ),
      onNext: async () => {
        touchAll(playConnectForm);
        const errors = await playConnectForm.validateForm();
        if (Object.keys(errors).length > 0) return false;

        try {
          await savePlayConnect({
            variables: { input: playConnectForm.values },
          });
          return true;
        } catch (error: any) {
          toast.error(error.message);
          return false;
        }
      },
    },
    {
      id: "store-info",
      title: "Store Information",
      description: "Google Play Store listing details",
      isValid: storeInfoForm.isValid,
      component: <StoreInfoForm platform="android" {...storeInfoForm} />,
      onNext: async () => {
        touchAll(storeInfoForm);
        const errors = await storeInfoForm.validateForm();
        if (Object.keys(errors).length > 0) return false;

        try {
          await saveStoreInfo({ variables: { input: storeInfoForm.values } });
          return true;
        } catch (error: any) {
          toast.error(error.message);
          return false;
        }
      },
    },
    {
      id: "graphics",
      title: "Graphics & Screenshots",
      description: "Manage your app icon, screenshots, and videos",
      isValid: graphicsForm.isValid,
      isOptional: true,
      component: (
        <form className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Manage your app icon, screenshots, and videos to promote your app
              on Google Play.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium border-b pb-2">
              App icon {!hasGraphicsAppIcon && "*"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Your app icon must be a PNG or JPEG, up to 1 MB, 512 px by 512 px
            </p>
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
            <p className="text-sm text-muted-foreground">
              Your feature graphic must be a PNG or JPEG, up to 15 MB, and 1,024
              px by 500 px
            </p>
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
            <p className="text-sm text-muted-foreground">
              Upload 2-8 phone screenshots. Screenshots must be PNG or JPEG, up
              to 8 MB each, 16:9 or 9:16 aspect ratio, with each side between
              320 px and 3,840 px
            </p>
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
            <p className="text-sm text-muted-foreground">
              Upload up to eight 7-inch tablet screenshots. Screenshots must be
              PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each
              side between 320 px and 3,840 px
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="aspect-[9/16]">
                  <FileUploadBox
                    label="Upload"
                    desc=""
                    accept="image/png,image/jpeg"
                    selectedFile={graphicsForm.values.tablet7Screenshots[i]}
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
            <p className="text-sm text-muted-foreground">
              Upload up to eight 10-inch tablet screenshots. Screenshots must be
              PNG or JPEG, up to 8 MB each, 16:9 or 9:16 aspect ratio, with each
              side between 1,080 px and 7,680 px
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="aspect-[9/16]">
                  <FileUploadBox
                    label="Upload"
                    desc=""
                    accept="image/png,image/jpeg"
                    selectedFile={graphicsForm.values.tablet10Screenshots[i]}
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
        </form>
      ),
      onNext: async () => {
        touchAll(graphicsForm);
        const errors = await graphicsForm.validateForm();
        if (Object.keys(errors).length > 0) return false;

        try {
          await saveGraphics({ variables: { input: graphicsForm.values } });
          return true;
        } catch (error: any) {
          toast.error(error.message);
          return false;
        }
      },
    },
    {
      id: "review",
      title: "Review & Publish",
      description: "Final check before building",
      isValid: true,
      component: (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-medium">Ready to Build!</h3>
          <p className="text-muted-foreground">
            All required information for your Android application has been
            collected. Once you click "Complete Setup", we will begin generating
            your application build.
          </p>

          <div className="bg-muted p-6 rounded-lg space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span>Application Information</span>
              <span className="text-green-600 font-medium">✓ Complete</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>Branding</span>
              <span className="text-green-600 font-medium">✓ Complete</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>Android Setup</span>
              <span className="text-green-600 font-medium">✓ Complete</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Store Listing</span>
              <span className="text-green-600 font-medium">✓ Complete</span>
            </div>
          </div>
        </div>
      ),
      onNext: async () => true,
    },
  ];

  return (
    <div className="p-4 md:p-6 pb-20">
      <SetupWizard
        title="Android App Setup"
        description="Follow these steps to configure your Android application for the Google Play Store."
        steps={steps}
        onComplete={handleComplete}
        onCancel={() => router.push("/mobile-app/android")}
      />
    </div>
  );
}

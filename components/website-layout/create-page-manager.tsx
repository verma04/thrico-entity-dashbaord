"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Layout,
  Info,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useToast } from "@/hooks/use-toast";
import { useCreatePage, useGetWebsite } from "@/graphql/actions/website";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import {
  EcosystemWrapper,
  EcosystemHeader,
  EcosystemContainer,
} from "@/components/layout/ecosystem";

const createPageSchema = Yup.object().shape({
  name: Yup.string()
    .required("Give your new page a recognizable name")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  slug: Yup.string()
    .required("URL slug is required")
    .matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

export function CreatePageManager() {
  const router = useRouter();
  const { toast } = useToast();
  const { addPage } = useWebsiteBuilderStore();
  const [saved, setSaved] = useState(false);

  const { data: websiteData } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const [createPageMutation, { loading: isCreating }] = useCreatePage({
    onCompleted: (data) => {
      toast({
        title: "Page Created",
        description: `Page '${data.createPage.name}' has been successfully created.`,
      });
      setSaved(true);
      addPage(data.createPage.name, data.createPage.slug);
      
      setTimeout(() => {
        router.push("/app-layout");
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create page.",
        variant: "destructive",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
    },
    validationSchema: createPageSchema,
    onSubmit: (values) => {
      if (!websiteId) {
        toast({
          title: "System Error",
          description: "Cannot identify parent website context.",
          variant: "destructive",
        });
        return;
      }

      createPageMutation({
        variables: {
          websiteId,
          name: values.name,
          slug: values.slug,
        },
      });
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    formik.setFieldValue("name", val);
    
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    
    formik.setFieldValue("slug", generatedSlug);
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Create Page"
        description="Enter the details for your new page."
        icon={Layout}
        badgeText="Website Builder"
        breadcrumbs={[{ label: "Website Builder" }, { label: "Website Pages", href: "/app-layout" }, { label: "Create Page" }]}
        actions={
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Cancel
          </Button>
        }
      />

      <EcosystemContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="lg:col-span-8 space-y-8">
            <form onSubmit={formik.handleSubmit} className="space-y-8">
              <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <CardTitle className="text-xl">
                    Page Details
                  </CardTitle>
                  <CardDescription>
                    Enter the details for your new page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4 max-w-lg">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium"
                      >
                        Page Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g. Services, About Us, Core Features"
                        value={formik.values.name}
                        onChange={handleNameChange}
                        onBlur={formik.handleBlur}
                        className="h-12 text-base"
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-xs text-destructive">
                          {formik.errors.name as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="slug"
                        className="text-sm font-medium"
                      >
                        URL Path <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex items-center gap-0">
                        <div className="h-12 px-4 flex items-center bg-muted/50 rounded-l-md border border-r-0 border-input text-muted-foreground font-mono text-sm">
                          /
                        </div>
                        <Input
                          id="slug"
                          placeholder="services"
                          {...formik.getFieldProps("slug")}
                          className="h-12 text-base font-mono rounded-l-none"
                          onChange={(e) => {
                            const val = e.target.value.toLowerCase().replace(/\s+/g, "-");
                            formik.setFieldValue("slug", val);
                          }}
                        />
                      </div>
                      {formik.touched.slug && formik.errors.slug && (
                        <p className="text-xs text-destructive">
                          {formik.errors.slug as string}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        This defines the URL path visitors will use to access this page.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Page Preview</h3>
                <Badge
                  variant="outline"
                  className="bg-indigo-500/5 text-indigo-600 border-indigo-500/20"
                >
                  Draft Page
                </Badge>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex flex-col w-full bg-white dark:bg-zinc-950 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-zinc-900 dark:text-zinc-100 min-h-[300px]">
                  <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 bg-zinc-50 dark:bg-zinc-900 gap-2">
                     <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                       <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                     </div>
                     <div className="flex-1 mx-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md h-6 flex items-center px-3 justify-center">
                        <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                           <Globe className="h-3 w-3" />
                           thrico.community/{formik.values.slug || "new-page"}
                        </span>
                     </div>
                  </div>
                  
                  <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
                     <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                       <Layout className="h-8 w-8 text-indigo-500" />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                         {formik.values.name || "Untitled Page"}
                       </h3>
                       <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                         Create this page to start adding content to your website.
                       </p>
                     </div>
                  </div>

                </div>
              </div>

              <Card className="border-none shadow-sm ring-1 ring-border/50">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Info className="h-4 w-4 text-indigo-600" />
                    Page Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3 text-xs text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>
                        Keep URLs short (e.g., /about, /services) to improve human readability and SEO.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>
                        After creation, jump into the Design Editor to map out your page content.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>
                        Newly created pages are instantly added to your website.
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </EcosystemContainer>

      <FloatingSavePanel
        hasChanged={formik.dirty && formik.values.name.length > 0}
        saved={saved}
        isSaving={isCreating}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Changes"
        description="Ready to create this page?"
        buttonText="Create Page"
      />
    </EcosystemWrapper>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  Layout,
  ChevronRight,
  Info,
  Globe,
  Sparkles,
  Layers,
  ArrowRight
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

const createPageSchema = Yup.object().shape({
  name: Yup.string()
    .required("Give your new page a recognizable name")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),
  slug: Yup.string()
    .required("URL slug is required")
    .matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

export default function CreateAppPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addPage, setCurrentPage } = useWebsiteBuilderStore();
  const [saved, setSaved] = useState(false);

  const { data: websiteData } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const [createPageMutation, { loading: isCreating }] = useCreatePage({
    onCompleted: (data) => {
      toast({
        title: "Node Deployed",
        description: `Page '${data.createPage.name}' has been successfully initialized.`,
      });
      setSaved(true);
      addPage(data.createPage.name, data.createPage.slug);
      
      setTimeout(() => {
        router.push("/app-layout");
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to create architectural node.",
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

  // Auto-generate slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    formik.setFieldValue("name", val);
    
    // Auto sync slug unless user has manually customized it heavily,
    // but for simplicity we directly bind it:
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    
    formik.setFieldValue("slug", generatedSlug);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-indigo-600/10 ring-1 ring-indigo-600/20">
                <Layout className="h-5 w-5 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                App Studio
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Website Builder</span>
              <ChevronRight className="h-3 w-3" />
              <span>Project Pages</span>
              <ChevronRight className="h-3 w-3" />
              <span>Create New Definition</span>
            </div>
          </div>
          <div className="hidden sm:flex gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <form onSubmit={formik.handleSubmit} className="space-y-8">
                {/* Node Definitions */}
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4 border-b">
                    <CardTitle className="text-xl">
                      Node Definition
                    </CardTitle>
                    <CardDescription>
                      Establish the identity and route for your new architectural frame.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-4 max-w-lg">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium"
                        >
                          Page Designation <span className="text-destructive">*</span>
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
                          Namespace Slug <span className="text-destructive">*</span>
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
                          This defines the URL pathway users and search engines will use to access this node.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Sidebar / Strategy Preview */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                
                {/* Structural Preview */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Wireframe Preview</h3>
                  <Badge
                    variant="outline"
                    className="bg-indigo-500/5 text-indigo-600 border-indigo-500/20"
                  >
                    Draft Node
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
                             thrico.community/{formik.values.slug || "new-node"}
                          </span>
                       </div>
                    </div>
                    
                    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
                       <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                         <Layout className="h-8 w-8 text-indigo-500" />
                       </div>
                       <div>
                         <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                           {formik.values.name || "Untitled Node"}
                         </h3>
                         <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                           A blank canvas awaits. Instantiating this node maps it into the Master Architecture.
                         </p>
                       </div>
                    </div>

                  </div>
                </div>

                {/* Strategy Cards */}
                <Card className="border-none shadow-sm ring-1 ring-border/50">
                  <CardHeader className="pb-3 border-b bg-muted/20">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Info className="h-4 w-4 text-indigo-600" />
                      Architectural Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 text-xs text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Keep slugs short (e.g., /about, /services) to improve human readability and SEO.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          After deployment, jump into the visual Layout Editor to map out components.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Newly created pages are instantly added to your site's structural matrix.
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

      <FloatingSavePanel
        hasChanged={formik.dirty && formik.values.name.length > 0}
        saved={saved}
        isSaving={isCreating}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Parameters"
        description="Ready to inject this node into the hierarchy?"
        buttonText="Deploy Node"
      />
    </div>
  );
}

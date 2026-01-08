"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Edit2Icon, Wand2, Globe } from "lucide-react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { getCustomDomain, getThricoDomain } from "@/graphql/actions/domain";
import {
  useGetAllPagesSeo,
  useUpdatePageSeo,
  useGetWebsite,
} from "@/graphql/actions/website";

// SEO Preview Component
function SeoPreview({
  title,
  description,
  slug,
  baseUrl,
}: {
  title: string;
  description: string;
  slug: string;
  baseUrl: string;
}) {
  const displayTitle = title || "Your Page Title - My Website";
  const displayDescription =
    description ||
    "Add a meta description to see how your page appears in search results.";
  const displayUrl = `${baseUrl}/${slug || "page"}`;
  const displayDomain = baseUrl.replace("https://", "").replace("http://", "");

  // Character count status
  const getTitleStatus = (length: number) => {
    if (length === 0) return "text-muted-foreground";
    if (length > 60) return "text-destructive";
    if (length >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getDescStatus = (length: number) => {
    if (length === 0) return "text-muted-foreground";
    if (length > 160) return "text-destructive";
    if (length >= 140) return "text-yellow-600";
    return "text-green-600";
  };

  const titleLength = title?.length;
  const descLength = description?.length;

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Search Result Preview</CardTitle>
        </div>
        <CardDescription>
          See how your page will appear in Google search results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Search Result Mockup */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-green-500" />
            <span className="text-xs text-muted-foreground">
              {displayDomain}
            </span>
          </div>
          <div className="text-xl text-blue-600 font-normal mb-1 line-clamp-1">
            {displayTitle}
          </div>
          <div className="text-xs text-green-700 mb-2">
            {baseUrl}/{slug || "page"}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {displayDescription}
          </div>
        </div>

        {/* Character Count Indicators */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Title Length</span>
              <span className={getTitleStatus(titleLength)}>
                {titleLength} / 60
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  titleLength === 0
                    ? "bg-muted-foreground"
                    : titleLength > 60
                    ? "bg-destructive"
                    : titleLength >= 50
                    ? "bg-yellow-600"
                    : "bg-green-600"
                }`}
                style={{ width: `${Math.min((titleLength / 60) * 100, 100)}%` }}
              />
            </div>
            <p className="text-muted-foreground mt-1">
              {titleLength === 0
                ? "Add a title"
                : titleLength > 60
                ? "Too long, may be truncated"
                : titleLength >= 50
                ? "Good length"
                : "Consider adding more detail"}
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Description Length</span>
              <span className={getDescStatus(descLength)}>
                {descLength} / 160
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  descLength === 0
                    ? "bg-muted-foreground"
                    : descLength > 160
                    ? "bg-destructive"
                    : descLength >= 140
                    ? "bg-yellow-600"
                    : "bg-green-600"
                }`}
                style={{ width: `${Math.min((descLength / 160) * 100, 100)}%` }}
              />
            </div>
            <p className="text-muted-foreground mt-1">
              {descLength === 0
                ? "Add a description"
                : descLength > 160
                ? "Too long, may be truncated"
                : descLength >= 140
                ? "Good length"
                : "Consider adding more detail"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Schema Markup Preview Component
function SchemaPreview({ schemaMarkup }: { schemaMarkup: string }) {
  const parseSchema = () => {
    if (!schemaMarkup || schemaMarkup.trim() === "") {
      return { valid: null, data: null, error: null };
    }

    try {
      // Extract JSON from script tag if present
      let jsonStr = schemaMarkup;
      const scriptMatch = schemaMarkup.match(
        /<script[^>]*>([\s\S]*?)<\/script>/
      );
      if (scriptMatch) {
        jsonStr = scriptMatch[1].trim();
      }

      const parsed = JSON.parse(jsonStr);
      return { valid: true, data: parsed, error: null };
    } catch (error) {
      return {
        valid: false,
        data: null,
        error: error instanceof Error ? error.message : "Invalid JSON",
      };
    }
  };

  const { valid, data, error } = parseSchema();

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                valid === null
                  ? "bg-muted-foreground"
                  : valid
                  ? "bg-green-500"
                  : "bg-destructive"
              }`}
            />
            <CardTitle className="text-base">Schema Markup Preview</CardTitle>
          </div>
          {valid !== null && (
            <span
              className={`text-xs font-medium ${
                valid ? "text-green-600" : "text-destructive"
              }`}
            >
              {valid ? "Valid JSON-LD" : "Invalid JSON"}
            </span>
          )}
        </div>
        <CardDescription>
          {valid === null && "Add schema markup to see preview"}
          {valid === true && "Your schema is valid and ready to use"}
          {valid === false && "Fix the JSON syntax errors below"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {valid === null && (
          <div className="text-sm text-muted-foreground text-center py-8">
            Click "Auto-Generate" or paste your schema markup to see a preview
          </div>
        )}

        {valid === false && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm font-medium text-destructive mb-1">
              JSON Error:
            </p>
            <p className="text-xs text-destructive/80 font-mono">{error}</p>
          </div>
        )}

        {valid === true && data && (
          <div className="space-y-3">
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Type:</span>
                <span className="text-blue-600">
                  @{data["@type"] || "Unknown"}
                </span>
              </div>
              {data.name && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="font-medium">Name:</span>
                  <span className="text-foreground">{data.name}</span>
                </div>
              )}
              {data.description && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="font-medium">Description:</span>
                  <span className="text-muted-foreground line-clamp-2">
                    {data.description}
                  </span>
                </div>
              )}
              {data.url && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="font-medium">URL:</span>
                  <span className="text-blue-600 text-xs">{data.url}</span>
                </div>
              )}
            </div>

            <details className="group">
              <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                View full JSON structure
              </summary>
              <pre className="mt-2 p-3 bg-muted/50 rounded-lg text-xs font-mono overflow-x-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SeoManager() {
  const { updatePageSeo } = useWebsiteBuilderStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  const { data: websiteData } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const { data: seoData, refetch: refetchSeo } = useGetAllPagesSeo(
    websiteId || "",
    {
      skip: !websiteId,
    }
  );

  const [updatePageSeoMutation, { loading: isSaving }] = useUpdatePageSeo({
    onCompleted: () => {
      toast({
        title: "Success",
        description: "SEO settings updated successfully!",
      });
      refetchSeo();
      setIsModalVisible(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update SEO settings",
        variant: "destructive",
      });
    },
  });

  const pages = seoData?.getAllPagesSeo || [];

  // Fetch domain data
  const { data: thricoDomainData } = getThricoDomain();
  const { data: customDomainData } = getCustomDomain();

  const NEXT_PUBLIC_SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "thrico.community";

  const thricoDomainUrl = thricoDomainData?.getThricoDomain?.domain
    ? `https://${thricoDomainData.getThricoDomain.domain}.${NEXT_PUBLIC_SITE_URL}`
    : `https://your-site.${NEXT_PUBLIC_SITE_URL}`;

  const customDomainUrl = customDomainData?.getCustomDomain?.domain
    ? `https://${customDomainData.getCustomDomain.domain}`
    : null;

  // Use custom domain if available, otherwise use thrico domain
  const websiteUrl = customDomainUrl || thricoDomainUrl;

  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      keywords: "",
      schemaMarkup: "",
    },
  });

  const generateSchemaMarkup = () => {
    const page = pages.find((p) => p.id === editingPageId);
    if (!page) return;

    const title = form.getValues("title");
    const description = form.getValues("description");
    const keywords = form.getValues("keywords");

    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title || page.name,
      description: description || `Learn more about ${page.name}`,
      url: `${websiteUrl}/${page.slug}`,
      keywords: keywords || page.name,
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        name: thricoDomainData?.getThricoDomain?.domain || "Your Website",
        url: websiteUrl,
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };

    const schemaMarkup = `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;

    form.setValue("schemaMarkup", schemaMarkup);

    toast({
      title: "Schema Generated",
      description:
        "SEO schema markup has been auto-generated based on your page data.",
    });
  };

  const handleEdit = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (!page) return;

    setEditingPageId(pageId);

    const keywords = Array.isArray(page.seo?.keywords)
      ? page.seo?.keywords.join(", ")
      : (page.seo?.keywords as unknown as string) || "";

    form.reset({
      title: page.seo?.title || `${page.name} - My Website`,
      description: page.seo?.description || "", // Fallback to page description if exists
      keywords: keywords,
      schemaMarkup: page.seo?.schemaMarkup || "",
    });
    setIsModalVisible(true);
  };

  const handleSave = form.handleSubmit((values) => {
    if (!editingPageId) return;

    const keywordsArray = values.keywords
      ? values.keywords.split(",").map((k) => k.trim())
      : [];

    updatePageSeoMutation({
      variables: {
        pageId: editingPageId,
        title: values.title,
        description: values.description,
        keywords: keywordsArray,
        schemaMarkup: values.schemaMarkup,
      },
    });

    // Also update local store for immediate UI update
    updatePageSeo(editingPageId, {
      title: values.title,
      description: values.description,
      keywords: values.keywords,
      schemaMarkup: values.schemaMarkup,
    });
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Manager</CardTitle>
          <CardDescription>
            Manage SEO settings for all pages on your website. Optimize your
            meta titles, descriptions, and keywords.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="font-semibold">Page</TableHead>
                  <TableHead className="font-semibold">Meta Title</TableHead>
                  <TableHead className="font-semibold">
                    Meta Description
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id} className="border-border">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">
                          {page.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          /{page.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-foreground line-clamp-1">
                      {page.seo?.title || (
                        <span className="text-muted-foreground italic">
                          Not set
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground line-clamp-1">
                      {page.seo?.description || (
                        <span className="text-muted-foreground italic">
                          Not set
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(page.id)}
                        className="gap-2"
                      >
                        <Edit2Icon className="h-4 w-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit SEO Settings</DialogTitle>
            <DialogDescription>
              Update meta information to improve search engine visibility
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Preview + Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Live Preview */}
                <div className="order-2 lg:order-1">
                  <SeoPreview
                    title={form.watch("title")}
                    description={form.watch("description")}
                    slug={pages.find((p) => p.id === editingPageId)?.slug || ""}
                    baseUrl={websiteUrl}
                  />
                </div>

                {/* Right: Form Fields */}
                <div className="order-1 lg:order-2 space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Meta title is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter meta title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: "Meta description is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter meta description"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="keywords"
                    rules={{ required: "Keywords are required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Keywords</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter keywords separated by commas"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Schema Markup - Full Width with Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    Schema Markup (JSON-LD)
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSchemaMarkup}
                    className="gap-2"
                  >
                    <Wand2 className="h-4 w-4" />
                    Auto-Generate
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Schema Preview */}
                  <div>
                    <SchemaPreview schemaMarkup={form.watch("schemaMarkup")} />
                  </div>

                  {/* Right: Schema Editor */}
                  <div>
                    <FormField
                      control={form.control}
                      name="schemaMarkup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Schema Code</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder='Click "Auto-Generate" to create schema markup or paste your own...'
                              className="font-mono text-xs h-[400px]"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Schema markup helps search engines understand your
                            content better. The preview validates your JSON in
                            real-time.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalVisible(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

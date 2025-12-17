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
import { Edit2Icon, Wand2 } from "lucide-react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";

export default function SeoManager() {
  const { pages, updatePageSeo } = useWebsiteBuilderStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

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
      url: `https://yourwebsite.com/${page.slug}`,
      keywords: keywords || page.name,
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        name: "Your Website",
        url: "https://yourwebsite.com",
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
    form.reset({
      title: page.seo?.title || `${page.name} - My Website`,
      description: page.seo?.description || "", // Fallback to page description if exists
      keywords: page.seo?.keywords || "",
      schemaMarkup: page.seo?.schemaMarkup || "",
    });
    setIsModalVisible(true);
  };

  const handleSave = form.handleSubmit((values) => {
    if (!editingPageId) return;

    updatePageSeo(editingPageId, {
      title: values.title,
      description: values.description,
      keywords: values.keywords,
      schemaMarkup: values.schemaMarkup,
    });

    toast({
      title: "Success",
      description: "SEO settings updated successfully!",
    });
    setIsModalVisible(false);
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit SEO Settings</DialogTitle>
            <DialogDescription>
              Update meta information to improve search engine visibility
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSave} className="space-y-6">
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

              <FormField
                control={form.control}
                name="schemaMarkup"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Schema Markup (JSON-LD)</FormLabel>
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
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='Click "Auto-Generate" to create schema markup or paste your own...'
                        className="font-mono text-xs"
                        rows={8}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Schema markup helps search engines understand your content
                      better. Click Auto-Generate to create based on your page
                      data.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalVisible(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

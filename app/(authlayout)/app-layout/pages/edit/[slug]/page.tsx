"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, MinusCircle, Save, Trash2 } from "lucide-react";

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    keywords: "",
    sections: [{ title: "", content: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const savedPages = JSON.parse(
        localStorage.getItem("thrico-custom-pages") || "[]"
      );
      const page = savedPages.find((p: any) => p.slug === slug);

      if (page) {
        setForm({
          title: page.title || "",
          slug: page.slug || "",
          description: page.description || "",
          keywords: page.keywords || "",
          sections: page.sections?.length
            ? page.sections
            : [{ title: "", content: "" }],
        });
      } else {
        setError("Page not found");
        setTimeout(() => router.push("/website-pages/pages"), 1200);
      }
      setIsLoading(false);
    }, 600);
  }, [slug, router]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (idx: number, key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === idx ? { ...section, [key]: value } : section
      ),
    }));
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { title: "", content: "" }],
    }));
  };

  const removeSection = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    setTimeout(() => {
      const existingPages = JSON.parse(
        localStorage.getItem("thrico-custom-pages") || "[]"
      );

      // Check for slug conflict
      if (
        form.slug !== slug &&
        existingPages.some((page: any) => page.slug === form.slug)
      ) {
        setError(
          "A page with this URL already exists. Please choose a different URL slug."
        );
        setLoading(false);
        return;
      }

      // Update the page
      const updatedPages = existingPages.map((page: any) => {
        if (page.slug === slug) {
          return {
            ...form,
            createdAt: page.createdAt,
            updatedAt: new Date().toISOString(),
          };
        }
        return page;
      });

      localStorage.setItem("thrico-custom-pages", JSON.stringify(updatedPages));
      setSuccess("Page updated successfully!");
      setLoading(false);

      setTimeout(() => {
        if (form.slug !== slug) {
          router.push(`/pages/${form.slug}`);
        } else {
          router.push(`/pages/${slug}`);
        }
      }, 1000);
    }, 800);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      const existingPages = JSON.parse(
        localStorage.getItem("thrico-custom-pages") || "[]"
      );
      const updatedPages = existingPages.filter(
        (page: any) => page.slug !== slug
      );
      localStorage.setItem("thrico-custom-pages", JSON.stringify(updatedPages));
      setLoading(false);
      setSuccess("Page deleted successfully!");
      setTimeout(() => router.push("/website-pages/pages"), 1000);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Edit Page</h2>
        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Page
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Page Title
                </label>
                <Input
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter page title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  URL Slug
                </label>
                <Input
                  value={form.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="Enter URL slug"
                  required
                />
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">SEO Settings</h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Meta Description
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="A brief description of the page for search engines (recommended: 150-160 characters)"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Meta Keywords
                  </label>
                  <Input
                    value={form.keywords}
                    onChange={(e) => handleChange("keywords", e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Page Content</h3>
              <div className="space-y-6">
                {form.sections.map((section, idx) => (
                  <div key={idx} className="border rounded-lg p-4 relative">
                    <div className="grid gap-2">
                      <label className="block text-sm font-medium mb-1">
                        Section Title (optional)
                      </label>
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          handleSectionChange(idx, "title", e.target.value)
                        }
                        placeholder="Enter section title"
                      />
                      <label className="block text-sm font-medium mb-1">
                        Section Content
                      </label>
                      <Textarea
                        value={section.content}
                        onChange={(e) =>
                          handleSectionChange(idx, "content", e.target.value)
                        }
                        placeholder="Enter section content"
                        rows={6}
                        required
                      />
                    </div>
                    {form.sections.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-destructive"
                        onClick={() => removeSection(idx)}
                      >
                        <MinusCircle className="h-4 w-4 mr-1" />
                        Remove Section
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSection}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Update Page
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, MinusCircle, Save } from "lucide-react";

type Section = {
  title: string;
  content: string;
};

export default function CreatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    keywords: "",
    sections: [{ title: "", content: "" }] as Section[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
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

    let slug = form.slug;
    if (!slug) {
      slug = form.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
    }

    setTimeout(() => {
      const existingPages = JSON.parse(
        localStorage.getItem("thrico-custom-pages") || "[]"
      );

      if (existingPages.some((page: any) => page.slug === slug)) {
        setError(
          "A page with this URL already exists. Please choose a different URL slug."
        );
        setLoading(false);
        return;
      }

      const newPage = {
        ...form,
        slug,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      existingPages.push(newPage);
      localStorage.setItem(
        "thrico-custom-pages",
        JSON.stringify(existingPages)
      );

      setSuccess("Page created successfully!");
      setLoading(false);
      setTimeout(() => {
        router.push(`/pages/${slug}`);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Create New Page</h2>
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
                    placeholder="Enter URL slug (optional)"
                  />
                  <span className="text-xs text-muted-foreground">
                    Leave blank to generate automatically from title. Example:
                    about-us
                  </span>
                </div>
              </div>

              <Separator />

              <h4 className="font-semibold mb-2">SEO Settings</h4>
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
                  <span className="text-xs text-muted-foreground">
                    Comma-separated keywords related to this page
                  </span>
                </div>
              </div>

              <Separator />

              <h4 className="font-semibold mb-2">Page Content</h4>
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Create Page
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save } from "lucide-react";

const VARIATIONS = {
  home: [
    { value: "balanced", label: "Balanced Layout (Classic)" },
    { value: "community", label: "Community Focused (Social-Driven)" },
    { value: "business", label: "Business First (Professional)" },
  ],
  about: [
    { value: "default", label: "Default" },
    { value: "modern", label: "Modern" },
    { value: "minimal", label: "Minimal" },
  ],
  contact: [
    { value: "default", label: "Default" },
    { value: "split", label: "Split" },
    { value: "centered", label: "Centered" },
  ],
  privacy: [
    { value: "default", label: "Default" },
    { value: "accordion", label: "Accordion" },
    { value: "sidebar", label: "Sidebar" },
  ],
};

const SEO_KEYS = ["title", "description", "keywords"];

const DEFAULTS = {
  home: {
    title: "Thrico - Connect with Your Community",
    description:
      "Join events, groups, and meet like-minded people in your area",
    keywords: "community, events, groups, networking",
    variation: "balanced",
  },
  about: {
    title: "About Us - Thrico",
    description:
      "Learn more about Thrico and our mission to connect communities",
    keywords: "about, mission, team, community platform",
    variation: "default",
  },
  contact: {
    title: "Contact Us - Thrico",
    description:
      "Get in touch with the Thrico team for support, feedback, or partnership inquiries",
    keywords: "contact, support, help, feedback, inquiries",
    variation: "default",
  },
  privacy: {
    title: "Privacy Policy - Thrico",
    description:
      "Learn about how Thrico collects, uses, and protects your personal information",
    keywords:
      "privacy policy, data protection, personal information, cookies, GDPR",
    variation: "default",
  },
};

export default function StandardPages() {
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [forms, setForms] = useState({
    home: { ...DEFAULTS.home },
    about: { ...DEFAULTS.about },
    contact: { ...DEFAULTS.contact },
    privacy: { ...DEFAULTS.privacy },
  });

  useEffect(() => {
    setTimeout(() => {
      // Home
      const homeSeo = JSON.parse(
        localStorage.getItem("thrico-seo-home") || JSON.stringify(DEFAULTS.home)
      );
      // About
      const aboutSeo = JSON.parse(
        localStorage.getItem("thrico-seo-about") ||
          JSON.stringify(DEFAULTS.about)
      );
      // Contact
      const contactSeo = JSON.parse(
        localStorage.getItem("thrico-seo-contact") ||
          JSON.stringify(DEFAULTS.contact)
      );
      // Privacy
      const privacySeo = JSON.parse(
        localStorage.getItem("thrico-seo-privacy") ||
          JSON.stringify(DEFAULTS.privacy)
      );

      setForms({
        home: {
          ...homeSeo,
          variation:
            localStorage.getItem("thrico-variation") || homeSeo.variation,
        },
        about: {
          ...aboutSeo,
          variation:
            localStorage.getItem("thrico-about-variation") ||
            aboutSeo.variation,
        },
        contact: {
          ...contactSeo,
          variation:
            localStorage.getItem("thrico-contact-variation") ||
            contactSeo.variation,
        },
        privacy: {
          ...privacySeo,
          variation:
            localStorage.getItem("thrico-privacy-variation") ||
            privacySeo.variation,
        },
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleChange = (tab: string, key: string, value: string) => {
    setForms((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [key]: value,
      },
    }));
  };

  const handleSave = (tab: string) => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(
        `thrico-seo-${tab}`,
        JSON.stringify({
          title: forms[tab].title,
          description: forms[tab].description,
          keywords: forms[tab].keywords,
        })
      );
      localStorage.setItem(
        `thrico-${tab === "home" ? "" : tab + "-"}variation`,
        forms[tab].variation
      );
      setLoading(false);
    }, 1000);
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
      <h2 className="text-2xl font-bold mb-6">Manage Standard Pages</h2>
      <Card>
        <CardHeader>
          <CardTitle>Standard Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="home">Home Page</TabsTrigger>
              <TabsTrigger value="about">About Us Page</TabsTrigger>
              <TabsTrigger value="contact">Contact Us Page</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy Page</TabsTrigger>
            </TabsList>

            {/* Home */}
            <TabsContent value="home">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave("home");
                }}
              >
                <h3 className="font-semibold mb-2">Home Page Settings</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Layout Variation
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={forms.home.variation}
                    onChange={(e) =>
                      handleChange("home", "variation", e.target.value)
                    }
                  >
                    {VARIATIONS.home.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Separator />
                <h4 className="font-semibold mb-2">SEO Settings</h4>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Title
                    </label>
                    <Input
                      value={forms.home.title}
                      onChange={(e) =>
                        handleChange("home", "title", e.target.value)
                      }
                      placeholder="Enter meta title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Description
                    </label>
                    <Textarea
                      value={forms.home.description}
                      onChange={(e) =>
                        handleChange("home", "description", e.target.value)
                      }
                      placeholder="Enter meta description"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Keywords
                    </label>
                    <Input
                      value={forms.home.keywords}
                      onChange={(e) =>
                        handleChange("home", "keywords", e.target.value)
                      }
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading && activeTab === "home"}
                  className="w-full"
                >
                  {loading && activeTab === "home" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save Home Page Settings
                </Button>
              </form>
            </TabsContent>

            {/* About */}
            <TabsContent value="about">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave("about");
                }}
              >
                <h3 className="font-semibold mb-2">About Page Settings</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Layout Variation
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={forms.about.variation}
                    onChange={(e) =>
                      handleChange("about", "variation", e.target.value)
                    }
                  >
                    {VARIATIONS.about.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Separator />
                <h4 className="font-semibold mb-2">SEO Settings</h4>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Title
                    </label>
                    <Input
                      value={forms.about.title}
                      onChange={(e) =>
                        handleChange("about", "title", e.target.value)
                      }
                      placeholder="Enter meta title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Description
                    </label>
                    <Textarea
                      value={forms.about.description}
                      onChange={(e) =>
                        handleChange("about", "description", e.target.value)
                      }
                      placeholder="Enter meta description"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Keywords
                    </label>
                    <Input
                      value={forms.about.keywords}
                      onChange={(e) =>
                        handleChange("about", "keywords", e.target.value)
                      }
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading && activeTab === "about"}
                  className="w-full"
                >
                  {loading && activeTab === "about" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save About Page Settings
                </Button>
              </form>
            </TabsContent>

            {/* Contact */}
            <TabsContent value="contact">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave("contact");
                }}
              >
                <h3 className="font-semibold mb-2">Contact Page Settings</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Layout Variation
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={forms.contact.variation}
                    onChange={(e) =>
                      handleChange("contact", "variation", e.target.value)
                    }
                  >
                    {VARIATIONS.contact.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Separator />
                <h4 className="font-semibold mb-2">SEO Settings</h4>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Title
                    </label>
                    <Input
                      value={forms.contact.title}
                      onChange={(e) =>
                        handleChange("contact", "title", e.target.value)
                      }
                      placeholder="Enter meta title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Description
                    </label>
                    <Textarea
                      value={forms.contact.description}
                      onChange={(e) =>
                        handleChange("contact", "description", e.target.value)
                      }
                      placeholder="Enter meta description"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Keywords
                    </label>
                    <Input
                      value={forms.contact.keywords}
                      onChange={(e) =>
                        handleChange("contact", "keywords", e.target.value)
                      }
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading && activeTab === "contact"}
                  className="w-full"
                >
                  {loading && activeTab === "contact" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save Contact Page Settings
                </Button>
              </form>
            </TabsContent>

            {/* Privacy */}
            <TabsContent value="privacy">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave("privacy");
                }}
              >
                <h3 className="font-semibold mb-2">
                  Privacy Policy Page Settings
                </h3>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Layout Variation
                  </label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={forms.privacy.variation}
                    onChange={(e) =>
                      handleChange("privacy", "variation", e.target.value)
                    }
                  >
                    {VARIATIONS.privacy.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Separator />
                <h4 className="font-semibold mb-2">SEO Settings</h4>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Title
                    </label>
                    <Input
                      value={forms.privacy.title}
                      onChange={(e) =>
                        handleChange("privacy", "title", e.target.value)
                      }
                      placeholder="Enter meta title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Description
                    </label>
                    <Textarea
                      value={forms.privacy.description}
                      onChange={(e) =>
                        handleChange("privacy", "description", e.target.value)
                      }
                      placeholder="Enter meta description"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meta Keywords
                    </label>
                    <Input
                      value={forms.privacy.keywords}
                      onChange={(e) =>
                        handleChange("privacy", "keywords", e.target.value)
                      }
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading && activeTab === "privacy"}
                  className="w-full"
                >
                  {loading && activeTab === "privacy" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save Privacy Page Settings
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

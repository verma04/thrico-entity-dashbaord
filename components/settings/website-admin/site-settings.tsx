"use client";

import React from "react";
import {
  useWebsiteBuilderStore,
  FontType,
} from "@/store/useWebsiteBuilderStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Map, Share2, FileCode, Type, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useDrawerStore } from "@/store/drawerStore";
import {
  useGetWebsite,
  useGetAllPagesSeo,
  useUpdatePageSeo,
  useUpdateWebsiteFont,
  useUpdateWebsiteTheme,
} from "@/graphql/actions/website";

const SiteSettings = () => {
  const {
    togglePageSitemap,
    siteSettings,
    updateSiteSettings,
    font,
    setFont,
    theme,
    setTheme,
  } = useWebsiteBuilderStore();

  const { data: websiteData } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const { data: seoData, refetch: refetchSeo } = useGetAllPagesSeo(
    websiteId || "",
    {
      skip: !websiteId,
    }
  );

  const [updatePageSeoMutation] = useUpdatePageSeo({
    onCompleted: () => {
      refetchSeo();
    },
  });

  const [updateFontMutation] = useUpdateWebsiteFont();
  const [updateThemeMutation] = useUpdateWebsiteTheme();

  const handleFontChange = (newFont: string) => {
    setFont(newFont as any);
    if (websiteId) {
      updateFontMutation({
        variables: {
          websiteId,
          font: newFont,
        },
      });
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    if (websiteId) {
      updateThemeMutation({
        variables: {
          websiteId,
          theme: newTheme,
        },
      });
    }
  };

  const pages = seoData?.getAllPagesSeo || [];

  const { toast } = useToast();
  const { isPremium } = useIsPremium();
  const { openDrawer } = useDrawerStore();
  const PremiumLock = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-muted-foreground">
          <Lock className="h-5 w-5" /> {title}
        </CardTitle>
        <CardDescription>Premium Feature</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/20 rounded-lg border border-dashed">
          <div className="p-4 bg-muted rounded-full">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Unlock {title}</h3>
            <p className="text-muted-foreground max-w-sm mt-2">{description}</p>
          </div>
          <Button
            onClick={() => openDrawer()}
            variant="default"
            className="mt-4"
          >
            Upgrade Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const handleSaveSettings = () => {
    // In a real app, we might trigger an API save here.
    // Since it's Zustand + Persist, it's already "saved" on change,
    // but a manual toast helps user confidence.
    toast({
      title: "Settings Saved",
      description: "Your site configuration has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Site Configuration
          </h2>
          <p className="text-muted-foreground">
            Manage your sitemap, analytics, and global settings.
          </p>
        </div>
        <Button onClick={handleSaveSettings}>Save Changes</Button>
      </div>

      <Tabs defaultValue="sitemap" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sitemap" className="gap-2">
            <Map className="h-4 w-4" /> Sitemap Manager
          </TabsTrigger>
          <TabsTrigger value="layout" className="gap-2">
            <Type className="h-4 w-4" /> Layout
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="h-4 w-4" /> General Settings
          </TabsTrigger>
        </TabsList>

        {/* --- SITEMAP TAB --- */}
        <TabsContent value="sitemap" className="mt-6">
          {!isPremium ? (
            <PremiumLock
              title="Sitemap Manager"
              description="Control which pages are visible to search engines and manage your sitemap.xml structure."
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sitemap Inclusion</CardTitle>
                <CardDescription>
                  Choose which pages should be visible to search engines in your
                  sitemap.xml.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead className="text-right">
                          Include in Sitemap
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pages.map((page) => (
                        <TableRow key={page.id}>
                          <TableCell className="font-medium">
                            {page.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            /{page.slug}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <Switch
                                checked={page.seo?.includeInSitemap ?? true}
                                onCheckedChange={(checked) => {
                                  togglePageSitemap(page.id);
                                  updatePageSeoMutation({
                                    variables: {
                                      pageId: page.id,
                                      includeInSitemap: checked,
                                    },
                                  });
                                }}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* --- LAYOUT TAB --- */}
        <TabsContent value="layout" className="mt-6 space-y-6">
          {!isPremium ? (
            <PremiumLock
              title="Theme & Typography"
              description="Customize your site's visual identity with premium themes and font pairings."
            />
          ) : (
            /* TYPOGRAPHY & THEME */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" /> Typography & Theme
                </CardTitle>
                <CardDescription>
                  Choose a theme style and font family for your entire website.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Theme Style Selector */}
                <div className="grid gap-2">
                  <Label htmlFor="theme-select">Theme Style</Label>
                  <Select value={theme} onValueChange={handleThemeChange}>
                    <SelectTrigger id="theme-select">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academia">Academia</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="creator">Creator</SelectItem>
                      <SelectItem value="association">Association</SelectItem>
                      <SelectItem value="startup">Startup</SelectItem>
                      <SelectItem value="dark-mode">Dark Mode</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground">
                    Theme affects default layouts and styling for all modules.
                  </p>
                </div>

                {/* Font Family Selector */}
                <div className="grid gap-2">
                  <Label htmlFor="font-select">Font Family</Label>
                  <Select value={font} onValueChange={handleFontChange}>
                    <SelectTrigger id="font-select">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                      <SelectItem value="playfair">Playfair Display</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                      <SelectItem value="lato">Lato</SelectItem>
                      <SelectItem value="open-sans">Open Sans</SelectItem>
                      <SelectItem value="raleway">Raleway</SelectItem>
                      <SelectItem value="merriweather">Merriweather</SelectItem>
                      <SelectItem value="nunito">Nunito</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground">
                    This font will be applied across all pages and modules.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* --- GENERAL SETTINGS TAB --- */}
        <TabsContent value="general" className="mt-6 space-y-6">
          {!isPremium ? (
            <PremiumLock
              title="General Settings"
              description="Setup Google Analytics, custom favicons, and social media links."
            />
          ) : (
            <>
              {/* GOOGLE ANALYTICS */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="h-5 w-5" /> Analytics & Integrations
                  </CardTitle>
                  <CardDescription>
                    Connect 3rd party tools to your website.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ga-id">
                      Google Analytics Measurement ID
                    </Label>
                    <Input
                      id="ga-id"
                      placeholder="G-XXXXXXXXXX"
                      value={siteSettings?.googleAnalyticsId || ""}
                      onChange={(e) =>
                        updateSiteSettings({
                          googleAnalyticsId: e.target.value,
                        })
                      }
                    />
                    <p className="text-[10px] text-muted-foreground">
                      The ID starting with "G-" found in your GA4 property
                      stream details.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* BRANDING */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" /> Branding
                  </CardTitle>
                  <CardDescription>
                    Global assets for your website.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="favicon">Favicon URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="favicon"
                        placeholder="https://example.com/icon.png"
                        value={siteSettings?.favicon || ""}
                        onChange={(e) =>
                          updateSiteSettings({ favicon: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SOCIAL LINKS */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" /> Social Links
                  </CardTitle>
                  <CardDescription>
                    These links usually appear in your Footer or Contact
                    sections.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Twitter / X</Label>
                      <Input
                        placeholder="https://twitter.com/username"
                        value={siteSettings?.socialLinks?.twitter || ""}
                        onChange={(e) =>
                          updateSiteSettings({
                            socialLinks: {
                              ...siteSettings.socialLinks,
                              twitter: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        value={siteSettings?.socialLinks?.linkedin || ""}
                        onChange={(e) =>
                          updateSiteSettings({
                            socialLinks: {
                              ...siteSettings.socialLinks,
                              linkedin: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GitHub</Label>
                      <Input
                        placeholder="https://github.com/username"
                        value={siteSettings?.socialLinks?.github || ""}
                        onChange={(e) =>
                          updateSiteSettings({
                            socialLinks: {
                              ...siteSettings.socialLinks,
                              github: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instagram</Label>
                      <Input
                        placeholder="https://instagram.com/username"
                        value={siteSettings?.socialLinks?.instagram || ""}
                        onChange={(e) =>
                          updateSiteSettings({
                            socialLinks: {
                              ...siteSettings.socialLinks,
                              instagram: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

function SettingsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default SiteSettings;

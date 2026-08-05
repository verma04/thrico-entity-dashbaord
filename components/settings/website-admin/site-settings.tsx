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
import {
  Map,
  Share2,
  FileCode,
  Type,
  Lock,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Zap,
  ChevronRight,
  Info,
  Globe,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { EcosystemWrapper, EcosystemHeader, EcosystemContainer } from "@/components/layout/ecosystem";

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

  const [hasChanged, setHasChanged] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const { data: websiteData } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const { data: seoData, refetch: refetchSeo } = useGetAllPagesSeo(
    websiteId || "",
    {
      skip: !websiteId,
    },
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
    setHasChanged(true);
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
    setHasChanged(true);
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
    icon: Icon,
  }: {
    title: string;
    description: string;
    icon: any;
  }) => (
    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden relative group bg-background">
      <div className="absolute top-0 right-0 p-6">
        <Lock className="h-5 w-5 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
      </div>
      <CardContent className="flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto py-12">
        <div className="p-5 bg-muted/50 rounded-2xl relative">
          <Icon className="h-8 w-8 text-muted-foreground" />
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background flex items-center justify-center shadow-md">
            <Lock className="h-3 w-3 text-indigo-600" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight">
            {title} Restricted
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {description}
          </p>
        </div>
        <Button
          onClick={() => openDrawer()}
          className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 group/btn"
        >
          <Sparkles className="h-4 w-4 mr-2 transition-transform group-hover/btn:rotate-12" />
          Unlock Premium
        </Button>
      </CardContent>
    </Card>
  );

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate/actual save logic if any other settings are needed
    setTimeout(() => {
      setIsSaving(false);
      setHasChanged(false);
      toast({
        title: "Settings Saved",
        description: "Your site configuration has been updated successfully.",
      });
    }, 1000);
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Website Settings"
        description="Manage global settings for your website."
        icon={SettingsIcon}
        badgeText="Website Builder"
        breadcrumbs={[
          { label: "Website Builder" },
          { label: "General Settings" },
          { label: "Website Settings" }
        ]}
      />

      <EcosystemContainer>
        <div className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Config Area */}
            <div className="lg:col-span-8 space-y-8">
              <Tabs defaultValue="sitemap" className="w-full">
                <div className="flex mb-8">
                  <TabsList className="h-12 bg-muted/50 p-1">
                    <TabsTrigger
                      value="sitemap"
                      className="rounded-md px-6 text-xs font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <Map className="h-3.5 w-3.5" /> Sitemap
                    </TabsTrigger>
                    <TabsTrigger
                      value="layout"
                      className="rounded-md px-6 text-xs font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <Type className="h-3.5 w-3.5" /> Identity
                    </TabsTrigger>
                    <TabsTrigger
                      value="general"
                      className="rounded-md px-6 text-xs font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <SettingsIcon className="h-3.5 w-3.5" /> Parameters
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="sitemap" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  {!isPremium ? (
                    <PremiumLock
                      title="Sitemap Manager"
                      icon={Map}
                      description="Optimize your site's discovery architecture. Control search engine indexing and hierarchical visibility mapping."
                    />
                  ) : (
                    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Map className="h-4 w-4 text-indigo-600" />
                          <CardTitle className="text-xl">Indexing Matrix</CardTitle>
                        </div>
                        <CardDescription>
                          Control which pages are included in your XML sitemap.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 px-0">
                        <Table>
                          <TableHeader className="bg-muted/10 border-b">
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="py-4 px-6 text-xs font-bold">Resource Name</TableHead>
                              <TableHead className="py-4 px-6 text-xs font-bold">Node Address</TableHead>
                              <TableHead className="py-4 px-6 text-xs font-bold text-right">Index Toggle</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pages.map((page) => (
                              <TableRow key={page.id} className="group border-b border-border/50 last:border-0 hover:bg-muted/5">
                                <TableCell className="py-4 px-6">
                                  <span className="text-sm font-bold text-foreground">{page.name}</span>
                                </TableCell>
                                <TableCell className="py-4 px-6">
                                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">/{page.slug}</span>
                                </TableCell>
                                <TableCell className="py-4 px-6 text-right">
                                  <div className="flex justify-end pr-2">
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
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="layout" className="mt-0 space-y-8 focus-visible:outline-none focus-visible:ring-0">
                  {!isPremium ? (
                    <PremiumLock
                      title="Identity & Form"
                      icon={Type}
                      description="Customize the aesthetic DNA of your platform. Access exclusive typography systems and high-fidelity global themes."
                    />
                  ) : (
                    <>
                      <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap className="h-4 w-4 text-indigo-600" />
                            <CardTitle className="text-xl">Global Theme</CardTitle>
                          </div>
                          <CardDescription>
                            Define the overarching visual aesthetic for your website.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                          <div className="space-y-2 max-w-sm">
                            <Label className="text-sm font-medium">Theme Archetype</Label>
                            <Select value={theme} onValueChange={handleThemeChange}>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Commit Theme" />
                              </SelectTrigger>
                              <SelectContent>
                                {["academia", "enterprise", "creator", "association", "startup", "dark-mode"].map((t) => (
                                  <SelectItem key={t} value={t} className="capitalize py-2">
                                    {t.replace("-", " ")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Type className="h-4 w-4 text-indigo-600" />
                            <CardTitle className="text-xl">Typography</CardTitle>
                          </div>
                          <CardDescription>
                            Control the global font family architecture.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                          <div className="space-y-2 max-w-sm">
                            <Label className="text-sm font-medium">Font Protocol</Label>
                            <Select value={font} onValueChange={handleFontChange}>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Commit Font" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                {["inter", "roboto", "poppins", "playfair", "montserrat", "lato", "open-sans", "raleway", "merriweather", "nunito"].map((f) => (
                                  <SelectItem key={f} value={f} className="capitalize py-2">
                                    {f.replace("-", " ")}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="general" className="mt-0 space-y-8 focus-visible:outline-none focus-visible:ring-0">
                  {!isPremium ? (
                    <PremiumLock
                      title="Global Parameters"
                      icon={SettingsIcon}
                      description="Deploy advanced analytics and cross-platform branding anchors. Unlock the full potential of your site's data ecosystem."
                    />
                  ) : (
                    <>
                      <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <FileCode className="h-4 w-4 text-indigo-600" />
                            <CardTitle className="text-xl">Integrations</CardTitle>
                          </div>
                          <CardDescription>
                            Connect external services and manage global platform parameters.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">GA4 Measurement Protocol ID</Label>
                            <Input
                              placeholder="G-XXXXXX"
                              value={siteSettings?.googleAnalyticsId || ""}
                              onChange={(e) => {
                                updateSiteSettings({ googleAnalyticsId: e.target.value });
                                setHasChanged(true);
                              }}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Found in your Google Analytics 4 Property Data Streams.</p>
                          </div>
                          
                          <div className="h-px bg-border" />

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Favicon URL Asset</Label>
                            <Input
                              placeholder="https://cdn.example.com/favicon.png"
                              value={siteSettings?.favicon || ""}
                              onChange={(e) => {
                                updateSiteSettings({ favicon: e.target.value });
                                setHasChanged(true);
                              }}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Direct link to a 32x32 image file for browser tabs.</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Share2 className="h-4 w-4 text-indigo-600" />
                            <CardTitle className="text-xl">Social Bridges</CardTitle>
                          </div>
                          <CardDescription>
                            Define global connection points for social platforms.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                              { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/handle" },
                              { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
                              { key: "github", label: "GitHub", placeholder: "https://github.com/username" },
                              { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" }
                            ].map((social) => (
                              <div key={social.key} className="space-y-2">
                                <Label className="text-sm font-medium">{social.label}</Label>
                                <Input
                                  placeholder={social.placeholder}
                                  value={(siteSettings?.socialLinks as any)?.[social.key] || ""}
                                  onChange={(e) => {
                                    updateSiteSettings({
                                      socialLinks: {
                                        ...siteSettings.socialLinks,
                                        [social.key]: e.target.value,
                                      },
                                    });
                                    setHasChanged(true);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar Information */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                   <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                      <Globe className="h-8 w-8 mb-4 opacity-80" />
                      <h3 className="text-lg font-bold">Platform Overview</h3>
                      <p className="text-sm text-white/80 mt-1">
                        Global settings applied across your entire website.
                      </p>
                   </div>
                   <div className="p-4 bg-muted/10 grid grid-cols-2 gap-4 divide-x">
                      <div className="flex flex-col items-center justify-center py-2">
                        <span className="text-2xl font-bold">{pages.length}</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Total Pages</span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-2">
                        <span className="text-sm font-bold capitalize">{theme || "Default"}</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Current Theme</span>
                      </div>
                   </div>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                  <CardHeader className="pb-3 border-b bg-muted/20">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Info className="h-4 w-4 text-indigo-600" />
                      Settings Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 text-xs text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Sitemap inclusion directly impacts your SEO visibility. Uncheck private nodes.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Favicon links must be publicly accessible CDN urls or absolute paths.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>
                          Theme updates propagate immediately to all active architecture interfaces.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </EcosystemContainer>

      <FloatingSavePanel
        onSave={handleSaveSettings}
        isSaving={isSaving}
        hasChanged={hasChanged}
        title="Unsaved Changes"
        description="You have pending changes to your settings."
      />
    </EcosystemWrapper>
  );
};

export default SiteSettings;

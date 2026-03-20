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
  Globe,
  Map,
  Share2,
  FileCode,
  Type,
  Lock,
  Settings as SettingsIcon,
  ShieldCheck,
  SaveIcon,
  Sparkles,
  Zap,
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
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

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
    icon: Icon,
  }: {
    title: string;
    description: string;
    icon: any;
  }) => (
    <div className="relative group overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-12 shadow-xl shadow-slate-200/50">
      <div className="absolute top-0 right-0 p-8">
        <Lock className="h-6 w-6 text-slate-200 group-hover:text-indigo-500 transition-colors" />
      </div>
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
        <div className="p-6 bg-slate-50 rounded-3xl relative">
          <Icon className="h-10 w-10 text-slate-400" />
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Lock className="h-3 w-3 text-indigo-500" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
            {title} Restricted
          </h3>
          <p className="text-slate-400 font-medium mt-3 leading-relaxed">
            {description}
          </p>
        </div>
        <Button
          onClick={() => openDrawer()}
          className="h-12 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-200 transition-all active:scale-95 group"
        >
          <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
          Access Premium Matrix
        </Button>
      </div>
    </div>
  );

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your site configuration has been updated successfully.",
    });
  };

  return (
    <div className="space-y-8 pb-12">
      <EcosystemActionBar shadow="sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Configuration Nexus: Active
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Core Status: Verified</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveSettings}
              className="h-10 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[11px] uppercase tracking-wider gap-3 shadow-xl shadow-slate-200 transition-all active:scale-95 group"
            >
              <SaveIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
              Commit Configuration
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 overflow-hidden border-none shadow-none bg-transparent">
        <Tabs defaultValue="sitemap" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="h-14 p-1 bg-slate-100/50 rounded-2xl border border-slate-100 shadow-inner backdrop-blur-xl">
              <TabsTrigger
                value="sitemap"
                className="rounded-xl px-8 h-full data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg text-slate-400 font-black text-[10px] uppercase tracking-widest transition-all gap-2"
              >
                <Map className="h-3.5 w-3.5" /> Sitemap
              </TabsTrigger>
              <TabsTrigger
                value="layout"
                className="rounded-xl px-8 h-full data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg text-slate-400 font-black text-[10px] uppercase tracking-widest transition-all gap-2"
              >
                <Type className="h-3.5 w-3.5" /> Identity
              </TabsTrigger>
              <TabsTrigger
                value="general"
                className="rounded-xl px-8 h-full data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-lg text-slate-400 font-black text-[10px] uppercase tracking-widest transition-all gap-2"
              >
                <SettingsIcon className="h-3.5 w-3.5" /> Parameters
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="max-w-5xl mx-auto px-4">
            <TabsContent value="sitemap" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {!isPremium ? (
                <PremiumLock
                  title="Sitemap Manager"
                  icon={Map}
                  description="Optimize your site's discovery architecture. Control search engine indexing and hierarchical visibility mapping."
                />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                      <Map className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Indexing Matrix</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hierarchical crawl orchestrator</p>
                    </div>
                  </div>
                  
                  <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resource Name</TableHead>
                          <TableHead className="py-6 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Node Address</TableHead>
                          <TableHead className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Visibility Protocol</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pages.map((page) => (
                          <TableRow key={page.id} className="group border-b border-slate-50 last:border-0">
                            <TableCell className="py-6 px-10">
                              <span className="text-sm font-black text-slate-900 italic uppercase">{page.name}</span>
                            </TableCell>
                            <TableCell className="py-6 px-6">
                              <span className="text-[11px] font-bold text-slate-400 font-mono bg-slate-50 px-3 py-1 rounded-lg">/{page.slug}</span>
                            </TableCell>
                            <TableCell className="py-6 px-10 text-right">
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
                                  className="data-[state=checked]:bg-emerald-500"
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="layout" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {!isPremium ? (
                <PremiumLock
                  title="Identity & Form"
                  icon={Type}
                  description="Customize the aesthetic DNA of your platform. Access exclusive typography systems and high-fidelity global themes."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Global Theme</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Foundational visual identity</p>
                      </div>
                    </div>
                    
                    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-xl shadow-slate-200/50 space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Theme Archetype</Label>
                        <Select value={theme} onValueChange={handleThemeChange}>
                          <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-black italic uppercase text-xs tracking-wider">
                            <SelectValue placeholder="Commit Theme" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                            {["academia", "enterprise", "creator", "association", "startup", "dark-mode"].map((t) => (
                              <SelectItem key={t} value={t} className="rounded-xl py-3 font-bold uppercase text-[10px] tracking-widest leading-none mb-1 last:mb-0 cursor-pointer">
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 leading-relaxed px-1">
                        Theme archetype applies foundational styling across all architectural modules.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                        <Type className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Typography</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Core font family definition</p>
                      </div>
                    </div>
                    
                    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-xl shadow-slate-200/50 space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Font Protocol</Label>
                        <Select value={font} onValueChange={handleFontChange}>
                          <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-black italic uppercase text-xs tracking-wider">
                            <SelectValue placeholder="Commit Font" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2 max-h-[300px]">
                            {["inter", "roboto", "poppins", "playfair", "montserrat", "lato", "open-sans", "raleway", "merriweather", "nunito"].map((f) => (
                              <SelectItem key={f} value={f} className="rounded-xl py-3 font-bold uppercase text-[10px] tracking-widest leading-none mb-1 last:mb-0 cursor-pointer">
                                {f}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 leading-relaxed px-1">
                        The typography protocol will be projected across all interface nodes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="general" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {!isPremium ? (
                <PremiumLock
                  title="Global Parameters"
                  icon={SettingsIcon}
                  description="Deploy advanced analytics and cross-platform branding anchors. Unlock the full potential of your site's data ecosystem."
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                          <FileCode className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Integrations</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">External protocol mapping</p>
                        </div>
                      </div>
                      
                      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-xl shadow-slate-200/50">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GA4 Measurement Protocol ID</Label>
                            <Input
                              placeholder="G-XXXXXX"
                              value={siteSettings?.googleAnalyticsId || ""}
                              onChange={(e) => updateSiteSettings({ googleAnalyticsId: e.target.value })}
                              className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-xs shadow-inner focus:bg-white transition-all"
                            />
                            <p className="text-[10px] font-medium text-slate-400 px-1 mt-2">Found in GA4 Property Stream details.</p>
                          </div>

                          <div className="h-px bg-slate-100 my-8" />

                          <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Favicon Asset Invariant</Label>
                            <Input
                              placeholder="https://resource.cdn/favicon.png"
                              value={siteSettings?.favicon || ""}
                              onChange={(e) => updateSiteSettings({ favicon: e.target.value })}
                              className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-xs shadow-inner focus:bg-white transition-all"
                            />
                            <p className="text-[10px] font-medium text-slate-400 px-1 mt-2">Static URL for website browser representation.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                        <Share2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Bridges</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Social link orchestration</p>
                      </div>
                    </div>
                    
                    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-xl shadow-slate-200/50 space-y-8">
                      {[
                        { key: "twitter", label: "Twitter / X", placeholder: "X://handle" },
                        { key: "linkedin", label: "LinkedIn", placeholder: "in://username" },
                        { key: "github", label: "GitHub", placeholder: "git://username" },
                        { key: "instagram", label: "Instagram", placeholder: "ig://username" }
                      ].map((social) => (
                        <div key={social.key} className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{social.label}</Label>
                          <Input
                            placeholder={social.placeholder}
                            value={(siteSettings?.socialLinks as any)?.[social.key] || ""}
                            onChange={(e) =>
                              updateSiteSettings({
                                socialLinks: {
                                  ...siteSettings.socialLinks,
                                  [social.key]: e.target.value,
                                },
                              })
                            }
                            className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-xs shadow-inner"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </EcosystemContainer>
    </div>
  );
};

export default SiteSettings;

import React, { useState, useMemo } from "react";
import {
  LayoutType,
  ModuleData,
  ModuleType,
  ThemeType,
  useWebsiteBuilderStore,
  MenuItem,
} from "@/store/useWebsiteBuilderStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  X,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Check,
  Search,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// Only load icon names once
const ICON_NAMES = Object.keys(LucideIcons).filter(
  (name) =>
    name !== "icons" && name !== "createLucideIcon" && isNaN(Number(name))
);

const IconPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const SelectedIcon = value
    ? (LucideIcons as any)[value.charAt(0).toUpperCase() + value.slice(1)]
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-7 text-xs px-2"
        >
          {value ? (
            <span className="flex items-center gap-2 truncate">
              {SelectedIcon && <SelectedIcon className="h-3 w-3 shrink-0" />}
              {value}
            </span>
          ) : (
            <span className="text-muted-foreground">Select icon...</span>
          )}
          <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" side="bottom" align="start">
        <IconList
          onSelect={(val) => {
            onChange(val);
            setOpen(false);
          }}
          selectedValue={value}
        />
      </PopoverContent>
    </Popover>
  );
};

const IconList = ({
  onSelect,
  selectedValue,
}: {
  onSelect: (val: string) => void;
  selectedValue: string;
}) => {
  const [search, setSearch] = useState("");
  const filteredIcons = useMemo(() => {
    if (!search) return ICON_NAMES.slice(0, 50);
    return ICON_NAMES.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50);
  }, [search]);

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder="Search icon..."
        className="h-8 text-xs"
        value={search}
        onValueChange={setSearch}
      />
      <CommandList className="max-h-[200px] overflow-y-auto">
        {filteredIcons.length === 0 && (
          <CommandEmpty>No icon found.</CommandEmpty>
        )}
        <CommandGroup>
          {filteredIcons.map((iconName) => {
            const Icon = (LucideIcons as any)[iconName];
            if (!Icon) return null;
            return (
              <CommandItem
                key={iconName}
                value={iconName}
                onSelect={() => onSelect(iconName)}
                className="text-xs cursor-pointer"
              >
                <Icon className="mr-2 h-3 w-3 shrink-0" />
                <span className="truncate">{iconName}</span>
                {selectedValue === iconName && (
                  <Check className="ml-auto h-3 w-3 opacity-50" />
                )}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const getAvailableLayouts = (
  theme: ThemeType,
  moduleType: ModuleType
): LayoutType[] => {
  if (moduleType === "hero") {
    // 4 Core Hero Layouts
    return [
      "carousel",
      "split",
      "video",
      "single-image"
    ];
  }
  if (moduleType === "navbar") {
    return ["simple", "centered", "minimal", "stacked", "split"];
  }
  if (moduleType === "footer") {
    return ["columns", "simple", "minimal", "corporate", "newsletter"];
  }
  if (["communities", "marketplace", "jobs"].includes(moduleType)) {
    return ["grid", "list", "cards", "masonry"];
  }
  if (moduleType === "ceo-message") {
    return ["classic-card", "split-screen", "centered", "testimonial", "modern-asymmetric"];
  }
  if (moduleType === "testimonials") {
    return ["grid-cards", "carousel", "marquee", "featured-large", "masonry-wall", "minimal-list"];
  }
  if (moduleType === "about") {
    return ["story-vision", "mission-values", "founder-message", "impact-growth", "simple-overview"];
  }
  if (moduleType === "contact") {
    return ["simple-contact", "support-focused", "sales-inquiry", "community-reach", "location-office"];
  }
  if (moduleType === "privacy-policy") {
    return ["simple-privacy", "legal-document", "tabbed-policy"];
  }
  if (moduleType === "team-members") {
    return ["grid-profiles", "carousel-leaders", "minimal-list"];
  }
  if (moduleType === "terms-conditions") {
    return ["simple-terms", "structured-agreement", "faq-style"];
  }
  if (moduleType === "faq") {
    return ["simple-accordion", "grid-cards", "highlight-feature"];
  }

  return ["default"];
};

const MenuEditor = ({
  menuItems,
  onChange,
}: {
  menuItems: MenuItem[];
  onChange: (items: MenuItem[]) => void;
}) => {
  const [newItemLabel, setNewItemLabel] = useState("");
  const addMenuItem = () => {
    if (!newItemLabel.trim()) return;
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      label: newItemLabel,
      link: "#",
      target: "_self",
      children: [],
    };
    onChange([...(menuItems || []), newItem]);
    setNewItemLabel("");
  };

  const updateItem = (
    id: string,
    updates: Partial<MenuItem>,
    items: MenuItem[]
  ): MenuItem[] => {
    return items.map((item) => {
      if (item.id === id) return { ...item, ...updates };
      if (item.children)
        return { ...item, children: updateItem(id, updates, item.children) };
      return item;
    });
  };

  const removeItem = (id: string, items: MenuItem[]): MenuItem[] => {
    return items
      .filter((i) => i.id !== id)
      .map((i) => ({
        ...i,
        children: i.children ? removeItem(id, i.children) : [],
      }));
  };

  const addSubItem = (parentId: string, items: MenuItem[]): MenuItem[] => {
    return items.map((item) => {
      if (item.id === parentId) {
        return {
          ...item,
          children: [
            ...(item.children || []),
            {
              id: crypto.randomUUID(),
              label: "New Link",
              link: "#",
              target: "_self",
              children: [],
            },
          ],
        };
      }
      if (item.children) {
        return { ...item, children: addSubItem(parentId, item.children) };
      }
      return item;
    });
  };

  const renderItems = (items: MenuItem[], depth = 0) => {
    return (
      <div className={cn("space-y-3", depth > 0 && "pl-4 border-l ml-2")}>
        {items?.map((item) => (
          <div
            key={item.id}
            className="bg-muted/30 p-2 rounded-md border text-sm space-y-2"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-move" />
              <div className="flex-1 font-medium">{item.label}</div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onChange(addSubItem(item.id, menuItems))}
                  className="p-1 hover:bg-muted rounded text-primary"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onChange(removeItem(item.id, menuItems))}
                  className="p-1 hover:bg-red-100 text-red-500 rounded"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <Label className="text-[10px] text-muted-foreground">
                  Label
                </Label>
                <Input
                  value={item.label}
                  onChange={(e) =>
                    onChange(
                      updateItem(item.id, { label: e.target.value }, menuItems)
                    )
                  }
                  className="h-7 text-xs"
                />
              </div>
              <div className="col-span-1">
                <Label className="text-[10px] text-muted-foreground">
                  Icon
                </Label>
                <IconPicker
                  value={item.icon || ""}
                  onChange={(val) =>
                    onChange(updateItem(item.id, { icon: val }, menuItems))
                  }
                />
              </div>
              <div className="col-span-1">
                <Label className="text-[10px] text-muted-foreground">
                  Link / Href
                </Label>
                <Input
                  value={item.link || ""}
                  onChange={(e) =>
                    onChange(
                      updateItem(item.id, { link: e.target.value }, menuItems)
                    )
                  }
                  className="h-7 text-xs"
                />
              </div>
              <div className="col-span-1">
                <Label className="text-[10px] text-muted-foreground">
                  Open In
                </Label>
                <Select
                  value={item.target || "_self"}
                  onValueChange={(val: any) =>
                    onChange(updateItem(item.id, { target: val }, menuItems))
                  }
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_self">Same Tab</SelectItem>
                    <SelectItem value="_blank">New Tab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {item.children && item.children.length > 0 && (
              <div className="pt-2">
                {renderItems(item.children, depth + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
      <Label className="text-xs uppercase font-bold text-muted-foreground">
        Menu Items
      </Label>
      {renderItems(menuItems || [])}
      <div className="flex gap-2 pt-2 border-t mt-2 border-dashed">
        <Input
          placeholder="Add top-level item..."
          value={newItemLabel}
          onChange={(e) => setNewItemLabel(e.target.value)}
          className="h-8 text-sm"
          onKeyDown={(e) => e.key === "Enter" && addMenuItem()}
        />
        <button
          onClick={addMenuItem}
          className="p-2 bg-primary text-primary-foreground rounded-md"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const SocialLinksEditor = ({ links, onChange }: { links: { platform: string; url: string }[]; onChange: (links: { platform: string; url: string }[]) => void }) => {
    const addLink = () => {
        onChange([...(links || []), { platform: "twitter", url: "https://" }]);
    };

    const removeLink = (index: number) => {
        const newLinks = [...(links || [])];
        newLinks.splice(index, 1);
        onChange(newLinks);
    };

    const updateLink = (index: number, field: "platform" | "url", value: string) => {
        const newLinks = [...(links || [])];
        newLinks[index] = { ...newLinks[index], [field]: value };
        onChange(newLinks);
    };

    return (
        <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
            <Label className="text-xs uppercase font-bold text-muted-foreground">Social Links</Label>
            <div className="space-y-2">
                {links?.map((link, index) => (
                    <div key={index} className="flex gap-2 items-start">
                        <Select value={link.platform} onValueChange={(val) => updateLink(index, "platform", val)}>
                             <SelectTrigger className="w-[100px] h-8 text-xs">
                                 <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                 {["twitter", "facebook", "linkedin", "instagram", "github", "youtube", "discord", "tiktok"].map(p => (
                                     <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                                 ))}
                             </SelectContent>
                        </Select>
                        <Input 
                            value={link.url} 
                            onChange={(e) => updateLink(index, "url", e.target.value)} 
                            className="h-8 text-xs flex-1"
                            placeholder="https://..."
                        />
                        <button onClick={() => removeLink(index)} className="p-2 hover:bg-red-100 text-red-500 rounded">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
            <Button onClick={addLink} variant="outline" size="sm" className="w-full text-xs h-8 dashed border-muted-foreground/50">
                <Plus className="h-3 w-3 mr-2" /> Add Social Link
            </Button>
        </div>
    );
};

const HeroSettings = ({ content, onChange, layout }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void; layout: LayoutType }) => {
    const slides = content.slides || [];
    
    // Slide Editor Helpers
    const updateSlide = (index: number, field: string, value: string) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        onChange({ slides: newSlides });
    };

    const addSlide = () => {
        onChange({ 
            slides: [...slides, { 
                title: "New Slide", 
                subtitle: "Subtitle", 
                ctaText: "Click Me", 
                ctaLink: "#", 
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
            }] 
        });
    };

    const removeSlide = (index: number) => {
        const newSlides = [...slides];
        newSlides.splice(index, 1);
        onChange({ slides: newSlides });
    };

    // Features Editor (for split layout)
    const features = content.features || [];
    const addFeature = () => {
        onChange({ features: [...features, "New feature"] });
    };
    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        onChange({ features: newFeatures });
    };
    const removeFeature = (index: number) => {
        const newFeatures = [...features];
        newFeatures.splice(index, 1);
        onChange({ features: newFeatures });
    };

    return (
        <div className="space-y-4">
            {/* Common Fields for All Layouts */}
            <div className="space-y-3">
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Title / Headline</Label>
                    <Input 
                        value={content.title || ""} 
                        onChange={(e) => onChange({ title: e.target.value })} 
                        placeholder="Enter hero title..."
                        className="h-9 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Description / Subtitle</Label>
                    <Textarea 
                        value={content.description || ""} 
                        onChange={(e) => onChange({ description: e.target.value })} 
                        placeholder="Enter description..."
                        className="text-sm resize-none"
                        rows={3}
                    />
                </div>
            </div>

            <hr className="border-border" />

            {/* Layout-Specific Controls */}
            
            {/* CAROUSEL & DARK-CINEMATIC: Slides */}
            {(layout === "carousel") && (
                <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Carousel Slides</Label>
                    
                    {slides.map((slide: any, index: number) => (
                        <div key={index} className="space-y-3 p-3 bg-background rounded border">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold">Slide {index + 1}</span>
                                <button onClick={() => removeSlide(index)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                    <Label className="text-[10px]">Title</Label>
                                    <Input value={slide.title} onChange={(e) => updateSlide(index, 'title', e.target.value)} className="h-7 text-xs" />
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-[10px]">Subtitle</Label>
                                    <Input value={slide.subtitle} onChange={(e) => updateSlide(index, 'subtitle', e.target.value)} className="h-7 text-xs" />
                                </div>
                                <div>
                                    <Label className="text-[10px]">CTA Text</Label>
                                    <Input value={slide.ctaText} onChange={(e) => updateSlide(index, 'ctaText', e.target.value)} className="h-7 text-xs" />
                                </div>
                                <div>
                                    <Label className="text-[10px]">CTA Link</Label>
                                    <Input value={slide.ctaLink} onChange={(e) => updateSlide(index, 'ctaLink', e.target.value)} className="h-7 text-xs" />
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-[10px]">Image URL</Label>
                                    <Input value={slide.image} onChange={(e) => updateSlide(index, 'image', e.target.value)} className="h-7 text-xs" />
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <Button onClick={addSlide} variant="ghost" size="sm" className="w-full text-xs h-8 dashed border-muted-foreground/50 border">
                        <Plus className="h-3 w-3 mr-2" /> Add Slide
                    </Button>
                </div>
            )}

            {/* VIDEO: Video URL */}
            {layout === "video" && (
                <>
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Video URL</Label>
                        <Input 
                            value={content.videoUrl || ""} 
                            onChange={(e) => onChange({ videoUrl: e.target.value })} 
                            placeholder="https://example.com/video.mp4"
                            className="h-8 text-xs"
                        />
                        <p className="text-[10px] text-muted-foreground">Enter a direct link to an MP4 video file</p>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Text Color</Label>
                        <div className="flex gap-2">
                            <Input 
                                type="color"
                                value={content.textColor || "#ffffff"} 
                                onChange={(e) => onChange({ textColor: e.target.value })} 
                                className="h-8 w-16 p-1 cursor-pointer"
                            />
                            <Input 
                                value={content.textColor || "#ffffff"} 
                                onChange={(e) => onChange({ textColor: e.target.value })} 
                                placeholder="#ffffff"
                                className="h-8 text-xs flex-1"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">CTA Button Text (Optional)</Label>
                        <Input 
                            value={content.ctaText || ""} 
                            onChange={(e) => onChange({ ctaText: e.target.value })} 
                            placeholder="Watch Demo"
                            className="h-8 text-xs"
                        />
                        <p className="text-[10px] text-muted-foreground">Leave empty to hide button</p>
                    </div>
                    
                    {content.ctaText && (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">CTA Link</Label>
                            <Input 
                                value={content.ctaLink || ""} 
                                onChange={(e) => onChange({ ctaLink: e.target.value })} 
                                placeholder="/demo or https://..."
                                className="h-8 text-xs"
                            />
                        </div>
                    )}
                </>
            )}

            {/* SINGLE-IMAGE & SPLIT: Image URL */}
            {(layout === "single-image" || layout === "split") && (
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Hero Image URL</Label>
                    <Input 
                        value={content.image || ""} 
                        onChange={(e) => onChange({ image: e.target.value })} 
                        placeholder="https://images.unsplash.com/..."
                        className="h-8 text-xs"
                    />
                </div>
            )}
            
            {/* SINGLE-IMAGE: Text Color */}
            {layout === "single-image" && (
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Text Color</Label>
                    <div className="flex gap-2">
                        <Input 
                            type="color"
                            value={content.textColor || "#ffffff"} 
                            onChange={(e) => onChange({ textColor: e.target.value })} 
                            className="h-8 w-16 p-1 cursor-pointer"
                        />
                        <Input 
                            value={content.textColor || "#ffffff"} 
                            onChange={(e) => onChange({ textColor: e.target.value })} 
                            placeholder="#ffffff"
                            className="h-8 text-xs flex-1"
                        />
                    </div>
                </div>
            )}

            {/* SINGLE-IMAGE & SPLIT: CTA Button */}
            {(layout === "single-image" || layout === "split") && (
                <>
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Primary CTA Button Text (Optional)</Label>
                        <Input 
                            value={content.ctaText || ""} 
                            onChange={(e) => onChange({ ctaText: e.target.value })} 
                            placeholder="Get Started"
                            className="h-8 text-xs"
                        />
                        <p className="text-[10px] text-muted-foreground">Leave empty to hide button</p>
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Primary CTA Link</Label>
                        <Input 
                            value={content.ctaLink || ""} 
                            onChange={(e) => onChange({ ctaLink: e.target.value })} 
                            placeholder="/signup or https://..."
                            className="h-8 text-xs"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Secondary Button Text (Optional)</Label>
                        <Input 
                            value={content.secondaryCtaText || ""} 
                            onChange={(e) => onChange({ secondaryCtaText: e.target.value })} 
                            placeholder="Watch Demo"
                            className="h-8 text-xs"
                        />
                        <p className="text-[10px] text-muted-foreground">Leave empty to hide secondary button</p>
                    </div>
                    
                    {content.secondaryCtaText && (
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Secondary CTA Link</Label>
                            <Input 
                                value={content.secondaryCtaLink || ""} 
                                onChange={(e) => onChange({ secondaryCtaLink: e.target.value })} 
                                placeholder="/demo or https://..."
                                className="h-8 text-xs"
                            />
                        </div>
                    )}
                </>
            )}

            {/* SPLIT: Badge & Features */}
            {layout === "split" && (
                <>
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Badge / Tag</Label>
                        <Input 
                            value={content.badge || ""} 
                            onChange={(e) => onChange({ badge: e.target.value })} 
                            placeholder="Why Choose Us"
                            className="h-8 text-xs"
                        />
                    </div>

                    <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Feature List</Label>
                        <div className="space-y-2">
                            {features.map((feature: string, index: number) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input 
                                        value={feature} 
                                        onChange={(e) => updateFeature(index, e.target.value)} 
                                        className="h-8 text-xs flex-1"
                                        placeholder="Feature description"
                                    />
                                    <button onClick={() => removeFeature(index)} className="p-2 hover:bg-red-100 text-red-500 rounded">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button onClick={addFeature} variant="outline" size="sm" className="w-full text-xs h-8 dashed border-muted-foreground/50">
                            <Plus className="h-3 w-3 mr-2" /> Add Feature
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};


const ContactSettings = ({ content, onChange, layout }: { content: Record<string, any>; onChange: (c: Record<string, any>) => void; layout: LayoutType }) => {
    // FAQ Editor
    const faqs = content.faqs || [];
    const addFaq = () => {
        onChange({ 
            faqs: [...faqs, { question: "New Question", answer: "Answer here." }] 
        });
    };
    const updateFaq = (index: number, field: "question" | "answer", value: string) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        onChange({ faqs: newFaqs });
    };
    const removeFaq = (index: number) => {
        const newFaqs = [...faqs];
        newFaqs.splice(index, 1);
        onChange({ faqs: newFaqs });
    };

    return (
        <div className="space-y-4">
            <Label className="uppercase text-xs text-muted-foreground font-bold tracking-wider">Contact Settings</Label>
            
            {/* Common Fields */}
            <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground">Title</Label>
                <Input 
                    value={content.title || ""} 
                    onChange={(e) => onChange({ title: e.target.value })} 
                    placeholder="Get in Touch"
                    className="h-8 text-xs"
                />
            </div>
            
            <div className="space-y-2">
                <Label className="text-[10px] text-muted-foreground">Subtitle / Description</Label>
                <Textarea 
                    value={content.subtitle || ""} 
                    onChange={(e) => onChange({ subtitle: e.target.value })} 
                    placeholder="We'd love to hear from you..."
                    className="text-xs min-h-[60px]"
                    rows={2}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label className="text-[10px] text-muted-foreground">Email Address</Label>
                    <Input 
                        value={content.email || ""} 
                        onChange={(e) => onChange({ email: e.target.value })} 
                        placeholder="hello@example.com"
                        className="h-8 text-xs"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] text-muted-foreground">Phone Number</Label>
                    <Input 
                        value={content.phone || ""} 
                        onChange={(e) => onChange({ phone: e.target.value })} 
                        placeholder="+1 (555) 123-4567"
                        className="h-8 text-xs"
                    />
                </div>
            </div>

            {/* Location Fields (Specific to location-office but can be useful for others) */}
            <div className="space-y-2 pt-2 border-t">
                <Label className="text-xs font-bold">Location Details</Label>
                <div className="space-y-2">
                     <Label className="text-[10px] text-muted-foreground">Address</Label>
                     <Textarea 
                        value={content.address || ""} 
                        onChange={(e) => onChange({ address: e.target.value })} 
                        placeholder="123 Main St, City, Country"
                        className="text-xs min-h-[50px]"
                        rows={2}
                     />
                </div>
                <div className="space-y-2">
                     <Label className="text-[10px] text-muted-foreground">Map Embed URL (Optional)</Label>
                     <Input 
                        value={content.mapUrl || ""} 
                        onChange={(e) => onChange({ mapUrl: e.target.value })} 
                        placeholder="https://maps.google.com/..."
                        className="h-8 text-xs"
                     />
                </div>
                <div className="space-y-2">
                     <Label className="text-[10px] text-muted-foreground">Opening Hours</Label>
                     <Input 
                        value={content.hours || ""} 
                        onChange={(e) => onChange({ hours: e.target.value })} 
                        placeholder="Mon-Fri: 9am - 5pm"
                        className="h-8 text-xs"
                     />
                </div>
            </div>

            {/* Social Links Editor reuse */}
            <SocialLinksEditor 
                links={content.socialLinks} 
                onChange={(links) => onChange({ socialLinks: links })} 
            />

            {/* FAQ Editor (for support-focused layout) */}
            {layout === 'support-focused' && (
                <div className="space-y-3 border rounded-lg p-3 bg-muted/10 mt-4">
                     <div className="flex justify-between items-center">
                        <Label className="text-xs uppercase font-bold text-muted-foreground">Frequently Asked Questions</Label>
                        <Button onClick={addFaq} variant="outline" size="sm" className="h-6 text-[10px]">
                            <Plus className="h-3 w-3 mr-1" /> Add FAQ
                        </Button>
                     </div>
                     <div className="space-y-2">
                        {faqs.map((faq: any, index: number) => (
                            <div key={index} className="space-y-2 p-2 bg-background rounded border">
                                <div className="flex justify-between items-center">
                                    <Label className="text-[10px]">Q{index + 1}</Label>
                                    <button onClick={() => removeFaq(index)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                                <Input 
                                    value={faq.question} 
                                    onChange={(e) => updateFaq(index, 'question', e.target.value)} 
                                    placeholder="Question..."
                                    className="h-7 text-xs"
                                />
                                <Textarea 
                                    value={faq.answer} 
                                    onChange={(e) => updateFaq(index, 'answer', e.target.value)} 
                                    placeholder="Answer..."
                                    className="text-xs min-h-[40px]"
                                    rows={2}
                                />
                            </div>
                        ))}
                        {faqs.length === 0 && <p className="text-xs text-muted-foreground text-center">No FAQs added.</p>}
                     </div>
                </div>
            )}
        </div>
    );
};

// --- Privacy Policy Settings ---
const PrivacyPolicySettings = ({
    content,
    onChange,
}: {
    content: Record<string, any>;
    onChange: (c: Record<string, any>) => void;
}) => {
    const sections = content.sections || [];

    const updateSection = (index: number, field: string, value: string) => {
        const newSections = [...sections];
        newSections[index] = { ...newSections[index], [field]: value };
        onChange({ sections: newSections });
    };

    const addSection = () => {
        onChange({
            sections: [...sections, { title: "New Section", content: "Section content goes here..." }]
        });
    };

    const removeSection = (index: number) => {
        const newSections = [...sections];
        newSections.splice(index, 1);
        onChange({ sections: newSections });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Page Title</Label>
                    <Input 
                        value={content.title || ""} 
                        onChange={(e) => onChange({ title: e.target.value })}
                        placeholder="e.g. Privacy Policy"
                        className="h-8 text-xs"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Last Updated Date</Label>
                    <Input 
                        value={content.lastUpdated || ""} 
                        onChange={(e) => onChange({ lastUpdated: e.target.value })}
                        placeholder="e.g. January 1, 2024"
                        className="h-8 text-xs"
                    />
                </div>
            </div>

            <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Policy Sections</Label>
                    <Button variant="outline" size="sm" onClick={addSection} className="h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add Section
                    </Button>
                </div>

                <div className="space-y-4">
                    {sections.map((section: any, index: number) => (
                        <div key={index} className="bg-muted/30 p-3 rounded-lg space-y-2 relative group border">
                            <div className="flex justify-between items-center">
                                <Label className="text-[10px] text-muted-foreground">Section {index + 1}</Label>
                                <button 
                                    onClick={() => removeSection(index)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                            
                            <Input 
                                value={section.title}
                                onChange={(e) => updateSection(index, 'title', e.target.value)}
                                className="h-8 text-xs font-semibold"
                                placeholder="Section Title"
                            />
                            <Textarea 
                                value={section.content}
                                onChange={(e) => updateSection(index, 'content', e.target.value)}
                                className="text-xs min-h-[80px]"
                                placeholder="Section Content"
                                rows={4}
                            />
                        </div>
                    ))}
                    {sections.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-xs border-2 border-dashed rounded-lg">
                            No sections added. Click "Add Section" to start.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Team Settings ---
const TeamSettings = ({
    content,
    onChange,
}: {
    content: Record<string, any>;
    onChange: (c: Record<string, any>) => void;
}) => {
    const members = content.members || [];

    const updateMember = (index: number, field: string, value: string) => {
        const newMembers = [...members];
        newMembers[index] = { ...newMembers[index], [field]: value };
        onChange({ members: newMembers });
    };

    const updateSocial = (index: number, platform: string, value: string) => {
        const newMembers = [...members];
        const currentSocial = newMembers[index].social || {};
        newMembers[index] = { 
            ...newMembers[index], 
            social: { ...currentSocial, [platform]: value } 
        };
        onChange({ members: newMembers });
    };

    const addMember = () => {
        onChange({
            members: [...members, { name: "New Member", role: "Role", bio: "Bio...", image: "" }]
        });
    };

    const removeMember = (index: number) => {
        const newMembers = [...members];
        newMembers.splice(index, 1);
        onChange({ members: newMembers });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Section Title</Label>
                    <Input 
                        value={content.title || ""} 
                        onChange={(e) => onChange({ title: e.target.value })}
                        className="h-8 text-xs"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Subtitle</Label>
                    <Input 
                        value={content.subtitle || ""} 
                        onChange={(e) => onChange({ subtitle: e.target.value })}
                        className="h-8 text-xs"
                    />
                </div>
            </div>

            <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Members</Label>
                    <Button variant="outline" size="sm" onClick={addMember} className="h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                </div>

                <div className="space-y-4">
                    {members.map((member: any, index: number) => (
                        <div key={index} className="bg-muted/30 p-3 rounded-lg space-y-3 relative group border">
                            <div className="flex justify-between items-center">
                                <Label className="text-[10px] text-muted-foreground">Member {index + 1}</Label>
                                <button 
                                    onClick={() => removeMember(index)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded opacity-50 hover:opacity-100"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                                <Input 
                                    value={member.name}
                                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                                    className="h-8 text-xs font-semibold"
                                    placeholder="Name"
                                />
                                <Input 
                                    value={member.role}
                                    onChange={(e) => updateMember(index, 'role', e.target.value)}
                                    className="h-8 text-xs"
                                    placeholder="Role"
                                />
                            </div>
                            <Input 
                                value={member.image}
                                onChange={(e) => updateMember(index, 'image', e.target.value)}
                                className="h-8 text-xs font-mono text-[10px]"
                                placeholder="Image URL (https://...)"
                            />
                            <Textarea 
                                value={member.bio}
                                onChange={(e) => updateMember(index, 'bio', e.target.value)}
                                className="text-xs min-h-[60px]"
                                placeholder="Short Bio"
                            />
                            
                            <div className="space-y-1 pt-1">
                                <Label className="text-[10px] text-muted-foreground uppercase">Social Links</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <Input 
                                        value={member.social?.linkedin || ""}
                                        onChange={(e) => updateSocial(index, 'linkedin', e.target.value)}
                                        className="h-7 text-[10px]"
                                        placeholder="LinkedIn"
                                    />
                                    <Input 
                                        value={member.social?.twitter || ""}
                                        onChange={(e) => updateSocial(index, 'twitter', e.target.value)}
                                        className="h-7 text-[10px]"
                                        placeholder="Twitter"
                                    />
                                    <Input 
                                        value={member.social?.github || ""}
                                        onChange={(e) => updateSocial(index, 'github', e.target.value)}
                                        className="h-7 text-[10px]"
                                        placeholder="GitHub"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- FAQ Settings ---
const FaqSettings = ({
    content,
    onChange,
}: {
    content: Record<string, any>;
    onChange: (c: Record<string, any>) => void;
}) => {
    const questions = content.questions || [];

    const updateQuestion = (index: number, field: string, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        onChange({ questions: newQuestions });
    };

    const addQuestion = () => {
        onChange({
            questions: [...questions, { question: "New Question", answer: "Answer here..." }]
        });
    };

    const removeQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        onChange({ questions: newQuestions });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Section Title</Label>
                    <Input 
                        value={content.title || ""} 
                        onChange={(e) => onChange({ title: e.target.value })}
                        className="h-8 text-xs"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Subtitle</Label>
                    <Input 
                        value={content.subtitle || ""} 
                        onChange={(e) => onChange({ subtitle: e.target.value })}
                        className="h-8 text-xs"
                    />
                </div>
            </div>

            <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Questions</Label>
                    <Button variant="outline" size="sm" onClick={addQuestion} className="h-7 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                </div>

                <div className="space-y-4">
                    {questions.map((item: any, index: number) => (
                        <div key={index} className="bg-muted/30 p-3 rounded-lg space-y-3 relative group border">
                             <div className="flex justify-between items-center">
                                <Label className="text-[10px] text-muted-foreground">Question {index + 1}</Label>
                                <button 
                                    onClick={() => removeQuestion(index)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded opacity-50 hover:opacity-100"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                            <Input 
                                value={item.question}
                                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                className="h-8 text-xs font-semibold"
                                placeholder="Question"
                            />
                            <Textarea 
                                value={item.answer}
                                onChange={(e) => updateQuestion(index, 'answer', e.target.value)}
                                className="text-xs min-h-[60px]"
                                placeholder="Answer"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ModuleSettings = () => {
  const {
    pages,
    currentPageId,
    selectedModuleId,
    selectModule,
    updateModuleLayout,
    updateModuleContent,
    updateModuleVisibility,
    currentTheme,
  } = useWebsiteBuilderStore();

  // Get current page's modules
  const currentPage = pages.find((p) => p.id === currentPageId);
  const modules = currentPage?.modules || [];

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  if (!selectedModule) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed m-4">
        <p>Select a module to edit settings</p>
      </div>
    );
  }

  const availableLayouts = getAvailableLayouts(
    currentTheme,
    selectedModule.type
  );

  return (
    <div className="flex flex-col h-full bg-card border-l w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold text-lg">{selectedModule.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {selectedModule.type} Module
          </p>
        </div>
        <button
          onClick={() => selectModule(null)}
          className="p-2 hover:bg-muted rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Layout Selection */}
        <div className="space-y-3">
          <Label className="uppercase text-xs text-muted-foreground font-bold tracking-wider">
            Layout ({currentTheme})
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {availableLayouts.map((layout) => (
              <div
                key={layout}
                onClick={() => updateModuleLayout(selectedModuleId!, layout)}
                className={`
                  cursor-pointer rounded-lg border-2 p-3 text-center transition-all hover:border-primary/50
                  ${
                    selectedModule.layout === layout
                      ? "border-primary bg-primary/5 font-medium text-primary"
                      : "border-muted hover:bg-muted/50"
                  }
                `}
              >
                <div className="text-xs capitalize">
                  {layout.replace("-", " ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        {/* Content Controls */}
        <div className="space-y-4">
          <Label className="uppercase text-xs text-muted-foreground font-bold tracking-wider">
            Content
          </Label>

          {/* Common fields */}
          <div className="space-y-4">
            {["navbar", "footer"].includes(selectedModule.type) ? (
              <div className="space-y-3">
                <Label>Logo Type</Label>
                <RadioGroup
                  value={selectedModule.content.logoType || "text"}
                  onValueChange={(val) =>
                    updateModuleContent(selectedModule.id, { logoType: val })
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="logo-text" />
                    <Label htmlFor="logo-text" className="font-normal">
                      Text
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="logo-image" />
                    <Label htmlFor="logo-image" className="font-normal">
                      Image
                    </Label>
                  </div>
                </RadioGroup>

                {(selectedModule.content.logoType === "text" ||
                  !selectedModule.content.logoType) && (
                  <div className="space-y-2">
                    <Label htmlFor="logo-text-input">Logo Text</Label>
                    <Input
                      id="logo-text-input"
                      value={selectedModule.content.logoText || ""}
                      onChange={(e) =>
                        updateModuleContent(selectedModule.id, {
                          logoText: e.target.value,
                        })
                      }
                      placeholder="Enter brand name..."
                    />
                  </div>
                )}

                {selectedModule.content.logoType === "image" && (
                  <div className="space-y-2">
                    <Label>Logo Image</Label>
                    <div
                      className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition cursor-pointer relative overflow-hidden"
                      onClick={() =>
                        updateModuleContent(selectedModule.id, {
                          logoImage:
                            "https://via.placeholder.com/150x50?text=LOGO",
                        })
                      }
                    >
                      {selectedModule.content.logoImage ? (
                        <>
                          <img
                            src={selectedModule.content.logoImage}
                            alt="Logo"
                            className="h-10 object-contain mb-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            Click to change
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-medium text-primary">
                            Upload Logo
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            Recommended: 150x50px
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="title-input">Heading / Title</Label>
                <Input
                  id="title-input"
                  value={selectedModule.content.title || ""}
                  onChange={(e) =>
                    updateModuleContent(selectedModule.id, {
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter module title..."
                />
              </div>
            )}
          </div>

          {selectedModule.type !== "navbar" && selectedModule.type !== "hero" && (
            <div className="space-y-2">
              <Label htmlFor="desc-input">Description</Label>
              <Textarea 
                id="desc-input" 
                value={selectedModule.content.description || ""} 
                onChange={(e) =>
                  updateModuleContent(selectedModule.id, {
                    description: e.target.value,
                  })
                }
                placeholder="Enter short description..."
                rows={3}
              />
            </div>
          )}

          {/* HERO SETTINGS */}
          {selectedModule.type === 'hero' && (
              <HeroSettings 
                 content={selectedModule.content}
                 onChange={(updates) => updateModuleContent(selectedModule.id, updates)}
                 layout={selectedModule.layout}
              />
          )}

          {/* FOOTER: SOCIAL LINKS */}
          {selectedModule.type === 'footer' && (
              <SocialLinksEditor 
                  links={selectedModule.content.socialLinks} 
                  onChange={(links) => updateModuleContent(selectedModule.id, { socialLinks: links })} 
              />
          )}

          {/* NAVBAR/FOOTER: MENU EDITOR */}
          {['navbar', 'footer'].includes(selectedModule.type) && (
              <MenuEditor 
                  menuItems={selectedModule.content.menuItems} 
                  onChange={(items) => updateModuleContent(selectedModule.id, { menuItems: items })} 
              />
          )}
          
          {/* COMMUNITIES: COMMUNITY EDITOR */}
          {selectedModule.type === 'communities' && (
              <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Communities</Label>
                  
                  {[1,2,3,4,5,6].map((i) => {
                      const community = (selectedModule.content.communities || [])[i-1] || {};
                      
                      return (
                          <div key={i} className="space-y-2 p-3 bg-background rounded border">
                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-bold">Community {i}</span>
                              </div>
                              
                              <div className="space-y-2">
                                  <div>
                                      <Label className="text-[10px] text-muted-foreground">Name</Label>
                                      <Input 
                                          value={community.name || ""} 
                                          onChange={(e) => {
                                              const communities = [...(selectedModule.content.communities || [])];
                                              communities[i-1] = { ...communities[i-1], name: e.target.value };
                                              updateModuleContent(selectedModule.id, { communities });
                                          }} 
                                          placeholder={`Community ${i}`}
                                          className="h-8 text-xs"
                                      />
                                  </div>
                                  
                                  <div>
                                      <Label className="text-[10px] text-muted-foreground">Description</Label>
                                      <Input 
                                          value={community.description || ""} 
                                          onChange={(e) => {
                                              const communities = [...(selectedModule.content.communities || [])];
                                              communities[i-1] = { ...communities[i-1], description: e.target.value };
                                              updateModuleContent(selectedModule.id, { communities });
                                          }} 
                                          placeholder="Community description"
                                          className="h-8 text-xs"
                                      />
                                  </div>
                                  
                                  <div>
                                     <Label className="text-[10px] text-muted-foreground">Image URL</Label>
                                     <div className="flex gap-2">
                                         <Input 
                                             value={community.image || ""} 
                                             onChange={(e) => {
                                                 const communities = [...(selectedModule.content.communities || [])];
                                                 communities[i-1] = { ...communities[i-1], image: e.target.value };
                                                 updateModuleContent(selectedModule.id, { communities });
                                             }} 
                                             placeholder="https://images.unsplash.com/..."
                                             className="h-8 text-xs flex-1"
                                         />
                                         <label className="cursor-pointer">
                                             <input 
                                                 type="file" 
                                                 accept="image/*" 
                                                 className="hidden"
                                                 onChange={(e) => {
                                                     const file = e.target.files?.[0];
                                                     if (file) {
                                                         // Create a local URL for the image
                                                         const imageUrl = URL.createObjectURL(file);
                                                         const communities = [...(selectedModule.content.communities || [])];
                                                         communities[i-1] = { ...communities[i-1], image: imageUrl };
                                                         updateModuleContent(selectedModule.id, { communities });
                                                     }
                                                 }}
                                             />
                                             <Button type="button" variant="outline" size="sm" className="h-8 px-3">
                                                 Upload
                                             </Button>
                                         </label>
                                     </div>
                                 </div>
                              </div>
                          </div>
                      );
                  })}
                  
                  <p className="text-[10px] text-muted-foreground">Leave fields empty to use defaults</p>
              </div>
          )}
          
          {/* CEO MESSAGE: MESSAGE EDITOR */}
          {selectedModule.type === 'ceo-message' && (
              <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
                  <div className="flex justify-between items-center">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Messages</Label>
                      <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                              const messages = [...(selectedModule.content.messages || [])];
                              messages.push({ name: "", designation: "", message: "", image: "", signature: "" });
                              updateModuleContent(selectedModule.id, { messages });
                          }}
                          className="h-7 text-xs"
                      >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Message
                      </Button>
                  </div>
                  
                  {(selectedModule.content.messages || []).map((message: any, index: number) => (
                      <div key={index} className="space-y-2 p-3 bg-background rounded border">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold">Message {index + 1}</span>
                              <button 
                                  onClick={() => {
                                      const messages = [...(selectedModule.content.messages || [])];
                                      messages.splice(index, 1);
                                      updateModuleContent(selectedModule.id, { messages });
                                  }}
                                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                              >
                                  <Trash2 className="h-3 w-3" />
                              </button>
                          </div>
                          
                          <div className="space-y-2">
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Name</Label>
                                  <Input 
                                      value={message.name || ""} 
                                      onChange={(e) => {
                                          const messages = [...(selectedModule.content.messages || [])];
                                          messages[index] = { ...messages[index], name: e.target.value };
                                          updateModuleContent(selectedModule.id, { messages });
                                      }} 
                                      placeholder="CEO Name"
                                      className="h-8 text-xs"
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Designation</Label>
                                  <Input 
                                      value={message.designation || ""} 
                                      onChange={(e) => {
                                          const messages = [...(selectedModule.content.messages || [])];
                                          messages[index] = { ...messages[index], designation: e.target.value };
                                          updateModuleContent(selectedModule.id, { messages });
                                      }} 
                                      placeholder="Chief Executive Officer"
                                      className="h-8 text-xs"
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Message</Label>
                                  <Textarea 
                                      value={message.message || ""} 
                                      onChange={(e) => {
                                          const messages = [...(selectedModule.content.messages || [])];
                                          messages[index] = { ...messages[index], message: e.target.value };
                                          updateModuleContent(selectedModule.id, { messages });
                                      }} 
                                      placeholder="Enter message content..."
                                      className="text-xs min-h-[80px]"
                                      rows={4}
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">CEO Image</Label>
                                  <div className="flex gap-2">
                                      <Input 
                                          value={message.image || ""} 
                                          onChange={(e) => {
                                              const messages = [...(selectedModule.content.messages || [])];
                                              messages[index] = { ...messages[index], image: e.target.value };
                                              updateModuleContent(selectedModule.id, { messages });
                                          }} 
                                          placeholder="https://images.unsplash.com/..."
                                          className="h-8 text-xs flex-1"
                                      />
                                      <label className="cursor-pointer">
                                          <input 
                                              type="file" 
                                              accept="image/*" 
                                              className="hidden"
                                              onChange={(e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                      const imageUrl = URL.createObjectURL(file);
                                                      const messages = [...(selectedModule.content.messages || [])];
                                                      messages[index] = { ...messages[index], image: imageUrl };
                                                      updateModuleContent(selectedModule.id, { messages });
                                                  }
                                              }}
                                          />
                                          <Button type="button" variant="outline" size="sm" className="h-8 px-3">
                                              Upload
                                          </Button>
                                      </label>
                                  </div>
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Signature (Optional)</Label>
                                  <div className="flex gap-2">
                                      <Input 
                                          value={message.signature || ""} 
                                          onChange={(e) => {
                                              const messages = [...(selectedModule.content.messages || [])];
                                              messages[index] = { ...messages[index], signature: e.target.value };
                                              updateModuleContent(selectedModule.id, { messages });
                                          }} 
                                          placeholder="https://..."
                                          className="h-8 text-xs flex-1"
                                      />
                                      <label className="cursor-pointer">
                                          <input 
                                              type="file" 
                                              accept="image/*" 
                                              className="hidden"
                                              onChange={(e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                      const imageUrl = URL.createObjectURL(file);
                                                      const messages = [...(selectedModule.content.messages || [])];
                                                      messages[index] = { ...messages[index], signature: imageUrl };
                                                      updateModuleContent(selectedModule.id, { messages });
                                                  }
                                              }}
                                          />
                                          <Button type="button" variant="outline" size="sm" className="h-8 px-3">
                                              Upload
                                          </Button>
                                      </label>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
                  
                  {(selectedModule.content.messages || []).length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No messages yet. Click "Add Message" to create one.</p>
                  )}
              </div>
          )}

          {/* TESTIMONIALS: TESTIMONIAL EDITOR */}
          {selectedModule.type === 'testimonials' && (
              <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
                  <div className="flex justify-between items-center">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Testimonials</Label>
                      <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                              const testimonials = [...(selectedModule.content.testimonials || [])];
                              testimonials.push({ name: "", role: "", company: "", testimonial: "", image: "", rating: 5 });
                              updateModuleContent(selectedModule.id, { testimonials });
                          }}
                          className="h-7 text-xs"
                      >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Testimonial
                      </Button>
                  </div>
                  
                  {(selectedModule.content.testimonials || []).map((testimonial: any, index: number) => (
                      <div key={index} className="space-y-2 p-3 bg-background rounded border">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold">Testimonial {index + 1}</span>
                              <button 
                                  onClick={() => {
                                      const testimonials = [...(selectedModule.content.testimonials || [])];
                                      testimonials.splice(index, 1);
                                      updateModuleContent(selectedModule.id, { testimonials });
                                  }}
                                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                              >
                                  <Trash2 className="h-3 w-3" />
                              </button>
                          </div>
                          
                          <div className="space-y-2">
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Name</Label>
                                  <Input 
                                      value={testimonial.name || ""} 
                                      onChange={(e) => {
                                          const testimonials = [...(selectedModule.content.testimonials || [])];
                                          testimonials[index] = { ...testimonials[index], name: e.target.value };
                                          updateModuleContent(selectedModule.id, { testimonials });
                                      }} 
                                      placeholder="Customer Name"
                                      className="h-8 text-xs"
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Role/Position</Label>
                                  <Input 
                                      value={testimonial.role || ""} 
                                      onChange={(e) => {
                                          const testimonials = [...(selectedModule.content.testimonials || [])];
                                          testimonials[index] = { ...testimonials[index], role: e.target.value };
                                          updateModuleContent(selectedModule.id, { testimonials });
                                      }} 
                                      placeholder="CEO, Manager, etc."
                                      className="h-8 text-xs"
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Company (Optional)</Label>
                                  <Input 
                                      value={testimonial.company || ""} 
                                      onChange={(e) => {
                                          const testimonials = [...(selectedModule.content.testimonials || [])];
                                          testimonials[index] = { ...testimonials[index], company: e.target.value };
                                          updateModuleContent(selectedModule.id, { testimonials });
                                      }} 
                                      placeholder="Company Name"
                                      className="h-8 text-xs"
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Testimonial</Label>
                                  <Textarea 
                                      value={testimonial.testimonial || ""} 
                                      onChange={(e) => {
                                          const testimonials = [...(selectedModule.content.testimonials || [])];
                                          testimonials[index] = { ...testimonials[index], testimonial: e.target.value };
                                          updateModuleContent(selectedModule.id, { testimonials });
                                      }} 
                                      placeholder="Enter testimonial text..."
                                      className="text-xs min-h-[60px]"
                                      rows={3}
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Customer Image</Label>
                                  <div className="flex gap-2">
                                      <Input 
                                          value={testimonial.image || ""} 
                                          onChange={(e) => {
                                              const testimonials = [...(selectedModule.content.testimonials || [])];
                                              testimonials[index] = { ...testimonials[index], image: e.target.value };
                                              updateModuleContent(selectedModule.id, { testimonials });
                                          }} 
                                          placeholder="https://..."
                                          className="h-8 text-xs flex-1"
                                      />
                                      <label className="cursor-pointer">
                                          <input 
                                              type="file" 
                                              accept="image/*" 
                                              className="hidden"
                                              onChange={(e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                      const imageUrl = URL.createObjectURL(file);
                                                      const testimonials = [...(selectedModule.content.testimonials || [])];
                                                      testimonials[index] = { ...testimonials[index], image: imageUrl };
                                                      updateModuleContent(selectedModule.id, { testimonials });
                                                  }
                                              }}
                                          />
                                          <Button type="button" variant="outline" size="sm" className="h-8 px-3">
                                              Upload
                                          </Button>
                                      </label>
                                  </div>
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Rating</Label>
                                  <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                          <button
                                              key={star}
                                              type="button"
                                              onClick={() => {
                                                  const testimonials = [...(selectedModule.content.testimonials || [])];
                                                  testimonials[index] = { ...testimonials[index], rating: star };
                                                  updateModuleContent(selectedModule.id, { testimonials });
                                              }}
                                              className={cn(
                                                  "text-2xl transition-colors",
                                                  star <= (testimonial.rating || 0) ? "text-yellow-500" : "text-gray-300"
                                              )}
                                          >
                                              ★
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
                  
                  {(selectedModule.content.testimonials || []).length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No testimonials yet. Click "Add Testimonial" to create one.</p>
                  )}
              </div>
          )}

          {/* JOBS: JOB EDITOR */}
          {selectedModule.type === 'jobs' && (
              <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
                  <div className="flex justify-between items-center">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Job Listings</Label>
                      <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                              const jobs = [...(selectedModule.content.jobs || [])];
                              jobs.push({ title: "", company: "", location: "", type: "Full-time", salary: "", description: "", logo: "", tags: [] });
                              updateModuleContent(selectedModule.id, { jobs });
                          }}
                          className="h-7 text-xs"
                      >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Job
                      </Button>
                  </div>
                  
                  {(selectedModule.content.jobs || []).map((job: any, index: number) => (
                      <div key={index} className="space-y-2 p-3 bg-background rounded border">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold">Job {index + 1}</span>
                              <button 
                                  onClick={() => {
                                      const jobs = [...(selectedModule.content.jobs || [])];
                                      jobs.splice(index, 1);
                                      updateModuleContent(selectedModule.id, { jobs });
                                  }}
                                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                              >
                                  <Trash2 className="h-3 w-3" />
                              </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Job Title</Label>
                                  <Input 
                                      value={job.title || ""} 
                                      onChange={(e) => {
                                          const jobs = [...(selectedModule.content.jobs || [])];
                                          jobs[index] = { ...jobs[index], title: e.target.value };
                                          updateModuleContent(selectedModule.id, { jobs });
                                      }} 
                                      placeholder="Software Engineer"
                                      className="h-8 text-xs"
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Company</Label>
                                  <Input 
                                      value={job.company || ""} 
                                      onChange={(e) => {
                                          const jobs = [...(selectedModule.content.jobs || [])];
                                          jobs[index] = { ...jobs[index], company: e.target.value };
                                          updateModuleContent(selectedModule.id, { jobs });
                                      }} 
                                      placeholder="Company Name"
                                      className="h-8 text-xs"
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Location</Label>
                                  <Input 
                                      value={job.location || ""} 
                                      onChange={(e) => {
                                          const jobs = [...(selectedModule.content.jobs || [])];
                                          jobs[index] = { ...jobs[index], location: e.target.value };
                                          updateModuleContent(selectedModule.id, { jobs });
                                      }} 
                                      placeholder="Remote / City"
                                      className="h-8 text-xs"
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Job Type</Label>
                                  <Input 
                                      value={job.type || ""} 
                                      onChange={(e) => {
                                          const jobs = [...(selectedModule.content.jobs || [])];
                                          jobs[index] = { ...jobs[index], type: e.target.value };
                                          updateModuleContent(selectedModule.id, { jobs });
                                      }} 
                                      placeholder="Full-time"
                                      className="h-8 text-xs"
                                  />
                              </div>
                          </div>
                          
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Salary (Optional)</Label>
                              <Input 
                                  value={job.salary || ""} 
                                  onChange={(e) => {
                                      const jobs = [...(selectedModule.content.jobs || [])];
                                      jobs[index] = { ...jobs[index], salary: e.target.value };
                                      updateModuleContent(selectedModule.id, { jobs });
                                  }} 
                                  placeholder="$80k - $120k"
                                  className="h-8 text-xs"
                              />
                          </div>
                          
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Description</Label>
                              <Textarea 
                                  value={job.description || ""} 
                                  onChange={(e) => {
                                      const jobs = [...(selectedModule.content.jobs || [])];
                                      jobs[index] = { ...jobs[index], description: e.target.value };
                                      updateModuleContent(selectedModule.id, { jobs });
                                  }} 
                                  placeholder="Job description..."
                                  className="text-xs min-h-[50px]"
                                  rows={2}
                              />
                          </div>
                          
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Company Logo</Label>
                              <div className="flex gap-2">
                                  <Input 
                                      value={job.logo || ""} 
                                      onChange={(e) => {
                                          const jobs = [...(selectedModule.content.jobs || [])];
                                          jobs[index] = { ...jobs[index], logo: e.target.value };
                                          updateModuleContent(selectedModule.id, { jobs });
                                      }} 
                                      placeholder="https://..."
                                      className="h-8 text-xs flex-1"
                                  />
                                  <label className="cursor-pointer">
                                      <input 
                                          type="file" 
                                          accept="image/*" 
                                          className="hidden"
                                          onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                  const imageUrl = URL.createObjectURL(file);
                                                  const jobs = [...(selectedModule.content.jobs || [])];
                                                  jobs[index] = { ...jobs[index], logo: imageUrl };
                                                  updateModuleContent(selectedModule.id, { jobs });
                                              }
                                          }}
                                      />
                                      <Button type="button" variant="outline" size="sm" className="h-8 px-3">
                                          Upload
                                      </Button>
                                  </label>
                              </div>
                          </div>
                          
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Tags (comma-separated)</Label>
                              <Input 
                                  value={(job.tags || []).join(", ")} 
                                  onChange={(e) => {
                                      const jobs = [...(selectedModule.content.jobs || [])];
                                      jobs[index] = { ...jobs[index], tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) };
                                      updateModuleContent(selectedModule.id, { jobs });
                                  }} 
                                  placeholder="React, TypeScript, Node.js"
                                  className="h-8 text-xs"
                              />
                          </div>
                      </div>
                  ))}
                  
                  {(selectedModule.content.jobs || []).length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No jobs yet. Click "Add Job" to create one.</p>
                  )}
              </div>
          )}

          {/* MARKETPLACE: PRODUCT EDITOR */}
          {selectedModule.type === 'marketplace' && (
              <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
                  <div className="flex justify-between items-center">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Products</Label>
                      <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                              const products = [...(selectedModule.content.products || [])];
                              products.push({ name: "", price: "", description: "", image: "", category: "", seller: "", rating: 5 });
                              updateModuleContent(selectedModule.id, { products });
                          }}
                          className="h-7 text-xs"
                      >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Product
                      </Button>
                  </div>
                  
                  {(selectedModule.content.products || []).map((product: any, index: number) => (
                      <div key={index} className="space-y-2 p-3 bg-background rounded border">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold">Product {index + 1}</span>
                              <button 
                                  onClick={() => {
                                      const products = [...(selectedModule.content.products || [])];
                                      products.splice(index, 1);
                                      updateModuleContent(selectedModule.id, { products });
                                  }}
                                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                              >
                                  <Trash2 className="h-3 w-3" />
                              </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Product Name</Label>
                                  <Input 
                                      value={product.name || ""} 
                                      onChange={(e) => {
                                          const products = [...(selectedModule.content.products || [])];
                                          products[index] = { ...products[index], name: e.target.value };
                                          updateModuleContent(selectedModule.id, { products });
                                      }} 
                                      placeholder="Product Name"
                                      className="h-8 text-xs"
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Price</Label>
                                  <Input 
                                      value={product.price || ""} 
                                      onChange={(e) => {
                                          const products = [...(selectedModule.content.products || [])];
                                          products[index] = { ...products[index], price: e.target.value };
                                          updateModuleContent(selectedModule.id, { products });
                                      }} 
                                      placeholder="99.99"
                                      className="h-8 text-xs"
                                      type="number"
                                      step="0.01"
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Category</Label>
                                  <Input 
                                      value={product.category || ""} 
                                      onChange={(e) => {
                                          const products = [...(selectedModule.content.products || [])];
                                          products[index] = { ...products[index], category: e.target.value };
                                          updateModuleContent(selectedModule.id, { products });
                                      }} 
                                      placeholder="Electronics"
                                      className="h-8 text-xs"
                                  />
                              </div>
                              
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Seller (Optional)</Label>
                                  <Input 
                                      value={product.seller || ""} 
                                      onChange={(e) => {
                                          const products = [...(selectedModule.content.products || [])];
                                          products[index] = { ...products[index], seller: e.target.value };
                                          updateModuleContent(selectedModule.id, { products });
                                      }} 
                                      placeholder="Seller Name"
                                      className="h-8 text-xs"
                                  />
                              </div>
                          </div>
                          
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Description</Label>
                              <Textarea 
                                  value={product.description || ""} 
                                  onChange={(e) => {
                                      const products = [...(selectedModule.content.products || [])];
                                      products[index] = { ...products[index], description: e.target.value };
                                      updateModuleContent(selectedModule.id, { products });
                                  }} 
                                  placeholder="Product description..."
                                  className="text-xs min-h-[50px]"
                                  rows={2}
                              />
                          </div>
                          
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Product Image</Label>
                              <div className="flex gap-2">
                                  <Input 
                                      value={product.image || ""} 
                                      onChange={(e) => {
                                          const products = [...(selectedModule.content.products || [])];
                                          products[index] = { ...products[index], image: e.target.value };
                                          updateModuleContent(selectedModule.id, { products });
                                      }} 
                                      placeholder="https://..."
                                      className="h-8 text-xs flex-1"
                                  />
                                  <label className="cursor-pointer">
                                      <input 
                                          type="file" 
                                          accept="image/*" 
                                          className="hidden"
                                          onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                  const imageUrl = URL.createObjectURL(file);
                                                  const products = [...(selectedModule.content.products || [])];
                                                  products[index] = { ...products[index], image: imageUrl };
                                                  updateModuleContent(selectedModule.id, { products });
                                              }
                                          }}
                                      />
                                      <Button type="button" variant="outline" size="sm" className="h-8 px-3">
                                          Upload
                                      </Button>
                                  </label>
                              </div>
                          </div>
                          
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Rating</Label>
                              <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                          key={star}
                                          type="button"
                                          onClick={() => {
                                              const products = [...(selectedModule.content.products || [])];
                                              products[index] = { ...products[index], rating: star };
                                              updateModuleContent(selectedModule.id, { products });
                                          }}
                                          className={cn(
                                              "text-2xl transition-colors",
                                              star <= (product.rating || 0) ? "text-yellow-500" : "text-gray-300"
                                          )}
                                      >
                                          ★
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>
                  ))}
                  
                  {(selectedModule.content.products || []).length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-4">No products yet. Click "Add Product" to create one.</p>
                  )}
              </div>
          )}

          {/* CONTACT: CONTACT SETTINGS */}
          {selectedModule.type === 'contact' && (
              <ContactSettings 
                  content={selectedModule.content}
                  onChange={(updates) => updateModuleContent(selectedModule.id, updates)}
                  layout={selectedModule.layout}
              />
          )}

          {/* PRIVACY POLICY: PRIVACY POLICY SETTINGS */}
          {selectedModule.type === 'privacy-policy' && (
              <PrivacyPolicySettings 
                  content={selectedModule.content}
                  onChange={(updates) => updateModuleContent(selectedModule.id, updates)}
              />
          )}

          {/* TEAM MEMBERS: TEAM SETTINGS */}
          {selectedModule.type === 'team-members' && (
              <TeamSettings 
                  content={selectedModule.content}
                  onChange={(updates) => updateModuleContent(selectedModule.id, updates)}
              />
          )}

          {/* TERMS & CONDITIONS: REUSING PRIVACY SETTINGS (Structure is identical) */}
          {selectedModule.type === 'terms-conditions' && (
              <PrivacyPolicySettings 
                  content={selectedModule.content}
                  onChange={(updates) => updateModuleContent(selectedModule.id, updates)}
              />
          )}

          {/* FAQ: FAQ SETTINGS */}
          {selectedModule.type === 'faq' && (
              <FaqSettings 
                  content={selectedModule.content}
                  onChange={(updates) => updateModuleContent(selectedModule.id, updates)}
              />
          )}

          {/* ABOUT: CONTENT EDITOR */}
          {selectedModule.type === 'about' && (
              <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">About Page Content</Label>
                  <p className="text-[10px] text-muted-foreground">Customize content based on selected layout</p>
                  
                  {/* Common Fields */}
                  <div className="space-y-2">
                      <div>
                          <Label className="text-[10px] text-muted-foreground">Title</Label>
                          <Input 
                              value={selectedModule.content.title || ""} 
                              onChange={(e) => updateModuleContent(selectedModule.id, { title: e.target.value })} 
                              placeholder="Our Story / About Us"
                              className="h-8 text-xs"
                          />
                      </div>
                      
                      <div>
                          <Label className="text-[10px] text-muted-foreground">Subtitle / Description</Label>
                          <Textarea 
                              value={selectedModule.content.subtitle || selectedModule.content.description || ""} 
                              onChange={(e) => updateModuleContent(selectedModule.id, { 
                                  subtitle: e.target.value,
                                  description: e.target.value 
                              })} 
                              placeholder="Brief description..."
                              className="text-xs min-h-[50px]"
                              rows={2}
                          />
                      </div>
                  </div>

                  {/* Layout-Specific Fields */}
                  {selectedModule.layout === 'story-vision' && (
                      <div className="space-y-2 pt-2 border-t">
                          <Label className="text-xs font-bold">Story & Vision Fields</Label>
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Story Text</Label>
                              <Textarea 
                                  value={selectedModule.content.story || ""} 
                                  onChange={(e) => updateModuleContent(selectedModule.id, { story: e.target.value })} 
                                  placeholder="Our journey began..."
                                  className="text-xs min-h-[60px]"
                                  rows={3}
                              />
                          </div>
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Vision Statement</Label>
                              <Textarea 
                                  value={selectedModule.content.vision || ""} 
                                  onChange={(e) => updateModuleContent(selectedModule.id, { vision: e.target.value })} 
                                  placeholder="To create a world where..."
                                  className="text-xs min-h-[50px]"
                                  rows={2}
                              />
                          </div>
                          
                          {/* Milestones Editor */}
                          <div className="pt-2 border-t">
                              <div className="flex justify-between items-center mb-2">
                                  <Label className="text-xs font-bold">Journey Milestones</Label>
                                  <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => {
                                          const milestones = selectedModule.content.milestones || [];
                                          updateModuleContent(selectedModule.id, {
                                              milestones: [...milestones, { year: "2024", event: "New Milestone" }]
                                          });
                                      }}
                                      className="h-6 text-[10px]"
                                  >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Milestone
                                  </Button>
                              </div>
                              
                              <div className="space-y-2">
                                  {(selectedModule.content.milestones || []).map((milestone: any, index: number) => (
                                      <div key={index} className="border rounded p-2 bg-muted/5">
                                          <div className="flex justify-between items-start mb-2">
                                              <Label className="text-[9px] text-muted-foreground">Milestone {index + 1}</Label>
                                              <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => {
                                                      const milestones = [...(selectedModule.content.milestones || [])];
                                                      milestones.splice(index, 1);
                                                      updateModuleContent(selectedModule.id, { milestones });
                                                  }}
                                                  className="h-5 w-5 p-0 hover:bg-destructive/10"
                                              >
                                                  <Trash2 className="h-3 w-3 text-destructive" />
                                              </Button>
                                          </div>
                                          <div className="grid grid-cols-3 gap-2">
                                              <div>
                                                  <Label className="text-[9px] text-muted-foreground">Year</Label>
                                                  <Input 
                                                      value={milestone.year || ""} 
                                                      onChange={(e) => {
                                                          const milestones = [...(selectedModule.content.milestones || [])];
                                                          milestones[index] = { ...milestone, year: e.target.value };
                                                          updateModuleContent(selectedModule.id, { milestones });
                                                      }}
                                                      placeholder="2024"
                                                      className="h-7 text-xs"
                                                  />
                                              </div>
                                              <div className="col-span-2">
                                                  <Label className="text-[9px] text-muted-foreground">Event</Label>
                                                  <Input 
                                                      value={milestone.event || ""} 
                                                      onChange={(e) => {
                                                          const milestones = [...(selectedModule.content.milestones || [])];
                                                          milestones[index] = { ...milestone, event: e.target.value };
                                                          updateModuleContent(selectedModule.id, { milestones });
                                                      }}
                                                      placeholder="Founded"
                                                      className="h-7 text-xs"
                                                  />
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                                  
                                  {(selectedModule.content.milestones || []).length === 0 && (
                                      <p className="text-xs text-muted-foreground text-center py-2">No milestones yet. Click "Add Milestone" to create one.</p>
                                  )}
                              </div>
                          </div>
                      </div>
                  )}

                  {selectedModule.layout === 'mission-values' && (
                      <div className="space-y-2 pt-2 border-t">
                          <Label className="text-xs font-bold">Mission & Values</Label>
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Mission Statement</Label>
                              <Textarea 
                                  value={selectedModule.content.mission || ""} 
                                  onChange={(e) => updateModuleContent(selectedModule.id, { mission: e.target.value })} 
                                  placeholder="Empowering communities to..."
                                  className="text-xs min-h-[50px]"
                                  rows={2}
                              />
                          </div>
                          
                          {/* Core Values Editor */}
                          <div className="pt-2 border-t">
                              <div className="flex justify-between items-center mb-2">
                                  <Label className="text-xs font-bold">Core Values</Label>
                                  <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => {
                                          const values = selectedModule.content.values || [];
                                          updateModuleContent(selectedModule.id, {
                                              values: [...values, { icon: "Heart", title: "New Value", description: "Description here" }]
                                          });
                                      }}
                                      className="h-6 text-[10px]"
                                  >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add Value
                                  </Button>
                              </div>
                              
                              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                  {(selectedModule.content.values || []).map((value: any, index: number) => (
                                      <div key={index} className="border rounded p-2 bg-muted/5">
                                          <div className="flex justify-between items-start mb-2">
                                              <Label className="text-[9px] text-muted-foreground">Value {index + 1}</Label>
                                              <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => {
                                                      const values = [...(selectedModule.content.values || [])];
                                                      values.splice(index, 1);
                                                      updateModuleContent(selectedModule.id, { values });
                                                  }}
                                                  className="h-5 w-5 p-0 hover:bg-destructive/10"
                                              >
                                                  <Trash2 className="h-3 w-3 text-destructive" />
                                              </Button>
                                          </div>
                                          <div className="space-y-2">
                                              <div className="grid grid-cols-2 gap-2">
                                                  <div>
                                                      <Label className="text-[9px] text-muted-foreground">Icon</Label>
                                                      <Input 
                                                          value={value.icon || ""} 
                                                          onChange={(e) => {
                                                              const values = [...(selectedModule.content.values || [])];
                                                              values[index] = { ...value, icon: e.target.value };
                                                              updateModuleContent(selectedModule.id, { values });
                                                          }}
                                                          placeholder="Heart"
                                                          className="h-7 text-xs"
                                                      />
                                                  </div>
                                                  <div>
                                                      <Label className="text-[9px] text-muted-foreground">Title</Label>
                                                      <Input 
                                                          value={value.title || ""} 
                                                          onChange={(e) => {
                                                              const values = [...(selectedModule.content.values || [])];
                                                              values[index] = { ...value, title: e.target.value };
                                                              updateModuleContent(selectedModule.id, { values });
                                                          }}
                                                          placeholder="Community First"
                                                          className="h-7 text-xs"
                                                      />
                                                  </div>
                                              </div>
                                              <div>
                                                  <Label className="text-[9px] text-muted-foreground">Description</Label>
                                                  <Textarea 
                                                      value={value.description || ""} 
                                                      onChange={(e) => {
                                                          const values = [...(selectedModule.content.values || [])];
                                                          values[index] = { ...value, description: e.target.value };
                                                          updateModuleContent(selectedModule.id, { values });
                                                      }}
                                                      placeholder="We put our members at the center..."
                                                      className="text-xs min-h-[40px]"
                                                      rows={2}
                                                  />
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                                  
                                  {(selectedModule.content.values || []).length === 0 && (
                                      <p className="text-xs text-muted-foreground text-center py-2">No values yet. Click "Add Value" to create one.</p>
                                  )}
                              </div>
                          </div>
                      </div>
                  )}

                  {selectedModule.layout === 'founder-message' && (
                      <div className="space-y-2 pt-2 border-t">
                          <Label className="text-xs font-bold">Founder Details</Label>
                          <div className="grid grid-cols-2 gap-2">
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Founder Name</Label>
                                  <Input 
                                      value={selectedModule.content.founderName || ""} 
                                      onChange={(e) => updateModuleContent(selectedModule.id, { founderName: e.target.value })} 
                                      placeholder="John Doe"
                                      className="h-8 text-xs"
                                  />
                              </div>
                              <div>
                                  <Label className="text-[10px] text-muted-foreground">Title</Label>
                                  <Input 
                                      value={selectedModule.content.founderTitle || ""} 
                                      onChange={(e) => updateModuleContent(selectedModule.id, { founderTitle: e.target.value })} 
                                      placeholder="Founder & CEO"
                                      className="h-8 text-xs"
                                  />
                              </div>
                          </div>
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Message</Label>
                              <Textarea 
                                  value={selectedModule.content.message || ""} 
                                  onChange={(e) => updateModuleContent(selectedModule.id, { message: e.target.value })} 
                                  placeholder="When we started this journey..."
                                  className="text-xs min-h-[80px]"
                                  rows={4}
                              />
                          </div>
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Founder Image URL</Label>
                              <Input 
                                  value={selectedModule.content.founderImage || ""} 
                                  onChange={(e) => updateModuleContent(selectedModule.id, { founderImage: e.target.value })} 
                                  placeholder="https://..."
                                  className="h-8 text-xs"
                              />
                          </div>
                      </div>
                  )}

                  {selectedModule.layout === 'simple-overview' && (
                      <div className="space-y-2 pt-2 border-t">
                          <Label className="text-xs font-bold">Overview Content</Label>
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Introduction</Label>
                              <Textarea 
                                  value={selectedModule.content.intro || ""} 
                                  onChange={(e) => updateModuleContent(selectedModule.id, { intro: e.target.value })} 
                                  placeholder="Founded in 2020, we've been dedicated to..."
                                  className="text-xs min-h-[60px]"
                                  rows={3}
                              />
                          </div>
                          <div>
                              <Label className="text-[10px] text-muted-foreground">CTA Text</Label>
                              <Input 
                                  value={selectedModule.content.ctaText || ""} 
                                  onChange={(e) => updateModuleContent(selectedModule.id, { ctaText: e.target.value })} 
                                  placeholder="Start building your community today"
                                  className="h-8 text-xs"
                              />
                          </div>
                      </div>
                  )}

                  {selectedModule.layout === 'impact-growth' && (
                      <div className="space-y-2 pt-2 border-t">
                          <Label className="text-xs font-bold">Impact & Growth Content</Label>
                          <div>
                              <Label className="text-[10px] text-muted-foreground">Subtitle</Label>
                              <Input 
                                  value={selectedModule.content.subtitle || ""} 
                                  onChange={(e) => updateModuleContent(selectedModule.id, { subtitle: e.target.value })} 
                                  placeholder="Measuring success through community growth"
                                  className="h-8 text-xs"
                              />
                          </div>
                          <div className="pt-2">
                              <Label className="text-[10px] text-muted-foreground mb-2 block">Key Stats (4 stats displayed)</Label>
                              <p className="text-[9px] text-muted-foreground mb-2">Default stats will be shown if not customized</p>
                          </div>
                          <div className="pt-2">
                              <Label className="text-[10px] text-muted-foreground mb-2 block">Achievements (4 achievements displayed)</Label>
                              <p className="text-[9px] text-muted-foreground">Default achievements will be shown if not customized</p>
                          </div>
                      </div>
                  )}

                  {/* Common Image Upload */}
                  <div className="pt-2 border-t">
                      <Label className="text-[10px] text-muted-foreground">Main Image URL (optional)</Label>
                      <Input 
                          value={selectedModule.content.image || ""} 
                          onChange={(e) => updateModuleContent(selectedModule.id, { image: e.target.value })} 
                          placeholder="https://..."
                          className="h-8 text-xs"
                      />
                      {selectedModule.content.image && (
                          <div className="mt-2">
                              <img 
                                  src={selectedModule.content.image} 
                                  alt="Preview" 
                                  className="w-full h-32 object-cover rounded border"
                                  onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                              />
                          </div>
                      )}
                  </div>
              </div>
          )}

          {![" navbar", "footer"].includes(selectedModule.type) && (
            <div className="space-y-2">
              <Label>Media</Label>
              <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition cursor-pointer">
                <span className="text-sm font-medium text-primary">
                  Click to upload image
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  or drag and drop
                </span>
              </div>
            </div>
          )}
        </div>

        <hr className="border-border" />

        <div className="space-y-3">
          <Label className="uppercase text-xs text-muted-foreground font-bold tracking-wider">
            Visibility
          </Label>
          <RadioGroup
            value={selectedModule.visibility}
            onValueChange={(val: any) =>
              updateModuleVisibility(selectedModule.id, val)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="vis-public" />
              <Label htmlFor="vis-public" className="font-normal">
                Everyone
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="members" id="vis-members" />
              <Label htmlFor="vis-members" className="font-normal">
                Members Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="vis-admin" />
              <Label htmlFor="vis-admin" className="font-normal">
                Admin Preview Only
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default ModuleSettings;

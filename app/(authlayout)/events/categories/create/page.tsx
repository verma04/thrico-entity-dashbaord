"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tag, Info, Eye, Check } from "lucide-react";
import { toast } from "sonner";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

import {
  CATEGORY_ICONS,
  CATEGORY_COLORS,
} from "@/components/events/categories-grid";
import { useModuleStore } from "@/store/useModuleStore";

function CreateEventCategoryPage() {
  const router = useRouter();
  const singularName = useModuleStore((state) => state.eventSingularName);
  const moduleName = useModuleStore((state) => state.eventModuleName);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("other");
  const [color, setColor] = useState("#8b5cf6");
  const [saving, setSaving] = useState(false);

  const isDirty = name.length > 0 || description.length > 0 || icon !== "other" || color !== "#8b5cf6";

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      // TODO: wire up actual create mutation
      toast.success("Category created successfully");
      router.push("/events/categories");
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setIcon("other");
    setColor("#8b5cf6");
    router.back();
  };

  const selectedColorObj = CATEGORY_COLORS.find((c) => c.value === color);

  return (
    <>
      <EcosystemWrapper>
        <EcosystemHeader
          title="Create Category"
          description={`Add a new category to organize your ${moduleName.toLowerCase()}.`}
          badgeText="New"
          icon={Tag}
          breadcrumbs={[
            { label: moduleName, href: "/events" },
            { label: "Categories", href: "/events/categories" },
            { label: "Create" },
          ]}
        />
        <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form */}
              <div className="lg:col-span-8 space-y-8">
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Category Details</CardTitle>
                    <CardDescription>
                      Define the name, icon, and color for this category.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="cat-name"
                        className="text-sm font-medium"
                      >
                        Category Name{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="cat-name"
                        placeholder="e.g., Hackathon"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={50}
                      />
                      <p className="text-xs text-muted-foreground">
                        {name.length}/50 characters
                      </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="cat-desc"
                        className="text-sm font-medium"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="cat-desc"
                        placeholder="Brief description of this category"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="resize-none"
                        maxLength={200}
                      />
                      <p className="text-xs text-muted-foreground">
                        {description.length}/200 characters
                      </p>
                    </div>

                    {/* Icon */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Icon</Label>
                      <Select value={icon} onValueChange={setIcon}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CATEGORY_ICONS).map(
                            ([key, iconEl]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  {iconEl}
                                  <span className="capitalize">{key}</span>
                                </div>
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Color */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Color</Label>
                      <div className="flex flex-wrap gap-3 pt-1">
                        {CATEGORY_COLORS.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setColor(c.value)}
                            className={`h-9 w-9 rounded-full transition-all flex items-center justify-center ${
                              color === c.value
                                ? "ring-2 ring-offset-2 ring-indigo-500 scale-110 shadow-md"
                                : "hover:scale-110 shadow-sm border border-black/5"
                            }`}
                            style={{ backgroundColor: c.value }}
                          >
                            {color === c.value && (
                              <Check className="h-4 w-4 text-white drop-shadow" />
                            )}
                          </button>
                        ))}
                      </div>
                      {selectedColorObj && (
                        <p className="text-xs text-muted-foreground">
                          Selected: {selectedColorObj.name}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-6 space-y-6">
                  {/* Live Preview */}
                  <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        Live Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-4">
                        <div
                          className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm"
                          style={{
                            backgroundColor: `${color}20`,
                            color: color,
                          }}
                        >
                          {CATEGORY_ICONS[icon] || (
                            <Tag className="h-6 w-6" />
                          )}
                        </div>
                        <div className="text-center space-y-1">
                          <h4 className="text-lg font-bold tracking-tight">
                            {name || "Category Name"}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
                            {description || "Category description will appear here."}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: `${color}40`,
                            color: color,
                            backgroundColor: `${color}08`,
                          }}
                        >
                          0 {moduleName}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tips */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Quick Guide</h3>
                    <Badge
                      variant="outline"
                      className="bg-indigo-500/5 text-indigo-600 border-indigo-500/20"
                    >
                      Tips
                    </Badge>
                  </div>

                  <Card className="border-none shadow-sm ring-1 ring-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Info className="h-5 w-5" />
                        Tips for Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm">
                        <li className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            Use clear, descriptive names that members will
                            understand.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            Choose a distinct color and icon for easy visual
                            identification.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            Keep descriptions concise — they help members find
                            the right category quickly.
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
      </EcosystemWrapper>

      <FloatingSavePanel
        hasChanged={isDirty}
        saved={false}
        isSaving={saving}
        onSave={handleSave}
        onReset={handleReset}
        title="Unsaved Category"
        description="You have unfilled form data."
        buttonText="Create Category"
      />
    </>
  );
}

export default withSubscriptionCheck(
  withModulePermission(CreateEventCategoryPage, "EVENTS", "canCreate"),
  "events",
);

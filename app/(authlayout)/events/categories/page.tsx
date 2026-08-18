"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Tag, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { useModuleStore } from "@/store/useModuleStore";

import {
  CategoriesGrid,
  EventCategory,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
} from "@/components/events/categories-grid";

const initialCategories: EventCategory[] = [
  {
    id: "1",
    name: "Conference",
    icon: "conference",
    color: "#8b5cf6",
    eventCount: 12,
    description: "Large-scale gatherings with multiple sessions and speakers",
    users: [
      { id: "u1", firstName: "Sarah", lastName: "Jenkins", headline: "Keynote Speaker & Tech Lead" },
      { id: "u2", firstName: "Alex", lastName: "Chen", headline: "Conference Organizer" },
      { id: "u3", firstName: "David", lastName: "Miller", headline: "VP of Engineering" },
      { id: "u4", firstName: "Elena", lastName: "Rostova", headline: "Product Designer" },
    ],
  },
  {
    id: "2",
    name: "Workshop",
    icon: "workshop",
    color: "#06b6d4",
    eventCount: 8,
    description: "Hands-on learning experiences with limited participants",
    users: [
      { id: "u5", firstName: "Michael", lastName: "Brown", headline: "Workshop Facilitator" },
      { id: "u6", firstName: "Jessica", lastName: "Taylor", headline: "Full Stack Engineer" },
      { id: "u7", firstName: "Marcus", lastName: "Vance", headline: "DevOps Specialist" },
    ],
  },
  {
    id: "3",
    name: "Meetup",
    icon: "meetup",
    color: "#22c55e",
    eventCount: 15,
    description: "Informal gatherings for networking and community building",
    users: [
      { id: "u8", firstName: "Emma", lastName: "Watson", headline: "Community Lead" },
      { id: "u9", firstName: "Lucas", lastName: "Scott", headline: "Software Architect" },
      { id: "u10", firstName: "Sophia", lastName: "Garcia", headline: "UX Researcher" },
      { id: "u11", firstName: "Oliver", lastName: "Queen", headline: "Developer Advocate" },
      { id: "u12", firstName: "Ava", lastName: "Martinez", headline: "Product Manager" },
    ],
  },
  {
    id: "4",
    name: "Webinar",
    icon: "webinar",
    color: "#f59e0b",
    eventCount: 20,
    description: "Online presentations and interactive sessions",
    users: [
      { id: "u13", firstName: "Noah", lastName: "Davis", headline: "Technical Host" },
      { id: "u14", firstName: "Isabella", lastName: "Clark", headline: "Growth Marketer" },
      { id: "u15", firstName: "Liam", lastName: "Wilson", headline: "Security Analyst" },
    ],
  },
  {
    id: "5",
    name: "Social",
    icon: "social",
    color: "#ec4899",
    eventCount: 6,
    description: "Social events for fun and entertainment",
    users: [
      { id: "u16", firstName: "Chloe", lastName: "Adams", headline: "Event Coordinator" },
      { id: "u17", firstName: "Mason", lastName: "Hall", headline: "Community Member" },
    ],
  },
  {
    id: "6",
    name: "Corporate",
    icon: "corporate",
    color: "#3b82f6",
    eventCount: 4,
    description: "Business meetings, retreats, and corporate events",
    users: [
      { id: "u18", firstName: "James", lastName: "Bond", headline: "Corporate Relations" },
      { id: "u19", firstName: "Rachel", lastName: "Green", headline: "HR Director" },
    ],
  },
];

// ── Edit Category Dialog ──
function EditCategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: EventCategory | null;
  onSave: (updated: { name: string; description: string; icon: string; color: string }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("other");
  const [color, setColor] = useState("#8b5cf6");

  React.useEffect(() => {
    if (open && category) {
      setName(category.name);
      setDescription(category.description || "");
      setIcon(category.icon || "other");
      setColor(category.color || "#8b5cf6");
    }
  }, [open, category]);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    onSave({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-border">
        <DialogHeader>
          <DialogTitle className="font-bold text-foreground">
            Edit Category
          </DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            Update the category details and styling.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-semibold">
              Category Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-name"
              placeholder="e.g., Conference"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-desc" className="text-sm font-semibold">
              Description
            </Label>
            <Textarea
              id="edit-desc"
              placeholder="Brief description of this category"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none rounded-xl"
            />
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_ICONS).map(([key, iconEl]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      {iconEl}
                      <span className="capitalize">{key}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Color</Label>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-8 w-8 rounded-full transition-all flex items-center justify-center ${
                    color === c.value
                      ? "ring-2 ring-offset-2 ring-primary scale-110 shadow-md"
                      : "hover:scale-110 shadow-sm border border-black/5"
                  }`}
                  style={{ backgroundColor: c.value }}
                >
                  {color === c.value && (
                    <Check className="h-3.5 w-3.5 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            className="rounded-lg font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="rounded-lg font-semibold"
          >
            Update Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoriesPage() {
  const moduleName = useModuleStore((state) => state.eventModuleName);
  const singularName = useModuleStore((state) => state.eventSingularName);

  const [categories, setCategories] =
    useState<EventCategory[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<EventCategory | null>(null);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEditCategory = (cat: EventCategory) => {
    setEditingCategory(cat);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (updated: {
    name: string;
    description: string;
    icon: string;
    color: string;
  }) => {
    if (!editingCategory) return;
    setCategories(
      categories.map((c) =>
        c.id === editingCategory.id ? { ...c, ...updated } : c,
      ),
    );
    toast.success("Category updated successfully");
    setIsEditDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      setCategoryToDelete(cat);
    }
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;
    setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
    toast.success("Category deleted successfully");
    setCategoryToDelete(null);
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`${singularName} Categories`}
        badgeText="Organization"
        description={`Organize ${moduleName.toLowerCase()} by type for better discovery and management.`}
        icon={Tag}
        breadcrumbs={[
          { label: moduleName, href: "/events" },
          { label: "Categories" },
        ]}
      />

      <EcosystemActionBar>
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search categories..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <Link href="/events/categories/create">
              <CtaButton>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Category
              </CtaButton>
            </Link>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Status active={filteredCategories.length > 0}>
            {filteredCategories.length} Categories
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <CategoriesGrid
          categories={filteredCategories}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      </EcosystemContainer>

      {/* Edit Category Dialog */}
      <EditCategoryDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={editingCategory}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-foreground">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground font-medium">
              This will permanently delete the category{" "}
              <span className="font-bold text-foreground">
                "{categoryToDelete?.name}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg font-semibold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg font-semibold"
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(CategoriesPage, "EVENTS", "canRead"),
  "events",
);

"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Tag, Search, Filter } from "lucide-react";

import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

import { 
  CategoriesGrid, 
  EventCategory, 
  CATEGORY_ICONS, 
  CATEGORY_COLORS 
} from "@/components/events/categories-grid";

const initialCategories: EventCategory[] = [
  {
    id: "1",
    name: "Conference",
    icon: "conference",
    color: "#8b5cf6",
    eventCount: 12,
    description: "Large-scale gatherings with multiple sessions and speakers",
  },
  {
    id: "2",
    name: "Workshop",
    icon: "workshop",
    color: "#06b6d4",
    eventCount: 8,
    description: "Hands-on learning experiences with limited participants",
  },
  {
    id: "3",
    name: "Meetup",
    icon: "meetup",
    color: "#22c55e",
    eventCount: 15,
    description: "Informal gatherings for networking and community building",
  },
  {
    id: "4",
    name: "Webinar",
    icon: "webinar",
    color: "#f59e0b",
    eventCount: 20,
    description: "Online presentations and interactive sessions",
  },
  {
    id: "5",
    name: "Social",
    icon: "social",
    color: "#ec4899",
    eventCount: 6,
    description: "Social events for fun and entertainment",
  },
  {
    id: "6",
    name: "Corporate",
    icon: "corporate",
    color: "#3b82f6",
    eventCount: 4,
    description: "Business meetings, retreats, and corporate events",
  },
];

function AddCategoryModal({
  onAdd,
}: {
  onAdd: (category: Omit<EventCategory, "id" | "eventCount">) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("other");
  const [color, setColor] = useState("#8b5cf6");

  const handleSubmit = () => {
    if (!name) return;
    onAdd({ name, description, icon, color });
    setName("");
    setDescription("");
    setIcon("other");
    setColor("#8b5cf6");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold text-xs px-6 h-10 rounded-lg shadow-sm gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl border-border">
        <DialogHeader>
          <DialogTitle className="font-bold text-foreground">Add Event Category</DialogTitle>
          <DialogDescription className="font-medium text-muted-foreground">
            Create a new category to organize your events
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="cat-name" className="text-sm font-semibold text-foreground">
              Category Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="cat-name"
              placeholder="e.g., Hackathon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-border focus-visible:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-desc" className="text-sm font-semibold text-foreground">Description</Label>
            <Input
              id="cat-desc"
              placeholder="Brief description of this category"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border-border focus-visible:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Icon</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger className="rounded-xl border-border font-semibold focus:ring-indigo-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                {Object.entries(CATEGORY_ICONS).map(([key, iconEl]) => (
                  <SelectItem key={key} value={key} className="font-medium rounded-lg">
                    <div className="flex items-center gap-2">
                      {iconEl}
                      <span className="capitalize">{key}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Color</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-8 w-8 rounded-full transition-all flex items-center justify-center ${
                    color === c.value
                      ? "ring-2 ring-offset-2 ring-indigo-500 scale-110 shadow-sm"
                      : "hover:scale-110 shadow-sm border border-black/5"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" className="rounded-lg font-semibold border-border" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name} className="rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white">
            Save Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoriesPage() {
  const [categories, setCategories] = useState<EventCategory[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddCategory = (cat: Omit<EventCategory, "id" | "eventCount">) => {
    setCategories([
      ...categories,
      { ...cat, id: String(categories.length + 1), eventCount: 0 },
    ]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Event Categories"
        badgeText="Organization"
        description="Organize events by type for better discovery and management."
        icon={Tag}
        actions={
          <AddCategoryModal onAdd={handleAddCategory} />
        }
      />

      <EcosystemActionBar>
        <div className="relative w-full md:max-w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-muted border-border rounded-xl focus-visible:ring-4 focus-visible:ring-indigo-500/5 transition-all font-medium text-foreground placeholder:text-muted-foreground border shadow-sm"
          />
        </div>

        <div className="flex items-center gap-4 pr-4 ml-auto">
           <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border border-border text-muted-foreground hover:text-indigo-600 hover:bg-muted shadow-sm">
              <Filter className="h-4 w-4" />
           </Button>
           <div className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-xl text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {filteredCategories.length} Categories
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <CategoriesGrid categories={filteredCategories} onDeleteCategory={handleDeleteCategory} />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(CategoriesPage, "EVENTS", "canRead"),
  "events"
);

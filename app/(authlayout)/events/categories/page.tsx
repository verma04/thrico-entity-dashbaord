"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
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

function CategoriesPage() {
  const [categories, setCategories] =
    useState<EventCategory[]>(initialCategories);
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
        breadcrumbs={[
          { label: "Events", href: "/events" },
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
                <Plus className="h-4 w-4" />
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
          onDeleteCategory={handleDeleteCategory}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(CategoriesPage, "EVENTS", "canRead"),
  "events",
);

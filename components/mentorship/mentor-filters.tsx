import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Star, TrendingUp } from "lucide-react";

import {
  MentorFilters as SharedMentorFilters,
  MentorCategory as SharedMentorCategory,
} from "@/types/mentor-types";

interface StatusOption {
  value: string;
  label: string;
  count?: number;
}

interface MentorFiltersProps {
  filters: SharedMentorFilters;
  setFilters: (filters: Partial<SharedMentorFilters>) => void;
  resetFilters: () => void;
  categories: SharedMentorCategory[] | any[];
  statusOptions: StatusOption[];
}

export function MentorFilters({
  filters,
  setFilters,
  resetFilters,
  categories,
  statusOptions,
}: MentorFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={filters.status === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilters({ status: option.value as any })}
          >
            {option.label}
            {option.count !== undefined && option.count > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-primary-foreground/20">
                {option.count}
              </span>
            )}
          </Button>
        ))}

        <Button
          variant={filters.featured ? "default" : "outline"}
          size="sm"
          onClick={() =>
            setFilters({ featured: filters.featured ? undefined : true })
          }
        >
          <Star className="h-4 w-4 mr-1" />
          Featured
        </Button>
      </div>

      {/* Search and Category Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mentors..."
            value={filters.searchQuery || ""}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="pl-9 pr-9"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters({ searchQuery: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select
          value={filters.categoryId || "all"}
          onValueChange={(value) =>
            setFilters({
              categoryId: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(filters.searchQuery ||
          filters.categoryId ||
          filters.featured ||
          filters.trending) && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}

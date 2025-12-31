"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Network, ArrowRight, Filter } from "lucide-react";

// Mock relationship data
const mockRelationships = [
  {
    id: "1",
    source: { type: "User", name: "John Doe" },
    relation: "owner_of",
    target: { type: "Organization", name: "Acme Corp" },
    permissions: ["admin", "manage_users"],
  },
  {
    id: "2",
    source: { type: "User", name: "John Doe" },
    relation: "member_of",
    target: { type: "Team", name: "Engineering" },
    permissions: ["read", "write"],
  },
  {
    id: "3",
    source: { type: "User", name: "Jane Smith" },
    relation: "manager_of",
    target: { type: "Team", name: "Sales Team" },
    permissions: ["read", "write", "manage"],
  },
  {
    id: "4",
    source: { type: "Team", name: "Engineering" },
    relation: "parent_of",
    target: { type: "Project", name: "Project Alpha" },
    permissions: ["full_access"],
  },
  {
    id: "5",
    source: { type: "User", name: "Bob Johnson" },
    relation: "viewer_of",
    target: { type: "Project", name: "Project Alpha" },
    permissions: ["read"],
  },
];

const relationTypes = [
  "owner_of",
  "member_of",
  "manager_of",
  "viewer_of",
  "editor_of",
  "parent_of",
  "child_of",
  "manages",
  "owned_by",
];

const entityTypes = ["User", "Organization", "Team", "Project", "Group"];

export default function RelationshipsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSourceType, setFilterSourceType] = useState<string>("all");
  const [filterTargetType, setFilterTargetType] = useState<string>("all");
  const [filterRelationType, setFilterRelationType] = useState<string>("all");

  const filteredRelationships = mockRelationships.filter((rel) => {
    const matchesSearch =
      rel.source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.target.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.relation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSourceType =
      filterSourceType === "all" || rel.source.type === filterSourceType;
    const matchesTargetType =
      filterTargetType === "all" || rel.target.type === filterTargetType;
    const matchesRelationType =
      filterRelationType === "all" || rel.relation === filterRelationType;

    return (
      matchesSearch &&
      matchesSourceType &&
      matchesTargetType &&
      matchesRelationType
    );
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      User: "bg-blue-100 text-blue-800",
      Organization: "bg-purple-100 text-purple-800",
      Team: "bg-green-100 text-green-800",
      Project: "bg-orange-100 text-orange-800",
      Group: "bg-pink-100 text-pink-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter relationships by type and entity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Source Type</Label>
              <Select
                value={filterSourceType}
                onValueChange={setFilterSourceType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {entityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Relation Type</Label>
              <Select
                value={filterRelationType}
                onValueChange={setFilterRelationType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All relations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Relations</SelectItem>
                  {relationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Type</Label>
              <Select
                value={filterTargetType}
                onValueChange={setFilterTargetType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {entityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relationships List */}
      <div className="space-y-3">
        {filteredRelationships.length > 0 ? (
          filteredRelationships.map((rel) => (
            <Card key={rel.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Source */}
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(rel.source.type)}>
                        {rel.source.type}
                      </Badge>
                      <span className="font-medium">{rel.source.name}</span>
                    </div>

                    {/* Relation */}
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className="font-mono">
                        {rel.relation}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Target */}
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(rel.target.type)}>
                        {rel.target.type}
                      </Badge>
                      <span className="font-medium">{rel.target.name}</span>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Permissions:
                    </span>
                    <div className="flex gap-1">
                      {rel.permissions.map((perm) => (
                        <Badge
                          key={perm}
                          variant="secondary"
                          className="text-xs"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No relationships found</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Relationships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRelationships.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Unique Entities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                new Set([
                  ...mockRelationships.map((r) => r.source.name),
                  ...mockRelationships.map((r) => r.target.name),
                ]).size
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Relation Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mockRelationships.map((r) => r.relation)).size}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

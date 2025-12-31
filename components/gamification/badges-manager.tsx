"use client";

import React, { useState, useMemo } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Badge as BadgeType } from "./ts-types";
import { useCheckEntitySubscription } from "@/graphql/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Award, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderModuleIcon } from "@/components/subscription/utils";

const BADGE_ICONS = [
  "⭐",
  "🏆",
  "🎯",
  "💎",
  "🦋",
  "🔥",
  "👑",
  "🎖️",
  "🏅",
  "⚡",
  "🚀",
  "💪",
  "🎓",
  "🌟",
  "✨",
  "🎪",
  "🎭",
  "🎨",
  "📝",
  "💼",
  "👶",
  "🔍",
  "📊",
  "🎮",
  "🎲",
  "🎸",
  "🎹",
  "🎺",
  "🎻",
  "🥇",
];

export function BadgesManager() {
  const {
    badges,
    selectedModule,
    setSelectedModule,
    addBadge,
    updateBadge,
    deleteBadge,
    toggleBadgeActive,
    getBadgesByModule,
  } = useGamificationStore();

  // Get modules from entity subscription
  const { data: subscriptionData } = useCheckEntitySubscription();
  const subscriptionModules = useMemo(() => {
    const modules = subscriptionData?.checkEntitySubscription?.modules || [];
    return modules
      .filter((m) => m.enabled)
      .map((m) => ({
        id: m.id,
        name: m.name,
        icon: m.icon || "Settings",
      }));
  }, [subscriptionData]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeType | null>(null);
  const [formData, setFormData] = useState<Partial<BadgeType>>({
    name: "",
    icon: "⭐",
    description: "",
    type: "ACTION_BASED",
    module: "",
    isActive: true,
    criteria: {},
  });

  const filteredBadges = getBadgesByModule(selectedModule);
  const actionBadges = filteredBadges.filter((b) => b.type === "ACTION_BASED");
  const pointsBadges = filteredBadges.filter((b) => b.type === "POINTS_BASED");

  const handleOpenDialog = (badge?: BadgeType) => {
    if (badge) {
      setEditingBadge(badge);
      setFormData(badge);
    } else {
      setEditingBadge(null);
      setFormData({
        name: "",
        icon: "⭐",
        description: "",
        type: "ACTION_BASED",
        module: subscriptionModules[0]?.id || "",
        isActive: true,
        criteria: {},
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingBadge) {
      updateBadge(editingBadge.id, formData);
    } else {
      addBadge(formData as Omit<BadgeType, "id">);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Badges</p>
                <p className="text-2xl font-bold">{badges.length}</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Action-Based</p>
                <p className="text-2xl font-bold">{actionBadges.length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Points-Based</p>
                <p className="text-2xl font-bold">{pointsBadges.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedModule === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedModule("ALL")}
          >
            All
          </Button>
          {subscriptionModules.map((mod) => (
            <Button
              key={mod.id}
              variant={selectedModule === mod.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModule(mod.id as any)}
              className="flex items-center gap-1"
            >
              {renderModuleIcon(mod.icon)}
            </Button>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Badge
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBadge ? "Edit Badge" : "Create Badge"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-lg max-h-32 overflow-y-auto">
                  {BADGE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={cn(
                        "w-10 h-10 text-xl rounded-lg border-2 transition-all",
                        formData.icon === icon
                          ? "border-primary bg-primary/10"
                          : "border-transparent hover:bg-gray-100"
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g., Feed Master"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="What does this badge represent?"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      type: v as "ACTION_BASED" | "POINTS_BASED",
                      criteria: {},
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTION_BASED">
                      Action-Based (Complete X actions)
                    </SelectItem>
                    <SelectItem value="POINTS_BASED">
                      Points-Based (Reach X points)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "ACTION_BASED" && (
                <>
                  <div className="space-y-2">
                    <Label>Module</Label>
                    <Select
                      value={formData.module}
                      onValueChange={(v) =>
                        setFormData({ ...formData, module: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent>
                        {subscriptionModules.map((mod) => (
                          <SelectItem key={mod.id} value={mod.id}>
                            <span className="flex items-center gap-2">
                              {renderModuleIcon(mod.icon)} {mod.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Action</Label>
                      <Input
                        placeholder="e.g., Create Post"
                        value={formData.criteria?.action || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            criteria: {
                              ...formData.criteria,
                              action: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Required Count</Label>
                      <Input
                        type="number"
                        min={1}
                        value={formData.criteria?.count || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            criteria: {
                              ...formData.criteria,
                              count: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.type === "POINTS_BASED" && (
                <div className="space-y-2">
                  <Label>Points Required</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="e.g., 1000"
                    value={formData.criteria?.pointsRequired || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        criteria: {
                          pointsRequired: Number(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, isActive: v })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingBadge ? "Save Changes" : "Create Badge"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => (
          <Card
            key={badge.id}
            className={cn(
              "relative overflow-hidden transition-all",
              !badge.isActive && "opacity-50"
            )}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{badge.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant={
                        badge.type === "ACTION_BASED" ? "default" : "secondary"
                      }
                    >
                      {badge.type === "ACTION_BASED" ? "Action" : "Points"}
                    </Badge>
                    {badge.type === "ACTION_BASED" && badge.criteria.count && (
                      <span className="text-xs text-muted-foreground">
                        {badge.criteria.action} × {badge.criteria.count}
                      </span>
                    )}
                    {badge.type === "POINTS_BASED" &&
                      badge.criteria.pointsRequired && (
                        <span className="text-xs text-muted-foreground">
                          {badge.criteria.pointsRequired.toLocaleString()} pts
                        </span>
                      )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(badge)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => deleteBadge(badge.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredBadges.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No badges found. Create your first badge!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

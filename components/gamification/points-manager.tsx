"use client";

import React, { useState, useMemo } from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { PointRule } from "./ts-types";
import { useCheckEntitySubscription } from "@/graphql/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Zap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderModuleIcon } from "@/components/subscription/utils";

export function PointsManager() {
  const {
    pointRules,
    selectedModule,
    setSelectedModule,
    addPointRule,
    updatePointRule,
    deletePointRule,
    togglePointRuleActive,
    getPointRulesByModule,
  } = useGamificationStore();

  // Get modules from entity subscription
  const { data: subscriptionData, loading: loadingSubscription } =
    useCheckEntitySubscription();
  const subscriptionModules = useMemo(() => {
    const modules = subscriptionData?.checkEntitySubscription?.modules || [];
    return modules
      .filter((m) => m.enabled)
      .map((m) => ({
        id: m.id,
        name: m.name,
        icon: m.icon || "Settings", // Lucide icon name
      }));
  }, [subscriptionData]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PointRule | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PointRule>>({
    module: "",
    action: "",
    triggerType: "RECURRING",
    points: 5,
    description: "",
    isActive: true,
  });

  const filteredRules = getPointRulesByModule(selectedModule);

  const handleOpenDialog = (rule?: PointRule) => {
    setDuplicateError(null);
    if (rule) {
      setEditingRule(rule);
      setFormData(rule);
    } else {
      setEditingRule(null);
      setFormData({
        module: subscriptionModules[0]?.id || "",
        action: "",
        triggerType: "RECURRING",
        points: 5,
        description: "",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  // Check for duplicate module + action + trigger combination
  const isDuplicate = (
    data: Partial<PointRule>,
    excludeId?: string
  ): boolean => {
    return pointRules.some(
      (rule) =>
        rule.id !== excludeId &&
        rule.module === data.module &&
        rule.action?.toLowerCase() === data.action?.toLowerCase() &&
        rule.triggerType === data.triggerType
    );
  };

  const handleSave = () => {
    // Check for duplicates
    if (isDuplicate(formData, editingRule?.id)) {
      setDuplicateError(
        `A rule for "${formData.action}" (${formData.triggerType}) already exists in this module.`
      );
      return;
    }

    if (editingRule) {
      updatePointRule(editingRule.id, formData);
    } else {
      addPointRule(formData as Omit<PointRule, "id">);
    }
    setIsDialogOpen(false);
    setDuplicateError(null);
  };

  const getModuleInfo = (moduleId: string) => {
    return subscriptionModules.find((m) => m.id === moduleId);
  };

  const getTotalPoints = () => {
    return filteredRules.reduce((sum, r) => sum + r.points, 0);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rules</p>
                <p className="text-2xl font-bold">{pointRules.length}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold">
                  {pointRules.filter((r) => r.isActive).length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">First-Time</p>
                <p className="text-2xl font-bold">
                  {
                    pointRules.filter((r) => r.triggerType === "FIRST_TIME")
                      .length
                  }
                </p>
              </div>
              <Badge variant="secondary">One-time</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recurring</p>
                <p className="text-2xl font-bold">
                  {
                    pointRules.filter((r) => r.triggerType === "RECURRING")
                      .length
                  }
                </p>
              </div>
              <Badge variant="outline">Repeatable</Badge>
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
            All Modules
          </Button>
          {subscriptionModules.map((mod) => (
            <Button
              key={mod.id}
              variant={selectedModule === mod.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModule(mod.id as any)}
              className="flex items-center gap-1.5"
            >
              {renderModuleIcon(mod.icon)} {mod.name}
            </Button>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" /> Add Point Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingRule ? "Edit Point Rule" : "Add Point Rule"}
              </DialogTitle>
            </DialogHeader>

            {duplicateError && (
              <Alert variant="destructive" className="mb-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{duplicateError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Module</Label>
                <Select
                  value={formData.module}
                  onValueChange={(v) => setFormData({ ...formData, module: v })}
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

              <div className="space-y-2">
                <Label>Action Name</Label>
                <Input
                  placeholder="e.g., Create Post"
                  value={formData.action || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, action: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Trigger Type</Label>
                <Select
                  value={formData.triggerType}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      triggerType: v as "FIRST_TIME" | "RECURRING",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRST_TIME">
                      First Time (One-time bonus)
                    </SelectItem>
                    <SelectItem value="RECURRING">
                      Recurring (Every time)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Points</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.points || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, points: Number(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Describe this point rule"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {formData.triggerType === "RECURRING" && (
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Daily Cap</Label>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={formData.dailyCap || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dailyCap: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Weekly Cap</Label>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={formData.weeklyCap || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          weeklyCap: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Monthly Cap</Label>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={formData.monthlyCap || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          monthlyCap: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
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
                {editingRule ? "Save Changes" : "Add Rule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Point Rules{" "}
            {selectedModule !== "ALL" && (
              <Badge variant="secondary" className="ml-2">
                {getModuleInfo(selectedModule as string)?.name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Points</TableHead>
                <TableHead>Caps</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      {renderModuleIcon(
                        getModuleInfo(rule.module)?.icon || "Settings"
                      )}
                      {getModuleInfo(rule.module)?.name || rule.module}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{rule.action}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        rule.triggerType === "FIRST_TIME"
                          ? "default"
                          : "outline"
                      }
                    >
                      {rule.triggerType === "FIRST_TIME"
                        ? "First Time"
                        : "Recurring"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-bold text-primary">
                    +{rule.points}
                  </TableCell>
                  <TableCell>
                    {rule.dailyCap || rule.weeklyCap || rule.monthlyCap ? (
                      <span className="text-xs text-muted-foreground">
                        {rule.dailyCap && `${rule.dailyCap}/day`}
                        {rule.weeklyCap && ` ${rule.weeklyCap}/wk`}
                        {rule.monthlyCap && ` ${rule.monthlyCap}/mo`}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No limit
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => togglePointRuleActive(rule.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(rule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deletePointRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No point rules found. Add your first rule!
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

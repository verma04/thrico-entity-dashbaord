"use client";

import React from "react";
import { useState } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { Search, Puzzle, AlertCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MobileNavigation from "./mobile-navigation";

import { gql, useMutation } from "@apollo/client";
import {
  InputUpdateEntityModule,
  useCheckEntitySubscription,
} from "@/graphql/actions";

interface UpdateEntityModuleResponse {
  updateEntityModule: {
    success: boolean;
  };
}

const UPDATE_ENTITY_MODULE = gql`
  mutation UpdateEntityModule($input: [inputUpdateEntityModule]) {
    updateEntityModule(input: $input) {
      success
    }
  }
`;

const moduleData = [
  {
    id: "1",
    name: "Directory",
    enabled: true,
    required: true,
    category: "Core",
    showInMobileNavigation: true,
    showInWebNavigation: true,
    icon: null,
    isPopular: false,
  },
  {
    id: "2",
    name: "Communities",
    enabled: true,
    required: false,
    category: "Social",
    showInMobileNavigation: true,
    showInWebNavigation: true,
    icon: null,
    isPopular: true,
  },
];

interface ModuleItem {
  id: string;
  name: string;
  icon: string | null;
  enabled: boolean;
  required?: boolean;
  showInMobileNavigation: boolean;
  showInWebNavigation: boolean;
  isPopular: boolean;
  showInMobileNavigationSortNumber?: number;
}

const getNavIcon = (icon: string | null) => {
  if (!icon || typeof icon !== "string" || !(icon in LucideIcons)) {
    return <Puzzle className="h-4 w-4 text-primary" />;
  }
  const IconComponent = (LucideIcons as any)[icon] as React.ElementType;
  return <IconComponent className="h-4 w-4 text-primary" />;
};

export default function ModuleManagement() {
  const [updateEntityModule, { loading: updateLoading }] = useMutation<
    UpdateEntityModuleResponse,
    { input: InputUpdateEntityModule[] }
  >(UPDATE_ENTITY_MODULE);

  const { data, loading, error } = useCheckEntitySubscription();
  const subscription = data?.checkEntitySubscription;

  const [modules, setModules] = useState<ModuleItem[]>(moduleData);
  const [modulesInitialized, setModulesInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("management");
  const [userRole, setUserRole] = useState("admin");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
    description?: string;
  } | null>(null);

  React.useEffect(() => {
    if (
      !modulesInitialized &&
      subscription &&
      Array.isArray(subscription.modules)
    ) {
      setModules(
        subscription.modules.map((m: any) => ({
          id: m.id,
          name: m.name,
          enabled: m.enabled ?? true,
          required: m.required ?? false,
          showInMobileNavigation: m.showInMobileNavigation ?? false,
          showInWebNavigation: m.showInWebNavigation ?? false,
          icon: m.icon ?? null,
          showInMobileNavigationSortNumber:
            typeof m.showInMobileNavigationSortNumber === "number"
              ? m.showInMobileNavigationSortNumber
              : undefined,
          isPopular: m.isPopular ?? false,
        }))
      );
      setModulesInitialized(true);
    }
  }, [subscription, modulesInitialized]);

  const toggleModule = (id: string) => {
    if (userRole === "directory") {
      return;
    }
    setModules((prevModules) => {
      return prevModules.map((module) => {
        if (module.id === id && !module.required) {
          if (module.enabled) {
            return { ...module, enabled: false, showInMobileNavigation: false };
          } else {
            return { ...module, enabled: true };
          }
        }
        return module;
      });
    });
  };

  const toggleNavigation = (id: string) => {
    if (userRole === "directory") {
      return;
    }
    setModules((prevModules) => {
      const currentNavigationCount = prevModules.filter(
        (m) => m.showInMobileNavigation
      ).length;
      return prevModules.map((module) => {
        if (module.id === id) {
          if (module.showInMobileNavigation) {
            return { ...module, showInMobileNavigation: false };
          }
          if (currentNavigationCount < 3) {
            return { ...module, showInMobileNavigation: true };
          }
          return module;
        }
        return module;
      });
    });
  };

  const saveChanges = async () => {
    setSaving(true);
    const input: InputUpdateEntityModule[] = modules.map((m, idx) => {
      return {
        icon: m.icon ?? null,
        id: m.id ?? null,
        name: m.name ?? null,
        isEnabled: m.enabled ?? null,
        showInMobileNavigation: m.showInMobileNavigation ?? null,
        showInMobileNavigationSortNumber: m.showInMobileNavigation
          ? idx
          : undefined,
        showInWebNavigation: m.showInWebNavigation ?? null,
        isPopular: m.isPopular ?? null,
      };
    });
    try {
      const response = await updateEntityModule({ variables: { input } });
      if (response.data?.updateEntityModule.success) {
        setNotification({
          type: "success",
          message: "Changes saved successfully!",
        });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({
          type: "error",
          message: "Save failed",
          description: "Mutation did not succeed",
        });
      }
    } catch (err: unknown) {
      setNotification({
        type: "error",
        message: "Save failed",
        description:
          err && typeof err === "object" && "message" in err
            ? String((err as { message?: string }).message)
            : "An error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  const navigationModules = modules
    .filter((m) => m.showInMobileNavigation)
    .sort(
      (a, b) =>
        (a.showInMobileNavigationSortNumber ?? 0) -
        (b.showInMobileNavigationSortNumber ?? 0)
    );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const navModules = Array.from(navigationModules);
    const [removed] = navModules.splice(result.source.index, 1);
    if (removed) {
      navModules.splice(result.destination.index, 0, removed);
    }
    setModules((prev) => {
      const updated = prev.map((m) => {
        const idx = navModules.findIndex((nm) => nm.id === m.id);
        if (idx !== -1) {
          return { ...m, showInMobileNavigationSortNumber: idx };
        }
        return m;
      });
      return updated;
    });
  };

  type NavigationColumn = {
    title: string;
    key: string;
    dataIndex?: string;
    render?: (
      value: unknown,
      record: ModuleItem,
      index: number
    ) => React.ReactNode;
  };

  const navigationColumns: NavigationColumn[] = [
    {
      title: "Position",
      key: "position",
      render: (_: unknown, __: ModuleItem, index: number) => (
        <Badge variant="outline">{index + 1}</Badge>
      ),
    },
    {
      title: "Module",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Icon",
      key: "icon",
      render: (_: unknown, record: ModuleItem) => getNavIcon(record.icon),
    },
  ];

  const filteredModules = modules.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="space-y-3 text-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading modules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Failed to load modules</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 mb-10">
      {notification && (
        <Alert
          variant={notification.type === "error" ? "destructive" : "default"}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{notification.message}</AlertTitle>
          {notification.description && (
            <AlertDescription>{notification.description}</AlertDescription>
          )}
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Module Management</CardTitle>
            <Button
              onClick={saveChanges}
              disabled={userRole === "directory" || saving}
              size="lg"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="management">Modules</TabsTrigger>
              <TabsTrigger value="navigation">Mobile Navigation</TabsTrigger>
            </TabsList>

            <TabsContent value="management" className="space-y-4 mt-6">
              <div className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredModules.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Puzzle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No modules found</p>
                  </div>
                ) : (
                  filteredModules.map((module) => (
                    <div
                      key={module.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getNavIcon(module.icon)}
                      </div>

                      {/* Module Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{module.name}</span>
                          {module.required && (
                            <Badge variant="secondary" className="text-xs">
                              Required
                            </Badge>
                          )}
                          {module.isPopular && (
                            <Badge
                              variant="default"
                              className="text-xs bg-amber-500 hover:bg-amber-600"
                            >
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Toggle Popular */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setModules((prev) =>
                                  prev.map((m) =>
                                    m.id === module.id
                                      ? { ...m, isPopular: !m.isPopular }
                                      : m
                                  )
                                );
                              }}
                              className="gap-2"
                            >
                              {module.isPopular ? "★" : "☆"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {module.isPopular
                              ? "Remove from popular"
                              : "Mark as popular"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Module Status Toggle */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={module.enabled}
                                onCheckedChange={() => toggleModule(module.id)}
                                disabled={
                                  module.required || userRole === "directory"
                                }
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {module.required
                              ? "Required module"
                              : module.enabled
                              ? "Click to disable"
                              : "Click to enable"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* Mobile Navigation Toggle */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={module.showInMobileNavigation}
                                onCheckedChange={() =>
                                  toggleNavigation(module.id)
                                }
                                disabled={
                                  userRole === "directory" ||
                                  !module.enabled ||
                                  (!module.showInMobileNavigation &&
                                    modules.filter(
                                      (m) => m.showInMobileNavigation
                                    ).length >= 3)
                                }
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {!module.enabled
                              ? "Enable module first"
                              : module.showInMobileNavigation
                              ? "In navigation"
                              : modules.filter((m) => m.showInMobileNavigation)
                                  .length >= 3
                              ? "Max 3 modules"
                              : "Add to navigation"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="navigation" className="mt-6">
              <MobileNavigation
                modules={modules}
                navigationColumns={navigationColumns}
                navigationModules={navigationModules}
                userRole={userRole}
                saving={saving}
                saveChanges={saveChanges}
                onDragEnd={onDragEnd}
                toggleNavigation={toggleNavigation}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

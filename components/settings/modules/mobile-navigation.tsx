"use client";

import type React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Home, Menu, User, GripVertical, Trash2, Puzzle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export interface ModuleItem {
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

interface MobileNavigationProps {
  modules: ModuleItem[];
  navigationColumns: any[];
  navigationModules: ModuleItem[];
  userRole: string;
  saving: boolean;
  saveChanges: () => void;
  onDragEnd: (result: DropResult) => void;
  toggleNavigation: (id: string) => void;
}

const getNavIcon = (icon: string | null) => {
  if (!icon || typeof icon !== "string" || !(icon in LucideIcons)) {
    return <Puzzle className="h-5 w-5 text-primary" />;
  }
  const IconComponent = (LucideIcons as any)[icon] as React.ElementType;
  return <IconComponent className="h-5 w-5 text-primary" />;
};

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  modules,
  navigationColumns,
  navigationModules,
  userRole,
  saving,
  saveChanges,
  onDragEnd,
  toggleNavigation,
}) => {
  const remainingSlots =
    3 - modules.filter((m) => m.showInMobileNavigation).length;

  return (
    <div className="space-y-6">
      <Alert className="border-blue-200 bg-blue-50 text-foreground">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900 font-semibold">
          Mobile Navigation Configuration
        </AlertTitle>
        <AlertDescription className="text-blue-800">
          <div className="space-y-2 mt-2">
            <p className="text-sm">
              Home and Profile are fixed navigation items. You can select up to
              3 additional modules to show in the navigation.
            </p>
            <p
              className={`font-semibold text-sm ${
                remainingSlots === 0 ? "text-blue-900" : "text-blue-700"
              }`}
            >
              {remainingSlots} slot{remainingSlots !== 1 ? "s" : ""} remaining
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">
              Navigation Preview
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              How your navigation will appear on mobile devices
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <div className="flex justify-between items-end gap-4 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                {/* Home */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">
                    Home
                  </span>
                </div>

                {navigationModules.map((module) => (
                  <div
                    key={module.id}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
                      {getNavIcon(module.icon)}
                    </div>
                    <span className="text-xs font-medium text-slate-700 text-center line-clamp-1">
                      {module.name}
                    </span>
                  </div>
                ))}

                {/* Menu */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200">
                    <Menu className="h-5 w-5 text-slate-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">
                    Menu
                  </span>
                </div>

                {/* Profile */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-emerald-100 border border-emerald-200">
                    <User className="h-5 w-5 text-emerald-700" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">
                    Profile
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">
              Customize Navigation Order
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Drag to reorder items in your navigation
            </p>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="nav-table">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {navigationModules.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Puzzle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">
                          No items selected for navigation
                        </p>
                      </div>
                    ) : (
                      navigationModules.map((module, idx) => (
                        <Draggable
                          key={module.id}
                          draggableId={module.id}
                          index={idx}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                                dragSnapshot.isDragging
                                  ? "bg-primary/5 border-primary shadow-lg scale-102"
                                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              <div
                                {...dragProvided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>

                              <Badge
                                variant="outline"
                                className="w-6 h-6 flex items-center justify-center p-0 text-xs font-semibold bg-slate-100 text-slate-700 border-slate-200"
                              >
                                {idx + 1}
                              </Badge>

                              <div className="flex-1 flex items-center gap-3">
                                <div className="w-8 h-8 flex items-center justify-center rounded bg-slate-100">
                                  {getNavIcon(module.icon)}
                                </div>
                                <span className="font-medium text-slate-900">
                                  {module.name}
                                </span>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleNavigation(module.id)}
                                disabled={userRole === "directory"}
                                className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>

      {/* <div className="flex justify-end pt-4 border-t border-slate-200">
        <Button
          onClick={saveChanges}
          disabled={userRole === "directory" || saving}
          size="lg"
          className="gap-2"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div> */}
    </div>
  );
};

export default MobileNavigation;

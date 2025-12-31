"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@apollo/client";
import { CHECK_ENTITY_SUBSCRIPTIONS } from "@/graphql/quries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { extendedItems } from "@/components/layout/sidebar/menu-items";
import { ModuleIcon } from "./module-icon";

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: any;
}

const permissionTypes = ["Read", "Create", "Edit", "Delete"] as const;

export default function AddRoleDialog({
  open,
  onOpenChange,
  role,
}: AddRoleDialogProps) {
  const { toast } = useToast();
  const { data, loading } = useQuery(CHECK_ENTITY_SUBSCRIPTIONS);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [permissions, setPermissions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
      });
      // In a real app, you'd populate permissions from the role object
    } else {
      setFormData({ name: "", description: "" });
      setPermissions({});
    }
  }, [role, open]);

  const togglePermission = (moduleId: string, type: string) => {
    setPermissions((prev) => {
      const current = prev[moduleId] || [];
      const updated = current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type];

      return {
        ...prev,
        [moduleId]: updated,
      };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Add your API call here
    toast({
      title: role ? "Role Updated" : "Role Created",
      description: `The role "${formData.name}" has been ${
        role ? "updated" : "created"
      } successfully.`,
    });
    onOpenChange(false);
  };

  const modules = data?.checkEntitySubscription?.modules || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{role ? "Edit Role" : "Create New Role"}</DialogTitle>
          <DialogDescription>
            Define the role name and assign granular permissions for each
            module.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSave}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 py-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Content Moderator"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe what this role is for"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-bold">
                    Module Permissions
                  </Label>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    Granular Access
                  </p>
                </div>

                <div className="rounded-lg border bg-card">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[200px] font-bold">
                          Module
                        </TableHead>
                        {permissionTypes.map((type) => (
                          <TableHead
                            key={type}
                            className="text-center font-bold"
                          >
                            {type}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <Skeleton className="h-4 w-32" />
                              </TableCell>
                              {permissionTypes.map((t) => (
                                <TableCell key={t} className="text-center">
                                  <Skeleton className="h-4 w-4 mx-auto" />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        : modules.map((module: any) => (
                            <TableRow
                              key={module.id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <TableCell className="font-medium flex items-center gap-2">
                                <ModuleIcon
                                  name={module.name}
                                  fallback={module.icon}
                                />
                                {module.name}
                              </TableCell>
                              {permissionTypes.map((type) => (
                                <TableCell key={type} className="text-center">
                                  <div className="flex items-center justify-center">
                                    <Checkbox
                                      checked={(
                                        permissions[module.id] || []
                                      ).includes(type)}
                                      onCheckedChange={() =>
                                        togglePermission(module.id, type)
                                      }
                                      className="h-5 w-5"
                                    />
                                  </div>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </ScrollArea>

          <footer className="p-6 border-t bg-muted/20">
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="font-bold px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-bold px-8 shadow-lg shadow-primary/20"
              >
                {role ? "Save Changes" : "Create Role"}
              </Button>
            </DialogFooter>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}

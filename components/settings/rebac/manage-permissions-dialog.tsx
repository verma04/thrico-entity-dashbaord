"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ManagePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

const permissionGroups = [
  {
    category: "Content",
    permissions: [
      {
        id: "content.read",
        label: "Read Content",
        description: "View content and resources",
      },
      {
        id: "content.write",
        label: "Write Content",
        description: "Create and edit content",
      },
      {
        id: "content.delete",
        label: "Delete Content",
        description: "Remove content",
      },
      {
        id: "content.publish",
        label: "Publish Content",
        description: "Publish content publicly",
      },
    ],
  },
  {
    category: "Users",
    permissions: [
      {
        id: "users.view",
        label: "View Users",
        description: "See user information",
      },
      {
        id: "users.invite",
        label: "Invite Users",
        description: "Send user invitations",
      },
      {
        id: "users.manage",
        label: "Manage Users",
        description: "Edit user details and roles",
      },
      {
        id: "users.remove",
        label: "Remove Users",
        description: "Remove users from organization",
      },
    ],
  },
  {
    category: "Settings",
    permissions: [
      {
        id: "settings.view",
        label: "View Settings",
        description: "Access settings pages",
      },
      {
        id: "settings.edit",
        label: "Edit Settings",
        description: "Modify organization settings",
      },
      {
        id: "settings.billing",
        label: "Manage Billing",
        description: "Access billing information",
      },
    ],
  },
  {
    category: "Administration",
    permissions: [
      {
        id: "admin.full",
        label: "Full Admin Access",
        description: "Complete administrative control",
      },
      {
        id: "admin.audit",
        label: "View Audit Logs",
        description: "Access audit and activity logs",
      },
      {
        id: "admin.security",
        label: "Security Settings",
        description: "Manage security policies",
      },
    ],
  },
];

export default function ManagePermissionsDialog({
  open,
  onOpenChange,
  user,
}: ManagePermissionsDialogProps) {
  const { toast } = useToast();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    user?.permissions || []
  );

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = (category: string) => {
    const categoryPermissions =
      permissionGroups
        .find((g) => g.category === category)
        ?.permissions.map((p) => p.id) || [];

    const allSelected = categoryPermissions.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !categoryPermissions.includes(id))
      );
    } else {
      setSelectedPermissions((prev) => [
        ...prev,
        ...categoryPermissions.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleSave = () => {
    // Add your API call here
    toast({
      title: "Permissions Updated",
      description: `Permissions for ${user.name} have been updated successfully.`,
    });
    onOpenChange(false);
  };

  const isCategoryFullySelected = (category: string) => {
    const categoryPermissions =
      permissionGroups
        .find((g) => g.category === category)
        ?.permissions.map((p) => p.id) || [];
    return categoryPermissions.every((id) => selectedPermissions.includes(id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            Configure permissions for {user?.name}. Select the permissions this
            user should have.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6 py-4">
            {permissionGroups.map((group) => (
              <div key={group.category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{group.category}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectAll(group.category)}
                  >
                    {isCategoryFullySelected(group.category)
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                </div>

                <div className="space-y-3">
                  {group.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() =>
                          handleTogglePermission(permission.id)
                        }
                      />
                      <div className="flex-1 space-y-1">
                        <Label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {group.category !==
                  permissionGroups[permissionGroups.length - 1].category && (
                  <Separator />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            {selectedPermissions.length} permission
            {selectedPermissions.length !== 1 ? "s" : ""} selected
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

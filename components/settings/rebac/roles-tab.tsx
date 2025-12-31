"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Shield, Edit, Trash2 } from "lucide-react";
import AddRoleDialog from "./add-role-dialog";
import { ModuleIcon } from "./module-icon";

// Mock roles - will be replaced with actual data later
const mockRoles = [
  {
    id: "1",
    name: "Admin",
    description: "Full access to all modules and settings",
    permissionsCount: 24,
    modules: ["All"],
    status: "active",
  },
  {
    id: "2",
    name: "Community Manager",
    description: "Manage communities, discussions, and members",
    permissionsCount: 12,
    modules: ["Communities", "Members"],
    status: "active",
  },
  {
    id: "3",
    name: "Editor",
    description: "Create and edit content in assigned modules",
    permissionsCount: 8,
    modules: ["News", "Events"],
    status: "active",
  },
];

export default function RolesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState(mockRoles);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setSelectedRole(null);
            setShowAddDialog(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Modules</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-primary">{role.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {role.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.modules.map((mod) => (
                        <Badge
                          key={mod}
                          variant="secondary"
                          className="text-xs flex items-center gap-1"
                        >
                          <ModuleIcon
                            name={mod}
                            className="w-3 h-3"
                            iconClassName="w-3 h-3"
                          />
                          {mod}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {role.permissionsCount} permissions
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        role.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {role.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditRole(role)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddRoleDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        role={selectedRole}
      />
    </div>
  );
}

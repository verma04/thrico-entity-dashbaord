"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Search,
  Plus,
  MoreVertical,
  UserPlus,
  Shield,
  ShieldCheck,
} from "lucide-react";
import AddUserDialog from "./add-user-dialog";
import ManagePermissionsDialog from "./manage-permissions-dialog";
import { ModuleIcon } from "./module-icon";

// Mock data - replace with actual data from your backend
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
    role: "System Admin",
    roleType: "admin",
    modules: ["All Modules"],
    permissions: ["Full Access"],
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "",
    role: "Community Manager",
    roleType: "manager",
    modules: ["Communities", "Members", "Feed"],
    permissions: ["Create", "Read", "Edit", "Delete"],
    status: "active",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    avatar: "",
    role: "Content Editor",
    roleType: "editor",
    modules: ["News", "Events"],
    permissions: ["Read", "Edit"],
    status: "inactive",
  },
];

export default function UsersTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users] = useState(mockUsers);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManagePermissions = (user: any) => {
    setSelectedUser(user);
    setShowPermissionsDialog(true);
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Relationships</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="font-bold border-primary/30 text-primary bg-primary/5 capitalize"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.modules.map((mod: string) => (
                        <Badge
                          key={mod}
                          variant="secondary"
                          className="text-[10px] font-semibold uppercase tracking-tight flex items-center gap-1"
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
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((perm: string) => (
                        <Badge
                          key={perm}
                          variant="default"
                          className="text-[10px] bg-indigo-500 hover:bg-indigo-600"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                      className={
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {user.status}
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
                        <DropdownMenuItem
                          onClick={() => handleManagePermissions(user)}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <AddUserDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      {selectedUser && (
        <>
          <ManagePermissionsDialog
            open={showPermissionsDialog}
            onOpenChange={setShowPermissionsDialog}
            user={selectedUser}
          />
        </>
      )}
    </div>
  );
}

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
import {
  Search,
  Plus,
  MoreVertical,
  Building2,
  Link2,
  Users,
} from "lucide-react";
import AddPersonDialog from "./add-person-dialog";
import ManagePersonRelationshipsDialog from "./manage-person-relationships-dialog";

// Mock data - replace with actual data from your backend
const mockPersons = [
  {
    id: "1",
    name: "Acme Corporation",
    type: "Organization",
    description: "Technology company",
    members: 45,
    relationships: [
      { type: "parent_of", target: "Engineering Team" },
      { type: "parent_of", target: "Sales Team" },
    ],
    permissions: ["manage_users", "view_reports", "edit_settings"],
  },
  {
    id: "2",
    name: "Engineering Team",
    type: "Team",
    description: "Product development team",
    members: 12,
    relationships: [
      { type: "child_of", target: "Acme Corporation" },
      { type: "owns", target: "Project Alpha" },
    ],
    permissions: ["read", "write", "deploy"],
  },
  {
    id: "3",
    name: "Sales Team",
    type: "Team",
    description: "Sales and marketing",
    members: 8,
    relationships: [
      { type: "child_of", target: "Acme Corporation" },
      { type: "manages", target: "Customer Database" },
    ],
    permissions: ["read", "write"],
  },
  {
    id: "4",
    name: "Project Alpha",
    type: "Project",
    description: "New product initiative",
    members: 5,
    relationships: [{ type: "owned_by", target: "Engineering Team" }],
    permissions: ["read", "write"],
  },
];

const personTypeColors: Record<string, string> = {
  Organization: "bg-blue-100 text-blue-800",
  Team: "bg-purple-100 text-purple-800",
  Project: "bg-green-100 text-green-800",
  Group: "bg-orange-100 text-orange-800",
};

export default function PersonsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [persons] = useState(mockPersons);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [showRelationshipsDialog, setShowRelationshipsDialog] = useState(false);

  const filteredPersons = persons.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManageRelationships = (person: any) => {
    setSelectedPerson(person);
    setShowRelationshipsDialog(true);
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search persons..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </Button>
      </div>

      {/* Persons Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Relationships</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPersons.length > 0 ? (
              filteredPersons.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{person.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        personTypeColors[person.type] ||
                        "bg-gray-100 text-gray-800"
                      }
                    >
                      {person.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">
                      {person.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{person.members}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {person.relationships.slice(0, 2).map((rel, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {rel.type}: {rel.target}
                        </Badge>
                      ))}
                      {person.relationships.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{person.relationships.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {person.permissions.slice(0, 2).map((perm) => (
                        <Badge
                          key={perm}
                          variant="secondary"
                          className="text-xs"
                        >
                          {perm}
                        </Badge>
                      ))}
                      {person.permissions.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{person.permissions.length - 2}
                        </Badge>
                      )}
                    </div>
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
                        <DropdownMenuItem>Edit Person</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleManageRelationships(person)}
                        >
                          <Link2 className="h-4 w-4 mr-2" />
                          Manage Relationships
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Members</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete Person
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No persons found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <AddPersonDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      {selectedPerson && (
        <ManagePersonRelationshipsDialog
          open={showRelationshipsDialog}
          onOpenChange={setShowRelationshipsDialog}
          person={selectedPerson}
        />
      )}
    </div>
  );
}

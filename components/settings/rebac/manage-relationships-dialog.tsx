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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ManageRelationshipsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

const availablePersons = [
  { id: "1", name: "Acme Corporation", type: "Organization" },
  { id: "2", name: "Engineering Team", type: "Team" },
  { id: "3", name: "Sales Team", type: "Team" },
  { id: "4", name: "Project Alpha", type: "Project" },
  { id: "5", name: "Marketing Group", type: "Group" },
];

const relationshipTypes = [
  { value: "owner_of", label: "Owner of" },
  { value: "member_of", label: "Member of" },
  { value: "manager_of", label: "Manager of" },
  { value: "viewer_of", label: "Viewer of" },
  { value: "editor_of", label: "Editor of" },
  { value: "admin_of", label: "Admin of" },
];

export default function ManageRelationshipsDialog({
  open,
  onOpenChange,
  user,
}: ManageRelationshipsDialogProps) {
  const { toast } = useToast();
  const [relationships, setRelationships] = useState<
    Array<{ personId: string; relationType: string }>
  >([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectedRelation, setSelectedRelation] = useState("");

  const handleAddRelationship = () => {
    if (selectedPerson && selectedRelation) {
      setRelationships([
        ...relationships,
        { personId: selectedPerson, relationType: selectedRelation },
      ]);
      setSelectedPerson("");
      setSelectedRelation("");
    }
  };

  const handleRemoveRelationship = (index: number) => {
    setRelationships(relationships.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Add your API call here
    toast({
      title: "Relationships Updated",
      description: `Relationships for ${user.name} have been updated successfully.`,
    });
    onOpenChange(false);
  };

  const getPersonName = (personId: string) => {
    return availablePersons.find((p) => p.id === personId)?.name || "";
  };

  const getPersonType = (personId: string) => {
    return availablePersons.find((p) => p.id === personId)?.type || "";
  };

  const getRelationLabel = (relationType: string) => {
    return (
      relationshipTypes.find((r) => r.value === relationType)?.label ||
      relationType
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Relationships</DialogTitle>
          <DialogDescription>
            Manage relationships for {user?.name}. Add or remove relationships
            with persons.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add New Relationship */}
          <div className="space-y-4">
            <Label>Add New Relationship</Label>
            <div className="flex gap-2">
              <Select
                value={selectedRelation}
                onValueChange={setSelectedRelation}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Relation type" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipTypes.map((rel) => (
                    <SelectItem key={rel.value} value={rel.value}>
                      {rel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {availablePersons.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name} ({person.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                onClick={handleAddRelationship}
                disabled={!selectedPerson || !selectedRelation}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Current Relationships */}
          <div className="space-y-2">
            <Label>Current Relationships ({relationships.length})</Label>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              {relationships.length > 0 ? (
                <div className="space-y-2">
                  {relationships.map((rel, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {getRelationLabel(rel.relationType)}
                        </Badge>
                        <span className="font-medium">
                          {getPersonName(rel.personId)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {getPersonType(rel.personId)}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRelationship(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No relationships added yet
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

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
      </DialogContent>
    </Dialog>
  );
}

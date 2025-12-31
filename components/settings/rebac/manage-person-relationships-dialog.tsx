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

interface ManagePersonRelationshipsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  person: any;
}

const availableEntities = [
  { id: "u1", name: "John Doe", type: "User" },
  { id: "u2", name: "Jane Smith", type: "User" },
  { id: "p1", name: "Acme Corporation", type: "Organization" },
  { id: "p2", name: "Engineering Team", type: "Team" },
  { id: "p3", name: "Project Alpha", type: "Project" },
];

const relationshipTypes = [
  { value: "parent_of", label: "Parent of" },
  { value: "child_of", label: "Child of" },
  { value: "owns", label: "Owns" },
  { value: "owned_by", label: "Owned by" },
  { value: "manages", label: "Manages" },
  { value: "managed_by", label: "Managed by" },
  { value: "has_member", label: "Has member" },
  { value: "member_of", label: "Member of" },
];

export default function ManagePersonRelationshipsDialog({
  open,
  onOpenChange,
  person,
}: ManagePersonRelationshipsDialogProps) {
  const { toast } = useToast();
  const [relationships, setRelationships] = useState<
    Array<{ entityId: string; relationType: string }>
  >([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [selectedRelation, setSelectedRelation] = useState("");

  const handleAddRelationship = () => {
    if (selectedEntity && selectedRelation) {
      setRelationships([
        ...relationships,
        { entityId: selectedEntity, relationType: selectedRelation },
      ]);
      setSelectedEntity("");
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
      description: `Relationships for ${person.name} have been updated successfully.`,
    });
    onOpenChange(false);
  };

  const getEntityName = (entityId: string) => {
    return availableEntities.find((e) => e.id === entityId)?.name || "";
  };

  const getEntityType = (entityId: string) => {
    return availableEntities.find((e) => e.id === entityId)?.type || "";
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
          <DialogTitle>Manage Person Relationships</DialogTitle>
          <DialogDescription>
            Manage relationships for {person?.name}. Add or remove relationships
            with users and other persons.
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

              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  {availableEntities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name} ({entity.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                onClick={handleAddRelationship}
                disabled={!selectedEntity || !selectedRelation}
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
                          {getEntityName(rel.entityId)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {getEntityType(rel.entityId)}
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

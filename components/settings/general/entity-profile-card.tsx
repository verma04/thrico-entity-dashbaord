"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Store, Loader2 } from "lucide-react";
import { useUpdateEntityProfile } from "@/graphql/actions";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface EntityProfileCardProps {
  name: string;
  image: string;
  onNameUpdate: (newName: string) => void;
}

export const EntityProfileCard = ({
  name,
  image,
  onNameUpdate,
}: EntityProfileCardProps) => {
  const { toast } = useToast();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);

  // Sync internal temp name if main name prop changes while not editing
  // useEffect(() => {
  //   if (!isEditingName) setTempName(name);
  // }, [name, isEditingName]);

  const [updateProfile, { loading: updatingProfile }] = useUpdateEntityProfile({
    onCompleted: (data: any) => {
      if (data.updateEntityProfile.success) {
        toast({
          title: "Success",
          description:
            data.updateEntityProfile.message || "Profile updated successfully!",
        });
        onNameUpdate(data.updateEntityProfile.name);
        setIsEditingName(false);
      } else {
        toast({
          title: "Error",
          description:
            data.updateEntityProfile.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleNameSave = () => {
    if (tempName.trim() && tempName !== name) {
      updateProfile({
        variables: {
          input: {
            name: tempName.trim(),
          },
        },
      });
    } else {
      setIsEditingName(false);
    }
  };

  const handleNameCancel = () => {
    setTempName(name);
    setIsEditingName(false);
  };

  const handleNameEdit = () => {
    setTempName(name);
    setIsEditingName(true);
  };

  return (
    <>
      <Card className="border-0 bg-muted/30 p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarImage src={image} alt="Entity" />
              <AvatarFallback>
                <Store className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>

            {isEditingName ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="font-semibold"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleNameSave}
                  disabled={updatingProfile}
                >
                  {updatingProfile && (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  )}
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNameCancel}
                  disabled={updatingProfile}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{name}</h3>
                <p className="text-sm text-muted-foreground">
                  Entity name and image
                </p>
              </div>
            )}
          </div>

          {!isEditingName && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNameEdit}
              disabled={updatingProfile}
              className="self-end md:self-auto"
            >
              Edit
            </Button>
          )}
        </div>
      </Card>
      <Separator className="mt-8 mb-8" />
    </>
  );
};

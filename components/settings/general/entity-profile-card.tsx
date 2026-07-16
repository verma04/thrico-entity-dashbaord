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
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-muted/30 border border-border/40 group hover:border-primary/30 transition-all">
        <div className="relative group/avatar cursor-pointer">
          <Avatar className="w-24 h-24 border-4 border-background shadow-2xl rounded-3xl transition-transform group-hover/avatar:scale-105 duration-300">
            <AvatarImage src={image} alt="Entity" className="object-cover" />
            <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">
              {name?.[0] || 'E'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left w-full">
          {isEditingName ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="font-black text-lg h-12 bg-background/50 border-primary/20 focus:border-primary shadow-inner"
                  placeholder="Enter community name"
                  autoFocus
                />
                <div className="flex gap-2 shrink-0">
                  <Button
                    onClick={handleNameSave}
                    disabled={updatingProfile}
                    className="h-12 px-6 font-black shadow-lg shadow-primary/20"
                  >
                    {updatingProfile && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNameCancel}
                    disabled={updatingProfile}
                    className="h-12 px-6 font-bold"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-3xl font-black tracking-tighter text-foreground leading-tight">
                  {name}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  Active Community Workspace
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNameEdit}
                disabled={updatingProfile}
                className="font-black px-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-full border-primary/20"
              >
                Change Name
              </Button>
            </div>
          )}
        </div>
      </div>
      <Separator className="mt-8 mb-8" />
    </>
  );
};

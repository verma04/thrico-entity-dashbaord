"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Mail, ShieldCheck } from "lucide-react";

interface UserPreviewProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  roles: Array<{ id: string; name: string; description?: string }>;
}

export function UserPreview({ formData, roles }: UserPreviewProps) {
  const selectedRole = roles.find((r) => r.id === formData.role);
  const fullName =
    [formData.firstName, formData.lastName].filter(Boolean).join(" ") || "";
  const initials = [formData.firstName?.[0], formData.lastName?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
      <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
      <CardContent className="pt-6 space-y-5">
        {/* Profile Identity */}
        <div className="flex flex-col items-center text-center gap-3">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-lg font-bold">
              {initials || <UserPlus className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-lg leading-tight">
              {fullName || "Member Name"}
            </h4>
            {formData.email ? (
              <p className="text-sm text-muted-foreground mt-0.5 flex items-center justify-center gap-1">
                <Mail className="h-3 w-3" />
                {formData.email}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5">
                No email provided
              </p>
            )}
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Assigned Role */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3" />
            Assigned Role
          </h5>
          {selectedRole ? (
            <div className="p-3 rounded-md bg-primary/5 border border-primary/15">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{selectedRole.name}</p>
                  {selectedRole.description && (
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {selectedRole.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-14 border-2 border-dashed rounded-md bg-muted/50">
              <p className="text-[11px] text-muted-foreground">
                No role selected
              </p>
            </div>
          )}
        </div>

        <Separator className="opacity-50" />

        {/* Status Badge */}
        <div className="flex items-center justify-center gap-2">
          <Badge
            variant="outline"
            className="bg-blue-500/5 text-blue-600 border-blue-500/20"
          >
            Pending Invite
          </Badge>
        </div>

        <p className="text-[10px] text-center text-muted-foreground italic">
          Preview version — An invite email will be sent on creation
        </p>
      </CardContent>
    </Card>
  );
}

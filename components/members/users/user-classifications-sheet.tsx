import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { UserDetail } from "@/graphql/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, GraduationCap, MapPin, Type, Network } from "lucide-react";

export function UserClassificationsSheet({
  user,
  open,
  onOpenChange,
}: {
  user: UserDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!user || !user.user) return null;

  const u = user.user;
  const profile = u.profile;
  
  const avatarUrl = u.avatar
    ? u.avatar.startsWith("http")
      ? u.avatar
      : `https://cdn.thrico.network/${u.avatar}`
    : "";
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ");

  const experiences = profile?.experience || [];
  const educations = profile?.education || [];
  const location = typeof u.location === "string" ? u.location : u.location?.name;
  const headline = u.about?.headline || profile?.headline;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto border-l border-border bg-card">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-indigo-600" />
            User Classifications
          </SheetTitle>
          <SheetDescription>
            A consolidated view of the user's location, headline, education, and experience nodes.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">
              {u.firstName?.charAt(0)}
              {u.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Location Node */}
          {location && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Location Node
              </h4>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-rose-200 bg-card shadow-sm">
                <div className="bg-rose-100 text-rose-600 p-2 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {location}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Headline Node */}
          {headline && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Headline Node
              </h4>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-cyan-200 bg-card shadow-sm">
                <div className="bg-cyan-100 text-cyan-600 p-2 rounded-lg">
                  <Type className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground line-clamp-2">
                    {headline}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Experience Nodes */}
          {experiences.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Experience Nodes ({experiences.length})
              </h4>
              <div className="space-y-2">
                {experiences.map((exp: any) => (
                  <div
                    key={exp.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-orange-200 bg-card shadow-sm"
                  >
                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg shrink-0">
                      <Building className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">
                        {exp.company?.name || "Unknown Company"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {exp.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Nodes */}
          {educations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Education Nodes ({educations.length})
              </h4>
              <div className="space-y-2">
                {educations.map((edu: any) => (
                  <div
                    key={edu.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-emerald-200 bg-card shadow-sm"
                  >
                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg shrink-0">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">
                        {edu.school?.name || "Unknown School"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {edu.degree}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!location && !headline && experiences.length === 0 && educations.length === 0 && (
            <div className="text-center p-8 bg-slate-50 border border-slate-100 rounded-xl">
              <Network className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500">
                No classification nodes found for this user.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import React from "react";
import { Linkedin } from "lucide-react";
import { getMediaUrl } from "@/utils/utils";

export interface TeamMember {
  id: string;
  name?: string;
  designation?: string;
  avatar?: string;
  linkedin?: string;
  socialLinks?: { platform: string; url: string }[];
}

interface TeamDisplayGridProps {
  members: TeamMember[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function TeamDisplayGrid({
  members,
  columns = 3,
  className = "",
}: TeamDisplayGridProps) {
  if (!members || members.length === 0) return null;

  const gridColsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid gap-x-8 gap-y-10 ${gridColsClass} ${className}`}>
      {members.map((member) => {
        const avatarSrc = member.avatar
          ? member.avatar.startsWith("http")
            ? member.avatar
            : (getMediaUrl(member.avatar) || "")
          : null;

        const linkedinLink =
          member.linkedin ||
          member.socialLinks?.find(
            (link) => link.platform.toLowerCase() === "linkedin"
          )?.url;

        return (
          <div key={member.id} className="flex items-center gap-4">
            {/* Avatar */}
            {avatarSrc ? (
              <div className="relative w-28 h-28 shrink-0 overflow-hidden bg-muted">
                <img
                  src={avatarSrc}
                  alt={member.name || "Team Member"}
                  className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ) : (
              <div className="w-28 h-28 shrink-0 bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                {(member.name || "T").charAt(0).toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className="flex flex-col min-w-0 pt-1">
              {member.name && (
                <h3 className="font-bold text-base leading-tight text-foreground truncate">
                  {member.name}
                </h3>
              )}
              {member.designation && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {member.designation}
                </p>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-2 mt-2.5">
                {linkedinLink && (
                  <a
                    href={linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex bg-muted/60 hover:bg-muted p-1 rounded-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                    title={`${member.name || "Member"} on LinkedIn`}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                )}
                {member.socialLinks
                  ?.filter(
                    (link) => link.platform.toLowerCase() !== "linkedin"
                  )
                  .map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-2 py-0.5 rounded-sm transition-colors"
                    >
                      {link.platform}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

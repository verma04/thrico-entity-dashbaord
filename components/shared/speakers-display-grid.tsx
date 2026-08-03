"use client";

import { Linkedin } from "lucide-react";
import Image from "next/image";
import { getMediaUrl } from "@/utils/utils";

export interface Speaker {
  id: string;
  name: string;
  title?: string;
  company?: string;
  avatar?: string;
  socialLinks?: { platform: string; url: string }[];
  bio?: string;
}

interface SpeakersDisplayGridProps {
  speakers: Speaker[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function SpeakersDisplayGrid({
  speakers,
  columns = 3,
  className = "",
}: SpeakersDisplayGridProps) {
  // Determine grid columns classes based on the prop
  const gridColsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid gap-x-8 gap-y-10 ${gridColsClass} ${className}`}>
      {speakers.map((speaker) => {
        const avatarSrc = speaker.avatar
          ? speaker.avatar.startsWith("http")
            ? speaker.avatar
            : (getMediaUrl(speaker.avatar) || "")
          : null;

        const linkedinLink = speaker.socialLinks?.find(
          (link) => link.platform.toLowerCase() === "linkedin"
        );

        return (
          <div key={speaker.id} className="flex items-center gap-4">
            {/* Avatar */}
            {avatarSrc ? (
              <div className="relative w-28 h-28 shrink-0 overflow-hidden bg-muted">
                {/* We use standard img to avoid Next.js Image strict hostname constraints if needed, but for a polished look img is fine */}
                <img
                  src={avatarSrc}
                  alt={speaker.name}
                  className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ) : (
              <div className="w-28 h-28 shrink-0 bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                {speaker.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}

            {/* Info */}
            <div className="flex flex-col min-w-0 pt-1">
              <h3 className="font-bold text-base leading-tight text-foreground truncate">
                {speaker.name}
              </h3>
              
              {(speaker.title || speaker.company) && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {speaker.title}
                  {speaker.title && speaker.company && ", "}
                  {speaker.company}
                </p>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-2 mt-2.5">
                {linkedinLink && (
                  <a
                    href={linkedinLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex bg-muted/60 hover:bg-muted p-1 rounded-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                    title={`${speaker.name} on LinkedIn`}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                )}
                {speaker.socialLinks
                  ?.filter(
                    (link) => link.platform.toLowerCase() !== "linkedin" && link.url
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

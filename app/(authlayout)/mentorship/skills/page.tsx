"use client";

import React from "react";
import { MentorshipHeader } from "@/components/mentorship/mentorship-header";
import { MentorSkillsManager } from "@/components/mentorship/mentor-skills-manager";
import { GraduationCap } from "lucide-react";

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mentor Skills</h2>
          <p className="text-sm text-muted-foreground">
            Manage skills that mentors can offer on the platform.
          </p>
        </div>
      </div>

      <MentorSkillsManager />
    </div>
  );
}

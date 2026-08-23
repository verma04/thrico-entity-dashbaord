"use client";

import React from "react";
import { PolarisCard } from "../primitives/polaris-card";
import { TagInputField } from "../primitives/tag-input-field";

export interface TagsCardProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagsCard({ tags, onTagsChange }: TagsCardProps) {
  return (
    <PolarisCard title="Tags">
      <div className="space-y-1.5">
        <TagInputField tags={tags} onChange={onTagsChange} />
        <p className="text-[12px] text-[#616161] dark:text-zinc-400">
          Used to organize and filter discounts in reports and automations.
        </p>
      </div>
    </PolarisCard>
  );
}

"use client";

import React, { useState } from "react";
import LinkPreviewCard from "./link-preview-card";

interface FeedDescriptionProps {
  text: string;
}

export default function FeedDescription({ text }: FeedDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const shouldTruncate = text.length > 320;
  const displayText = shouldTruncate && !isExpanded ? text.slice(0, 300) + "..." : text;

  // Regex to match URLs, hashtags, mentions
  const tokenRegex = /(https?:\/\/[^\s]+|#[a-zA-Z0-9_-]+|@[a-zA-Z0-9_.-]+)/g;
  const parts = displayText.split(tokenRegex);

  // Extract URLs for previews (from full text)
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex) || [];
  const uniqueUrls = Array.from(new Set(urls)).slice(0, 2); // Show max 2 previews

  return (
    <div className="space-y-3">
      <p className="text-[14.5px] sm:text-[15px] leading-relaxed text-foreground/90 font-normal whitespace-pre-wrap break-words">
        {parts.map((part, i) => {
          if (part.match(/^https?:\/\//)) {
            return (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-4 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                {part}
              </a>
            );
          }
          if (part.startsWith("#")) {
            return (
              <span
                key={i}
                className="text-primary/90 font-medium hover:underline cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                {part}
              </span>
            );
          }
          if (part.startsWith("@")) {
            return (
              <span
                key={i}
                className="text-primary font-medium hover:underline cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>

      {shouldTruncate && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors inline-block"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}

      {uniqueUrls.length > 0 && (
        <div
          className="flex flex-col gap-2.5 pt-1"
          onClick={(e) => e.stopPropagation()}
        >
          {uniqueUrls.map((url, i) => (
            <LinkPreviewCard key={i} url={url} />
          ))}
        </div>
      )}
    </div>
  );
}

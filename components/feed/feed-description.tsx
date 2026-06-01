"use client";

import React from 'react';
import LinkPreviewCard from './link-preview-card';

export default function FeedDescription({ text }: { text: string }) {
  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  const urls = text.match(urlRegex) || [];
  
  // Deduplicate URLs to avoid rendering multiple previews for the same link
  const uniqueUrls = Array.from(new Set(urls));

  return (
    <div className="space-y-4">
      <p className="text-[17px] leading-relaxed text-foreground font-medium tracking-tight whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (part.match(urlRegex)) {
            return (
              <a 
                key={i} 
                href={part} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline underline-offset-4"
                onClick={(e) => e.stopPropagation()}
              >
                {part}
              </a>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
      
      {uniqueUrls.length > 0 && (
        <div className="flex flex-col gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
          {uniqueUrls.map((url, i) => (
            <LinkPreviewCard key={i} url={url} />
          ))}
        </div>
      )}
    </div>
  );
}

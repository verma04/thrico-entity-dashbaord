import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AnnouncementPreview({ formData }: { formData: any }) {
  const { subject, category, description } = formData;

  return (
    <Card className="w-full border shadow-sm ring-1 ring-border/50 bg-card overflow-hidden">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <CardTitle className="text-lg">
          {subject || "Announcement Subject"}
        </CardTitle>
        <CardDescription className="text-xs flex items-center gap-2 mt-1">
          <span className="bg-muted px-2 py-0.5 rounded-full border border-border">
            {category || "Category"}
          </span>
          <span>•</span>
          <span>{format(new Date(), "MMM d, yyyy")}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div 
          className="bg-muted/50 p-4 rounded-md text-sm prose prose-sm max-w-none dark:prose-invert min-h-[150px]"
          dangerouslySetInnerHTML={{ __html: description || "<p className='text-muted-foreground'>Preview description will appear here...</p>" }}
        />
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm" disabled>Close</Button>
        </div>
      </CardContent>
    </Card>
  );
}

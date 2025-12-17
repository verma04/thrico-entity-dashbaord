import { cn } from "@/lib/utils";
import { MapPin, Clock, DollarSign } from "lucide-react";

interface JobsMasonryProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const JobsMasonry = ({ content, previewDevice }: JobsMasonryProps) => {
  return (
    <div
      className={cn(
        "gap-4",
        previewDevice === "mobile"
          ? "grid grid-cols-1"
          : "columns-2 lg:columns-3 space-y-4"
      )}
    >
      {(content.jobs || []).map((job: any, index: number) => (
        <div
          key={index}
          className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer break-inside-avoid mb-4"
        >
          <div className="flex items-center gap-3 mb-3">
            {job.logo && (
              <img
                src={job.logo}
                alt={job.company}
                className="w-8 h-8 rounded object-cover border"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {job.title || "Job Title"}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {job.company || "Company"}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{job.location}</span>
              </div>
            )}
            {job.type && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{job.type}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-1 text-primary font-semibold">
                <DollarSign className="h-3 w-3" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>

          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {job.tags.slice(0, 3).map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

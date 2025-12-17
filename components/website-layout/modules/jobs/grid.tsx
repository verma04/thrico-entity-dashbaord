import { cn } from "@/lib/utils";
import { MapPin, Clock, DollarSign } from "lucide-react";

interface JobsGridProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const JobsGrid = ({ content, previewDevice }: JobsGridProps) => {
  return (
    <div
      className={cn(
        "grid gap-6",
        previewDevice === "mobile"
          ? "grid-cols-1"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {(content.jobs || []).map((job: any, index: number) => (
        <div
          key={index}
          className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-4 mb-4">
            {job.logo && (
              <img
                src={job.logo}
                alt={job.company}
                className="w-12 h-12 rounded object-cover border"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">
                {job.title || "Job Title"}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {job.company || "Company"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {job.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}
            {job.type && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <DollarSign className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>

          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {job.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
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

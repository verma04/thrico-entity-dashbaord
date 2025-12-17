import { cn } from "@/lib/utils";
import { MapPin, Clock, DollarSign } from "lucide-react";

interface JobsListProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const JobsList = ({ content, previewDevice }: JobsListProps) => {
  return (
    <div className="space-y-4">
      {(content.jobs || []).map((job: any, index: number) => (
        <div
          key={index}
          className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            {job.logo && (
              <img
                src={job.logo}
                alt={job.company}
                className="w-10 h-10 rounded object-cover border"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold truncate">{job.title || "Job Title"}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {job.company || "Company"}
              </p>
            </div>
            {job.salary && (
              <span className="text-sm font-semibold text-primary whitespace-nowrap">
                {job.salary}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm flex-wrap">
            {job.location && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{job.location}</span>
              </div>
            )}
            {job.type && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{job.type}</span>
              </div>
            )}
          </div>
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {job.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-background border rounded-full text-xs"
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

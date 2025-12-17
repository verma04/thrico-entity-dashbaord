import { cn } from "@/lib/utils";
import { MapPin, Clock, DollarSign, Users } from "lucide-react";

interface JobsCardsProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const JobsCards = ({ content, previewDevice }: JobsCardsProps) => {
  return (
    <div
      className={cn(
        "grid gap-6",
        previewDevice === "mobile"
          ? "grid-cols-1"
          : "grid-cols-1 sm:grid-cols-2"
      )}
    >
      {(content.jobs || []).map((job: any, index: number) => (
        <div
          key={index}
          className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {job.logo && (
                <img
                  src={job.logo}
                  alt={job.company}
                  className="w-16 h-16 rounded-lg object-cover border"
                />
              )}
              <div>
                <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                  {job.title || "Job Title"}
                </h3>
                <p className="text-muted-foreground">
                  {job.company || "Company"}
                </p>
              </div>
            </div>
            {job.salary && (
              <span className="font-bold text-xl text-primary">
                {job.salary}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}
            {job.type && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
            )}
            {job.department && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{job.department}</span>
              </div>
            )}
            {job.experience && (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 text-center font-bold">✓</span>
                <span>{job.experience}</span>
              </div>
            )}
          </div>

          {job.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {job.description}
            </p>
          )}

          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-background border rounded-full text-sm"
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

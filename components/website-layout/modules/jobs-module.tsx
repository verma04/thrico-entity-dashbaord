import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface JobsModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const JobsModule = ({ module, previewDevice }: JobsModuleProps) => {
  const { content, layout } = module;
  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      <ModuleHeader 
        title={content.title} 
        description={content.description}
        layoutSettings={content.layoutSettings}
      />


        {/* 1. GRID CARDS */}
        {layout === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(content.jobs || []).map((job: any, index: number) => (
              <div
                key={index}
                className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-4">
                  {job.logo && (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">
                      {job.title || "Job Title"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {job.company || "Company Name"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📍</span>
                    <span>{job.location || "Location"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {job.type || "Full-time"}
                    </span>
                    {job.salary && (
                      <span className="text-sm font-semibold">
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 3).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-muted text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 2. LIST VIEW */}
        {layout === "list" && (
          <div className="space-y-4">
            {(content.jobs || []).map((job: any, index: number) => (
              <div
                key={index}
                className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  {job.logo && (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-16 h-16 rounded-lg object-cover border flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-xl mb-1">
                          {job.title || "Job Title"}
                        </h3>
                        <p className="text-muted-foreground">
                          {job.company || "Company Name"}
                        </p>
                      </div>
                      {job.salary && (
                        <span className="font-bold text-lg text-primary">
                          {job.salary}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {job.description || "Job description..."}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>📍</span>
                        <span>{job.location || "Location"}</span>
                      </div>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {job.type || "Full-time"}
                      </span>
                      {job.tags && job.tags.length > 0 && (
                        <div className="flex gap-2">
                          {job.tags
                            .slice(0, 4)
                            .map((tag: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-muted text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. COMPACT CARDS */}
        {layout === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <h3 className="font-bold truncate">
                      {job.title || "Job Title"}
                    </h3>
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
                  <span className="text-muted-foreground">
                    📍 {job.location || "Location"}
                  </span>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                    {job.type || "Full-time"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. FEATURED MASONRY */}
        {layout === "masonry" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(content.jobs || []).map((job: any, index: number) => (
              <div
                key={index}
                className="bg-gradient-to-br from-card to-muted/20 border-2 rounded-2xl p-8 hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-6">
                  {job.logo && (
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-16 h-16 rounded-xl object-cover border-2 shadow-md"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl mb-2">
                      {job.title || "Job Title"}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      {job.company || "Company Name"}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {job.description || "Job description goes here..."}
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span className="font-medium">
                      {job.location || "Location"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium">
                      {job.type || "Full-time"}
                    </span>
                    {job.salary && (
                      <span className="font-bold text-xl text-primary">
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>
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
        )}

        {(content.jobs || []).length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No jobs yet. Add jobs in the settings panel.</p>
          </div>
        )}
    </ModuleContainer>
  );
};

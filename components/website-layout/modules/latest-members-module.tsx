import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface LatestMembersModuleProps {
  module: ModuleData;
  previewDevice: "desktop" | "tablet" | "mobile";
}

export const LatestMembersModule = ({
  module,
  previewDevice,
}: LatestMembersModuleProps) => {
  const { content, layout } = module;
  const members = content.members || [];

  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
      />

      {members.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <p className="text-muted-foreground">
            No members added yet. Add members in the settings panel.
          </p>
        </div>
      )}

      {/* 1. GRID CARDS */}
      {layout === "grid-cards" && members.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {members.map((member: any, idx: number) => (
            <div
              key={idx}
              className="bg-card border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <h3 className="font-bold mb-1">
                {member.name || `Member ${idx + 1}`}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {member.role || "Member"}
              </p>
              <p className="text-xs text-muted-foreground">
                Joined {member.joinedDate || "Recently"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 2. LIST VIEW */}
      {layout === "list-view" && members.length > 0 && (
        <div className="space-y-4">
          {members.map((member: any, idx: number) => (
            <div
              key={idx}
              className="bg-card border rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">
                  {member.name || `Member ${idx + 1}`}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {member.role || "Member"} • Joined{" "}
                  {member.joinedDate || "Recently"}
                </p>
              </div>
              {member.badge && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {member.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. COMPACT GRID */}
      {layout === "compact-grid" && members.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {members.map((member: any, idx: number) => (
            <div
              key={idx}
              className="bg-card border rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              <h3 className="font-semibold text-sm truncate">
                {member.name || `Member ${idx + 1}`}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {member.role || "Member"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 4. TIMELINE */}
      {layout === "timeline" && members.length > 0 && (
        <div className="max-w-3xl mx-auto">
          <div className="relative border-l-2 border-primary/20 pl-8 space-y-8">
            {members.map((member: any, idx: number) => (
              <div key={idx} className="relative">
                <div className="absolute -left-10 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                <div className="bg-card border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">👤</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        {member.name || `Member ${idx + 1}`}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {member.role || "Member"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        🎉 Joined {member.joinedDate || "Recently"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};

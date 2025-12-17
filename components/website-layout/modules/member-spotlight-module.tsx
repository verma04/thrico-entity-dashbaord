"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface MemberSpotlightModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const MemberSpotlightModule = ({
  module,
  previewDevice,
}: MemberSpotlightModuleProps) => {
  const { content, layout } = module;
  const members = content.members || [];

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-white border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

        {members.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border">
            <p className="text-muted-foreground">
              No members added yet. Add members in the settings panel.
            </p>
          </div>
        )}

        {/* Spotlight Cards Layout */}
        {layout === "spotlight-cards" && members.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {members.map((member: any, idx: number) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 rounded-lg border text-center"
              >
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                  {member.image && (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="font-semibold mb-2">
                  {member.name || `Member ${idx + 1}`}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {member.role || "Role or achievement"}
                </p>
                <p className="text-sm italic">
                  {member.quote ||
                    '"This community has helped me achieve my goals..."'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Featured Member Layout */}
        {layout === "featured-member" && members.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                  {members[0]?.image && (
                    <img
                      src={members[0].image}
                      alt={members[0].name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-2">
                    {members[0]?.name || "Featured Member"}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {members[0]?.role || "Community Leader"}
                  </p>
                  <blockquote className="text-lg italic text-gray-700 mb-4">
                    {members[0]?.quote ||
                      '"This community has been instrumental in my professional growth. The support and connections I\'ve made here are invaluable."'}
                  </blockquote>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {members[0]?.location && (
                      <span>📍 {members[0].location}</span>
                    )}
                    {members[0]?.title && <span>💼 {members[0].title}</span>}
                    {members[0]?.memberSince && (
                      <span>🎓 Member since {members[0].memberSince}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Member Carousel Layout */}
        {layout === "member-carousel" && members.length > 0 && (
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-pulse">
              {members.map((member: any, idx: number) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-64 bg-white p-6 rounded-lg border shadow-sm"
                >
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 overflow-hidden">
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="font-semibold text-center mb-2">
                    {member.name || `Member ${idx + 1}`}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    {member.role ||
                      [
                        "Developer",
                        "Designer",
                        "Manager",
                        "Analyst",
                        "Consultant",
                        "Founder",
                      ][idx]}
                  </p>
                  <p className="text-sm italic text-center">
                    {member.quote || '"Amazing community experience"'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid Profiles Layout */}
        {layout === "grid-profiles" && members.length > 0 && (
          <div className="grid md:grid-cols-4 gap-6">
            {members.map((member: any, idx: number) => (
              <div key={idx} className="text-center group cursor-pointer">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform overflow-hidden">
                  {member.image && (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-1">
                  {member.name || `Member ${idx + 1}`}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {member.role ||
                    ["Developer", "Designer", "Manager", "Analyst"][idx % 4]}
                </p>
              </div>
            ))}
          </div>
        )}
    </ModuleContainer>
  );
};

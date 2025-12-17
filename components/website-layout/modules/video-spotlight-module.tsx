"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface VideoSpotlightModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const VideoSpotlightModule = ({
  module,
  previewDevice,
}: VideoSpotlightModuleProps) => {
  const { content, layout } = module;
  const videos = content.videos || [];

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-black border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
        titleClassName="text-white"
        descriptionClassName="text-gray-300"
      />

        {/* Centered Video Layout */}
        {layout === "centered-video" && (
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-b-6 border-t-transparent border-b-transparent ml-1"></div>
              </div>
            </div>
          </div>
        )}

        {/* Video Gallery Layout */}
        {layout === "video-gallery" && (
          <>
            {videos.length === 0 && (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <p className="text-gray-400">
                  No videos added yet. Add videos in the settings panel.
                </p>
              </div>
            )}
            {videos.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {videos.map((video: any, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                  >
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-4 border-l-white border-t-3 border-b-3 border-t-transparent border-b-transparent ml-1"></div>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white text-sm font-medium">
                        {video.title || `Video ${idx + 1}`}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Playlist View Layout */}
        {layout === "playlist-view" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-b-6 border-t-transparent border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {videos.slice(0, 5).map((video: any, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-12 bg-gray-600 rounded flex items-center justify-center overflow-hidden">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-0 h-0 border-l-2 border-l-white border-t-1 border-b-1 border-t-transparent border-b-transparent ml-0.5"></div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-white text-sm font-medium">
                      {video.title || `Episode ${idx + 1}`}
                    </h4>
                    <p className="text-gray-400 text-xs">
                      {video.duration || `${5 + idx} min`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hero Video Layout */}
        {layout === "hero-video" && (
          <div className="relative -mx-12 -mt-12 -mb-12">
            <div className="relative h-96 bg-gray-800 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-0 h-0 border-l-10 border-l-white border-t-8 border-b-8 border-t-transparent border-b-transparent ml-1"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Watch Our Story
                  </h3>
                  <p className="text-gray-300">
                    Experience our journey in this featured video
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
    </ModuleContainer>
  );
};

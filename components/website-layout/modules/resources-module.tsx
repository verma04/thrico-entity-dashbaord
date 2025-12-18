"use client";

import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface ResourcesModuleProps {
  module: ModuleData;
  previewDevice: string;
}

export const ResourcesModule = ({
  module,
  previewDevice,
}: ResourcesModuleProps) => {
  const { content, layout } = module;
  const resources = content.resources || [];

  // Helper function to get emoji for resource type
  const getTypeEmoji = (type: string) => {
    const typeMap: Record<string, string> = {
      'PDF': '📄',
      'Video': '🎥',
      'Guide': '📖',
      'Template': '📋',
      'Whitepaper': '📝',
      'Ebook': '📚',
      'Worksheet': '📊',
      'Tool': '🛠️',
      'Other': '📦',
    };
    return typeMap[type] || '📄';
  };

  return (
    <ModuleContainer containerSettings={content.containerSettings} className="bg-slate-50 border-y">
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        alignment="center"
      />

      {resources.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-muted-foreground">
            No resources added yet. Add resources in the settings panel.
          </p>
        </div>
      )}

      {/* Resource Cards Layout */}
      {layout === "resource-cards" && resources.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {resources.map((resource: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-lg border hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                {resource.thumbnail ? (
                  <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {getTypeEmoji(resource.type)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  {resource.type && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                      {getTypeEmoji(resource.type)} {resource.type}
                    </span>
                  )}
                  {resource.fileSize && (
                    <span className="text-xs text-muted-foreground">
                      {resource.fileSize}
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold mb-2">
                  {resource.title || `Resource ${idx + 1}`}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {resource.description || "Download our comprehensive resource"}
                </p>

                {resource.category && (
                  <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded mb-3">
                    {resource.category}
                  </span>
                )}

                {resource.url && (
                  <div className="mt-4">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Download {getTypeEmoji(resource.type)}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Download List Layout */}
      {layout === "download-list" && resources.length > 0 && (
        <div className="space-y-3">
          {resources.map((resource: any, idx: number) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg border flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                {resource.thumbnail ? (
                  <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getTypeEmoji(resource.type)
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {resource.type && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">
                      {resource.type}
                    </span>
                  )}
                  {resource.category && (
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded">
                      {resource.category}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-1 truncate">
                  {resource.title || `Resource ${idx + 1}`}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {resource.description || "Download resource"}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {resource.fileSize && (
                  <span className="text-xs text-muted-foreground">
                    {resource.fileSize}
                  </span>
                )}
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Tabs Layout */}
      {layout === "category-tabs" && resources.length > 0 && (
        <div className="space-y-6">
          {(() => {
            // Group resources by category
            const grouped = resources.reduce((acc: any, resource: any) => {
              const category = resource.category || "Uncategorized";
              if (!acc[category]) acc[category] = [];
              acc[category].push(resource);
              return acc;
            }, {});

            return Object.entries(grouped).map(([category, categoryResources]: [string, any]) => (
              <div key={category} className="bg-white rounded-xl border overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
                  <h3 className="text-lg font-bold">{category}</h3>
                  <p className="text-blue-100 text-sm">{categoryResources.length} resources</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4 p-6">
                  {categoryResources.map((resource: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                        {resource.thumbnail ? (
                          <img
                            src={resource.thumbnail}
                            alt={resource.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getTypeEmoji(resource.type)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {resource.title || `Resource ${idx + 1}`}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {resource.type} {resource.fileSize && `• ${resource.fileSize}`}
                        </p>
                      </div>
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* Search Library Layout */}
      {layout === "search-library" && resources.length > 0 && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="w-full px-4 py-2 pl-10 border rounded-lg text-sm"
                  readOnly
                />
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex gap-2">
                {['All', 'PDF', 'Video', 'Guide'].map((filter) => (
                  <button
                    key={filter}
                    className={cn(
                      "px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                      filter === 'All'
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <p className="text-sm text-muted-foreground">
                Showing {resources.length} resources
              </p>
            </div>
            <div className="divide-y">
              {resources.map((resource: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                      {resource.thumbnail ? (
                        <img
                          src={resource.thumbnail}
                          alt={resource.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getTypeEmoji(resource.type)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          {resource.title || `Resource ${idx + 1}`}
                        </h3>
                        {resource.type && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">
                            {getTypeEmoji(resource.type)} {resource.type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {resource.description || "Download resource"}
                      </p>
                      <div className="flex items-center gap-4">
                        {resource.category && (
                          <span className="text-xs text-muted-foreground">
                            Category: <span className="text-purple-600 font-medium">{resource.category}</span>
                          </span>
                        )}
                        {resource.fileSize && (
                          <span className="text-xs text-muted-foreground">
                            Size: {resource.fileSize}
                          </span>
                        )}
                      </div>
                    </div>
                    {resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
                      >
                        Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ModuleContainer>
  );
};

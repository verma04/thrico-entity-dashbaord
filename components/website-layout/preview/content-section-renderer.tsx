import React from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface ContentSectionRendererProps {
  module: ModuleData;
  previewDevice?: "desktop" | "tablet" | "mobile";
}

export const ContentSectionRenderer = ({
  module,
  previewDevice = "desktop",
}: ContentSectionRendererProps) => {
  const { content } = module;
  const blocks = content.blocks || [];
  const alignment = content.alignment || "left";
  const backgroundColor = content.backgroundColor || "";
  const textColor = content.textColor || "";

  // Empty state
//   if (blocks.length === 0 && !content.image && !content.videoUrl) {
//     return (
//       <div className="py-12 px-4 sm:px-6 md:px-8 bg-background">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="bg-muted/30 border-2 border-dashed rounded-lg p-12">
//             <p className="text-muted-foreground">
//               No content blocks added yet. Add blocks in the settings panel.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8"
      style={{
        backgroundColor: backgroundColor || undefined,
        color: textColor || undefined,
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        {/* Section Header */}
        {(content.title || content.description) && (
          <div className={cn("space-y-3 sm:space-y-4", alignmentClasses[alignment as keyof typeof alignmentClasses])}>
            {content.heading && (
              <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">
                {content.heading}
              </p>
            )}
            {content.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {content.title}
              </h2>
            )}
            {content.description && (
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {content.description}
              </p>
            )}
          </div>
        )}

        {/* Featured Image */}
        {content.image && (
          <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
            <img
              src={content.image}
              alt="Featured content"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Video */}
        {content.videoUrl && (
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-black aspect-video">
            {content.videoUrl.includes("youtube.com") ||
            content.videoUrl.includes("youtu.be") ? (
              <iframe
                src={content.videoUrl.replace("watch?v=", "embed/")}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white space-y-4">
                  <Play className="h-16 w-16 mx-auto opacity-50" />
                  <p className="text-sm opacity-75">Video Player</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content Blocks */}
        <div className={cn("space-y-6 sm:space-y-8", alignmentClasses[alignment as keyof typeof alignmentClasses])}>
          {blocks.map((block: any, idx: number) => (
            <div key={idx}>
              {/* Text Block */}
              {block.type === "text" && (
                <div className="space-y-3">
                  {block.title && (
                    <h3 className="text-xl sm:text-2xl font-bold">
                      {block.title}
                    </h3>
                  )}
                  <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                    {block.content}
                  </p>
                </div>
              )}

              {/* Image Block */}
              {block.type === "image" && block.content && (
                <div className="rounded-lg sm:rounded-xl overflow-hidden shadow-md">
                  <img
                    src={block.content}
                    alt={block.title || `Image ${idx + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* Video Block */}
              {block.type === "video" && block.content && (
                <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-md bg-black aspect-video">
                  {block.content.includes("youtube.com") ||
                  block.content.includes("youtu.be") ? (
                    <iframe
                      src={block.content.replace("watch?v=", "embed/")}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={block.content}
                      controls
                      className="absolute inset-0 w-full h-full"
                    />
                  )}
                </div>
              )}

              {/* Quote Block */}
              {block.type === "quote" && (
                <blockquote className="border-l-4 border-primary pl-4 sm:pl-6 py-2 italic">
                  {block.title && (
                    <p className="text-lg sm:text-xl font-semibold mb-2 not-italic">
                      {block.title}
                    </p>
                  )}
                  <p className="text-base sm:text-lg leading-relaxed">
                    "{block.content}"
                  </p>
                  {block.author && (
                    <footer className="mt-3 text-sm text-muted-foreground not-italic">
                      — {block.author}
                    </footer>
                  )}
                </blockquote>
              )}

              {/* Code Block */}
              {block.type === "code" && (
                <div className="space-y-2">
                  {block.title && (
                    <p className="text-sm font-semibold text-muted-foreground">
                      {block.title}
                    </p>
                  )}
                  <pre className="bg-muted/50 border rounded-lg p-4 overflow-x-auto">
                    <code className="text-xs sm:text-sm font-mono">
                      {block.content}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call-to-Action */}
        {content.buttonText && content.buttonLink && (
          <div className={cn("pt-4", alignmentClasses[alignment as keyof typeof alignmentClasses])}>
            <a
              href={content.buttonLink}
              className={cn(
                "inline-block px-6 py-3 rounded-lg font-semibold transition-colors",
                content.buttonStyle === "primary" &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                content.buttonStyle === "secondary" &&
                  "bg-secondary text-secondary-foreground hover:bg-secondary/90",
                content.buttonStyle === "outline" &&
                  "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
                content.buttonStyle === "ghost" &&
                  "hover:bg-muted text-foreground",
                !content.buttonStyle &&
                  "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {content.buttonText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

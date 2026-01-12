import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface CeoMessageModuleProps {
  content: ModuleData["content"];
  layout: string;
}

export const CeoMessageModule = ({
  content,
  layout,
}: CeoMessageModuleProps) => {
  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-gradient-to-b from-background to-muted/20"
    >
      <ModuleHeader
        title={content.title}
        description={content.description}
        layoutSettings={content.layoutSettings}
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
      />

      {(content.messages || []).map((message: any, index: number) => (
        <div key={index} className={cn("mb-16 last:mb-0")}>
          {/* 1. CLASSIC CARD */}
          {layout === "classic-card" && (
            <div className="bg-card border rounded-2xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {message.image && (
                  <div className="flex-shrink-0">
                    <img
                      src={message.image}
                      alt={message.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-1">
                    {message.name || "CEO Name"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {message.designation || "Chief Executive Officer"}
                  </p>
                  <p className="text-lg leading-relaxed mb-6">
                    {message.message || "Message content goes here..."}
                  </p>
                  {message.signature && (
                    <img
                      src={message.signature}
                      alt="Signature"
                      className="h-16 object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. SPLIT SCREEN */}
          {layout === "split-screen" && (
            <div
              className={cn(
                "bg-card border rounded-2xl overflow-hidden shadow-lg",
                message.image
                  ? "grid md:grid-cols-2 gap-0 min-h-[500px]"
                  : "p-12"
              )}
            >
              {message.image && (
                <div className="relative">
                  <img
                    src={message.image}
                    alt={message.name}
                    className="w-full h-full object-cover"
                  />
                  {message.signature && (
                    <div className="absolute bottom-8 left-8 bg-white/90 p-4 rounded-lg">
                      <img
                        src={message.signature}
                        alt="Signature"
                        className="h-12 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="p-12 flex flex-col justify-center">
                <div className="text-6xl text-primary/20 mb-4">"</div>
                <p className="text-xl leading-relaxed mb-8 italic">
                  {message.message || "Message content goes here..."}
                </p>
                <div>
                  <h3 className="text-2xl font-bold">
                    {message.name || "CEO Name"}
                  </h3>
                  <p className="text-muted-foreground">
                    {message.designation || "Chief Executive Officer"}
                  </p>
                </div>
                {!message.image && message.signature && (
                  <div className="mt-6">
                    <img
                      src={message.signature}
                      alt="Signature"
                      className="h-12 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. CENTERED */}
          {layout === "centered" && (
            <div className="max-w-3xl mx-auto text-center">
              {message.image && (
                <img
                  src={message.image}
                  alt={message.name}
                  className="w-40 h-40 rounded-full object-cover border-4 border-primary/20 mx-auto mb-6"
                />
              )}
              <h3 className="text-3xl font-bold mb-2">
                {message.name || "CEO Name"}
              </h3>
              <p className="text-muted-foreground mb-8">
                {message.designation || "Chief Executive Officer"}
              </p>
              <p className="text-lg leading-relaxed mb-8">
                {message.message || "Message content goes here..."}
              </p>
              {message.signature && (
                <img
                  src={message.signature}
                  alt="Signature"
                  className="h-16 object-contain mx-auto"
                />
              )}
            </div>
          )}

          {/* 4. TESTIMONIAL STYLE */}
          {layout === "testimonial" && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-muted/30 rounded-2xl p-8 relative">
                <div className="flex items-start gap-4 mb-6">
                  {message.image && (
                    <img
                      src={message.image}
                      alt={message.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">
                      {message.name || "CEO Name"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {message.designation || "Chief Executive Officer"}
                    </p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed pl-4 border-l-4 border-primary">
                  {message.message || "Message content goes here..."}
                </p>
                {message.signature && (
                  <div className="mt-6 flex justify-end">
                    <img
                      src={message.signature}
                      alt="Signature"
                      className="h-12 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. MODERN ASYMMETRIC */}
          {layout === "modern-asymmetric" && (
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-3xl font-bold mb-2">
                    {message.name || "CEO Name"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {message.designation || "Chief Executive Officer"}
                  </p>
                  <p className="text-lg leading-relaxed mb-6">
                    {message.message || "Message content goes here..."}
                  </p>
                  {message.signature && (
                    <img
                      src={message.signature}
                      alt="Signature"
                      className="h-14 object-contain"
                    />
                  )}
                </div>
                {message.image && (
                  <div className="md:col-span-1">
                    <img
                      src={message.image}
                      alt={message.name}
                      className="w-full aspect-square object-cover rounded-xl shadow-xl"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </ModuleContainer>
  );
};

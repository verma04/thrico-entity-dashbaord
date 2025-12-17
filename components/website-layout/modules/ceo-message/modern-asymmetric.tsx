import { cn } from "@/lib/utils";

interface ModernAsymmetricProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const ModernAsymmetric = ({
  content,
  previewDevice,
}: ModernAsymmetricProps) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div
        className={cn(
          "relative overflow-hidden",
          previewDevice === "mobile" ? "flex-col" : "grid grid-cols-3 gap-12"
        )}
      >
        <div
          className={cn(
            "space-y-6",
            previewDevice !== "mobile" && "col-span-2"
          )}
        >
          <div className="space-y-4">
            <div className="w-16 h-1 bg-primary"></div>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
              {content.category || "MESSAGE FROM LEADERSHIP"}
            </h3>
            <blockquote className="text-2xl md:text-3xl leading-relaxed font-light">
              {content.message || "Welcome message from our leadership team."}
            </blockquote>
          </div>

          <div className="flex items-center gap-4 pt-6">
            {content.image ? (
              <img
                src={content.image}
                alt={content.name || "CEO"}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {(content.name || "CEO").charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h4 className="text-lg font-semibold">
                {content.name || "John Smith"}
              </h4>
              <p className="text-muted-foreground">
                {content.title || "CEO & Founder"}
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "relative",
            previewDevice === "mobile" ? "mt-8 h-64" : "h-full min-h-[400px]"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl">
            <div className="absolute inset-4 border-2 border-dashed border-primary/30 rounded-xl flex items-center justify-center">
              <span className="text-primary/50 text-sm font-medium">
                Background Pattern
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

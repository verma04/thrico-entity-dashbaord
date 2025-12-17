import { cn } from "@/lib/utils";

interface SplitScreenProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const SplitScreen = ({ content, previewDevice }: SplitScreenProps) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div
        className={cn(
          "bg-card border rounded-2xl overflow-hidden shadow-lg",
          previewDevice === "mobile" ? "flex-col" : "grid grid-cols-2"
        )}
      >
        <div className="relative">
          {content.image ? (
            <img
              src={content.image}
              alt={content.name || "CEO"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">
                  {(content.name || "CEO").charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="text-4xl text-primary/30">"</div>
            <blockquote className="text-lg md:text-xl leading-relaxed">
              {content.message || "Welcome message from our leadership team."}
            </blockquote>
            <div className="pt-4">
              <h4 className="text-xl font-bold">
                {content.name || "John Smith"}
              </h4>
              <p className="text-muted-foreground">
                {content.title || "CEO & Founder"}
              </p>
              {content.company && (
                <p className="text-sm text-muted-foreground mt-1">
                  {content.company}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

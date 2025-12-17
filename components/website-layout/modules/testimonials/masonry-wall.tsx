import { cn } from "@/lib/utils";

interface MasonryWallProps {
  content: Record<string, any>;
}

export const MasonryWall = ({ content }: MasonryWallProps) => {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {(content.testimonials || []).map((testimonial: any, index: number) => (
        <div
          key={index}
          className="break-inside-avoid bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          {testimonial.rating && (
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "text-lg",
                    i < testimonial.rating ? "text-yellow-500" : "text-gray-300"
                  )}
                >
                  ★
                </span>
              ))}
            </div>
          )}
          <p className="text-sm leading-relaxed mb-4">
            "{testimonial.testimonial || "Testimonial text..."}"
          </p>
          <div className="flex items-center gap-3 pt-4 border-t">
            {testimonial.image && (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <h4 className="font-semibold text-sm">
                {testimonial.name || "Customer Name"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {testimonial.role || "Position"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

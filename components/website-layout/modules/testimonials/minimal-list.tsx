import { cn } from "@/lib/utils";

interface MinimalListProps {
  content: Record<string, any>;
}

export const MinimalList = ({ content }: MinimalListProps) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {(content.testimonials || []).map((testimonial: any, index: number) => (
        <div
          key={index}
          className="flex gap-4 items-start p-4 rounded-lg hover:bg-muted/50 transition-colors"
        >
          {testimonial.image && (
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">
                  {testimonial.name || "Customer Name"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role || "Position"}
                  {testimonial.company && ` at ${testimonial.company}`}
                </p>
              </div>
              {testimonial.rating && (
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "text-sm",
                        i < testimonial.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      )}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              "{testimonial.testimonial || "Testimonial text..."}"
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

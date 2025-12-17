import { cn } from "@/lib/utils";

interface GridCardsProps {
  content: Record<string, any>;
}

export const GridCards = ({ content }: GridCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(content.testimonials || []).map((testimonial: any, index: number) => (
        <div
          key={index}
          className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            {testimonial.image && (
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold">
                {testimonial.name || "Customer Name"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {testimonial.role || "Position"}
                {testimonial.company && ` at ${testimonial.company}`}
              </p>
            </div>
          </div>
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
          <p className="text-sm leading-relaxed text-muted-foreground">
            "{testimonial.testimonial || "Testimonial text..."}"
          </p>
        </div>
      ))}
    </div>
  );
};

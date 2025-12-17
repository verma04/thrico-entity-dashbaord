import { cn } from "@/lib/utils";

interface CarouselProps {
  content: Record<string, any>;
}

export const Carousel = ({ content }: CarouselProps) => {
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        {(content.testimonials || []).length > 0 && (
          <div className="bg-card border rounded-2xl p-12 shadow-lg text-center">
            <div className="text-6xl text-primary/20 mb-4">"</div>
            <p className="text-xl leading-relaxed mb-8 italic">
              {content.testimonials[0].testimonial || "Testimonial text..."}
            </p>
            {content.testimonials[0].rating && (
              <div className="flex gap-1 justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "text-2xl",
                      i < content.testimonials[0].rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-center gap-4">
              {content.testimonials[0].image && (
                <img
                  src={content.testimonials[0].image}
                  alt={content.testimonials[0].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="text-left">
                <h4 className="font-bold text-lg">
                  {content.testimonials[0].name || "Customer Name"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {content.testimonials[0].role || "Position"}
                  {content.testimonials[0].company &&
                    ` at ${content.testimonials[0].company}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {(content.testimonials || []).length > 1 && (
        <div className="flex gap-2 justify-center mt-6">
          {(content.testimonials || []).map((_: any, i: number) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all",
                i === 0 ? "w-8 bg-primary" : "w-2 bg-muted"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

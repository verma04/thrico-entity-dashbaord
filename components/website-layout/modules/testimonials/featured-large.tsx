import { cn } from "@/lib/utils";

interface FeaturedLargeProps {
  content: Record<string, any>;
}

export const FeaturedLarge = ({ content }: FeaturedLargeProps) => {
  return (
    <div className="max-w-5xl mx-auto">
      {(content.testimonials || []).length > 0 && (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-12 md:p-16">
          <div className="text-center space-y-8">
            {content.testimonials[0].image && (
              <img
                src={content.testimonials[0].image}
                alt={content.testimonials[0].name}
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-xl"
              />
            )}
            {content.testimonials[0].rating && (
              <div className="flex gap-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "text-3xl",
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
            <div className="text-5xl text-primary/30 leading-none">"</div>
            <p className="text-2xl md:text-3xl leading-relaxed font-medium max-w-3xl mx-auto">
              {content.testimonials[0].testimonial ||
                "Testimonial text goes here..."}
            </p>
            <div className="pt-4">
              <h4 className="text-xl font-bold">
                {content.testimonials[0].name || "Customer Name"}
              </h4>
              <p className="text-muted-foreground">
                {content.testimonials[0].role || "Position"}
                {content.testimonials[0].company &&
                  ` at ${content.testimonials[0].company}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { cn } from "@/lib/utils";

interface MarqueeProps {
  content: Record<string, any>;
}

export const Marquee = ({ content }: MarqueeProps) => {
  return (
    <div className="relative overflow-hidden">
      <div className="flex gap-6 animate-marquee">
        {[...(content.testimonials || []), ...(content.testimonials || [])].map(
          (testimonial: any, index: number) => (
            <div
              key={index}
              className="flex-shrink-0 w-96 bg-card border rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-sm">
                    {testimonial.name || "Customer"}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role || "Position"}
                  </p>
                </div>
                {testimonial.rating && (
                  <div className="ml-auto flex gap-0.5">
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
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                "{testimonial.testimonial || "Testimonial..."}"
              </p>
            </div>
          )
        )}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

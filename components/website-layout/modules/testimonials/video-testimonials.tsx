import { cn } from "@/lib/utils";

interface VideoTestimonialsProps {
  content: Record<string, any>;
}

export const VideoTestimonials = ({ content }: VideoTestimonialsProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(content.testimonials || []).map((testimonial: any, index: number) => (
        <div
          key={index}
          className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
              <div className="w-0 h-0 border-l-[12px] border-l-primary border-y-[8px] border-y-transparent ml-1" />
            </div>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {Math.floor(Math.random() * 3) + 1}:30
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
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
            {testimonial.rating && (
              <div className="flex gap-0.5 mb-2">
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
            <p className="text-xs text-muted-foreground line-clamp-2">
              "{testimonial.testimonial || "Watch their success story..."}"
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

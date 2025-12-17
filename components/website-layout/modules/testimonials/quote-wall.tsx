interface QuoteWallProps {
  content: Record<string, any>;
}

export const QuoteWall = ({ content }: QuoteWallProps) => {
  return (
    <div className="space-y-8">
      {/* Featured Quote */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
        {(content.testimonials || []).length > 0 && (
          <>
            <div className="text-7xl text-primary/30 leading-none mb-4">"</div>
            <blockquote className="text-2xl font-medium leading-relaxed mb-6 max-w-3xl mx-auto">
              {content.testimonials[0].testimonial ||
                "Featured testimonial quote goes here..."}
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              {content.testimonials[0].image && (
                <img
                  src={content.testimonials[0].image}
                  alt={content.testimonials[0].name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div className="text-left">
                <h4 className="font-bold">
                  {content.testimonials[0].name || "Customer Name"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {content.testimonials[0].role || "Position"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quote Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(content.testimonials || [])
          .slice(1)
          .map((testimonial: any, index: number) => (
            <div
              key={index}
              className="bg-card border rounded-lg p-4 text-center"
            >
              <div className="text-3xl text-primary/20 mb-2">"</div>
              <p className="text-sm leading-relaxed mb-3 italic">
                {testimonial.testimonial || "Quote text..."}
              </p>
              <div className="text-xs text-muted-foreground">
                — {testimonial.name || "Customer"}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

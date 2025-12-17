interface SocialProofStatsProps {
  content: Record<string, any>;
}

export const SocialProofStats = ({ content }: SocialProofStatsProps) => {
  // Get stats with default values
  const stats = {
    averageRating: content.stats?.averageRating || "4.9★",
    reviewsCount: content.stats?.reviewsCount || `${(content.testimonials || []).length || 127}+`,
    satisfactionRate: content.stats?.satisfactionRate || "98%",
    happyCustomers: content.stats?.happyCustomers || "50K+",
  };

  return (
    <div className="space-y-12">
      {/* Stats Overview */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-6">What Our Customers Say</h3>
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <div className="text-3xl font-bold">{stats.averageRating}</div>
            <div className="text-green-200 text-sm">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.reviewsCount}</div>
            <div className="text-green-200 text-sm">Reviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.satisfactionRate}</div>
            <div className="text-green-200 text-sm">Satisfied</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.happyCustomers}</div>
            <div className="text-green-200 text-sm">Happy Customers</div>
          </div>
        </div>
      </div>

      {/* Sample Testimonials */}
      <div className="grid md:grid-cols-3 gap-6">
        {(content.testimonials || [])
          .slice(0, 6)
          .map((testimonial: any, index: number) => (
            <div
              key={index}
              className="bg-card border rounded-lg p-4 text-center"
            >
              {testimonial.image && (
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mx-auto mb-3"
                />
              )}
              <div className="flex justify-center gap-0.5 mb-2">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-sm">
                    ★
                  </span>
                ))}
              </div>
              <h4 className="font-semibold text-sm mb-1">
                {testimonial.name || "Customer"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {testimonial.role || "Verified Customer"}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

interface TestimonialProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const Testimonial = ({ content, previewDevice }: TestimonialProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            {content.image ? (
              <img
                src={content.image}
                alt={content.name || "CEO"}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-2xl font-bold text-primary">
                  {(content.name || "CEO").charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-500 text-xl">
                  ★
                </span>
              ))}
            </div>

            <blockquote className="text-lg md:text-xl leading-relaxed italic">
              "{content.message || "Welcome message from our leadership team."}"
            </blockquote>

            <div>
              <h4 className="text-lg font-bold">
                {content.name || "John Smith"}
              </h4>
              <p className="text-muted-foreground">
                {content.title || "CEO & Founder"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

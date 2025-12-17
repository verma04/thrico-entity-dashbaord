import { cn } from "@/lib/utils";

export const HeroCarousel = ({ content }: { content: Record<string, any> }) => {
  return (
    <div className="w-full h-full relative">
      {content.slides && content.slides.length > 0 ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-40"
            style={{
              backgroundImage: `url(${content.slides[0].image})`,
            }}
          />
          <div className="relative z-10 text-center space-y-6 max-w-3xl px-4">
            <h1 className="text-5xl font-bold tracking-tight">
              {content.slides[0].title}
            </h1>
            <p className="text-xl opacity-90">{content.slides[0].subtitle}</p>
            <a
              href={content.slides[0].ctaLink}
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              {content.slides[0].ctaText}
            </a>

            <div className="flex gap-2 justify-center mt-8">
              {content.slides.map((_: any, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === 0 ? "w-8 bg-primary" : "w-1.5 bg-white/50"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center opacity-50">
          Add slides in settings to see carousel
        </div>
      )}
    </div>
  );
};

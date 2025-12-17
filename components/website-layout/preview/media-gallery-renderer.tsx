import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";

export const MediaGalleryRenderer = ({
  module,
  previewDevice,
}: {
  module: ModuleData;
  previewDevice: string;
}) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const title = content.title || "Gallery";
  const description = content.description || "Our latest work and projects";
  const images = content.images || [
    { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop", alt: "Gallery Image 1", caption: "Beautiful landscape" },
    { src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop", alt: "Gallery Image 2", caption: "City architecture" },
    { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop", alt: "Gallery Image 3", caption: "Nature photography" },
    { src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop", alt: "Gallery Image 4", caption: "Urban design" },
    { src: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&h=600&fit=crop", alt: "Gallery Image 5", caption: "Modern art" },
    { src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop", alt: "Gallery Image 6", caption: "Street photography" },
  ];

  // Grid Gallery
  if (layout === "grid-gallery") {
    return (
      <section className="py-16 bg-slate-50">
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          <div
            className={cn(
              "grid gap-4",
              isMobile ? "grid-cols-2" : "grid-cols-4"
            )}
          >
            {images.map((image: any, idx: number) => (
              <div
                key={idx}
                className="group relative aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all"
              >
                {image.src ? (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <span className="text-xs text-muted-foreground">
                      {image.title}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Masonry Gallery
  if (layout === "masonry-gallery") {
    return (
      <section className="py-16 bg-background">
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          <div
            className={cn(
              "columns-2 gap-4",
              !isMobile && "md:columns-3 lg:columns-4"
            )}
          >
            {images.map((image: any, idx: number) => (
              <div
                key={idx}
                className="group relative mb-4 break-inside-avoid bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                style={{ height: `${200 + (idx % 3) * 50}px` }}
              >
                {image.src ? (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      {image.title}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Lightbox Gallery
  if (layout === "lightbox-gallery") {
    return (
      <section className="py-16 bg-slate-50">
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          <div
            className={cn(
              "grid gap-6",
              isMobile ? "grid-cols-1" : "grid-cols-3"
            )}
          >
            {images.slice(0, 6).map((image: any, idx: number) => (
              <div
                key={idx}
                className="group relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
              >
                {image.src ? (
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      {image.title}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Carousel Gallery
  if (layout === "carousel-gallery") {
    return (
      <section className="py-16 bg-background">
        <div className={cn("container mx-auto", isMobile && "px-4")}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
              {images[0]?.src ? (
                <img
                  src={images[0].src}
                  alt={images[0].alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-lg text-muted-foreground">
                    Featured Image
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4 justify-center">
              {images.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors cursor-pointer",
                    idx === 0 ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default Grid Gallery
  return (
    <section className="py-16 bg-slate-50">
      <div className={cn("container mx-auto", isMobile && "px-4")}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <div
          className={cn("grid gap-4", isMobile ? "grid-cols-2" : "grid-cols-4")}
        >
          {images.map((image: any, idx: number) => (
            <div
              key={idx}
              className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

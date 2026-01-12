import { GridCards } from "./testimonials/grid-cards";
import { Carousel } from "./testimonials/carousel";
import { Marquee } from "./testimonials/marquee";
import { FeaturedLarge } from "./testimonials/featured-large";
import { MasonryWall } from "./testimonials/masonry-wall";
import { MinimalList } from "./testimonials/minimal-list";
import { VideoTestimonials } from "./testimonials/video-testimonials";
import { QuoteWall } from "./testimonials/quote-wall";
import { SocialProofStats } from "./testimonials/social-proof-stats";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface TestimonialsModuleProps {
  content: Record<string, any>;
  layout: string;
}

export const TestimonialsModule = ({
  content,
  layout,
}: TestimonialsModuleProps) => {
  return (
    <ModuleContainer
      containerSettings={content.containerSettings}
      className="bg-muted/10"
    >
      <ModuleHeader
        title={content.title}
        description={content.description}
        alignment="center"
        descriptionClassName="max-w-2xl mx-auto"
        layoutSettings={content.layoutSettings}
        titleColor={content.titleColor}
        descriptionColor={content.descriptionColor}
        hideTitle={content.hideTitle}
        hideDescription={content.hideDescription}
      />

      {layout === "grid-cards" && <GridCards content={content} />}
      {layout === "carousel" && <Carousel content={content} />}
      {layout === "marquee" && <Marquee content={content} />}
      {layout === "featured-large" && <FeaturedLarge content={content} />}
      {layout === "masonry-wall" && <MasonryWall content={content} />}
      {layout === "minimal-list" && <MinimalList content={content} />}
      {layout === "video-testimonials" && (
        <VideoTestimonials content={content} />
      )}
      {layout === "quote-wall" && <QuoteWall content={content} />}
      {layout === "social-proof-stats" && (
        <SocialProofStats content={content} />
      )}

      {(content.testimonials || []).length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No testimonials yet. Add testimonials in the settings panel.</p>
        </div>
      )}
    </ModuleContainer>
  );
};

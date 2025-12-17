interface ClassicCardProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const ClassicCard = ({ content, previewDevice }: ClassicCardProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border rounded-2xl p-8 md:p-12 shadow-lg">
        <div className="text-center space-y-6">
          {content.image && (
            <img
              src={content.image}
              alt={content.name || "CEO"}
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
            />
          )}
          <div className="text-6xl text-primary/20">"</div>
          <blockquote className="text-xl md:text-2xl leading-relaxed font-medium italic">
            {content.message || "Welcome message from our leadership team."}
          </blockquote>
          <div className="pt-4">
            <h4 className="text-xl font-bold">
              {content.name || "John Smith"}
            </h4>
            <p className="text-muted-foreground">
              {content.title || "CEO & Founder"}
            </p>
            {content.company && (
              <p className="text-sm text-muted-foreground">{content.company}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

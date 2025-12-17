interface CenteredProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const Centered = ({ content, previewDevice }: CenteredProps) => {
  return (
    <div className="max-w-5xl mx-auto text-center">
      <div className="space-y-8">
        {content.image && (
          <img
            src={content.image}
            alt={content.name || "CEO"}
            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-xl"
          />
        )}
        <div className="text-7xl text-primary/20 leading-none">"</div>
        <blockquote className="text-2xl md:text-3xl leading-relaxed font-medium max-w-4xl mx-auto">
          {content.message || "Welcome message from our leadership team."}
        </blockquote>
        <div className="pt-6">
          <h4 className="text-2xl font-bold">{content.name || "John Smith"}</h4>
          <p className="text-lg text-muted-foreground">
            {content.title || "CEO & Founder"}
          </p>
          {content.company && (
            <p className="text-muted-foreground mt-1">{content.company}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const LogoRenderer = ({ content }: { content: Record<string, any> }) => {
  if (content.logoType === "image" && content.logoImage) {
    return (
      <img src={content.logoImage} alt="Logo" className="h-8 object-contain" />
    );
  }
  return (
    <div className="font-bold text-xl tracking-tight">
      {content.logoText || "Brand"}
    </div>
  );
};

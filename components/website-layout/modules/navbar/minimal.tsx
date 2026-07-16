import { LogoRenderer, MenuRenderer, AuthButtons } from "../../preview";

interface MinimalNavbarProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const MinimalNavbar = ({
  content,
  previewDevice,
}: MinimalNavbarProps) => {
  if (previewDevice === "mobile") {
    return (
      <div
        style={{
          color: content.containerSettings?.textColor,
          background: content.containerSettings?.background,
        }}
        className={`h-16 items-center justify-between px-4 flex ${
          content.isSticky ? "sticky top-0 z-50" : ""
        } ${!content.containerSettings?.background ? "bg-background" : ""}`}
      >
        <LogoRenderer content={content} />
        <div className="flex items-center gap-4">
          <AuthButtons />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        color: content.containerSettings?.textColor,
        background: content.containerSettings?.background,
      }}
      className={`h-16 items-center justify-between flex border-b-0 ${
        content.isSticky ? "sticky top-0 z-50" : ""
      } ${!content.containerSettings?.background ? "bg-background" : ""}`}
    >
      <LogoRenderer content={content} />
      <div className="flex items-center gap-8">
        <MenuRenderer items={content.menuItems} />
        <AuthButtons />
      </div>
    </div>
  );
};

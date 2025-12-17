import { LogoRenderer, MenuRenderer, AuthButtons } from "../../preview";

interface SimpleNavbarProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const SimpleNavbar = ({ content, previewDevice }: SimpleNavbarProps) => {
  if (previewDevice === "mobile") {
    return (
      <div className="h-16 items-center justify-between px-4 flex">
        <LogoRenderer content={content} />
        <div className="flex items-center gap-4">
          <AuthButtons />
        </div>
      </div>
    );
  }

  return (
    <div className="h-16 items-center justify-between flex">
      <LogoRenderer content={content} />
      <MenuRenderer items={content.menuItems} />
      <AuthButtons />
    </div>
  );
};

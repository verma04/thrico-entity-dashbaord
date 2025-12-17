import { LogoRenderer, MenuRenderer, AuthButtons } from "../../preview";

interface StackedNavbarProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const StackedNavbar = ({
  content,
  previewDevice,
}: StackedNavbarProps) => {
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
    <div className="h-28 flex-col justify-between py-4 flex">
      <div className="flex justify-between items-center">
        <LogoRenderer content={content} />
        <AuthButtons />
      </div>
      <div className="flex justify-center">
        <MenuRenderer items={content.menuItems} />
      </div>
    </div>
  );
};

import { LogoRenderer, MenuRenderer, AuthButtons } from "../../preview";

interface SplitNavbarProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const SplitNavbar = ({ content, previewDevice }: SplitNavbarProps) => {
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
      <div className="flex-1 flex justify-start">
        <MenuRenderer items={content.menuItems?.slice(0, 3)} />
      </div>
      <div className="flex-1 flex justify-center">
        <LogoRenderer content={content} />
      </div>
      <div className="flex-1 flex justify-end gap-2 items-center">
        <AuthButtons />
      </div>
    </div>
  );
};

import { LogoRenderer, MenuRenderer, AuthButtons } from "../../preview";

interface CenteredNavbarProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const CenteredNavbar = ({
  content,
  previewDevice,
}: CenteredNavbarProps) => {
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
    <div className="h-24 flex-col justify-center items-center py-4 gap-2 relative flex">
      <div className="absolute right-0 top-4">
        <AuthButtons />
      </div>
      <LogoRenderer content={content} />
      <MenuRenderer items={content.menuItems} />
    </div>
  );
};

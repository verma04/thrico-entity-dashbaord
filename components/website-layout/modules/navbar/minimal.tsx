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
      <div className="h-16 items-center justify-between px-4 flex">
        <LogoRenderer content={content} />
        <div className="flex items-center gap-4">
          <AuthButtons />
        </div>
      </div>
    );
  }

  return (
    <div className="h-16 items-center justify-between flex border-b-0">
      <LogoRenderer content={content} />
      <div className="flex items-center gap-8">
        <MenuRenderer items={content.menuItems} />
        <AuthButtons />
      </div>
    </div>
  );
};

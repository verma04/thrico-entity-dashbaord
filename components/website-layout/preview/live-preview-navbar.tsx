import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { LogoRenderer } from "./logo-renderer";
import { MenuRenderer } from "./menu-renderer";
import { AuthButtons } from "./auth-buttons";

interface LivePreviewNavbarProps {
  content: Record<string, any>;
  layout: string;
  previewDevice: string;
}

export const LivePreviewNavbar = ({
  content,
  layout,
  previewDevice,
}: LivePreviewNavbarProps) => {
  return (
    <nav
      className={cn(
        "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full flex px-8",
        previewDevice === "mobile"
          ? "h-16 items-center justify-between px-4"
          : [
              layout === "simple" && "h-16 items-center justify-between",
              layout === "centered" &&
                "h-24 flex-col justify-center items-center py-4 gap-2 relative",
              layout === "minimal" && "h-16 items-center justify-between",
              layout === "stacked" && "h-28 flex-col justify-between py-4",
              layout === "split" && "h-16 items-center justify-between",
              layout === "default" && "h-16 items-center justify-between",
            ]
      )}
    >
      {previewDevice === "mobile" ? (
        <>
          <LogoRenderer content={content} />
          <div className="flex items-center gap-4">
            <button className="text-xs font-bold bg-primary text-primary-foreground rounded-full px-3 py-1 hover:opacity-90 transition-opacity">
              Join
            </button>
            <Menu className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />
          </div>
        </>
      ) : (
        <>
          {/* VARIANT: SIMPLE (Logo Left, Menu Center, Auth Right) */}
          {layout === "simple" && (
            <>
              <div className="flex items-center">
                <LogoRenderer content={content} />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <MenuRenderer items={content.menuItems} />
              </div>
              <div className="flex items-center">
                <AuthButtons />
              </div>
            </>
          )}

          {/* VARIANT: CENTERED (Logo Center, Menu Below, Auth Absolute Right) */}
          {layout === "centered" && (
            <>
              <div className="absolute right-8 top-4">
                <AuthButtons />
              </div>
              <div className="flex items-center justify-center">
                <LogoRenderer content={content} />
              </div>
              <div className="flex items-center justify-center">
                <MenuRenderer items={content.menuItems} />
              </div>
            </>
          )}

          {/* VARIANT: MINIMAL (Logo Left, Auth + Burger Right) */}
          {layout === "minimal" && (
            <>
              <div className="flex items-center">
                <LogoRenderer content={content} />
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <AuthButtons />
                <div className="h-6 w-px bg-border mx-1"></div>
                <Menu className="h-6 w-6 cursor-pointer hover:text-primary transition-colors" />
              </div>
            </>
          )}

          {/* VARIANT: STACKED (Logo + Auth Top, Menu Bottom) */}
          {layout === "stacked" && (
            <>
              <div className="w-full flex justify-between items-center px-4">
                <LogoRenderer content={content} />
                <AuthButtons />
              </div>
              <div className="w-full h-px bg-border/50 my-1" />
              <div className="w-full flex justify-center">
                <MenuRenderer items={content.menuItems} />
              </div>
            </>
          )}

          {/* VARIANT: SPLIT (Menu Left, Logo Center, Auth Right) */}
          {layout === "split" && (
            <>
              <div className="flex-1 flex justify-start items-center">
                <MenuRenderer items={content.menuItems} />
              </div>
              <div className="flex-1 flex justify-center items-center">
                <LogoRenderer content={content} />
              </div>
              <div className="flex-1 flex justify-end gap-2 items-center">
                <AuthButtons />
              </div>
            </>
          )}

          {/* Default Fallover */}
          {layout === "default" && (
            <>
              <div className="flex items-center">
                <LogoRenderer content={content} />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <MenuRenderer items={content.menuItems} />
              </div>
              <div className="flex items-center">
                <AuthButtons />
              </div>
            </>
          )}
        </>
      )}
    </nav>
  );
};

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { LogoRenderer } from "../preview/logo-renderer";
import { MenuRenderer } from "../preview/menu-renderer";
import { AuthButtons } from "../preview/auth-buttons";

interface NavbarModuleProps {
  content: Record<string, any>;
  layout: string;
  previewDevice: string;
}

export const NavbarModule = ({
  content,
  layout,
  previewDevice,
}: NavbarModuleProps) => {
  return (
    <div
      className={cn(
        "border-b bg-background flex px-8",
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
            <button className="text-xs font-bold bg-primary text-primary-foreground rounded-full px-3 py-1">
              Join
            </button>
            <Menu className="h-6 w-6 cursor-pointer" />
          </div>
        </>
      ) : (
        <>
          {/* VARIANT: SIMPLE (Logo Left, Menu Center, Auth Right) */}
          {layout === "simple" && (
            <>
              <LogoRenderer content={content} />
              <MenuRenderer items={content.menuItems} />
              <AuthButtons />
            </>
          )}

          {/* VARIANT: CENTERED (Logo Center, Menu Below, Auth Absolute Right) */}
          {layout === "centered" && (
            <>
              <div className="absolute right-8 top-4">
                <AuthButtons />
              </div>
              <LogoRenderer content={content} />
              <MenuRenderer items={content.menuItems} />
            </>
          )}

          {/* VARIANT: MINIMAL (Logo Left, Auth + Burger Right) */}
          {layout === "minimal" && (
            <>
              <LogoRenderer content={content} />
              <div className="flex items-center gap-4">
                <AuthButtons />
                <div className="h-6 w-px bg-border mx-1"></div>
                <Menu className="h-6 w-6 cursor-pointer" />
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
              <div className="flex-1 flex justify-start">
                <MenuRenderer items={content.menuItems} />
              </div>
              <div className="flex-1 flex justify-center">
                <LogoRenderer content={content} />
              </div>
              <div className="flex-1 flex justify-end gap-2 items-center">
                <AuthButtons />
              </div>
            </>
          )}

          {/* Default Failover */}
          {layout === "default" && (
            <div className="h-16 flex items-center justify-between w-full">
              <LogoRenderer content={content} />
              <MenuRenderer items={content.menuItems} />
              <AuthButtons />
            </div>
          )}
        </>
      )}
    </div>
  );
};

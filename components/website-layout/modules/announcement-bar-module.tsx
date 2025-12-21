import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {  X, AlertCircle, CheckCircle, Info, AlertTriangle, Megaphone, Wrench } from "lucide-react";
import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";

interface AnnouncementBarModuleProps {
  module: ModuleData;
  previewDevice: "desktop" | "tablet" | "mobile";
}

export const AnnouncementBarModule = ({
  module,
  previewDevice,
}: AnnouncementBarModuleProps) => {
  const { content, layout } = module;
  const [isDismissed, setIsDismissed] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Countdown logic for countdown-alert layout
  useEffect(() => {
    if (layout === "countdown-alert" && content.targetDate) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(content.targetDate).getTime();
        const distance = target - now;

        if (distance > 0) {
          setCountdown({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [layout, content.targetDate]);

  if (isDismissed && layout === "dismissible-bar") {
    return null;
  }

  const getIcon = () => {
    if (content.icon) {
      const IconComponent = (LucideIcons as any)[content.icon];
      if (IconComponent) {
        return <IconComponent className="h-4 w-4" />;
      }
    }

    // Default icons based on layout
    switch (layout) {
      case "info-message":
        return <Info className="h-4 w-4" />;
      case "warning-alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "success-message":
        return <CheckCircle className="h-4 w-4" />;
      case "error-alert":
        return <AlertCircle className="h-4 w-4" />;
      case "promotion-banner":
        return <Megaphone className="h-4 w-4" />;
      case "maintenance-notice":
        return <Wrench className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getBgColor = () => {
    if (content.backgroundColor) return content.backgroundColor;
    
    switch (layout) {
      case "info-message":
        return "bg-blue-600";
      case "warning-alert":
        return "bg-amber-600";
      case "success-message":
        return "bg-green-600";
      case "error-alert":
        return "bg-red-600";
      case "promotion-banner":
        return "bg-purple-600";
      case "maintenance-notice":
        return "bg-gray-600";
      case "dismissible-bar":
        return "bg-cyan-600";
      case "countdown-alert":
        return "bg-pink-600";
      case "link-notification":
        return "bg-teal-600";
      default:
        return "bg-blue-600";
    }
  };

  const textColor = content.textColor || "text-white";

  // Info Message Layout
  if (layout === "info-message") {
    return (
      <div className={cn("w-full py-3 px-4", getBgColor(), textColor)}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
          {getIcon()}
          <p className="font-medium">{content.message || "Important information"}</p>
          {content.link && (
            <a
              href={content.link}
              className="underline hover:opacity-80 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.linkText || "Learn More"}
            </a>
          )}
        </div>
      </div>
    );
  }

  // Warning Alert Layout
  if (layout === "warning-alert") {
    return (
      <div className={cn("w-full py-3 px-4", getBgColor(), textColor)}>
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="flex-1 flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm font-semibold">{content.message || "Warning: Please review this important information"}</p>
            {content.link && (
              <a
                href={content.link}
                className="text-sm underline hover:opacity-80 transition font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.linkText || "Details"}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Success Message Layout
  if (layout === "success-message") {
    return (
      <div className={cn("w-full py-3 px-4", getBgColor(), textColor)}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
          {getIcon()}
          <p className="font-medium">{content.message || "Success! Your action was completed."}</p>
          {content.link && (
            <a
              href={content.link}
              className="ml-2 underline hover:opacity-80 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.linkText || "View"}
            </a>
          )}
        </div>
      </div>
    );
  }

  // Error Alert Layout
  if (layout === "error-alert") {
    return (
      <div className={cn("w-full py-4 px-4", getBgColor(), textColor)}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">{getIcon()}</div>
            <div className="flex-1">
              <p className="text-sm font-bold mb-1">Error</p>
              <p className="text-sm">{content.message || "An error occurred. Please try again."}</p>
              {content.link && (
                <a
                  href={content.link}
                  className="text-sm underline hover:opacity-80 transition mt-2 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content.linkText || "Get Help"}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Promotion Banner Layout
  if (layout === "promotion-banner") {
    return (
      <div className={cn("w-full py-4 px-4", getBgColor(), textColor)}>
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <p className="text-sm md:text-base font-semibold">{content.message || "Special Offer - Limited Time Only!"}</p>
          </div>
          {content.link && (
            <a
              href={content.link}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition whitespace-nowrap"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.buttonText || "Get Started"}
            </a>
          )}
        </div>
      </div>
    );
  }

  // Maintenance Notice Layout
  if (layout === "maintenance-notice") {
    return (
      <div className={cn("w-full py-3 px-4 border-b border-gray-500", getBgColor(), textColor)}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
          {getIcon()}
          <p className="font-medium">{content.message || "Scheduled maintenance in progress"}</p>
          {content.link && (
            <a
              href={content.link}
              className="underline hover:opacity-80 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.linkText || "Status Page"}
            </a>
          )}
        </div>
      </div>
    );
  }

  // Dismissible Bar Layout
  if (layout === "dismissible-bar") {
    return (
      <div className={cn("w-full py-3 px-4", getBgColor(), textColor)}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {getIcon()}
            <p className="text-sm font-medium">{content.message || "This is a dismissible announcement"}</p>
            {content.link && (
              <a
                href={content.link}
                className="underline hover:opacity-80 transition text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.linkText || "Learn More"}
              </a>
            )}
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 hover:opacity-80 transition"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Countdown Alert Layout
  if (layout === "countdown-alert") {
    return (
      <div className={cn("w-full py-4 px-4", getBgColor(), textColor)}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm md:text-base font-bold text-center md:text-left">
              {content.message || "Limited Time Offer Ends In:"}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 text-center">
                <div className="bg-white/20 px-3 py-2 rounded">
                  <div className="text-xl font-bold">{countdown.days}</div>
                  <div className="text-xs">Days</div>
                </div>
                <div className="bg-white/20 px-3 py-2 rounded">
                  <div className="text-xl font-bold">{countdown.hours}</div>
                  <div className="text-xs">Hours</div>
                </div>
                <div className="bg-white/20 px-3 py-2 rounded">
                  <div className="text-xl font-bold">{countdown.minutes}</div>
                  <div className="text-xs">Min</div>
                </div>
                <div className="bg-white/20 px-3 py-2 rounded">
                  <div className="text-xl font-bold">{countdown.seconds}</div>
                  <div className="text-xs">Sec</div>
                </div>
              </div>
              {content.link && (
                <a
                  href={content.link}
                  className="px-4 py-2 bg-white text-pink-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition whitespace-nowrap ml-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content.linkText || "Shop Now"}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Link Notification Layout
  if (layout === "link-notification") {
    return (
      <div className={cn("w-full py-3 px-4", getBgColor(), textColor)}>
        <div className="max-w-7xl mx-auto">
          {content.link ? (
            <a
              href={content.link}
              className="flex items-center justify-center gap-3 text-sm hover:opacity-90 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              {getIcon()}
              <p className="font-medium">{content.message || "Click here for more information"}</p>
              <span className="text-xs opacity-80">→</span>
            </a>
          ) : (
            <div className="flex items-center justify-center gap-3 text-sm">
              {getIcon()}
              <p className="font-medium">{content.message || "Click here for more information"}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className={cn("w-full py-3 px-4", getBgColor(), textColor)}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
        {getIcon()}
        <p className="font-medium">{content.message || "Announcement"}</p>
      </div>
    </div>
  );
};

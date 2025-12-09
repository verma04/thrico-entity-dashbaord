import React from "react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full z-10 bg-background shadow-md py-2 px-6 flex items-center justify-between h-14">
      <div className="flex items-center gap-6">
        <span className="text-sm text-muted-foreground cursor-pointer hover:underline">
          Feedback
        </span>
        <span className="text-sm text-muted-foreground cursor-pointer hover:underline">
          Help
        </span>
      </div>
      <div className="flex items-center gap-8">
        <span className="text-sm text-muted-foreground cursor-pointer hover:underline">
          Privacy
        </span>
        <span className="text-sm text-muted-foreground cursor-pointer hover:underline">
          Terms
        </span>
        <span className="text-sm text-muted-foreground">
          ©{new Date().getFullYear()} | Thrico - The Modern Community Management
          Platform by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://pulseplaydigital.com"
            className="underline hover:text-primary"
          >
            PulsePlay Digital
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;

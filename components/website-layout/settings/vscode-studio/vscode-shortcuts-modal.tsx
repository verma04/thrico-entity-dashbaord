"use client";

import React from "react";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VscodeShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VscodeShortcutsModal: React.FC<VscodeShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2500] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#252526] border border-[#454545] rounded-xl shadow-2xl p-5 font-sans space-y-4 text-xs animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#333333] pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-[#007acc]" />
            <h3 className="text-sm font-bold text-white">
              VS Code Monaco Shortcuts
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#858585] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-1 border-b border-[#333333]">
            <span className="text-[#cccccc]">Command Palette</span>
            <kbd className="px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#444444] text-[#aaaaaa] font-mono">
              ⌘P / Ctrl+P
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#333333]">
            <span className="text-[#cccccc]">Find in Document</span>
            <kbd className="px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#444444] text-[#aaaaaa] font-mono">
              ⌘F / Ctrl+F
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#333333]">
            <span className="text-[#cccccc]">Toggle Side Bar</span>
            <kbd className="px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#444444] text-[#aaaaaa] font-mono">
              ⌘B / Ctrl+B
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#333333]">
            <span className="text-[#cccccc]">Toggle DevTools Drawer</span>
            <kbd className="px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#444444] text-[#aaaaaa] font-mono">
              ⌘J / Ctrl+J
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#333333]">
            <span className="text-[#cccccc]">Format Code (Prettier)</span>
            <kbd className="px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#444444] text-[#aaaaaa] font-mono">
              Shift+Alt+F
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#333333]">
            <span className="text-[#cccccc]">Toggle Word Wrap</span>
            <kbd className="px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#444444] text-[#aaaaaa] font-mono">
              Alt+Z
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#333333]">
            <span className="text-[#cccccc]">Toggle Line Comment</span>
            <kbd className="px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#444444] text-[#aaaaaa] font-mono">
              ⌘/ / Ctrl+/
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-[#333333]">
            <span className="text-[#cccccc]">Save &amp; Update Live Server</span>
            <kbd className="px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#444444] text-[#aaaaaa] font-mono">
              ⌘S / Ctrl+S
            </kbd>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[#cccccc]">Close Studio</span>
            <kbd className="px-2 py-0.5 rounded bg-[#1e1e1e] border border-[#444444] text-[#aaaaaa] font-mono">
              Esc
            </kbd>
          </div>
        </div>

        <Button
          type="button"
          onClick={onClose}
          className="w-full bg-[#007acc] hover:bg-[#0062a3] text-white"
        >
          Got it
        </Button>
      </div>
    </div>
  );
};

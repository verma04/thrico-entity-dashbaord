"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandItem } from "./vscode-studio-types";

interface VscodeCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (cmdId: string) => void;
}

const STATIC_COMMANDS: CommandItem[] = [
  {
    id: "tab-html",
    label: "Open index.html",
    category: "Files",
    desc: "Switch to HTML Markup editor",
  },
  {
    id: "tab-css",
    label: "Open styles.css",
    category: "Files",
    desc: "Switch to Custom CSS editor",
  },
  {
    id: "view-split",
    label: "View: Split Editor (Monaco + Live Preview)",
    category: "View",
    desc: "Side-by-side Monaco code editor and live browser",
  },
  {
    id: "view-code",
    label: "View: Code Editor Only",
    category: "View",
    desc: "Full-width Monaco code writing workspace",
  },
  {
    id: "view-preview",
    label: "View: Live Preview Only",
    category: "View",
    desc: "Full-width browser preview canvas",
  },
  {
    id: "format-doc",
    label: "Format Document (Monaco Prettier)",
    category: "Code",
    desc: "Cleanly indent markup with 2 spaces",
  },
  {
    id: "toggle-wrap",
    label: "Toggle Word Wrap (Alt+Z)",
    category: "Editor",
    desc: "Toggle automatic line wrapping",
  },
  {
    id: "toggle-minimap",
    label: "Toggle Minimap",
    category: "Editor",
    desc: "Show or hide Monaco minimap",
  },
  {
    id: "toggle-sidebar",
    label: "Toggle Primary Side Bar (⌘B)",
    category: "View",
    desc: "Show or hide file explorer and tools",
  },
  {
    id: "toggle-devtools",
    label: "Toggle Developer Drawer (⌘J)",
    category: "View",
    desc: "Inspect Problems, Console, DOM Tree, and Stats",
  },
  {
    id: "device-desktop",
    label: "Device: Desktop (100%)",
    category: "Preview",
    desc: "Fluid desktop viewport",
  },
  {
    id: "device-tablet",
    label: "Device: iPad Tablet (768px)",
    category: "Preview",
    desc: "Tablet viewport with bezel",
  },
  {
    id: "device-mobile",
    label: "Device: iPhone Mobile (375px)",
    category: "Preview",
    desc: "Mobile viewport with phone frame",
  },
  {
    id: "reload-preview",
    label: "Reload Live Preview",
    category: "Preview",
    desc: "Re-render the preview canvas",
  },
  {
    id: "export-html",
    label: "Export / Download HTML File",
    category: "File",
    desc: "Download as .html file to disk",
  },
  {
    id: "copy-code",
    label: "Copy Code to Clipboard",
    category: "File",
    desc: "Copy active editor content",
  },
  {
    id: "mode-direct",
    label: "Render Mode: Direct (Shadow DOM)",
    category: "Engine",
    desc: "Isolated shadow root with zero iframe scrollbars",
  },
  {
    id: "mode-iframe",
    label: "Render Mode: Sandboxed IFrame",
    category: "Engine",
    desc: "Isolated frame for standalone widgets",
  },
];

export const VscodeCommandPalette: React.FC<VscodeCommandPaletteProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setFilter("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!filter) return STATIC_COMMANDS;
    const q = filter.toLowerCase();
    return STATIC_COMMANDS.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q)
    );
  }, [filter]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2500] bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#252526] border border-[#454545] rounded-lg shadow-2xl overflow-hidden font-sans text-xs animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Header */}
        <div className="p-2 border-b border-[#333333] flex items-center gap-2 bg-[#1e1e1e]">
          <Search className="h-4 w-4 text-[#007acc] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                  Math.min(filtered.length - 1, prev + 1)
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => Math.max(0, prev - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (filtered[selectedIndex]) {
                  onExecuteCommand(filtered[selectedIndex].id);
                  onClose();
                }
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Type a command or search files..."
            className="w-full bg-transparent border-0 outline-none text-white text-xs placeholder:text-[#888888]"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-[#2b2b2b] border border-[#444444] text-[10px] text-[#aaaaaa] font-mono">
            Esc
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-80 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-[#888888]">
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd, idx) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => {
                  onExecuteCommand(cmd.id);
                  onClose();
                }}
                className={cn(
                  "w-full px-3 py-2 rounded flex items-center justify-between text-left transition-colors",
                  selectedIndex === idx
                    ? "bg-[#007acc] text-white"
                    : "text-[#cccccc] hover:bg-[#2a2d2e]"
                )}
              >
                <div className="truncate">
                  <span className="font-semibold block">{cmd.label}</span>
                  <span
                    className={cn(
                      "text-[10px]",
                      selectedIndex === idx ? "text-white/80" : "text-[#858585]"
                    )}
                  >
                    {cmd.desc}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0",
                    selectedIndex === idx
                      ? "bg-white/20 text-white"
                      : "bg-[#333333] text-[#aaaaaa]"
                  )}
                >
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

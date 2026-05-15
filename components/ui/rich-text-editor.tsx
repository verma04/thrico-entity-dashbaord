"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  placeholder = "Start typing...",
  className,
  minHeight = "150px",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync value to DOM only if it's different to prevent cursor jumps
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const execCommand = (command: string, cmdValue?: string) => {
    document.execCommand(command, false, cmdValue);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      if (content !== value) {
        onChange(content);
      }
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Underline, command: "underline", title: "Underline" },
    { icon: Heading1, command: "formatBlock", value: "h1", title: "H1" },
    { icon: Heading2, command: "formatBlock", value: "h2", title: "H2" },
    { icon: Heading3, command: "formatBlock", value: "h3", title: "H3" },
    { icon: List, command: "insertUnorderedList", title: "Bullets" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbers" },
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
    {
      icon: LinkIcon,
      command: "link",
      title: "Link",
      onClick: () => {
        const url = prompt("Enter URL:");
        if (url) execCommand("createLink", url);
      },
    },
    { icon: Code, command: "formatBlock", value: "pre", title: "Code" },
  ];

  return (
    <div className={cn("flex flex-col border rounded-md bg-background", className)}>
      {label && <Label className="px-3 py-2 border-b text-xs font-semibold bg-muted/20">{label}</Label>}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-1 border-b bg-muted/10">
        {toolbarButtons.map((btn, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-muted"
            onMouseDown={(e) => e.preventDefault()} // Prevent stealing focus
            onClick={() => (btn.onClick ? btn.onClick() : execCommand(btn.command, btn.value))}
            title={btn.title}
          >
            <btn.icon className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        ))}
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "w-full p-4 outline-none overflow-y-auto text-sm leading-relaxed text-foreground",
          isFocused && "bg-muted/5"
        )}
        style={{ minHeight }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] h1 { font-size: 1.5rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; }
        [contenteditable] h2 { font-size: 1.25rem; font-weight: 600; margin-top: 0.75rem; margin-bottom: 0.4rem; }
        [contenteditable] h3 { font-size: 1.125rem; font-weight: 600; margin-top: 0.5rem; margin-bottom: 0.25rem; }
        [contenteditable] ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] pre { background: #f4f4f5; padding: 0.75rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875rem; margin: 0.5rem 0; }
        [contenteditable] a { color: #2563eb; text-decoration: underline; }
        [contenteditable] blockquote { border-left: 4px solid #e4e4e7; padding-left: 1rem; italic; color: #71717a; margin: 1rem 0; }
      `}</style>
    </div>
  );
};

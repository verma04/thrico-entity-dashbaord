"use client";

import React, { useRef, useState } from "react";
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
  minHeight = "200px",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const toolbarButtons = [
    {
      icon: Bold,
      command: "bold",
      title: "Bold (Ctrl+B)",
    },
    {
      icon: Italic,
      command: "italic",
      title: "Italic (Ctrl+I)",
    },
    {
      icon: Underline,
      command: "underline",
      title: "Underline (Ctrl+U)",
    },
    {
      icon: Heading1,
      command: "formatBlock",
      value: "h1",
      title: "Heading 1",
    },
    {
      icon: Heading2,
      command: "formatBlock",
      value: "h2",
      title: "Heading 2",
    },
    {
      icon: Heading3,
      command: "formatBlock",
      value: "h3",
      title: "Heading 3",
    },
    {
      icon: List,
      command: "insertUnorderedList",
      title: "Bullet List",
    },
    {
      icon: ListOrdered,
      command: "insertOrderedList",
      title: "Numbered List",
    },
    {
      icon: AlignLeft,
      command: "justifyLeft",
      title: "Align Left",
    },
    {
      icon: AlignCenter,
      command: "justifyCenter",
      title: "Align Center",
    },
    {
      icon: AlignRight,
      command: "justifyRight",
      title: "Align Right",
    },
    {
      icon: LinkIcon,
      command: "link",
      title: "Insert Link",
      onClick: insertLink,
    },
    {
      icon: ImageIcon,
      command: "image",
      title: "Insert Image",
      onClick: insertImage,
    },
    {
      icon: Code,
      command: "formatBlock",
      value: "pre",
      title: "Code Block",
    },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border rounded-t-lg bg-muted/30">
        {toolbarButtons.map((btn, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (btn.onClick) {
                btn.onClick();
              } else {
                execCommand(btn.command, btn.value);
              }
            }}
            title={btn.title}
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{ __html: value }}
        className={cn(
          "w-full p-3 border rounded-b-lg bg-background",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "prose prose-sm max-w-none",
          isFocused && "ring-2 ring-ring ring-offset-2"
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
        [contenteditable] {
          overflow-y: auto;
        }
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        [contenteditable] h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 0.5em 0;
          padding-left: 2em;
        }
        [contenteditable] pre {
          background: #f3f4f6;
          padding: 1em;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: monospace;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
        }
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

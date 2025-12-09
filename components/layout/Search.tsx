"use client";

import { Button, Input } from "antd";
import { SearchProps } from "antd/es/input";
import Search from "antd/es/input/Search";
import React, { useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function GlobalSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Use Cmd+K (Mac) or Ctrl+K (Windows/Linux) to focus the search input
  useHotkeys("mod+k", (event) => {
    event.preventDefault();
    inputRef.current?.focus();
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // Implement your search logic here
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <Search
      width={1000}
      allowClear
      ref={inputRef}
      type="text"
      placeholder="Search (Cmd+K)"
      onSearch={onSearch}
    />
  );
}

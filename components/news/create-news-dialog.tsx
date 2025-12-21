"use client";

import React, { useState } from "react";
import { NewsEditor } from "./news-editor";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const CreateNewsDialog: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="lg">
        <PlusCircle className="h-5 w-5 mr-2" />
        Create Article
      </Button>

      <NewsEditor article={null} open={open} onOpenChange={setOpen} />
    </>
  );
};

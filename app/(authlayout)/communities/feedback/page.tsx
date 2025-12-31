"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Open</Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-full" side="right">
        <SheetHeader>
          <SheetTitle>Create FeedBack</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <Tabs defaultValue="1" className="w-full">
            <TabsList>
              <TabsTrigger value="1">Design</TabsTrigger>
              <TabsTrigger value="2">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="1">Content of Tab Pane 1</TabsContent>
            <TabsContent value="2">Content of Tab Pane 2</TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default App;

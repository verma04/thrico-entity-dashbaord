"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

const NotFound: React.FC = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
      <div className="flex flex-col items-center gap-2">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h1 className="text-3xl font-bold">404</h1>
        <p className="text-muted-foreground">
          Sorry, the page you visited does not exist.
        </p>
      </div>

      <Button onClick={() => router.back()} variant="default">
        Back Home
      </Button>
    </div>
  );
};

export default NotFound;

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const SomeThingWentWrong = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <AlertCircle className="h-16 w-16 text-destructive" />
    <h1 className="text-4xl font-bold">500</h1>
    <p className="text-muted-foreground text-center">
      Sorry, something went wrong.
    </p>
    <Button onClick={() => (window.location.href = "/")}>Back Home</Button>
  </div>
);

export default SomeThingWentWrong;

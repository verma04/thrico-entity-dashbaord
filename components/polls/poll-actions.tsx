"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Settings,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { poll } from "./ts-types";

const Actions = (record: poll) => {
  const router = useRouter();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="font-semibold text-xs tracking-wide"
      onClick={() => router.push(`/polls/${record.id}/manage`)}
    >
      <Settings className="h-3.5 w-3.5 mr-2" />
      Manage
    </Button>
  );
};

export default Actions;

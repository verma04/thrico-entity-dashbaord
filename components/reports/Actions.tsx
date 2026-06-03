"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ShieldCheck, Trash2, Eye } from "lucide-react";
import { Report } from "./types";
import { useUpdateReportStatus } from "@/graphql/actions/reports";
import { useRouter } from "next/navigation";

export default function Actions({ report, canEdit = true }: { report: Report; canEdit?: boolean }) {
  const router = useRouter();
  const [updateStatus, { loading }] = useUpdateReportStatus({
    onCompleted: () => {
      // success handling
    },
    onError: (e: any) => {
      console.error(e);
    },
  });

  const handleViewTarget = () => {
    switch (report.module) {
      case "COMMUNITY":
        router.push(`/communities/${report.targetId}/about`);
        break;
      case "JOB":
        router.push(`/jobs/${report.targetId}`);
        break;
      case "LISTING":
        router.push(`/listing/${report.targetId}`);
        break;
      case "USER":
      case "MEMBER":
        router.push(`/members/${report.targetId}`);
        break;
      default:
        console.log("View target not implemented for module:", report.module);
        break;
    }
  };

  const handleUpdate = (status: "RESOLVED" | "DISMISSED") => {
    updateStatus({
      variables: {
        reportId: report.id,
        status: status,
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer" onClick={handleViewTarget}>
          <Eye className="mr-2 h-4 w-4" />
          View Target
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {canEdit && report.status !== "RESOLVED" && (
          <DropdownMenuItem
            className="cursor-pointer text-blue-600 focus:text-blue-600"
            onClick={() => handleUpdate("RESOLVED")}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Mark Resolved
          </DropdownMenuItem>
        )}
        {canEdit && report.status !== "DISMISSED" && (
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={() => handleUpdate("DISMISSED")}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Dismiss Report
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

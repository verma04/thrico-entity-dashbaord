"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import moment from "moment";
import { getStatusTag, getVerificationTag } from "./utils";
import Actions from "./action";
import type { Job } from "./ts-types";

export default function Jobs({ data }: { data: Job[] | undefined }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const paginatedData = data?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full p-6 bg-background">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="w-64">Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16 rounded-md">
                        <AvatarImage
                          src={
                            record.company?.logo
                              ? `https://cdn.thrico.network/${record.company.logo}`
                              : "/placeholder.svg"
                          }
                          alt={record.company?.name}
                        />
                        <AvatarFallback className="rounded-md">
                          {record.company?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{record.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {record.workplaceType} ({record.jobType})
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {record.company?.name}
                  </TableCell>
                  <TableCell className="text-sm">{record.location}</TableCell>
                  <TableCell>{getStatusTag(record.status)}</TableCell>
                  <TableCell>
                    {getVerificationTag(
                      record.verification?.isVerified || false
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {record.numberOfApplicant}
                  </TableCell>
                  <TableCell className="text-sm">
                    {moment(record.createdAt).format("MMM DD, YYYY")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {moment(record.updatedAt).fromNow()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Actions {...record} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-muted-foreground"
                >
                  No Listing found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data && data.length > pageSize && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, data.length)} of {data.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(Math.ceil(data.length / pageSize), p + 1)
                )
              }
              disabled={currentPage === Math.ceil(data.length / pageSize)}
              className="px-3 py-1 border rounded disabled:opacity-50 text-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Eye, X } from "lucide-react";

interface LogData {
  id: string;
  action: string;
  listingId: string;
  listingTitle: string;
  performedBy: string;
  details: string;
  timestamp: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedLog, setSelectedLog] = useState<LogData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterAction, setFilterAction] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const actions = [
      "listing_created",
      "listing_updated",
      "listing_deleted",
      "listing_approved",
      "listing_rejected",
      "listing_featured",
      "listing_unfeatured",
      "listing_reported",
      "report_resolved",
      "report_dismissed",
    ];

    const mockData: LogData[] = Array.from({ length: 50 }, (_, i) => {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const listingId = `L${Math.floor(Math.random() * 1000) + 1}`;
      const listingTitle = `Sample Listing ${Math.floor(Math.random() * 1000) + 1}`;
      const performedBy = `admin${Math.floor(Math.random() * 5) + 1}`;

      let details = "";
      switch (action) {
        case "listing_created":
          details = `New listing "${listingTitle}" was created`;
          break;
        case "listing_updated":
          details = `Listing "${listingTitle}" was updated. Fields changed: title, price, description`;
          break;
        case "listing_deleted":
          details = `Listing "${listingTitle}" was deleted`;
          break;
        case "listing_approved":
          details = `Listing "${listingTitle}" was approved and is now visible in the marketplace`;
          break;
        case "listing_rejected":
          details = `Listing "${listingTitle}" was rejected due to policy violation`;
          break;
        case "listing_featured":
          details = `Listing "${listingTitle}" was marked as featured`;
          break;
        case "listing_unfeatured":
          details = `Listing "${listingTitle}" was removed from featured listings`;
          break;
        case "listing_reported":
          details = `Listing "${listingTitle}" was reported by a user for "Prohibited item"`;
          break;
        case "report_resolved":
          details = `Report for listing "${listingTitle}" was resolved and the listing was removed`;
          break;
        case "report_dismissed":
          details = `Report for listing "${listingTitle}" was dismissed and the listing remains active`;
          break;
      }

      // Generate a random date within the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      return {
        id: `${i + 1}`,
        action,
        listingId,
        listingTitle,
        performedBy,
        details,
        timestamp: date.toISOString(),
      };
    });

    // Sort by timestamp (newest first)
    mockData.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setLogs(mockData);
    setFilteredLogs(mockData);
  }, []);

  const handleSearch = () => {
    let filtered = [...logs];

    if (searchText) {
      filtered = filtered.filter(
        (log) =>
          log.listingTitle.toLowerCase().includes(searchText.toLowerCase()) ||
          log.performedBy.toLowerCase().includes(searchText.toLowerCase()) ||
          log.details.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterAction) {
      filtered = filtered.filter((log) => log.action === filterAction);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchText("");
    setFilterAction("");
    setFilteredLogs(logs);
    setCurrentPage(1);
  };

  const handleViewDetails = (log: LogData) => {
    setSelectedLog(log);
    setIsModalVisible(true);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getActionVariant = (action: string): "default" | "secondary" | "destructive" | "outline" => {
    if (action.includes("created") || action.includes("approved")) {
      return "default";
    } else if (action.includes("updated") || action.includes("featured") || action.includes("unfeatured")) {
      return "secondary";
    } else if (action.includes("deleted") || action.includes("rejected") || action.includes("reported")) {
      return "destructive";
    }
    return "outline";
  };

  const formatActionName = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const uniqueActions = Array.from(new Set(logs.map((item) => item.action)));

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Audit Logs</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {formatActionName(action)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleSearch}>Search</Button>
            <Button variant="outline" onClick={handleReset}>
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="flex justify-end mb-4">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70px]">ID</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Listing</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>
                        <Badge variant={getActionVariant(log.action)}>
                          {formatActionName(log.action)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a className="text-primary hover:underline">
                          {log.listingTitle} ({log.listingId})
                        </a>
                      </TableCell>
                      <TableCell>{log.performedBy}</TableCell>
                      <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(log)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} results
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalVisible} onOpenChange={setIsModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Log ID:</span> {selectedLog.id}
              </div>
              <div>
                <span className="font-semibold">Action:</span>{" "}
                <Badge variant={getActionVariant(selectedLog.action)}>
                  {formatActionName(selectedLog.action)}
                </Badge>
              </div>
              <div>
                <span className="font-semibold">Listing:</span> {selectedLog.listingTitle} (
                {selectedLog.listingId})
              </div>
              <div>
                <span className="font-semibold">Performed By:</span> {selectedLog.performedBy}
              </div>
              <div>
                <span className="font-semibold">Timestamp:</span>{" "}
                {formatTimestamp(selectedLog.timestamp)}
              </div>
              <div>
                <span className="font-semibold">Details:</span>
                <p className="mt-1 text-muted-foreground">{selectedLog.details}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsModalVisible(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditLogs;

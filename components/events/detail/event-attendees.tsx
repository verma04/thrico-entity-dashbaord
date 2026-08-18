"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Loader2,
  Printer,
  ChevronDown,
  UserPlus,
  Download,
  Eye,
  QrCode,
  Upload,
  LayoutGrid,
  List as ListIcon,
  Mail,
  Ticket as TicketIcon,
  CheckCircle2,
} from "lucide-react";
import {
  useEventAttendees,
  useUpdateAttendeeStatus,
  useToggleAttendeeCheckIn,
  useAddEventAttendee,
  useEventTickets,
  useEventById,
} from "@/graphql/actions/events";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EventAttendees({ eventId }: { eventId: string }) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"grid" | "list">("list");

  const { data, loading, refetch } = useEventAttendees(eventId);
  const attendees = data?.getEventAttendees || [];

  const { data: eventData } = useEventById(eventId);
  const event = eventData?.getEventById;

  const eventName = event?.title || "EVENT";
  const eventDateRange = event
    ? (event.startDate === event.endDate || !event.endDate
        ? format(parseISO(event.startDate), "MMMM d, yyyy")
        : `${format(parseISO(event.startDate), "MMMM d")} - ${format(parseISO(event.endDate), "d, yyyy")}`
      ).toUpperCase()
    : "TBA";

  const [updateStatus] = useUpdateAttendeeStatus({
    onCompleted: () => {
      toast.success("Status updated");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const [toggleCheckIn] = useToggleAttendeeCheckIn({
    onCompleted: () => {
      toast.success("Check-in status updated");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const { data: ticketsData } = useEventTickets(eventId);
  const tickets = (ticketsData as any)?.getEventTickets || [];

  const [addAttendee, { loading: addingAttendee }] = useAddEventAttendee({
    onCompleted: () => {
      toast.success("Attendee added successfully");
      setIsAddOpen(false);
      setNewAttendee({
        firstName: "",
        lastName: "",
        email: "",
        ticketId: "",
        status: "CONFIRMED",
      });
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    ticketId: "",
    status: "CONFIRMED",
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<any>(null);

  const handlePreviewBadge = (attendee: any) => {
    setSelectedAttendee(attendee);
    setIsPreviewOpen(true);
  };

  const handleAddAttendee = () => {
    if (!newAttendee.firstName || !newAttendee.lastName || !newAttendee.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    addAttendee({
      variables: {
        input: {
          eventId,
          ...newAttendee,
          ticketId: newAttendee.ticketId || undefined,
        },
      },
    });
  };

  const printBadge = (attendee: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Badge - ${attendee.user.firstName}</title>
          <style>
            @page { size: 3in 5in; margin: 0; }
            body { 
              font-family: 'Inter', system-ui, sans-serif; 
              margin: 0; 
              padding: 0;
              background: white;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .badge-container {
              width: 3in;
              height: 5in;
              background: #fff;
              border: 1px solid #eee;
              display: flex;
              flex-direction: column;
              text-align: center;
              overflow: hidden;
            }
            .header {
              padding: 20px 10px;
              border-bottom: 1px solid #eee;
            }
            .event-name { font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
            .event-date { font-size: 10px; color: #64748b; font-weight: 600; }
            .attendee-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding: 20px;
            }
            .name { 
              font-size: 24px; 
              font-weight: 900; 
              color: #1e40af; 
              text-transform: uppercase;
              line-height: 1.1;
              margin-bottom: 8px;
            }
            .company { 
              font-size: 12px; 
              color: #3b82f6; 
              font-weight: 500;
              max-width: 200px;
              margin: 0 auto;
            }
            .qr-section {
              padding: 15px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
            }
            .qr-code {
              width: 100px;
              height: 100px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .qr-id { font-size: 10px; font-weight: 700; color: #1e293b; letter-spacing: 2px; }
            .footer {
              background: #db2777; /* Pink/Red from image */
              color: white;
              padding: 12px;
              font-size: 16px;
              font-weight: 800;
              letter-spacing: 3px;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body onload="window.print();window.close()">
          <div class="badge-container">
            <div class="header">
              <div class="event-name">${eventName}</div>
              <div class="event-date">${eventDateRange}</div>
            </div>
            <div class="attendee-info">
              <div class="name">${attendee.user.firstName}<br/>${attendee.user.lastName}</div>
              <div class="company">${attendee.user.organization || ""}</div>
            </div>
            <div class="qr-section">
              <div class="qr-code">
                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${attendee.id}" alt="QR" />
              </div>
              <div class="qr-id">${attendee.id.substring(0, 6).toUpperCase()}</div>
            </div>
            <div class="footer">
              ${attendee.ticket?.name || "EXHIBITOR"}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredAttendees = attendees.filter((attendee) => {
    const name = `${attendee.user.firstName} ${attendee.user.lastName}`;
    const email = attendee.user.email;

    const matchFilter =
      filter === "all"
        ? true
        : filter === "checked-in"
          ? attendee.checkedIn
          : attendee.status.toLowerCase() === filter.toLowerCase();

    const matchSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchFilter && matchSearch;
  });

  if (loading && attendees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading attendees...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Attendees ({attendees.length})</h2>
        <div className="flex gap-2">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setIsAddOpen(true)}>
                <UserPlus className="h-4 w-4" />
                Add Attendee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Manual Attendee</DialogTitle>
                <DialogDescription>
                  Manually register an attendee for this event.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={newAttendee.firstName}
                      onChange={(e) =>
                        setNewAttendee({
                          ...newAttendee,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={newAttendee.lastName}
                      onChange={(e) =>
                        setNewAttendee({
                          ...newAttendee,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={newAttendee.email}
                    onChange={(e) =>
                      setNewAttendee({ ...newAttendee, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket">Ticket Type</Label>
                  <Select
                    value={newAttendee.ticketId}
                    onValueChange={(val) =>
                      setNewAttendee({ ...newAttendee, ticketId: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ticket" />
                    </SelectTrigger>
                    <SelectContent>
                      {tickets.map((ticket: any) => (
                        <SelectItem key={ticket.id} value={ticket.id}>
                          {ticket.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newAttendee.status}
                    onValueChange={(val) =>
                      setNewAttendee({ ...newAttendee, status: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                  disabled={addingAttendee}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddAttendee} disabled={addingAttendee}>
                  {addingAttendee && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  Save Attendee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardHeader className="bg-muted/30">
          <CardTitle>Attendee Management</CardTitle>
          <CardDescription>
            Manage and track all event attendees for this event
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[160px] h-9 text-xs">
                  <SelectValue placeholder="Filter attendees" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="all">All Attendees</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle: Grid / List */}
              <Tabs
                value={view}
                onValueChange={(v) => setView(v as "grid" | "list")}
                className="bg-muted p-0.5 rounded-lg border border-border shrink-0"
              >
                <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
                  <TabsTrigger
                    value="grid"
                    className="h-8 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1.5"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="h-8 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1.5"
                  >
                    <ListIcon className="h-3.5 w-3.5" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {filteredAttendees.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 p-12 text-center text-xs text-muted-foreground bg-muted/10">
              <p className="font-semibold text-sm text-foreground mb-1">No attendees found</p>
              <p className="text-xs text-muted-foreground">
                No attendees match your current filter or search criteria.
              </p>
            </div>
          ) : view === "grid" ? (
            /* ─── GRID VIEW ─────────────────────────────────────────────── */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAttendees.map((attendee) => {
                const fullName = `${attendee.user?.firstName || ""} ${attendee.user?.lastName || ""}`.trim();
                const initial = attendee.user?.firstName?.charAt(0) || attendee.user?.lastName?.charAt(0) || "A";
                return (
                  <div
                    key={attendee.id}
                    className="bg-card border border-border/80 hover:border-border rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 group transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <UserProfileHoverCard user={attendee.user ?? {}}>
                          <Avatar className="h-11 w-11 rounded-lg border border-border/60 cursor-pointer shrink-0">
                            <AvatarImage src={attendee.user?.avatar || ""} />
                            <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                              {initial}
                            </AvatarFallback>
                          </Avatar>
                        </UserProfileHoverCard>

                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant="outline"
                            className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0 ${
                              attendee.status === "CONFIRMED"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : attendee.status === "WAITLISTED"
                                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            }`}
                          >
                            {attendee.status}
                          </Badge>
                          {attendee.checkedIn && (
                            <Badge
                              variant="outline"
                              className="text-[9px] bg-blue-500/10 text-blue-600 border-blue-500/20 px-1.5 py-0 font-semibold"
                            >
                              Checked In
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <UserProfileHoverCard user={attendee.user ?? {}}>
                          <h4 className="text-xs font-semibold text-foreground truncate hover:text-primary transition-colors cursor-pointer">
                            {fullName || "Attendee"}
                          </h4>
                        </UserProfileHoverCard>
                        <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{attendee.user?.email || "—"}</span>
                        </p>
                        {attendee.ticket?.name && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted/60 text-[10px] font-medium text-foreground">
                            <TicketIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{attendee.ticket.name}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                          onClick={() => handlePreviewBadge(attendee)}
                          title="Preview Badge"
                        >
                          <Eye className="h-3 w-3" />
                          Badge
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] gap-1 text-muted-foreground hover:text-foreground"
                          onClick={() => printBadge(attendee)}
                          title="Print Badge"
                        >
                          <Printer className="h-3 w-3" />
                        </Button>
                      </div>

                      <Select
                        value={attendee.status}
                        onValueChange={(val) =>
                          updateStatus({
                            variables: {
                              attendeeId: attendee.id,
                              status: val,
                            },
                          })
                        }
                      >
                        <SelectTrigger className="h-7 w-[95px] text-[10px] px-2 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="text-xs">
                          <SelectItem value="CONFIRMED">Confirm</SelectItem>
                          <SelectItem value="WAITLISTED">Waitlist</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CANCELLED">Cancel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ─── LIST VIEW ─────────────────────────────────────────────── */
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Email</TableHead>
                    <TableHead className="text-xs">Ticket Type</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-right text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendees.map((attendee) => {
                    const fullName = `${attendee.user?.firstName || ""} ${attendee.user?.lastName || ""}`.trim();
                    const initial = attendee.user?.firstName?.charAt(0) || attendee.user?.lastName?.charAt(0) || "A";
                    return (
                      <TableRow key={attendee.id}>
                        <TableCell className="font-medium py-3">
                          <div className="flex items-center gap-2.5">
                            <UserProfileHoverCard user={attendee.user ?? {}}>
                              <Avatar className="h-7 w-7 rounded-md border border-border/60 cursor-pointer">
                                <AvatarImage src={attendee.user?.avatar || ""} />
                                <AvatarFallback className="text-[10px] font-bold bg-muted text-muted-foreground">
                                  {initial}
                                </AvatarFallback>
                              </Avatar>
                            </UserProfileHoverCard>
                            <UserProfileHoverCard user={attendee.user ?? {}}>
                              <span className="text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer truncate">
                                {fullName || "Attendee"}
                              </span>
                            </UserProfileHoverCard>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs py-3">
                          {attendee.user.email}
                        </TableCell>
                        <TableCell className="text-xs py-3">{attendee.ticket?.name || "N/A"}</TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0 ${
                                attendee.status === "CONFIRMED"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : attendee.status === "WAITLISTED"
                                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                    : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                              }`}
                            >
                              {attendee.status}
                            </Badge>
                            {attendee.checkedIn && (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20 px-1.5 py-0 font-semibold"
                              >
                                Checked In
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <div className="flex justify-end items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => handlePreviewBadge(attendee)}
                            >
                              <Eye className="h-3 w-3" />
                              Preview
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => printBadge(attendee)}
                            >
                              <Printer className="h-3 w-3" />
                              Print
                            </Button>
                            <Select
                              value={attendee.status}
                              onValueChange={(val) =>
                                updateStatus({
                                  variables: {
                                    attendeeId: attendee.id,
                                    status: val,
                                  },
                                })
                              }
                            >
                              <SelectTrigger className="h-7 w-[100px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="text-xs">
                                <SelectItem value="CONFIRMED">Confirm</SelectItem>
                                <SelectItem value="WAITLISTED">Waitlist</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="CANCELLED">Cancel</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[400px] bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Badge Preview</DialogTitle>
            <DialogDescription className="text-slate-400">
              Visualizing the vertical conference badge design.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-6">
            {selectedAttendee && (
              <div className="w-[280px] h-[460px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col font-sans select-none">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 text-center">
                  <div className="text-[12px] font-bold text-slate-800 tracking-tight">
                    {eventName}
                  </div>
                  <div className="text-[9px] font-semibold text-slate-500 mt-0.5 uppercase tracking-wide">
                    {eventDateRange}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="text-2xl font-black text-blue-900 uppercase leading-tight mb-2">
                    {selectedAttendee.user.firstName}
                    <br />
                    {selectedAttendee.user.lastName}
                  </div>
                  <div className="text-xs font-medium text-blue-500 px-4">
                    {selectedAttendee.user.organization ||
                      "Pulseplay Digital Private Limited"}
                  </div>
                </div>

                {/* QR Section */}
                <div className="p-4 flex flex-col items-center gap-3">
                  <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded flex items-center justify-center relative overflow-hidden">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${selectedAttendee.id}`}
                      alt="QR Code"
                      className="w-20 h-20"
                    />
                  </div>
                  <div className="text-[10px] font-mono font-bold text-slate-800 tracking-[0.2em]">
                    {selectedAttendee.id.substring(0, 6).toUpperCase()}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-[#db2777] p-3 text-center">
                  <span className="text-white text-sm font-black tracking-[0.25em] uppercase">
                    {selectedAttendee.ticket?.name || "EXHIBITOR"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
              className="text-slate-200 border-slate-700 hover:bg-slate-800"
            >
              Close
            </Button>
            <Button
              onClick={() => printBadge(selectedAttendee)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Badge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

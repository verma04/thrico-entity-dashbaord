"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,

  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  List,
  Calendar as CalendarIcon,
  User,
  Users,
  X,
  Trash2,
  Edit2,
  Clock,
  MapPin,

} from "lucide-react";
import {
  useEventAgendas,
  useAddEventAgenda,
  useUpdateEventAgenda,
  useDeleteEventAgenda,
  useEventVenues,
  useEventSpeakers,
  EventAgenda,
  EventAgendaInput,
} from "@/graphql/actions/events";
import { toast } from "sonner";
import moment from "moment";
import { DialogTitle } from "@radix-ui/react-dialog";

const sessionSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  date: Yup.string().required("Date is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string().required("End time is required"),
});

function AddSessionModal({
  eventId,
  agenda,
  onSuccess,
}: {
  eventId: string;
  agenda?: EventAgenda;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { data: venuesData } = useEventVenues(eventId);
  const venues = venuesData?.getEventVenues || [];

  const { data: speakersData } = useEventSpeakers(eventId);
  const speakers = speakersData?.getEventSpeakers || [];

  const [addAgenda, { loading: adding }] = useAddEventAgenda({
    onCompleted: () => {
      toast.success("Session added successfully");
      setOpen(false);
      formik.resetForm();
    },
    onError: (error) => toast.error(error.message),
  });

  const [updateAgenda, { loading: updating }] = useUpdateEventAgenda({
    onCompleted: () => {
      toast.success("Session updated successfully");
      setOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: agenda?.title || "",
      date: agenda?.date || "",
      startTime: agenda?.startTime || "",
      endTime: agenda?.endTime || "",
      venueId: agenda?.venueId || "",
      videoSteam: agenda?.videoSteam || "",
      isPublished: agenda?.isPublished ?? true,
      speakerIds: agenda?.speakers?.map((s) => s.id) || [],
    },
    validationSchema: sessionSchema,
    onSubmit: (values) => {
      const input: EventAgendaInput = {
        eventId,
        ...values,
      };

      if (agenda) {
        updateAgenda({
          variables: {
            agendaId: agenda.id,
            input,
          },
        });
      } else {
        addAgenda({
          variables: {
            input,
          },
        });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {agenda ? (
          <Button variant="ghost" size="sm">
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Session
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {agenda ? "Edit Session" : "Add New Session"}
          </DialogTitle>
          <DialogDescription>
            {agenda
              ? "Update the details of this session."
              : "Create a new session for your event agenda."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Session Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Opening Keynote"
              {...formik.getFieldProps("title")}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-xs text-destructive">
                {formik.errors.title as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">
              Date <span className="text-destructive">*</span>
            </Label>
            <Input id="date" type="date" {...formik.getFieldProps("date")} />
            {formik.touched.date && formik.errors.date && (
              <p className="text-xs text-destructive">
                {formik.errors.date as string}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">
                Start Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startTime"
                type="time"
                {...formik.getFieldProps("startTime")}
              />
              {formik.touched.startTime && formik.errors.startTime && (
                <p className="text-xs text-destructive">
                  {formik.errors.startTime as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">
                End Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endTime"
                type="time"
                {...formik.getFieldProps("endTime")}
              />
              {formik.touched.endTime && formik.errors.endTime && (
                <p className="text-xs text-destructive">
                  {formik.errors.endTime as string}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueId">Room / Venue</Label>
            <Select
              value={formik.values.venueId}
              onValueChange={(v) => formik.setFieldValue("venueId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {venues.map((v: any) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Speakers</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start font-normal">
                  {formik.values.speakerIds.length > 0
                    ? `${formik.values.speakerIds.length} speaker(s) selected`
                    : "Select speakers"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]" align="start">
                <DropdownMenuLabel>Event Speakers</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {speakers.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No speakers found.
                  </div>
                )}
                {speakers.map((s: any) => (
                  <DropdownMenuCheckboxItem
                    key={s.id}
                    checked={formik.values.speakerIds.includes(s.id)}
                    onCheckedChange={(checked) => {
                      const current = formik.values.speakerIds;
                      const next = checked
                        ? [...current, s.id]
                        : current.filter((id) => id !== s.id);
                      formik.setFieldValue("speakerIds", next);
                    }}
                  >
                    {s.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoSteam">Virtual Stream Link</Label>
            <Input
              id="videoSteam"
              placeholder="https://zoom.us/..."
              {...formik.getFieldProps("videoSteam")}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" disabled={adding || updating}>
              {adding || updating
                ? "Saving..."
                : agenda
                  ? "Update Session"
                  : "Add Session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EventAgendaList({ eventId }: { eventId: string }) {
  const [view, setView] = useState("list");
  const { data, loading, refetch } = useEventAgendas(eventId);
  const agendas = data?.getEventAgendas || [];

  const [deleteAgenda] = useDeleteEventAgenda({
    onCompleted: () => {
      toast.success("Session deleted successfully");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Agenda & Timeline</h2>
          <p className="text-sm text-muted-foreground">
            Manage sessions and timeline for your event
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </Button>
          <AddSessionModal eventId={eventId} onSuccess={refetch} />
        </div>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-muted-foreground">
                  Loading agenda...
                </p>
              </div>
            </div>
          ) : view === "list" ? (
            agendas.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="pl-6 py-4">Session</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agendas.map((session: EventAgenda) => (
                    <TableRow key={session.id} className="group">
                      <TableCell className="pl-6 py-4">
                        <div className="font-semibold text-base">
                          {session.title}
                        </div>
                        {session.videoSteam && (
                          <div className="flex items-center gap-1.5 text-xs text-primary mt-1">
                            <Video className="h-3 w-3" />
                            Virtual Stream Available
                          </div>
                        )}
                        {session.speakers && session.speakers.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {session.speakers.map((speaker) => (
                              <Badge key={speaker.id} variant="outline" className="text-xs font-normal bg-background">
                                <Avatar className="h-3.5 w-3.5 mr-1 -ml-1">
                                  <AvatarImage src={speaker.avatar || ""} />
                                  <AvatarFallback className="text-[8px]">{speaker.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {speaker.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            {moment(session.date).format("MMM DD, YYYY")}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {session.startTime} - {session.endTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {session.venue?.name || "No room assigned"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            session.isPublished ? "default" : "secondary"
                          }
                          className="font-normal"
                        >
                          {session.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <AddSessionModal
                            eventId={eventId}
                            agenda={session}
                            onSuccess={refetch}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this session?",
                                )
                              ) {
                                deleteAgenda({
                                  variables: { agendaId: session.id },
                                });
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <List className="h-8 w-8 opacity-20" />
                </div>
                <h3 className="font-semibold text-lg">No sessions found</h3>
                <p className="text-sm">
                  Start by adding a session to your agenda.
                </p>
                <div className="mt-6">
                  <AddSessionModal eventId={eventId} onSuccess={refetch} />
                </div>
              </div>
            )
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mb-4" />
              <h3 className="font-semibold text-lg">Calendar View</h3>
              <p className="text-sm text-center max-w-md mt-2">
                Calendar view is coming soon. Use the list view to manage your
                sessions for now.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper icons
function Video({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}

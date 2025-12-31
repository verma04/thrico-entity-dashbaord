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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "lucide-react";

interface Session {
  id: string;
  title: string;
  time: string;
  date: string;
  room: string;
  tags: string[];
  speakers: Array<{ id: string; name: string; role: string; image: string }>;
  moderators: Array<{ id: string; name: string; role: string; image: string }>;
  curators: Array<{ id: string; name: string; role: string; image: string }>;
}

const speakersList = [
  {
    id: "1",
    name: "Dr. Emily Chen",
    role: "AI Research Lead",
    image: "/placeholder.svg",
  },
  {
    id: "2",
    name: "James Wilson",
    role: "Senior Developer Advocate",
    image: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    role: "Product Director",
    image: "/placeholder.svg",
  },
  { id: "4", name: "Sarah Johnson", role: "CEO", image: "/placeholder.svg" },
  { id: "5", name: "Michael Brown", role: "CTO", image: "/placeholder.svg" },
  {
    id: "6",
    name: "David Lee",
    role: "Design Lead",
    image: "/placeholder.svg",
  },
];

const sessionSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  date: Yup.string().required("Date is required"),
  time: Yup.string().required("Time is required"),
});

function AddSessionModal() {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<
    "speaker" | "moderator" | "curator"
  >("speaker");
  const [participants, setParticipants] = useState<Record<string, string[]>>({
    speaker: [],
    moderator: [],
    curator: [],
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      room: "",
    },
    validationSchema: sessionSchema,
    onSubmit: (values) => {
      console.log("Session Data:", values, participants, tags);
      formik.resetForm();
      setTags([]);
      setParticipants({ speaker: [], moderator: [], curator: [] });
      setOpen(false);
    },
  });

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleParticipantAdd = (id: string) => {
    if (!participants[activeTab].includes(id)) {
      setParticipants({
        ...participants,
        [activeTab]: [...participants[activeTab], id],
      });
    }
  };

  const handleParticipantRemove = (id: string) => {
    setParticipants({
      ...participants,
      [activeTab]: participants[activeTab].filter((pid) => pid !== id),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Session
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Session</DialogTitle>
          <DialogDescription>
            Create a new session for your event agenda
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Session Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter session title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-xs text-destructive">{formik.errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Enter session description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.date && formik.errors.date && (
                <p className="text-xs text-destructive">{formik.errors.date}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">
                Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formik.values.time}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.time && formik.errors.time && (
                <p className="text-xs text-destructive">{formik.errors.time}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Participants</Label>
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as any)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="speaker">Speaker</TabsTrigger>
                <TabsTrigger value="moderator">Moderator</TabsTrigger>
                <TabsTrigger value="curator">Curator</TabsTrigger>
              </TabsList>
              {(["speaker", "moderator", "curator"] as const).map((role) => (
                <TabsContent key={role} value={role} className="space-y-3">
                  <Select onValueChange={handleParticipantAdd}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Add ${role}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {speakersList.map((s) => (
                        <SelectItem
                          key={s.id}
                          value={s.id}
                          disabled={participants[role].includes(s.id)}
                        >
                          {s.name} ({s.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    {participants[role].map((pid) => {
                      const p = speakersList.find((s) => s.id === pid);
                      return (
                        <TooltipProvider key={pid}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="gap-2 pr-1 cursor-pointer"
                              >
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={p?.image} />
                                  <AvatarFallback>
                                    <User className="h-2 w-2" />
                                  </AvatarFallback>
                                </Avatar>
                                {p?.name}
                                <X
                                  className="h-3 w-3 hover:bg-muted rounded-full"
                                  onClick={() => handleParticipantRemove(pid)}
                                />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>{p?.role}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Room</Label>
            <Select
              value={formik.values.room}
              onValueChange={(value) => formik.setFieldValue("room", value)}
            >
              <SelectTrigger id="room">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Hall</SelectItem>
                <SelectItem value="roomA">Room A</SelectItem>
                <SelectItem value="roomB">Room B</SelectItem>
                <SelectItem value="workshop">Workshop Hall</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Add Session</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const EventAgenda = () => {
  const [view, setView] = useState("list");

  const sessions: Session[] = [
    {
      id: "1",
      title: "Opening Keynote",
      time: "9:00 AM - 10:00 AM",
      date: "Nov 15, 2023",
      room: "Main Hall",
      tags: ["keynote"],
      speakers: [
        {
          id: "4",
          name: "Sarah Johnson",
          role: "CEO",
          image: "/placeholder.svg",
        },
      ],
      moderators: [],
      curators: [],
    },
    {
      id: "2",
      title: "Future of AI",
      time: "10:30 AM - 11:30 AM",
      date: "Nov 15, 2023",
      room: "Room A",
      tags: ["technical", "ai"],
      speakers: [
        {
          id: "1",
          name: "Dr. Emily Chen",
          role: "AI Research Lead",
          image: "/placeholder.svg",
        },
        {
          id: "5",
          name: "Michael Brown",
          role: "CTO",
          image: "/placeholder.svg",
        },
      ],
      moderators: [
        {
          id: "6",
          name: "David Lee",
          role: "Design Lead",
          image: "/placeholder.svg",
        },
      ],
      curators: [],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agenda & Timeline</h2>
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
          <AddSessionModal />
        </div>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/50">
        <CardHeader className="bg-muted/30">
          <CardTitle>Event Schedule</CardTitle>
          <CardDescription>
            Manage sessions and timeline for your event
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {view === "list" ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Session</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {session.title}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{session.date}</div>
                          <div className="text-xs text-muted-foreground">
                            {session.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {["speakers", "moderators", "curators"].map(
                            (type) => {
                              const people = session[
                                type as keyof Session
                              ] as any[];
                              return people?.length ? (
                                <div
                                  key={type}
                                  className="flex items-center gap-2"
                                >
                                  <div className="flex items-center gap-1">
                                    {type === "curators" ? (
                                      <Users className="h-3 w-3 text-muted-foreground" />
                                    ) : (
                                      <User className="h-3 w-3 text-muted-foreground" />
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {type}
                                    </span>
                                  </div>
                                  <div className="flex -space-x-2">
                                    {people.slice(0, 4).map((p) => (
                                      <TooltipProvider key={p.id}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Avatar className="h-6 w-6 border-2 border-background">
                                              <AvatarImage
                                                src={p.image}
                                                alt={p.name}
                                              />
                                              <AvatarFallback className="text-xs">
                                                {p.name.charAt(0)}
                                              </AvatarFallback>
                                            </Avatar>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            {p.name} - {p.role}
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    ))}
                                  </div>
                                </div>
                              ) : null;
                            }
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{session.room}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {session.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mb-4" />
              <h3 className="font-semibold text-lg">Calendar View</h3>
              <p className="text-sm text-center max-w-md mt-2">
                Calendar view would display a drag-and-drop interface for
                managing sessions across days and time slots.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventAgenda;

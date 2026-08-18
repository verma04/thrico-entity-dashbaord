"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  MoreVertical,
  GripVertical,
  Star,
  User,
  Upload,
  LayoutGrid,
  List as ListIcon,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  EventSpeaker,
  useEventSpeakers,
  useAddEventSpeaker,
  useUpdateEventSpeaker,
  useDeleteEventSpeaker,
  useToggleSpeakerFeatured,
} from "@/graphql/actions/events";

const speakerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  bio: Yup.string().required("Bio is required"),
});

function SpeakerModal({
  eventId,
  speaker,
  open,
  onOpenChange,
}: {
  eventId: string;
  speaker?: EventSpeaker | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<any>(null);

  React.useEffect(() => {
    if (open) {
      if (speaker?.avatar) {
        setImagePreview(`https://cdn.thrico.network/${speaker.avatar}`);
      } else {
        setImagePreview(null);
      }
      setAvatarFile(null);
      formik.resetForm();
    }
  }, [open, speaker]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const [addSpeaker, { loading: adding }] = useAddEventSpeaker({
    onCompleted: () => {
      onOpenChange(false);
    },
  });

  const [updateSpeaker, { loading: updating }] = useUpdateEventSpeaker({
    onCompleted: () => {
      onOpenChange(false);
    },
  });

  const loading = adding || updating;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: speaker?.name || "",
      role: speaker?.title || "",
      bio: speaker?.bio || "",
      email: speaker?.email || "",
      twitter: (speaker?.socialLinks as any)?.twitter || "",
      linkedin: (speaker?.socialLinks as any)?.linkedin || "",
      company: speaker?.company || "",
    },
    validationSchema: speakerSchema,
    onSubmit: (values) => {
      const socialLinks = {
        twitter: values.twitter,
        linkedin: values.linkedin,
      };

      const input = {
        eventId,
        name: values.name,
        title: values.role,
        company: values.company,
        bio: values.bio,
        email: values.email,
        socialLinks,
        avatarImage: avatarFile,
        isFeatured: speaker ? speaker.isFeatured : false,
        displayOrder: speaker ? speaker.displayOrder : 0,
      };

      if (speaker) {
        updateSpeaker({
          variables: {
            speakerId: speaker.id,
            input: {
              ...input,
              avatar: speaker.avatar,
            },
          },
        });
      } else {
        addSpeaker({
          variables: {
            input,
          },
        });
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>{speaker ? "Edit Speaker" : "Add New Speaker"}</DialogTitle>
          <DialogDescription>
            {speaker ? "Update speaker details." : "Add a new speaker to your event."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="h-10 w-10 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <label htmlFor="speaker-avatar-upload">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 cursor-pointer"
                  type="button"
                  onClick={() =>
                    document.getElementById("speaker-avatar-upload")?.click()
                  }
                >
                  <Upload className="h-3 w-3" />
                  Upload Photo
                </Button>
              </label>
              <input
                id="speaker-avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter speaker's full name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-xs text-destructive">
                    {formik.errors.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">
              Role / Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="role"
              name="role"
              placeholder="e.g., CTO"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.role && formik.errors.role && (
              <p className="text-xs text-destructive">{formik.errors.role}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              placeholder="e.g., TechCorp"
              value={formik.values.company}
              onChange={formik.handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">
              Biography <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Enter speaker's bio"
              rows={4}
              value={formik.values.bio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.bio && formik.errors.bio && (
              <p className="text-xs text-destructive">{formik.errors.bio}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter speaker's email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                placeholder="@username"
                value={formik.values.twitter}
                onChange={formik.handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                placeholder="LinkedIn profile URL"
                value={formik.values.linkedin}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : speaker ? "Save Changes" : "Add Speaker"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EventSpeakers({ eventId }: { eventId: string }) {
  const { data, loading } = useEventSpeakers(eventId);
  const speakers: EventSpeaker[] = data?.getEventSpeakers || [];

  const [deleteSpeaker] = useDeleteEventSpeaker({
    refetchQueries: ["GetEventSpeakers"], // Refetch queries can vary based on setup but it triggers refresh
  });
  const [toggleFeaturedState] = useToggleSpeakerFeatured();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<EventSpeaker | null>(null);

  const handleAdd = () => {
    setEditingSpeaker(null);
    setIsModalOpen(true);
  };

  const handleEdit = (speaker: EventSpeaker) => {
    setEditingSpeaker(speaker);
    setIsModalOpen(true);
  };

  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredSpeakers = speakers
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s?.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((s) => {
      if (filterType === "featured") return s.isFeatured;
      if (filterType === "regular") return !s.isFeatured;
      return true;
    })
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const toggleFeatured = (id: string, isFeatured: boolean) => {
    toggleFeaturedState({
      variables: { speakerId: id, isFeatured: !isFeatured },
    });
  };

  const removeSpeaker = (id: string) => {
    deleteSpeaker({ variables: { speakerId: id } });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading speakers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            Speakers & Lineup
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage keynotes, panel curators, and featured presenters.
          </p>
        </div>
        <Button size="sm" className="gap-1.5 h-8 text-xs font-medium" onClick={handleAdd}>
          <Plus className="h-3.5 w-3.5" />
          Add Speaker
        </Button>
      </div>

      <SpeakerModal
        eventId={eventId}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        speaker={editingSpeaker}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by name or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs bg-background"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px] h-8 text-xs bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="all">All Speakers</SelectItem>
              <SelectItem value="featured">Featured Only</SelectItem>
              <SelectItem value="regular">Regular Only</SelectItem>
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
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1"
              >
                <LayoutGrid className="h-3 w-3" />
                Grid
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium gap-1"
              >
                <ListIcon className="h-3 w-3" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredSpeakers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-12 text-center text-xs text-muted-foreground bg-card/40">
          <User className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="font-semibold text-foreground">No speakers found</p>
          <p className="text-muted-foreground mt-0.5">Click &ldquo;Add Speaker&rdquo; to build your event lineup.</p>
        </div>
      ) : view === "grid" ? (
        /* ─── GRID VIEW ─────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSpeakers.map((speaker) => (
            <div
              key={speaker.id}
              className="bg-card border border-border/80 hover:border-border rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 group transition-all relative"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <Avatar className="h-14 w-14 rounded-xl border border-border/60">
                      <AvatarImage
                        src={
                          speaker.avatar
                            ? `https://cdn.thrico.network/${speaker.avatar}`
                            : ""
                        }
                        alt={speaker.name}
                      />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                        {speaker.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    {speaker.isFeatured && (
                      <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <Star className="h-3 w-3 fill-current" />
                      </span>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 text-xs">
                      <DropdownMenuItem onClick={() => handleEdit(speaker)} className="gap-1.5 text-xs">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toggleFeatured(speaker.id, speaker.isFeatured)}
                        className="gap-1.5 text-xs"
                      >
                        <Star className="h-3.5 w-3.5" />
                        {speaker.isFeatured ? "Unmark Featured" : "Mark as Featured"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => removeSpeaker(speaker.id)}
                        className="text-destructive focus:text-destructive gap-1.5 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-foreground truncate">
                    {speaker.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {speaker.title}
                    {speaker.company ? ` • ${speaker.company}` : ""}
                  </p>
                  {speaker.bio && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-snug">
                      {speaker.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px] flex-1"
                  onClick={() => handleEdit(speaker)}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ─── LIST VIEW ─────────────────────────────────────────────────── */
        <div className="border border-border/80 rounded-xl overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs">Speaker</TableHead>
                <TableHead className="text-xs">Title & Company</TableHead>
                <TableHead className="text-xs">Bio Summary</TableHead>
                <TableHead className="text-xs">Featured</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpeakers.map((speaker) => (
                <TableRow key={speaker.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 rounded-lg border border-border/60">
                        <AvatarImage
                          src={
                            speaker.avatar
                              ? `https://cdn.thrico.network/${speaker.avatar}`
                              : ""
                          }
                          alt={speaker.name}
                        />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                          {speaker.name?.charAt(0) || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-semibold text-foreground truncate">
                        {speaker.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-3">
                    {speaker.title} {speaker.company ? `at ${speaker.company}` : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[240px] truncate py-3">
                    {speaker.bio || "—"}
                  </TableCell>
                  <TableCell className="py-3">
                    {speaker.isFeatured ? (
                      <Badge
                        variant="outline"
                        className="px-1.5 py-0 text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800 gap-1"
                      >
                        <Star className="h-2.5 w-2.5 fill-current" />
                        Featured
                      </Badge>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Standard</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <div className="flex justify-end items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs px-2"
                        onClick={() => handleEdit(speaker)}
                      >
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 text-xs">
                          <DropdownMenuItem
                            onClick={() => toggleFeatured(speaker.id, speaker.isFeatured)}
                            className="text-xs"
                          >
                            {speaker.isFeatured ? "Unmark Featured" : "Mark Featured"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => removeSpeaker(speaker.id)}
                            className="text-destructive focus:text-destructive text-xs"
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

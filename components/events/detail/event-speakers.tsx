"use client";

import { useState } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Plus,
  MoreVertical,
  GripVertical,
  Star,
  User,
  Upload,
} from "lucide-react";

import {
  EventSpeaker,
  useEventSpeakers,
  useAddEventSpeaker,
  useDeleteEventSpeaker,
  useToggleSpeakerFeatured,
} from "@/graphql/actions/events";

const speakerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  bio: Yup.string().required("Bio is required"),
});

function AddSpeakerModal({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [addSpeaker, { loading }] = useAddEventSpeaker({
    onCompleted: () => {
      formik.resetForm();
      setImagePreview(null);
      setOpen(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      role: "",
      bio: "",
      email: "",
      twitter: "",
      linkedin: "",
      company: "",
    },
    validationSchema: speakerSchema,
    onSubmit: (values) => {
      const socialLinks = {
        twitter: values.twitter,
        linkedin: values.linkedin,
      };
      addSpeaker({
        variables: {
          input: {
            eventId,
            name: values.name,
            title: values.role,
            company: values.company,
            bio: values.bio,
            email: values.email,
            socialLinks,
            isFeatured: false,
            displayOrder: 0,
          },
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Speaker
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Add New Speaker</DialogTitle>
          <DialogDescription>
            Add a new speaker to your event.
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
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                type="button"
              >
                <Upload className="h-3 w-3" />
                Upload Photo
              </Button>
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
              {loading ? "Adding..." : "Add Speaker"}
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
          <p className="text-sm">Loading speakers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Speakers & Curators</h2>
        <AddSpeakerModal eventId={eventId} />
      </div>

      <div className="flex flex-wrap gap-4 justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search speakers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Speakers</SelectItem>
            <SelectItem value="featured">Featured Only</SelectItem>
            <SelectItem value="regular">Regular Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredSpeakers.length === 0 ? (
        <Card className="flex h-48 items-center justify-center bg-muted/20 border-dashed">
          <CardContent className="flex flex-col items-center gap-2 pt-6">
            <User className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              No speakers found. Click "Add Speaker" to build your lineup.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpeakers.map((speaker) => (
            <Card key={speaker.id} className="relative">
              <CardHeader className="pb-3">
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`featured-${speaker.id}`}
                      checked={speaker.isFeatured}
                      onCheckedChange={() =>
                        toggleFeatured(speaker.id, speaker.isFeatured)
                      }
                    />
                    <label
                      htmlFor={`featured-${speaker.id}`}
                      className="text-xs cursor-pointer text-muted-foreground"
                    >
                      Featured
                    </label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      </TooltipTrigger>
                      <TooltipContent>Drag to reorder</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {speaker.isFeatured && (
                  <Star className="absolute top-3 left-3 h-5 w-5 fill-yellow-400 text-yellow-400" />
                )}

                <div className="flex flex-col items-center pt-6">
                  <Avatar className="h-24 w-24 mb-3">
                    <AvatarImage
                      src={speaker.avatar || ""}
                      alt={speaker.name}
                    />
                    <AvatarFallback>
                      <User className="h-10 w-10 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-center text-base">
                    {speaker.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    {speaker.title}{" "}
                    {speaker.company ? `at ${speaker.company}` : ""}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {speaker.bio}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2 pt-0">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        toggleFeatured(speaker.id, speaker.isFeatured)
                      }
                    >
                      {speaker.isFeatured
                        ? "Remove from featured"
                        : "Mark as featured"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => removeSpeaker(speaker.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      Remove Speaker
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

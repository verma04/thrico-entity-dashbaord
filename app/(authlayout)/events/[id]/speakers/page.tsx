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

interface Speaker {
  id: string;
  name: string;
  role: string;
  bio: string;
  sessions: string[];
  image: string;
  featured?: boolean;
  order?: number;
}

const speakerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  bio: Yup.string().required("Bio is required"),
});

function AddSpeakerModal() {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      role: "",
      bio: "",
      email: "",
      twitter: "",
      linkedin: "",
    },
    validationSchema: speakerSchema,
    onSubmit: (values) => {
      console.log("Speaker added:", values);
      formik.resetForm();
      setImagePreview(null);
      setOpen(false);
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
      <DialogContent className="max-w-2xl">
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
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="gap-2">
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
              placeholder="e.g., CTO at TechCorp"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.role && formik.errors.role && (
              <p className="text-xs text-destructive">{formik.errors.role}</p>
            )}
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
            <Button type="submit">Add Speaker</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EventSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([
    {
      id: "1",
      name: "Dr. Emily Chen",
      role: "AI Research Lead, TechCorp",
      bio: "Leading researcher in artificial intelligence with over 15 years of experience.",
      sessions: ["Future of AI"],
      image: "/placeholder.svg",
      featured: true,
      order: 1,
    },
    {
      id: "2",
      name: "James Wilson",
      role: "Senior Developer Advocate, WebTech",
      bio: "Passionate about web technologies and developer experience.",
      sessions: ["Web Development Trends"],
      image: "/placeholder.svg",
      featured: false,
      order: 2,
    },
    {
      id: "3",
      name: "Maria Rodriguez",
      role: "Product Director, ProductHQ",
      bio: "Experienced product leader with a track record of successful launches.",
      sessions: ["Product Management Workshop"],
      image: "/placeholder.svg",
      featured: true,
      order: 3,
    },
    {
      id: "4",
      name: "Sarah Johnson",
      role: "CEO, InnovateCo",
      bio: "Visionary leader driving innovation in the tech industry.",
      sessions: ["Opening Keynote"],
      image: "/placeholder.svg",
      featured: false,
      order: 4,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredSpeakers = speakers
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((s) => {
      if (filterType === "featured") return s.featured;
      if (filterType === "regular") return !s.featured;
      return true;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const toggleFeatured = (id: string) => {
    setSpeakers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, featured: !s.featured } : s))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Speakers & Curators</h2>
        <AddSpeakerModal />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpeakers.map((speaker) => (
          <Card key={speaker.id} className="relative">
            <CardHeader className="pb-3">
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`featured-${speaker.id}`}
                    checked={speaker.featured}
                    onCheckedChange={() => toggleFeatured(speaker.id)}
                  />
                  <label
                    htmlFor={`featured-${speaker.id}`}
                    className="text-xs cursor-pointer"
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

              {speaker.featured && (
                <Star className="absolute top-3 left-3 h-5 w-5 fill-yellow-400 text-yellow-400" />
              )}

              <div className="flex flex-col items-center pt-6">
                <Avatar className="h-24 w-24 mb-3">
                  <AvatarImage src={speaker.image} alt={speaker.name} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-center text-base">
                  {speaker.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  {speaker.role}
                </p>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {speaker.bio}
              </p>
              <div className="flex flex-wrap gap-1 mt-3">
                {speaker.sessions.map((session) => (
                  <Badge key={session} variant="secondary" className="text-xs">
                    {session}
                  </Badge>
                ))}
              </div>
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
                  <DropdownMenuItem onClick={() => toggleFeatured(speaker.id)}>
                    {speaker.featured
                      ? "Remove from featured"
                      : "Mark as featured"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Assign to session</DropdownMenuItem>
                  <DropdownMenuItem>View profile</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default EventSpeakers;

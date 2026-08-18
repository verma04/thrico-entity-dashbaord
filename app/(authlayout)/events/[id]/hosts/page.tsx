"use client";

import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";


import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserPlus,
  Pencil,
  Trash2,
  ExternalLink,
  User,
  LayoutGrid,
  List as ListIcon,
  Mail,
  Building,
  Shield,
} from "lucide-react";

const PERMISSION_OPTIONS = [
  { label: "Full Access", value: "full_access" },
  { label: "Edit Agenda", value: "edit_agenda" },
  { label: "Manage Speakers", value: "manage_speakers" },
  { label: "Manage Attendees", value: "manage_attendees" },
  { label: "Send Communications", value: "send_communications" },
  { label: "Manage Sponsors", value: "manage_sponsors" },
];

const hostSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
});

function EventHosts() {
  const [hosts, setHosts] = useState([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Main Host",
      permissions: ["full_access"],
      image: "/placeholder.svg",
      company: "TechCorp",
      companyUrl: "https://techcorp.example.com",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael@example.com",
      role: "Co-host",
      permissions: ["edit_agenda", "manage_speakers"],
      image: "/placeholder.svg",
      company: "InnovateLabs",
      companyUrl: "https://innovatelabs.example.com",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "Co-host",
      company: "",
      companyUrl: "",
    },
    validationSchema: hostSchema,
    onSubmit: (values) => {
      const newHost = {
        id: String(hosts.length + 1),
        ...values,
        permissions: selectedPermissions,
        image: "/placeholder.svg",
      };
      setHosts([...hosts, newHost]);
      formik.resetFields();
      setSelectedPermissions([]);
      setIsModalOpen(false);
    },
  });

  const togglePermission = (value: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const [view, setView] = useState<"grid" | "list">("list");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            Hosts & Co-hosts
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage event hosts, co-organizers, and delegated management permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
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

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 h-8 text-xs font-medium">
                <UserPlus className="h-3.5 w-3.5" />
                Add Host
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Host</DialogTitle>
                <DialogDescription>
                  Add a new host or co-host to your event
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter full name"
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

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="host@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-xs text-destructive">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">
                    Role <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formik.values.role}
                    onValueChange={(val) => formik.setFieldValue("role", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Host">Main Host</SelectItem>
                      <SelectItem value="Co-host">Co-host</SelectItem>
                      <SelectItem value="Moderator">Moderator</SelectItem>
                      <SelectItem value="Speaker Coordinator">
                        Speaker Coordinator
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Company name"
                    value={formik.values.company}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyUrl">Company URL (optional)</Label>
                  <Input
                    id="companyUrl"
                    name="companyUrl"
                    placeholder="https://company.example.com"
                    value={formik.values.companyUrl}
                    onChange={formik.handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    {PERMISSION_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={option.value}
                          checked={selectedPermissions.includes(option.value)}
                          onCheckedChange={() => togglePermission(option.value)}
                        />
                        <label
                          htmlFor={option.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">Add Host</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {hosts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/80 p-12 text-center text-xs text-muted-foreground bg-card/40">
          <User className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="font-semibold text-foreground">No hosts configured</p>
          <p className="text-muted-foreground mt-0.5">Click &ldquo;Add Host&rdquo; to assign event organizers.</p>
        </div>
      ) : view === "grid" ? (
        /* ─── GRID VIEW ─────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {hosts.map((host) => (
            <div
              key={host.id}
              className="bg-card border border-border/80 hover:border-border rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 group transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Avatar className="h-11 w-11 rounded-lg border border-border/60">
                    <AvatarImage src={host.image} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                      {host.name?.charAt(0) || "H"}
                    </AvatarFallback>
                  </Avatar>

                  <Badge
                    variant="outline"
                    className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0 ${
                      host.role === "Main Host"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                    }`}
                  >
                    {host.role}
                  </Badge>
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-foreground truncate">
                    {host.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{host.email}</span>
                  </p>
                  {host.company && (
                    <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-1">
                      <Building className="h-3 w-3 shrink-0" />
                      {host.companyUrl ? (
                        <a
                          href={host.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-primary inline-flex items-center gap-0.5 truncate"
                        >
                          {host.company}
                          <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="truncate">{host.company}</span>
                      )}
                    </p>
                  )}
                </div>

                {host.permissions?.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {host.permissions.slice(0, 3).map((perm: string) => (
                      <span
                        key={perm}
                        className="px-1.5 py-0.5 rounded bg-muted/60 text-[9px] font-medium text-muted-foreground capitalize"
                      >
                        {perm.replace(/_/g, " ")}
                      </span>
                    ))}
                    {host.permissions.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded bg-muted text-[9px] text-muted-foreground">
                        +{host.permissions.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" />
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
                <TableHead className="text-xs">Host</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Company</TableHead>
                <TableHead className="text-xs">Permissions</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hosts.map((host) => (
                <TableRow key={host.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 rounded-lg border border-border/60">
                        <AvatarImage src={host.image} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                          {host.name?.charAt(0) || "H"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs font-semibold text-foreground">{host.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {host.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0 ${
                        host.role === "Main Host"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                      }`}
                    >
                      {host.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-3">
                    {host.company ? (
                      host.companyUrl ? (
                        <a
                          href={host.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {host.company}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        host.company
                      )
                    ) : (
                      <span className="text-muted-foreground">Not specified</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {host.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                          {perm.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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

export default withSubscriptionCheck(
  withModulePermission(EventHosts, "EVENTS", "canRead"),
  "events"
);

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserPlus, Pencil, Trash2, ExternalLink, User } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hosts & Co-hosts</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
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
                  placeholder="Enter email"
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
                  onValueChange={(value) => formik.setFieldValue("role", value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Host">Main Host</SelectItem>
                    <SelectItem value="Co-host">Co-host</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (optional)</Label>
                <Input
                  id="company"
                  name="company"
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Host</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hosts.map((host) => (
              <TableRow key={host.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={host.image} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{host.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {host.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      host.role === "Main Host"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                    }
                  >
                    {host.role}
                  </Badge>
                </TableCell>
                <TableCell>
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
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {host.permissions.map((perm) => (
                      <Badge key={perm} variant="secondary" className="text-xs">
                        {perm.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(EventHosts, "EVENTS", "canRead"),
  "events"
);

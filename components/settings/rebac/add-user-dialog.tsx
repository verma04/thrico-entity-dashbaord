"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  useGetRoles,
  useCreateAdmin,
  useUpdateAdminUser,
  AdminUser,
} from "@/graphql/actions";
import {
  Loader2,
  ShieldCheck,
  Trash2,
  Lock,
  Globe,
  Settings,
  Eye,
  EyeOff,
  Check,
  Circle,
  X,
  Info,
  User,
  Database,
  ShieldAlert,
  UserPlus,
} from "lucide-react";
import { ApolloError } from "@apollo/client";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useFormik } from "formik";
import * as Yup from "yup";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
}

export default function AddUserDialog({
  open,
  onOpenChange,
  user,
}: AddUserDialogProps) {
  const { toast } = useToast();
  const { data: rolesData, loading: rolesLoading } = useGetRoles();

  const [createAdmin, { loading: creating }] = useCreateAdmin({
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Admin user created successfully",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: (err: ApolloError) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const [updateAdmin, { loading: updating }] = useUpdateAdminUser({
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Admin user updated successfully",
      });
      onOpenChange(false);
    },
    onError: (err: ApolloError) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    role: user ? Yup.string() : Yup.string().required("Assigned role is required"),
    password: user ? Yup.string() : Yup.string().min(8, "Minimum 8 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      role: user?.role?.id || "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      if (user) {
        updateAdmin({
          variables: {
            adminId: user.id,
            input: {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
            },
          },
        });
      } else {
        createAdmin({
          variables: {
            input: {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              roleId: values.role,
              password: values.password,
            },
          },
        });
      }
    },
  });

  const resetForm = () => {
    formik.resetForm();
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const roles = rolesData?.getRoles || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden border-border/40 shadow-2xl bg-background rounded-2xl">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Refined Header */}
          <div className="bg-muted/20 px-8 py-6 border-b border-border/40">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                {user ? (
                  <Settings className="h-5 w-5" />
                ) : (
                  <UserPlus className="h-5 w-5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
                  {user ? "Update Team Member" : "Add New Team Member"}
                </DialogTitle>
                <DialogDescription className="text-xs font-medium text-muted-foreground mt-1 opacity-80">
                  {user
                    ? "Modify account details and platform access permissions."
                    : "Invite a new administrator to your workspace."}
                </DialogDescription>
              </div>
            </div>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="flex-1 overflow-hidden flex flex-col"
          >
            <ScrollArea className="flex-1 px-8 py-6">
              <div className="space-y-8 pb-4">
                {/* SECTION 1: IDENTITY */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/5 rounded-lg border border-primary/10">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                      Identity Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-[11px] font-medium text-muted-foreground/80 ml-0.5"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. Satoshi"
                        className="bg-muted/10 border-border/60 shadow-none focus-visible:ring-primary/20 h-10 px-4 font-medium rounded-xl"
                      />
                      {formik.touched.firstName && formik.errors.firstName && (
                        <p className="text-destructive text-[10px] font-medium mt-1 ml-0.5">
                          {formik.errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-[11px] font-medium text-muted-foreground/80 ml-0.5"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. Nakamoto"
                        className="bg-muted/10 border-border/60 shadow-none focus-visible:ring-primary/20 h-10 px-4 font-medium rounded-xl"
                      />
                      {formik.touched.lastName && formik.errors.lastName && (
                        <p className="text-destructive text-[10px] font-medium mt-1 ml-0.5">
                          {formik.errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[11px] font-medium text-muted-foreground/80 ml-0.5"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="name@company.com"
                      className="bg-muted/10 border-border/60 shadow-none h-10 px-4 font-medium focus-visible:ring-primary/20 rounded-xl"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <p className="text-destructive text-[10px] font-medium mt-1 ml-0.5">
                        {formik.errors.email}
                      </p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground font-medium px-0.5 opacity-60 italic">
                        The user will use this email to log in to the dashboard.
                      </p>
                    )}
                  </div>

                  {!user && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-[11px] font-medium text-muted-foreground/80 ml-0.5"
                      >
                        Initial Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="••••••••"
                          className="bg-muted/10 border-border/60 shadow-none h-10 px-4 font-medium focus-visible:ring-primary/20 rounded-xl"
                        />
                      </div>
                      {formik.touched.password && formik.errors.password ? (
                        <p className="text-destructive text-[10px] font-medium mt-1 ml-0.5">
                          {formik.errors.password}
                        </p>
                      ) : (
                        <p className="text-[10px] text-muted-foreground font-medium px-0.5 opacity-60 italic">
                          Security policy requires minimum 8 characters.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Separator className="opacity-30" />

                {/* SECTION 2: ACCESS CONTROL */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                      <ShieldAlert className="h-3.5 w-3.5 text-indigo-500" />
                    </div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                      Access Permissions
                    </h3>
                  </div>

                  {!user && (
                    <div className="space-y-4">
                      <div className="p-3.5 bg-indigo-50/30 border border-indigo-100/50 rounded-xl">
                        <div className="flex gap-3">
                          <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-indigo-700/80 font-medium leading-relaxed">
                            Select a role to define initial access. Roles can be adjusted later from the management panel.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[11px] font-medium text-muted-foreground/80 ml-0.5">
                          Assigned Role
                        </Label>
                        <Select
                          value={formik.values.role}
                          onValueChange={(value) =>
                            formik.setFieldValue("role", value)
                          }
                          disabled={user ? true : false}
                        >
                          <SelectTrigger className="h-11 font-medium bg-muted/10 border-border/60 shadow-none focus:ring-primary/20 rounded-xl transition-all">
                            <SelectValue placeholder="Search available roles..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-[250px] rounded-xl border-border/60 shadow-xl">
                            {rolesLoading ? (
                              <div className="p-6 flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-primary opacity-50" />
                              </div>
                            ) : (
                              roles.map((role) => (
                                <SelectItem
                                  key={role.id}
                                  value={role.id}
                                  className="font-medium py-2.5 rounded-lg focus:bg-primary/5 focus:text-primary"
                                >
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-sm">{role.name}</span>
                                    <span className="text-[10px] text-muted-foreground/70 font-medium line-clamp-1">
                                      {role.description ||
                                        "No description provided."}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {formik.touched.role && formik.errors.role && (
                          <p className="text-destructive text-[10px] font-medium mt-1 ml-0.5">
                            {formik.errors.role}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {user && (
                    <div className="p-4 bg-amber-50/50 border border-amber-100/50 rounded-xl flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-amber-100/40 flex items-center justify-center text-amber-600">
                        <ShieldAlert className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-amber-700 mb-0.5">
                          Role assignment is managed separately
                        </p>
                        <p className="text-[11px] text-amber-600/70 font-medium leading-snug">
                          Use the "Edit Role & Access" action to change this user's platform permissions.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            {/* Clean Footer */}
            <div className="px-8 py-6 bg-muted/20 border-t border-border/40 flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-widest mb-0.5">
                  IAM Service
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/80">
                  <Globe className="h-3 w-3 opacity-50" />
                  Management Console
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="font-medium text-xs px-5 h-10 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating || updating || !formik.isValid}
                  className={cn(
                    "font-medium text-xs px-8 h-10 rounded-xl shadow-sm transition-all active:scale-[0.98]",
                    !creating && !updating && formik.isValid
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "opacity-40",
                  )}
                >
                  {creating || updating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                      {user ? "Updating..." : "Creating..."}
                    </>
                  ) : user ? (
                    "Update User"
                  ) : (
                    "Initialize User"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

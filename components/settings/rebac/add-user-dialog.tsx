"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Loader2, ShieldAlert, UserPlus, UserCog, Info, Plus, Camera } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApolloError } from "@apollo/client";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFormik } from "formik";
import * as Yup from "yup";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: AdminUser | null;
}

export default function AddUserDialog({ open, onOpenChange, user }: AddUserDialogProps) {
  const { toast } = useToast();
  const { data: rolesData, loading: rolesLoading } = useGetRoles();

  const [createAdmin, { loading: creating }] = useCreateAdmin({
    onCompleted: () => {
      toast({ title: "Member added", description: "The new admin has been invited." });
      onOpenChange(false);
      formik.resetForm();
    },
    onError: (err: ApolloError) => {
      toast({ title: "Failed to add member", description: err.message, variant: "destructive" });
    },
  });

  const [updateAdmin, { loading: updating }] = useUpdateAdminUser({
    onCompleted: () => {
      toast({ title: "Member updated" });
      onOpenChange(false);
    },
    onError: (err: ApolloError) => {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: user ? Yup.string() : Yup.string().required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      role: user?.role?.id || "",
      avatar: user?.avatar || "",
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
              avatar: values.avatar,
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
              avatar: values.avatar,
            },
          },
        });
      }
    },
  });

  useEffect(() => {
    if (!open) formik.resetForm();
  }, [open]);

  const roles = rolesData?.getRoles || [];
  const isLoading = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-xl border-border/50">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-5 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-muted border border-border/60 flex items-center justify-center text-muted-foreground shrink-0">
              {user ? <UserCog className="h-4.5 w-4.5" /> : <UserPlus className="h-4.5 w-4.5" />}
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                {user ? "Edit member" : "Add team member"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {user
                  ? "Update this member's profile details."
                  : "Invite a new administrator to your workspace."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <ScrollArea className="max-h-[calc(90vh-180px)]">
            <div className="px-6 py-5 space-y-5">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center justify-center pb-2">
                <div className="relative group cursor-pointer">
                  <Avatar className="h-20 w-20 rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden">
                    <AvatarImage src={formik.values.avatar as any} className="object-cover" />
                    <AvatarFallback className="rounded-2xl bg-slate-50 text-slate-400 text-xl font-black">
                      {formik.values.firstName?.[0]}
                      {formik.values.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <Camera className="h-5 w-5 text-white" />
                  </div>

                  <div className="absolute -bottom-1 -right-1">
                    <ImageUploadWithCrop
                      currentImage={formik.values.avatar as any || ""}
                      onImageUpdate={(url) => formik.setFieldValue("avatar", url)}
                      label=""
                      aspectRatio={1}
                      circularCrop={true}
                      className="p-0"
                      dropzoneClassName="h-7 w-7 rounded-full bg-white shadow-md border-slate-200 flex items-center justify-center p-0"
                      previewClassName="hidden"
                    >
                      <div className="h-7 w-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                        <Plus className="h-3.5 w-3.5" />
                      </div>
                    </ImageUploadWithCrop>
                  </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
                  Profile Picture
                </p>
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-medium text-muted-foreground">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="First"
                    className={cn(
                      "h-9 text-sm",
                      formik.touched.firstName && formik.errors.firstName && "border-destructive"
                    )}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-[11px] text-destructive">{formik.errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-medium text-muted-foreground">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Last"
                    className={cn(
                      "h-9 text-sm",
                      formik.touched.lastName && formik.errors.lastName && "border-destructive"
                    )}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-[11px] text-destructive">{formik.errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="name@company.com"
                  disabled={!!user}
                  className={cn(
                    "h-9 text-sm",
                    formik.touched.email && formik.errors.email && "border-destructive"
                  )}
                />
                {formik.touched.email && formik.errors.email ? (
                  <p className="text-[11px] text-destructive">{formik.errors.email}</p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Used to log in to the dashboard.
                  </p>
                )}
              </div>

              {/* Role — only shown when creating */}
              {!user && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Assigned role
                  </Label>
                  <Select
                    value={formik.values.role}
                    onValueChange={(v) => formik.setFieldValue("role", v)}
                  >
                    <SelectTrigger
                      className={cn(
                        "h-9 text-sm",
                        formik.touched.role && formik.errors.role && "border-destructive"
                      )}
                    >
                      <SelectValue placeholder="Select a role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {rolesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            <div className="flex flex-col gap-0.5 py-0.5">
                              <span className="text-sm font-medium">{role.name}</span>
                              {role.description && (
                                <span className="text-[11px] text-muted-foreground">
                                  {role.description}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {formik.touched.role && formik.errors.role && (
                    <p className="text-[11px] text-destructive">{formik.errors.role}</p>
                  )}
                </div>
              )}

              {/* Edit-mode: role notice */}
              {user && (
                <div className="flex gap-3 p-3.5 bg-muted/40 border border-border/50 rounded-lg">
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    To change this member's role, use the{" "}
                    <strong className="font-medium text-foreground">Edit role & access</strong>{" "}
                    option from the member actions menu.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/40 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !formik.isValid}
              className="h-9 px-5 font-medium gap-2"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {user ? "Save changes" : "Add member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

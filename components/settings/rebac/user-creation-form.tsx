"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserPlus, UserCog, ChevronRight, Info } from "lucide-react";
import { useGetRoles, AdminUser } from "@/graphql/actions";
import { cn } from "@/lib/utils";
import { UserPreview } from "./user-preview";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { CtaButton } from "@/components/ui/cta-button";
interface UserCreationFormProps {
  initialValues?: Partial<AdminUser>;
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
});

export function UserCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
}: UserCreationFormProps) {
  const { data: rolesData, loading: rolesLoading } = useGetRoles();

  const formik = useFormik({
    initialValues: {
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      email: initialValues?.email || "",
      role: initialValues?.role?.id || "",
      avatar: initialValues?.avatar || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  const roles = rolesData?.getRoles || [];
  const isEditing = !!initialValues?.id;

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={isEditing ? "Edit Team Member" : "Add Team Member"}
        description={
          isEditing
            ? "Update member details and permissions."
            : "Invite a new member to your workspace."
        }
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Members", href: "/settings/users/all" },
          { label: isEditing ? "Edit" : "Create" },
        ]}
        icon={isEditing ? UserCog : UserPlus}
        badgeText="Access & RBAC"
        showLiveIndicator={false}
        actions={
          <EcosystemActionBar
            shadow="none"
            className="p-0 border-none bg-transparent gap-2"
          >
            <EcosystemActionBar.Group align="right">
              <CtaButton
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  if (onCancel) onCancel();
                  else window.history.back();
                }}
                disabled={loading}
              >
                Cancel
              </CtaButton>
              <CtaButton
                onClick={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                }}
                disabled={loading || (!formik.dirty && !isEditing)}
              >
                {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                {isEditing ? "Save Changes" : "Add Member"}
              </CtaButton>
            </EcosystemActionBar.Group>
          </EcosystemActionBar>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <form className="space-y-8" onSubmit={formik.handleSubmit}>
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl">Member Profile</CardTitle>
                    <CardDescription>
                      {isEditing
                        ? "Update this member's profile details."
                        : "Invite a new administrator to your workspace."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium"
                        >
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="First"
                          className={cn(
                            "h-10",
                            formik.touched.firstName &&
                              formik.errors.firstName &&
                              "border-destructive",
                          )}
                        />
                        {formik.touched.firstName &&
                          formik.errors.firstName && (
                            <p className="text-xs text-destructive">
                              {formik.errors.firstName as string}
                            </p>
                          )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium"
                        >
                          Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Last"
                          className={cn(
                            "h-10",
                            formik.touched.lastName &&
                              formik.errors.lastName &&
                              "border-destructive",
                          )}
                        />
                        {formik.touched.lastName && formik.errors.lastName && (
                          <p className="text-xs text-destructive">
                            {formik.errors.lastName as string}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="name@company.com"
                        disabled={isEditing}
                        className={cn(
                          "h-10",
                          formik.touched.email &&
                            formik.errors.email &&
                            "border-destructive",
                        )}
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <p className="text-xs text-destructive">
                          {formik.errors.email as string}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Used to log in to the dashboard.
                        </p>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Assigned Role{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formik.values.role}
                          onValueChange={(v) => formik.setFieldValue("role", v)}
                        >
                          <SelectTrigger
                            className={cn(
                              "h-10",
                              formik.touched.role &&
                                formik.errors.role &&
                                "border-destructive",
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
                              roles.map((role: any) => (
                                <SelectItem key={role.id} value={role.id}>
                                  <div className="flex flex-col gap-0.5 py-0.5">
                                    <span className="text-sm font-medium">
                                      {role.name}
                                    </span>
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
                          <p className="text-xs text-destructive">
                            {formik.errors.role as string}
                          </p>
                        )}
                      </div>
                    )}

                    {isEditing && (
                      <div className="flex gap-3 p-3.5 bg-muted/40 border border-border/50 rounded-lg mt-4">
                        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          To change this member's role, use the{" "}
                          <strong className="font-medium text-foreground">
                            Edit role & access
                          </strong>{" "}
                          option from the member actions menu on the members
                          table.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* Live Preview Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Member Preview</h3>
                  <Badge
                    variant="outline"
                    className="bg-green-500/5 text-green-600 border-green-500/20"
                  >
                    Live Preview
                  </Badge>
                </div>

                <UserPreview formData={formik.values} roles={roles} />

                <Card className="border-none shadow-sm ring-1 ring-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Info className="h-5 w-5" />
                      Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          The member will receive an email invitation to join
                          the dashboard
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          Assign the appropriate role to control what the member
                          can access
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          You can change the member's role later from the
                          members table
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

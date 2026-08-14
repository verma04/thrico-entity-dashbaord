"use client";

import React from "react";
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
import { Loader2, UserPlus, UserCog, Sparkles, ShieldCheck, Mail, Info } from "lucide-react";
import { useGetRoles, AdminUser } from "@/graphql/actions";
import { UserPreview } from "./user-preview";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";

interface UserCreationFormProps {
  initialValues?: Partial<AdminUser>;
  loading?: boolean;
  onFinish: (values: any) => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  role: Yup.string().required("Role assignment is required"),
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

  const selectedRoleName =
    roles.find((r: any) => r.id === formik.values.role)?.name || "Not selected";

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={isEditing ? "Edit Team Member" : "Invite Team Member"}
        description={
          isEditing
            ? "Update administrator identity, contact information, and workspace attributes."
            : "Provision access and invite a new administrator to manage your workspace."
        }
        badgeText="Access & RBAC"
        icon={isEditing ? UserCog : UserPlus}
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Administrators", href: "/settings/users" },
          { label: isEditing ? "Edit Member" : "Add Member" },
        ]}
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-6">
              {/* Live Member Preview */}
              <PolarisSidebarCard title="Member Preview" badge="Live Profile" icon={Sparkles}>
                <UserPreview formData={formik.values} roles={roles} />

                {/* Structured Configuration Breakdown */}
                <div className="space-y-1.5 pt-2">
                  <PolarisSummaryRow
                    label="Full Name"
                    value={
                      <span className="truncate max-w-[150px] inline-block font-semibold">
                        {[formik.values.firstName, formik.values.lastName]
                          .filter(Boolean)
                          .join(" ") || "Not set"}
                      </span>
                    }
                  />
                  <PolarisSummaryRow
                    label="Email"
                    value={
                      <span className="truncate max-w-[150px] inline-block">
                        {formik.values.email || "Not set"}
                      </span>
                    }
                  />
                  <PolarisSummaryRow
                    label="Access Role"
                    value={selectedRoleName}
                  />
                  <PolarisSummaryRow
                    label="Status"
                    value="Pending Invite"
                    isLast
                  />
                </div>
              </PolarisSidebarCard>

              {/* RBAC Security Tip */}
              <PolarisTipCard title="Security & RBAC Tip">
                Grant the least privileged role necessary for day-to-day operations. Granular permissions can be adjusted at any time under Settings &gt; Roles.
              </PolarisTipCard>
            </div>
          }
        >
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Step 1: Administrator Identity & Contact */}
            <PolarisFormCard
              step={1}
              title="Administrator Identity & Contact"
              description="Provide the personal name and email address used for dashboard authentication."
              badge="Identity"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    First Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="e.g., Sarah"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {formik.errors.firstName as string}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Last Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="e.g., Connor"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {formik.errors.lastName as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <Label htmlFor="email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Email Address <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="sarah.connor@organization.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isEditing}
                    className="h-10 pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold"
                  />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.email as string}
                  </p>
                ) : (
                  <p className="text-[10px] text-zinc-400">
                    An official invitation link with onboarding credentials will be dispatched to this inbox.
                  </p>
                )}
              </div>
            </PolarisFormCard>

            {/* Step 2: RBAC Access Role */}
            <PolarisFormCard
              step={2}
              title="Role-Based Access Control (RBAC)"
              description="Select the security permission level and administrative authorization for this user."
              badge="Security"
            >
              {!isEditing ? (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Assigned Workspace Role <span className="text-rose-500">*</span>
                  </Label>
                  <Select
                    value={formik.values.role}
                    onValueChange={(v) => formik.setFieldValue("role", v)}
                  >
                    <SelectTrigger className="h-10 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-xs font-semibold">
                      <SelectValue placeholder="Select an administrative role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {rolesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        </div>
                      ) : (
                        roles.map((role: any) => (
                          <SelectItem key={role.id} value={role.id}>
                            <div className="flex flex-col gap-0.5 py-0.5 text-left">
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                {role.name}
                              </span>
                              {role.description && (
                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
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
                    <p className="text-[11px] text-rose-500 font-medium">
                      {formik.errors.role as string}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40">
                  <Info className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    To modify this administrator's RBAC role, use the <strong className="font-semibold text-zinc-900 dark:text-zinc-100">Edit role & access</strong> action on the administrators directory table.
                  </p>
                </div>
              )}
            </PolarisFormCard>

            {/* Floating Action Bar */}
            <FloatingSavePanel
              hasChanged={formik.dirty}
              saved={false}
              isSaving={loading}
              onSave={() => formik.handleSubmit()}
              onReset={() => {
                formik.resetForm();
                if (onCancel) onCancel();
                else window.history.back();
              }}
              title={isEditing ? "Save Administrator Changes" : "Send Admin Invitation"}
              description="You have pending changes to this administrator profile."
              buttonText={isEditing ? "Save Changes" : "Send Invitation"}
            />
          </form>
        </PolarisFormLayout>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

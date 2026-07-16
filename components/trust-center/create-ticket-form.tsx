"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Search, UserCheck, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useSearchUserByName } from "@/graphql/actions/mentorship/mentorship-actions";
import { useDebounce } from "use-debounce";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";

export interface CreateTicketFormProps {
  onCancel: () => void;
  onCreateTicket: (
    subject: string,
    category: any,
    subCategory: string | undefined,
    description: string,
    targetUserId?: string,
    targetUserIds?: string[],
    allowReplies?: boolean,
  ) => Promise<void> | void;
  loading?: boolean;
}

const validationSchema = Yup.object().shape({
  recipientType: Yup.string().oneOf(["one", "multiple"]),
  selectedUser: Yup.mixed().when("recipientType", {
    is: "one",
    then: (schema) => schema.required("Please select a user"),
    otherwise: (schema) => schema.nullable(),
  }),
  selectedUsers: Yup.array().when("recipientType", {
    is: "multiple",
    then: (schema) => schema.min(1, "Please select at least one user"),
    otherwise: (schema) => schema.min(0),
  }),
  subject: Yup.string().required("Subject is required"),
  category: Yup.string().required("Category is required"),
  subCategory: Yup.string().nullable(),
  description: Yup.string().required("Details are required"),
  allowReplies: Yup.boolean(),
});

export function CreateTicketForm({
  onCancel,
  onCreateTicket,
  loading = false,
}: CreateTicketFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [searchUser, { data: searchData }] = useSearchUserByName();

  const formik = useFormik({
    initialValues: {
      recipientType: "one" as "one" | "multiple",
      selectedUser: null as any,
      selectedUsers: [] as any[],
      subject: "",
      category: "Entity Support",
      subCategory: "Policy Update",
      description: "",
      allowReplies: true,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      let targetUserId: string | undefined = undefined;
      let targetUserIds: string[] | undefined = undefined;

      if (values.recipientType === "one" && values.selectedUser) {
        targetUserId = values.selectedUser.id;
      } else if (
        values.recipientType === "multiple" &&
        values.selectedUsers.length > 0
      ) {
        targetUserIds = values.selectedUsers.map((u: any) => u.id);
      }

      await onCreateTicket(
        values.subject.trim(),
        values.category,
        values.subCategory || undefined,
        values.description.trim(),
        targetUserId,
        targetUserIds,
        values.allowReplies,
      );

      resetForm();
      setSearchQuery("");
    },
  });

  const { values, errors, touched, setFieldValue, handleSubmit, handleChange } = formik;

  useEffect(() => {
    if (debouncedSearchQuery.length >= 2) {
      searchUser({ variables: { name: debouncedSearchQuery } });
    }
  }, [debouncedSearchQuery, searchUser]);


  useEffect(() => {
    if (values.category === "Moderation") {
      setFieldValue("subCategory", "Block");
    } else if (values.category === "Entity Support") {
      setFieldValue("subCategory", "Policy Update");
    } else {
      setFieldValue("subCategory", "");
    }
  }, [values.category, setFieldValue]);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden rounded-t-[inherit]">
      {/* Header section - Sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b px-6 py-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                New Message / Ticket
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground ml-1">
              <span>Trust Center</span>
              <ChevronRight className="h-3 w-3" />
              <span>Create Broadcast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <form className="space-y-8">
                <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl">Recipient Information</CardTitle>
                <CardDescription>
                  Select who should receive this message
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Recipient Type
                  </label>
                  <div className="flex gap-2 max-w-sm">
                    <Button
                      type="button"
                      variant={values.recipientType === "one" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => {
                        setFieldValue("recipientType", "one");
                        setFieldValue("allowReplies", true);
                      }}
                    >
                      Specific User
                    </Button>
                    <Button
                      type="button"
                      variant={
                        values.recipientType === "multiple" ? "default" : "outline"
                      }
                      className="flex-1"
                      onClick={() => {
                        setFieldValue("recipientType", "multiple");
                        setFieldValue("allowReplies", true);
                      }}
                    >
                      Multiple
                    </Button>
                  </div>
                </div>

                {values.recipientType === "multiple" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Target Users
                    </label>

                    {values.selectedUsers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2 p-2 border border-border rounded-md bg-muted/30 max-h-32 overflow-y-auto">
                        {values.selectedUsers.map((u: any) => (
                          <div
                            key={u.id}
                            className="flex items-center gap-1.5 bg-background border border-border px-2 py-1 rounded-full"
                          >
                            <div className="h-4 w-4 rounded-full overflow-hidden bg-muted shrink-0">
                              {u.user?.avatar ? (
                                <Image
                                  src={`https://cdn.thrico.network/${u.user.avatar}`}
                                  alt="Avatar"
                                  width={16}
                                  height={16}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <UserCheck className="h-2.5 w-2.5 m-0.5 text-muted-foreground" />
                              )}
                            </div>
                            <span className="text-xs font-medium text-foreground">
                              {u.user?.firstName}
                            </span>
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-foreground ml-0.5"
                              onClick={() =>
                                setFieldValue(
                                  "selectedUsers",
                                  values.selectedUsers.filter((user: any) => user.id !== u.id),
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search to add users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn("pl-9", errors.selectedUsers && touched.selectedUsers && values.selectedUsers.length === 0 ? "border-destructive" : "")}
                      />
                      {searchQuery.length >= 2 && searchData?.searchUserByName && (
                        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
                          {searchData.searchUserByName.filter(
                            (u: any) => !values.selectedUsers.find((su: any) => su.id === u.id),
                          ).length === 0 ? (
                            <div className="p-3 text-xs text-muted-foreground text-center">
                              No more users found
                            </div>
                          ) : (
                            searchData.searchUserByName
                              .filter(
                                (u: any) =>
                                  !values.selectedUsers.find((su: any) => su.id === u.id),
                              )
                              .map((u: any) => (
                                <div
                                  key={u.id}
                                  className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer transition-colors"
                                  onClick={() => {
                                    setFieldValue("selectedUsers", [...values.selectedUsers, u]);
                                    setSearchQuery("");
                                  }}
                                >
                                  <div className="h-6 w-6 rounded-full overflow-hidden bg-muted shrink-0">
                                    {u.user?.avatar ? (
                                      <Image
                                        src={`https://cdn.thrico.network/${u.user.avatar}`}
                                        alt="Avatar"
                                        width={24}
                                        height={24}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <UserCheck className="h-4 w-4 m-1 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {u.user?.firstName} {u.user?.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {u.status}
                                    </p>
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      )}
                    </div>
                    {errors.selectedUsers && touched.selectedUsers && values.selectedUsers.length === 0 && (
                      <p className="text-xs text-destructive">{errors.selectedUsers as string}</p>
                    )}
                  </div>
                )}

                {values.recipientType === "one" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Target User
                    </label>
                    {!values.selectedUser ? (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users by name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={cn("pl-9", errors.selectedUser && touched.selectedUser ? "border-destructive" : "")}
                        />
                        {searchQuery.length >= 2 && searchData?.searchUserByName && (
                          <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
                            {searchData.searchUserByName.length === 0 ? (
                              <div className="p-3 text-sm text-muted-foreground text-center">
                                No users found
                              </div>
                            ) : (
                              searchData.searchUserByName.map((u: any) => (
                                <div
                                  key={u.id}
                                  className="flex items-center gap-2 p-3 hover:bg-muted cursor-pointer transition-colors"
                                  onClick={() => {
                                    setFieldValue("selectedUser", u);
                                    setSearchQuery("");
                                  }}
                                >
                                  <div className="h-8 w-8 rounded-full overflow-hidden bg-muted shrink-0">
                                    {u.user?.avatar ? (
                                      <Image
                                        src={`https://cdn.thrico.network/${u.user.avatar}`}
                                        alt="Avatar"
                                        width={32}
                                        height={32}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <UserCheck className="h-5 w-5 m-1.5 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {u.user?.firstName} {u.user?.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {u.status}
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 border border-border rounded-md bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-background shrink-0">
                            {values.selectedUser.user?.avatar ? (
                              <Image
                                src={`https://cdn.thrico.network/${values.selectedUser.user.avatar}`}
                                alt="Avatar"
                                width={32}
                                height={32}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <UserCheck className="h-5 w-5 m-1.5 text-muted-foreground" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {values.selectedUser.user?.firstName}{" "}
                            {values.selectedUser.user?.lastName}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFieldValue("selectedUser", null)}
                        >
                          Change
                        </Button>
                      </div>
                    )}
                    {errors.selectedUser && touched.selectedUser && !values.selectedUser && (
                      <p className="text-xs text-destructive">{errors.selectedUser as string}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl">Message Details</CardTitle>
                <CardDescription>
                  Enter the subject, category, and message body
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Subject
                  </label>
                  <Input
                    name="subject"
                    placeholder="Summarize the request"
                    value={values.subject}
                    onChange={handleChange}
                    className={cn(errors.subject && touched.subject ? "border-destructive" : "")}
                  />
                  {errors.subject && touched.subject && (
                    <p className="text-xs text-destructive">{errors.subject}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Category
                    </label>
                    <select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      className={cn("w-full h-10 px-3 text-sm bg-background border border-input rounded-md", errors.category && touched.category ? "border-destructive" : "")}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Entity Support">Entity Support</option>
                      <option value="Moderation">Moderation</option>
                      <option value="Appeals">Appeals</option>
                    </select>
                    {errors.category && touched.category && (
                      <p className="text-xs text-destructive">{errors.category}</p>
                    )}
                  </div>

                  {(values.category === "Moderation" || values.category === "Entity Support") && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Sub-Category
                      </label>
                      <select
                        name="subCategory"
                        value={values.subCategory}
                        onChange={handleChange}
                        className={cn("w-full h-10 px-3 text-sm bg-background border border-input rounded-md", errors.subCategory && touched.subCategory ? "border-destructive" : "")}
                      >
                        {values.category === "Moderation" && (
                          <>
                            <option value="Block">Block</option>
                            <option value="Warning">Warning</option>
                          </>
                        )}
                        {values.category === "Entity Support" && (
                          <>
                            <option value="Policy Update">Policy Update</option>
                            <option value="Platform Update">Platform Update</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Details
                  </label>
                  <div className={cn(errors.description && touched.description ? "ring-1 ring-destructive rounded-md" : "")}>
                    <RichTextEditor
                      value={values.description}
                      onChange={(val) => setFieldValue("description", val)}
                      placeholder="Describe the issue..."
                      minHeight="200px"
                    />
                  </div>
                  {errors.description && touched.description && (
                    <p className="text-xs text-destructive">{errors.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden mb-12">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl">Settings</CardTitle>
                <CardDescription>Configure thread permissions</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="allowReplies"
                    checked={values.allowReplies}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      Allow user replies
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {values.allowReplies
                        ? "Users can reply to this thread."
                        : "Only admins can reply to this thread."}
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Live Preview Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Message Preview</h3>
              <Badge
                variant="outline"
                className="bg-green-500/5 text-green-600 border-green-500/20"
              >
                Live Preview
              </Badge>
            </div>

            <Card className="border-none shadow-xl ring-1 ring-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
              <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden shrink-0">
                    <ShieldCheck className="h-7 w-7 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-lg leading-tight truncate">
                      {values.subject || "Message Subject"}
                    </h4>
                    <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1 truncate">
                      From: Entity Administration
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10"
                  >
                    {values.category || "Category"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-blue-500/5 text-blue-600 border-blue-500/10 hover:bg-blue-500/10"
                  >
                    {values.recipientType === "one"
                      ? values.selectedUser ? "1 Recipient" : "No Recipient"
                      : `${values.selectedUsers.length} Recipients`}
                  </Badge>
                  {values.subCategory && (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      {values.subCategory}
                    </Badge>
                  )}
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Message Content
                    </h5>
                    <div className="text-sm text-foreground/80 leading-relaxed border border-border/50 rounded-lg p-4 bg-background/50 min-h-[160px] max-h-[300px] overflow-y-auto">
                      {values.description ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: values.description }}
                          className="[&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_p]:mb-2 last:[&_p]:mb-0 [&_a]:underline"
                        />
                      ) : (
                        <p className="text-muted-foreground italic text-xs">Message body will appear here...</p>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-center text-muted-foreground italic">
                  Preview version - Final layout may vary slightly
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={false}
        isSaving={loading || formik.isSubmitting}
        onSave={() => formik.handleSubmit()}
        onReset={() => {
          formik.resetForm();
          if (onCancel) onCancel();
        }}
        title="Unsaved Message"
        description="You have unfilled form data."
        buttonText="Send Message"
      />
    </div>
  );
}

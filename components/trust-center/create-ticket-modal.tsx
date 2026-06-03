import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Search, UserCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useSearchUserByName } from "@/graphql/actions/mentorship/mentorship-actions";
import { useDebounce } from "use-debounce";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";

export interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTicket: (
    subject: string,
    category: any,
    subCategory: string | undefined,
    description: string,
    targetUserId?: string,
    targetUserIds?: string[],
    allowReplies?: boolean,
    recipientType?: "all" | "one" | "multiple",
  ) => Promise<void> | void;
}

const validationSchema = Yup.object().shape({
  recipientType: Yup.string().oneOf(["one", "multiple", "all"]),
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

export function CreateTicketModal({
  isOpen,
  onClose,
  onCreateTicket,
}: CreateTicketModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [searchUser, { data: searchData }] = useSearchUserByName();

  const formik = useFormik({
    initialValues: {
      recipientType: "one" as "all" | "one" | "multiple",
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
        values.recipientType,
      );

      resetForm();
      setSearchQuery("");
      onClose();
    },
  });

  const { values, errors, touched, setFieldValue, handleSubmit, handleChange } = formik;

  useEffect(() => {
    if (debouncedSearchQuery.length >= 2) {
      searchUser({ variables: { name: debouncedSearchQuery } });
    }
  }, [debouncedSearchQuery, searchUser]);

  useEffect(() => {
    if (values.recipientType === "all") {
      setFieldValue("category", "Announcement");
    } else if (
      values.category === "Announcement" ||
      values.category === "Policy Updates" ||
      values.category === "Security Notices"
    ) {
      setFieldValue("category", "Entity Support");
    }
  }, [values.recipientType, setFieldValue]);

  useEffect(() => {
    if (values.category === "Moderation") {
      setFieldValue("subCategory", "Block");
    } else if (values.category === "Entity Support") {
      setFieldValue("subCategory", "Policy Update");
    } else {
      setFieldValue("subCategory", "");
    }
  }, [values.category, setFieldValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            New Message / Ticket
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-muted-foreground">
              Recipient
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={values.recipientType === "one" ? "default" : "outline"}
                className="flex-1 h-8 text-xs"
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
                className="flex-1 h-8 text-xs"
                onClick={() => {
                  setFieldValue("recipientType", "multiple");
                  setFieldValue("allowReplies", true);
                }}
              >
                Multiple
              </Button>
              <Button
                type="button"
                variant={values.recipientType === "all" ? "default" : "outline"}
                className="flex-1 h-8 text-xs"
                onClick={() => {
                  setFieldValue("recipientType", "all");
                  setFieldValue("allowReplies", false);
                }}
              >
                All Members
              </Button>
            </div>
            {errors.recipientType && touched.recipientType && (
              <p className="text-[10px] text-destructive">{errors.recipientType}</p>
            )}
          </div>

          {values.recipientType === "multiple" && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Target Users
              </label>

              {values.selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 p-2 border border-border rounded-md bg-muted/30 max-h-24 overflow-y-auto">
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
                      <span className="text-[10px] font-medium text-foreground">
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
                  className={cn("h-9 pl-9 text-xs", errors.selectedUsers && touched.selectedUsers && values.selectedUsers.length === 0 ? "border-destructive" : "")}
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
                              <p className="text-xs font-medium text-foreground">
                                {u.user?.firstName} {u.user?.lastName}
                              </p>
                              <p className="text-[9px] text-muted-foreground">
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
                <p className="text-[10px] text-destructive">{errors.selectedUsers as string}</p>
              )}
            </div>
          )}

          {values.recipientType === "one" && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Target User
              </label>
              {!values.selectedUser ? (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn("h-9 pl-9 text-xs", errors.selectedUser && touched.selectedUser ? "border-destructive" : "")}
                  />
                  {searchQuery.length >= 2 && searchData?.searchUserByName && (
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
                      {searchData.searchUserByName.length === 0 ? (
                        <div className="p-3 text-xs text-muted-foreground text-center">
                          No users found
                        </div>
                      ) : (
                        searchData.searchUserByName.map((u: any) => (
                          <div
                            key={u.id}
                            className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer transition-colors"
                            onClick={() => {
                              setFieldValue("selectedUser", u);
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
                              <p className="text-xs font-medium text-foreground">
                                {u.user?.firstName} {u.user?.lastName}
                              </p>
                              <p className="text-[9px] text-muted-foreground">
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
                <div className="flex items-center justify-between p-2 border border-border rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full overflow-hidden bg-background shrink-0">
                      {values.selectedUser.user?.avatar ? (
                        <Image
                          src={`https://cdn.thrico.network/${values.selectedUser.user.avatar}`}
                          alt="Avatar"
                          width={24}
                          height={24}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserCheck className="h-4 w-4 m-1 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {values.selectedUser.user?.firstName}{" "}
                      {values.selectedUser.user?.lastName}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px]"
                    onClick={() => setFieldValue("selectedUser", null)}
                  >
                    Change
                  </Button>
                </div>
              )}
              {errors.selectedUser && touched.selectedUser && !values.selectedUser && (
                <p className="text-[10px] text-destructive">{errors.selectedUser as string}</p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Subject
            </label>
            <Input
              name="subject"
              placeholder="Summarize the request"
              value={values.subject}
              onChange={handleChange}
              className={cn("h-9 text-xs", errors.subject && touched.subject ? "border-destructive" : "")}
            />
            {errors.subject && touched.subject && (
              <p className="text-[10px] text-destructive">{errors.subject}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Category
            </label>
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
              className={cn("w-full h-9 px-3 text-xs bg-background border border-input rounded-md", errors.category && touched.category ? "border-destructive" : "")}
            >
              {values.recipientType === "all" ? (
                <>
                  <option value="Announcement">Announcement</option>
                  <option value="Policy Updates">Policy Updates</option>
                  <option value="Security Notices">Security Notices</option>
                </>
              ) : (
                <>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Entity Support">Entity Support</option>
                  <option value="Moderation">Moderation</option>
                  <option value="Appeals">Appeals</option>
                </>
              )}
            </select>
            {errors.category && touched.category && (
              <p className="text-[10px] text-destructive">{errors.category}</p>
            )}
          </div>

          {(values.category === "Moderation" || values.category === "Entity Support") && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">
                Sub-Category
              </label>
              <select
                name="subCategory"
                value={values.subCategory}
                onChange={handleChange}
                className={cn("w-full h-9 px-3 text-xs bg-background border border-input rounded-md", errors.subCategory && touched.subCategory ? "border-destructive" : "")}
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

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Details
            </label>
            <div className={cn(errors.description && touched.description ? "ring-1 ring-destructive rounded-md" : "")}>
              <RichTextEditor
                value={values.description}
                onChange={(val) => setFieldValue("description", val)}
                placeholder="Describe the issue..."
                minHeight="120px"
              />
            </div>
            {errors.description && touched.description && (
              <p className="text-[10px] text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="allowReplies"
                checked={values.allowReplies}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                <span className="text-xs font-medium text-foreground">
                  Allow user replies
                </span>
                <p className="text-[10px] text-muted-foreground">
                  {values.allowReplies
                    ? "Users can reply to this thread."
                    : "Only admins can reply to this thread."}
                </p>
              </div>
            </label>
          </div>

          <Button type="submit" className="w-full h-9 text-xs" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

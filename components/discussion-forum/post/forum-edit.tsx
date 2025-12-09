"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Lock, Edit3, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  editDiscussionForum,
  getDiscussionForumCategory,
} from "../../../graphql/actions/discussion-form";
import { discussionCategory, discussionForm } from "../ts-types";

const postSchema = Yup.object().shape({
  title: Yup.string()
    .required("Please enter a title for your post")
    .max(100, "Title must be 100 characters or less"),
  content: Yup.string()
    .required("Please enter content for your post")
    .max(500, "Content must be 500 characters or less"),
  category: Yup.string().required("Please select a category"),
  isAnonymous: Yup.boolean(),
});

export default function Edit({
  forum,
  open,
  onClose,
}: {
  forum: discussionForm | null;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isChanged, setIsChanged] = useState(false);

  const { data, loading } = getDiscussionForumCategory({
    variables: {
      input: {
        status: "ALL",
      },
    },
  });

  const onCompleted = () => {
    onClose();
    setIsChanged(false);
  };

  const [edit, { loading: loadBtn }] = editDiscussionForum({
    onCompleted,
  });

  const handleSubmit = (values: any) => {
    edit({
      variables: {
        input: {
          id: forum?.id,
          ...values,
        },
      },
    });
  };

  const initialValues = {
    title: forum?.title || "",
    content: forum?.content || "",
    category: forum?.category?.id || "",
    isAnonymous: forum?.isAnonymous || false,
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <Formik
          initialValues={initialValues}
          validationSchema={postSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, errors, touched, initialValues }) => {
            // Check if values changed
            const hasChanges = Object.keys(values).some(
              (key) =>
                values[key as keyof typeof values] !==
                initialValues[key as keyof typeof initialValues]
            );

            if (hasChanges !== isChanged) {
              setIsChanged(hasChanges);
            }

            return (
              <Form className="h-full flex flex-col">
                <SheetHeader>
                  <div className="flex items-center gap-2">
                    <SheetTitle>Edit Discussion Post</SheetTitle>
                    {isChanged && (
                      <Badge variant="secondary" className="animate-pulse">
                        Unsaved Changes
                      </Badge>
                    )}
                  </div>
                  <SheetDescription>
                    Update your post content and settings
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 space-y-6 py-6">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Field name="title">
                      {({ field }: any) => (
                        <Input
                          {...field}
                          id="title"
                          placeholder="Give your post a descriptive title"
                          className={
                            errors.title && touched.title
                              ? "border-red-500"
                              : ""
                          }
                        />
                      )}
                    </Field>
                    <div className="flex justify-between items-center">
                      <ErrorMessage
                        name="title"
                        component="p"
                        className="text-sm text-red-500"
                      />
                      <span className="text-xs text-muted-foreground">
                        {values.title.length}/100
                      </span>
                    </div>
                  </div>

                  {/* Content Field */}
                  <div className="space-y-2">
                    <Label htmlFor="content">
                      Content <span className="text-red-500">*</span>
                    </Label>
                    <Field name="content">
                      {({ field }: any) => (
                        <Textarea
                          {...field}
                          id="content"
                          placeholder="What would you like to discuss?"
                          rows={8}
                          className={
                            errors.content && touched.content
                              ? "border-red-500"
                              : ""
                          }
                        />
                      )}
                    </Field>
                    <div className="flex justify-between items-center">
                      <ErrorMessage
                        name="content"
                        component="p"
                        className="text-sm text-red-500"
                      />
                      <span className="text-xs text-muted-foreground">
                        {values.content.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Category Field */}
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={values.category}
                      onValueChange={(value) =>
                        setFieldValue("category", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          errors.category && touched.category
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {loading ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            Loading categories...
                          </div>
                        ) : (
                          data?.getDiscussionForumCategory.map(
                            (category: discussionCategory) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            )
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="category"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Anonymous Toggle */}
                  <Card className="border-dashed">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between space-x-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            <Label
                              htmlFor="isAnonymous"
                              className="font-medium"
                            >
                              Post Anonymously
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Your identity will be hidden from other users
                          </p>
                        </div>
                        <Switch
                          id="isAnonymous"
                          checked={values.isAnonymous}
                          onCheckedChange={(checked) =>
                            setFieldValue("isAnonymous", checked)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <SheetFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose()}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isChanged || loadBtn}
                    className="gap-2"
                  >
                    {loadBtn ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </SheetFooter>
              </Form>
            );
          }}
        </Formik>
      </SheetContent>
    </Sheet>
  );
}

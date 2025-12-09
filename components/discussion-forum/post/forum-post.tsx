"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Lock, MessageSquare, X, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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

import {
  addDiscussionForum,
  getDiscussionForumCategory,
} from "../../../graphql/actions/discussion-form";
import { discussionCategory } from "../ts-types";

const postSchema = Yup.object({
  title: Yup.string().required().max(100),
  content: Yup.string().required().max(500),
  category: Yup.string().required(),
  isAnonymous: Yup.boolean(),
});

export default function Post() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data, loading } = getDiscussionForumCategory({
    variables: { input: { status: "ALL" } },
  });

  const [add, { loading: loadBtn }] = addDiscussionForum({
    onCompleted: () => setOpen(false),
  });

  const handleSubmit = (values: any, { resetForm }: any) => {
    add({ variables: { input: values } });
    resetForm();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Create Post
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <Formik
          initialValues={{
            title: "",
            content: "",
            category: "",
            isAnonymous: false,
          }}
          validationSchema={postSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="flex flex-col h-full">
              {/* Header */}
              <SheetHeader className="pb-4 border-b">
                <SheetTitle>Create a Discussion Post</SheetTitle>
                <SheetDescription>
                  Share your thoughts with the community
                </SheetDescription>
              </SheetHeader>

              {/* Body */}
              <div className="flex-1 space-y-6 py-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Field name="title" as={Input} placeholder="Post title" />
                  <ErrorMessage
                    name="title"
                    component="p"
                    className="text-sm text-red-500"
                  />
                  <p className="text-xs text-muted-foreground">
                    {values.title.length}/100
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label>Content *</Label>
                  <Field
                    name="content"
                    as={Textarea}
                    rows={8}
                    placeholder="Write your thoughts..."
                  />
                  <ErrorMessage
                    name="content"
                    component="p"
                    className="text-sm text-red-500"
                  />
                  <p className="text-xs text-muted-foreground">
                    {values.content.length}/500
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={values.category}
                    onValueChange={(v) => setFieldValue("category", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <div className="p-4 text-center">Loading...</div>
                      ) : (
                        data?.getDiscussionForumCategory.map(
                          (cat: discussionCategory) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
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

                {/* Anonymous */}
                <Card>
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <Label>Post Anonymously</Label>
                    </div>
                    <Switch
                      checked={values.isAnonymous}
                      onCheckedChange={(v) => setFieldValue("isAnonymous", v)}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Footer */}
              <SheetFooter className="border-t pt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loadBtn}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>

                <Button type="submit" disabled={loadBtn}>
                  {loadBtn ? "Posting..." : "Publish"}
                  <Send className="h-4 w-4 ml-2" />
                </Button>
              </SheetFooter>
            </Form>
          )}
        </Formik>
      </SheetContent>
    </Sheet>
  );
}

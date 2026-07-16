"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { postDiscussionForumComments } from "../../../graphql/actions/discussion-form";

interface PostCommentProps {
  id: string;
}

const commentSchema = Yup.object().shape({
  content: Yup.string()
    .required("Please enter your comment")
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment must be 1000 characters or less"),
});

const PostComment = ({ id }: PostCommentProps) => {
  const onCompleted = () => {
    // Form will be reset via resetForm
  };

  const [postComment, { loading }] = postDiscussionForumComments({
    onCompleted,
  });

  const handleSubmit = (values: any, { resetForm }: any) => {
    postComment({
      variables: {
        input: {
          ...values,
          discussionForumId: id,
        },
      },
    });
    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          Comments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{ content: "" }}
          validationSchema={commentSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content" className="sr-only">
                  Your comment
                </Label>
                <Field name="content">
                  {({ field }: any) => (
                    <Textarea
                      {...field}
                      id="content"
                      rows={4}
                      placeholder="What are your thoughts?"
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
                    {values.content?.length}/1000
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Comment
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default PostComment;

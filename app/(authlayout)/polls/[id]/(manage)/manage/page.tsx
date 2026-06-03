"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Loader2,
  CalendarIcon,
  X,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { editPolls, getPollByIdForUser } from "@/graphql/actions/polls";
import { useParams } from "next/navigation";

const pollSchema = Yup.object().shape({
  title: Yup.string()
    .required("Please enter a title")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  question: Yup.string()
    .required("Please enter a poll question")
    .min(5, "Question must be at least 5 characters")
    .max(200, "Question must be less than 200 characters"),
  options: Yup.array()
    .of(
      Yup.object().shape({
        option: Yup.string()
          .required("Option is required")
          .min(1, "Option cannot be empty")
          .max(100, "Option must be less than 100 characters"),
        id: Yup.string(),
      })
    )
    .min(2, "At least 2 options are required")
    .max(10, "Maximum 10 options allowed"),
  endDate: Yup.date().nullable(),
});

const visibilityOptions = [
  {
    value: "ALWAYS",
    label: "Everyone",
    desc: "Results are always public",
  },
  {
    value: "AFTER_VOTE",
    label: "After voting",
    desc: "People see results after they vote",
  },
  {
    value: "AFTER_END",
    label: "After Poll Ends",
    desc: "Results shown when poll closes",
  },
  {
    value: "ADMIN",
    label: "Only Admin",
    desc: "Only you can see the results",
  },
];

export default function EditPollPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, loading: fetchingPoll } = getPollByIdForUser({
    variables: {
      input: {
        pollId: id,
      },
    },
    skip: !id,
  });

  const poll = data?.getPollByIdForUser;

  const [resultVisibility, setResultVisibility] = useState("ALWAYS");

  const [edit, { loading }] = editPolls({
    onCompleted: () => {
      // Optional: show a success toast
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      question: "",
      endDate: null as Date | null,
      options: [] as { option: string; id: string }[],
    },
    validationSchema: pollSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      edit({
        variables: {
          input: { ...values, id, resultVisibility },
        },
      });
    },
  });

  useEffect(() => {
    if (poll) {
      setResultVisibility(poll.resultVisibility || "ALWAYS");
      formik.setValues({
        title: poll.title || "",
        question: poll.question || "",
        endDate: poll.endDate || null,
        options:
          poll.options
            ?.slice()
            .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
            .map((set: any) => ({
              option: set.text,
              id: set.id,
            })) || [],
      });
    }
  }, [poll]);

  const moveOption = (fromIndex: number, toIndex: number) => {
    const options = [...formik.values.options];
    const [movedItem] = options.splice(fromIndex, 1);
    options.splice(toIndex, 0, movedItem);
    formik.setFieldValue("options", options);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    formik.handleSubmit();
  };

  const canSubmit = formik.isValid && formik.dirty && !loading;

  if (fetchingPoll) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="bg-background rounded-xl border border-border shadow-sm p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Edit Poll</h2>
        <p className="text-sm text-muted-foreground">Modify your existing community poll</p>
      </div>

      <FormikProvider value={formik}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="poll-title" className="text-sm font-medium">
                Poll Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="poll-title"
                name="title"
                placeholder="Enter poll title"
                maxLength={100}
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-xs text-destructive">{formik.errors.title}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formik.values.title.length}/100 characters
              </p>
            </div>

            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="poll-question" className="text-sm font-medium">
                Question <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="poll-question"
                name="question"
                rows={4}
                className="resize-none"
                placeholder="Describe what your poll is asking"
                maxLength={200}
                value={formik.values.question}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.question && formik.errors.question && (
                <p className="text-xs text-destructive">{formik.errors.question}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formik.values.question.length}/200 characters
              </p>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Date (Optional)</Label>
              <div className="flex items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full md:w-[300px] h-10 justify-start text-left font-normal border-border bg-transparent",
                        !formik.values.endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formik.values.endDate
                        ? format(new Date(formik.values.endDate), "PPP")
                        : "Pick an end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formik.values.endDate
                          ? new Date(formik.values.endDate)
                          : undefined
                      }
                      onSelect={(date) => formik.setFieldValue("endDate", date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {formik.values.endDate && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => formik.setFieldValue("endDate", null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Answer Choices */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Answer Choices <span className="text-destructive">*</span>
                </Label>
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  {formik.values.options.length}/10
                </Badge>
              </div>

              <FieldArray
                name="options"
                render={(arrayHelpers) => (
                  <div className="space-y-2">
                    {formik.values.options.map((option, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="h-7 w-7 rounded-md bg-muted border border-border flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-muted-foreground">
                            {String.fromCharCode(65 + index)}
                          </span>
                        </div>

                        <Input
                          name={`options.${index}.option`}
                          placeholder={`Choice ${index + 1}`}
                          value={option.option}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm"
                        />
                        <Input
                          name={`options.${index}.id`}
                          type="hidden"
                          value={option.id}
                        />

                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
                            onClick={() => moveOption(index, index - 1)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
                            onClick={() => moveOption(index, index + 1)}
                            disabled={index === formik.values.options.length - 1}
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => arrayHelpers.remove(index)}
                            disabled={formik.values.options.length <= 2}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => arrayHelpers.push({ option: "", id: "" })}
                      className="w-full border-dashed text-muted-foreground hover:text-foreground"
                      disabled={formik.values.options.length >= 10}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Choice
                    </Button>
                  </div>
                )}
              />
            </div>

            <Separator />

            {/* Result Visibility */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <Label className="text-base font-semibold">Result Visibility</Label>
                  <p className="text-sm text-muted-foreground">Choose when voters can see the poll outcomes</p>
                </div>
              </div>
              <RadioGroup
                value={resultVisibility}
                onValueChange={setResultVisibility}
                className="space-y-3"
              >
                {visibilityOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className="flex items-start space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={opt.value} id={`vis-${opt.value}`} />
                    <Label htmlFor={`vis-${opt.value}`} className="font-normal cursor-pointer flex-1">
                      <div className="font-medium mb-0.5">{opt.label}</div>
                      <p className="text-sm text-muted-foreground">{opt.desc}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="shadow-sm border-primary/20 min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
}

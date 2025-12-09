"use client";

import { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Save,
  GripVertical,
  Eye,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import { addPoll } from "../../graphql/actions/polls";

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
      })
    )
    .min(2, "At least 2 options are required")
    .max(10, "Maximum 10 options allowed"),
});

export default function NewPoll() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [resultVisibility, setResultVisibility] = useState("ALWAYS");

  const onCompleted = () => {
    formik.resetForm();
    setResultVisibility("ALWAYS");
    setActiveTab("edit");
    setOpen(false);
  };

  const [add, { loading }] = addPoll({
    onCompleted,
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      question: "",
      options: [{ option: "" }, { option: "" }],
    },
    validationSchema: pollSchema,
    onSubmit: (values) => {
      add({
        variables: {
          input: { ...values, resultVisibility },
        },
      });
    },
  });

  const moveOption = (fromIndex: number, toIndex: number) => {
    const options = [...formik.values.options];
    const [movedItem] = options.splice(fromIndex, 1);
    options.splice(toIndex, 0, movedItem);
    formik.setFieldValue("options", options);
  };

  const getVisibilityDescription = (value: string) => {
    switch (value) {
      case "ALWAYS":
        return "Results are visible to everyone at all times";
      case "AFTER_VOTE":
        return "Results appear immediately after a user votes";
      case "AFTER_END":
        return "Results appear only after the poll ends";
      case "ADMIN":
        return "Results are only visible to administrators";
      default:
        return "";
    }
  };

  const canSubmit = formik.isValid && formik.dirty && !loading;

  return (
    <>
      <Button onClick={() => setOpen(true)} size="default">
        <Plus className="h-4 w-4 mr-2" />
        Create Poll
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full z-100 sm:max-w-[900px] overflow-y-auto p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-2xl">Create New Poll</SheetTitle>
            <SheetDescription>
              Design your poll with multiple options and customize how results
              are displayed
            </SheetDescription>
          </SheetHeader>

          <FormikProvider value={formik}>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col h-[calc(100vh-140px)]"
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1"
              >
                <div className="px-6 pt-4 border-b">
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="edit" className="gap-2">
                      <Settings2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="gap-2">
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Preview</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                      <Settings2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Settings</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <TabsContent value="edit" className="space-y-6 mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                          Set the title and main question for your poll
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">
                            Poll Title{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="title"
                            name="title"
                            className="text-lg font-semibold"
                            placeholder="e.g., Community Feature Preference"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.title && formik.errors.title && (
                            <p className="text-sm text-destructive flex items-center gap-1">
                              {formik.errors.title}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formik.values.title.length}/100 characters
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="question">
                            Poll Question{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="question"
                            name="question"
                            rows={3}
                            placeholder="e.g., Which feature would you like to see next?"
                            value={formik.values.question}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.question &&
                            formik.errors.question && (
                              <p className="text-sm text-destructive">
                                {formik.errors.question}
                              </p>
                            )}
                          <p className="text-xs text-muted-foreground">
                            {formik.values.question.length}/200 characters
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Poll Options</CardTitle>
                            <CardDescription>
                              Add at least 2 options (maximum 10)
                            </CardDescription>
                          </div>
                          <Badge variant="outline">
                            {formik.values.options.length}/10
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <FieldArray
                          name="options"
                          render={(arrayHelpers) => (
                            <>
                              {formik.values.options.map((option, index) => (
                                <div
                                  key={index}
                                  className="group flex items-start gap-2 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                                >
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="cursor-grab active:cursor-grabbing pt-2">
                                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Drag to reorder
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {index + 1}
                                      </Badge>
                                      <Input
                                        name={`options.${index}.option`}
                                        placeholder={`Option ${index + 1}`}
                                        value={option.option}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="flex-1"
                                      />
                                    </div>
                                    {formik.touched.options?.[index]?.option &&
                                      formik.errors.options?.[index] && (
                                        <p className="text-xs text-destructive ml-12">
                                          {typeof formik.errors.options[
                                            index
                                          ] === "string"
                                            ? formik.errors.options[index]
                                            : (
                                                formik.errors.options[
                                                  index
                                                ] as any
                                              )?.option}
                                        </p>
                                      )}
                                  </div>

                                  <div className="flex gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                              moveOption(index, index - 1)
                                            }
                                            disabled={index === 0}
                                          >
                                            <ArrowUp className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Move up</TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() =>
                                              moveOption(index, index + 1)
                                            }
                                            disabled={
                                              index ===
                                              formik.values.options.length - 1
                                            }
                                          >
                                            <ArrowDown className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          Move down
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    {formik.values.options.length > 2 && (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Delete option?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This will remove "
                                              {option.option ||
                                                `Option ${index + 1}`}
                                              " from your poll.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() =>
                                                arrayHelpers.remove(index)
                                              }
                                              className="bg-destructive hover:bg-destructive/90"
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    )}
                                  </div>
                                </div>
                              ))}

                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  arrayHelpers.push({ option: "" })
                                }
                                className="w-full"
                                disabled={formik.values.options.length >= 10}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
                              </Button>

                              {typeof formik.errors.options === "string" && (
                                <p className="text-sm text-destructive text-center">
                                  {formik.errors.options}
                                </p>
                              )}
                            </>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="preview" className="mt-0">
                    <Card>
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-muted-foreground" />
                          <CardTitle>Preview</CardTitle>
                        </div>
                        <CardDescription>
                          This is how your poll will appear to users
                        </CardDescription>
                      </CardHeader>
                      <Separator />
                      <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">
                            {formik.values.title || "Untitled Poll"}
                          </h3>
                          <p className="text-lg text-muted-foreground">
                            {formik.values.question ||
                              "Your poll question will appear here"}
                          </p>
                        </div>

                        <Separator />

                        <RadioGroup className="space-y-3">
                          {formik.values.options?.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                              <RadioGroupItem
                                value={option.option}
                                id={`preview-${index}`}
                              />
                              <Label
                                htmlFor={`preview-${index}`}
                                className="flex-1 cursor-pointer font-medium"
                              >
                                {option.option || `Option ${index + 1}`}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>

                        <div className="flex justify-end pt-4">
                          <Button type="button" size="lg">
                            Submit Vote
                          </Button>
                        </div>

                        {resultVisibility === "ALWAYS" && (
                          <div className="mt-6 space-y-4 p-4 rounded-lg bg-muted/30">
                            <p className="text-sm font-medium">
                              Results Preview
                            </p>
                            {formik.values.options?.map((option, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>
                                    {option.option || `Option ${index + 1}`}
                                  </span>
                                  <span className="text-muted-foreground">
                                    0 votes (0%)
                                  </span>
                                </div>
                                <Progress value={0} className="h-2" />
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Poll Settings</CardTitle>
                        <CardDescription>
                          Configure how and when results are displayed
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-base">
                            Results Visibility
                          </Label>
                          <Select
                            value={resultVisibility}
                            onValueChange={setResultVisibility}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ALWAYS">
                                <div className="flex flex-col items-start gap-1">
                                  <span className="font-medium">
                                    Always Visible
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Results shown at all times
                                  </span>
                                </div>
                              </SelectItem>
                              <SelectItem value="AFTER_VOTE">
                                <div className="flex flex-col items-start gap-1">
                                  <span className="font-medium">
                                    After Voting
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Results shown after user votes
                                  </span>
                                </div>
                              </SelectItem>
                              <SelectItem value="AFTER_END">
                                <div className="flex flex-col items-start gap-1">
                                  <span className="font-medium">
                                    After Poll Ends
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Results shown when poll closes
                                  </span>
                                </div>
                              </SelectItem>
                              <SelectItem value="ADMIN">
                                <div className="flex flex-col items-start gap-1">
                                  <span className="font-medium">
                                    Admin Only
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    Only admins can see results
                                  </span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">
                            {getVisibilityDescription(resultVisibility)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>

              <Separator />

              <SheetFooter className="px-6 py-4 bg-muted/30">
                <div className="flex items-center justify-between w-full">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => formik.resetForm()}
                      disabled={!formik.dirty}
                    >
                      Reset
                    </Button>
                    <Button type="submit" disabled={!canSubmit}>
                      {loading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Create Poll
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </SheetFooter>
            </form>
          </FormikProvider>
        </SheetContent>
      </Sheet>
    </>
  );
}

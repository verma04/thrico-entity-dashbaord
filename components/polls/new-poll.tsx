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

export default function NewPoll({
  standalone = true,
  onCompletedAction,
  onCancel,
}: {
  standalone?: boolean;
  onCompletedAction?: (pollId: string | number) => void;
  onCancel?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [resultVisibility, setResultVisibility] = useState("ALWAYS");

  const onCompleted = (data: any) => {
    formik.resetForm();
    setResultVisibility("ALWAYS");
    setActiveTab("edit");
    setOpen(false);
    if (onCompletedAction && data?.addPoll?.id) {
      onCompletedAction(data.addPoll.id);
    }
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

  const renderForm = () => (
    <FormikProvider value={formik}>
      <form
        onSubmit={formik.handleSubmit}
        className={standalone ? "flex flex-col h-[calc(100vh-140px)]" : "space-y-6 flex flex-col"}
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

          <div className={standalone ? "flex-1 overflow-y-auto px-6 py-6" : "px-0 py-6"}>
            <TabsContent value="edit" className="space-y-6 mt-0">
              <Card className={!standalone ? "border-none shadow-none bg-transparent" : ""}>
                <CardHeader className={!standalone ? "px-0 pt-0" : ""}>
                  <CardTitle>Poll Question</CardTitle>
                  <CardDescription>
                    What do you want to ask your community?
                  </CardDescription>
                </CardHeader>
                <CardContent className={!standalone ? "px-0 space-y-4" : "space-y-4"}>
                  <div className="space-y-2">
                    <Label htmlFor="title">Poll Title</Label>
                    <Input
                      id="title"
                      name="title"
                      className="text-lg font-semibold"
                      placeholder="e.g., Feedback on new features"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.title && formik.errors.title && (
                      <p className="text-sm text-destructive">{formik.errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      name="question"
                      rows={3}
                      placeholder="e.g., Which of these features do you find most useful?"
                      value={formik.values.question}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.question && formik.errors.question && (
                      <p className="text-sm text-destructive">{formik.errors.question}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className={!standalone ? "border-none shadow-none bg-transparent" : ""}>
                <CardHeader className={!standalone ? "px-0" : ""}>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Options</CardTitle>
                      <CardDescription>Add choices for your poll</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className={!standalone ? "px-0 space-y-3" : "space-y-3"}>
                  <FieldArray
                    name="options"
                    render={(arrayHelpers) => (
                      <>
                        {formik.values.options.map((option, index) => (
                          <div
                            key={index}
                            className="group flex items-start gap-2 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1 space-y-2">
                              <Input
                                name={`options.${index}.option`}
                                placeholder={`Option ${index + 1}`}
                                value={option.option}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </div>
                            <div className="pt-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => arrayHelpers.remove(index)}
                                  disabled={formik.values.options.length <= 2}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => arrayHelpers.push({ option: "" })}
                          className="w-full h-10 border-dashed"
                          disabled={formik.values.options.length >= 10}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Choice
                        </Button>
                      </>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
               {/* Simplified Preview for space */}
               <Card className={!standalone ? "border-none shadow-none bg-transparent" : ""}>
                  <CardHeader className={!standalone ? "px-0" : ""}>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent className={!standalone ? "px-0 space-y-6" : "space-y-6"}>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">{formik.values.title || "Untitled"}</h3>
                      <p className="text-muted-foreground">{formik.values.question || "Poll question goes here..."}</p>
                    </div>
                    <div className="space-y-2">
                      {formik.values.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 border rounded-xl bg-muted/10">
                          <div className="h-4 w-4 rounded-full border border-zinc-300" />
                          <span className="text-sm font-medium">{opt.option || `Choice ${i+1}`}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
               </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
               <Card className={!standalone ? "border-none shadow-none bg-transparent" : ""}>
                  <CardHeader className={!standalone ? "px-0" : ""}>
                    <CardTitle>Settings</CardTitle>
                  </CardHeader>
                  <CardContent className={!standalone ? "px-0 space-y-4" : "space-y-4"}>
                     <div className="space-y-2">
                        <Label>Results Visibility</Label>
                        <Select value={resultVisibility} onValueChange={setResultVisibility}>
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="ALWAYS">Always Public</SelectItem>
                              <SelectItem value="AFTER_VOTE">After Voting</SelectItem>
                              <SelectItem value="ADMIN">Admin Only</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </CardContent>
               </Card>
            </TabsContent>
          </div>
        </Tabs>

        {standalone ? (
          <SheetFooter className="px-6 py-4 bg-muted/30">
            <div className="flex items-center justify-between w-full">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <div className="flex gap-2">
                <Button type="submit" disabled={!canSubmit}>
                  {loading ? "Creating..." : "Create Poll"}
                </Button>
              </div>
            </div>
          </SheetFooter>
        ) : (
          <div className="flex items-center gap-3 pt-4 border-t px-0">
             <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12" disabled={!canSubmit}>
                {loading ? "Creating..." : "Create and Attach Poll"}
             </Button>
             <Button type="button" variant="ghost" className="rounded-xl h-12" onClick={onCancel}>
                Remove
             </Button>
          </div>
        )}
      </form>
    </FormikProvider>
  );

  if (!standalone) {
    return renderForm();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="default">
        <Plus className="h-4 w-4 mr-2" />
        Create Poll
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full z-100 sm:max-w-[800px] overflow-y-auto p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-2xl">Create New Poll</SheetTitle>
          </SheetHeader>
          {renderForm()}
        </SheetContent>
      </Sheet>
    </>
  );
}

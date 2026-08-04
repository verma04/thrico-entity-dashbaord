"use client";

import { useState } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikProvider,
  useFormik,
} from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  FileText,
  Calendar as CalendarIcon,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

export function SurveyCreationForm({
  initialValues,
  loading,
  onFinish,
  onCancel,
}: any) {
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const surveySchema = Yup.object({
    title: Yup.string()
      .required("Survey title is required")
      .max(100, "Max 100 characters"),
    description: Yup.string().max(500, "Max 500 characters"),
    startDate: Yup.date().nullable(),
    endDate: Yup.date()
      .nullable()
      .min(Yup.ref("startDate"), "End date cannot be before start date"),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      title: "",
      description: "",
      startDate: null,
      endDate: null,
    },
    validationSchema: surveySchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  const handleInputChange = (field: string, value: any) => {
    formik.setFieldValue(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <FormikProvider value={formik}>
      <>
        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Info */}
                  <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-indigo-600" />
                        <CardTitle className="text-lg font-bold text-slate-800">
                          Survey Information
                        </CardTitle>
                      </div>
                      <CardDescription className="text-slate-500 font-medium">
                        Basic details of the new survey
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="title"
                          className="text-sm font-bold text-slate-700"
                        >
                          Survey Title <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="e.g. Q3 Employee Engagement Survey"
                          className="h-11 rounded-xl border-slate-200 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                          value={formik.values.title}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.title && formik.errors.title && (
                          <p className="text-xs font-semibold text-rose-500">
                            {formik.errors.title as string}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Schedule */}
                  <Card className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden rounded-2xl bg-white">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <CalendarIcon className="h-4 w-4 text-indigo-600" />
                        <CardTitle className="text-lg font-bold text-slate-800">
                          Scheduling
                        </CardTitle>
                      </div>
                      <CardDescription className="text-slate-500 font-medium">
                        Set the duration for this survey
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Date */}
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-slate-700">
                            Start Date
                          </Label>
                          <Popover
                            open={isStartDateOpen}
                            onOpenChange={setIsStartDateOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-11 justify-start text-left font-normal rounded-xl border-slate-200 hover:bg-slate-50 transition-all",
                                  !formik.values.startDate && "text-slate-400",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                                {formik.values.startDate ? (
                                  format(formik.values.startDate, "PPP")
                                ) : (
                                  <span>Pick a start date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 rounded-2xl shadow-xl border-slate-100"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={formik.values.startDate}
                                onSelect={(date) => {
                                  handleInputChange("startDate", date);
                                  setIsStartDateOpen(false);
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                          <Label className="text-sm font-bold text-slate-700">
                            End Date
                          </Label>
                          <Popover
                            open={isEndDateOpen}
                            onOpenChange={setIsEndDateOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-11 justify-start text-left font-normal rounded-xl border-slate-200 hover:bg-slate-50 transition-all",
                                  !formik.values.endDate && "text-slate-400",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                                {formik.values.endDate ? (
                                  format(formik.values.endDate, "PPP")
                                ) : (
                                  <span>Pick an end date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 rounded-2xl shadow-xl border-slate-100"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={formik.values.endDate}
                                onSelect={(date) => {
                                  handleInputChange("endDate", date);
                                  setIsEndDateOpen(false);
                                }}
                                initialFocus
                                disabled={(date) =>
                                  formik.values.startDate
                                    ? date < formik.values.startDate
                                    : false
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          {formik.touched.endDate && formik.errors.endDate && (
                            <p className="text-xs font-semibold text-rose-500">
                              {formik.errors.endDate as string}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </form>
              </div>

              {/* Sidebar Info */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                  <Card className="border-none shadow-md shadow-indigo-600/5 ring-1 ring-slate-200 rounded-3xl overflow-hidden bg-white">
                    <div className="h-24 bg-linear-to-br from-indigo-600 to-violet-700" />
                    <div className="px-6 pb-8 -mt-12 text-center">
                      <div className="inline-flex p-1 bg-white rounded-3xl shadow-lg mb-4 group relative">
                        <div className="h-24 w-24 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                          <FileText className="h-10 w-10 text-slate-300" />
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 leading-tight">
                        {formik.values.title || "New Survey Draft"}
                      </h3>
                      <p className="text-sm font-semibold text-indigo-600 mt-1">
                        Survey Configuration
                      </p>

                      <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3 text-left">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                            <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              Duration
                            </span>
                            <span className="text-xs font-semibold text-slate-700 truncate">
                              {formik.values.startDate
                                ? format(formik.values.startDate, "MMM d, yyyy")
                                : "Unscheduled"}
                              {" - "}
                              {formik.values.endDate
                                ? format(formik.values.endDate, "MMM d, yyyy")
                                : "Open-ended"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-none shadow-sm ring-1 ring-slate-200 rounded-2xl bg-white">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Info className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">
                          Next Steps
                        </h4>
                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                          Creating a survey generates an empty draft. Once
                          created, you can access the survey editor to start
                          adding questions, configure advanced limits, and
                          adjust the theme and branding.
                        </p>
                      </div>
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
          isSaving={loading}
          onSave={handleSubmit}
          onReset={() => {
            formik.resetForm();
            if (onCancel) onCancel();
            else window.history.back();
          }}
          title="Unsaved Survey Data"
          description="You have unfilled form data."
          buttonText="Create Survey"
        />
      </>
    </FormikProvider>
  );
}

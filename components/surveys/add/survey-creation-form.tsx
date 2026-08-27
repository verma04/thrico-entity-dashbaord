"use client";

import React, { useState } from "react";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Sparkles, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { useModuleStore } from "@/store/useModuleStore";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";

export function SurveyCreationForm({
  initialValues,
  isEdit = false,
  loading,
  onFinish,
  onCancel,
}: any) {
  const singularName = useModuleStore((state) => state.surveySingularName);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const surveySchema = Yup.object({
    title: Yup.string()
      .required(`${singularName} title is required`)
      .max(100, "Max 100 characters"),
    description: Yup.string().max(500, "Max 500 characters").nullable(),
    startDate: Yup.date().nullable(),
    endDate: Yup.date()
      .nullable()
      .min(Yup.ref("startDate"), "End date cannot be before start date"),
  });

  const formik = useFormik({
    enableReinitialize: true,
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    formik.handleSubmit();
  };

  return (
    <FormikProvider value={formik}>
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Survey Preview Card */}
            <PolarisSidebarCard
              title={`${singularName} Preview`}
              badge="Draft Mode"
              icon={Sparkles}
            >
              <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <div className="h-8 w-8 rounded-[4px] bg-[#303030] dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-[13px] text-[#303030] dark:text-zinc-100 truncate">
                      {formik.values.title || `New ${singularName} Draft`}
                    </h4>
                    <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 mt-0.5">
                      Ready for question builder
                    </p>
                  </div>
                </div>

                {/* Timeline Snapshot */}
                <div className="pt-1.5 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Timeline:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
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

              {/* Structured Configuration Breakdown */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Survey Title"
                  value={
                    <span className="truncate max-w-[150px] inline-block font-semibold">
                      {formik.values.title || "Not specified"}
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Start Date"
                  value={
                    formik.values.startDate
                      ? format(formik.values.startDate, "MMM d, yyyy")
                      : "Immediate"
                  }
                />
                <PolarisSummaryRow
                  label="End Date"
                  value={
                    formik.values.endDate
                      ? format(formik.values.endDate, "MMM d, yyyy")
                      : "Indefinite"
                  }
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Survey Strategy Tip */}
            <PolarisTipCard title={`${singularName} Next Steps`}>
              Creating a {singularName.toLowerCase()} generates a draft
              workspace. After publishing, you can add multi-step questions,
              conditional logic, and response limits in the visual editor.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Step 1: Survey Title & Information */}
          <PolarisFormCard
            step={1}
            title={`Core ${singularName} Identity`}
            description="Specify the title and identifying context for this survey campaign."
            badge="Required"
          >
            <PolarisInput
              id="title"
              name="title"
              label={`${singularName} Title`}
              required
              placeholder="e.g., Q3 Community Feedback & Engagement Survey"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && formik.errors.title ? String(formik.errors.title) : undefined}
            />

            <div className="space-y-1 mt-3">
              <PolarisLabel>Description (Optional)</PolarisLabel>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Provide helpful context or instructions for respondents..."
                value={formik.values.description || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-[6px] border border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[12.5px] text-[#303030] dark:text-zinc-100 p-2.5 outline-none focus:ring-1 focus:ring-[#005bd3] focus:border-[#005bd3] transition-all resize-none shadow-2xs"
              />
            </div>
          </PolarisFormCard>

          {/* Step 2: Scheduling & Duration */}
          <PolarisFormCard
            step={2}
            title="Scheduling & Active Window"
            description="Configure launch and close dates to restrict member response submissions."
            badge="Schedule"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Date */}
              <div className="space-y-1">
                <PolarisLabel>Start Date</PolarisLabel>
                <Popover
                  open={isStartDateOpen}
                  onOpenChange={setIsStartDateOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-[34px] justify-start text-left font-normal rounded-[6px] border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[12.5px] text-[#303030] dark:text-zinc-100 px-2.5 cursor-pointer",
                        !formik.values.startDate && "text-[#8c9196]",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5 text-[#616161]" />
                      {formik.values.startDate ? (
                        format(formik.values.startDate, "PPP")
                      ) : (
                        <span>Pick a start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 rounded-[6px] shadow-lg border-[#d2d5d9] dark:border-zinc-800"
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
              <div className="space-y-1">
                <PolarisLabel>End Date</PolarisLabel>
                <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-[34px] justify-start text-left font-normal rounded-[6px] border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[12.5px] text-[#303030] dark:text-zinc-100 px-2.5 cursor-pointer",
                        !formik.values.endDate && "text-[#8c9196]",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5 text-[#616161]" />
                      {formik.values.endDate ? (
                        format(formik.values.endDate, "PPP")
                      ) : (
                        <span>Pick an end date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 rounded-[6px] shadow-lg border-[#d2d5d9] dark:border-zinc-800"
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
                  <p className="text-[12px] text-[#d72c0d] font-normal leading-[16px]">
                    {formik.errors.endDate as string}
                  </p>
                )}
              </div>
            </div>
          </PolarisFormCard>

          {/* Floating Save Action Bar */}
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
            title={isEdit ? `Save ${singularName}` : `Create ${singularName}`}
            description={
              isEdit
                ? `You have unsaved changes to this ${singularName.toLowerCase()} campaign configuration.`
                : "You have unsaved changes to this survey campaign configuration."
            }
            buttonText={isEdit ? "Save Changes" : `Create ${singularName}`}
          />
        </form>
      </PolarisFormLayout>
    </FormikProvider>
  );
}

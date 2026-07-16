"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Rocket,
  Users,
  Building2,
  Landmark,
  ChevronRight,
  Check,
} from "lucide-react";
import SelectPage from "./select-page";
import PageDetails from "./page-details";
import { useAddPage } from "@/graphql/actions/commany";

interface PageFormProps {
  onCompleted: (data: any) => void;
  value?: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Please enter your organization name"),
  url: Yup.string().required("Please enter thrico URL"),
  website: Yup.string().url("Please enter a valid URL").nullable(),
  industry: Yup.string().required("Please select an industry"),
  size: Yup.string().required("Please select organization size"),
  type: Yup.string().required("Please select organization type"),
  tagline: Yup.string()
    .max(120, "Tagline must be at most 120 characters")
    .nullable(),
  agreement: Yup.boolean().oneOf([true], "You must accept the terms"),
});

export default function PageForm({ onCompleted, value }: PageFormProps) {
  const pageTypes = [
    {
      type: "education",
      title: "Academia",
      description: "Schools and universities",
      icon: <GraduationCap size={60} />,
    },
    {
      type: "company",
      title: "Association",
      description: "Small, medium, and large businesses",
      icon: <Landmark size={60} />,
    },
    {
      type: "company",
      title: "Startup",
      description: "Small, medium, and large businesses",
      icon: <Rocket size={60} />,
    },
    {
      type: "company",
      title: "Enterprise",
      description: "Small, medium, and large businesses",
      icon: <Building2 size={60} />,
    },
    {
      type: "showcase",
      title: "Creator",
      description: "Sub-pages associated with an existing page",
      icon: <Users size={60} />,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [pageType, setPageType] = useState<string | null>(null);

  const [add, { loading }] = useAddPage({
    async onCompleted(data: any) {
      onCompleted(data);
      formik.resetForm();
      setCurrent(0);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: value || "",
      url: "",
      website: "",
      industry: "",
      size: "",
      type: "",
      tagline: "",
      logo: {
        file: null,
        url: null,
      },
      agreement: false,
    },
    validationSchema,
    onSubmit: (values) => {
      onFinish(values);
    },
  });

  const handlePageTypeSelect = (type: string) => {
    setPageType(type);
    setCurrent(1);
  };

  const onNext = async () => {
    // Basic validation for step 1 (Page Details)
    const fieldsToValidate = [
      "name",
      "url",
      "industry",
      "size",
      "type",
      "agreement",
    ];
    const errors = await formik.validateForm();

    // Check if any of the fields in this step have errors
    const stepErrors = fieldsToValidate.filter(
      (field) => !!(errors as any)[field]
    );

    // Mark fields as touched to show errors
    fieldsToValidate.forEach((field) => formik.setFieldTouched(field, true));

    if (stepErrors.length === 0) {
      setCurrent(current + 1);
    }
  };

  const onPrev = () => {
    setCurrent(current - 1);
  };

  const onFinish = (values: any) => {
    const { logo, agreement, ...restValues } = values;
    add({
      variables: {
        input: {
          ...restValues,
          location: {
            name: "India",
          },
          logo: logo.file ?? undefined,
          pageType: pageType ?? undefined,
        },
      },
    });
  };

  const steps = [
    {
      title: "Select Type",
      description: "Organization identity",
      content: (
        <SelectPage pageTypes={pageTypes} onSelect={handlePageTypeSelect} />
      ),
    },
    {
      title: "Details",
      description: "Profile information",
      content: <PageDetails formik={formik} onFinish={onFinish} />,
    },
    {
      title: "Confirm",
      description: "Finalize & Launch",
      content: (
        <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary ring-4 ring-primary/5">
            <Check className="h-10 w-10" />
          </div>
          <h3 className="text-3xl font-bold mb-4 tracking-tight">
            Your page is ready to be created!
          </h3>
          <p className="text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed">
            Review your information and click the button below to publish your
            organization's official page on Thrico.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button
              disabled={loading}
              size="lg"
              onClick={() => formik.handleSubmit()}
              className="px-12 py-6 rounded-xl text-lg shadow-lg hover:shadow-primary/20 transition-all font-bold"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Page...
                </div>
              ) : (
                "Create Thrico Page"
              )}
            </Button>
            <p className="text-xs text-muted-foreground italic">
              By clicking Create Page, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl  mx-auto p-4 md:p-8 space-y-12">
      {/* Step Indicator */}
      <div className="relative flex justify-between items-start max-w-3xl mx-auto mb-16 px-4">
        {/* Progress Line */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-muted z-0">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${(current / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isActive = index === current;
          const isCompleted = index < current;

          return (
            <div
              key={index}
              className="relative flex flex-col items-center z-10 w-1/3"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 font-bold border-2",
                  isActive
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-110"
                    : isCompleted
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-muted-foreground border-muted hover:border-primary/50"
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              <div className="mt-4 text-center">
                <p
                  className={cn(
                    "text-sm font-bold transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-muted-foreground hidden sm:block uppercase tracking-widest mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">{steps[current]?.content}</div>

      {/* Navigation Buttons */}
      <div className="mt-12 flex items-center justify-between border-t pt-8">
        <div>
          {current > 0 && (
            <Button
              variant="ghost"
              onClick={onPrev}
              className="group gap-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>
          )}
        </div>

        <div className="flex gap-4">
          {current === 0 ? (
            <p className="text-sm text-muted-foreground italic flex items-center h-10">
              Please select a page type to continue
            </p>
          ) : (
            current < steps.length - 1 && (
              <Button onClick={onNext} className="min-w-[120px] group gap-2">
                Next Step
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

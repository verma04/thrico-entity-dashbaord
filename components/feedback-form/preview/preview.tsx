import React, { useState, useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ScrollView } from "./scroll-view";

import { MultiStepPreview } from "./multi-step-preview";
import { FormSettings, Question } from "@/store/ts-types";

interface PreviewProps {
  formTitle: string;
  formDescription?: string;
  questions: Question[];
  formSettings: FormSettings;
}

const Preview: React.FC<PreviewProps> = ({
  formTitle,
  formDescription,
  questions,
  formSettings,
}) => {
  const [active, setActive] = useState("1");
  const [showTypeFormPreview, setShowTypeFormPreview] = useState(false);

  const onChange = (key: string) => {
    key === "2" && setShowTypeFormPreview(true);
    setActive(key);
  };

  const initialValues = useMemo(() => {
    const values: Record<string, any> = {};
    questions.forEach((q) => {
      values[q.id] = "";
      if (q.type === "MULTIPLE_CHOICE" && q.allowMultiple) {
        values[q.id] = [];
      }
    });
    return values;
  }, [questions]);

  const validationSchema = useMemo(() => {
    const shape: Record<string, any> = {};
    questions.forEach((q) => {
      let validator: any = Yup.mixed();

      if (q.required) {
        if (q.type === "MULTIPLE_CHOICE" && q.allowMultiple) {
          validator = Yup.array()
            .min(1, "Please select at least one option")
            .required("This field is required");
        } else if (q.type === "EMAIL") {
          validator = Yup.string()
            .email("Invalid email")
            .required("This field is required");
        } else if (q.type === "NUMBER") {
          validator = Yup.number().required("This field is required");
        } else {
          validator = Yup.string().required("This field is required");
        }
      } else {
        // Optional validations
        if (q.type === "EMAIL") {
          validator = Yup.string().email("Invalid email");
        } else if (q.type === "NUMBER") {
          validator = Yup.number();
        }
      }

      shape[q.id] = validator;
    });
    return Yup.object().shape(shape);
  }, [questions]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Form submitted:", values);
        alert("Form submitted! Check console for values.");
      }}
    >
      {({ handleSubmit }) => (
        <Tabs value={active} onValueChange={onChange}>
          <TabsList>
            <TabsTrigger value="1">ScrollView</TabsTrigger>
            <TabsTrigger value="2">Multi Step View</TabsTrigger>
          </TabsList>

          <TabsContent value="1">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold">{formTitle}</h3>
                    {formDescription && (
                      <p className="text-muted-foreground mt-2">
                        {formDescription}
                      </p>
                    )}
                  </div>

                  {questions.map((question, index) => (
                    <div key={question.id}>
                      {index > 0 && <Separator className="my-6" />}
                      <ScrollView
                        question={question}
                        formSettings={formSettings}
                      />
                    </div>
                  ))}

                  <div className="flex justify-end mt-6">
                    <Button onClick={() => handleSubmit()}>Submit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="2">
            {showTypeFormPreview && (
              <MultiStepPreview
                formSettings={formSettings}
                formTitle={formTitle}
                formDescription={formDescription}
                questions={questions}
                onClose={() => {
                  setShowTypeFormPreview(false);
                  setActive("1");
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </Formik>
  );
};

export default Preview;

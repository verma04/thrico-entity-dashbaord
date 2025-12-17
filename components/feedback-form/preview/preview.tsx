import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ScrollView } from "./scroll-view";
import { FormSettings, Question } from "../../../../store/ts-types";
import { MultiStepPreview } from "./multi-step-preview";

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

  return (
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
                  <p className="text-muted-foreground mt-2">{formDescription}</p>
                )}
              </div>

              {questions.map((question, index) => (
                <div key={question.id}>
                  {index > 0 && <Separator className="my-6" />}
                  {ScrollView(question)}
                </div>
              ))}

              <div className="flex justify-end mt-6">
                <Button>Submit</Button>
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
  );
};

export default Preview;

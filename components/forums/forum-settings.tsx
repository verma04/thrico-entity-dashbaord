"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import { Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useModuleStore } from "@/store/useModuleStore";

type formType = {
  loading: boolean;
  update: (args: any) => void;
  data: Record<string, any>;
};

const Settings = ({ loading, update, data }: formType) => {
  const [isChanged, setIsChanged] = useState(false);
  const moduleName = useModuleStore((state) => state.forumModuleName);
  const singularName = useModuleStore((state) => state.forumSingularName);

  const handleSubmit = (values: any) => {
    update({
      variables: {
        input: values,
      },
    });
    setIsChanged(false);
  };

  return (
    <Formik initialValues={data} onSubmit={handleSubmit} enableReinitialize>
      {({ values, setFieldValue, initialValues }) => {
        // Check if values changed
        const hasChanges = Object.keys(values).some(
          (key) => values[key] !== initialValues[key]
        );

        if (hasChanges !== isChanged) {
          setIsChanged(hasChanges);
        }

        return (
          <Form>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{singularName} Settings</CardTitle>
                    <CardDescription>
                      Configure {singularName.toLowerCase()} permissions and auto-approval
                      settings
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {isChanged && (
                      <Badge variant="secondary" className="animate-pulse">
                        Unsaved Changes
                      </Badge>
                    )}
                    <Button
                      type="submit"
                      disabled={!isChanged || loading}
                      className="gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Auto Approve Setting */}
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="allowDiscussionForum"
                        className="text-base font-medium"
                      >
                        Auto Approve {moduleName}
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Automatically approve new {moduleName.toLowerCase()} without
                              manual review
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      New {moduleName.toLowerCase()} will be published immediately without
                      moderation
                    </p>
                  </div>
                  <Switch
                    id="allowDiscussionForum"
                    checked={values.allowDiscussionForum}
                    onCheckedChange={(checked) =>
                      setFieldValue("allowDiscussionForum", checked)
                    }
                  />
                </div>

                {/* Allow Forum Setting */}
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="autoApproveDiscussionForum"
                        className="text-base font-medium"
                      >
                        Enable {moduleName}
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Turn off temporarily if you need to pause
                              {moduleName}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow users to create and participate in {moduleName.toLowerCase()}
                    </p>
                  </div>
                  <Switch
                    id="autoApproveDiscussionForum"
                    checked={values.autoApproveDiscussionForum}
                    onCheckedChange={(checked) =>
                      setFieldValue("autoApproveDiscussionForum", checked)
                    }
                  />
                </div>

                {/* Info Banner */}
                {!values.autoApproveDiscussionForum && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 p-4 border border-amber-200 dark:border-amber-800">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        <p className="font-medium mb-1">
                          {moduleName} Disabled
                        </p>
                        <p className="text-amber-700 dark:text-amber-300">
                          The {singularName.toLowerCase()} is currently disabled. Users
                          won't be able to create or view {moduleName.toLowerCase()}.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Settings;

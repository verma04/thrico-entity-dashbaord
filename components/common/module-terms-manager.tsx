"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Loader2, Save, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetTermsAndConditionsByModule,
  useUpdateTermsAndConditionsByModule,
} from "@/graphql/actions/faq";

interface ModuleTermsManagerProps {
  moduleName: string;
  title?: string;
  description?: string;
  placeholder?: string;
}

export function ModuleTermsManager({
  moduleName,
  title = "Terms & Conditions",
  description = "Manage terms and conditions for this module",
  placeholder = "Enter terms and conditions here...",
}: ModuleTermsManagerProps) {
  const { toast } = useToast();
  const [termsContent, setTermsContent] = useState<string>("");
  const [hasChanged, setHasChanged] = useState(false);

  // Fetch Terms data
  const { data, loading } = useGetTermsAndConditionsByModule({
    variables: {
      input: {
        module: moduleName,
      },
    },
  });

  // Update terms content when data is loaded
  useEffect(() => {
    if (data?.getTermsAndConditionsByModule?.termsAndConditions) {
      setTermsContent(data.getTermsAndConditionsByModule.termsAndConditions);
    }
  }, [data]);

  // Update Terms mutation
  const [updateTerms, { loading: updating }] =
    useUpdateTermsAndConditionsByModule({
      module: moduleName,
      onCompleted: () => {
        toast({
          title: "Terms Updated",
          description: "Terms and conditions have been successfully updated.",
        });
        setHasChanged(false);
      },
      onError: (error: Error) => {
        toast({
          title: "Error",
          description:
            error.message || "Failed to update terms and conditions.",
          variant: "destructive",
        });
      },
    });

  const handleContentChange = (value: string) => {
    setTermsContent(value);
    setHasChanged(
      value !== (data?.getTermsAndConditionsByModule?.termsAndConditions || "")
    );
  };

  const handleSave = async () => {
    try {
      await updateTerms({
        variables: {
          module: moduleName,
          termsAndConditions: termsContent,
        },
      });
    } catch (error) {
      console.error("Error updating terms:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>{title}</CardTitle>
            </div>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <Button
            onClick={handleSave}
            disabled={!hasChanged || updating}
            size="sm"
          >
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RichTextEditor
            value={termsContent}
            onChange={handleContentChange}
            placeholder={placeholder}
            minHeight="400px"
          />

          {hasChanged && (
            <p className="text-sm text-muted-foreground">
              You have unsaved changes
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

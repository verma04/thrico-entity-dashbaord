"use client";

import { useState } from "react";

import { updateMemberTermsAndConditions } from "../../../../graphql/actions/user";
import { useToast } from "@/hooks/use-toast";
import { useMembersTermsAndConditions } from "@/graphql/actions";

// Mock API function - replace with actual API call
const saveTermsAndConditions = async (type: string, content: string) => {
  // Simulate API call
  return { success: true };
};

export default function TermsPage() {
  const { data, loading } = useMembersTermsAndConditions();
  const [update, { loading: loadBtn }] = updateMemberTermsAndConditions({});
  const { toast } = useToast();

  // Mock initial content - replace with actual data fetching
  const initialTerms = "";

  const handleSave = async (type: string, content: string) => {
    try {
      update({
        variables: {
          input: {
            termAndConditionsMembers: content,
          },
        },
      });
      toast({
        title: "Success",
        description: `${
          type === "terms" ? "Terms and Conditions" : "Privacy Policy"
        } saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to save ${
          type === "terms" ? "Terms and Conditions" : "Privacy Policy"
        }.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <> </>
    // <TermsEditor
    //   title="Terms and Conditions"
    //   initialContent={
    //     data?.getMembersTermsAndConditions?.termAndConditionsMembers
    //   }
    //   loading={loadBtn}
    //   onSave={(content) => handleSave("terms", content)}
    // />
  );
}

"use client";

import { useState } from "react";

// Ant Design imports
import { Tabs, Card, Button, Typography, Divider, Empty, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { TermsEditor } from "../../../../components/text-editor/TermsEditor";
import { getMembersTermsAndConditions } from "../../../../graphql/actions";
import { updateMemberTermsAndConditions } from "../../../../graphql/actions/user";

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

// Mock API function - replace with actual API call
const saveTermsAndConditions = async (type: string, content: string) => {
  // Simulate API call

  return { success: true };
};

export default function TermsPage() {
  const { data, loading } = getMembersTermsAndConditions();
  const [update, { loading: loadBtn }] = updateMemberTermsAndConditions({});
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
    } catch (error) {
      message.error(
        `Failed to save ${type === "terms" ? "Terms and Conditions" : "Privacy Policy"}.`
      );
    }
  };

  console.log(data);
  return (
    <>
      {!loading && (
        <TermsEditor
          title="Terms and Conditions"
          initialContent={
            data?.getMembersTermsAndConditions?.termAndConditionsMembers
          }
          loading={loadBtn}
          onSave={(content) => handleSave("terms", content)}
        />
      )}
    </>
  );
}

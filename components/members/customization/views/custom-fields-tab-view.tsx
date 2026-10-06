"use client";

import React from "react";
import { CustomFieldsBuilder } from "../custom-fields-builder";
import { useMemberCustomization } from "../member-customization-context";

export function CustomFieldsTabView() {
  const { formik, handleCustomFieldsChange } = useMemberCustomization();

  return (
    <div className="space-y-4">
      <CustomFieldsBuilder
        fields={formik.values.customFields}
        onChange={handleCustomFieldsChange}
      />
    </div>
  );
}

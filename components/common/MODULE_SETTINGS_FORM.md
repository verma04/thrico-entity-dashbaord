# Module Settings Form - Reusable Component

## Overview

The `ModuleSettingsForm` is a generic, reusable component for creating settings pages across all modules in the application. It provides a consistent UI and behavior for managing module-specific settings.

## Location

`/components/common/module-settings-form.tsx`

## Features

- ✅ **Generic & Type-Safe**: Uses TypeScript generics to support any settings structure
- ✅ **Multiple Field Types**: Supports switch, text, and number input types
- ✅ **Change Detection**: Automatically tracks changes and enables/disables save button
- ✅ **Loading States**: Built-in loading state handling
- ✅ **Consistent UI**: Uses shadcn/ui components for a uniform look
- ✅ **Flexible Configuration**: Customizable title, description, and fields

## Usage

### Basic Example

```tsx
"use client";

import { ModuleSettingsForm } from "@/components/common/module-settings-form";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { data, loading } = useEntitySettings();
  const [update, { loading: loadingBtn }] = useUpdateEntitySettings({});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const fields = [
    {
      key: "allowCommunity",
      label: "Allow Community Creation",
      description: "Enable or disable the ability to create new communities",
    },
    {
      key: "autoApproveCommunity",
      label: "Auto Approve Communities",
      description: "Automatically approve new community creation requests",
    },
  ];

  return (
    <ModuleSettingsForm
      title="Community Settings"
      description="Configure community and group management settings"
      fields={fields}
      onSave={(settings) => {
        update({
          variables: {
            input: settings,
          },
        });
      }}
      isLoading={loadingBtn}
      data={{
        allowCommunity: data?.getEntitySettings?.allowCommunity ?? true,
        autoApproveCommunity:
          data?.getEntitySettings?.autoApproveCommunity ?? false,
      }}
    />
  );
};

export default Settings;
```

### Advanced Example with Different Field Types

```tsx
const fields = [
  {
    key: "allowEvents",
    label: "Allow Events",
    description: "Enable or disable event creation",
    type: "switch", // Default type
  },
  {
    key: "maxEventsPerUser",
    label: "Max Events Per User",
    description: "Maximum number of events a user can create",
    type: "number",
  },
  {
    key: "eventPrefix",
    label: "Event ID Prefix",
    description: "Prefix for event identifiers",
    type: "text",
  },
];
```

## Props

### `ModuleSettingsFormProps<T>`

| Prop            | Type                | Required | Default                       | Description                                  |
| --------------- | ------------------- | -------- | ----------------------------- | -------------------------------------------- |
| `title`         | `string`            | No       | `"Settings"`                  | The title displayed in the card header       |
| `description`   | `string`            | No       | `"Configure module settings"` | The description displayed in the card header |
| `data`          | `T`                 | No       | -                             | The current settings data                    |
| `fields`        | `SettingField[]`    | Yes      | -                             | Array of field configurations                |
| `onSave`        | `(data: T) => void` | Yes      | -                             | Callback function when save is clicked       |
| `isLoading`     | `boolean`           | No       | `false`                       | Loading state for the save button            |
| `defaultValues` | `Partial<T>`        | No       | `{}`                          | Default values for the settings              |

### `SettingField`

| Property      | Type                             | Required | Default    | Description                               |
| ------------- | -------------------------------- | -------- | ---------- | ----------------------------------------- |
| `key`         | `string`                         | Yes      | -          | The key in the settings object            |
| `label`       | `string`                         | Yes      | -          | The label displayed for the field         |
| `description` | `string`                         | Yes      | -          | The description displayed below the label |
| `type`        | `"switch" \| "text" \| "number"` | No       | `"switch"` | The type of input field                   |

## Examples for All Modules

### Events Settings

```tsx
const fields = [
  {
    key: "allowEvents",
    label: "Allow Event Creation",
    description: "Enable or disable the ability to create new events",
  },
  {
    key: "autoApproveEvents",
    label: "Auto Approve Events",
    description: "Automatically approve new event creation requests",
  },
];

<ModuleSettingsForm
  title="Events Settings"
  description="Configure event management settings"
  fields={fields}
  data={{
    allowEvents: data?.getEntitySettings?.allowEvents ?? true,
    autoApproveEvents: data?.getEntitySettings?.autoApproveEvents ?? false,
  }}
  onSave={handleSave}
  isLoading={loading}
/>;
```

### Jobs Settings

```tsx
const fields = [
  {
    key: "allowJobs",
    label: "Allow Job Posting",
    description: "Enable or disable the ability to post new jobs",
  },
  {
    key: "autoApproveJobs",
    label: "Auto Approve Jobs",
    description: "Automatically approve new job postings",
  },
];

<ModuleSettingsForm
  title="Jobs Settings"
  description="Configure job posting settings"
  fields={fields}
  data={{
    allowJobs: data?.getEntitySettings?.allowJobs ?? true,
    autoApproveJobs: data?.getEntitySettings?.autoApproveJobs ?? false,
  }}
  onSave={handleSave}
  isLoading={loading}
/>;
```

### Discussion Forum Settings

```tsx
const fields = [
  {
    key: "allowDiscussionForum",
    label: "Allow Forum Posts",
    description: "Enable or disable the ability to create forum posts",
  },
  {
    key: "autoApproveDiscussionForum",
    label: "Auto Approve Forum Posts",
    description: "Automatically approve new forum posts",
  },
];

<ModuleSettingsForm
  title="Discussion Forum Settings"
  description="Configure discussion forum settings"
  fields={fields}
  data={{
    allowDiscussionForum: data?.getEntitySettings?.allowDiscussionForum ?? true,
    autoApproveDiscussionForum:
      data?.getEntitySettings?.autoApproveDiscussionForum ?? false,
  }}
  onSave={handleSave}
  isLoading={loading}
/>;
```

### Mentorship Settings

```tsx
const fields = [
  {
    key: "allowMentorship",
    label: "Allow Mentorship Programs",
    description: "Enable or disable mentorship program creation",
  },
  {
    key: "autoApproveMentorship",
    label: "Auto Approve Mentorship",
    description: "Automatically approve new mentorship programs",
  },
];

<ModuleSettingsForm
  title="Mentorship Settings"
  description="Configure mentorship program settings"
  fields={fields}
  data={{
    allowMentorship: data?.getEntitySettings?.allowMentorship ?? true,
    autoApproveMentorship:
      data?.getEntitySettings?.autoApproveMentorship ?? false,
  }}
  onSave={handleSave}
  isLoading={loading}
/>;
```

### Listing Settings

```tsx
const fields = [
  {
    key: "allowListing",
    label: "Allow Listings",
    description: "Enable or disable the ability to create listings",
  },
  {
    key: "autoApproveListing",
    label: "Auto Approve Listings",
    description: "Automatically approve new listings",
  },
];

<ModuleSettingsForm
  title="Listing Settings"
  description="Configure listing management settings"
  fields={fields}
  data={{
    allowListing: data?.getEntitySettings?.allowListing ?? true,
    autoApproveListing: data?.getEntitySettings?.autoApproveListing ?? false,
  }}
  onSave={handleSave}
  isLoading={loading}
/>;
```

### Shop Settings

```tsx
const fields = [
  {
    key: "allowShop",
    label: "Allow Shop Items",
    description: "Enable or disable the ability to create shop items",
  },
  {
    key: "autoApproveShop",
    label: "Auto Approve Shop Items",
    description: "Automatically approve new shop items",
  },
  {
    key: "autoApproveMarketPlace",
    label: "Auto Approve Marketplace",
    description: "Automatically approve marketplace transactions",
  },
];

<ModuleSettingsForm
  title="Shop Settings"
  description="Configure shop and marketplace settings"
  fields={fields}
  data={{
    allowShop: data?.getEntitySettings?.allowShop ?? true,
    autoApproveShop: data?.getEntitySettings?.autoApproveShop ?? false,
    autoApproveMarketPlace:
      data?.getEntitySettings?.autoApproveMarketPlace ?? false,
  }}
  onSave={handleSave}
  isLoading={loading}
/>;
```

### Surveys & Polls Settings

```tsx
const fields = [
  {
    key: "allowSurveys",
    label: "Allow Surveys",
    description: "Enable or disable survey creation",
  },
  {
    key: "autoApproveSurveys",
    label: "Auto Approve Surveys",
    description: "Automatically approve new surveys",
  },
  {
    key: "allowPolls",
    label: "Allow Polls",
    description: "Enable or disable poll creation",
  },
  {
    key: "autoApprovePolls",
    label: "Auto Approve Polls",
    description: "Automatically approve new polls",
  },
];

<ModuleSettingsForm
  title="Surveys & Polls Settings"
  description="Configure surveys and polls settings"
  fields={fields}
  data={{
    allowSurveys: data?.getEntitySettings?.allowSurveys ?? true,
    autoApproveSurveys: data?.getEntitySettings?.autoApproveSurveys ?? false,
    allowPolls: data?.getEntitySettings?.allowPolls ?? true,
    autoApprovePolls: data?.getEntitySettings?.autoApprovePolls ?? false,
  }}
  onSave={handleSave}
  isLoading={loading}
/>;
```

### Stories & Offers Settings

```tsx
const fields = [
  {
    key: "allowStories",
    label: "Allow Stories",
    description: "Enable or disable story creation",
  },
  {
    key: "autoApproveStories",
    label: "Auto Approve Stories",
    description: "Automatically approve new stories",
  },
  {
    key: "allowOffers",
    label: "Allow Offers",
    description: "Enable or disable offer creation",
  },
  {
    key: "autoApproveOffers",
    label: "Auto Approve Offers",
    description: "Automatically approve new offers",
  },
];

<ModuleSettingsForm
  title="Stories & Offers Settings"
  description="Configure stories and offers settings"
  fields={fields}
  data={{
    allowStories: data?.getEntitySettings?.allowStories ?? true,
    autoApproveStories: data?.getEntitySettings?.autoApproveStories ?? false,
    allowOffers: data?.getEntitySettings?.allowOffers ?? true,
    autoApproveOffers: data?.getEntitySettings?.autoApproveOffers ?? false,
  }}
  onSave={handleSave}
  isLoading={loading}
/>;
```

## Benefits

1. **Consistency**: All settings pages look and behave the same way
2. **Maintainability**: Changes to the settings UI only need to be made in one place
3. **Type Safety**: Full TypeScript support with generics
4. **Flexibility**: Easy to add new field types or customize behavior
5. **Developer Experience**: Simple API that's easy to understand and use
6. **Reduced Code**: No need to duplicate form logic across multiple pages

## Migration Guide

To migrate an existing settings page:

1. Import `ModuleSettingsForm` instead of creating custom form components
2. Define your `fields` array with the settings you want to display
3. Pass the appropriate props (title, description, data, onSave, isLoading)
4. Remove old custom form components

## Future Enhancements

Potential additions to the component:

- [ ] Support for select/dropdown fields
- [ ] Support for textarea fields
- [ ] Field validation
- [ ] Field dependencies (show/hide based on other fields)
- [ ] Custom field renderers
- [ ] Field grouping/sections
- [ ] Reset to defaults button

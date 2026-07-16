# Module FAQ & Terms Manager - Reusable Components

## Overview

The `ModuleFaqListManager` and `ModuleTermsManager` are reusable components for managing FAQ and Terms & Conditions content across all modules in the application. They provide a consistent UI with rich text editing capabilities.

## Components

### 1. ModuleFaqListManager

**Location**: `/components/common/module-faq-manager.tsx`

Manages FAQ content as a **list of question/answer items** for any module using the `useGetFaqByModule` and `useUpdateFaqByModule` hooks. The FAQ data is stored as a JSON array of objects with `id`, `question`, and `answer` fields.

**Features:**

- Create, edit, and delete FAQ items
- Rich text editor for answers
- Live preview with accordion display
- Two-column layout (list + preview)
- Matches the design pattern from `/app/faq`

### 2. ModuleTermsManager

**Location**: `/components/common/module-terms-manager.tsx`

Manages Terms & Conditions content for any module using the `useGetTermsAndConditionsByModule` and `useUpdateTermsAndConditionsByModule` hooks.

## Features

- ✅ **Rich Text Editing**: Full-featured rich text editor for content management
- ✅ **Auto-save Detection**: Tracks changes and enables/disables save button
- ✅ **Loading States**: Built-in loading states for fetching and updating
- ✅ **Error Handling**: Toast notifications for success and error states
- ✅ **Type-Safe**: Full TypeScript support with proper typing
- ✅ **Consistent UI**: Uses shadcn/ui components for uniform appearance
- ✅ **Module-Specific**: Each module can have its own FAQ and Terms content

## GraphQL Hooks

### FAQ Hooks

```typescript
import { useGetFaqByModule, useUpdateFaqByModule } from "@/graphql/actions/faq";
```

#### useGetFaqByModule

Fetches FAQ content for a specific module.

**Variables:**

- `input.module`: string - The module name (e.g., "communities", "events", "jobs")

**Returns:**

```typescript
{
  getFaqByModule: {
    faq: string; // Rich text content
    module: string; // Module name
  }
}
```

#### useUpdateFaqByModule

Updates FAQ content for a specific module.

**Variables:**

- `module`: string - The module name
- `faq`: any (JSON) - The FAQ content to save

**Options:**

- `module`: string - Required for refetch queries

### Terms & Conditions Hooks

```typescript
import {
  useGetTermsAndConditionsByModule,
  useUpdateTermsAndConditionsByModule,
} from "@/graphql/actions/faq";
```

#### useGetTermsAndConditionsByModule

Fetches Terms & Conditions content for a specific module.

**Variables:**

- `input.module`: string - The module name

**Returns:**

```typescript
{
  getTermsAndConditionsByModule: {
    termsAndConditions: string; // Rich text content
    module: string; // Module name
  }
}
```

#### useUpdateTermsAndConditionsByModule

Updates Terms & Conditions content for a specific module.

**Variables:**

- `module`: string - The module name
- `termsAndConditions`: any (JSON) - The terms content to save

**Options:**

- `module`: string - Required for refetch queries

## Usage Examples

### FAQ Manager

#### Basic Usage

```tsx
"use client";

import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const FaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="communities"
      title="Community FAQs"
      description="Manage frequently asked questions for the communities module"
    />
  );
};

export default FaqPage;
```

#### All Module Examples

**Communities FAQ**

```tsx
<ModuleFaqListManager
  moduleName="communities"
  title="Community FAQs"
  description="Manage frequently asked questions for the communities module"
/>
```

**Events FAQ**

```tsx
<ModuleFaqListManager
  moduleName="events"
  title="Events FAQs"
  description="Manage frequently asked questions for the events module"
/>
```

**Jobs FAQ**

```tsx
<ModuleFaqListManager
  moduleName="jobs"
  title="Jobs FAQs"
  description="Manage frequently asked questions for the jobs module"
/>
```

**Discussion Forum FAQ**

```tsx
<ModuleFaqListManager
  moduleName="forums"
  title="Forum FAQs"
  description="Manage frequently asked questions for the discussion forum"
/>
```

**Mentorship FAQ**

```tsx
<ModuleFaqListManager
  moduleName="mentorship"
  title="Mentorship FAQs"
  description="Manage frequently asked questions for the mentorship module"
/>
```

**Marketplace/Shop FAQ**

```tsx
<ModuleFaqListManager
  moduleName="marketplace"
  title="Marketplace FAQs"
  description="Manage frequently asked questions for the marketplace"
/>
```

### Terms & Conditions Manager

#### Basic Usage

```tsx
"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const TermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="communities"
      title="Community Terms & Conditions"
      description="Define the terms and conditions for your community module"
      placeholder="Enter terms and conditions for communities..."
    />
  );
};

export default TermsPage;
```

#### All Module Examples

**Communities Terms**

```tsx
<ModuleTermsManager
  moduleName="communities"
  title="Community Terms & Conditions"
  description="Define the terms and conditions for your community module"
  placeholder="Enter terms and conditions for communities. You can use rich text formatting to organize your terms..."
/>
```

**Events Terms**

```tsx
<ModuleTermsManager
  moduleName="events"
  title="Events Terms & Conditions"
  description="Define the terms and conditions for your events module"
  placeholder="Enter terms and conditions for events..."
/>
```

**Jobs Terms**

```tsx
<ModuleTermsManager
  moduleName="jobs"
  title="Jobs Terms & Conditions"
  description="Define the terms and conditions for your jobs module"
  placeholder="Enter terms and conditions for jobs..."
/>
```

**Mentorship Terms**

```tsx
<ModuleTermsManager
  moduleName="mentorship"
  title="Mentorship Terms & Conditions"
  description="Define the terms and conditions for your mentorship module"
  placeholder="Enter terms and conditions for mentorship..."
/>
```

## Component Props

### ModuleFaqListManager Props

| Prop          | Type     | Required | Default                                               | Description                                           |
| ------------- | -------- | -------- | ----------------------------------------------------- | ----------------------------------------------------- |
| `moduleName`  | `string` | Yes      | -                                                     | The module identifier (e.g., "communities", "events") |
| `title`       | `string` | No       | `"FAQ Management"`                                    | The title displayed in the header                     |
| `description` | `string` | No       | `"Manage frequently asked questions for this module"` | The description displayed in the header               |

### ModuleTermsManager Props

| Prop          | Type     | Required | Default                                         | Description                                           |
| ------------- | -------- | -------- | ----------------------------------------------- | ----------------------------------------------------- |
| `moduleName`  | `string` | Yes      | -                                               | The module identifier (e.g., "communities", "events") |
| `title`       | `string` | No       | `"Terms & Conditions"`                          | The title displayed in the card header                |
| `description` | `string` | No       | `"Manage terms and conditions for this module"` | The description displayed in the card header          |
| `placeholder` | `string` | No       | `"Enter terms and conditions here..."`          | Placeholder text for the rich text editor             |

## Layout Pattern

For module settings with tabs, use this layout pattern (based on `/app/(authlayout)/faq/layout.tsx`):

```tsx
"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import {
  Settings,
  FileText,
  ScrollText,
  MessageCircleQuestion,
} from "lucide-react";

function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname.replace("/module/settings/", "") || "settings";

  const onChange = (key: string) => {
    if (key === "settings") router.push(`/module/settings`);
    else router.push(`/module/settings/${key}`);
  };

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={onChange}>
        <TabsList className="m-4">
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>

          <TabsTrigger value="term_and_conditions" className="gap-2">
            <ScrollText className="h-4 w-4" />
            Terms & Conditions
          </TabsTrigger>

          <TabsTrigger value="faq" className="gap-2">
            <MessageCircleQuestion className="h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="p-4">{children}</div>
    </Card>
  );
}

export default SettingsLayout;
```

## Complete Implementation Example

Here's a complete example for a module's settings section:

### Directory Structure

```
app/(authlayout)/communities/settings/
├── layout.tsx              # Tab navigation
├── page.tsx                # Settings (ModuleSettingsForm)
├── term_and_conditions/
│   └── page.tsx           # Terms (ModuleTermsManager)
└── faq/
    └── page.tsx           # FAQ (ModuleFaqListManager)
```

### 1. Layout (layout.tsx)

```tsx
"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { Settings, ScrollText, MessageCircleQuestion } from "lucide-react";

function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab =
    pathname.replace("/communities/settings/", "") || "settings";

  const onChange = (key: string) => {
    if (key === "settings") router.push(`/communities/settings`);
    else router.push(`/communities/settings/${key}`);
  };

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={onChange}>
        <TabsList className="m-4">
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="term_and_conditions" className="gap-2">
            <ScrollText className="h-4 w-4" />
            Terms & Conditions
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2">
            <MessageCircleQuestion className="h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="p-4">{children}</div>
    </Card>
  );
}

export default SettingsLayout;
```

### 2. Settings Page (page.tsx)

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
      description="Configure community management settings"
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

### 3. Terms Page (term_and_conditions/page.tsx)

```tsx
"use client";

import { ModuleTermsManager } from "@/components/common/module-terms-manager";

const TermsPage = () => {
  return (
    <ModuleTermsManager
      moduleName="communities"
      title="Community Terms & Conditions"
      description="Define the terms and conditions for your community module"
      placeholder="Enter terms and conditions for communities..."
    />
  );
};

export default TermsPage;
```

### 4. FAQ Page (faq/page.tsx)

```tsx
"use client";

import { ModuleFaqListManager } from "@/components/common/module-faq-manager";

const FaqPage = () => {
  return (
    <ModuleFaqListManager
      moduleName="communities"
      title="Community FAQs"
      description="Manage frequently asked questions for the communities module"
    />
  );
};

export default FaqPage;
```

## Benefits

1. **Consistency**: All FAQ and Terms pages look and behave the same way
2. **Maintainability**: Changes to the UI only need to be made in one place
3. **Type Safety**: Full TypeScript support with proper typing
4. **Rich Text**: Built-in rich text editor for better content formatting
5. **Developer Experience**: Simple API that's easy to understand and use
6. **Reduced Code**: No need to duplicate logic across multiple pages
7. **Auto-save Detection**: Users are notified of unsaved changes
8. **Error Handling**: Built-in error handling with toast notifications

## Module Names Reference

Use these module names when implementing FAQ and Terms for different modules:

- `"communities"` - Communities module
- `"events"` - Events module
- `"jobs"` - Jobs module
- `"forums"` - Discussion Forum module
- `"mentorship"` - Mentorship module
- `"marketplace"` - Marketplace/Shop module
- `"listings"` - Listings module
- `"surveys"` - Surveys module
- `"polls"` - Polls module
- `"stories"` - Stories module
- `"offers"` - Offers module

## Migration Guide

To migrate an existing FAQ or Terms page:

1. Import the appropriate component (`ModuleFaqListManager` or `ModuleTermsManager`)
2. Replace the existing implementation with a single component call
3. Pass the `moduleName` and optional customization props
4. Remove old custom components and GraphQL calls

## Future Enhancements

Potential additions to the components:

- [ ] Preview mode to see how content will appear to users
- [ ] Version history and rollback functionality
- [ ] Template system for common FAQ/Terms patterns
- [ ] Multi-language support
- [ ] Export/Import functionality
- [ ] Search and filter within content

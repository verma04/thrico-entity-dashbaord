# Website GraphQL API Documentation

This documentation covers all GraphQL queries, mutations, and TypeScript hooks for managing websites in the Thrico Entity Dashboard.

## Table of Contents

- [Installation](#installation)
- [Queries](#queries)
- [Mutations](#mutations)
- [TypeScript Types](#typescript-types)
- [Usage Examples](#usage-examples)

## Installation

The website GraphQL operations are already set up in your project. Simply import the hooks you need:

```typescript
import {
  useGetWebsite,
  useUpdateWebsiteTheme,
  useCreatePage,
  // ... other hooks
} from "@/graphql/actions/website";
```

## Queries

### `useGetWebsite`

Fetch complete website data including navbar, footer, pages, and modules.

**Parameters:**
- `entityId: string` - The entity ID
- `options?: QueryHookOptions` - Apollo query options

**Returns:** `{ data, loading, error, refetch }`

**Example:**
```typescript
const { data, loading } = useGetWebsite("entity-123");
const website = data?.getWebsite;
```

### `useGetWebsiteBySlug`

Fetch website data by slug (for public viewing).

**Parameters:**
- `slug: string` - The website slug
- `options?: QueryHookOptions` - Apollo query options

**Returns:** `{ data, loading, error, refetch }`

**Example:**
```typescript
const { data } = useGetWebsiteBySlug("my-company");
const website = data?.getWebsiteBySlug;
```

### `useGetPage`

Fetch a single page with all its modules.

**Parameters:**
- `pageId: string` - The page ID
- `options?: QueryHookOptions` - Apollo query options

**Returns:** `{ data, loading, error, refetch }`

**Example:**
```typescript
const { data } = useGetPage("page-123");
const page = data?.getPage;
```

## Mutations

### Website Settings

#### `useUpdateWebsiteTheme`

Update the website theme.

**Variables:**
- `websiteId: string` - The website ID
- `theme: string` - The new theme name

**Example:**
```typescript
const [updateTheme] = useUpdateWebsiteTheme();

await updateTheme({
  variables: {
    websiteId: "web-123",
    theme: "modern",
  },
});
```

#### `useUpdateWebsiteFont`

Update the website font.

**Variables:**
- `websiteId: string` - The website ID
- `font: string` - The new font name

**Example:**
```typescript
const [updateFont] = useUpdateWebsiteFont();

await updateFont({
  variables: {
    websiteId: "web-123",
    font: "Inter",
  },
});
```

#### `usePublishWebsite`

Publish or unpublish the website.

**Variables:**
- `websiteId: string` - The website ID

**Example:**
```typescript
const [publishWebsite] = usePublishWebsite({
  onCompleted: (data) => {
    console.log("Published:", data.publishWebsite.isPublished);
  },
});

await publishWebsite({
  variables: { websiteId: "web-123" },
});
```

### Navbar & Footer

#### `useUpdateNavbar`

Update navbar settings.

**Variables:**
- `websiteId: string` - The website ID
- `layout?: string` - Navbar layout type
- `content?: any` - Navbar content (JSON)
- `isEnabled?: boolean` - Enable/disable navbar

**Example:**
```typescript
const [updateNavbar] = useUpdateNavbar();

await updateNavbar({
  variables: {
    websiteId: "web-123",
    layout: "horizontal",
    content: {
      logo: "https://example.com/logo.png",
      links: [
        { label: "Home", url: "/" },
        { label: "About", url: "/about" },
      ],
    },
    isEnabled: true,
  },
});
```

#### `useUpdateFooter`

Update footer settings.

**Variables:**
- `websiteId: string` - The website ID
- `layout?: string` - Footer layout type
- `content?: any` - Footer content (JSON)
- `isEnabled?: boolean` - Enable/disable footer

**Example:**
```typescript
const [updateFooter] = useUpdateFooter();

await updateFooter({
  variables: {
    websiteId: "web-123",
    layout: "three-column",
    content: {
      copyright: "© 2024 My Company",
      socialLinks: {
        facebook: "https://facebook.com/mycompany",
      },
    },
    isEnabled: true,
  },
});
```

### Pages

#### `useCreatePage`

Create a new page.

**Variables:**
- `websiteId: string` - The website ID
- `name: string` - Page name
- `slug: string` - Page slug (URL path)

**Example:**
```typescript
const [createPage] = useCreatePage({
  onCompleted: (data) => {
    console.log("Created page:", data.createPage);
  },
});

await createPage({
  variables: {
    websiteId: "web-123",
    name: "About Us",
    slug: "about",
  },
});
```

#### `useUpdatePage`

Update an existing page.

**Variables:**
- `pageId: string` - The page ID
- `name?: string` - New page name
- `slug?: string` - New page slug
- `isEnabled?: boolean` - Enable/disable page

**Example:**
```typescript
const [updatePage] = useUpdatePage();

await updatePage({
  variables: {
    pageId: "page-123",
    name: "About Our Company",
    isEnabled: true,
  },
});
```

#### `useDeletePage`

Delete a page.

**Variables:**
- `pageId: string` - The page ID

**Example:**
```typescript
const [deletePage] = useDeletePage({
  onCompleted: () => {
    console.log("Page deleted");
  },
});

await deletePage({
  variables: { pageId: "page-123" },
});
```

#### `useReorderPages`

Reorder pages.

**Variables:**
- `websiteId: string` - The website ID
- `pageIds: string[]` - Array of page IDs in new order

**Example:**
```typescript
const [reorderPages] = useReorderPages();

await reorderPages({
  variables: {
    websiteId: "web-123",
    pageIds: ["page-1", "page-3", "page-2"],
  },
});
```

### Modules

#### `useCreateModule`

Create a new module on a page.

**Variables:**
- `pageId: string` - The page ID
- `type: string` - Module type (e.g., "hero", "about", "contact")
- `name: string` - Module name
- `layout: string` - Module layout variant
- `content: any` - Module content (JSON)

**Example:**
```typescript
const [createModule] = useCreateModule();

await createModule({
  variables: {
    pageId: "page-123",
    type: "hero",
    name: "Hero Section",
    layout: "centered",
    content: {
      title: "Welcome",
      subtitle: "To our website",
      ctaText: "Get Started",
    },
  },
});
```

#### `useUpdateModule`

Update an existing module.

**Variables:**
- `moduleId: string` - The module ID
- `name?: string` - New module name
- `layout?: string` - New layout variant
- `content?: any` - New content (JSON)
- `isEnabled?: boolean` - Enable/disable module

**Example:**
```typescript
const [updateModule] = useUpdateModule();

await updateModule({
  variables: {
    moduleId: "mod-123",
    layout: "split",
    content: {
      title: "Updated Title",
    },
    isEnabled: true,
  },
});
```

#### `useReorderModules`

Reorder modules within a page.

**Variables:**
- `pageId: string` - The page ID
- `moduleIds: string[]` - Array of module IDs in new order

**Example:**
```typescript
const [reorderModules] = useReorderModules();

await reorderModules({
  variables: {
    pageId: "page-123",
    moduleIds: ["mod-3", "mod-1", "mod-2"],
  },
});
```

## TypeScript Types

All types are exported from `@/graphql/actions/website`:

### Core Types

```typescript
interface Website {
  id: string;
  entityId: string;
  theme: string;
  font: string;
  isPublished: boolean;
  customDomain?: string;
  navbar: NavbarFooter;
  footer: NavbarFooter;
  pages: Page[];
  createdAt: string;
  updatedAt: string;
}

interface Page {
  id: string;
  name: string;
  slug: string;
  isEnabled: boolean;
  order: number;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}

interface Module {
  id: string;
  type: string;
  name: string;
  layout: string;
  isEnabled: boolean;
  isCustomized?: boolean;
  order: number;
  content: any;
  updatedAt: string;
}

interface NavbarFooter {
  id: string;
  layout: string;
  isEnabled: boolean;
  content: any;
  updatedAt: string;
}
```

### Usage with Types

```typescript
import type { Website, Page, Module } from "@/graphql/actions/website";

function MyComponent() {
  const { data } = useGetWebsite("entity-123");
  const website: Website | undefined = data?.getWebsite;
  
  return <div>{website?.theme}</div>;
}
```

## Usage Examples

### Complete Page Editor

```typescript
import { useGetPage, useUpdateModule } from "@/graphql/actions/website";

function PageEditor({ pageId }: { pageId: string }) {
  const { data, loading } = useGetPage(pageId);
  const [updateModule] = useUpdateModule();

  if (loading) return <div>Loading...</div>;

  const page = data?.getPage;

  const toggleModule = (moduleId: string, isEnabled: boolean) => {
    updateModule({
      variables: {
        moduleId,
        isEnabled: !isEnabled,
      },
    });
  };

  return (
    <div>
      <h1>{page?.name}</h1>
      {page?.modules.map((module) => (
        <div key={module.id}>
          <h3>{module.name}</h3>
          <button onClick={() => toggleModule(module.id, module.isEnabled)}>
            {module.isEnabled ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Theme Switcher

```typescript
import { useUpdateWebsiteTheme } from "@/graphql/actions/website";

function ThemeSwitcher({ websiteId }: { websiteId: string }) {
  const [updateTheme, { loading }] = useUpdateWebsiteTheme({
    onCompleted: () => {
      alert("Theme updated!");
    },
  });

  const themes = ["modern", "classic", "minimal", "bold"];

  return (
    <div>
      {themes.map((theme) => (
        <button
          key={theme}
          onClick={() => updateTheme({ variables: { websiteId, theme } })}
          disabled={loading}
        >
          {theme}
        </button>
      ))}
    </div>
  );
}
```

## Auto-Refetching

All mutation hooks automatically refetch relevant queries:

- **Website mutations** (`useUpdateWebsiteTheme`, `useUpdateWebsiteFont`, `usePublishWebsite`) → Refetch `GET_WEBSITE`
- **Navbar/Footer mutations** → Refetch `GET_WEBSITE`
- **Page mutations** → Refetch `GET_WEBSITE` or `GET_PAGE`
- **Module mutations** → Refetch `GET_PAGE`

This ensures your UI stays in sync with the server state.

## Error Handling

```typescript
const [updateTheme] = useUpdateWebsiteTheme({
  onError: (error) => {
    console.error("Failed to update theme:", error.message);
    // Show error toast/notification
  },
  onCompleted: (data) => {
    console.log("Success:", data);
    // Show success toast/notification
  },
});
```

## Advanced Options

### Skip Query

```typescript
const { data } = useGetWebsite(entityId, {
  skip: !entityId, // Don't run query if no entityId
});
```

### Custom Fetch Policy

```typescript
const { data } = useGetWebsite(entityId, {
  fetchPolicy: "cache-and-network", // or "network-only", "cache-first"
});
```

### Manual Refetch

```typescript
const { data, refetch } = useGetWebsite(entityId);

// Later...
await refetch();
```

## Files Structure

```
graphql/
├── quries/
│   └── website/
│       └── index.ts          # GraphQL queries, mutations, and types
└── actions/
    ├── website.ts            # React hooks for website operations
    └── website-examples.tsx  # Usage examples
```

## Support

For more examples, see `graphql/actions/website-examples.tsx`.

For issues or questions, please contact the development team.

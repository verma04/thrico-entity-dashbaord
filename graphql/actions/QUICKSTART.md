# Website GraphQL - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Import the Hook

```typescript
import { useGetWebsite, useUpdateWebsiteTheme } from "@/graphql/actions/website";
```

### Step 2: Use in Your Component

```typescript
function MyComponent() {
  // Query
  const { data, loading, error } = useGetWebsite("your-entity-id");
  
  // Mutation
  const [updateTheme, { loading: updating }] = useUpdateWebsiteTheme({
    onCompleted: () => alert("Theme updated!"),
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Current Theme: {data?.getWebsite.theme}</h1>
      <button 
        onClick={() => updateTheme({ 
          variables: { 
            websiteId: data?.getWebsite.id, 
            theme: "modern" 
          } 
        })}
        disabled={updating}
      >
        Change Theme
      </button>
    </div>
  );
}
```

### Step 3: Add Refetching (Optional)

```typescript
const [updateTheme] = useUpdateWebsiteTheme({
  refetchQueries: [
    { query: GET_WEBSITE, variables: { entityId: "your-entity-id" } }
  ],
  awaitRefetchQueries: true,
});
```

## 📋 Common Patterns

### Pattern 1: Fetch and Display Website

```typescript
import { useGetWebsite } from "@/graphql/actions/website";

function WebsitePreview({ entityId }: { entityId: string }) {
  const { data } = useGetWebsite(entityId);
  const website = data?.getWebsite;

  return (
    <div>
      <h1>{website?.theme}</h1>
      <p>Published: {website?.isPublished ? "Yes" : "No"}</p>
      <h2>Pages:</h2>
      <ul>
        {website?.pages.map(page => (
          <li key={page.id}>{page.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Pattern 2: Create a New Page

```typescript
import { useCreatePage } from "@/graphql/actions/website";

function CreatePageButton({ websiteId }: { websiteId: string }) {
  const [createPage, { loading }] = useCreatePage({
    onCompleted: (data) => {
      console.log("Created:", data.createPage);
    },
  });

  const handleCreate = () => {
    createPage({
      variables: {
        websiteId,
        name: "New Page",
        slug: "new-page",
      },
    });
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? "Creating..." : "Create Page"}
    </button>
  );
}
```

### Pattern 3: Update Module Content

```typescript
import { useUpdateModule } from "@/graphql/actions/website";

function ModuleEditor({ moduleId }: { moduleId: string }) {
  const [updateModule] = useUpdateModule();

  const handleSave = (newContent: any) => {
    updateModule({
      variables: {
        moduleId,
        content: newContent,
      },
    });
  };

  return <button onClick={() => handleSave({ title: "New Title" })}>Save</button>;
}
```

### Pattern 4: Toggle Module Visibility

```typescript
import { useUpdateModule } from "@/graphql/actions/website";

function ModuleToggle({ moduleId, isEnabled }: { moduleId: string; isEnabled: boolean }) {
  const [updateModule] = useUpdateModule();

  const toggle = () => {
    updateModule({
      variables: {
        moduleId,
        isEnabled: !isEnabled,
      },
    });
  };

  return (
    <button onClick={toggle}>
      {isEnabled ? "Hide" : "Show"}
    </button>
  );
}
```

### Pattern 5: Reorder Items with Drag & Drop

```typescript
import { useReorderModules } from "@/graphql/actions/website";

function ModuleList({ pageId, modules }: { pageId: string; modules: any[] }) {
  const [reorderModules] = useReorderModules();

  const handleDragEnd = (newOrder: string[]) => {
    reorderModules({
      variables: {
        pageId,
        moduleIds: newOrder,
      },
    });
  };

  return (
    <div>
      {/* Your drag & drop UI */}
    </div>
  );
}
```

## 🎨 TypeScript Tips

### Use Types for Better IntelliSense

```typescript
import type { Website, Page, Module } from "@/graphql/actions/website";

function processWebsite(website: Website) {
  // Full type safety and autocomplete
  console.log(website.theme);
  console.log(website.pages[0].modules);
}
```

### Type Your Component Props

```typescript
import type { Module } from "@/graphql/actions/website";

interface ModuleCardProps {
  module: Module;
  onUpdate: (id: string) => void;
}

function ModuleCard({ module, onUpdate }: ModuleCardProps) {
  return <div>{module.name}</div>;
}
```

## ⚡ Performance Tips

### 1. Skip Queries When Not Needed

```typescript
const { data } = useGetWebsite(entityId, {
  skip: !entityId, // Don't run if no entityId
});
```

### 2. Use Cache-First for Better Performance

```typescript
const { data } = useGetWebsite(entityId, {
  fetchPolicy: "cache-first", // Use cached data when available
});
```

### 3. Optimize Refetches

```typescript
const [updateModule] = useUpdateModule({
  // Only refetch what's necessary
  refetchQueries: [
    { query: GET_PAGE, variables: { pageId: "specific-page-id" } }
  ],
});
```

## 🐛 Error Handling

### Handle Errors Gracefully

```typescript
const { data, loading, error } = useGetWebsite(entityId);

if (error) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
```

### Mutation Error Handling

```typescript
const [updateTheme] = useUpdateWebsiteTheme({
  onError: (error) => {
    console.error("Failed:", error);
    toast.error("Failed to update theme");
  },
  onCompleted: () => {
    toast.success("Theme updated successfully!");
  },
});
```

## 📚 More Resources

- **Full API Docs**: See `WEBSITE_API.md`
- **Examples**: See `website-examples.tsx`
- **Types**: See `graphql/quries/website/index.ts`

## 💡 Pro Tips

1. **Always handle loading states** - Provide feedback to users
2. **Use TypeScript types** - Catch errors at compile time
3. **Implement error boundaries** - Gracefully handle GraphQL errors
4. **Optimize refetches** - Only refetch what changed
5. **Use optimistic updates** - For better UX (advanced)

---

Happy coding! 🎉

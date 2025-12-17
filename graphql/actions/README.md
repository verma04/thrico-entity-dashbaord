# 🌐 Website GraphQL - Complete Implementation

A comprehensive, type-safe GraphQL implementation for managing websites, pages, and modules in the Thrico Entity Dashboard.

## 📦 What's Included

This implementation provides:

- ✅ **15 React Hooks** - Fully typed hooks for all website operations
- ✅ **Complete TypeScript Types** - Full type safety across queries and mutations
- ✅ **GraphQL Operations** - All queries and mutations defined
- ✅ **Comprehensive Examples** - 15+ real-world usage examples
- ✅ **Full Documentation** - API reference, guides, and architecture docs

## 🚀 Quick Start

```typescript
import { useGetWebsite, useUpdateWebsiteTheme } from "@/graphql/actions/website";

function MyComponent() {
  const { data, loading } = useGetWebsite("entity-123");
  const [updateTheme] = useUpdateWebsiteTheme();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Theme: {data?.getWebsite.theme}</h1>
      <button onClick={() => updateTheme({ 
        variables: { websiteId: data?.getWebsite.id, theme: "modern" } 
      })}>
        Change Theme
      </button>
    </div>
  );
}
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[QUICKSTART.md](./QUICKSTART.md)** | 🚀 Start here! Quick examples and common patterns |
| **[WEBSITE_API.md](./WEBSITE_API.md)** | 📖 Complete API reference for all operations |
| **[website-examples.tsx](./website-examples.tsx)** | 💡 15+ real-world usage examples |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | 🏗️ System design and data flow diagrams |
| **[WEBSITE_IMPLEMENTATION.md](./WEBSITE_IMPLEMENTATION.md)** | 📝 Implementation summary and file structure |

## 🎯 Available Operations

### Queries (Read Data)
```typescript
useGetWebsite(entityId)        // Fetch complete website
useGetWebsiteBySlug(slug)      // Fetch by slug (public)
useGetPage(pageId)             // Fetch single page
```

### Mutations (Modify Data)

**Website Settings:**
```typescript
useUpdateWebsiteTheme()        // Update theme
useUpdateWebsiteFont()         // Update font
usePublishWebsite()            // Publish/unpublish
```

**Layout Components:**
```typescript
useUpdateNavbar()              // Update navbar
useUpdateFooter()              // Update footer
```

**Page Management:**
```typescript
useCreatePage()                // Create new page
useUpdatePage()                // Update page
useDeletePage()                // Delete page
useReorderPages()              // Reorder pages
```

**Module Management:**
```typescript
useCreateModule()              // Create module
useUpdateModule()              // Update module
useReorderModules()            // Reorder modules
```

## 💻 Usage Examples

### Fetch Website Data
```typescript
const { data, loading, error } = useGetWebsite("entity-123");
```

### Update Theme
```typescript
const [updateTheme] = useUpdateWebsiteTheme({
  onCompleted: () => alert("Theme updated!"),
});

updateTheme({ 
  variables: { websiteId: "web-123", theme: "modern" } 
});
```

### Create a Page
```typescript
const [createPage] = useCreatePage();

createPage({
  variables: {
    websiteId: "web-123",
    name: "About Us",
    slug: "about",
  },
});
```

### Update Module
```typescript
const [updateModule] = useUpdateModule();

updateModule({
  variables: {
    moduleId: "mod-123",
    content: { title: "New Title" },
    isEnabled: true,
  },
});
```

## 🔧 TypeScript Support

All operations are fully typed:

```typescript
import type { 
  Website, 
  Page, 
  Module,
  GetWebsiteResponse 
} from "@/graphql/actions/website";

function processWebsite(website: Website) {
  // Full IntelliSense and type checking
  console.log(website.theme);
  console.log(website.pages[0].modules);
}
```

## 📁 File Structure

```
graphql/
├── quries/
│   └── website/
│       └── index.ts              # GraphQL queries, mutations & types
│
└── actions/
    ├── index.ts                  # Main exports (includes website)
    ├── website.ts                # React hooks
    ├── website-examples.tsx      # Usage examples
    ├── QUICKSTART.md            # Quick start guide
    ├── WEBSITE_API.md           # API documentation
    ├── ARCHITECTURE.md          # Architecture diagrams
    ├── WEBSITE_IMPLEMENTATION.md # Implementation summary
    └── README.md                # This file
```

## 🎨 Features

- ✅ **Type Safety** - Full TypeScript support with generics
- ✅ **Auto-completion** - IntelliSense in your IDE
- ✅ **Error Handling** - Proper error types and handling
- ✅ **Loading States** - Built-in loading state management
- ✅ **Refetching** - Automatic and manual refetch support
- ✅ **Caching** - Apollo Client cache integration
- ✅ **Optimistic Updates** - Support for optimistic UI
- ✅ **Flexible Options** - All Apollo options supported

## 🔄 Data Flow

```
Component → Hook → GraphQL Operation → Apollo Client → Server
    ↑                                                      ↓
    └──────────────── Response ←──────────────────────────┘
```

## 🎯 Best Practices

1. **Always handle loading states**
   ```typescript
   if (loading) return <Spinner />;
   ```

2. **Handle errors gracefully**
   ```typescript
   if (error) return <ErrorMessage error={error} />;
   ```

3. **Use TypeScript types**
   ```typescript
   const website: Website = data?.getWebsite;
   ```

4. **Implement refetching**
   ```typescript
   refetchQueries: [{ query: GET_WEBSITE, variables: { entityId } }]
   ```

5. **Provide user feedback**
   ```typescript
   onCompleted: () => toast.success("Saved!")
   ```

## 🚦 Getting Started

1. **Read the Quick Start Guide**
   - See [QUICKSTART.md](./QUICKSTART.md)

2. **Check the Examples**
   - See [website-examples.tsx](./website-examples.tsx)

3. **Reference the API Docs**
   - See [WEBSITE_API.md](./WEBSITE_API.md)

4. **Understand the Architecture**
   - See [ARCHITECTURE.md](./ARCHITECTURE.md)

## 💡 Common Use Cases

### Building a Website Editor
```typescript
const { data } = useGetWebsite(entityId);
const [updateModule] = useUpdateModule();

// Edit modules, update content, toggle visibility
```

### Creating a Page Builder
```typescript
const [createPage] = useCreatePage();
const [createModule] = useCreateModule();
const [reorderModules] = useReorderModules();

// Create pages, add modules, reorder sections
```

### Public Website Viewer
```typescript
const { data } = useGetWebsiteBySlug(slug);

// Display published website to public
```

## 🐛 Troubleshooting

**Q: Types not working?**
- Make sure to import types: `import type { Website } from "@/graphql/actions/website"`

**Q: Refetch not working?**
- Add `refetchQueries` option to your mutation hook

**Q: Data not updating?**
- Check Apollo cache policies and refetch configuration

**Q: Getting TypeScript errors?**
- Ensure all variables match the expected types

## 📞 Support

For questions or issues:
1. Check the [WEBSITE_API.md](./WEBSITE_API.md) documentation
2. Review [website-examples.tsx](./website-examples.tsx) for examples
3. See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design

## 🎉 You're Ready!

Start building amazing website management features with full type safety and excellent developer experience!

```typescript
import { useGetWebsite } from "@/graphql/actions/website";

// Happy coding! 🚀
```

---

**Created:** December 2024  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

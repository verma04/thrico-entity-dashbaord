# Website GraphQL Implementation Summary

## ✅ Files Created

### 1. **Queries & Types** (`graphql/quries/website/index.ts`)

- All GraphQL query and mutation definitions
- Complete TypeScript type definitions
- Response and variable types for all operations

### 2. **React Hooks** (`graphql/actions/website.ts`)

- TypeScript hooks for all queries and mutations
- Proper type safety with generics
- Exported from main actions index

### 3. **Usage Examples** (`graphql/actions/website-examples.tsx`)

- 15 comprehensive examples
- Real-world usage patterns
- Best practices demonstrations

### 4. **Documentation** (`graphql/actions/WEBSITE_API.md`)

- Complete API reference
- Usage examples
- TypeScript type documentation
- Error handling patterns

## 📦 Available Operations

### Queries

- `useGetWebsite(entityId)` - Fetch complete website data
- `useGetWebsiteBySlug(slug)` - Fetch website by slug (public)
- `useGetPage(pageId)` - Fetch single page with modules
- `useGetAllPagesSeo(websiteId)` - Fetch SEO data for all pages

### Mutations - Website

- `useUpdateWebsiteTheme()` - Update theme
- `useUpdateWebsiteFont()` - Update font
- `usePublishWebsite()` - Publish/unpublish

### Mutations - Layout

- `useUpdateNavbar()` - Update navbar settings
- `useUpdateFooter()` - Update footer settings

### Mutations - Pages

- `useCreatePage()` - Create new page
- `useUpdatePage()` - Update page details
- `useDeletePage()` - Delete page
- `useReorderPages()` - Reorder pages

### Mutations - SEO

- `useUpdatePageSeo()` - Update SEO settings (title, description, keywords, etc.)

### Mutations - Modules

- `useCreateModule()` - Create new module
- `useUpdateModule()` - Update module
- `useReorderModules()` - Reorder modules

## 🎯 Usage

### Import

```typescript
import {
  useGetWebsite,
  useUpdateWebsiteTheme,
  useCreatePage,
  // ... other hooks
} from "@/graphql/actions/website";

// Or from main index
import { useGetWebsite } from "@/graphql/actions";
```

### Example

```typescript
function WebsiteEditor() {
  const { data, loading } = useGetWebsite("entity-123");
  const [updateTheme] = useUpdateWebsiteTheme();

  const handleThemeChange = (theme: string) => {
    updateTheme({
      variables: { websiteId: data?.getWebsite.id, theme },
      refetchQueries: [
        { query: GET_WEBSITE, variables: { entityId: "entity-123" } },
      ],
    });
  };

  return <div>{/* Your UI */}</div>;
}
```

## 🔧 TypeScript Support

All operations are fully typed:

- Request variables
- Response data
- Error handling
- Auto-completion in IDE

## 📝 Notes

- All hooks accept Apollo Client options
- Users can specify custom `refetchQueries` as needed
- Full TypeScript IntelliSense support
- Follows existing project patterns

## 🚀 Next Steps

You can now:

1. Import hooks in your components
2. Use TypeScript types for type safety
3. Refer to examples for implementation patterns
4. Check documentation for detailed API reference

## 📚 Files Reference

- **Queries**: `graphql/quries/website/index.ts`
- **Hooks**: `graphql/actions/website.ts`
- **Examples**: `graphql/actions/website-examples.tsx`
- **Docs**: `graphql/actions/WEBSITE_API.md`

# Website GraphQL Architecture

## 📁 File Structure

```
graphql/
├── quries/
│   └── website/
│       └── index.ts                 # GraphQL queries, mutations & TypeScript types
│
└── actions/
    ├── index.ts                     # Main exports (includes website exports)
    ├── website.ts                   # React hooks for website operations
    ├── website-examples.tsx         # 15+ usage examples
    ├── WEBSITE_API.md              # Complete API documentation
    ├── WEBSITE_IMPLEMENTATION.md   # Implementation summary
    └── QUICKSTART.md               # Quick start guide
```

## 🔄 Data Flow

```
┌─────────────────┐
│  React Component│
│                 │
│  useGetWebsite  │
│  useUpdateTheme │
└────────┬────────┘
         │
         │ Import hooks
         ▼
┌─────────────────────────┐
│ graphql/actions/        │
│ website.ts              │
│                         │
│ - useGetWebsite()       │
│ - useUpdateWebsiteTheme()│
│ - useCreatePage()       │
│ - useUpdateModule()     │
│ - etc...                │
└────────┬────────────────┘
         │
         │ Uses queries/mutations
         ▼
┌─────────────────────────┐
│ graphql/quries/website/ │
│ index.ts                │
│                         │
│ - GET_WEBSITE           │
│ - UPDATE_WEBSITE_THEME  │
│ - CREATE_PAGE           │
│ - UPDATE_MODULE         │
│ - TypeScript types      │
└────────┬────────────────┘
         │
         │ GraphQL operations
         ▼
┌─────────────────────────┐
│   Apollo Client         │
│   (HTTP Request)        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   GraphQL Server        │
│   (Backend API)         │
└─────────────────────────┘
```

## 🎯 Component Usage Flow

```
┌──────────────────────────────────────────────────────────┐
│                    Your Component                         │
│                                                           │
│  import { useGetWebsite } from "@/graphql/actions/website"│
│                                                           │
│  function WebsiteEditor() {                              │
│    const { data, loading } = useGetWebsite("entity-123") │
│                                                           │
│    return <div>{data?.getWebsite.theme}</div>            │
│  }                                                        │
└──────────────────────────────────────────────────────────┘
                              │
                              │ Hook returns
                              ▼
┌──────────────────────────────────────────────────────────┐
│                    Hook Response                          │
│                                                           │
│  {                                                        │
│    data: {                                                │
│      getWebsite: {                                        │
│        id: "web-123",                                     │
│        theme: "modern",                                   │
│        pages: [...],                                      │
│        navbar: {...},                                     │
│        footer: {...}                                      │
│      }                                                    │
│    },                                                     │
│    loading: false,                                        │
│    error: undefined                                       │
│  }                                                        │
└──────────────────────────────────────────────────────────┘
```

## 🔧 Type Safety Flow

```
┌─────────────────────────┐
│  TypeScript Types       │
│  (quries/website/)      │
│                         │
│  interface Website {    │
│    id: string           │
│    theme: string        │
│    pages: Page[]        │
│  }                      │
└────────┬────────────────┘
         │
         │ Exported to
         ▼
┌─────────────────────────┐
│  React Hooks            │
│  (actions/website.ts)   │
│                         │
│  useGetWebsite():       │
│    QueryResult<         │
│      GetWebsiteResponse │
│    >                    │
└────────┬────────────────┘
         │
         │ Used in
         ▼
┌─────────────────────────┐
│  Your Component         │
│                         │
│  const { data } =       │
│    useGetWebsite(...)   │
│                         │
│  // data is fully typed!│
│  data?.getWebsite.theme │
│       ↑ autocomplete!   │
└─────────────────────────┘
```

## 📊 Operation Categories

```
┌─────────────────────────────────────────────────────────┐
│                    QUERIES (Read)                        │
├─────────────────────────────────────────────────────────┤
│  useGetWebsite(entityId)        → Full website data     │
│  useGetWebsiteBySlug(slug)      → Public website view   │
│  useGetPage(pageId)             → Single page + modules │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 MUTATIONS (Write)                        │
├─────────────────────────────────────────────────────────┤
│  Website Settings:                                       │
│    • useUpdateWebsiteTheme()                            │
│    • useUpdateWebsiteFont()                             │
│    • usePublishWebsite()                                │
│                                                          │
│  Layout Components:                                      │
│    • useUpdateNavbar()                                  │
│    • useUpdateFooter()                                  │
│                                                          │
│  Page Management:                                        │
│    • useCreatePage()                                    │
│    • useUpdatePage()                                    │
│    • useDeletePage()                                    │
│    • useReorderPages()                                  │
│                                                          │
│  Module Management:                                      │
│    • useCreateModule()                                  │
│    • useUpdateModule()                                  │
│    • useReorderModules()                                │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Example: Complete CRUD Flow

```
CREATE PAGE
┌──────────────┐
│ Component    │ → useCreatePage()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ CREATE_PAGE  │ → GraphQL Mutation
│ mutation     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Server       │ → Creates page in DB
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Response     │ → { id, name, slug, ... }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Component    │ → Receives new page data
│ Updates UI   │
└──────────────┘

READ PAGE
┌──────────────┐
│ Component    │ → useGetPage(pageId)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ GET_PAGE     │ → GraphQL Query
│ query        │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Server       │ → Fetches from DB
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Response     │ → { id, name, modules: [...] }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Component    │ → Displays page data
│ Renders UI   │
└──────────────┘

UPDATE PAGE
┌──────────────┐
│ Component    │ → useUpdatePage()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ UPDATE_PAGE  │ → GraphQL Mutation
│ mutation     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Server       │ → Updates DB
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Response     │ → { id, name, updatedAt, ... }
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Component    │ → UI updates automatically
│ (via cache)  │
└──────────────┘

DELETE PAGE
┌──────────────┐
│ Component    │ → useDeletePage()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ DELETE_PAGE  │ → GraphQL Mutation
│ mutation     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Server       │ → Deletes from DB
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Response     │ → true/false
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Component    │ → Removes from UI
│ Refetch list │
└──────────────┘
```

## 🚀 Best Practices

```
┌─────────────────────────────────────────────────────────┐
│                   DO's                                   │
├─────────────────────────────────────────────────────────┤
│  ✓ Use TypeScript types for type safety                 │
│  ✓ Handle loading and error states                      │
│  ✓ Implement optimistic UI updates                      │
│  ✓ Use refetchQueries for data consistency              │
│  ✓ Cache queries with appropriate policies              │
│  ✓ Provide user feedback for mutations                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   DON'Ts                                 │
├─────────────────────────────────────────────────────────┤
│  ✗ Don't ignore error handling                          │
│  ✗ Don't skip loading states                            │
│  ✗ Don't over-refetch (performance impact)              │
│  ✗ Don't use 'any' types (lose type safety)             │
│  ✗ Don't forget to handle edge cases                    │
└─────────────────────────────────────────────────────────┘
```

## 📚 Documentation Hierarchy

```
1. QUICKSTART.md          → Start here! Quick examples
2. WEBSITE_API.md         → Complete API reference
3. website-examples.tsx   → 15+ real-world examples
4. WEBSITE_IMPLEMENTATION.md → Technical overview
5. ARCHITECTURE.md        → This file (system design)
```

---

This architecture ensures:
- ✅ Type safety throughout
- ✅ Reusable hooks
- ✅ Consistent patterns
- ✅ Easy maintenance
- ✅ Great developer experience

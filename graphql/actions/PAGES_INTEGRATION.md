# Pages Management - GraphQL Integration

## ✅ Implementation Complete

Successfully integrated GraphQL queries and mutations into the Pages Management component.

### Changes Made

#### 1. **Added GraphQL Imports**
```typescript
import { useGetEntity } from "@/graphql/actions";
import { useGetWebsite, useCreatePage } from "@/graphql/actions/website";
import { useToast } from "@/hooks/use-toast";
```

#### 2. **Fetch Website Data from Server**
- Uses `useGetWebsite` hook to fetch pages from the GraphQL API
- Automatically fetches when entity ID is available
- Uses `cache-and-network` fetch policy for optimal UX

```typescript
const { data: websiteData, loading: websiteLoading, refetch } = useGetWebsite(
  entityId || "",
  {
    skip: !entityId,
    fetchPolicy: "cache-and-network",
  }
);
```

#### 3. **Create Pages via GraphQL Mutation**
- Replaced local-only page creation with GraphQL mutation
- Calls `useCreatePage` mutation to persist pages to server
- Shows success/error toasts for user feedback
- Automatically refetches data after successful creation

```typescript
const [createPageMutation, { loading: creatingPage }] = useCreatePage({
  onCompleted: (data) => {
    toast({ title: "Success", description: "Page created successfully!" });
    addPage(data.createPage.name, data.createPage.slug);
    refetch();
  },
  onError: (error) => {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  },
});
```

#### 4. **Display Server Data**
- Shows pages from server when available
- Falls back to local store if server data not loaded
- Displays loading spinner while fetching

```typescript
const displayPages = websiteData?.getWebsite?.pages || pages;
```

#### 5. **Enhanced UI/UX**
- **Loading State**: Shows spinner while fetching pages
- **Creating State**: Disables form and shows "Creating..." while mutation runs
- **Toast Notifications**: Success and error messages for all operations
- **Validation**: Checks for required fields and website existence

### Features

✅ **Server-Side Data Fetching**
- Fetches pages from GraphQL API
- Real-time sync with server

✅ **Page Creation**
- Creates pages via GraphQL mutation
- Validates input before submission
- Shows loading state during creation

✅ **Error Handling**
- Displays error messages via toast
- Handles network failures gracefully

✅ **Loading States**
- Loading spinner while fetching pages
- Button loading state while creating
- Disabled inputs during operations

✅ **User Feedback**
- Success toast on page creation
- Error toast on failures
- Visual loading indicators

### Data Flow

```
1. Component Mounts
   ↓
2. Fetch Entity ID (useGetEntity)
   ↓
3. Fetch Website Data (useGetWebsite)
   ↓
4. Display Pages (server data or fallback to local)
   ↓
5. User Creates Page
   ↓
6. Call GraphQL Mutation (useCreatePage)
   ↓
7. Update Local Store
   ↓
8. Refetch Server Data
   ↓
9. UI Updates Automatically
```

### Code Example

```typescript
// Fetch website pages
const { data: websiteData, loading, refetch } = useGetWebsite(entityId);

// Create new page
const [createPage, { loading: creating }] = useCreatePage({
  onCompleted: () => {
    toast({ title: "Success!" });
    refetch();
  },
});

// Use in component
<Button onClick={() => createPage({ 
  variables: { 
    websiteId: websiteData.getWebsite.id,
    name: "New Page",
    slug: "new-page"
  }
})}>
  {creating ? "Creating..." : "Create Page"}
</Button>
```

### Files Modified

- `/app/(authlayout)/app-layout/pages/page.tsx`
  - Added GraphQL hooks
  - Integrated server data fetching
  - Added create page mutation
  - Enhanced UI with loading states
  - Added toast notifications

### Testing Checklist

- [ ] Pages load from server on component mount
- [ ] Loading spinner shows while fetching
- [ ] Create page button opens dialog
- [ ] Form validation works (empty fields)
- [ ] Page creation calls GraphQL mutation
- [ ] Success toast shows on successful creation
- [ ] Error toast shows on failure
- [ ] Button shows loading state while creating
- [ ] Data refetches after creation
- [ ] New page appears in list

### Next Steps

Consider implementing:
1. **Update Page** - Edit existing pages via GraphQL
2. **Delete Page** - Delete pages via GraphQL mutation
3. **Reorder Pages** - Drag & drop with GraphQL mutation
4. **Toggle Status** - Enable/disable pages via GraphQL
5. **Error Retry** - Retry button on fetch failures
6. **Optimistic Updates** - Update UI before server response

---

**Status**: ✅ Complete and Ready for Testing
**Date**: December 2024

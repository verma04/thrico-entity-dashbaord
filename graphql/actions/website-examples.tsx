/**
 * WEBSITE GRAPHQL HOOKS - USAGE EXAMPLES
 * 
 * This file demonstrates how to use the website GraphQL hooks
 * in your React components with TypeScript.
 */

import {
  useGetWebsite,
  useGetWebsiteBySlug,
  useGetPage,
  useUpdateWebsiteTheme,
  useUpdateWebsiteFont,
  usePublishWebsite,
  useUpdateNavbar,
  useUpdateFooter,
  useCreatePage,
  useUpdatePage,
  useDeletePage,
  useReorderPages,
  useCreateModule,
  useUpdateModule,
  useReorderModules,
} from "@/graphql/actions/website";

// ============================================
// EXAMPLE 1: Fetch Website Data
// ============================================

export function WebsiteEditor() {
  const entityId = "your-entity-id";

  const { data, loading, error, refetch } = useGetWebsite(entityId, {
    skip: !entityId, // Skip query if no entityId
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <div>Loading website...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const website = data?.getWebsite;

  return (
    <div>
      <h1>{website?.theme}</h1>
      <p>Published: {website?.isPublished ? "Yes" : "No"}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}

// ============================================
// EXAMPLE 2: Fetch Website by Slug (Public View)
// ============================================

export function PublicWebsiteView({ slug }: { slug: string }) {
  const { data, loading } = useGetWebsiteBySlug(slug);

  if (loading) return <div>Loading...</div>;

  const website = data?.getWebsiteBySlug;

  return (
    <div>
      <h1>Theme: {website?.theme}</h1>
      <h2>Pages:</h2>
      <ul>
        {website?.pages.map((page) => (
          <li key={page.id}>
            {page.name} - {page.slug}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// EXAMPLE 3: Update Website Theme
// ============================================

export function ThemeSelector({ websiteId }: { websiteId: string }) {
  const [updateTheme, { loading }] = useUpdateWebsiteTheme({
    onCompleted: (data) => {
      console.log("Theme updated:", data.updateWebsiteTheme.theme);
    },
    onError: (error) => {
      console.error("Failed to update theme:", error);
    },
  });

  const handleThemeChange = async (theme: string) => {
    try {
      await updateTheme({
        variables: {
          websiteId,
          theme,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={() => handleThemeChange("modern")} disabled={loading}>
        Modern Theme
      </button>
      <button onClick={() => handleThemeChange("classic")} disabled={loading}>
        Classic Theme
      </button>
    </div>
  );
}

// ============================================
// EXAMPLE 4: Update Website Font
// ============================================

export function FontSelector({ websiteId }: { websiteId: string }) {
  const [updateFont] = useUpdateWebsiteFont();

  const handleFontChange = (font: string) => {
    updateFont({
      variables: { websiteId, font },
    });
  };

  return (
    <select onChange={(e) => handleFontChange(e.target.value)}>
      <option value="Inter">Inter</option>
      <option value="Roboto">Roboto</option>
      <option value="Poppins">Poppins</option>
    </select>
  );
}

// ============================================
// EXAMPLE 5: Publish/Unpublish Website
// ============================================

export function PublishButton({ websiteId }: { websiteId: string }) {
  const [publishWebsite, { loading }] = usePublishWebsite({
    onCompleted: (data) => {
      alert(
        `Website ${data.publishWebsite.isPublished ? "published" : "unpublished"}`
      );
    },
  });

  const handlePublish = () => {
    publishWebsite({
      variables: { websiteId },
    });
  };

  return (
    <button onClick={handlePublish} disabled={loading}>
      {loading ? "Publishing..." : "Publish Website"}
    </button>
  );
}

// ============================================
// EXAMPLE 6: Update Navbar
// ============================================

export function NavbarEditor({ websiteId }: { websiteId: string }) {
  const [updateNavbar] = useUpdateNavbar();

  const handleUpdateNavbar = () => {
    updateNavbar({
      variables: {
        websiteId,
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
  };

  return <button onClick={handleUpdateNavbar}>Update Navbar</button>;
}

// ============================================
// EXAMPLE 7: Update Footer
// ============================================

export function FooterEditor({ websiteId }: { websiteId: string }) {
  const [updateFooter] = useUpdateFooter();

  const handleUpdateFooter = () => {
    updateFooter({
      variables: {
        websiteId,
        layout: "three-column",
        content: {
          copyright: "© 2024 My Company",
          socialLinks: {
            facebook: "https://facebook.com/mycompany",
            twitter: "https://twitter.com/mycompany",
          },
        },
        isEnabled: true,
      },
    });
  };

  return <button onClick={handleUpdateFooter}>Update Footer</button>;
}

// ============================================
// EXAMPLE 8: Create a New Page
// ============================================

export function CreatePageForm({ websiteId }: { websiteId: string }) {
  const [createPage, { loading }] = useCreatePage({
    onCompleted: (data) => {
      console.log("Page created:", data.createPage);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createPage({
      variables: {
        websiteId,
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Page Name" required />
      <input name="slug" placeholder="page-slug" required />
      <button type="submit" disabled={loading}>
        Create Page
      </button>
    </form>
  );
}

// ============================================
// EXAMPLE 9: Update Page
// ============================================

export function UpdatePageForm({ pageId }: { pageId: string }) {
  const [updatePage] = useUpdatePage();

  const handleUpdate = () => {
    updatePage({
      variables: {
        pageId,
        name: "Updated Page Name",
        slug: "updated-slug",
        isEnabled: true,
      },
    });
  };

  return <button onClick={handleUpdate}>Update Page</button>;
}

// ============================================
// EXAMPLE 10: Delete Page
// ============================================

export function DeletePageButton({ pageId }: { pageId: string }) {
  const [deletePage, { loading }] = useDeletePage({
    onCompleted: () => {
      alert("Page deleted successfully");
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this page?")) {
      deletePage({
        variables: { pageId },
      });
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      Delete Page
    </button>
  );
}

// ============================================
// EXAMPLE 11: Reorder Pages
// ============================================

export function PageReorder({
  websiteId,
  pageIds,
}: {
  websiteId: string;
  pageIds: string[];
}) {
  const [reorderPages] = useReorderPages();

  const handleReorder = (newOrder: string[]) => {
    reorderPages({
      variables: {
        websiteId,
        pageIds: newOrder,
      },
    });
  };

  // In a real app, you'd use a drag-and-drop library
  return (
    <div>
      <button onClick={() => handleReorder([...pageIds].reverse())}>
        Reverse Order
      </button>
    </div>
  );
}

// ============================================
// EXAMPLE 12: Create Module
// ============================================

export function CreateModuleButton({ pageId }: { pageId: string }) {
  const [createModule] = useCreateModule({
    onCompleted: (data) => {
      console.log("Module created:", data.createModule);
    },
  });

  const handleCreateHeroModule = () => {
    createModule({
      variables: {
        pageId,
        type: "hero",
        name: "Hero Section",
        layout: "centered",
        content: {
          title: "Welcome to Our Website",
          subtitle: "Building amazing experiences",
          ctaText: "Get Started",
          ctaLink: "/signup",
        },
      },
    });
  };

  return <button onClick={handleCreateHeroModule}>Add Hero Section</button>;
}

// ============================================
// EXAMPLE 13: Update Module
// ============================================

export function UpdateModuleButton({ moduleId }: { moduleId: string }) {
  const [updateModule] = useUpdateModule();

  const handleUpdate = () => {
    updateModule({
      variables: {
        moduleId,
        name: "Updated Hero Section",
        layout: "split",
        content: {
          title: "New Title",
          subtitle: "New Subtitle",
        },
        isEnabled: true,
      },
    });
  };

  return <button onClick={handleUpdate}>Update Module</button>;
}

// ============================================
// EXAMPLE 14: Reorder Modules
// ============================================

export function ModuleReorder({
  pageId,
  moduleIds,
}: {
  pageId: string;
  moduleIds: string[];
}) {
  const [reorderModules] = useReorderModules();

  const moveModuleUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...moduleIds];
    [newOrder[index - 1], newOrder[index]] = [
      newOrder[index],
      newOrder[index - 1],
    ];

    reorderModules({
      variables: {
        pageId,
        moduleIds: newOrder,
      },
    });
  };

  return (
    <div>
      {moduleIds.map((id, index) => (
        <div key={id}>
          Module {index + 1}
          <button onClick={() => moveModuleUp(index)}>Move Up</button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 15: Complete Page Editor
// ============================================

export function CompletePageEditor({ pageId }: { pageId: string }) {
  const { data, loading } = useGetPage(pageId);
  const [updateModule] = useUpdateModule();

  if (loading) return <div>Loading page...</div>;

  const page = data?.getPage;

  const toggleModule = (moduleId: string, currentState: boolean) => {
    updateModule({
      variables: {
        moduleId,
        isEnabled: !currentState,
      },
    });
  };

  return (
    <div>
      <h1>{page?.name}</h1>
      <p>Slug: {page?.slug}</p>

      <h2>Modules:</h2>
      {page?.modules.map((module) => (
        <div key={module.id}>
          <h3>{module.name}</h3>
          <p>Type: {module.type}</p>
          <p>Layout: {module.layout}</p>
          <button onClick={() => toggleModule(module.id, module.isEnabled)}>
            {module.isEnabled ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
}

import { useCallback } from "react";
import {
  useWebsiteBuilderStore,
  ModuleData,
  ModuleType,
} from "@/store/useWebsiteBuilderStore";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useToast } from "@/hooks/use-toast";
import { useGetWebsite, useCreateModule } from "@/graphql/actions/website";

export const useModuleCreation = () => {
  const { pages, currentPageId, addModuleToPage } = useWebsiteBuilderStore();
  const { isPremium } = useIsPremium();
  const { toast } = useToast();

  const { data: websiteData, refetch: refetchWebsite } = useGetWebsite({});
  const [createModuleMutation, { loading: isCreating }] = useCreateModule({
    onCompleted: (data) => {
      refetchWebsite();
    },
  });

  const handleAddModule = useCallback(
    async (
      type: ModuleType,
      baseName: string,
      defaultLayout: string,
      isPremiumModule: boolean
    ) => {
      if (!currentPageId) return;

      // Check if user is trying to add a premium module without premium access
      if (isPremiumModule && !isPremium) {
        toast({
          title: "Premium Feature",
          description:
            "This module is only available for premium users. Upgrade to access all modules.",
          variant: "destructive",
        });
      }

      // Generate a temporary ID for the store, but we will eventually replace/sync it
      // Actually, since we are waiting for the API now, we can decide whether to be optimistic
      // User requested to "take module data id from response"
      const tempId = crypto.randomUUID();

      // Calculate sort value for new module (next available index)
      const currentPage = pages.find((p) => p.id === currentPageId);
      const currentModules = currentPage?.modules || [];
      const maxSort = currentModules.reduce(
        (max, mod) => Math.max(max, mod.order ?? -1),
        -1
      );
      const newSort = maxSort + 1;

      let initialContent: Record<string, any> = {
        title: `New ${baseName}`,
        subtitle: "Edit this description in settings.",
        items: [],
      };

      if (type === "html") {
        initialContent = {
          title: "HTML Section",
          description: "",
          hideTitle: true,
          hideDescription: true,
          htmlCode: `<div style="padding: 40px 24px; text-align: center; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.3);">
  <h2 style="font-size: 26px; font-weight: 700; margin-bottom: 10px; color: #ffffff;">Custom HTML Section</h2>
  <p style="font-size: 15px; opacity: 0.92; max-width: 580px; margin: 0 auto; line-height: 1.6;">Upload your HTML file or write custom code directly in the editor to render custom layouts, interactive widgets, or tailored components.</p>
</div>`,
          renderMode: "direct",
          containerWidth: "contained",
          padding: "medium",
          minHeight: 200,
          customCss: "",
          fileName: "",
        };
      }

      const newModule: ModuleData = {
        id: tempId,
        type: type,
        name: baseName,
        isEnabled: true,
        layout: defaultLayout as any,
        content: initialContent,
        isCustomized: false,
        visibility: "public",
        order: newSort,
      };

      try {
        // Persist to backend first and wait for the real ID
        const response = await createModuleMutation({
          variables: {
            pageId: currentPageId,
            type: newModule.type,
            name: newModule.name,
            layout: newModule.layout,
            content: newModule.content,
          },
        });

        const createdModule = response.data?.createModule;

        if (createdModule) {
          // Use the real ID from the backend
          const moduleWithRealId: ModuleData = {
            ...newModule,
            id: createdModule.id,
            order: createdModule.order ?? newSort,
          };

          addModuleToPage(currentPageId, moduleWithRealId);
          return true;
        }

        return false;
      } catch (error) {
        console.error("Error creating module:", error);
        toast({
          title: "Error",
          description: "Failed to create module. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    },
    [
      currentPageId,
      isPremium,
      pages,
      addModuleToPage,
      createModuleMutation,
      toast,
    ]
  );

  return { handleAddModule, isCreating };
};

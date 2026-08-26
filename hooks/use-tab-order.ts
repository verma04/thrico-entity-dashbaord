import { useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_TAB_ORDER,
  UPDATE_TAB_ORDER,
} from "@/graphql/actions/layout/layout-queries";

export const useTabOrder = (
  module: string,
  store: any,
  defaultTabs: any[],
) => {
  const { tabOrder, setTabOrder } = store();
  const hasInitialized = useRef(false);

  const { data } = useQuery(GET_TAB_ORDER, {
    variables: { module },
    fetchPolicy: "cache-first",
  });

  const [updateTabOrder] = useMutation(UPDATE_TAB_ORDER, {
    ignoreResults: true,
  });

  useEffect(() => {
    if (hasInitialized.current || !data) return;

    const savedTabs = data?.getTabOrder?.tabs;
    if (Array.isArray(savedTabs) && savedTabs.length > 0) {
      setTabOrder(savedTabs);
    }
    hasInitialized.current = true;
  }, [data, setTabOrder]);

  const onReorder = useCallback(
    async (newOrder: string[]) => {
      setTabOrder(newOrder); // Optimistic UI update
      try {
        await updateTabOrder({
          variables: {
            input: {
              module,
              tabs: newOrder,
            },
          },
        });
      } catch (error) {
        console.error(`Failed to update ${module} tab order:`, error);
      }
    },
    [module, setTabOrder, updateTabOrder],
  );

  const getOrderedTabs = useCallback(
    (tabs: any[]) => {
      if (!tabOrder || tabOrder.length === 0) return tabs;

      // Sort tabs based on tabOrder array
      const orderedTabs = [...tabs].sort((a, b) => {
        const aIndex = tabOrder.indexOf(a.key);
        const bIndex = tabOrder.indexOf(b.key);

        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;

        return aIndex - bIndex;
      });

      return orderedTabs;
    },
    [tabOrder],
  );

  return { getOrderedTabs, onReorder };
};

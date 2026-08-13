import { useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TAB_ORDER, UPDATE_TAB_ORDER } from "@/graphql/actions/layout/layout-queries";

export const useTabOrder = (module: string, store: any, defaultTabs: any[]) => {
  const { tabOrder, setTabOrder } = store();
  const isInitialMount = useRef(true);

  const { data } = useQuery(GET_TAB_ORDER, {
    variables: { module },
    fetchPolicy: "network-only",
  });

  const [updateTabOrder] = useMutation(UPDATE_TAB_ORDER, {
    ignoreResults: true,
  });

  useEffect(() => {
    if (data?.getTabOrder?.tabs?.length > 0 && isInitialMount.current) {
      setTabOrder(data.getTabOrder.tabs);
      isInitialMount.current = false;
    } else if (data?.getTabOrder?.tabs?.length === 0 && isInitialMount.current) {
      setTabOrder(defaultTabs.map((t) => t.key));
      isInitialMount.current = false;
    }
  }, [data, setTabOrder, defaultTabs]);

  const onReorder = async (newOrder: string[]) => {
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
  };

  const getOrderedTabs = (tabs: any[]) => {
    if (tabOrder.length === 0) return tabs;
    
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
  };

  return { getOrderedTabs, onReorder };
};

/**
 * Example usage of GetFaqByModule hook
 *
 * This file demonstrates how to use the useGetFaqByModule hook
 */

import { useGetFaqByModule } from "@/graphql/actions/faq";

export function FaqByModuleExample() {
  // Example 1: Fetch FAQ for a specific module
  const { data, loading, error, refetch } = useGetFaqByModule({
    variables: {
      input: {
        module: "communities", // Replace with your module name
      },
    },
  });

  // Example 2: Fetch FAQ with module set to null
  const { data: allFaq } = useGetFaqByModule({
    variables: {
      input: {
        module: null,
      },
    },
  });

  // Example 3: Skip query initially and fetch later
  const { data: lazyData, refetch: lazyRefetch } = useGetFaqByModule({
    skip: true, // Don't fetch on mount
  });

  const handleFetchFaq = (moduleName: string | null) => {
    lazyRefetch({
      input: {
        module: moduleName,
      },
    });
  };

  if (loading) return <div>Loading FAQ...</div>;
  if (error) return <div>Error loading FAQ: {error.message}</div>;
  if (!data?.getFaqByModule) return <div>No FAQ found</div>;

  const faqData = data.getFaqByModule;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">FAQ by Module</h2>

      <div className="border rounded-lg p-4">
        <p>
          <strong>Module:</strong> {faqData.module}
        </p>
        <p>
          <strong>FAQ Content:</strong>
        </p>
        <div className="mt-2 whitespace-pre-wrap">{faqData.faq}</div>
      </div>

      {/* Example: Buttons to fetch different modules */}
      <div className="flex gap-2">
        <button
          onClick={() => handleFetchFaq("communities")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Load Communities FAQ
        </button>
        <button
          onClick={() => handleFetchFaq("events")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Load Events FAQ
        </button>
        <button
          onClick={() => handleFetchFaq(null)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Load All FAQ
        </button>
      </div>
    </div>
  );
}

// Alternative: Direct usage in a function
export async function getFaqForModule(moduleName: string | null) {
  const { data } = await useGetFaqByModule({
    variables: {
      input: {
        module: moduleName,
      },
    },
  });

  return data?.getFaqByModule;
}

// Example with error handling and refetching
export function FaqWithRefetch() {
  const { data, loading, error, refetch } = useGetFaqByModule({
    variables: {
      input: {
        module: "jobs",
      },
    },
    // Optional: Configure polling

    // Optional: Configure fetch policy
    fetchPolicy: "cache-and-network",
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {data && (
        <div>
          <h3>Module: {data.getFaqByModule.module}</h3>
          <p>{data.getFaqByModule.faq}</p>
          <button onClick={handleRefresh}>Refresh FAQ</button>
        </div>
      )}
    </div>
  );
}

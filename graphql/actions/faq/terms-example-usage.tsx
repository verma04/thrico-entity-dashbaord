/**
 * Example usage of GetTermsAndConditionsByModule hook
 *
 * This file demonstrates how to use the useGetTermsAndConditionsByModule hook
 */

import { useGetTermsAndConditionsByModule } from "@/graphql/actions/faq";

export function TermsAndConditionsByModuleExample() {
  // Example 1: Fetch Terms & Conditions for a specific module
  const { data, loading, error, refetch } = useGetTermsAndConditionsByModule({
    variables: {
      input: {
        module: "communities", // Replace with your module name
      },
    },
  });

  // Example 2: Fetch Terms & Conditions with module set to null
  const { data: allTerms } = useGetTermsAndConditionsByModule({
    variables: {
      input: {
        module: null,
      },
    },
  });

  // Example 3: Skip query initially and fetch later
  const { data: lazyData, refetch: lazyRefetch } =
    useGetTermsAndConditionsByModule({
      skip: true, // Don't fetch on mount
    });

  const handleFetchTerms = (moduleName: string | null) => {
    lazyRefetch({
      input: {
        module: moduleName,
      },
    });
  };

  if (loading) return <div>Loading Terms & Conditions...</div>;
  if (error)
    return <div>Error loading Terms & Conditions: {error.message}</div>;
  if (!data?.getTermsAndConditionsByModule)
    return <div>No Terms & Conditions found</div>;

  const termsData = data.getTermsAndConditionsByModule;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Terms & Conditions by Module</h2>

      <div className="border rounded-lg p-4">
        <p>
          <strong>Module:</strong> {termsData.module}
        </p>
        <p>
          <strong>Terms & Conditions:</strong>
        </p>
        <div className="mt-2 whitespace-pre-wrap">
          {termsData.termsAndConditions}
        </div>
      </div>

      {/* Example: Buttons to fetch different modules */}
      <div className="flex gap-2">
        <button
          onClick={() => handleFetchTerms("communities")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Load Communities T&C
        </button>
        <button
          onClick={() => handleFetchTerms("events")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Load Events T&C
        </button>
        <button
          onClick={() => handleFetchTerms("marketplace")}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Load Marketplace T&C
        </button>
        <button
          onClick={() => handleFetchTerms(null)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Load All T&C
        </button>
      </div>
    </div>
  );
}

// Alternative: Direct usage in a function
export async function getTermsForModule(moduleName: string | null) {
  const { data } = await useGetTermsAndConditionsByModule({
    variables: {
      input: {
        module: moduleName,
      },
    },
  });

  return data?.getTermsAndConditionsByModule;
}

// Example with error handling and refetching
export function TermsWithRefetch() {
  const { data, loading, error, refetch } = useGetTermsAndConditionsByModule({
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
          <h3>Module: {data.getTermsAndConditionsByModule.module}</h3>
          <div className="prose">
            {data.getTermsAndConditionsByModule.termsAndConditions}
          </div>
          <button onClick={handleRefresh}>Refresh Terms & Conditions</button>
        </div>
      )}
    </div>
  );
}

// Example: Side-by-side comparison of FAQ and Terms & Conditions
import { useGetFaqByModule } from "@/graphql/actions/faq";

export function FaqAndTermsComparison({ moduleName }: { moduleName: string }) {
  const { data: faqData, loading: faqLoading } = useGetFaqByModule({
    variables: { input: { module: moduleName } },
  });

  const { data: termsData, loading: termsLoading } =
    useGetTermsAndConditionsByModule({
      variables: { input: { module: moduleName } },
    });

  if (faqLoading || termsLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-2">FAQ</h3>
        <p>{faqData?.getFaqByModule.faq}</p>
      </div>
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-2">Terms & Conditions</h3>
        <p>{termsData?.getTermsAndConditionsByModule.termsAndConditions}</p>
      </div>
    </div>
  );
}

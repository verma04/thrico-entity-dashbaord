/**
 * Example usage of Update FAQ and Terms & Conditions mutations
 *
 * This file demonstrates how to use the update hooks for both FAQ and Terms & Conditions
 */

import {
  useUpdateFaqByModule,
  useUpdateTermsAndConditionsByModule,
} from "@/graphql/actions/faq";
import { useState } from "react";

// Example 1: Update FAQ for a module
export function UpdateFaqExample() {
  const [faqContent, setFaqContent] = useState("");
  const [moduleName, setModuleName] = useState("communities");

  const [updateFaq, { loading, error }] = useUpdateFaqByModule({
    module: moduleName,
    onCompleted: (data) => {
      console.log("FAQ updated successfully:", data);
      alert("FAQ updated!");
    },
    onError: (error) => {
      console.error("Error updating FAQ:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateFaq({
      variables: {
        module: moduleName,
        faq: faqContent, // JSON content
      },
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Update FAQ</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Module Name</label>
          <select
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="communities">Communities</option>
            <option value="events">Events</option>
            <option value="jobs">Jobs</option>
            <option value="marketplace">Marketplace</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            FAQ Content (JSON)
          </label>
          <textarea
            value={faqContent}
            onChange={(e) => setFaqContent(e.target.value)}
            placeholder='{"question": "How do I join?", "answer": "Click the join button"}'
            className="w-full border rounded px-3 py-2 h-32"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">Error: {error.message}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update FAQ"}
        </button>
      </form>
    </div>
  );
}

// Example 2: Update Terms & Conditions for a module
export function UpdateTermsExample() {
  const [termsContent, setTermsContent] = useState("");
  const [moduleName, setModuleName] = useState("communities");

  const [updateTerms, { loading, error }] = useUpdateTermsAndConditionsByModule(
    {
      module: moduleName,
      onCompleted: (data) => {
        console.log("Terms & Conditions updated successfully:", data);
        alert("Terms & Conditions updated!");
      },
      onError: (error) => {
        console.error("Error updating Terms & Conditions:", error);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateTerms({
      variables: {
        module: moduleName,
        termsAndConditions: termsContent, // JSON content
      },
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Update Terms & Conditions</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Module Name</label>
          <select
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="communities">Communities</option>
            <option value="events">Events</option>
            <option value="jobs">Jobs</option>
            <option value="marketplace">Marketplace</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Terms & Conditions Content (JSON)
          </label>
          <textarea
            value={termsContent}
            onChange={(e) => setTermsContent(e.target.value)}
            placeholder='{"terms": "By using this service, you agree to..."}'
            className="w-full border rounded px-3 py-2 h-32"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">Error: {error.message}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Terms & Conditions"}
        </button>
      </form>
    </div>
  );
}

// Example 3: Combined FAQ and Terms & Conditions editor
export function CombinedEditor({ moduleName }: { moduleName: string }) {
  const [faqContent, setFaqContent] = useState("");
  const [termsContent, setTermsContent] = useState("");

  const [updateFaq, { loading: faqLoading }] = useUpdateFaqByModule({
    module: moduleName,
    onCompleted: () => alert("FAQ updated!"),
  });

  const [updateTerms, { loading: termsLoading }] =
    useUpdateTermsAndConditionsByModule({
      module: moduleName,
      onCompleted: () => alert("Terms updated!"),
    });

  const handleUpdateBoth = async () => {
    try {
      await updateFaq({
        variables: { module: moduleName, faq: faqContent },
      });

      await updateTerms({
        variables: { module: moduleName, termsAndConditions: termsContent },
      });

      alert("Both FAQ and Terms & Conditions updated successfully!");
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit {moduleName} Content</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">FAQ Content</label>
          <textarea
            value={faqContent}
            onChange={(e) => setFaqContent(e.target.value)}
            className="w-full border rounded px-3 py-2 h-48"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Terms & Conditions Content
          </label>
          <textarea
            value={termsContent}
            onChange={(e) => setTermsContent(e.target.value)}
            className="w-full border rounded px-3 py-2 h-48"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() =>
            updateFaq({ variables: { module: moduleName, faq: faqContent } })
          }
          disabled={faqLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {faqLoading ? "Updating..." : "Update FAQ Only"}
        </button>

        <button
          onClick={() =>
            updateTerms({
              variables: {
                module: moduleName,
                termsAndConditions: termsContent,
              },
            })
          }
          disabled={termsLoading}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {termsLoading ? "Updating..." : "Update Terms Only"}
        </button>

        <button
          onClick={handleUpdateBoth}
          disabled={faqLoading || termsLoading}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          {faqLoading || termsLoading ? "Updating..." : "Update Both"}
        </button>
      </div>
    </div>
  );
}

// Example 4: Direct usage without component
export async function updateModuleFaq(moduleName: string, faqData: any) {
  const [updateFaq] = useUpdateFaqByModule();

  const { data } = await updateFaq({
    variables: {
      module: moduleName,
      faq: faqData,
    },
  });

  return data?.updateFaqByModule;
}

export async function updateModuleTerms(moduleName: string, termsData: any) {
  const [updateTerms] = useUpdateTermsAndConditionsByModule();

  const { data } = await updateTerms({
    variables: {
      module: moduleName,
      termsAndConditions: termsData,
    },
  });

  return data?.updateTermsAndConditionsByModule;
}

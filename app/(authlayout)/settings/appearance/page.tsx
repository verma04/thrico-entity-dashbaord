"use client";
import { AppearanceSettings } from "@/components/settings/appearance";
import { getEntityTheme } from "@/graphql/actions/theme";

import { Loader2 } from "lucide-react";

function AppearancePage() {
  const { data, loading, error } = getEntityTheme();

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Appearance</h1>
          <p className="text-muted-foreground mt-2">
            Customize your community&#39;s look and feel
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Loading appearance settings...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            Error loading settings: {error.message}
          </div>
        )}

        {!loading && data && (
          <AppearanceSettings theme={data?.getEntityTheme || null} />
        )}
      </div>
    </main>
  );
}

export default AppearancePage;

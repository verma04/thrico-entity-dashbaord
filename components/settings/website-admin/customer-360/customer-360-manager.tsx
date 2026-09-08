"use client";

import React, { useMemo } from "react";
import {
  KeyRound,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  EcosystemWrapper,
  EcosystemHeader,
  EcosystemContainer,
  EcosystemActionBar,
} from "@/components/layout/ecosystem";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetCustomer360ApiKey,
  useGetAvailableCustomer360Modules,
  useCreateCustomer360ApiKey,
  useRegenerateCustomer360ApiKey,
  useUpdateCustomer360ApiKey,
  useToggleCustomer360ApiKeyModule,
  useDeleteCustomer360ApiKey,
  Customer360ApiKeyModule,
} from "@/graphql/actions/customer-360-api-key";
import { Customer360KeyCard } from "./customer-360-key-card";
import { Customer360ModulesCard } from "./customer-360-modules-card";
import { Customer360IntegrationGuide } from "./customer-360-integration-guide";
import { Customer360Sidebar } from "./customer-360-sidebar";

export default function Customer360Manager() {
  const {
    data: keyData,
    loading: keyLoading,
    refetch: refetchKey,
  } = useGetCustomer360ApiKey();

  const {
    data: availableModulesData,
    loading: modulesLoading,
  } = useGetAvailableCustomer360Modules();

  const apiKey = keyData?.getCustomer360ApiKey ?? null;

  // Combine key's enabled modules with default available modules
  const resolvedModules: Customer360ApiKeyModule[] = useMemo(() => {
    const baseModules =
      availableModulesData?.getAvailableCustomer360Modules || [];
    if (!apiKey) {
      return baseModules;
    }
    // If the API key has saved modules, merge them
    const keyModulesMap = new Map(
      (apiKey.modules || []).map((m) => [m.module, m.enabled])
    );
    const allowedSet = new Set(apiKey.allowedModules || []);

    return baseModules.map((base) => {
      let isEnabled = base.enabled;
      if (keyModulesMap.has(base.module)) {
        isEnabled = !!keyModulesMap.get(base.module);
      } else if (allowedSet.size > 0) {
        isEnabled = allowedSet.has(base.module);
      }
      return {
        ...base,
        enabled: isEnabled,
      };
    });
  }, [availableModulesData, apiKey]);

  // Mutations
  const [createKeyMutation, { loading: isCreating }] =
    useCreateCustomer360ApiKey({
      onCompleted: () => {
        toast.success("Customer 360 API Key Created", {
          description: "Your credential has been provisioned and is ready for use.",
        });
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create API key");
      },
    });

  const [regenerateKeyMutation, { loading: isRegenerating }] =
    useRegenerateCustomer360ApiKey({
      onCompleted: () => {
        toast.success("Customer 360 API Key Rolled", {
          description: "New token generated. The previous secret has been invalidated.",
        });
      },
      onError: (err) => {
        toast.error(err.message || "Failed to regenerate API key");
      },
    });

  const [updateKeyMutation] = useUpdateCustomer360ApiKey({
    onCompleted: () => {
      toast.success("Key settings updated");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update key settings");
    },
  });

  const [toggleModuleMutation, { loading: isTogglingModule }] =
    useToggleCustomer360ApiKeyModule({
      onCompleted: (res) => {
        toast.success("Module permission updated");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to toggle module permission");
      },
    });

  const [deleteKeyMutation, { loading: isDeleting }] =
    useDeleteCustomer360ApiKey({
      onCompleted: () => {
        toast.success("Customer 360 Key Revoked", {
          description: "The secret credential was deleted successfully.",
        });
      },
      onError: (err) => {
        toast.error(err.message || "Failed to revoke API key");
      },
    });

  // Handlers
  const handleCreateKey = () => {
    createKeyMutation({
      variables: {
        input: {
          name: "Customer 360 Production Key",
          isActive: true,
        },
      },
    });
  };

  const handleRegenerateKey = () => {
    regenerateKeyMutation();
  };

  const handleDeleteKey = () => {
    deleteKeyMutation();
  };

  const handleToggleActive = (isActive: boolean) => {
    if (!apiKey) return;
    updateKeyMutation({
      variables: {
        input: {
          isActive,
        },
      },
    });
  };

  const handleUpdateName = (name: string) => {
    if (!apiKey) return;
    updateKeyMutation({
      variables: {
        input: {
          name,
        },
      },
    });
  };

  const handleToggleModule = (moduleName: string, enabled: boolean) => {
    if (!apiKey) {
      toast.info("Please generate an API key before configuring permissions");
      return;
    }
    toggleModuleMutation({
      variables: {
        input: {
          module: moduleName,
          enabled,
        },
      },
    });
  };

  const handleBatchToggleAll = (enabled: boolean) => {
    if (!apiKey) {
      toast.info("Please generate an API key before configuring permissions");
      return;
    }
    const updatedModules = resolvedModules.map((m) => ({
      module: m.module,
      enabled,
    }));
    updateKeyMutation({
      variables: {
        input: {
          modules: updatedModules,
          allowedModules: enabled ? resolvedModules.map((m) => m.module) : [],
        },
      },
    });
  };

  const enabledCount = resolvedModules.filter((m) => m.enabled).length;

  return (
    <EcosystemWrapper className="min-h-screen pb-32">
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="Customer 360 Intelligence"
        description="Unified member graph API, real-time analytics access, and scoped integration keys."
        badgeText="API & Telemetry"
        icon={KeyRound}
        breadcrumbs={[
          { label: "Website", href: "/app-layout" },
          { label: "Customer 360" },
        ]}
      />

      {/* ── Action Bar / Controls ─────────────────────────────────────────── */}
      <EcosystemActionBar>
        <EcosystemActionBar.Group className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchKey()}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group className="ml-auto flex items-center gap-2">
          <EcosystemActionBar.Status active={apiKey?.isActive ?? false}>
            {apiKey ? (apiKey.isActive ? "Key Active" : "Key Paused") : "Not Provisioned"} • {enabledCount}/{resolvedModules.length} Modules Authorized
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0">
        {keyLoading && !apiKey ? (
          <div className="space-y-4">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (8 cols): Key Card, Modules Card, Code Guide */}
            <div className="lg:col-span-8 space-y-5">
              <Customer360KeyCard
                apiKey={apiKey}
                loading={keyLoading}
                onCreateKey={handleCreateKey}
                onRegenerateKey={handleRegenerateKey}
                onDeleteKey={handleDeleteKey}
                onToggleActive={handleToggleActive}
                onUpdateName={handleUpdateName}
                isCreating={isCreating}
                isRegenerating={isRegenerating}
                isDeleting={isDeleting}
              />

              <Customer360ModulesCard
                modules={resolvedModules}
                loading={modulesLoading}
                onToggleModule={handleToggleModule}
                onBatchToggleAll={handleBatchToggleAll}
                isToggling={isTogglingModule}
              />

              <Customer360IntegrationGuide apiKey={apiKey?.apiKey} />
            </div>

            {/* Right Column (4 cols): Sticky Sidebar */}
            <div className="lg:col-span-4 sticky top-6">
              <Customer360Sidebar apiKey={apiKey} modules={resolvedModules} />
            </div>
          </div>
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

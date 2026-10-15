"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { gql, useMutation } from "@apollo/client";
import { useFormik, FormikProvider, FormikProps } from "formik";
import * as Yup from "yup";
import {
  InputUpdateEntityModule,
  useCheckEntitySubscription,
  SubscriptionDetails,
} from "@/graphql/actions";
import {
  useGetEntitySettings,
  useUpdateEntitySettings,
} from "@/graphql/actions/settings";
import type { ModuleItem, UpdateEntityModuleResponse } from "./types";

const UPDATE_ENTITY_MODULE = gql`
  mutation UpdateEntityModule($input: [inputUpdateEntityModule]) {
    updateEntityModule(input: $input) {
      success
    }
  }
`;

const defaultModuleData: ModuleItem[] = [
  {
    id: "1",
    name: "Directory",
    enabled: true,
    required: true,
    category: "Core",
    showInMobileNavigation: true,
    showInWebNavigation: true,
    icon: null,
    isPopular: false,
    isPublicFacing: false,
    canRename: true,
  },
  {
    id: "2",
    name: "Communities",
    enabled: true,
    required: false,
    category: "Social",
    showInMobileNavigation: true,
    showInWebNavigation: true,
    icon: null,
    isPopular: true,
    isPublicFacing: false,
    canRename: true,
  },
];

type SubscriptionModule = NonNullable<SubscriptionDetails["modules"]>[number];

export interface ModulesFormValues {
  modules: ModuleItem[];
  hideMenuMobile: boolean;
}

export const modulesValidationSchema = Yup.object().shape({
  modules: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      name: Yup.string().required("Module name is required"),
      enabled: Yup.boolean().required(),
      showInMobileNavigation: Yup.boolean().required(),
      showInWebNavigation: Yup.boolean().required(),
      customName: Yup.string().nullable().optional(),
      customIcon: Yup.string().nullable().optional(),
      subtitle: Yup.string().nullable().optional(),
      isPopular: Yup.boolean().required(),
      showInMobileNavigationSortNumber: Yup.number().nullable().optional(),
      showInWebNavigationSortNumber: Yup.number().nullable().optional(),
    }),
  ),
  hideMenuMobile: Yup.boolean().required(),
});

interface ModulesContextType {
  formik: FormikProps<ModulesFormValues>;
  modules: ModuleItem[];
  originalModules: ModuleItem[];
  filteredModules: ModuleItem[];
  navigationModules: ModuleItem[];
  webNavigationModules: ModuleItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userRole: string;
  publicCount: number;
  internalCount: number;
  enabledCount: number;
  navCount: number;
  webNavCount: number;
  hideMenuMobile: boolean;
  setHideMenuMobile: (value: boolean | ((prev: boolean) => boolean)) => void;
  saving: boolean;
  saved: boolean;
  hasChanged: boolean;
  loading: boolean;
  error: Error | null;
  notification: {
    type: "success" | "error";
    message: string;
    description?: string;
  } | null;
  setNotification: React.Dispatch<
    React.SetStateAction<{
      type: "success" | "error";
      message: string;
      description?: string;
    } | null>
  >;
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
  toggleModule: (id: string) => void;
  togglePopular: (id: string) => void;
  toggleNavigation: (id: string) => void;
  toggleWebNavigation: (id: string) => void;
  changeCustomName: (id: string, value: string) => void;
  changeCustomIcon: (id: string, value: string) => void;
  changeSubtitle: (id: string, value: string) => void;
  moveNavigationModule: (id: string, direction: "up" | "down") => void;
  onDragEnd: (result: DropResult) => void;
  onDragEndWeb: (result: DropResult) => void;
  saveChanges: () => Promise<void>;
  onReset: () => void;
}

const ModulesContext = createContext<ModulesContextType | null>(null);

export function ModulesProvider({ children }: { children: React.ReactNode }) {
  const [updateEntityModule] = useMutation<
    UpdateEntityModuleResponse,
    { input: InputUpdateEntityModule[] }
  >(UPDATE_ENTITY_MODULE);

  const { data, loading, error } = useCheckEntitySubscription();
  const subscription = data?.checkEntitySubscription;

  const { data: settingsData } = useGetEntitySettings();
  const [updateEntitySettingsMutation] = useUpdateEntitySettings({});

  const [saved, setSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole] = useState("admin");
  const [showExportModal, setShowExportModal] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
    description?: string;
  } | null>(null);

  const initialModules = useMemo(() => {
    if (subscription && Array.isArray(subscription.modules)) {
      const parsedModules: ModuleItem[] = (
        subscription.modules as SubscriptionModule[]
      ).map((m) => ({
        id: m.id,
        name: m.name,
        enabled: m.enabled ?? true,
        required: false,
        showInMobileNavigation: m.showInMobileNavigation ?? false,
        showInWebNavigation: m.showInWebNavigation ?? false,
        icon: m.customIcon || m.icon || null,
        customIcon: m.customIcon ?? null,
        showInMobileNavigationSortNumber:
          typeof m.showInMobileNavigationSortNumber === "number"
            ? m.showInMobileNavigationSortNumber
            : undefined,
        showInWebNavigationSortNumber:
          typeof m.showInWebNavigationSortNumber === "number"
            ? m.showInWebNavigationSortNumber
            : undefined,
        isPopular: m.isPopular ?? false,
        customName: m.customName ?? null,
        subtitle: m.subtitle ?? null,
        isPublicFacing: m.isPublicFacing ?? false,
        canRename: m.canRename ?? true,
      }));

      // Normalize mobile nav sort numbers
      const activeMobileNav = parsedModules
        .filter((m) => m.showInMobileNavigation)
        .sort(
          (a, b) =>
            (a.showInMobileNavigationSortNumber ?? 0) -
            (b.showInMobileNavigationSortNumber ?? 0),
        );
      activeMobileNav.forEach((m, idx) => {
        m.showInMobileNavigationSortNumber = idx;
      });

      // Normalize web nav sort numbers
      const activeWebNav = parsedModules
        .filter((m) => m.showInWebNavigation)
        .sort(
          (a, b) =>
            (a.showInWebNavigationSortNumber ?? 0) -
            (b.showInWebNavigationSortNumber ?? 0),
        );
      activeWebNav.forEach((m, idx) => {
        m.showInWebNavigationSortNumber = idx;
      });

      return parsedModules;
    }
    return defaultModuleData;
  }, [subscription]);

  const initialHideMenuMobile = useMemo(() => {
    return settingsData?.getEntitySettings?.hideMenuMobile ?? false;
  }, [settingsData]);

  const formik = useFormik<ModulesFormValues>({
    initialValues: {
      modules: initialModules,
      hideMenuMobile: initialHideMenuMobile,
    },
    validationSchema: modulesValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const input: InputUpdateEntityModule[] = values.modules.map((m) => {
        const mobileNavIdx = values.modules
          .filter((item) => item.showInMobileNavigation)
          .sort(
            (a, b) =>
              (a.showInMobileNavigationSortNumber ?? 0) -
              (b.showInMobileNavigationSortNumber ?? 0),
          )
          .findIndex((nm) => String(nm.id) === String(m.id));

        const webNavIdx = values.modules
          .filter((item) => item.showInWebNavigation)
          .sort(
            (a, b) =>
              (a.showInWebNavigationSortNumber ?? 0) -
              (b.showInWebNavigationSortNumber ?? 0),
          )
          .findIndex((wm) => String(wm.id) === String(m.id));

        return {
          icon: m.icon ?? null,
          id: m.id ?? null,
          name: m.name ?? null,
          isEnabled: m.enabled ?? null,
          showInMobileNavigation: m.showInMobileNavigation ?? null,
          showInMobileNavigationSortNumber: m.showInMobileNavigation
            ? typeof m.showInMobileNavigationSortNumber === "number"
              ? m.showInMobileNavigationSortNumber
              : mobileNavIdx !== -1
                ? mobileNavIdx
                : 0
            : undefined,
          showInWebNavigation: m.showInWebNavigation ?? null,
          showInWebNavigationSortNumber: m.showInWebNavigation
            ? typeof m.showInWebNavigationSortNumber === "number"
              ? m.showInWebNavigationSortNumber
              : webNavIdx !== -1
                ? webNavIdx
                : 0
            : undefined,
          isPopular: m.isPopular ?? null,
          customName: m.customName ?? null,
          customIcon: m.customIcon ?? m.icon ?? null,
          subtitle: m.subtitle ?? null,
          isPublicFacing: m.isPublicFacing ?? false,
        };
      });

      try {
        const updateModulePromise = updateEntityModule({
          variables: { input },
          refetchQueries: ["CheckEntitySubscription"],
        });

        const promises: [
          ReturnType<typeof updateEntityModule>,
          ReturnType<typeof updateEntitySettingsMutation>?,
        ] = [updateModulePromise];

        if (values.hideMenuMobile !== initialHideMenuMobile) {
          promises.push(
            updateEntitySettingsMutation({
              variables: {
                input: {
                  hideMenuMobile: values.hideMenuMobile,
                },
              },
              refetchQueries: ["GetEntitySettings"],
            }),
          );
        }

        const [response] = await Promise.all(promises);
        if (response?.data?.updateEntityModule.success) {
          resetForm({ values });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
          setNotification({
            type: "success",
            message: "Changes saved successfully",
          });
          setTimeout(() => setNotification(null), 3000);
        } else {
          setNotification({
            type: "error",
            message: "Save failed",
            description: "Mutation did not succeed",
          });
        }
      } catch (err: unknown) {
        setNotification({
          type: "error",
          message: "Save failed",
          description:
            err && typeof err === "object" && "message" in err
              ? String((err as { message?: string }).message)
              : "An error occurred",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const modules = formik.values.modules;
  const hideMenuMobile = formik.values.hideMenuMobile;
  const hasChanged = formik.dirty;

  const setHideMenuMobile = (
    value: boolean | ((prev: boolean) => boolean),
  ) => {
    const nextVal =
      typeof value === "function" ? value(formik.values.hideMenuMobile) : value;
    void formik.setFieldValue("hideMenuMobile", nextVal);
  };

  const onReset = () => {
    formik.resetForm();
    setSaved(false);
  };

  const toggleModule = (id: string) => {
    if (userRole === "directory") return;
    const nextModules = modules.map((m) => {
      if (m.id === id && !m.required) {
        return m.enabled
          ? { ...m, enabled: false, showInMobileNavigation: false }
          : { ...m, enabled: true };
      }
      return m;
    });
    void formik.setFieldValue("modules", nextModules);
  };

  const togglePopular = (id: string) => {
    const nextModules = modules.map((m) =>
      m.id === id ? { ...m, isPopular: !m.isPopular } : m,
    );
    void formik.setFieldValue("modules", nextModules);
  };

  const toggleNavigation = (id: string) => {
    if (userRole === "directory") return;
    const activeNavModules = modules
      .filter((m) => m.showInMobileNavigation && String(m.id) !== String(id))
      .sort(
        (a, b) =>
          (a.showInMobileNavigationSortNumber ?? 0) -
          (b.showInMobileNavigationSortNumber ?? 0),
      );
    const target = modules.find((m) => String(m.id) === String(id));
    if (!target) return;

    let nextModules: ModuleItem[];
    if (target.showInMobileNavigation) {
      nextModules = modules.map((m) => {
        if (String(m.id) === String(id)) {
          return {
            ...m,
            showInMobileNavigation: false,
            showInMobileNavigationSortNumber: undefined,
          };
        }
        const remainingIdx = activeNavModules.findIndex(
          (nm) => String(nm.id) === String(m.id),
        );
        if (remainingIdx !== -1) {
          return { ...m, showInMobileNavigationSortNumber: remainingIdx };
        }
        return m;
      });
    } else {
      if (activeNavModules.length >= 3) return;
      const newSortNumber = activeNavModules.length;
      nextModules = modules.map((m) => {
        if (String(m.id) === String(id)) {
          return {
            ...m,
            showInMobileNavigation: true,
            showInMobileNavigationSortNumber: newSortNumber,
          };
        }
        return m;
      });
    }
    void formik.setFieldValue("modules", nextModules);
  };

  const toggleWebNavigation = (id: string) => {
    if (userRole === "directory") return;
    const nextModules = modules.map((m) => {
      if (m.id !== id) return m;
      return { ...m, showInWebNavigation: !m.showInWebNavigation };
    });
    void formik.setFieldValue("modules", nextModules);
  };

  const changeCustomName = (id: string, value: string) => {
    const nextModules = modules.map((m) =>
      m.id === id ? { ...m, customName: value } : m,
    );
    void formik.setFieldValue("modules", nextModules);
  };

  const changeCustomIcon = (id: string, value: string) => {
    const nextModules = modules.map((m) =>
      m.id === id ? { ...m, customIcon: value, icon: value } : m,
    );
    void formik.setFieldValue("modules", nextModules);
  };

  const changeSubtitle = (id: string, value: string) => {
    const nextModules = modules.map((m) =>
      m.id === id ? { ...m, subtitle: value } : m,
    );
    void formik.setFieldValue("modules", nextModules);
  };

  const navigationModules = useMemo(() => {
    return modules
      .filter((m) => m.showInMobileNavigation)
      .sort(
        (a, b) =>
          (a.showInMobileNavigationSortNumber ?? 0) -
          (b.showInMobileNavigationSortNumber ?? 0),
      );
  }, [modules]);

  const onDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }
    const navModules = Array.from(navigationModules);
    const [removed] = navModules.splice(result.source.index, 1);
    if (!removed) return;
    navModules.splice(result.destination.index, 0, removed);
    const nextModules = modules.map((m) => {
      const idx = navModules.findIndex(
        (nm) => String(nm.id) === String(m.id),
      );
      return idx !== -1 ? { ...m, showInMobileNavigationSortNumber: idx } : m;
    });
    void formik.setFieldValue("modules", nextModules);
  };

  const moveNavigationModule = (id: string, direction: "up" | "down") => {
    const navModules = Array.from(navigationModules);
    const currentIndex = navModules.findIndex(
      (nm) => String(nm.id) === String(id),
    );
    if (currentIndex === -1) return;
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= navModules.length) return;

    const [moved] = navModules.splice(currentIndex, 1);
    if (!moved) return;
    navModules.splice(targetIndex, 0, moved);

    const nextModules = modules.map((m) => {
      const idx = navModules.findIndex(
        (nm) => String(nm.id) === String(m.id),
      );
      return idx !== -1 ? { ...m, showInMobileNavigationSortNumber: idx } : m;
    });
    void formik.setFieldValue("modules", nextModules);
  };

  const webNavigationModules = useMemo(() => {
    return modules
      .filter((m) => m.showInWebNavigation)
      .sort(
        (a, b) =>
          (a.showInWebNavigationSortNumber ?? 0) -
          (b.showInWebNavigationSortNumber ?? 0),
      );
  }, [modules]);

  const onDragEndWeb = (result: DropResult) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }
    const navModules = Array.from(webNavigationModules);
    const [removed] = navModules.splice(result.source.index, 1);
    if (!removed) return;
    navModules.splice(result.destination.index, 0, removed);
    const nextModules = modules.map((m) => {
      const idx = navModules.findIndex(
        (nm) => String(nm.id) === String(m.id),
      );
      return idx !== -1 ? { ...m, showInWebNavigationSortNumber: idx } : m;
    });
    void formik.setFieldValue("modules", nextModules);
  };

  const saveChanges = async () => {
    await formik.submitForm();
  };

  const filteredModules = useMemo(() => {
    return modules
      .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const webNavDiff =
          (a.showInWebNavigationSortNumber ?? 999) -
          (b.showInWebNavigationSortNumber ?? 999);
        if (webNavDiff !== 0) return webNavDiff;

        if (a.isPopular !== b.isPopular) return a.isPopular ? -1 : 1;

        return (
          (a.showInMobileNavigationSortNumber ?? 999) -
          (b.showInMobileNavigationSortNumber ?? 999)
        );
      });
  }, [modules, searchTerm]);

  const enabledCount = useMemo(
    () => modules.filter((m) => m.enabled).length,
    [modules],
  );
  const navCount = useMemo(
    () => modules.filter((m) => m.showInMobileNavigation).length,
    [modules],
  );
  const webNavCount = useMemo(
    () => modules.filter((m) => m.showInWebNavigation).length,
    [modules],
  );
  const publicCount = useMemo(
    () => modules.filter((m) => m.isPublicFacing).length,
    [modules],
  );
  const internalCount = useMemo(
    () => modules.filter((m) => !m.isPublicFacing).length,
    [modules],
  );

  const value: ModulesContextType = {
    formik,
    modules,
    originalModules: formik.initialValues.modules,
    filteredModules,
    navigationModules,
    webNavigationModules,
    searchTerm,
    setSearchTerm,
    userRole,
    publicCount,
    internalCount,
    enabledCount,
    navCount,
    webNavCount,
    hideMenuMobile,
    setHideMenuMobile,
    saving: formik.isSubmitting,
    saved,
    hasChanged,
    loading,
    error: (error as Error) || null,
    notification,
    setNotification,
    showExportModal,
    setShowExportModal,
    toggleModule,
    togglePopular,
    toggleNavigation,
    toggleWebNavigation,
    changeCustomName,
    changeCustomIcon,
    changeSubtitle,
    moveNavigationModule,
    onDragEnd,
    onDragEndWeb,
    saveChanges,
    onReset,
  };

  return (
    <FormikProvider value={formik}>
      <ModulesContext.Provider value={value}>
        {children}
      </ModulesContext.Provider>
    </FormikProvider>
  );
}

export function useModulesContext() {
  const context = useContext(ModulesContext);
  if (!context) {
    throw new Error("useModulesContext must be used within a ModulesProvider");
  }
  return context;
}

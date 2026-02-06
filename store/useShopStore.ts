import { create } from "zustand";

export interface OptionValue {
  id: string;
  value: string;
}

export interface ProductOption {
  id: string;
  name: string;
  values: OptionValue[];
}

export interface Variant {
  id: string;
  title: string;
  price: string;
  sku: string;
  inventory: number;
  externalLink?: string;
  image?: string;
  isOutOfStock?: boolean;
  options: Record<string, string>;
}

interface ShopState {
  variants: Variant[];
  options: ProductOption[];
  hasVariants: boolean;

  setVariants: (variants: Variant[]) => void;
  setOptions: (options: ProductOption[]) => void;
  setHasVariants: (has: boolean) => void;

  // Helper actions
  addOption: (name: string) => void;
  removeOption: (id: string) => void;
  addValueToOption: (optionId: string, value: string) => void;
  removeValueFromOption: (optionId: string, valueId: string) => void;
  updateOptionValue: (
    optionId: string,
    valueId: string,
    newValue: string,
  ) => void; // New Action
  updateVariant: (id: string, field: keyof Variant, value: any) => void;
  batchUpdateVariants: (field: keyof Variant, value: any) => void;
  applyLinkToAllVariants: (link: string) => void;

  generateVariants: (basePrice: string, baseLink?: string) => void;

  reset: () => void;
}

export const useShopStore = create<ShopState>((set, get) => ({
  variants: [],
  options: [],
  hasVariants: false,

  setVariants: (variants) => set({ variants }),
  setOptions: (options) => {
    // Normalize options if they come in as simple strings from backend
    const normalized = options.map((opt: any) => ({
      id: opt.id || Math.random().toString(36).substr(2, 9),
      name: opt.name,
      values: (opt.values || []).map((val: any) =>
        typeof val === "string"
          ? { id: Math.random().toString(36).substr(2, 9), value: val }
          : val,
      ),
    }));
    set({ options: normalized });
  },
  setHasVariants: (hasVariants) => set({ hasVariants }),

  addOption: (name) => {
    const newOption: ProductOption = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      values: [],
    };
    set((state) => ({ options: [...state.options, newOption] }));
  },

  removeOption: (id) => {
    set((state) => ({ options: state.options.filter((o) => o.id !== id) }));
  },

  addValueToOption: (optionId, value) => {
    set((state) => {
      const updatedOptions = state.options.map((opt) => {
        if (opt.id === optionId) {
          if (opt.values.find((v) => v.value === value)) return opt;
          return {
            ...opt,
            values: [
              ...opt.values,
              { id: Math.random().toString(36).substr(2, 9), value },
            ],
          };
        }
        return opt;
      });
      return { options: updatedOptions };
    });
  },

  removeValueFromOption: (optionId, valueId) => {
    set((state) => ({
      options: state.options.map((opt) => {
        if (opt.id === optionId) {
          return {
            ...opt,
            values: opt.values.filter((v) => v.id !== valueId),
          };
        }
        return opt;
      }),
    }));
  },

  updateOptionValue: (optionId, valueId, newValue) => {
    const { options, variants } = get();

    // 1. Find the old value
    const option = options.find((o) => o.id === optionId);
    if (!option) return;
    const valueObj = option.values.find((v) => v.id === valueId);
    if (!valueObj) return;
    const oldValue = valueObj.value;

    if (oldValue === newValue) return;

    // 2. Update Options
    const updatedOptions = options.map((opt) => {
      if (opt.id === optionId) {
        return {
          ...opt,
          values: opt.values.map((v) =>
            v.id === valueId ? { ...v, value: newValue } : v,
          ),
        };
      }
      return opt;
    });

    // 3. Update Variants that used this value
    const updatedVariants = variants.map((v) => {
      if (v.options[option.name] === oldValue) {
        const newOptions = { ...v.options, [option.name]: newValue };
        const newTitle = Object.values(newOptions).join(" / ");

        // Also update auto-sku parts if possible?
        // For now, let's keep SKU as is unless user explicitly regenerates, OR smart update it.
        // Let's smart update SKU parts if they match the old value.
        // E.g. SKU was "SHIRT-RED" and oldValue was "Red".
        // This is risky. Let's just update title and options map.

        return {
          ...v,
          title: newTitle,
          options: newOptions,
        };
      }
      return v;
    });

    set({ options: updatedOptions, variants: updatedVariants });
  },

  updateVariant: (id, field, value) => {
    set((state) => ({
      variants: state.variants.map((v) =>
        v.id === id ? { ...v, [field]: value } : v,
      ),
    }));
  },

  batchUpdateVariants: (field, value) => {
    set((state) => ({
      variants: state.variants.map((v) => ({ ...v, [field]: value })),
    }));
  },

  applyLinkToAllVariants: (link) => {
    set((state) => ({
      variants: state.variants.map((v) => ({ ...v, externalLink: link })),
    }));
  },

  generateVariants: (basePrice, baseLink) => {
    const { options, variants } = get();

    if (options.length === 0) {
      if (variants.length > 0) set({ variants: [] });
      return;
    }

    const generateCombinations = (
      optionIndex: number,
      currentCombination: Record<string, string>,
    ): Record<string, string>[] => {
      if (optionIndex === options.length) {
        return [currentCombination];
      }

      const option = options[optionIndex];
      if (option.values.length === 0) {
        return generateCombinations(optionIndex + 1, currentCombination);
      }

      let combinations: Record<string, string>[] = [];
      for (const val of option.values) {
        combinations = [
          ...combinations,
          ...generateCombinations(optionIndex + 1, {
            ...currentCombination,
            [option.name]: val.value,
          }),
        ];
      }
      return combinations;
    };

    const combinations = generateCombinations(0, {});

    const newVariants: Variant[] = combinations.map((combo) => {
      const title = Object.values(combo).join(" / ");
      const existing = variants.find((v) => v.title === title);

      // Auto-generate SKU from combination values
      // e.g. "Red / XL" -> "RED-XL"
      const autoSku = Object.values(combo)
        .join("-")
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, "");

      return (
        existing || {
          id: Math.random().toString(36).substr(2, 9),
          title,
          price: basePrice || "0",
          sku: autoSku,
          inventory: 0,
          externalLink: baseLink || "",
          options: combo,
        }
      );
    });

    set({ variants: newVariants });
  },

  reset: () => set({ variants: [], options: [], hasVariants: false }),
}));

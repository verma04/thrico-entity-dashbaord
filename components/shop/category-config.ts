export type VariantPreset = {
  name: string;
  values: string[];
};

export type CategoryConfig = {
  presets: VariantPreset[];
  hasColor?: boolean;
};

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  clothing: {
    presets: [
      { name: "Size", values: ["XS", "S", "M", "L", "XL", "XXL"] },
      { name: "Color", values: ["Black", "White", "Red", "Blue", "Green"] },
    ],
    hasColor: true,
  },
  electronics: {
    presets: [
      { name: "Color", values: ["Black", "Silver", "Space Gray"] },
      { name: "Storage", values: ["64GB", "128GB", "256GB", "512GB", "1TB"] },
    ],
  },
  digital: {
    presets: [
      { name: "License", values: ["Standard", "Commercial", "Extended"] },
    ],
  },
  merch: {
    presets: [
      { name: "Size", values: ["One Size"] },
      { name: "Color", values: ["Black", "White"] },
    ],
  },
  services: {
    presets: [
      {
        name: "Duration",
        values: ["1 Hour", "2 Hours", "Half Day", "Full Day"],
      },
      { name: "Level", values: ["Basic", "Premium", "Enterprise"] },
    ],
  },
};

export const COMMON_OPTIONS = [
  "Size",
  "Color",
  "Material",
  "Style",
  "Storage",
  "Memory",
  "License",
  "Duration",
];

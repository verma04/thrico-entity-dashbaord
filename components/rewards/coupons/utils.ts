import {
  Sparkles,
  RotateCw,
  Gamepad2,
  Ticket,
  ShoppingBag,
  Gift,
} from "lucide-react";

export function getMechanismBadge(mechanism: string) {
  if (mechanism === "DIGITAL_GIFT_CARD" || mechanism === "GIFT_CARD")
    return {
      label: "Digital Gift Card",
      icon: Gift,
      color: "bg-violet-600 text-white",
      chip: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800",
      variant: "purple" as const,
    };

  if (mechanism === "STORE_DISCOUNT" || mechanism === "ECOMMERCE" || mechanism === "SHOPIFY_DISCOUNT")
    return {
      label: "Store Discount",
      icon: ShoppingBag,
      color: "bg-indigo-600 text-white",
      chip: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      variant: "indigo" as const,
    };

  if (mechanism === "INTERNAL_VOUCHER" || mechanism === "INTERNAL" || mechanism === "MANUAL_COUPON")
    return {
      label: "Internal Voucher",
      icon: Ticket,
      color: "bg-emerald-600 text-white",
      chip: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      variant: "emerald" as const,
    };

  if (mechanism === "SCRATCH_CARD")
    return {
      label: "Scratch",
      icon: Sparkles,
      color: "bg-amber-500 text-white",
      chip: "bg-amber-50 text-amber-700 border-amber-100",
      variant: "amber" as const,
    };

  if (mechanism === "SPIN_WHEEL")
    return {
      label: "Spin Wheel",
      icon: RotateCw,
      color: "bg-violet-500 text-white",
      chip: "bg-violet-50 text-violet-700 border-violet-100",
      variant: "purple" as const,
    };

  if (mechanism === "MATCH_AND_WIN")
    return {
      label: "Match & Win",
      icon: Gamepad2,
      color: "bg-rose-500 text-white",
      chip: "bg-rose-50 text-rose-700 border-rose-100",
      variant: "rose" as const,
    };

  return {
    label: "Coupon",
    icon: Ticket,
    color: "bg-indigo-500 text-white",
    chip: "bg-indigo-50 text-indigo-700 border-indigo-100",
    variant: "indigo" as const,
  };
}

import { Sparkles, RotateCw, Gamepad2, Ticket } from "lucide-react";

export function getMechanismBadge(mechanism: string) {
  if (mechanism === "SCRATCH_CARD")
    return {
      label: "Scratch",
      icon: Sparkles,
      color: "bg-amber-500 text-white",
      chip: "bg-amber-50 text-amber-700 border-amber-100",
    };
  if (mechanism === "SPIN_WHEEL")
    return {
      label: "Spin Wheel",
      icon: RotateCw,
      color: "bg-violet-500 text-white",
      chip: "bg-violet-50 text-violet-700 border-violet-100",
    };
  if (mechanism === "MATCH_AND_WIN")
    return {
      label: "Match & Win",
      icon: Gamepad2,
      color: "bg-rose-500 text-white",
      chip: "bg-rose-50 text-rose-700 border-rose-100",
    };
  return {
    label: "Coupon",
    icon: Ticket,
    color: "bg-indigo-500 text-white",
    chip: "bg-indigo-50 text-indigo-700 border-indigo-100",
  };
}

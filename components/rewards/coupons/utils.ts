import { Zap, RotateCw, Gamepad2, Ticket } from "lucide-react";

export function getInteractionType(category: string) {
  if (["cat-005", "Scratch Card"].includes(category)) return "Scratch";
  if (["cat-006", "Spin Wheel"].includes(category)) return "Spin";
  if (["cat-007", "Match & Win"].includes(category)) return "Match";
  return "Standard";
}

export function getInteractiveBadge(type: string) {
  if (type === "Scratch")
    return {
      label: "Scratch",
      icon: Zap,
      color: "bg-amber-500 text-white",
      chip: "bg-amber-50 text-amber-700 border-amber-100",
    };
  if (type === "Spin")
    return {
      label: "Spin Wheel",
      icon: RotateCw,
      color: "bg-indigo-500 text-white",
      chip: "bg-indigo-50 text-indigo-700 border-indigo-100",
    };
  if (type === "Match")
    return {
      label: "Match & Win",
      icon: Gamepad2,
      color: "bg-rose-500 text-white",
      chip: "bg-rose-50 text-rose-700 border-rose-100",
    };
  return {
    label: "Standard",
    icon: Ticket,
    color: "bg-slate-500 text-white",
    chip: "bg-slate-50 text-slate-600 border-slate-200",
  };
}

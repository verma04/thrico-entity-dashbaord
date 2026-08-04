"use client";

import * as React from "react";
import {
  CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  ArrowRight,
} from "lucide-react";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfQuarter,
  endOfQuarter,
  subMonths,
  subQuarters,
  subYears,
  parse,
  isValid,
  differenceInCalendarDays,
  addMonths,
  getYear,
  getMonth,
  setMonth,
  setYear,
  isAfter,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DateRangePreset {
  label: string;
  value: string;
  group?: string;
  getRange?: () => DateRange;
}

export interface DateRangePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  presets?: DateRangePreset[];
  defaultValue?: string;
  align?: "start" | "center" | "end";
  placeholder?: string;
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
}

// ─── Default Presets (all 15 options) ────────────────────────────────────────

const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: "Today",
    value: "TODAY",
    group: "Days",
    getRange: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }),
  },
  {
    label: "Yesterday",
    value: "YESTERDAY",
    group: "Days",
    getRange: () => {
      const y = subDays(new Date(), 1);
      return { from: startOfDay(y), to: endOfDay(y) };
    },
  },
  {
    label: "Last 7 days",
    value: "LAST_7_DAYS",
    group: "Days",
    getRange: () => ({ from: subDays(new Date(), 6), to: new Date() }),
  },
  {
    label: "Last 14 days",
    value: "LAST_14_DAYS",
    group: "Days",
    getRange: () => ({ from: subDays(new Date(), 13), to: new Date() }),
  },
  {
    label: "Last 30 days",
    value: "LAST_30_DAYS",
    group: "Days",
    getRange: () => ({ from: subDays(new Date(), 29), to: new Date() }),
  },
  {
    label: "This week",
    value: "THIS_WEEK",
    group: "Weeks",
    getRange: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "Last week",
    value: "LAST_WEEK",
    group: "Weeks",
    getRange: () => {
      const lw = subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 7);
      return { from: lw, to: endOfWeek(lw, { weekStartsOn: 1 }) };
    },
  },
  {
    label: "This month",
    value: "THIS_MONTH",
    group: "Months",
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last month",
    value: "LAST_MONTH",
    group: "Months",
    getRange: () => {
      const lm = subMonths(new Date(), 1);
      return { from: startOfMonth(lm), to: endOfMonth(lm) };
    },
  },
  {
    label: "Last 3 months",
    value: "LAST_3_MONTHS",
    group: "Months",
    getRange: () => ({ from: subMonths(new Date(), 3), to: new Date() }),
  },
  {
    label: "This quarter",
    value: "THIS_QUARTER",
    group: "Quarters",
    getRange: () => ({
      from: startOfQuarter(new Date()),
      to: endOfQuarter(new Date()),
    }),
  },
  {
    label: "Last quarter",
    value: "LAST_QUARTER",
    group: "Quarters",
    getRange: () => {
      const lq = subQuarters(new Date(), 1);
      return { from: startOfQuarter(lq), to: endOfQuarter(lq) };
    },
  },
  {
    label: "This year",
    value: "THIS_YEAR",
    group: "Years",
    getRange: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
  },
  {
    label: "Last year",
    value: "LAST_YEAR",
    group: "Years",
    getRange: () => {
      const ly = subYears(new Date(), 1);
      return { from: startOfYear(ly), to: endOfYear(ly) };
    },
  },
  {
    label: "Last 12 months",
    value: "LAST_12_MONTHS",
    group: "Years",
    getRange: () => ({ from: subDays(new Date(), 364), to: new Date() }),
  },
  { label: "Custom range", value: "CUSTOM", group: "Custom" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseFlexibleDate(value: string): Date | null {
  const fmts = [
    "MMM d, yyyy",
    "M/d/yyyy",
    "MM/dd/yyyy",
    "yyyy-MM-dd",
    "d MMM yyyy",
    "MMMM d, yyyy",
  ];
  for (const f of fmts) {
    const p = parse(value.trim(), f, new Date());
    if (isValid(p)) return p;
  }
  return null;
}

function groupBy(presets: DateRangePreset[]) {
  const map: Record<string, DateRangePreset[]> = {};
  for (const p of presets) {
    const g = p.group ?? "Other";
    if (!map[g]) map[g] = [];
    map[g].push(p);
  }
  return map;
}

// ─── Month/Year Overlay ───────────────────────────────────────────────────────

function MonthYearOverlay({
  currentMonth,
  onChange,
  onClose,
}: {
  currentMonth: Date;
  onChange: (d: Date) => void;
  onClose: () => void;
}) {
  const [viewYear, setViewYear] = React.useState(getYear(currentMonth));
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.14 }}
      className="absolute inset-0 z-30 bg-popover/98 backdrop-blur-sm rounded-xl p-3 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => setViewYear((y) => y - 1)}
          className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="text-xs font-bold">{viewYear}</span>
        <button
          onClick={() => setViewYear((y) => y + 1)}
          disabled={viewYear >= getYear(new Date()) + 1}
          className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors disabled:opacity-30"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {MONTHS.map((m, i) => {
          const target = setYear(setMonth(new Date(), i), viewYear);
          const isSel = getMonth(currentMonth) === i && getYear(currentMonth) === viewYear;
          const isDisabled = isAfter(target, new Date());
          return (
            <button
              key={m}
              disabled={isDisabled}
              onClick={() => { onChange(target); onClose(); }}
              className={cn(
                "py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                isSel ? "bg-foreground text-background" :
                isDisabled ? "text-muted-foreground/25 cursor-not-allowed" :
                "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {m}
            </button>
          );
        })}
      </div>
      <button
        onClick={onClose}
        className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors mt-auto pt-1 border-t border-border/40"
      >
        ← Back to calendar
      </button>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DateRangePicker({
  className,
  date,
  onDateChange,
  presets = DEFAULT_PRESETS,
  defaultValue = "LAST_7_DAYS",
  align = "start",
  placeholder = "Pick a date range",
  disabled = false,
  maxDate,
  minDate,
}: DateRangePickerProps) {
  // ── State ──────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] = React.useState<string>(defaultValue);
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date);
  const [isCustomMode, setIsCustomMode] = React.useState(false);
  const [showMonthNav, setShowMonthNav] = React.useState(false);
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(
    date?.from ?? new Date()
  );

  const [fromValue, setFromValue] = React.useState("");
  const [toValue, setToValue] = React.useState("");
  const [isFromFocused, setIsFromFocused] = React.useState(false);
  const [isToFocused, setIsToFocused] = React.useState(false);
  const [flash, setFlash] = React.useState<string | null>(null);

  const fromRef = React.useRef<HTMLInputElement>(null);

  // ── Derived ────────────────────────────────────────────────────────────
  const normalizeRange = React.useCallback((r: DateRange | undefined) => {
    if (!r?.from || !r?.to) return r;
    return r.from <= r.to ? r : { from: r.to, to: r.from };
  }, []);

  const invalidRange = !!tempDate?.from && !!tempDate?.to && tempDate.from > tempDate.to;
  const canApply = !!tempDate?.from && !!tempDate?.to && !invalidRange;

  const dayCount =
    date?.from && date?.to
      ? Math.max(1, differenceInCalendarDays(date.to, date.from) + 1)
      : null;

  const activeLabel =
    presets.find((p) => p.value === selectedPreset)?.label ?? "Custom range";

  const grouped = React.useMemo(() => groupBy(presets), [presets]);

  const summary = React.useMemo(() => {
    if (!tempDate?.from) return "Select a start date";
    if (!tempDate?.to) return "Then select an end date";
    const d = differenceInCalendarDays(tempDate.to, tempDate.from) + 1;
    return `${d} day${d !== 1 ? "s" : ""} selected`;
  }, [tempDate]);

  // ── Effects ────────────────────────────────────────────────────────────
  React.useEffect(() => { setTempDate(date); }, [date]);

  React.useEffect(() => {
    if (isOpen) {
      setTempDate(date);
      setIsCustomMode(selectedPreset === "CUSTOM");
      if (date?.from) setCalendarMonth(date.from);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  React.useEffect(() => {
    if (!isFromFocused)
      setFromValue(tempDate?.from ? format(tempDate.from, "MMM d, yyyy") : "");
  }, [tempDate?.from, isFromFocused]);

  React.useEffect(() => {
    if (!isToFocused)
      setToValue(tempDate?.to ? format(tempDate.to, "MMM d, yyyy") : "");
  }, [tempDate?.to, isToFocused]);

  React.useEffect(() => {
    if (flash) {
      const t = setTimeout(() => setFlash(null), 700);
      return () => clearTimeout(t);
    }
  }, [flash]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handlePreset = (preset: DateRangePreset) => {
    if (preset.value === "CUSTOM") {
      setSelectedPreset("CUSTOM");
      setIsCustomMode(true);
      setTimeout(() => fromRef.current?.focus(), 80);
      return;
    }
    if (!preset.getRange) return;
    const r = preset.getRange();
    setSelectedPreset(preset.value);
    setIsCustomMode(false);
    setTempDate(r);
    setFlash(preset.value);
    onDateChange?.(r);
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleApply = () => {
    const r = normalizeRange(tempDate);
    if (!r?.from || !r?.to) return;
    onDateChange?.(r);
    setTempDate(r);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempDate(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateChange?.(undefined);
    setTempDate(undefined);
    setSelectedPreset(defaultValue);
    setIsCustomMode(false);
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
    const p = parseFlexibleDate(e.target.value);
    if (p) { setTempDate((prev) => ({ from: p, to: prev?.to })); setSelectedPreset("CUSTOM"); setIsCustomMode(true); }
  };

  const handleFromBlur = () => {
    setIsFromFocused(false);
    const p = parseFlexibleDate(fromValue);
    if (p) {
      setTempDate((prev) => normalizeRange({ from: p, to: prev?.to }));
      setFromValue(format(p, "MMM d, yyyy"));
    } else if (tempDate?.from) setFromValue(format(tempDate.from, "MMM d, yyyy"));
    else setFromValue("");
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToValue(e.target.value);
    const p = parseFlexibleDate(e.target.value);
    if (p) { setTempDate((prev) => ({ from: prev?.from, to: p })); setSelectedPreset("CUSTOM"); setIsCustomMode(true); }
  };

  const handleToBlur = () => {
    setIsToFocused(false);
    const p = parseFlexibleDate(toValue);
    if (p) {
      setTempDate((prev) => normalizeRange({ from: prev?.from, to: p }));
      setToValue(format(p, "MMM d, yyyy"));
    } else if (tempDate?.to) setToValue(format(tempDate.to, "MMM d, yyyy"));
    else setToValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canApply && isCustomMode) { e.preventDefault(); handleApply(); }
    if (e.key === "Escape") { e.preventDefault(); showMonthNav ? setShowMonthNav(false) : handleCancel(); }
  };

  // ── Trigger label ──────────────────────────────────────────────────────
  const triggerLabel = date?.from
    ? date.to
      ? `${format(date.from, "MMM d")} – ${format(date.to, "MMM d, yyyy")}`
      : format(date.from, "MMM d, yyyy")
    : placeholder;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={disabled ? undefined : setIsOpen}>
        {/* ── Trigger ─────────────────────────────────────────────── */}
        <PopoverTrigger asChild>
          <Button
            id="date-range-trigger"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-8 w-fit min-w-[200px] justify-start text-left font-medium bg-card border-border rounded-lg text-[11px] gap-1.5 group relative overflow-hidden pr-2 pl-2",
              !date && "text-muted-foreground",
              isOpen && "border-foreground/20 shadow-sm ring-1 ring-foreground/5"
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-foreground/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <motion.div
              animate={{ rotate: isOpen ? 10 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center w-5 h-5 rounded-md bg-muted group-hover:bg-accent transition-colors flex-shrink-0"
            >
              <CalendarIcon className="h-3 w-3 text-foreground/60" />
            </motion.div>

            <span className="flex-1 truncate tracking-tight">{triggerLabel}</span>

            <div className="flex items-center gap-1 flex-shrink-0">
              <AnimatePresence>
                {dayCount && (
                  <motion.span
                    key="badge"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground"
                  >
                    {dayCount}d
                  </motion.span>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {date && (
                  <motion.button
                    key="clear"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    onClick={handleClear}
                    className="h-5 w-5 flex items-center justify-center rounded-md hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </motion.button>
                )}
              </AnimatePresence>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ChevronDown className="h-3.5 w-3.5 opacity-35 ml-0.5" />
              </motion.div>
            </div>
          </Button>
        </PopoverTrigger>

        {/* ── Dropdown ─────────────────────────────────────────────── */}
        <PopoverContent
          className="p-0 border-border shadow-2xl rounded-2xl overflow-hidden glass-card"
          style={{ width: "var(--drp-w, 620px)" }}
          align={align}
          sideOffset={6}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Preset Chips Bar ─────────────────────────────── */}
            <div className="px-3 pt-3 pb-2 border-b border-border/60 bg-muted/10">
              <div className="flex flex-col gap-2">
                {Object.entries(grouped).map(([group, items]) => {
                  if (group === "Custom") return null;
                  return (
                    <motion.div
                      key={group}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 w-14 flex-shrink-0 text-right">
                        {group}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {items.map((preset, i) => {
                          const isActive = selectedPreset === preset.value;
                          const justFlashed = flash === preset.value;
                          return (
                            <motion.button
                              key={preset.value}
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.03, duration: 0.14 }}
                              whileTap={{ scale: 0.94 }}
                              onClick={() => handlePreset(preset)}
                              className={cn(
                                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 border",
                                isActive
                                  ? "bg-foreground text-background border-foreground shadow-sm"
                                  : "bg-background/60 border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-muted/60",
                                justFlashed && "ring-2 ring-emerald-400/50"
                              )}
                            >
                              <AnimatePresence>
                                {isActive && (
                                  <motion.span
                                    initial={{ scale: 0, opacity: 0, width: 0 }}
                                    animate={{ scale: 1, opacity: 1, width: "auto" }}
                                    exit={{ scale: 0, opacity: 0, width: 0 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <Check className="h-2.5 w-2.5" />
                                  </motion.span>
                                )}
                              </AnimatePresence>
                              {preset.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Custom range chip */}
                {grouped["Custom"]?.map((preset) => {
                  const isActive = selectedPreset === "CUSTOM";
                  return (
                    <div key={preset.value} className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 w-14 flex-shrink-0 text-right">
                        Custom
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={() => handlePreset(preset)}
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-150 border",
                          isActive
                            ? "bg-foreground/8 border-foreground/30 text-foreground"
                            : "bg-background/60 border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-muted/60"
                        )}
                      >
                        {preset.label}
                        <ArrowRight className="h-2.5 w-2.5" />
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Manual Date Inputs (custom mode) ─────────────── */}
            <AnimatePresence initial={false}>
              {isCustomMode && (
                <motion.div
                  key="inputs"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-3 py-2.5 bg-muted/5 border-b border-border/60 flex items-end gap-2.5">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ml-0.5">
                        From
                      </label>
                      <div className="relative">
                        <Input
                          ref={fromRef}
                          id="drp-from"
                          className={cn(
                            "h-8 text-xs pl-7 bg-background border-border transition-all",
                            "focus-visible:ring-1 focus-visible:ring-foreground/20",
                            tempDate?.from && !tempDate?.to && "ring-1 ring-primary/30 border-primary/30"
                          )}
                          value={fromValue}
                          onChange={handleFromChange}
                          onFocus={() => setIsFromFocused(true)}
                          onBlur={handleFromBlur}
                          placeholder="Jan 1, 2025"
                        />
                        <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/40" />
                      </div>
                    </div>
                    <div className="pb-[9px] text-muted-foreground/30 select-none text-base leading-none">→</div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider ml-0.5">
                        To
                      </label>
                      <div className="relative">
                        <Input
                          id="drp-to"
                          className={cn(
                            "h-8 text-xs pl-7 bg-background border-border transition-all",
                            "focus-visible:ring-1 focus-visible:ring-foreground/20",
                            canApply && "ring-1 ring-primary/10"
                          )}
                          value={toValue}
                          onChange={handleToChange}
                          onFocus={() => setIsToFocused(true)}
                          onBlur={handleToBlur}
                          placeholder="Jan 31, 2025"
                        />
                        <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/40" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Calendar ─────────────────────────────────────── */}
            <div className="px-3 pt-2 pb-1 relative">
              <AnimatePresence>
                {showMonthNav && (
                  <MonthYearOverlay
                    currentMonth={calendarMonth}
                    onChange={setCalendarMonth}
                    onClose={() => setShowMonthNav(false)}
                  />
                )}
              </AnimatePresence>

              <Calendar
                initialFocus
                mode="range"
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                selected={tempDate}
                onSelect={(range) => {
                  setTempDate(normalizeRange(range));
                  setSelectedPreset("CUSTOM");
                  setIsCustomMode(true);
                }}
                numberOfMonths={2}
                disabled={[
                  { after: maxDate ?? new Date() },
                  ...(minDate ? [{ before: minDate }] : []),
                ]}
                classNames={{
                  months: "flex flex-row gap-6",
                  month: "space-y-1.5",
                  month_caption: "relative flex h-8 items-center justify-center",
                  nav: "absolute inset-x-0 top-1/2 -translate-y-1/2",
                  button_previous:
                    "absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md border border-border bg-background/80 p-0 hover:bg-muted hover:border-foreground/20 transition-all flex items-center justify-center",
                  button_next:
                    "absolute right-0 top-1/2 h-6 w-6 -translate-y-1/2 rounded-md border border-border bg-background/80 p-0 hover:bg-muted hover:border-foreground/20 transition-all flex items-center justify-center",
                  caption_label:
                    "text-xs font-bold text-foreground cursor-pointer hover:text-primary transition-colors select-none",
                  weekdays: "flex",
                  weekday:
                    "text-muted-foreground/40 w-8 font-semibold text-[9px] flex items-center justify-center h-7 uppercase tracking-widest",
                  week: "flex w-full",
                  month_grid: "w-full border-collapse",
                  selected:
                    "bg-foreground! text-background! font-bold",
                  range_start:
                    "bg-foreground! text-background! rounded-l-lg! font-bold",
                  range_end:
                    "bg-foreground! text-background! rounded-r-lg! font-bold",
                  range_middle:
                    "bg-foreground/8! text-foreground! hover:bg-foreground/12! rounded-none!",
                  day: "h-8 w-8 p-0 font-medium aria-selected:opacity-100 flex items-center justify-center transition-all duration-100 text-xs hover:bg-muted rounded-lg",
                  today:
                    "ring-1 ring-border font-bold text-foreground",
                  outside: "text-muted-foreground/25",
                  disabled: "text-muted-foreground/15 cursor-not-allowed",
                  hidden: "invisible",
                }}
              />
            </div>

            {/* ── Footer ───────────────────────────────────────── */}
            <div className="px-3 py-2.5 border-t border-border/60 bg-muted/5 flex items-center justify-between gap-3">
              <AnimatePresence mode="wait">
                {invalidRange ? (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-500 bg-rose-500/8 px-2 py-1 rounded-lg border border-rose-500/20"
                  >
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />
                    End date must be after start
                  </motion.div>
                ) : (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col min-w-0"
                  >
                    <span className="text-[11px] text-foreground/70 font-semibold truncate">
                      {isCustomMode ? summary : activeLabel}
                    </span>
                    <span className="text-[10px] text-muted-foreground/40">
                      {isCustomMode ? "↵ Apply · Esc Cancel" : "UTC timezone"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isCustomMode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 8 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-3 text-[11px] font-semibold hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className={cn(
                        "h-7 px-4 text-[11px] font-bold transition-all duration-200",
                        canApply ? "shadow-sm hover:shadow-md hover:scale-[1.02]" : "opacity-40 cursor-not-allowed"
                      )}
                      onClick={handleApply}
                      disabled={!canApply}
                    >
                      Apply
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

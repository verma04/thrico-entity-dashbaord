import * as React from "react";
import {
  CalendarIcon,
  Check,
  ChevronDown,
  LucideIcon,
  Target,
} from "lucide-react";
import {
  addDays,
  format,
  subDays,
  startOfDay,
  endOfDay,
  isSameDay,
  parse,
  isValid,
} from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  presets?: {
    label: string;
    value: string;
    days?: number;
    icon?: LucideIcon;
  }[];
  defaultValue?: string;
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
  presets = [
    { label: "Today", value: "TODAY", days: 0 },
    { label: "Yesterday", value: "YESTERDAY", days: 1 },
    { label: "Last 7 days", value: "LAST_7_DAYS", days: 7 },
    { label: "Last 30 days", value: "LAST_30_DAYS", days: 30 },
    { label: "Last 90 days", value: "LAST_90_DAYS", days: 90 },
    { label: "Last 12 months", value: "LAST_12_MONTHS", days: 365 },
    { label: "Custom Range", value: "CUSTOM" },
  ],
  defaultValue = "LAST_7_DAYS",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedPreset, setSelectedPreset] =
    React.useState<string>(defaultValue);
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date);

  const [fromValue, setFromValue] = React.useState("");
  const [toValue, setToValue] = React.useState("");
  const [isFromFocused, setIsFromFocused] = React.useState(false);
  const [isToFocused, setIsToFocused] = React.useState(false);

  React.useEffect(() => {
    setTempDate(date);
  }, [date]);

  React.useEffect(() => {
    if (!isFromFocused) {
      if (tempDate?.from) {
        setFromValue(format(tempDate.from, "MMM d, yyyy"));
      } else {
        setFromValue("");
      }
    }
  }, [tempDate?.from, isFromFocused]);

  React.useEffect(() => {
    if (!isToFocused) {
      if (tempDate?.to) {
        setToValue(format(tempDate.to, "MMM d, yyyy"));
      } else {
        setToValue("");
      }
    }
  }, [tempDate?.to, isToFocused]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
    const parsedDate = parse(e.target.value, "MMM d, yyyy", new Date());
    if (isValid(parsedDate)) {
      setTempDate((prev) => ({ from: parsedDate, to: prev?.to }));
      setSelectedPreset("CUSTOM");
    }
  };

  const handleFromBlur = () => {
    setIsFromFocused(false);
    const parsedDate = parse(fromValue, "MMM d, yyyy", new Date());
    if (isValid(parsedDate)) {
      setTempDate((prev) => ({ from: parsedDate, to: prev?.to }));
      setFromValue(format(parsedDate, "MMM d, yyyy"));
    } else if (tempDate?.from) {
      setFromValue(format(tempDate.from, "MMM d, yyyy"));
    } else {
      setFromValue("");
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToValue(e.target.value);
    const parsedDate = parse(e.target.value, "MMM d, yyyy", new Date());
    if (isValid(parsedDate)) {
      setTempDate((prev) => ({ from: prev?.from, to: parsedDate }));
      setSelectedPreset("CUSTOM");
    }
  };

  const handleToBlur = () => {
    setIsToFocused(false);
    const parsedDate = parse(toValue, "MMM d, yyyy", new Date());
    if (isValid(parsedDate)) {
      setTempDate((prev) => ({ from: prev?.from, to: parsedDate }));
      setToValue(format(parsedDate, "MMM d, yyyy"));
    } else if (tempDate?.to) {
      setToValue(format(tempDate.to, "MMM d, yyyy"));
    } else {
      setToValue("");
    }
  };

  const handlePresetSelect = (preset: (typeof presets)[0]) => {
    setSelectedPreset(preset.value);
    let newRange: DateRange | undefined;

    if (preset.value === "TODAY") {
      newRange = { from: startOfDay(new Date()), to: endOfDay(new Date()) };
    } else if (preset.value === "YESTERDAY") {
      const yesterday = subDays(new Date(), 1);
      newRange = { from: startOfDay(yesterday), to: endOfDay(yesterday) };
    } else if (preset.days !== undefined) {
      newRange = {
        from: subDays(new Date(), preset.days),
        to: new Date(),
      };
    } else {
      return;
    }
    setTempDate(newRange);
    onDateChange?.(newRange);
    setIsOpen(false);
  };

  const handleApply = () => {
    onDateChange?.(tempDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempDate(date);
    setIsOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-fit min-w-[260px] justify-start text-left font-medium bg-card border-border h-9 rounded-lg text-xs gap-3 group",
              !date && "text-muted-foreground",
            )}
          >
            <div className="flex items-center justify-center w-5 h-5 rounded-md bg-muted group-hover:bg-accent transition-colors">
              <CalendarIcon className="h-3 w-3 text-foreground/70" />
            </div>
            <span className="flex-1 truncate">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "MMM d, yyyy")} –{" "}
                    {format(date.to, "MMM d, yyyy")}
                  </>
                ) : (
                  format(date.from, "MMM d, yyyy")
                )
              ) : (
                "Pick a date"
              )}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 opacity-40 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-border shadow-2xl rounded-2xl overflow-hidden glass-card"
          align="start"
          sideOffset={8}
        >
          <div className="flex h-full min-h-[420px]">
            {/* Sidebar Presets - GA Style */}
            <div className="w-48 bg-muted/30 border-r border-border p-4 flex flex-col gap-1.5">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">
                Range Presets
              </h4>
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetSelect(preset)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                    selectedPreset === preset.value
                      ? "bg-foreground text-background shadow-md transform scale-[1.02]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {preset.label}
                  {selectedPreset === preset.value && (
                    <Check className="h-3 w-3" />
                  )}
                </button>
              ))}
            </div>

            {/* Calendar Main Section */}
            <div className="flex flex-col flex-1 bg-background/50">
              {/* Header with Inputs */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase ml-1">
                      From
                    </label>
                    <div className="relative group">
                      <Input
                        className="h-9 text-xs pl-8 bg-background border-border focus-visible:ring-primary/20"
                        value={fromValue}
                        onChange={handleFromChange}
                        onFocus={() => setIsFromFocused(true)}
                        onBlur={handleFromBlur}
                        placeholder="Jan 1, 2024"
                      />
                      <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <div className="mt-5 text-muted-foreground/30 font-light text-xl">
                    —
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase ml-1">
                      To
                    </label>
                    <div className="relative group">
                      <Input
                        className="h-9 text-xs pl-8 bg-background border-border focus-visible:ring-primary/20"
                        value={toValue}
                        onChange={handleToChange}
                        onFocus={() => setIsToFocused(true)}
                        onBlur={handleToBlur}
                        placeholder="Jan 31, 2024"
                      />
                      <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Wrapper */}
              <div className="p-4 flex-1 flex items-start justify-center overflow-x-auto min-w-[600px]">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={tempDate?.from || new Date()}
                  selected={tempDate}
                  onSelect={(range) => {
                    setTempDate(range);
                    setSelectedPreset("CUSTOM");
                  }}
                  numberOfMonths={2}
                  classNames={{
                    months: "flex flex-row gap-8",
                    month: "space-y-4",
                    caption_label: "text-sm font-semibold text-foreground",
                    selected: "bg-primary text-primary-foreground font-bold hover:bg-primary hover:text-primary-foreground",
                    range_start: "bg-primary text-primary-foreground rounded-l-lg",
                    range_end: "bg-primary text-primary-foreground rounded-r-lg",
                    range_middle: "bg-primary/10 text-primary hover:bg-primary/20",
                    day: "h-9 w-9 p-0 font-medium aria-selected:opacity-100 flex items-center justify-center transition-all duration-200",
                    today: "bg-muted text-foreground ring-1 ring-border relative font-bold",
                  }}
                />
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
                <div className="text-[10px] text-muted-foreground font-medium px-2 italic">
                  * All times are in UTC
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-semibold hover:bg-rose-500/10 hover:text-rose-600 transition-colors"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 px-6 text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                    onClick={handleApply}
                  >
                    Apply Range
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

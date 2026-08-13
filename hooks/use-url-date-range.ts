import { useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";

export function useUrlDateRange(defaultDays: number = 7) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize dates from URL or default
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const initialFrom = fromParam ? new Date(fromParam) : subDays(new Date(), defaultDays);
    const initialTo = toParam ? new Date(toParam) : new Date();

    const fromDate = !isNaN(initialFrom.getTime()) ? initialFrom : subDays(new Date(), defaultDays);
    const toDate = !isNaN(initialTo.getTime()) ? initialTo : new Date();

    return { from: fromDate, to: toDate };
  });

  const timeRange = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      const days = Math.round(
        (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (days <= 1) return "24h";
      if (days <= 7) return "7d";
      if (days <= 30) return "30d";
      return "90d";
    }
    return `${defaultDays}d`;
  }, [dateRange, defaultDays]);

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    
    const params = new URLSearchParams(searchParams.toString());

    if (range?.from && range?.to) {
      params.set("from", range.from.toISOString());
      params.set("to", range.to.toISOString());
    } else {
      params.delete("from");
      params.delete("to");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    dateRange,
    timeRange,
    handleDateChange,
  };
}

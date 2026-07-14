import { useState } from "react";
import { bdStandardTime, getFilteredDate } from "@/lib/dateUtils";

/** `null` means "no date params" (initial / unfiltered load). */
export type DateRange = { start: string; end: string } | null;

export interface UseAnalyticsFilters {
  filterType: string | undefined;
  setFilterType: (value: string) => void;
  startdate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  /** Derived date range the page feeds into its own fetch. */
  dateRange: DateRange;
  /** Applies the custom start/end pickers. */
  handleFilter: () => void;
}

/**
 * Owns the filter mechanics shared by every analytics page: the filter-type
 * dropdown, the custom date-range pickers, and the derived `dateRange`.
 *
 * The hook deliberately does NOT fetch — each page reads `dateRange` and builds
 * its own request, because the endpoints and response shapes differ.
 *
 * `onFilterChange` fires whenever the active filter changes; pass it to reset
 * page-dependent state (e.g. `() => setPage(1)`).
 */
export function useAnalyticsFilters(
  onFilterChange?: () => void,
): UseAnalyticsFilters {
  const [filterType, setFilterTypeState] = useState<string | undefined>();
  const [startdate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<DateRange>(null);

  const setFilterType = (value: string) => {
    setFilterTypeState(value);
    // "custom" waits for the date pickers + Submit (handleFilter).
    if (value === "custom") return;

    onFilterChange?.();
    if (value === "alltime") {
      setDateRange({ start: "all", end: "all" });
    } else if (value === "thisMonth") {
      setDateRange({ start: "", end: "" });
    } else {
      // lastMonth | lastThreeMonth | lastSixMonth
      setDateRange({
        start: getFilteredDate(value),
        end: getFilteredDate("today"),
      });
    }
  };

  const handleFilter = () => {
    if (!startdate || !endDate) return;
    onFilterChange?.();
    setDateRange({
      start: bdStandardTime(startdate),
      end: bdStandardTime(endDate),
    });
  };

  return {
    filterType,
    setFilterType,
    startdate,
    setStartDate,
    endDate,
    setEndDate,
    dateRange,
    handleFilter,
  };
}

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdsFiltering from "@/components/AdsFiltering";

interface AnalyticsFilterBarProps {
  filterType: string | undefined;
  setFilterType: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  handleFilter: () => void;
}

/**
 * Shared filter bar for the analytics pages: the range-type dropdown plus the
 * custom start/end date pickers (shown only when "Custom" is selected).
 * Pair with `useAnalyticsFilters`, which supplies all of these props.
 */
export default function AnalyticsFilterBar({
  filterType,
  setFilterType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleFilter,
}: AnalyticsFilterBarProps) {
  return (
    <div className="flex items-center justify-between flex-row mt-4">
      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
            <SelectItem value="lastThreeMonth">Last 3 Month</SelectItem>
            <SelectItem value="lastSixMonth">Last 6 Month</SelectItem>
            <SelectItem value="alltime">Alltime</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {filterType === "custom" && (
        <AdsFiltering
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          handleFilter={handleFilter}
        />
      )}
    </div>
  );
}

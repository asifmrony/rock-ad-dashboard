import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import axios from "axios";
import AdsFiltering from "@/components/AdsFiltering";
const apiUrl = process.env.REACT_APP_API_URL;

const LIMIT = 100;

type DateRange = { start: string; end: string } | null;

const MidrollAdsAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [allCreatives, setAllCreatives] = useState([]);
  const [pagination, setPagination] = useState({
    totalItem: 0,
    totalPages: 1,
    currentPage: 1,
    limit: LIMIT,
  });
  const [page, setPage] = useState(1);
  // Active date filter shared across page changes. `null` means no date params.
  const [dateRange, setDateRange] = useState<DateRange>(null);
  const [startdate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [filterType, setFilterType] = useState<string | undefined>();

  // Single source of truth for fetching: re-runs whenever the page or the
  // active date filter changes.
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(LIMIT));
        if (dateRange) {
          params.append("startdate", dateRange.start);
          params.append("enddate", dateRange.end);
        }
        const response = await axios.get(
          `${apiUrl}ads/fifa/analytics?${params.toString()}`,
        );
        setAllCreatives(response?.data?.data);
        if (response?.data?.pagination) {
          setPagination(response.data.pagination);
        }
      } catch (err) {
        console.log("Error fetching fifa analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [page, dateRange]);

  useEffect(() => {
    function getFilteredDate(dateRange: string) {
      const currentDate = new Date();
      // Subtract 3 months
      if (dateRange === "lastMonth") {
        currentDate.setMonth(currentDate.getMonth() - 1);
      } else if (dateRange === "lastThreeMonth") {
        currentDate.setMonth(currentDate.getMonth() - 3);
      } else if (dateRange === "lastSixMonth") {
        currentDate.setMonth(currentDate.getMonth() - 6);
      }

      // Format the date as yyyy-mm-dd
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(currentDate.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    if (filterType && filterType !== "custom") {
      // Any filter change starts over from the first page.
      setPage(1);
      if (filterType === "alltime") {
        setDateRange({ start: "all", end: "all" });
      } else if (filterType === "thisMonth") {
        setDateRange({ start: "", end: "" });
      } else {
        // only last 1 | 3 | 6 Months based api
        setDateRange({
          start: getFilteredDate(filterType),
          end: getFilteredDate("today"),
        });
      }
    }
  }, [filterType]);

  const bdStandardTime = (pickedDate: Date) => {
    const convertedDate = new Date(pickedDate);
    // Get the offset in milliseconds for the BST timezone
    const bstOffset = 6 * 60 * 60 * 1000; // BST is +6 hours from UTC
    // Add the offset to the timestamp
    const adjustedTime = new Date(convertedDate.getTime() + bstOffset);
    // Convert to ISO string
    const bstIsoString = adjustedTime.toISOString().replace("Z", "+06:00");
    return bstIsoString.split("T")[0];
  };

  const handleFilter = () => {
    if (!startdate || !endDate) return;
    setPage(1);
    setDateRange({
      start: bdStandardTime(startdate),
      end: bdStandardTime(endDate),
    });
  };

  const totalPages = pagination?.totalPages || 1;
  const currentPage = pagination?.currentPage || page;

  const goToPage = (target: number) => {
    if (target < 1 || target > totalPages || target === currentPage) return;
    setPage(target);
  };

  // Compact page list: first, last, current +/- 1, with ellipses between gaps.
  const getPageNumbers = () => {
    const delta = 1;
    const pages: (number | "ellipsis")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    }
    return pages;
  };

  return (
    <Card>
      <CardHeader className="space-y-6">
        <CardTitle>
          <h2>Midroll Analytics</h2>
          <p className="font-normal text-base mt-2">
            see analytics of the midroll ads played in the stream
          </p>
        </CardTitle>
        <div className="flex items-center justify-between flex-row mt-4">
          <Select
            value={filterType}
            onValueChange={(value: string) => {
              setFilterType(value);
            }}
          >
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
              startDate={startdate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              handleFilter={handleFilter}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table className="text-center border-2 border-slate-100">
          <TableHeader className="text-center bg-slate-500 text-white">
            <TableRow>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-left"
              >
                Match
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Date
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Ad Name
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Break Type
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Started At
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Duration
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Duration (ms)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-[100px] text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : allCreatives?.length ? (
              allCreatives?.map((ad) => (
                <TableRow key={ad._id || ad.id}>
                  <TableCell className="font-medium text-left">
                    {ad?.matchName}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {ad?.date}
                  </TableCell>
                  <TableCell className="text-center">{ad?.adName}</TableCell>
                  <TableCell className="text-center">{ad?.breakType}</TableCell>
                  <TableCell className="text-center">{ad?.playedAt}</TableCell>
                  <TableCell className="text-center">
                    {ad?.durationLabel}
                  </TableCell>
                  <TableCell className="text-center">
                    {ad?.durationMs}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-[100px] text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages} &middot; {pagination?.totalItem}{" "}
              records
            </p>
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage - 1);
                    }}
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {getPageNumbers().map((item, index) =>
                  item === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={item === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(item);
                        }}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage + 1);
                    }}
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MidrollAdsAnalytics;

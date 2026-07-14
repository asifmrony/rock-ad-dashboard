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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticsFilterBar from "@/components/AnalyticsFilterBar";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";
const apiUrl = process.env.REACT_APP_API_URL;

const LIMIT = 100;

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
  // `search` tracks the raw input; `debouncedSearch` is what actually hits the API.
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Shared filter mechanics; reset to the first page on any filter change.
  const filters = useAnalyticsFilters(() => setPage(1));
  const { dateRange } = filters;

  // Debounce the search box so we fire one request after the user stops typing,
  // and always jump back to the first page for a fresh query.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

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
        if (debouncedSearch) {
          params.append("matchName", debouncedSearch);
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
  }, [page, dateRange, debouncedSearch]);

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
        <AnalyticsFilterBar
          filterType={filters.filterType}
          setFilterType={filters.setFilterType}
          startDate={filters.startdate}
          setStartDate={filters.setStartDate}
          endDate={filters.endDate}
          setEndDate={filters.setEndDate}
          handleFilter={filters.handleFilter}
        />
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by match name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
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
              Page {currentPage} of {totalPages} &middot;{" "}
              {pagination?.totalItem} records
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

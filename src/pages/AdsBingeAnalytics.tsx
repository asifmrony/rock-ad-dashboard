import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import AnalyticsFilterBar from "@/components/AnalyticsFilterBar";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";
const apiUrl = process.env.REACT_APP_API_URL;

const ADVERTISEMENT_ID = "6a20f96349be327667715019";

const AdsBingeAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [allCreatives, setAllCreatives] = useState([]);
  const [creativeSummary, setCreativeSummary] = useState({
    totalImpressions: 0,
    totalClicks: 0,
    totalStarts: 0,
    totalFirstQuartile: 0,
    totalMidpoint: 0,
    totalThirdQuartile: 0,
    totalCompletes: 0,
    totalSkips: 0,
    ctr: 0,
  });

  const filters = useAnalyticsFilters();
  const { dateRange } = filters;

  // Single source of truth for fetching: re-runs whenever the active date
  // filter changes (`null` on first load means no date params).
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("advertisement_id", ADVERTISEMENT_ID);
        if (dateRange) {
          params.append("startdate", dateRange.start);
          params.append("enddate", dateRange.end);
        }
        const response = await axios.get(
          `${apiUrl}ads/creatives/analytics-by-advertisement?${params.toString()}`,
        );
        setAllCreatives(
          response?.data?.campaigns_analytics?.[1]?.creatives_analytics,
        );
        setCreativeSummary(
          response?.data?.campaigns_analytics?.[1]?.campaign_total_summation,
        );
      } catch (err) {
        console.log("Error fetching binge analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [dateRange]);

  return (
    <Card>
      <CardHeader className="space-y-6">
        <CardTitle>
          <h2>Binge+ Ads Analytics</h2>
          <p className="font-normal text-base mt-2">
            Get Analytics of all of your advertisement in one place
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
                Name
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Ctr
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Total Clicks
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Total Completes
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Total First Quartile
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Total Impressions
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Total Mid Point
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Total Skips
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Total Starts
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Total Third Quartile
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-[100px] text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              allCreatives?.map((ad) => (
                <TableRow key={ad._id}>
                  <TableCell className="font-medium text-left">
                    {ad?.name}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {ad?.analytics?.ctr}
                  </TableCell>
                  <TableCell className="text-center">
                    {ad?.analytics?.totalClicks}
                  </TableCell>
                  <TableCell className="text-center">
                    {ad?.analytics?.totalCompletes}
                  </TableCell>
                  <TableCell className="text-center">
                    {ad?.analytics?.totalFirstQuartile}
                  </TableCell>
                  <TableCell className="text-center">
                    {ad?.analytics?.totalImpressions}
                  </TableCell>
                  <TableCell className="text-center">
                    {ad?.analytics?.totalMidpoint}
                  </TableCell>
                  <TableCell className="text-center">
                    {ad?.analytics?.totalSkips}
                  </TableCell>
                  <TableCell className="text-center">
                    {ad?.analytics?.totalStarts}
                  </TableCell>
                  <TableCell className="text-center">
                    {ad?.analytics?.totalThirdQuartile}
                  </TableCell>
                </TableRow>
              ))
            )}

            {loading ? (
              ""
            ) : (
              <TableRow>
                <TableCell className="font-medium text-left">Total</TableCell>
                <TableCell className="font-medium text-center">
                  {creativeSummary?.ctr}
                </TableCell>
                <TableCell className="text-center">
                  {creativeSummary?.totalClicks}
                </TableCell>
                <TableCell className="text-center">
                  {creativeSummary?.totalCompletes}
                </TableCell>
                <TableCell className="text-center">
                  {creativeSummary?.totalFirstQuartile}
                </TableCell>
                <TableCell className="text-center">
                  {creativeSummary?.totalImpressions}
                </TableCell>
                <TableCell className="text-center">
                  {creativeSummary?.totalMidpoint}
                </TableCell>
                <TableCell className="text-center">
                  {creativeSummary?.totalSkips}
                </TableCell>
                <TableCell className="text-center">
                  {creativeSummary?.totalStarts}
                </TableCell>
                <TableCell className="text-center">
                  {creativeSummary?.totalThirdQuartile}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdsBingeAnalytics;

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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import axios from "axios";
import AdsFiltering from "@/components/AdsFiltering";
const apiUrl = process.env.REACT_APP_API_URL;

const mockAds = [
  {
    id: 1,
    name: "Summer Sale Campaign",
    advertiser: "Nike",
    campaign: "Summer 2024",
    status: true,
  },
  {
    id: 2,
    name: "Holiday Special",
    advertiser: "Adidas",
    campaign: "Winter 2024",
    status: false,
  },
];

const AdsAnalytics = () => {
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
  const [startdate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [filterType, setFilterType] = useState<string | undefined>();

  useEffect(() => {
    const getAllCreatives = async () => {
      const response = await axios.get(
        `${apiUrl}ads/creatives/creative-analytics`
      );
      setAllCreatives(response?.data?.creatives_analytics);
      setCreativeSummary(response?.data?.ads_total_summation);
    };
    getAllCreatives();
  }, []);

  useEffect(() => {
    async function callCreativeAPI(startDate: string, endDate: string) {
      const response = await axios.get(
        `${apiUrl}ads/creatives/creative-analytics?startdate=${startDate}&enddate=${endDate}`
      );
      setAllCreatives(response?.data?.creatives_analytics);
      setCreativeSummary(response?.data?.ads_total_summation);
    }

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
      if (filterType === "alltime") {
        // call alltime based api
        callCreativeAPI("all", "all");
      } else if (filterType === "thisMonth") {
        callCreativeAPI("", "");
      } else {
        // only last 1 | 3 | 6 Months based api
        console.log("Filter Type", getFilteredDate(filterType));
        console.log("today", getFilteredDate("today"));
        callCreativeAPI(getFilteredDate(filterType), getFilteredDate("today"));
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
    console.log("Bangladesh Standard time", bstIsoString);
    return bstIsoString.split("T")[0];
  };

  const handleFilter = async () => {
    const formattedStartDate = bdStandardTime(startdate);
    const formattedEndDate = bdStandardTime(endDate);

    const response = await axios.get(
      `${apiUrl}ads/creatives/creative-analytics${
        startdate &&
        endDate &&
        `?startdate=${formattedStartDate}&enddate=${formattedEndDate}`
      }`
    );
    setAllCreatives(response?.data?.creatives_analytics);
    setCreativeSummary(response?.data?.ads_total_summation);
  };

  return (
    <Card>
      <CardHeader className="space-y-6">
        <CardTitle>
          <h2>Ads Analytics</h2>
          <p className="font-normal text-base mt-2">
            Get Analytics of all of your advertisement in one place
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
              {/* <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  background: "white",
                  zIndex: 1,
                }}
              >
                Status
              </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCreatives?.map((ad) => (
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
                {/* <TableCell>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={ad.status}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {ad.status == true ? "Active" : "Deactive"}
                    </span>
                  </label>
                </TableCell> */}
              </TableRow>
            ))}

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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdsAnalytics;

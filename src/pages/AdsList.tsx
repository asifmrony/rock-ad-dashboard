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
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Advertiser, Campaign } from "@/lib/utils";
const apiUrl = process.env.REACT_APP_API_URL;

const AdsList = () => {
  const [allCreatives, setAllCreatives] = useState([]);

  useEffect(() => {
    const getAllCreatives = async () => {
      const response = await axios.get(`${apiUrl}ads/creatives`);
      setAllCreatives(response?.data);
    };
    getAllCreatives();
  }, []);

  console.log("All ads", allCreatives);

  return (
    <Card className="w-[1000px] mx-auto">
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle>All Ads List</CardTitle>
        <Link
          to="/ads/create"
          className="bg-blue-700 text-white py-2 px-4 rounded-md text-base font-medium h-10"
        >
          Create New Ad
        </Link>
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
                Advertiser
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Campaign
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Bitrate
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Height
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Width
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Media URL
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Status
              </TableHead>
              <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-center"
              >
                Action
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
                  <Advertiser advertiserId={ad?.advertisement_id} />
                </TableCell>
                <TableCell className="text-center">
                  <Campaign campaignId={ad?.campaign_id} />
                </TableCell>
                <TableCell className="text-center">
                  {ad?.media_files?.map((item, index) => (
                    <p key={index}>{item.bitrate}</p>
                  ))}
                </TableCell>
                <TableCell className="text-center">
                  {ad?.media_files?.map((item, index) => (
                    <p key={index}>{item.height}</p>
                  ))}
                </TableCell>
                <TableCell className="text-center">
                  {ad?.media_files?.map((item, index) => (
                    <p key={index}>{item.width}</p>
                  ))}
                </TableCell>
                <TableCell className="text-center">
                  {ad?.media_files?.map((item, index) => (
                    <p key={index}>{item.path}</p>
                  ))}
                </TableCell>
                <TableCell className="text-center">
                  {ad?.status === true ? "Active" : "Inactive"}
                </TableCell>
                <TableCell className="text-center">
                  <Button className="bg-black">
                    <Link to={`/ads/edit/${ad._id}`}>Edit</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdsList;

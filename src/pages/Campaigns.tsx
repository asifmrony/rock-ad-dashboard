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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Advertiser } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
const apiUrl = process.env.REACT_APP_API_URL;

const Advertisers = () => {
  const [allCampaign, setAllCampaign] = useState([]);
  const [allAdvertiser, setAllAdvertiser] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("");

  useEffect(() => {
    const getAllCampaign = async () => {
      const response = await axios.get(`${apiUrl}ads/campaigns`);
      setAllCampaign(response?.data);
    };
    getAllCampaign();
  }, []);

  useEffect(() => {
    const getAllAdvertiser = async () => {
      const response = await axios.get(`${apiUrl}ads/advertisers`);
      setAllAdvertiser(response?.data);
    };
    getAllAdvertiser();
  }, []);

  console.log("Selected Advertiser", selectedAdvertiser);

  const handleSubmit = () => {
    axios
      .post(`${apiUrl}ads/campaigns`, {
        name: campaignName,
        advertiser_id: selectedAdvertiser,
      })
      .then(() => {
        toast.success("Campaign created successfully!");
        setCampaignName("");
      })
      .catch(() => toast.error("There was an problem creating campaign!"));
  };

  return (
    <Card className="max-w-[700px] mx-auto">
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle>List of Campaign</CardTitle>
        {/* <Link
          to="/ads/create"
          className="bg-blue-700 text-white py-2 px-4 rounded-md text-base font-medium h-10"
        >
          Create New campaign
        </Link> */}
        <Dialog>
          <DialogTrigger className="bg-blue-700 text-white py-2 px-4 rounded-md text-base font-medium h-10">
            Create New campaign
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-5">Create New Campaign</DialogTitle>
              <DialogDescription>
                <Label>Campaign Name</Label>
                <Input
                  className="mb-4 mt-2"
                  name="name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
                <Select
                  value={selectedAdvertiser}
                  onValueChange={(value) => {
                    setSelectedAdvertiser(value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Advertiser" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {allAdvertiser?.map((item) => (
                        <SelectItem value={item._id} key={item._id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button className="mt-4" type="button" onClick={handleSubmit}>
                  Submit
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
              {/* <TableHead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
                className="bg-slate-500 text-white text-right"
              >
                Action
              </TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCampaign?.map((campaign) => (
              <TableRow key={campaign._id}>
                <TableCell className="font-medium text-left">
                  {campaign?.name}
                </TableCell>
                <TableCell className="font-medium text-center">
                  <Advertiser advertiserId={campaign?.advertiser_id} />
                </TableCell>
                {/* <TableCell className="text-right">
                  <Button className="bg-black">
                    <Link to="/ads/edit">Edit</Link>
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Advertisers;

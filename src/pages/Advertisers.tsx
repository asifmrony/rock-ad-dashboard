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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
const apiUrl = process.env.REACT_APP_API_URL;

const Advertisers = () => {
  const [allAdvertiser, setAllAdvertiser] = useState([]);
  const [advertiserName, setAdvertiserName] = useState("");
  const [selectedAdvertiser, setSelectedAdvertiser] = useState("");

  useEffect(() => {
    const getAllAdvertiser = async () => {
      const response = await axios.get(`${apiUrl}ads/advertisers`);
      setAllAdvertiser(response?.data);
    };
    getAllAdvertiser();
  }, []);

  console.log("advertiser name", advertiserName);

  const handleSubmit = () => {
    axios
      .post(`${apiUrl}ads/advertisers`, {
        name: advertiserName,
      })
      .then(() => {
        toast.success("Advertiser created successfully!");
        setAdvertiserName("");
      })
      .catch(() => toast.error("There was an problem creating advertiser!"));
  };

  const handleAdvertiserEdit = (id) => {
    axios
      .get(`${apiUrl}ads/advertisers/${id}`)
      .then((res) => setSelectedAdvertiser(res?.data?.name))
      .catch((err) => console.log("Error fetching single advertiser", err));
  };

  const handleEditSubmit = (id) => {
    axios
      .put(`${apiUrl}ads/advertisers/${id}`, {
        name: selectedAdvertiser,
      })
      .then(() => {
        toast.success("Advertiser Edited successfully!");
        setSelectedAdvertiser("");
      })
      .catch(() => toast.error("There was an problem editing advertiser!"));
  };

  return (
    <Card className="max-w-[700px] mx-auto">
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle>List of Advertisers</CardTitle>
        <Dialog>
          <DialogTrigger className="bg-blue-700 text-white py-2 px-4 rounded-md text-base font-medium h-10">
            Create New Advertiser
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-5">Create New Advertiser</DialogTitle>
              <DialogDescription>
                <Label>Advertiser Name</Label>
                <Input
                  className="mb-4 mt-2"
                  name="name"
                  value={advertiserName}
                  onChange={(e) => setAdvertiserName(e.target.value)}
                />

                <Button type="button" onClick={handleSubmit}>
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
                className="bg-slate-500 text-white text-right"
              >
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allAdvertiser?.map((ad) => (
              <TableRow key={ad._id}>
                <TableCell className="font-medium text-left">
                  {ad?.name}
                </TableCell>
                <TableCell className="text-right">
                  {/* <Button className="bg-black">
                    <Link to="/ads/edit">Edit</Link>
                  </Button> */}
                  <Dialog>
                    <DialogTrigger
                      className="bg-black text-white py-2 px-4 rounded-md text-base font-medium h-10"
                      onClick={() => handleAdvertiserEdit(ad._id)}
                    >
                      Edit
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="mb-5">
                          Edit Advertiser
                        </DialogTitle>
                        <DialogDescription>
                          <Label>Advertiser Name</Label>
                          <Input
                            className="mb-4 mt-2"
                            name="name"
                            value={selectedAdvertiser}
                            onChange={(e) =>
                              setSelectedAdvertiser(e.target.value)
                            }
                          />

                          <Button
                            type="button"
                            onClick={() => handleEditSubmit(ad._id)}
                          >
                            Submit
                          </Button>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Advertisers;

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Pencil } from "lucide-react";
const apiUrl = process.env.REACT_APP_API_URL;

type FormStep = "advertiser" | "campaign" | "creative";

const EditAd = () => {
  const adParamId = useParams()?.id;
  const [advertisers, setAdvertisers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    advertiser: {
      id: "",
    },
    campaign: {
      id: "",
    },
    creative: {
      title: "",
      landing_page_url: "",
      status: false,
      skip_offset: "",
    },
    media_files: [],
  });
  const [mediaFilesData, setMediaFilesData] = useState({
    path: "",
    delivery: "progressive",
    type: "video/mp4",
    width: "",
    height: "",
    bitrate: "",
    scalable: true,
    maintainAspectRatio: true,
  });

  console.log("Form Data", formData);

  useEffect(() => {
    const getAllAdvertiser = async () => {
      const response = await axios.get(`${apiUrl}ads/advertisers`);
      setAdvertisers(response?.data);
    };
    const getAllCampaigns = async () => {
      const response = await axios.get(`${apiUrl}ads/campaigns`);
      setCampaigns(response?.data);
    };
    getAllAdvertiser();
    getAllCampaigns();
  }, []);

  useEffect(() => {
    const getThisAd = async () => {
      const response = await axios.get(`${apiUrl}ads/creatives/${adParamId}`);
      setFormData((prev) => ({
        ...prev,
        advertiser: {
          id: response?.data?.advertisement_id,
        },
        campaign: {
          id: response?.data?.campaign_id,
        },
        creative: {
          title: response?.data?.name,
          landing_page_url: response?.data?.landing_page_url,
          status: response?.data?.status,
          skip_offset: response?.data?.skip_offset,
        },
        media_files: response?.data?.media_files,
      }));
      //   setSelectedAdvertiser(response?.data?.advertisement_id);
      //   setSelectedCampaign(response?.data?.campaign_id);
    };

    if (adParamId) {
      if (advertisers.length > 0 && campaigns.length > 0) {
        getThisAd();
      }
    }
  }, [adParamId, advertisers.length, campaigns.length]);

  const handleInputChange = (
    step: FormStep,
    field: string,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value,
      },
    }));
  };

  const handleSaveMediaFiles = () => {
    setFormData((prev) => ({
      ...prev,
      media_files: [...prev["media_files"], mediaFilesData],
    }));
    setMediaFilesData({
      path: "",
      delivery: "progressive",
      type: "video/mp4",
      width: "",
      height: "",
      bitrate: "",
      scalable: true,
      maintainAspectRatio: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    axios
      .put(`${apiUrl}ads/creatives/${adParamId}`, {
        name: formData.creative.title,
        landing_page_url: formData.creative.landing_page_url,
        vast_version: "4.0",
        skip_offset: formData.creative.skip_offset,
        status: formData.creative.status,
        campaign_id: formData.campaign.id,
        advertisement_id: formData.advertiser.id,
        media_files: formData.media_files,
      })
      .then(() => {
        toast.success("Ad edited successfully!");
      })
      .catch(() => {
        toast.error("There was an problem creating Ads!");
      });
  };

  return (
    <Card className="max-w-[500px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Edit Advertisement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 mt-4">
            <div>
              <div className="flex justify-between leading-4 mb-3">
                <Label>Advertiser Name </Label>
                <Link
                  to={"/advertisers"}
                  className="text-blue-700 font-semibold text-sm hover:underline"
                >
                  Create Advertiser
                </Link>
              </div>
              <Select
                value={formData.advertiser.id}
                onValueChange={(value: string) => {
                  handleInputChange("advertiser", "id", value);
                  // setSelectedAdvertiser(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a advertiser" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {advertisers?.map((vendor) => (
                      <SelectItem key={vendor._id} value={vendor._id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div>
              <Label className="block leading-4 mb-3"></Label>
              <div className="flex justify-between leading-4 mb-3">
                <Label>Campaign Name </Label>
                <Link
                  to={"/campaigns"}
                  className="text-blue-700 font-semibold text-sm hover:underline"
                >
                  Create Campaign
                </Link>
              </div>
              <Select
                value={formData.campaign.id}
                onValueChange={(value) => {
                  handleInputChange("campaign", "id", value);
                  //   setSelectedCampaign(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {campaigns?.map((vendor) => (
                      <SelectItem key={vendor._id} value={vendor._id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Ad Title</Label>
              <Input
                value={formData.creative.title}
                onChange={(e) =>
                  handleInputChange("creative", "title", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Landing Page Url</Label>
              <Input
                value={formData.creative.landing_page_url}
                onChange={(e) =>
                  handleInputChange(
                    "creative",
                    "landing_page_url",
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <Label>Skip Offset</Label>
              <Input
                value={formData.creative.skip_offset}
                onChange={(e) =>
                  handleInputChange("creative", "skip_offset", e.target.value)
                }
              />
            </div>
            <div className="flex items-center space-x-3">
              <Label htmlFor="status">Status</Label>
              <Switch
                id="status"
                checked={formData.creative.status}
                onCheckedChange={(checked) =>
                  handleInputChange("creative", "status", checked)
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Media Files</h3>
            {/* <p>Create Media Files?</p> */}
            <Dialog>
              <DialogTrigger className=" text-blue-700 font-semibold text-normal">
                Create New Media
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-5">
                    Create New Media File
                  </DialogTitle>
                  <DialogDescription>
                    <Select
                      value={mediaFilesData.bitrate}
                      onValueChange={(value) => {
                        setMediaFilesData((prev) => ({
                          ...prev,
                          bitrate: value,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[180px] mb-4">
                        <SelectValue placeholder="Select a Bitrate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="240">240</SelectItem>
                          <SelectItem value="320">320</SelectItem>
                          <SelectItem value="480">480</SelectItem>
                          <SelectItem value="512">512</SelectItem>
                          <SelectItem value="640">640</SelectItem>
                          <SelectItem value="720">720</SelectItem>
                          <SelectItem value="1080">1080</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className="space-y-2 mb-2">
                      <Label className="font-normal">Height</Label>
                      <Input
                        value={mediaFilesData.height}
                        onChange={(e) =>
                          setMediaFilesData((prev) => ({
                            ...prev,
                            height: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2 mb-2">
                      <Label className="font-normal">Width</Label>
                      <Input
                        value={mediaFilesData.width}
                        onChange={(e) =>
                          setMediaFilesData((prev) => ({
                            ...prev,
                            width: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2 mb-2">
                      <Label className="font-normal">Media URL</Label>
                      <Input
                        value={mediaFilesData.path}
                        onChange={(e) =>
                          setMediaFilesData((prev) => ({
                            ...prev,
                            path: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <DialogClose asChild>
                      <Button
                        className="mt-4"
                        type="button"
                        onClick={handleSaveMediaFiles}
                      >
                        Save
                      </Button>
                    </DialogClose>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-4">
            {formData.media_files?.map((item, index) => (
              <div
                key={index}
                className="p-4 content-wrap overflow-x-auto border rounded-md relative"
              >
                <Dialog>
                  <DialogTrigger className="text-sm py-1 px-2 text-green-500 rounded-md absolute top-2 right-3">
                    <Pencil />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="mb-5">
                        Edit Media Files
                      </DialogTitle>
                      <DialogDescription>
                        <Label>Bitrate</Label>
                        <Input
                          className="mb-4 mt-2"
                          name="name"
                          value={item?.bitrate}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              media_files: prev.media_files.map((file, i) =>
                                i === index
                                  ? { ...file, bitrate: e.target.value }
                                  : file
                              ),
                            }))
                          }
                        />
                        <Label>Height</Label>
                        <Input
                          className="mb-4 mt-2"
                          name="name"
                          value={item?.height}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              media_files: prev.media_files.map((file, i) =>
                                i === index
                                  ? { ...file, height: e.target.value }
                                  : file
                              ),
                            }))
                          }
                        />
                        <Label>Width</Label>
                        <Input
                          className="mb-4 mt-2"
                          name="name"
                          value={item?.width}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              media_files: prev.media_files.map((file, i) =>
                                i === index
                                  ? { ...file, width: e.target.value }
                                  : file
                              ),
                            }))
                          }
                        />
                        <Label>Media URL</Label>
                        <Input
                          className="mb-4 mt-2"
                          name="name"
                          value={item?.path}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              media_files: prev.media_files.map((file, i) =>
                                i === index
                                  ? { ...file, path: e.target.value }
                                  : file
                              ),
                            }))
                          }
                        />

                        <DialogClose asChild>
                          <Button
                            className="mt-4"
                            type="button"
                            // onClick={handleSubmit}
                          >
                            Save
                          </Button>
                        </DialogClose>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                {/* <button
                  type="button"
                  className="text-sm py-1 px-2 text-green-500 rounded-md absolute top-2 right-3"
                >
                  <Pencil />
                </button> */}
                <p>
                  <span className="font-medium">bitrate:</span> {item?.bitrate}
                </p>
                <p>
                  <span className="font-medium">height:</span> {item?.height}
                </p>
                <p>
                  <span className="font-medium">width:</span> {item?.width}
                </p>
                <p>
                  <span className="font-medium">Media URL:</span> {item?.path}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Edit Ad</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditAd;

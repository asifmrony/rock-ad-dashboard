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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import axios from "axios";

type FormStep = "advertiser" | "campaign" | "creative";

const CreateAd = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [advertisers, setAdvertisers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedAdertiser, setSelectedAdvertiser] = useState<
    string | undefined
  >();
  const [selectedCampaign, setSelectedCampaign] = useState<
    string | undefined
  >();
  const [hasMediaFiles, setMediaFiles] = useState(false);
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
  const [currentStep, setCurrentStep] = useState<FormStep>("advertiser");
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

  console.log("Form Data", formData);
  console.log("Media Files Data", mediaFilesData);

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
  }, [apiUrl]);

  const handleSelectChange = (value: string) => {
    handleInputChange("advertiser", "id", value);
    setSelectedAdvertiser(value);
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

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === "advertiser") {
      setCurrentStep("campaign");
    } else if (currentStep === "campaign") {
      setCurrentStep("creative");
    }
  };

  const handleBack = () => {
    if (currentStep === "campaign") {
      setCurrentStep("advertiser");
    } else if (currentStep === "creative") {
      setCurrentStep("campaign");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    axios
      .post(`${apiUrl}ads/creatives`, {
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
        toast.success("Ad created successfully!");
      })
      .catch(() => {
        toast.error("There was an problem creating Ads!");
      });
  };

  return (
    <Card className="max-w-[600px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>
          Create New Ad - Step{" "}
          {currentStep === "advertiser"
            ? "1"
            : currentStep === "campaign"
            ? "2"
            : "3"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === "advertiser" && (
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between leading-4 mb-3">
                  <Label>Advertiser Name</Label>
                  <Link
                    to={"/advertisers"}
                    className="text-blue-700 font-semibold text-sm hover:underline"
                  >
                    Create Advertiser
                  </Link>
                </div>
                {/* <Input
                  value={formData.advertiser.name}
                  onChange={(e) =>
                    handleInputChange("advertiser", "name", e.target.value)
                  }
                /> */}
                <Select
                  value={selectedAdertiser}
                  onValueChange={handleSelectChange}
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
              {/* <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.advertiser.email}
                  onChange={(e) =>
                    handleInputChange("advertiser", "email", e.target.value)
                  }
                />
              </div> */}
              {/* <div>
                <Label>Company</Label>
                <Input
                  value={formData.advertiser.company}
                  onChange={(e) =>
                    handleInputChange("advertiser", "company", e.target.value)
                  }
                />
              </div> */}
            </div>
          )}

          {currentStep === "campaign" && (
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between leading-4 mb-3">
                  <Label>Campaign Name</Label>
                  <Link
                    to={"/campaigns"}
                    className="text-blue-700 font-semibold text-sm hover:underline"
                  >
                    Create Campaigns
                  </Link>
                </div>
                <Select
                  value={selectedCampaign}
                  onValueChange={(value) => {
                    handleInputChange("campaign", "id", value);
                    setSelectedCampaign(value);
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
              {/* <div>
                <Label>Budget</Label>
                <Input
                  type="number"
                  value={formData.campaign.budget}
                  onChange={(e) =>
                    handleInputChange("campaign", "budget", e.target.value)
                  }
                />
              </div> */}
              {/* <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.campaign.startDate}
                  onChange={(e) =>
                    handleInputChange("campaign", "startDate", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.campaign.endDate}
                  onChange={(e) =>
                    handleInputChange("campaign", "endDate", e.target.value)
                  }
                />
              </div> */}
            </div>
          )}

          {currentStep === "creative" && (
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
              <div className="flex items-center space-x-3">
                <Label htmlFor="mediaFiles">Has Media Files?</Label>
                <Switch
                  id="mediaFiles"
                  checked={hasMediaFiles}
                  onCheckedChange={(checked) => setMediaFiles(checked)}
                />
              </div>
              {hasMediaFiles && (
                <div>
                  <div className="border-2 border-slate-200 rounded-md w-full p-4 text-sm bg-[#e7e7e7]">
                    <p>Create Media Files for Multiple bitrates</p>
                    <div className="mt-4 space-y-4">
                      <Select
                        value={mediaFilesData.bitrate}
                        onValueChange={(value) => {
                          setMediaFilesData((prev) => ({
                            ...prev,
                            bitrate: value,
                          }));
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
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
                      <div className="space-y-2">
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
                      <div className="space-y-2">
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
                      <div className="space-y-2">
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
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleSaveMediaFiles}
                        >
                          Save & Add Another
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between">
            {currentStep !== "advertiser" && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {currentStep === "advertiser" || currentStep === "campaign" ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit">Create Ad</Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAd;

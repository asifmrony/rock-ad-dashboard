import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
const apiUrl = process.env.REACT_APP_API_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Advertiser = ({ advertiserId }) => {
  const [advertiserName, setAdvertiserName] = useState("");

  useEffect(() => {
    const getAdvertiserDetails = async () => {
      const response = await axios.get(
        `${apiUrl}ads/advertisers/${advertiserId}`
      );
      setAdvertiserName(response?.data?.name);
    };
    getAdvertiserDetails();
  }, [advertiserId]);

  return advertiserName;
};

export const Campaign = ({ campaignId }) => {
  const [campaignName, setCampaignName] = useState("");

  useEffect(() => {
    const getCampaignDetails = async () => {
      const response = await axios.get(`${apiUrl}ads/campaigns/${campaignId}`);
      setCampaignName(response?.data?.name);
    };
    getCampaignDetails();
  }, [campaignId]);

  return campaignName;
};

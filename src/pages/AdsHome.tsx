import AdsBingeAnalytics from "./AdsBingeAnalytics";
import AdsAnalytics from "./AdsAnalytics";

function AdsHome() {
  const isBingePlusAdmin = localStorage.getItem("bingePlusAdmin") === "true";
  const isBkashAdmin = localStorage.getItem("isBkashAdmin") === "true";

  if (isBingePlusAdmin || isBkashAdmin) return <AdsBingeAnalytics />;

  return <AdsAnalytics />;
}

export default AdsHome;

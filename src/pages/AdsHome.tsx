import AdsBingeAnalytics from "./AdsBingeAnalytics";
import AdsAnalytics from "./AdsAnalytics";

function AdsHome() {
  const isBingePlusAdmin = localStorage.getItem("bingePlusAdmin") === "true";

  if (isBingePlusAdmin) return <AdsBingeAnalytics />;

  return <AdsAnalytics />;
}

export default AdsHome;

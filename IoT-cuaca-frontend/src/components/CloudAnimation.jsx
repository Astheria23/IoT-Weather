import Lottie from "lottie-react";
import sunnyAnimation from "../assets/Weather-sunny.json";
import partlyCloudyAnimation from "../assets/Weather-partly cloudy.json";
import showerAnimation from "../assets/Weather-partly shower.json";
import stormAnimation from "../assets/Weather-storm.json";
import windyAnimation from "../assets/Weather-windy.json";

// Determine simple weather condition from latest sensor values
const getCondition = ({ temp, rain, wind }) => {
  const t = typeof temp === "number" ? temp : undefined;
  const r = typeof rain === "number" ? rain : undefined;
  const w = typeof wind === "number" ? wind : undefined;

  // Prioritize more extreme conditions first
  if ((r && r >= 15) || (w && w >= 10)) {
    return "storm"; // heavy rain or very strong wind
  }

  if ((r && r >= 5) || (w && w >= 6)) {
    return "shower"; // rain / windy
  }

  if (t && t >= 30 && (!r || r < 1) && (!w || w < 4)) {
    return "sunny";
  }

  if ((!r || r < 1) && (!w || w < 6)) {
    return "partly"; // partly cloudy / normal
  }

  // fallback
  return "windy";
};

const getAnimationForCondition = (condition) => {
  switch (condition) {
    case "sunny":
      return sunnyAnimation;
    case "partly":
      return partlyCloudyAnimation;
    case "shower":
      return showerAnimation;
    case "storm":
      return stormAnimation;
    case "windy":
    default:
      return windyAnimation;
  }
};

const getAnimationSpeed = (condition) => {
  switch (condition) {
    case "sunny":
      return 0.9;
    case "partly":
      return 1.0;
    case "shower":
      return 1.2;
    case "windy":
      return 1.4;
    case "storm":
      return 1.6;
    default:
      return 1.0;
  }
};

const CloudAnimation = ({ className = "", temp, rain, wind }) => {
  const condition = getCondition({ temp, rain, wind });
  const animationData = getAnimationForCondition(condition);
  const animationSpeed = getAnimationSpeed(condition);

  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className={className}
      speed={animationSpeed}
    />
  );
};

export default CloudAnimation;

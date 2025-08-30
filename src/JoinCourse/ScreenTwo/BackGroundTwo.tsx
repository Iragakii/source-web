import MediaGrid from "./CardCPN/Mansory/CardGird";
import LightRays from "./LightRays";
import TitleTwoCUI from "./TitleTwoCUI";


const BackGroundTwo = () => {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={false}
        mouseInfluence={0}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />
      <div
        className="absolute top-1/15 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-4xl"
        style={{ pointerEvents: "auto" }}
      >
        <div className="text-center">
          <TitleTwoCUI />
        </div>
      </div>

      {/* MediaGrid component for displaying media cards */}
      <div className="absolute top-1/6 left-0 right-0 bottom-0 z-40">
        <MediaGrid />
      </div>
    </div>
  );
};

export default BackGroundTwo;

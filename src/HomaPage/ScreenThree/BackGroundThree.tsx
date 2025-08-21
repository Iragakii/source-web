import { Canvas } from "@react-three/fiber";
import Ho from "../../components/3D/Ho";
import LightRaysThree from "./LightRaysThree";
import TextLeft from "./TextLeft";

const BackGroundThree = () => {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <LightRaysThree
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-8xl"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex !justify-between">
          <div className="items-center relative top-20 left-20 ">
            <TextLeft></TextLeft>
          </div>
          <div className="text-center  car-and-text relative left-5">
            <Canvas
              className="main-p-car !h-180   "
              shadows
              camera={{ position: [2, 2, 2], fov: 30 }}
            >
              <Ho></Ho>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackGroundThree;

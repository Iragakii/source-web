import { LiquidChrome } from "./LiquidChrome";
import HeaderSetup from "../../components/CpnHomePage/HeaderSetup";
import TitleBrand from "../Title/TitleBrand";
import ButtonOne from "../TwoButton/ButtonOne";
import Description from "../Title/Description";

const BackGround = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      <LiquidChrome
        baseColor={[0.1, 0.1, 0.1]}
        speed={0.2}
        amplitude={0.4}
        interactive={true}
      />

      {/* Content layer that allows scrolling */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {/* Header - Responsive positioning */}
        <div
          className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] z-50"
          style={{ pointerEvents: "auto" }}
        >
          <div
            className="bg-black/50 rounded-2xl border-1 border-gray-900"
            style={{ padding: "5px 16px" }}
          >
            <HeaderSetup />
          </div>
        </div>

        {/* Title and Button - Centered layout */}
        <div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-4xl"
          style={{ pointerEvents: "auto" }}
        >
          <div className="text-center">
            <TitleBrand />
            {/* Button positioned directly under title with left alignment */}
            <div className="!mt-5 sm:mt-30 lg:mt-20 absolute left-1/4">
              <Description />
            </div>
            <div className="!mt-30 sm:mt-30 lg:mt-20 absolute left-1/3">
              <ButtonOne />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackGround;

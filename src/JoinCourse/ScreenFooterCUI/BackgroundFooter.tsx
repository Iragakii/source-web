import By from "./By";
import LeftSocial from "./LeftSocial";
import RightSocial from "./RightSocial";
import Social from "./Social";
import Threads from "./Threads";

const BackgroundFooter = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: "black",
      }}
    >
      <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
      <div
        className="absolute top-1/15 right-[55%] transform translate-x-1/2 -translate-y-1/2 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-4xl !bg-black"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex justify-between !space-x-90">
          <div className="text-center">
            <Social></Social>
          </div>
          <div>
            <LeftSocial></LeftSocial>
          </div>
          <div>
            <RightSocial></RightSocial>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-1/10 right-[30%] transform translate-x-1/2 -translate-y-1/2 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-4xl !bg-black"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex  ">
          <div className="text-center">
            <By></By>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundFooter;

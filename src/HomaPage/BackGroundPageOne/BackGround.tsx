import { LiquidChrome } from "./LiquidChrome";

const BackGround = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",

        zIndex: -1,
      }}
    >
      <LiquidChrome
        baseColor={[0.1, 0.1, 0.1]}
        speed={0.2}
        amplitude={0.4}
        interactive={true}
      />
    </div>
  );
};

export default BackGround;

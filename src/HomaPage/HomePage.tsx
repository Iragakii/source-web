import "remixicon/fonts/remixicon.css";
import BackGround from "./BackGroundPageOne/BackGround";
import BackGroundTwo from "./ScreenTwo/BackGroundTwo";
import BackGroundThree from "./ScreenThree/BackGroundThree";
import BackgroundFooter from "./ScreenFooter/BackgroundFooter";

function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="w-full h-screen relative">
        <BackGround />
      </section>
      <section className="w-full h-screen relative">
        <BackGroundTwo />
      </section>
      <section className="w-full h-screen relative">
        <BackGroundThree />
      </section>
      <section className="w-full h-screen relative">
        <BackgroundFooter />
      </section>
    </div>
  );
}

export default HomePage;

import BackGround from "./HomaPage/BackGroundPageOne/BackGround";
import "remixicon/fonts/remixicon.css";
import BackGroundTwo from "./HomaPage/ScreenTwo/BackGroundTwo";
import BackGroundThree from "./HomaPage/ScreenThree/BackGroundThree";
import BackgroundFooter from "./HomaPage/ScreenFooter/BackgroundFooter";

function App() {
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

export default App;

import BackGround from "./HomaPage/BackGroundPageOne/BackGround";
import "remixicon/fonts/remixicon.css";
import BackGroundTwo from "./HomaPage/ScreenTwo/BackGroundTwo";

function App() {
  return (
    <div className="min-h-screen">
      <section className="w-full h-screen relative">
        <BackGround />
      </section>
      <section className="w-full h-screen relative">
        <BackGroundTwo />
      </section>
    </div>
  );
}

export default App;

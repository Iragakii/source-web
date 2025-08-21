import { Routes, Route } from "react-router-dom";
import HomePage from "./HomaPage/HomePage";
import "remixicon/fonts/remixicon.css";
import LoginPage from "./LoginPage/LoginPage";
import SignUpPage from "./LoginPage/SignUpPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage></LoginPage>} />
      <Route path="/sign-up" element={<SignUpPage></SignUpPage>} />
    </Routes>
  );
}

export default App;

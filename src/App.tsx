import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import HomePage from "./HomaPage/HomePage";
import "remixicon/fonts/remixicon.css";
import LoginPage from "./LoginPage/LoginPage";
import SignUpPage from "./LoginPage/SignUpPage";
import RegisterCourse from "./RegisterCourse/Resgister";
import JoinCourse from "./JoinCourse/JoinCourse";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage></LoginPage>} />
          <Route path="/sign-up" element={<SignUpPage></SignUpPage>} />
          <Route path="/register-course" element={<RegisterCourse></RegisterCourse>} />
          <Route path="/join-course" element={<JoinCourse></JoinCourse>} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

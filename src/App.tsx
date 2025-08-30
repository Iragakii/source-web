import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import HomePage from "./HomaPage/HomePage";
import "remixicon/fonts/remixicon.css";
import LoginPage from "./LoginPage/LoginPage";
import SignUpPage from "./LoginPage/SignUpPage";
import RegisterCourse from "./RegisterCourse/ResgisterCourse";
import AdminDashboard from "./AdminUI/AdminDashboard";

import CourseUI from "./JoinCourse/CourseUI";
import CourseDetail from "./JoinCourse/CourseDetail/CourseDetail";
import CourseAccess from "./JoinCourse/CourseDetail/CourseAccess/CourseAccess";
import CourseCyberAccess from "./JoinCourse/CourseCyberDetail/CourseCyberAccess";
import CourseDetailCyber from "./JoinCourse/CourseCyberDetail/CourseDetailCyber";
import TestITBackG from "./JoinCourse/TestIT/TestITBackG";
import TestCyberBackG from "./JoinCourse/TestIT/QuestionCyber/BGCyberTest/TestCyberBackG";
import AboutUI from "./About/AboutUI";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage></LoginPage>} />
          <Route path="/sign-up" element={<SignUpPage></SignUpPage>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/register-course" element={<RegisterCourse></RegisterCourse>} />
          <Route path="/join-course" element={<CourseUI></CourseUI>} />
          <Route path="/test-it" element={<TestITBackG></TestITBackG>} />
          <Route path="/test-cybersec" element={<TestCyberBackG></TestCyberBackG>} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/course/:courseId/access" element={<CourseAccess />} />
          <Route path="/course-cyber/:courseId" element={<CourseDetailCyber />} />
          <Route path="/course-cyber/:courseId/access" element={<CourseCyberAccess />} />
          <Route path="/about" element={<AboutUI />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

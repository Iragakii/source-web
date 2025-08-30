import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BackGroundLogin from "../LoginPage/BackGroundLogin";
import CourseManagement from "./CourseManagement";
import VideoManagement from "./VideoManagement";
import UserManagement from "./UserManagement";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"courses" | "videos" | "users">("courses");

  // Debug logging
  console.log("=== ADMIN DASHBOARD DEBUG ===");
  console.log("User:", user);
  console.log("User Role:", user?.role);
  console.log("Is Loading:", isLoading);
  console.log("Is Admin Check:", user && user.role === "admin");
  console.log("LocalStorage Token:", localStorage.getItem('authToken'));
  console.log("LocalStorage User:", localStorage.getItem('user'));
  console.log("==============================");

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <section className="w-full h-screen relative">
          <BackGroundLogin />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center bg-black/90 border-2 border-[#61dca3] rounded-lg p-8 max-w-md mx-4">
              <h1 className="text-2xl font-mono text-[#61dca3] mb-4">[ LOADING... ]</h1>
              <p className="text-[#61dca3] font-mono">Checking authentication...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen">
        <section className="w-full h-screen relative">
          <BackGroundLogin />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center bg-black/90 border-2 border-[#61b3dc] rounded-lg p-8 max-w-md mx-4">
              <h1 className="text-2xl font-mono text-[#61b3dc] mb-4">[ ACCESS DENIED ]</h1>
              <p className="text-[#61dca3] font-mono mb-6">Admin privileges required.</p>
              <button
                onClick={() => navigate("/")}
                className="bg-transparent border-2 border-[#61dca3] text-[#61dca3] font-mono py-2 px-6 rounded hover:bg-[#61dca3] hover:text-black transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                [ ← BACK TO HOME ]
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <section className="w-full min-h-screen relative">
        <BackGroundLogin />
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-black/90 border-b-2 border-[#61dca3]">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="bg-[#61dca3] border-2 border-[#61dca3] text-black font-mono py-2 px-4 rounded hover:bg-[#61dca3] hover:text-black transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                [ ← HOME ]
              </button>
              <h1 className="text-[#61dca3] font-mono text-xl font-bold">
                [ ADMIN DASHBOARD ]
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-[#61b3dc] font-mono">
                Welcome, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-transparent border-2 border-[#61b3dc] text-[#61b3dc] font-mono py-2 px-4 rounded hover:bg-[#61b3dc] hover:text-black transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                [ LOGOUT ]
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="absolute top-20 left-0 right-0 z-20 bg-black/80 border-b border-[#2b4539]">
          <div className="flex items-center justify-center space-x-1 p-4">
            <button
              onClick={() => setActiveTab("courses")}
              className={`font-mono py-2 px-6 rounded transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                activeTab === "courses"
                  ? "bg-[#61dca3] text-black border-2 border-[#61dca3]"
                  : "bg-transparent border-2 border-[#61dca3] text-[#61dca3] hover:bg-[#61dca3] hover:text-black"
              }`}
            >
              [ COURSES ]
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`font-mono py-2 px-6 rounded transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                activeTab === "videos"
                  ? "bg-[#61b3dc] text-black border-2 border-[#61b3dc]"
                  : "bg-transparent border-2 border-[#61b3dc] text-[#61b3dc] hover:bg-[#61b3dc] hover:text-black"
              }`}
            >
              [ VIDEOS ]
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`font-mono py-2 px-6 rounded transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                activeTab === "users"
                  ? "bg-[#2b4539] text-[#61dca3] border-2 border-[#2b4539]"
                  : "bg-transparent border-2 border-[#2b4539] text-[#2b4539] hover:bg-[#2b4539] hover:text-[#61dca3]"
              }`}
            >
              [ USERS ]
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="absolute top-36 left-0 right-0 bottom-0 z-10 overflow-y-auto">
          <div className="p-6">
            {activeTab === "courses" && <CourseManagement />}
            {activeTab === "videos" && <VideoManagement />}
            {activeTab === "users" && <UserManagement />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

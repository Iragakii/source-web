import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const HeaderSetup = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center z-10">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between w-full text-white/80 font-medium">
        <div className="flex gap-4 lg:gap-6 xl:gap-10 ">
          <Link to="/">
            <button className="hover:text-white cursor-pointer transition-colors duration-200 px-2 py-1">
              <span>Home</span>
            </button>
          </Link>
          <Link to="/join-course">
            <button className="hover:text-white cursor-pointer transition-colors duration-200 px-2 py-1">
              <span>Course</span>
            </button>
          </Link>
       
          <Link to="/about">
            <button className="hover:text-white cursor-pointer transition-colors duration-200 px-2 py-1">
              <span>About US</span>
            </button>
          </Link>
        </div>
        
        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="hover:text-[#7ADAA5] transition-colors duration-200 text-xl cursor-pointer flex items-center gap-2"
            >
              <i className="ri-user-6-fill"></i>
              <span className="text-sm font-mono">{user?.username}</span>
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg border border-gray-700 min-w-48">
                <div className="flex flex-col p-3 space-y-2">
                  <div className="text-[#61dca3] font-mono text-sm px-3 py-2 border-b border-gray-700">
                    <div>Welcome, {user?.username}!</div>
                    <div className="text-xs text-gray-400">{user?.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="hover:text-red-400 cursor-pointer transition-colors duration-200 text-left w-full py-2 px-3 font-mono text-sm"
                  >
                    <i className="ri-logout-box-line mr-2"></i>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="hover:text-[#7ADAA5] transition-colors duration-200 text-xl cursor-pointer">
              <i className="ri-user-6-fill"></i>
            </button>
          </Link>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between w-full text-white/80">
        <div className="text-lg font-semibold">Symphony</div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="hover:text-[#7ADAA5] transition-colors duration-200 text-xl cursor-pointer flex items-center gap-2"
              >
                <i className="ri-user-6-fill"></i>
                <span className="text-xs font-mono">{user?.username}</span>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg border border-gray-700 min-w-48">
                  <div className="flex flex-col p-3 space-y-2">
                    <div className="text-[#61dca3] font-mono text-sm px-3 py-2 border-b border-gray-700">
                      <div>Welcome, {user?.username}!</div>
                      <div className="text-xs text-gray-400">{user?.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="hover:text-red-400 cursor-pointer transition-colors duration-200 text-left w-full py-2 px-3 font-mono text-sm"
                    >
                      <i className="ri-logout-box-line mr-2"></i>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="hover:text-[#7ADAA5] transition-colors duration-200 text-xl cursor-pointer">
                <i className="ri-user-6-fill"></i>
              </button>
            </Link>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-xl hover:text-white transition-colors duration-200"
          >
            <i
              className={isMobileMenuOpen ? "ri-close-line" : "ri-menu-line"}
            ></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/80 backdrop-blur-sm rounded-lg border border-gray-700 md:hidden">
          <div className="flex flex-col p-4 space-y-3">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="hover:text-white cursor-pointer transition-colors duration-200 text-left w-full py-2">
                <span>Home</span>
              </button>
            </Link>
            <Link to="#" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="hover:text-white cursor-pointer transition-colors duration-200 text-left w-full py-2">
                <span>Contact</span>
              </button>
            </Link>
            <Link to="#" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="hover:text-white cursor-pointer transition-colors duration-200 text-left w-full py-2">
                <span>FAQ</span>
              </button>
            </Link>
            <Link to="#" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="hover:text-white cursor-pointer transition-colors duration-200 text-left w-full py-2">
                <span>About US</span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSetup;

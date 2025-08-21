import { Link } from "react-router-dom";
import { useState } from "react";

const HeaderSetup = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <Link to="#">
            <button className="hover:text-white cursor-pointer transition-colors duration-200 px-2 py-1">
              <span>Contact</span>
            </button>
          </Link>
          <Link to="#">
            <button className="hover:text-white cursor-pointer transition-colors duration-200 px-2 py-1">
              <span>FAQ</span>
            </button>
          </Link>
          <Link to="#">
            <button className="hover:text-white cursor-pointer transition-colors duration-200 px-2 py-1">
              <span>About US</span>
            </button>
          </Link>
        </div>
        <Link to="/login">
          <button className="hover:text-[#7ADAA5] transition-colors duration-200 text-xl cursor-pointer">
            <i className="ri-user-6-fill"></i>
          </button>
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between w-full text-white/80">
        <div className="text-lg font-semibold">Symphony</div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <button className="hover:text-[#7ADAA5] transition-colors duration-200 text-xl cursor-pointer">
              <i className="ri-user-6-fill"></i>
            </button>
          </Link>
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

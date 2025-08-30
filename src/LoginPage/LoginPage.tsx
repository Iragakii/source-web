import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BackGroundLogin from "./BackGroundLogin";
import SimpleModalLogin from "./ModalLogin/SimpleModalLogin";

const LoginPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Auto-open modal if coming from signup page
    if (searchParams.get("openModal") === "true") {
      setIsModalOpen(true);
      // Clean up the URL parameter
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      <div className="min-h-screen">
        <section className="w-full h-screen relative">
          <BackGroundLogin />
          <div className="absolute top-4 left-4 z-30">
            <Link to="/">
              <button className="bg-[#61dca3] border-2 border-[#61dca3] text-black font-mono py-2 px-4 rounded hover:bg-[#61dca3] hover:text-black transition-all duration-300 cursor-pointer transform hover:scale-105">
                [ ← HOME ]
              </button>
            </Link>
          </div>

          {/* Login trigger button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-transparent border-2 border-[#61dca3] text-[#61dca3] font-mono py-4 px-8 rounded-lg hover:bg-[#61dca3] hover:text-black transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-[#61dca3]/50 text-xl cursor-pointer"
            >
              [ ACCESS TERMINAL ]
            </button>
          </div>

          {/* Modal */}
          <SimpleModalLogin
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </section>
      </div>
    </>
  );
};

export default LoginPage;

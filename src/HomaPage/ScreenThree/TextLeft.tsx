import { useState } from "react";
import ShinyText from "../../components/ShinyText";

const TextLeft = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const nextSlide = () => {
    if (isTransitioning) return; // Prevent multiple clicks during transition

    setIsTransitioning(true);

    // After fade out completes, change slide and fade in
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slideContents.length);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50); // Small delay to ensure content change is rendered
    }, 300); // Match the CSS transition duration
  };

  const slideContents = [
    // Slide 1 - Original content
    [
      {
        text: "Training master yours skills to earn IT certifications",
        width: "w-130",
      },
      {
        text: "Every certification is an investment in your career capital",
        width: "w-140",
      },
      {
        text: "Trusted skills , Stronger future",
        width: "w-130",
      },
      {
        text: "OSCP is proof you've mastered cybersecurity",
        width: "w-130",
      },
      {
        text: "Building intelligence, one algorithm at a time",
        width: "w-130",
      },
      {
        text: '"From code to career" — powered by ADSE',
        width: "w-130",
        isShiny: true,
      },
    ],
    // Slide 2 - New content
    [
      {
        text: "Master cloud technologies with AWS and Azure ",
        width: "w-130",
      },
      {
        text: "DevOps  opens doors to high-paying opportunities",
        width: "w-140",
      },
      {
        text: "Kubernetes is the future of container orchestration",
        width: "w-130",
      },
      {
        text: "Master to earn Machine Learning certifications ",
        width: "w-130",
      },
      {
        text: "Data Science skills transform businesses worldwide",
        width: "w-130",
      },
      {
        text: '"Innovation through certification" — ADSE Excellence',
        width: "w-140",
        isShiny: true,
      },
    ],
    // Slide 3 - Additional content
    [
      {
        text: "Blockchain development shapes the decentralized future",
        width: "w-140",
      },
      {
        text: "Full-stack expertise combines FE and BA mastery",
        width: "w-140",
      },
      {
        text: "Mobile app development reaches billions of users",
        width: "w-130",
      },
      {
        text: "AI and Neural Networks revolutionize technology",
        width: "w-130",
      },
      {
        text: "Quantum computing opens new computational possibilities",
        width: "w-150",
      },
      {
        text: '"Future-ready skills" — Powered by ADSE Innovation',
        width: "w-140",
        isShiny: true,
      },
    ],
  ];

  return (
    <>
      <div>
        <div className="block !space-y-8    ">
          <div className="flex gap-5 items-center">
            <i className="ri-id-card-fill text-5xl text-[#FAFFC5]"></i>
            <span className="text-5xl font-cer font-thin bg-gradient-to-r from-[#E8FFD7] to-[#5E936C] bg-clip-text text-transparent">
              Certifications
            </span>
            <button
              onClick={toggleVisibility}
              className="ml-4 !px-2 py-2 bg-[#4A9782] text-white rounded-full hover:bg-[#3A7A6A] transition-all duration-300 flex items-center gap-2 text-sm cursor-pointer"
            >
              <i className={`ri-${isVisible ? "eye-off" : "eye"}-line`}></i>
              {isVisible ? "" : ""}
            </button>
          </div>

          <div
            className={`block !ml-15 transition-all duration-500 ease-in-out overflow-hidden ${
              isVisible ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div
              className={`!space-y-5 transition-all duration-300 ease-in-out ${
                isTransitioning
                  ? "opacity-0 transform translate-y-2"
                  : "opacity-100 transform translate-y-0"
              }`}
            >
              {slideContents[currentSlide].map((item, index) => (
                <div
                  key={`${currentSlide}-${index}`}
                  className={`flex gap-2 ${item.width}`}
                >
                  <i className="ri-code-line text-[#4A9782] text-xl !mt-[1px]"></i>
                  {item.isShiny ? (
                    <ShinyText
                      text={item.text}
                      disabled={false}
                      speed={3}
                      className="text-xl"
                      variant="green"
                    />
                  ) : (
                    <span className="text-[#AEC8A4] text-xl">{item.text}</span>
                  )}
                  <i className="ri-code-s-slash-fill text-[#4A9782] text-xl !mt-[1px]"></i>
                </div>
              ))}
            </div>
          </div>

          {/* Next Slide Button */}
          {isVisible && (
            <div className="!ml-15 !mt-6">
              <button
                onClick={nextSlide}
                className="!px-4 py-2 bg-[#4A9782] text-white rounded-full hover:bg-[#3A7A6A] transition-all duration-300 flex items-center gap-2 text-sm cursor-pointer"
              >
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TextLeft;

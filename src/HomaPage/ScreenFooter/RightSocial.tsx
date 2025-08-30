import { useState } from "react";
import { Link } from "react-router-dom";

const arrowSlide = "/arrow-right-circle-line.png";

const RightSocial = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  return (
    <div className="icon-stack-container ">
      <Link to="#" className="stack-icon youtube">
        <i className="ri-robot-3-fill text-green-600 text-[25px]"></i>
      </Link>

      <div
        className={`left-icon-group ${isAnimating ? "left-group-animate" : ""}`}
      >
        <Link to="#" className="stack-icon instagram">
          <i className="ri-team-fill text-white text-[9px]"></i>
        </Link>
        <Link to="#" className="stack-icon twitter">
          <i className="ri-moon-fill text-white text-[16px]"></i>
        </Link>
        <Link to="#" className="stack-icon threads">
          <i className="ri-aliens-line text-white text-[18px]"></i>
        </Link>
      </div>

      <div
        className={`right-icon-group ${
          isAnimating ? "right-group-animate" : ""
        }`}
      >
        <Link to="#" className="stack-icon tiktok">
          <i className="ri-ghost-2-line text-white text-[18px]"></i>
        </Link>
        <Link to="#" className="stack-icon wordpress">
          <i className="ri-sun-fill text-white text-[16px]"></i>
        </Link>
        <Link to="#" className="stack-icon word">
          <i className="ri-game-line text-[#FFE100] text-[9px]"></i>
        </Link>
      </div>

      <div className="b-postion-coming mt-[9px] absolute left-[28px] top-[45px] flex items-center justify-center gap-[4px] hover-glow">
        <span className="text-white text-center font-medium text-[11px] leading-[7px] text-nowrap">
          Prerequisite
        </span>
        <button
          className={`hover:scale-110 transition-transform ${
            isAnimating ? "button-moved" : ""
          }`}
          onClick={triggerAnimation}
        >
          <img
            className="img-size-button w-[16px] h-[16px] transform transition-transform duration-300 ease-in-out group-hover:scale-[3.2] cursor-pointer"
            src={arrowSlide}
            alt="arrow-silde"
          />
        </button>
      </div>
    </div>
  );
};

export default RightSocial;

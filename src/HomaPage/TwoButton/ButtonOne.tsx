import { Link } from "react-router-dom";

const ButtonOne = () => {
  return (
    <>
      <div className="flex gap-8">
        <Link to='/register-course' className="bg-white !px-6 !py-2 rounded-full text-black hover:bg-[#D1D8BE] ">
          <button className="cursor-pointer ">Get Started</button>
        </Link>
        <Link to='/join-course' className="bg-gray-200/20 !px-6  !py-2 rounded-full text-white/30 border-1 hover:bg-[#B8CFCE] hover:text-black ">
          <button className="cursor-pointer">Join course</button>
        </Link>
      </div>
    </>
  );
};

export default ButtonOne;

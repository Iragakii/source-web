const ButtonOne = () => {
  return (
    <>
      <div className="flex gap-8">
        <div className="bg-white !px-6 !py-2 rounded-full text-black hover:bg-[#D1D8BE] ">
          <button className="cursor-pointer ">Get Started</button>
        </div>
        <div className="bg-gray-200/20 !px-6  !py-2 rounded-full text-white/30 border-1 hover:bg-[#B8CFCE] hover:text-black ">
          <button className="cursor-pointer">Join course</button>
        </div>
      </div>
    </>
  );
};

export default ButtonOne;

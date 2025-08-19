const HeaderSetup = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center  z-10">
      {/* Content area - completely transparent, no background interference */}

      <div className="text-white/80  font-medium ">
        {/* Add your header content here */}
        <div className="flex gap-57">
          <div className="flex gap-10   ">
            <span className="hover:text-white">Home</span>

            <span className="hover:text-white">About Us</span>
            <span className="hover:text-white">Contact</span>
            <span className="hover:text-white">FAQ</span>
          </div>
          <div className="hover:text-[#7ADAA5]">
            <i className="ri-user-6-fill"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSetup;

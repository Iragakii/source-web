import React from "react";

interface MediaCardProps {
  imageUrl: string;
  videoId: string;
  date: string;
  imageId: string;
  isVideo?: boolean;
  heightClass?: string;
  onClick?: () => void;
}

const RowCardOne: React.FC<MediaCardProps> = ({
  imageUrl,
  videoId,
  date,
  imageId,
  heightClass = "h-50",
  onClick,
}) => {
  return (
    <div 
      className="relative rounded-xl overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-[1.02] bg-[#93DA97]/10 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={`Media ${videoId}`}
          className={`w-full ${heightClass} object-cover transition-transform duration-300`}
          loading="lazy"
        />

        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <div className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
            <i className="ri-settings-3-line text-white text-sm"></i>
          </div>
        </div>
      </div>

      <div className="p-3 !ml-3 !py-2">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-[#DEE791] text-sm font-medium">{videoId}</span>
        </div>

        <div className="flex items-center !space-x-2 mb-2">
          <div className=" flex items-center justify-center">
            <i className="ri-code-s-slash-line text-white text-[14px]"></i>
          </div>
          <div className="text-white/90 truncate">
            <span>{imageId}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <i className="ri-time-line"></i>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RowCardOne;

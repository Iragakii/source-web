import React from "react";

interface CustomShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const CustomShinyText: React.FC<CustomShinyTextProps> = ({
  text,
  disabled = false,
  speed = 3,
  className = "",
}) => {
  return (
    <span
      className={`inline-block ${disabled ? "" : "custom-shine-text"} ${className}`}
      style={
        !disabled && speed !== 3
          ? { animationDuration: `${speed}s` }
          : undefined
      }
    >
      {text}
    </span>
  );
};

export default CustomShinyText;

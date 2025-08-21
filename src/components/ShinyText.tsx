import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  return (
    <span
      className={`inline-block ${disabled ? "" : "shine-text"} ${className}`}
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

export default ShinyText;

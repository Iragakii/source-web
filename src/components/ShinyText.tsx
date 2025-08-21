import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  variant?: "default" | "green";
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
  variant = "default",
}) => {
  const shineClass = variant === "green" ? "shine-text-green" : "shine-text";

  return (
    <span
      className={`inline-block ${disabled ? "" : shineClass} ${className}`}
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

import React from "react";

const Logo = (
  { textColor, starColor }: { textColor?: string; starColor?: string } = {
    textColor: "text-rumi-purple",
    starColor: "purple-400",
  },
) => (
  <div className="inline-flex items-center relative gap-2">
    <h1 className={`text-6xl font-display font-bold ${textColor}`}>rumi</h1>
    <span
      className={`text-3xl absolute top-[-10px] right-[-30px] ${starColor}`}
    >
      ✦
    </span>
  </div>
);

export default Logo;

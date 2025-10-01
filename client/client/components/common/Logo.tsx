// import React from "react";

type Props = {
  textColor?: string;
  starColor?: string;
  textSize?: string;
  starSize?: string;
};

const Logo = ({
  textColor = "text-rumi-purple",
  starColor = "text-rumi-purple",
  textSize = "6xl",
  starSize = "3xl",
}: Props) => (
  <div className="inline-flex items-center relative gap-2">
    <h1 className={`text-${textSize} font-display font-bold ${textColor}`}>
      rumi
    </h1>
    <span
      className={`text-${starSize} absolute -top-2 -right-8 ${starColor}`}
      aria-hidden
    >
      ✦
    </span>
  </div>
);

export default Logo;

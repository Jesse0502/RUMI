import React, { createContext, useContext, useState, ReactNode } from "react";

type BackgroundType = "gradient" | "solid";

interface BackgroundContextType {
  backgroundType: BackgroundType;
  setBackgroundType: (type: BackgroundType) => void;
  solidColor: string;
  setSolidColor: (color: string) => void;
}

// Create context with default values
const BackgroundContext = createContext<BackgroundContextType>({
  backgroundType: "solid",
  setBackgroundType: () => {},
  solidColor: "#f9fafb",
  setSolidColor: () => {},
});

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  return context;
};

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider: React.FC<BackgroundProviderProps> = ({
  children,
}) => {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("solid");
  const [solidColor, setSolidColor] = useState("#f9fafb"); // Professional neutral gray

  return (
    <BackgroundContext.Provider
      value={{
        backgroundType,
        setBackgroundType,
        solidColor,
        setSolidColor,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const getBackgroundClasses = (
  backgroundType: BackgroundType,
  solidColor?: string,
) => {
  if (backgroundType === "solid") {
    return {
      style: { backgroundColor: solidColor || "#f8fafc" },
      className: "",
    };
  }

  return {
    style: {},
    className: "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50",
  };
};

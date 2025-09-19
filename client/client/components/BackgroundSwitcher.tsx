import React from "react";
import { Palette, Layers } from "lucide-react";
import { useBackground } from "@/contexts/BackgroundContext";

export default function BackgroundSwitcher() {
  const backgroundContext = useBackground();
  const {
    backgroundType = "solid",
    setBackgroundType = () => {},
    solidColor = "#f9fafb",
    setSolidColor = () => {},
  } = backgroundContext || {};

  const predefinedColors = [
    "#f9fafb", // neutral gray - default
    "#ffffff", // pure white
    "#f8fafc", // cool gray
    "#fefefe", // warm white
    "#f5f5f5", // neutral light
    "#f0f9ff", // subtle blue
    "#faf5ff", // subtle purple
    "#fffbf5", // warm cream
  ];

  return (
    <div className="flex items-center gap-3">
      {/* Background Type Toggle */}
      <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setBackgroundType("gradient")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            backgroundType === "gradient"
              ? "bg-white text-rumi-purple shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">Gradient</span>
        </button>
        <button
          onClick={() => setBackgroundType("solid")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            backgroundType === "solid"
              ? "bg-white text-rumi-purple shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Solid</span>
        </button>
      </div>

      {/* Color Picker (only shown when solid is selected) */}
      {backgroundType === "solid" && (
        <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm border border-gray-200">
          {predefinedColors.map((color) => (
            <button
              key={color}
              onClick={() => setSolidColor(color)}
              className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                solidColor === color
                  ? "border-rumi-purple ring-2 ring-rumi-purple/20 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color }}
              title={`Set background to ${color}`}
            />
          ))}

          {/* Custom color input */}
          <div className="relative">
            <input
              type="color"
              value={solidColor}
              onChange={(e) => setSolidColor(e.target.value)}
              className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400 cursor-pointer transition-all"
              title="Choose custom color"
            />
          </div>
        </div>
      )}
    </div>
  );
}

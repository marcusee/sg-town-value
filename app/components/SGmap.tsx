"use client";

import React, { useState } from "react";

interface TownData {
  id: string;
  name: string;
  percentage: number;
  x: number; // percentage position (0-100)
  y: number; // percentage position (0-100)
}

// Coordinates positioned for actual Singapore map
// Adjust these x,y values to match your map image
const townData: TownData[] = [
  { id: "sengkang", name: "SENGKANG", percentage: 8.2, x: 72, y: 28 },
  { id: "punggol", name: "PUNGGOL", percentage: 7.3, x: 80, y: 20 },
  { id: "woodlands", name: "WOODLANDS", percentage: 7.1, x: 46, y: 8 },
  { id: "yishun", name: "YISHUN", percentage: 6.8, x: 55, y: 18 },
  { id: "tampines", name: "TAMPINES", percentage: 6.8, x: 85, y: 42 },
  { id: "jurong-west", name: "JURONG WEST", percentage: 6.6, x: 12, y: 48 },
  { id: "bedok", name: "BEDOK", percentage: 5.2, x: 82, y: 55 },
  { id: "hougang", name: "HOUGANG", percentage: 5.1, x: 68, y: 35 },
  { id: "choa-chu-kang", name: "CHOA CHU KANG", percentage: 4.5, x: 25, y: 25 },
  { id: "bukit-batok", name: "BUKIT BATOK", percentage: 4.1, x: 22, y: 40 },
  { id: "ang-mo-kio", name: "ANG MO KIO", percentage: 4.1, x: 55, y: 32 },
  { id: "bukit-merah", name: "BUKIT MERAH", percentage: 3.8, x: 42, y: 62 },
  { id: "bukit-panjang", name: "BUKIT PANJANG", percentage: 3.6, x: 32, y: 28 },
  { id: "toa-payoh", name: "TOA PAYOH", percentage: 3.2, x: 50, y: 45 },
  { id: "kallang-whampoa", name: "KALLANG/WHAMPOA", percentage: 3.1, x: 58, y: 52 },
  { id: "sembawang", name: "SEMBAWANG", percentage: 3.0, x: 52, y: 5 },
  { id: "pasir-ris", name: "PASIR RIS", percentage: 2.9, x: 92, y: 30 },
  { id: "queenstown", name: "QUEENSTOWN", percentage: 2.7, x: 32, y: 55 },
  { id: "geylang", name: "GEYLANG", percentage: 2.5, x: 68, y: 55 },
  { id: "clementi", name: "CLEMENTI", percentage: 2.2, x: 22, y: 55 },
  { id: "jurong-east", name: "JURONG EAST", percentage: 2.0, x: 15, y: 42 },
  { id: "serangoon", name: "SERANGOON", percentage: 1.8, x: 62, y: 40 },
  { id: "bishan", name: "BISHAN", percentage: 1.8, x: 48, y: 38 },
  { id: "central-area", name: "CENTRAL AREA", percentage: 0.8, x: 52, y: 68 },
  { id: "marine-parade", name: "MARINE PARADE", percentage: 0.6, x: 65, y: 68 },
  { id: "bukit-timah", name: "BUKIT TIMAH", percentage: 0.2, x: 38, y: 42 },
];

const getColor = (percentage: number): string => {
  if (percentage >= 8) return "#ef4444";
  if (percentage >= 7) return "#f97316";
  if (percentage >= 6) return "#fb923c";
  if (percentage >= 5) return "#fbbf24";
  if (percentage >= 4) return "#fcd34d";
  if (percentage >= 3) return "#fde047";
  if (percentage >= 2) return "#bef264";
  if (percentage >= 1) return "#86efac";
  if (percentage >= 0.5) return "#67e8f9";
  return "#7dd3fc";
};

const SingaporeHDBMapCircles: React.FC = () => {
  const [hoveredTown, setHoveredTown] = useState<TownData | null>(null);

  // Use any Singapore map image URL here
  //https://comersis.com/c-images/SG/Map-of-Singapore-b.jpg
  // const mapImageUrl = "https://fvmstatic.s3.amazonaws.com/maps/m/SG-EPS-01-0001.png";
  const mapImageUrl = "https://comersis.com/c-images/SG/Map-of-Singapore-b.jpg";

  const circleRadius = 2; // Fixed size for all circles

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
        Singapore HDB Town Distribution
      </h2>
      <p className="text-center text-gray-500 text-sm mb-4">
        Percentage of HDB flats by planning area
      </p>

      {/* Legend */}
      <div className="flex items-center justify-center gap-1 mb-4 flex-wrap">
        <span className="text-xs text-gray-600 mr-1">0%</span>
        {[0.2, 1, 2, 3, 4, 5, 6, 7, 8].map((val) => (
          <div
            key={val}
            className="w-6 h-5 flex items-center justify-center text-[8px] font-medium rounded"
            style={{
              backgroundColor: getColor(val),
              color: val >= 6 ? "#fff" : "#1f2937",
            }}
          >
            {val}
          </div>
        ))}
        <span className="text-xs text-gray-600 ml-1">8%+</span>
      </div>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        {/* Background Map Image */}
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <img
            src={mapImageUrl}
            alt="Singapore Map"
            className="w-full h-full obcject-cover"
          />

          {/* SVG Overlay for circles */}
          <svg
            viewBox="0 0 100 56.25"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Town circles */}
            {townData.map((town) => {
              const scaledY = town.y * 0.5625; // Scale y for 16:9 aspect ratio
              return (
                <g key={town.id}>
                  {/* Shadow */}
                  <circle
                    cx={town.x}
                    cy={scaledY}
                    r={circleRadius + 0.3}
                    fill="rgba(0,0,0,0.4)"
                  />
                  {/* Main circle */}
                  <circle
                    cx={town.x}
                    cy={scaledY}
                    r={circleRadius}
                    fill={getColor(town.percentage)}
                    stroke="#fff"
                    strokeWidth="0.4"
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      filter:
                        hoveredTown?.id === town.id ? "brightness(1.2)" : "none",
                    }}
                    onMouseEnter={() => setHoveredTown(town)}
                    onMouseLeave={() => setHoveredTown(null)}
                  />
                  {/* Percentage label */}
                  <text
                    x={town.x}
                    y={scaledY + 0.2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none"
                    fill={town.percentage >= 6 ? "#fff" : "#1f2937"}
                    fontSize="1.6"
                    fontWeight="bold"
                  >
                    {town.percentage}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover Tooltip */}
        {hoveredTown && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 border border-gray-200 min-w-[160px]">
            <p className="font-bold text-gray-800 text-sm">{hoveredTown.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getColor(hoveredTown.percentage) }}
              />
              <p className="text-xl font-bold text-gray-900">
                {hoveredTown.percentage}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Town List */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          All Towns (sorted by %)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {[...townData]
            .sort((a, b) => b.percentage - a.percentage)
            .map((town) => (
              <div
                key={`list-${town.id}`}
                className={`flex items-center gap-2 p-2 rounded-md transition-colors cursor-default ${hoveredTown?.id === town.id
                  ? "bg-gray-200"
                  : "bg-gray-50 hover:bg-gray-100"
                  }`}
                onMouseEnter={() => setHoveredTown(town)}
                onMouseLeave={() => setHoveredTown(null)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getColor(town.percentage) }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-gray-700 truncate leading-tight">
                    {town.name}
                  </p>
                  <p className="text-xs font-semibold text-gray-900">
                    {town.percentage}%
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SingaporeHDBMapCircles;
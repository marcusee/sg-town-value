"use client";

import React, { useState } from "react";
import OneMap from "./OneMap";
import { useHoverStore } from "../store/HoverStore";
import { useTownStore } from "../store/TownStore";
import FilterControl from "./FilterControl";

const SGHeatMap: React.FC = () => {
  const {hoveredTownInfo, setHovered} = useHoverStore();
  const {towns} = useTownStore();
  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
        Singapore HDB Resale Price Distribution
      </h2>
      <div className="flex justify-center py-2">
        <FilterControl />
      </div>
      <p className="text-center text-gray-500 text-sm mb-4">
        AVG psf price by town
      </p>

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        {/* Background Map Image */}
        <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
          <OneMap />
        </div>

        {/* Hover Tooltip */}
        {hoveredTownInfo && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3 border border-gray-200 min-w-[160px]">
            <p className="font-bold text-gray-800 text-sm">{hoveredTownInfo.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: hoveredTownInfo.color }}
              />
              <p className="text-xl font-bold text-gray-900">
                ${hoveredTownInfo.avgPsf} PSF
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Town List */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          All Towns
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {[...towns]
            .sort((a, b) => b.avgPsf - a.avgPsf)
            .map((town) => (
              <div
                key={`list-${town.id}`}
                className={`flex items-center gap-2 p-2 rounded-md transition-colors cursor-default ${hoveredTownInfo?.id === town.id
                  ? "bg-gray-200"
                  : "bg-gray-50 hover:bg-gray-100"
                  }`}
                onMouseEnter={() => setHovered(town)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: town.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium text-gray-700 truncate leading-tight">
                    {town.name}
                  </p>
                  <p className="text-xs font-semibold text-gray-900">
                    ${town.displayValue} PSF
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SGHeatMap;
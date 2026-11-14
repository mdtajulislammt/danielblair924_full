"use client";

import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface LocationPoint {
  name: string;
  coordinates: [number, number]; // [Longitude, Latitude]
}

interface NeonMapProps {
  startLocation?: LocationPoint;
  endLocation?: LocationPoint;
}

export default function InteractiveNeonMap({
  startLocation = { name: "Dhaka", coordinates: [90.4125, 23.8103] },
  endLocation = { name: "Italy (Rome)", coordinates: [12.4964, 41.9028] },
}: NeonMapProps) {
  const [tooltipContent, setTooltipContent] = useState<string>("");

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-borderColor mt-4 bg-[#050802] p-4 shadow-2xl">
      {/* Top Ambient Green Glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #5b8915 0%, #34500c 45%, transparent 75%)",
        }}
      />

      {/* Floating Tooltip for Country Hover */}
      {tooltipContent && (
        <div className="pointer-events-none absolute left-6 top-6 z-20 rounded-lg border border-borderColor bg-[#0c1605]/90 px-3 py-1.5 text-xs font-semibold text-primaryColor shadow-lg backdrop-blur-md">
          {tooltipContent}
        </div>
      )}

      <ComposableMap
        projectionConfig={{ scale: 140 }}
        className="h-[450px] w-full cursor-grab active:cursor-grabbing"
      >
        {/* Enables Zoom and Pan/Move */}
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={5} center={[10, 20]}>
          {/* Countries Layer */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setTooltipContent(countryName)}
                    onMouseLeave={() => setTooltipContent("")}
                    fill="#080e03"
                    stroke="#2e4d0a"
                    strokeWidth={0.6}
                    style={{
                      default: { outline: "none", transition: "all 0.2s" },
                      hover: {
                        fill: "#142606",
                        stroke: "#84cc16",
                        strokeWidth: 1,
                        outline: "none",
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Dynamic Start to End Route */}
          <Line
            from={startLocation.coordinates}
            to={endLocation.coordinates}
            stroke="#84cc16"
            strokeWidth={1}
            strokeDasharray="7 2"
            className="drop-shadow-[0_0_10px_#84cc16]"
          />

          {/* Start Location Marker */}
          <Marker coordinates={startLocation.coordinates}>
            <circle r={2} fill="#84cc16" className="animate-ping opacity-75" />
            <circle r={2} fill="#84cc16" />
            <text
              textAnchor="middle"
              y={-14}
              className="text-[10px] font-bold fill-primaryColor drop-shadow-md select-none"
            >
              {startLocation.name}
            </text>
          </Marker>

          {/* End Location Marker */}
          <Marker coordinates={endLocation.coordinates}>
            <circle r={2} fill="#84cc16" className="animate-ping opacity-75" />
            <circle r={2} fill="#84cc16" />
            <text
              textAnchor="middle"
              y={-14}
              className="text-[10px] font-bold fill-primaryColor drop-shadow-md select-none"
            >
              {endLocation.name}
            </text>
          </Marker>
        </ZoomableGroup>
      </ComposableMap>

      {/* Footer Info */}
      <div className="relative z-10 flex items-center justify-between border-t border-[#1b280d] pt-3 text-[11px] text-zinc-500">
        <span>Scroll to Zoom • Drag to Move</span>
        <span>
          Route: <strong className="text-white">{startLocation.name}</strong> &rarr;{" "}
          <strong className="text-white">{endLocation.name}</strong>
        </span>
      </div>
    </div>
  );
}
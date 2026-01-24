"use client";

import React, { useRef, useState } from "react";
import type { FeatureCollection, Geometry, Point } from "geojson";
import ReactMapGL, { Layer, Source, Popup, MapLayerMouseEvent } from "react-map-gl/maplibre";
import { TownInfo, initialTownInfo } from "../data/towndata";
import { useHoverStore } from "../store/HoverStore";
import { useTownStore } from "../store/TownStore";

const OneMap: React.FC = () => {
  const mapRef = useRef<any>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const { hoveredTownInfo, setHovered } = useHoverStore();
  const { towns } = useTownStore()

  const features = towns.map(info => {
    return {
      type: "Feature" as const,
      properties: info,
      geometry: {
        type: "Point" as const,
        coordinates: [info.x, info.y]
      }
    }
  })

  const points: FeatureCollection<Point, TownInfo> = {
    type: "FeatureCollection",
    features: features
  };


  let zoom = isMobile ? 9.5 : 10  // 👈 a bit further out on mobile

  return (
    <div className="w-full h-full absolute inset-0">
      <ReactMapGL
        ref={mapRef}
        initialViewState={{
          longitude: 103.82,    // center of SG
          latitude: 1.35,       // Moved up to see north coastline
          zoom: zoom,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://www.onemap.gov.sg/maps/json/raster/mbstyle/Grey.json"
        maxBounds={[
          [103.596, 1.205],   // SW corner - raised min latitude slightly
          [104.1, 1.475],     // NE corner - lowered max latitude
        ]}
        onMouseMove={(e: MapLayerMouseEvent) => {
          if (!mapRef) return;
          const map = mapRef.current.getMap();

          if(!map) return;
          const hoveredFeature = map?.queryRenderedFeatures(e.point)?.at(0);

          if (!hoveredFeature) return;

          const canvas = map.getCanvas();
          if (!canvas) return;

          if (hoveredFeature) {
            canvas.style.cursor = "pointer";
            if (hoveredFeature.properties.id !== hoveredTownInfo?.id) {
              setHovered(hoveredFeature.properties)
            }
          }
          else {
            canvas.style.cursor = "";
            setHovered(null)
          }
        }}
        attributionControl={false}

        /* 🔥 Disable all movement */
        dragPan={true}
        scrollZoom={true}
        dragRotate={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
        keyboard={false}
        interactive={true}     // ← easiest way: makes map fully static
      >
        <Source id="points" type="geojson" data={points} >
          <Layer
            id="point-circle"
            type="circle"
            paint={{
              "circle-radius": zoom * 2.5, 
              "circle-color": ["get", "color"], 
              "circle-stroke-width": 2,
              "circle-stroke-color": "#ffffff",
              "circle-opacity": 0.3,
            }}
          />

          {/* 📝 Text: (avg $123.5 psf) */}
          <Layer
            id="point-label"
            type="symbol"
            layout={{
              "text-field": [
                "concat",
                "$",
                ["to-string", ["get", "displayValue"]],
                ""
              ],
              "text-size": zoom + 5,
              "text-anchor": "center",  
              "text-offset": [0, 0],     
              "text-font": ["Open Sans Bold"], 

            }}
            paint={{
              "text-color": "#1f2937",        
              "text-halo-color": "#ffffff",     
              "text-halo-width": 2,             
            }}
          />
        </Source>
      </ReactMapGL>
    </div>
  );
};

export default OneMap;

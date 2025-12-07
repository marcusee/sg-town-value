"use client";

import React, { useRef, useState } from "react";
import type { FeatureCollection, Geometry, Point } from "geojson";
import ReactMapGL, { Layer, Source, Popup, MapLayerMouseEvent } from "react-map-gl/maplibre";
import { TownInfo, initialTownInfo } from "../data/towndata";
import { useHoverStore } from "../store/HoverStore";
import { useTownStore } from "../store/TownStore";

const OneMap: React.FC = () => {
  const mapRef = useRef<any>(null);
  const windowWidth = window.innerWidth;
  const isMobile = typeof window !== "undefined" && windowWidth < 768;
  const {hoveredTownInfo, setHovered} = useHoverStore();
  const {townInfos} = useTownStore()

  const features = townInfos.map(info => {
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
          [103.596, 1.1443],
          [104.1, 1.6],
        ]}
        onMouseMove={(e: MapLayerMouseEvent) => {
          if (!mapRef) return;
          const map = mapRef.current.getMap();
          const hoveredFeature = map.queryRenderedFeatures(e.point)?.at(0);

          if (hoveredFeature ) {
            if (hoveredFeature.properties.id !== hoveredTownInfo?.id) {
              console.log(hoveredFeature.properties)
              setHovered(hoveredFeature.properties)
            }
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
              "circle-radius": zoom * 2.5,              // bigger so text feels “inside”
              "circle-color": "#ff0000",
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
              // (avg $<value> psf)
              "text-field": [
                "concat",
                "$",
                ["to-string", ["get", "avgPsf"]],
                ""
              ],
              "text-size": zoom + 5,
              "text-anchor": "center",   // center on the point
              "text-offset": [0, 0],     // [0,0] = right on top of the circle
              "text-font": ["Open Sans Regular"],

            }}
            paint={{
              "text-color": "#ffffff",
              "text-halo-color": "#000000",
              "text-halo-width": 1,
            }}
          />
        </Source>
      </ReactMapGL>
    </div>
  );
};

export default OneMap;

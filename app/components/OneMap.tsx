"use client";

import React from "react";
import type { FeatureCollection, Geometry, Point } from "geojson";
import ReactMapGL, { Layer, Source } from "react-map-gl/maplibre";
import { townInfo } from "../data/towndata";

const OneMap: React.FC = () => {
  const windowWidth = window.innerWidth;
  const isMobile = typeof window !== "undefined" && windowWidth < 768;
  // 👇 Properly typed GeoJSON

  const features = townInfo.map(info => {
    return {
      type: "Feature" as const,
      properties: {
        title: `${info.name}`,
        avgPsf: 1233,
      },
      geometry: {
        type: "Point" as const,
        coordinates: [info.x, info.y]
      }
    }
  })

  const points: FeatureCollection<Point, { title: string; avgPsf: number }> = {
    type: "FeatureCollection",
    features: features
  };

  // const points: FeatureCollection<Point, { title: string; avgPsf: number }> = () => {
  //   return {
  //     type: "FeatureCollection",
  //     features: [
  //       {
  //         type: "Feature",
  //         properties: {
  //           title: "Sembawang",
  //           avgPsf: 1233,
  //         },
  //         geometry: {
  //           type: "Point",
  //           coordinates: [103.8198, 1.4432],
  //         },
  //       },
  //     ],
  //   }
  // };

  let zoom = isMobile ? 9.5 : 10  // 👈 a bit further out on mobile


  return (
    <div className="w-full h-full absolute inset-0">
      <ReactMapGL
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
        <Source id="points" type="geojson" data={points}>
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

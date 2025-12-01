"use client";

import React from "react";
import ReactMapGL from "react-map-gl/maplibre";

const OneMap: React.FC = () => {
    return (
        <div className="w-full h-full absolute inset-0">
            <ReactMapGL
                initialViewState={{
                    longitude: 103.82,    // center of SG
                    latitude: 1.35,       // Moved up to see north coastline
                    zoom: 10,             // Adjusted zoom to fit Singapore better
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
            />
        </div>
    );
};

export default OneMap;

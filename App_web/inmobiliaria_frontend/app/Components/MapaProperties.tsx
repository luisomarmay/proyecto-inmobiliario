"use client";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useState } from "react";

export default function MapaProperties({
  properties,
  hoveredId,
}: {
  properties: any[];
  hoveredId: string | null;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const validProperties = properties.filter(
    (p) => p.lat !== 19.4326 && p.lng !== -99.1332
  );

  const centerLat =
    validProperties.length > 0
      ? validProperties.reduce((sum, p) => sum + p.lat, 0) / validProperties.length
      : 19.4326;

  const centerLng =
    validProperties.length > 0
      ? validProperties.reduce((sum, p) => sum + p.lng, 0) / validProperties.length
      : -99.1332;

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={{ lat: centerLat, lng: centerLng }}
        defaultZoom={12}
        gestureHandling="greedy"
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
      >
        {properties.map((property) => (
          <AdvancedMarker
            key={property.id}
            position={{ lat: property.lat, lng: property.lng }}
            onClick={() => setSelectedId(property.id)}
            zIndex={hoveredId === property.id ? 999 : 1}
          >
            <div
              className={`
                font-semibold text-xs px-2 py-1 rounded-full shadow-md border
                cursor-pointer transition-all duration-150
                ${
                  hoveredId === property.id || selectedId === property.id
                    ? "bg-[#14213d] text-white border-[#14213d] scale-110"
                    : "bg-white text-[#14213d] border-black/10 hover:bg-[#14213d] hover:text-white"
                }
              `}
            >
              ${property.price?.toLocaleString()}
            </div>
          </AdvancedMarker>
        ))}
      </Map>
    </APIProvider>
  );
}
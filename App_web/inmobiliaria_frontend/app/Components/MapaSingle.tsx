"use client";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import {House} from "lucide-react";

export default function MapaSingle({ lat, lng }: { lat: number; lng: number }) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        style={{ width: "100%", height: "100%" }}
        defaultCenter={{ lat, lng }}
        defaultZoom={15}
        gestureHandling="greedy"
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        disableDefaultUI={true}
      >
        <AdvancedMarker position={{ lat, lng }}>
          <div className="bg-[#14213d] text-white p-2 rounded-full shadow-lg">
            <House/>
          </div>
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
}
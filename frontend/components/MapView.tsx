"use client";
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#dc2626",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

interface Issue {
  id: string;
  title: string;
  severity: string;
  status: string;
  issue_type: string;
  location?: { lat: number; lng: number; address?: string };
}

interface Props {
  issues?: Issue[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

export default function MapView({ issues = [], center, zoom = 13, onMapClick, selectedLocation }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const selectedMarkerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const defaultCenter = center || { lat: 17.385, lng: 78.4867 };

      const map = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        ],
      });

      mapInstance.current = map;

      if (onMapClick) {
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    issues.forEach((issue) => {
      const loc = issue.location;
      if (!loc?.lat || !loc?.lng) return;

      const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map: mapInstance.current!,
        title: issue.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: SEVERITY_COLORS[issue.severity] || "#94a3b8",
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family:system-ui;padding:4px;min-width:160px">
            <div style="font-weight:600;color:#0f172a;margin-bottom:4px">${issue.title}</div>
            <div style="font-size:12px;color:#64748b">${issue.issue_type?.replace("_", " ")}</div>
            <div style="margin-top:6px">
              <a href="/issues/${issue.id}" style="color:#1d4ed8;font-size:12px;text-decoration:none">View Details →</a>
            </div>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstance.current!, marker);
      });

      markersRef.current.push(marker);
    });
  }, [issues]);

  useEffect(() => {
    if (!mapInstance.current) return;
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setMap(null);
    }
    if (selectedLocation) {
      selectedMarkerRef.current = new google.maps.Marker({
        position: selectedLocation,
        map: mapInstance.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#1d4ed8",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
        title: "Selected Location",
      });
      mapInstance.current.panTo(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-xl" />
  );
}
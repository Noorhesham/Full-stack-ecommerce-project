"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import L from "leaflet";

interface MapComponentProps {
  setLocation?: (location: { lat: number; lng: number }) => void;
  defaultLocation?: { lat: number; lng: number };
}
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
const MapComponent: React.FC<MapComponentProps> = ({ setLocation, defaultLocation }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (defaultLocation) {
      const { lat, lng } = defaultLocation;
      setPosition(new L.LatLng(lat, lng));
      setLocation && setLocation({ lat, lng });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude, position);
          setPosition(new L.LatLng(latitude, longitude));
          setLocation && setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
          // Fallback to a default location, e.g., center of a city
          const fallbackPosition = new L.LatLng(51.505, -0.09); // Example: London
          setPosition(fallbackPosition);
          setLocation && setLocation({ lat: 51.505, lng: -0.09 });
        }
      );
    }
  }, [defaultLocation, setLocation]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (!setLocation) return;
        const { lat, lng } = e.latlng;
        setPosition(e.latlng);
        setLocation && setLocation({ lat, lng });
      },
    });
    return null;
  };

  return (
    mounted &&
    position && (
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <MapClickHandler />
      </MapContainer>
    )
  );
};

export default MapComponent;

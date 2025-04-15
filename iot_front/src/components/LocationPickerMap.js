"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Importar los estilos CSS de Leaflet

// Fix para iconos rotos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function LocationMarker({ onChange, lat, lng }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onChange({ lat, lng });
    },
    load() {
      map.invalidateSize(); // Forzar redimensionamiento al cargar
    }
  });

  return lat && lng ? <Marker position={[lat, lng]} /> : null;
}

export default function LocationPickerMap({ lat, lng, onChange }) {
  const position = [lat || 6.1910683, lng || -75.595655]; // valor por defecto (Medellín, Colombia)

  return (
    <div style={{ 
      position: "relative",
      height: "70vh",
      width: "100%",
      zIndex: 0
    }}>
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        touchZoom={true}
        dragging={true}
        whenCreated={(map) => {
          setTimeout(() => {
            map.invalidateSize(); // Solución para tiles faltantes
          }, 100);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        <LocationMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
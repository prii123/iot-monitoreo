// // components/DeviceMap.tsx
// 'use client'

// import { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import API_BASE_URL from "@/utils/api";

// // Fix para los iconos de marcador
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// // @ts-ignore
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconUrl: markerIcon.src,
//   iconRetinaUrl: markerIconRetina.src,
//   shadowUrl: markerShadow.src,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   tooltipAnchor: [16, -28],
//   shadowSize: [41, 41]
// });



// export default function DeviceMap() {
//   const [devices, setDevices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDevices = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/devices/loc`);
//         if (!response.ok) {
//           throw new Error('Error al obtener los dispositivos');
//         }
//         const data = await response.json();
//         setDevices(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Error desconocido');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDevices();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-900/20 border border-red-900/30 rounded p-4 text-red-300">
//         Error: {error}
//       </div>
//     );
//   }

//   // Estilo personalizado para los marcadores basado en el estado
//   const createCustomIcon = (status) => {
//     const color = status === 'online' ? '#2ecc71' : '#e74c3c';
    
//     return new L.DivIcon({
//       className: 'custom-marker',
//       html: `
//         <div style="
//           position: relative;
//           width: 24px;
//           height: 24px;
//           background: ${color};
//           border: 2px solid #fff;
//           border-radius: 50%;
//           transform: translate(-12px, -12px);
//           box-shadow: 0 0 10px rgba(0,0,0,0.3);
//         ">
//           <div style="
//             position: absolute;
//             width: 8px;
//             height: 8px;
//             background: rgba(255,255,255,0.7);
//             border-radius: 50%;
//             top: 4px;
//             left: 4px;
//           "></div>
//         </div>
//       `,
//       iconSize: [24, 24],
//       iconAnchor: [12, 12]
//     });
//   };

//   return (
//     <div className="h-full w-full rounded-lg overflow-hidden border border-gray-700">
//       <MapContainer
//         center={[20, 0]}
//         zoom={2}
//         style={{ height: '100%', width: '100%', backgroundColor: '#1a1a1a' }}
//         attributionControl={false}
//       >
//         <TileLayer
//           url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
        
//         {devices.map((device) => (
//           <Marker
//             key={device._id}
//             position={[device.location.lat, device.location.lng]}
//             icon={createCustomIcon(device.status)}
//           >
//             <Popup className="dark-popup">
//               <div className="text-sm">
//                 <h3 className="font-bold text-blue-400">{device.name}</h3>
//                 <p>Tipo: <span className="text-gray-300">{device.type}</span></p>
//                 <p>Estado: <span className={device.status === 'online' ? 'text-green-400' : 'text-red-400'}>{device.status}</span></p>
//                 <p>Última conexión: <span className="text-gray-400">{new Date(device.lastSeen).toLocaleString()}</span></p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Lat: {device.location.lat.toFixed(6)}, Lng: {device.location.lng.toFixed(6)}
//                 </p>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>

//       <style jsx global>{`
//         .dark-popup .leaflet-popup-content-wrapper {
//           background: #2b2b2b;
//           color: #e0e0e0;
//           border-radius: 4px;
//           box-shadow: 0 3px 14px rgba(0,0,0,0.4);
//         }
//         .dark-popup .leaflet-popup-tip {
//           background: #2b2b2b;
//         }
//         .dark-popup .leaflet-popup-content {
//           margin: 8px 12px;
//         }
//         .leaflet-container a.leaflet-popup-close-button {
//           color: #999;
//         }
//         .leaflet-container a.leaflet-popup-close-button:hover {
//           color: #fff;
//         }
//       `}</style>
//     </div>
//   );
// }

'use client';

import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { useMemo, useState } from 'react';




export default function GoogleMapComponent({ devices }) {
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  // Centrar en Colombia
  const center = useMemo(() => ({ lat: 4.5709, lng: -74.2973 }), []);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <GoogleMap
        zoom={6}
        center={center}
        mapContainerClassName="map-container"
      >
        {devices.map((device) => (
          <Marker
            key={device._id}
            position={{ lat: device.location.lat, lng: device.location.lng }}
            onClick={() => setSelectedDevice(device)}
          />
        ))}
        
        {selectedDevice && (
          <InfoWindow
            position={{
              lat: selectedDevice.location.lat,
              lng: selectedDevice.location.lng
            }}
            onCloseClick={() => setSelectedDevice(null)}
          >
            <div>
              <h3>{selectedDevice.name}</h3>
              <p>Tipo: {selectedDevice.type}</p>
              <p>Estado: {selectedDevice.status}</p>
              <p>Ubicación: {selectedDevice.location.lat}, {selectedDevice.location.lng}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
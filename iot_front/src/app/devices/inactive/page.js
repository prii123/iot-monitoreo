'use client';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../../../utils/api';

export default function InactiveDevicesPage() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/devices/inactive`)
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Dispositivos Inactivos (más de 10 min)
        </h1>

        {devices.length === 0 ? (
          <p className="text-gray-500">No hay dispositivos inactivos.</p>
        ) : (
          <ul className="space-y-4">
            {devices.map((device) => (
              <li
                key={device._id}
                className="p-4 border border-red-200 bg-red-50 rounded-lg shadow-sm hover:bg-red-100 transition"
              >
                <div className="text-lg font-medium text-red-700">{device.name}</div>
                <div className="text-sm text-gray-600">
                  Última conexión:{' '}
                  <span className="font-semibold text-gray-800">
                    {new Date(device.lastSeen).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

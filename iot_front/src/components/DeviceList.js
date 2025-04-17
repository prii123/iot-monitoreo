import React from 'react';
import { authFetch } from '@/lib/api/interceptor';
import API_BASE_URL from '@/utils/api';

export default function DeviceList({ devices }) {
  const handleSetOffline = async (deviceId) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/devices/updateOffline/${deviceId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      // Recargar la página para ver los cambios
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo actualizar el dispositivo');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-4">
      <ul className="space-y-3">
        {devices.map((device) => (
          <li
            key={device._id}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex justify-between items-center"
          >
            <div>
              <div className="text-lg font-medium text-indigo-700">{device.name}</div>
              <div className="text-sm text-gray-600">
                Tipo: {device.type} — Estado:{' '}
                <span
                  className={`font-semibold ${device.status === 'active' ? 'text-green-600' : 'text-red-500'
                    }`}
                >
                  {device.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleSetOffline(device._id)}
              className="ml-4 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm transition flex items-center"
              title="Marcar como offline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                />
              </svg>
              Offline
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
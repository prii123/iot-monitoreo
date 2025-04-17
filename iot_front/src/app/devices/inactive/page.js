'use client';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../../../utils/api';
import { authFetch } from '@/lib/api/interceptor';
import DashboardLayout from '@/app/layoutSidebar';

export default function InactiveDevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchInactiveDevices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authFetch(`${API_BASE_URL}/devices/inactive`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setDevices(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching inactive devices:', err);
      setError(err.message || 'Error al cargar dispositivos inactivos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveDevices();

    // Opcional: Actualización periódica cada 5 minutos
    const intervalId = setInterval(fetchInactiveDevices, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    fetchInactiveDevices();
  };

  if (loading && devices.length === 0) {
    return (
      <DashboardLayout>
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-white shadow-md rounded-xl p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Dispositivos Inactivos (más de 10 min)
            </h1>
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </main>
      </DashboardLayout>

    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-white shadow-md rounded-xl p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Dispositivos Inactivos (más de 10 min)
            </h1>
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-bold">Error</p>
              <p>{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-4 rounded transition"
              >
                Reintentar
              </button>
            </div>
          </div>
        </main>
      </DashboardLayout>

    );
  }

  return (
    <DashboardLayout>
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Dispositivos Inactivos (más de 10 min)
            </h1>
            <div className="flex items-center space-x-3">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Actualizado: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleRefresh}
                className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-1 px-3 rounded transition"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Actualizar
              </button>
            </div>
          </div>

          {devices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay dispositivos inactivos en este momento.</p>
              <p className="text-sm text-gray-400 mt-1">Todos los dispositivos están conectados correctamente.</p>
            </div>
          ) : (
            <>
              <div className="mb-3 text-sm text-gray-500">
                Mostrando {devices.length} dispositivo{devices.length !== 1 ? 's' : ''} inactivo{devices.length !== 1 ? 's' : ''}
              </div>
              <ul className="space-y-3">
                {devices.map((device) => (
                  <li
                    key={device._id}
                    className="p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-red-700">{device.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          ID: <span className="font-mono text-gray-800">{device.deviceId}</span>
                        </div>
                      </div>
                      <div className="text-xs bg-red-200 text-red-800 py-1 px-2 rounded-full">
                        Inactivo
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Última conexión:{' '}
                      <span className="font-semibold text-gray-800">
                        {new Date(device.lastSeen).toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </DashboardLayout>

  );
}
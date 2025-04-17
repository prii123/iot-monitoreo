'use client';
import { useEffect, useState } from 'react';
import DeviceList from '../../components/DeviceList';
import API_BASE_URL from '../../utils/api';
import { authFetch } from '@/lib/api/interceptor';
import DashboardLayout from '../layoutSidebar';

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await authFetch(`${API_BASE_URL}/devices`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setDevices(data);
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError(err.message || 'Error al cargar los dispositivos');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <main className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Listado de Dispositivos</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </DashboardLayout>

    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <main className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Listado de Dispositivos</h1>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
            >
              Reintentar
            </button>
          </div>
        </main>
      </DashboardLayout>

    );
  }

  return (
    <DashboardLayout>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Listado de Dispositivos</h1>
        <DeviceList devices={devices} />
      </main>
    </DashboardLayout>

  );
}
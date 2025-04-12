'use client';
import { useEffect, useState } from 'react';
import DeviceList from '../../components/DeviceList';
import API_BASE_URL from '../../utils/api';

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/devices`)
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Listado de Dispositivos</h1>
      <DeviceList devices={devices} />
    </main>
  );
}

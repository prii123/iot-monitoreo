'use client';
import { useEffect, useState, useCallback } from 'react';
import CompanyList from '../../components/CompanyList';
import API_BASE_URL from '../../utils/api';
import { authFetch } from '@/lib/api/interceptor';
import DashboardLayout from '../layoutSidebar';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Moved fetchCompanies outside useEffect and memoized it
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authFetch(`${API_BASE_URL}/companies`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err.message || 'Error al cargar las compañías');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this is created once

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]); // Now fetchCompanies is a dependency

  if (loading) {
    return (
      <DashboardLayout>
        <main className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Listado de Compañías</h1>
          <div className="flex justify-center items-center h-64">
            <p>Cargando...</p>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <main className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Listado de Compañías</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Listado de Compañías</h1>
        <CompanyList
          companies={companies}
          apiBaseUrl={API_BASE_URL}
          refreshData={fetchCompanies} // Now this will work
        />
      </main>
    </DashboardLayout>
  );
}
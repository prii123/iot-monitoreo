'use client';
import { useEffect, useState } from 'react';
import CompanyList from '../../components/CompanyList';
import API_BASE_URL from '../../utils/api';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/companies`)
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Listado de Compañías</h1>
      <CompanyList companies={companies} apiBaseUrl={API_BASE_URL} />
    </main>
  );
}

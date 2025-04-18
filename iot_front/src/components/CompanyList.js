

import React, { useState } from 'react';
import { authFetch } from '@/lib/api/interceptor';

export default function CompanyList({ companies, apiBaseUrl, refreshData }) {
  const [devicesByCompany, setDevicesByCompany] = useState({});
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCompanyClick = async (companyId) => {
    if (activeCompanyId === companyId) {
      setActiveCompanyId(null);
      setDevicesByCompany((prev) => ({ ...prev, [companyId]: [] }));
    } else {
      try {
        setActiveCompanyId(companyId);
        const res = await authFetch(`${apiBaseUrl}/devices/company/${companyId}`);
        const data = await res.json();
        setDevicesByCompany((prev) => ({ ...prev, [companyId]: data }));
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    }
  };

  const handleDeactivateCompany = async (companyId) => {
    if (!window.confirm('¿Estás seguro de querer inactivar esta empresa y todos sus dispositivos?')) {
      return;
    }

    setIsUpdating(true);
    try {
      // 1. Inactivar la empresa
      const companyResponse = await fetch(`${apiBaseUrl}/companies/updateStatus/${companyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!companyResponse.ok) throw new Error('Error al inactivar la empresa');

      // 2. Inactivar todos sus dispositivos
      const devices = devicesByCompany[companyId] || [];
      await Promise.all(
        devices.map(device => 
          fetch(`${apiBaseUrl}/devices/updateOffline/${device._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        )
      );

      // 3. Actualizar la lista
      await refreshData(); // Cambiado de refreshCompanies a refreshData
      setActiveCompanyId(null);
      alert('Empresa y dispositivos inactivados correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al inactivar');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-4">
      <ul className="space-y-3">
        {companies.map((company) => (
          <li
            key={company._id}
            className={`p-0 border border-gray-200 rounded-lg transition ${
              activeCompanyId === company._id ? 'border-blue-300' : ''
            }`}
          >
            <div
              className={`cursor-pointer p-4 transition-all ${
                activeCompanyId === company._id
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
              onClick={() => handleCompanyClick(company._id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{company.name}</span>
                  {company.status === 'inactive' && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      Inactiva
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(company._id);
                      alert('ID copied to clipboard');
                    }}
                    className="text-sm text-gray-500 hover:text-blue-600 focus:outline-none"
                    title={`ID completo: ${company._id}`} // Mostrar tooltip con ID completo
                  >
                    <span className="border-b-2 border-transparent hover:border-blue-500 cursor-pointer">
                      {company._id.substring(0, 20)}...
                    </span>
                  </button>
                  {company.status !== 'inactive' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeactivateCompany(company._id);
                      }}
                      className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-full flex items-center"
                      disabled={isUpdating}
                      title="Inactivar empresa y dispositivos"
                    >
                      {isUpdating ? (
                        <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
                        </svg>
                      )}
                      Inactivar
                    </button>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600">{company.email}</div>
            </div>

            {activeCompanyId === company._id && devicesByCompany[company._id] && (
              <div className="px-4 pb-4">
                <ul className="mt-2 space-y-2 border-t pt-3 text-sm text-gray-700">
                  {devicesByCompany[company._id].length === 0 ? (
                    <li className="text-gray-400 italic">No devices</li>
                  ) : (
                    devicesByCompany[company._id].map((device) => (
                      <li key={device._id} className="pl-2 border-l-2 border-blue-200 flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{device.name}</div>
                          <div className="text-xs text-gray-500">
                            Type: {device.type} | Status: {device.status}
                          </div>
                          {device.location && (
                            <div className="text-xs text-gray-400">
                              Location: {device.location.lat}, {device.location.lng}
                            </div>
                          )}
                        </div>
                        {device.status === 'online' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              fetch(`${apiBaseUrl}/devices/updateOffline/${device._id}`, {
                                method: 'PATCH',
                              }).then(() => {
                                // Actualizar el estado local
                                setDevicesByCompany(prev => ({
                                  ...prev,
                                  [company._id]: prev[company._id].map(d => 
                                    d._id === device._id ? {...d, status: 'offline'} : d
                                  )
                                }));
                              });
                            }}
                            className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 px-2 py-1 rounded flex items-center"
                          >
                            <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
                            </svg>
                            Offline
                          </button>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
// import React, { useState } from 'react';
// // import API_BASE_URL from '@/utils/api';

// export default function CompanyList({ companies, apiBaseUrl }) {
//   const [devicesByCompany, setDevicesByCompany] = useState({});
//   const [activeCompanyId, setActiveCompanyId] = useState(null); // Estado para la empresa activa

//   const handleCompanyClick = async (companyId) => {
//     if (activeCompanyId === companyId) {
//       // Si la empresa ya está activa, colapsa la lista
//       setActiveCompanyId(null);
//       setDevicesByCompany((prev) => ({
//         ...prev,
//         [companyId]: [],
//       }));
//     } else {
//       // Si no, hace la solicitud
//       try {
//         setActiveCompanyId(companyId); // Establece la empresa como activa

//         const res = await fetch(`${apiBaseUrl}/devices/company/${companyId}`);
//         const data = await res.json();

//         setDevicesByCompany((prev) => ({
//           ...prev,
//           [companyId]: data,
//         }));

//         console.log('Devices response:', data);
//       } catch (error) {
//         console.error('Error fetching devices:', error);
//       }
//     }
//   };

//   return (
//     <div className="bg-white shadow-md rounded-xl p-6 mt-4">
//       <ul className="space-y-3">
//         {companies.map((company) => (
//           <li
//             key={company._id}
//             className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
//           >
//             <div
//               className={`cursor-pointer text-lg font-medium ${
//                 activeCompanyId === company._id ? 'text-blue-500' : 'text-blue-700'
//               }`}
//               onClick={() => handleCompanyClick(company._id)}
//               style={{ pointerEvents: activeCompanyId && activeCompanyId !== company._id ? 'none' : 'auto' }} // Desactiva el click en otras empresas
//             >
//               {company.name}
//             </div>
//             <div className="text-sm text-gray-600">{company.email}</div>

//             {/* Devices list */}
//             {devicesByCompany[company._id] && (
//               <ul className="mt-3 space-y-2 border-t pt-2 text-sm text-gray-700">
//                 {devicesByCompany[company._id].length === 0 ? (
//                   <li className="text-gray-400 italic">No devices</li>
//                 ) : (
//                   devicesByCompany[company._id].map((device) => (
//                     <li key={device._id} className="pl-2 border-l-2 border-blue-500">
//                       <div className="font-semibold">{device.name}</div>
//                       <div className="text-xs text-gray-500">
//                         Type: {device.type} | Status: {device.status}
//                       </div>
//                       {device.location && (
//                         <div className="text-xs text-gray-400">
//                           Location: {device.location.lat}, {device.location.lng}
//                         </div>
//                       )}
//                     </li>
//                   ))
//                 )}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



import React, { useState } from 'react';
// import API_BASE_URL from '@/utils/api';

export default function CompanyList({ companies, apiBaseUrl }) {
  const [devicesByCompany, setDevicesByCompany] = useState({});
  const [activeCompanyId, setActiveCompanyId] = useState(null); // Estado para la empresa activa

  const handleCompanyClick = async (companyId) => {
    if (activeCompanyId === companyId) {
      // Si la empresa ya está activa, colapsa la lista
      setActiveCompanyId(null);
      setDevicesByCompany((prev) => ({
        ...prev,
        [companyId]: [],
      }));
    } else {
      // Si no, hace la solicitud
      try {
        setActiveCompanyId(companyId); // Establece la empresa como activa

        const res = await fetch(`${apiBaseUrl}/devices/company/${companyId}`);
        const data = await res.json();

        setDevicesByCompany((prev) => ({
          ...prev,
          [companyId]: data,
        }));

        console.log('Devices response:', data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-4">
      <ul className="space-y-3">
        {companies.map((company) => (
          <li
            key={company._id}
            className={`p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition ${
              activeCompanyId === company._id
                ? '' // No aplica el color de fondo azul si está activa
                : 'bg-blue-100' // Color azul claro si no está activa
            }`}
          >
<div
  className={`cursor-pointer text-lg font-medium p-4 rounded-lg transition-all ${
    activeCompanyId === company._id
      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
      : 'bg-gray-100 text-blue-700 hover:bg-blue-200'
  }`}
  onClick={() => handleCompanyClick(company._id)}
  style={{
    pointerEvents: activeCompanyId && activeCompanyId !== company._id ? 'none' : 'auto',
  }}
>
  <div className="flex justify-between items-center">
    {/* Nombre de la empresa */}
    <span className="font-semibold">{company.name}</span>

    {/* ID de la empresa - clickeable */}
    <button
      onClick={(e) => {
        e.stopPropagation(); // Evita que se active el clic de la empresa
        navigator.clipboard.writeText(company._id); // Copia el ID al portapapeles
        alert('ID copied to clipboard'); // Mensaje de confirmación
      }}
      className="text-sm text-gray-500 hover:text-blue-600 focus:outline-none"
    >
      <span className="border-b-2 border-transparent hover:border-blue-500 cursor-pointer">
        {company._id}
      </span>
    </button>
  </div>
</div>

            <div className="text-sm text-gray-600">{company.email}</div>

            {/* Devices list */}
            {devicesByCompany[company._id] && (
              <ul className="mt-3 space-y-2 border-t pt-2 text-sm text-gray-700">
                {devicesByCompany[company._id].length === 0 ? (
                  <li className="text-gray-400 italic">No devices</li>
                ) : (
                  devicesByCompany[company._id].map((device) => (
                    <li key={device._id} className="pl-2 border-l-2 border-blue-500">
                      <div className="font-semibold">{device.name}</div>
                      <div className="text-xs text-gray-500">
                        Type: {device.type} | Status: {device.status}
                      </div>
                      {device.location && (
                        <div className="text-xs text-gray-400">
                          Location: {device.location.lat}, {device.location.lng}
                        </div>
                      )}
                    </li>
                  ))
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

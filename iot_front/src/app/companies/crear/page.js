// 'use client';
// import { useState } from "react";
// import axios from "axios";
// import API_BASE_URL from "@/utils/api";

// export default function CreateCompanyForm() {
//   const [form, setForm] = useState({ name: "", description: "" });
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       await axios.post(`${API_BASE_URL}/companies`, form);
//       setSuccess(true);
//       setForm({ name: "", description: "" });
//     } catch (err) {
//       setError("Error al crear la compañía");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
//           Crear Compañía
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Nombre</label>
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Descripción</label>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             ></textarea>
//           </div>
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           {success && <p className="text-green-500 text-sm">Compañía creada con éxito</p>}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
//             disabled={loading}
//           >
//             {loading ? "Creando..." : "Crear Compañía"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client';
import { useState } from "react";
import API_BASE_URL from "@/utils/api";
import { authFetch } from '@/lib/api/interceptor';
import DashboardLayout from "@/app/layoutSidebar";

export default function CreateCompanyForm() {
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await authFetch(`${API_BASE_URL}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Error al crear la compañía');
      }

      setSuccess(true);
      setForm({ name: "", description: "" });
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || "Error al crear la compañía");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-300 p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Crear Compañía
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 text-sm p-2 bg-green-50 rounded">
                Compañía creada con éxito
              </div>
            )}
            <button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ${loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                </span>
              ) : (
                "Crear Compañía"
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>

  );
}
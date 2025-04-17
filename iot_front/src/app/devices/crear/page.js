'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import API_BASE_URL from "@/utils/api";
import { authFetch } from '@/lib/api/interceptor';
import DashboardLayout from "@/app/layoutSidebar";

// Cargar el mapa de forma dinámica para evitar errores SSR
const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full">Cargando mapa...</div>
});

export default function CreateDeviceForm() {
    const [form, setForm] = useState({
        companyId: "",
        name: "",
        type: "",
        location: { lat: "", lng: "" },
        status: "offline",
        config: {},
        metadata: {},
    });
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState({
        form: false,
        companies: true
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    // Obtener lista de empresas
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await authFetch(`${API_BASE_URL}/companies`);

                if (!response.ok) {
                    throw new Error('Error al cargar empresas');
                }

                const data = await response.json();
                setCompanies(data);
            } catch (err) {
                console.error('Error:', err);
                setError("Error al cargar las empresas");
            } finally {
                setLoading(prev => ({ ...prev, companies: false }));
            }
        };

        fetchCompanies();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (e, key) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.companyId) {
            setError("Debe seleccionar una empresa");
            return;
        }

        setLoading(prev => ({ ...prev, form: true }));
        setError("");
        setSuccess(false);

        try {
            const payload = {
                ...form,
                config: {
                    topic: `${form.name}_${form.type}`.toLowerCase()
                },
                ...(form.location.lat && form.location.lng && {
                    location: {
                        lat: parseFloat(form.location.lat),
                        lng: parseFloat(form.location.lng),
                    }
                })
            };

            const response = await authFetch(`${API_BASE_URL}/devices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Error al crear dispositivo');
            }

            setSuccess(true);
            resetForm();
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || "Error al crear el dispositivo");
        } finally {
            setLoading(prev => ({ ...prev, form: false }));
        }
    };

    const resetForm = () => {
        setForm({
            companyId: "",
            name: "",
            type: "",
            location: { lat: "", lng: "" },
            status: "online",
            config: {},
            metadata: {},
        });
    };

    const openMapModal = () => setIsMapModalOpen(true);
    const closeMapModal = () => setIsMapModalOpen(false);

    const handleLocationChange = ({ lat, lng }) => {
        setForm(prev => ({
            ...prev,
            location: { lat, lng },
        }));
        closeMapModal();
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-gray-300 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        {/* Columna izquierda - Lista de empresas */}
                        <div className="md:col-span-1 bg-gray-50 p-6 border-b md:border-b-0 md:border-r border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Empresas</h2>
                            {loading.companies ? (
                                <div className="flex justify-center items-center h-40">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : error ? (
                                <div className="text-red-500 text-sm">{error}</div>
                            ) : (
                                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                    {companies.filter(c => c?._id).map(company => (
                                        <div
                                            key={company._id}
                                            className={`p-3 rounded-md cursor-pointer transition ${form.companyId === company._id
                                                    ? 'bg-blue-100 border border-blue-300'
                                                    : 'hover:bg-gray-100'
                                                }`}
                                            onClick={() => setForm(prev => ({
                                                ...prev,
                                                companyId: company._id
                                            }))}
                                        >
                                            <p className="font-medium text-gray-800">{company.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">ID: {company._id}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Columna derecha - Formulario */}
                        <div className="md:col-span-2 p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Nuevo Dispositivo</h2>

                            {success && (
                                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                    Dispositivo creado exitosamente!
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="hidden" name="companyId" value={form.companyId} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Dirección MAC *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ej: 00:1A:2B:3C:4D:5E"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tipo de Dispositivo *
                                        </label>
                                        <select
                                            name="type"
                                            value={form.type}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Seleccione...</option>
                                            <option value="humedad">Sensor de Humedad</option>
                                            <option value="temperatura">Sensor de Temperatura</option>
                                            <option value="presion">Sensor de Presión</option>
                                            <option value="voltaje">Sensor de Voltaje</option>
                                            <option value="corriente">Sensor de Corriente</option>
                                            <option value="luminosidad">Sensor de Luminosidad</option>
                                            <option value="caudal">Sensor de Caudal</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ubicación
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <button
                                            type="button"
                                            onClick={openMapModal}
                                            className="col-span-1 flex items-center justify-center space-x-2 py-2 px-3 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>Seleccionar en Mapa</span>
                                        </button>

                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Latitud</label>
                                            <input
                                                type="number"
                                                name="lat"
                                                value={form.location.lat}
                                                onChange={(e) => handleNestedChange(e, "location")}
                                                step="any"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                placeholder="Ej: -33.45694"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Longitud</label>
                                            <input
                                                type="number"
                                                name="lng"
                                                value={form.location.lng}
                                                onChange={(e) => handleNestedChange(e, "location")}
                                                step="any"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                                placeholder="Ej: -70.64827"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading.form}
                                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading.form ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {loading.form ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creando Dispositivo...
                                            </span>
                                        ) : (
                                            'Crear Dispositivo'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Modal del Mapa */}
                {isMapModalOpen && (
                    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center border-b px-4 py-3">
                                <h3 className="text-lg font-semibold">Seleccionar Ubicación</h3>
                                <button
                                    onClick={closeMapModal}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 relative">
                                <LocationPickerMap
                                    lat={form.location.lat}
                                    lng={form.location.lng}
                                    onChange={handleLocationChange}
                                />
                            </div>
                            <div className="border-t px-4 py-3 flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeMapModal}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>

    );
}



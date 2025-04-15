'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import API_BASE_URL from "@/utils/api";
import { metadata } from "@/app/layout";

// Cargar el mapa de forma dinámica para evitar errores SSR
const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), { ssr: false });

export default function CreateDeviceForm() {
    const [form, setForm] = useState({
        companyId: "",
        name: "",
        type: "",
        location: { lat: "", lng: "" },
        status: "",
        lastSeen: "",
        config: {},
        metadata: {},
    });
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isMapModalOpen, setIsMapModalOpen] = useState(false); // Estado para la ventana modal

    useEffect(() => {
        axios.get(`${API_BASE_URL}/companies`).then((res) => {
            // console.log("Empresas recibidas:", res.data);
            setCompanies(res.data);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (e, key) => {
        const { name, value } = e.target;
        setForm((prev) => ({
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

        setLoading(true);
        setError("");
        try {
            const payload = {
                ...form,
                status: "offline",
                companyId: form.companyId, 
                config: {
                    topic: form.name + "_"+form.type
                },
                location: form.location.lat && form.location.lng ? {
                    lat: parseFloat(form.location.lat),
                    lng: parseFloat(form.location.lng),
                } : undefined,
                lastSeen: form.lastSeen ? new Date(form.lastSeen) : new Date(),
            };

            // console.log(payload)
            await axios.post(`${API_BASE_URL}/devices`, payload);
            setSuccess(true);
            setForm({
                companyId: "",
                name: "",
                type: "",
                location: { lat: "", lng: "" },
                status: "",
                lastSeen: "",
                config: {},
                metadata: {},
            });
        } catch (err) {
            setError("Error al crear el dispositivo");
        } finally {
            setLoading(false);
        }
    };

    // Función para abrir la ventana modal
    const openMapModal = () => {
        setIsMapModalOpen(true);
    };

    // Función para cerrar la ventana modal
    const closeMapModal = () => {
        setIsMapModalOpen(false);
    };

    // Función para manejar el cambio de ubicación
    const handleLocationChange = ({ lat, lng }) => {
        setForm((prev) => ({
            ...prev,
            location: { lat, lng },
        }));
        closeMapModal(); // Cerrar la ventana modal después de seleccionar la ubicación
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-300 p-6">

                <div className="grid grid-cols-3 gap-0">
                    {/* Columna izquierda - Lista de empresas */}
                    <div className="col-span-1 bg-gray-50 p-6 border-r border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Empresas</h2>
                        <div className="space-y-2">
                            {companies
                                .filter((company) => company?._id)
                                .map((company) => (
                                    <div
                                        key={company._id}
                                        className={`p-3 rounded-md cursor-pointer ${form.companyId === company._id ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'}`}
                                        onClick={() => setForm(prev => ({ ...prev, companyId: company._id }))}
                                    >
                                        <p className="font-medium">{company.name || `Empresa ${company._id}`}</p>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Columna derecha - Formulario */}
                    <div className="col-span-2 p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div>
                                {/* En lugar del input de empresa, usa un campo oculto */}
                                <input type="hidden" name="companyId" value={form.companyId} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Dirección MAC</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="humedad">Humedad</option>
                                    <option value="temperatura">Temperatura</option>
                                    <option value="presion">Presion</option>
                                    <option value="voltaje">Voltaje</option>
                                    <option value="corriente">Corriente</option>
                                    <option value="luminicidad">Luminicidad</option>
                                    <option value="resistencia">Resistencia</option>
                                    <option value="caudal">Caudal</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={openMapModal}
                                    className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                >
                                    Seleccionar ubicación
                                </button>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Latitud</label>
                                    <input
                                        type="number"
                                        name="lat"
                                        value={form.location.lat}
                                        onChange={(e) => handleNestedChange(e, "location")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Longitud</label>
                                    <input
                                        type="number"
                                        name="lng"
                                        value={form.location.lng}
                                        onChange={(e) => handleNestedChange(e, "location")}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                            >
                                Crear Dispositivo
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Ventana Modal con el mapa - CORREGIDA */}
            {isMapModalOpen && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full h-full max-w-6xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Seleccionar Ubicación</h3>
                            <button
                                onClick={closeMapModal}
                                className="text-2xl text-gray-600 hover:text-red-500"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="flex-1">
                            <LocationPickerMap
                                lat={form.location.lat}
                                lng={form.location.lng}
                                onChange={handleLocationChange}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}




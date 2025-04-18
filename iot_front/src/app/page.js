'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext'; // ajustá este path según dónde tengas tu contexto

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No estás autenticado</h1>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <DashboardLayout>
        <h1 className="text-3xl font-bold">BIENVENIDOS</h1>
      </DashboardLayout>
    </main>
  );
}

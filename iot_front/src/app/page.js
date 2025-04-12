import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">IoT Dashboard</h1>
        <ul className="space-y-4">
          <li>
            <Link
              href="/companies"
              className="block w-full text-center py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Ver Compañías
            </Link>
          </li>
          <li>
            <Link
              href="/devices"
              className="block w-full text-center py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Ver Dispositivos
            </Link>
          </li>
          <li>
            <Link
              href="/devices/inactive"
              className="block w-full text-center py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
            >
              Ver Dispositivos Inactivos
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}

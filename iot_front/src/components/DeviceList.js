import React from 'react';

export default function DeviceList({ devices }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-4">
      <ul className="space-y-3">
        {devices.map((device) => (
          <li
            key={device._id}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="text-lg font-medium text-indigo-700">{device.name}</div>
            <div className="text-sm text-gray-600">
              Tipo: {device.type} — Estado:{' '}
              <span
                className={`font-semibold ${
                  device.status === 'active' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {device.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

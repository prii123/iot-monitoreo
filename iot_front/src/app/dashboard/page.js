'use client';
import { useEffect, useState } from 'react';
import DeviceList from '../../components/DeviceList';
import API_BASE_URL from '../../utils/api';
import DashboardLayout from "../layoutSidebar"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">DASHBOARD</h1>
      </main>
    </DashboardLayout>
  );
}

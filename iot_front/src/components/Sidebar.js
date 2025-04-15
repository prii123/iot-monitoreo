'use client';

import { useState } from "react";
import Link from 'next/link';


const Sidebar = () => {
    const [open, setOpen] = useState({
        templates: false,
        host: false,
        user: false,
        environment: false,
        logs: false,
    });

    const toggle = (section) => {
        setOpen({ ...open, [section]: !open[section] });
    };

    return (
        <nav className="bg-[#073c64] text-white w-64 h-full fixed top-0 left-0 z-50 overflow-y-auto shadow-md">
            {/* Header */}
            <div className="p-4 border-b border-blue-900">
                <h1 className="text-xl font-bold">IOT</h1>
                <p className="text-xs text-gray-300 ml-1">MONITOREO</p>
            </div>


            {/* Home */}
            <div className="p-4">
                <NavItem label="Home" href="/" active />

                {/* Local Section Styled Like Image */}
                <div className="bg-[#084c7c] rounded-md p-2 mb-4">
                    {/* <NavItem label="Dashboard" href="/" /> */}
                    <Collapsible
                        label="Acciones"
                        isOpen={open.templates}
                        onToggle={() => toggle("templates")}
                        links={[
                            { label: "___ Crear dispositivo", href: "/devices/crear" },
                            { label: "___ Crear empresa", href: "/companies/crear" },
                        ]}
                    />
                    <NavItem label="Dispositivos" href="/devices" />
                    <NavItem label="Empresas" href="/companies" />
                    <NavItem label="Inactivos" href="/devices/inactive" />
                    <NavItem label="Networks" href="/" />
                    <NavItem label="Volumes" href="/" />
                    <NavItem label="Events" href="/" />
                    <Collapsible
                        label="Host"
                        isOpen={open.host}
                        onToggle={() => toggle("host")}
                        links={[
                            { label: "Info", href: "/host/info" },
                            { label: "CPU", href: "/host/cpu" },
                        ]}
                    />
                </div>

                {/* Administration section */}
                <div className="mt-6">
                    <p className="text-gray-300 text-sm mb-2">Administration</p>
                    <Collapsible
                        label="User-related"
                        isOpen={open.user}
                        onToggle={() => toggle("user")}
                    />
                    <Collapsible
                        label="Environment-related"
                        isOpen={open.environment}
                        onToggle={() => toggle("environment")}
                    />
                    <NavItem label="Registries" />
                    <Collapsible
                        label="Logs"
                        isOpen={open.logs}
                        onToggle={() => toggle("logs")}
                    />
                    <NavItem label="Notifications" />
                    <NavItem label="Settings" />
                </div>
            </div>


        </nav>
    );
};

const NavItem = ({ label, href = "#", active = false }) => (
    <Link
        href={href}
        className={`block px-3 py-2 rounded text-sm transition ${active
            ? "bg-[#0b4f82] text-white"
            : "hover:bg-[#0b4f82] text-gray-200 hover:text-white"
            }`}
    >
        {label}
    </Link>
);

const Collapsible = ({ label, isOpen, onToggle, links = [] }) => (
    <div>
        <div
            onClick={onToggle}
            className="flex justify-between items-center px-3 py-2 rounded hover:bg-[#0b4f82] cursor-pointer transition text-sm text-gray-200"
        >
            <span>{label}</span>
            <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
        </div>
        {isOpen && (
            <ul className="ml-4 mt-1 text-sm text-gray-300 space-y-1">
                {links.map(({ label, href }, i) => (
                    <li key={i}>
                        <Link href={href} className="block hover:text-white cursor-pointer">
                            {label}
                        </Link>

                    </li>
                ))}
            </ul>
        )}
    </div>
);


export default Sidebar;

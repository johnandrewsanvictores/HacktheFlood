import React, { useState } from "react";
import { LayoutDashboard, FileText, Building2, BarChart3 } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Projects", icon: FileText, path: "/admin/projects" },
  { label: "Contractors", icon: Building2, path: "/admin/contractors" },
  { label: "Community Reports", icon: BarChart3, path: "/admin/reports" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  const handleNavigate = (label, path) => {
    setActive(label);
    window.location.href = path;
  };

  return (
    <aside className="h-full w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-4 shadow-sm">
      <div className="mb-8 text-2xl font-bold text-brand-primary tracking-tight">
        Menu
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.label, item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                isActive
                  ? "bg-brand-primary/10 text-brand-primary border-l-4 border-brand-primary"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

import React, { useState, useEffect } from "react";
import { Bell, Settings, User, LogOut, Shield } from "lucide-react";
import api from "../../../axios";

export default function Navbar() {
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/auth/me");
        if (response.data.data?.name) {
          setUserName(response.data.data.name.split(" ")[0]);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="w-full h-16 flex items-center justify-between px-8 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-brand-primary tracking-tight">
          BantayBayan
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
        <div className="h-6 w-px bg-gray-300"></div>
        <button className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
          <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {userName}
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}

import React, { useState } from "react";
import {
  MapPin,
  Search,
  Filter,
  Menu,
  X,
  ChevronRight,
  User,
  LogOut,
  Bell,
  Settings,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

const UserDashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock project data - replace with actual API call
  const projects = [
    {
      id: 1,
      name: "Flood Control System - Marikina River",
      location: "Marikina City, Metro Manila",
      budget: "₱150,000,000",
      status: "ongoing",
      progress: 65,
      startDate: "Jan 2024",
      endDate: "Dec 2025",
      coordinates: { lat: 14.6507, lng: 121.1029 },
      description:
        "Construction of flood control infrastructure along Marikina River",
    },
    {
      id: 2,
      name: "Bridge Construction - EDSA-Shaw",
      location: "Mandaluyong City, Metro Manila",
      budget: "₱250,000,000",
      status: "completed",
      progress: 100,
      startDate: "Mar 2023",
      endDate: "Nov 2024",
      coordinates: { lat: 14.5816, lng: 121.0536 },
      description: "New pedestrian bridge connecting EDSA to Shaw Boulevard",
    },
    {
      id: 3,
      name: "Road Widening Project - C5",
      location: "Pasig City, Metro Manila",
      budget: "₱180,000,000",
      status: "ongoing",
      progress: 45,
      startDate: "Jun 2024",
      endDate: "Jun 2026",
      coordinates: { lat: 14.5764, lng: 121.0851 },
      description: "Road widening and improvement along C5 corridor",
    },
    {
      id: 4,
      name: "Drainage System Upgrade",
      location: "Quezon City, Metro Manila",
      budget: "₱95,000,000",
      status: "planned",
      progress: 0,
      startDate: "Feb 2025",
      endDate: "Dec 2026",
      coordinates: { lat: 14.676, lng: 121.0437 },
      description: "Modernization of drainage systems in flood-prone areas",
    },
    {
      id: 5,
      name: "School Building Construction",
      location: "Taguig City, Metro Manila",
      budget: "₱120,000,000",
      status: "ongoing",
      progress: 80,
      startDate: "Sep 2023",
      endDate: "Mar 2025",
      coordinates: { lat: 14.5176, lng: 121.0509 },
      description: "New 3-story school building with modern facilities",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "ongoing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "planned":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "ongoing":
        return <Clock className="w-4 h-4" />;
      case "planned":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">BantayBayan</h1>
            </div>
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
                Juan Dela Cruz
              </span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-red-600">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Project List */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-full sm:w-96 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out`}
          style={{ top: "64px" }}
        >
          {/* Search and Filter */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === "all"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({projects.length})
              </button>
              <button
                onClick={() => setFilterStatus("ongoing")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === "ongoing"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Ongoing
              </button>
              <button
                onClick={() => setFilterStatus("completed")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === "completed"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Project List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 space-y-2">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-md ${
                    selectedProject?.id === project.id
                      ? "border-brand-primary bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {project.name}
                    </h3>
                    <ChevronRight
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${
                        selectedProject?.id === project.id
                          ? "text-brand-primary"
                          : "text-gray-400"
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{project.location}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {getStatusIcon(project.status)}
                      <span className="capitalize">{project.status}</span>
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      {project.progress}%
                    </span>
                  </div>

                  {project.status === "ongoing" && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-brand-gradient h-1.5 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side - Map and Project Details */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Map Container */}
          <div className="flex-1 relative bg-gray-100">
            {/* Map Placeholder - Replace with actual map library (Google Maps, Mapbox, Leaflet, etc.) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="w-12 h-12 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Interactive Map View
                </h3>
                <p className="text-gray-500 text-sm">
                  Integrate Google Maps, Mapbox, or Leaflet here
                </p>
              </div>
            </div>

            {/* Map Markers Preview (for demonstration) */}
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`absolute w-10 h-10 bg-white rounded-full border-2 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${
                  selectedProject?.id === project.id
                    ? "border-brand-primary ring-4 ring-brand-primary/30"
                    : "border-gray-300"
                }`}
                style={{
                  left: `${20 + project.id * 15}%`,
                  top: `${30 + project.id * 10}%`,
                }}
                onClick={() => setSelectedProject(project)}
              >
                <MapPin
                  className={`w-5 h-5 ${
                    selectedProject?.id === project.id
                      ? "text-brand-primary"
                      : "text-gray-600"
                  }`}
                />
              </div>
            ))}

            {/* Project Details Card (when project is selected) */}
            {selectedProject && (
              <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm z-50">
                <div className="bg-white rounded-xl shadow-brand-lg p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 pr-8">
                      {selectedProject.name}
                    </h2>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Location
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedProject.location}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {getStatusIcon(selectedProject.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Status
                        </p>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(
                            selectedProject.status
                          )}`}
                        >
                          <span className="capitalize">
                            {selectedProject.status}
                          </span>
                          <span>• {selectedProject.progress}%</span>
                        </span>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Budget
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedProject.budget}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Timeline
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedProject.startDate} -{" "}
                          {selectedProject.endDate}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Building2 className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Description
                        </p>
                        <p className="text-sm text-gray-700">
                          {selectedProject.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar (for ongoing projects) */}
                    {selectedProject.status === "ongoing" && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">
                            Project Progress
                          </span>
                          <span className="text-xs font-bold text-brand-primary">
                            {selectedProject.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-brand-gradient h-2.5 rounded-full transition-all"
                            style={{ width: `${selectedProject.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 bg-brand-gradient text-white py-2.5 rounded-lg font-semibold text-sm hover:shadow-brand-lg transition-all">
                        Report Issue
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all">
                        View Photos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;

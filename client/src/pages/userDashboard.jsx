import React, { useState, useEffect } from "react";
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
import ProjectMap3D from "../components/ProjectMap3D.jsx";
import api from "../../axios.js";

const UserDashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects');
        if (response.data.success) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "finished":
        return "bg-green-100 text-green-700 border-green-300";
      case "ongoing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "finished":
        return <CheckCircle2 className="w-4 h-4" />;
      case "ongoing":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getDisplayStatus = (status) => {
    const statusMap = {
      'finished': 'completed',
      'ongoing': 'ongoing',
      'pending': 'planned',
      'cancelled': 'cancelled'
    };
    return statusMap[status] || status;
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.contractor_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === "all") {
      matchesFilter = true;
    } else if (filterStatus === "completed") {
      matchesFilter = project.status === "finished";
    } else {
      matchesFilter = project.status === filterStatus;
    }
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 z-40 flex-shrink-0">
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
      <div className="flex-1 flex overflow-hidden min-h-0">
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
                All ({projects.length || 0})
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
              <button
                onClick={() => setFilterStatus("pending")}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filterStatus === "pending"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          {/* Project List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 space-y-2">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading projects...</div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No projects found</div>
              ) : (
                filteredProjects.map((project) => (
                  <button
                    key={project._id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-md ${
                      selectedProject?._id === project._id
                        ? "border-brand-primary bg-blue-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                        {project.project_name}
                      </h3>
                      <ChevronRight
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${
                          selectedProject?._id === project._id
                            ? "text-brand-primary"
                            : "text-gray-400"
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{project.region} • {project.legislative_district}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{getDisplayStatus(project.status)}</span>
                      </span>
                      {project.is_flagged && (
                        <span className="text-xs font-semibold text-red-600">⚠️ Flagged</span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Right Side - Map and Project Details */}
        <main className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
          {/* Map Container */}
          <div className="absolute inset-0 bg-gray-100">
            <ProjectMap3D 
              projects={projects} 
              selectedProject={selectedProject}
              onProjectSelect={setSelectedProject}
              loading={loading}
            />
          </div>

          {/* Project Details Panel */}
          {selectedProject && (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm z-50">
              <div className="bg-white rounded-xl shadow-brand-lg p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 pr-8">
                    {selectedProject.project_name}
                  </h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedProject.region} • {selectedProject.legislative_district}
                      </p>
                    </div>
                  </div>

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
                          {getDisplayStatus(selectedProject.status)}
                        </span>
                      </span>
                    </div>
                  </div>

                  {selectedProject.risk_score !== undefined && (
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-brand-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Risk Score
                        </p>
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          selectedProject.risk_score > 70 ? 'bg-red-100 text-red-800' :
                          selectedProject.risk_score > 40 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {selectedProject.risk_score}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Budget
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₱{selectedProject.approved_budget?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Timeline
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(selectedProject.start_date).toLocaleDateString()}
                        {selectedProject.completion_date_actual && (
                          <> - {new Date(selectedProject.completion_date_actual).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building2 className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Contractor
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedProject.contractor_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building2 className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Type of Work
                      </p>
                      <p className="text-sm text-gray-700">
                        {selectedProject.type_of_work}
                      </p>
                    </div>
                  </div>

                  {selectedProject.is_flagged && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-800 font-semibold">⚠️ Flagged for Inspection</p>
                    </div>
                  )}

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
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;

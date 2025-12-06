import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ProjectForm from "../components/admin/ProjectForm";
import ProjectList from "../components/admin/ProjectList";
import api from "../../axios";
import {
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
  MapPin,
} from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  bgColor = "bg-brand-primary/5",
}) {
  return (
    <div
      className={`flex flex-col ${bgColor} border border-gray-200 rounded-lg p-6 min-w-[200px] hover:shadow-md transition`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-600 text-sm font-semibold">{title}</span>
        {Icon && <Icon className="w-6 h-6 text-brand-primary/70" />}
      </div>
      <span className="text-4xl font-bold text-gray-900 mb-1">{value}</span>
      {trend && (
        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
          <span>↑</span> {trend}
        </span>
      )}
    </div>
  );
}

function SuccessAlert({ project, onClose }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-green-900 text-sm">
            Project Added Successfully
          </h3>
          <p className="text-xs text-green-700 mt-1">
            {project.project_name} in {project.region} has been added with a
            budget of ₱{(project.approved_budget / 1000000).toFixed(1)}M.
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-green-600 hover:text-green-700 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function AdminProjectPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successAlert, setSuccessAlert] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/projects");
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setSuccessAlert(newProject);
    setShowForm(false);
    setTimeout(() => setSuccessAlert(null), 5000);
  };

  const stats = {
    totalProjects: projects.length,
    ongoingProjects: projects.filter((p) => p.status === "ongoing").length,
    finishedProjects: projects.filter((p) => p.status === "finished").length,
    totalBudget: projects.reduce((sum, p) => sum + (p.approved_budget || 0), 0),
  };

  const regionStats = [...new Set(projects.map((p) => p.region))].length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Project Management
          </h1>
          <p className="text-gray-600 text-sm">
            Manage flood-control projects, track progress, and monitor budgets
            across regions.
          </p>
        </div>

        {/* Success Alert */}
        {successAlert && (
          <SuccessAlert
            project={successAlert}
            onClose={() => setSuccessAlert(null)}
          />
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 text-sm">Error</h3>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={Briefcase}
          />
          <StatCard
            title="Ongoing Projects"
            value={stats.ongoingProjects}
            icon={TrendingUp}
            bgColor="bg-blue-50/50"
          />
          <StatCard
            title="Completed Projects"
            value={stats.finishedProjects}
            icon={CheckCircle2}
            bgColor="bg-green-50/50"
          />
          <StatCard
            title="Active Regions"
            value={regionStats}
            icon={MapPin}
            bgColor="bg-purple-50/50"
          />
          <StatCard
            title="Total Budget"
            value={`₱${(stats.totalBudget / 1000000).toFixed(0)}M`}
            icon={TrendingUp}
            bgColor="bg-amber-50/50"
          />
        </div>

        {/* Add Project Section */}
        {!showForm ? (
          <div className="mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center gap-2"
            >
              <Briefcase className="w-5 h-5" />
              Add New Project
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <ProjectForm
              onSuccess={handleFormSuccess}
              onClose={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Project List */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 bg-brand-primary rounded-full animate-bounce"></div>
              <p className="text-gray-600 font-medium">Loading projects...</p>
            </div>
          </div>
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </AdminLayout>
  );
}

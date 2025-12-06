import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../../axios";
import { Activity, AlertCircle, TrendingUp } from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  bgColor = "bg-brand-primary/5",
}) {
  return (
    <div
      className={`flex flex-col ${bgColor} border border-gray-200 rounded-lg p-6 min-w-[220px] hover:shadow-md transition`}
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

function ProjectCard({ project }) {
  const statusColors = {
    ongoing: "bg-blue-50 border-blue-200 text-blue-700",
    pending: "bg-yellow-50 border-yellow-200 text-yellow-700",
    finished: "bg-green-50 border-green-200 text-green-700",
    cancelled: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
          {project.project_name}
        </h3>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
            statusColors[project.status] || statusColors.pending
          }`}
        >
          {project.status}
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-3">{project.region}</p>
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-700 font-medium">
          ₱{(project.approved_budget / 1000000).toFixed(1)}M
        </span>
        <span className="text-gray-600 text-right line-clamp-1 max-w-[150px]">
          {project.contractor_name}
        </span>
      </div>
    </div>
  );
}

function ContractorCard({ contractor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <h3 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2">
        {contractor.company_name}
      </h3>
      <div className="space-y-2 text-xs text-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Projects:</span>
          <span className="font-semibold text-gray-900">
            {contractor.total_projects}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Success Rate:</span>
          <span className="font-semibold text-green-600">
            {contractor.success_rate}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Credit Score:</span>
          <span className="font-semibold text-brand-primary">
            {contractor.credit_score}/100
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    contractors: 0,
    activeProjects: 0,
    flaggedProjects: 0,
  });
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, contractorsRes] = await Promise.all([
          api.get("/api/projects"),
          api.get("/api/contractors"),
        ]);

        const projectsList = projectsRes.data.data || [];
        const contractorsList = contractorsRes.data.data || [];

        setProjects(projectsList);
        setContractors(contractorsList);

        setStats({
          projects: projectsList.length,
          contractors: contractorsList.length,
          activeProjects: projectsList.filter((p) => p.status === "ongoing")
            .length,
          flaggedProjects: projectsList.filter((p) => p.is_flagged).length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Track projects, contractors, and platform metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Projects"
          value={loading ? "-" : stats.projects}
          icon={Activity}
          trend={`${stats.activeProjects} active`}
        />
        <StatCard
          title="Active Now"
          value={loading ? "-" : stats.activeProjects}
          icon={Activity}
        />
        <StatCard
          title="Contractors"
          value={loading ? "-" : stats.contractors}
          icon={TrendingUp}
        />
        <StatCard
          title="Flagged"
          value={loading ? "-" : stats.flaggedProjects}
          icon={AlertCircle}
          trend={stats.flaggedProjects > 0 ? "Review now" : "Clear"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Projects
            </h2>
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No projects found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                {projects.slice(0, 8).map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Top Contractors
            </h2>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : contractors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No contractors
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {contractors.slice(0, 6).map((contractor) => (
                  <ContractorCard
                    key={contractor._id}
                    contractor={contractor}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

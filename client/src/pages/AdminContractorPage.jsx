import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ContractorForm from "../components/admin/ContractorForm";
import ContractorList from "../components/admin/ContractorList";
import showAlert from "../components/ui/Alerts";
import api from "../../axios";
import {
  Building2,
  TrendingUp,
  Award,
  Users,
  AlertCircle,
  CheckCircle2,
  X,
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

function TopPerformerCard({ contractor }) {
  const perfScore = (contractor.success_rate + contractor.credit_score) / 2;
  const perfColor =
    perfScore >= 80
      ? "text-green-600"
      : perfScore >= 60
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="bg-gradient-to-br from-brand-primary/5 to-brand-primary/2 border border-brand-primary/20 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-900 text-sm">
            {contractor.company_name}
          </h4>
          <p className="text-xs text-gray-600">{contractor.contact_person}</p>
        </div>
        <Award className="w-5 h-5 text-brand-primary/60" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Success Rate</span>
          <span className={`text-sm font-bold ${perfColor}`}>
            {contractor.success_rate}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Credit Score</span>
          <span className="text-sm font-bold text-brand-primary">
            {contractor.credit_score}/100
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Projects Completed</span>
          <span className="text-sm font-bold text-gray-900">
            {contractor.completed_projects}
          </span>
        </div>
      </div>
    </div>
  );
}

function SuccessAlert({ contractor, onClose }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-green-900 text-sm">
            Contractor Added Successfully
          </h3>
          <p className="text-xs text-green-700 mt-1">
            {contractor.company_name} has been added to the system with a credit
            score of {contractor.credit_score} and{" "}
            {contractor.years_in_business} years in business.
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

export default function AdminContractorPage() {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [successAlert, setSuccessAlert] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/contractors");
      if (response.data.success) {
        setContractors(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching contractors:", error);
      setError("Failed to load contractors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = (newContractor) => {
    setContractors((prev) => [newContractor, ...prev]);
    setSuccessAlert(newContractor);
    setShowForm(false);
    setTimeout(() => setSuccessAlert(null), 5000);
  };

  const topPerformers = [...contractors]
    .sort((a, b) => {
      const scoreA = (a.success_rate + a.credit_score) / 2;
      const scoreB = (b.success_rate + b.credit_score) / 2;
      return scoreB - scoreA;
    })
    .slice(0, 3);

  const stats = {
    totalContractors: contractors.length,
    activeProjects: contractors.reduce((sum, c) => sum + c.ongoing_projects, 0),
    avgSuccessRate:
      contractors.length > 0
        ? Math.round(
            contractors.reduce((sum, c) => sum + c.success_rate, 0) /
              contractors.length
          )
        : 0,
    avgCreditScore:
      contractors.length > 0
        ? Math.round(
            contractors.reduce((sum, c) => sum + c.credit_score, 0) /
              contractors.length
          )
        : 0,
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Contractor Management
          </h1>
          <p className="text-gray-600 text-sm">
            Manage flood-control project contractors, track performance metrics,
            and make data-driven contractor recommendations.
          </p>
        </div>

        {/* Success Alert */}
        {successAlert && (
          <SuccessAlert
            contractor={successAlert}
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
            title="Total Contractors"
            value={stats.totalContractors}
            icon={Users}
          />
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={TrendingUp}
          />
          <StatCard
            title="Avg Success Rate"
            value={`${stats.avgSuccessRate}%`}
            icon={CheckCircle2}
            bgColor="bg-green-50/50"
          />
          <StatCard
            title="Avg Credit Score"
            value={`${stats.avgCreditScore}/100`}
            icon={Award}
            bgColor="bg-blue-50/50"
          />
        </div>

        {/* Top Performers */}
        {topPerformers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Top Performers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topPerformers.map((contractor) => (
                <TopPerformerCard
                  key={contractor._id}
                  contractor={contractor}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Contractor Section */}
        {!showForm ? (
          <div className="mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              Add New Contractor
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <ContractorForm
              onSuccess={handleFormSuccess}
              onClose={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Contractor List */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 bg-brand-primary rounded-full animate-bounce"></div>
              <p className="text-gray-600 font-medium">
                Loading contractors...
              </p>
            </div>
          </div>
        ) : (
          <ContractorList
            contractors={contractors}
            onRefresh={fetchContractors}
          />
        )}
      </div>
    </AdminLayout>
  );
}

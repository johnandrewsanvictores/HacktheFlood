import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";

export default function ContractorList({ contractors = [], onRefresh }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [performanceFilter, setPerformanceFilter] = useState("all");
  const [activeProjectsFilter, setActiveProjectsFilter] = useState("all");
  const [sortBy, setSortBy] = useState("success_rate");
  const [sortOrder, setSortOrder] = useState("desc");

  const getPerformanceLevel = (successRate, creditScore) => {
    const avgScore = (successRate + creditScore) / 2;
    if (avgScore >= 80) return "high";
    if (avgScore >= 60) return "medium";
    return "low";
  };

  const filtered = useMemo(() => {
    return contractors.filter((contractor) => {
      const matchesSearch =
        contractor.company_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        contractor.contact_person
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const performanceLevel = getPerformanceLevel(
        contractor.success_rate,
        contractor.credit_score
      );
      const matchesPerformance =
        performanceFilter === "all" || performanceLevel === performanceFilter;

      const hasActiveProjects = contractor.ongoing_projects > 0;
      const matchesActiveProjects =
        activeProjectsFilter === "all" ||
        (activeProjectsFilter === "active" && hasActiveProjects) ||
        (activeProjectsFilter === "inactive" && !hasActiveProjects);

      return matchesSearch && matchesPerformance && matchesActiveProjects;
    });
  }, [contractors, searchQuery, performanceFilter, activeProjectsFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    return copy;
  }, [filtered, sortBy, sortOrder]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const PerformanceBadge = ({ level }) => {
    const config = {
      high: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        icon: "text-green-500",
      },
      medium: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        icon: "text-yellow-500",
      },
      low: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        icon: "text-red-500",
      },
    };
    const c = config[level];
    const label = level.charAt(0).toUpperCase() + level.slice(1);

    return (
      <div
        className={`${c.bg} ${c.border} ${c.text} border rounded-md px-2.5 py-1 text-xs font-semibold flex items-center gap-1 w-fit`}
      >
        <Zap className={`w-3.5 h-3.5 ${c.icon}`} />
        {label}
      </div>
    );
  };

  const SortHeader = ({ label, field }) => (
    <button
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1 hover:text-brand-primary transition"
    >
      {label}
      {sortBy === field &&
        (sortOrder === "asc" ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        ))}
    </button>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Contractor Directory
        </h2>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company name or contact person..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Performance Level
              </label>
              <select
                value={performanceFilter}
                onChange={(e) => setPerformanceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
              >
                <option value="all">All Performers</option>
                <option value="high">High Performers</option>
                <option value="medium">Medium Performers</option>
                <option value="low">Low Performers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Active Projects
              </label>
              <select
                value={activeProjectsFilter}
                onChange={(e) => setActiveProjectsFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
              >
                <option value="all">All</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
              >
                <option value="success_rate">Success Rate</option>
                <option value="credit_score">Credit Score</option>
                <option value="on_time_completion_rate">Completion Rate</option>
                <option value="total_projects">Total Projects</option>
                <option value="company_name">Company Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {sorted.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">No contractors found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700 text-sm">
                  <SortHeader label="Company" field="company_name" />
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 text-sm">
                  Contact
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700 text-sm">
                  <SortHeader label="Performance" field="success_rate" />
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700 text-sm">
                  <SortHeader label="Credit" field="credit_score" />
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700 text-sm">
                  <SortHeader label="Projects" field="total_projects" />
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700 text-sm">
                  On-Time Rate
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700 text-sm">
                  Avg. Days
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((contractor) => {
                const perfLevel = getPerformanceLevel(
                  contractor.success_rate,
                  contractor.credit_score
                );
                return (
                  <tr
                    key={contractor._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900 text-sm">
                        {contractor.company_name}
                      </div>
                      <div className="text-xs text-gray-600">
                        License: {contractor.license_number}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="text-gray-900 font-medium">
                        {contractor.contact_person}
                      </div>
                      <div className="text-xs text-gray-600">
                        {contractor.email}
                      </div>
                      <div className="text-xs text-gray-600">
                        {contractor.contact_number}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-right">
                          <div className="font-bold text-green-600 text-sm">
                            {contractor.success_rate}%
                          </div>
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{
                                width: `${contractor.success_rate}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="font-bold text-brand-primary text-sm">
                        {contractor.credit_score}/100
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="font-semibold text-gray-900 text-sm">
                          {contractor.total_projects}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="text-green-600 font-medium">
                            {contractor.completed_projects}
                          </span>
                          {" / "}
                          <span className="text-blue-600 font-medium">
                            {contractor.ongoing_projects}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {contractor.on_time_completion_rate}%
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {Math.round(contractor.average_completion_time_days)}d
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-brand-primary" />
        Showing {sorted.length} of {contractors.length} contractors
      </div>
    </div>
  );
}

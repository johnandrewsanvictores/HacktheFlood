import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  Briefcase,
  MapPin,
} from "lucide-react";

export default function ProjectList({ projects = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [contractorFilter, setContractorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("start_date");
  const [sortOrder, setSortOrder] = useState("desc");

  const uniqueRegions = useMemo(() => {
    const regions = [...new Set(projects.map((p) => p.region))];
    return regions.sort();
  }, [projects]);

  const uniqueContractors = useMemo(() => {
    const contractors = [...new Set(projects.map((p) => p.contractor_name))];
    return contractors.sort();
  }, [projects]);

  const getStatusColor = (status) => {
    const colors = {
      ongoing: "bg-blue-50 border-blue-200 text-blue-700",
      pending: "bg-yellow-50 border-yellow-200 text-yellow-700",
      finished: "bg-green-50 border-green-200 text-green-700",
      cancelled: "bg-red-50 border-red-200 text-red-700",
    };
    return colors[status] || colors.pending;
  };

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.project_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        project.project_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.contractor_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      const matchesRegion =
        regionFilter === "all" || project.region === regionFilter;

      const matchesContractor =
        contractorFilter === "all" ||
        project.contractor_name === contractorFilter;

      return (
        matchesSearch && matchesStatus && matchesRegion && matchesContractor
      );
    });
  }, [projects, searchQuery, statusFilter, regionFilter, contractorFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal === undefined || aVal === null) aVal = "";
      if (bVal === undefined || bVal === null) bVal = "";

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fil-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Project Directory
        </h2>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by project name, ID, or contractor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
              >
                <option value="all">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="pending">Pending</option>
                <option value="finished">Finished</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
              >
                <option value="all">All Regions</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contractor
              </label>
              <select
                value={contractorFilter}
                onChange={(e) => setContractorFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
              >
                <option value="all">All Contractors</option>
                {uniqueContractors.map((contractor) => (
                  <option key={contractor} value={contractor}>
                    {contractor}
                  </option>
                ))}
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
                <option value="start_date">Start Date</option>
                <option value="project_name">Project Name</option>
                <option value="region">Region</option>
                <option value="approved_budget">Budget</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {sorted.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">No projects found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700 text-sm">
                  <SortHeader label="Project" field="project_name" />
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 text-sm">
                  <SortHeader label="Region" field="region" />
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 text-sm">
                  Contractor
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700 text-sm">
                  <SortHeader label="Status" field="status" />
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700 text-sm">
                  <SortHeader label="Budget" field="approved_budget" />
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 text-sm">
                  <SortHeader label="Start Date" field="start_date" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((project) => (
                <tr
                  key={project._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-900 text-sm">
                      {project.project_name}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <span className="font-medium">ID:</span>
                      {project.project_id}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-900 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-gray-500" />
                      {project.region}
                    </div>
                    <div className="text-xs text-gray-600">
                      {project.legislative_district}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="text-gray-900 font-medium">
                      {project.contractor_name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {project.infrastructure_type}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.charAt(0).toUpperCase() +
                        project.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="font-semibold text-gray-900 text-sm">
                      {formatCurrency(project.approved_budget)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatCurrency(project.contract_cost)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                    {formatDate(project.start_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-brand-primary" />
        Showing {sorted.length} of {projects.length} projects
      </div>
    </div>
  );
}

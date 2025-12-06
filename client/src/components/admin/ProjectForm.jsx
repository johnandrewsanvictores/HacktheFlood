import React, { useState } from "react";
import { X, Loader2, Wand2 } from "lucide-react";
import api from "../../../axios";
import ContractorSelector from "./ContractorSelector";

export default function ProjectForm({ onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);
  const [showContractorSelector, setShowContractorSelector] = useState(false);
  const [formData, setFormData] = useState({
    project_name: "",
    region: "",
    legislative_district: "",
    district_engineering_office: "",
    project_id: "",
    type_of_work: "",
    infrastructure_type: "",
    longitude: "",
    latitude: "",
    contract_id: "",
    approved_budget: "",
    contract_cost: "",
    start_date: "",
    funding_year: "",
    contractor_name: "",
    status: "ongoing",
  });
  const [selectedContractorId, setSelectedContractorId] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.project_name.trim()) {
      newErrors.project_name = "Project name is required";
    }
    if (!formData.region.trim()) {
      newErrors.region = "Region is required";
    }
    if (!formData.legislative_district.trim()) {
      newErrors.legislative_district = "Legislative district is required";
    }
    if (!formData.district_engineering_office.trim()) {
      newErrors.district_engineering_office =
        "District engineering office is required";
    }
    if (!formData.project_id.trim()) {
      newErrors.project_id = "Project ID is required";
    }
    if (!formData.type_of_work.trim()) {
      newErrors.type_of_work = "Type of work is required";
    }
    if (!formData.infrastructure_type.trim()) {
      newErrors.infrastructure_type = "Infrastructure type is required";
    }
    if (!formData.longitude) {
      newErrors.longitude = "Longitude is required";
    } else if (isNaN(formData.longitude)) {
      newErrors.longitude = "Must be a valid number";
    }
    if (!formData.latitude) {
      newErrors.latitude = "Latitude is required";
    } else if (isNaN(formData.latitude)) {
      newErrors.latitude = "Must be a valid number";
    }
    if (!formData.contract_id.trim()) {
      newErrors.contract_id = "Contract ID is required";
    }
    if (!formData.approved_budget) {
      newErrors.approved_budget = "Approved budget is required";
    } else if (
      isNaN(formData.approved_budget) ||
      formData.approved_budget <= 0
    ) {
      newErrors.approved_budget = "Must be a valid positive number";
    }
    if (!formData.contract_cost) {
      newErrors.contract_cost = "Contract cost is required";
    } else if (isNaN(formData.contract_cost) || formData.contract_cost <= 0) {
      newErrors.contract_cost = "Must be a valid positive number";
    }
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    if (!formData.funding_year) {
      newErrors.funding_year = "Funding year is required";
    } else if (isNaN(formData.funding_year) || formData.funding_year < 2000) {
      newErrors.funding_year = "Must be a valid year";
    }
    if (!formData.contractor_name.trim()) {
      newErrors.contractor_name = "Contractor name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post("/api/projects", {
        ...formData,
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude),
        approved_budget: parseFloat(formData.approved_budget),
        contract_cost: parseFloat(formData.contract_cost),
        funding_year: parseInt(formData.funding_year),
        start_date: new Date(formData.start_date).toISOString(),
      });

      if (response.data.success) {
        onSuccess(response.data.data);
        setFormData({
          project_name: "",
          region: "",
          legislative_district: "",
          district_engineering_office: "",
          project_id: "",
          type_of_work: "",
          infrastructure_type: "",
          longitude: "",
          latitude: "",
          contract_id: "",
          approved_budget: "",
          contract_cost: "",
          start_date: "",
          funding_year: "",
          contractor_name: "",
          status: "ongoing",
        });
      }
    } catch (error) {
      const message = error.response?.data?.error || "Failed to create project";
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Add New Project</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.project_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., Flood Control System Phase 1"
            />
            {errors.project_name && (
              <p className="text-red-500 text-xs mt-1">{errors.project_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Region *
            </label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.region
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., Metro Manila"
            />
            {errors.region && (
              <p className="text-red-500 text-xs mt-1">{errors.region}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Legislative District *
            </label>
            <input
              type="text"
              name="legislative_district"
              value={formData.legislative_district}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.legislative_district
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., District 1"
            />
            {errors.legislative_district && (
              <p className="text-red-500 text-xs mt-1">
                {errors.legislative_district}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              District Engineering Office *
            </label>
            <input
              type="text"
              name="district_engineering_office"
              value={formData.district_engineering_office}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.district_engineering_office
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., DPWH Metro Manila"
            />
            {errors.district_engineering_office && (
              <p className="text-red-500 text-xs mt-1">
                {errors.district_engineering_office}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project ID *
            </label>
            <input
              type="text"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.project_id
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., PROJ-2024-001"
            />
            {errors.project_id && (
              <p className="text-red-500 text-xs mt-1">{errors.project_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contract ID *
            </label>
            <input
              type="text"
              name="contract_id"
              value={formData.contract_id}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.contract_id
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., CONT-2024-001"
            />
            {errors.contract_id && (
              <p className="text-red-500 text-xs mt-1">{errors.contract_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type of Work *
            </label>
            <input
              type="text"
              name="type_of_work"
              value={formData.type_of_work}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.type_of_work
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., Construction"
            />
            {errors.type_of_work && (
              <p className="text-red-500 text-xs mt-1">{errors.type_of_work}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Infrastructure Type *
            </label>
            <input
              type="text"
              name="infrastructure_type"
              value={formData.infrastructure_type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.infrastructure_type
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., Pumping Station"
            />
            {errors.infrastructure_type && (
              <p className="text-red-500 text-xs mt-1">
                {errors.infrastructure_type}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Longitude *
            </label>
            <input
              type="number"
              step="0.0001"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.longitude
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., 120.9842"
            />
            {errors.longitude && (
              <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Latitude *
            </label>
            <input
              type="number"
              step="0.0001"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.latitude
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., 14.5995"
            />
            {errors.latitude && (
              <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Approved Budget (₱) *
            </label>
            <input
              type="number"
              step="0.01"
              name="approved_budget"
              value={formData.approved_budget}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.approved_budget
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., 10000000"
              min="0"
            />
            {errors.approved_budget && (
              <p className="text-red-500 text-xs mt-1">
                {errors.approved_budget}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contract Cost (₱) *
            </label>
            <input
              type="number"
              step="0.01"
              name="contract_cost"
              value={formData.contract_cost}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.contract_cost
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., 9500000"
              min="0"
            />
            {errors.contract_cost && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contract_cost}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.start_date
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
            />
            {errors.start_date && (
              <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Funding Year *
            </label>
            <input
              type="number"
              name="funding_year"
              value={formData.funding_year}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.funding_year
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., 2024"
              min="2000"
            />
            {errors.funding_year && (
              <p className="text-red-500 text-xs mt-1">{errors.funding_year}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Contractor Name *
              </label>
              <button
                type="button"
                onClick={() =>
                  setShowContractorSelector(!showContractorSelector)
                }
                disabled={
                  !formData.region ||
                  !formData.type_of_work ||
                  !formData.approved_budget
                }
                className={`text-xs font-medium px-3 py-1 rounded-lg flex items-center gap-1 transition ${
                  !formData.region ||
                  !formData.type_of_work ||
                  !formData.approved_budget
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-brand-primary hover:bg-brand-primary/10"
                }`}
              >
                <Wand2 className="w-4 h-4" />
                AI Recommend
              </button>
            </div>
            <input
              type="text"
              name="contractor_name"
              value={formData.contractor_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.contractor_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="Select from recommendations or enter manually"
            />
            {errors.contractor_name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contractor_name}
              </p>
            )}

            {showContractorSelector && (
              <div className="mt-3">
                <ContractorSelector
                  region={formData.region}
                  typeOfWork={formData.type_of_work}
                  budget={formData.approved_budget}
                  infrastructureType={formData.infrastructure_type}
                  selectedContractor={
                    formData.contractor_name
                      ? { name: formData.contractor_name }
                      : null
                  }
                  onContractorSelect={(contractor) => {
                    setFormData((prev) => ({
                      ...prev,
                      contractor_name: contractor.name,
                    }));
                    setSelectedContractorId(contractor.id);
                    setShowContractorSelector(false);
                  }}
                  onClose={() => setShowContractorSelector(false)}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
            >
              <option value="ongoing">Ongoing</option>
              <option value="pending">Pending</option>
              <option value="finished">Finished</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-brand-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Project"
            )}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

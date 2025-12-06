import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import api from "../../../axios";

export default function ContractorForm({ onSuccess, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    contact_number: "",
    email: "",
    address: "",
    license_number: "",
    years_in_business: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    }
    if (!formData.contact_person.trim()) {
      newErrors.contact_person = "Contact person is required";
    }
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = "Contact number is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.license_number.trim()) {
      newErrors.license_number = "License number is required";
    }
    if (!formData.years_in_business) {
      newErrors.years_in_business = "Years in business is required";
    } else if (
      isNaN(formData.years_in_business) ||
      formData.years_in_business < 0
    ) {
      newErrors.years_in_business = "Must be a valid number";
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
      const response = await api.post("/api/contractors", {
        ...formData,
        years_in_business: parseInt(formData.years_in_business),
      });

      if (response.data.success) {
        onSuccess(response.data.data);
        setFormData({
          company_name: "",
          contact_person: "",
          contact_number: "",
          email: "",
          address: "",
          license_number: "",
          years_in_business: "",
        });
      }
    } catch (error) {
      const message =
        error.response?.data?.error || "Failed to create contractor";
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Add New Contractor</h2>
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
              Company Name *
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.company_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., ABC Construction"
            />
            {errors.company_name && (
              <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Person *
            </label>
            <input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.contact_person
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., John Doe"
            />
            {errors.contact_person && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contact_person}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.contact_number
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., +63 912 345 6789"
            />
            {errors.contact_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.contact_number}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., contact@company.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.address
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., 123 Main St, Manila"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              License Number *
            </label>
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.license_number
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., LIC-2024-001"
            />
            {errors.license_number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.license_number}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Years in Business *
            </label>
            <input
              type="number"
              name="years_in_business"
              value={formData.years_in_business}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.years_in_business
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-brand-primary"
              }`}
              placeholder="e.g., 5"
              min="0"
            />
            {errors.years_in_business && (
              <p className="text-red-500 text-xs mt-1">
                {errors.years_in_business}
              </p>
            )}
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
              "Add Contractor"
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

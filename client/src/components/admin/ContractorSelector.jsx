import React, { useState, useEffect } from "react";
import { ChevronDown, Star, Award, TrendingUp, Loader2, X } from "lucide-react";
import api from "../../../axios";

export default function ContractorSelector({
  region,
  typeOfWork,
  budget,
  infrastructureType,
  selectedContractor,
  onContractorSelect,
  onClose,
}) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (region && typeOfWork && budget) {
      fetchRecommendations();
    }
  }, [region, typeOfWork, budget]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/contractors/recommendations", {
        region,
        type_of_work: typeOfWork,
        approved_budget: parseFloat(budget) || 0,
        infrastructure_type: infrastructureType,
      });

      if (response.data.success) {
        setRecommendations(response.data.data || []);
        if (!response.data.data || response.data.data.length === 0) {
          setError("No contractors available for these criteria");
        }
      } else {
        setError(response.data.error || "Failed to get recommendations");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching recommendations");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-blue-50 border-blue-200";
    if (score >= 40) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Recommended Contractors
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4">
        AI-powered recommendations based on project requirements
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-brand-primary mr-2" />
          <span className="text-gray-600">Analyzing contractors...</span>
        </div>
      ) : error ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700 text-sm">
          {error}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-600 text-sm text-center py-8">
          No contractor recommendations available
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((contractor, index) => (
            <button
              key={contractor.contractorId}
              onClick={() => {
                onContractorSelect({
                  name: contractor.company_name,
                  id: contractor.contractorId,
                });
                setShowDropdown(false);
              }}
              className={`w-full text-left border rounded-lg p-4 transition hover:shadow-md ${
                selectedContractor?.name === contractor.company_name
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {index === 0 && (
                      <Award className="w-4 h-4 text-amber-500" />
                    )}
                    <h4 className="font-semibold text-gray-900">
                      #{index + 1} {contractor.company_name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    {contractor.contact_person} • {contractor.contact_number}
                  </p>
                </div>

                <div
                  className={`flex flex-col items-end gap-1 px-3 py-2 rounded-lg border ${getScoreBg(
                    contractor.total_score
                  )}`}
                >
                  <span
                    className={`text-2xl font-bold ${getScoreColor(
                      contractor.total_score
                    )}`}
                  >
                    {contractor.total_score}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    Score
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600">Success Rate</p>
                  <p className="font-semibold text-green-600 text-sm">
                    {contractor.success_rate}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600">Credit Score</p>
                  <p className="font-semibold text-brand-primary text-sm">
                    {contractor.credit_score}/100
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600">On-Time Rate</p>
                  <p className="font-semibold text-blue-600 text-sm">
                    {contractor.on_time_completion_rate}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600">Experience</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {contractor.years_in_business}y
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                {contractor.reasons && contractor.reasons.length > 0 && (
                  <div className="space-y-1">
                    {contractor.reasons.slice(0, 3).map((reason, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-gray-700"
                      >
                        <Star className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                    {contractor.reasons.length > 3 && (
                      <p className="text-xs text-gray-500 italic">
                        +{contractor.reasons.length - 3} more reasons
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex gap-2">
                  <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                    {contractor.completed_projects} completed
                  </span>
                  <span className="inline-block bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-medium">
                    {contractor.ongoing_projects} ongoing
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onContractorSelect({
                      name: contractor.company_name,
                      id: contractor.contractorId,
                    });
                    setShowDropdown(false);
                  }}
                  className="text-brand-primary hover:text-brand-primary/80 font-medium text-xs"
                >
                  Select →
                </button>
              </div>
            </button>
          ))}

          <button
            onClick={fetchRecommendations}
            className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
          >
            Refresh Recommendations
          </button>
        </div>
      )}

      {selectedContractor && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-700 font-medium">
            ✓ Selected: {selectedContractor.name}
          </p>
        </div>
      )}
    </div>
  );
}

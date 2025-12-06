import Contractor from "../models/Contractor.js";

export const getAllContractors = async (req, res) => {
  try {
    const contractors = await Contractor.find({})
      .populate("projects", "project_name status contract_id risk_score")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: contractors });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getContractorById = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.params.id).populate(
      "projects",
      "project_name status contract_id risk_score approved_budget contract_cost start_date completion_date_actual"
    );

    if (!contractor) {
      return res
        .status(404)
        .json({ success: false, error: "Contractor not found" });
    }

    return res.status(200).json({ success: true, data: contractor });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const createContractor = async (req, res) => {
  try {
    const contractor = new Contractor(req.body);
    await contractor.save();
    return res.status(201).json({ success: true, data: contractor });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Contractor with this company name already exists",
        });
    }
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const updateContractor = async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("projects");

    if (!contractor) {
      return res
        .status(404)
        .json({ success: false, error: "Contractor not found" });
    }

    return res.status(200).json({ success: true, data: contractor });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteContractor = async (req, res) => {
  try {
    const contractor = await Contractor.findByIdAndDelete(req.params.id);

    if (!contractor) {
      return res
        .status(404)
        .json({ success: false, error: "Contractor not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Contractor deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const recommendContractors = async (req, res) => {
  try {
    const { region, type_of_work, approved_budget, infrastructure_type } =
      req.body;

    if (!region || !type_of_work || !approved_budget) {
      return res.status(400).json({
        success: false,
        error: "Region, type_of_work, and approved_budget are required",
      });
    }

    const allContractors = await Contractor.find({ verified: true }).sort({
      createdAt: -1,
    });

    const scoredContractors = allContractors.map((contractor) => {
      let score = 0;
      const reasons = [];

      // 1. Success Rate (30 points max)
      const successScore = Math.min((contractor.success_rate / 100) * 30, 30);
      score += successScore;

      // 2. Credit Score (25 points max)
      const creditScore = Math.min((contractor.credit_score / 100) * 25, 25);
      score += creditScore;

      // 3. On-time Completion Rate (20 points max)
      const onTimeScore = Math.min(
        (contractor.on_time_completion_rate / 100) * 20,
        20
      );
      score += onTimeScore;

      // 4. Budget Adherence (15 points max)
      const budgetScore = Math.min(
        (contractor.budget_adherence_rate / 100) * 15,
        15
      );
      score += budgetScore;

      // 5. Regional Expertise (5 bonus points)
      let regionalBonus = 0;
      const regionMatch = contractor.location_preferences?.find(
        (pref) => pref.region?.toLowerCase() === region.toLowerCase()
      );
      if (regionMatch) {
        regionalBonus = 5;
        score += regionalBonus;
        reasons.push(`Has ${regionMatch.project_count} projects in ${region}`);
      }

      // 6. Project Type Expertise (3 bonus points)
      let typeBonus = 0;
      const typeMatch = contractor.project_type_expertise?.find(
        (exp) => exp.type_of_work?.toLowerCase() === type_of_work.toLowerCase()
      );
      if (typeMatch) {
        typeBonus = 3;
        score += typeBonus;
        reasons.push(
          `${typeMatch.success_rate}% success rate for ${type_of_work}`
        );
      }

      // 7. Years in Business (2 points max, 1 point per 5 years)
      const experienceScore = Math.min(
        (contractor.years_in_business / 5) * 2,
        2
      );
      score += experienceScore;
      if (contractor.years_in_business >= 5) {
        reasons.push(`${contractor.years_in_business} years in business`);
      }

      // 8. Workload Check (avoid if too busy)
      let workloadPenalty = 0;
      if (contractor.ongoing_projects > 5) {
        workloadPenalty = 5;
        score -= workloadPenalty;
        reasons.push(
          `Currently managing ${contractor.ongoing_projects} ongoing projects`
        );
      }

      // 9. Budget Capacity Check
      let capacityScore = 0;
      const avgContractValue =
        contractor.total_contract_value /
        Math.max(contractor.total_projects, 1);
      const budgetRatio = approved_budget / avgContractValue;

      if (budgetRatio >= 0.5 && budgetRatio <= 1.5) {
        capacityScore = 5;
        score += capacityScore;
        reasons.push("Budget aligns with contractor's typical project size");
      } else if (budgetRatio < 0.5 || budgetRatio > 1.5) {
        reasons.push("Budget differs significantly from typical projects");
      }

      return {
        contractorId: contractor._id,
        company_name: contractor.company_name,
        contact_person: contractor.contact_person,
        contact_number: contractor.contact_number,
        email: contractor.email,
        success_rate: contractor.success_rate,
        credit_score: contractor.credit_score,
        years_in_business: contractor.years_in_business,
        ongoing_projects: contractor.ongoing_projects,
        completed_projects: contractor.completed_projects,
        total_projects: contractor.total_projects,
        on_time_completion_rate: contractor.on_time_completion_rate,
        budget_adherence_rate: contractor.budget_adherence_rate,
        total_score: Math.round(score * 10) / 10,
        reasons: reasons,
      };
    });

    // Sort by score descending and return top 5
    const topRecommendations = scoredContractors
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, 5)
      .filter((c) => c.total_score > 20); // Minimum score threshold

    return res.status(200).json({
      success: true,
      data: topRecommendations,
      count: topRecommendations.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

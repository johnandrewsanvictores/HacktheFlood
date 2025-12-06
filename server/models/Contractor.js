import mongoose from "mongoose";

const contractorSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contact_person: {
      type: String,
      required: true,
      trim: true,
    },
    contact_number: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    license_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    years_in_business: {
      type: Number,
      required: true,
      min: 0,
    },
    contract_ids: [
      {
        type: String,
        ref: "Project",
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    total_projects: {
      type: Number,
      default: 0,
    },
    completed_projects: {
      type: Number,
      default: 0,
    },
    ongoing_projects: {
      type: Number,
      default: 0,
    },
    total_contract_value: {
      type: Number,
      default: 0,
    },
    success_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    credit_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    average_completion_time_days: {
      type: Number,
      default: 0,
    },
    on_time_completion_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    budget_adherence_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    location_preferences: [
      {
        region: String,
        district: String,
        project_count: Number,
      },
    ],
    project_type_expertise: [
      {
        type_of_work: String,
        project_count: Number,
        success_rate: Number,
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Contractor = mongoose.model("Contractor", contractorSchema);

export default Contractor;

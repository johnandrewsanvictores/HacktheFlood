import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    region: {
      type: String,
      required: true,
    },
    legislative_district: {
      type: String,
      required: true,
    },
    district_engineering_office: {
      type: String,
      required: true,
    },
    project_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    project_name: {
      type: String,
      required: true,
    },
    type_of_work: {
      type: String,
      required: true,
    },
    infrastructure_type: {
      type: String,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    contract_id: {
      type: String,
      required: true,
      unique: true,
    },
    approved_budget: {
      type: Number,
      required: true,
    },
    contract_cost: {
      type: Number,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    funding_year: {
      type: Number,
      required: true,
    },
    completion_date_actual: {
      type: Date,
    },
    contractor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contractor",
    },
    contractor_name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ongoing", "finished", "cancelled", "pending"],
      default: "ongoing",
    },
    documents: [
      {
        type: {
          type: String,
          enum: ["procurement", "progress_photo", "inspection", "other"],
        },
        url: String,
        uploaded_at: Date,
      },
    ],
    risk_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    is_flagged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;

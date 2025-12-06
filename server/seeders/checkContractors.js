import Contractor from "../models/Contractor.js";
import connectDbB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const checkContractors = async () => {
  try {
    await connectDbB();
    console.log("Connected to database");

    const contractors = await Contractor.find({});
    console.log(`\n✓ Found ${contractors.length} contractors in database\n`);

    if (contractors.length > 0) {
      console.log("Sample contractor data:");
      contractors.slice(0, 3).forEach((c) => {
        console.log(`
  Company: ${c.company_name}
  Contact: ${c.contact_person} - ${c.contact_number}
  Email: ${c.email}
  License: ${c.license_number}
  Years: ${c.years_in_business}
  Success Rate: ${c.success_rate}%
  Credit Score: ${c.credit_score}/100
  ---`);
      });
    } else {
      console.log("⚠️  No contractors found in database!");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

checkContractors();

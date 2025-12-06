import Contractor from "../models/Contractor.js";
import connectDbB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const generatePhilippinePhoneNumber = () => {
  const providers = ["917", "918", "919", "920", "921", "910", "911", "912"];
  const provider = providers[Math.floor(Math.random() * providers.length)];
  const number = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, "0");
  return `+63 ${provider} ${number.slice(0, 3)} ${number.slice(3)}`;
};

const migrateContractors = async () => {
  try {
    await connectDbB();
    console.log("Connected to database");

    const contractors = await Contractor.find({});
    console.log(`Found ${contractors.length} contractors to migrate`);

    const updates = [];

    for (const contractor of contractors) {
      const updateData = {};

      if (!contractor.contact_person) {
        updateData.contact_person = "Not Provided";
      }
      if (!contractor.contact_number) {
        updateData.contact_number = generatePhilippinePhoneNumber();
      }
      if (!contractor.email) {
        updateData.email = `contact@${contractor.company_name
          .toLowerCase()
          .replace(/\s+/g, "")}.com`;
      }
      if (!contractor.address) {
        updateData.address = "Address not provided";
      }
      if (!contractor.license_number) {
        updateData.license_number = `LIC-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`;
      }
      if (
        contractor.years_in_business === undefined ||
        contractor.years_in_business === null
      ) {
        updateData.years_in_business = 0;
      }

      if (Object.keys(updateData).length > 0) {
        updates.push(
          Contractor.findByIdAndUpdate(contractor._id, updateData, {
            new: true,
          })
        );
      }
    }

    if (updates.length > 0) {
      const results = await Promise.all(updates);
      console.log(`✓ Successfully migrated ${results.length} contractors`);
      results.forEach((contractor) => {
        console.log(
          `  - ${contractor.company_name}: contact_number=${contractor.contact_number}`
        );
      });
    } else {
      console.log("✓ All contractors already have required fields");
    }

    console.log("\nMigration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrateContractors();

const bcrypt = require("bcrypt");
const sequelize = require("../config/dbSync");
const Lead = require("../models/LeadModel");
const Prospect = require("../models/ProspectModel");
const SalesPipeline = require("../models/SalesPipelineModel");
const Form = require("../models/FormModel");
const FormField = require("../models/FormFieldModel");
const PipelineStage = require("../models/PipelineStageModel");
const TextFieldType = require("../models/TextFieldTypeModel");

const seedDatabase = async (syncOption = { alter: true }) => {
  try {
    // Sync database
    await sequelize.sync(syncOption);
    console.log(`Database synced with ${JSON.stringify(syncOption)}`);

    // Insert default text field types
    const textFieldTypes = [
      { type_name: "Text", type_value: "text" },
      { type_name: "Phone Number", type_value: "number" },
      { type_name: "Email", type_value: "email" },
      { type_name: "Date", type_value: "date" },
      { type_name: "Currency", type_value: "text" },
    ];
    await TextFieldType.bulkCreate(textFieldTypes, { ignoreDuplicates: true });

    console.log("Sales CRM Database seeded successfully with ITEQ Solution data.");
  } catch (error) {
    console.error("Error inserting initial data:", error);
  }
};

module.exports = seedDatabase;

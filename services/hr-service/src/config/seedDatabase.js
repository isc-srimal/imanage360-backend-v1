const bcrypt = require("bcrypt");
const sequelize = require("../config/dbSync");
const Department = require("../models/DepartmentModel");

const seedDatabase = async (syncOption = { alter: true }) => {
  try {
    // Sync database
    await sequelize.sync(syncOption);
    console.log(`Database synced with ${JSON.stringify(syncOption)}`);

    //-----------------------------------------------------HR Module Seeds------------------------------------------------------------

    // Seed Department Data
    const departments = [
      {
        departmentNo: 101,
        departmentName: "IT Department",
        departmentDescription:
          "Responsible for managing all IT infrastructure and software development",
        departmentHead: "John Doe",
        location: "Headquarters, Colombo",
        createdBy: "admin",
        status: "Active",
        staffName: "Jane Smith",
      },
      {
        departmentNo: 102,
        departmentName: "HR Department",
        departmentDescription:
          "Handles all human resources tasks including recruitment, payroll, and employee relations",
        departmentHead: "Mary Johnson",
        location: "Headquarters, Colombo",
        createdBy: "admin",
        status: "Active",
        staffName: "David Lee",
      },
      {
        departmentNo: 103,
        departmentName: "Sales Department",
        departmentDescription:
          "Handles sales and customer relationship management",
        departmentHead: "Robert Brown",
        location: "Headquarters, Colombo",
        createdBy: "admin",
        status: "Active",
        staffName: "Emily Davis",
      },
    ];

    await Department.bulkCreate(departments, { ignoreDuplicates: true });
    console.log("Departments successfully seeded!");

    console.log("Fixed Assets Database seeded successfully with ITEQ Solution data.");
  } catch (error) {
    console.error("Error inserting initial data:", error);
  }
};

module.exports = seedDatabase;

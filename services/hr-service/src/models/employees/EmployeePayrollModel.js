const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");

const EmployeePayrollModel = sequelize.define(
  "tbl_employee_payroll",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    basicSalary: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accommodationAllowance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foodAllowance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transportationAllowance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationalAccreditationBonus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    natureOfWorkAllowance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    socialBonus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    relocationAllowance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    otherBonuses: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    overTimeApplicable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    otRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   isDate: true,
      //   isWithinRange(value) {
      //     const date = new Date(value);
      //     const today = new Date();
      //     const pastLimit = new Date(today.setMonth(today.getMonth() - 6));
      //     const futureLimit = new Date(
      //       today.setFullYear(today.getFullYear() + 5)
      //     );
      //     if (date < pastLimit || date > futureLimit) {
      //       throw new Error(
      //         "Start date must be between 6 months ago and 5 years in the future."
      //       );
      //     }
      //   },
      // },
      // get() {
      //   const value = this.getDataValue("startDate");
      //   return value ? new Date(value).toISOString().split("T")[0] : null;
      // },
      // set(value) {
      //   this.setDataValue("startDate", value ? new Date(value) : null);
      // },
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: true,
      // set(value) {
      //   if (!value || value === "" || isNaN(new Date(value).getTime())) {
      //     this.setDataValue("endDate", null);
      //   } else {
      //     this.setDataValue("endDate", new Date(value));
      //   }
      // },
      // validate: {
      //   isDate: {
      //     args: true,
      //     msg: "End date must be a valid date.",
      //   },
      //   isWithinRange(value) {
      //     if (!value) return;
      //     const date = new Date(value);
      //     const today = new Date();
      //     const pastLimit = new Date(today.setMonth(today.getMonth() - 6));
      //     const futureLimit = new Date(today.setFullYear(today.getFullYear() + 5));
      //     if (date < pastLimit || date > futureLimit) {
      //       throw new Error(
      //         "End date must be between 6 months ago and 5 years in the future."
      //       );
      //     }
      //   },
      // },
      // get() {
      //   const value = this.getDataValue("endDate");
      //   return value ? new Date(value).toISOString().split("T")[0] : null;
      // },
    },
    fullPackageAllowance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fullPackageFoodAllowance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fullPackageTransportationAllowance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalSalary: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: true,
      defaultValue: "Active",
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tbl_employees",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "tbl_employee_payroll",
    timestamps: false,
  }
);

module.exports = EmployeePayrollModel;

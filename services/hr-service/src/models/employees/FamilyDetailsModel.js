const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");

const FamilyDetailsModel = sequelize.define("tbl_staff_family_members", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emergencyContactNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emergencyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emergencyRelationship: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numberOfFamilyMembers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  familyInQatar: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  relationship: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passportNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passportExpiry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qidNo: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  qidExpiry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  airTicket: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  insurance: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  schoolBenefit: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
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
}, {
  tableName: "tbl_staff_family_members",
  timestamps: false,
});

module.exports = FamilyDetailsModel;
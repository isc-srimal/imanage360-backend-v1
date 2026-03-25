const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync'); 
const JobPostingModel = require('../models/JobPostingModel');

const JobOnboardingModel = sequelize.define('tbl_job_onboarding', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    employeeName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    passportNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    QIDNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    contactNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    resume: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      get() {
        const value = this.getDataValue("resume");
        return value ? `/services/hr-service/public/uploads/resumeDocuments/${value}` : "";
      },
      set(value) {
        // Store only the filename, not the full path
        let filename = "";
        if (value) {
          if (typeof value === "string") {
            // Extract filename from full path if it's a path
            filename = value
              .replace(/^.*[\\\/]/, "")
              .replace(/^\/services\/hr-service\/public\/uploads\/careerDetailsDocuments\//, "");
          } else {
            // If it's a File object or already a filename
            filename = value;
          }
        }
        this.setDataValue("resume", filename);
      },
    },
    jobId: {
        type: DataTypes.INTEGER,
        references: {
            model: JobPostingModel,
            key: 'id',
        },
        allowNull: true,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    jobCode: {
        type: DataTypes.STRING(20),
        allowNull: true, 
        unique: true,
    },
    scheduledDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    scheduledTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: true,
        defaultValue: 'pending',
    },
    rejectedReason: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'tbl_job_onboarding',
    timestamps: false,
});

JobOnboardingModel.belongsTo(JobPostingModel, { foreignKey: 'jobId', as: 'job_posting' });
JobPostingModel.hasMany(JobOnboardingModel, { foreignKey: 'jobId', as: 'tbl_job_onboarding' });

module.exports = JobOnboardingModel;
const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync'); 

const JobPostingModel = sequelize.define('tbl_job_posting', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    jobCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jobDescription: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salary: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    postedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    jobType: {
        type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'),
        allowNull: false,
        defaultValue: 'Full-time', 
    },
    approvalStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
    },
    responsibilities: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    keyRequirements: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    qualifications: {
        type: DataTypes.JSON,
        allowNull: false,
    },
}, {
    tableName: 'tbl_job_posting',
    timestamps: false,
});

module.exports = JobPostingModel;
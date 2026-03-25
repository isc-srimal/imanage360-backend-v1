const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const CompanyProfileModel = sequelize.define('tbl_company_profiles', {
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    logoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
}, {
    tableName: 'tbl_company_profiles',
});

module.exports = CompanyProfileModel;

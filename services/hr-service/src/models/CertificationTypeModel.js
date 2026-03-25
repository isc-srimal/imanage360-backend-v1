const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const CertificationTypeModel = sequelize.define('tbl_certification_type', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    certificationType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_certification_type',
    timestamps: false,
});

module.exports = CertificationTypeModel;
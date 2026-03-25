const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const CertificationBodyModel = sequelize.define('tbl_certification_body', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    certificationBody: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_certification_body',
    timestamps: false,
});

module.exports = CertificationBodyModel;
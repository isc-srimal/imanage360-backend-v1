const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const OrganizationModel = require("./OrganizationsModel");
const CountryModel = sequelize.define('tbl_countries', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_enName: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    country_arName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_enNationality: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_arNationality: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'tbl_countries',
    timestamps: false,
});

const TenantsModel = sequelize.define(
  "tbl_tenants",
  {
    uid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    organization_uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OrganizationModel,
        key: "uid",
      },
    },
    tenant: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    domain: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    country_uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CountryModel,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    tableName: "tbl_tenants",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

TenantsModel.belongsTo(OrganizationModel, {
  foreignKey: "organization_uid",
  as: "organizations",
});

TenantsModel.belongsTo(CountryModel, {
  foreignKey: "country_uid",
  as: "country",
});

module.exports = TenantsModel;

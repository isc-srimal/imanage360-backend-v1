const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const AssetCategoryModel = sequelize.define('tbl_asset_categories', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    category_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
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
}, {
    tableName: 'tbl_asset_categories',
    timestamps: false,
});
const AssetSubcategoryModel = sequelize.define('tbl_asset_subcategories', {
    subcategory_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subcategory_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetCategoryModel,
            key: 'category_id',
        },
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
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
}, {
    tableName: 'tbl_asset_subcategories',
    timestamps: false,
});
const AssetCapacityModel = sequelize.define('tbl_asset_capacities', {
    capacity_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    capacity_value: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetCategoryModel,
            key: 'category_id',
        },
    },
    subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetSubcategoryModel,
            key: 'subcategory_id',
        },
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
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
}, {
    tableName: 'tbl_asset_capacities',
    timestamps: false,
});

const VehicleTypeModel = sequelize.define(
  "tbl_vehicle_type",
  {
    vehicle_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AssetCategoryModel,
        key: "category_id",
      },
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AssetSubcategoryModel,
        key: "subcategory_id",
      },
    },
    capacity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AssetCapacityModel,
        key: "capacity_id",
      },
    },
    vehicle_type_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
    tableName: "tbl_vehicle_type",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

VehicleTypeModel.belongsTo(AssetCategoryModel, {
  foreignKey: "category_id",
  as: "category",
});
AssetCategoryModel.hasMany(VehicleTypeModel, {
  foreignKey: "category_id",
  as: "vehicle_type",
});

VehicleTypeModel.belongsTo(AssetSubcategoryModel, {
  foreignKey: "subcategory_id",
  as: "subcategory",
});
AssetSubcategoryModel.hasMany(VehicleTypeModel, {
  foreignKey: "subcategory_id",
  as: "vehicle_type",
});

VehicleTypeModel.belongsTo(AssetCapacityModel, {
  foreignKey: "capacity_id",
  as: "capacity",
});
AssetCapacityModel.hasMany(VehicleTypeModel, {
  foreignKey: "capacity_id",
  as: "vehicle_type",
});

module.exports = VehicleTypeModel;

const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const AssetCategoryModel = require('./AssetCategoryModel');
const AssetSubcategoryModel = require('./AssetSubcategoryModel');
const AssetCapacityModel = require('./AssetCapacityModel');

const AssetClassificationModel = sequelize.define('tbl_asset_classifications', {
    classification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    capacity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetCapacityModel,
            key: 'capacity_id',
        },
    },
    default_dep_method: {
        type: DataTypes.ENUM('straight_line', 'declining_balance', 'units_of_production'),
        allowNull: false,
    },
    default_dep_rate: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    default_useful_life: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    gl_account_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    // New fields for Units of Production method
    units_of_measurement: {
        type: DataTypes.ENUM('Km', 'Hrs', 'Units'),
        allowNull: true,
    },
    total_output: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
        },
    },
    classification_name: {
        type: DataTypes.STRING(250),
        allowNull: false,
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
    tableName: 'tbl_asset_classifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Relationship
AssetClassificationModel.belongsTo(AssetCategoryModel, {
    foreignKey: 'category_id',
    as: 'category',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

AssetClassificationModel.belongsTo(AssetSubcategoryModel, {
    foreignKey: 'subcategory_id',
    as: 'subcategory',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

AssetClassificationModel.belongsTo(AssetCapacityModel, {
    foreignKey: 'capacity_id',
    as: 'capacity',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

module.exports = AssetClassificationModel;
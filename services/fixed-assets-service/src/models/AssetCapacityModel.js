const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const AssetCategoryModel = require('./AssetCategoryModel');
const AssetSubcategoryModel = require('./AssetSubcategoryModel');

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
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['capacity_value'], // Add index on category_name
        },
    ],
});

// Relationship
AssetCapacityModel.belongsTo(AssetCategoryModel, {
    foreignKey: 'category_id',
    as: 'category',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

AssetCapacityModel.belongsTo(AssetSubcategoryModel, {
    foreignKey: 'subcategory_id',
    as: 'subcategory',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});


module.exports = AssetCapacityModel;
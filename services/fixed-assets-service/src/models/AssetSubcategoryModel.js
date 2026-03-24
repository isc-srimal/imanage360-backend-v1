const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const AssetCategoryModel = require('./AssetCategoryModel');

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
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['subcategory_name'],
        },
    ],
});

// Define both sides of the relationship
AssetSubcategoryModel.belongsTo(AssetCategoryModel, {
    foreignKey: 'category_id',
    as: 'category',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

AssetCategoryModel.hasMany(AssetSubcategoryModel, {
    foreignKey: 'category_id',
    as: 'subcategories',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

module.exports = AssetSubcategoryModel;
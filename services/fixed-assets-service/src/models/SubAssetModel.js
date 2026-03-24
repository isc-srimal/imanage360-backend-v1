const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const SupplierIDModel = require('./SupplierIDModel');
const AssetModel = require('./AssetModel');
const AssetClassificationModel = require('./AssetClassificationModel');
const AssetCategoryModel = require('./AssetCategoryModel');
const AssetSubcategoryModel = require('./AssetSubcategoryModel');
const AssetCapacityModel = require('./AssetCapacityModel');
const ModelAssetModel = require('./ModelAssetModel');
const ManufacturerModel = require('./ManufacturerModel');

const SubAssetModel = sequelize.define('tbl_sub_assets', {
    sub_asset_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tag_numbers: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: true,
    },
    serial_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
    },
    engine_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    year_of_manufacture: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    manufacturer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ManufacturerModel,
            key: 'id',
        },
    },
    model_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ModelAssetModel,
            key: 'id',
        },
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    classification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetClassificationModel,
            key: 'classification_id',
        },
    },
    asset_number: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: AssetModel,
            key: 'asset_number',
        },
    },
    category_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: AssetCategoryModel,
            key: 'category_name',
        },
    },
    subcategory_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: AssetSubcategoryModel,
            key: 'subcategory_name',
        },
    },
    capacity_value: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: AssetCapacityModel,
            key: 'capacity_value',
        },
    },
    acquisition_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    acquisition_cost: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    supplier_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: SupplierIDModel,
            key: 'supplier_name',
        },
    },
    purchase_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    useful_life: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    residual_value: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    current_value: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'disposed', 'transferred', 'in_construction'),
        defaultValue: 'active',
    },
    barcode: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    rfid_tag: {
        type: DataTypes.STRING(100),
        allowNull: true,
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
    tableName: 'tbl_sub_assets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Relationships
SubAssetModel.belongsTo(AssetClassificationModel, {
    foreignKey: 'classification_id',
    as: 'classification',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});
SubAssetModel.belongsTo(AssetCategoryModel, {
    foreignKey: 'category_name',
    as: 'category',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
SubAssetModel.belongsTo(AssetSubcategoryModel, {
    foreignKey: 'subcategory_name',
    as: 'subcategory',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
SubAssetModel.belongsTo(AssetCapacityModel, {
    foreignKey: 'capacity_value',
    as: 'capacity',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
SubAssetModel.belongsTo(ManufacturerModel, {
    foreignKey: 'manufacturer_id',
    as: 'manufacturer',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
SubAssetModel.belongsTo(ModelAssetModel, {
    foreignKey: 'model_id',
    as: 'model',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
SubAssetModel.belongsTo(AssetModel, {
    foreignKey: 'asset_number',
    as: 'asset',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
SubAssetModel.belongsTo(SupplierIDModel, {
    foreignKey: 'supplier_name',
    as: 'supplier',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});

module.exports = SubAssetModel;
const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const AssetCategoryModel = require('./AssetCategoryModel');
const AssetSubcategoryModel = require('./AssetSubcategoryModel');
const AssetCapacityModel = require('./AssetCapacityModel');
const ModelAssetModel = require('./ModelAssetModel');
const ManufacturerModel = require('./ManufacturerModel');
const AssetClassificationModel = require('./AssetClassificationModel');
const LocationIDModel = require('./LocationIDModel');
const CostCenterIDModel = require('./CostCenterIDModel');
const CustodianIDModel = require('./CustodianIDModel');
const SupplierIDModel = require('./SupplierIDModel');
const DepartmentModel = sequelize.define('tbl_department', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    departmentName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'tbl_department',
    timestamps: false,
});

const AssetModel = sequelize.define('tbl_assets', {
    asset_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    asset_number: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    tag_number: {
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
    vehicle_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    VIN: {
        type: DataTypes.STRING(100),
        allowNull: true,
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
        allowNull: true,
        references: {
            model: AssetCapacityModel,
            key: 'capacity_id',
        },
    },
    location_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: LocationIDModel,
            key: 'location_name',
        },
    },
    cost_center_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: CostCenterIDModel,
            key: 'cost_center_name',
        },
    },
    departmentName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: DepartmentModel,
            key: 'departmentName',
        },
    },
    custodian_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: CustodianIDModel,
            key: 'custodian_name',
        },
    },
    acquisition_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    acquisition_cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    accumulated_depreciation: {
        type: DataTypes.FLOAT,
        allowNull: true,
        // No references here, as this is the column being referenced by DepreciationScheduleModel
    },
    monthly_depreciation: {
        type: DataTypes.FLOAT,
        allowNull: true,
        // No references here
    },
    yearly_depreciation: {
        type: DataTypes.FLOAT,
        allowNull: true,
        // No references here
    },
    is_depreciation_calculated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    useful_life: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    default_dep_rate: {
        type: DataTypes.FLOAT,
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
    journal_entry_id: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    photo_attachments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    document_attachments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    warranty_details: {
        type: DataTypes.TEXT,
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
    tableName: 'tbl_assets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [ // Add this new section for indexes
        {
            fields: ['accumulated_depreciation'],
        },
        {
            fields: ['yearly_depreciation'],
        },
        {
            fields: ['monthly_depreciation'],
        },
        {
            fields: ['asset_number'],
        },
    ],
});

// Relationships
AssetModel.belongsTo(AssetClassificationModel, {
    foreignKey: 'classification_id',
    as: 'classification',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});
AssetModel.belongsTo(AssetCategoryModel, {
    foreignKey: 'category_id',
    as: 'category',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});
AssetModel.belongsTo(AssetSubcategoryModel, {
    foreignKey: 'subcategory_id',
    as: 'subcategory',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});
AssetModel.belongsTo(AssetCapacityModel, {
    foreignKey: 'capacity_id',
    as: 'capacity',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
AssetModel.belongsTo(ManufacturerModel, {
    foreignKey: 'manufacturer_id',
    as: 'manufacturer',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
AssetModel.belongsTo(ModelAssetModel, {
    foreignKey: 'model_id',
    as: 'model',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
AssetModel.belongsTo(LocationIDModel, {
    foreignKey: 'location_name',
    as: 'location',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
AssetModel.belongsTo(DepartmentModel, {
    foreignKey: 'departmentName',
    as: 'department',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
AssetModel.belongsTo(CostCenterIDModel, {
    foreignKey: 'cost_center_name',
    as: 'cost_center',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
AssetModel.belongsTo(CustodianIDModel, {
    foreignKey: 'custodian_name',
    as: 'custodian',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});
AssetModel.belongsTo(SupplierIDModel, {
    foreignKey: 'supplier_name',
    as: 'supplier',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
});

module.exports = AssetModel;
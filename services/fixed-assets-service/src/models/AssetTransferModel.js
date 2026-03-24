const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const AssetModel = require('./AssetModel');
const LocationIDModel = require('./LocationIDModel');
const CostCenterIDModel = require('./CostCenterIDModel');
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

const AssetTransferModel = sequelize.define('tbl_asset_transfers', {
    transfer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    asset_number: {
        type: DataTypes.STRING(255),
        allowNull: false,
        references: {
            model: AssetModel,
            key: 'asset_number',
        },
    },
    sub_asset_descriptions: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [], // Explicitly set default to empty array
        get() {
            // Ensure sub_asset_descriptions is always returned as an array
            const value = this.getDataValue('sub_asset_descriptions');
            return value ? value : [];
        },
        set(value) {
            // Ensure sub_asset_descriptions is stored as a JSON array
            this.setDataValue('sub_asset_descriptions', Array.isArray(value) ? value : []);
        },
    },
    from_location_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: LocationIDModel,
            key: 'location_name',
        },
    },
    from_department_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: DepartmentModel,
            key: 'departmentName',
        },
    },
    from_cost_center_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: CostCenterIDModel,
            key: 'cost_center_name',
        },
    },
    to_location_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: LocationIDModel,
            key: 'location_name',
        },
    },
    to_department_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: DepartmentModel,
            key: 'departmentName',
        },
    },
    to_cost_center_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: CostCenterIDModel,
            key: 'cost_center_name',
        },
    },
    transfer_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: {
                msg: 'Transfer date must be a valid date in YYYY-MM-DD format',
            },
            notFutureDate(value) {
                if (new Date(value) > new Date()) {
                    throw new Error('Transfer date cannot be in the future');
                }
            },
        },
    },
    transfer_reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    initiated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    finance_approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    approval_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                msg: 'Approval date must be a valid date in YYYY-MM-DD format',
            },
            notFutureDate(value) {
                if (value && new Date(value) > new Date()) {
                    throw new Error('Approval date cannot be in the future');
                }
            },
        },
    },
    finance_approval_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: {
                msg: 'Finance approval date must be a valid date in YYYY-MM-DD format',
            },
            notFutureDate(value) {
                if (value && new Date(value) > new Date()) {
                    throw new Error('Finance approval date cannot be in the future');
                }
            },
        },
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'manager_approved', 'finance_approved', 'rejected'),
        defaultValue: 'pending',
    },
    journal_entry_id: {
        type: DataTypes.STRING(20),
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
    tableName: 'tbl_asset_transfers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

AssetTransferModel.belongsTo(AssetModel, {
    foreignKey: 'asset_number',
    as: 'asset',
});
AssetTransferModel.belongsTo(LocationIDModel, {
    foreignKey: 'from_location_name',
    as: 'from_location',
});
AssetTransferModel.belongsTo(LocationIDModel, {
    foreignKey: 'to_location_name',
    as: 'to_location',
});
AssetTransferModel.belongsTo(DepartmentModel, {
    foreignKey: 'from_department_name',
    as: 'from_department',
});
AssetTransferModel.belongsTo(DepartmentModel, {
    foreignKey: 'to_department_name',
    as: 'to_department',
});
AssetTransferModel.belongsTo(CostCenterIDModel, {
    foreignKey: 'from_cost_center_name',
    as: 'from_cost_center',
});
AssetTransferModel.belongsTo(CostCenterIDModel, {
    foreignKey: 'to_cost_center_name',
    as: 'to_cost_center',
});

module.exports = AssetTransferModel;
const bcrypt = require("bcrypt");
const sequelize = require("../config/dbSync");
const Assets = require("../models/AssetModel");
const AssetTransfer = require("../models/AssetTransferModel");
const AssetDisposal = require("../models/AssetDisposalModel");
const AssetCategory = require("../models/AssetCategoryModel");
const DepreciationSchedule = require("../models/DepreciationScheduleModel");
const AssetSubCategory = require("../models/AssetSubcategoryModel");
const AssetCapacity = require("../models/AssetCapacityModel");
const AssetClassification = require("../models/AssetClassificationModel");
const LocationID = require("../models/LocationIDModel");
const CustodianID = require("../models/CustodianIDModel");
const CostCenterID = require("../models/CostCenterIDModel");
const SupplierID = require("../models/SupplierIDModel");
const SubAsset = require("../models/SubAssetModel");
const ModelAssetModel = require("../models/ModelAssetModel");
const ManufacturerModel = require("../models/ManufacturerModel");

const seedDatabase = async (syncOption = { alter: true }) => {
  try {
    // Sync database
    await sequelize.sync(syncOption);
    console.log(`Database synced with ${JSON.stringify(syncOption)}`);

    //-----------------------------------------------------Fixed Assets Module Seeds------------------------------------------------------------

    // Seed AssetCategoryModel
    const categories = await AssetCategory.bulkCreate(
      [
        {
          category_name: "Heavy Equipment",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Light Vehicle",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Forklift",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetSubcategoryModel
    const subcategories = await AssetSubCategory.bulkCreate(
      [
        {
          subcategory_name: "Boom Truck",
          category_id: categories[0].category_id,
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          subcategory_name: "Crane",
          category_id: categories[1].category_id,
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          subcategory_name: "Forklift",
          category_id: categories[2].category_id,
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetCapacityModel
    const capacities = await AssetCapacity.bulkCreate(
      [
        {
          capacity_value: "Seven Ton",
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          capacity_value: "Ten Ton",
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetClassificationModel
    const assetsClassifications = await AssetClassification.bulkCreate(
      [
        {
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          capacity_id: capacities[0].capacity_id,
          default_dep_method: "straight_line",
          default_dep_rate: 60.0,
          default_useful_life: 5,
          gl_account_id: "GL001",
          classification_name: "Heavy Equipment Boom Truck STRAIGHT LINE",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_id: categories[1].category_id,
          subcategory_id: subcategories[1].subcategory_id,
          capacity_id: capacities[1].capacity_id,
          default_dep_method: "declining_balance",
          default_dep_rate: 60.0,
          default_useful_life: 5,
          gl_account_id: "GL002",
          classification_name: "Light Vehicle Crane DECLINING BALANCE",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetLocationModel
    const locations = await LocationID.bulkCreate(
      [
        {
          location_name: "Qatar",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetSupplierModel
    const suppliers = await SupplierID.bulkCreate(
      [
        {
          supplier_name: "ABC Corp",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetCostCenterModel
    const costCenters = await CostCenterID.bulkCreate(
      [
        {
          cost_center_name: "Qatar",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetCustodianModel
    const custodians = await CustodianID.bulkCreate(
      [
        {
          custodian_name: "ABC Corp",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetManufacturerModel
    const manufacturers = await ManufacturerModel.bulkCreate(
      [
        {
          manufacturer: "Toyota",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer: "Nissan",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer: "Honda",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetModels
    const assetModels = await ModelAssetModel.bulkCreate(
      [
        {
          manufacturer_id: manufacturers[0].id,
          model: "Toyota Corolla",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer_id: manufacturers[0].id,
          model: "Toyota Yaris",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer_id: manufacturers[1].id,
          model: "Nissan Sunny",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer_id: manufacturers[1].id,
          model: "Nissan Tida",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer_id: manufacturers[2].id,
          model: "Honda Civic",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer_id: manufacturers[2].id,
          model: "Honda Insight",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetModel
    const createdAssets = await Assets.bulkCreate(
      [
        {
          asset_number: "AX-FA-001",
          tag_number: "LAP-121121221",
          serial_number: "SN123456789",
          engine_number: "N/A",
          year_of_manufacture: 2023,
          manufacturer_id: manufacturers[0].id,
          model_id: assetModels[0].id,
          vehicle_type: "Heavy Equipment Boom Truck Seven Ton",
          VIN: "CAI-0880",
          description: "Dell XPS 13 Laptop for office use",
          classification_id: assetsClassifications[0].classification_id,
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          capacity_id: capacities[0].capacity_id,
          location_name: locations[0].location_name,
          cost_center_name: costCenters[0].cost_center_name,
          departmentName: "IT Department",
          custodian_name: custodians[0].custodian_name,
          acquisition_date: "2025-06-24",
          acquisition_cost: 1299.99,
          supplier_name: suppliers[0].supplier_name,
          purchase_order_id: "PO-20250624-001",
          useful_life: 3,
          default_dep_rate: 20,
          residual_value: 100.0,
          current_value: 1099.99,
          accumulated_depreciation: 5000.0,
          monthly_depreciation: 150.0,
          yearly_depreciation: 3000.0,
          is_depreciation_calculated: true,
          status: "active",
          barcode: "BC-LAP121121221",
          rfid_tag: "RFID-LAP121121221",
          journal_entry_id: "JE-20250624-001",
          photo_attachments: null,
          document_attachments: null,
          warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
          created_at: new Date("2025-06-24T10:00:00Z"),
          updated_at: new Date("2025-07-05T13:50:00Z"),
        },
        {
          asset_number: "AX-FA-002",
          tag_number: "LAP-5475445",
          serial_number: "SN65545451",
          engine_number: "N/A",
          year_of_manufacture: 2023,
          manufacturer_id: manufacturers[0].id,
          model_id: assetModels[0].id,
          vehicle_type: "Heavy Equipment Boom Truck Seven Ton",
          VIN: "CAI-0880",
          description: "Dell XPS 13 Laptop for office use",
          classification_id: assetsClassifications[0].classification_id,
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          capacity_id: capacities[0].capacity_id,
          location_name: locations[0].location_name,
          cost_center_name: costCenters[0].cost_center_name,
          departmentName: "IT Department",
          custodian_name: custodians[0].custodian_name,
          acquisition_date: "2025-06-24",
          acquisition_cost: 1299.99,
          supplier_name: suppliers[0].supplier_name,
          purchase_order_id: "PO-20250624-001",
          useful_life: 3,
          default_dep_rate: 20,
          residual_value: 100.0,
          current_value: 1099.99,
          accumulated_depreciation: 5000.0,
          monthly_depreciation: 150.0,
          yearly_depreciation: 3000.0,
          is_depreciation_calculated: true,
          status: "active",
          barcode: "BC-LAP121121221",
          rfid_tag: "RFID-LAP121121221",
          journal_entry_id: "JE-20250624-001",
          photo_attachments: null,
          document_attachments: null,
          warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
          created_at: new Date("2025-06-24T10:00:00Z"),
          updated_at: new Date("2025-07-05T13:50:00Z"),
        },
        {
          asset_number: "AX-FA-003",
          tag_number: "TAG-121323323",
          serial_number: "SN745745545",
          engine_number: "N/A",
          year_of_manufacture: 2023,
          manufacturer_id: manufacturers[0].id,
          model_id: assetModels[0].id,
          vehicle_type: "Heavy Equipment Boom Truck Seven Ton",
          VIN: "CAI-0880",
          description: "Dell XPS 13 Laptop for office use",
          classification_id: assetsClassifications[0].classification_id,
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          capacity_id: capacities[0].capacity_id,
          location_name: locations[0].location_name,
          cost_center_name: costCenters[0].cost_center_name,
          departmentName: "IT Department",
          custodian_name: custodians[0].custodian_name,
          acquisition_date: "2025-06-24",
          acquisition_cost: 1299.99,
          supplier_name: suppliers[0].supplier_name,
          purchase_order_id: "PO-20250624-001",
          useful_life: 3,
          default_dep_rate: 20,
          residual_value: 100.0,
          current_value: 1099.99,
          accumulated_depreciation: 5000.0,
          monthly_depreciation: 150.0,
          yearly_depreciation: 3000.0,
          is_depreciation_calculated: true,
          status: "active",
          barcode: "BC-LAP121121221",
          rfid_tag: "RFID-LAP121121221",
          journal_entry_id: "JE-20250624-001",
          photo_attachments: null,
          document_attachments: null,
          warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
          created_at: new Date("2025-06-24T10:00:00Z"),
          updated_at: new Date("2025-07-05T13:50:00Z"),
        },
        {
          asset_number: "AX-FA-004",
          tag_number: "TAG-907765554",
          serial_number: "SN8765765443",
          engine_number: "N/A",
          year_of_manufacture: 2023,
          manufacturer_id: manufacturers[0].id,
          model_id: assetModels[0].id,
          vehicle_type: "Heavy Equipment Boom Truck Seven Ton",
          VIN: "CAI-0880",
          description: "Dell XPS 13 Laptop for office use",
          classification_id: assetsClassifications[0].classification_id,
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          capacity_id: capacities[0].capacity_id,
          location_name: locations[0].location_name,
          cost_center_name: costCenters[0].cost_center_name,
          departmentName: "IT Department",
          custodian_name: custodians[0].custodian_name,
          acquisition_date: "2025-06-24",
          acquisition_cost: 1299.99,
          supplier_name: suppliers[0].supplier_name,
          purchase_order_id: "PO-20250624-001",
          useful_life: 3,
          default_dep_rate: 20,
          residual_value: 100.0,
          current_value: 1099.99,
          accumulated_depreciation: 5000.0,
          monthly_depreciation: 150.0,
          yearly_depreciation: 3000.0,
          is_depreciation_calculated: true,
          status: "active",
          barcode: "BC-LAP121121221",
          rfid_tag: "RFID-LAP121121221",
          journal_entry_id: "JE-20250624-001",
          photo_attachments: null,
          document_attachments: null,
          warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
          created_at: new Date("2025-06-24T10:00:00Z"),
          updated_at: new Date("2025-07-05T13:50:00Z"),
        },
        {
          asset_number: "AX-FA-005",
          tag_number: "TAG-7857343432",
          serial_number: "SN65453523222",
          engine_number: "N/A",
          year_of_manufacture: 2023,
          manufacturer_id: manufacturers[0].id,
          model_id: assetModels[0].id,
          vehicle_type: "Heavy Equipment Boom Truck Seven Ton",
          VIN: "CAI-0880",
          description: "Dell XPS 13 Laptop for office use",
          classification_id: assetsClassifications[0].classification_id,
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          capacity_id: capacities[0].capacity_id,
          location_name: locations[0].location_name,
          cost_center_name: costCenters[0].cost_center_name,
          departmentName: "IT Department",
          custodian_name: custodians[0].custodian_name,
          acquisition_date: "2025-06-24",
          acquisition_cost: 1299.99,
          supplier_name: suppliers[0].supplier_name,
          purchase_order_id: "PO-20250624-001",
          useful_life: 3,
          default_dep_rate: 20,
          residual_value: 100.0,
          current_value: 1099.99,
          accumulated_depreciation: 5000.0,
          monthly_depreciation: 150.0,
          yearly_depreciation: 3000.0,
          is_depreciation_calculated: true,
          status: "active",
          barcode: "BC-LAP121121221",
          rfid_tag: "RFID-LAP121121221",
          journal_entry_id: "JE-20250624-001",
          photo_attachments: null,
          document_attachments: null,
          warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
          created_at: new Date("2025-06-24T10:00:00Z"),
          updated_at: new Date("2025-07-05T13:50:00Z"),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Extract the asset_id from the created asset
    const asset_number = createdAssets[0].asset_number;

    // Seed sub-assets linked to the created asset
    await SubAsset.bulkCreate(
      [
        {
          tag_numbers: "LAP-5253273523",
          serial_number: "SN35283523",
          engine_number: "N/A",
          year_of_manufacture: 2023,
          manufacturer_id: manufacturers[0].id,
          model_id: assetModels[0].id,
          description: "HP XPS 13 Laptop for office use",
          classification_id: assetsClassifications[0].classification_id,
          category_name: categories[0].category_name,
          subcategory_name: subcategories[0].subcategory_name,
          capacity_value: capacities[0].capacity_value,
          asset_number: asset_number,
          acquisition_date: "2025-06-24",
          acquisition_cost: 0.5,
          supplier_name: suppliers[0].supplier_name,
          purchase_order_id: 12345,
          useful_life: 3,
          residual_value: 0.2,
          current_value: 500.0,
          status: "active",
          barcode: "sub_dwads_1",
          rfid_tag: "sub_dwasdczxcxcz_1",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          tag_numbers: "LAP-809768755",
          serial_number: "SN376765878",
          engine_number: "N/A",
          year_of_manufacture: 2023,
          manufacturer_id: manufacturers[1].id,
          model_id: assetModels[2].id,
          model: "XPS 13",
          description: "ASUS XPS 13 Laptop for office use",
          classification_id: assetsClassifications[1].classification_id,
          category_name: categories[0].category_name,
          subcategory_name: subcategories[0].subcategory_name,
          capacity_value: capacities[1].capacity_value,
          asset_number: asset_number,
          acquisition_date: "2025-06-24",
          acquisition_cost: 0.65,
          supplier_name: suppliers[0].supplier_name,
          purchase_order_id: 12346,
          useful_life: 3,
          residual_value: 0.21,
          current_value: 500.0,
          status: "active",
          barcode: "sub_dwads_2",
          rfid_tag: "sub_dwasdczxcxcz_2",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    console.log("Fixed Assets Database seeded successfully with ITEQ Solution data.");
  } catch (error) {
    console.error("Error inserting initial data:", error);
  }
};

module.exports = seedDatabase;

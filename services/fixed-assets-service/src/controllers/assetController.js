const AssetModel = require("../models/AssetModel");
const AssetCategoryModel = require("../models/AssetCategoryModel");
const AssetSubcategoryModel = require("../models/AssetSubcategoryModel");
const AssetCapacityModel = require("../models/AssetCapacityModel");
const AssetClassificationModel = require("../models/AssetClassificationModel");
const AssetLocationModel = require("../models/LocationIDModel");
const AssetDepartmentModel = require("../../../hr-service/src/models/DepartmentModel");
const AssetCostCenterModel = require("../models/CostCenterIDModel");
const AssetCustodianModel = require("../models/CustodianIDModel");
const AssetSupplierModel = require("../models/SupplierIDModel");
const AssetTransferModel = require("../models/AssetTransferModel");
const AssetDisposalModel = require("../models/AssetDisposalModel");
const DepreciationScheduleModel = require("../models/DepreciationScheduleModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const sequelize = require("../../src/config/dbSync");
const multer = require("multer");
const fs = require("fs");
const ManufacturerModel = require("../models/ManufacturerModel");
const ModelAssetModel = require("../models/ModelAssetModel");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const photoUploadDir = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "uploads",
  "assets",
  "assetsImages"
);
const docUploadDir = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "uploads",
  "assets",
  "assetsDocs"
);

const eqPhotoUploadDir = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "uploads",
  "equipments",
  "equipmentsImages"
);
const eqDocUploadDir = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "uploads",
  "equipments",
  "equipmentsDocs"
);

if (!fs.existsSync(photoUploadDir)) {
  fs.mkdirSync(photoUploadDir, { recursive: true });
}
if (!fs.existsSync(docUploadDir)) {
  fs.mkdirSync(docUploadDir, { recursive: true });
}

if (!fs.existsSync(eqPhotoUploadDir)) {
  fs.mkdirSync(eqPhotoUploadDir, { recursive: true });
}
if (!fs.existsSync(eqDocUploadDir)) {
  fs.mkdirSync(eqDocUploadDir, { recursive: true });
}

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine which folder based on asset type or a flag
    const uploadDir =
      req.body.asset_id || "asset" ? photoUploadDir : eqPhotoUploadDir;
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const assetId = req.body.asset_id || "asset";
    const timestamp = Date.now();
    const fileName = `${assetId}_photo_${timestamp}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine which folder based on asset type or a flag
    const uploadDir =
      req.body.asset_id || "asset" ? docUploadDir : eqDocUploadDir;
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const assetId = req.body.asset_id || "asset";
    const timestamp = Date.now();
    const fileName = `${assetId}_doc_${timestamp}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

// Main upload configuration - Replace the entire upload constant
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Save photos to both directories
      if (file.fieldname === "photos") {
        // We'll handle dual saving in the route handler
        cb(null, photoUploadDir);
      } else if (file.fieldname === "documents") {
        // We'll handle dual saving in the route handler
        cb(null, docUploadDir);
      } else {
        cb(new Error(`Unexpected field: ${file.fieldname}`), null);
      }
    },
    filename: (req, file, cb) => {
      const assetId = req.body.asset_id || "asset";
      const timestamp = Date.now();
      const prefix = file.fieldname === "photos" ? "photo" : "doc";
      const fileName = `${assetId}_${prefix}_${timestamp}${path.extname(
        file.originalname
      )}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const photoTypes = ["image/jpeg", "image/png"];
    const docTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (file.fieldname === "photos" && photoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else if (
      file.fieldname === "documents" &&
      docTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type for ${file.fieldname}. Allowed types: ${
            file.fieldname === "photos" ? "JPG, PNG" : "PDF, DOC, DOCX"
          }`
        ),
        false
      );
    }
  },
}).fields([
  { name: "photos", maxCount: 4 },
  { name: "documents", maxCount: 4 },
]);

const postToGeneralLedger = async (data) => {
  try {
    console.log(`Posting to GL: ${JSON.stringify(data)}`);
    return { journal_entry_id: `JE-${Date.now()}` };
  } catch (error) {
    throw new Error(`GL Posting failed: ${error.message}`);
  }
};

const createAsset = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      tag_number,
      serial_number,
      engine_number,
      year_of_manufacture,
      manufacturer_id,
      model_id,
      vehicle_type,
      VIN,
      description,
      classification_id,
      category_id,
      subcategory_id,
      capacity_id,
      location_name,
      cost_center_name,
      departmentName,
      custodian_name,
      acquisition_date,
      acquisition_cost,
      supplier_name,
      purchase_order_id,
      residual_value,
      status,
      barcode,
      rfid_tag,
      is_cwip,
      warranty_details,
    } = req.body;

    const existingTagNumber = await AssetModel.findOne({ where: { tag_number } });
    if (existingTagNumber) {
      return res.status(400).json({ message: "Tag number already exists" });
    }

    const existingSerialNumber = await AssetModel.findOne({ where: { serial_number } });
    if (existingSerialNumber) {
      return res.status(400).json({ message: "Serial number already exists" });
    }

    if (acquisition_date && new Date(acquisition_date) > new Date()) {
      return res
        .status(400)
        .json({ message: "Acquisition date cannot be in the future" });
    }
    if (acquisition_cost && acquisition_cost <= 0) {
      return res
        .status(400)
        .json({ message: "Acquisition cost must be positive" });
    }
    if (
      year_of_manufacture &&
      (year_of_manufacture < 1900 ||
        year_of_manufacture > new Date().getFullYear())
    ) {
      return res.status(400).json({ message: "Invalid year of manufacture" });
    }

    // Update the required fields check to match your frontend
    if (
      !description ||
      !classification_id ||
      !category_id ||
      !subcategory_id ||
      !location_name ||
      !cost_center_name ||
      !departmentName ||
      !custodian_name ||
      !acquisition_date ||
      !acquisition_cost ||
      !supplier_name
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Missing required fields",
        details: {
          required: [
            "description",
            "classification_id",
            "category_id",
            "subcategory_id",
            "location_name",
            "cost_center_name",
            "departmentName",
            "custodian_name",
            "acquisition_date",
            "acquisition_cost",
            "supplier_name",
          ],
        },
      });
    }

    if (acquisition_cost <= 0) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Acquisition cost must be greater than 0" });
    }

    // Generate unique asset_number
    const lastAsset = await AssetModel.findOne({
      order: [["asset_number", "DESC"]],
      transaction,
    });
    let nextNumber = 1;
    if (lastAsset && lastAsset.asset_number) {
      const lastNumber = parseInt(lastAsset.asset_number.split("-")[2], 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    const asset_number = `AX-FA-${nextNumber.toString().padStart(3, "0")}`;

    let photo_attachments = [];
    let document_attachments = [];

    if (req.files) {
      if (req.files["photos"]) {
        // Process and save photos to both directories
        photo_attachments = req.files["photos"].map((file) => {
          const fileName = file.filename;
          const assetSourcePath = file.path;
          const eqDestPath = path.join(eqPhotoUploadDir, fileName);

          // Copy to equipment folder
          try {
            fs.copyFileSync(assetSourcePath, eqDestPath);
          } catch (err) {
            console.error(
              `Failed to copy photo to equipment folder: ${err.message}`
            );
          }

          // Return ONLY the asset path (primary storage)
          return {
            path: `/uploads/assets/assetsImages/${fileName}`,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          };
        });
      }

      if (req.files["documents"]) {
        // Process and save documents to both directories
        document_attachments = req.files["documents"].map((file) => {
          const fileName = file.filename;
          const assetSourcePath = file.path;
          const eqDestPath = path.join(eqDocUploadDir, fileName);

          // Copy to equipment folder
          try {
            fs.copyFileSync(assetSourcePath, eqDestPath);
          } catch (err) {
            console.error(
              `Failed to copy document to equipment folder: ${err.message}`
            );
          }

          // Return ONLY the asset path (primary storage)
          return {
            path: `/uploads/assets/assetsDocs/${fileName}`,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          };
        });
      }
    }

    const assetStatus = status;

    let depreciationValues = {
      monthly_depreciation: 0,
      yearly_depreciation: 0,
      accumulated_depreciation: 0,
      current_value: acquisition_cost,
      is_depreciation_calculated: false,
      useful_life: null,
      default_dep_rate: null,
    };

    if (assetStatus === "active") {
      try {
        const classification = await AssetClassificationModel.findByPk(
          classification_id,
          {
            transaction,
          }
        );
        if (!classification) {
          await transaction.rollback();
          return res.status(400).json({ message: "Invalid classification ID" });
        }

        if (classification.default_dep_method === "straight_line") {
          const usefulLife = classification.default_useful_life;

          if (!usefulLife) {
            await transaction.rollback();
            return res.status(400).json({
              message:
                "Classification must have default_useful_life for straight line depreciation",
            });
          }

          const cost = acquisition_cost;
          const salvageValue = residual_value || 0;
          const usefulLifeYears = usefulLife;

          const yearlyDepreciation = (cost - salvageValue) / usefulLifeYears;
          const accumulateDepreciation = yearlyDepreciation / 365;

          const acquisitionDate = new Date(acquisition_date);
          const currentDate = new Date();

          const timeDiff = currentDate.getTime() - acquisitionDate.getTime();
          const daysElapsed = Math.max(
            0,
            Math.floor(timeDiff / (1000 * 3600 * 24))
          );

          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth();
          const daysInCurrentMonth = new Date(
            currentYear,
            currentMonth + 1,
            0
          ).getDate();

          const monthlyDepreciation =
            accumulateDepreciation * daysInCurrentMonth;
          const totalAccumulatedDepreciation = Math.min(
            accumulateDepreciation * daysElapsed,
            cost - salvageValue
          );

          const currentValue = cost - totalAccumulatedDepreciation;

          const checkResidualValueChangeDuringLife = (
            currentBookValue,
            newResidualValue,
            remainingUsefulLife
          ) => {
            const yearlyDepreciation =
              (currentBookValue - newResidualValue) / remainingUsefulLife;
            const accumulateDepreciation = yearlyDepreciation / 365;
            const daysInCurrentMonth = new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0
            ).getDate();
            const monthlyDepreciation =
              accumulateDepreciation * daysInCurrentMonth;

            return {
              yearly_depreciation: parseFloat(yearlyDepreciation.toFixed(2)),
              accumulated_depreciation: parseFloat(
                accumulateDepreciation.toFixed(2)
              ),
              monthly_depreciation: parseFloat(monthlyDepreciation.toFixed(2)),
            };
          };

          const checkResidualValueChangeAfterLife = (
            originalResidualValue,
            newResidualValue,
            originalUsefulLife,
            usedUntilUsefulLife
          ) => {
            const yearlyDepreciation =
              (originalResidualValue - newResidualValue) /
              (originalUsefulLife - usedUntilUsefulLife);
            const accumulateDepreciation = yearlyDepreciation / 365;
            const daysInCurrentMonth = new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0
            ).getDate();
            const monthlyDepreciation =
              accumulateDepreciation * daysInCurrentMonth;

            return {
              yearly_depreciation: parseFloat(yearlyDepreciation.toFixed(2)),
              accumulated_depreciation: parseFloat(
                accumulateDepreciation.toFixed(2)
              ),
              monthly_depreciation: parseFloat(monthlyDepreciation.toFixed(2)),
            };
          };

          depreciationValues = {
            monthly_depreciation: parseFloat(monthlyDepreciation.toFixed(2)),
            yearly_depreciation: parseFloat(yearlyDepreciation.toFixed(2)),
            accumulated_depreciation: parseFloat(
              totalAccumulatedDepreciation.toFixed(2)
            ),
            current_value: parseFloat(currentValue.toFixed(2)),
            is_depreciation_calculated: true,
            useful_life: usefulLife,
            default_dep_rate: classification.default_dep_rate,
          };

          const yearsElapsed = daysElapsed / 365;
          const remainingUsefulLife = usefulLife - yearsElapsed;

          const newResidualValue = residual_value || 0;

          if (remainingUsefulLife > 0) {
            // Condition 1: Residual value change during useful life
            const duringLifeValues = checkResidualValueChangeDuringLife(
              currentValue,
              newResidualValue,
              remainingUsefulLife
            );
            depreciationValues = {
              ...depreciationValues,
              monthly_depreciation: duringLifeValues.monthly_depreciation,
              yearly_depreciation: duringLifeValues.yearly_depreciation,
              accumulated_depreciation:
                duringLifeValues.accumulated_depreciation,
            };
          } else if (yearsElapsed >= usefulLife) {
            // Condition 2: Residual value change after useful life
            const afterLifeValues = checkResidualValueChangeAfterLife(
              salvageValue,
              newResidualValue,
              usefulLife,
              yearsElapsed
            );
            depreciationValues = {
              ...depreciationValues,
              monthly_depreciation: afterLifeValues.monthly_depreciation,
              yearly_depreciation: afterLifeValues.yearly_depreciation,
              accumulated_depreciation:
                afterLifeValues.accumulated_depreciation,
            };
          }

          depreciationValues.current_value = parseFloat(
            (cost - depreciationValues.accumulated_depreciation).toFixed(2)
          );
        } else if (classification.default_dep_method === "declining_balance") {
          const cost = acquisition_cost;
          const salvageValue = residual_value || 0;
          const usefulLife = classification.default_useful_life;
          const depreciationRate = classification.default_dep_rate;

          if (!usefulLife || !depreciationRate) {
            await transaction.rollback();
            return res.status(400).json({
              message:
                "Classification must have default_useful_life and default_dep_rate for declining balance depreciation",
            });
          }

          const acquisitionDate = new Date(acquisition_date);
          const currentDate = new Date();
          const timeDiff = currentDate.getTime() - acquisitionDate.getTime();
          const daysElapsed = Math.max(
            0,
            Math.floor(timeDiff / (1000 * 3600 * 24))
          );
          const yearsElapsed = daysElapsed / 365;

          const currentBookValue = acquisition_cost;

          // Function for Condition 1: Residual Value Changed During the Useful Life
          const calculateDBMDuringLife = (
            bookValue,
            newResidualValue,
            rate
          ) => {
            let yearly_depreciation = bookValue * (rate / 100);

            if (bookValue - yearly_depreciation < newResidualValue) {
              yearly_depreciation = bookValue - newResidualValue;
            }

            const accumulated_depreciation = yearly_depreciation / 365;

            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const daysInCurrentMonth = new Date(
              currentYear,
              currentMonth + 1,
              0
            ).getDate();
            const monthlyDepreciation =
              accumulated_depreciation * daysInCurrentMonth;

            return {
              yearly_depreciation: parseFloat(yearly_depreciation.toFixed(2)),
              accumulated_depreciation: parseFloat(
                accumulated_depreciation.toFixed(2)
              ),
              monthly_depreciation: parseFloat(monthlyDepreciation.toFixed(2)),
            };
          };

          // Function for Condition 2: Residual Value Changed After the Useful Life
          const calculateDBMAfterLife = (bookValue, newResidualValue, rate) => {
            let yearly_depreciation = bookValue * (rate / 100);

            if (bookValue - yearly_depreciation < newResidualValue) {
              yearly_depreciation = bookValue - newResidualValue;
            }

            const accumulated_depreciation = yearly_depreciation / 365;

            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const daysInCurrentMonth = new Date(
              currentYear,
              currentMonth + 1,
              0
            ).getDate();
            const monthlyDepreciation =
              accumulated_depreciation * daysInCurrentMonth;

            return {
              yearly_depreciation: parseFloat(yearly_depreciation.toFixed(2)),
              accumulated_depreciation: parseFloat(
                accumulated_depreciation.toFixed(2)
              ),
              monthly_depreciation: parseFloat(monthlyDepreciation.toFixed(2)),
            };
          };

          let totalAccumulatedDepreciation = 0;
          let remainingBookValue = cost;

          for (let year = 0; year < Math.floor(yearsElapsed); year++) {
            let yearlyDep = remainingBookValue * (depreciationRate / 100);

            if (remainingBookValue - yearlyDep < salvageValue) {
              yearlyDep = remainingBookValue - salvageValue;
            }

            totalAccumulatedDepreciation += yearlyDep;
            remainingBookValue -= yearlyDep;

            if (remainingBookValue <= salvageValue) {
              break;
            }
          }

          const partialYear = yearsElapsed - Math.floor(yearsElapsed);
          if (partialYear > 0 && remainingBookValue > salvageValue) {
            let partialYearDep =
              remainingBookValue * (depreciationRate / 100) * partialYear;

            if (remainingBookValue - partialYearDep < salvageValue) {
              partialYearDep = remainingBookValue - salvageValue;
            }

            totalAccumulatedDepreciation += partialYearDep;
            remainingBookValue -= partialYearDep;
          }

          const currentValue = cost - totalAccumulatedDepreciation;

          let currentDepreciation;

          if (yearsElapsed < usefulLife) {
            // Condition 1: Residual Value Changed During the Useful Life
            currentDepreciation = calculateDBMDuringLife(
              currentValue,
              salvageValue,
              depreciationRate
            );
          } else {
            // Condition 2: Residual Value Changed After the Useful Life
            currentDepreciation = calculateDBMAfterLife(
              currentValue,
              salvageValue,
              depreciationRate
            );
          }

          depreciationValues = {
            monthly_depreciation: currentDepreciation.monthly_depreciation,
            yearly_depreciation: currentDepreciation.yearly_depreciation,
            accumulated_depreciation: parseFloat(
              totalAccumulatedDepreciation.toFixed(2)
            ),
            current_value: parseFloat(currentValue.toFixed(2)),
            is_depreciation_calculated: true,
            useful_life: usefulLife,
            default_dep_rate: depreciationRate,
          };
        } else if (
          classification.default_dep_method === "units_of_production"
        ) {
          const cost = acquisition_cost;
          const salvageValue = residual_value || 0;
          const totalEstimatedUsage = classification.default_useful_life;

          if (!totalEstimatedUsage || totalEstimatedUsage <= 0) {
            await transaction.rollback();
            return res.status(400).json({
              message:
                "Classification must have valid default_useful_life (total estimated usage) for units of production depreciation",
            });
          }

          const actualUsageToDate = 0;
          const currentPeriodUsage = 1000;

          const depreciableBase = cost - salvageValue;
          const depreciationRatePerUnit = depreciableBase / totalEstimatedUsage;

          const yearlyDepreciation =
            (cost - salvageValue) * (currentPeriodUsage / totalEstimatedUsage);

          const dailyDepreciation = yearlyDepreciation / 365;

          const currentDate = new Date();
          const daysInCurrentMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          ).getDate();
          const monthlyDepreciation = dailyDepreciation * daysInCurrentMonth;

          let totalAccumulatedDepreciation =
            actualUsageToDate * depreciationRatePerUnit;
          totalAccumulatedDepreciation = Math.min(
            totalAccumulatedDepreciation,
            depreciableBase
          );

          const currentValue = cost - totalAccumulatedDepreciation;

          let finalYearlyDep = yearlyDepreciation;
          let finalDailyDep = dailyDepreciation;
          let finalMonthlyDep = monthlyDepreciation;
          let finalAccumulatedDep = totalAccumulatedDepreciation;
          let finalCurrentValue = currentValue;

          // Condition 1: Estimated Life Usage Change During the Useful Life
          const newTotalEstimatedUsage = 30000;

          if (
            actualUsageToDate > 0 &&
            actualUsageToDate < totalEstimatedUsage
          ) {
            const remainingUsefulUsage =
              newTotalEstimatedUsage - actualUsageToDate;
            const remainingDepreciableAmount =
              cost - finalAccumulatedDep - salvageValue;
            const newRatePerUnit =
              remainingUsefulUsage > 0
                ? remainingDepreciableAmount / remainingUsefulUsage
                : 0;

            finalYearlyDep = currentPeriodUsage * newRatePerUnit;
            finalDailyDep = finalYearlyDep / 365;
            finalMonthlyDep = finalDailyDep * daysInCurrentMonth;

            console.log(
              `Condition 1 - New rate per unit: ${newRatePerUnit.toFixed(2)}`
            );
          }

          // Condition 2: Salvage Value Change During the Useful Life
          const newSalvageValue = 40000;

          if (
            actualUsageToDate > 0 &&
            actualUsageToDate < totalEstimatedUsage &&
            newSalvageValue !== salvageValue
          ) {
            const remainingDepreciableAmount =
              cost - finalAccumulatedDep - newSalvageValue;
            const remainingEstimatedUsage =
              totalEstimatedUsage - actualUsageToDate;
            const newDepreciationRate =
              remainingEstimatedUsage > 0
                ? remainingDepreciableAmount / remainingEstimatedUsage
                : 0;

            finalYearlyDep = currentPeriodUsage * newDepreciationRate;
            finalDailyDep = finalYearlyDep / 365;
            finalMonthlyDep = finalDailyDep * daysInCurrentMonth;

            console.log(
              `Condition 2 - New depreciation rate: ${newDepreciationRate.toFixed(
                2
              )}`
            );
          }

          // Condition 3: Estimated Life Usage Change After the Useful Life
          if (actualUsageToDate >= totalEstimatedUsage) {
            const extendedTotalUsage = 35000;
            const revisedResidualValue = 5000;

            const newDepreciableBase = finalCurrentValue - revisedResidualValue;
            const newUsageEstimate = extendedTotalUsage - actualUsageToDate;
            const newDepreciationRatePerHour =
              newUsageEstimate > 0 ? newDepreciableBase / newUsageEstimate : 0;

            finalYearlyDep = currentPeriodUsage * newDepreciationRatePerHour;
            finalDailyDep = finalYearlyDep / 365;
            finalMonthlyDep = finalDailyDep * daysInCurrentMonth;

            console.log(
              `Condition 3 - Extended usage rate: ${newDepreciationRatePerHour.toFixed(
                2
              )} per unit`
            );
          }

          depreciationValues = {
            monthly_depreciation: parseFloat(finalMonthlyDep.toFixed(2)),
            yearly_depreciation: parseFloat(finalYearlyDep.toFixed(2)),
            accumulated_depreciation: parseFloat(
              finalAccumulatedDep.toFixed(2)
            ),
            current_value: parseFloat(finalCurrentValue.toFixed(2)),
            is_depreciation_calculated: true,
            useful_life: totalEstimatedUsage,
            default_dep_rate: parseFloat(depreciationRatePerUnit.toFixed(4)),
          };
        }
      } catch (depError) {
        await transaction.rollback();
        console.error("Depreciation calculation failed:", depError);
        return res.status(400).json({
          message: "Depreciation calculation failed",
          error: depError.message,
        });
      }
    }

    const asset = await AssetModel.create(
      {
        asset_number,
        tag_number,
        serial_number,
        engine_number,
        year_of_manufacture,
        manufacturer_id,
        model_id,
        vehicle_type,
        VIN,
        description,
        classification_id,
        category_id,
        subcategory_id,
        capacity_id,
        location_name,
        cost_center_name,
        departmentName,
        custodian_name,
        acquisition_date,
        acquisition_cost,
        supplier_name,
        purchase_order_id,
        residual_value,
        status: assetStatus,
        barcode,
        rfid_tag,
        warranty_details,
        photo_attachments,
        document_attachments,
        ...depreciationValues,
      },
      { transaction }
    );

    if (assetStatus === "active") {
      try {
        const glResponse = await postToGeneralLedger({
          type: "asset_acquisition",
          asset_id: asset.asset_id,
          amount: acquisition_cost,
          account: "fixed_assets",
          contra_account: "cash_or_payable",
        });

        await asset.update(
          {
            journal_entry_id: glResponse.journal_entry_id,
          },
          { transaction }
        );
      } catch (glError) {
        console.error("GL posting failed (continuing anyway):", glError);
      }
    }

    await transaction.commit();

    // Auto-create equipment record if the asset is active
    if (assetStatus === "active") {
      try {
        const VehicleOwnerModel = require("../../models/fleet-management/VehicleOwnerModel");
        const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
        const EmployeeModel = require("../../models/hr/employees/EmployeeModel");

        const autoXpertOwner = await VehicleOwnerModel.findOne({
          where: {
            name: "Auto Xpert",
            own_vehicle: true,
            status: "Active",
          },
        });

        if (autoXpertOwner) {
          const defaultEmployee = await EmployeeModel.findOne({
            order: [["id", "ASC"]],
          });

          if (defaultEmployee) {
            await EquipmentModel.create({
              asset_id: asset.asset_id,
              owner_id: autoXpertOwner.vehicle_owner_id,
              reg_number: tag_number || asset_number,
              serial_numbers: serial_number || "N/A",
              engine_number: engine_number || "N/A",
              category_id: category_id,
              subcategory_id: subcategory_id,
              manufacturer: manufacturer || "N/A",
              model: model || "N/A",
              vehicle_type: vehicle_type || "N/A",
              VIN: VIN || "N/A",
              description: description || "N/A",
              year_of_manufacture:
                year_of_manufacture || new Date().getFullYear(),
              departmentName: departmentName || "N/A",
              employeeId: defaultEmployee.id,
              barcode: barcode || "N/A",
              rfid_tag: rfid_tag || "N/A",
              photo_attachments: photo_attachments || [],
              document_attachments: document_attachments || [],
            });

            console.log(
              `Equipment record auto-created for asset ${asset_number}`
            );
          }
        }
      } catch (equipError) {
        console.error("Failed to auto-create equipment record:", equipError);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Asset created successfully",
      asset: {
        ...asset.get({ plain: true }),
        depreciation_calculated: depreciationValues.is_depreciation_calculated,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Asset creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create asset",
      error: error.message,
      details: error.errors?.map((e) => e.message) || [],
    });
  }
};

// Update an existing asset
const updateAsset = async (req, res) => {
  const { asset_id } = req.params;
  const {
    tag_number,
    serial_number,
    engine_number,
    year_of_manufacture,
    manufacturer_id,
    model_id,
    vehicle_type,
    VIN,
    description,
    classification_id,
    category_id,
    subcategory_id,
    capacity_id,
    location_name,
    cost_center_name,
    departmentName,
    custodian_name,
    acquisition_date,
    acquisition_cost,
    supplier_name,
    purchase_order_id,
    useful_life,
    default_dep_rate,
    residual_value,
    current_value,
    status,
    barcode,
    rfid_tag,
    journal_entry_id,
    warranty_details,
    existing_photos,
    existing_documents,
  } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const asset = await AssetModel.findByPk(asset_id, { transaction });
    if (!asset) {
      await transaction.rollback();
      return res.status(404).json({ message: "Asset not found" });
    }

    const existingTagNumber = await AssetModel.findOne({ where: { tag_number } });
    if (existingTagNumber) {
      return res.status(400).json({ message: "Tag number already exists" });
    }

    const existingSerialNumber = await AssetModel.findOne({ where: { serial_number } });
    if (existingSerialNumber) {
      return res.status(400).json({ message: "Serial number already exists" });
    }

    if (acquisition_date && new Date(acquisition_date) > new Date()) {
      return res
        .status(400)
        .json({ message: "Acquisition date cannot be in the future" });
    }
    if (acquisition_cost && acquisition_cost <= 0) {
      return res
        .status(400)
        .json({ message: "Acquisition cost must be positive" });
    }
    if (useful_life !== null && useful_life <= 0) {
      return res
        .status(400)
        .json({ message: "Useful life must be greater than 0 if provided" });
    }
    if (
      year_of_manufacture &&
      (year_of_manufacture < 1900 ||
        year_of_manufacture > new Date().getFullYear())
    ) {
      return res.status(400).json({ message: "Invalid year of manufacture" });
    }

    let photo_attachments = existing_photos
      ? JSON.parse(existing_photos)
      : asset.photo_attachments || [];
    let document_attachments = existing_documents
      ? JSON.parse(existing_documents)
      : asset.document_attachments || [];

    if (req.files) {
      const files = req.files;
      if (files["photos"]) {
        photo_attachments = [
          ...photo_attachments,
          ...files["photos"].map((file) => ({
            path: path
              .join("/uploads/assets/assetsImages", file.filename)
              .replace(/\\/g, "/"),
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          })),
        ];
      }
      if (files["documents"]) {
        document_attachments = [
          ...document_attachments,
          ...files["documents"].map((file) => ({
            path: path
              .join("/uploads/assets/assetsDocs", file.filename)
              .replace(/\\/g, "/"),
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          })),
        ];
      }
    }

    const newStatus = status || asset.status;

    let depreciationValues = {
      monthly_depreciation: asset.monthly_depreciation,
      yearly_depreciation: asset.yearly_depreciation,
      accumulated_depreciation: asset.accumulated_depreciation,
      current_value: acquisition_cost || asset.acquisition_cost,
      is_depreciation_calculated: asset.is_depreciation_calculated,
      useful_life: asset.useful_life,
      default_dep_rate: default_dep_rate || asset.default_dep_rate,
    };

    const needsDepreciationRecalculation =
      newStatus === "active" &&
      (acquisition_cost !== undefined ||
        residual_value !== undefined ||
        acquisition_date !== undefined ||
        category_id !== undefined ||
        useful_life !== undefined ||
        default_dep_rate !== undefined);

    if (needsDepreciationRecalculation) {
      try {
        const category = await AssetClassificationModel.findByPk(
          category_id || asset.category_id,
          { transaction }
        );
        if (!category) {
          await transaction.rollback();
          return res.status(400).json({ message: "Invalid category ID" });
        }

        if (category.default_dep_method === "straight_line") {
          const usefulLife = useful_life || category.default_useful_life;

          if (!usefulLife) {
            await transaction.rollback();
            return res.status(400).json({
              message:
                "Category must have default_useful_life for straight line depreciation",
            });
          }

          const cost = acquisition_cost || asset.acquisition_cost;
          const salvageValue =
            residual_value !== null
              ? residual_value
              : asset.residual_value || 0;
          const usefulLifeYears = usefulLife;

          const yearlyDepreciation = (cost - salvageValue) / usefulLifeYears;
          const accumulateDepreciation = yearlyDepreciation / 365;

          const acquisitionDate = new Date(
            acquisition_date || asset.acquisition_date
          );
          const currentDate = new Date();

          const timeDiff = currentDate.getTime() - acquisitionDate.getTime();
          const daysElapsed = Math.max(
            0,
            Math.floor(timeDiff / (1000 * 3600 * 24))
          );

          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth();
          const daysInCurrentMonth = new Date(
            currentYear,
            currentMonth + 1,
            0
          ).getDate();

          const monthlyDepreciation =
            accumulateDepreciation * daysInCurrentMonth;
          const totalAccumulatedDepreciation = Math.min(
            accumulateDepreciation * daysElapsed,
            cost - salvageValue
          );

          const currentValue = cost - totalAccumulatedDepreciation;

          const checkResidualValueChangeDuringLife = (
            currentBookValue,
            newResidualValue,
            remainingUsefulLife
          ) => {
            const yearlyDepreciation =
              (currentBookValue - newResidualValue) / remainingUsefulLife;
            const accumulateDepreciation = yearlyDepreciation / 365;
            const daysInCurrentMonth = new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0
            ).getDate();
            const monthlyDepreciation =
              accumulateDepreciation * daysInCurrentMonth;

            return {
              yearly_depreciation: parseFloat(yearlyDepreciation.toFixed(2)),
              accumulated_depreciation: parseFloat(
                accumulateDepreciation.toFixed(2)
              ),
              monthly_depreciation: parseFloat(monthlyDepreciation.toFixed(2)),
            };
          };

          const checkResidualValueChangeAfterLife = (
            originalResidualValue,
            newResidualValue,
            originalUsefulLife,
            usedUntilUsefulLife
          ) => {
            const yearlyDepreciation =
              (originalResidualValue - newResidualValue) /
              (originalUsefulLife - usedUntilUsefulLife);
            const accumulateDepreciation = yearlyDepreciation / 365;
            const daysInCurrentMonth = new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0
            ).getDate();
            const monthlyDepreciation =
              accumulateDepreciation * daysInCurrentMonth;

            return {
              yearly_depreciation: parseFloat(yearlyDepreciation.toFixed(2)),
              accumulated_depreciation: parseFloat(
                accumulateDepreciation.toFixed(2)
              ),
              monthly_depreciation: parseFloat(monthlyDepreciation.toFixed(2)),
            };
          };

          depreciationValues = {
            monthly_depreciation: parseFloat(monthlyDepreciation.toFixed(2)),
            yearly_depreciation: parseFloat(yearlyDepreciation.toFixed(2)),
            accumulated_depreciation: parseFloat(
              totalAccumulatedDepreciation.toFixed(2)
            ),
            current_value: parseFloat(currentValue.toFixed(2)),
            is_depreciation_calculated: true,
            useful_life: usefulLife,
            default_dep_rate: category.default_dep_rate,
          };

          const yearsElapsed = daysElapsed / 365;
          const remainingUsefulLife = usefulLife - yearsElapsed;

          const newResidualValue =
            residual_value !== null
              ? residual_value
              : asset.residual_value || 0;

          if (remainingUsefulLife > 0) {
            // Condition 1: Residual value change during useful life
            const duringLifeValues = checkResidualValueChangeDuringLife(
              currentValue,
              newResidualValue,
              remainingUsefulLife
            );
            depreciationValues = {
              ...depreciationValues,
              monthly_depreciation: duringLifeValues.monthly_depreciation,
              yearly_depreciation: duringLifeValues.yearly_depreciation,
              accumulated_depreciation:
                duringLifeValues.accumulated_depreciation,
            };
          } else if (yearsElapsed >= usefulLife) {
            // Condition 2: Residual value change after useful life
            const afterLifeValues = checkResidualValueChangeAfterLife(
              salvageValue,
              newResidualValue,
              usefulLife,
              yearsElapsed
            );
            depreciationValues = {
              ...depreciationValues,
              monthly_depreciation: afterLifeValues.monthly_depreciation,
              yearly_depreciation: afterLifeValues.yearly_depreciation,
              accumulated_depreciation:
                afterLifeValues.accumulated_depreciation,
            };
          }

          depreciationValues.current_value = parseFloat(
            (cost - depreciationValues.accumulated_depreciation).toFixed(2)
          );
        } else if (category.default_dep_method === "declining_balance") {
          const cost = acquisition_cost || asset.acquisition_cost;
          const salvageValue =
            residual_value !== null
              ? residual_value
              : asset.residual_value || 0;
          const usefulLife = useful_life || category.default_useful_life;
          const depreciationRate =
            default_dep_rate || category.default_dep_rate;

          if (!usefulLife || !depreciationRate) {
            await transaction.rollback();
            return res.status(400).json({
              message:
                "Category must have default_useful_life and default_dep_rate for declining balance depreciation",
            });
          }

          const acquisitionDate = new Date(
            acquisition_date || asset.acquisition_date
          );
          const currentDate = new Date();
          const timeDiff = currentDate.getTime() - acquisitionDate.getTime();
          const daysElapsed = Math.max(
            0,
            Math.floor(timeDiff / (1000 * 3600 * 24))
          );
          const yearsElapsed = daysElapsed / 365;

          const currentBookValue = current_value || asset.current_value || cost;

          // Function for Condition 1: Residual Value Changed During the Useful Life
          const calculateDBMDuringLife = (
            bookValue,
            newResidualValue,
            rate
          ) => {
            let yearly_depreciation = bookValue * (rate / 100);

            if (bookValue - yearly_depreciation < newResidualValue) {
              yearly_depreciation = bookValue - newResidualValue;
            }

            const accumulated_depreciation = yearly_depreciation / 365;

            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const daysInCurrentMonth = new Date(
              currentYear,
              currentMonth + 1,
              0
            ).getDate();
            const monthlyDepreciation =
              accumulated_depreciation * daysInCurrentMonth;

            return {
              yearly_depreciation: parseFloat(yearly_depreciation.toFixed(2)),
              accumulated_depreciation: parseFloat(
                accumulated_depreciation.toFixed(2)
              ),
              monthly_depreciation: parseFloat(monthlyDepreciation.toFixed(2)),
            };
          };

          // Function for Condition 2: Residual Value Changed After the Useful Life
          const calculateDBMAfterLife = (bookValue, newResidualValue, rate) => {
            let yearly_depreciation = bookValue * (rate / 100);

            if (bookValue - yearly_depreciation < newResidualValue) {
              yearly_depreciation = bookValue - newResidualValue;
            }

            const accumulated_depreciation = yearly_depreciation / 365;

            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const daysInCurrentMonth = new Date(
              currentYear,
              currentMonth + 1,
              0
            ).getDate();
            const monthlyDepreciation =
              accumulated_depreciation * daysInCurrentMonth;

            return {
              yearly_depreciation: parseFloat(yearly_depreciation.toFixed(2)),
              accumulated_depreciation: parseFloat(
                accumulated_depreciation.toFixed(2)
              ),
              monthly_depreciation: parseFloat(monthlyDepreciation.toFixed(2)),
            };
          };

          let totalAccumulatedDepreciation = 0;
          let remainingBookValue = cost;

          for (let year = 0; year < Math.floor(yearsElapsed); year++) {
            let yearlyDep = remainingBookValue * (depreciationRate / 100);

            if (remainingBookValue - yearlyDep < salvageValue) {
              yearlyDep = remainingBookValue - salvageValue;
            }

            totalAccumulatedDepreciation += yearlyDep;
            remainingBookValue -= yearlyDep;

            if (remainingBookValue <= salvageValue) {
              break;
            }
          }

          const partialYear = yearsElapsed - Math.floor(yearsElapsed);
          if (partialYear > 0 && remainingBookValue > salvageValue) {
            let partialYearDep =
              remainingBookValue * (depreciationRate / 100) * partialYear;

            if (remainingBookValue - partialYearDep < salvageValue) {
              partialYearDep = remainingBookValue - salvageValue;
            }

            totalAccumulatedDepreciation += partialYearDep;
            remainingBookValue -= partialYearDep;
          }

          const currentValue = cost - totalAccumulatedDepreciation;

          let currentDepreciation;

          if (yearsElapsed < usefulLife) {
            currentDepreciation = calculateDBMDuringLife(
              currentValue,
              salvageValue,
              depreciationRate
            );
          } else {
            currentDepreciation = calculateDBMAfterLife(
              currentValue,
              salvageValue,
              depreciationRate
            );
          }

          depreciationValues = {
            monthly_depreciation: currentDepreciation.monthly_depreciation,
            yearly_depreciation: currentDepreciation.yearly_depreciation,
            accumulated_depreciation: parseFloat(
              totalAccumulatedDepreciation.toFixed(2)
            ),
            current_value: parseFloat(currentValue.toFixed(2)),
            is_depreciation_calculated: true,
            useful_life: usefulLife,
            default_dep_rate: depreciationRate,
          };
        } else if (category.default_dep_method === "units_of_production") {
          const cost = acquisition_cost || asset.acquisition_cost;
          const salvageValue =
            residual_value !== null
              ? residual_value
              : asset.residual_value || 0;
          const totalEstimatedUsage =
            useful_life || category.default_useful_life;

          if (!totalEstimatedUsage || totalEstimatedUsage <= 0) {
            await transaction.rollback();
            return res.status(400).json({
              message:
                "Category must have valid default_useful_life (total estimated usage) for units of production depreciation",
            });
          }

          const actualUsageToDate = asset.actual_usage_to_date || 0;
          const currentPeriodUsage = req.body.current_period_usage || 1000;

          const depreciableBase = cost - salvageValue;
          const depreciationRatePerUnit = depreciableBase / totalEstimatedUsage;

          const yearlyDepreciation =
            (cost - salvageValue) * (currentPeriodUsage / totalEstimatedUsage);

          const dailyDepreciation = yearlyDepreciation / 365;

          const currentDate = new Date();
          const daysInCurrentMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
          ).getDate();
          const monthlyDepreciation = dailyDepreciation * daysInCurrentMonth;

          let totalAccumulatedDepreciation =
            actualUsageToDate * depreciationRatePerUnit;
          totalAccumulatedDepreciation = Math.min(
            totalAccumulatedDepreciation,
            depreciableBase
          );

          const currentValue = cost - totalAccumulatedDepreciation;

          let finalYearlyDep = yearlyDepreciation;
          let finalDailyDep = dailyDepreciation;
          let finalMonthlyDep = monthlyDepreciation;
          let finalAccumulatedDep = totalAccumulatedDepreciation;
          let finalCurrentValue = currentValue;

          // Condition 1: Estimated Life Usage Change During the Useful Life
          const newTotalEstimatedUsage =
            req.body.new_total_estimated_usage || totalEstimatedUsage;

          if (
            actualUsageToDate > 0 &&
            actualUsageToDate < totalEstimatedUsage
          ) {
            const remainingUsefulUsage =
              newTotalEstimatedUsage - actualUsageToDate;
            const remainingDepreciableAmount =
              cost - finalAccumulatedDep - salvageValue;
            const newRatePerUnit =
              remainingUsefulUsage > 0
                ? remainingDepreciableAmount / remainingUsefulUsage
                : 0;

            finalYearlyDep = currentPeriodUsage * newRatePerUnit;
            finalDailyDep = finalYearlyDep / 365;
            finalMonthlyDep = finalDailyDep * daysInCurrentMonth;
          }

          // Condition 2: Salvage Value Change During the Useful Life
          const newSalvageValue = req.body.new_salvage_value || salvageValue;

          if (
            actualUsageToDate > 0 &&
            actualUsageToDate < totalEstimatedUsage &&
            newSalvageValue !== salvageValue
          ) {
            const remainingDepreciableAmount =
              cost - finalAccumulatedDep - newSalvageValue;
            const remainingEstimatedUsage =
              totalEstimatedUsage - actualUsageToDate;
            const newDepreciationRate =
              remainingEstimatedUsage > 0
                ? remainingDepreciableAmount / remainingEstimatedUsage
                : 0;

            finalYearlyDep = currentPeriodUsage * newDepreciationRate;
            finalDailyDep = finalYearlyDep / 365;
            finalMonthlyDep = finalDailyDep * daysInCurrentMonth;
          }

          // Condition 3: Estimated Life Usage Change After the Useful Life
          if (actualUsageToDate >= totalEstimatedUsage) {
            const extendedTotalUsage = req.body.extended_total_usage || 35000;
            const revisedResidualValue =
              req.body.revised_residual_value || 5000;

            const newDepreciableBase = finalCurrentValue - revisedResidualValue;
            const newUsageEstimate = extendedTotalUsage - actualUsageToDate;
            const newDepreciationRatePerHour =
              newUsageEstimate > 0 ? newDepreciableBase / newUsageEstimate : 0;

            finalYearlyDep = currentPeriodUsage * newDepreciationRatePerHour;
            finalDailyDep = finalYearlyDep / 365;
            finalMonthlyDep = finalDailyDep * daysInCurrentMonth;
          }

          depreciationValues = {
            monthly_depreciation: parseFloat(finalMonthlyDep.toFixed(2)),
            yearly_depreciation: parseFloat(finalYearlyDep.toFixed(2)),
            accumulated_depreciation: parseFloat(
              finalAccumulatedDep.toFixed(2)
            ),
            current_value: parseFloat(finalCurrentValue.toFixed(2)),
            is_depreciation_calculated: true,
            useful_life: totalEstimatedUsage,
            default_dep_rate: parseFloat(depreciationRatePerUnit.toFixed(4)),
          };
        }
      } catch (depError) {
        await transaction.rollback();
        console.error("Depreciation calculation failed:", depError);
        return res.status(400).json({
          message: "Depreciation calculation failed",
          error: depError.message,
        });
      }
    }

    await asset.update(
      {
        tag_number: tag_number || asset.tag_number,
        serial_number: serial_number || asset.serial_number,
        engine_number: engine_number || asset.engine_number,
        year_of_manufacture: year_of_manufacture || asset.year_of_manufacture,
        manufacturer_id: manufacturer_id || asset.manufacturer_id,
        model_id: model_id || asset.model_id,
        vehicle_type: vehicle_type || asset.vehicle_type,
        VIN: VIN || asset.VIN,
        description: description || asset.description,
        classification_id: classification_id || asset.classification_id,
        category_id: category_id || asset.category_id,
        subcategory_id: subcategory_id || asset.subcategory_id,
        capacity_id: capacity_id || asset.capacity_id,
        location_name: location_name || asset.location_name,
        cost_center_name: cost_center_name || asset.cost_center_name,
        departmentName: departmentName || asset.departmentName,
        custodian_name: custodian_name || asset.custodian_name,
        acquisition_date: acquisition_date || asset.acquisition_date,
        acquisition_cost: acquisition_cost || asset.acquisition_cost,
        supplier_name: supplier_name || asset.supplier_name,
        purchase_order_id: purchase_order_id || asset.purchase_order_id,
        accumulated_depreciation: depreciationValues.accumulated_depreciation,
        monthly_depreciation: depreciationValues.monthly_depreciation,
        yearly_depreciation: depreciationValues.yearly_depreciation,
        is_depreciation_calculated:
          depreciationValues.is_depreciation_calculated,
        useful_life: depreciationValues.useful_life,
        default_dep_rate: depreciationValues.default_dep_rate,
        residual_value:
          residual_value !== null ? residual_value : asset.residual_value,
        current_value: depreciationValues.current_value,
        status: newStatus,
        barcode: barcode || asset.barcode,
        rfid_tag: rfid_tag || asset.rfid_tag,
        journal_entry_id: journal_entry_id || asset.journal_entry_id,
        photo_attachments,
        document_attachments,
        warranty_details: warranty_details || asset.warranty_details,
      },
      { transaction }
    );

    if (status === "active" && asset.status === "in_construction") {
      try {
        const glResponse = await postToGeneralLedger({
          type: "asset_acquisition",
          asset_id,
          amount: asset.acquisition_cost,
          account: "fixed_asset",
          contra_account: "accounts_payable",
        });
        await asset.update(
          { journal_entry_id: glResponse.journal_entry_id },
          { transaction }
        );
      } catch (glError) {
        console.error("GL posting failed (continuing anyway):", glError);
      }
    }

    await transaction.commit();

    res.status(200).json({
      message: "Asset updated successfully",
      asset: {
        ...asset.get({ plain: true }),
        depreciation_calculated: depreciationValues.is_depreciation_calculated,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Asset update error:", error);
    res.status(500).json({
      message: "Error updating asset",
      error: error.message,
      details: error.errors?.map((e) => e.message) || [],
    });
  }
};

// Get asset photos
const getAssetPhotos = async (req, res) => {
  const { asset_id } = req.params;
  try {
    const asset = await AssetModel.findByPk(asset_id, {
      attributes: ["photo_attachments"],
    });
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.status(200).json({ photos: asset.photo_attachments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving photos", error: error.message });
  }
};

// Get asset documents
const getAssetDocuments = async (req, res) => {
  const { asset_id } = req.params;
  try {
    const asset = await AssetModel.findByPk(asset_id, {
      attributes: ["document_attachments"],
    });
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.status(200).json({ documents: asset.document_attachments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving documents", error: error.message });
  }
};

// Serve asset files
const serveAssetFile = (req, res) => {
  const validFolders = ["assetsImages", "assetsDocs"]; // Allowed folders
  const { folder, filename } = req.params;

  // Validate folder
  if (!validFolders.includes(folder)) {
    return res.status(400).json({ message: "Invalid folder" });
  }

  // Use the same base path as upload directories
  const basePath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "assets"
  );
  const safePath = path.join(basePath, folder, filename);

  // Security check to prevent directory traversal
  if (!safePath.startsWith(basePath)) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (fs.existsSync(safePath)) {
    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Set Content-Disposition for documents to encourage downloading
    if (folder === "assetsDocs") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
    } else {
      res.setHeader("Content-Disposition", "inline");
    }

    res.setHeader("Content-Type", contentType);
    fs.createReadStream(safePath).pipe(res);
  } else {
    res.status(404).json({ message: "File not found" });
  }
};

// Delete an asset
const deleteAsset = async (req, res) => {
  const { asset_id } = req.params;

  try {
    const asset = await AssetModel.findByPk(asset_id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    await asset.destroy();
    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting asset", error: error.message });
  }
};

// Get asset by ID
const getAssetById = async (req, res) => {
  try {
    const { asset_id } = req.params;
    const asset = await AssetModel.findByPk(asset_id, {
      include: [
        { model: AssetCategoryModel, as: "category" },
        { model: AssetSubcategoryModel, as: "subcategory" },
        { model: AssetCapacityModel, as: "capacity" },
        { model: ManufacturerModel, as: "manufacturer" },
        { model: ModelAssetModel, as: "model" },
        { model: AssetClassificationModel, as: "classification" },
        { model: AssetLocationModel, as: "location" },
        { model: AssetDepartmentModel, as: "department" },
        { model: AssetCostCenterModel, as: "cost_center" },
        { model: AssetCustodianModel, as: "custodian" },
        { model: AssetSupplierModel, as: "supplier" },
      ],
    });
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    res.status(200).json(asset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving asset", error: error.message });
  }
};

const getAssetByTagNumber = async (req, res) => {
  try {
    const { tag_number } = req.params;
    console.log("Fetching asset for tag_number:", tag_number);
    const asset = await AssetModel.findOne({
      where: { tag_number },
      include: [
        { model: AssetLocationModel, as: "location" },
        { model: AssetDepartmentModel, as: "department" },
        { model: AssetCostCenterModel, as: "cost_center" },
        { model: AssetCustodianModel, as: "custodian" },
      ],
    });

    if (!asset) {
      console.log("Asset not found for tag_number:", tag_number);
      return res.status(404).json({ message: "Asset not found" });
    }

    res.status(200).json({
      tag_number: asset.tag_number,
      location_name: asset.location?.location_name || null,
      departmentName: asset.department?.departmentName || null,
      cost_center_name: asset.cost_center?.cost_center_name || null,
      custodian_name: asset.custodian?.custodian_name || null,
    });
  } catch (error) {
    console.error("Error retrieving asset:", error);
    res
      .status(500)
      .json({ message: "Error retrieving asset", error: error.message });
  }
};

// Get all assets with pagination
const getAllAssets = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalAssets, rows: assets } =
      await AssetModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          { model: AssetCategoryModel, as: "category" },
          { model: AssetSubcategoryModel, as: "subcategory" },
          { model: AssetCapacityModel, as: "capacity" },
          { model: ManufacturerModel, as: "manufacturer" },
          { model: ModelAssetModel, as: "model" },
          { model: AssetClassificationModel, as: "classification" },
          { model: AssetLocationModel, as: "location" },
          { model: AssetDepartmentModel, as: "department" },
          { model: AssetCostCenterModel, as: "cost_center" },
          { model: AssetCustodianModel, as: "custodian" },
          { model: AssetSupplierModel, as: "supplier" },
        ],
      });

    res.status(200).json({
      totalAssets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAssets / limit),
      assets,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving assets", error: error.message });
  }
};

// Filter assets
const filterAssets = async (req, res) => {
  try {
    const {
      status = "All",
      category_id,
      location_name,
      departmentName,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);
    const where = {};

    if (status !== "All") where.status = status;
    if (category_id) where.category_id = category_id;
    if (location_name) where.location_name = location_name;
    if (departmentName) where.departmentName = departmentName;

    const { count: totalAssets, rows: assets } =
      await AssetModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalAssets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAssets / limit),
      assets,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering assets", error: error.message });
  }
};

// Export asset register to CSV
const exportAssetRegisterToCSV = async (req, res) => {
  try {
    const {
      status = "All",
      category_id,
      location_name,
      departmentName,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);
    const where = {};

    if (status !== "All") where.status = status;
    if (category_id) where.category_id = category_id;
    if (location_name) where.location_name = location_name;
    if (departmentName) where.departmentName = departmentName;

    const assets = await AssetModel.findAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!assets || assets.length === 0) {
      return res
        .status(404)
        .json({ message: "No assets found matching the filters" });
    }

    const assetData = assets.map((asset) => ({
      asset_id: asset.asset_id,
      tag_number: asset.tag_number,
      serial_number: asset.serial_number,
      engine_number: asset.engine_number,
      year_of_manufacture: asset.year_of_manufacture,
      manufacturer_id: asset.manufacturer_id,
      model_id: asset.model_id,
      vehicle_type: asset.vehicle_type,
      VIN: asset.VIN,
      description: asset.description,
      classification_id: asset.classification_id,
      category_id: asset.category_id,
      subcategory_id: asset.subcategory_id,
      capacity_id: asset.capacity_id,
      location_name: asset.location_name,
      departmentName: asset.departmentName,
      acquisition_date: asset.acquisition_date,
      acquisition_cost: asset.acquisition_cost,
      net_book_value: asset.current_value,
      status: asset.status,
      barcode: asset.barcode,
      rfid_tag: asset.rfid_tag,
      journal_entry_id: asset.journal_entry_id,
      photo_attachments: JSON.stringify(asset.photo_attachments),
      document_attachments: JSON.stringify(asset.document_attachments),
      warranty_details: asset.warranty_details,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(assetData);

    res.header("Content-Type", "text/csv");
    res.attachment("asset_register.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: "Error exporting asset register to CSV",
      error: error.message,
    });
  }
};

// Export asset register to PDF
const exportAssetRegisterToPDF = async (req, res) => {
  try {
    const {
      status = "All",
      category_id,
      location_name,
      departmentName,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);
    const where = {};

    if (status !== "All") where.status = status;
    if (category_id) where.category_id = category_id;
    if (location_name) where.location_name = location_name;
    if (departmentName) where.departmentName = departmentName;

    const assets = await AssetModel.findAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!assets || assets.length === 0) {
      return res
        .status(404)
        .json({ message: "No assets found matching the filters" });
    }

    const assetData = assets.map((asset) => [
      asset.asset_id || "N/A",
      asset.tag_number || "N/A",
      asset.serial_number || "N/A",
      asset.engine_number || "N/A",
      asset.year_of_manufacture || "N/A",
      asset.manufacturer || "N/A",
      asset.model || "N/A",
      asset.vehicle_type || "N/A",
      asset.VIN || "N/A",
      asset.classification_id || "N/A",
      asset.category_id || "N/A",
      asset.subcategory_id || "N/A",
      asset.capacity_id || "N/A",
      asset.photo_attachments.map((p) => p.originalName).join(", ") || "N/A",
      asset.document_attachments.map((d) => d.originalName).join(", ") || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Asset Register", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
              "*",
            ],
            body: [
              [
                "Asset ID",
                "Tag Number",
                "Serial No.",
                "Engine No.",
                "Year",
                "Manufacturer",
                "Model",
                "Vehicle Type",
                "Identification Number",
                "Classification",
                "Category",
                "Subcategory",
                "Capacity",
                "Photos",
                "Documents",
              ],
              ...assetData,
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        body: {
          fontSize: 8,
          bold: true,
        },
      },
      defaultStyle: {
        fontSize: 8,
      },
    };

    const printer = new PdfPrinter({
      Roboto: {
        normal: path.join(sourceDir, "Roboto-Regular.ttf"),
        bold: path.join(sourceDir, "Roboto-Medium.ttf"),
        italics: path.join(sourceDir, "Roboto-Italic.ttf"),
        bolditalics: path.join(sourceDir, "Roboto-MediumItalic.ttf"),
      },
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.header("Content-Type", "application/pdf");
    res.attachment("asset_register.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res.status(500).json({
      message: "Error exporting asset register to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  uploadAssets: upload,
  createAsset,
  updateAsset,
  getAssetPhotos,
  getAssetDocuments,
  serveAssetFile,
  deleteAsset,
  getAssetById,
  getAssetByTagNumber,
  getAllAssets,
  filterAssets,
  exportAssetRegisterToCSV,
  exportAssetRegisterToPDF,
};

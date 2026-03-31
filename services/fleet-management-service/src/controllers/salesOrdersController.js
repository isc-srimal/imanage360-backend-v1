const SalesOrdersModel = require("../models/SalesOrdersModel");
const JobLocationModel = require("../models/JobLocationModel");
const EmployeeModel = require("../../../hr-service/src/models/employees/EmployeeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const multer = require("multer");
const ProductModel = require("../models/ProductModel");
const ServiceOptionsModel = require("../models/ServiceOptionsModel");
const EquipmentRentalServiceModel = require("../models/EquipmentRentalServiceModel");
const OtherChargesModel = require("../models/OtherChargesModel");
const sequelize = require("../../src/config/dbSync");
const { Op } = require("sequelize");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

// Multer for LPO End Date Support Document
const uploadLPOEndDateSupportDocument = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/lpoEndDateSupportAttachmentDocuments/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 50 },
}).any();

// Multer for Support Document
const uploadSupportDocument = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/supportAttachmentDocuments/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 50 },
}).any();

// Helper: Delete old file
const deleteOldFile = async (filePath) => {
  if (!filePath) return;
  try {
    const actualPath = filePath.replace(/^\/public\//, "public/");
    const fullPath = path.join(__dirname, "..", "..", actualPath);
    if (
      await fs
        .access(fullPath)
        .then(() => true)
        .catch(() => false)
    ) {
      await fs.unlink(fullPath);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

// Parse numeric values safely
const parseNumeric = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
};

// In updateBillingHistory function (around line 134)
const updateBillingHistory = (existingHistory, newData, salesOrderId) => {
  const history = Array.isArray(existingHistory) ? [...existingHistory] : [];

  // Create new history entry
  const newEntry = {
    id: `billing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    billing_type: newData.billing_type,
    shift: newData.shift,
    unit_rate: newData.unit_rate || null,
    day_unit_rate: newData.day_unit_rate || null,
    night_unit_rate: newData.night_unit_rate || null,
    // ADD THESE NEW FIELDS
    day_ot_rate: newData.day_ot_rate || 0, // Default to 0 if not provided
    night_ot_rate: newData.night_ot_rate || 0, // Default to 0 if not provided
    full_ot_rate: newData.full_ot_rate || 0, // Default to 0 if not provided
    effective_start_date: newData.effective_start_date,
    effective_end_date: newData.effective_end_date,
    created_at: new Date().toISOString(),
    sales_order_id: salesOrderId,
  };

  history.push(newEntry);
  return history;
};

const checkAndHandleLPOReminders = async (salesOrder) => {
  const today = new Date();
  const orderDate = new Date(salesOrder.ordered_date);
  const daysSinceOrder = Math.floor(
    (today - orderDate) / (1000 * 60 * 60 * 24),
  );

  const lpoStatus = await SalesOrdersModel.checkLPOStatus(salesOrder);

  const updates = {};
  const reminders = [];
  const requiresAction = false;

  // Check for missing LPO (7 days after order submission)
  if (!lpoStatus.hasLPO) {
    if (daysSinceOrder >= 7) {
      const lastReminderDate = salesOrder.no_lpo_last_reminder_date
        ? new Date(salesOrder.no_lpo_last_reminder_date)
        : null;

      const daysSinceLastReminder = lastReminderDate
        ? Math.floor((today - lastReminderDate) / (1000 * 60 * 60 * 24))
        : null;

      // Check if we need to show reminder
      if (
        !salesOrder.no_lpo_remarks ||
        (lastReminderDate && daysSinceLastReminder >= 7)
      ) {
        reminders.push({
          type: "no_lpo",
          message: "Please enter remarks for not obtaining LPO",
          requiresAction: !salesOrder.no_lpo_remarks,
        });

        updates.no_lpo_last_reminder_date = today;
        updates.no_lpo_reminder_count =
          (salesOrder.no_lpo_reminder_count || 0) + 1;
      }
    }
  }

  // Check for expired LPO
  if (lpoStatus.hasLPO && lpoStatus.isLPOExpired) {
    const expiryDate =
      lpoStatus.extendedLpoValidityDate || lpoStatus.lpoValidityDate;
    const expiryDateObj = new Date(expiryDate);
    const daysSinceExpiry = Math.floor(
      (today - expiryDateObj) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceExpiry >= 7) {
      const lastReminderDate = salesOrder.lpo_expired_last_reminder_date
        ? new Date(salesOrder.lpo_expired_last_reminder_date)
        : null;

      const daysSinceLastReminder = lastReminderDate
        ? Math.floor((today - lastReminderDate) / (1000 * 60 * 60 * 24))
        : null;

      // Check if we need to show reminder
      if (
        !salesOrder.lpo_expired_remarks ||
        (lastReminderDate && daysSinceLastReminder >= 7)
      ) {
        reminders.push({
          type: "lpo_expired",
          message: "Please enter remarks for not obtaining LPO extension",
          requiresAction: !salesOrder.lpo_expired_remarks,
        });

        updates.lpo_expired_last_reminder_date = today;
        updates.lpo_expired_reminder_count =
          (salesOrder.lpo_expired_reminder_count || 0) + 1;
      }
    }
  }

  // If remarks were added, mark manager as notified
  if (
    (salesOrder.no_lpo_remarks || salesOrder.lpo_expired_remarks) &&
    !salesOrder.manager_notified
  ) {
    updates.manager_notified = true;
    updates.manager_notification_date = today;
  }

  if (Object.keys(updates).length > 0) {
    await salesOrder.update(updates);
  }

  return {
    hasReminders: reminders.length > 0,
    reminders,
    requiresAction: reminders.some((r) => r.requiresAction),
  };
};

const getLPOReminders = async (req, res) => {
  try {
    const salesOrders = await SalesOrdersModel.findAll({
      include: [
        { model: JobLocationModel, as: "jobLocation" },
        { model: EmployeeModel, as: "employee" },
      ],
      where: {
        // status: "Active",
        so_status: ["Approved", "Revision Under Approval", "Revision Rejected"],
      },
    });

    const allReminders = [];

    for (const order of salesOrders) {
      const reminderInfo = await checkAndHandleLPOReminders(order);

      if (reminderInfo.hasReminders) {
        allReminders.push({
          salesOrderId: order.id,
          soNumber: order.so_number,
          client: order.client,
          reminders: reminderInfo.reminders,
          requiresAction: reminderInfo.requiresAction,
          managerNotified: order.manager_notified,
          lastReminderDate:
            order.no_lpo_last_reminder_date ||
            order.lpo_expired_last_reminder_date,
        });
      }
    }

    res.status(200).json({
      message: "LPO reminders retrieved successfully",
      totalReminders: allReminders.length,
      reminders: allReminders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving LPO reminders",
      error: error.message,
    });
  }
};

const submitLPORemarks = async (req, res) => {
  const { id } = req.params;
  const { remarks, type } = req.body;

  try {
    const salesOrder = await SalesOrdersModel.findByPk(id);

    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    const updates = {};
    const today = new Date();

    if (type === "no_lpo") {
      updates.no_lpo_remarks = remarks;
      updates.no_lpo_last_reminder_date = today;
      updates.manager_notified = true;
      updates.manager_notification_date = today;
    } else if (type === "lpo_expired") {
      updates.lpo_expired_remarks = remarks;
      updates.lpo_expired_last_reminder_date = today;
      updates.manager_notified = true;
      updates.manager_notification_date = today;
    } else {
      return res.status(400).json({ message: "Invalid remark type" });
    }

    await salesOrder.update(updates);

    res.status(200).json({
      message: "Remarks submitted successfully and manager notified",
      salesOrder: await SalesOrdersModel.findByPk(id, {
        include: [
          { model: JobLocationModel, as: "jobLocation" },
          { model: EmployeeModel, as: "employee" },
        ],
      }),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error submitting remarks",
      error: error.message,
    });
  }
};

const createSalesOrder = async (req, res) => {
  uploadLPOEndDateSupportDocument(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    let parsedSalesOrderData;
    try {
      const dataFile = req.files?.find((f) => f.fieldname === "data");
      if (dataFile) {
        const fileContent = await fsPromises.readFile(dataFile.path, "utf8");
        parsedSalesOrderData = JSON.parse(fileContent);
        await fsPromises.unlink(dataFile.path);
      } else if (req.body.data) {
        parsedSalesOrderData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } else {
        parsedSalesOrderData = req.body;
      }

      const {
        draftId, // ✅ Extract draftId from request
        ordered_date,
        client,
        location_id,
        sales_person_id,
        quotation_number,
        project_name,
        delivery_address,
        lpo_number,
        approval_remark,
        lpo_start_date,
        lpo_validity_start_date,
        lpo_validity_date,
        product_service_option,
        product_type_vehicle_type,
        billing_type,
        no_of_equipment,
        recovery_remarks,
        operator_type,
        no_of_operator,
        mobilization_unit_rate,
        demobilization_unit_rate,
        mobilization_no_of_trips,
        demobilization_no_of_trips,
        otherCharges,
        engine_hours_limit,
        additional_charges,
        serviceOptions,
        rentalService,
        shift,
        unit_rate = 0,
        day_unit_rate = 0,
        night_unit_rate = 0,
        quantity_trips_or_days = 0,
        is_friday_off,
        is_public_holiday_off,
        service_entry_type,
        so_status,
        ops_status,
        expected_mobilization_date,
        expected_demobilization_date,
        normal_working_hrs_equipment,
        normal_working_hrs_manpower,
        // ot_applicable = false,
        // ot_rate_qar,
        day_ot_rate,
        night_ot_rate,
        full_ot_rate,
        recovery_is_required = false,
        recovery_cost,
        description_remarks,
        gate_pass_location,
        gate_access_no,
        effective_start_date,
        effective_end_date,
        chargeable_types_table = [],
        chargeable_types_selected = [], // NEW: Get selected chargeable types with details
        chargeable_type_effective_start_date,
        completionStatuses,
      } = parsedSalesOrderData;

      // Validation
      // Validation for mandatory fields when LPO is available
      if (lpo_number && lpo_number.trim() !== "") {
        if (!expected_mobilization_date) {
          return res.status(400).json({
            message:
              "Sales Expected Mobilization Date is required when LPO is available",
          });
        }
        if (!expected_demobilization_date) {
          return res.status(400).json({
            message:
              "Sales Expected Demobilization Date is required when LPO is available",
          });
        }

        // Validate date order
        if (expected_mobilization_date > expected_demobilization_date) {
          return res.status(400).json({
            message:
              "Mobilization date must be before or equal to Demobilization date",
          });
        }
      }

      // Validate location_id
      if (!location_id || !(await JobLocationModel.findByPk(location_id))) {
        return res.status(400).json({ message: "Invalid location" });
      }
      if (!client?.trim()) {
        return res.status(400).json({ message: "Client name is required" });
      }

      // Always set to "Under Approval" for new sales orders
      const needsApproval = true; // Always need approval
      const initialOrderStatus = "Under Approval"; // Always Under Approval

      // Set approval remark - use provided remark or default message
      const defaultRemark =
        lpo_number && lpo_number.trim() !== ""
          ? "New sales order created - requires approval"
          : "Sales order created without LPO number - requires approval";

      const finalApprovalRemark = approval_remark || defaultRemark;

      const uploadedFiles =
        req.files?.reduce((acc, file) => {
          if (file.fieldname !== "data") {
            acc[file.fieldname] = acc[file.fieldname] || [];
            acc[file.fieldname].push(file);
          }
          return acc;
        }, {}) || {};

      // ✅ CHECK IF THIS IS A DRAFT CONVERSION
      let salesOrder;
      let isConvertingDraft = false;

      if (draftId) {
        // Converting draft to sales order
        const existingDraft = await SalesOrdersModel.findOne({
          where: {
            id: draftId,
            is_draft: true,
          },
        });

        if (!existingDraft) {
          return res.status(404).json({
            message: "Draft not found or already submitted",
          });
        }

        isConvertingDraft = true;

        // Prepare update data
        const salesOrderData = {
          // Don't change so_number - keep the existing one
          ordered_date: new Date().toISOString(),
          client: client.trim(),
          location_id,
          sales_person_id,
          quotation_number,
          project_name,
          delivery_address,
          lpo_number: lpo_number || null,
          lpo_start_date,
          lpo_validity_start_date,
          lpo_validity_date,
          product_service_option,
          product_type_vehicle_type,
          billing_type,
          recovery_remarks,
          no_of_equipment: parseNumeric(no_of_equipment),
          operator_type,
          no_of_operator: parseNumeric(no_of_operator),
          mobilization_unit_rate: parseNumeric(mobilization_unit_rate),
          demobilization_unit_rate: parseNumeric(demobilization_unit_rate),
          mobilization_no_of_trips: parseNumeric(mobilization_no_of_trips),
          demobilization_no_of_trips: parseNumeric(demobilization_no_of_trips),
          engine_hours_limit,
          additional_charges: parseNumeric(additional_charges),
          // chargeable_types: parsedSalesOrderData.chargeable_types || [],
          chargeable_types_table: chargeable_types_table || [],
          // Keep legacy field for backward compatibility
          chargeable_types: chargeable_types_table
            .filter((item) => item.selected)
            .map((item) => item.id),
          // chargeable_types: parsedSalesOrderData.chargeable_types || [], // Legacy support
          chargeable_types_selected: chargeable_types_selected || [], // NEW: Store with details
          chargeable_type_effective_start_date:
            chargeable_type_effective_start_date || null, // NEW
          shift,
          unit_rate: parseNumeric(unit_rate),
          day_unit_rate: parseNumeric(day_unit_rate),
          night_unit_rate: parseNumeric(night_unit_rate),
          quantity_trips_or_days: parseNumeric(quantity_trips_or_days),
          is_friday_off,
          is_public_holiday_off,
          service_entry_type,
          so_status: initialOrderStatus,
          ops_status,
          needs_approval: needsApproval,
          approval_remark: finalApprovalRemark,
          expected_mobilization_date,
          expected_demobilization_date,
          normal_working_hrs_equipment: parseNumeric(
            normal_working_hrs_equipment,
          ),
          normal_working_hrs_manpower: parseNumeric(
            normal_working_hrs_manpower,
          ),
          // ot_applicable,
          // ot_rate_qar: parseNumeric(ot_rate_qar),
          day_ot_rate: parseNumeric(day_ot_rate),
          night_ot_rate: parseNumeric(night_ot_rate),
          full_ot_rate: parseNumeric(full_ot_rate),
          recovery_is_required,
          recovery_cost: parseNumeric(recovery_cost),
          description_remarks,
          gate_pass_location,
          gate_access_no,
          effective_start_date,
          effective_end_date,
          completionStatuses: completionStatuses || {},
          // ✅ IMPORTANT: Mark as no longer a draft
          is_draft: false,
          draft_data: null,
          last_auto_saved_at: null,
          no_lpo_remarks: null,
          no_lpo_last_reminder_date: null,
          no_lpo_reminder_count: 0,
          lpo_expired_remarks: null,
          lpo_expired_last_reminder_date: null,
          lpo_expired_reminder_count: 0,
          manager_notified: false,
          manager_notification_date: null,
        };

        // Update billing history
        salesOrderData.billing_history = updateBillingHistory(
          [],
          {
            billing_type,
            shift,
            unit_rate,
            day_unit_rate,
            night_unit_rate,
            day_ot_rate, // ADD THIS
            night_ot_rate, // ADD THIS
            full_ot_rate, // ADD THIS
            effective_start_date: expected_mobilization_date,
            effective_end_date,
          },
          null,
        );

        // Handle file
        if (uploadedFiles.lpoEndDateSupportAttachment?.[0]?.filename) {
          salesOrderData.lpoEndDateSupportAttachment = `/public/uploads/lpoEndDateSupportAttachmentDocuments/${uploadedFiles.lpoEndDateSupportAttachment[0].filename}`;
        }

        // ✅ UPDATE the existing draft record
        await existingDraft.update(salesOrderData);
        salesOrder = existingDraft;
      } else {
        // Creating new sales order (not from draft)
        const so_number = await SalesOrdersModel.generateSONumber();

        const salesOrderData = {
          so_number,
          ordered_date: new Date().toISOString(),
          client: client.trim(),
          location_id,
          sales_person_id,
          quotation_number,
          project_name,
          delivery_address,
          lpo_number: lpo_number || null,
          lpo_start_date,
          lpo_validity_start_date,
          lpo_validity_date,
          product_service_option,
          product_type_vehicle_type,
          billing_type,
          recovery_remarks,
          no_of_equipment: parseNumeric(no_of_equipment),
          operator_type,
          no_of_operator: parseNumeric(no_of_operator),
          mobilization_unit_rate: parseNumeric(mobilization_unit_rate),
          demobilization_unit_rate: parseNumeric(demobilization_unit_rate),
          mobilization_no_of_trips: parseNumeric(mobilization_no_of_trips),
          demobilization_no_of_trips: parseNumeric(demobilization_no_of_trips),
          engine_hours_limit,
          additional_charges: parseNumeric(additional_charges),
          chargeable_types: parsedSalesOrderData.chargeable_types || [],
          shift,
          unit_rate: parseNumeric(unit_rate),
          day_unit_rate: parseNumeric(day_unit_rate),
          night_unit_rate: parseNumeric(night_unit_rate),
          quantity_trips_or_days: parseNumeric(quantity_trips_or_days),
          is_friday_off,
          is_public_holiday_off,
          service_entry_type,
          so_status: initialOrderStatus,
          ops_status,
          needs_approval: needsApproval,
          approval_remark: finalApprovalRemark,
          expected_mobilization_date,
          expected_demobilization_date,
          normal_working_hrs_equipment: parseNumeric(
            normal_working_hrs_equipment,
          ),
          normal_working_hrs_manpower: parseNumeric(
            normal_working_hrs_manpower,
          ),
          // ot_applicable,
          // ot_rate_qar: parseNumeric(ot_rate_qar),
          day_ot_rate: parseNumeric(day_ot_rate),
          night_ot_rate: parseNumeric(night_ot_rate),
          full_ot_rate: parseNumeric(full_ot_rate),
          recovery_is_required,
          recovery_cost: parseNumeric(recovery_cost),
          description_remarks,
          gate_pass_location,
          gate_access_no,
          effective_start_date,
          effective_end_date,
          completionStatuses: completionStatuses || {},
          no_lpo_remarks: null,
          no_lpo_last_reminder_date: null,
          no_lpo_reminder_count: 0,
          lpo_expired_remarks: null,
          lpo_expired_last_reminder_date: null,
          lpo_expired_reminder_count: 0,
          manager_notified: false,
          manager_notification_date: null,
          is_draft: false,
        };

        salesOrderData.billing_history = updateBillingHistory(
          [],
          {
            billing_type,
            shift,
            unit_rate,
            day_unit_rate,
            night_unit_rate,
            day_ot_rate, // ADD THIS
            night_ot_rate, // ADD THIS
            full_ot_rate, // ADD THIS
            effective_start_date: expected_mobilization_date,
            effective_end_date,
          },
          null,
        );

        // Handle file
        if (uploadedFiles.lpoEndDateSupportAttachment?.[0]?.filename) {
          salesOrderData.lpoEndDateSupportAttachment = `/public/uploads/lpoEndDateSupportAttachmentDocuments/${uploadedFiles.lpoEndDateSupportAttachment[0].filename}`;
        }

        // Create sales order
        salesOrder = await SalesOrdersModel.create(salesOrderData);
      }

      // Handle other charges (delete existing if updating draft)
      if (isConvertingDraft) {
        await OtherChargesModel.destroy({
          where: { sales_order_id: salesOrder.id },
        });
      }

      if (
        otherCharges &&
        Array.isArray(otherCharges) &&
        otherCharges.length > 0
      ) {
        const otherChargesData = otherCharges.map((charge) => ({
          type: charge.type || null,
          description: charge.description || null,
          unit_rate: charge.unit_rate ? parseFloat(charge.unit_rate) : null,
          sales_order_id: salesOrder.id,
        }));

        await OtherChargesModel.bulkCreate(otherChargesData);
      }

      // Handle service options (delete existing if updating draft)
      if (isConvertingDraft) {
        await ServiceOptionsModel.destroy({
          where: { sales_order_id: salesOrder.id },
        });
      }

      if (
        serviceOptions &&
        Array.isArray(serviceOptions) &&
        serviceOptions.length > 0
      ) {
        const serviceOptionsData = serviceOptions.map((option) => ({
          details: option.details,
          provider: option.provider,
          target_cost_amount:
            option.provider === "Company" && option.target_cost_amount
              ? parseFloat(option.target_cost_amount)
              : null,
          sales_order_id: salesOrder.id,
        }));

        await ServiceOptionsModel.bulkCreate(serviceOptionsData);
      }

      // Handle rental services (delete existing if updating draft)
      if (isConvertingDraft) {
        await EquipmentRentalServiceModel.destroy({
          where: { sales_order_id: salesOrder.id },
        });
      }

      if (
        rentalService &&
        Array.isArray(rentalService) &&
        rentalService.length > 0
      ) {
        const rentalServiceData = rentalService.map((rental) => ({
          product: rental.product || null,
          unit_price: rental.unit_price ? parseFloat(rental.unit_price) : null,
          income_account: rental.income_account || null,
          sales_order_id: salesOrder.id,
        }));

        await EquipmentRentalServiceModel.bulkCreate(rentalServiceData);
      }

      // Fetch the created sales order with service options
      const createdSalesOrder = await SalesOrdersModel.findByPk(salesOrder.id, {
        include: [
          { model: JobLocationModel, as: "jobLocation" },
          { model: EmployeeModel, as: "employee" },
          { model: ProductModel, as: "subProduct" },
          { model: ServiceOptionsModel, as: "serviceOptions" },
          { model: EquipmentRentalServiceModel, as: "rentalService" },
          { model: OtherChargesModel, as: "otherCharges" },
        ],
      });

      res.status(201).json({
        message: isConvertingDraft
          ? "Draft converted to sales order and sent for approval"
          : "Sales order created and sent for approval",
        salesOrder: createdSalesOrder,
        needsApproval: true,
        wasConvertedFromDraft: isConvertingDraft,
      });
    } catch (error) {
      console.error("Error in createSalesOrder:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

const updateSalesOrder = async (req, res) => {
  const uploadBoth = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const dest =
          file.fieldname === "lpoEndDateSupportAttachment"
            ? "public/uploads/lpoEndDateSupportAttachmentDocuments/"
            : "public/uploads/supportAttachmentDocuments/";
        cb(null, dest);
      },
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
      },
    }),
    limits: { fileSize: 1024 * 1024 * 50 },
  }).any();

  uploadBoth(req, res, async (err) => {
    if (err)
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });

    const { id } = req.params;
    let parsedSalesOrderData;

    try {
      const dataFile = req.files?.find((f) => f.fieldname === "data");
      if (dataFile) {
        const content = await fsPromises.readFile(dataFile.path, "utf8");
        parsedSalesOrderData = JSON.parse(content);
        await fsPromises.unlink(dataFile.path);
      } else if (req.body.data) {
        parsedSalesOrderData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } else {
        return res.status(400).json({ message: "Missing 'data' field" });
      }

      const salesOrder = await SalesOrdersModel.findByPk(id);
      if (!salesOrder)
        return res.status(404).json({ message: "Sales order not found" });

      // if (parsedSalesOrderData.chargeable_types !== undefined) {
      //   const chargeableTypesData = parsedSalesOrderData.chargeable_types || [];

      //   // Transform chargeable types to new format
      //   const transformedChargeableTypes = chargeableTypesData.map((item) => {
      //     if (typeof item === "object" && item !== null) {
      //       return {
      //         id: item.id,
      //         name: item.name || `Chargeable Type ${item.id}`,
      //         is_selected:
      //           item.is_selected !== undefined ? item.is_selected : true,
      //         effective_start_date: item.effective_start_date || null,
      //       };
      //     }
      //     return {
      //       id: item,
      //       name: `Chargeable Type ${item}`,
      //       is_selected: true,
      //       effective_start_date: null,
      //     };
      //   });

      //   // Check if chargeable_types changed
      //   const oldTypes = salesOrder.chargeable_types || [];
      //   const newTypes = transformedChargeableTypes || [];

      //   const areEqual =
      //     Array.isArray(oldTypes) &&
      //     Array.isArray(newTypes) &&
      //     oldTypes.length === newTypes.length &&
      //     oldTypes.every((oldItem, index) => {
      //       const newItem = newTypes[index];
      //       return (
      //         oldItem.id === newItem.id &&
      //         oldItem.is_selected === newItem.is_selected &&
      //         oldItem.effective_start_date === newItem.effective_start_date
      //       );
      //     });

      //   if (!areEqual) {
      //     editedFields.chargeable_types = {
      //       old: oldTypes,
      //       new: newTypes,
      //     };
      //     updatedData.chargeable_types = newTypes;
      //   }
      // }

      const {
        ordered_date,
        client,
        location_id,
        sales_person_id,
        quotation_number,
        project_name,
        delivery_address,
        lpo_number,
        revised_lpo_number,
        lpo_start_date,
        lpo_validity_start_date,
        lpo_validity_date,
        lpo_extension_issue_date,
        lpo_extension_start_date,
        recovery_remarks,
        extended_lpo_validity_date,
        product_service_option,
        product_type_vehicle_type,
        billing_type,
        no_of_equipment,
        engine_hours_limit,
        additional_charges,
        chargeable_types_table = [], // NEW
        chargeable_types,
        chargeable_types_selected = [], // NEW
        chargeable_type_effective_start_date, // NEW
        operator_type,
        no_of_operator,
        mobilization_unit_rate,
        demobilization_unit_rate,
        mobilization_no_of_trips,
        demobilization_no_of_trips,
        otherCharges,
        shift,
        unit_rate,
        day_unit_rate,
        night_unit_rate,
        quantity_trips_or_days,
        is_friday_off,
        is_public_holiday_off,
        service_entry_type,
        so_status,
        ops_status,
        expected_mobilization_date,
        expected_demobilization_date,
        normal_working_hrs_equipment,
        normal_working_hrs_manpower,
        // ot_applicable,
        // ot_rate_qar,
        day_ot_rate,
        night_ot_rate,
        full_ot_rate,
        recovery_is_required,
        recovery_cost,
        description_remarks,
        // status,
        gate_pass_location,
        gate_access_no,
        effective_start_date,
        effective_end_date,
        serviceOptions,
        rentalService,
        completionStatuses,
      } = parsedSalesOrderData;

      if (salesOrder.has_delivery_note) {
        // List of fields that CANNOT be modified after delivery note creation
        const restrictedFields = [
          "no_of_equipment",
          "product_type_vehicle_type",
          "product_service_option", // Equipment/Operator selection
        ];

        // Check if any restricted field is being modified
        const attemptedChanges = [];

        if (
          no_of_equipment !== undefined &&
          no_of_equipment !== salesOrder.no_of_equipment
        ) {
          attemptedChanges.push("Number of Equipment");
        }

        if (
          product_type_vehicle_type !== undefined &&
          product_type_vehicle_type !== salesOrder.product_type_vehicle_type
        ) {
          attemptedChanges.push("Vehicle Type");
        }

        if (
          parsedSalesOrderData.product_service_option !== undefined &&
          parsedSalesOrderData.product_service_option !==
            salesOrder.product_service_option
        ) {
          attemptedChanges.push("Product Service Option");
        }

        // If any restricted fields are being changed, reject the update
        if (attemptedChanges.length > 0) {
          return res.status(400).json({
            message:
              "Cannot modify equipment-related fields after delivery note has been created",
            restrictedFields: attemptedChanges,
            reason:
              "Equipment modifications are restricted after delivery note creation. Please contact operations for off-hire procedures.",
            allowedModifications: [
              "Number of operators (manpower)",
              "Other products and attachments",
              "Service options",
              "Billing information",
              "Dates and schedules",
            ],
          });
        }
      }

      // Validation for mandatory fields when LPO is available
      if (lpo_number && lpo_number.trim() !== "") {
        if (!expected_mobilization_date) {
          return res.status(400).json({
            message:
              "Sales Expected Mobilization Date is required when LPO is available",
          });
        }
        if (!expected_demobilization_date) {
          return res.status(400).json({
            message:
              "Sales Expected Demobilization Date is required when LPO is available",
          });
        }

        // Validate date order
        if (expected_mobilization_date > expected_demobilization_date) {
          return res.status(400).json({
            message:
              "Mobilization date must be before or equal to Demobilization date",
          });
        }
      }

      if (location_id && !(await JobLocationModel.findByPk(location_id))) {
        return res.status(400).json({ message: "Invalid location" });
      }
      if (client && !client.trim()) {
        return res.status(400).json({ message: "Client name cannot be empty" });
      }

      // Track changed fields for approval workflow
      const editedFields = {};
      const fieldsToTrack = [
        "client",
        "location_id",
        "sales_person_id",
        "quotation_number",
        "project_name",
        "delivery_address",
        "lpo_number",
        "revised_lpo_number",
        "lpo_start_date",
        "lpo_validity_start_date",
        "lpo_validity_date",
        "lpo_extension_issue_date",
        "lpo_extension_start_date",
        "extended_lpo_validity_date",
        "product_service_option",
        "product_type_vehicle_type",
        "billing_type",
        "engine_hours_limit",
        "additional_charges",
        "no_of_equipment",
        "operator_type",
        "no_of_operator",
        "mobilization_unit_rate",
        "demobilization_unit_rate",
        "mobilization_no_of_trips",
        "demobilization_no_of_trips",
        "shift",
        "unit_rate",
        "day_unit_rate",
        "night_unit_rate",
        "quantity_trips_or_days",
        "is_friday_off",
        "is_public_holiday_off",
        "service_entry_type",
        "expected_mobilization_date",
        "expected_demobilization_date",
        "normal_working_hrs_equipment",
        "normal_working_hrs_manpower",
        "day_ot_rate",
        "night_ot_rate",
        "full_ot_rate",
        "recovery_is_required",
        "recovery_cost",
        "recovery_remarks",
        "description_remarks",
        // "status",
        "gate_pass_location",
        "gate_access_no",
        "effective_start_date",
        "effective_end_date",
        "chargeable_types_table",
        "chargeable_types_selected",
        "chargeable_type_effective_start_date",
      ];

      // Compare each field to detect changes
      fieldsToTrack.forEach((field) => {
        const newValue = parsedSalesOrderData[field];
        const oldValue = salesOrder[field];

        // Skip if field is not provided in update
        if (newValue === undefined) return;

        // Convert values to comparable format
        const normalizedNew =
          newValue === null || newValue === "" ? null : String(newValue);
        const normalizedOld =
          oldValue === null || oldValue === "" ? null : String(oldValue);

        // Track if values are different
        if (normalizedNew !== normalizedOld) {
          editedFields[field] = {
            old: oldValue,
            new: newValue,
          };
        }
      });

      // Track otherCharges changes
      if (otherCharges !== undefined) {
        const oldOtherCharges = await OtherChargesModel.findAll({
          where: { sales_order_id: id },
          raw: true,
        });

        const normalizedOld = oldOtherCharges.map((c) => ({
          type: c.type || null,
          description: c.description || null,
          unit_rate: c.unit_rate ? parseFloat(c.unit_rate) : null,
        }));

        const normalizedNew = otherCharges.map((c) => ({
          type: c.type || null,
          description: c.description || null,
          unit_rate: c.unit_rate ? parseFloat(c.unit_rate) : null,
        }));

        if (JSON.stringify(normalizedOld) !== JSON.stringify(normalizedNew)) {
          editedFields.otherCharges = {
            old: normalizedOld,
            new: normalizedNew,
          };
        }
      }

      // Track rentalService changes
      if (rentalService !== undefined) {
        const oldRentalService = await EquipmentRentalServiceModel.findAll({
          where: { sales_order_id: id },
          raw: true,
        });

        const normalizedOld = oldRentalService.map((r) => ({
          product: r.product || null,
          unit_price: r.unit_price ? parseFloat(r.unit_price) : null,
          income_account: r.income_account || null,
        }));

        const normalizedNew = rentalService.map((r) => ({
          product: r.product || null,
          unit_price: r.unit_price ? parseFloat(r.unit_price) : null,
          income_account: r.income_account || null,
        }));

        if (JSON.stringify(normalizedOld) !== JSON.stringify(normalizedNew)) {
          editedFields.rentalService = {
            old: normalizedOld,
            new: normalizedNew,
          };
        }
      }

      // Check chargeable_types changes
      // if (parsedSalesOrderData.chargeable_types !== undefined) {
      //   const oldTypes = salesOrder.chargeable_types || [];
      //   const newTypes = parsedSalesOrderData.chargeable_types || [];

      //   // Compare arrays - check if they're different
      //   const areEqual =
      //     Array.isArray(oldTypes) &&
      //     Array.isArray(newTypes) &&
      //     oldTypes.length === newTypes.length &&
      //     oldTypes.every((id) => newTypes.includes(id)) &&
      //     newTypes.every((id) => oldTypes.includes(id));

      //   if (!areEqual) {
      //     editedFields.chargeable_types = {
      //       old: oldTypes,
      //       new: newTypes,
      //     };
      //   }
      // }
      if (parsedSalesOrderData.chargeable_types_table !== undefined) {
        const oldTable = salesOrder.chargeable_types_table || [];
        const newTable = parsedSalesOrderData.chargeable_types_table || [];

        // Check if there are differences
        const areEqual = JSON.stringify(oldTable) === JSON.stringify(newTable);

        if (!areEqual) {
          editedFields.chargeable_types_table = {
            old: oldTable,
            new: newTable,
          };
        }
      }

      if (parsedSalesOrderData.chargeable_types_selected !== undefined) {
        const oldTypes = salesOrder.chargeable_types_selected || [];
        const newTypes = parsedSalesOrderData.chargeable_types_selected || [];

        const areEqual =
          JSON.stringify(oldTypes.sort((a, b) => a.id - b.id)) ===
          JSON.stringify(newTypes.sort((a, b) => a.id - b.id));

        if (!areEqual) {
          editedFields.chargeable_types_selected = {
            old: oldTypes,
            new: newTypes,
          };
        }
      }

      // Compare effective start date
      if (
        parsedSalesOrderData.chargeable_type_effective_start_date !==
          undefined &&
        parsedSalesOrderData.chargeable_type_effective_start_date !==
          salesOrder.chargeable_type_effective_start_date
      ) {
        editedFields.chargeable_type_effective_start_date = {
          old: salesOrder.chargeable_type_effective_start_date,
          new: parsedSalesOrderData.chargeable_type_effective_start_date,
        };
      }

      const hasChanges = Object.keys(editedFields).length > 0;

      const uploadedFiles =
        req.files?.reduce((acc, file) => {
          if (file.fieldname !== "data") {
            acc[file.fieldname] = acc[file.fieldname] || [];
            acc[file.fieldname].push(file);
          }
          return acc;
        }, {}) || {};

      const updatedData = {
        ordered_date: salesOrder.ordered_date,
        client: client?.trim() || salesOrder.client,
        location_id: location_id || salesOrder.location_id,
        sales_person_id: sales_person_id || salesOrder.sales_person_id,
        quotation_number: quotation_number || salesOrder.quotation_number,
        project_name: project_name || salesOrder.project_name,
        delivery_address: delivery_address || salesOrder.delivery_address,
        lpo_number: lpo_number || salesOrder.lpo_number,
        revised_lpo_number: revised_lpo_number || salesOrder.revised_lpo_number,
        lpo_start_date: lpo_start_date || salesOrder.lpo_start_date,
        lpo_extension_issue_date:
          lpo_extension_issue_date || salesOrder.lpo_extension_issue_date,
        lpo_extension_start_date:
          lpo_extension_start_date || salesOrder.lpo_extension_start_date,
        lpo_validity_start_date:
          lpo_validity_start_date || salesOrder.lpo_validity_start_date,
        lpo_validity_date: lpo_validity_date || salesOrder.lpo_validity_date,
        extended_lpo_validity_date:
          extended_lpo_validity_date || salesOrder.extended_lpo_validity_date,
        product_service_option:
          product_service_option || salesOrder.product_service_option,
        product_type_vehicle_type:
          product_type_vehicle_type || salesOrder.product_type_vehicle_type,
        billing_type: billing_type || salesOrder.billing_type,
        engine_hours_limit: engine_hours_limit || salesOrder.engine_hours_limit,
        additional_charges: additional_charges ?? salesOrder.additional_charges,
        chargeable_types_table:
          chargeable_types_table || salesOrder.chargeable_types_table || [],
        chargeable_types: chargeable_types_table
          ? chargeable_types_table
              .filter((item) => item.selected)
              .map((item) => item.id)
          : salesOrder.chargeable_types,
        // chargeable_types: chargeable_types || salesOrder.chargeable_types,
        no_of_equipment: no_of_equipment ?? salesOrder.no_of_equipment,
        operator_type: operator_type || salesOrder.operator_type,
        no_of_operator: no_of_operator ?? salesOrder.no_of_operator,
        mobilization_unit_rate:
          mobilization_unit_rate ?? salesOrder.mobilization_unit_rate,
        demobilization_unit_rate:
          demobilization_unit_rate ?? salesOrder.demobilization_unit_rate,
        mobilization_no_of_trips:
          mobilization_no_of_trips ?? salesOrder.mobilization_no_of_trips,
        demobilization_no_of_trips:
          demobilization_no_of_trips ?? salesOrder.demobilization_no_of_trips,
        shift: shift || salesOrder.shift,
        unit_rate: unit_rate ?? salesOrder.unit_rate,
        day_unit_rate: day_unit_rate ?? salesOrder.day_unit_rate,
        night_unit_rate: night_unit_rate ?? salesOrder.night_unit_rate,
        quantity_trips_or_days:
          quantity_trips_or_days ?? salesOrder.quantity_trips_or_days,
        is_friday_off: is_friday_off ?? salesOrder.is_friday_off,
        is_public_holiday_off:
          is_public_holiday_off ?? salesOrder.is_public_holiday_off,
        service_entry_type: service_entry_type || salesOrder.service_entry_type,
        so_status: so_status || salesOrder.so_status,
        ops_status: ops_status || salesOrder.ops_status,
        expected_mobilization_date:
          expected_mobilization_date || salesOrder.expected_mobilization_date,
        expected_demobilization_date:
          expected_demobilization_date ||
          salesOrder.expected_demobilization_date,
        recovery_remarks: recovery_remarks || salesOrder.recovery_remarks,
        normal_working_hrs_equipment:
          normal_working_hrs_equipment ??
          salesOrder.normal_working_hrs_equipment,
        normal_working_hrs_manpower:
          normal_working_hrs_manpower ?? salesOrder.normal_working_hrs_manpower,
        // ot_applicable:
        //   ot_applicable !== undefined
        //     ? ot_applicable
        //     : salesOrder.ot_applicable,
        day_ot_rate: day_ot_rate ?? salesOrder.day_ot_rate,
        night_ot_rate: night_ot_rate ?? salesOrder.night_ot_rate,
        full_ot_rate: full_ot_rate ?? salesOrder.full_ot_rate,
        recovery_is_required:
          recovery_is_required !== undefined
            ? recovery_is_required
            : salesOrder.recovery_is_required,
        recovery_cost: recovery_cost ?? salesOrder.recovery_cost,
        description_remarks:
          description_remarks || salesOrder.description_remarks,
        // status: status || salesOrder.status,
        gate_pass_location: gate_pass_location || salesOrder.gate_pass_location,
        gate_access_no: gate_access_no || salesOrder.gate_access_no,
        effective_start_date:
          effective_start_date || salesOrder.effective_start_date,
        effective_end_date: effective_end_date || salesOrder.effective_end_date,
        completionStatuses: completionStatuses || salesOrder.completionStatuses,
      };

      // // Set to "Under Approval" if changes detected
      // // Only set to Under Approval if current status is not already "Under Approval" or "Rejected"
      // if (
      //   hasChanges &&
      //   salesOrder.so_status !== "Under Approval" &&
      //   salesOrder.so_status !== "Revision Under Approval" &&
      //   salesOrder.so_status !== "Rejected"
      // ) {
      //   updatedData.so_status = salesOrder.so_status;
      //   updatedData.so_status = "Revision Under Approval";
      //   updatedData.needs_approval = true;
      //   updatedData.edited_fields = editedFields;
      //   updatedData.approval_remark =
      //     "Sales order has been modified and requires approval";
      // } else if (!hasChanges) {
      //   // If no changes, keep existing edited_fields
      //   updatedData.edited_fields = salesOrder.edited_fields;
      // } else if (
      //   hasChanges &&
      //   (salesOrder.so_status === "Under Approval" ||
      //     salesOrder.so_status === "Revision Under Approval")
      // ) {
      //   // Merge with existing edited fields
      //   updatedData.edited_fields = {
      //     ...salesOrder.edited_fields,
      //     ...editedFields,
      //   };
      // }

      // if (hasChanges) {

      //   const currentStatus = salesOrder.so_status;

      //   if (currentStatus === "Rejected") {
      //     updatedData.so_status = "Revision Rejected";
      //     updatedData.approval_remark = "Order was revised after initial rejection.";
      //   }
      //   else if (currentStatus === "Under Approval" || currentStatus === "Revision Under Approval") {
      //     updatedData.so_status = currentStatus;
      //   }
      //   else {

      //     updatedData.so_status = "Revision Under Approval";
      //   }

      //   updatedData.needs_approval = true;
      //   updatedData.edited_fields = {
      //     ...salesOrder.edited_fields,
      //     ...editedFields,
      //   };
      // }

      if (hasChanges) {
        const currentStatus = salesOrder.so_status;

        if (currentStatus === "Rejected") {
          updatedData.so_status = "Revision Under Approval";
          updatedData.ops_status = null; // ← ADD THIS
          updatedData.approval_remark =
            "Order was revised after rejection and requires re-approval.";
        } else if (currentStatus === "Revision Rejected") {
          updatedData.so_status = "Revision Under Approval";
          updatedData.ops_status = null; // ← ADD THIS
          updatedData.approval_remark =
            "Order was revised after revision rejection and requires re-approval.";
        } else if (
          currentStatus === "Under Approval" ||
          currentStatus === "Revision Under Approval"
        ) {
          updatedData.so_status = currentStatus;
        } else {
          updatedData.so_status = "Revision Under Approval";
          updatedData.ops_status = null; // ← ADD THIS
        }

        updatedData.needs_approval = true;
        updatedData.edited_fields = {
          ...salesOrder.edited_fields,
          ...editedFields,
        };
      }

      const billingFields = [
        "billing_type",
        "shift",
        "unit_rate",
        "day_unit_rate",
        "night_unit_rate",
        "day_ot_rate",
        "night_ot_rate",
        "full_ot_rate",
        "effective_start_date",
        "effective_end_date",
      ];
      const billingChanged = billingFields.some(
        (field) =>
          parsedSalesOrderData[field] !== undefined &&
          parsedSalesOrderData[field] !== salesOrder[field],
      );

      if (billingChanged) {
        updatedData.billing_history = updateBillingHistory(
          salesOrder.billing_history,
          {
            billing_type: billing_type || salesOrder.billing_type,
            shift: shift || salesOrder.shift,
            unit_rate: unit_rate ?? salesOrder.unit_rate,
            day_unit_rate: day_unit_rate ?? salesOrder.day_unit_rate,
            night_unit_rate: night_unit_rate ?? salesOrder.night_unit_rate,
            day_ot_rate: day_ot_rate ?? salesOrder.day_ot_rate,
            night_ot_rate: night_ot_rate ?? salesOrder.night_ot_rate,
            full_ot_rate: full_ot_rate ?? salesOrder.full_ot_rate,
            effective_start_date:
              effective_start_date || salesOrder.effective_start_date,
            effective_end_date:
              effective_end_date || salesOrder.effective_end_date,
          },
          salesOrder.id,
        );
      }

      // Handle file updates
      if (uploadedFiles.supportAttachment?.[0]?.filename) {
        console.log("📎 New support attachment detected");
        console.log("Current attachment:", salesOrder.supportAttachment);
        console.log("Current history:", salesOrder.supportAttachmentHistory);

        // Save current attachment to history BEFORE replacing
        if (salesOrder.supportAttachment) {
          const currentHistory = Array.isArray(
            salesOrder.supportAttachmentHistory,
          )
            ? [...salesOrder.supportAttachmentHistory]
            : [];

          console.log("Adding to history:", salesOrder.supportAttachment);

          currentHistory.push({
            filename: salesOrder.supportAttachment, // Keep the full path
            uploadedAt: new Date().toISOString(),
            uploadedBy: req.user?.id || null,
          });

          // CRITICAL: Set this in updatedData
          updatedData.supportAttachmentHistory = currentHistory;
          console.log("Updated history:", currentHistory);
        } else {
          // If no current attachment, initialize empty history
          updatedData.supportAttachmentHistory = [];
        }

        // Set the new attachment
        updatedData.supportAttachment = `/public/uploads/supportAttachmentDocuments/${uploadedFiles.supportAttachment[0].filename}`;
        console.log("New attachment set:", updatedData.supportAttachment);
      }

      if (uploadedFiles.lpoEndDateSupportAttachment?.[0]?.filename) {
        if (salesOrder.lpoEndDateSupportAttachment)
          await deleteOldFile(salesOrder.lpoEndDateSupportAttachment);
        updatedData.lpoEndDateSupportAttachment = `/public/uploads/lpoEndDateSupportAttachmentDocuments/${uploadedFiles.lpoEndDateSupportAttachment[0].filename}`;
      }

      console.log("Final updatedData before save:", updatedData);

      await salesOrder.update(updatedData);

      console.log(
        "After update - history:",
        salesOrder.supportAttachmentHistory,
      );

      if (otherCharges && Array.isArray(otherCharges)) {
        // Delete existing other charges
        await OtherChargesModel.destroy({
          where: { sales_order_id: id },
        });

        // Create new other charges if any
        if (otherCharges.length > 0) {
          const otherChargesData = otherCharges.map((charge) => ({
            type: charge.type || null,
            description: charge.description || null,
            unit_rate: charge.unit_rate ? parseFloat(charge.unit_rate) : null,
            sales_order_id: id,
          }));

          await OtherChargesModel.bulkCreate(otherChargesData);
        }
      }

      // Handle service options update if provided
      if (serviceOptions && Array.isArray(serviceOptions)) {
        // Delete existing service options
        await ServiceOptionsModel.destroy({
          where: { sales_order_id: id },
        });

        // Create new service options if any
        if (serviceOptions.length > 0) {
          const serviceOptionsData = serviceOptions.map((option) => ({
            details: option.details,
            provider: option.provider,
            target_cost_amount: option.target_cost_amount || null,
            sales_order_id: id,
          }));

          await ServiceOptionsModel.bulkCreate(serviceOptionsData);
        }
      }

      if (rentalService && Array.isArray(rentalService)) {
        await EquipmentRentalServiceModel.destroy({
          where: { sales_order_id: id },
        });

        if (rentalService.length > 0) {
          const rentalServiceData = rentalService.map((rental) => ({
            product: rental.product || null,
            unit_price: rental.unit_price || null,
            income_account: rental.income_account || null,
            sales_order_id: id,
          }));

          await EquipmentRentalServiceModel.bulkCreate(rentalServiceData);
        }
      }

      // Fetch updated sales order with service options
      const updatedSalesOrder = await SalesOrdersModel.findByPk(id, {
        include: [
          { model: JobLocationModel, as: "jobLocation" },
          { model: EmployeeModel, as: "employee" },
          { model: ProductModel, as: "subProduct" },
          { model: ServiceOptionsModel, as: "serviceOptions" },
          { model: EquipmentRentalServiceModel, as: "rentalService" },
          { model: OtherChargesModel, as: "otherCharges" },
        ],
      });

      res.status(200).json({
        message: hasChanges
          ? "Sales order updated and sent for approval"
          : "Sales order updated successfully",
        sales: updatedSalesOrder,
        needsApproval: hasChanges,
        changedFields: hasChanges ? Object.keys(editedFields) : [],
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating sales order",
        error: error.message,
      });
    }
  });
};

// DELETE
const deleteSalesOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const salesOrder = await SalesOrdersModel.findByPk(id);
    if (!salesOrder)
      return res.status(404).json({ message: "Sales order not found" });
    await salesOrder.destroy();
    res.status(200).json({ message: "Sales order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting sales order", error: error.message });
  }
};

// SERVE FILE
const serveSalesOrderFile = async (req, res) => {
  const validFolders = [
    "supportAttachmentDocuments",
    "lpoEndDateSupportAttachmentDocuments",
  ];
  const { folder, filename } = req.params;
  if (!validFolders.includes(folder))
    return res.status(400).json({ message: "Invalid folder" });

  const basePath = path.join(__dirname, "..", "..", "public", "uploads");
  const safePath = path.join(basePath, folder, filename);
  if (!safePath.startsWith(basePath))
    return res.status(403).json({ message: "Access denied" });

  try {
    const stats = await fsPromises.stat(safePath);
    if (!stats.isFile()) return res.status(404).json({ message: "Not a file" });
    if (stats.size === 0)
      return res.status(422).json({ message: "File is empty" });

    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".xls": "application/vnd.ms-excel",
    };
    const contentType = mimeTypes[ext] || "application/octet-stream";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stats.size);

    const readStream = fs.createReadStream(safePath);
    readStream.on("error", (err) => {
      if (!res.headersSent)
        res.status(500).json({ message: "Stream error", error: err.message });
    });
    readStream.pipe(res);
  } catch (error) {
    if (!res.headersSent)
      res
        .status(500)
        .json({ message: "Error serving file", error: error.message });
  }
};

// GET BY ID
const getSalesOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const salesOrderes = await SalesOrdersModel.findByPk(id, {
      include: [
        { model: JobLocationModel, as: "jobLocation" },
        { model: EmployeeModel, as: "employee" },
        { model: ProductModel, as: "subProduct" },
        { model: ServiceOptionsModel, as: "serviceOptions" },
        { model: EquipmentRentalServiceModel, as: "rentalService" },
        { model: OtherChargesModel, as: "otherCharges" },
      ],
    });
    if (!salesOrderes)
      return res.status(404).json({ message: "Sales order not found" });
    res.status(200).json(salesOrderes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving sales order", error: error.message });
  }
};

// GET ALL
const getAllSalesOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);
    const { count, rows } = await SalesOrdersModel.findAndCountAll({
      include: [
        { model: JobLocationModel, as: "jobLocation" },
        { model: EmployeeModel, as: "employee" },
        { model: ProductModel, as: "subProduct" },
        { model: ServiceOptionsModel, as: "serviceOptions" },
        { model: EquipmentRentalServiceModel, as: "rentalService" },
      ],
      offset,
      limit: parseInt(limit),
    });
    res.status(200).json({
      totalSalesOrders: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      salesOrders: rows,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving sales orders", error: error.message });
  }
};

const filterSalesOrders = async (req, res) => {
  try {
    const {
      ops_status = "All",
      so_status = "All",
      client = "",
      location = "",
      so_number = "",
      order_date_from = "",
      order_date_to = "",
      page = 1,
      limit = 8,
    } = req.query;

    const offset = (page - 1) * parseInt(limit);
    const where = {};

    if (ops_status !== "All") where.ops_status = ops_status;
    if (so_status !== "All") where.so_status = so_status;

    if (client) {
      where.client = { [Op.like]: `%${client}%` };
    }

    if (so_number) {
      where.so_number = { [Op.like]: `%${so_number}%` };
    }

    // Order date range filter
    if (order_date_from || order_date_to) {
      where.ordered_date = {};
      if (order_date_from) where.ordered_date[Op.gte] = new Date(order_date_from);
      if (order_date_to) {
        const endDate = new Date(order_date_to);
        endDate.setHours(23, 59, 59, 999);
        where.ordered_date[Op.lte] = endDate;
      }
    }

    const include = [
      {
        model: JobLocationModel,
        as: "jobLocation",
        ...(location && {
          where: {
            job_location_name: { [Op.like]: `%${location}%` },
          },
        }),
      },
      { model: EmployeeModel, as: "employee" },
      { model: ProductModel, as: "subProduct" },
      { model: ServiceOptionsModel, as: "serviceOptions" },
      { model: EquipmentRentalServiceModel, as: "rentalService" },
      { model: OtherChargesModel, as: "otherCharges" },
    ];

    const { count, rows } = await SalesOrdersModel.findAndCountAll({
      where,
      include,
      offset,
      limit: parseInt(limit),
      order: [["id", "ASC"]],
      distinct: true,
    });

    res.status(200).json({
      totalSalesOrders: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      salesOrders: rows,
    });
  } catch (error) {
    console.error("Error filtering sales orders:", error);
    res.status(500).json({ message: "Error filtering sales orders", error: error.message });
  }
};


const exportFilteredSalesOrdersToCSV = async (req, res) => {
  try {
    const {
      ops_status = "All",
      so_status = "All",
      client = "",
      location = "",
      so_number = "",
      order_date_from = "",
      order_date_to = "",
    } = req.query;

    const where = {};
    if (ops_status !== "All") where.ops_status = ops_status;
    if (so_status !== "All") where.so_status = so_status;

    if (client) {
      where.client = { [Op.like]: `%${client}%` };
    }

    if (so_number) {
      where.so_number = { [Op.like]: `%${so_number}%` };
    }

    if (order_date_from || order_date_to) {
      where.ordered_date = {};
      if (order_date_from) where.ordered_date[Op.gte] = new Date(order_date_from);
      if (order_date_to) {
        const endDate = new Date(order_date_to);
        endDate.setHours(23, 59, 59, 999);
        where.ordered_date[Op.lte] = endDate;
      }
    }

    const { rows: salesOrders } = await SalesOrdersModel.findAndCountAll({
      where,
      include: [
        {
          model: JobLocationModel,
          as: "jobLocation",
          ...(location && {
            where: {
              job_location_name: { [Op.like]: `%${location}%` },
            },
          }),
        },
        { model: EmployeeModel, as: "employee" },
        { model: ProductModel, as: "subProduct" },
        { model: ServiceOptionsModel, as: "serviceOptions" },
        { model: EquipmentRentalServiceModel, as: "rentalService" },
      ],
      distinct: true,
    });

    if (!salesOrders.length) return res.status(404).json({ message: "No data" });

    const salesOrdersIds = salesOrders.map((s) => s.id);
    const serviceOptions = await ServiceOptionsModel.findAll({
      where: { sales_order_id: salesOrdersIds },
    });
    const rentalService = await EquipmentRentalServiceModel.findAll({
      where: { sales_order_id: salesOrdersIds },
    });

    const serviceOptionsMap = {};
    serviceOptions.forEach((serve) => {
      if (!serviceOptionsMap[serve.sales_order_id]) serviceOptionsMap[serve.sales_order_id] = [];
      serviceOptionsMap[serve.sales_order_id].push({
        details: serve.details,
        provider: serve.provider,
        target_cost_amount: serve.target_cost_amount,
      });
    });

    const rentalServiceMap = {};
    rentalService.forEach((rental) => {
      if (!rentalServiceMap[rental.sales_order_id]) rentalServiceMap[rental.sales_order_id] = [];
      rentalServiceMap[rental.sales_order_id].push({
        product: rental.product,
        unit_price: rental.unit_price,
        income_account: rental.income_account,
      });
    });

    const data = salesOrders.map((o) => ({
      id: o.id,
      so_number: o.so_number,
      ordered_date: o.ordered_date,
      client: o.client,
      location: o.jobLocation?.job_location_name || "",
      sales_person: o.employee?.personalDetails?.fullNameEnglish || "",
      quotation_number: o.quotation_number,
      project_name: o.project_name,
      delivery_address: o.delivery_address,
      lpo_number: o.lpo_number,
      revised_lpo_number: o.revised_lpo_number,
      lpo_start_date: o.lpo_start_date,
      lpo_validity_start_date: o.lpo_validity_start_date,
      lpo_validity_date: o.lpo_validity_date,
      extended_lpo_validity_date: o.extended_lpo_validity_date,
      product_service_option: o.product_service_option,
      product_type_vehicle_type: o.product_type_vehicle_type,
      billing_type: o.billing_type,
      no_of_equipment: o.no_of_equipment,
      operator_type: o.operator_type,
      no_of_operator: o.no_of_operator,
      mobilization_unit_rate: o.mobilization_unit_rate,
      demobilization_unit_rate: o.demobilization_unit_rate,
      mobilization_no_of_trips: o.mobilization_no_of_trips,
      demobilization_no_of_trips: o.demobilization_no_of_trips,
      shift: o.shift,
      unit_rate: o.unit_rate,
      day_unit_rate: o.day_unit_rate,
      night_unit_rate: o.night_unit_rate,
      quantity_trips_or_days: o.quantity_trips_or_days,
      engine_hours_limit: o.engine_hours_limit,
      additional_charges: o.additional_charges,
      is_friday_off: o.is_friday_off,
      is_public_holiday_off: o.is_public_holiday_off,
      is_chargeble_demobilization: o.is_chargeble_demobilization,
      is_chargeble_active: o.is_chargeble_active,
      is_chargeble_idle_hours: o.is_chargeble_idle_hours,
      is_chargeble_public_holiday: o.is_chargeble_public_holiday,
      is_chargeble_training: o.is_chargeble_training,
      is_chargeble_under_inspection: o.is_chargeble_under_inspection,
      so_status: o.so_status,
      ops_status: o.ops_status,
      expected_mobilization_date: o.expected_mobilization_date,
      expected_demobilization_date: o.expected_demobilization_date,
      normal_working_hrs_equipment: o.normal_working_hrs_equipment,
      normal_working_hrs_manpower: o.normal_working_hrs_manpower,
      day_ot_rate: o.day_ot_rate || 0,
      night_ot_rate: o.night_ot_rate || 0,
      full_ot_rate: o.full_ot_rate || 0,
      service_entry_type: o.service_entry_type,
      recovery_is_required: o.recovery_is_required,
      recovery_cost: o.recovery_cost,
      description_remarks: o.description_remarks,
      gate_pass_location: o.gate_pass_location,
      gate_access_no: o.gate_access_no,
      effective_start_date: o.effective_start_date,
      effective_end_date: o.effective_end_date,
      serviceOptions: JSON.stringify(serviceOptionsMap[o.id] || []),
      rentalService: JSON.stringify(rentalServiceMap[o.id] || []),
    }));

    const parser = new Parser();
    const csv = parser.parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment("sales_orders.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Export failed", error: error.message });
  }
};


const exportFilteredSalesOrdersToPDF = async (req, res) => {
  try {
    const {
      ops_status = "All",
      so_status = "All",
      client = "",
      location = "",
      so_number = "",
      order_date_from = "",
      order_date_to = "",
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * parseInt(limit);
    const where = {};

    if (ops_status !== "All") where.ops_status = ops_status;
    if (so_status !== "All") where.so_status = so_status;

    if (client) {
      where.client = { [Op.like]: `%${client}%` };
    }

    if (so_number) {
      where.so_number = { [Op.like]: `%${so_number}%` };
    }

    if (order_date_from || order_date_to) {
      where.ordered_date = {};
      if (order_date_from) where.ordered_date[Op.gte] = new Date(order_date_from);
      if (order_date_to) {
        const endDate = new Date(order_date_to);
        endDate.setHours(23, 59, 59, 999);
        where.ordered_date[Op.lte] = endDate;
      }
    }

    const { rows: salesOrders } = await SalesOrdersModel.findAndCountAll({
      where,
      include: [
        {
          model: JobLocationModel,
          as: "jobLocation",
          ...(location && {
            where: {
              job_location_name: { [Op.like]: `%${location}%` },
            },
          }),
        },
        { model: EmployeeModel, as: "employee" },
        { model: ProductModel, as: "subProduct" },
        { model: ServiceOptionsModel, as: "serviceOptions" },
        { model: EquipmentRentalServiceModel, as: "rentalService" },
      ],
      offset,
      limit: parseInt(limit),
      distinct: true,
    });

    if (!salesOrders || salesOrders.length === 0) {
      return res.status(404).json({ message: "No sales orders found matching the filters" });
    }

    const salesOrdersData = salesOrders.map((order) => [
      order.so_number || "N/A",
      order.ordered_date || "N/A",
      order.client || "N/A",
      order?.jobLocation?.job_location_name || "N/A",
      order?.employee?.personalDetails?.fullNameEnglish || "N/A",
      order.quotation_number || "N/A",
      order.lpo_number || "N/A",
      order.lpo_start_date || "N/A",
      order.lpo_validity_start_date || "N/A",
      order.lpo_validity_date || "N/A",
      order.extended_lpo_validity_date || "N/A",
      order.supportAttachment || "N/A",
      order.product_service_option || "N/A",
      order.product_type_vehicle_type || "N/A",
      order.no_of_equipment || "N/A",
      order.operator_type || "N/A",
      order.no_of_operator || "N/A",
      order.project_name || "N/A",
      order.delivery_address || "N/A",
      order.unit_rate || "N/A",
      order.day_unit_rate || "N/A",
      order.night_unit_rate || "N/A",
      order.quantity_trips_or_days || "N/A",
      order.is_friday_off || "N/A",
      order.is_public_holiday_off || "N/A",
      order.service_entry_type || "N/A",
      order.shift || "N/A",
      order.so_status || "N/A",
      order.ops_status || "N/A",
      order.expected_mobilization_date || "N/A",
      order.expected_demobilization_date || "N/A",
      order.normal_working_hrs_equipment || "N/A",
      order.normal_working_hrs_manpower || "N/A",
      order.day_ot_rate || 0,
      order.night_ot_rate || 0,
      order.full_ot_rate || 0,
      order.recovery_is_required ? "Yes" : "No",
      order.description_remarks || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Sales Orders Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: Array(38).fill("*"),
            body: [
              [
                "SO Number",
                "Ordered Date",
                "Client",
                "Location",
                "Sales Person",
                "Quotation Number",
                "LPO Number",
                "LPO Start Date",
                "LPO Validity Start Date",
                "LPO Validity Date",
                "Extended LPO Validity Date",
                "Support Document",
                "Product Service Option",
                "Product Type (Vehicle)",
                "No. of Equipment",
                "Operator Type",
                "No. of Operator",
                "Project Name",
                "Delivery Address",
                "Unit Rate",
                "Day Unit Rate",
                "Night Unit Rate",
                "Quantity Trips / Days",
                "Is Friday Off",
                "Is Public Day Off",
                "Service Entry Type",
                "Shift",
                "SO Status",
                "OPS Status",
                "Expected Mobilization Date",
                "Expected Demobilization Date",
                "Normal Working Hrs (Equipment)",
                "Normal Working Hrs (Manpower)",
                "Day OT Rate",
                "Night OT Rate",
                "Full OT Rate",
                "Recovery Is Required",
                "Description/Remarks",
              ],
              ...salesOrdersData,
            ],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: "center", margin: [0, 0, 0, 20] },
        body: { fontSize: 8, bold: true },
      },
      defaultStyle: { fontSize: 8 },
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
    res.attachment("sales_orders_data.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting sales orders to PDF:", error);
    res.status(500).json({ message: "Error exporting sales orders to PDF", error: error.message });
  }
};

// const filterSalesOrders = async (req, res) => {
//   try {
//     const {
//       ops_status = "All",
//       so_status = "All",
//       client = "",
//       location = "",
//       page = 1,
//       limit = 8, // ✅ Changed default to 8 items per page
//     } = req.query;

//     const offset = (page - 1) * parseInt(limit);
//     const where = {};

//     // ✅ FIX: Proper status filters
//     if (ops_status !== "All") where.ops_status = ops_status;
//     if (so_status !== "All") where.so_status = so_status;

//     // ✅ FIX: Add client filter with LIKE operator for partial matching
//     if (client) {
//       where.client = {
//         [require("sequelize").Op.like]: `%${client}%`,
//       };
//     }

//     const include = [
//       {
//         model: JobLocationModel,
//         as: "jobLocation",
//         // ✅ FIX: Add location filter with LIKE operator
//         ...(location && {
//           where: {
//             job_location_name: {
//               [require("sequelize").Op.like]: `%${location}%`,
//             },
//           },
//         }),
//       },
//       { model: EmployeeModel, as: "employee" },
//       { model: ProductModel, as: "subProduct" },
//       { model: ServiceOptionsModel, as: "serviceOptions" },
//       { model: EquipmentRentalServiceModel, as: "rentalService" },
//       { model: OtherChargesModel, as: "otherCharges" },
//     ];

//     // ✅ FIX: Proper pagination with correct limit and offset
//     const { count, rows } = await SalesOrdersModel.findAndCountAll({
//       where,
//       include,
//       offset,
//       limit: parseInt(limit),
//       order: [["id", "ASC"]], // ✅ Add consistent ordering
//       distinct: true, // ✅ Important for accurate count with includes
//     });

//     // ✅ FIX: Return proper pagination metadata
//     res.status(200).json({
//       totalSalesOrders: count,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(count / parseInt(limit)),
//       salesOrders: rows,
//     });
//   } catch (error) {
//     console.error("Error filtering sales orders:", error);
//     res.status(500).json({
//       message: "Error filtering sales orders",
//       error: error.message,
//     });
//   }
// };

// // const filterSalesOrders = async (req, res) => {
// //   try {
// //     const {
// //       ops_status = "All",
// //       so_status = "All",
// //       client = "",
// //       location = "",
// //       page = 1,
// //       limit = 10,
// //     } = req.query;

// //     const offset = (page - 1) * parseInt(limit);
// //     const where = {};

// //     if (ops_status !== "All") where.ops_status = ops_status;
// //     if (so_status !== "All") where.so_status = so_status;

// //     // Add client filter
// //     if (client) {
// //       where.client = {
// //         [require("sequelize").Op.like]: `%${client}%`,
// //       };
// //     }

// //     const include = [
// //       {
// //         model: JobLocationModel,
// //         as: "jobLocation",
// //         // Add location filter
// //         ...(location && {
// //           where: {
// //             job_location_name: {
// //               [require("sequelize").Op.like]: `%${location}%`,
// //             },
// //           },
// //         }),
// //       },
// //       { model: EmployeeModel, as: "employee" },
// //       { model: ProductModel, as: "subProduct" },
// //       { model: ServiceOptionsModel, as: "serviceOptions" },
// //       { model: EquipmentRentalServiceModel, as: "rentalService" },
// //     ];

// //     const { count, rows } = await SalesOrdersModel.findAndCountAll({
// //       where,
// //       include,
// //       offset,
// //       limit: parseInt(limit),
// //     });

// //     res.status(200).json({
// //       totalSalesOrders: count,
// //       currentPage: parseInt(page),
// //       totalPages: Math.ceil(count / limit),
// //       salesOrders: rows,
// //     });
// //   } catch (error) {
// //     res
// //       .status(500)
// //       .json({ message: "Error filtering sales orders", error: error.message });
// //   }
// // };

// // EXPORT CSV
// const exportFilteredSalesOrdersToCSV = async (req, res) => {
//   try {
//     const { ops_status = "All", so_status = "All" } = req.query;
//     const where = {};
//     if (ops_status !== "All") where.ops_status = ops_status;
//     if (so_status !== "All") where.so_status = so_status;

//     const { rows: salesOrders } = await SalesOrdersModel.findAndCountAll({
//       where,
//       include: [
//         { model: JobLocationModel, as: "jobLocation" },
//         { model: EmployeeModel, as: "employee" },
//         { model: ProductModel, as: "subProduct" },
//         { model: ServiceOptionsModel, as: "serviceOptions" },
//         { model: EquipmentRentalServiceModel, as: "rentalService" },
//       ],
//     });

//     if (!salesOrders.length)
//       return res.status(404).json({ message: "No data" });

//     const salesOrdersIds = salesOrders.map((s) => s.id);
//     const serviceOptions = await ServiceOptionsModel.findAll({
//       where: { sales_order_id: salesOrdersIds },
//     });
//     const rentalService = await EquipmentRentalServiceModel.findAll({
//       where: { sales_order_id: salesOrdersIds },
//     });

//     const serviceOptionsMap = {};
//     serviceOptions.forEach((serve) => {
//       if (!serviceOptionsMap[serve.sales_order_id])
//         serviceOptionsMap[serve.sales_order_id] = [];
//       serviceOptionsMap[serve.sales_order_id].push({
//         details: serve.details,
//         provider: serve.provider,
//         target_cost_amount: serve.target_cost_amount,
//       });
//     });

//     const rentalServiceMap = {};
//     rentalService.forEach((rental) => {
//       if (!rentalServiceMap[rental.sales_order_id])
//         rentalServiceMap[rental.sales_order_id] = [];
//       rentalServiceMap[rental.sales_order_id].push({
//         product: rental.product,
//         unit_price: rental.unit_price,
//         income_account: rental.income_account,
//       });
//     });

//     const data = salesOrders.map((o) => ({
//       id: o.id,
//       ordered_date: o.ordered_date,
//       client: o.client,
//       location: o.jobLocation?.job_location_name || "",
//       sales_person: o.employee?.personalDetails?.fullNameEnglish || "",
//       quotation_number: o.quotation_number,
//       project_name: o.project_name,
//       delivery_address: o.delivery_address,
//       lpo_number: o.lpo_number,
//       revised_lpo_number: o.revised_lpo_number,
//       lpo_start_date: o.lpo_start_date,
//       lpo_validity_start_date: o.lpo_validity_start_date,
//       lpo_validity_date: o.lpo_validity_date,
//       extended_lpo_validity_date: o.extended_lpo_validity_date,
//       product_service_option: o.product_service_option,
//       product_type_vehicle_type: o.product_type_vehicle_type,
//       billing_type: o.billing_type,
//       no_of_equipment: o.no_of_equipment,
//       operator_type: o.operator_type,
//       no_of_operator: o.no_of_operator,
//       mobilization_unit_rate: o.mobilization_unit_rate,
//       demobilization_unit_rate: o.demobilization_unit_rate,
//       mobilization_no_of_trips: o.mobilization_no_of_trips,
//       demobilization_no_of_trips: o.demobilization_no_of_trips,
//       other_charges: o.other_charges,
//       other_charges_description: o.other_charges_description,
//       other_charges_unit_rate: o.other_charges_unit_rate,
//       shift: o.shift,
//       unit_rate: o.unit_rate,
//       day_unit_rate: o.day_unit_rate,
//       night_unit_rate: o.night_unit_rate,
//       quantity_trips_or_days: o.quantity_trips_or_days,
//       engine_hours_limit: o.engine_hours_limit,
//       additional_charges: o.additional_charges,
//       is_friday_off: o.is_friday_off,
//       is_public_holiday_off: o.is_public_holiday_off,
//       is_chargeble_mobilization: o.is_chargeble_mobilization,
//       is_chargeble_demobilization: o.is_chargeble_demobilization,
//       is_chargeble_active: o.is_chargeble_active,
//       is_chargeble_idle_hours: o.is_chargeble_idle_hours,
//       is_chargeble_public_holiday: o.is_chargeble_public_holiday,
//       is_chargeble_training: o.is_chargeble_training,
//       is_chargeble_under_inspection: o.is_chargeble_under_inspection,
//       so_status: o.so_status,
//       ops_status: o.ops_status,
//       expected_mobilization_date: o.expected_mobilization_date,
//       expected_demobilization_date: o.expected_demobilization_date,
//       normal_working_hrs_equipment: o.normal_working_hrs_equipment,
//       normal_working_hrs_manpower: o.normal_working_hrs_manpower,
//       // ot_applicable: o.ot_applicable,
//       // ot_rate_qar: o.ot_rate_qar,
//       day_ot_rate: o.day_ot_rate || 0,
//       night_ot_rate: o.night_ot_rate || 0,
//       full_ot_rate: o.full_ot_rate || 0,
//       service_entry_type: order.service_entry_type,
//       recovery_is_required: o.recovery_is_required,
//       recovery_cost: o.recovery_cost,
//       description_remarks: o.description_remarks,
//       // status: o.status,
//       gate_pass_location: o.gate_pass_location,
//       gate_access_no: o.gate_access_no,
//       effective_start_date: o.effective_start_date,
//       effective_end_date: o.effective_end_date,
//       serviceOptions: JSON.stringify(serviceOptionsMap[o.id] || []),
//       rentalService: JSON.stringify(rentalServiceMap[o.id] || []),
//     }));

//     const parser = new Parser();
//     const csv = parser.parse(data);
//     res.header("Content-Type", "text/csv");
//     res.attachment("sales_orders.csv");
//     res.send(csv);
//   } catch (error) {
//     res.status(500).json({ message: "Export failed", error: error.message });
//   }
// };

// const exportFilteredSalesOrdersToPDF = async (req, res) => {
//   try {
//     const {
//       ops_status = "All",
//       so_status = "All",
//       page = 1,
//       limit = 10,
//     } = req.query;
//     const offset = (page - 1) * parseInt(limit);

//     const where = {};
//     if (ops_status !== "All") {
//       where.ops_status = ops_status;
//     }
//     if (so_status !== "All") {
//       where.so_status = so_status;
//     }

//     const { rows: salesOrders } = await SalesOrdersModel.findAndCountAll({
//       where,
//       include: [
//         { model: JobLocationModel, as: "jobLocation" },
//         { model: EmployeeModel, as: "employee" },
//         { model: ProductModel, as: "subProduct" },
//         { model: ServiceOptionsModel, as: "serviceOptions" },
//         { model: EquipmentRentalServiceModel, as: "rentalService" },
//       ],
//       offset,
//       limit: parseInt(limit),
//     });

//     if (!salesOrders || salesOrders.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No sales orders found matching the filters" });
//     }

//     const salesOrdersData = salesOrders.map((order) => [
//       order.id || "N/A",
//       order.ordered_date || "N/A",
//       order.client || "N/A",
//       order?.jobLocation?.job_location_id || "N/A",
//       order?.employee?.id || "N/A",
//       order.quotation_number || "N/A",
//       order.lpo_number || "N/A",
//       order.lpo_start_date || "N/A",
//       order.lpo_validity_start_date || "N/A",
//       order.lpo_validity_date || "N/A",
//       order.extended_lpo_validity_date || "N/A",
//       order.supportAttachment || "N/A",
//       order.product_service_option || "N/A",
//       order.product_type_vehicle_type || "N/A",
//       order.no_of_equipment || "N/A",
//       order.operator_type || "N/A",
//       order.no_of_operator || "N/A",
//       order.project_name || "N/A",
//       order.delivery_address || "N/A",
//       order.unit_rate || "N/A",
//       order.day_unit_rate || "N/A",
//       order.night_unit_rate || "N/A",
//       order.quantity_trips_or_days || "N/A",
//       order.is_friday_off || "N/A",
//       order.is_public_holiday_off || "N/A",
//       order.service_entry_type || "N/A",
//       // order.sub_product || "N/A",
//       order.shift || "N/A",
//       order.so_status || "N/A",
//       order.expected_mobilization_date || "N/A",
//       order.expected_demobilization_date || "N/A",
//       order.normal_working_hrs_equipment || "N/A",
//       order.normal_working_hrs_manpower || "N/A",
//       // order.ot_applicable ? "Yes" : "No",
//       // order.ot_rate_qar || "N/A",
//       order.day_ot_rate || 0,
//       order.night_ot_rate || 0,
//       order.full_ot_rate || 0,
//       order.recovery_is_required ? "Yes" : "No",
//       order.description_remarks || "N/A",
//       order.ops_status || "N/A",
//     ]);

//     const docDefinition = {
//       content: [
//         { text: "Sales Orders Data", style: "header" },
//         {
//           table: {
//             headerRows: 1,
//             widths: Array(37).fill("*"),
//             body: [
//               [
//                 "Sales Order ID",
//                 "Ordered Date",
//                 "Client",
//                 "Location ID",
//                 "Sales Person ID",
//                 "Quotation Number",
//                 "LPO Number",
//                 "LPO Start Date",
//                 "LPO Validity Start Date",
//                 "LPO Validity Date",
//                 "Extended LPO Validity Date",
//                 "Support Document",
//                 "Product Service Option",
//                 "Product Type (Vehicle)",
//                 "No. of Equipment",
//                 "Operator Type",
//                 "No. of Operator",
//                 "Project Name",
//                 "Delivery Address",
//                 "Unit Rate",
//                 "Day Unit Rate",
//                 "Night Unit Rate",
//                 "Quantity Trips / Days",
//                 "Is Friday Off",
//                 "Is Public Day Off",
//                 "Service Entry Type",
//                 // "Sub Product",
//                 "Shift",
//                 "SO Status",
//                 "Expected Mobilization Date",
//                 "Expected Demobilization Date",
//                 "Normal Working Hrs (Equipment)",
//                 "Normal Working Hrs (Manpower)",
//                 "OT Applicable",
//                 "OT Rate (QAR)",
//                 "Recovery Is Required",
//                 "Description/Remarks",
//                 "OPS Status",
//               ],
//               ...salesOrdersData,
//             ],
//           },
//         },
//       ],
//       styles: {
//         header: {
//           fontSize: 18,
//           bold: true,
//           alignment: "center",
//           margin: [0, 0, 0, 20],
//         },
//         body: {
//           fontSize: 8,
//           bold: true,
//         },
//       },
//       defaultStyle: {
//         fontSize: 8,
//       },
//     };

//     const printer = new PdfPrinter({
//       Roboto: {
//         normal: path.join(sourceDir, "Roboto-Regular.ttf"),
//         bold: path.join(sourceDir, "Roboto-Medium.ttf"),
//         italics: path.join(sourceDir, "Roboto-Italic.ttf"),
//         bolditalics: path.join(sourceDir, "Roboto-MediumItalic.ttf"),
//       },
//     });

//     const pdfDoc = printer.createPdfKitDocument(docDefinition);

//     res.header("Content-Type", "application/pdf");
//     res.attachment("sales_orders_data.pdf");
//     pdfDoc.pipe(res);
//     pdfDoc.end();
//   } catch (error) {
//     console.error("Error exporting sales orders to PDF:", error);
//     res.status(500).json({
//       message: "Error exporting sales orders to PDF",
//       error: error.message,
//     });
//   }
// };

const getSalesOrdersWithExpiringLPO = async (req, res) => {
  try {
    const { daysAhead = 180 } = req.query; // Default to 6 months (180 days)

    const salesOrders = await SalesOrdersModel.findAll({
      include: [
        {
          model: JobLocationModel,
          as: "jobLocation",
        },
        {
          model: EmployeeModel,
          as: "employee",
          attributes: ["id", "personalDetails"],
        },
        { model: ProductModel, as: "subProduct" },
        { model: ServiceOptionsModel, as: "serviceOptions" },
        { model: EquipmentRentalServiceModel, as: "rentalService" },
      ],
    });

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(daysAhead));

    const ordersWithExpiringLPO = salesOrders
      .filter((order) => {
        // Check LPO Validity Date expiry
        const lpoValidityDate = order.lpo_validity_date
          ? new Date(order.lpo_validity_date)
          : null;

        // Check Extended LPO Validity Date expiry
        const extendedLpoValidityDate = order.extended_lpo_validity_date
          ? new Date(order.extended_lpo_validity_date)
          : null;

        const isLpoValidityExpiring =
          lpoValidityDate &&
          lpoValidityDate >= today &&
          lpoValidityDate <= futureDate;

        const isExtendedLpoExpiring =
          extendedLpoValidityDate &&
          extendedLpoValidityDate >= today &&
          extendedLpoValidityDate <= futureDate;

        return isLpoValidityExpiring || isExtendedLpoExpiring;
      })
      .map((order) => {
        const lpoValidityDate = order.lpo_validity_date
          ? new Date(order.lpo_validity_date)
          : null;
        const extendedLpoValidityDate = order.extended_lpo_validity_date
          ? new Date(order.extended_lpo_validity_date)
          : null;

        // Calculate days left
        const lpoValidityDaysLeft = lpoValidityDate
          ? Math.ceil((lpoValidityDate - today) / (1000 * 60 * 60 * 24))
          : null;
        const extendedLpoDaysLeft = extendedLpoValidityDate
          ? Math.ceil((extendedLpoValidityDate - today) / (1000 * 60 * 60 * 24))
          : null;

        // Determine urgency status
        // let status = "Nearing Expiry";
        const minDaysLeft = Math.min(
          lpoValidityDaysLeft !== null ? lpoValidityDaysLeft : Infinity,
          extendedLpoDaysLeft !== null ? extendedLpoDaysLeft : Infinity,
        );

        // if (minDaysLeft <= 30) {
        //   status = "Urgent";
        // } else if (minDaysLeft <= 90) {
        //   status = "Nearing Expiry";
        // }

        // Check which dates are expiring
        const hasLpoValidityExpiring =
          lpoValidityDate &&
          lpoValidityDate >= today &&
          lpoValidityDate <= futureDate;
        const hasExtendedLpoExpiring =
          extendedLpoValidityDate &&
          extendedLpoValidityDate >= today &&
          extendedLpoValidityDate <= futureDate;

        return {
          id: order.id,
          client: order.client,
          lpoNumber: order.lpo_number,
          quotationNumber: order.quotation_number,
          lpoValidityDate: lpoValidityDate
            ? lpoValidityDate.toISOString().split("T")[0]
            : null,
          extendedLpoValidityDate: extendedLpoValidityDate
            ? extendedLpoValidityDate.toISOString().split("T")[0]
            : null,
          lpoValidityDaysLeft,
          extendedLpoDaysLeft,
          minDaysLeft: minDaysLeft === Infinity ? null : minDaysLeft,
          // status,
          hasLpoValidityExpiring,
          hasExtendedLpoExpiring,
          SOStatus: order.so_status,
          OPSStatus: order.ops_status,
          location: order.jobLocation?.job_location_name || "N/A",
          salesPerson:
            order.employee?.personalDetails?.fullNameEnglish || "N/A",
        };
      });

    // Sort by urgency (least days left first)
    ordersWithExpiringLPO.sort((a, b) => {
      if (a.minDaysLeft === null) return 1;
      if (b.minDaysLeft === null) return -1;
      return a.minDaysLeft - b.minDaysLeft;
    });

    // Calculate summary statistics
    const summary = {
      // urgent: ordersWithExpiringLPO.filter((order) => order.status === "Urgent")
      //   .length,
      // nearingExpiry: ordersWithExpiringLPO.filter(
      //   (order) => order.status === "Nearing Expiry"
      // ).length,
      lpoValidityExpiring: ordersWithExpiringLPO.filter(
        (order) => order.hasLpoValidityExpiring,
      ).length,
      extendedLpoExpiring: ordersWithExpiringLPO.filter(
        (order) => order.hasExtendedLpoExpiring,
      ).length,
    };

    res.status(200).json({
      totalCount: ordersWithExpiringLPO.length,
      salesOrders: ordersWithExpiringLPO,
      summary,
    });
  } catch (error) {
    console.error("Error retrieving sales orders with expiring LPO:", error);
    res.status(500).json({
      message: "Error retrieving sales orders with expiring LPO",
      error: error.message,
    });
  }
};

const approveSalesOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const salesOrder = await SalesOrdersModel.findByPk(id);

    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    const newStatus = "Approved";

    await salesOrder.update({
      so_status: newStatus,
      needs_approval: false,
      approval_remark: null,
      // edited_fields: {},
      // so_status: null,
    });

    res.status(200).json({
      message: "Sales order approved successfully",
      salesOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error approving sales order",
      error: error.message,
    });
  }
};

const rejectSalesOrder = async (req, res) => {
  const { id } = req.params;
  const { rejection_reason } = req.body;

  try {
    const salesOrder = await SalesOrdersModel.findByPk(id);

    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }
    let newStatus = "Rejected";
    if (salesOrder.so_status === "Revision Under Approval") {
      newStatus = "Revision Rejected";
    }

    await salesOrder.update({
      // so_status: "Rejected",
      so_status: newStatus,
      needs_approval: false,
      approval_remark: rejection_reason || salesOrder.approval_remark,
      // edited_fields: {},
    });

    //   res.status(200).json({
    //     message: "Sales order rejected successfully",
    //     salesOrder,
    //   });
    // } catch (error) {
    //   res.status(500).json({
    //     message: "Error rejecting sales order",
    //     error: error.message,
    //   });
    // }
    res
      .status(200)
      .json({ message: `Sales order ${newStatus} successfully`, salesOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalesOrderAttachmentHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const salesOrder = await SalesOrdersModel.findByPk(id, {
      attributes: ["id", "supportAttachment", "supportAttachmentHistory"],
    });

    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    const history = salesOrder.supportAttachmentHistory || [];

    // Add current attachment to the response if exists
    const response = {
      currentAttachment: salesOrder.supportAttachment,
      history: history.map((item) => ({
        filename: item.filename,
        uploadedAt: item.uploadedAt,
        uploadedBy: item.uploadedBy,
        url: item.filename,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving attachment history",
      error: error.message,
    });
  }
};

// Add Billing History Record
const addBillingHistoryRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const salesOrder = await SalesOrdersModel.findByPk(id);
    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    const {
      billing_type,
      shift,
      unit_rate,
      day_unit_rate,
      night_unit_rate,
      effective_start_date,
      effective_end_date,
    } = req.body;

    // Validate required fields
    if (!billing_type || !shift || !effective_start_date) {
      return res.status(400).json({
        message: "Billing type, shift, and effective start date are required",
      });
    }

    // Validate rates based on shift
    if (shift === "Day and Night") {
      if (!day_unit_rate || !night_unit_rate) {
        return res.status(400).json({
          message:
            "Both day and night unit rates are required for Day and Night shift",
        });
      }
    } else {
      if (!unit_rate) {
        return res.status(400).json({
          message: "Unit rate is required",
        });
      }
    }

    const currentHistory = salesOrder.billing_history || [];

    const newRecord = {
      id: `billing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      billing_type,
      shift,
      unit_rate: unit_rate || null,
      day_unit_rate: day_unit_rate || null,
      night_unit_rate: night_unit_rate || null,
      effective_start_date,
      effective_end_date: effective_end_date || null,
      created_at: new Date().toISOString(),
      created_by: req.user?.id || null,
    };

    const updatedHistory = [...currentHistory, newRecord];

    await salesOrder.update({
      billing_history: updatedHistory,
    });

    res.status(201).json({
      message: "Billing history record added successfully",
      record: newRecord,
      billing_history: updatedHistory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding billing history record",
      error: error.message,
    });
  }
};

const updateBillingHistoryRecord = async (req, res) => {
  const { id, recordId } = req.params;

  try {
    const salesOrder = await SalesOrdersModel.findByPk(id);
    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    const {
      billing_type,
      shift,
      unit_rate,
      day_unit_rate,
      night_unit_rate,
      day_ot_rate, // ADD THIS
      night_ot_rate, // ADD THIS
      full_ot_rate,
      effective_start_date,
      effective_end_date,
    } = req.body;

    if (!billing_type || !shift || !effective_start_date) {
      return res.status(400).json({
        message: "Billing type, shift, and effective start date are required",
      });
    }

    const currentHistory = salesOrder.billing_history || [];

    // Sort chronologically
    const sortedHistory = [...currentHistory].sort(
      (a, b) =>
        new Date(a.effective_start_date) - new Date(b.effective_start_date),
    );

    const recordIndex = sortedHistory.findIndex(
      (record) => record.id === recordId,
    );

    if (recordIndex === -1) {
      return res
        .status(404)
        .json({ message: "Billing history record not found" });
    }

    const updatedRecord = {
      ...sortedHistory[recordIndex],
      billing_type,
      shift,
      unit_rate: unit_rate || null,
      day_unit_rate: day_unit_rate || null,
      night_unit_rate: night_unit_rate || null,
      day_ot_rate:
        day_ot_rate !== undefined
          ? day_ot_rate
          : sortedHistory[recordIndex].day_ot_rate,
      night_ot_rate:
        night_ot_rate !== undefined
          ? night_ot_rate
          : sortedHistory[recordIndex].night_ot_rate,
      full_ot_rate:
        full_ot_rate !== undefined
          ? full_ot_rate
          : sortedHistory[recordIndex].full_ot_rate,
      effective_start_date,
      effective_end_date: effective_end_date || null,
      updated_at: new Date().toISOString(),
      updated_by: req.user?.id || null,
    };

    // ✅ KEY FIX: If effective_start_date changed, update PREVIOUS record's effective_end_date
    let updatedSortedHistory = [
      ...sortedHistory.slice(0, recordIndex),
      updatedRecord,
      ...sortedHistory.slice(recordIndex + 1),
    ];

    if (recordIndex > 0) {
      const previousRecord = updatedSortedHistory[recordIndex - 1];

      // Previous record's end date = current record's start date - 1 day
      const newStartDate = new Date(effective_start_date);
      const prevEndDate = new Date(newStartDate);
      prevEndDate.setDate(prevEndDate.getDate() - 1);
      const prevEndDateStr = prevEndDate.toISOString().split("T")[0];

      updatedSortedHistory[recordIndex - 1] = {
        ...previousRecord,
        effective_end_date: prevEndDateStr,
        updated_at: new Date().toISOString(),
      };
    }

    await salesOrder.update({
      billing_history: updatedSortedHistory,
    });

    res.status(200).json({
      message: "Billing history record updated successfully",
      record: updatedRecord,
      billing_history: updatedSortedHistory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating billing history record",
      error: error.message,
    });
  }
};

// Delete Billing History Record
const deleteBillingHistoryRecord = async (req, res) => {
  const { id, recordId } = req.params;

  try {
    const salesOrder = await SalesOrdersModel.findByPk(id);
    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    const currentHistory = salesOrder.billing_history || [];
    const recordIndex = currentHistory.findIndex(
      (record) => record.id === recordId,
    );

    if (recordIndex === -1) {
      return res
        .status(404)
        .json({ message: "Billing history record not found" });
    }

    const updatedHistory = [
      ...currentHistory.slice(0, recordIndex),
      ...currentHistory.slice(recordIndex + 1),
    ];

    await salesOrder.update({
      billing_history: updatedHistory,
    });

    res.status(200).json({
      message: "Billing history record deleted successfully",
      billing_history: updatedHistory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting billing history record",
      error: error.message,
    });
  }
};

// Get Billing History
const getBillingHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const salesOrder = await SalesOrdersModel.findByPk(id, {
      attributes: ["id", "billing_history"],
    });

    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    res.status(200).json({
      billing_history: salesOrder.billing_history || [],
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving billing history",
      error: error.message,
    });
  }
};

// CLOSE SALES ORDER
const closeSalesOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const salesOrder = await SalesOrdersModel.findByPk(id);

    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    if (
      salesOrder.so_status !== "Rejected" &&
      salesOrder.so_status !== "Approved"
    ) {
      return res.status(400).json({
        message: "Only Rejected and Approved sales orders can be closed.",
      });
    }

    await salesOrder.update({
      so_status: "Closed",
      needs_approval: false,
    });

    res.status(200).json({
      message: "Sales order closed successfully",
      salesOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error closing sales order",
      error: error.message,
    });
  }
};

const completeRevision = async (req, res) => {
  const { id } = req.params;

  try {
    const salesOrder = await SalesOrdersModel.findByPk(id);

    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    // Clear edited_fields to remove the "Change in SO" indicator
    await salesOrder.update({
      edited_fields: {},
    });

    res.status(200).json({
      message: "Revision completed successfully",
      salesOrder: await SalesOrdersModel.findByPk(id, {
        include: [
          { model: JobLocationModel, as: "jobLocation" },
          { model: EmployeeModel, as: "employee" },
          { model: ProductModel, as: "subProduct" },
          { model: ServiceOptionsModel, as: "serviceOptions" },
          { model: EquipmentRentalServiceModel, as: "rentalService" },
          { model: OtherChargesModel, as: "otherCharges" },
        ],
      }),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error completing revision",
      error: error.message,
    });
  }
};

// Get sales orders with completed revisions
const getRevisionCompleteSalesOrders = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count, rows } = await SalesOrdersModel.findAndCountAll({
      where: {
        [Op.or]: [
          { so_status: "Approved" },
          { so_status: "Revision Rejected" },
        ],

        [Op.or]: [
          { edited_fields: null },
          { edited_fields: {} },
          sequelize.literal(`JSON_LENGTH(COALESCE(edited_fields, '{}')) = 0`),
        ],
      },
      include: [
        { model: JobLocationModel, as: "jobLocation" },
        { model: EmployeeModel, as: "employee" },
        { model: ProductModel, as: "subProduct" },
        { model: ServiceOptionsModel, as: "serviceOptions" },
        { model: EquipmentRentalServiceModel, as: "rentalService" },
        { model: OtherChargesModel, as: "otherCharges" },
      ],
      offset,
      limit: parseInt(limit),
      order: [["updatedAt", "DESC"]],
      distinct: true,
    });

    res.status(200).json({
      totalSalesOrders: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      salesOrders: rows,
      filterType: "revision-complete",
    });
  } catch (error) {
    console.error("Error filtering revision complete sales orders:", error);
    res.status(500).json({
      message: "Error filtering revision complete sales orders",
      error: error.message,
    });
  }
};

// Get sales orders with incomplete revisions
const getRevisionIncompleteSalesOrders = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count, rows } = await SalesOrdersModel.findAndCountAll({
      where: sequelize.literal(`
        edited_fields IS NOT NULL 
        AND JSON_LENGTH(edited_fields) > 0
      `),
      include: [
        { model: JobLocationModel, as: "jobLocation" },
        { model: EmployeeModel, as: "employee" },
        { model: ProductModel, as: "subProduct" },
        { model: ServiceOptionsModel, as: "serviceOptions" },
        { model: EquipmentRentalServiceModel, as: "rentalService" },
        { model: OtherChargesModel, as: "otherCharges" },
      ],
      offset,
      limit: parseInt(limit),
      order: [["updatedAt", "DESC"]],
      distinct: true,
    });

    res.status(200).json({
      totalSalesOrders: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      salesOrders: rows,
      filterType: "revision-incomplete",
    });
  } catch (error) {
    console.error("Error filtering revision incomplete sales orders:", error);
    res.status(500).json({
      message: "Error filtering revision incomplete sales orders",
      error: error.message,
    });
  }
};

// Get sales orders with no revisions (initially created)
const getNoRevisionsSalesOrders = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count, rows } = await SalesOrdersModel.findAndCountAll({
      where: {
        // Never went through revision process
        so_status: {
          [Op.notIn]: [
            "Approved",
            "Revision Rejected",
            "Revision Under Approval",
          ],
        },
        // edited_fields is empty or null (never had changes)
        [Op.or]: [
          { edited_fields: null },
          { edited_fields: {} },
          sequelize.literal(`JSON_LENGTH(COALESCE(edited_fields, '{}')) = 0`),
        ],
      },
      include: [
        { model: JobLocationModel, as: "jobLocation" },
        { model: EmployeeModel, as: "employee" },
        { model: ProductModel, as: "subProduct" },
        { model: ServiceOptionsModel, as: "serviceOptions" },
        { model: EquipmentRentalServiceModel, as: "rentalService" },
        { model: OtherChargesModel, as: "otherCharges" },
      ],
      offset,
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    res.status(200).json({
      totalSalesOrders: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      salesOrders: rows,
      filterType: "no-revisions",
    });
  } catch (error) {
    console.error("Error filtering no revisions sales orders:", error);
    res.status(500).json({
      message: "Error filtering no revisions sales orders",
      error: error.message,
    });
  }
};

const getSalesPersonLPOReminders = async (req, res) => {
  try {
    const salesPersonId = req.user.id; // Assuming user ID is sales person ID

    const salesOrders = await SalesOrdersModel.findAll({
      include: [
        { model: JobLocationModel, as: "jobLocation" },
        { model: EmployeeModel, as: "employee" },
      ],
      where: {
        // status: "Active",
        so_status: ["Approved", "Revision Under Approval"],
        sales_person_id: salesPersonId,
      },
    });

    const allReminders = [];
    const now = new Date();

    for (const order of salesOrders) {
      const reminderInfo = await checkAndHandleLPOReminders(order);

      if (reminderInfo.hasReminders) {
        allReminders.push({
          salesOrderId: order.id,
          soNumber: order.so_number,
          client: order.client,
          salesPerson: order.employee?.personalDetails?.fullNameEnglish,
          location: order.jobLocation?.job_location_name,
          reminders: reminderInfo.reminders,
          requiresAction: reminderInfo.requiresAction,
          managerNotified: order.manager_notified,
          lastReminderDate:
            order.no_lpo_last_reminder_date ||
            order.lpo_expired_last_reminder_date,
        });
      }
    }

    // Sort by urgency (no remarks first, then oldest first)
    allReminders.sort((a, b) => {
      // First prioritize orders without any remarks
      const aHasRemarks =
        a.reminders.some((r) => r.type === "no_lpo" && a.no_lpo_remarks) ||
        a.reminders.some(
          (r) => r.type === "lpo_expired" && a.lpo_expired_remarks,
        );
      const bHasRemarks =
        b.reminders.some((r) => r.type === "no_lpo" && b.no_lpo_remarks) ||
        b.reminders.some(
          (r) => r.type === "lpo_expired" && b.lpo_expired_remarks,
        );

      if (aHasRemarks !== bHasRemarks) {
        return aHasRemarks ? 1 : -1;
      }

      // Then by last reminder date (oldest first)
      return (
        new Date(a.lastReminderDate || 0) - new Date(b.lastReminderDate || 0)
      );
    });

    res.status(200).json({
      message: "LPO reminders retrieved successfully",
      totalReminders: allReminders.length,
      reminders: allReminders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving LPO reminders",
      error: error.message,
    });
  }
};

// Save or update draft
const saveSalesOrderDraft = async (req, res) => {
  try {
    const { draftId, currentStep, draftData } = req.body;
    const userId = req.user.uid;

    console.log("💾 Saving draft:", { draftId, userId, currentStep });

    if (draftId) {
      // Update existing draft
      const existingDraft = await SalesOrdersModel.findOne({
        where: {
          id: draftId,
          created_by: userId,
          is_draft: true,
        },
      });

      if (!existingDraft) {
        return res.status(404).json({ message: "Draft not found" });
      }

      // Update only draft_data and timestamp, don't validate other fields
      await existingDraft.update(
        {
          draft_data: {
            ...draftData,
            currentStep,
          },
          last_auto_saved_at: new Date(),
          so_status: "Draft", // ✅ Set status to Draft
          // Update these if available in draftData
          ...(draftData.client && { client: draftData.client }),
          ...(draftData.location_id && { location_id: draftData.location_id }),
          ...(draftData.quotation_number && {
            quotation_number: draftData.quotation_number,
          }),
          ...(draftData.project_name && {
            project_name: draftData.project_name,
          }),
          ...(draftData.delivery_address && {
            delivery_address: draftData.delivery_address,
          }),
        },
        {
          validate: false, // Skip validation for draft updates
        },
      );

      res.status(200).json({
        message: "Draft updated successfully",
        draft: existingDraft,
      });
    } else {
      // Create new draft with default values for required fields
      const so_number = await SalesOrdersModel.generateSONumber();

      const newDraft = await SalesOrdersModel.create(
        {
          so_number,
          is_draft: true,
          draft_data: {
            ...draftData,
            currentStep,
          },
          created_by: userId,
          last_auto_saved_at: new Date(),

          // Required fields with defaults for draft
          ordered_date: new Date(),
          client: draftData.client || "Draft - Pending",
          location_id: draftData.location_id || 1, // Use default location ID or adjust
          sales_person_id: draftData.sales_person_id || userId,
          quotation_number: draftData.quotation_number || `DRAFT-${Date.now()}`,
          project_name: draftData.project_name || "Draft",
          delivery_address: draftData.delivery_address || "Draft",
          product_service_option:
            draftData.product_service_option || "Equipment with Operator",
          billing_type: draftData.billing_type || "daily",
          shift: draftData.shift || "Day",

          // ✅ Set SO status to Draft
          so_status: "Draft",

          // Set ops_status to null for drafts (will be calculated after approval)
          ops_status: null,

          // Optional fields
          lpo_number: draftData.lpo_number || null,
          lpo_start_date: draftData.lpo_start_date || null,
          lpo_validity_start_date: draftData.lpo_validity_start_date || null,
          lpo_validity_date: draftData.lpo_validity_date || null,
          product_type_vehicle_type:
            draftData.product_type_vehicle_type || null,
          no_of_equipment: draftData.no_of_equipment
            ? parseInt(draftData.no_of_equipment)
            : null,
          operator_type: draftData.operator_type || null,
          no_of_operator: draftData.no_of_operator
            ? parseInt(draftData.no_of_operator)
            : null,
          unit_rate: draftData.unit_rate
            ? parseFloat(draftData.unit_rate)
            : null,
          day_unit_rate: draftData.day_unit_rate
            ? parseFloat(draftData.day_unit_rate)
            : null,
          night_unit_rate: draftData.night_unit_rate
            ? parseFloat(draftData.night_unit_rate)
            : null,
          quantity_trips_or_days: draftData.quantity_trips_or_days
            ? parseInt(draftData.quantity_trips_or_days)
            : null,
          is_friday_off: draftData.is_friday_off || false,
          is_public_holiday_off: draftData.is_public_holiday_off || false,
          expected_mobilization_date:
            draftData.expected_mobilization_date || null,
          expected_demobilization_date:
            draftData.expected_demobilization_date || null,
          normal_working_hrs_equipment: draftData.normal_working_hrs_equipment
            ? parseFloat(draftData.normal_working_hrs_equipment)
            : null,
          normal_working_hrs_manpower: draftData.normal_working_hrs_manpower
            ? parseFloat(draftData.normal_working_hrs_manpower)
            : null,
          ot_applicable: draftData.ot_applicable || false,
          ot_rate_qar: draftData.ot_rate_qar
            ? parseFloat(draftData.ot_rate_qar)
            : null,
          recovery_is_required: draftData.recovery_is_required || false,
          recovery_cost: draftData.recovery_cost
            ? parseFloat(draftData.recovery_cost)
            : null,
          service_entry_type: draftData.service_entry_type || null,
          description_remarks: draftData.description_remarks || null,
          gate_pass_location: draftData.gate_pass_location || null,
          gate_access_no: draftData.gate_access_no || null,
          effective_start_date: draftData.effective_start_date || null,
          effective_end_date: draftData.effective_end_date || null,
          chargeable_types: draftData.chargeable_types || [],
          mobilization_unit_rate: draftData.mobilization_unit_rate
            ? parseFloat(draftData.mobilization_unit_rate)
            : null,
          demobilization_unit_rate: draftData.demobilization_unit_rate
            ? parseFloat(draftData.demobilization_unit_rate)
            : null,
          mobilization_no_of_trips: draftData.mobilization_no_of_trips
            ? parseInt(draftData.mobilization_no_of_trips)
            : null,
          demobilization_no_of_trips: draftData.demobilization_no_of_trips
            ? parseInt(draftData.demobilization_no_of_trips)
            : null,
          engine_hours_limit: draftData.engine_hours_limit || null,
          additional_charges: draftData.additional_charges
            ? parseFloat(draftData.additional_charges)
            : null,
          recovery_remarks: draftData.recovery_remarks || null,
        },
        {
          validate: false, // Skip validation for draft creation
        },
      );

      res.status(201).json({
        message: "Draft created successfully",
        draft: newDraft,
      });
    }
  } catch (error) {
    console.error("Error saving draft:", error);
    res.status(500).json({
      message: "Error saving draft",
      error: error.message,
    });
  }
};

// Get all drafts for current user
const getUserSalesOrderDrafts = async (req, res) => {
  try {
    const userId = req.user.id;

    const drafts = await SalesOrdersModel.findAll({
      where: {
        created_by: userId,
        is_draft: true,
      },
      order: [["last_auto_saved_at", "DESC"]],
      attributes: [
        "id",
        "so_number",
        "draft_data",
        "last_auto_saved_at",
        "created_at",
      ],
    });

    res.status(200).json({
      message: "Drafts retrieved successfully",
      drafts,
    });
  } catch (error) {
    console.error("Error fetching drafts:", error);
    res.status(500).json({
      message: "Error fetching drafts",
      error: error.message,
    });
  }
};

// Get specific draft by ID
const getSalesOrderDraftById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const draft = await SalesOrdersModel.findOne({
      where: {
        id,
        created_by: userId,
        is_draft: true,
      },
    });

    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    res.status(200).json({
      message: "Draft retrieved successfully",
      draft,
    });
  } catch (error) {
    console.error("Error fetching draft:", error);
    res.status(500).json({
      message: "Error fetching draft",
      error: error.message,
    });
  }
};

// Delete draft
const deleteSalesOrderDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const draft = await SalesOrdersModel.findOne({
      where: {
        id,
        created_by: userId,
        is_draft: true,
      },
    });

    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    await draft.destroy();

    res.status(200).json({
      message: "Draft deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting draft:", error);
    res.status(500).json({
      message: "Error deleting draft",
      error: error.message,
    });
  }
};

const getRentalServicesBySalesOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const rentalServices = await EquipmentRentalServiceModel.findAll({
      where: { sales_order_id: id },
    });
    res.status(200).json({ rentalService: rentalServices });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving rental services",
      error: error.message,
    });
  }
};

module.exports = {
  uploadSupportDocument,
  uploadLPOEndDateSupportDocument,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  serveSalesOrderFile,
  getSalesOrderById,
  getAllSalesOrders,
  filterSalesOrders,
  exportFilteredSalesOrdersToCSV,
  exportFilteredSalesOrdersToPDF,
  getSalesOrdersWithExpiringLPO,
  approveSalesOrder,
  rejectSalesOrder,
  getSalesOrderAttachmentHistory,
  addBillingHistoryRecord,
  updateBillingHistoryRecord,
  deleteBillingHistoryRecord,
  getBillingHistory,
  getLPOReminders,
  submitLPORemarks,
  checkAndHandleLPOReminders,
  getSalesPersonLPOReminders,
  saveSalesOrderDraft,
  getUserSalesOrderDrafts,
  getSalesOrderDraftById,
  deleteSalesOrderDraft,
  closeSalesOrder,
  completeRevision,
  getRevisionCompleteSalesOrders,
  getRevisionIncompleteSalesOrders,
  getNoRevisionsSalesOrders,
  getRentalServicesBySalesOrder,
};

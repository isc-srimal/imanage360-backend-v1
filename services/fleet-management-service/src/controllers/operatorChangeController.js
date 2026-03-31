// // // controllers/fleet-management/OperatorChangeController.js
// // const OperatorChangeModel = require("../../models/fleet-management/OperatorChangeModel");
// // const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// // const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
// // const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// // const {
// //   OperatorDeliveryNoteModel,
// //   OperatorDeliveryNoteTripModel
// // } = require("../../models/fleet-management/OperatorDeliveryNoteModel");
// // const {
// //   OperatorOffHireNoteModel,
// //   OperatorOffHireNoteTripModel
// // } = require("../../models/fleet-management/OperatorOffHireNoteModel");
// // const OperatorTypeModel = require("../../models/fleet-management/OperatorTypeModel");
// // const sequelize = require("../../config/dbSync");
// // const { Op } = require("sequelize");
// // const UsersModel = require("../../models/user-security-management/UsersModel");
// // const path = require("path");
// // const fs = require("fs");
// // const PDFDocument = require("pdfkit");

// // const SwapReasonModel = require("../../models/fleet-management/swapReasonModel");

// // const getOperatorSwapReasons = async (req, res) => {
// //   try {
// //     const swapReasons = await SwapReasonModel.findAll({
// //       where: {
// //         category: "Operator",
// //         status: "Active"
// //       },
// //       attributes: ["swap_reason_id", "swap_reason_name"],
// //       order: [["swap_reason_name", "ASC"]]
// //     });

// //     res.status(200).json({
// //       success: true,
// //       swapReasons
// //     });
// //   } catch (error) {
// //     console.error("Error fetching operator swap reasons:", error);
// //     res.status(500).json({
// //       message: "Error fetching operator swap reasons",
// //       error: error.message
// //     });
// //   }
// // };

// // // Get all equipment for operator change dropdown
// // const getAllEquipmentForOperator = async (req, res) => {
// //   try {
// //     const equipment = await EquipmentModel.findAll({
// //       where: { status: "Active" },
// //       attributes: ["serial_number", "reg_number", "vehicle_type"],
// //       order: [["reg_number", "ASC"]],
// //     });

// //     res.status(200).json({
// //       success: true,
// //       equipment
// //     });
// //   } catch (error) {
// //     console.error("Error fetching equipment:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // Get manpower by operator type
// // const getManpowerByOperatorType = async (req, res) => {
// //   try {
// //     const { operator_type } = req.query;

// //     const whereClause = { status: "Active" };
// //     if (operator_type) {
// //       whereClause.operator_type_id = operator_type;
// //     }

// //     const manpower = await ManpowerModel.findAll({
// //       where: whereClause,
// //       include: [{
// //         model: OperatorTypeModel,
// //         as: "operator_type",
// //         attributes: ["operator_type_id", "operator_type"]
// //       }],
// //       attributes: ["manpower_id", "employeeId", "employeeNo", "employeeFullName", "operator_type_id"],
// //       order: [["employeeFullName", "ASC"]],
// //     });

// //     res.status(200).json({
// //       success: true,
// //       manpower: manpower.map(mp => ({
// //         manpower_id: mp.manpower_id,
// //         employeeId: mp.employeeId,
// //         employeeNo: mp.employeeNo,
// //         employeeFullName: mp.employeeFullName,
// //         operator_type: mp.operator_type?.operator_type || 'N/A'
// //       }))
// //     });
// //   } catch (error) {
// //     console.error("Error fetching manpower:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // Get operator types for dropdown
// // const getAllOperatorTypes = async (req, res) => {
// //   try {
// //     const operatorTypes = await OperatorTypeModel.findAll({
// //       where: { status: "Active" },
// //       attributes: ["operator_type_id", "operator_type"],
// //       order: [["operator_type", "ASC"]],
// //     });

// //     res.status(200).json({
// //       success: true,
// //       operatorTypes
// //     });
// //   } catch (error) {
// //     console.error("Error fetching operator types:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // controllers/fleet-management/operatorChangeController.js
// // // UPDATED FUNCTION: createOperatorChange — generates change_group_id shared by both records

// // // ─── Helper: generate a human-readable group ID ────────────────────────────
// // // Format: OP-YYYYMMDD-XXXX  (e.g. OP-20260224-C1E5)
// // const generateChangeGroupId = (prefix = "OP") => {
// //   const now = new Date();
// //   const datePart = now
// //     .toISOString()
// //     .slice(0, 10)
// //     .replace(/-/g, ""); // "20260224"
// //   const randomPart = Math.random()
// //     .toString(36)
// //     .toUpperCase()
// //     .slice(2, 6); // 4 random alphanumeric chars
// //   return `${prefix}-${datePart}-${randomPart}`;
// // };
// // // ───────────────────────────────────────────────────────────────────────────

// // const createOperatorChange = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const {
// //       sales_order_id,
// //       allocation_id,
// //       equipment_serial_number,
// //       plate_number,
// //       previous_operator_id,
// //       new_operator_id,
// //       operator_type,
// //       change_date,
// //       change_reason,
// //       change_estimated_transfer_cost,
// //       change_remark,
// //     } = req.body;

// //     console.log("Received operator change payload:", {
// //       sales_order_id,
// //       allocation_id,
// //       equipment_serial_number,
// //       plate_number,
// //       previous_operator_id,
// //       new_operator_id,
// //       operator_type,
// //       change_date,
// //       change_reason,
// //     });

// //     // Validate required fields
// //     const missingFields = [];
// //     if (!sales_order_id) missingFields.push("sales_order_id");
// //     if (!new_operator_id) missingFields.push("new_operator_id");
// //     if (!change_date) missingFields.push("change_date");
// //     if (!change_reason) missingFields.push("change_reason");

// //     if (missingFields.length > 0) {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "All required fields must be filled",
// //         missingFields,
// //         receivedData: req.body,
// //       });
// //     }

// //     // Get sales order
// //     const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
// //     if (!salesOrder) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Sales order not found" });
// //     }

// //     // Derive previous_operator_id from allocation if not provided
// //     let derivedPreviousOperatorId = previous_operator_id;
// //     let previousEmployeeId = null;

// //     if (allocation_id && !derivedPreviousOperatorId) {
// //       const ActiveAllocationManpowerModel = require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationManpowerModel;

// //       const currentAllocation = await ActiveAllocationManpowerModel.findOne({
// //         where: { allocation_id },
// //         transaction,
// //       });

// //       if (currentAllocation) {
// //         previousEmployeeId = currentAllocation.employee_id;

// //         const currentOperator = await ManpowerModel.findOne({
// //           where: { employeeId: previousEmployeeId },
// //           transaction,
// //         });

// //         if (currentOperator) {
// //           derivedPreviousOperatorId = currentOperator.manpower_id;
// //           console.log(
// //             "Derived previous operator ID from allocation:",
// //             derivedPreviousOperatorId,
// //           );
// //         }
// //       }
// //     }

// //     if (!derivedPreviousOperatorId) {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message:
// //           "Unable to determine previous operator. Please ensure allocation has an assigned operator or provide previous_operator_id.",
// //         allocation_id,
// //       });
// //     }

// //     // Get previous operator details
// //     const previousOperator = await ManpowerModel.findOne({
// //       where: { manpower_id: derivedPreviousOperatorId },
// //       include: [{ model: OperatorTypeModel, as: "operator_type" }],
// //       transaction,
// //     });

// //     if (!previousOperator) {
// //       await transaction.rollback();
// //       return res.status(404).json({
// //         message: "Previous operator not found",
// //         previous_operator_id: derivedPreviousOperatorId,
// //       });
// //     }

// //     // Get new operator details
// //     const newOperator = await ManpowerModel.findOne({
// //       where: { manpower_id: new_operator_id },
// //       include: [{ model: OperatorTypeModel, as: "operator_type" }],
// //       transaction,
// //     });

// //     if (!newOperator) {
// //       await transaction.rollback();
// //       return res.status(404).json({
// //         message: "New operator not found",
// //         new_operator_id,
// //       });
// //     }

// //     // Validate operators are different
// //     if (derivedPreviousOperatorId === new_operator_id) {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "New operator must be different from previous operator",
// //       });
// //     }

// //     // Get logged in user
// //     let username = "System";
// //     if (req.user?.uid) {
// //       const user = await UsersModel.findByPk(req.user.uid, { transaction });
// //       if (user) {
// //         username = user.username;
// //       }
// //     }

// //     const finalOperatorType =
// //       operator_type ||
// //       newOperator.operator_type?.operator_type ||
// //       previousOperator.operator_type?.operator_type;

// //     // ✅ Generate one shared group ID for both records of this change operation
// //     const changeGroupId = generateChangeGroupId("OP");

// //     // CREATE RECORD 1: OFF_HIRE — for the outgoing/previous operator
// //     const offHireRecord = await OperatorChangeModel.create(
// //       {
// //         change_group_id: changeGroupId,           // ✅ shared group ID
// //         sales_order_id,
// //         allocation_id: allocation_id || null,
// //         equipment_serial_number: equipment_serial_number || null,
// //         plate_number: plate_number || null,
// //         previous_operator_id: derivedPreviousOperatorId,
// //         previous_operator_name: previousOperator.employeeFullName,
// //         new_operator_id: null,
// //         new_operator_name: null,
// //         operator_type: finalOperatorType,
// //         change_date,
// //         change_reason,
// //         change_estimated_transfer_cost: change_estimated_transfer_cost || null,
// //         change_remark: change_remark || null,
// //         change_type: "OFF_HIRE",
// //         delivery_note_status: "Pending",
// //         off_hire_note_status: "Pending",
// //         overall_status: "Creation",
// //         created_by: username,
// //         created_at: new Date(),
// //         updated_at: new Date(),
// //       },
// //       { transaction },
// //     );

// //     // CREATE RECORD 2: DELIVERY — for the incoming/new operator
// //     const deliveryRecord = await OperatorChangeModel.create(
// //       {
// //         change_group_id: changeGroupId,           // ✅ same shared group ID
// //         sales_order_id,
// //         allocation_id: allocation_id || null,
// //         equipment_serial_number: equipment_serial_number || null,
// //         plate_number: plate_number || null,
// //         previous_operator_id: null,
// //         previous_operator_name: null,
// //         new_operator_id,
// //         new_operator_name: newOperator.employeeFullName,
// //         operator_type: finalOperatorType,
// //         change_date,
// //         change_reason,
// //         change_estimated_transfer_cost: change_estimated_transfer_cost || null,
// //         change_remark: change_remark || null,
// //         change_type: "DELIVERY",
// //         delivery_note_status: "Pending",
// //         off_hire_note_status: "Pending",
// //         overall_status: "Creation",
// //         created_by: username,
// //         created_at: new Date(),
// //         updated_at: new Date(),
// //       },
// //       { transaction },
// //     );

// //     // Update allocation if allocation_id is provided
// //     if (allocation_id) {
// //       const ActiveAllocationManpowerModel = require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationManpowerModel;

// //       const updateResult = await ActiveAllocationManpowerModel.update(
// //         {
// //           employee_id: newOperator.employeeId,
// //           updated_at: new Date(),
// //         },
// //         {
// //           where: {
// //             allocation_id: allocation_id,
// //             employee_id: previousOperator.employeeId,
// //           },
// //           transaction,
// //         },
// //       );

// //       console.log("Allocation manpower update result:", updateResult);

// //       if (updateResult[0] === 0) {
// //         console.warn("Warning: No allocation manpower records were updated.");
// //       }
// //     }

// //     await transaction.commit();

// //     console.log(
// //       "Operator change created successfully with two records:",
// //       {
// //         changeGroupId,
// //         offHireId: offHireRecord.operator_change_id,
// //         deliveryId: deliveryRecord.operator_change_id,
// //       },
// //     );

// //     res.status(201).json({
// //       message: "Operator change created successfully",
// //       change_group_id: changeGroupId,             // ✅ returned in response
// //       data: {
// //         changeGroupId,
// //         offHireRecord,
// //         deliveryRecord,
// //         previousOperator: {
// //           manpower_id: previousOperator.manpower_id,
// //           employee_id: previousOperator.employeeId,
// //           name: previousOperator.employeeFullName,
// //           employee_no: previousOperator.employeeNo,
// //         },
// //         newOperator: {
// //           manpower_id: newOperator.manpower_id,
// //           employee_id: newOperator.employeeId,
// //           name: newOperator.employeeFullName,
// //           employee_no: newOperator.employeeNo,
// //         },
// //       },
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error creating operator change:", error);
// //     console.error("Error stack:", error.stack);

// //     res.status(500).json({
// //       message: "Error creating operator change",
// //       error: error.message,
// //       details:
// //         process.env.NODE_ENV === "development" ? error.stack : undefined,
// //     });
// //   }
// // };

// // // const createOperatorChange = async (req, res) => {
// // //   const transaction = await sequelize.transaction();

// // //   try {
// // //     const {
// // //       sales_order_id,
// // //       allocation_id,
// // //       equipment_serial_number,
// // //       plate_number,
// // //       previous_operator_id,
// // //       new_operator_id,
// // //       operator_type,
// // //       change_date,
// // //       change_reason
// // //     } = req.body;

// // //     console.log("Received operator change payload:", {
// // //       sales_order_id,
// // //       allocation_id,
// // //       equipment_serial_number,
// // //       plate_number,
// // //       previous_operator_id,
// // //       new_operator_id,
// // //       operator_type,
// // //       change_date,
// // //       change_reason
// // //     });

// // //     // Validate required fields
// // //     const missingFields = [];
// // //     if (!sales_order_id) missingFields.push('sales_order_id');
// // //     if (!new_operator_id) missingFields.push('new_operator_id');
// // //     if (!change_date) missingFields.push('change_date');
// // //     if (!change_reason) missingFields.push('change_reason');

// // //     if (missingFields.length > 0) {
// // //       await transaction.rollback();
// // //       return res.status(400).json({
// // //         message: "All required fields must be filled",
// // //         missingFields,
// // //         receivedData: req.body
// // //       });
// // //     }

// // //     // Get sales order
// // //     const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
// // //     if (!salesOrder) {
// // //       await transaction.rollback();
// // //       return res.status(404).json({ message: "Sales order not found" });
// // //     }

// // //     // Derive previous_operator_id from allocation if not provided
// // //     let derivedPreviousOperatorId = previous_operator_id;
// // //     let previousEmployeeId = null;

// // //     if (allocation_id && !derivedPreviousOperatorId) {
// // //       const ActiveAllocationManpowerModel = require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationManpowerModel;

// // //       const currentAllocation = await ActiveAllocationManpowerModel.findOne({
// // //         where: { allocation_id },
// // //         transaction
// // //       });

// // //       if (currentAllocation) {
// // //         previousEmployeeId = currentAllocation.employee_id;

// // //         const currentOperator = await ManpowerModel.findOne({
// // //           where: { employeeId: previousEmployeeId },
// // //           transaction
// // //         });

// // //         if (currentOperator) {
// // //           derivedPreviousOperatorId = currentOperator.manpower_id;
// // //           console.log("Derived previous operator ID from allocation:", derivedPreviousOperatorId);
// // //         }
// // //       }
// // //     }

// // //     if (!derivedPreviousOperatorId) {
// // //       await transaction.rollback();
// // //       return res.status(400).json({
// // //         message: "Unable to determine previous operator. Please ensure allocation has an assigned operator or provide previous_operator_id.",
// // //         allocation_id
// // //       });
// // //     }

// // //     // Get previous operator details
// // //     const previousOperator = await ManpowerModel.findOne({
// // //       where: { manpower_id: derivedPreviousOperatorId },
// // //       include: [{
// // //         model: OperatorTypeModel,
// // //         as: "operator_type"
// // //       }],
// // //       transaction
// // //     });

// // //     if (!previousOperator) {
// // //       await transaction.rollback();
// // //       return res.status(404).json({
// // //         message: "Previous operator not found",
// // //         previous_operator_id: derivedPreviousOperatorId
// // //       });
// // //     }

// // //     // Get new operator details
// // //     const newOperator = await ManpowerModel.findOne({
// // //       where: { manpower_id: new_operator_id },
// // //       include: [{
// // //         model: OperatorTypeModel,
// // //         as: "operator_type"
// // //       }],
// // //       transaction
// // //     });

// // //     if (!newOperator) {
// // //       await transaction.rollback();
// // //       return res.status(404).json({
// // //         message: "New operator not found",
// // //         new_operator_id
// // //       });
// // //     }

// // //     // Validate that operators are different
// // //     if (derivedPreviousOperatorId === new_operator_id) {
// // //       await transaction.rollback();
// // //       return res.status(400).json({
// // //         message: "New operator must be different from previous operator"
// // //       });
// // //     }

// // //     // Get logged in user
// // //     let username = "System";
// // //     if (req.user?.uid) {
// // //       const user = await UsersModel.findByPk(req.user.uid, { transaction });
// // //       if (user) {
// // //         username = user.username;
// // //       }
// // //     }

// // //     const finalOperatorType = operator_type ||
// // //                              newOperator.operator_type?.operator_type ||
// // //                              previousOperator.operator_type?.operator_type;

// // //     const offHireRecord = await OperatorChangeModel.create({
// // //       sales_order_id,
// // //       allocation_id: allocation_id || null,
// // //       equipment_serial_number: equipment_serial_number || null,
// // //       plate_number: plate_number || null,
// // //       previous_operator_id: derivedPreviousOperatorId,
// // //       previous_operator_name: previousOperator.employeeFullName,
// // //       new_operator_id: null,
// // //       new_operator_name: null,
// // //       operator_type: finalOperatorType,
// // //       change_date,
// // //       change_reason,
// // //       change_type: "OFF_HIRE",
// // //       delivery_note_status: "Pending",
// // //       off_hire_note_status: "Pending",
// // //       overall_status: "Created",
// // //       created_by: username,
// // //       created_at: new Date(),
// // //       updated_at: new Date()
// // //     }, { transaction });

// // //     const deliveryRecord = await OperatorChangeModel.create({
// // //       sales_order_id,
// // //       allocation_id: allocation_id || null,
// // //       equipment_serial_number: equipment_serial_number || null,
// // //       plate_number: plate_number || null,
// // //       previous_operator_id: null,
// // //       previous_operator_name: null,
// // //       new_operator_id,
// // //       new_operator_name: newOperator.employeeFullName,
// // //       operator_type: finalOperatorType,
// // //       change_date,
// // //       change_reason,
// // //       change_type: "DELIVERY",
// // //       delivery_note_status: "Pending",
// // //       off_hire_note_status: "Pending",
// // //       overall_status: "Created",
// // //       created_by: username,
// // //       created_at: new Date(),
// // //       updated_at: new Date()
// // //     }, { transaction });

// // //     // Update allocation if allocation_id is provided
// // //     if (allocation_id) {
// // //       const ActiveAllocationManpowerModel = require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationManpowerModel;

// // //       const updateResult = await ActiveAllocationManpowerModel.update(
// // //         {
// // //           employee_id: newOperator.employeeId,
// // //           updated_at: new Date()
// // //         },
// // //         {
// // //           where: {
// // //             allocation_id: allocation_id,
// // //             employee_id: previousOperator.employeeId
// // //           },
// // //           transaction
// // //         }
// // //       );

// // //       console.log("Allocation manpower update result:", updateResult);

// // //       if (updateResult[0] === 0) {
// // //         console.warn("Warning: No allocation manpower records were updated.");
// // //       }
// // //     }

// // //     await transaction.commit();

// // //     console.log("Operator change created successfully with two records:", {
// // //       offHireId: offHireRecord.operator_change_id,
// // //       deliveryId: deliveryRecord.operator_change_id
// // //     });

// // //     res.status(201).json({
// // //       message: "Operator change created successfully",
// // //       data: {
// // //         offHireRecord,
// // //         deliveryRecord,
// // //         previousOperator: {
// // //           manpower_id: previousOperator.manpower_id,
// // //           employee_id: previousOperator.employeeId,
// // //           name: previousOperator.employeeFullName,
// // //           employee_no: previousOperator.employeeNo
// // //         },
// // //         newOperator: {
// // //           manpower_id: newOperator.manpower_id,
// // //           employee_id: newOperator.employeeId,
// // //           name: newOperator.employeeFullName,
// // //           employee_no: newOperator.employeeNo
// // //         }
// // //       }
// // //     });

// // //   } catch (error) {
// // //     await transaction.rollback();
// // //     console.error("Error creating operator change:", error);
// // //     console.error("Error stack:", error.stack);

// // //     res.status(500).json({
// // //       message: "Error creating operator change",
// // //       error: error.message,
// // //       details: process.env.NODE_ENV === 'development' ? error.stack : undefined
// // //     });
// // //   }
// // // };

// // // Get all operator changes for sales order
// // const getOperatorChangesBySalesOrder = async (req, res) => {
// //   try {
// //     const { sales_order_id } = req.params;

// //     const operatorChanges = await OperatorChangeModel.findAll({
// //       where: { sales_order_id },
// //       include: [
// //         {
// //           model: SalesOrdersModel,
// //           as: "salesOrder",
// //           attributes: ["so_number", "client", "project_name"]
// //         },
// //         {
// //           model: EquipmentModel,
// //           as: "equipment",
// //           attributes: ["serial_number", "reg_number", "vehicle_type"]
// //         },
// //         {
// //           model: ManpowerModel,
// //           as: "previousOperator",
// //           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
// //         },
// //         {
// //           model: ManpowerModel,
// //           as: "newOperator",
// //           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
// //         },
// //         {
// //           model: OperatorDeliveryNoteModel,
// //           as: "deliveryNotes",
// //           order: [["created_at", "DESC"]]
// //         },
// //         {
// //           model: OperatorOffHireNoteModel,
// //           as: "offHireNotes",
// //           order: [["created_at", "DESC"]]
// //         }
// //       ],
// //       order: [["created_at", "DESC"]]
// //     });

// //     res.status(200).json({
// //       totalCount: operatorChanges.length,
// //       operatorChanges
// //     });
// //   } catch (error) {
// //     console.error("Error fetching operator changes:", error);
// //     res.status(500).json({
// //       message: "Error fetching operator changes",
// //       error: error.message
// //     });
// //   }
// // };

// // // Get operator change by ID with details
// // const getOperatorChangeById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const operatorChange = await OperatorChangeModel.findByPk(id, {
// //       include: [
// //         {
// //           model: SalesOrdersModel,
// //           as: "salesOrder",
// //           attributes: ["so_number", "client", "project_name"]
// //         },
// //         {
// //           model: EquipmentModel,
// //           as: "equipment",
// //           attributes: ["serial_number", "reg_number", "vehicle_type"]
// //         },
// //         {
// //           model: ManpowerModel,
// //           as: "previousOperator",
// //           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
// //         },
// //         {
// //           model: ManpowerModel,
// //           as: "newOperator",
// //           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
// //         },
// //         {
// //           model: OperatorDeliveryNoteModel,
// //           as: "deliveryNotes",
// //           include: [{
// //             model: OperatorDeliveryNoteTripModel,
// //             as: "trips"
// //           }],
// //           order: [["created_at", "DESC"]]
// //         },
// //         {
// //           model: OperatorOffHireNoteModel,
// //           as: "offHireNotes",
// //           include: [{
// //             model: OperatorOffHireNoteTripModel,
// //             as: "trips"
// //           }],
// //           order: [["created_at", "DESC"]]
// //         }
// //       ]
// //     });

// //     if (!operatorChange) {
// //       return res.status(404).json({ message: "Operator change not found" });
// //     }

// //     res.status(200).json({
// //       operatorChange
// //     });
// //   } catch (error) {
// //     console.error("Error fetching operator change:", error);
// //     res.status(500).json({
// //       message: "Error fetching operator change",
// //       error: error.message
// //     });
// //   }
// // };

// // // Create operator delivery note with trips
// // const createOperatorDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { operator_change_id } = req.params;
// //     const { delivery_date, remarks, trips } = req.body;

// //     // Get operator change
// //     const operatorChange = await OperatorChangeModel.findByPk(operator_change_id, {
// //       include: [
// //         {
// //           model: ManpowerModel,
// //           as: "newOperator",
// //           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
// //         },
// //         {
// //           model: SalesOrdersModel,
// //           as: "salesOrder",
// //           attributes: ["so_number", "client", "project_name"]
// //         }
// //       ]
// //     });

// //     if (!operatorChange) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Operator change not found" });
// //     }

// //     // Generate DN number
// //     const currentYear = new Date().getFullYear();
// //     const prefix = `OP-DN-${currentYear}-`;

// //     const lastDN = await OperatorDeliveryNoteModel.findOne({
// //       where: { dn_number: { [Op.like]: `${prefix}%` } },
// //       order: [["dn_number", "DESC"]]
// //     });

// //     let nextNumber = 1;
// //     if (lastDN) {
// //       const lastNumber = parseInt(lastDN.dn_number.split("-")[3]);
// //       nextNumber = lastNumber + 1;
// //     }

// //     const dn_number = `${prefix}${String(nextNumber).padStart(4, "0")}`;

// //     // Get logged in user
// //     let username = "System";
// //     if (req.user?.uid) {
// //       const user = await UsersModel.findByPk(req.user.uid);
// //       if (user) {
// //         username = user.username;
// //       }
// //     }

// //     // Create delivery note
// //     const deliveryNote = await OperatorDeliveryNoteModel.create({
// //       operator_change_id,
// //       dn_number,
// //       new_operator_id: operatorChange.new_operator_id,
// //       new_operator_name: operatorChange.new_operator_name,
// //       delivery_date,
// //       status: "Creation",
// //       remarks,
// //       created_by: username
// //     }, { transaction });

// //     // Create trips if provided
// //     if (trips && trips.length > 0) {
// //       for (const trip of trips) {
// //         await OperatorDeliveryNoteTripModel.create({
// //           operator_dn_id: deliveryNote.operator_dn_id,
// //           trip_number: trip.trip_number,
// //           transportation_company: trip.transportation_company,
// //           driver_name: trip.driver_name,
// //           driver_contact: trip.driver_contact,
// //           vehicle_type: trip.vehicle_type,
// //           vehicle_number: trip.vehicle_number,
// //           trip_date: trip.trip_date,
// //           trip_status: "Creation",
// //           remarks: trip.remarks,
// //         }, { transaction });
// //       }
// //     }

// //     const sameGroupChangeData = await OperatorChangeModel.findAll({
// //       where: {
// //         overall_status: "Partially completed",
// //         change_group_id: operatorChange.change_group_id,
// //       },
// //     });

// //     if (operatorChange.overall_status === "In progress") {
// //       if (sameGroupChangeData.length > 0) {
// //         const operatorGroupChangeData = await OperatorChangeModel.findAll({
// //           where: {
// //             change_group_id: operatorChange.change_group_id,
// //           },
// //         });

// //         const ids = operatorGroupChangeData.map((data) =>
// //           data.getDataValue("operator_change_id"),
// //         );
// //         for (const data of operatorGroupChangeData) {
// //           await OperatorChangeModel.update(
// //             { overall_status: "Completed" },
// //             {
// //               where: { operator_change_id: { [Op.in]: ids } },
// //               transaction,
// //             },
// //           );
// //         }
// //       } else {
// //         await OperatorChangeModel.update(
// //           { overall_status: "Partially completed" },
// //           {
// //             where: { operator_change_id: operatorChange.operator_change_id },
// //             transaction,
// //           },
// //         );
// //       }
// //     }

// //     await transaction.commit();

// //     // Fetch created delivery note with trips
// //     const createdDeliveryNote = await OperatorDeliveryNoteModel.findByPk(
// //       deliveryNote.operator_dn_id,
// //       {
// //         include: [
// //           {
// //             model: OperatorDeliveryNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]]
// //           },
// //           {
// //             model: OperatorChangeModel,
// //             as: "operatorChange",
// //             include: [{
// //               model: SalesOrdersModel,
// //               as: "salesOrder"
// //             }]
// //           }
// //         ]
// //       }
// //     );

// //     res.status(201).json({
// //       message: "Operator delivery note created successfully",
// //       deliveryNote: createdDeliveryNote
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error creating operator delivery note:", error);
// //     res.status(500).json({
// //       message: "Error creating operator delivery note",
// //       error: error.message
// //     });
// //   }
// // };

// // // Create operator off hire note with trips
// // const createOperatorOffHireNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { operator_change_id } = req.params;
// //     const { off_hire_date, remarks, trips } = req.body;

// //     // Get operator change
// //     const operatorChange = await OperatorChangeModel.findByPk(operator_change_id, {
// //       include: [
// //         {
// //           model: ManpowerModel,
// //           as: "previousOperator",
// //           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
// //         },
// //         {
// //           model: SalesOrdersModel,
// //           as: "salesOrder",
// //           attributes: ["so_number", "client", "project_name"]
// //         }
// //       ]
// //     });

// //     if (!operatorChange) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Operator change not found" });
// //     }

// //     // Generate OHN number
// //     const currentYear = new Date().getFullYear();
// //     const prefix = `OP-OH-${currentYear}-`;

// //     const lastOHN = await OperatorOffHireNoteModel.findOne({
// //       where: { ohn_number: { [Op.like]: `${prefix}%` } },
// //       order: [["ohn_number", "DESC"]]
// //     });

// //     let nextNumber = 1;
// //     if (lastOHN) {
// //       const lastNumber = parseInt(lastOHN.ohn_number.split("-")[3]);
// //       nextNumber = lastNumber + 1;
// //     }

// //     const ohn_number = `${prefix}${String(nextNumber).padStart(4, "0")}`;

// //     // Get logged in user
// //     let username = "System";
// //     if (req.user?.uid) {
// //       const user = await UsersModel.findByPk(req.user.uid);
// //       if (user) {
// //         username = user.username;
// //       }
// //     }

// //     // Create off hire note
// //     const offHireNote = await OperatorOffHireNoteModel.create({
// //       operator_change_id,
// //       ohn_number,
// //       previous_operator_id: operatorChange.previous_operator_id,
// //       previous_operator_name: operatorChange.previous_operator_name,
// //       off_hire_date,
// //       status: "Creation",
// //       remarks,
// //       created_by: username
// //     }, { transaction });

// //     // Create trips if provided
// //     if (trips && trips.length > 0) {
// //       for (const trip of trips) {
// //         await OperatorOffHireNoteTripModel.create({
// //           operator_ohn_id: offHireNote.operator_ohn_id,
// //           trip_number: trip.trip_number,
// //           transportation_company: trip.transportation_company,
// //           driver_name: trip.driver_name,
// //           driver_contact: trip.driver_contact,
// //           vehicle_type: trip.vehicle_type,
// //           vehicle_number: trip.vehicle_number,
// //           trip_date: trip.trip_date,
// //           trip_status: "Creation",
// //           remarks: trip.remarks,
// //         }, { transaction });
// //       }
// //     }

// //     const sameGroupChangeData = await OperatorChangeModel.findAll({
// //       where: {
// //         overall_status: "Partially completed",
// //         change_group_id: operatorChange.change_group_id,
// //       },
// //     });

// //     if (operatorChange.overall_status === "In progress") {
// //       if (sameGroupChangeData.length > 0) {
// //         const operatorGroupChangeData = await OperatorChangeModel.findAll({
// //           where: {
// //             change_group_id: operatorChange.change_group_id,
// //           },
// //         });

// //         const ids = operatorGroupChangeData.map((data) =>
// //           data.getDataValue("operator_change_id"),
// //         );
// //         for (const data of operatorGroupChangeData) {
// //           await OperatorChangeModel.update(
// //             { overall_status: "Completed" },
// //             {
// //               where: { operator_change_id: { [Op.in]: ids } },
// //               transaction,
// //             },
// //           );
// //         }
// //       } else {
// //         await OperatorChangeModel.update(
// //           { overall_status: "Partially completed" },
// //           {
// //             where: { operator_change_id: operatorChange.operator_change_id },
// //             transaction,
// //           },
// //         );
// //       }
// //     }

// //     await transaction.commit();

// //     // Fetch created off hire note with trips
// //     const createdOffHireNote = await OperatorOffHireNoteModel.findByPk(
// //       offHireNote.operator_ohn_id,
// //       {
// //         include: [
// //           {
// //             model: OperatorOffHireNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]]
// //           },
// //           {
// //             model: OperatorChangeModel,
// //             as: "operatorChange",
// //             include: [{
// //               model: SalesOrdersModel,
// //               as: "salesOrder"
// //             }]
// //           }
// //         ]
// //       }
// //     );

// //     res.status(201).json({
// //       message: "Operator off hire note created successfully",
// //       offHireNote: createdOffHireNote
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error creating operator off hire note:", error);
// //     res.status(500).json({
// //       message: "Error creating operator off hire note",
// //       error: error.message
// //     });
// //   }
// // };

// // // Get operator delivery note summary
// // const getOperatorDeliveryNoteSummary = async (req, res) => {
// //   try {
// //     const { operator_dn_id } = req.params;

// //     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(operator_dn_id, {
// //       include: [
// //         {
// //           model: OperatorDeliveryNoteTripModel,
// //           as: "trips",
// //           order: [["trip_number", "ASC"]]
// //         },
// //         {
// //           model: OperatorChangeModel,
// //           as: "operatorChange",
// //           include: [
// //             {
// //               model: SalesOrdersModel,
// //               as: "salesOrder",
// //               attributes: ["so_number", "client", "project_name"]
// //             },
// //             {
// //               model: ManpowerModel,
// //               as: "newOperator",
// //               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
// //             }
// //           ]
// //         }
// //       ]
// //     });

// //     if (!deliveryNote) {
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     // Format summary data
// //     const summaryData = {
// //       dn_number: deliveryNote.dn_number,
// //       operator: deliveryNote.operatorChange.newOperator,
// //       delivery_date: deliveryNote.delivery_date,
// //       status: deliveryNote.status,
// //       trips: deliveryNote.trips.map(trip => ({
// //         trip_number: trip.trip_number,
// //         transportation: {
// //           company: trip.transportation_company,
// //           driver: trip.driver_name,
// //           contact: trip.driver_contact,
// //           vehicle: trip.vehicle_number,
// //         },
// //         trip_date: trip.trip_date,
// //         trip_status: trip.trip_status,
// //         remarks: trip.remarks
// //       }))
// //     };

// //     res.status(200).json({
// //       success: true,
// //       summary: summaryData
// //     });
// //   } catch (error) {
// //     console.error("Error fetching delivery note summary:", error);
// //     res.status(500).json({
// //       message: "Error fetching delivery note summary",
// //       error: error.message
// //     });
// //   }
// // };

// // // Get operator off hire note summary
// // const getOperatorOffHireNoteSummary = async (req, res) => {
// //   try {
// //     const { operator_ohn_id } = req.params;

// //     const offHireNote = await OperatorOffHireNoteModel.findByPk(operator_ohn_id, {
// //       include: [
// //         {
// //           model: OperatorOffHireNoteTripModel,
// //           as: "trips",
// //           order: [["trip_number", "ASC"]]
// //         },
// //         {
// //           model: OperatorChangeModel,
// //           as: "operatorChange",
// //           include: [
// //             {
// //               model: SalesOrdersModel,
// //               as: "salesOrder",
// //               attributes: ["so_number", "client", "project_name"]
// //             },
// //             {
// //               model: ManpowerModel,
// //               as: "previousOperator",
// //               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
// //             }
// //           ]
// //         }
// //       ]
// //     });

// //     if (!offHireNote) {
// //       return res.status(404).json({ message: "Off hire note not found" });
// //     }

// //     // Format summary data
// //     const summaryData = {
// //       ohn_number: offHireNote.ohn_number,
// //       operator: offHireNote.operatorChange.previousOperator,
// //       off_hire_date: offHireNote.off_hire_date,
// //       status: offHireNote.status,
// //       trips: offHireNote.trips.map(trip => ({
// //         trip_number: trip.trip_number,
// //         transportation: {
// //           company: trip.transportation_company,
// //           driver: trip.driver_name,
// //           contact: trip.driver_contact,
// //           vehicle: trip.vehicle_number,
// //         },
// //         trip_date: trip.trip_date,
// //         trip_status: trip.trip_status,
// //         remarks: trip.remarks
// //       }))
// //     };

// //     res.status(200).json({
// //       success: true,
// //       summary: summaryData
// //     });
// //   } catch (error) {
// //     console.error("Error fetching off hire note summary:", error);
// //     res.status(500).json({
// //       message: "Error fetching off hire note summary",
// //       error: error.message
// //     });
// //   }
// // };

// // // Generate operator delivery note PDF

// // const generateOperatorDeliveryNotePDF = async (req, res) => {
// //   try {
// //     const { operator_dn_id } = req.params;

// //     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(operator_dn_id, {
// //       include: [
// //         {
// //           model: OperatorDeliveryNoteTripModel,
// //           as: "trips",
// //           order: [["trip_number", "ASC"]]
// //         },
// //         {
// //           model: OperatorChangeModel,
// //           as: "operatorChange",
// //           include: [
// //             {
// //               model: SalesOrdersModel,
// //               as: "salesOrder",
// //               attributes: ["so_number", "client", "project_name", "ordered_date", "lpo_number"]
// //             },
// //             {
// //               model: EquipmentModel,
// //               as: "equipment",
// //               attributes: ["serial_number", "reg_number", "vehicle_type"]
// //             },
// //             {
// //               model: ManpowerModel,
// //               as: "newOperator",
// //               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
// //             }
// //           ]
// //         }
// //       ]
// //     });

// //     if (!deliveryNote) {
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     // Update status to In Progress when PDF is generated
// //     await deliveryNote.update({ status: "In Progress" });

// //     // Also update trips status
// //     await OperatorDeliveryNoteTripModel.update(
// //       { trip_status: "In Progress" },
// //       {
// //         where: { operator_dn_id, trip_status: "Creation" }
// //       }
// //     );

// //     // Generate PDF
// //     const doc = new PDFDocument({ margin: 40, size: "A4" });

// //     res.setHeader('Content-Type', 'application/pdf');
// //     res.setHeader('Content-Disposition', `attachment; filename="OP-DN-${deliveryNote.dn_number}.pdf"`);

// //     doc.pipe(res);

// //     // Add border to page
// //     const pageWidth = doc.page.width;
// //     const pageHeight = doc.page.height;
// //     doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

// //     // Company Header with Green Background
// //     doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke('#059669', '#059669');

// //     doc.fontSize(22).font('Helvetica-Bold').fillColor('#FFFFFF')
// //       .text('Auto Xpert Trading and Service WLL', 50, 55, { align: 'center' })
// //       .fontSize(9).font('Helvetica')
// //       .text('Office No 11, 2nd Floor, Building No.207, Street 995, Zone 56', 50, 82, { align: 'center' })
// //       .text('Doha, Qatar | Tel: 44581071 | Email: info@autoxpert.qa', 50, 95, { align: 'center' });

// //     doc.fillColor('#000000');

// //     // Document Title
// //     doc.moveDown(3);
// //     doc.fontSize(18).font('Helvetica-Bold').fillColor('#059669')
// //       .text('OPERATOR DELIVERY NOTE', { align: 'center' })
// //       .fillColor('#000000');

// //     doc.moveDown(1);
// //     doc.moveTo(100, doc.y).lineTo(pageWidth - 100, doc.y).stroke('#059669');
// //     doc.moveDown(1);

// //     // Two Column Layout for Details
// //     const leftX = 50;
// //     const rightX = 320;
// //     const startY = doc.y;

// //     // Left Column - Ship-to Address
// //     doc.fontSize(11).font('Helvetica-Bold').fillColor('#059669');
// //     doc.text('SHIP-TO ADDRESS', leftX, startY);
// //     doc.fillColor('#000000');

// //     doc.rect(leftX, startY + 20, 240, 60).stroke('#CCCCCC');
// //     doc.fontSize(10).font('Helvetica');
// //     doc.text(deliveryNote.operatorChange.salesOrder.client, leftX + 10, startY + 30, { width: 220 });

// //     // Right Column - Document Details
// //     doc.fontSize(11).font('Helvetica-Bold').fillColor('#059669');
// //     doc.text('DOCUMENT DETAILS', rightX, startY);
// //     doc.fillColor('#000000');

// //     const detailsY = startY + 20;
// //     doc.rect(rightX, detailsY, 240, 90).stroke('#CCCCCC');

// //     doc.fontSize(9).font('Helvetica-Bold');
// //     doc.text('Delivery Note No.:', rightX + 10, detailsY + 10);
// //     doc.text('Delivery Date:', rightX + 10, detailsY + 30);
// //     doc.text('Order Reference No.:', rightX + 10, detailsY + 50);
// //     doc.text('Project Name:', rightX + 10, detailsY + 70);

// //     doc.font('Helvetica');
// //     doc.text(deliveryNote.dn_number, rightX + 130, detailsY + 10);
// //     doc.text(new Date(deliveryNote.delivery_date).toLocaleDateString('en-GB'), rightX + 130, detailsY + 30);
// //     doc.text(deliveryNote.operatorChange.salesOrder.so_number, rightX + 130, detailsY + 50);
// //     doc.text(deliveryNote.operatorChange.salesOrder.project_name || 'N/A', rightX + 130, detailsY + 70, { width: 100 });

// //     doc.y = startY + 120;
// //     doc.moveDown(1);

// //     // Operator Details Section
// //     doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
// //     doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#059669', '#059669');
// //     doc.text('OPERATOR DETAILS', leftX + 10, doc.y + 5);

// //     doc.fillColor('#000000');
// //     doc.moveDown(1.5);

// //     const operatorY = doc.y;
// //     doc.rect(leftX, operatorY, pageWidth - 100, 50).stroke('#CCCCCC');

// //     doc.fontSize(9).font('Helvetica-Bold');
// //     doc.text('Operator Name:', leftX + 10, operatorY + 10);
// //     doc.text('Employee Number:', leftX + 10, operatorY + 30);

// //     doc.font('Helvetica');
// //     doc.text(deliveryNote.operatorChange.newOperator.employeeFullName, leftX + 120, operatorY + 10);
// //     doc.text(deliveryNote.operatorChange.newOperator.employeeNo, leftX + 120, operatorY + 30);

// //     doc.y = operatorY + 60;
// //     doc.moveDown(1);

// //     // Equipment Details Section (if available)
// //     if (deliveryNote.operatorChange.equipment) {
// //       doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
// //       doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#059669', '#059669');
// //       doc.text('EQUIPMENT DETAILS', leftX + 10, doc.y + 5);

// //       doc.fillColor('#000000');
// //       doc.moveDown(1.5);

// //       const equipY = doc.y;
// //       doc.rect(leftX, equipY, pageWidth - 100, 50).stroke('#CCCCCC');

// //       doc.fontSize(9).font('Helvetica-Bold');
// //       doc.text('Plate Number:', leftX + 10, equipY + 10);
// //       doc.text('Vehicle Type:', leftX + 10, equipY + 30);

// //       doc.font('Helvetica');
// //       doc.text(deliveryNote.operatorChange.equipment.reg_number, leftX + 120, equipY + 10);
// //       doc.text(deliveryNote.operatorChange.equipment.vehicle_type, leftX + 120, equipY + 30);

// //       doc.y = equipY + 60;
// //       doc.moveDown(1);
// //     }

// //     // Transportation Details
// //     if (deliveryNote.trips && deliveryNote.trips.length > 0) {
// //       doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
// //       doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#059669', '#059669');
// //       doc.text('TRANSPORTATION DETAILS', leftX + 10, doc.y + 5);

// //       doc.fillColor('#000000');
// //       doc.moveDown(1.5);

// //       deliveryNote.trips.forEach((trip, index) => {
// //         const tripY = doc.y;
// //         const tripHeight = 100;

// //         // Add new page if needed
// //         if (tripY + tripHeight > pageHeight - 100) {
// //           doc.addPage();
// //           doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
// //           doc.y = 50;
// //         }

// //         doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke('#CCCCCC');

// //         doc.fontSize(10).font('Helvetica-Bold').fillColor('#059669');
// //         doc.text(`Trip ${trip.trip_number}`, leftX + 10, doc.y + 10);
// //         doc.fillColor('#000000');

// //         const tripDetailsY = doc.y + 30;
// //         doc.fontSize(9).font('Helvetica-Bold');
// //         doc.text('Company:', leftX + 10, tripDetailsY);
// //         doc.text('Driver:', leftX + 10, tripDetailsY + 15);
// //         doc.text('Contact:', leftX + 10, tripDetailsY + 30);
// //         doc.text('Vehicle Type:', leftX + 10, tripDetailsY + 45);
// //         doc.text('Vehicle No.:', leftX + 10, tripDetailsY + 60);

// //         doc.font('Helvetica');
// //         doc.text(trip.transportation_company, leftX + 100, tripDetailsY, { width: 200 });
// //         doc.text(trip.driver_name, leftX + 100, tripDetailsY + 15);
// //         doc.text(trip.driver_contact, leftX + 100, tripDetailsY + 30);
// //         doc.text(trip.vehicle_type || 'N/A', leftX + 100, tripDetailsY + 45);
// //         doc.text(trip.vehicle_number || 'N/A', leftX + 100, tripDetailsY + 60);

// //         if (trip.trip_date) {
// //           doc.font('Helvetica-Bold');
// //           doc.text('Trip Date:', rightX, tripDetailsY);
// //           doc.font('Helvetica');
// //           doc.text(new Date(trip.trip_date).toLocaleDateString('en-GB'), rightX + 80, tripDetailsY);
// //         }

// //         doc.y += tripHeight + 10;
// //       });
// //     }

// //     // Remarks Section
// //     if (deliveryNote.remarks) {
// //       doc.moveDown(1);
// //       doc.fontSize(11).font('Helvetica-Bold').fillColor('#059669');
// //       doc.text('REMARKS', leftX);
// //       doc.fillColor('#000000');

// //       doc.fontSize(9).font('Helvetica');
// //       doc.rect(leftX, doc.y + 5, pageWidth - 100, 40).stroke('#CCCCCC');
// //       doc.text(deliveryNote.remarks, leftX + 10, doc.y + 15, { width: pageWidth - 120 });
// //       doc.y += 50;
// //     }

// //     doc.moveDown(2);

// //     // Acknowledgement Box
// //     doc.rect(leftX, doc.y, pageWidth - 100, 30).fillAndStroke('#D1FAE5', '#CCCCCC');
// //     doc.fontSize(9).font('Helvetica-Oblique').fillColor('#000000');
// //     doc.text('We acknowledge that the operator has been received in good health and proper condition.',
// //       leftX + 10, doc.y + 10, { width: pageWidth - 120, align: 'center' });

// //     doc.moveDown(3);

// //     // Signature Section
// //     const sigY = doc.y;

// //     // Check if we need a new page
// //     if (sigY + 120 > pageHeight - 60) {
// //       doc.addPage();
// //       doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
// //       doc.y = 50;
// //     }

// //     doc.fontSize(10).font('Helvetica-Bold');

// //     // Left signature
// //     doc.text('Received By:', leftX, doc.y);
// //     doc.moveTo(leftX, doc.y + 50).lineTo(leftX + 200, doc.y + 50).stroke();
// //     doc.font('Helvetica').fontSize(8);
// //     doc.text('Name & Signature', leftX, doc.y + 55);

// //     // Right signature
// //     doc.font('Helvetica-Bold').fontSize(10);
// //     doc.text('Date:', rightX, sigY);
// //     doc.moveTo(rightX, sigY + 50).lineTo(rightX + 200, sigY + 50).stroke();
// //     doc.font('Helvetica').fontSize(8);
// //     doc.text('DD/MM/YYYY', rightX, sigY + 55);

// //     doc.moveDown(4);

// //     // Contact section
// //     doc.text('Contact No.:', leftX, doc.y);
// //     doc.moveTo(leftX, doc.y + 50).lineTo(leftX + 200, doc.y + 50).stroke();

// //     // Footer
// //     doc.fontSize(7).font('Helvetica-Oblique').fillColor('#666666');
// //     doc.text('This is a computer generated document. No signature is required.',
// //       0, pageHeight - 50, { align: 'center', width: pageWidth });

// //     doc.end();
// //   } catch (error) {
// //     console.error("Error generating operator delivery note PDF:", error);
// //     res.status(500).json({
// //       message: "Error generating operator delivery note PDF",
// //       error: error.message
// //     });
// //   }
// // };

// // // Generate operator off hire note PDF
// // const generateOperatorOffHireNotePDF = async (req, res) => {
// //   try {
// //     const { operator_ohn_id } = req.params;

// //     const offHireNote = await OperatorOffHireNoteModel.findByPk(operator_ohn_id, {
// //       include: [
// //         {
// //           model: OperatorOffHireNoteTripModel,
// //           as: "trips",
// //           order: [["trip_number", "ASC"]]
// //         },
// //         {
// //           model: OperatorChangeModel,
// //           as: "operatorChange",
// //           include: [
// //             {
// //               model: SalesOrdersModel,
// //               as: "salesOrder",
// //               attributes: ["so_number", "client", "project_name", "ordered_date", "lpo_number"]
// //             },
// //             {
// //               model: EquipmentModel,
// //               as: "equipment",
// //               attributes: ["serial_number", "reg_number", "vehicle_type"]
// //             },
// //             {
// //               model: ManpowerModel,
// //               as: "previousOperator",
// //               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
// //             }
// //           ]
// //         }
// //       ]
// //     });

// //     if (!offHireNote) {
// //       return res.status(404).json({ message: "Off hire note not found" });
// //     }

// //     // Update status to In Progress when PDF is generated
// //     await offHireNote.update({ status: "In Progress" });

// //     // Also update trips status
// //     await OperatorOffHireNoteTripModel.update(
// //       { trip_status: "In Progress" },
// //       {
// //         where: { operator_ohn_id, trip_status: "Creation" }
// //       }
// //     );

// //     // Generate PDF
// //     const doc = new PDFDocument({ margin: 40, size: "A4" });

// //     res.setHeader('Content-Type', 'application/pdf');
// //     res.setHeader('Content-Disposition', `attachment; filename="OP-OH-${offHireNote.ohn_number}.pdf"`);

// //     doc.pipe(res);

// //     // Add border to page
// //     const pageWidth = doc.page.width;
// //     const pageHeight = doc.page.height;
// //     doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

// //     // Company Header with Orange Background
// //     doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke('#EA580C', '#EA580C');

// //     doc.fontSize(22).font('Helvetica-Bold').fillColor('#FFFFFF')
// //       .text('Auto Xpert Trading and Service WLL', 50, 55, { align: 'center' })
// //       .fontSize(9).font('Helvetica')
// //       .text('Office No 11, 2nd Floor, Building No.207, Street 995, Zone 56', 50, 82, { align: 'center' })
// //       .text('Doha, Qatar | Tel: 44581071 | Email: info@autoxpert.qa', 50, 95, { align: 'center' });

// //     doc.fillColor('#000000');

// //     // Document Title
// //     doc.moveDown(3);
// //     doc.fontSize(18).font('Helvetica-Bold').fillColor('#EA580C')
// //       .text('OPERATOR OFF HIRE NOTE', { align: 'center' })
// //       .fillColor('#000000');

// //     doc.moveDown(1);
// //     doc.moveTo(100, doc.y).lineTo(pageWidth - 100, doc.y).stroke('#EA580C');
// //     doc.moveDown(1);

// //     // Two Column Layout for Details
// //     const leftX = 50;
// //     const rightX = 320;
// //     const startY = doc.y;

// //     // Left Column - Client Information
// //     doc.fontSize(11).font('Helvetica-Bold').fillColor('#EA580C');
// //     doc.text('CLIENT INFORMATION', leftX, startY);
// //     doc.fillColor('#000000');

// //     doc.rect(leftX, startY + 20, 240, 60).stroke('#CCCCCC');
// //     doc.fontSize(10).font('Helvetica');
// //     doc.text(offHireNote.operatorChange.salesOrder.client, leftX + 10, startY + 30, { width: 220 });

// //     // Right Column - Document Details
// //     doc.fontSize(11).font('Helvetica-Bold').fillColor('#EA580C');
// //     doc.text('DOCUMENT DETAILS', rightX, startY);
// //     doc.fillColor('#000000');

// //     const detailsY = startY + 20;
// //     doc.rect(rightX, detailsY, 240, 90).stroke('#CCCCCC');

// //     doc.fontSize(9).font('Helvetica-Bold');
// //     doc.text('Off Hire Note No.:', rightX + 10, detailsY + 10);
// //     doc.text('Off Hire Date:', rightX + 10, detailsY + 30);
// //     doc.text('Order Reference No.:', rightX + 10, detailsY + 50);
// //     doc.text('Project Name:', rightX + 10, detailsY + 70);

// //     doc.font('Helvetica');
// //     doc.text(offHireNote.ohn_number, rightX + 130, detailsY + 10);
// //     doc.text(new Date(offHireNote.off_hire_date).toLocaleDateString('en-GB'), rightX + 130, detailsY + 30);
// //     doc.text(offHireNote.operatorChange.salesOrder.so_number, rightX + 130, detailsY + 50);
// //     doc.text(offHireNote.operatorChange.salesOrder.project_name || 'N/A', rightX + 130, detailsY + 70, { width: 100 });

// //     doc.y = startY + 120;
// //     doc.moveDown(1);

// //     // Operator Details Section
// //     doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
// //     doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#EA580C', '#EA580C');
// //     doc.text('OPERATOR DETAILS', leftX + 10, doc.y + 5);

// //     doc.fillColor('#000000');
// //     doc.moveDown(1.5);

// //     const operatorY = doc.y;
// //     doc.rect(leftX, operatorY, pageWidth - 100, 50).stroke('#CCCCCC');

// //     doc.fontSize(9).font('Helvetica-Bold');
// //     doc.text('Operator Name:', leftX + 10, operatorY + 10);
// //     doc.text('Employee Number:', leftX + 10, operatorY + 30);

// //     doc.font('Helvetica');
// //     doc.text(offHireNote.operatorChange.previousOperator.employeeFullName, leftX + 120, operatorY + 10);
// //     doc.text(offHireNote.operatorChange.previousOperator.employeeNo, leftX + 120, operatorY + 30);

// //     doc.y = operatorY + 60;
// //     doc.moveDown(1);

// //     // Equipment Details Section (if available)
// //     if (offHireNote.operatorChange.equipment) {
// //       doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
// //       doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#EA580C', '#EA580C');
// //       doc.text('EQUIPMENT DETAILS', leftX + 10, doc.y + 5);

// //       doc.fillColor('#000000');
// //       doc.moveDown(1.5);

// //       const equipY = doc.y;
// //       doc.rect(leftX, equipY, pageWidth - 100, 50).stroke('#CCCCCC');

// //       doc.fontSize(9).font('Helvetica-Bold');
// //       doc.text('Plate Number:', leftX + 10, equipY + 10);
// //       doc.text('Vehicle Type:', leftX + 10, equipY + 30);

// //       doc.font('Helvetica');
// //       doc.text(offHireNote.operatorChange.equipment.reg_number, leftX + 120, equipY + 10);
// //       doc.text(offHireNote.operatorChange.equipment.vehicle_type, leftX + 120, equipY + 30);

// //       doc.y = equipY + 60;
// //       doc.moveDown(1);
// //     }

// //     // Transportation Details
// //     if (offHireNote.trips && offHireNote.trips.length > 0) {
// //       doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
// //       doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#EA580C', '#EA580C');
// //       doc.text('TRANSPORTATION DETAILS', leftX + 10, doc.y + 5);

// //       doc.fillColor('#000000');
// //       doc.moveDown(1.5);

// //       offHireNote.trips.forEach((trip, index) => {
// //         const tripY = doc.y;
// //         const tripHeight = 100;

// //         // Add new page if needed
// //         if (tripY + tripHeight > pageHeight - 100) {
// //           doc.addPage();
// //           doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
// //           doc.y = 50;
// //         }

// //         doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke('#CCCCCC');

// //         doc.fontSize(10).font('Helvetica-Bold').fillColor('#EA580C');
// //         doc.text(`Trip ${trip.trip_number}`, leftX + 10, doc.y + 10);
// //         doc.fillColor('#000000');

// //         const tripDetailsY = doc.y + 30;
// //         doc.fontSize(9).font('Helvetica-Bold');
// //         doc.text('Company:', leftX + 10, tripDetailsY);
// //         doc.text('Driver:', leftX + 10, tripDetailsY + 15);
// //         doc.text('Contact:', leftX + 10, tripDetailsY + 30);
// //         doc.text('Vehicle Type:', leftX + 10, tripDetailsY + 45);
// //         doc.text('Vehicle No.:', leftX + 10, tripDetailsY + 60);

// //         doc.font('Helvetica');
// //         doc.text(trip.transportation_company, leftX + 100, tripDetailsY, { width: 200 });
// //         doc.text(trip.driver_name, leftX + 100, tripDetailsY + 15);
// //         doc.text(trip.driver_contact, leftX + 100, tripDetailsY + 30);
// //         doc.text(trip.vehicle_type || 'N/A', leftX + 100, tripDetailsY + 45);
// //         doc.text(trip.vehicle_number || 'N/A', leftX + 100, tripDetailsY + 60);

// //         if (trip.trip_date) {
// //           doc.font('Helvetica-Bold');
// //           doc.text('Trip Date:', rightX, tripDetailsY);
// //           doc.font('Helvetica');
// //           doc.text(new Date(trip.trip_date).toLocaleDateString('en-GB'), rightX + 80, tripDetailsY);
// //         }

// //         doc.y += tripHeight + 10;
// //       });
// //     }

// //     // Remarks Section
// //     if (offHireNote.remarks) {
// //       doc.moveDown(1);
// //       doc.fontSize(11).font('Helvetica-Bold').fillColor('#EA580C');
// //       doc.text('REMARKS', leftX);
// //       doc.fillColor('#000000');

// //       doc.fontSize(9).font('Helvetica');
// //       doc.rect(leftX, doc.y + 5, pageWidth - 100, 40).stroke('#CCCCCC');
// //       doc.text(offHireNote.remarks, leftX + 10, doc.y + 15, { width: pageWidth - 120 });
// //       doc.y += 50;
// //     }

// //     doc.moveDown(2);

// //     // Acknowledgement Box
// //     doc.rect(leftX, doc.y, pageWidth - 100, 30).fillAndStroke('#FFEDD5', '#CCCCCC');
// //     doc.fontSize(9).font('Helvetica-Oblique').fillColor('#000000');
// //     doc.text('We acknowledge that the operator has been returned in good health and proper condition.',
// //       leftX + 10, doc.y + 10, { width: pageWidth - 120, align: 'center' });

// //     doc.moveDown(3);

// //     // Signature Section
// //     const sigY = doc.y;

// //     // Check if we need a new page
// //     if (sigY + 120 > pageHeight - 60) {
// //       doc.addPage();
// //       doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
// //       doc.y = 50;
// //     }

// //     doc.fontSize(10).font('Helvetica-Bold');

// //     // Left signature
// //     doc.text('Received By:', leftX, doc.y);
// //     doc.moveTo(leftX, doc.y + 50).lineTo(leftX + 200, doc.y + 50).stroke();
// //     doc.font('Helvetica').fontSize(8);
// //     doc.text('Name & Signature', leftX, doc.y + 55);

// //     // Right signature
// //     doc.font('Helvetica-Bold').fontSize(10);
// //     doc.text('Date:', rightX, sigY);
// //     doc.moveTo(rightX, sigY + 50).lineTo(rightX + 200, sigY + 50).stroke();
// //     doc.font('Helvetica').fontSize(8);
// //     doc.text('DD/MM/YYYY', rightX, sigY + 55);

// //     doc.moveDown(4);

// //     // Contact section
// //     doc.text('Contact No.:', leftX, doc.y);
// //     doc.moveTo(leftX, doc.y + 50).lineTo(leftX + 200, doc.y + 50).stroke();

// //     // Footer
// //     doc.fontSize(7).font('Helvetica-Oblique').fillColor('#666666');
// //     doc.text('This is a computer generated document. No signature is required.',
// //       0, pageHeight - 50, { align: 'center', width: pageWidth });

// //     doc.end();
// //   } catch (error) {
// //     console.error("Error generating operator off hire note PDF:", error);
// //     res.status(500).json({
// //       message: "Error generating operator off hire note PDF",
// //       error: error.message
// //     });
// //   }
// // };

// // // Upload operator delivery note attachment
// // const uploadOperatorDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { operator_dn_id } = req.params;

// //     if (!req.file) {
// //       await transaction.rollback();
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const file = req.file;
// //     const fileName = file.filename;

// //     // Update delivery note with file path
// //     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(operator_dn_id, { transaction });
// //     if (!deliveryNote) {
// //       fs.unlinkSync(file.path);
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     // Update status to Delivered
// //     await deliveryNote.update({
// //       delivery_attachment: fileName,
// //       status: "Delivered"
// //     }, { transaction });

// //     // Update all trips status to Delivered
// //     await OperatorDeliveryNoteTripModel.update(
// //       { trip_status: "Delivered" },
// //       {
// //         where: { operator_dn_id },
// //         transaction
// //       }
// //     );

// //     // Update operator change status
// //     const operatorChange = await OperatorChangeModel.findByPk(deliveryNote.operator_change_id, { transaction });
// //     if (operatorChange) {
// //       await operatorChange.update({
// //         delivery_note_status: "Completed",
// //         overall_status: operatorChange.off_hire_note_status === "Completed" ? "Completed" : "In Progress"
// //       }, { transaction });
// //     }

// //     await transaction.commit();

// //     res.status(200).json({
// //       success: true,
// //       message: "Delivery note uploaded successfully",
// //       fileName,
// //       status: "Delivered"
// //     });
// //   } catch (error) {
// //     await transaction.rollback();

// //     // Clean up uploaded file if there's an error
// //     if (req.file && fs.existsSync(req.file.path)) {
// //       fs.unlinkSync(req.file.path);
// //     }

// //     console.error("Error uploading delivery note:", error);
// //     res.status(500).json({
// //       message: "Error uploading delivery note",
// //       error: error.message
// //     });
// //   }
// // };

// // // Upload operator off hire note attachment
// // const uploadOperatorOffHireNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { operator_ohn_id } = req.params;

// //     if (!req.file) {
// //       await transaction.rollback();
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const file = req.file;
// //     const fileName = file.filename;

// //     // Update off hire note with file path
// //     const offHireNote = await OperatorOffHireNoteModel.findByPk(operator_ohn_id, { transaction });
// //     if (!offHireNote) {
// //       if (fs.existsSync(file.path)) {
// //         fs.unlinkSync(file.path);
// //       }
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Off hire note not found" });
// //     }

// //     // Update status to Completed
// //     await offHireNote.update({
// //       off_hire_attachment: fileName,
// //       status: "Completed"
// //     }, { transaction });

// //     // Update all trips status to Completed
// //     await OperatorOffHireNoteTripModel.update(
// //       { trip_status: "Completed" },
// //       {
// //         where: { operator_ohn_id },
// //         transaction
// //       }
// //     );

// //     // Update operator change status
// //     const operatorChange = await OperatorChangeModel.findByPk(offHireNote.operator_change_id, { transaction });
// //     if (operatorChange) {
// //       await operatorChange.update({
// //         off_hire_note_status: "Completed",
// //         overall_status: operatorChange.delivery_note_status === "Completed" ? "Completed" : "In Progress"
// //       }, { transaction });
// //     }

// //     await transaction.commit();

// //     res.status(200).json({
// //       success: true,
// //       message: "Off hire note uploaded successfully",
// //       fileName,
// //       status: "Completed"
// //     });
// //   } catch (error) {
// //     await transaction.rollback();

// //     // Clean up uploaded file if there's an error
// //     if (req.file && fs.existsSync(req.file.path)) {
// //       fs.unlinkSync(req.file.path);
// //     }

// //     console.error("Error uploading off hire note:", error);
// //     res.status(500).json({
// //       message: "Error uploading off hire note",
// //       error: error.message
// //     });
// //   }
// // };

// // // Add trip to operator delivery note
// // const addTripToOperatorDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { operator_dn_id } = req.params;
// //     const {
// //       transportation_company,
// //       driver_name,
// //       driver_contact,
// //       vehicle_type,
// //       vehicle_number,
// //       trip_date,
// //       remarks
// //     } = req.body;

// //     // Get delivery note
// //     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(operator_dn_id, { transaction });
// //     if (!deliveryNote) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     // Get next trip number
// //     const existingTrips = await OperatorDeliveryNoteTripModel.findAll({
// //       where: { operator_dn_id },
// //       transaction
// //     });

// //     const nextTripNumber = existingTrips.length + 1;

// //     // Create new trip
// //     const newTrip = await OperatorDeliveryNoteTripModel.create({
// //       operator_dn_id,
// //       trip_number: nextTripNumber,
// //       transportation_company,
// //       driver_name,
// //       driver_contact,
// //       vehicle_type,
// //       vehicle_number,
// //       trip_date,
// //       trip_status: "Creation",
// //       remarks
// //     }, { transaction });

// //     await transaction.commit();

// //     res.status(201).json({
// //       message: "Trip added successfully to operator delivery note",
// //       trip: newTrip
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error adding trip to operator delivery note:", error);
// //     res.status(500).json({
// //       message: "Error adding trip to operator delivery note",
// //       error: error.message
// //     });
// //   }
// // };

// // // Add trip to operator off hire note
// // const addTripToOperatorOffHireNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { operator_ohn_id } = req.params;
// //     const {
// //       transportation_company,
// //       driver_name,
// //       driver_contact,
// //       vehicle_type,
// //       vehicle_number,
// //       trip_date,
// //       remarks
// //     } = req.body;

// //     // Get off hire note
// //     const offHireNote = await OperatorOffHireNoteModel.findByPk(operator_ohn_id, { transaction });
// //     if (!offHireNote) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Off hire note not found" });
// //     }

// //     // Get next trip number
// //     const existingTrips = await OperatorOffHireNoteTripModel.findAll({
// //       where: { operator_ohn_id },
// //       transaction
// //     });

// //     const nextTripNumber = existingTrips.length + 1;

// //     // Create new trip
// //     const newTrip = await OperatorOffHireNoteTripModel.create({
// //       operator_ohn_id,
// //       trip_number: nextTripNumber,
// //       transportation_company,
// //       driver_name,
// //       driver_contact,
// //       vehicle_type,
// //       vehicle_number,
// //       trip_date,
// //       trip_status: "Creation",
// //       remarks
// //     }, { transaction });

// //     await transaction.commit();

// //     res.status(201).json({
// //       message: "Trip added successfully to operator off hire note",
// //       trip: newTrip
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error adding trip to operator off hire note:", error);
// //     res.status(500).json({
// //       message: "Error adding trip to operator off hire note",
// //       error: error.message
// //     });
// //   }
// // };

// // module.exports = {
// //   getAllEquipmentForOperator,
// //   getManpowerByOperatorType,
// //   getAllOperatorTypes,
// //   createOperatorChange,
// //   getOperatorChangesBySalesOrder,
// //   getOperatorChangeById,
// //   createOperatorDeliveryNote,
// //   createOperatorOffHireNote,
// //   getOperatorDeliveryNoteSummary,
// //   getOperatorOffHireNoteSummary,
// //   generateOperatorDeliveryNotePDF,
// //   generateOperatorOffHireNotePDF,
// //   uploadOperatorDeliveryNote,
// //   uploadOperatorOffHireNote,
// //   addTripToOperatorDeliveryNote,
// //   addTripToOperatorOffHireNote,
// //   getOperatorSwapReasons,
// // };

// // controllers/fleet-management/OperatorChangeController.js (FULLY UPDATED with all missing functions)
// const OperatorChangeModel = require("../../models/fleet-management/OperatorChangeModel");
// const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
// const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// const {
//   OperatorDeliveryNoteModel,
//   OperatorDeliveryNoteTripModel,
//   OperatorDNManpowerModel
// } = require("../../models/fleet-management/OperatorDeliveryNoteModel");
// const {
//   OperatorOffHireNoteModel,
//   OperatorOffHireNoteTripModel,
//   OperatorOHNManpowerModel
// } = require("../../models/fleet-management/OperatorOffHireNoteModel");
// const OperatorTypeModel = require("../../models/fleet-management/OperatorTypeModel");
// const sequelize = require("../../config/dbSync");
// const { Op } = require("sequelize");
// const UsersModel = require("../../models/user-security-management/UsersModel");
// const SwapReasonModel = require("../../models/fleet-management/swapReasonModel");
// const path = require("path");
// const fs = require("fs");
// const PDFDocument = require("pdfkit");

// // ==================== UTILITY FUNCTIONS ====================

// const generateOperatorDNNumber = async () => {
//   const currentYear = new Date().getFullYear();
//   const prefix = `OP-DN-${currentYear}-`;

//   const lastDN = await OperatorDeliveryNoteModel.findOne({
//     where: { dn_number: { [Op.like]: `${prefix}%` } },
//     order: [["dn_number", "DESC"]],
//   });

//   let nextNumber = 1;
//   if (lastDN) {
//     const parts = lastDN.dn_number.split("-");
//     const lastNumber = parseInt(parts[parts.length - 1]);
//     if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
//   }

//   return `${prefix}${String(nextNumber).padStart(4, "0")}`;
// };

// const generateOperatorOHNNumber = async () => {
//   const currentYear = new Date().getFullYear();
//   const prefix = `OP-OH-${currentYear}-`;

//   const lastOHN = await OperatorOffHireNoteModel.findOne({
//     where: { ohn_number: { [Op.like]: `${prefix}%` } },
//     order: [["ohn_number", "DESC"]],
//   });

//   let nextNumber = 1;
//   if (lastOHN) {
//     const parts = lastOHN.ohn_number.split("-");
//     const lastNumber = parseInt(parts[parts.length - 1]);
//     if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
//   }

//   return `${prefix}${String(nextNumber).padStart(4, "0")}`;
// };

// const getUsername = async (req) => {
//   try {
//     if (req.user?.uid) {
//       const user = await UsersModel.findByPk(req.user.uid);
//       if (user) return user.username;
//     }
//     return req.user?.username || "System";
//   } catch {
//     return "System";
//   }
// };

// // ─── Helper: generate a human-readable group ID ────────────────────────────
// // Format: OP-YYYYMMDD-XXXX  (e.g. OP-20260224-C1E5)
// const generateChangeGroupId = (prefix = "OP") => {
//   const now = new Date();
//   const datePart = now
//     .toISOString()
//     .slice(0, 10)
//     .replace(/-/g, ""); // "20260224"
//   const randomPart = Math.random()
//     .toString(36)
//     .toUpperCase()
//     .slice(2, 6); // 4 random alphanumeric chars
//   return `${prefix}-${datePart}-${randomPart}`;
// };

// /**
//  * Helper function to update operator change status after note creation
//  */
// const updateOperatorChangeStatusAfterNoteCreation = async (operatorChange, noteType, noteId, transaction) => {
//   try {
//     if (!operatorChange.change_group_id) {
//       // No group ID - simple update
//       const updateData = {};
//       if (noteType === "DELIVERY") {
//         updateData.delivery_note_status = "In Progress";
//       } else {
//         updateData.off_hire_note_status = "In Progress";
//       }
//       updateData.overall_status = "In progress";

//       await OperatorChangeModel.update(updateData, {
//         where: { operator_change_id: operatorChange.operator_change_id },
//         transaction,
//       });
//       return;
//     }

//     // Get all changes in the same group
//     const groupChanges = await OperatorChangeModel.findAll({
//       where: {
//         change_group_id: operatorChange.change_group_id,
//       },
//       transaction,
//     });

//     const currentChange = groupChanges.find(
//       (c) => c.operator_change_id === operatorChange.operator_change_id
//     );

//     if (!currentChange) return;

//     // Find the partner change (opposite type)
//     const partnerChange = groupChanges.find(
//       (c) => c.change_type !== currentChange.change_type
//     );

//     if (!partnerChange) {
//       // No partner - just update this one
//       const updateData = {};
//       if (noteType === "DELIVERY") {
//         updateData.delivery_note_status = "In Progress";
//       } else {
//         updateData.off_hire_note_status = "In Progress";
//       }
//       updateData.overall_status = "In progress";

//       await OperatorChangeModel.update(updateData, {
//         where: { operator_change_id: currentChange.operator_change_id },
//         transaction,
//       });
//       return;
//     }

//     // Check if partner already has a note
//     let partnerHasNote = false;
//     if (partnerChange.change_type === "DELIVERY") {
//       const partnerNote = await OperatorDeliveryNoteModel.findOne({
//         where: { operator_change_id: partnerChange.operator_change_id },
//         transaction,
//       });
//       partnerHasNote = !!partnerNote;
//     } else {
//       const partnerNote = await OperatorOffHireNoteModel.findOne({
//         where: { operator_change_id: partnerChange.operator_change_id },
//         transaction,
//       });
//       partnerHasNote = !!partnerNote;
//     }

//     // Update current change
//     const currentUpdate = {};
//     if (noteType === "DELIVERY") {
//       currentUpdate.delivery_note_status = "In Progress";
//     } else {
//       currentUpdate.off_hire_note_status = "In Progress";
//     }

//     if (partnerHasNote) {
//       // Both notes exist - mark both as Completed
//       currentUpdate.overall_status = "Completed";

//       // Update partner as Completed
//       const partnerUpdate = { overall_status: "Completed" };
//       await OperatorChangeModel.update(partnerUpdate, {
//         where: { operator_change_id: partnerChange.operator_change_id },
//         transaction,
//       });
//     } else {
//       // Only this note exists - mark as Partially completed
//       currentUpdate.overall_status = "Partially completed";
//     }

//     await OperatorChangeModel.update(currentUpdate, {
//       where: { operator_change_id: currentChange.operator_change_id },
//       transaction,
//     });

//   } catch (error) {
//     console.error("Error updating operator change status:", error);
//     throw error;
//   }
// };

// // ==================== SWAP REASONS FUNCTIONS ====================

// const getOperatorSwapReasons = async (req, res) => {
//   try {
//     const swapReasons = await SwapReasonModel.findAll({
//       where: {
//         category: "Operator",
//         status: "Active"
//       },
//       attributes: ["swap_reason_id", "swap_reason_name"],
//       order: [["swap_reason_name", "ASC"]]
//     });

//     res.status(200).json({
//       success: true,
//       swapReasons
//     });
//   } catch (error) {
//     console.error("Error fetching operator swap reasons:", error);
//     res.status(500).json({
//       message: "Error fetching operator swap reasons",
//       error: error.message
//     });
//   }
// };

// // ==================== DROPDOWN FUNCTIONS ====================

// const getAllEquipmentForOperator = async (req, res) => {
//   try {
//     const equipment = await EquipmentModel.findAll({
//       where: { status: "Active" },
//       attributes: ["serial_number", "reg_number", "vehicle_type"],
//       order: [["reg_number", "ASC"]],
//     });

//     res.status(200).json({
//       success: true,
//       equipment
//     });
//   } catch (error) {
//     console.error("Error fetching equipment:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getManpowerByOperatorType = async (req, res) => {
//   try {
//     const { operator_type } = req.query;

//     const whereClause = { status: "Active" };
//     if (operator_type) {
//       whereClause.operator_type_id = operator_type;
//     }

//     const manpower = await ManpowerModel.findAll({
//       where: whereClause,
//       include: [{
//         model: OperatorTypeModel,
//         as: "operator_type",
//         attributes: ["operator_type_id", "operator_type"]
//       }],
//       attributes: ["manpower_id", "employeeId", "employeeNo", "employeeFullName", "operator_type_id"],
//       order: [["employeeFullName", "ASC"]],
//     });

//     res.status(200).json({
//       success: true,
//       manpower: manpower.map(mp => ({
//         manpower_id: mp.manpower_id,
//         employeeId: mp.employeeId,
//         employeeNo: mp.employeeNo,
//         employeeFullName: mp.employeeFullName,
//         operator_type: mp.operator_type?.operator_type || 'N/A'
//       }))
//     });
//   } catch (error) {
//     console.error("Error fetching manpower:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getAllOperatorTypes = async (req, res) => {
//   try {
//     const operatorTypes = await OperatorTypeModel.findAll({
//       where: { status: "Active" },
//       attributes: ["operator_type_id", "operator_type"],
//       order: [["operator_type", "ASC"]],
//     });

//     res.status(200).json({
//       success: true,
//       operatorTypes
//     });
//   } catch (error) {
//     console.error("Error fetching operator types:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ==================== OPERATOR CHANGE CREATION ====================

// const createOperatorChange = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const {
//       sales_order_id,
//       allocation_id,
//       equipment_serial_number,
//       plate_number,
//       previous_operator_id,
//       new_operator_id,
//       operator_type,
//       change_date,
//       change_reason,
//       change_estimated_transfer_cost,
//       change_remark,
//     } = req.body;

//     console.log("Received operator change payload:", {
//       sales_order_id,
//       allocation_id,
//       equipment_serial_number,
//       plate_number,
//       previous_operator_id,
//       new_operator_id,
//       operator_type,
//       change_date,
//       change_reason,
//     });

//     // Validate required fields
//     const missingFields = [];
//     if (!sales_order_id) missingFields.push("sales_order_id");
//     if (!new_operator_id) missingFields.push("new_operator_id");
//     if (!change_date) missingFields.push("change_date");
//     if (!change_reason) missingFields.push("change_reason");

//     if (missingFields.length > 0) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "All required fields must be filled",
//         missingFields,
//         receivedData: req.body,
//       });
//     }

//     // Get sales order
//     const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
//     if (!salesOrder) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Sales order not found" });
//     }

//     // Derive previous_operator_id from allocation if not provided
//     let derivedPreviousOperatorId = previous_operator_id;
//     let previousEmployeeId = null;

//     if (allocation_id && !derivedPreviousOperatorId) {
//       const ActiveAllocationManpowerModel = require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationManpowerModel;

//       const currentAllocation = await ActiveAllocationManpowerModel.findOne({
//         where: { allocation_id },
//         transaction,
//       });

//       if (currentAllocation) {
//         previousEmployeeId = currentAllocation.employee_id;

//         const currentOperator = await ManpowerModel.findOne({
//           where: { employeeId: previousEmployeeId },
//           transaction,
//         });

//         if (currentOperator) {
//           derivedPreviousOperatorId = currentOperator.manpower_id;
//           console.log(
//             "Derived previous operator ID from allocation:",
//             derivedPreviousOperatorId,
//           );
//         }
//       }
//     }

//     if (!derivedPreviousOperatorId) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message:
//           "Unable to determine previous operator. Please ensure allocation has an assigned operator or provide previous_operator_id.",
//         allocation_id,
//       });
//     }

//     // Get previous operator details
//     const previousOperator = await ManpowerModel.findOne({
//       where: { manpower_id: derivedPreviousOperatorId },
//       include: [{ model: OperatorTypeModel, as: "operator_type" }],
//       transaction,
//     });

//     if (!previousOperator) {
//       await transaction.rollback();
//       return res.status(404).json({
//         message: "Previous operator not found",
//         previous_operator_id: derivedPreviousOperatorId,
//       });
//     }

//     // Get new operator details
//     const newOperator = await ManpowerModel.findOne({
//       where: { manpower_id: new_operator_id },
//       include: [{ model: OperatorTypeModel, as: "operator_type" }],
//       transaction,
//     });

//     if (!newOperator) {
//       await transaction.rollback();
//       return res.status(404).json({
//         message: "New operator not found",
//         new_operator_id,
//       });
//     }

//     // Validate operators are different
//     if (derivedPreviousOperatorId === new_operator_id) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "New operator must be different from previous operator",
//       });
//     }

//     // Get logged in user
//     let username = "System";
//     if (req.user?.uid) {
//       const user = await UsersModel.findByPk(req.user.uid, { transaction });
//       if (user) {
//         username = user.username;
//       }
//     }

//     const finalOperatorType =
//       operator_type ||
//       newOperator.operator_type?.operator_type ||
//       previousOperator.operator_type?.operator_type;

//     // Generate one shared group ID for both records of this change operation
//     const changeGroupId = generateChangeGroupId("OP");

//     // CREATE RECORD 1: OFF_HIRE — for the outgoing/previous operator
//     const offHireRecord = await OperatorChangeModel.create(
//       {
//         change_group_id: changeGroupId,
//         sales_order_id,
//         allocation_id: allocation_id || null,
//         equipment_serial_number: equipment_serial_number || null,
//         plate_number: plate_number || null,
//         previous_operator_id: derivedPreviousOperatorId,
//         previous_operator_name: previousOperator.employeeFullName,
//         new_operator_id: null,
//         new_operator_name: null,
//         operator_type: finalOperatorType,
//         change_date,
//         change_reason,
//         change_estimated_transfer_cost: change_estimated_transfer_cost || null,
//         change_remark: change_remark || null,
//         change_type: "OFF_HIRE",
//         delivery_note_status: "Pending",
//         off_hire_note_status: "Pending",
//         overall_status: "Creation",
//         created_by: username,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       { transaction },
//     );

//     // CREATE RECORD 2: DELIVERY — for the incoming/new operator
//     const deliveryRecord = await OperatorChangeModel.create(
//       {
//         change_group_id: changeGroupId,
//         sales_order_id,
//         allocation_id: allocation_id || null,
//         equipment_serial_number: equipment_serial_number || null,
//         plate_number: plate_number || null,
//         previous_operator_id: null,
//         previous_operator_name: null,
//         new_operator_id,
//         new_operator_name: newOperator.employeeFullName,
//         operator_type: finalOperatorType,
//         change_date,
//         change_reason,
//         change_estimated_transfer_cost: change_estimated_transfer_cost || null,
//         change_remark: change_remark || null,
//         change_type: "DELIVERY",
//         delivery_note_status: "Pending",
//         off_hire_note_status: "Pending",
//         overall_status: "Creation",
//         created_by: username,
//         created_at: new Date(),
//         updated_at: new Date(),
//       },
//       { transaction },
//     );

//     // Update allocation if allocation_id is provided
//     if (allocation_id) {
//       const ActiveAllocationManpowerModel = require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationManpowerModel;

//       const updateResult = await ActiveAllocationManpowerModel.update(
//         {
//           employee_id: newOperator.employeeId,
//           updated_at: new Date(),
//         },
//         {
//           where: {
//             allocation_id: allocation_id,
//             employee_id: previousOperator.employeeId,
//           },
//           transaction,
//         },
//       );

//       console.log("Allocation manpower update result:", updateResult);

//       if (updateResult[0] === 0) {
//         console.warn("Warning: No allocation manpower records were updated.");
//       }
//     }

//     await transaction.commit();

//     console.log(
//       "Operator change created successfully with two records:",
//       {
//         changeGroupId,
//         offHireId: offHireRecord.operator_change_id,
//         deliveryId: deliveryRecord.operator_change_id,
//       },
//     );

//     res.status(201).json({
//       message: "Operator change created successfully",
//       change_group_id: changeGroupId,
//       data: {
//         changeGroupId,
//         offHireRecord,
//         deliveryRecord,
//         previousOperator: {
//           manpower_id: previousOperator.manpower_id,
//           employee_id: previousOperator.employeeId,
//           name: previousOperator.employeeFullName,
//           employee_no: previousOperator.employeeNo,
//         },
//         newOperator: {
//           manpower_id: newOperator.manpower_id,
//           employee_id: newOperator.employeeId,
//           name: newOperator.employeeFullName,
//           employee_no: newOperator.employeeNo,
//         },
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error creating operator change:", error);
//     console.error("Error stack:", error.stack);

//     res.status(500).json({
//       message: "Error creating operator change",
//       error: error.message,
//       details:
//         process.env.NODE_ENV === "development" ? error.stack : undefined,
//     });
//   }
// };

// // ==================== GET FUNCTIONS ====================

// const getOperatorChangeById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const operatorChange = await OperatorChangeModel.findByPk(id, {
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"]
//         },
//         {
//           model: EquipmentModel,
//           as: "equipment",
//           attributes: ["serial_number", "reg_number", "vehicle_type"]
//         },
//         {
//           model: ManpowerModel,
//           as: "previousOperator",
//           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//         },
//         {
//           model: ManpowerModel,
//           as: "newOperator",
//           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//         },
//         {
//           model: OperatorDeliveryNoteModel,
//           as: "deliveryNotes",
//           include: [{
//             model: OperatorDeliveryNoteTripModel,
//             as: "trips",
//             include: [{
//               model: OperatorDNManpowerModel,
//               as: "manpower"
//             }]
//           }],
//           order: [["created_at", "DESC"]]
//         },
//         {
//           model: OperatorOffHireNoteModel,
//           as: "offHireNotes",
//           include: [{
//             model: OperatorOffHireNoteTripModel,
//             as: "trips",
//             include: [{
//               model: OperatorOHNManpowerModel,
//               as: "manpower"
//             }]
//           }],
//           order: [["created_at", "DESC"]]
//         }
//       ]
//     });

//     if (!operatorChange) {
//       return res.status(404).json({ message: "Operator change not found" });
//     }

//     res.status(200).json({
//       operatorChange
//     });
//   } catch (error) {
//     console.error("Error fetching operator change:", error);
//     res.status(500).json({
//       message: "Error fetching operator change",
//       error: error.message
//     });
//   }
// };

// const getOperatorChangesBySalesOrder = async (req, res) => {
//   try {
//     const { sales_order_id } = req.params;

//     const operatorChanges = await OperatorChangeModel.findAll({
//       where: { sales_order_id },
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"]
//         },
//         {
//           model: EquipmentModel,
//           as: "equipment",
//           attributes: ["serial_number", "reg_number", "vehicle_type"]
//         },
//         {
//           model: ManpowerModel,
//           as: "previousOperator",
//           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//         },
//         {
//           model: ManpowerModel,
//           as: "newOperator",
//           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//         },
//         {
//           model: OperatorDeliveryNoteModel,
//           as: "deliveryNotes",
//           order: [["created_at", "DESC"]]
//         },
//         {
//           model: OperatorOffHireNoteModel,
//           as: "offHireNotes",
//           order: [["created_at", "DESC"]]
//         }
//       ],
//       order: [["created_at", "DESC"]]
//     });

//     res.status(200).json({
//       totalCount: operatorChanges.length,
//       operatorChanges
//     });
//   } catch (error) {
//     console.error("Error fetching operator changes:", error);
//     res.status(500).json({
//       message: "Error fetching operator changes",
//       error: error.message
//     });
//   }
// };

// // ==================== DELIVERY NOTE FUNCTIONS ====================

// const createOperatorDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_change_id } = req.params;
//     const { delivery_date, remarks, trips } = req.body;

//     // Get operator change
//     const operatorChange = await OperatorChangeModel.findByPk(operator_change_id, {
//       include: [
//         {
//           model: ManpowerModel,
//           as: "newOperator",
//           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//         },
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"]
//         }
//       ]
//     });

//     if (!operatorChange) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Operator change not found" });
//     }

//     // Generate DN number
//     const dn_number = await generateOperatorDNNumber();

//     // Get logged in user
//     let username = await getUsername(req);

//     // Create delivery note
//     const deliveryNote = await OperatorDeliveryNoteModel.create({
//       operator_change_id,
//       dn_number,
//       new_operator_id: operatorChange.new_operator_id,
//       new_operator_name: operatorChange.new_operator_name,
//       delivery_date,
//       status: "Creation",
//       remarks,
//       created_by: username
//     }, { transaction });

//     // Create trips if provided
//     if (trips && trips.length > 0) {
//       for (const trip of trips) {
//         const newTrip = await OperatorDeliveryNoteTripModel.create({
//           operator_dn_id: deliveryNote.operator_dn_id,
//           trip_number: trip.trip_number,
//           transportation_company: trip.transportation_company,
//           driver_name: trip.driver_name,
//           driver_contact: trip.driver_contact,
//           vehicle_type: trip.vehicle_type,
//           vehicle_number: trip.vehicle_number,
//           recovery_vehicle_number: trip.recovery_vehicle_number || null,
//           chargeable_type: trip.chargeable_type || null,
//           trip_date: trip.trip_date,
//           trip_status: "Creation",
//           remarks: trip.remarks,
//         }, { transaction });

//         // Add manpower resources to this trip
//         if (trip.manpower && trip.manpower.length > 0) {
//           for (const mp of trip.manpower) {
//             await OperatorDNManpowerModel.create({
//               operator_dn_id: deliveryNote.operator_dn_id,
//               trip_id: newTrip.trip_id,
//               employee_id: mp.employee_id,
//               employee_no: mp.employee_no,
//               employee_name: mp.employee_name,
//               checklist_file_path: mp.checklist_file_path || null,
//               checklist_file_name: mp.checklist_file_name || null,
//             }, { transaction });
//           }
//         }
//       }
//     }

//     // Update operator change status
//     await updateOperatorChangeStatusAfterNoteCreation(
//       operatorChange,
//       "DELIVERY",
//       deliveryNote.operator_dn_id,
//       transaction
//     );

//     await transaction.commit();

//     // Fetch created delivery note with trips
//     const createdDeliveryNote = await OperatorDeliveryNoteModel.findByPk(
//       deliveryNote.operator_dn_id,
//       {
//         include: [
//           {
//             model: OperatorDeliveryNoteTripModel,
//             as: "trips",
//             include: [{
//               model: OperatorDNManpowerModel,
//               as: "manpower"
//             }],
//             order: [["trip_number", "ASC"]]
//           },
//           {
//             model: OperatorChangeModel,
//             as: "operatorChange",
//             include: [{
//               model: SalesOrdersModel,
//               as: "salesOrder"
//             }]
//           }
//         ]
//       }
//     );

//     res.status(201).json({
//       message: "Operator delivery note created successfully",
//       deliveryNote: createdDeliveryNote
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error creating operator delivery note:", error);
//     res.status(500).json({
//       message: "Error creating operator delivery note",
//       error: error.message
//     });
//   }
// };

// const getOperatorDeliveryNoteById = async (req, res) => {
//   try {
//     const { operator_dn_id } = req.params;

//     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(operator_dn_id, {
//       include: [
//         {
//           model: OperatorDeliveryNoteTripModel,
//           as: "trips",
//           include: [{
//             model: OperatorDNManpowerModel,
//             as: "manpower"
//           }],
//           order: [["trip_number", "ASC"]]
//         },
//         {
//           model: OperatorChangeModel,
//           as: "operatorChange",
//           include: [
//             { model: SalesOrdersModel, as: "salesOrder" },
//             {
//               model: ManpowerModel,
//               as: "newOperator",
//               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//             }
//           ]
//         }
//       ]
//     });

//     if (!deliveryNote) {
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     res.status(200).json({ deliveryNote });
//   } catch (error) {
//     console.error("Error fetching operator delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getLatestOperatorDeliveryNote = async (req, res) => {
//   try {
//     const { operator_change_id } = req.params;

//     const deliveryNote = await OperatorDeliveryNoteModel.findOne({
//       where: { operator_change_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: OperatorDeliveryNoteTripModel,
//           as: "trips",
//           include: [{
//             model: OperatorDNManpowerModel,
//             as: "manpower"
//           }],
//           order: [["trip_number", "ASC"]]
//         },
//         {
//           model: OperatorChangeModel,
//           as: "operatorChange",
//           include: [
//             { model: SalesOrdersModel, as: "salesOrder" },
//             {
//               model: ManpowerModel,
//               as: "newOperator",
//               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//             }
//           ]
//         }
//       ]
//     });

//     if (!deliveryNote) {
//       return res.status(404).json({ message: "No delivery note found" });
//     }

//     res.status(200).json({ deliveryNote });
//   } catch (error) {
//     console.error("Error fetching latest operator delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getOperatorDeliveryNoteSummary = async (req, res) => {
//   try {
//     const { operator_dn_id } = req.params;

//     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(operator_dn_id, {
//       include: [
//         {
//           model: OperatorDeliveryNoteTripModel,
//           as: "trips",
//           order: [["trip_number", "ASC"]]
//         },
//         {
//           model: OperatorChangeModel,
//           as: "operatorChange",
//           include: [
//             {
//               model: SalesOrdersModel,
//               as: "salesOrder",
//               attributes: ["so_number", "client", "project_name"]
//             },
//             {
//               model: ManpowerModel,
//               as: "newOperator",
//               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//             }
//           ]
//         }
//       ]
//     });

//     if (!deliveryNote) {
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     // Format summary data
//     const summaryData = {
//       dn_number: deliveryNote.dn_number,
//       operator: deliveryNote.operatorChange.newOperator,
//       delivery_date: deliveryNote.delivery_date,
//       status: deliveryNote.status,
//       trips: deliveryNote.trips.map(trip => ({
//         trip_number: trip.trip_number,
//         transportation: {
//           company: trip.transportation_company,
//           driver: trip.driver_name,
//           contact: trip.driver_contact,
//           vehicle: trip.vehicle_number,
//         },
//         trip_date: trip.trip_date,
//         trip_status: trip.trip_status,
//         remarks: trip.remarks
//       }))
//     };

//     res.status(200).json({
//       success: true,
//       summary: summaryData
//     });
//   } catch (error) {
//     console.error("Error fetching delivery note summary:", error);
//     res.status(500).json({
//       message: "Error fetching delivery note summary",
//       error: error.message
//     });
//   }
// };

// // ==================== OFF-HIRE NOTE FUNCTIONS ====================

// const createOperatorOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_change_id } = req.params;
//     const { off_hire_date, remarks, trips } = req.body;

//     // Get operator change
//     const operatorChange = await OperatorChangeModel.findByPk(operator_change_id, {
//       include: [
//         {
//           model: ManpowerModel,
//           as: "previousOperator",
//           attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//         },
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"]
//         }
//       ]
//     });

//     if (!operatorChange) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Operator change not found" });
//     }

//     // Generate OHN number
//     const ohn_number = await generateOperatorOHNNumber();

//     // Get logged in user
//     let username = await getUsername(req);

//     // Create off hire note
//     const offHireNote = await OperatorOffHireNoteModel.create({
//       operator_change_id,
//       ohn_number,
//       previous_operator_id: operatorChange.previous_operator_id,
//       previous_operator_name: operatorChange.previous_operator_name,
//       off_hire_date,
//       status: "Creation",
//       remarks,
//       created_by: username
//     }, { transaction });

//     // Create trips if provided
//     if (trips && trips.length > 0) {
//       for (const trip of trips) {
//         const newTrip = await OperatorOffHireNoteTripModel.create({
//           operator_ohn_id: offHireNote.operator_ohn_id,
//           trip_number: trip.trip_number,
//           transportation_company: trip.transportation_company,
//           driver_name: trip.driver_name,
//           driver_contact: trip.driver_contact,
//           vehicle_type: trip.vehicle_type,
//           vehicle_number: trip.vehicle_number,
//           recovery_vehicle_number: trip.recovery_vehicle_number || null,
//           chargeable_type: trip.chargeable_type || null,
//           trip_date: trip.trip_date,
//           trip_status: "Creation",
//           remarks: trip.remarks,
//         }, { transaction });

//         // Add manpower resources to this trip
//         if (trip.manpower && trip.manpower.length > 0) {
//           for (const mp of trip.manpower) {
//             await OperatorOHNManpowerModel.create({
//               operator_ohn_id: offHireNote.operator_ohn_id,
//               trip_id: newTrip.trip_id,
//               employee_id: mp.employee_id,
//               employee_no: mp.employee_no,
//               employee_name: mp.employee_name,
//               checklist_file_path: mp.checklist_file_path || null,
//               checklist_file_name: mp.checklist_file_name || null,
//             }, { transaction });
//           }
//         }
//       }
//     }

//     // Update operator change status
//     await updateOperatorChangeStatusAfterNoteCreation(
//       operatorChange,
//       "OFF_HIRE",
//       offHireNote.operator_ohn_id,
//       transaction
//     );

//     await transaction.commit();

//     // Fetch created off hire note with trips
//     const createdOffHireNote = await OperatorOffHireNoteModel.findByPk(
//       offHireNote.operator_ohn_id,
//       {
//         include: [
//           {
//             model: OperatorOffHireNoteTripModel,
//             as: "trips",
//             include: [{
//               model: OperatorOHNManpowerModel,
//               as: "manpower"
//             }],
//             order: [["trip_number", "ASC"]]
//           },
//           {
//             model: OperatorChangeModel,
//             as: "operatorChange",
//             include: [{
//               model: SalesOrdersModel,
//               as: "salesOrder"
//             }]
//           }
//         ]
//       }
//     );

//     res.status(201).json({
//       message: "Operator off hire note created successfully",
//       offHireNote: createdOffHireNote
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error creating operator off hire note:", error);
//     res.status(500).json({
//       message: "Error creating operator off hire note",
//       error: error.message
//     });
//   }
// };

// const getOperatorOffHireNoteById = async (req, res) => {
//   try {
//     const { operator_ohn_id } = req.params;

//     const offHireNote = await OperatorOffHireNoteModel.findByPk(operator_ohn_id, {
//       include: [
//         {
//           model: OperatorOffHireNoteTripModel,
//           as: "trips",
//           include: [{
//             model: OperatorOHNManpowerModel,
//             as: "manpower"
//           }],
//           order: [["trip_number", "ASC"]]
//         },
//         {
//           model: OperatorChangeModel,
//           as: "operatorChange",
//           include: [
//             { model: SalesOrdersModel, as: "salesOrder" },
//             {
//               model: ManpowerModel,
//               as: "previousOperator",
//               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//             }
//           ]
//         }
//       ]
//     });

//     if (!offHireNote) {
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     res.status(200).json({ offHireNote });
//   } catch (error) {
//     console.error("Error fetching operator off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getLatestOperatorOffHireNote = async (req, res) => {
//   try {
//     const { operator_change_id } = req.params;

//     const offHireNote = await OperatorOffHireNoteModel.findOne({
//       where: { operator_change_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: OperatorOffHireNoteTripModel,
//           as: "trips",
//           include: [{
//             model: OperatorOHNManpowerModel,
//             as: "manpower"
//           }],
//           order: [["trip_number", "ASC"]]
//         },
//         {
//           model: OperatorChangeModel,
//           as: "operatorChange",
//           include: [
//             { model: SalesOrdersModel, as: "salesOrder" },
//             {
//               model: ManpowerModel,
//               as: "previousOperator",
//               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//             }
//           ]
//         }
//       ]
//     });

//     if (!offHireNote) {
//       return res.status(404).json({ message: "No off hire note found" });
//     }

//     res.status(200).json({ offHireNote });
//   } catch (error) {
//     console.error("Error fetching latest operator off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getOperatorOffHireNoteSummary = async (req, res) => {
//   try {
//     const { operator_ohn_id } = req.params;

//     const offHireNote = await OperatorOffHireNoteModel.findByPk(operator_ohn_id, {
//       include: [
//         {
//           model: OperatorOffHireNoteTripModel,
//           as: "trips",
//           order: [["trip_number", "ASC"]]
//         },
//         {
//           model: OperatorChangeModel,
//           as: "operatorChange",
//           include: [
//             {
//               model: SalesOrdersModel,
//               as: "salesOrder",
//               attributes: ["so_number", "client", "project_name"]
//             },
//             {
//               model: ManpowerModel,
//               as: "previousOperator",
//               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//             }
//           ]
//         }
//       ]
//     });

//     if (!offHireNote) {
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     // Format summary data
//     const summaryData = {
//       ohn_number: offHireNote.ohn_number,
//       operator: offHireNote.operatorChange.previousOperator,
//       off_hire_date: offHireNote.off_hire_date,
//       status: offHireNote.status,
//       trips: offHireNote.trips.map(trip => ({
//         trip_number: trip.trip_number,
//         transportation: {
//           company: trip.transportation_company,
//           driver: trip.driver_name,
//           contact: trip.driver_contact,
//           vehicle: trip.vehicle_number,
//         },
//         trip_date: trip.trip_date,
//         trip_status: trip.trip_status,
//         remarks: trip.remarks
//       }))
//     };

//     res.status(200).json({
//       success: true,
//       summary: summaryData
//     });
//   } catch (error) {
//     console.error("Error fetching off hire note summary:", error);
//     res.status(500).json({
//       message: "Error fetching off hire note summary",
//       error: error.message
//     });
//   }
// };

// // ==================== STATUS MANAGEMENT FUNCTIONS ====================

// const submitOperatorDNForApproval = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_dn_id } = req.params;

//     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
//       operator_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (deliveryNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Can only submit delivery notes in 'Creation' status",
//       });
//     }

//     await deliveryNote.update({ status: "Under Approval" }, { transaction });

//     await transaction.commit();

//     res.status(200).json({
//       message: "Submitted for approval successfully",
//       deliveryNote: await OperatorDeliveryNoteModel.findByPk(operator_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error submitting operator DN for approval:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const submitOperatorOHNForApproval = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_ohn_id } = req.params;

//     const offHireNote = await OperatorOffHireNoteModel.findByPk(
//       operator_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Can only submit off hire notes in 'Creation' status",
//       });
//     }

//     await offHireNote.update({ status: "Under Approval" }, { transaction });

//     await transaction.commit();

//     res.status(200).json({
//       message: "Submitted for approval successfully",
//       offHireNote: await OperatorOffHireNoteModel.findByPk(operator_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error submitting operator OHN for approval:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const approveOperatorDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_dn_id } = req.params;
//     const username = await getUsername(req);

//     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
//       operator_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (deliveryNote.status !== "Under Approval") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Delivery note must be 'Under Approval' to approve",
//       });
//     }

//     await deliveryNote.update(
//       {
//         status: "Approved",
//         approved_by: username,
//         approved_at: new Date(),
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Delivery note approved successfully",
//       deliveryNote: await OperatorDeliveryNoteModel.findByPk(operator_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error approving operator delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const approveOperatorOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_ohn_id } = req.params;
//     const username = await getUsername(req);

//     const offHireNote = await OperatorOffHireNoteModel.findByPk(
//       operator_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status !== "Under Approval") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Off hire note must be 'Under Approval' to approve",
//       });
//     }

//     await offHireNote.update(
//       {
//         status: "Approved",
//         approved_by: username,
//         approved_at: new Date(),
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Off hire note approved successfully",
//       offHireNote: await OperatorOffHireNoteModel.findByPk(operator_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error approving operator off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const rejectOperatorDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_dn_id } = req.params;
//     const { reason } = req.body;

//     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
//       operator_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (deliveryNote.status !== "Under Approval") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Delivery note must be 'Under Approval' to reject",
//       });
//     }

//     await deliveryNote.update(
//       {
//         status: "Rejected",
//         remarks: reason ? `Rejected: ${reason}` : deliveryNote.remarks,
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Delivery note rejected successfully",
//       deliveryNote: await OperatorDeliveryNoteModel.findByPk(operator_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error rejecting operator delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const rejectOperatorOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_ohn_id } = req.params;
//     const { reason } = req.body;

//     const offHireNote = await OperatorOffHireNoteModel.findByPk(
//       operator_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status !== "Under Approval") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Off hire note must be 'Under Approval' to reject",
//       });
//     }

//     await offHireNote.update(
//       {
//         status: "Rejected",
//         remarks: reason ? `Rejected: ${reason}` : offHireNote.remarks,
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Off hire note rejected successfully",
//       offHireNote: await OperatorOffHireNoteModel.findByPk(operator_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error rejecting operator off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const closeOperatorDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_dn_id } = req.params;

//     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
//       operator_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (deliveryNote.status !== "Completed") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Only completed delivery notes can be closed",
//       });
//     }

//     await deliveryNote.update({ status: "Close" }, { transaction });
//     await transaction.commit();

//     res.status(200).json({
//       message: "Delivery note closed successfully",
//       deliveryNote: await OperatorDeliveryNoteModel.findByPk(operator_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error closing operator delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const closeOperatorOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_ohn_id } = req.params;

//     const offHireNote = await OperatorOffHireNoteModel.findByPk(
//       operator_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status !== "Completed") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Only completed off hire notes can be closed",
//       });
//     }

//     await offHireNote.update({ status: "Close" }, { transaction });
//     await transaction.commit();

//     res.status(200).json({
//       message: "Off hire note closed successfully",
//       offHireNote: await OperatorOffHireNoteModel.findByPk(operator_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error closing operator off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ==================== TRIP MANAGEMENT FUNCTIONS ====================

// const addTripToOperatorDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_dn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       manpower,
//       remarks
//     } = req.body;

//     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
//       operator_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (deliveryNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message:
//           "Trips can only be added when delivery note is in Creation status",
//       });
//     }

//     const existingTrips = await OperatorDeliveryNoteTripModel.findAll({
//       where: { operator_dn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per delivery note" });
//     }

//     const newTrip = await OperatorDeliveryNoteTripModel.create({
//       operator_dn_id,
//       trip_number: existingTrips.length + 1,
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type: vehicle_type || null,
//       vehicle_number: vehicle_number || null,
//       recovery_vehicle_number: recovery_vehicle_number || null,
//       chargeable_type: chargeable_type || null,
//       trip_date: trip_date || null,
//       trip_status: "Creation",
//       remarks: remarks || null,
//     }, { transaction });

//     // Add manpower resources
//     if (manpower && manpower.length > 0) {
//       for (const mp of manpower) {
//         await OperatorDNManpowerModel.create({
//           operator_dn_id,
//           trip_id: newTrip.trip_id,
//           employee_id: mp.employee_id,
//           employee_no: mp.employee_no,
//           employee_name: mp.employee_name,
//           checklist_file_path: mp.checklist_file_path || null,
//           checklist_file_name: mp.checklist_file_name || null,
//         }, { transaction });
//       }
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await OperatorDeliveryNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: OperatorDNManpowerModel, as: "manpower" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to operator delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const addTripToOperatorOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_ohn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       manpower,
//       remarks
//     } = req.body;

//     const offHireNote = await OperatorOffHireNoteModel.findByPk(
//       operator_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message:
//           "Trips can only be added when off hire note is in Creation status",
//       });
//     }

//     const existingTrips = await OperatorOffHireNoteTripModel.findAll({
//       where: { operator_ohn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per off hire note" });
//     }

//     const newTrip = await OperatorOffHireNoteTripModel.create({
//       operator_ohn_id,
//       trip_number: existingTrips.length + 1,
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type: vehicle_type || null,
//       vehicle_number: vehicle_number || null,
//       recovery_vehicle_number: recovery_vehicle_number || null,
//       chargeable_type: chargeable_type || null,
//       trip_date: trip_date || null,
//       trip_status: "Creation",
//       remarks: remarks || null,
//     }, { transaction });

//     // Add manpower resources
//     if (manpower && manpower.length > 0) {
//       for (const mp of manpower) {
//         await OperatorOHNManpowerModel.create({
//           operator_ohn_id,
//           trip_id: newTrip.trip_id,
//           employee_id: mp.employee_id,
//           employee_no: mp.employee_no,
//           employee_name: mp.employee_name,
//           checklist_file_path: mp.checklist_file_path || null,
//           checklist_file_name: mp.checklist_file_name || null,
//         }, { transaction });
//       }
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await OperatorOffHireNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: OperatorOHNManpowerModel, as: "manpower" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to operator off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateTripInOperatorDN = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       manpower,
//       remarks,
//     } = req.body;

//     const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
//       include: [{ model: OperatorDeliveryNoteModel, as: "deliveryNote" }],
//       transaction,
//     });

//     if (!trip) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     if (trip.deliveryNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: `Cannot edit trip — delivery note is in '${trip.deliveryNote.status}' status`,
//       });
//     }

//     await trip.update(
//       {
//         transportation_company,
//         driver_name,
//         driver_contact,
//         vehicle_type: vehicle_type || null,
//         vehicle_number: vehicle_number || null,
//         recovery_vehicle_number: recovery_vehicle_number || null,
//         chargeable_type: chargeable_type || null,
//         trip_date: trip_date || null,
//         remarks: remarks || null,
//       },
//       { transaction }
//     );

//     // Replace manpower resources
//     if (manpower !== undefined) {
//       await OperatorDNManpowerModel.destroy({
//         where: { trip_id },
//         transaction,
//       });

//       if (manpower.length > 0) {
//         for (const mp of manpower) {
//           await OperatorDNManpowerModel.create({
//             operator_dn_id: trip.operator_dn_id,
//             trip_id,
//             employee_id: mp.employee_id,
//             employee_no: mp.employee_no,
//             employee_name: mp.employee_name,
//             checklist_file_path: mp.checklist_file_path || null,
//             checklist_file_name: mp.checklist_file_name || null,
//           }, { transaction });
//         }
//       }
//     }

//     await transaction.commit();

//     res.status(200).json({
//       message: "Trip updated successfully",
//       trip: await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
//         include: [{ model: OperatorDNManpowerModel, as: "manpower" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error updating trip in operator DN:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateTripInOperatorOHN = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       manpower,
//       remarks,
//     } = req.body;

//     const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
//       include: [{ model: OperatorOffHireNoteModel, as: "offHireNote" }],
//       transaction,
//     });

//     if (!trip) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     if (trip.offHireNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: `Cannot edit trip — off hire note is in '${trip.offHireNote.status}' status`,
//       });
//     }

//     await trip.update(
//       {
//         transportation_company,
//         driver_name,
//         driver_contact,
//         vehicle_type: vehicle_type || null,
//         vehicle_number: vehicle_number || null,
//         recovery_vehicle_number: recovery_vehicle_number || null,
//         chargeable_type: chargeable_type || null,
//         trip_date: trip_date || null,
//         remarks: remarks || null,
//       },
//       { transaction }
//     );

//     // Replace manpower resources
//     if (manpower !== undefined) {
//       await OperatorOHNManpowerModel.destroy({
//         where: { trip_id },
//         transaction,
//       });

//       if (manpower.length > 0) {
//         for (const mp of manpower) {
//           await OperatorOHNManpowerModel.create({
//             operator_ohn_id: trip.operator_ohn_id,
//             trip_id,
//             employee_id: mp.employee_id,
//             employee_no: mp.employee_no,
//             employee_name: mp.employee_name,
//             checklist_file_path: mp.checklist_file_path || null,
//             checklist_file_name: mp.checklist_file_name || null,
//           }, { transaction });
//         }
//       }
//     }

//     await transaction.commit();

//     res.status(200).json({
//       message: "Trip updated successfully",
//       trip: await OperatorOffHireNoteTripModel.findByPk(trip_id, {
//         include: [{ model: OperatorOHNManpowerModel, as: "manpower" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error updating trip in operator OHN:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleteTripFromOperatorDN = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;

//     const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
//       include: [{ model: OperatorDeliveryNoteModel, as: "deliveryNote" }],
//       transaction,
//     });

//     if (!trip) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     if (trip.deliveryNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message:
//           "Trips can only be deleted when delivery note is in Creation status",
//       });
//     }

//     await trip.destroy({ transaction });
//     await transaction.commit();

//     res.status(200).json({ message: "Trip deleted successfully" });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error deleting trip:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleteTripFromOperatorOHN = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;

//     const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
//       include: [{ model: OperatorOffHireNoteModel, as: "offHireNote" }],
//       transaction,
//     });

//     if (!trip) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     if (trip.offHireNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message:
//           "Trips can only be deleted when off hire note is in Creation status",
//       });
//     }

//     await trip.destroy({ transaction });
//     await transaction.commit();

//     res.status(200).json({ message: "Trip deleted successfully" });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error deleting trip:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ==================== UPLOAD FUNCTIONS ====================

// const uploadOperatorDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_dn_id } = req.params;
//     const user = req.user;

//     if (!req.file) {
//       await transaction.rollback();
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const fileName = req.file.filename;

//     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
//       operator_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     await deliveryNote.update(
//       {
//         delivery_attachment: fileName,
//         status: "Completed",
//         uploaded_by: user?.username || "System",
//         uploaded_at: new Date(),
//       },
//       { transaction }
//     );

//     // Update operator change status
//     const operatorChange = await OperatorChangeModel.findByPk(
//       deliveryNote.operator_change_id,
//       { transaction }
//     );

//     if (operatorChange) {
//       const updateData = {
//         delivery_note_status: "Completed",
//       };

//       // Check if partner is completed
//       if (operatorChange.change_group_id) {
//         const partnerChange = await OperatorChangeModel.findOne({
//           where: {
//             change_group_id: operatorChange.change_group_id,
//             operator_change_id: { [Op.ne]: operatorChange.operator_change_id },
//           },
//           transaction,
//         });

//         if (partnerChange && partnerChange.off_hire_note_status === "Completed") {
//           updateData.overall_status = "Completed";
//         } else {
//           updateData.overall_status = "Partially completed";
//         }
//       } else {
//         updateData.overall_status = "In progress";
//       }

//       await operatorChange.update(updateData, { transaction });
//     }

//     await transaction.commit();

//     res.status(200).json({
//       success: true,
//       message: "Signed delivery note uploaded successfully",
//       fileName,
//       status: "Completed",
//     });
//   } catch (error) {
//     await transaction.rollback();
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     console.error("Error uploading operator delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const uploadOperatorOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_ohn_id } = req.params;
//     const user = req.user;

//     if (!req.file) {
//       await transaction.rollback();
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const fileName = req.file.filename;

//     const offHireNote = await OperatorOffHireNoteModel.findByPk(
//       operator_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     await offHireNote.update(
//       {
//         off_hire_attachment: fileName,
//         status: "Completed",
//         uploaded_by: user?.username || "System",
//         uploaded_at: new Date(),
//       },
//       { transaction }
//     );

//     // Update operator change status
//     const operatorChange = await OperatorChangeModel.findByPk(
//       offHireNote.operator_change_id,
//       { transaction }
//     );

//     if (operatorChange) {
//       const updateData = {
//         off_hire_note_status: "Completed",
//       };

//       // Check if partner is completed
//       if (operatorChange.change_group_id) {
//         const partnerChange = await OperatorChangeModel.findOne({
//           where: {
//             change_group_id: operatorChange.change_group_id,
//             operator_change_id: { [Op.ne]: operatorChange.operator_change_id },
//           },
//           transaction,
//         });

//         if (partnerChange && partnerChange.delivery_note_status === "Completed") {
//           updateData.overall_status = "Completed";
//         } else {
//           updateData.overall_status = "Partially completed";
//         }
//       } else {
//         updateData.overall_status = "In progress";
//       }

//       await operatorChange.update(updateData, { transaction });
//     }

//     await transaction.commit();

//     res.status(200).json({
//       success: true,
//       message: "Signed off hire note uploaded successfully",
//       fileName,
//       status: "Completed",
//     });
//   } catch (error) {
//     await transaction.rollback();
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     console.error("Error uploading operator off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const uploadOperatorDNChecklist = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id, resource_id } = req.params;
//     const file = req.file;
//     const user = req.user;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const resource = await OperatorDNManpowerModel.findOne({
//       where: { id: resource_id, trip_id },
//       transaction,
//     });

//     if (!resource) {
//       await transaction.rollback();
//       return res
//         .status(404)
//         .json({ message: "Manpower resource not found in this trip" });
//     }

//     await OperatorDNManpowerModel.update(
//       {
//         checklist_file_path: file.path,
//         checklist_file_name: file.originalname,
//         checklist_uploaded_at: new Date(),
//         checklist_uploaded_by: user?.username || "System",
//       },
//       { where: { id: resource_id, trip_id }, transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Checklist uploaded successfully",
//       file: {
//         path: file.path,
//         name: file.originalname,
//         uploaded_at: new Date(),
//         uploaded_by: user?.username || "System",
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error uploading operator DN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const uploadOperatorOHNChecklist = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id, resource_id } = req.params;
//     const file = req.file;
//     const user = req.user;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const resource = await OperatorOHNManpowerModel.findOne({
//       where: { id: resource_id, trip_id },
//       transaction,
//     });

//     if (!resource) {
//       await transaction.rollback();
//       return res
//         .status(404)
//         .json({ message: "Manpower resource not found in this trip" });
//     }

//     await OperatorOHNManpowerModel.update(
//       {
//         checklist_file_path: file.path,
//         checklist_file_name: file.originalname,
//         checklist_uploaded_at: new Date(),
//         checklist_uploaded_by: user?.username || "System",
//       },
//       { where: { id: resource_id, trip_id }, transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Checklist uploaded successfully",
//       file: {
//         path: file.path,
//         name: file.originalname,
//         uploaded_at: new Date(),
//         uploaded_by: user?.username || "System",
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error uploading operator OHN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const downloadOperatorDNChecklist = async (req, res) => {
//   try {
//     const { trip_id, resource_id } = req.params;

//     const resource = await OperatorDNManpowerModel.findOne({
//       where: { id: resource_id, trip_id },
//     });

//     if (!resource) {
//       return res.status(404).json({ message: "Manpower resource not found" });
//     }

//     if (!resource.checklist_file_path || !resource.checklist_file_name) {
//       return res
//         .status(404)
//         .json({ message: "No checklist found for this resource" });
//     }

//     if (!fs.existsSync(resource.checklist_file_path)) {
//       return res
//         .status(404)
//         .json({ message: "Checklist file not found on server" });
//     }

//     res.download(
//       resource.checklist_file_path,
//       resource.checklist_file_name,
//       (err) => {
//         if (err) {
//           console.error("Error downloading file:", err);
//           res
//             .status(500)
//             .json({ message: "Error downloading checklist file" });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error downloading operator DN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const downloadOperatorOHNChecklist = async (req, res) => {
//   try {
//     const { trip_id, resource_id } = req.params;

//     const resource = await OperatorOHNManpowerModel.findOne({
//       where: { id: resource_id, trip_id },
//     });

//     if (!resource) {
//       return res.status(404).json({ message: "Manpower resource not found" });
//     }

//     if (!resource.checklist_file_path || !resource.checklist_file_name) {
//       return res
//         .status(404)
//         .json({ message: "No checklist found for this resource" });
//     }

//     if (!fs.existsSync(resource.checklist_file_path)) {
//       return res
//         .status(404)
//         .json({ message: "Checklist file not found on server" });
//     }

//     res.download(
//       resource.checklist_file_path,
//       resource.checklist_file_name,
//       (err) => {
//         if (err) {
//           console.error("Error downloading file:", err);
//           res
//             .status(500)
//             .json({ message: "Error downloading checklist file" });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error downloading operator OHN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ==================== PDF GENERATION FUNCTIONS ====================

// const generateOperatorDeliveryNotePDF = async (req, res) => {
//   try {
//     const { operator_dn_id } = req.params;

//     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(operator_dn_id, {
//       include: [
//         {
//           model: OperatorDeliveryNoteTripModel,
//           as: "trips",
//           include: [{
//             model: OperatorDNManpowerModel,
//             as: "manpower"
//           }],
//           order: [["trip_number", "ASC"]]
//         },
//         {
//           model: OperatorChangeModel,
//           as: "operatorChange",
//           include: [
//             {
//               model: SalesOrdersModel,
//               as: "salesOrder",
//               attributes: ["so_number", "client", "project_name", "ordered_date", "lpo_number"]
//             },
//             {
//               model: EquipmentModel,
//               as: "equipment",
//               attributes: ["serial_number", "reg_number", "vehicle_type"]
//             },
//             {
//               model: ManpowerModel,
//               as: "newOperator",
//               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//             }
//           ]
//         }
//       ]
//     });

//     if (!deliveryNote) {
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     // Update status to In Progress when PDF is generated
//     await deliveryNote.update({ status: "In Progress" });

//     // Also update trips status
//     await OperatorDeliveryNoteTripModel.update(
//       { trip_status: "In Progress" },
//       {
//         where: { operator_dn_id, trip_status: "Creation" }
//       }
//     );

//     // Generate PDF
//     const doc = new PDFDocument({ margin: 40, size: "A4" });

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="OP-DN-${deliveryNote.dn_number}.pdf"`);

//     doc.pipe(res);

//     // Add border to page
//     const pageWidth = doc.page.width;
//     const pageHeight = doc.page.height;
//     doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

//     // Company Header with Green Background
//     doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke('#059669', '#059669');

//     doc.fontSize(22).font('Helvetica-Bold').fillColor('#FFFFFF')
//       .text('Auto Xpert Trading and Service WLL', 50, 55, { align: 'center' })
//       .fontSize(9).font('Helvetica')
//       .text('Office No 11, 2nd Floor, Building No.207, Street 995, Zone 56', 50, 82, { align: 'center' })
//       .text('Doha, Qatar | Tel: 44581071 | Email: info@autoxpert.qa', 50, 95, { align: 'center' });

//     doc.fillColor('#000000');

//     // Document Title
//     doc.moveDown(3);
//     doc.fontSize(18).font('Helvetica-Bold').fillColor('#059669')
//       .text('OPERATOR DELIVERY NOTE', { align: 'center' })
//       .fillColor('#000000');

//     doc.moveDown(1);
//     doc.moveTo(100, doc.y).lineTo(pageWidth - 100, doc.y).stroke('#059669');
//     doc.moveDown(1);

//     // Two Column Layout for Details
//     const leftX = 50;
//     const rightX = 320;
//     const startY = doc.y;

//     // Left Column - Ship-to Address
//     doc.fontSize(11).font('Helvetica-Bold').fillColor('#059669');
//     doc.text('SHIP-TO ADDRESS', leftX, startY);
//     doc.fillColor('#000000');

//     doc.rect(leftX, startY + 20, 240, 60).stroke('#CCCCCC');
//     doc.fontSize(10).font('Helvetica');
//     doc.text(deliveryNote.operatorChange.salesOrder.client, leftX + 10, startY + 30, { width: 220 });

//     // Right Column - Document Details
//     doc.fontSize(11).font('Helvetica-Bold').fillColor('#059669');
//     doc.text('DOCUMENT DETAILS', rightX, startY);
//     doc.fillColor('#000000');

//     const detailsY = startY + 20;
//     doc.rect(rightX, detailsY, 240, 90).stroke('#CCCCCC');

//     doc.fontSize(9).font('Helvetica-Bold');
//     doc.text('Delivery Note No.:', rightX + 10, detailsY + 10);
//     doc.text('Delivery Date:', rightX + 10, detailsY + 30);
//     doc.text('Order Reference No.:', rightX + 10, detailsY + 50);
//     doc.text('Project Name:', rightX + 10, detailsY + 70);

//     doc.font('Helvetica');
//     doc.text(deliveryNote.dn_number, rightX + 130, detailsY + 10);
//     doc.text(new Date(deliveryNote.delivery_date).toLocaleDateString('en-GB'), rightX + 130, detailsY + 30);
//     doc.text(deliveryNote.operatorChange.salesOrder.so_number, rightX + 130, detailsY + 50);
//     doc.text(deliveryNote.operatorChange.salesOrder.project_name || 'N/A', rightX + 130, detailsY + 70, { width: 100 });

//     doc.y = startY + 120;
//     doc.moveDown(1);

//     // Operator Details Section
//     doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
//     doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#059669', '#059669');
//     doc.text('OPERATOR DETAILS', leftX + 10, doc.y + 5);

//     doc.fillColor('#000000');
//     doc.moveDown(1.5);

//     const operatorY = doc.y;
//     doc.rect(leftX, operatorY, pageWidth - 100, 50).stroke('#CCCCCC');

//     doc.fontSize(9).font('Helvetica-Bold');
//     doc.text('Operator Name:', leftX + 10, operatorY + 10);
//     doc.text('Employee Number:', leftX + 10, operatorY + 30);

//     doc.font('Helvetica');
//     doc.text(deliveryNote.operatorChange.newOperator.employeeFullName, leftX + 120, operatorY + 10);
//     doc.text(deliveryNote.operatorChange.newOperator.employeeNo, leftX + 120, operatorY + 30);

//     doc.y = operatorY + 60;
//     doc.moveDown(1);

//     // Equipment Details Section (if available)
//     if (deliveryNote.operatorChange.equipment) {
//       doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
//       doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#059669', '#059669');
//       doc.text('EQUIPMENT DETAILS', leftX + 10, doc.y + 5);

//       doc.fillColor('#000000');
//       doc.moveDown(1.5);

//       const equipY = doc.y;
//       doc.rect(leftX, equipY, pageWidth - 100, 50).stroke('#CCCCCC');

//       doc.fontSize(9).font('Helvetica-Bold');
//       doc.text('Plate Number:', leftX + 10, equipY + 10);
//       doc.text('Vehicle Type:', leftX + 10, equipY + 30);

//       doc.font('Helvetica');
//       doc.text(deliveryNote.operatorChange.equipment.reg_number, leftX + 120, equipY + 10);
//       doc.text(deliveryNote.operatorChange.equipment.vehicle_type, leftX + 120, equipY + 30);

//       doc.y = equipY + 60;
//       doc.moveDown(1);
//     }

//     // Transportation Details
//     if (deliveryNote.trips && deliveryNote.trips.length > 0) {
//       doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
//       doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#059669', '#059669');
//       doc.text('TRANSPORTATION DETAILS', leftX + 10, doc.y + 5);

//       doc.fillColor('#000000');
//       doc.moveDown(1.5);

//       deliveryNote.trips.forEach((trip, index) => {
//         const tripY = doc.y;
//         const tripHeight = 120 + (trip.manpower && trip.manpower.length > 0 ? 40 * trip.manpower.length : 0);

//         // Add new page if needed
//         if (tripY + tripHeight > pageHeight - 100) {
//           doc.addPage();
//           doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
//           doc.y = 50;
//         }

//         doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke('#CCCCCC');

//         doc.fontSize(10).font('Helvetica-Bold').fillColor('#059669');
//         doc.text(`Trip ${trip.trip_number}`, leftX + 10, doc.y + 10);
//         doc.fillColor('#000000');

//         const tripDetailsY = doc.y + 30;
//         doc.fontSize(9).font('Helvetica-Bold');
//         doc.text('Company:', leftX + 10, tripDetailsY);
//         doc.text('Driver:', leftX + 10, tripDetailsY + 15);
//         doc.text('Contact:', leftX + 10, tripDetailsY + 30);
//         doc.text('Vehicle Type:', leftX + 10, tripDetailsY + 45);
//         doc.text('Vehicle No.:', leftX + 10, tripDetailsY + 60);

//         doc.font('Helvetica');
//         doc.text(trip.transportation_company, leftX + 100, tripDetailsY, { width: 200 });
//         doc.text(trip.driver_name, leftX + 100, tripDetailsY + 15);
//         doc.text(trip.driver_contact, leftX + 100, tripDetailsY + 30);
//         doc.text(trip.vehicle_type || 'N/A', leftX + 100, tripDetailsY + 45);
//         doc.text(trip.vehicle_number || 'N/A', leftX + 100, tripDetailsY + 60);

//         if (trip.trip_date) {
//           doc.font('Helvetica-Bold');
//           doc.text('Trip Date:', rightX, tripDetailsY);
//           doc.font('Helvetica');
//           doc.text(new Date(trip.trip_date).toLocaleDateString('en-GB'), rightX + 80, tripDetailsY);
//         }

//         // Manpower resources for this trip
//         if (trip.manpower && trip.manpower.length > 0) {
//           const manpowerY = tripDetailsY + 80;
//           doc.fontSize(9).font('Helvetica-Bold').fillColor('#059669');
//           doc.text('Assigned Manpower:', leftX + 10, manpowerY);
//           doc.fillColor('#000000');

//           trip.manpower.forEach((mp, idx) => {
//             doc.fontSize(8).font('Helvetica');
//             doc.text(`${mp.employee_name} (${mp.employee_no})`, leftX + 120, manpowerY + (idx * 15));
//           });
//         }

//         if (trip.remarks) {
//           doc.fontSize(8).font('Helvetica-Oblique');
//           doc.text(`Remarks: ${trip.remarks}`, leftX + 10, tripDetailsY + 100 + (trip.manpower && trip.manpower.length > 0 ? 40 : 0));
//         }

//         doc.y += tripHeight + 10;
//       });
//     }

//     // Remarks Section
//     if (deliveryNote.remarks) {
//       doc.moveDown(1);
//       doc.fontSize(11).font('Helvetica-Bold').fillColor('#059669');
//       doc.text('REMARKS', leftX);
//       doc.fillColor('#000000');

//       doc.fontSize(9).font('Helvetica');
//       doc.rect(leftX, doc.y + 5, pageWidth - 100, 40).stroke('#CCCCCC');
//       doc.text(deliveryNote.remarks, leftX + 10, doc.y + 15, { width: pageWidth - 120 });
//       doc.y += 50;
//     }

//     doc.moveDown(2);

//     // Acknowledgement Box
//     doc.rect(leftX, doc.y, pageWidth - 100, 30).fillAndStroke('#D1FAE5', '#CCCCCC');
//     doc.fontSize(9).font('Helvetica-Oblique').fillColor('#000000');
//     doc.text('We acknowledge that the operator has been received in good health and proper condition.',
//       leftX + 10, doc.y + 10, { width: pageWidth - 120, align: 'center' });

//     doc.moveDown(3);

//     // Signature Section
//     const sigY = doc.y;

//     // Check if we need a new page
//     if (sigY + 120 > pageHeight - 60) {
//       doc.addPage();
//       doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
//       doc.y = 50;
//     }

//     doc.fontSize(10).font('Helvetica-Bold');

//     // Left signature
//     doc.text('Received By:', leftX, doc.y);
//     doc.moveTo(leftX, doc.y + 50).lineTo(leftX + 200, doc.y + 50).stroke();
//     doc.font('Helvetica').fontSize(8);
//     doc.text('Name & Signature', leftX, doc.y + 55);

//     // Right signature
//     doc.font('Helvetica-Bold').fontSize(10);
//     doc.text('Date:', rightX, sigY);
//     doc.moveTo(rightX, sigY + 50).lineTo(rightX + 200, sigY + 50).stroke();
//     doc.font('Helvetica').fontSize(8);
//     doc.text('DD/MM/YYYY', rightX, sigY + 55);

//     doc.moveDown(4);

//     // Contact section
//     doc.text('Contact No.:', leftX, doc.y);
//     doc.moveTo(leftX, doc.y + 50).lineTo(leftX + 200, doc.y + 50).stroke();

//     // Footer
//     doc.fontSize(7).font('Helvetica-Oblique').fillColor('#666666');
//     doc.text('This is a computer generated document. No signature is required.',
//       0, pageHeight - 50, { align: 'center', width: pageWidth });

//     doc.end();
//   } catch (error) {
//     console.error("Error generating operator delivery note PDF:", error);
//     res.status(500).json({
//       message: "Error generating operator delivery note PDF",
//       error: error.message
//     });
//   }
// };

// const generateOperatorOffHireNotePDF = async (req, res) => {
//   try {
//     const { operator_ohn_id } = req.params;

//     const offHireNote = await OperatorOffHireNoteModel.findByPk(operator_ohn_id, {
//       include: [
//         {
//           model: OperatorOffHireNoteTripModel,
//           as: "trips",
//           include: [{
//             model: OperatorOHNManpowerModel,
//             as: "manpower"
//           }],
//           order: [["trip_number", "ASC"]]
//         },
//         {
//           model: OperatorChangeModel,
//           as: "operatorChange",
//           include: [
//             {
//               model: SalesOrdersModel,
//               as: "salesOrder",
//               attributes: ["so_number", "client", "project_name", "ordered_date", "lpo_number"]
//             },
//             {
//               model: EquipmentModel,
//               as: "equipment",
//               attributes: ["serial_number", "reg_number", "vehicle_type"]
//             },
//             {
//               model: ManpowerModel,
//               as: "previousOperator",
//               attributes: ["manpower_id", "employeeNo", "employeeFullName"]
//             }
//           ]
//         }
//       ]
//     });

//     if (!offHireNote) {
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     // Update status to In Progress when PDF is generated
//     await offHireNote.update({ status: "In Progress" });

//     // Also update trips status
//     await OperatorOffHireNoteTripModel.update(
//       { trip_status: "In Progress" },
//       {
//         where: { operator_ohn_id, trip_status: "Creation" }
//       }
//     );

//     // Generate PDF
//     const doc = new PDFDocument({ margin: 40, size: "A4" });

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="OP-OH-${offHireNote.ohn_number}.pdf"`);

//     doc.pipe(res);

//     // Add border to page
//     const pageWidth = doc.page.width;
//     const pageHeight = doc.page.height;
//     doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

//     // Company Header with Orange Background
//     doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke('#EA580C', '#EA580C');

//     doc.fontSize(22).font('Helvetica-Bold').fillColor('#FFFFFF')
//       .text('Auto Xpert Trading and Service WLL', 50, 55, { align: 'center' })
//       .fontSize(9).font('Helvetica')
//       .text('Office No 11, 2nd Floor, Building No.207, Street 995, Zone 56', 50, 82, { align: 'center' })
//       .text('Doha, Qatar | Tel: 44581071 | Email: info@autoxpert.qa', 50, 95, { align: 'center' });

//     doc.fillColor('#000000');

//     // Document Title
//     doc.moveDown(3);
//     doc.fontSize(18).font('Helvetica-Bold').fillColor('#EA580C')
//       .text('OPERATOR OFF HIRE NOTE', { align: 'center' })
//       .fillColor('#000000');

//     doc.moveDown(1);
//     doc.moveTo(100, doc.y).lineTo(pageWidth - 100, doc.y).stroke('#EA580C');
//     doc.moveDown(1);

//     // Two Column Layout for Details
//     const leftX = 50;
//     const rightX = 320;
//     const startY = doc.y;

//     // Left Column - Client Information
//     doc.fontSize(11).font('Helvetica-Bold').fillColor('#EA580C');
//     doc.text('CLIENT INFORMATION', leftX, startY);
//     doc.fillColor('#000000');

//     doc.rect(leftX, startY + 20, 240, 60).stroke('#CCCCCC');
//     doc.fontSize(10).font('Helvetica');
//     doc.text(offHireNote.operatorChange.salesOrder.client, leftX + 10, startY + 30, { width: 220 });

//     // Right Column - Document Details
//     doc.fontSize(11).font('Helvetica-Bold').fillColor('#EA580C');
//     doc.text('DOCUMENT DETAILS', rightX, startY);
//     doc.fillColor('#000000');

//     const detailsY = startY + 20;
//     doc.rect(rightX, detailsY, 240, 90).stroke('#CCCCCC');

//     doc.fontSize(9).font('Helvetica-Bold');
//     doc.text('Off Hire Note No.:', rightX + 10, detailsY + 10);
//     doc.text('Off Hire Date:', rightX + 10, detailsY + 30);
//     doc.text('Order Reference No.:', rightX + 10, detailsY + 50);
//     doc.text('Project Name:', rightX + 10, detailsY + 70);

//     doc.font('Helvetica');
//     doc.text(offHireNote.ohn_number, rightX + 130, detailsY + 10);
//     doc.text(new Date(offHireNote.off_hire_date).toLocaleDateString('en-GB'), rightX + 130, detailsY + 30);
//     doc.text(offHireNote.operatorChange.salesOrder.so_number, rightX + 130, detailsY + 50);
//     doc.text(offHireNote.operatorChange.salesOrder.project_name || 'N/A', rightX + 130, detailsY + 70, { width: 100 });

//     doc.y = startY + 120;
//     doc.moveDown(1);

//     // Operator Details Section
//     doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
//     doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#EA580C', '#EA580C');
//     doc.text('OPERATOR DETAILS', leftX + 10, doc.y + 5);

//     doc.fillColor('#000000');
//     doc.moveDown(1.5);

//     const operatorY = doc.y;
//     doc.rect(leftX, operatorY, pageWidth - 100, 50).stroke('#CCCCCC');

//     doc.fontSize(9).font('Helvetica-Bold');
//     doc.text('Operator Name:', leftX + 10, operatorY + 10);
//     doc.text('Employee Number:', leftX + 10, operatorY + 30);

//     doc.font('Helvetica');
//     doc.text(offHireNote.operatorChange.previousOperator.employeeFullName, leftX + 120, operatorY + 10);
//     doc.text(offHireNote.operatorChange.previousOperator.employeeNo, leftX + 120, operatorY + 30);

//     doc.y = operatorY + 60;
//     doc.moveDown(1);

//     // Equipment Details Section (if available)
//     if (offHireNote.operatorChange.equipment) {
//       doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
//       doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#EA580C', '#EA580C');
//       doc.text('EQUIPMENT DETAILS', leftX + 10, doc.y + 5);

//       doc.fillColor('#000000');
//       doc.moveDown(1.5);

//       const equipY = doc.y;
//       doc.rect(leftX, equipY, pageWidth - 100, 50).stroke('#CCCCCC');

//       doc.fontSize(9).font('Helvetica-Bold');
//       doc.text('Plate Number:', leftX + 10, equipY + 10);
//       doc.text('Vehicle Type:', leftX + 10, equipY + 30);

//       doc.font('Helvetica');
//       doc.text(offHireNote.operatorChange.equipment.reg_number, leftX + 120, equipY + 10);
//       doc.text(offHireNote.operatorChange.equipment.vehicle_type, leftX + 120, equipY + 30);

//       doc.y = equipY + 60;
//       doc.moveDown(1);
//     }

//     // Transportation Details
//     if (offHireNote.trips && offHireNote.trips.length > 0) {
//       doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF');
//       doc.rect(leftX, doc.y, pageWidth - 100, 20).fillAndStroke('#EA580C', '#EA580C');
//       doc.text('TRANSPORTATION DETAILS', leftX + 10, doc.y + 5);

//       doc.fillColor('#000000');
//       doc.moveDown(1.5);

//       offHireNote.trips.forEach((trip, index) => {
//         const tripY = doc.y;
//         const tripHeight = 120 + (trip.manpower && trip.manpower.length > 0 ? 40 * trip.manpower.length : 0);

//         // Add new page if needed
//         if (tripY + tripHeight > pageHeight - 100) {
//           doc.addPage();
//           doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
//           doc.y = 50;
//         }

//         doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke('#CCCCCC');

//         doc.fontSize(10).font('Helvetica-Bold').fillColor('#EA580C');
//         doc.text(`Trip ${trip.trip_number}`, leftX + 10, doc.y + 10);
//         doc.fillColor('#000000');

//         const tripDetailsY = doc.y + 30;
//         doc.fontSize(9).font('Helvetica-Bold');
//         doc.text('Company:', leftX + 10, tripDetailsY);
//         doc.text('Driver:', leftX + 10, tripDetailsY + 15);
//         doc.text('Contact:', leftX + 10, tripDetailsY + 30);
//         doc.text('Vehicle Type:', leftX + 10, tripDetailsY + 45);
//         doc.text('Vehicle No.:', leftX + 10, tripDetailsY + 60);

//         doc.font('Helvetica');
//         doc.text(trip.transportation_company, leftX + 100, tripDetailsY, { width: 200 });
//         doc.text(trip.driver_name, leftX + 100, tripDetailsY + 15);
//         doc.text(trip.driver_contact, leftX + 100, tripDetailsY + 30);
//         doc.text(trip.vehicle_type || 'N/A', leftX + 100, tripDetailsY + 45);
//         doc.text(trip.vehicle_number || 'N/A', leftX + 100, tripDetailsY + 60);

//         if (trip.trip_date) {
//           doc.font('Helvetica-Bold');
//           doc.text('Trip Date:', rightX, tripDetailsY);
//           doc.font('Helvetica');
//           doc.text(new Date(trip.trip_date).toLocaleDateString('en-GB'), rightX + 80, tripDetailsY);
//         }

//         // Manpower resources for this trip
//         if (trip.manpower && trip.manpower.length > 0) {
//           const manpowerY = tripDetailsY + 80;
//           doc.fontSize(9).font('Helvetica-Bold').fillColor('#EA580C');
//           doc.text('Assigned Manpower:', leftX + 10, manpowerY);
//           doc.fillColor('#000000');

//           trip.manpower.forEach((mp, idx) => {
//             doc.fontSize(8).font('Helvetica');
//             doc.text(`${mp.employee_name} (${mp.employee_no})`, leftX + 120, manpowerY + (idx * 15));
//           });
//         }

//         if (trip.remarks) {
//           doc.fontSize(8).font('Helvetica-Oblique');
//           doc.text(`Remarks: ${trip.remarks}`, leftX + 10, tripDetailsY + 100 + (trip.manpower && trip.manpower.length > 0 ? 40 : 0));
//         }

//         doc.y += tripHeight + 10;
//       });
//     }

//     // Remarks Section
//     if (offHireNote.remarks) {
//       doc.moveDown(1);
//       doc.fontSize(11).font('Helvetica-Bold').fillColor('#EA580C');
//       doc.text('REMARKS', leftX);
//       doc.fillColor('#000000');

//       doc.fontSize(9).font('Helvetica');
//       doc.rect(leftX, doc.y + 5, pageWidth - 100, 40).stroke('#CCCCCC');
//       doc.text(offHireNote.remarks, leftX + 10, doc.y + 15, { width: pageWidth - 120 });
//       doc.y += 50;
//     }

//     doc.moveDown(2);

//     // Acknowledgement Box
//     doc.rect(leftX, doc.y, pageWidth - 100, 30).fillAndStroke('#FFEDD5', '#CCCCCC');
//     doc.fontSize(9).font('Helvetica-Oblique').fillColor('#000000');
//     doc.text('We acknowledge that the operator has been returned in good health and proper condition.',
//       leftX + 10, doc.y + 10, { width: pageWidth - 120, align: 'center' });

//     doc.moveDown(3);

//     // Signature Section
//     const sigY = doc.y;

//     // Check if we need a new page
//     if (sigY + 120 > pageHeight - 60) {
//       doc.addPage();
//       doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
//       doc.y = 50;
//     }

//     doc.fontSize(10).font('Helvetica-Bold');

//     // Left signature
//     doc.text('Received By:', leftX, doc.y);
//     doc.moveTo(leftX, doc.y + 50).lineTo(leftX + 200, doc.y + 50).stroke();
//     doc.font('Helvetica').fontSize(8);
//     doc.text('Name & Signature', leftX, doc.y + 55);

//     // Right signature
//     doc.font('Helvetica-Bold').fontSize(10);
//     doc.text('Date:', rightX, sigY);
//     doc.moveTo(rightX, sigY + 50).lineTo(rightX + 200, sigY + 50).stroke();
//     doc.font('Helvetica').fontSize(8);
//     doc.text('DD/MM/YYYY', rightX, sigY + 55);

//     doc.moveDown(4);

//     // Contact section
//     doc.text('Contact No.:', leftX, doc.y);
//     doc.moveTo(leftX, doc.y + 50).lineTo(leftX + 200, doc.y + 50).stroke();

//     // Footer
//     doc.fontSize(7).font('Helvetica-Oblique').fillColor('#666666');
//     doc.text('This is a computer generated document. No signature is required.',
//       0, pageHeight - 50, { align: 'center', width: pageWidth });

//     doc.end();
//   } catch (error) {
//     console.error("Error generating operator off hire note PDF:", error);
//     res.status(500).json({
//       message: "Error generating operator off hire note PDF",
//       error: error.message
//     });
//   }
// };

// // ==================== EXPORTS ====================

// module.exports = {
//   // Swap Reasons
//   getOperatorSwapReasons,

//   // Dropdown Functions
//   getAllEquipmentForOperator,
//   getManpowerByOperatorType,
//   getAllOperatorTypes,

//   // Operator Change Creation & Retrieval
//   createOperatorChange,
//   getOperatorChangeById,
//   getOperatorChangesBySalesOrder,

//   // Delivery Note Functions
//   createOperatorDeliveryNote,
//   getOperatorDeliveryNoteById,
//   getLatestOperatorDeliveryNote,
//   getOperatorDeliveryNoteSummary,
//   submitOperatorDNForApproval,
//   approveOperatorDeliveryNote,
//   rejectOperatorDeliveryNote,
//   closeOperatorDeliveryNote,
//   uploadOperatorDeliveryNote,
//   generateOperatorDeliveryNotePDF,

//   // Off Hire Note Functions
//   createOperatorOffHireNote,
//   getOperatorOffHireNoteById,
//   getLatestOperatorOffHireNote,
//   getOperatorOffHireNoteSummary,
//   submitOperatorOHNForApproval,
//   approveOperatorOffHireNote,
//   rejectOperatorOffHireNote,
//   closeOperatorOffHireNote,
//   uploadOperatorOffHireNote,
//   generateOperatorOffHireNotePDF,

//   // Trip Management Functions
//   addTripToOperatorDeliveryNote,
//   addTripToOperatorOffHireNote,
//   updateTripInOperatorDN,
//   updateTripInOperatorOHN,
//   deleteTripFromOperatorDN,
//   deleteTripFromOperatorOHN,

//   // Checklist Functions
//   uploadOperatorDNChecklist,
//   uploadOperatorOHNChecklist,
//   downloadOperatorDNChecklist,
//   downloadOperatorOHNChecklist,
// };

// controllers/fleet-management/OperatorChangeController.js (REGENERATED - With proper status synchronization)
const OperatorChangeModel = require("../models/OperatorChangeModel");
const EquipmentModel = require("../models/EquipmentModel");
const ManpowerModel = require("../models/ManpowerModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const {
  OperatorDeliveryNoteModel,
  OperatorDeliveryNoteTripModel,
  OperatorDNManpowerModel,
} = require("../models/OperatorDeliveryNoteModel");
const {
  OperatorOffHireNoteModel,
  OperatorOffHireNoteTripModel,
  OperatorOHNManpowerModel,
} = require("../models/OperatorOffHireNoteModel");
const OperatorTypeModel = require("../models/OperatorTypeModel");
const sequelize = require("../../src/config/dbSync");
const { Op } = require("sequelize");
const UsersModel = require("../../../user-management-service/src/models/UsersModel");
const SwapReasonModel = require("../models/swapReasonModel");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

// ==================== UTILITY FUNCTIONS ====================

const generateOperatorDNNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `OP-DN-${currentYear}-`;

  const lastDN = await OperatorDeliveryNoteModel.findOne({
    where: { dn_number: { [Op.like]: `${prefix}%` } },
    order: [["dn_number", "DESC"]],
  });

  let nextNumber = 1;
  if (lastDN) {
    const parts = lastDN.dn_number.split("-");
    const lastNumber = parseInt(parts[parts.length - 1]);
    if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
};

const generateOperatorOHNNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `OP-OH-${currentYear}-`;

  const lastOHN = await OperatorOffHireNoteModel.findOne({
    where: { ohn_number: { [Op.like]: `${prefix}%` } },
    order: [["ohn_number", "DESC"]],
  });

  let nextNumber = 1;
  if (lastOHN) {
    const parts = lastOHN.ohn_number.split("-");
    const lastNumber = parseInt(parts[parts.length - 1]);
    if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
};

const getUsername = async (req) => {
  try {
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) return user.username;
    }
    return req.user?.username || "System";
  } catch {
    return "System";
  }
};

// Format: OP-YYYYMMDD-XXXX (e.g. OP-20260224-C1E5)
const generateChangeGroupId = (prefix = "OP") => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, ""); // "20260224"
  const randomPart = Math.random().toString(36).toUpperCase().slice(2, 6); // 4 random alphanumeric chars
  return `${prefix}-${datePart}-${randomPart}`;
};

/**
 * Helper function to update operator change statuses after note creation
 * Ensures both delivery_note_status and off_hire_note_status are properly set
 */
const updateOperatorChangeStatusAfterNoteCreation = async (
  operatorChange,
  noteType,
  noteId,
  transaction,
) => {
  try {
    if (!operatorChange.change_group_id) {
      // No group ID - simple update for single record
      const updateData = {};
      if (noteType === "DELIVERY") {
        updateData.delivery_note_status = "In Progress";
      } else {
        updateData.off_hire_note_status = "In Progress";
      }

      await OperatorChangeModel.update(updateData, {
        where: { operator_change_id: operatorChange.operator_change_id },
        transaction,
      });
      return;
    }

    // Get all changes in the same group
    const groupChanges = await OperatorChangeModel.findAll({
      where: {
        change_group_id: operatorChange.change_group_id,
      },
      transaction,
    });

    const currentChange = groupChanges.find(
      (c) => c.operator_change_id === operatorChange.operator_change_id,
    );

    if (!currentChange) return;

    // Find the partner change (opposite type)
    const partnerChange = groupChanges.find(
      (c) => c.change_type !== currentChange.change_type,
    );

    if (!partnerChange) {
      // No partner - just update this one
      const updateData = {};
      if (noteType === "DELIVERY") {
        updateData.delivery_note_status = "In Progress";
      } else {
        updateData.off_hire_note_status = "In Progress";
      }

      await OperatorChangeModel.update(updateData, {
        where: { operator_change_id: currentChange.operator_change_id },
        transaction,
      });
      return;
    }

    // Check if partner already has a note
    let partnerHasNote = false;
    if (partnerChange.change_type === "DELIVERY") {
      const partnerNote = await OperatorDeliveryNoteModel.findOne({
        where: { operator_change_id: partnerChange.operator_change_id },
        transaction,
      });
      partnerHasNote = !!partnerNote;
    } else {
      const partnerNote = await OperatorOffHireNoteModel.findOne({
        where: { operator_change_id: partnerChange.operator_change_id },
        transaction,
      });
      partnerHasNote = !!partnerNote;
    }

    // Update current change
    const currentUpdate = {};
    if (noteType === "DELIVERY") {
      currentUpdate.delivery_note_status = "In Progress";
    } else {
      currentUpdate.off_hire_note_status = "In Progress";
    }

    await OperatorChangeModel.update(currentUpdate, {
      where: { operator_change_id: currentChange.operator_change_id },
      transaction,
    });
  } catch (error) {
    console.error("Error updating operator change status:", error);
    throw error;
  }
};

/**
 * Updates operator change statuses when a note is uploaded/completed
 */
const updateOperatorChangeStatusOnNoteUpload = async (
  operatorChange,
  noteType,
  transaction,
) => {
  try {
    if (!operatorChange) return;

    const updateData = {};

    if (noteType === "DELIVERY") {
      updateData.delivery_note_status = "Completed";
    } else {
      updateData.off_hire_note_status = "Completed";
    }

    // If this is a group change, check partner status
    if (operatorChange.change_group_id) {
      const partnerChange = await OperatorChangeModel.findOne({
        where: {
          change_group_id: operatorChange.change_group_id,
          operator_change_id: { [Op.ne]: operatorChange.operator_change_id },
        },
        transaction,
      });

      if (partnerChange) {
        const partnerStatus =
          noteType === "DELIVERY"
            ? partnerChange.off_hire_note_status
            : partnerChange.delivery_note_status;
      }
    }

    await operatorChange.update(updateData, { transaction });
  } catch (error) {
    console.error("Error updating operator change status on upload:", error);
    throw error;
  }
};

// ==================== SWAP REASONS FUNCTIONS ====================

const getOperatorSwapReasons = async (req, res) => {
  try {
    const swapReasons = await SwapReasonModel.findAll({
      where: {
        category: "Operator",
        status: "Active",
      },
      attributes: ["swap_reason_id", "swap_reason_name"],
      order: [["swap_reason_name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      swapReasons,
    });
  } catch (error) {
    console.error("Error fetching operator swap reasons:", error);
    res.status(500).json({
      message: "Error fetching operator swap reasons",
      error: error.message,
    });
  }
};

// ==================== DROPDOWN FUNCTIONS ====================

const getAllEquipmentForOperator = async (req, res) => {
  try {
    const equipment = await EquipmentModel.findAll({
      where: { status: "Active" },
      attributes: ["serial_number", "reg_number", "vehicle_type"],
      order: [["reg_number", "ASC"]],
    });

    res.status(200).json({
      success: true,
      equipment,
    });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ error: error.message });
  }
};

const getManpowerByOperatorType = async (req, res) => {
  try {
    const { operator_type } = req.query;

    const whereClause = { status: "Active" };
    if (operator_type) {
      whereClause.operator_type_id = operator_type;
    }

    const manpower = await ManpowerModel.findAll({
      where: whereClause,
      include: [
        {
          model: OperatorTypeModel,
          as: "operator_type",
          attributes: ["operator_type_id", "operator_type"],
        },
      ],
      attributes: [
        "manpower_id",
        "employeeId",
        "employeeNo",
        "employeeFullName",
        "operator_type_id",
      ],
      order: [["employeeFullName", "ASC"]],
    });

    res.status(200).json({
      success: true,
      manpower: manpower.map((mp) => ({
        manpower_id: mp.manpower_id,
        employeeId: mp.employeeId,
        employeeNo: mp.employeeNo,
        employeeFullName: mp.employeeFullName,
        operator_type: mp.operator_type?.operator_type || "N/A",
      })),
    });
  } catch (error) {
    console.error("Error fetching manpower:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllOperatorTypes = async (req, res) => {
  try {
    const operatorTypes = await OperatorTypeModel.findAll({
      where: { status: "Active" },
      attributes: ["operator_type_id", "operator_type"],
      order: [["operator_type", "ASC"]],
    });

    res.status(200).json({
      success: true,
      operatorTypes,
    });
  } catch (error) {
    console.error("Error fetching operator types:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== OPERATOR CHANGE CREATION ====================

const createOperatorChange = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      sales_order_id,
      allocation_id,
      equipment_serial_number,
      plate_number,
      previous_operator_id,
      new_operator_id,
      operator_type,
      change_date,
      change_reason,
      change_estimated_transfer_cost,
      change_remark,
    } = req.body;

    console.log("Received operator change payload:", {
      sales_order_id,
      allocation_id,
      equipment_serial_number,
      plate_number,
      previous_operator_id,
      new_operator_id,
      operator_type,
      change_date,
      change_reason,
    });

    // Validate required fields
    const missingFields = [];
    if (!sales_order_id) missingFields.push("sales_order_id");
    if (!new_operator_id) missingFields.push("new_operator_id");
    if (!change_date) missingFields.push("change_date");
    if (!change_reason) missingFields.push("change_reason");

    if (missingFields.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message: "All required fields must be filled",
        missingFields,
        receivedData: req.body,
      });
    }

    // Get sales order
    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
    if (!salesOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sales order not found" });
    }

    // Derive previous_operator_id from allocation if not provided
    let derivedPreviousOperatorId = previous_operator_id;
    let previousEmployeeId = null;

    if (allocation_id && !derivedPreviousOperatorId) {
      const ActiveAllocationManpowerModel =
        require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationManpowerModel;

      const currentAllocation = await ActiveAllocationManpowerModel.findOne({
        where: { allocation_id },
        transaction,
      });

      if (currentAllocation) {
        previousEmployeeId = currentAllocation.employee_id;

        const currentOperator = await ManpowerModel.findOne({
          where: { employeeId: previousEmployeeId },
          transaction,
        });

        if (currentOperator) {
          derivedPreviousOperatorId = currentOperator.manpower_id;
          console.log(
            "Derived previous operator ID from allocation:",
            derivedPreviousOperatorId,
          );
        }
      }
    }

    if (!derivedPreviousOperatorId) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Unable to determine previous operator. Please ensure allocation has an assigned operator or provide previous_operator_id.",
        allocation_id,
      });
    }

    // Get previous operator details
    const previousOperator = await ManpowerModel.findOne({
      where: { manpower_id: derivedPreviousOperatorId },
      include: [{ model: OperatorTypeModel, as: "operator_type" }],
      transaction,
    });

    if (!previousOperator) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Previous operator not found",
        previous_operator_id: derivedPreviousOperatorId,
      });
    }

    // Get new operator details
    const newOperator = await ManpowerModel.findOne({
      where: { manpower_id: new_operator_id },
      include: [{ model: OperatorTypeModel, as: "operator_type" }],
      transaction,
    });

    if (!newOperator) {
      await transaction.rollback();
      return res.status(404).json({
        message: "New operator not found",
        new_operator_id,
      });
    }

    // Validate operators are different
    if (derivedPreviousOperatorId === new_operator_id) {
      await transaction.rollback();
      return res.status(400).json({
        message: "New operator must be different from previous operator",
      });
    }

    // Get logged in user
    let username = "System";
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid, { transaction });
      if (user) {
        username = user.username;
      }
    }

    const finalOperatorType =
      operator_type ||
      newOperator.operator_type?.operator_type ||
      previousOperator.operator_type?.operator_type;

    // Generate one shared group ID for both records of this change operation
    const changeGroupId = generateChangeGroupId("OP");

    // CREATE RECORD 1: OFF_HIRE — for the outgoing/previous operator
    const offHireRecord = await OperatorChangeModel.create(
      {
        change_group_id: changeGroupId,
        sales_order_id,
        allocation_id: allocation_id || null,
        equipment_serial_number: equipment_serial_number || null,
        plate_number: plate_number || null,
        previous_operator_id: derivedPreviousOperatorId,
        previous_operator_name: previousOperator.employeeFullName,
        new_operator_id: null,
        new_operator_name: null,
        operator_type: finalOperatorType,
        change_date,
        change_reason,
        change_estimated_transfer_cost: change_estimated_transfer_cost || null,
        change_remark: change_remark || null,
        change_type: "OFF_HIRE",
        delivery_note_status: "Pending",
        off_hire_note_status: "Pending",
        overall_status: "Creation",
        created_by: username,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction },
    );

    // CREATE RECORD 2: DELIVERY — for the incoming/new operator
    const deliveryRecord = await OperatorChangeModel.create(
      {
        change_group_id: changeGroupId,
        sales_order_id,
        allocation_id: allocation_id || null,
        equipment_serial_number: equipment_serial_number || null,
        plate_number: plate_number || null,
        previous_operator_id: null,
        previous_operator_name: null,
        new_operator_id,
        new_operator_name: newOperator.employeeFullName,
        operator_type: finalOperatorType,
        change_date,
        change_reason,
        change_estimated_transfer_cost: change_estimated_transfer_cost || null,
        change_remark: change_remark || null,
        change_type: "DELIVERY",
        delivery_note_status: "Pending",
        off_hire_note_status: "Pending",
        overall_status: "Creation",
        created_by: username,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction },
    );

    // Update allocation if allocation_id is provided
    if (allocation_id) {
      const ActiveAllocationManpowerModel =
        require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationManpowerModel;

      const updateResult = await ActiveAllocationManpowerModel.update(
        {
          employee_id: newOperator.employeeId,
          updated_at: new Date(),
        },
        {
          where: {
            allocation_id: allocation_id,
            employee_id: previousOperator.employeeId,
          },
          transaction,
        },
      );

      console.log("Allocation manpower update result:", updateResult);

      if (updateResult[0] === 0) {
        console.warn("Warning: No allocation manpower records were updated.");
      }
    }

    await transaction.commit();

    console.log("Operator change created successfully with two records:", {
      changeGroupId,
      offHireId: offHireRecord.operator_change_id,
      deliveryId: deliveryRecord.operator_change_id,
    });

    res.status(201).json({
      message: "Operator change created successfully",
      change_group_id: changeGroupId,
      data: {
        changeGroupId,
        offHireRecord,
        deliveryRecord,
        previousOperator: {
          manpower_id: previousOperator.manpower_id,
          employee_id: previousOperator.employeeId,
          name: previousOperator.employeeFullName,
          employee_no: previousOperator.employeeNo,
        },
        newOperator: {
          manpower_id: newOperator.manpower_id,
          employee_id: newOperator.employeeId,
          name: newOperator.employeeFullName,
          employee_no: newOperator.employeeNo,
        },
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating operator change:", error);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      message: "Error creating operator change",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// ==================== GET FUNCTIONS ====================

const getOperatorChangeById = async (req, res) => {
  try {
    const { id } = req.params;

    const operatorChange = await OperatorChangeModel.findByPk(id, {
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: EquipmentModel,
          as: "equipment",
          attributes: ["serial_number", "reg_number", "vehicle_type"],
        },
        {
          model: ManpowerModel,
          as: "previousOperator",
          attributes: ["manpower_id", "employeeNo", "employeeFullName"],
        },
        {
          model: ManpowerModel,
          as: "newOperator",
          attributes: ["manpower_id", "employeeNo", "employeeFullName"],
        },
        {
          model: OperatorDeliveryNoteModel,
          as: "deliveryNotes",
          include: [
            {
              model: OperatorDeliveryNoteTripModel,
              as: "trips",
              include: [
                {
                  model: OperatorDNManpowerModel,
                  as: "manpower",
                },
              ],
            },
          ],
          order: [["created_at", "DESC"]],
        },
        {
          model: OperatorOffHireNoteModel,
          as: "offHireNotes",
          include: [
            {
              model: OperatorOffHireNoteTripModel,
              as: "trips",
              include: [
                {
                  model: OperatorOHNManpowerModel,
                  as: "manpower",
                },
              ],
            },
          ],
          order: [["created_at", "DESC"]],
        },
      ],
    });

    if (!operatorChange) {
      return res.status(404).json({ message: "Operator change not found" });
    }

    res.status(200).json({
      operatorChange,
    });
  } catch (error) {
    console.error("Error fetching operator change:", error);
    res.status(500).json({
      message: "Error fetching operator change",
      error: error.message,
    });
  }
};

const getOperatorChangesBySalesOrder = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    const operatorChanges = await OperatorChangeModel.findAll({
      where: { sales_order_id },
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: EquipmentModel,
          as: "equipment",
          attributes: ["serial_number", "reg_number", "vehicle_type"],
        },
        {
          model: ManpowerModel,
          as: "previousOperator",
          attributes: ["manpower_id", "employeeNo", "employeeFullName"],
        },
        {
          model: ManpowerModel,
          as: "newOperator",
          attributes: ["manpower_id", "employeeNo", "employeeFullName"],
        },
        {
          model: OperatorDeliveryNoteModel,
          as: "deliveryNotes",
          order: [["created_at", "DESC"]],
        },
        {
          model: OperatorOffHireNoteModel,
          as: "offHireNotes",
          order: [["created_at", "DESC"]],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      totalCount: operatorChanges.length,
      operatorChanges,
    });
  } catch (error) {
    console.error("Error fetching operator changes:", error);
    res.status(500).json({
      message: "Error fetching operator changes",
      error: error.message,
    });
  }
};

const getOperatorChangeByGroupId = async (req, res) => {
  try {
    const { group_id } = req.params;

    const operatorChanges = await OperatorChangeModel.findAll({
      where: { change_group_id: group_id },
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: EquipmentModel,
          as: "equipment",
          attributes: ["serial_number", "reg_number", "vehicle_type"],
        },
        {
          model: ManpowerModel,
          as: "previousOperator",
          attributes: ["manpower_id", "employeeNo", "employeeFullName"],
        },
        {
          model: ManpowerModel,
          as: "newOperator",
          attributes: ["manpower_id", "employeeNo", "employeeFullName"],
        },
        {
          model: OperatorDeliveryNoteModel,
          as: "deliveryNotes",
          order: [["created_at", "DESC"]],
        },
        {
          model: OperatorOffHireNoteModel,
          as: "offHireNotes",
          order: [["created_at", "DESC"]],
        },
      ],
      order: [["change_type", "ASC"]],
    });

    if (!operatorChanges || operatorChanges.length === 0) {
      return res
        .status(404)
        .json({ message: "Operator change group not found" });
    }

    res.status(200).json({
      change_group_id: group_id,
      operatorChanges,
    });
  } catch (error) {
    console.error("Error fetching operator change by group ID:", error);
    res.status(500).json({
      message: "Error fetching operator change by group ID",
      error: error.message,
    });
  }
};

// ==================== DELIVERY NOTE FUNCTIONS ====================

const createOperatorDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_change_id } = req.params;
    const { remarks, trips } = req.body;

    // Get operator change
    const operatorChange = await OperatorChangeModel.findByPk(
      operator_change_id,
      {
        include: [
          {
            model: ManpowerModel,
            as: "newOperator",
            attributes: ["manpower_id", "employeeNo", "employeeFullName"],
          },
          {
            model: SalesOrdersModel,
            as: "salesOrder",
            attributes: ["so_number", "client", "project_name"],
          },
        ],
      },
    );

    if (!operatorChange) {
      await transaction.rollback();
      return res.status(404).json({ message: "Operator change not found" });
    }

    // Check if this is a DELIVERY type record
    if (operatorChange.change_type !== "DELIVERY") {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Cannot create delivery note for OFF_HIRE operator change record",
      });
    }

    // Generate DN number
    const dn_number = await generateOperatorDNNumber();

    // Get logged in user
    let username = await getUsername(req);

    // Create delivery note
    const deliveryNote = await OperatorDeliveryNoteModel.create(
      {
        operator_change_id,
        dn_number,
        new_operator_id: operatorChange.new_operator_id,
        new_operator_name: operatorChange.new_operator_name,
        status: "Creation",
        remarks,
        created_by: username,
      },
      { transaction },
    );

    // Create trips if provided
    if (trips && trips.length > 0) {
      for (const trip of trips) {
        const newTrip = await OperatorDeliveryNoteTripModel.create(
          {
            operator_dn_id: deliveryNote.operator_dn_id,
            trip_number: trip.trip_number,
            transportation_company: trip.transportation_company,
            driver_name: trip.driver_name,
            driver_contact: trip.driver_contact,
            vehicle_type: trip.vehicle_type,
            vehicle_number: trip.vehicle_number,
            recovery_vehicle_number: trip.recovery_vehicle_number || null,
            chargeable_type: trip.chargeable_type || null,
            trip_date: trip.trip_date,
            trip_status: "Creation",
            remarks: trip.remarks,
          },
          { transaction },
        );

        // Add manpower resources to this trip
        if (trip.manpower && trip.manpower.length > 0) {
          for (const mp of trip.manpower) {
            await OperatorDNManpowerModel.create(
              {
                operator_dn_id: deliveryNote.operator_dn_id,
                trip_id: newTrip.trip_id,
                employee_id: mp.employee_id,
                employee_no: mp.employee_no,
                employee_name: mp.employee_name,
              },
              { transaction },
            );
          }
        }
      }
    }

    // Update operator change status
    await updateOperatorChangeStatusAfterNoteCreation(
      operatorChange,
      "DELIVERY",
      deliveryNote.operator_dn_id,
      transaction,
    );

    const sameGroupChangeData = await OperatorChangeModel.findAll({
      where: {
        overall_status: "Partially completed",
        change_group_id: operatorChange.change_group_id,
      },
    });

    if (operatorChange.overall_status === "In progress") {
      if (sameGroupChangeData.length > 0) {
        const operatorGroupChangeData = await OperatorChangeModel.findAll({
          where: {
            change_group_id: operatorChange.change_group_id,
          },
        });

        const ids = operatorGroupChangeData.map((data) =>
          data.getDataValue("operator_change_id"),
        );
        for (const data of operatorGroupChangeData) {
          await OperatorChangeModel.update(
            { overall_status: "Completed" },
            {
              where: { operator_change_id: { [Op.in]: ids } },
              transaction,
            },
          );
        }
      } else {
        await OperatorChangeModel.update(
          { overall_status: "Partially completed" },
          {
            where: { operator_change_id: operatorChange.operator_change_id },
            transaction,
          },
        );
      }
    }

    await transaction.commit();

    // Fetch created delivery note with trips
    const createdDeliveryNote = await OperatorDeliveryNoteModel.findByPk(
      deliveryNote.operator_dn_id,
      {
        include: [
          {
            model: OperatorDeliveryNoteTripModel,
            as: "trips",
            include: [
              {
                model: OperatorDNManpowerModel,
                as: "manpower",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: OperatorChangeModel,
            as: "operatorChange",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
              },
            ],
          },
        ],
      },
    );

    res.status(201).json({
      message: "Operator delivery note created successfully",
      deliveryNote: createdDeliveryNote,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating operator delivery note:", error);
    res.status(500).json({
      message: "Error creating operator delivery note",
      error: error.message,
    });
  }
};

const getOperatorDeliveryNoteById = async (req, res) => {
  try {
    const { operator_dn_id } = req.params;

    const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
      operator_dn_id,
      {
        include: [
          {
            model: OperatorDeliveryNoteTripModel,
            as: "trips",
            include: [
              {
                model: OperatorDNManpowerModel,
                as: "manpower",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: OperatorChangeModel,
            as: "operatorChange",
            include: [
              { model: SalesOrdersModel, as: "salesOrder" },
              {
                model: ManpowerModel,
                as: "newOperator",
                attributes: ["manpower_id", "employeeNo", "employeeFullName"],
              },
            ],
          },
        ],
      },
    );

    if (!deliveryNote) {
      return res.status(404).json({ message: "Delivery note not found" });
    }

    res.status(200).json({ deliveryNote });
  } catch (error) {
    console.error("Error fetching operator delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

const getLatestOperatorDeliveryNote = async (req, res) => {
  try {
    const { operator_change_id } = req.params;

    const deliveryNote = await OperatorDeliveryNoteModel.findOne({
      where: { operator_change_id },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: OperatorDeliveryNoteTripModel,
          as: "trips",
          include: [
            {
              model: OperatorDNManpowerModel,
              as: "manpower",
            },
          ],
          order: [["trip_number", "ASC"]],
        },
        {
          model: OperatorChangeModel,
          as: "operatorChange",
          include: [
            { model: SalesOrdersModel, as: "salesOrder" },
            {
              model: ManpowerModel,
              as: "newOperator",
              attributes: ["manpower_id", "employeeNo", "employeeFullName"],
            },
          ],
        },
      ],
    });

    if (!deliveryNote) {
      return res.status(404).json({ message: "No delivery note found" });
    }

    res.status(200).json({ deliveryNote });
  } catch (error) {
    console.error("Error fetching latest operator delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

const getOperatorDeliveryNoteSummary = async (req, res) => {
  try {
    const { operator_dn_id } = req.params;

    const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
      operator_dn_id,
      {
        include: [
          {
            model: OperatorDeliveryNoteTripModel,
            as: "trips",
            order: [["trip_number", "ASC"]],
          },
          {
            model: OperatorChangeModel,
            as: "operatorChange",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
                attributes: ["so_number", "client", "project_name"],
              },
              {
                model: ManpowerModel,
                as: "newOperator",
                attributes: ["manpower_id", "employeeNo", "employeeFullName"],
              },
            ],
          },
        ],
      },
    );

    if (!deliveryNote) {
      return res.status(404).json({ message: "Delivery note not found" });
    }

    // Format summary data
    const summaryData = {
      dn_number: deliveryNote.dn_number,
      operator: deliveryNote.operatorChange.newOperator,
      status: deliveryNote.status,
      trips: deliveryNote.trips.map((trip) => ({
        trip_number: trip.trip_number,
        transportation: {
          company: trip.transportation_company,
          driver: trip.driver_name,
          contact: trip.driver_contact,
          vehicle: trip.vehicle_number,
        },
        trip_date: trip.trip_date,
        trip_status: trip.trip_status,
        remarks: trip.remarks,
      })),
    };

    res.status(200).json({
      success: true,
      summary: summaryData,
    });
  } catch (error) {
    console.error("Error fetching delivery note summary:", error);
    res.status(500).json({
      message: "Error fetching delivery note summary",
      error: error.message,
    });
  }
};

// ==================== OFF-HIRE NOTE FUNCTIONS ====================

const createOperatorOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_change_id } = req.params;
    const { remarks, trips } = req.body;

    // Get operator change
    const operatorChange = await OperatorChangeModel.findByPk(
      operator_change_id,
      {
        include: [
          {
            model: ManpowerModel,
            as: "previousOperator",
            attributes: ["manpower_id", "employeeNo", "employeeFullName"],
          },
          {
            model: SalesOrdersModel,
            as: "salesOrder",
            attributes: ["so_number", "client", "project_name"],
          },
        ],
      },
    );

    if (!operatorChange) {
      await transaction.rollback();
      return res.status(404).json({ message: "Operator change not found" });
    }

    // Check if this is an OFF_HIRE type record
    if (operatorChange.change_type !== "OFF_HIRE") {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Cannot create off hire note for DELIVERY operator change record",
      });
    }

    // Generate OHN number
    const ohn_number = await generateOperatorOHNNumber();

    // Get logged in user
    let username = await getUsername(req);

    // Create off hire note
    const offHireNote = await OperatorOffHireNoteModel.create(
      {
        operator_change_id,
        ohn_number,
        previous_operator_id: operatorChange.previous_operator_id,
        previous_operator_name: operatorChange.previous_operator_name,
        status: "Creation",
        remarks,
        created_by: username,
      },
      { transaction },
    );

    // Create trips if provided
    if (trips && trips.length > 0) {
      for (const trip of trips) {
        const newTrip = await OperatorOffHireNoteTripModel.create(
          {
            operator_ohn_id: offHireNote.operator_ohn_id,
            trip_number: trip.trip_number,
            transportation_company: trip.transportation_company,
            driver_name: trip.driver_name,
            driver_contact: trip.driver_contact,
            vehicle_type: trip.vehicle_type,
            vehicle_number: trip.vehicle_number,
            recovery_vehicle_number: trip.recovery_vehicle_number || null,
            chargeable_type: trip.chargeable_type || null,
            trip_date: trip.trip_date,
            trip_status: "Creation",
            remarks: trip.remarks,
          },
          { transaction },
        );

        // Add manpower resources to this trip
        if (trip.manpower && trip.manpower.length > 0) {
          for (const mp of trip.manpower) {
            await OperatorOHNManpowerModel.create(
              {
                operator_ohn_id: offHireNote.operator_ohn_id,
                trip_id: newTrip.trip_id,
                employee_id: mp.employee_id,
                employee_no: mp.employee_no,
                employee_name: mp.employee_name,
              },
              { transaction },
            );
          }
        }
      }
    }

    // Update operator change status
    await updateOperatorChangeStatusAfterNoteCreation(
      operatorChange,
      "OFF_HIRE",
      offHireNote.operator_ohn_id,
      transaction,
    );

    const sameGroupChangeData = await OperatorChangeModel.findAll({
      where: {
        overall_status: "Partially completed",
        change_group_id: operatorChange.change_group_id,
      },
    });

    if (operatorChange.overall_status === "In progress") {
      if (sameGroupChangeData.length > 0) {
        const operatorGroupChangeData = await OperatorChangeModel.findAll({
          where: {
            change_group_id: operatorChange.change_group_id,
          },
        });

        const ids = operatorGroupChangeData.map((data) =>
          data.getDataValue("operator_change_id"),
        );
        for (const data of operatorGroupChangeData) {
          await OperatorChangeModel.update(
            { overall_status: "Completed" },
            {
              where: { operator_change_id: { [Op.in]: ids } },
              transaction,
            },
          );
        }
      } else {
        await OperatorChangeModel.update(
          { overall_status: "Partially completed" },
          {
            where: { operator_change_id: operatorChange.operator_change_id },
            transaction,
          },
        );
      }
    }

    await transaction.commit();

    // Fetch created off hire note with trips
    const createdOffHireNote = await OperatorOffHireNoteModel.findByPk(
      offHireNote.operator_ohn_id,
      {
        include: [
          {
            model: OperatorOffHireNoteTripModel,
            as: "trips",
            include: [
              {
                model: OperatorOHNManpowerModel,
                as: "manpower",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: OperatorChangeModel,
            as: "operatorChange",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
              },
            ],
          },
        ],
      },
    );

    res.status(201).json({
      message: "Operator off hire note created successfully",
      offHireNote: createdOffHireNote,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating operator off hire note:", error);
    res.status(500).json({
      message: "Error creating operator off hire note",
      error: error.message,
    });
  }
};

const getOperatorOffHireNoteById = async (req, res) => {
  try {
    const { operator_ohn_id } = req.params;

    const offHireNote = await OperatorOffHireNoteModel.findByPk(
      operator_ohn_id,
      {
        include: [
          {
            model: OperatorOffHireNoteTripModel,
            as: "trips",
            include: [
              {
                model: OperatorOHNManpowerModel,
                as: "manpower",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: OperatorChangeModel,
            as: "operatorChange",
            include: [
              { model: SalesOrdersModel, as: "salesOrder" },
              {
                model: ManpowerModel,
                as: "previousOperator",
                attributes: ["manpower_id", "employeeNo", "employeeFullName"],
              },
            ],
          },
        ],
      },
    );

    if (!offHireNote) {
      return res.status(404).json({ message: "Off hire note not found" });
    }

    res.status(200).json({ offHireNote });
  } catch (error) {
    console.error("Error fetching operator off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

const getLatestOperatorOffHireNote = async (req, res) => {
  try {
    const { operator_change_id } = req.params;

    const offHireNote = await OperatorOffHireNoteModel.findOne({
      where: { operator_change_id },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: OperatorOffHireNoteTripModel,
          as: "trips",
          include: [
            {
              model: OperatorOHNManpowerModel,
              as: "manpower",
            },
          ],
          order: [["trip_number", "ASC"]],
        },
        {
          model: OperatorChangeModel,
          as: "operatorChange",
          include: [
            { model: SalesOrdersModel, as: "salesOrder" },
            {
              model: ManpowerModel,
              as: "previousOperator",
              attributes: ["manpower_id", "employeeNo", "employeeFullName"],
            },
          ],
        },
      ],
    });

    if (!offHireNote) {
      return res.status(404).json({ message: "No off hire note found" });
    }

    res.status(200).json({ offHireNote });
  } catch (error) {
    console.error("Error fetching latest operator off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

const getOperatorOffHireNoteSummary = async (req, res) => {
  try {
    const { operator_ohn_id } = req.params;

    const offHireNote = await OperatorOffHireNoteModel.findByPk(
      operator_ohn_id,
      {
        include: [
          {
            model: OperatorOffHireNoteTripModel,
            as: "trips",
            order: [["trip_number", "ASC"]],
          },
          {
            model: OperatorChangeModel,
            as: "operatorChange",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
                attributes: ["so_number", "client", "project_name"],
              },
              {
                model: ManpowerModel,
                as: "previousOperator",
                attributes: ["manpower_id", "employeeNo", "employeeFullName"],
              },
            ],
          },
        ],
      },
    );

    if (!offHireNote) {
      return res.status(404).json({ message: "Off hire note not found" });
    }

    // Format summary data
    const summaryData = {
      ohn_number: offHireNote.ohn_number,
      operator: offHireNote.operatorChange.previousOperator,
      status: offHireNote.status,
      trips: offHireNote.trips.map((trip) => ({
        trip_number: trip.trip_number,
        transportation: {
          company: trip.transportation_company,
          driver: trip.driver_name,
          contact: trip.driver_contact,
          vehicle: trip.vehicle_number,
        },
        trip_date: trip.trip_date,
        trip_status: trip.trip_status,
        remarks: trip.remarks,
      })),
    };

    res.status(200).json({
      success: true,
      summary: summaryData,
    });
  } catch (error) {
    console.error("Error fetching off hire note summary:", error);
    res.status(500).json({
      message: "Error fetching off hire note summary",
      error: error.message,
    });
  }
};

// ==================== STATUS MANAGEMENT FUNCTIONS ====================

const submitOperatorDNForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_dn_id } = req.params;

    const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
      operator_dn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (deliveryNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Can only submit delivery notes in 'Creation' status",
      });
    }

    // Update delivery note status
    await deliveryNote.update({ status: "Under Approval" }, { transaction });

    // Update operator change delivery_note_status
    if (deliveryNote.operatorChange) {
      await deliveryNote.operatorChange.update(
        { delivery_note_status: "Under Approval" },
        { transaction },
      );
    }

    await transaction.commit();

    res.status(200).json({
      message: "Submitted for approval successfully",
      deliveryNote: await OperatorDeliveryNoteModel.findByPk(operator_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting operator DN for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

const submitOperatorOHNForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_ohn_id } = req.params;

    const offHireNote = await OperatorOffHireNoteModel.findByPk(
      operator_ohn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (offHireNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Can only submit off hire notes in 'Creation' status",
      });
    }

    // Update off hire note status
    await offHireNote.update({ status: "Under Approval" }, { transaction });

    // Update operator change off_hire_note_status
    if (offHireNote.operatorChange) {
      await offHireNote.operatorChange.update(
        { off_hire_note_status: "Under Approval" },
        { transaction },
      );
    }

    await transaction.commit();

    res.status(200).json({
      message: "Submitted for approval successfully",
      offHireNote: await OperatorOffHireNoteModel.findByPk(operator_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting operator OHN for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

const approveOperatorDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_dn_id } = req.params;
    const username = await getUsername(req);

    const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
      operator_dn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (deliveryNote.status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Delivery note must be 'Under Approval' to approve",
      });
    }

    // Update delivery note
    await deliveryNote.update(
      {
        status: "Approved",
        approved_by: username,
        approved_at: new Date(),
      },
      { transaction },
    );

    // Update operator change delivery_note_status
    if (deliveryNote.operatorChange) {
      await deliveryNote.operatorChange.update(
        { delivery_note_status: "Approved" },
        { transaction },
      );
    }

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note approved successfully",
      deliveryNote: await OperatorDeliveryNoteModel.findByPk(operator_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving operator delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

const approveOperatorOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_ohn_id } = req.params;
    const username = await getUsername(req);

    const offHireNote = await OperatorOffHireNoteModel.findByPk(
      operator_ohn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (offHireNote.status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Off hire note must be 'Under Approval' to approve",
      });
    }

    // Update off hire note
    await offHireNote.update(
      {
        status: "Approved",
        approved_by: username,
        approved_at: new Date(),
      },
      { transaction },
    );

    // Update operator change off_hire_note_status
    if (offHireNote.operatorChange) {
      await offHireNote.operatorChange.update(
        { off_hire_note_status: "Approved" },
        { transaction },
      );
    }

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note approved successfully",
      offHireNote: await OperatorOffHireNoteModel.findByPk(operator_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving operator off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

const rejectOperatorDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_dn_id } = req.params;
    const { reason } = req.body;

    const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
      operator_dn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (deliveryNote.status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Delivery note must be 'Under Approval' to reject",
      });
    }

    // Update delivery note
    await deliveryNote.update(
      {
        status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : deliveryNote.remarks,
      },
      { transaction },
    );

    // Update operator change delivery_note_status
    if (deliveryNote.operatorChange) {
      await deliveryNote.operatorChange.update(
        { delivery_note_status: "Rejected" },
        { transaction },
      );
    }

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note rejected successfully",
      deliveryNote: await OperatorDeliveryNoteModel.findByPk(operator_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting operator delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

const rejectOperatorOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_ohn_id } = req.params;
    const { reason } = req.body;

    const offHireNote = await OperatorOffHireNoteModel.findByPk(
      operator_ohn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (offHireNote.status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Off hire note must be 'Under Approval' to reject",
      });
    }

    // Update off hire note
    await offHireNote.update(
      {
        status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : offHireNote.remarks,
      },
      { transaction },
    );

    // Update operator change off_hire_note_status
    if (offHireNote.operatorChange) {
      await offHireNote.operatorChange.update(
        { off_hire_note_status: "Rejected" },
        { transaction },
      );
    }

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note rejected successfully",
      offHireNote: await OperatorOffHireNoteModel.findByPk(operator_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting operator off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

const completeOperatorDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_dn_id } = req.params;
    const username = await getUsername(req);

    const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
      operator_dn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (
      deliveryNote.status !== "Approved" &&
      deliveryNote.status !== "In Progress"
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Delivery note must be 'Approved' or 'In Progress' to complete",
      });
    }

    // Update delivery note
    await deliveryNote.update(
      {
        status: "Completed",
        completed_by: username,
        completed_at: new Date(),
      },
      { transaction },
    );

    // Update trips status
    await OperatorDeliveryNoteTripModel.update(
      { trip_status: "Completed" },
      {
        where: { operator_dn_id },
        transaction,
      },
    );

    // Update operator change delivery_note_status
    if (deliveryNote.operatorChange) {
      const updateData = { delivery_note_status: "Completed" };

      // Check if this is a group change and partner is also completed
      if (deliveryNote.operatorChange.change_group_id) {
        const partnerChange = await OperatorChangeModel.findOne({
          where: {
            change_group_id: deliveryNote.operatorChange.change_group_id,
            operator_change_id: {
              [Op.ne]: deliveryNote.operatorChange.operator_change_id,
            },
          },
          transaction,
        });

        if (
          partnerChange &&
          partnerChange.off_hire_note_status === "Completed"
        ) {
          updateData.overall_status = "Completed";

          // Update partner's overall status
          await partnerChange.update(
            { overall_status: "Completed" },
            { transaction },
          );
        } else {
          updateData.overall_status = "Partially completed";
        }
      } else {
        updateData.overall_status = "In progress";
      }

      await deliveryNote.operatorChange.update(updateData, { transaction });
    }

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note completed successfully",
      deliveryNote: await OperatorDeliveryNoteModel.findByPk(operator_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error completing operator delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

const completeOperatorOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_ohn_id } = req.params;
    const username = await getUsername(req);

    const offHireNote = await OperatorOffHireNoteModel.findByPk(
      operator_ohn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (
      offHireNote.status !== "Approved" &&
      offHireNote.status !== "In Progress"
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Off hire note must be 'Approved' or 'In Progress' to complete",
      });
    }

    // Update off hire note
    await offHireNote.update(
      {
        status: "Completed",
        completed_by: username,
        completed_at: new Date(),
      },
      { transaction },
    );

    // Update trips status
    await OperatorOffHireNoteTripModel.update(
      { trip_status: "Completed" },
      {
        where: { operator_ohn_id },
        transaction,
      },
    );

    // Update operator change off_hire_note_status
    if (offHireNote.operatorChange) {
      const updateData = { off_hire_note_status: "Completed" };

      // Check if this is a group change and partner is also completed
      if (offHireNote.operatorChange.change_group_id) {
        const partnerChange = await OperatorChangeModel.findOne({
          where: {
            change_group_id: offHireNote.operatorChange.change_group_id,
            operator_change_id: {
              [Op.ne]: offHireNote.operatorChange.operator_change_id,
            },
          },
          transaction,
        });

        if (
          partnerChange &&
          partnerChange.delivery_note_status === "Completed"
        ) {
          updateData.overall_status = "Completed";

          // Update partner's overall status
          await partnerChange.update(
            { overall_status: "Completed" },
            { transaction },
          );
        } else {
          updateData.overall_status = "Partially completed";
        }
      } else {
        updateData.overall_status = "In progress";
      }

      await offHireNote.operatorChange.update(updateData, { transaction });
    }

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note completed successfully",
      offHireNote: await OperatorOffHireNoteModel.findByPk(operator_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error completing operator off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

const closeOperatorDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_dn_id } = req.params;

    const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
      operator_dn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (
      deliveryNote.status !== "Approved" ||
      deliveryNote.status !== "Rejected"
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Only approved or rejected delivery notes can be closed",
      });
    }

    // Update delivery note
    await deliveryNote.update({ status: "Close" }, { transaction });

    // Update operator change delivery_note_status
    if (deliveryNote.operatorChange) {
      await deliveryNote.operatorChange.update(
        { delivery_note_status: "Close" },
        { transaction },
      );
    }

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note closed successfully",
      deliveryNote: await OperatorDeliveryNoteModel.findByPk(operator_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing operator delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

const closeOperatorOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_ohn_id } = req.params;

    const offHireNote = await OperatorOffHireNoteModel.findByPk(
      operator_ohn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (
      offHireNote.status !== "Approved" ||
      offHireNote.status !== "Rejected"
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Only approved or rejected off hire notes can be closed",
      });
    }

    // Update off hire note
    await offHireNote.update({ status: "Close" }, { transaction });

    // Update operator change off_hire_note_status
    if (offHireNote.operatorChange) {
      await offHireNote.operatorChange.update(
        { off_hire_note_status: "Close" },
        { transaction },
      );
    }

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note closed successfully",
      offHireNote: await OperatorOffHireNoteModel.findByPk(operator_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing operator off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== TRIP MANAGEMENT FUNCTIONS ====================

// const addTripToOperatorDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_dn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       manpower,
//       remarks,
//     } = req.body;

//     const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
//       operator_dn_id,
//       { transaction },
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     // if (deliveryNote.status !== "Creation") {
//     //   await transaction.rollback();
//     //   return res.status(400).json({
//     //     message:
//     //       "Trips can only be added when delivery note is in Creation status",
//     //   });
//     // }

//     const existingTrips = await OperatorDeliveryNoteTripModel.findAll({
//       where: { operator_dn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per delivery note" });
//     }

//     const newTrip = await OperatorDeliveryNoteTripModel.create(
//       {
//         operator_dn_id,
//         trip_number: existingTrips.length + 1,
//         transportation_company,
//         driver_name,
//         driver_contact,
//         vehicle_type: vehicle_type || null,
//         vehicle_number: vehicle_number || null,
//         recovery_vehicle_number: recovery_vehicle_number || null,
//         chargeable_type: chargeable_type || null,
//         trip_date: trip_date,
//         trip_status: "Creation",
//         remarks: remarks || null,
//       },
//       { transaction },
//     );

//     // Add manpower resources
//     if (manpower && manpower.length > 0) {
//       for (const mp of manpower) {
//         await OperatorDNManpowerModel.create(
//           {
//             operator_dn_id,
//             trip_id: newTrip.trip_id,
//             employee_id: mp.employee_id,
//             employee_no: mp.employee_no,
//             employee_name: mp.employee_name,
//             checklist_file_path: mp.checklist_file_path || null,
//             checklist_file_name: mp.checklist_file_name || null,
//           },
//           { transaction },
//         );
//       }
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await OperatorDeliveryNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: OperatorDNManpowerModel, as: "manpower" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to operator delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const addTripToOperatorOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { operator_ohn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       manpower,
//       remarks,
//     } = req.body;

//     const offHireNote = await OperatorOffHireNoteModel.findByPk(
//       operator_ohn_id,
//       { transaction },
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     // if (offHireNote.status !== "Creation") {
//     //   await transaction.rollback();
//     //   return res.status(400).json({
//     //     message:
//     //       "Trips can only be added when off hire note is in Creation status",
//     //   });
//     // }

//     const existingTrips = await OperatorOffHireNoteTripModel.findAll({
//       where: { operator_ohn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per off hire note" });
//     }

//     const newTrip = await OperatorOffHireNoteTripModel.create(
//       {
//         operator_ohn_id,
//         trip_number: existingTrips.length + 1,
//         transportation_company,
//         driver_name,
//         driver_contact,
//         vehicle_type: vehicle_type || null,
//         vehicle_number: vehicle_number || null,
//         recovery_vehicle_number: recovery_vehicle_number || null,
//         chargeable_type: chargeable_type || null,
//         trip_date: trip_date,
//         trip_status: "Creation",
//         remarks: remarks || null,
//       },
//       { transaction },
//     );

//     // Add manpower resources
//     if (manpower && manpower.length > 0) {
//       for (const mp of manpower) {
//         await OperatorOHNManpowerModel.create(
//           {
//             operator_ohn_id,
//             trip_id: newTrip.trip_id,
//             employee_id: mp.employee_id,
//             employee_no: mp.employee_no,
//             employee_name: mp.employee_name,
//             checklist_file_path: mp.checklist_file_path || null,
//             checklist_file_name: mp.checklist_file_name || null,
//           },
//           { transaction },
//         );
//       }
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await OperatorOffHireNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: OperatorOHNManpowerModel, as: "manpower" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to operator off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// ─── Operator Delivery Note ───────────────────────────────────────────────────
const addTripToOperatorDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();
 
  try {
    const { operator_dn_id } = req.params;
    const { trips } = req.body;
 
    if (!trips || !Array.isArray(trips) || trips.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "trips array is required" });
    }
 
    const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
      operator_dn_id,
      { transaction },
    );
 
    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }
 
    const existingTrips = await OperatorDeliveryNoteTripModel.findAll({
      where: { operator_dn_id },
      transaction,
    });
 
    if (existingTrips.length + trips.length > 7) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Maximum 7 trips allowed per delivery note. Currently has ${existingTrips.length}, trying to add ${trips.length}.`,
      });
    }
 
    const createdTrips = [];
 
    for (let i = 0; i < trips.length; i++) {
      const {
        transportation_company,
        driver_name,
        driver_contact,
        vehicle_type,
        vehicle_number,
        recovery_vehicle_number,
        chargeable_type,
        trip_date,
        manpower,
        remarks,
      } = trips[i];
 
      const newTrip = await OperatorDeliveryNoteTripModel.create(
        {
          operator_dn_id,
          trip_number: existingTrips.length + i + 1,
          transportation_company,
          driver_name,
          driver_contact,
          vehicle_type: vehicle_type || null,
          vehicle_number: vehicle_number || null,
          recovery_vehicle_number: recovery_vehicle_number || null,
          chargeable_type: chargeable_type || null,
          trip_date,
          trip_status: "Creation",
          remarks: remarks || null,
        },
        { transaction },
      );
 
      if (manpower && manpower.length > 0) {
        for (const mp of manpower) {
          await OperatorDNManpowerModel.create(
            {
              operator_dn_id,
              trip_id: newTrip.trip_id,
              employee_id: mp.employee_id,
              employee_no: mp.employee_no,
              employee_name: mp.employee_name,
              checklist_file_path: mp.checklist_file_path || null,
              checklist_file_name: mp.checklist_file_name || null,
            },
            { transaction },
          );
        }
      }
 
      createdTrips.push(newTrip.trip_id);
    }
 
    await transaction.commit();
 
    const result = await OperatorDeliveryNoteTripModel.findAll({
      where: { trip_id: createdTrips },
      include: [{ model: OperatorDNManpowerModel, as: "manpower" }],
    });
 
    res.status(201).json({
      message: "Trips added successfully",
      trips: result,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding trips to operator delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};
 
// ─── Operator Off Hire Note ───────────────────────────────────────────────────
const addTripToOperatorOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();
 
  try {
    const { operator_ohn_id } = req.params;
    const { trips } = req.body;
 
    if (!trips || !Array.isArray(trips) || trips.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "trips array is required" });
    }
 
    const offHireNote = await OperatorOffHireNoteModel.findByPk(
      operator_ohn_id,
      { transaction },
    );
 
    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }
 
    const existingTrips = await OperatorOffHireNoteTripModel.findAll({
      where: { operator_ohn_id },
      transaction,
    });
 
    if (existingTrips.length + trips.length > 7) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Maximum 7 trips allowed per off hire note. Currently has ${existingTrips.length}, trying to add ${trips.length}.`,
      });
    }
 
    const createdTrips = [];
 
    for (let i = 0; i < trips.length; i++) {
      const {
        transportation_company,
        driver_name,
        driver_contact,
        vehicle_type,
        vehicle_number,
        recovery_vehicle_number,
        chargeable_type,
        trip_date,
        manpower,
        remarks,
      } = trips[i];
 
      const newTrip = await OperatorOffHireNoteTripModel.create(
        {
          operator_ohn_id,
          trip_number: existingTrips.length + i + 1,
          transportation_company,
          driver_name,
          driver_contact,
          vehicle_type: vehicle_type || null,
          vehicle_number: vehicle_number || null,
          recovery_vehicle_number: recovery_vehicle_number || null,
          chargeable_type: chargeable_type || null,
          trip_date,
          trip_status: "Creation",
          remarks: remarks || null,
        },
        { transaction },
      );
 
      if (manpower && manpower.length > 0) {
        for (const mp of manpower) {
          await OperatorOHNManpowerModel.create(
            {
              operator_ohn_id,
              trip_id: newTrip.trip_id,
              employee_id: mp.employee_id,
              employee_no: mp.employee_no,
              employee_name: mp.employee_name,
              checklist_file_path: mp.checklist_file_path || null,
              checklist_file_name: mp.checklist_file_name || null,
            },
            { transaction },
          );
        }
      }
 
      createdTrips.push(newTrip.trip_id);
    }
 
    await transaction.commit();
 
    const result = await OperatorOffHireNoteTripModel.findAll({
      where: { trip_id: createdTrips },
      include: [{ model: OperatorOHNManpowerModel, as: "manpower" }],
    });
 
    res.status(201).json({
      message: "Trips added successfully",
      trips: result,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding trips to operator off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateTripInOperatorDN = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;
    const {
      transportation_company,
      driver_name,
      driver_contact,
      vehicle_type,
      vehicle_number,
      recovery_vehicle_number,
      chargeable_type,
      trip_date,
      manpower,
      remarks,
    } = req.body;

    const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.deliveryNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot edit trip — delivery note is in '${trip.deliveryNote.status}' status`,
      });
    }

    await trip.update(
      {
        transportation_company,
        driver_name,
        driver_contact,
        vehicle_type: vehicle_type || null,
        vehicle_number: vehicle_number || null,
        recovery_vehicle_number: recovery_vehicle_number || null,
        chargeable_type: chargeable_type || null,
        trip_date: trip_date,
        remarks: remarks || null,
      },
      { transaction },
    );

    // Replace manpower resources
    if (manpower !== undefined) {
      await OperatorDNManpowerModel.destroy({
        where: { trip_id },
        transaction,
      });

      if (manpower.length > 0) {
        for (const mp of manpower) {
          await OperatorDNManpowerModel.create(
            {
              operator_dn_id: trip.operator_dn_id,
              trip_id,
              employee_id: mp.employee_id,
              employee_no: mp.employee_no,
              employee_name: mp.employee_name,
              checklist_file_path: mp.checklist_file_path || null,
              checklist_file_name: mp.checklist_file_name || null,
            },
            { transaction },
          );
        }
      }
    }

    await transaction.commit();

    res.status(200).json({
      message: "Trip updated successfully",
      trip: await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorDNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating trip in operator DN:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateTripInOperatorOHN = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;
    const {
      transportation_company,
      driver_name,
      driver_contact,
      vehicle_type,
      vehicle_number,
      recovery_vehicle_number,
      chargeable_type,
      trip_date,
      manpower,
      remarks,
    } = req.body;

    const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.offHireNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot edit trip — off hire note is in '${trip.offHireNote.status}' status`,
      });
    }

    await trip.update(
      {
        transportation_company,
        driver_name,
        driver_contact,
        vehicle_type: vehicle_type || null,
        vehicle_number: vehicle_number || null,
        recovery_vehicle_number: recovery_vehicle_number || null,
        chargeable_type: chargeable_type || null,
        trip_date: trip_date,
        remarks: remarks || null,
      },
      { transaction },
    );

    // Replace manpower resources
    if (manpower !== undefined) {
      await OperatorOHNManpowerModel.destroy({
        where: { trip_id },
        transaction,
      });

      if (manpower.length > 0) {
        for (const mp of manpower) {
          await OperatorOHNManpowerModel.create(
            {
              operator_ohn_id: trip.operator_ohn_id,
              trip_id,
              employee_id: mp.employee_id,
              employee_no: mp.employee_no,
              employee_name: mp.employee_name,
              checklist_file_path: mp.checklist_file_path || null,
              checklist_file_name: mp.checklist_file_name || null,
            },
            { transaction },
          );
        }
      }
    }

    await transaction.commit();

    res.status(200).json({
      message: "Trip updated successfully",
      trip: await OperatorOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorOHNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating trip in operator OHN:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTripFromOperatorDN = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.deliveryNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Trips can only be deleted when delivery note is in Creation status",
      });
    }

    await trip.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTripFromOperatorOHN = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.offHireNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Trips can only be deleted when off hire note is in Creation status",
      });
    }

    await trip.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== UPLOAD FUNCTIONS ====================

const uploadOperatorDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_dn_id } = req.params;
    const username = await getUsername(req);

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename;

    const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
      operator_dn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!deliveryNote) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    // Update delivery note
    await deliveryNote.update(
      {
        delivery_attachment: fileName,
        status: "Completed",
        uploaded_by: username || "System",
        uploaded_at: new Date(),
      },
      { transaction },
    );

    // Update operator change status using helper
    if (deliveryNote.operatorChange) {
      await updateOperatorChangeStatusOnNoteUpload(
        deliveryNote.operatorChange,
        "DELIVERY",
        transaction,
      );
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Signed delivery note uploaded successfully",
      fileName,
      status: "Completed",
    });
  } catch (error) {
    await transaction.rollback();
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading operator delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

const uploadOperatorOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { operator_ohn_id } = req.params;
    const username = await getUsername(req);

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename;

    const offHireNote = await OperatorOffHireNoteModel.findByPk(
      operator_ohn_id,
      {
        include: [{ model: OperatorChangeModel, as: "operatorChange" }],
        transaction,
      },
    );

    if (!offHireNote) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    // Update off hire note
    await offHireNote.update(
      {
        off_hire_attachment: fileName,
        status: "Completed",
        uploaded_by: username || "System",
        uploaded_at: new Date(),
      },
      { transaction },
    );

    // Update operator change status using helper
    if (offHireNote.operatorChange) {
      await updateOperatorChangeStatusOnNoteUpload(
        offHireNote.operatorChange,
        "OFF_HIRE",
        transaction,
      );
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Signed off hire note uploaded successfully",
      fileName,
      status: "Completed",
    });
  } catch (error) {
    await transaction.rollback();
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading operator off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

const uploadOperatorDNChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id, resource_id } = req.params;
    const file = req.file;
    const username = await getUsername(req);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resource = await OperatorDNManpowerModel.findOne({
      where: { id: resource_id, trip_id },
      transaction,
    });

    if (!resource) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Manpower resource not found in this trip" });
    }

    await OperatorDNManpowerModel.update(
      {
        checklist_file_path: file.path,
        checklist_file_name: file.originalname,
        checklist_uploaded_at: new Date(),
        checklist_uploaded_by: username || "System",
      },
      { where: { id: resource_id, trip_id }, transaction },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Checklist uploaded successfully",
      file: {
        path: file.path,
        name: file.originalname,
        uploaded_at: new Date(),
        uploaded_by: username || "System",
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error uploading operator DN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

const uploadOperatorOHNChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id, resource_id } = req.params;
    const file = req.file;
    const username = await getUsername(req);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resource = await OperatorOHNManpowerModel.findOne({
      where: { id: resource_id, trip_id },
      transaction,
    });

    if (!resource) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Manpower resource not found in this trip" });
    }

    await OperatorOHNManpowerModel.update(
      {
        checklist_file_path: file.path,
        checklist_file_name: file.originalname,
        checklist_uploaded_at: new Date(),
        checklist_uploaded_by: username || "System",
      },
      { where: { id: resource_id, trip_id }, transaction },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Checklist uploaded successfully",
      file: {
        path: file.path,
        name: file.originalname,
        uploaded_at: new Date(),
        uploaded_by: username || "System",
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error uploading operator OHN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

const downloadOperatorDNChecklist = async (req, res) => {
  try {
    const { trip_id, resource_id } = req.params;

    const resource = await OperatorDNManpowerModel.findOne({
      where: { id: resource_id, trip_id },
    });

    if (!resource) {
      return res.status(404).json({ message: "Manpower resource not found" });
    }

    if (!resource.checklist_file_path || !resource.checklist_file_name) {
      return res
        .status(404)
        .json({ message: "No checklist found for this resource" });
    }

    if (!fs.existsSync(resource.checklist_file_path)) {
      return res
        .status(404)
        .json({ message: "Checklist file not found on server" });
    }

    res.download(
      resource.checklist_file_path,
      resource.checklist_file_name,
      (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ message: "Error downloading checklist file" });
        }
      },
    );
  } catch (error) {
    console.error("Error downloading operator DN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

const downloadOperatorOHNChecklist = async (req, res) => {
  try {
    const { trip_id, resource_id } = req.params;

    const resource = await OperatorOHNManpowerModel.findOne({
      where: { id: resource_id, trip_id },
    });

    if (!resource) {
      return res.status(404).json({ message: "Manpower resource not found" });
    }

    if (!resource.checklist_file_path || !resource.checklist_file_name) {
      return res
        .status(404)
        .json({ message: "No checklist found for this resource" });
    }

    if (!fs.existsSync(resource.checklist_file_path)) {
      return res
        .status(404)
        .json({ message: "Checklist file not found on server" });
    }

    res.download(
      resource.checklist_file_path,
      resource.checklist_file_name,
      (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ message: "Error downloading checklist file" });
        }
      },
    );
  } catch (error) {
    console.error("Error downloading operator OHN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== PDF GENERATION FUNCTIONS ====================

const generateOperatorDeliveryNotePDF = async (req, res) => {
  try {
    const { operator_dn_id } = req.params;

    const deliveryNote = await OperatorDeliveryNoteModel.findByPk(
      operator_dn_id,
      {
        include: [
          {
            model: OperatorDeliveryNoteTripModel,
            as: "trips",
            include: [
              {
                model: OperatorDNManpowerModel,
                as: "manpower",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: OperatorChangeModel,
            as: "operatorChange",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
                attributes: [
                  "so_number",
                  "client",
                  "project_name",
                  "ordered_date",
                  "lpo_number",
                ],
              },
              {
                model: EquipmentModel,
                as: "equipment",
                attributes: ["serial_number", "reg_number", "vehicle_type"],
              },
              {
                model: ManpowerModel,
                as: "newOperator",
                attributes: ["manpower_id", "employeeNo", "employeeFullName"],
              },
            ],
          },
        ],
      },
    );

    if (!deliveryNote) {
      return res.status(404).json({ message: "Delivery note not found" });
    }

    // Update status to In Progress when PDF is generated
    await deliveryNote.update({ status: "In Progress" });

    // Update operator change delivery_note_status
    if (deliveryNote.operatorChange) {
      await deliveryNote.operatorChange.update({
        delivery_note_status: "In Progress",
      });
    }

    // Also update trips status
    await OperatorDeliveryNoteTripModel.update(
      { trip_status: "In Progress" },
      {
        where: { operator_dn_id, trip_status: "Creation" },
      },
    );

    // Generate PDF
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="OP-DN-${deliveryNote.dn_number}.pdf"`,
    );

    doc.pipe(res);

    // Add border to page
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

    // Company Header with Green Background
    doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke("#059669", "#059669");

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#FFFFFF")
      .text("Auto Xpert Trading and Service WLL", 50, 55, { align: "center" })
      .fontSize(9)
      .font("Helvetica")
      .text(
        "Office No 11, 2nd Floor, Building No.207, Street 995, Zone 56",
        50,
        82,
        { align: "center" },
      )
      .text("Doha, Qatar | Tel: 44581071 | Email: info@autoxpert.qa", 50, 95, {
        align: "center",
      });

    doc.fillColor("#000000");

    // Document Title
    doc.moveDown(3);
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fillColor("#059669")
      .text("OPERATOR DELIVERY NOTE", { align: "center" })
      .fillColor("#000000");

    doc.moveDown(1);
    doc
      .moveTo(100, doc.y)
      .lineTo(pageWidth - 100, doc.y)
      .stroke("#059669");
    doc.moveDown(1);

    // Two Column Layout for Details
    const leftX = 50;
    const rightX = 320;
    const startY = doc.y;

    // Left Column - Ship-to Address
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#059669");
    doc.text("SHIP-TO ADDRESS", leftX, startY);
    doc.fillColor("#000000");

    doc.rect(leftX, startY + 20, 240, 60).stroke("#CCCCCC");
    doc.fontSize(10).font("Helvetica");
    doc.text(
      deliveryNote.operatorChange.salesOrder.client,
      leftX + 10,
      startY + 30,
      { width: 220 },
    );

    // Right Column - Document Details
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#059669");
    doc.text("DOCUMENT DETAILS", rightX, startY);
    doc.fillColor("#000000");

    const detailsY = startY + 20;
    doc.rect(rightX, detailsY, 240, 90).stroke("#CCCCCC");

    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Delivery Note No.:", rightX + 10, detailsY + 10);
    doc.text("Order Reference No.:", rightX + 10, detailsY + 50);
    doc.text("Project Name:", rightX + 10, detailsY + 70);

    doc.font("Helvetica");
    doc.text(deliveryNote.dn_number, rightX + 130, detailsY + 10);
    doc.text(
      deliveryNote.operatorChange.salesOrder.so_number,
      rightX + 130,
      detailsY + 50,
    );
    doc.text(
      deliveryNote.operatorChange.salesOrder.project_name || "N/A",
      rightX + 130,
      detailsY + 70,
      { width: 100 },
    );

    doc.y = startY + 120;
    doc.moveDown(1);

    // Operator Details Section
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
    doc
      .rect(leftX, doc.y, pageWidth - 100, 20)
      .fillAndStroke("#059669", "#059669");
    doc.text("OPERATOR DETAILS", leftX + 10, doc.y + 5);

    doc.fillColor("#000000");
    doc.moveDown(1.5);

    const operatorY = doc.y;
    doc.rect(leftX, operatorY, pageWidth - 100, 50).stroke("#CCCCCC");

    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Operator Name:", leftX + 10, operatorY + 10);
    doc.text("Employee Number:", leftX + 10, operatorY + 30);

    doc.font("Helvetica");
    doc.text(
      deliveryNote.operatorChange.newOperator.employeeFullName,
      leftX + 120,
      operatorY + 10,
    );
    doc.text(
      deliveryNote.operatorChange.newOperator.employeeNo,
      leftX + 120,
      operatorY + 30,
    );

    doc.y = operatorY + 60;
    doc.moveDown(1);

    // Equipment Details Section (if available)
    if (deliveryNote.operatorChange.equipment) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
      doc
        .rect(leftX, doc.y, pageWidth - 100, 20)
        .fillAndStroke("#059669", "#059669");
      doc.text("EQUIPMENT DETAILS", leftX + 10, doc.y + 5);

      doc.fillColor("#000000");
      doc.moveDown(1.5);

      const equipY = doc.y;
      doc.rect(leftX, equipY, pageWidth - 100, 50).stroke("#CCCCCC");

      doc.fontSize(9).font("Helvetica-Bold");
      doc.text("Plate Number:", leftX + 10, equipY + 10);
      doc.text("Vehicle Type:", leftX + 10, equipY + 30);

      doc.font("Helvetica");
      doc.text(
        deliveryNote.operatorChange.equipment.reg_number,
        leftX + 120,
        equipY + 10,
      );
      doc.text(
        deliveryNote.operatorChange.equipment.vehicle_type,
        leftX + 120,
        equipY + 30,
      );

      doc.y = equipY + 60;
      doc.moveDown(1);
    }

    // Transportation Details
    if (deliveryNote.trips && deliveryNote.trips.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
      doc
        .rect(leftX, doc.y, pageWidth - 100, 20)
        .fillAndStroke("#059669", "#059669");
      doc.text("TRANSPORTATION DETAILS", leftX + 10, doc.y + 5);

      doc.fillColor("#000000");
      doc.moveDown(1.5);

      deliveryNote.trips.forEach((trip, index) => {
        const tripY = doc.y;
        const tripHeight =
          120 +
          (trip.manpower && trip.manpower.length > 0
            ? 40 * trip.manpower.length
            : 0);

        // Add new page if needed
        if (tripY + tripHeight > pageHeight - 100) {
          doc.addPage();
          doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
          doc.y = 50;
        }

        doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke("#CCCCCC");

        doc.fontSize(10).font("Helvetica-Bold").fillColor("#059669");
        doc.text(`Trip ${trip.trip_number}`, leftX + 10, doc.y + 10);
        doc.fillColor("#000000");

        const tripDetailsY = doc.y + 30;
        doc.fontSize(9).font("Helvetica-Bold");
        doc.text("Company:", leftX + 10, tripDetailsY);
        doc.text("Driver:", leftX + 10, tripDetailsY + 15);
        doc.text("Contact:", leftX + 10, tripDetailsY + 30);
        doc.text("Vehicle Type:", leftX + 10, tripDetailsY + 45);
        doc.text("Vehicle No.:", leftX + 10, tripDetailsY + 60);

        doc.font("Helvetica");
        doc.text(trip.transportation_company, leftX + 100, tripDetailsY, {
          width: 200,
        });
        doc.text(trip.driver_name, leftX + 100, tripDetailsY + 15);
        doc.text(trip.driver_contact, leftX + 100, tripDetailsY + 30);
        doc.text(trip.vehicle_type || "N/A", leftX + 100, tripDetailsY + 45);
        doc.text(trip.vehicle_number || "N/A", leftX + 100, tripDetailsY + 60);

        if (trip.trip_date) {
          doc.font("Helvetica-Bold");
          doc.text("Trip Date:", rightX, tripDetailsY);
          doc.font("Helvetica");
          doc.text(
            new Date(trip.trip_date).toLocaleDateString("en-GB"),
            rightX + 80,
            tripDetailsY,
          );
        }

        // Manpower resources for this trip
        if (trip.manpower && trip.manpower.length > 0) {
          const manpowerY = tripDetailsY + 80;
          doc.fontSize(9).font("Helvetica-Bold").fillColor("#059669");
          doc.text("Assigned Manpower:", leftX + 10, manpowerY);
          doc.fillColor("#000000");

          trip.manpower.forEach((mp, idx) => {
            doc.fontSize(8).font("Helvetica");
            doc.text(
              `${mp.employee_name} (${mp.employee_no})`,
              leftX + 120,
              manpowerY + idx * 15,
            );
          });
        }

        if (trip.remarks) {
          doc.fontSize(8).font("Helvetica-Oblique");
          doc.text(
            `Remarks: ${trip.remarks}`,
            leftX + 10,
            tripDetailsY +
              100 +
              (trip.manpower && trip.manpower.length > 0 ? 40 : 0),
          );
        }

        doc.y += tripHeight + 10;
      });
    }

    // Remarks Section
    if (deliveryNote.remarks) {
      doc.moveDown(1);
      doc.fontSize(11).font("Helvetica-Bold").fillColor("#059669");
      doc.text("REMARKS", leftX);
      doc.fillColor("#000000");

      doc.fontSize(9).font("Helvetica");
      doc.rect(leftX, doc.y + 5, pageWidth - 100, 40).stroke("#CCCCCC");
      doc.text(deliveryNote.remarks, leftX + 10, doc.y + 15, {
        width: pageWidth - 120,
      });
      doc.y += 50;
    }

    doc.moveDown(2);

    // Acknowledgement Box
    doc
      .rect(leftX, doc.y, pageWidth - 100, 30)
      .fillAndStroke("#D1FAE5", "#CCCCCC");
    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#000000");
    doc.text(
      "We acknowledge that the operator has been received in good health and proper condition.",
      leftX + 10,
      doc.y + 10,
      { width: pageWidth - 120, align: "center" },
    );

    doc.moveDown(3);

    // Signature Section
    const sigY = doc.y;

    // Check if we need a new page
    if (sigY + 120 > pageHeight - 60) {
      doc.addPage();
      doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
      doc.y = 50;
    }

    doc.fontSize(10).font("Helvetica-Bold");

    // Left signature
    doc.text("Received By:", leftX, doc.y);
    doc
      .moveTo(leftX, doc.y + 50)
      .lineTo(leftX + 200, doc.y + 50)
      .stroke();
    doc.font("Helvetica").fontSize(8);
    doc.text("Name & Signature", leftX, doc.y + 55);

    // Right signature
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Date:", rightX, sigY);
    doc
      .moveTo(rightX, sigY + 50)
      .lineTo(rightX + 200, sigY + 50)
      .stroke();
    doc.font("Helvetica").fontSize(8);
    doc.text("DD/MM/YYYY", rightX, sigY + 55);

    doc.moveDown(4);

    // Contact section
    doc.text("Contact No.:", leftX, doc.y);
    doc
      .moveTo(leftX, doc.y + 50)
      .lineTo(leftX + 200, doc.y + 50)
      .stroke();

    // Footer
    doc.fontSize(7).font("Helvetica-Oblique").fillColor("#666666");
    doc.text(
      "This is a computer generated document. No signature is required.",
      0,
      pageHeight - 50,
      { align: "center", width: pageWidth },
    );

    doc.end();
  } catch (error) {
    console.error("Error generating operator delivery note PDF:", error);
    res.status(500).json({
      message: "Error generating operator delivery note PDF",
      error: error.message,
    });
  }
};

const generateOperatorOffHireNotePDF = async (req, res) => {
  try {
    const { operator_ohn_id } = req.params;

    const offHireNote = await OperatorOffHireNoteModel.findByPk(
      operator_ohn_id,
      {
        include: [
          {
            model: OperatorOffHireNoteTripModel,
            as: "trips",
            include: [
              {
                model: OperatorOHNManpowerModel,
                as: "manpower",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: OperatorChangeModel,
            as: "operatorChange",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
                attributes: [
                  "so_number",
                  "client",
                  "project_name",
                  "ordered_date",
                  "lpo_number",
                ],
              },
              {
                model: EquipmentModel,
                as: "equipment",
                attributes: ["serial_number", "reg_number", "vehicle_type"],
              },
              {
                model: ManpowerModel,
                as: "previousOperator",
                attributes: ["manpower_id", "employeeNo", "employeeFullName"],
              },
            ],
          },
        ],
      },
    );

    if (!offHireNote) {
      return res.status(404).json({ message: "Off hire note not found" });
    }

    // Update status to In Progress when PDF is generated
    await offHireNote.update({ status: "In Progress" });

    // Update operator change off_hire_note_status
    if (offHireNote.operatorChange) {
      await offHireNote.operatorChange.update({
        off_hire_note_status: "In Progress",
      });
    }

    // Also update trips status
    await OperatorOffHireNoteTripModel.update(
      { trip_status: "In Progress" },
      {
        where: { operator_ohn_id, trip_status: "Creation" },
      },
    );

    // Generate PDF
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="OP-OH-${offHireNote.ohn_number}.pdf"`,
    );

    doc.pipe(res);

    // Add border to page
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

    // Company Header with Orange Background
    doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke("#EA580C", "#EA580C");

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#FFFFFF")
      .text("Auto Xpert Trading and Service WLL", 50, 55, { align: "center" })
      .fontSize(9)
      .font("Helvetica")
      .text(
        "Office No 11, 2nd Floor, Building No.207, Street 995, Zone 56",
        50,
        82,
        { align: "center" },
      )
      .text("Doha, Qatar | Tel: 44581071 | Email: info@autoxpert.qa", 50, 95, {
        align: "center",
      });

    doc.fillColor("#000000");

    // Document Title
    doc.moveDown(3);
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fillColor("#EA580C")
      .text("OPERATOR OFF HIRE NOTE", { align: "center" })
      .fillColor("#000000");

    doc.moveDown(1);
    doc
      .moveTo(100, doc.y)
      .lineTo(pageWidth - 100, doc.y)
      .stroke("#EA580C");
    doc.moveDown(1);

    // Two Column Layout for Details
    const leftX = 50;
    const rightX = 320;
    const startY = doc.y;

    // Left Column - Client Information
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#EA580C");
    doc.text("CLIENT INFORMATION", leftX, startY);
    doc.fillColor("#000000");

    doc.rect(leftX, startY + 20, 240, 60).stroke("#CCCCCC");
    doc.fontSize(10).font("Helvetica");
    doc.text(
      offHireNote.operatorChange.salesOrder.client,
      leftX + 10,
      startY + 30,
      { width: 220 },
    );

    // Right Column - Document Details
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#EA580C");
    doc.text("DOCUMENT DETAILS", rightX, startY);
    doc.fillColor("#000000");

    const detailsY = startY + 20;
    doc.rect(rightX, detailsY, 240, 90).stroke("#CCCCCC");

    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Off Hire Note No.:", rightX + 10, detailsY + 10);
    doc.text("Order Reference No.:", rightX + 10, detailsY + 50);
    doc.text("Project Name:", rightX + 10, detailsY + 70);

    doc.font("Helvetica");
    doc.text(offHireNote.ohn_number, rightX + 130, detailsY + 10);
    doc.text(
      offHireNote.operatorChange.salesOrder.so_number,
      rightX + 130,
      detailsY + 50,
    );
    doc.text(
      offHireNote.operatorChange.salesOrder.project_name || "N/A",
      rightX + 130,
      detailsY + 70,
      { width: 100 },
    );

    doc.y = startY + 120;
    doc.moveDown(1);

    // Operator Details Section
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
    doc
      .rect(leftX, doc.y, pageWidth - 100, 20)
      .fillAndStroke("#EA580C", "#EA580C");
    doc.text("OPERATOR DETAILS", leftX + 10, doc.y + 5);

    doc.fillColor("#000000");
    doc.moveDown(1.5);

    const operatorY = doc.y;
    doc.rect(leftX, operatorY, pageWidth - 100, 50).stroke("#CCCCCC");

    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Operator Name:", leftX + 10, operatorY + 10);
    doc.text("Employee Number:", leftX + 10, operatorY + 30);

    doc.font("Helvetica");
    doc.text(
      offHireNote.operatorChange.previousOperator.employeeFullName,
      leftX + 120,
      operatorY + 10,
    );
    doc.text(
      offHireNote.operatorChange.previousOperator.employeeNo,
      leftX + 120,
      operatorY + 30,
    );

    doc.y = operatorY + 60;
    doc.moveDown(1);

    // Equipment Details Section (if available)
    if (offHireNote.operatorChange.equipment) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
      doc
        .rect(leftX, doc.y, pageWidth - 100, 20)
        .fillAndStroke("#EA580C", "#EA580C");
      doc.text("EQUIPMENT DETAILS", leftX + 10, doc.y + 5);

      doc.fillColor("#000000");
      doc.moveDown(1.5);

      const equipY = doc.y;
      doc.rect(leftX, equipY, pageWidth - 100, 50).stroke("#CCCCCC");

      doc.fontSize(9).font("Helvetica-Bold");
      doc.text("Plate Number:", leftX + 10, equipY + 10);
      doc.text("Vehicle Type:", leftX + 10, equipY + 30);

      doc.font("Helvetica");
      doc.text(
        offHireNote.operatorChange.equipment.reg_number,
        leftX + 120,
        equipY + 10,
      );
      doc.text(
        offHireNote.operatorChange.equipment.vehicle_type,
        leftX + 120,
        equipY + 30,
      );

      doc.y = equipY + 60;
      doc.moveDown(1);
    }

    // Transportation Details
    if (offHireNote.trips && offHireNote.trips.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
      doc
        .rect(leftX, doc.y, pageWidth - 100, 20)
        .fillAndStroke("#EA580C", "#EA580C");
      doc.text("TRANSPORTATION DETAILS", leftX + 10, doc.y + 5);

      doc.fillColor("#000000");
      doc.moveDown(1.5);

      offHireNote.trips.forEach((trip, index) => {
        const tripY = doc.y;
        const tripHeight =
          120 +
          (trip.manpower && trip.manpower.length > 0
            ? 40 * trip.manpower.length
            : 0);

        // Add new page if needed
        if (tripY + tripHeight > pageHeight - 100) {
          doc.addPage();
          doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
          doc.y = 50;
        }

        doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke("#CCCCCC");

        doc.fontSize(10).font("Helvetica-Bold").fillColor("#EA580C");
        doc.text(`Trip ${trip.trip_number}`, leftX + 10, doc.y + 10);
        doc.fillColor("#000000");

        const tripDetailsY = doc.y + 30;
        doc.fontSize(9).font("Helvetica-Bold");
        doc.text("Company:", leftX + 10, tripDetailsY);
        doc.text("Driver:", leftX + 10, tripDetailsY + 15);
        doc.text("Contact:", leftX + 10, tripDetailsY + 30);
        doc.text("Vehicle Type:", leftX + 10, tripDetailsY + 45);
        doc.text("Vehicle No.:", leftX + 10, tripDetailsY + 60);

        doc.font("Helvetica");
        doc.text(trip.transportation_company, leftX + 100, tripDetailsY, {
          width: 200,
        });
        doc.text(trip.driver_name, leftX + 100, tripDetailsY + 15);
        doc.text(trip.driver_contact, leftX + 100, tripDetailsY + 30);
        doc.text(trip.vehicle_type || "N/A", leftX + 100, tripDetailsY + 45);
        doc.text(trip.vehicle_number || "N/A", leftX + 100, tripDetailsY + 60);

        if (trip.trip_date) {
          doc.font("Helvetica-Bold");
          doc.text("Trip Date:", rightX, tripDetailsY);
          doc.font("Helvetica");
          doc.text(
            new Date(trip.trip_date).toLocaleDateString("en-GB"),
            rightX + 80,
            tripDetailsY,
          );
        }

        // Manpower resources for this trip
        if (trip.manpower && trip.manpower.length > 0) {
          const manpowerY = tripDetailsY + 80;
          doc.fontSize(9).font("Helvetica-Bold").fillColor("#EA580C");
          doc.text("Assigned Manpower:", leftX + 10, manpowerY);
          doc.fillColor("#000000");

          trip.manpower.forEach((mp, idx) => {
            doc.fontSize(8).font("Helvetica");
            doc.text(
              `${mp.employee_name} (${mp.employee_no})`,
              leftX + 120,
              manpowerY + idx * 15,
            );
          });
        }

        if (trip.remarks) {
          doc.fontSize(8).font("Helvetica-Oblique");
          doc.text(
            `Remarks: ${trip.remarks}`,
            leftX + 10,
            tripDetailsY +
              100 +
              (trip.manpower && trip.manpower.length > 0 ? 40 : 0),
          );
        }

        doc.y += tripHeight + 10;
      });
    }

    // Remarks Section
    if (offHireNote.remarks) {
      doc.moveDown(1);
      doc.fontSize(11).font("Helvetica-Bold").fillColor("#EA580C");
      doc.text("REMARKS", leftX);
      doc.fillColor("#000000");

      doc.fontSize(9).font("Helvetica");
      doc.rect(leftX, doc.y + 5, pageWidth - 100, 40).stroke("#CCCCCC");
      doc.text(offHireNote.remarks, leftX + 10, doc.y + 15, {
        width: pageWidth - 120,
      });
      doc.y += 50;
    }

    doc.moveDown(2);

    // Acknowledgement Box
    doc
      .rect(leftX, doc.y, pageWidth - 100, 30)
      .fillAndStroke("#FFEDD5", "#CCCCCC");
    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#000000");
    doc.text(
      "We acknowledge that the operator has been returned in good health and proper condition.",
      leftX + 10,
      doc.y + 10,
      { width: pageWidth - 120, align: "center" },
    );

    doc.moveDown(3);

    // Signature Section
    const sigY = doc.y;

    // Check if we need a new page
    if (sigY + 120 > pageHeight - 60) {
      doc.addPage();
      doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
      doc.y = 50;
    }

    doc.fontSize(10).font("Helvetica-Bold");

    // Left signature
    doc.text("Received By:", leftX, doc.y);
    doc
      .moveTo(leftX, doc.y + 50)
      .lineTo(leftX + 200, doc.y + 50)
      .stroke();
    doc.font("Helvetica").fontSize(8);
    doc.text("Name & Signature", leftX, doc.y + 55);

    // Right signature
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Date:", rightX, sigY);
    doc
      .moveTo(rightX, sigY + 50)
      .lineTo(rightX + 200, sigY + 50)
      .stroke();
    doc.font("Helvetica").fontSize(8);
    doc.text("DD/MM/YYYY", rightX, sigY + 55);

    doc.moveDown(4);

    // Contact section
    doc.text("Contact No.:", leftX, doc.y);
    doc
      .moveTo(leftX, doc.y + 50)
      .lineTo(leftX + 200, doc.y + 50)
      .stroke();

    // Footer
    doc.fontSize(7).font("Helvetica-Oblique").fillColor("#666666");
    doc.text(
      "This is a computer generated document. No signature is required.",
      0,
      pageHeight - 50,
      { align: "center", width: pageWidth },
    );

    doc.end();
  } catch (error) {
    console.error("Error generating operator off hire note PDF:", error);
    res.status(500).json({
      message: "Error generating operator off hire note PDF",
      error: error.message,
    });
  }
};

// ─── DN TRIP STATUS FUNCTIONS ─────────────────────────────────────────────────

/**
 * Submit a single Operator DN trip for approval
 */
const submitOperatorDNTripForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip can only be submitted from 'Creation' status. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Under Approval" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Operator DN Trip submitted for approval successfully",
      trip: await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorDNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting operator DN trip for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve a single Operator DN trip
 */
const approveOperatorDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to approve. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Approved" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Operator DN Trip approved successfully",
      trip: await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorDNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving operator DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reject a single Operator DN trip
 */
const rejectOperatorDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const { reason } = req.body;

    const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to reject. Current: ${trip.trip_status}`,
      });
    }

    await trip.update(
      {
        trip_status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : trip.remarks,
      },
      { transaction },
    );
    await transaction.commit();

    res.status(200).json({
      message: "Operator DN Trip rejected successfully",
      trip: await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorDNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting operator DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate PDF for a single Operator DN trip (Approved → In Progress)
 */
const generateOperatorDNTripPDF = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        { model: OperatorDNManpowerModel, as: "manpower" },
        {
          model: OperatorDeliveryNoteModel,
          as: "deliveryNote",
          include: [
            {
              model: OperatorChangeModel,
              as: "operatorChange",
              include: [
                {
                  model: SalesOrdersModel,
                  as: "salesOrder",
                  attributes: [
                    "so_number",
                    "client",
                    "project_name",
                    "lpo_number",
                  ],
                },
                {
                  model: ManpowerModel,
                  as: "newOperator",
                  attributes: ["manpower_id", "employeeNo", "employeeFullName"],
                },
              ],
            },
          ],
        },
      ],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status === "Approved") {
      await trip.update({ trip_status: "In Progress" }, { transaction });
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating operator DN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Complete a single Operator DN trip (In Progress → Completed)
 */
const completeOperatorDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "In Progress") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'In Progress' to complete. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Completed" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Operator DN Trip completed successfully",
      trip: await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorDNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error completing operator DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Close a single Operator DN trip (Completed/Rejected → Close)
 */
const closeOperatorDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    const closableStatuses = ["Completed", "Rejected"];
    if (!closableStatuses.includes(trip.trip_status)) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Only 'Completed' or 'Rejected' trips can be closed. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Close" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Operator DN Trip closed successfully",
      trip: await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorDNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing operator DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─── OHN TRIP STATUS FUNCTIONS ────────────────────────────────────────────────

/**
 * Submit a single Operator OHN trip for approval
 */
const submitOperatorOHNTripForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip can only be submitted from 'Creation' status. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Under Approval" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Operator OHN Trip submitted for approval successfully",
      trip: await OperatorOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorOHNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting operator OHN trip for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve a single Operator OHN trip
 */
const approveOperatorOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to approve. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Approved" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Operator OHN Trip approved successfully",
      trip: await OperatorOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorOHNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving operator OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reject a single Operator OHN trip
 */
const rejectOperatorOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const { reason } = req.body;

    const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to reject. Current: ${trip.trip_status}`,
      });
    }

    await trip.update(
      {
        trip_status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : trip.remarks,
      },
      { transaction },
    );
    await transaction.commit();

    res.status(200).json({
      message: "Operator OHN Trip rejected successfully",
      trip: await OperatorOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorOHNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting operator OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate PDF for a single Operator OHN trip (Approved → In Progress)
 */
const generateOperatorOHNTripPDF = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
      include: [
        { model: OperatorOHNManpowerModel, as: "manpower" },
        {
          model: OperatorOffHireNoteModel,
          as: "offHireNote",
          include: [
            {
              model: OperatorChangeModel,
              as: "operatorChange",
              include: [
                {
                  model: SalesOrdersModel,
                  as: "salesOrder",
                  attributes: [
                    "so_number",
                    "client",
                    "project_name",
                    "lpo_number",
                  ],
                },
                {
                  model: ManpowerModel,
                  as: "previousOperator",
                  attributes: ["manpower_id", "employeeNo", "employeeFullName"],
                },
              ],
            },
          ],
        },
      ],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status === "Approved") {
      await trip.update({ trip_status: "In Progress" }, { transaction });
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating operator OHN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Complete a single Operator OHN trip (In Progress → Completed)
 */
const completeOperatorOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "In Progress") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'In Progress' to complete. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Completed" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Operator OHN Trip completed successfully",
      trip: await OperatorOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorOHNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error completing operator OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Close a single Operator OHN trip (Completed/Rejected → Close)
 */
const closeOperatorOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OperatorOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    const closableStatuses = ["Completed", "Rejected"];
    if (!closableStatuses.includes(trip.trip_status)) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Only 'Completed' or 'Rejected' trips can be closed. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Close" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Operator OHN Trip closed successfully",
      trip: await OperatorOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: OperatorOHNManpowerModel, as: "manpower" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing operator OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload delivery note document to a specific trip
 */
const uploadOperatorDeliveryNoteToTrip = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;
    const username = await getUsername(req);

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename;

    // Find the trip
    const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: OperatorDeliveryNoteModel,
          as: "deliveryNote",
          include: [
            {
              model: OperatorChangeModel,
              as: "operatorChange"
            }
          ]
        }
      ],
      transaction,
    });

    if (!trip) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    // Update trip with delivery note attachment
    await trip.update(
      {
        delivery_attachment: fileName,
        delivery_attachment_uploaded_by: username || "System",
        delivery_attachment_uploaded_at: new Date(),
        // Optionally update trip status
        trip_status: "Completed"
      },
      { transaction },
    );

    // Also update the main delivery note's status if all trips are completed
    // You can add logic here to check if all trips are completed

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Delivery note uploaded to trip successfully",
      fileName,
      trip_id,
    });
  } catch (error) {
    await transaction.rollback();
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading delivery note to trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload off hire note document to a specific trip
 */
const uploadOperatorOffHireNoteToTrip = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;
    const username = await getUsername(req);

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename;

    // Find the trip
    const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: OperatorOffHireNoteModel,
          as: "offHireNote",
          include: [
            {
              model: OperatorChangeModel,
              as: "operatorChange"
            }
          ]
        }
      ],
      transaction,
    });

    if (!trip) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    // Update trip with off hire note attachment
    await trip.update(
      {
        off_hire_attachment: fileName,
        off_hire_attachment_uploaded_by: username || "System",
        off_hire_attachment_uploaded_at: new Date(),
        // Optionally update trip status
        trip_status: "Completed"
      },
      { transaction },
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Off hire note uploaded to trip successfully",
      fileName,
      trip_id,
    });
  } catch (error) {
    await transaction.rollback();
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading off hire note to trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate delivery note PDF for a specific trip
 */
const generateOperatorDeliveryNotePDFForTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;

    const trip = await OperatorDeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: OperatorDNManpowerModel,
          as: "manpower",
        },
        {
          model: OperatorDeliveryNoteModel,
          as: "deliveryNote",
          include: [
            {
              model: OperatorChangeModel,
              as: "operatorChange",
              include: [
                {
                  model: SalesOrdersModel,
                  as: "salesOrder",
                },
                {
                  model: ManpowerModel,
                  as: "newOperator",
                },
                {
                  model: EquipmentModel,
                  as: "equipment",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Update trip status
    await trip.update({ trip_status: "In Progress" });

    // Generate PDF with trip-specific data
    // Similar to generateOperatorDeliveryNotePDF but focused on a single trip
    // ... (PDF generation code)

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error("Error generating delivery note PDF for trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate off hire note PDF for a specific trip
 */
const generateOperatorOffHireNotePDFForTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;

    const trip = await OperatorOffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: OperatorOHNManpowerModel,
          as: "manpower",
        },
        {
          model: OperatorOffHireNoteModel,
          as: "offHireNote",
          include: [
            {
              model: OperatorChangeModel,
              as: "operatorChange",
              include: [
                {
                  model: SalesOrdersModel,
                  as: "salesOrder",
                },
                {
                  model: ManpowerModel,
                  as: "previousOperator",
                },
                {
                  model: EquipmentModel,
                  as: "equipment",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Update trip status
    await trip.update({ trip_status: "In Progress" });

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error("Error generating off hire note PDF for trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== EXPORTS ====================

module.exports = {
  // Swap Reasons
  getOperatorSwapReasons,

  // Dropdown Functions
  getAllEquipmentForOperator,
  getManpowerByOperatorType,
  getAllOperatorTypes,

  // Operator Change Creation & Retrieval
  createOperatorChange,
  getOperatorChangeById,
  getOperatorChangesBySalesOrder,
  getOperatorChangeByGroupId,

  // Delivery Note Functions
  createOperatorDeliveryNote,
  getOperatorDeliveryNoteById,
  getLatestOperatorDeliveryNote,
  getOperatorDeliveryNoteSummary,
  submitOperatorDNForApproval,
  approveOperatorDeliveryNote,
  rejectOperatorDeliveryNote,
  completeOperatorDeliveryNote,
  closeOperatorDeliveryNote,
  uploadOperatorDeliveryNote,
  generateOperatorDeliveryNotePDF,

  // Off Hire Note Functions
  createOperatorOffHireNote,
  getOperatorOffHireNoteById,
  getLatestOperatorOffHireNote,
  getOperatorOffHireNoteSummary,
  submitOperatorOHNForApproval,
  approveOperatorOffHireNote,
  rejectOperatorOffHireNote,
  completeOperatorOffHireNote,
  closeOperatorOffHireNote,
  uploadOperatorOffHireNote,
  generateOperatorOffHireNotePDF,

  // Trip Management Functions
  addTripToOperatorDeliveryNote,
  addTripToOperatorOffHireNote,
  updateTripInOperatorDN,
  updateTripInOperatorOHN,
  deleteTripFromOperatorDN,
  deleteTripFromOperatorOHN,

  // Checklist Functions
  uploadOperatorDNChecklist,
  uploadOperatorOHNChecklist,
  downloadOperatorDNChecklist,
  downloadOperatorOHNChecklist,

  // DN Trip Status
  submitOperatorDNTripForApproval,
  approveOperatorDNTrip,
  rejectOperatorDNTrip,
  generateOperatorDNTripPDF,
  completeOperatorDNTrip,
  closeOperatorDNTrip,
  generateOperatorDeliveryNotePDFForTrip,
  uploadOperatorDeliveryNoteToTrip,

  // OHN Trip Status
  submitOperatorOHNTripForApproval,
  approveOperatorOHNTrip,
  rejectOperatorOHNTrip,
  generateOperatorOHNTripPDF,
  completeOperatorOHNTrip,
  closeOperatorOHNTrip,
  generateOperatorOffHireNotePDFForTrip,
  uploadOperatorOffHireNoteToTrip,
};

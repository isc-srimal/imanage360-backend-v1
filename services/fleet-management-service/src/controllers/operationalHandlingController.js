// // // // // // // // // const Breakdown = require("../../models/fleet-management/BreakdownModel");
// // // // // // // // // const HandheldEvent = require("../../models/fleet-management/HandheldEventModel");
// // // // // // // // // const CoordinatorTask = require("../../models/fleet-management/CoordinatorTaskModel");
// // // // // // // // // const ActiveAllocation = require("../../models/fleet-management/ActiveAllocationsModel");
// // // // // // // // // const { Parser } = require("json2csv");
// // // // // // // // // const PdfPrinter = require("pdfmake");
// // // // // // // // // const path = require("path");
// // // // // // // // // const SalesOrderModel = require("../../models/fleet-management/SalesOrdersModel");
// // // // // // // // // const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// // // // // // // // // const DailyScheduleModel = require("../../models/fleet-management/DailyScheduleModel");

// // // // // // // // // const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

// // // // // // // // // // Active Allocation Controllers
// // // // // // // // // const createActiveAllocation = async (req, res) => {
// // // // // // // // //   const {
// // // // // // // // //     sales_order_id,
// // // // // // // // //     equipment_id,
// // // // // // // // //     status = "Active",
// // // // // // // // //     usageHours = 0,
// // // // // // // // //   } = req.body;

// // // // // // // // //   try {
// // // // // // // // //     const activeAllocation = await ActiveAllocation.create({
// // // // // // // // //       sales_order_id,
// // // // // // // // //       equipment_id,
// // // // // // // // //       status,
// // // // // // // // //       usageHours,
// // // // // // // // //     });

// // // // // // // // //     res
// // // // // // // // //       .status(201)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Active allocation created successfully",
// // // // // // // // //         activeAllocation,
// // // // // // // // //       });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res.status(500).json({ error: error.message });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const updateActiveAllocation = async (req, res) => {
// // // // // // // // //   const { id } = req.params;
// // // // // // // // //   const { sales_order_id, equipment_id, status, usageHours } = req.body;

// // // // // // // // //   try {
// // // // // // // // //     const activeAllocation = await ActiveAllocation.findByPk(id);
// // // // // // // // //     if (!activeAllocation) {
// // // // // // // // //       return res.status(404).json({ message: "Active allocation not found" });
// // // // // // // // //     }

// // // // // // // // //     activeAllocation.sales_order_id =
// // // // // // // // //       sales_order_id || activeAllocation.sales_order_id;
// // // // // // // // //     activeAllocation.equipment_id =
// // // // // // // // //       equipment_id || activeAllocation.equipment_id;
// // // // // // // // //     activeAllocation.status = status || activeAllocation.status;
// // // // // // // // //     activeAllocation.usageHours =
// // // // // // // // //       usageHours !== undefined ? usageHours : activeAllocation.usageHours;

// // // // // // // // //     await activeAllocation.save();
// // // // // // // // //     res
// // // // // // // // //       .status(200)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Active allocation updated successfully",
// // // // // // // // //         activeAllocation,
// // // // // // // // //       });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error updating active allocation",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const deleteActiveAllocation = async (req, res) => {
// // // // // // // // //   const { id } = req.params;

// // // // // // // // //   try {
// // // // // // // // //     const activeAllocation = await ActiveAllocation.findByPk(id);
// // // // // // // // //     if (!activeAllocation) {
// // // // // // // // //       return res.status(404).json({ message: "Active allocation not found" });
// // // // // // // // //     }

// // // // // // // // //     await activeAllocation.destroy();
// // // // // // // // //     res.status(200).json({ message: "Active allocation deleted successfully" });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error deleting active allocation",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const getActiveAllocationById = async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     const { id } = req.params;
// // // // // // // // //     const activeAllocation = await ActiveAllocation.findByPk(id, {
// // // // // // // // //       include: [
// // // // // // // // //         { model: SalesOrderModel, as: "sales_order" },
// // // // // // // // //         { model: EquipmentModel, as: "equipment" },
// // // // // // // // //       ],
// // // // // // // // //     });

// // // // // // // // //     if (!activeAllocation) {
// // // // // // // // //       return res.status(404).json({ message: "Active allocation not found" });
// // // // // // // // //     }

// // // // // // // // //     res.status(200).json(activeAllocation);
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error retrieving active allocation",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const getActiveAllocations = async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     const { page = 1, limit = 10, status = "All" } = req.query;
// // // // // // // // //     const offset = (page - 1) * parseInt(limit);
// // // // // // // // //     const where = status !== "All" ? { status } : {};

// // // // // // // // //     const { count: totalAllocations, rows: activeAllocations } =
// // // // // // // // //       await ActiveAllocation.findAndCountAll({
// // // // // // // // //         where,
// // // // // // // // //         offset,
// // // // // // // // //         limit: parseInt(limit),
// // // // // // // // //         include: [
// // // // // // // // //           { model: SalesOrderModel, as: "sales_order" },
// // // // // // // // //           { model: EquipmentModel, as: "equipment" },
// // // // // // // // //         ],
// // // // // // // // //       });

// // // // // // // // //     res.status(200).json({
// // // // // // // // //       totalAllocations,
// // // // // // // // //       currentPage: parseInt(page),
// // // // // // // // //       totalPages: Math.ceil(totalAllocations / limit),
// // // // // // // // //       activeAllocations,
// // // // // // // // //     });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error retrieving active allocations",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const exportActiveAllocationsToCSV = async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     const { status = "All", page = 1, limit = 10 } = req.query;
// // // // // // // // //     const offset = (page - 1) * parseInt(limit);
// // // // // // // // //     const where = status !== "All" ? { status } : {};

// // // // // // // // //     const { rows: activeAllocations } = await ActiveAllocation.findAndCountAll({
// // // // // // // // //       where,
// // // // // // // // //       offset,
// // // // // // // // //       limit: parseInt(limit),
// // // // // // // // //       include: [
// // // // // // // // //         { model: SalesOrderModel, as: "sales_order" },
// // // // // // // // //         { model: EquipmentModel, as: "equipment" },
// // // // // // // // //       ],
// // // // // // // // //     });

// // // // // // // // //     if (!activeAllocations || activeAllocations.length === 0) {
// // // // // // // // //       return res.status(404).json({ message: "No active allocations found" });
// // // // // // // // //     }

// // // // // // // // //     const allocationsData = activeAllocations.map((allocation) => ({
// // // // // // // // //       id: allocation.id,
// // // // // // // // //       sales_order_id: allocation.sales_order_id,
// // // // // // // // //       equipment_id: allocation.equipment_id,
// // // // // // // // //       status: allocation.status,
// // // // // // // // //       usageHours: allocation.usageHours,
// // // // // // // // //     }));

// // // // // // // // //     const json2csvParser = new Parser();
// // // // // // // // //     const csv = json2csvParser.parse(allocationsData);

// // // // // // // // //     res.header("Content-Type", "text/csv");
// // // // // // // // //     res.attachment("active_allocations.csv");
// // // // // // // // //     res.send(csv);
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error exporting active allocations to CSV",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const exportActiveAllocationsToPDF = async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     const { status = "All", page = 1, limit = 10 } = req.query;
// // // // // // // // //     const offset = (page - 1) * parseInt(limit);
// // // // // // // // //     const where = status !== "All" ? { status } : {};

// // // // // // // // //     const { rows: activeAllocations } = await ActiveAllocation.findAndCountAll({
// // // // // // // // //       where,
// // // // // // // // //       offset,
// // // // // // // // //       limit: parseInt(limit),
// // // // // // // // //       include: [
// // // // // // // // //         { model: SalesOrderModel, as: "sales_order" },
// // // // // // // // //         { model: EquipmentModel, as: "equipment" },
// // // // // // // // //       ],
// // // // // // // // //     });

// // // // // // // // //     if (!activeAllocations || activeAllocations.length === 0) {
// // // // // // // // //       return res.status(404).json({ message: "No active allocations found" });
// // // // // // // // //     }

// // // // // // // // //     const allocationsData = activeAllocations.map((allocation) => [
// // // // // // // // //       allocation.id || "N/A",
// // // // // // // // //       allocation.sales_order_id || "N/A",
// // // // // // // // //       allocation.equipment_id || "N/A",
// // // // // // // // //       allocation.status || "N/A",
// // // // // // // // //       allocation.usageHours || "N/A",
// // // // // // // // //     ]);

// // // // // // // // //     const docDefinition = {
// // // // // // // // //       content: [
// // // // // // // // //         { text: "Active Allocations Data", style: "header" },
// // // // // // // // //         {
// // // // // // // // //           table: {
// // // // // // // // //             headerRows: 1,
// // // // // // // // //             widths: ["auto", "auto", "*", "auto", "auto"],
// // // // // // // // //             body: [
// // // // // // // // //               ["ID", "Sales Order ID", "Equipment", "Status", "Usage Hours"],
// // // // // // // // //               ...allocationsData,
// // // // // // // // //             ],
// // // // // // // // //           },
// // // // // // // // //         },
// // // // // // // // //       ],
// // // // // // // // //       styles: {
// // // // // // // // //         header: {
// // // // // // // // //           fontSize: 18,
// // // // // // // // //           bold: true,
// // // // // // // // //           alignment: "center",
// // // // // // // // //           margin: [0, 0, 0, 20],
// // // // // // // // //         },
// // // // // // // // //       },
// // // // // // // // //       defaultStyle: {
// // // // // // // // //         fontSize: 8,
// // // // // // // // //       },
// // // // // // // // //     };

// // // // // // // // //     const printer = new PdfPrinter({
// // // // // // // // //       Roboto: {
// // // // // // // // //         normal: path.join(sourceDir, "Roboto-Regular.ttf"),
// // // // // // // // //         bold: path.join(sourceDir, "Roboto-Medium.ttf"),
// // // // // // // // //         italics: path.join(sourceDir, "Roboto-Italic.ttf"),
// // // // // // // // //         bolditalics: path.join(sourceDir, "Roboto-MediumItalic.ttf"),
// // // // // // // // //       },
// // // // // // // // //     });

// // // // // // // // //     const pdfDoc = printer.createPdfKitDocument(docDefinition);
// // // // // // // // //     res.header("Content-Type", "application/pdf");
// // // // // // // // //     res.attachment("active_allocations.pdf");
// // // // // // // // //     pdfDoc.pipe(res);
// // // // // // // // //     pdfDoc.end();
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error exporting active allocations to PDF",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const createBreakdown = async (req, res) => {
// // // // // // // // //   const {
// // // // // // // // //     eventType,
// // // // // // // // //     reason,
// // // // // // // // //     duration,
// // // // // // // // //     sales_order_id,
// // // // // // // // //     equipment_id,
// // // // // // // // //     status = "Pending",
// // // // // // // // //   } = req.body;

// // // // // // // // //   try {
// // // // // // // // //     const breakdown = await Breakdown.create({
// // // // // // // // //       eventType,
// // // // // // // // //       reason,
// // // // // // // // //       duration,
// // // // // // // // //       sales_order_id,
// // // // // // // // //       equipment_id,
// // // // // // // // //       status,
// // // // // // // // //     });

// // // // // // // // //     // Auto-create alert in daily schedule
// // // // // // // // //     const equipment = await EquipmentModel.findByPk(equipment_id);
// // // // // // // // //     const salesOrder = await SalesOrderModel.findByPk(sales_order_id);

// // // // // // // // //     if (equipment && salesOrder) {
// // // // // // // // //       const alertStatus =
// // // // // // // // //         eventType === "Breakdown"
// // // // // // // // //           ? reason.toLowerCase().includes("major")
// // // // // // // // //             ? "Major Breakdown - Major BD"
// // // // // // // // //             : "Minor Breakdown - Minor BD"
// // // // // // // // //           : "Idle Eqp - ID";

// // // // // // // // //       await DailyScheduleModel.create({
// // // // // // // // //         serial_number: equipment_id,
// // // // // // // // //         equipmentDetails: `${equipment.reg_number} - ${equipment.vehicle_type}`,
// // // // // // // // //         client: salesOrder.client,
// // // // // // // // //         status: alertStatus,
// // // // // // // // //         date: new Date(),
// // // // // // // // //         alert_status: "active",
// // // // // // // // //       });
// // // // // // // // //     }

// // // // // // // // //     res
// // // // // // // // //       .status(201)
// // // // // // // // //       .json({ message: "Breakdown event created successfully", breakdown });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res.status(500).json({ error: error.message });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const updateBreakdown = async (req, res) => {
// // // // // // // // //   const { id } = req.params;
// // // // // // // // //   const { eventType, reason, duration, sales_order_id, equipment_id, status } =
// // // // // // // // //     req.body;

// // // // // // // // //   try {
// // // // // // // // //     const breakdown = await Breakdown.findByPk(id);
// // // // // // // // //     if (!breakdown) {
// // // // // // // // //       return res.status(404).json({ message: "Breakdown event not found" });
// // // // // // // // //     }

// // // // // // // // //     breakdown.eventType = eventType || breakdown.eventType;
// // // // // // // // //     breakdown.reason = reason || breakdown.reason;
// // // // // // // // //     breakdown.duration = duration || breakdown.duration;
// // // // // // // // //     breakdown.sales_order_id = sales_order_id || breakdown.sales_order_id;
// // // // // // // // //     breakdown.equipment_id = equipment_id || breakdown.equipment_id;
// // // // // // // // //     breakdown.status = status || breakdown.status;

// // // // // // // // //     await breakdown.save();
// // // // // // // // //     res
// // // // // // // // //       .status(200)
// // // // // // // // //       .json({ message: "Breakdown event updated successfully", breakdown });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error updating breakdown event",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const getBreakdowns = async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     const { page = 1, limit = 10, status = "All" } = req.query;
// // // // // // // // //     const offset = (page - 1) * parseInt(limit);
// // // // // // // // //     const where = status !== "All" ? { status } : {};

// // // // // // // // //     const { count: totalBreakdowns, rows: breakdowns } =
// // // // // // // // //       await Breakdown.findAndCountAll({
// // // // // // // // //         where,
// // // // // // // // //         offset,
// // // // // // // // //         limit: parseInt(limit),
// // // // // // // // //         include: [
// // // // // // // // //           { model: SalesOrderModel, as: "sales_order" },
// // // // // // // // //           { model: EquipmentModel, as: "equipment" },
// // // // // // // // //         ],
// // // // // // // // //       });

// // // // // // // // //     res.status(200).json({
// // // // // // // // //       totalBreakdowns,
// // // // // // // // //       currentPage: parseInt(page),
// // // // // // // // //       totalPages: Math.ceil(totalBreakdowns / limit),
// // // // // // // // //       breakdowns,
// // // // // // // // //     });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({ message: "Error retrieving breakdowns", error: error.message });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const exportBreakdownsToCSV = async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     const { status = "All", page = 1, limit = 10 } = req.query;
// // // // // // // // //     const offset = (page - 1) * parseInt(limit);
// // // // // // // // //     const where = status !== "All" ? { status } : {};

// // // // // // // // //     const { rows: breakdowns } = await Breakdown.findAndCountAll({
// // // // // // // // //       where,
// // // // // // // // //       offset,
// // // // // // // // //       limit: parseInt(limit),
// // // // // // // // //       include: [
// // // // // // // // //         { model: SalesOrderModel, as: "sales_order" },
// // // // // // // // //         { model: EquipmentModel, as: "equipment" },
// // // // // // // // //       ],
// // // // // // // // //     });

// // // // // // // // //     if (!breakdowns || breakdowns.length === 0) {
// // // // // // // // //       return res.status(404).json({ message: "No breakdowns found" });
// // // // // // // // //     }

// // // // // // // // //     const breakdownsData = breakdowns.map((breakdown) => ({
// // // // // // // // //       id: breakdown.id,
// // // // // // // // //       eventType: breakdown.eventType,
// // // // // // // // //       reason: breakdown.reason,
// // // // // // // // //       duration: breakdown.duration,
// // // // // // // // //       timestamp: breakdown.timestamp,
// // // // // // // // //       sales_order_id: breakdown.sales_order_id,
// // // // // // // // //       equipment_id: breakdown.equipment_id,
// // // // // // // // //       status: breakdown.status,
// // // // // // // // //     }));

// // // // // // // // //     const json2csvParser = new Parser();
// // // // // // // // //     const csv = json2csvParser.parse(breakdownsData);

// // // // // // // // //     res.header("Content-Type", "text/csv");
// // // // // // // // //     res.attachment("breakdowns.csv");
// // // // // // // // //     res.send(csv);
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error exporting breakdowns to CSV",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const exportBreakdownsToPDF = async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     const { status = "All", page = 1, limit = 10 } = req.query;
// // // // // // // // //     const offset = (page - 1) * parseInt(limit);
// // // // // // // // //     const where = status !== "All" ? { status } : {};

// // // // // // // // //     const { rows: breakdowns } = await Breakdown.findAndCountAll({
// // // // // // // // //       where,
// // // // // // // // //       offset,
// // // // // // // // //       limit: parseInt(limit),
// // // // // // // // //       include: [
// // // // // // // // //         { model: SalesOrderModel, as: "sales_order" },
// // // // // // // // //         { model: EquipmentModel, as: "equipment" },
// // // // // // // // //       ],
// // // // // // // // //     });

// // // // // // // // //     if (!breakdowns || breakdowns.length === 0) {
// // // // // // // // //       return res.status(404).json({ message: "No breakdowns found" });
// // // // // // // // //     }

// // // // // // // // //     const breakdownsData = breakdowns.map((breakdown) => [
// // // // // // // // //       breakdown.id || "N/A",
// // // // // // // // //       breakdown.eventType || "N/A",
// // // // // // // // //       breakdown.reason || "N/A",
// // // // // // // // //       breakdown.duration || "N/A",
// // // // // // // // //       breakdown.timestamp.toISOString().split("T")[0] || "N/A",
// // // // // // // // //       breakdown.sales_order_id || "N/A",
// // // // // // // // //       breakdown.equipment_id || "N/A",
// // // // // // // // //       breakdown.status || "N/A",
// // // // // // // // //     ]);

// // // // // // // // //     const docDefinition = {
// // // // // // // // //       content: [
// // // // // // // // //         { text: "Breakdowns Data", style: "header" },
// // // // // // // // //         {
// // // // // // // // //           table: {
// // // // // // // // //             headerRows: 1,
// // // // // // // // //             widths: [
// // // // // // // // //               "auto",
// // // // // // // // //               "auto",
// // // // // // // // //               "*",
// // // // // // // // //               "auto",
// // // // // // // // //               "auto",
// // // // // // // // //               "auto",
// // // // // // // // //               "auto",
// // // // // // // // //               "auto",
// // // // // // // // //             ],
// // // // // // // // //             body: [
// // // // // // // // //               [
// // // // // // // // //                 "ID",
// // // // // // // // //                 "Event Type",
// // // // // // // // //                 "Reason",
// // // // // // // // //                 "Duration",
// // // // // // // // //                 "Timestamp",
// // // // // // // // //                 "Sales Order ID",
// // // // // // // // //                 "Equipment ID",
// // // // // // // // //                 "Status",
// // // // // // // // //               ],
// // // // // // // // //               ...breakdownsData,
// // // // // // // // //             ],
// // // // // // // // //           },
// // // // // // // // //         },
// // // // // // // // //       ],
// // // // // // // // //       styles: {
// // // // // // // // //         header: {
// // // // // // // // //           fontSize: 18,
// // // // // // // // //           bold: true,
// // // // // // // // //           alignment: "center",
// // // // // // // // //           margin: [0, 0, 0, 20],
// // // // // // // // //         },
// // // // // // // // //       },
// // // // // // // // //       defaultStyle: {
// // // // // // // // //         fontSize: 8,
// // // // // // // // //       },
// // // // // // // // //     };

// // // // // // // // //     const printer = new PdfPrinter({
// // // // // // // // //       Roboto: {
// // // // // // // // //         normal: path.join(sourceDir, "Roboto-Regular.ttf"),
// // // // // // // // //         bold: path.join(sourceDir, "Roboto-Medium.ttf"),
// // // // // // // // //         italics: path.join(sourceDir, "Roboto-Italic.ttf"),
// // // // // // // // //         bolditalics: path.join(sourceDir, "Roboto-MediumItalic.ttf"),
// // // // // // // // //       },
// // // // // // // // //     });

// // // // // // // // //     const pdfDoc = printer.createPdfKitDocument(docDefinition);
// // // // // // // // //     res.header("Content-Type", "application/pdf");
// // // // // // // // //     res.attachment("breakdowns.pdf");
// // // // // // // // //     pdfDoc.pipe(res);
// // // // // // // // //     pdfDoc.end();
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error exporting breakdowns to PDF",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // // Handheld Event Controllers
// // // // // // // // // const createHandheldEvent = async (req, res) => {
// // // // // // // // //   const {
// // // // // // // // //     eventType,
// // // // // // // // //     time,
// // // // // // // // //     siteId,
// // // // // // // // //     equipment_id,
// // // // // // // // //     signature = false,
// // // // // // // // //     status = "Active",
// // // // // // // // //   } = req.body;

// // // // // // // // //   try {
// // // // // // // // //     const handheldEvent = await HandheldEvent.create({
// // // // // // // // //       eventType,
// // // // // // // // //       time,
// // // // // // // // //       siteId,
// // // // // // // // //       equipment_id,
// // // // // // // // //       signature,
// // // // // // // // //       status,
// // // // // // // // //     });

// // // // // // // // //     res
// // // // // // // // //       .status(201)
// // // // // // // // //       .json({ message: "Handheld event created successfully", handheldEvent });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res.status(500).json({ error: error.message });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const updateHandheldEvent = async (req, res) => {
// // // // // // // // //   const { id } = req.params;
// // // // // // // // //   const { eventType, time, siteId, equipment_id, signature, status } = req.body;

// // // // // // // // //   try {
// // // // // // // // //     const handheldEvent = await HandheldEvent.findByPk(id);
// // // // // // // // //     if (!handheldEvent) {
// // // // // // // // //       return res.status(404).json({ message: "Handheld event not found" });
// // // // // // // // //     }

// // // // // // // // //     handheldEvent.eventType = eventType || handheldEvent.eventType;
// // // // // // // // //     handheldEvent.time = time || handheldEvent.time;
// // // // // // // // //     handheldEvent.siteId = siteId || handheldEvent.siteId;
// // // // // // // // //     handheldEvent.equipment_id = equipment_id || handheldEvent.equipment_id;
// // // // // // // // //     handheldEvent.signature =
// // // // // // // // //       signature !== undefined ? signature : handheldEvent.signature;
// // // // // // // // //     handheldEvent.status = status || handheldEvent.status;

// // // // // // // // //     await handheldEvent.save();
// // // // // // // // //     res
// // // // // // // // //       .status(200)
// // // // // // // // //       .json({ message: "Handheld event updated successfully", handheldEvent });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({ message: "Error updating handheld event", error: error.message });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const getHandheldEvents = async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     const { page = 1, limit = 10, status = "All" } = req.query;
// // // // // // // // //     const offset = (page - 1) * parseInt(limit);
// // // // // // // // //     const where = status !== "All" ? { status } : {};

// // // // // // // // //     const { count: totalEvents, rows: handheldEvents } =
// // // // // // // // //       await HandheldEvent.findAndCountAll({
// // // // // // // // //         where,
// // // // // // // // //         offset,
// // // // // // // // //         limit: parseInt(limit),
// // // // // // // // //         include: [{ model: EquipmentModel, as: "equipment" }],
// // // // // // // // //       });

// // // // // // // // //     res.status(200).json({
// // // // // // // // //       totalEvents,
// // // // // // // // //       currentPage: parseInt(page),
// // // // // // // // //       totalPages: Math.ceil(totalEvents / limit),
// // // // // // // // //       handheldEvents,
// // // // // // // // //     });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error retrieving handheld events",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // // Coordinator Task Controllers
// // // // // // // // // const createCoordinatorTask = async (req, res) => {
// // // // // // // // //   const {
// // // // // // // // //     name,
// // // // // // // // //     priority = "Medium",
// // // // // // // // //     assignedTo,
// // // // // // // // //     dueDate,
// // // // // // // // //     status = "Pending",
// // // // // // // // //   } = req.body;

// // // // // // // // //   try {
// // // // // // // // //     const coordinatorTask = await CoordinatorTask.create({
// // // // // // // // //       name,
// // // // // // // // //       priority,
// // // // // // // // //       assignedTo,
// // // // // // // // //       dueDate,
// // // // // // // // //       status,
// // // // // // // // //     });

// // // // // // // // //     res
// // // // // // // // //       .status(201)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Coordinator task created successfully",
// // // // // // // // //         coordinatorTask,
// // // // // // // // //       });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res.status(500).json({ error: error.message });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const updateCoordinatorTask = async (req, res) => {
// // // // // // // // //   const { id } = req.params;
// // // // // // // // //   const { name, priority, assignedTo, dueDate, status } = req.body;

// // // // // // // // //   try {
// // // // // // // // //     const coordinatorTask = await CoordinatorTask.findByPk(id);
// // // // // // // // //     if (!coordinatorTask) {
// // // // // // // // //       return res.status(404).json({ message: "Coordinator task not found" });
// // // // // // // // //     }

// // // // // // // // //     coordinatorTask.name = name || coordinatorTask.name;
// // // // // // // // //     coordinatorTask.priority = priority || coordinatorTask.priority;
// // // // // // // // //     coordinatorTask.assignedTo = assignedTo || coordinatorTask.assignedTo;
// // // // // // // // //     coordinatorTask.dueDate = dueDate || coordinatorTask.dueDate;
// // // // // // // // //     coordinatorTask.status = status || coordinatorTask.status;

// // // // // // // // //     await coordinatorTask.save();
// // // // // // // // //     res
// // // // // // // // //       .status(200)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Coordinator task updated successfully",
// // // // // // // // //         coordinatorTask,
// // // // // // // // //       });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error updating coordinator task",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const getCoordinatorTasks = async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     const { page = 1, limit = 10, status = "All" } = req.query;
// // // // // // // // //     const offset = (page - 1) * parseInt(limit);
// // // // // // // // //     const where = status !== "All" ? { status } : {};

// // // // // // // // //     const { count: totalTasks, rows: coordinatorTasks } =
// // // // // // // // //       await CoordinatorTask.findAndCountAll({
// // // // // // // // //         where,
// // // // // // // // //         offset,
// // // // // // // // //         limit: parseInt(limit),
// // // // // // // // //       });

// // // // // // // // //     res.status(200).json({
// // // // // // // // //       totalTasks,
// // // // // // // // //       currentPage: parseInt(page),
// // // // // // // // //       totalPages: Math.ceil(totalTasks / limit),
// // // // // // // // //       coordinatorTasks,
// // // // // // // // //     });
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res
// // // // // // // // //       .status(500)
// // // // // // // // //       .json({
// // // // // // // // //         message: "Error retrieving coordinator tasks",
// // // // // // // // //         error: error.message,
// // // // // // // // //       });
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // module.exports = {
// // // // // // // // //   createActiveAllocation,
// // // // // // // // //   updateActiveAllocation,
// // // // // // // // //   deleteActiveAllocation,
// // // // // // // // //   getActiveAllocationById,
// // // // // // // // //   getActiveAllocations,
// // // // // // // // //   exportActiveAllocationsToCSV,
// // // // // // // // //   exportActiveAllocationsToPDF,
// // // // // // // // //   createBreakdown,
// // // // // // // // //   updateBreakdown,
// // // // // // // // //   getBreakdowns,
// // // // // // // // //   exportBreakdownsToCSV,
// // // // // // // // //   exportBreakdownsToPDF,
// // // // // // // // //   createHandheldEvent,
// // // // // // // // //   updateHandheldEvent,
// // // // // // // // //   getHandheldEvents,
// // // // // // // // //   createCoordinatorTask,
// // // // // // // // //   updateCoordinatorTask,
// // // // // // // // //   getCoordinatorTasks,
// // // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * OperationalHandlingController
// // // // // // // //  *
// // // // // // // //  * Handles Active Orders (Current Shift / Next Shift / Future Orders)
// // // // // // // //  * and Completed Orders for the Operational Handling module.
// // // // // // // //  *
// // // // // // // //  * Shift Windows (per system rules):
// // // // // // // //  *   Day Shift  : 06:00 – 17:59
// // // // // // // //  *   Night Shift: 18:00 – 05:59 (next day)
// // // // // // // //  *
// // // // // // // //  * Active Order Criteria:
// // // // // // // //  *   - At least one resource (equipment, manpower, or attachment) must be allocated.
// // // // // // // //  *   - current date must be >= scheduled_date AND <= lpo_end_date (lpo_validity_date
// // // // // // // //  *     or extended_lpo_validity_date, whichever is the effective end date).
// // // // // // // //  *
// // // // // // // //  * Completed Order Criteria:
// // // // // // // //  *   - operational_status of the shift allocation record === "Completed"
// // // // // // // //  */

// // // // // // // // const { Op } = require("sequelize");
// // // // // // // // const sequelize = require("../../config/dbSync");
// // // // // // // // const {
// // // // // // // //   OperationalShiftAllocationModel,
// // // // // // // //   OperationalShiftEquipmentModel,
// // // // // // // //   OperationalShiftManpowerModel,
// // // // // // // //   OperationalShiftAttachmentModel,
// // // // // // // // } = require("../../models/fleet-management/OperationalHandlingModel");
// // // // // // // // const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// // // // // // // // const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// // // // // // // // const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
// // // // // // // // const EmployeeModel = require("../../models/hr/employees/EmployeeModel");
// // // // // // // // const JobLocationModel = require("../../models/fleet-management/JobLocationModel");

// // // // // // // // // ─── Shift Utility Helpers ────────────────────────────────────────────────────

// // // // // // // // /**
// // // // // // // //  * Returns the current shift type ("Day" | "Night") and
// // // // // // // //  * the canonical shift date boundaries based on the current server time.
// // // // // // // //  *
// // // // // // // //  * Day  Shift: 06:00 – 17:59  (same calendar date)
// // // // // // // //  * Night Shift: 18:00 – 05:59 (starts current date, ends next calendar date)
// // // // // // // //  */
// // // // // // // // const getCurrentShiftInfo = () => {
// // // // // // // //   const now = new Date();
// // // // // // // //   const hours = now.getHours(); // 0-23

// // // // // // // //   // Day shift: 6 <= hours <= 17
// // // // // // // //   const isDay = hours >= 6 && hours <= 17;

// // // // // // // //   // Current shift date is always today's calendar date
// // // // // // // //   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// // // // // // // //   if (isDay) {
// // // // // // // //     return {
// // // // // // // //       currentShiftType: "Day",
// // // // // // // //       currentShiftDate: toDateString(today),
// // // // // // // //       nextShiftType: "Night",
// // // // // // // //       nextShiftDate: toDateString(today), // Night shift same calendar day starts at 18:00
// // // // // // // //     };
// // // // // // // //   } else {
// // // // // // // //     // Night shift — the next shift is the Day shift of TOMORROW
// // // // // // // //     const tomorrow = new Date(today);
// // // // // // // //     tomorrow.setDate(today.getDate() + 1);
// // // // // // // //     return {
// // // // // // // //       currentShiftType: "Night",
// // // // // // // //       currentShiftDate: toDateString(today),
// // // // // // // //       nextShiftType: "Day",
// // // // // // // //       nextShiftDate: toDateString(tomorrow),
// // // // // // // //     };
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // /** Convert a Date object to "YYYY-MM-DD" string */
// // // // // // // // const toDateString = (date) => date.toISOString().split("T")[0];

// // // // // // // // /**
// // // // // // // //  * Determine the effective LPO end date for a sales order.
// // // // // // // //  * Uses extended_lpo_validity_date if present, otherwise lpo_validity_date.
// // // // // // // //  */
// // // // // // // // const getLpoEndDate = (salesOrder) =>
// // // // // // // //   salesOrder.extended_lpo_validity_date || salesOrder.lpo_validity_date || null;

// // // // // // // // /**
// // // // // // // //  * Build the common include array for a shift allocation query.
// // // // // // // //  * Fetches salesOrder (with location), equipment, manpower, attachment resources.
// // // // // // // //  */
// // // // // // // // const buildResourceIncludes = () => [
// // // // // // // //   {
// // // // // // // //     model: SalesOrdersModel,
// // // // // // // //     as: "salesOrder",
// // // // // // // //     attributes: [
// // // // // // // //       "id",
// // // // // // // //       "so_number",
// // // // // // // //       "client",
// // // // // // // //       "project_name",
// // // // // // // //       "shift",
// // // // // // // //       "lpo_number",
// // // // // // // //       "lpo_validity_date",
// // // // // // // //       "extended_lpo_validity_date",
// // // // // // // //       "expected_mobilization_date",
// // // // // // // //       "expected_demobilization_date",
// // // // // // // //       "ops_status",
// // // // // // // //       "so_status",
// // // // // // // //     ],
// // // // // // // //     include: [
// // // // // // // //       {
// // // // // // // //         model: JobLocationModel,
// // // // // // // //         as: "jobLocation",
// // // // // // // //         attributes: ["job_location_id", "job_location_name"],
// // // // // // // //       },
// // // // // // // //     ],
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     model: OperationalShiftEquipmentModel,
// // // // // // // //     as: "equipmentAllocations",
// // // // // // // //     include: [
// // // // // // // //       {
// // // // // // // //         model: EquipmentModel,
// // // // // // // //         as: "equipment",
// // // // // // // //         attributes: ["serial_number", "reg_number", "vehicle_type", "equipment_status"],
// // // // // // // //       },
// // // // // // // //     ],
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     model: OperationalShiftManpowerModel,
// // // // // // // //     as: "manpowerAllocations",
// // // // // // // //     include: [
// // // // // // // //       {
// // // // // // // //         model: EmployeeModel,
// // // // // // // //         as: "employee",
// // // // // // // //         attributes: ["id", "personalDetails"],
// // // // // // // //       },
// // // // // // // //     ],
// // // // // // // //   },
// // // // // // // //   {
// // // // // // // //     model: OperationalShiftAttachmentModel,
// // // // // // // //     as: "attachmentAllocations",
// // // // // // // //     include: [
// // // // // // // //       {
// // // // // // // //         model: AttachmentModel,
// // // // // // // //         as: "attachment",
// // // // // // // //         attributes: ["attachment_id", "attachment_number", "product_name", "serial_number"],
// // // // // // // //       },
// // // // // // // //     ],
// // // // // // // //   },
// // // // // // // // ];

// // // // // // // // /**
// // // // // // // //  * Filter helper — keeps only those shift allocation records that:
// // // // // // // //  *   1. Have at least one equipment, manpower, or attachment resource.
// // // // // // // //  *   2. The Sales Order's scheduled_date <= today AND lpo_end_date >= today
// // // // // // // //  *      (i.e., the order is within its active date window).
// // // // // // // //  */
// // // // // // // // const filterActiveRecords = (records, todayStr) =>
// // // // // // // //   records.filter((record) => {
// // // // // // // //     const hasResources =
// // // // // // // //       record.equipmentAllocations.length > 0 ||
// // // // // // // //       record.manpowerAllocations.length > 0 ||
// // // // // // // //       record.attachmentAllocations.length > 0;

// // // // // // // //     if (!hasResources) return false;

// // // // // // // //     const so = record.salesOrder;
// // // // // // // //     if (!so) return false;

// // // // // // // //     const scheduledDate = record.scheduled_date || record.shift_date;
// // // // // // // //     const lpoEndDate = getLpoEndDate(so);

// // // // // // // //     // Both boundaries must be present and today must be within range
// // // // // // // //     if (!scheduledDate || !lpoEndDate) return false;
// // // // // // // //     return scheduledDate <= todayStr && lpoEndDate >= todayStr;
// // // // // // // //   });

// // // // // // // // // ─── Controller Functions ─────────────────────────────────────────────────────

// // // // // // // // /**
// // // // // // // //  * GET /api/operational-handling/active-orders/current-shift
// // // // // // // //  *
// // // // // // // //  * Returns orders allocated to the CURRENT shift (Day or Night)
// // // // // // // //  * based on the current server time.
// // // // // // // //  *
// // // // // // // //  * Active criteria:
// // // // // // // //  *   - operational_status != "Completed" && != "Cancelled"
// // // // // // // //  *   - Has at least one resource
// // // // // // // //  *   - Today is within [scheduled_date, lpo_end_date]
// // // // // // // //  */
// // // // // // // // const getCurrentShiftOrders = async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const { page = 1, limit = 10 } = req.query;
// // // // // // // //     const offset = (page - 1) * parseInt(limit);

// // // // // // // //     const { currentShiftType, currentShiftDate } = getCurrentShiftInfo();

// // // // // // // //     const { count, rows } = await OperationalShiftAllocationModel.findAndCountAll({
// // // // // // // //       where: {
// // // // // // // //         shift_type: currentShiftType,
// // // // // // // //         shift_date: currentShiftDate,
// // // // // // // //         operational_status: {
// // // // // // // //           [Op.notIn]: ["Completed", "Cancelled"],
// // // // // // // //         },
// // // // // // // //       },
// // // // // // // //       include: buildResourceIncludes(),
// // // // // // // //       offset,
// // // // // // // //       limit: parseInt(limit),
// // // // // // // //       order: [["shift_date", "ASC"]],
// // // // // // // //       distinct: true,
// // // // // // // //     });

// // // // // // // //     // Filter to orders with resources and within active date window
// // // // // // // //     const activeRows = filterActiveRecords(rows, currentShiftDate);

// // // // // // // //     return res.status(200).json({
// // // // // // // //       shiftType: currentShiftType,
// // // // // // // //       shiftDate: currentShiftDate,
// // // // // // // //       totalOrders: activeRows.length,
// // // // // // // //       currentPage: parseInt(page),
// // // // // // // //       totalPages: Math.ceil(count / parseInt(limit)),
// // // // // // // //       orders: activeRows,
// // // // // // // //     });
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error fetching current shift orders:", error);
// // // // // // // //     return res.status(500).json({
// // // // // // // //       message: "Error fetching current shift orders",
// // // // // // // //       error: error.message,
// // // // // // // //     });
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * GET /api/operational-handling/active-orders/next-shift
// // // // // // // //  *
// // // // // // // //  * Returns orders allocated to the NEXT shift immediately following
// // // // // // // //  * the current shift.
// // // // // // // //  *
// // // // // // // //  * If current = Day  → Next = Night (same calendar date)
// // // // // // // //  * If current = Night → Next = Day  (next calendar date)
// // // // // // // //  */
// // // // // // // // const getNextShiftOrders = async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const { page = 1, limit = 10 } = req.query;
// // // // // // // //     const offset = (page - 1) * parseInt(limit);

// // // // // // // //     const { nextShiftType, nextShiftDate, currentShiftDate } = getCurrentShiftInfo();

// // // // // // // //     const { count, rows } = await OperationalShiftAllocationModel.findAndCountAll({
// // // // // // // //       where: {
// // // // // // // //         shift_type: nextShiftType,
// // // // // // // //         shift_date: nextShiftDate,
// // // // // // // //         operational_status: {
// // // // // // // //           [Op.notIn]: ["Completed", "Cancelled"],
// // // // // // // //         },
// // // // // // // //       },
// // // // // // // //       include: buildResourceIncludes(),
// // // // // // // //       offset,
// // // // // // // //       limit: parseInt(limit),
// // // // // // // //       order: [["shift_date", "ASC"]],
// // // // // // // //       distinct: true,
// // // // // // // //     });

// // // // // // // //     // For next shift, use nextShiftDate as the reference date for active window check
// // // // // // // //     const activeRows = filterActiveRecords(rows, nextShiftDate);

// // // // // // // //     return res.status(200).json({
// // // // // // // //       shiftType: nextShiftType,
// // // // // // // //       shiftDate: nextShiftDate,
// // // // // // // //       totalOrders: activeRows.length,
// // // // // // // //       currentPage: parseInt(page),
// // // // // // // //       totalPages: Math.ceil(count / parseInt(limit)),
// // // // // // // //       orders: activeRows,
// // // // // // // //     });
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error fetching next shift orders:", error);
// // // // // // // //     return res.status(500).json({
// // // // // // // //       message: "Error fetching next shift orders",
// // // // // // // //       error: error.message,
// // // // // // // //     });
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * GET /api/operational-handling/active-orders/future-orders
// // // // // // // //  *
// // // // // // // //  * Returns orders allocated AFTER the next shift window.
// // // // // // // //  * These are allocations planned for later dates or future operational shifts.
// // // // // // // //  *
// // // // // // // //  * Logic:
// // // // // // // //  *   shift_date > nextShiftDate
// // // // // // // //  *   OR (shift_date == nextShiftDate AND shift_type is after the nextShiftType in sequence)
// // // // // // // //  *
// // // // // // // //  * Simpler approach: shift_date > nextShiftDate (day-level future orders)
// // // // // // // //  * combined with: shift_date == nextShiftDate but shift_type would be "after" — 
// // // // // // // //  * since we only have Day/Night, we treat all records beyond next shift as future.
// // // // // // // //  */
// // // // // // // // const getFutureOrders = async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const { page = 1, limit = 10 } = req.query;
// // // // // // // //     const offset = (page - 1) * parseInt(limit);

// // // // // // // //     const { nextShiftType, nextShiftDate } = getCurrentShiftInfo();
// // // // // // // //     const todayStr = toDateString(new Date());

// // // // // // // //     // Future = shift_date strictly after the nextShiftDate
// // // // // // // //     // OR same date but the shift that is "beyond" the nextShift
// // // // // // // //     // Since Day comes before Night within a day:
// // // // // // // //     //   If next shift is Night (same date), future = same date Day would already be current,
// // // // // // // //     //   so future = dates after nextShiftDate.
// // // // // // // //     //   If next shift is Day (next calendar day), future = dates after nextShiftDate.
// // // // // // // //     // Conclusion: shift_date > nextShiftDate covers all future orders cleanly.
// // // // // // // //     const { count, rows } = await OperationalShiftAllocationModel.findAndCountAll({
// // // // // // // //       where: {
// // // // // // // //         shift_date: {
// // // // // // // //           [Op.gt]: nextShiftDate,
// // // // // // // //         },
// // // // // // // //         operational_status: {
// // // // // // // //           [Op.notIn]: ["Completed", "Cancelled"],
// // // // // // // //         },
// // // // // // // //       },
// // // // // // // //       include: buildResourceIncludes(),
// // // // // // // //       offset,
// // // // // // // //       limit: parseInt(limit),
// // // // // // // //       order: [
// // // // // // // //         ["shift_date", "ASC"],
// // // // // // // //         ["shift_type", "ASC"],
// // // // // // // //       ],
// // // // // // // //       distinct: true,
// // // // // // // //     });

// // // // // // // //     // Filter: must have resources; active window check uses shift_date as reference
// // // // // // // //     const activeRows = rows.filter((record) => {
// // // // // // // //       const hasResources =
// // // // // // // //         record.equipmentAllocations.length > 0 ||
// // // // // // // //         record.manpowerAllocations.length > 0 ||
// // // // // // // //         record.attachmentAllocations.length > 0;

// // // // // // // //       if (!hasResources) return false;

// // // // // // // //       const so = record.salesOrder;
// // // // // // // //       if (!so) return false;

// // // // // // // //       const lpoEndDate = getLpoEndDate(so);
// // // // // // // //       const scheduledDate = record.scheduled_date || record.shift_date;

// // // // // // // //       // For future orders, lpoEndDate must be >= shift_date (order still valid)
// // // // // // // //       if (!lpoEndDate || !scheduledDate) return false;
// // // // // // // //       return lpoEndDate >= record.shift_date;
// // // // // // // //     });

// // // // // // // //     return res.status(200).json({
// // // // // // // //       totalOrders: activeRows.length,
// // // // // // // //       currentPage: parseInt(page),
// // // // // // // //       totalPages: Math.ceil(count / parseInt(limit)),
// // // // // // // //       orders: activeRows,
// // // // // // // //     });
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error fetching future orders:", error);
// // // // // // // //     return res.status(500).json({
// // // // // // // //       message: "Error fetching future orders",
// // // // // // // //       error: error.message,
// // // // // // // //     });
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * GET /api/operational-handling/active-orders
// // // // // // // //  *
// // // // // // // //  * Returns ALL three categories in a single response:
// // // // // // // //  * { currentShift, nextShift, futureOrders }
// // // // // // // //  * Useful for dashboard-level loading.
// // // // // // // //  */
// // // // // // // // const getAllActiveOrders = async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const { page = 1, limit = 10 } = req.query;
// // // // // // // //     const offset = (page - 1) * parseInt(limit);

// // // // // // // //     const { currentShiftType, currentShiftDate, nextShiftType, nextShiftDate } =
// // // // // // // //       getCurrentShiftInfo();

// // // // // // // //     const baseWhere = {
// // // // // // // //       operational_status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // // // // // //     };

// // // // // // // //     // Fetch all three in parallel
// // // // // // // //     const [currentShiftRows, nextShiftRows, futureRows] = await Promise.all([
// // // // // // // //       // Current shift
// // // // // // // //       OperationalShiftAllocationModel.findAll({
// // // // // // // //         where: {
// // // // // // // //           ...baseWhere,
// // // // // // // //           shift_type: currentShiftType,
// // // // // // // //           shift_date: currentShiftDate,
// // // // // // // //         },
// // // // // // // //         include: buildResourceIncludes(),
// // // // // // // //         order: [["shift_date", "ASC"]],
// // // // // // // //       }),

// // // // // // // //       // Next shift
// // // // // // // //       OperationalShiftAllocationModel.findAll({
// // // // // // // //         where: {
// // // // // // // //           ...baseWhere,
// // // // // // // //           shift_type: nextShiftType,
// // // // // // // //           shift_date: nextShiftDate,
// // // // // // // //         },
// // // // // // // //         include: buildResourceIncludes(),
// // // // // // // //         order: [["shift_date", "ASC"]],
// // // // // // // //       }),

// // // // // // // //       // Future orders
// // // // // // // //       OperationalShiftAllocationModel.findAll({
// // // // // // // //         where: {
// // // // // // // //           ...baseWhere,
// // // // // // // //           shift_date: { [Op.gt]: nextShiftDate },
// // // // // // // //         },
// // // // // // // //         include: buildResourceIncludes(),
// // // // // // // //         order: [
// // // // // // // //           ["shift_date", "ASC"],
// // // // // // // //           ["shift_type", "ASC"],
// // // // // // // //         ],
// // // // // // // //       }),
// // // // // // // //     ]);

// // // // // // // //     const filteredCurrent = filterActiveRecords(currentShiftRows, currentShiftDate);
// // // // // // // //     const filteredNext = filterActiveRecords(nextShiftRows, nextShiftDate);
// // // // // // // //     const filteredFuture = futureRows.filter((record) => {
// // // // // // // //       const hasResources =
// // // // // // // //         record.equipmentAllocations.length > 0 ||
// // // // // // // //         record.manpowerAllocations.length > 0 ||
// // // // // // // //         record.attachmentAllocations.length > 0;
// // // // // // // //       if (!hasResources) return false;
// // // // // // // //       const so = record.salesOrder;
// // // // // // // //       if (!so) return false;
// // // // // // // //       const lpoEndDate = getLpoEndDate(so);
// // // // // // // //       if (!lpoEndDate) return false;
// // // // // // // //       return lpoEndDate >= record.shift_date;
// // // // // // // //     });

// // // // // // // //     return res.status(200).json({
// // // // // // // //       currentShift: {
// // // // // // // //         shiftType: currentShiftType,
// // // // // // // //         shiftDate: currentShiftDate,
// // // // // // // //         totalOrders: filteredCurrent.length,
// // // // // // // //         orders: filteredCurrent,
// // // // // // // //       },
// // // // // // // //       nextShift: {
// // // // // // // //         shiftType: nextShiftType,
// // // // // // // //         shiftDate: nextShiftDate,
// // // // // // // //         totalOrders: filteredNext.length,
// // // // // // // //         orders: filteredNext,
// // // // // // // //       },
// // // // // // // //       futureOrders: {
// // // // // // // //         totalOrders: filteredFuture.length,
// // // // // // // //         orders: filteredFuture,
// // // // // // // //       },
// // // // // // // //     });
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error fetching all active orders:", error);
// // // // // // // //     return res.status(500).json({
// // // // // // // //       message: "Error fetching all active orders",
// // // // // // // //       error: error.message,
// // // // // // // //     });
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * GET /api/operational-handling/completed-orders
// // // // // // // //  *
// // // // // // // //  * Returns all shift allocation records where operational_status === "Completed".
// // // // // // // //  * These must also have at least one resource allocated.
// // // // // // // //  * Supports optional date range filtering via query params.
// // // // // // // //  */
// // // // // // // // const getCompletedOrders = async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const { page = 1, limit = 10, from_date, to_date } = req.query;
// // // // // // // //     const offset = (page - 1) * parseInt(limit);

// // // // // // // //     const dateFilter = {};
// // // // // // // //     if (from_date) dateFilter[Op.gte] = from_date;
// // // // // // // //     if (to_date) dateFilter[Op.lte] = to_date;

// // // // // // // //     const whereClause = {
// // // // // // // //       operational_status: "Completed",
// // // // // // // //       ...(Object.keys(dateFilter).length > 0 && { shift_date: dateFilter }),
// // // // // // // //     };

// // // // // // // //     const { count, rows } = await OperationalShiftAllocationModel.findAndCountAll({
// // // // // // // //       where: whereClause,
// // // // // // // //       include: buildResourceIncludes(),
// // // // // // // //       offset,
// // // // // // // //       limit: parseInt(limit),
// // // // // // // //       order: [["shift_date", "DESC"]],
// // // // // // // //       distinct: true,
// // // // // // // //     });

// // // // // // // //     // Filter to only records that actually have resources
// // // // // // // //     const completedRows = rows.filter(
// // // // // // // //       (record) =>
// // // // // // // //         record.equipmentAllocations.length > 0 ||
// // // // // // // //         record.manpowerAllocations.length > 0 ||
// // // // // // // //         record.attachmentAllocations.length > 0
// // // // // // // //     );

// // // // // // // //     return res.status(200).json({
// // // // // // // //       totalOrders: count,
// // // // // // // //       currentPage: parseInt(page),
// // // // // // // //       totalPages: Math.ceil(count / parseInt(limit)),
// // // // // // // //       orders: completedRows,
// // // // // // // //     });
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error fetching completed orders:", error);
// // // // // // // //     return res.status(500).json({
// // // // // // // //       message: "Error fetching completed orders",
// // // // // // // //       error: error.message,
// // // // // // // //     });
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * GET /api/operational-handling/completed-orders/:id
// // // // // // // //  *
// // // // // // // //  * Get a single completed (or any) shift allocation record by its ID.
// // // // // // // //  */
// // // // // // // // const getShiftAllocationById = async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const { id } = req.params;

// // // // // // // //     const record = await OperationalShiftAllocationModel.findByPk(id, {
// // // // // // // //       include: buildResourceIncludes(),
// // // // // // // //     });

// // // // // // // //     if (!record) {
// // // // // // // //       return res.status(404).json({ message: "Shift allocation record not found" });
// // // // // // // //     }

// // // // // // // //     return res.status(200).json(record);
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error fetching shift allocation:", error);
// // // // // // // //     return res.status(500).json({
// // // // // // // //       message: "Error fetching shift allocation",
// // // // // // // //       error: error.message,
// // // // // // // //     });
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * POST /api/operational-handling/shift-allocation
// // // // // // // //  *
// // // // // // // //  * Create a new shift allocation record for a Sales Order.
// // // // // // // //  * At least one resource (equipment, manpower, or attachment) must be provided.
// // // // // // // //  *
// // // // // // // //  * Body:
// // // // // // // //  * {
// // // // // // // //  *   so_id, shift_date, shift_type, scheduled_date,
// // // // // // // //  *   remarks,
// // // // // // // //  *   equipment: [{ serial_number, note }],
// // // // // // // //  *   manpower:  [{ employee_id, note }],
// // // // // // // //  *   attachments: [{ attachment_id, note }]
// // // // // // // //  * }
// // // // // // // //  */
// // // // // // // // const createShiftAllocation = async (req, res) => {
// // // // // // // //   const transaction = await sequelize.transaction();

// // // // // // // //   try {
// // // // // // // //     const {
// // // // // // // //       so_id,
// // // // // // // //       shift_date,
// // // // // // // //       shift_type,
// // // // // // // //       scheduled_date,
// // // // // // // //       remarks,
// // // // // // // //       equipment = [],
// // // // // // // //       manpower = [],
// // // // // // // //       attachments = [],
// // // // // // // //     } = req.body;

// // // // // // // //     // Validate: at least one resource required
// // // // // // // //     if (equipment.length === 0 && manpower.length === 0 && attachments.length === 0) {
// // // // // // // //       await transaction.rollback();
// // // // // // // //       return res.status(400).json({
// // // // // // // //         message:
// // // // // // // //           "At least one operational resource (equipment, manpower, or attachment) must be allocated.",
// // // // // // // //       });
// // // // // // // //     }

// // // // // // // //     // Validate Sales Order exists
// // // // // // // //     const salesOrder = await SalesOrdersModel.findByPk(so_id);
// // // // // // // //     if (!salesOrder) {
// // // // // // // //       await transaction.rollback();
// // // // // // // //       return res.status(404).json({ message: "Sales order not found" });
// // // // // // // //     }

// // // // // // // //     // Create the shift allocation record
// // // // // // // //     const shiftAllocation = await OperationalShiftAllocationModel.create(
// // // // // // // //       {
// // // // // // // //         so_id,
// // // // // // // //         shift_date,
// // // // // // // //         shift_type,
// // // // // // // //         scheduled_date: scheduled_date || shift_date,
// // // // // // // //         operational_status: "Pending",
// // // // // // // //         remarks: remarks || null,
// // // // // // // //       },
// // // // // // // //       { transaction }
// // // // // // // //     );

// // // // // // // //     const allocationId = shiftAllocation.shift_allocation_id;

// // // // // // // //     // Create equipment records
// // // // // // // //     for (const eq of equipment) {
// // // // // // // //       await OperationalShiftEquipmentModel.create(
// // // // // // // //         {
// // // // // // // //           shift_allocation_id: allocationId,
// // // // // // // //           serial_number: eq.serial_number,
// // // // // // // //           note: eq.note || null,
// // // // // // // //         },
// // // // // // // //         { transaction }
// // // // // // // //       );
// // // // // // // //     }

// // // // // // // //     // Create manpower records
// // // // // // // //     for (const mp of manpower) {
// // // // // // // //       await OperationalShiftManpowerModel.create(
// // // // // // // //         {
// // // // // // // //           shift_allocation_id: allocationId,
// // // // // // // //           employee_id: mp.employee_id,
// // // // // // // //           note: mp.note || null,
// // // // // // // //         },
// // // // // // // //         { transaction }
// // // // // // // //       );
// // // // // // // //     }

// // // // // // // //     // Create attachment records
// // // // // // // //     for (const att of attachments) {
// // // // // // // //       await OperationalShiftAttachmentModel.create(
// // // // // // // //         {
// // // // // // // //           shift_allocation_id: allocationId,
// // // // // // // //           attachment_id: att.attachment_id,
// // // // // // // //           note: att.note || null,
// // // // // // // //         },
// // // // // // // //         { transaction }
// // // // // // // //       );
// // // // // // // //     }

// // // // // // // //     await transaction.commit();

// // // // // // // //     return res.status(201).json({
// // // // // // // //       message: "Shift allocation created successfully",
// // // // // // // //       shift_allocation_id: allocationId,
// // // // // // // //     });
// // // // // // // //   } catch (error) {
// // // // // // // //     await transaction.rollback();
// // // // // // // //     console.error("Error creating shift allocation:", error);
// // // // // // // //     return res.status(500).json({
// // // // // // // //       message: "Error creating shift allocation",
// // // // // // // //       error: error.message,
// // // // // // // //     });
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * PUT /api/operational-handling/shift-allocation/:id/status
// // // // // // // //  *
// // // // // // // //  * Update the operational_status of a shift allocation.
// // // // // // // //  * When set to "Completed", the order will appear in Completed Orders.
// // // // // // // //  *
// // // // // // // //  * Body: { operational_status: "Pending" | "In Progress" | "Completed" | "Cancelled" }
// // // // // // // //  */
// // // // // // // // const updateShiftAllocationStatus = async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const { id } = req.params;
// // // // // // // //     const { operational_status, remarks } = req.body;

// // // // // // // //     const validStatuses = ["Pending", "In Progress", "Completed", "Cancelled"];
// // // // // // // //     if (!validStatuses.includes(operational_status)) {
// // // // // // // //       return res.status(400).json({
// // // // // // // //         message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
// // // // // // // //       });
// // // // // // // //     }

// // // // // // // //     const record = await OperationalShiftAllocationModel.findByPk(id);
// // // // // // // //     if (!record) {
// // // // // // // //       return res.status(404).json({ message: "Shift allocation record not found" });
// // // // // // // //     }

// // // // // // // //     await record.update({
// // // // // // // //       operational_status,
// // // // // // // //       ...(remarks !== undefined && { remarks }),
// // // // // // // //     });

// // // // // // // //     return res.status(200).json({
// // // // // // // //       message: `Operational status updated to "${operational_status}" successfully`,
// // // // // // // //       shift_allocation_id: record.shift_allocation_id,
// // // // // // // //       operational_status: record.operational_status,
// // // // // // // //     });
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error updating shift allocation status:", error);
// // // // // // // //     return res.status(500).json({
// // // // // // // //       message: "Error updating shift allocation status",
// // // // // // // //       error: error.message,
// // // // // // // //     });
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // /**
// // // // // // // //  * GET /api/operational-handling/shift-info
// // // // // // // //  *
// // // // // // // //  * Utility endpoint — returns current shift type, date,
// // // // // // // //  * and the next shift type and date based on server time.
// // // // // // // //  */
// // // // // // // // const getShiftInfo = async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const info = getCurrentShiftInfo();
// // // // // // // //     const now = new Date();
// // // // // // // //     return res.status(200).json({
// // // // // // // //       serverTime: now.toISOString(),
// // // // // // // //       ...info,
// // // // // // // //     });
// // // // // // // //   } catch (error) {
// // // // // // // //     return res.status(500).json({ message: error.message });
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // module.exports = {
// // // // // // // //   getCurrentShiftOrders,
// // // // // // // //   getNextShiftOrders,
// // // // // // // //   getFutureOrders,
// // // // // // // //   getAllActiveOrders,
// // // // // // // //   getCompletedOrders,
// // // // // // // //   getShiftAllocationById,
// // // // // // // //   createShiftAllocation,
// // // // // // // //   updateShiftAllocationStatus,
// // // // // // // //   getShiftInfo,
// // // // // // // // };

// // // // // // // // controllers/fleet-management/operationalHandlingController.js

// // // // // // // const { Op, Sequelize } = require("sequelize");
// // // // // // // const sequelize = require("../../config/dbSync");
// // // // // // // const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// // // // // // // const JobLocationModel = require("../../models/fleet-management/JobLocationModel");
// // // // // // // const EmployeeModel = require("../../models/hr/employees/EmployeeModel");
// // // // // // // const {
// // // // // // //   ActiveAllocationModel,
// // // // // // //   AllocationEquipmentModel,
// // // // // // //   AllocationManpowerModel,
// // // // // // //   AllocationAttachmentModel,
// // // // // // // } = require("../../models/fleet-management/ActiveAllocationsOriginalModel");
// // // // // // // const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// // // // // // // const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
// // // // // // // const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
// // // // // // // const OperatorTypeModel = require("../../models/fleet-management/OperatorTypeModel");

// // // // // // // // Helper function to determine current shift based on time
// // // // // // // const getCurrentShift = () => {
// // // // // // //   const now = new Date();
// // // // // // //   const hours = now.getHours();
// // // // // // //   const minutes = now.getMinutes();
// // // // // // //   const currentTime = hours * 60 + minutes; // Convert to minutes for easier comparison

// // // // // // //   // Day Shift: 6:00 AM (360 minutes) to 5:59 PM (1079 minutes)
// // // // // // //   const dayShiftStart = 6 * 60; // 360 minutes (6:00 AM)
// // // // // // //   const dayShiftEnd = 17 * 60 + 59; // 1079 minutes (5:59 PM)

// // // // // // //   // Night Shift: 6:00 PM (1080 minutes) to 5:59 AM (359 minutes next day)
// // // // // // //   const nightShiftStart = 18 * 60; // 1080 minutes (6:00 PM)
// // // // // // //   const nightShiftEnd = 5 * 60 + 59; // 359 minutes (5:59 AM)

// // // // // // //   if (currentTime >= dayShiftStart && currentTime <= dayShiftEnd) {
// // // // // // //     return "Day";
// // // // // // //   } else {
// // // // // // //     return "Night";
// // // // // // //   }
// // // // // // // };

// // // // // // // // Helper function to get shift date ranges
// // // // // // // const getShiftDateRanges = () => {
// // // // // // //   const now = new Date();
// // // // // // //   const currentShift = getCurrentShift();
  
// // // // // // //   // Create date objects for shift boundaries
// // // // // // //   const today = new Date(now);
// // // // // // //   today.setHours(0, 0, 0, 0);
  
// // // // // // //   const tomorrow = new Date(today);
// // // // // // //   tomorrow.setDate(tomorrow.getDate() + 1);
  
// // // // // // //   const dayAfterTomorrow = new Date(today);
// // // // // // //   dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
// // // // // // //   // Current shift range
// // // // // // //   let currentShiftStart = new Date(now);
// // // // // // //   let currentShiftEnd = new Date(now);
  
// // // // // // //   if (currentShift === "Day") {
// // // // // // //     // Day shift: 6:00 AM today to 5:59 PM today
// // // // // // //     currentShiftStart = new Date(today);
// // // // // // //     currentShiftStart.setHours(6, 0, 0, 0);
    
// // // // // // //     currentShiftEnd = new Date(today);
// // // // // // //     currentShiftEnd.setHours(17, 59, 59, 999);
// // // // // // //   } else {
// // // // // // //     // Night shift: 6:00 PM today to 5:59 AM tomorrow
// // // // // // //     currentShiftStart = new Date(today);
// // // // // // //     currentShiftStart.setHours(18, 0, 0, 0);
    
// // // // // // //     currentShiftEnd = new Date(tomorrow);
// // // // // // //     currentShiftEnd.setHours(5, 59, 59, 999);
// // // // // // //   }
  
// // // // // // //   // Next shift range
// // // // // // //   let nextShiftStart, nextShiftEnd;
  
// // // // // // //   if (currentShift === "Day") {
// // // // // // //     // Next is Night shift: 6:00 PM today to 5:59 AM tomorrow
// // // // // // //     nextShiftStart = new Date(today);
// // // // // // //     nextShiftStart.setHours(18, 0, 0, 0);
    
// // // // // // //     nextShiftEnd = new Date(tomorrow);
// // // // // // //     nextShiftEnd.setHours(5, 59, 59, 999);
// // // // // // //   } else {
// // // // // // //     // Next is Day shift tomorrow: 6:00 AM tomorrow to 5:59 PM tomorrow
// // // // // // //     nextShiftStart = new Date(tomorrow);
// // // // // // //     nextShiftStart.setHours(6, 0, 0, 0);
    
// // // // // // //     nextShiftEnd = new Date(tomorrow);
// // // // // // //     nextShiftEnd.setHours(17, 59, 59, 999);
// // // // // // //   }
  
// // // // // // //   // Future orders start after next shift end
// // // // // // //   const futureStart = new Date(nextShiftEnd);
// // // // // // //   futureStart.setSeconds(futureStart.getSeconds() + 1);
  
// // // // // // //   return {
// // // // // // //     currentShift,
// // // // // // //     currentShiftStart: currentShiftStart.toISOString(),
// // // // // // //     currentShiftEnd: currentShiftEnd.toISOString(),
// // // // // // //     nextShiftStart: nextShiftStart.toISOString(),
// // // // // // //     nextShiftEnd: nextShiftEnd.toISOString(),
// // // // // // //     futureStart: futureStart.toISOString(),
// // // // // // //     todayDate: today.toISOString().split('T')[0],
// // // // // // //   };
// // // // // // // };

// // // // // // // // Helper function to check if order has allocated resources
// // // // // // // const hasAllocatedResources = async (allocationId) => {
// // // // // // //   const equipmentCount = await AllocationEquipmentModel.count({
// // // // // // //     where: { allocation_id: allocationId }
// // // // // // //   });
  
// // // // // // //   const manpowerCount = await AllocationManpowerModel.count({
// // // // // // //     where: { allocation_id: allocationId }
// // // // // // //   });
  
// // // // // // //   const attachmentCount = await AllocationAttachmentModel.count({
// // // // // // //     where: { allocation_id: allocationId }
// // // // // // //   });
  
// // // // // // //   return equipmentCount > 0 || manpowerCount > 0 || attachmentCount > 0;
// // // // // // // };

// // // // // // // /**
// // // // // // //  * GET /api/operational-handling/active-orders
// // // // // // //  * Get all active orders with shift-based categorization
// // // // // // //  */
// // // // // // // const getActiveOrders = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const { page = 1, limit = 10 } = req.query;
// // // // // // //     const offset = (page - 1) * parseInt(limit);
    
// // // // // // //     const shiftRanges = getShiftDateRanges();
// // // // // // //     const currentDate = new Date().toISOString().split('T')[0];
    
// // // // // // //     console.log("Shift Ranges:", shiftRanges);
    
// // // // // // //     // Find all active allocations that are not completed
// // // // // // //     const allocations = await ActiveAllocationModel.findAll({
// // // // // // //       where: {
// // // // // // //         status: {
// // // // // // //           [Op.notIn]: ["Completed", "Cancelled"]
// // // // // // //         }
// // // // // // //       },
// // // // // // //       include: [
// // // // // // //         {
// // // // // // //           model: SalesOrdersModel,
// // // // // // //           as: "salesOrder",
// // // // // // //           required: true,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: JobLocationModel,
// // // // // // //               as: "jobLocation",
// // // // // // //               attributes: ["job_location_id", "job_location_name"]
// // // // // // //             },
// // // // // // //             {
// // // // // // //               model: EmployeeModel,
// // // // // // //               as: "employee",
// // // // // // //               attributes: ["id", "personalDetails"]
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         },
// // // // // // //         {
// // // // // // //           model: AllocationEquipmentModel,
// // // // // // //           as: "equipmentAllocations",
// // // // // // //           required: false,
// // // // // // //           separate: true,
// // // // // // //           limit: 5,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: EquipmentModel,
// // // // // // //               as: "equipment",
// // // // // // //               attributes: ["serial_number", "reg_number", "vehicle_type"]
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         },
// // // // // // //         {
// // // // // // //           model: AllocationManpowerModel,
// // // // // // //           as: "manpowerAllocations",
// // // // // // //           required: false,
// // // // // // //           separate: true,
// // // // // // //           limit: 5,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: EmployeeModel,
// // // // // // //               as: "employee",
// // // // // // //               attributes: ["id", "personalDetails"],
// // // // // // //               include: [
// // // // // // //                 {
// // // // // // //                   model: ManpowerModel,
// // // // // // //                   as: "manpower",
// // // // // // //                   attributes: ["employeeNo"],
// // // // // // //                   include: [
// // // // // // //                     {
// // // // // // //                       model: OperatorTypeModel,
// // // // // // //                       as: "operator_type",
// // // // // // //                       attributes: ["operator_type"]
// // // // // // //                     }
// // // // // // //                   ]
// // // // // // //                 }
// // // // // // //               ]
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         },
// // // // // // //         {
// // // // // // //           model: AllocationAttachmentModel,
// // // // // // //           as: "attachmentAllocations",
// // // // // // //           required: false,
// // // // // // //           separate: true,
// // // // // // //           limit: 5,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: AttachmentModel,
// // // // // // //               as: "attachment",
// // // // // // //               attributes: ["attachment_id", "attachment_number", "product_name"]
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         }
// // // // // // //       ],
// // // // // // //       order: [
// // // // // // //         ["allocation_date", "ASC"],
// // // // // // //         ["createdAt", "DESC"]
// // // // // // //       ]
// // // // // // //     });
    
// // // // // // //     // Filter allocations to only those with allocated resources
// // // // // // //     const allocationsWithResources = [];
    
// // // // // // //     for (const allocation of allocations) {
// // // // // // //       const hasResources = await hasAllocatedResources(allocation.allocation_id);
      
// // // // // // //       if (hasResources) {
// // // // // // //         // Get counts
// // // // // // //         const equipmentCount = await AllocationEquipmentModel.count({
// // // // // // //           where: { allocation_id: allocation.allocation_id }
// // // // // // //         });
        
// // // // // // //         const manpowerCount = await AllocationManpowerModel.count({
// // // // // // //           where: { allocation_id: allocation.allocation_id }
// // // // // // //         });
        
// // // // // // //         const attachmentCount = await AllocationAttachmentModel.count({
// // // // // // //           where: { allocation_id: allocation.allocation_id }
// // // // // // //         });
        
// // // // // // //         // Determine scheduled date from equipment allocation or use allocation date
// // // // // // //         const equipmentSchedule = await AllocationEquipmentModel.findOne({
// // // // // // //           where: { allocation_id: allocation.allocation_id },
// // // // // // //           order: [["createdAt", "ASC"]]
// // // // // // //         });
        
// // // // // // //         const scheduledDate = equipmentSchedule?.createdAt 
// // // // // // //           ? new Date(equipmentSchedule.createdAt).toISOString().split('T')[0]
// // // // // // //           : allocation.allocation_date;
        
// // // // // // //         // Create order object with resource counts
// // // // // // //         const orderWithCounts = {
// // // // // // //           ...allocation.toJSON(),
// // // // // // //           scheduled_date: scheduledDate,
// // // // // // //           lpo_end_date: allocation.salesOrder?.lpo_validity_date,
// // // // // // //           equipment_count: equipmentCount,
// // // // // // //           manpower_count: manpowerCount,
// // // // // // //           attachments_count: attachmentCount,
// // // // // // //           total_resources: equipmentCount + manpowerCount + attachmentCount
// // // // // // //         };
        
// // // // // // //         allocationsWithResources.push(orderWithCounts);
// // // // // // //       }
// // // // // // //     }
    
// // // // // // //     // Categorize orders
// // // // // // //     const currentShiftOrders = [];
// // // // // // //     const nextShiftOrders = [];
// // // // // // //     const futureOrders = [];
    
// // // // // // //     allocationsWithResources.forEach(order => {
// // // // // // //       const orderDate = order.allocation_date;
// // // // // // //       const scheduledDateTime = order.scheduled_date 
// // // // // // //         ? new Date(order.scheduled_date).getTime() 
// // // // // // //         : new Date(orderDate).getTime();
      
// // // // // // //       const currentShiftStartTime = new Date(shiftRanges.currentShiftStart).getTime();
// // // // // // //       const currentShiftEndTime = new Date(shiftRanges.currentShiftEnd).getTime();
// // // // // // //       const nextShiftStartTime = new Date(shiftRanges.nextShiftStart).getTime();
// // // // // // //       const nextShiftEndTime = new Date(shiftRanges.nextShiftEnd).getTime();
// // // // // // //       const futureStartTime = new Date(shiftRanges.futureStart).getTime();
      
// // // // // // //       // Check if order falls within current shift
// // // // // // //       if (scheduledDateTime >= currentShiftStartTime && scheduledDateTime <= currentShiftEndTime) {
// // // // // // //         currentShiftOrders.push({
// // // // // // //           ...order,
// // // // // // //           shift_category: "current"
// // // // // // //         });
// // // // // // //       }
// // // // // // //       // Check if order falls within next shift
// // // // // // //       else if (scheduledDateTime >= nextShiftStartTime && scheduledDateTime <= nextShiftEndTime) {
// // // // // // //         nextShiftOrders.push({
// // // // // // //           ...order,
// // // // // // //           shift_category: "next"
// // // // // // //         });
// // // // // // //       }
// // // // // // //       // Future orders
// // // // // // //       else if (scheduledDateTime >= futureStartTime) {
// // // // // // //         futureOrders.push({
// // // // // // //           ...order,
// // // // // // //           shift_category: "future"
// // // // // // //         });
// // // // // // //       }
// // // // // // //     });
    
// // // // // // //     // Apply pagination to each category if needed
// // // // // // //     const paginatedCurrent = currentShiftOrders.slice(offset, offset + parseInt(limit));
// // // // // // //     const paginatedNext = nextShiftOrders.slice(offset, offset + parseInt(limit));
// // // // // // //     const paginatedFuture = futureOrders.slice(offset, offset + parseInt(limit));
    
// // // // // // //     res.status(200).json({
// // // // // // //       message: "Active orders retrieved successfully",
// // // // // // //       current_shift: {
// // // // // // //         shift_name: shiftRanges.currentShift,
// // // // // // //         shift_start: shiftRanges.currentShiftStart,
// // // // // // //         shift_end: shiftRanges.currentShiftEnd,
// // // // // // //         total_orders: currentShiftOrders.length,
// // // // // // //         orders: paginatedCurrent
// // // // // // //       },
// // // // // // //       next_shift: {
// // // // // // //         shift_name: shiftRanges.currentShift === "Day" ? "Night" : "Day",
// // // // // // //         shift_start: shiftRanges.nextShiftStart,
// // // // // // //         shift_end: shiftRanges.nextShiftEnd,
// // // // // // //         total_orders: nextShiftOrders.length,
// // // // // // //         orders: paginatedNext
// // // // // // //       },
// // // // // // //       future_orders: {
// // // // // // //         start_from: shiftRanges.futureStart,
// // // // // // //         total_orders: futureOrders.length,
// // // // // // //         orders: paginatedFuture
// // // // // // //       },
// // // // // // //       pagination: {
// // // // // // //         page: parseInt(page),
// // // // // // //         limit: parseInt(limit),
// // // // // // //         has_more_current: currentShiftOrders.length > offset + parseInt(limit),
// // // // // // //         has_more_next: nextShiftOrders.length > offset + parseInt(limit),
// // // // // // //         has_more_future: futureOrders.length > offset + parseInt(limit)
// // // // // // //       }
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     console.error("Error retrieving active orders:", error);
// // // // // // //     res.status(500).json({
// // // // // // //       message: "Error retrieving active orders",
// // // // // // //       error: error.message
// // // // // // //     });
// // // // // // //   }
// // // // // // // };

// // // // // // // /**
// // // // // // //  * GET /api/operational-handling/completed-orders
// // // // // // //  * Get all completed orders
// // // // // // //  */
// // // // // // // const getCompletedOrders = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const { page = 1, limit = 10, from_date, to_date } = req.query;
// // // // // // //     const offset = (page - 1) * parseInt(limit);
    
// // // // // // //     // Build where clause for completed orders
// // // // // // //     const whereClause = {
// // // // // // //       status: "Completed"
// // // // // // //     };
    
// // // // // // //     // Date range filter
// // // // // // //     if (from_date || to_date) {
// // // // // // //       whereClause.allocation_date = {};
      
// // // // // // //       if (from_date) {
// // // // // // //         whereClause.allocation_date[Op.gte] = from_date;
// // // // // // //       }
      
// // // // // // //       if (to_date) {
// // // // // // //         whereClause.allocation_date[Op.lte] = to_date;
// // // // // // //       }
// // // // // // //     }
    
// // // // // // //     // Find completed allocations
// // // // // // //     const { count, rows: allocations } = await ActiveAllocationModel.findAndCountAll({
// // // // // // //       where: whereClause,
// // // // // // //       include: [
// // // // // // //         {
// // // // // // //           model: SalesOrdersModel,
// // // // // // //           as: "salesOrder",
// // // // // // //           required: true,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: JobLocationModel,
// // // // // // //               as: "jobLocation",
// // // // // // //               attributes: ["job_location_id", "job_location_name"]
// // // // // // //             },
// // // // // // //             {
// // // // // // //               model: EmployeeModel,
// // // // // // //               as: "employee",
// // // // // // //               attributes: ["id", "personalDetails"]
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         },
// // // // // // //         {
// // // // // // //           model: AllocationEquipmentModel,
// // // // // // //           as: "equipmentAllocations",
// // // // // // //           required: false,
// // // // // // //           separate: true,
// // // // // // //           limit: 5,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: EquipmentModel,
// // // // // // //               as: "equipment",
// // // // // // //               attributes: ["serial_number", "reg_number", "vehicle_type"]
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         },
// // // // // // //         {
// // // // // // //           model: AllocationManpowerModel,
// // // // // // //           as: "manpowerAllocations",
// // // // // // //           required: false,
// // // // // // //           separate: true,
// // // // // // //           limit: 5,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: EmployeeModel,
// // // // // // //               as: "employee",
// // // // // // //               attributes: ["id", "personalDetails"],
// // // // // // //               include: [
// // // // // // //                 {
// // // // // // //                   model: ManpowerModel,
// // // // // // //                   as: "manpower",
// // // // // // //                   attributes: ["employeeNo"],
// // // // // // //                   include: [
// // // // // // //                     {
// // // // // // //                       model: OperatorTypeModel,
// // // // // // //                       as: "operator_type",
// // // // // // //                       attributes: ["operator_type"]
// // // // // // //                     }
// // // // // // //                   ]
// // // // // // //                 }
// // // // // // //               ]
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         },
// // // // // // //         {
// // // // // // //           model: AllocationAttachmentModel,
// // // // // // //           as: "attachmentAllocations",
// // // // // // //           required: false,
// // // // // // //           separate: true,
// // // // // // //           limit: 5,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: AttachmentModel,
// // // // // // //               as: "attachment",
// // // // // // //               attributes: ["attachment_id", "attachment_number", "product_name"]
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         }
// // // // // // //       ],
// // // // // // //       offset,
// // // // // // //       limit: parseInt(limit),
// // // // // // //       order: [["updatedAt", "DESC"]]
// // // // // // //     });
    
// // // // // // //     // Filter to ensure only allocations with resources are included
// // // // // // //     const completedOrders = [];
    
// // // // // // //     for (const allocation of allocations) {
// // // // // // //       const hasResources = await hasAllocatedResources(allocation.allocation_id);
      
// // // // // // //       if (hasResources) {
// // // // // // //         // Get counts
// // // // // // //         const equipmentCount = await AllocationEquipmentModel.count({
// // // // // // //           where: { allocation_id: allocation.allocation_id }
// // // // // // //         });
        
// // // // // // //         const manpowerCount = await AllocationManpowerModel.count({
// // // // // // //           where: { allocation_id: allocation.allocation_id }
// // // // // // //         });
        
// // // // // // //         const attachmentCount = await AllocationAttachmentModel.count({
// // // // // // //           where: { allocation_id: allocation.allocation_id }
// // // // // // //         });
        
// // // // // // //         completedOrders.push({
// // // // // // //           ...allocation.toJSON(),
// // // // // // //           equipment_count: equipmentCount,
// // // // // // //           manpower_count: manpowerCount,
// // // // // // //           attachments_count: attachmentCount,
// // // // // // //           total_resources: equipmentCount + manpowerCount + attachmentCount,
// // // // // // //           completed_date: allocation.updatedAt
// // // // // // //         });
// // // // // // //       }
// // // // // // //     }
    
// // // // // // //     res.status(200).json({
// // // // // // //       message: "Completed orders retrieved successfully",
// // // // // // //       total_orders: completedOrders.length,
// // // // // // //       current_page: parseInt(page),
// // // // // // //       total_pages: Math.ceil(completedOrders.length / parseInt(limit)),
// // // // // // //       orders: completedOrders
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     console.error("Error retrieving completed orders:", error);
// // // // // // //     res.status(500).json({
// // // // // // //       message: "Error retrieving completed orders",
// // // // // // //       error: error.message
// // // // // // //     });
// // // // // // //   }
// // // // // // // };

// // // // // // // /**
// // // // // // //  * GET /api/operational-handling/order/:allocationId
// // // // // // //  * Get detailed information for a specific operational order
// // // // // // //  */
// // // // // // // const getOperationalOrderDetails = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const { allocationId } = req.params;
    
// // // // // // //     const allocation = await ActiveAllocationModel.findOne({
// // // // // // //       where: { allocation_id: allocationId },
// // // // // // //       include: [
// // // // // // //         {
// // // // // // //           model: SalesOrdersModel,
// // // // // // //           as: "salesOrder",
// // // // // // //           required: true,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: JobLocationModel,
// // // // // // //               as: "jobLocation"
// // // // // // //             },
// // // // // // //             {
// // // // // // //               model: EmployeeModel,
// // // // // // //               as: "employee"
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         },
// // // // // // //         {
// // // // // // //           model: AllocationEquipmentModel,
// // // // // // //           as: "equipmentAllocations",
// // // // // // //           required: false,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: EquipmentModel,
// // // // // // //               as: "equipment"
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         },
// // // // // // //         {
// // // // // // //           model: AllocationManpowerModel,
// // // // // // //           as: "manpowerAllocations",
// // // // // // //           required: false,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: EmployeeModel,
// // // // // // //               as: "employee",
// // // // // // //               include: [
// // // // // // //                 {
// // // // // // //                   model: ManpowerModel,
// // // // // // //                   as: "manpower",
// // // // // // //                   include: [
// // // // // // //                     {
// // // // // // //                       model: OperatorTypeModel,
// // // // // // //                       as: "operator_type"
// // // // // // //                     }
// // // // // // //                   ]
// // // // // // //                 }
// // // // // // //               ]
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         },
// // // // // // //         {
// // // // // // //           model: AllocationAttachmentModel,
// // // // // // //           as: "attachmentAllocations",
// // // // // // //           required: false,
// // // // // // //           include: [
// // // // // // //             {
// // // // // // //               model: AttachmentModel,
// // // // // // //               as: "attachment"
// // // // // // //             }
// // // // // // //           ]
// // // // // // //         }
// // // // // // //       ]
// // // // // // //     });
    
// // // // // // //     if (!allocation) {
// // // // // // //       return res.status(404).json({ message: "Operational order not found" });
// // // // // // //     }
    
// // // // // // //     // Check if order has allocated resources
// // // // // // //     const hasResources = await hasAllocatedResources(allocation.allocation_id);
    
// // // // // // //     if (!hasResources) {
// // // // // // //       return res.status(404).json({ 
// // // // // // //         message: "Operational order has no allocated resources" 
// // // // // // //       });
// // // // // // //     }
    
// // // // // // //     res.status(200).json({
// // // // // // //       message: "Operational order details retrieved successfully",
// // // // // // //       order: allocation
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     console.error("Error retrieving operational order details:", error);
// // // // // // //     res.status(500).json({
// // // // // // //       message: "Error retrieving operational order details",
// // // // // // //       error: error.message
// // // // // // //     });
// // // // // // //   }
// // // // // // // };

// // // // // // // /**
// // // // // // //  * GET /api/operational-handling/current-shift-info
// // // // // // //  * Get information about current and next shifts
// // // // // // //  */
// // // // // // // const getCurrentShiftInfo = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const shiftRanges = getShiftDateRanges();
    
// // // // // // //     res.status(200).json({
// // // // // // //       current_shift: {
// // // // // // //         name: shiftRanges.currentShift,
// // // // // // //         start: shiftRanges.currentShiftStart,
// // // // // // //         end: shiftRanges.currentShiftEnd
// // // // // // //       },
// // // // // // //       next_shift: {
// // // // // // //         name: shiftRanges.currentShift === "Day" ? "Night" : "Day",
// // // // // // //         start: shiftRanges.nextShiftStart,
// // // // // // //         end: shiftRanges.nextShiftEnd
// // // // // // //       },
// // // // // // //       server_time: new Date().toISOString()
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     console.error("Error getting shift info:", error);
// // // // // // //     res.status(500).json({
// // // // // // //       message: "Error getting shift information",
// // // // // // //       error: error.message
// // // // // // //     });
// // // // // // //   }
// // // // // // // };

// // // // // // // /**
// // // // // // //  * GET /api/operational-handling/orders-by-date
// // // // // // //  * Get operational orders for a specific date
// // // // // // //  */
// // // // // // // const getOrdersByDate = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const { date, shift } = req.query;
    
// // // // // // //     if (!date) {
// // // // // // //       return res.status(400).json({ message: "Date parameter is required" });
// // // // // // //     }
    
// // // // // // //     const whereClause = {
// // // // // // //       allocation_date: date,
// // // // // // //       status: {
// // // // // // //         [Op.notIn]: ["Completed", "Cancelled"]
// // // // // // //       }
// // // // // // //     };
    
// // // // // // //     if (shift && (shift === "Day" || shift === "Night")) {
// // // // // // //       // For shift filtering, we need to join with sales order to get shift info
// // // // // // //       // This is simplified - actual implementation would need more complex logic
// // // // // // //       // based on your shift allocation logic
// // // // // // //     }
    
// // // // // // //     const allocations = await ActiveAllocationModel.findAll({
// // // // // // //       where: whereClause,
// // // // // // //       include: [
// // // // // // //         {
// // // // // // //           model: SalesOrdersModel,
// // // // // // //           as: "salesOrder",
// // // // // // //           required: true,
// // // // // // //           attributes: ["so_number", "client", "project_name", "shift", "lpo_validity_date"]
// // // // // // //         }
// // // // // // //       ]
// // // // // // //     });
    
// // // // // // //     // Filter for orders with resources
// // // // // // //     const ordersWithResources = [];
    
// // // // // // //     for (const allocation of allocations) {
// // // // // // //       const hasResources = await hasAllocatedResources(allocation.allocation_id);
      
// // // // // // //       if (hasResources) {
// // // // // // //         ordersWithResources.push(allocation);
// // // // // // //       }
// // // // // // //     }
    
// // // // // // //     res.status(200).json({
// // // // // // //       message: "Orders retrieved successfully",
// // // // // // //       date: date,
// // // // // // //       total_orders: ordersWithResources.length,
// // // // // // //       orders: ordersWithResources
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     console.error("Error retrieving orders by date:", error);
// // // // // // //     res.status(500).json({
// // // // // // //       message: "Error retrieving orders by date",
// // // // // // //       error: error.message
// // // // // // //     });
// // // // // // //   }
// // // // // // // };

// // // // // // // /**
// // // // // // //  * PUT /api/operational-handling/order/:allocationId/complete
// // // // // // //  * Mark an operational order as completed
// // // // // // //  */
// // // // // // // const completeOperationalOrder = async (req, res) => {
// // // // // // //   const transaction = await sequelize.transaction();
  
// // // // // // //   try {
// // // // // // //     const { allocationId } = req.params;
// // // // // // //     const { completion_notes } = req.body;
    
// // // // // // //     const allocation = await ActiveAllocationModel.findByPk(allocationId, {
// // // // // // //       transaction
// // // // // // //     });
    
// // // // // // //     if (!allocation) {
// // // // // // //       await transaction.rollback();
// // // // // // //       return res.status(404).json({ message: "Operational order not found" });
// // // // // // //     }
    
// // // // // // //     if (allocation.status === "Completed") {
// // // // // // //       await transaction.rollback();
// // // // // // //       return res.status(400).json({ message: "Order is already completed" });
// // // // // // //     }
    
// // // // // // //     // Update allocation status to Completed
// // // // // // //     await allocation.update({
// // // // // // //       status: "Completed",
// // // // // // //       user_remarks: completion_notes || allocation.user_remarks
// // // // // // //     }, { transaction });
    
// // // // // // //     // Check if all allocations for this sales order are completed
// // // // // // //     const salesOrderId = allocation.sales_order_id;
    
// // // // // // //     const otherAllocations = await ActiveAllocationModel.findAll({
// // // // // // //       where: {
// // // // // // //         sales_order_id: salesOrderId,
// // // // // // //         allocation_id: { [Op.ne]: allocationId },
// // // // // // //         status: { [Op.ne]: "Completed" }
// // // // // // //       },
// // // // // // //       transaction
// // // // // // //     });
    
// // // // // // //     // If no other active allocations, update sales order ops_status to Completed
// // // // // // //     if (otherAllocations.length === 0) {
// // // // // // //       await SalesOrdersModel.update(
// // // // // // //         { ops_status: "Completed" },
// // // // // // //         { 
// // // // // // //           where: { id: salesOrderId },
// // // // // // //           transaction
// // // // // // //         }
// // // // // // //       );
// // // // // // //     }
    
// // // // // // //     await transaction.commit();
    
// // // // // // //     res.status(200).json({
// // // // // // //       message: "Operational order marked as completed successfully",
// // // // // // //       allocation_id: allocationId
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     await transaction.rollback();
// // // // // // //     console.error("Error completing operational order:", error);
// // // // // // //     res.status(500).json({
// // // // // // //       message: "Error completing operational order",
// // // // // // //       error: error.message
// // // // // // //     });
// // // // // // //   }
// // // // // // // };

// // // // // // // /**
// // // // // // //  * GET /api/operational-handling/stats
// // // // // // //  * Get operational handling statistics
// // // // // // //  */
// // // // // // // const getOperationalStats = async (req, res) => {
// // // // // // //   try {
// // // // // // //     const shiftRanges = getShiftDateRanges();
    
// // // // // // //     // Get counts for different categories
// // // // // // //     const activeAllocations = await ActiveAllocationModel.findAll({
// // // // // // //       where: {
// // // // // // //         status: {
// // // // // // //           [Op.notIn]: ["Completed", "Cancelled"]
// // // // // // //         }
// // // // // // //       },
// // // // // // //       attributes: ["allocation_id", "allocation_date"]
// // // // // // //     });
    
// // // // // // //     // Get completed counts
// // // // // // //     const completedCount = await ActiveAllocationModel.count({
// // // // // // //       where: { status: "Completed" }
// // // // // // //     });
    
// // // // // // //     // Categorize active allocations
// // // // // // //     let currentShiftCount = 0;
// // // // // // //     let nextShiftCount = 0;
// // // // // // //     let futureCount = 0;
    
// // // // // // //     for (const allocation of activeAllocations) {
// // // // // // //       const hasResources = await hasAllocatedResources(allocation.allocation_id);
      
// // // // // // //       if (!hasResources) continue;
      
// // // // // // //       const allocationDateTime = new Date(allocation.allocation_date).getTime();
// // // // // // //       const currentShiftStartTime = new Date(shiftRanges.currentShiftStart).getTime();
// // // // // // //       const currentShiftEndTime = new Date(shiftRanges.currentShiftEnd).getTime();
// // // // // // //       const nextShiftStartTime = new Date(shiftRanges.nextShiftStart).getTime();
// // // // // // //       const nextShiftEndTime = new Date(shiftRanges.nextShiftEnd).getTime();
// // // // // // //       const futureStartTime = new Date(shiftRanges.futureStart).getTime();
      
// // // // // // //       if (allocationDateTime >= currentShiftStartTime && allocationDateTime <= currentShiftEndTime) {
// // // // // // //         currentShiftCount++;
// // // // // // //       } else if (allocationDateTime >= nextShiftStartTime && allocationDateTime <= nextShiftEndTime) {
// // // // // // //         nextShiftCount++;
// // // // // // //       } else if (allocationDateTime >= futureStartTime) {
// // // // // // //         futureCount++;
// // // // // // //       }
// // // // // // //     }
    
// // // // // // //     res.status(200).json({
// // // // // // //       stats: {
// // // // // // //         current_shift: {
// // // // // // //           count: currentShiftCount,
// // // // // // //           shift_name: shiftRanges.currentShift
// // // // // // //         },
// // // // // // //         next_shift: {
// // // // // // //           count: nextShiftCount,
// // // // // // //           shift_name: shiftRanges.currentShift === "Day" ? "Night" : "Day"
// // // // // // //         },
// // // // // // //         future_orders: {
// // // // // // //           count: futureCount
// // // // // // //         },
// // // // // // //         completed_orders: {
// // // // // // //           count: completedCount
// // // // // // //         },
// // // // // // //         total_active: currentShiftCount + nextShiftCount + futureCount
// // // // // // //       },
// // // // // // //       shift_info: {
// // // // // // //         current_shift: {
// // // // // // //           name: shiftRanges.currentShift,
// // // // // // //           start: shiftRanges.currentShiftStart,
// // // // // // //           end: shiftRanges.currentShiftEnd
// // // // // // //         },
// // // // // // //         next_shift: {
// // // // // // //           start: shiftRanges.nextShiftStart,
// // // // // // //           end: shiftRanges.nextShiftEnd
// // // // // // //         }
// // // // // // //       }
// // // // // // //     });
// // // // // // //   } catch (error) {
// // // // // // //     console.error("Error getting operational stats:", error);
// // // // // // //     res.status(500).json({
// // // // // // //       message: "Error getting operational statistics",
// // // // // // //       error: error.message
// // // // // // //     });
// // // // // // //   }
// // // // // // // };

// // // // // // // module.exports = {
// // // // // // //   getActiveOrders,
// // // // // // //   getCompletedOrders,
// // // // // // //   getOperationalOrderDetails,
// // // // // // //   getCurrentShiftInfo,
// // // // // // //   getOrdersByDate,
// // // // // // //   completeOperationalOrder,
// // // // // // //   getOperationalStats
// // // // // // // };

// // // // // // /**
// // // // // //  * Operational Handling Controller
// // // // // //  *
// // // // // //  * Uses existing allocation tables (no new tables needed):
// // // // // //  *   - tbl_active_allocation_original  → ActiveAllocationModel
// // // // // //  *   - tbl_allocation_equipment        → AllocationEquipmentModel
// // // // // //  *   - tbl_allocation_manpower         → AllocationManpowerModel
// // // // // //  *   - tbl_allocation_attachment       → AllocationAttachmentModel
// // // // // //  *
// // // // // //  * Active Order Criteria (from scenario):
// // // // // //  *   - Order must have at least one resource allocated (equipment/manpower/attachment)
// // // // // //  *   - scheduled_date (from EquipmentScheduledModel) = order start
// // // // // //  *   - lpo_end_date   (lpo_validity_date or extended_lpo_validity_date) = order end
// // // // // //  *   - current date must be between scheduled_date and lpo_end_date (inclusive)
// // // // // //  *
// // // // // //  * Shift Windows:
// // // // // //  *   Day   Shift : 06:00 – 17:59
// // // // // //  *   Night Shift : 18:00 – 05:59 (next calendar day)
// // // // // //  *
// // // // // //  * Each allocation's resources are returned SEPARATELY (equipment list, manpower
// // // // // //  * list, attachment list) so the frontend can display them one-by-one.
// // // // // //  *
// // // // // //  * Completed Orders:
// // // // // //  *   - allocation.status === "Completed"  (tbl_active_allocation_original.status)
// // // // // //  */

// // // // // // const { Op } = require("sequelize");
// // // // // // const {
// // // // // //   ActiveAllocationModel,
// // // // // //   AllocationEquipmentModel,
// // // // // //   AllocationManpowerModel,
// // // // // //   AllocationAttachmentModel,
// // // // // // } = require("../../models/fleet-management/ActiveAllocationsOriginalModel");
// // // // // // const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// // // // // // const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// // // // // // const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
// // // // // // const EmployeeModel = require("../../models/hr/employees/EmployeeModel");
// // // // // // const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
// // // // // // const JobLocationModel = require("../../models/fleet-management/JobLocationModel");
// // // // // // const EquipmentScheduledModel = require("../../models/fleet-management/EquipmentScheduledModel");
// // // // // // const ManpowerScheduledModel = require("../../models/fleet-management/ManpowerScheduledModel");
// // // // // // const AttachmentScheduledModel = require("../../models/fleet-management/AttachmentScheduledModel");

// // // // // // // ─── Shift Helpers ────────────────────────────────────────────────────────────

// // // // // // /** Format Date → "YYYY-MM-DD" */
// // // // // // const toDateStr = (d) => d.toISOString().split("T")[0];

// // // // // // /**
// // // // // //  * Returns current shift context based on server time.
// // // // // //  * Day  Shift: 06:00–17:59
// // // // // //  * Night Shift: 18:00–05:59
// // // // // //  */
// // // // // // const getShiftContext = () => {
// // // // // //   const now = new Date();
// // // // // //   const hours = now.getHours();
// // // // // //   const isDay = hours >= 6 && hours <= 17;

// // // // // //   const today = toDateStr(now);
// // // // // //   const tomorrow = toDateStr(
// // // // // //     new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
// // // // // //   );

// // // // // //   if (isDay) {
// // // // // //     return {
// // // // // //       currentShiftType: "Day",
// // // // // //       currentShiftDate: today,
// // // // // //       nextShiftType: "Night",
// // // // // //       nextShiftDate: today,     // Night shift starts same calendar day at 18:00
// // // // // //       futureAfterDate: today,
// // // // // //     };
// // // // // //   } else {
// // // // // //     return {
// // // // // //       currentShiftType: "Night",
// // // // // //       currentShiftDate: today,
// // // // // //       nextShiftType: "Day",
// // // // // //       nextShiftDate: tomorrow,  // Next Day shift = tomorrow
// // // // // //       futureAfterDate: tomorrow,
// // // // // //     };
// // // // // //   }
// // // // // // };

// // // // // // /** Get effective LPO end date for a Sales Order */
// // // // // // const getLpoEndDate = (so) =>
// // // // // //   so.extended_lpo_validity_date || so.lpo_validity_date || null;

// // // // // // // ─── Include Builder ──────────────────────────────────────────────────────────

// // // // // // /**
// // // // // //  * Builds Sequelize includes.
// // // // // //  * Returns salesOrder + all three resource types in separate associations.
// // // // // //  */
// // // // // // const buildIncludes = () => [
// // // // // //   {
// // // // // //     model: SalesOrdersModel,
// // // // // //     as: "salesOrder",
// // // // // //     attributes: [
// // // // // //       "id",
// // // // // //       "so_number",
// // // // // //       "client",
// // // // // //       "project_name",
// // // // // //       "delivery_address",
// // // // // //       "shift",
// // // // // //       "lpo_number",
// // // // // //       "lpo_validity_date",
// // // // // //       "extended_lpo_validity_date",
// // // // // //       "expected_mobilization_date",
// // // // // //       "expected_demobilization_date",
// // // // // //       "ops_status",
// // // // // //       "so_status",
// // // // // //     ],
// // // // // //     include: [
// // // // // //       {
// // // // // //         model: JobLocationModel,
// // // // // //         as: "jobLocation",
// // // // // //         attributes: ["job_location_id", "job_location_name"],
// // // // // //       },
// // // // // //     ],
// // // // // //   },
// // // // // //   // ── Equipment ──
// // // // // //   {
// // // // // //     model: AllocationEquipmentModel,
// // // // // //     as: "equipmentAllocations",
// // // // // //     include: [
// // // // // //       {
// // // // // //         model: EquipmentModel,
// // // // // //         as: "equipment",
// // // // // //         attributes: [
// // // // // //           "serial_number",
// // // // // //           "reg_number",
// // // // // //           "vehicle_type",
// // // // // //           "equipment_status",
// // // // // //           "equipment_status_note",
// // // // // //         ],
// // // // // //       },
// // // // // //     ],
// // // // // //   },
// // // // // //   // ── Manpower ──
// // // // // //   {
// // // // // //     model: AllocationManpowerModel,
// // // // // //     as: "manpowerAllocations",
// // // // // //     include: [
// // // // // //       {
// // // // // //         model: EmployeeModel,
// // // // // //         as: "employee",
// // // // // //         attributes: ["id", "personalDetails"],
// // // // // //         include: [
// // // // // //           {
// // // // // //             model: ManpowerModel,
// // // // // //             as: "manpowerDetails",
// // // // // //             attributes: ["employeeNo", "manpower_status"],
// // // // // //           },
// // // // // //         ],
// // // // // //       },
// // // // // //     ],
// // // // // //   },
// // // // // //   // ── Attachments ──
// // // // // //   {
// // // // // //     model: AllocationAttachmentModel,
// // // // // //     as: "attachmentAllocations",
// // // // // //     include: [
// // // // // //       {
// // // // // //         model: AttachmentModel,
// // // // // //         as: "attachment",
// // // // // //         attributes: [
// // // // // //           "attachment_id",
// // // // // //           "attachment_number",
// // // // // //           "product_name",
// // // // // //           "serial_number",
// // // // // //           "attachment_status",
// // // // // //         ],
// // // // // //       },
// // // // // //     ],
// // // // // //   },
// // // // // // ];

// // // // // // // ─── Response Formatter ───────────────────────────────────────────────────────

// // // // // // /**
// // // // // //  * Formats one ActiveAllocation record into the Operational Handling response.
// // // // // //  *
// // // // // //  * Resources are exposed SEPARATELY so the frontend can render each one
// // // // // //  * individually (one-by-one) under Equipment / Manpower / Attachments sections.
// // // // // //  *
// // // // // //  * Output shape:
// // // // // //  * {
// // // // // //  *   allocation_id, allocation_date, status, service_option, user_remarks,
// // // // // //  *   salesOrder: { ...fields, jobLocation },
// // // // // //  *   resources: {
// // // // // //  *     equipment:    [ { resource_type, allocation_detail, equipment_info } ],
// // // // // //  *     manpower:     [ { resource_type, allocation_detail, employee_info } ],
// // // // // //  *     attachments:  [ { resource_type, allocation_detail, attachment_info } ],
// // // // // //  *     summary: { total_equipment, total_manpower, total_attachments, total_resources }
// // // // // //  *   },
// // // // // //  *   scheduled_dates: { scheduled_date } | null
// // // // // //  * }
// // // // // //  */
// // // // // // const formatAllocationResponse = (allocation, scheduledDatesMap = {}) => {
// // // // // //   const raw = allocation.toJSON ? allocation.toJSON() : allocation;

// // // // // //   // ── Equipment list — one entry per allocated equipment ──
// // // // // //   const equipmentList = (raw.equipmentAllocations || []).map((eq) => ({
// // // // // //     resource_type: "equipment",
// // // // // //     allocation_detail: {
// // // // // //       id: eq.id,
// // // // // //       allocation_id: eq.allocation_id,
// // // // // //       serial_number: eq.serial_number,
// // // // // //       eqt_stu: eq.eqt_stu,
// // // // // //       status: eq.status,
// // // // // //       note: eq.note,
// // // // // //       is_selected: eq.is_selected,
// // // // // //     },
// // // // // //     equipment_info: eq.equipment
// // // // // //       ? {
// // // // // //           serial_number: eq.equipment.serial_number,
// // // // // //           reg_number: eq.equipment.reg_number,
// // // // // //           vehicle_type: eq.equipment.vehicle_type,
// // // // // //           equipment_status: eq.equipment.equipment_status,
// // // // // //           equipment_status_note: eq.equipment.equipment_status_note,
// // // // // //         }
// // // // // //       : null,
// // // // // //   }));

// // // // // //   // ── Manpower list — one entry per allocated employee ──
// // // // // //   const manpowerList = (raw.manpowerAllocations || []).map((mp) => ({
// // // // // //     resource_type: "manpower",
// // // // // //     allocation_detail: {
// // // // // //       id: mp.id,
// // // // // //       allocation_id: mp.allocation_id,
// // // // // //       employee_id: mp.employee_id,
// // // // // //       man_stu: mp.man_stu,
// // // // // //       status: mp.status,
// // // // // //       note: mp.note,
// // // // // //       is_selected: mp.is_selected,
// // // // // //     },
// // // // // //     employee_info: mp.employee
// // // // // //       ? {
// // // // // //           id: mp.employee.id,
// // // // // //           full_name: mp.employee.personalDetails?.fullNameEnglish || null,
// // // // // //           employee_no: mp.employee.manpowerDetails?.employeeNo || null,
// // // // // //           manpower_status: mp.employee.manpowerDetails?.manpower_status || null,
// // // // // //         }
// // // // // //       : null,
// // // // // //   }));

// // // // // //   // ── Attachment list — one entry per allocated attachment ──
// // // // // //   const attachmentList = (raw.attachmentAllocations || []).map((att) => ({
// // // // // //     resource_type: "attachment",
// // // // // //     allocation_detail: {
// // // // // //       id: att.id,
// // // // // //       allocation_id: att.allocation_id,
// // // // // //       attachment_id: att.attachment_id,
// // // // // //       att_stu: att.att_stu,
// // // // // //       status: att.status,
// // // // // //       note: att.note,
// // // // // //       is_selected: att.is_selected,
// // // // // //     },
// // // // // //     attachment_info: att.attachment
// // // // // //       ? {
// // // // // //           attachment_id: att.attachment.attachment_id,
// // // // // //           attachment_number: att.attachment.attachment_number,
// // // // // //           product_name: att.attachment.product_name,
// // // // // //           serial_number: att.attachment.serial_number,
// // // // // //           attachment_status: att.attachment.attachment_status,
// // // // // //         }
// // // // // //       : null,
// // // // // //   }));

// // // // // //   return {
// // // // // //     allocation_id: raw.allocation_id,
// // // // // //     allocation_date: raw.allocation_date,
// // // // // //     status: raw.status,
// // // // // //     service_option: raw.service_option,
// // // // // //     user_remarks: raw.user_remarks,
// // // // // //     salesOrder: raw.salesOrder,
// // // // // //     resources: {
// // // // // //       equipment: equipmentList,
// // // // // //       manpower: manpowerList,
// // // // // //       attachments: attachmentList,
// // // // // //       summary: {
// // // // // //         total_equipment: equipmentList.length,
// // // // // //         total_manpower: manpowerList.length,
// // // // // //         total_attachments: attachmentList.length,
// // // // // //         total_resources:
// // // // // //           equipmentList.length + manpowerList.length + attachmentList.length,
// // // // // //       },
// // // // // //     },
// // // // // //     scheduled_dates: scheduledDatesMap[raw.allocation_id] || null,
// // // // // //   };
// // // // // // };

// // // // // // /**
// // // // // //  * Fetch the earliest selected scheduled_date for a SO across all resource types.
// // // // // //  * This is the "order start date" as per the scenario.
// // // // // //  */
// // // // // // const fetchScheduledDateForSO = async (soId) => {
// // // // // //   const [eqSched, mpSched, attSched] = await Promise.all([
// // // // // //     EquipmentScheduledModel.findOne({
// // // // // //       where: { so_id: soId, is_selected: true },
// // // // // //       order: [["scheduled_date", "ASC"]],
// // // // // //       attributes: ["scheduled_date"],
// // // // // //     }),
// // // // // //     ManpowerScheduledModel.findOne({
// // // // // //       where: { so_id: soId, is_selected: true },
// // // // // //       order: [["scheduled_date", "ASC"]],
// // // // // //       attributes: ["scheduled_date"],
// // // // // //     }),
// // // // // //     AttachmentScheduledModel.findOne({
// // // // // //       where: { so_id: soId, is_selected: true },
// // // // // //       order: [["scheduled_date", "ASC"]],
// // // // // //       attributes: ["scheduled_date"],
// // // // // //     }),
// // // // // //   ]);

// // // // // //   const dates = [eqSched, mpSched, attSched]
// // // // // //     .map((r) => r?.scheduled_date)
// // // // // //     .filter(Boolean)
// // // // // //     .sort();

// // // // // //   return dates[0] || null;
// // // // // // };

// // // // // // /**
// // // // // //  * Checks if a Sales Order is within its active window on a given reference date.
// // // // // //  *   scheduled_date <= referenceDate <= lpo_end_date
// // // // // //  */
// // // // // // const isInActiveWindow = (salesOrder, scheduledDate, referenceDate) => {
// // // // // //   const lpoEndDate = getLpoEndDate(salesOrder);
// // // // // //   if (!scheduledDate || !lpoEndDate) return false;
// // // // // //   return scheduledDate <= referenceDate && lpoEndDate >= referenceDate;
// // // // // // };

// // // // // // // ─── Controller Functions ─────────────────────────────────────────────────────

// // // // // // /**
// // // // // //  * GET /api/operational-handling/shift-info
// // // // // //  */
// // // // // // const getShiftInfo = async (req, res) => {
// // // // // //   try {
// // // // // //     const info = getShiftContext();
// // // // // //     return res.status(200).json({
// // // // // //       serverTime: new Date().toISOString(),
// // // // // //       ...info,
// // // // // //       shiftWindows: {
// // // // // //         day: "06:00 – 17:59",
// // // // // //         night: "18:00 – 05:59 (next day)",
// // // // // //       },
// // // // // //     });
// // // // // //   } catch (error) {
// // // // // //     return res.status(500).json({ message: error.message });
// // // // // //   }
// // // // // // };

// // // // // // /**
// // // // // //  * GET /api/operational-handling/active-orders/current-shift
// // // // // //  *
// // // // // //  * Allocations belonging to the shift currently in progress.
// // // // // //  * Filters by: allocation_date == currentShiftDate AND SO shift matches current shift type.
// // // // // //  * Only includes orders with resources and within active date window.
// // // // // //  */
// // // // // // const getCurrentShiftOrders = async (req, res) => {
// // // // // //   try {
// // // // // //     const { page = 1, limit = 10 } = req.query;
// // // // // //     const { currentShiftType, currentShiftDate } = getShiftContext();

// // // // // //     const allocations = await ActiveAllocationModel.findAll({
// // // // // //       where: {
// // // // // //         allocation_date: currentShiftDate,
// // // // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // // // //       },
// // // // // //       include: buildIncludes(),
// // // // // //       order: [["createdAt", "ASC"]],
// // // // // //     });

// // // // // //     const result = [];

// // // // // //     for (const alloc of allocations) {
// // // // // //       const raw = alloc.toJSON();

// // // // // //       const hasResources =
// // // // // //         raw.equipmentAllocations.length > 0 ||
// // // // // //         raw.manpowerAllocations.length > 0 ||
// // // // // //         raw.attachmentAllocations.length > 0;

// // // // // //       if (!hasResources || !raw.salesOrder) continue;

// // // // // //       // SO shift must include current shift type
// // // // // //       const soShift = raw.salesOrder.shift || "";
// // // // // //       const matchesShift =
// // // // // //         soShift === currentShiftType ||
// // // // // //         soShift === "Full" ||
// // // // // //         soShift === "Day and Night";

// // // // // //       if (!matchesShift) continue;

// // // // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // // // //       if (!isInActiveWindow(raw.salesOrder, scheduledDate, currentShiftDate)) continue;

// // // // // //       result.push(
// // // // // //         formatAllocationResponse(alloc, {
// // // // // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // // // //         })
// // // // // //       );
// // // // // //     }

// // // // // //     const total = result.length;
// // // // // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // // // // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // // // // //     return res.status(200).json({
// // // // // //       shiftType: currentShiftType,
// // // // // //       shiftDate: currentShiftDate,
// // // // // //       totalOrders: total,
// // // // // //       currentPage: parseInt(page),
// // // // // //       totalPages: Math.ceil(total / parseInt(limit)),
// // // // // //       orders: paginated,
// // // // // //     });
// // // // // //   } catch (error) {
// // // // // //     console.error("Error fetching current shift orders:", error);
// // // // // //     return res.status(500).json({
// // // // // //       message: "Error fetching current shift orders",
// // // // // //       error: error.message,
// // // // // //     });
// // // // // //   }
// // // // // // };

// // // // // // /**
// // // // // //  * GET /api/operational-handling/active-orders/next-shift
// // // // // //  *
// // // // // //  * Allocations for the shift immediately following the current one.
// // // // // //  */
// // // // // // const getNextShiftOrders = async (req, res) => {
// // // // // //   try {
// // // // // //     const { page = 1, limit = 10 } = req.query;
// // // // // //     const { nextShiftType, nextShiftDate } = getShiftContext();

// // // // // //     const allocations = await ActiveAllocationModel.findAll({
// // // // // //       where: {
// // // // // //         allocation_date: nextShiftDate,
// // // // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // // // //       },
// // // // // //       include: buildIncludes(),
// // // // // //       order: [["createdAt", "ASC"]],
// // // // // //     });

// // // // // //     const result = [];

// // // // // //     for (const alloc of allocations) {
// // // // // //       const raw = alloc.toJSON();

// // // // // //       const hasResources =
// // // // // //         raw.equipmentAllocations.length > 0 ||
// // // // // //         raw.manpowerAllocations.length > 0 ||
// // // // // //         raw.attachmentAllocations.length > 0;

// // // // // //       if (!hasResources || !raw.salesOrder) continue;

// // // // // //       const soShift = raw.salesOrder.shift || "";
// // // // // //       const matchesShift =
// // // // // //         soShift === nextShiftType ||
// // // // // //         soShift === "Full" ||
// // // // // //         soShift === "Day and Night";

// // // // // //       if (!matchesShift) continue;

// // // // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // // // //       if (!isInActiveWindow(raw.salesOrder, scheduledDate, nextShiftDate)) continue;

// // // // // //       result.push(
// // // // // //         formatAllocationResponse(alloc, {
// // // // // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // // // //         })
// // // // // //       );
// // // // // //     }

// // // // // //     const total = result.length;
// // // // // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // // // // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // // // // //     return res.status(200).json({
// // // // // //       shiftType: nextShiftType,
// // // // // //       shiftDate: nextShiftDate,
// // // // // //       totalOrders: total,
// // // // // //       currentPage: parseInt(page),
// // // // // //       totalPages: Math.ceil(total / parseInt(limit)),
// // // // // //       orders: paginated,
// // // // // //     });
// // // // // //   } catch (error) {
// // // // // //     console.error("Error fetching next shift orders:", error);
// // // // // //     return res.status(500).json({
// // // // // //       message: "Error fetching next shift orders",
// // // // // //       error: error.message,
// // // // // //     });
// // // // // //   }
// // // // // // };

// // // // // // /**
// // // // // //  * GET /api/operational-handling/active-orders/future-orders
// // // // // //  *
// // // // // //  * Allocations scheduled AFTER the next shift window.
// // // // // //  * allocation_date > nextShiftDate
// // // // // //  */
// // // // // // const getFutureOrders = async (req, res) => {
// // // // // //   try {
// // // // // //     const { page = 1, limit = 10 } = req.query;
// // // // // //     const { nextShiftDate } = getShiftContext();

// // // // // //     const allocations = await ActiveAllocationModel.findAll({
// // // // // //       where: {
// // // // // //         allocation_date: { [Op.gt]: nextShiftDate },
// // // // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // // // //       },
// // // // // //       include: buildIncludes(),
// // // // // //       order: [["allocation_date", "ASC"]],
// // // // // //     });

// // // // // //     const result = [];

// // // // // //     for (const alloc of allocations) {
// // // // // //       const raw = alloc.toJSON();

// // // // // //       const hasResources =
// // // // // //         raw.equipmentAllocations.length > 0 ||
// // // // // //         raw.manpowerAllocations.length > 0 ||
// // // // // //         raw.attachmentAllocations.length > 0;

// // // // // //       if (!hasResources || !raw.salesOrder) continue;

// // // // // //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// // // // // //       if (!lpoEndDate || lpoEndDate < raw.allocation_date) continue;

// // // // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // // // //       result.push(
// // // // // //         formatAllocationResponse(alloc, {
// // // // // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // // // //         })
// // // // // //       );
// // // // // //     }

// // // // // //     const total = result.length;
// // // // // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // // // // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // // // // //     return res.status(200).json({
// // // // // //       totalOrders: total,
// // // // // //       currentPage: parseInt(page),
// // // // // //       totalPages: Math.ceil(total / parseInt(limit)),
// // // // // //       orders: paginated,
// // // // // //     });
// // // // // //   } catch (error) {
// // // // // //     console.error("Error fetching future orders:", error);
// // // // // //     return res.status(500).json({
// // // // // //       message: "Error fetching future orders",
// // // // // //       error: error.message,
// // // // // //     });
// // // // // //   }
// // // // // // };

// // // // // // /**
// // // // // //  * GET /api/operational-handling/active-orders
// // // // // //  *
// // // // // //  * All three groups in one combined response.
// // // // // //  */
// // // // // // const getAllActiveOrders = async (req, res) => {
// // // // // //   try {
// // // // // //     const { currentShiftType, currentShiftDate, nextShiftType, nextShiftDate } =
// // // // // //       getShiftContext();

// // // // // //     const allAllocations = await ActiveAllocationModel.findAll({
// // // // // //       where: {
// // // // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // // // //       },
// // // // // //       include: buildIncludes(),
// // // // // //       order: [["allocation_date", "ASC"]],
// // // // // //     });

// // // // // //     const currentShiftOrders = [];
// // // // // //     const nextShiftOrders = [];
// // // // // //     const futureOrdersList = [];

// // // // // //     for (const alloc of allAllocations) {
// // // // // //       const raw = alloc.toJSON();

// // // // // //       const hasResources =
// // // // // //         raw.equipmentAllocations.length > 0 ||
// // // // // //         raw.manpowerAllocations.length > 0 ||
// // // // // //         raw.attachmentAllocations.length > 0;

// // // // // //       if (!hasResources || !raw.salesOrder) continue;

// // // // // //       const soShift = raw.salesOrder.shift || "";
// // // // // //       const allocDate = raw.allocation_date;
// // // // // //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// // // // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // // // //       const formatted = formatAllocationResponse(alloc, {
// // // // // //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // // // //       });

// // // // // //       const matchesCurrentShift =
// // // // // //         soShift === currentShiftType || soShift === "Full" || soShift === "Day and Night";
// // // // // //       const matchesNextShift =
// // // // // //         soShift === nextShiftType || soShift === "Full" || soShift === "Day and Night";

// // // // // //       // Current Shift
// // // // // //       if (allocDate === currentShiftDate && matchesCurrentShift) {
// // // // // //         if (isInActiveWindow(raw.salesOrder, scheduledDate, currentShiftDate)) {
// // // // // //           currentShiftOrders.push(formatted);
// // // // // //         }
// // // // // //       }
// // // // // //       // Next Shift
// // // // // //       else if (allocDate === nextShiftDate && matchesNextShift) {
// // // // // //         if (isInActiveWindow(raw.salesOrder, scheduledDate, nextShiftDate)) {
// // // // // //           nextShiftOrders.push(formatted);
// // // // // //         }
// // // // // //       }
// // // // // //       // Future Orders
// // // // // //       else if (allocDate > nextShiftDate) {
// // // // // //         if (lpoEndDate && lpoEndDate >= allocDate) {
// // // // // //           futureOrdersList.push(formatted);
// // // // // //         }
// // // // // //       }
// // // // // //     }

// // // // // //     return res.status(200).json({
// // // // // //       currentShift: {
// // // // // //         shiftType: currentShiftType,
// // // // // //         shiftDate: currentShiftDate,
// // // // // //         totalOrders: currentShiftOrders.length,
// // // // // //         orders: currentShiftOrders,
// // // // // //       },
// // // // // //       nextShift: {
// // // // // //         shiftType: nextShiftType,
// // // // // //         shiftDate: nextShiftDate,
// // // // // //         totalOrders: nextShiftOrders.length,
// // // // // //         orders: nextShiftOrders,
// // // // // //       },
// // // // // //       futureOrders: {
// // // // // //         totalOrders: futureOrdersList.length,
// // // // // //         orders: futureOrdersList,
// // // // // //       },
// // // // // //     });
// // // // // //   } catch (error) {
// // // // // //     console.error("Error fetching all active orders:", error);
// // // // // //     return res.status(500).json({
// // // // // //       message: "Error fetching all active orders",
// // // // // //       error: error.message,
// // // // // //     });
// // // // // //   }
// // // // // // };

// // // // // // // ─── Completed Orders ─────────────────────────────────────────────────────────

// // // // // // /**
// // // // // //  * GET /api/operational-handling/completed-orders
// // // // // //  *
// // // // // //  * Allocations where status === "Completed".
// // // // // //  * Resources shown separately per allocation.
// // // // // //  */
// // // // // // const getCompletedOrders = async (req, res) => {
// // // // // //   try {
// // // // // //     const { page = 1, limit = 10, from_date, to_date } = req.query;
// // // // // //     const offset = (parseInt(page) - 1) * parseInt(limit);

// // // // // //     const dateFilter = {};
// // // // // //     if (from_date) dateFilter[Op.gte] = from_date;
// // // // // //     if (to_date) dateFilter[Op.lte] = to_date;

// // // // // //     const { count, rows } = await ActiveAllocationModel.findAndCountAll({
// // // // // //       where: {
// // // // // //         status: "Completed",
// // // // // //         ...(Object.keys(dateFilter).length > 0 && { allocation_date: dateFilter }),
// // // // // //       },
// // // // // //       include: buildIncludes(),
// // // // // //       offset,
// // // // // //       limit: parseInt(limit),
// // // // // //       order: [["allocation_date", "DESC"]],
// // // // // //       distinct: true,
// // // // // //     });

// // // // // //     const formatted = rows
// // // // // //       .filter(
// // // // // //         (alloc) =>
// // // // // //           (alloc.equipmentAllocations?.length || 0) > 0 ||
// // // // // //           (alloc.manpowerAllocations?.length || 0) > 0 ||
// // // // // //           (alloc.attachmentAllocations?.length || 0) > 0
// // // // // //       )
// // // // // //       .map((alloc) => formatAllocationResponse(alloc));

// // // // // //     return res.status(200).json({
// // // // // //       totalOrders: count,
// // // // // //       currentPage: parseInt(page),
// // // // // //       totalPages: Math.ceil(count / parseInt(limit)),
// // // // // //       orders: formatted,
// // // // // //     });
// // // // // //   } catch (error) {
// // // // // //     console.error("Error fetching completed orders:", error);
// // // // // //     return res.status(500).json({
// // // // // //       message: "Error fetching completed orders",
// // // // // //       error: error.message,
// // // // // //     });
// // // // // //   }
// // // // // // };

// // // // // // /**
// // // // // //  * GET /api/operational-handling/orders/:id
// // // // // //  * Single allocation by allocation_id.
// // // // // //  */
// // // // // // const getOrderById = async (req, res) => {
// // // // // //   try {
// // // // // //     const { id } = req.params;

// // // // // //     const alloc = await ActiveAllocationModel.findByPk(id, {
// // // // // //       include: buildIncludes(),
// // // // // //     });

// // // // // //     if (!alloc) {
// // // // // //       return res.status(404).json({ message: "Allocation record not found" });
// // // // // //     }

// // // // // //     const raw = alloc.toJSON();
// // // // // //     const scheduledDate = raw.salesOrder
// // // // // //       ? await fetchScheduledDateForSO(raw.salesOrder.id)
// // // // // //       : null;

// // // // // //     return res.status(200).json(
// // // // // //       formatAllocationResponse(alloc, {
// // // // // //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // // // //       })
// // // // // //     );
// // // // // //   } catch (error) {
// // // // // //     console.error("Error fetching order by ID:", error);
// // // // // //     return res.status(500).json({ message: "Error fetching order", error: error.message });
// // // // // //   }
// // // // // // };

// // // // // // /**
// // // // // //  * GET /api/operational-handling/orders/by-sales-order/:so_id
// // // // // //  * All allocations for a specific Sales Order.
// // // // // //  */
// // // // // // const getOrdersBySalesOrder = async (req, res) => {
// // // // // //   try {
// // // // // //     const { so_id } = req.params;

// // // // // //     const allocations = await ActiveAllocationModel.findAll({
// // // // // //       where: { sales_order_id: so_id },
// // // // // //       include: buildIncludes(),
// // // // // //       order: [["allocation_date", "ASC"]],
// // // // // //     });

// // // // // //     if (!allocations.length) {
// // // // // //       return res.status(404).json({
// // // // // //         message: "No allocations found for this sales order",
// // // // // //         orders: [],
// // // // // //       });
// // // // // //     }

// // // // // //     const scheduledDate = await fetchScheduledDateForSO(parseInt(so_id));

// // // // // //     const formatted = allocations.map((alloc) =>
// // // // // //       formatAllocationResponse(alloc, {
// // // // // //         [alloc.allocation_id]: { scheduled_date: scheduledDate },
// // // // // //       })
// // // // // //     );

// // // // // //     return res.status(200).json({
// // // // // //       so_id: parseInt(so_id),
// // // // // //       totalAllocations: formatted.length,
// // // // // //       orders: formatted,
// // // // // //     });
// // // // // //   } catch (error) {
// // // // // //     console.error("Error fetching orders by SO:", error);
// // // // // //     return res.status(500).json({
// // // // // //       message: "Error fetching orders by sales order",
// // // // // //       error: error.message,
// // // // // //     });
// // // // // //   }
// // // // // // };

// // // // // // module.exports = {
// // // // // //   getShiftInfo,
// // // // // //   getCurrentShiftOrders,
// // // // // //   getNextShiftOrders,
// // // // // //   getFutureOrders,
// // // // // //   getAllActiveOrders,
// // // // // //   getCompletedOrders,
// // // // // //   getOrderById,
// // // // // //   getOrdersBySalesOrder,
// // // // // // };

// // // // // /**
// // // // //  * Operational Handling Controller
// // // // //  *
// // // // //  * Uses existing allocation tables (no new tables needed):
// // // // //  *   - tbl_active_allocation_original  → ActiveAllocationModel
// // // // //  *   - tbl_allocation_equipment        → AllocationEquipmentModel
// // // // //  *   - tbl_allocation_manpower         → AllocationManpowerModel
// // // // //  *   - tbl_allocation_attachment       → AllocationAttachmentModel
// // // // //  *
// // // // //  * Active Order Criteria (from scenario):
// // // // //  *   - Order must have at least one resource allocated (equipment/manpower/attachment)
// // // // //  *   - scheduled_date (from EquipmentScheduledModel) = order start
// // // // //  *   - lpo_end_date   (lpo_validity_date or extended_lpo_validity_date) = order end
// // // // //  *   - current date must be between scheduled_date and lpo_end_date (inclusive)
// // // // //  *
// // // // //  * Shift Windows:
// // // // //  *   Day   Shift : 06:00 – 17:59
// // // // //  *   Night Shift : 18:00 – 05:59 (next calendar day)
// // // // //  *
// // // // //  * Each allocation's resources are returned SEPARATELY (equipment list, manpower
// // // // //  * list, attachment list) so the frontend can display them one-by-one.
// // // // //  *
// // // // //  * Completed Orders:
// // // // //  *   - allocation.status === "Completed"  (tbl_active_allocation_original.status)
// // // // //  */

// // // // // const { Op } = require("sequelize");
// // // // // const {
// // // // //   ActiveAllocationModel,
// // // // //   AllocationEquipmentModel,
// // // // //   AllocationManpowerModel,
// // // // //   AllocationAttachmentModel,
// // // // // } = require("../../models/fleet-management/ActiveAllocationsOriginalModel");
// // // // // const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// // // // // const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// // // // // const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
// // // // // const EmployeeModel = require("../../models/hr/employees/EmployeeModel");
// // // // // const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
// // // // // const JobLocationModel = require("../../models/fleet-management/JobLocationModel");
// // // // // const EquipmentScheduledModel = require("../../models/fleet-management/EquipmentScheduledModel");
// // // // // const ManpowerScheduledModel = require("../../models/fleet-management/ManpowerScheduledModel");
// // // // // const AttachmentScheduledModel = require("../../models/fleet-management/AttachmentScheduledModel");
// // // // // const OperatorTypeModel = require("../../models/fleet-management/OperatorTypeModel");

// // // // // // ─── Shift Helpers ────────────────────────────────────────────────────────────

// // // // // /** Format Date → "YYYY-MM-DD" */
// // // // // const toDateStr = (d) => d.toISOString().split("T")[0];

// // // // // /**
// // // // //  * Returns current shift context based on server time.
// // // // //  * Day  Shift: 06:00–17:59
// // // // //  * Night Shift: 18:00–05:59
// // // // //  */
// // // // // const getShiftContext = () => {
// // // // //   const now = new Date();
// // // // //   const hours = now.getHours();
// // // // //   const isDay = hours >= 6 && hours <= 17;

// // // // //   const today = toDateStr(now);
// // // // //   const tomorrow = toDateStr(
// // // // //     new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
// // // // //   );

// // // // //   if (isDay) {
// // // // //     return {
// // // // //       currentShiftType: "Day",
// // // // //       currentShiftDate: today,
// // // // //       nextShiftType: "Night",
// // // // //       nextShiftDate: today,     // Night shift starts same calendar day at 18:00
// // // // //       futureAfterDate: today,
// // // // //     };
// // // // //   } else {
// // // // //     return {
// // // // //       currentShiftType: "Night",
// // // // //       currentShiftDate: today,
// // // // //       nextShiftType: "Day",
// // // // //       nextShiftDate: tomorrow,  // Next Day shift = tomorrow
// // // // //       futureAfterDate: tomorrow,
// // // // //     };
// // // // //   }
// // // // // };

// // // // // /** Get effective LPO end date for a Sales Order */
// // // // // const getLpoEndDate = (so) =>
// // // // //   so.extended_lpo_validity_date || so.lpo_validity_date || null;

// // // // // // ─── Include Builder ──────────────────────────────────────────────────────────

// // // // // /**
// // // // //  * Builds Sequelize includes.
// // // // //  * Returns salesOrder + all three resource types in separate associations.
// // // // //  */
// // // // // const buildIncludes = () => [
// // // // //   {
// // // // //     model: SalesOrdersModel,
// // // // //     as: "salesOrder",
// // // // //     attributes: [
// // // // //       "id",
// // // // //       "so_number",
// // // // //       "client",
// // // // //       "project_name",
// // // // //       "delivery_address",
// // // // //       "shift",
// // // // //       "lpo_number",
// // // // //       "lpo_validity_date",
// // // // //       "extended_lpo_validity_date",
// // // // //       "expected_mobilization_date",
// // // // //       "expected_demobilization_date",
// // // // //       "ops_status",
// // // // //       "so_status",
// // // // //     ],
// // // // //     include: [
// // // // //       {
// // // // //         model: JobLocationModel,
// // // // //         as: "jobLocation",
// // // // //         attributes: ["job_location_id", "job_location_name"],
// // // // //       },
// // // // //     ],
// // // // //   },
// // // // //   // ── Equipment ──
// // // // //   {
// // // // //     model: AllocationEquipmentModel,
// // // // //     as: "equipmentAllocations",
// // // // //     include: [
// // // // //       {
// // // // //         model: EquipmentModel,
// // // // //         as: "equipment",
// // // // //         attributes: [
// // // // //           "serial_number",
// // // // //           "reg_number",
// // // // //           "vehicle_type",
// // // // //           "equipment_status",
// // // // //           "equipment_status_note",
// // // // //         ],
// // // // //       },
// // // // //     ],
// // // // //   },
// // // // //   // ── Manpower ──
// // // // //   {
// // // // //     model: AllocationManpowerModel,
// // // // //     as: "manpowerAllocations",
// // // // //     include: [
// // // // //       {
// // // // //         model: EmployeeModel,
// // // // //         as: "employee",
// // // // //         attributes: ["id", "personalDetails"],
// // // // //         include: [
// // // // //           {
// // // // //             // Alias must match ManpowerModel association: as: "manpower"
// // // // //             model: ManpowerModel,
// // // // //             as: "manpower",
// // // // //             attributes: ["employeeNo", "manpower_status", "operator_type_id"],
// // // // //             include: [
// // // // //               {
// // // // //                 model: OperatorTypeModel,
// // // // //                 as: "operator_type",
// // // // //                 attributes: ["operator_type_id", "operator_type"],
// // // // //               },
// // // // //             ],
// // // // //           },
// // // // //         ],
// // // // //       },
// // // // //     ],
// // // // //   },
// // // // //   // ── Attachments ──
// // // // //   {
// // // // //     model: AllocationAttachmentModel,
// // // // //     as: "attachmentAllocations",
// // // // //     include: [
// // // // //       {
// // // // //         model: AttachmentModel,
// // // // //         as: "attachment",
// // // // //         attributes: [
// // // // //           "attachment_id",
// // // // //           "attachment_number",
// // // // //           "product_name",
// // // // //           "serial_number",
// // // // //           "attachment_status",
// // // // //         ],
// // // // //       },
// // // // //     ],
// // // // //   },
// // // // // ];

// // // // // // ─── Response Formatter ───────────────────────────────────────────────────────

// // // // // /**
// // // // //  * Formats one ActiveAllocation record into the Operational Handling response.
// // // // //  *
// // // // //  * Resources are exposed SEPARATELY so the frontend can render each one
// // // // //  * individually (one-by-one) under Equipment / Manpower / Attachments sections.
// // // // //  *
// // // // //  * Output shape:
// // // // //  * {
// // // // //  *   allocation_id, allocation_date, status, service_option, user_remarks,
// // // // //  *   salesOrder: { ...fields, jobLocation },
// // // // //  *   resources: {
// // // // //  *     equipment:    [ { resource_type, allocation_detail, equipment_info } ],
// // // // //  *     manpower:     [ { resource_type, allocation_detail, employee_info } ],
// // // // //  *     attachments:  [ { resource_type, allocation_detail, attachment_info } ],
// // // // //  *     summary: { total_equipment, total_manpower, total_attachments, total_resources }
// // // // //  *   },
// // // // //  *   scheduled_dates: { scheduled_date } | null
// // // // //  * }
// // // // //  */
// // // // // const formatAllocationResponse = (allocation, scheduledDatesMap = {}) => {
// // // // //   const raw = allocation.toJSON ? allocation.toJSON() : allocation;

// // // // //   // ── Equipment list — one entry per allocated equipment ──
// // // // //   const equipmentList = (raw.equipmentAllocations || []).map((eq) => ({
// // // // //     resource_type: "equipment",
// // // // //     allocation_detail: {
// // // // //       id: eq.id,
// // // // //       allocation_id: eq.allocation_id,
// // // // //       serial_number: eq.serial_number,
// // // // //       eqt_stu: eq.eqt_stu,
// // // // //       status: eq.status,
// // // // //       note: eq.note,
// // // // //       is_selected: eq.is_selected,
// // // // //     },
// // // // //     equipment_info: eq.equipment
// // // // //       ? {
// // // // //           serial_number: eq.equipment.serial_number,
// // // // //           reg_number: eq.equipment.reg_number,
// // // // //           vehicle_type: eq.equipment.vehicle_type,
// // // // //           equipment_status: eq.equipment.equipment_status,
// // // // //           equipment_status_note: eq.equipment.equipment_status_note,
// // // // //         }
// // // // //       : null,
// // // // //   }));

// // // // //   // ── Manpower list — one entry per allocated employee ──
// // // // //   const manpowerList = (raw.manpowerAllocations || []).map((mp) => ({
// // // // //     resource_type: "manpower",
// // // // //     allocation_detail: {
// // // // //       id: mp.id,
// // // // //       allocation_id: mp.allocation_id,
// // // // //       employee_id: mp.employee_id,
// // // // //       man_stu: mp.man_stu,
// // // // //       status: mp.status,
// // // // //       note: mp.note,
// // // // //       is_selected: mp.is_selected,
// // // // //     },
// // // // //     employee_info: mp.employee
// // // // //       ? {
// // // // //           id: mp.employee.id,
// // // // //           full_name: mp.employee.personalDetails?.fullNameEnglish || null,
// // // // //           employee_no: mp.employee.manpower?.[0]?.employeeNo || null,
// // // // //           manpower_status: mp.employee.manpower?.[0]?.manpower_status || null,
// // // // //           operator_type: mp.employee.manpower?.[0]?.operator_type?.operator_type || null,
// // // // //         }
// // // // //       : null,
// // // // //   }));

// // // // //   // ── Attachment list — one entry per allocated attachment ──
// // // // //   const attachmentList = (raw.attachmentAllocations || []).map((att) => ({
// // // // //     resource_type: "attachment",
// // // // //     allocation_detail: {
// // // // //       id: att.id,
// // // // //       allocation_id: att.allocation_id,
// // // // //       attachment_id: att.attachment_id,
// // // // //       att_stu: att.att_stu,
// // // // //       status: att.status,
// // // // //       note: att.note,
// // // // //       is_selected: att.is_selected,
// // // // //     },
// // // // //     attachment_info: att.attachment
// // // // //       ? {
// // // // //           attachment_id: att.attachment.attachment_id,
// // // // //           attachment_number: att.attachment.attachment_number,
// // // // //           product_name: att.attachment.product_name,
// // // // //           serial_number: att.attachment.serial_number,
// // // // //           attachment_status: att.attachment.attachment_status,
// // // // //         }
// // // // //       : null,
// // // // //   }));

// // // // //   return {
// // // // //     allocation_id: raw.allocation_id,
// // // // //     allocation_date: raw.allocation_date,
// // // // //     status: raw.status,
// // // // //     service_option: raw.service_option,
// // // // //     user_remarks: raw.user_remarks,
// // // // //     salesOrder: raw.salesOrder,
// // // // //     resources: {
// // // // //       equipment: equipmentList,
// // // // //       manpower: manpowerList,
// // // // //       attachments: attachmentList,
// // // // //       summary: {
// // // // //         total_equipment: equipmentList.length,
// // // // //         total_manpower: manpowerList.length,
// // // // //         total_attachments: attachmentList.length,
// // // // //         total_resources:
// // // // //           equipmentList.length + manpowerList.length + attachmentList.length,
// // // // //       },
// // // // //     },
// // // // //     scheduled_dates: scheduledDatesMap[raw.allocation_id] || null,
// // // // //   };
// // // // // };

// // // // // /**
// // // // //  * Fetch the earliest selected scheduled_date for a SO across all resource types.
// // // // //  * This is the "order start date" as per the scenario.
// // // // //  */
// // // // // const fetchScheduledDateForSO = async (soId) => {
// // // // //   const [eqSched, mpSched, attSched] = await Promise.all([
// // // // //     EquipmentScheduledModel.findOne({
// // // // //       where: { so_id: soId, is_selected: true },
// // // // //       order: [["scheduled_date", "ASC"]],
// // // // //       attributes: ["scheduled_date"],
// // // // //     }),
// // // // //     ManpowerScheduledModel.findOne({
// // // // //       where: { so_id: soId, is_selected: true },
// // // // //       order: [["scheduled_date", "ASC"]],
// // // // //       attributes: ["scheduled_date"],
// // // // //     }),
// // // // //     AttachmentScheduledModel.findOne({
// // // // //       where: { so_id: soId, is_selected: true },
// // // // //       order: [["scheduled_date", "ASC"]],
// // // // //       attributes: ["scheduled_date"],
// // // // //     }),
// // // // //   ]);

// // // // //   const dates = [eqSched, mpSched, attSched]
// // // // //     .map((r) => r?.scheduled_date)
// // // // //     .filter(Boolean)
// // // // //     .sort();

// // // // //   return dates[0] || null;
// // // // // };

// // // // // /**
// // // // //  * Checks if a Sales Order is within its active window on a given reference date.
// // // // //  *   scheduled_date <= referenceDate <= lpo_end_date
// // // // //  */
// // // // // const isInActiveWindow = (salesOrder, scheduledDate, referenceDate) => {
// // // // //   const lpoEndDate = getLpoEndDate(salesOrder);
// // // // //   if (!scheduledDate || !lpoEndDate) return false;
// // // // //   return scheduledDate <= referenceDate && lpoEndDate >= referenceDate;
// // // // // };

// // // // // // ─── Controller Functions ─────────────────────────────────────────────────────

// // // // // /**
// // // // //  * GET /api/operational-handling/shift-info
// // // // //  */
// // // // // const getShiftInfo = async (req, res) => {
// // // // //   try {
// // // // //     const info = getShiftContext();
// // // // //     return res.status(200).json({
// // // // //       serverTime: new Date().toISOString(),
// // // // //       ...info,
// // // // //       shiftWindows: {
// // // // //         day: "06:00 – 17:59",
// // // // //         night: "18:00 – 05:59 (next day)",
// // // // //       },
// // // // //     });
// // // // //   } catch (error) {
// // // // //     return res.status(500).json({ message: error.message });
// // // // //   }
// // // // // };

// // // // // /**
// // // // //  * GET /api/operational-handling/active-orders/current-shift
// // // // //  *
// // // // //  * Allocations belonging to the shift currently in progress.
// // // // //  * Filters by: allocation_date == currentShiftDate AND SO shift matches current shift type.
// // // // //  * Only includes orders with resources and within active date window.
// // // // //  */
// // // // // const getCurrentShiftOrders = async (req, res) => {
// // // // //   try {
// // // // //     const { page = 1, limit = 10 } = req.query;
// // // // //     const { currentShiftType, currentShiftDate } = getShiftContext();

// // // // //     const allocations = await ActiveAllocationModel.findAll({
// // // // //       where: {
// // // // //         allocation_date: currentShiftDate,
// // // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // // //       },
// // // // //       include: buildIncludes(),
// // // // //       order: [["createdAt", "ASC"]],
// // // // //     });

// // // // //     const result = [];

// // // // //     for (const alloc of allocations) {
// // // // //       const raw = alloc.toJSON();

// // // // //       const hasResources =
// // // // //         raw.equipmentAllocations.length > 0 ||
// // // // //         raw.manpowerAllocations.length > 0 ||
// // // // //         raw.attachmentAllocations.length > 0;

// // // // //       if (!hasResources || !raw.salesOrder) continue;

// // // // //       // SO shift must include current shift type
// // // // //       const soShift = raw.salesOrder.shift || "";
// // // // //       const matchesShift =
// // // // //         soShift === currentShiftType ||
// // // // //         soShift === "Full" ||
// // // // //         soShift === "Day and Night";

// // // // //       if (!matchesShift) continue;

// // // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // // //       if (!isInActiveWindow(raw.salesOrder, scheduledDate, currentShiftDate)) continue;

// // // // //       result.push(
// // // // //         formatAllocationResponse(alloc, {
// // // // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // // //         })
// // // // //       );
// // // // //     }

// // // // //     const total = result.length;
// // // // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // // // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // // // //     return res.status(200).json({
// // // // //       shiftType: currentShiftType,
// // // // //       shiftDate: currentShiftDate,
// // // // //       totalOrders: total,
// // // // //       currentPage: parseInt(page),
// // // // //       totalPages: Math.ceil(total / parseInt(limit)),
// // // // //       orders: paginated,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error("Error fetching current shift orders:", error);
// // // // //     return res.status(500).json({
// // // // //       message: "Error fetching current shift orders",
// // // // //       error: error.message,
// // // // //     });
// // // // //   }
// // // // // };

// // // // // /**
// // // // //  * GET /api/operational-handling/active-orders/next-shift
// // // // //  *
// // // // //  * Allocations for the shift immediately following the current one.
// // // // //  */
// // // // // const getNextShiftOrders = async (req, res) => {
// // // // //   try {
// // // // //     const { page = 1, limit = 10 } = req.query;
// // // // //     const { nextShiftType, nextShiftDate } = getShiftContext();

// // // // //     const allocations = await ActiveAllocationModel.findAll({
// // // // //       where: {
// // // // //         allocation_date: nextShiftDate,
// // // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // // //       },
// // // // //       include: buildIncludes(),
// // // // //       order: [["createdAt", "ASC"]],
// // // // //     });

// // // // //     const result = [];

// // // // //     for (const alloc of allocations) {
// // // // //       const raw = alloc.toJSON();

// // // // //       const hasResources =
// // // // //         raw.equipmentAllocations.length > 0 ||
// // // // //         raw.manpowerAllocations.length > 0 ||
// // // // //         raw.attachmentAllocations.length > 0;

// // // // //       if (!hasResources || !raw.salesOrder) continue;

// // // // //       const soShift = raw.salesOrder.shift || "";
// // // // //       const matchesShift =
// // // // //         soShift === nextShiftType ||
// // // // //         soShift === "Full" ||
// // // // //         soShift === "Day and Night";

// // // // //       if (!matchesShift) continue;

// // // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // // //       if (!isInActiveWindow(raw.salesOrder, scheduledDate, nextShiftDate)) continue;

// // // // //       result.push(
// // // // //         formatAllocationResponse(alloc, {
// // // // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // // //         })
// // // // //       );
// // // // //     }

// // // // //     const total = result.length;
// // // // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // // // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // // // //     return res.status(200).json({
// // // // //       shiftType: nextShiftType,
// // // // //       shiftDate: nextShiftDate,
// // // // //       totalOrders: total,
// // // // //       currentPage: parseInt(page),
// // // // //       totalPages: Math.ceil(total / parseInt(limit)),
// // // // //       orders: paginated,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error("Error fetching next shift orders:", error);
// // // // //     return res.status(500).json({
// // // // //       message: "Error fetching next shift orders",
// // // // //       error: error.message,
// // // // //     });
// // // // //   }
// // // // // };

// // // // // /**
// // // // //  * GET /api/operational-handling/active-orders/future-orders
// // // // //  *
// // // // //  * Allocations scheduled AFTER the next shift window.
// // // // //  * allocation_date > nextShiftDate
// // // // //  */
// // // // // const getFutureOrders = async (req, res) => {
// // // // //   try {
// // // // //     const { page = 1, limit = 10 } = req.query;
// // // // //     const { nextShiftDate } = getShiftContext();

// // // // //     const allocations = await ActiveAllocationModel.findAll({
// // // // //       where: {
// // // // //         allocation_date: { [Op.gt]: nextShiftDate },
// // // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // // //       },
// // // // //       include: buildIncludes(),
// // // // //       order: [["allocation_date", "ASC"]],
// // // // //     });

// // // // //     const result = [];

// // // // //     for (const alloc of allocations) {
// // // // //       const raw = alloc.toJSON();

// // // // //       const hasResources =
// // // // //         raw.equipmentAllocations.length > 0 ||
// // // // //         raw.manpowerAllocations.length > 0 ||
// // // // //         raw.attachmentAllocations.length > 0;

// // // // //       if (!hasResources || !raw.salesOrder) continue;

// // // // //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// // // // //       if (!lpoEndDate || lpoEndDate < raw.allocation_date) continue;

// // // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // // //       result.push(
// // // // //         formatAllocationResponse(alloc, {
// // // // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // // //         })
// // // // //       );
// // // // //     }

// // // // //     const total = result.length;
// // // // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // // // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // // // //     return res.status(200).json({
// // // // //       totalOrders: total,
// // // // //       currentPage: parseInt(page),
// // // // //       totalPages: Math.ceil(total / parseInt(limit)),
// // // // //       orders: paginated,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error("Error fetching future orders:", error);
// // // // //     return res.status(500).json({
// // // // //       message: "Error fetching future orders",
// // // // //       error: error.message,
// // // // //     });
// // // // //   }
// // // // // };

// // // // // /**
// // // // //  * GET /api/operational-handling/active-orders
// // // // //  *
// // // // //  * All three groups in one combined response.
// // // // //  */
// // // // // const getAllActiveOrders = async (req, res) => {
// // // // //   try {
// // // // //     const { currentShiftType, currentShiftDate, nextShiftType, nextShiftDate } =
// // // // //       getShiftContext();

// // // // //     const allAllocations = await ActiveAllocationModel.findAll({
// // // // //       where: {
// // // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // // //       },
// // // // //       include: buildIncludes(),
// // // // //       order: [["allocation_date", "ASC"]],
// // // // //     });

// // // // //     const currentShiftOrders = [];
// // // // //     const nextShiftOrders = [];
// // // // //     const futureOrdersList = [];

// // // // //     for (const alloc of allAllocations) {
// // // // //       const raw = alloc.toJSON();

// // // // //       const hasResources =
// // // // //         raw.equipmentAllocations.length > 0 ||
// // // // //         raw.manpowerAllocations.length > 0 ||
// // // // //         raw.attachmentAllocations.length > 0;

// // // // //       if (!hasResources || !raw.salesOrder) continue;

// // // // //       const soShift = raw.salesOrder.shift || "";
// // // // //       const allocDate = raw.allocation_date;
// // // // //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// // // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // // //       const formatted = formatAllocationResponse(alloc, {
// // // // //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // // //       });

// // // // //       const matchesCurrentShift =
// // // // //         soShift === currentShiftType || soShift === "Full" || soShift === "Day and Night";
// // // // //       const matchesNextShift =
// // // // //         soShift === nextShiftType || soShift === "Full" || soShift === "Day and Night";

// // // // //       // Current Shift
// // // // //       if (allocDate === currentShiftDate && matchesCurrentShift) {
// // // // //         if (isInActiveWindow(raw.salesOrder, scheduledDate, currentShiftDate)) {
// // // // //           currentShiftOrders.push(formatted);
// // // // //         }
// // // // //       }
// // // // //       // Next Shift
// // // // //       else if (allocDate === nextShiftDate && matchesNextShift) {
// // // // //         if (isInActiveWindow(raw.salesOrder, scheduledDate, nextShiftDate)) {
// // // // //           nextShiftOrders.push(formatted);
// // // // //         }
// // // // //       }
// // // // //       // Future Orders
// // // // //       else if (allocDate > nextShiftDate) {
// // // // //         if (lpoEndDate && lpoEndDate >= allocDate) {
// // // // //           futureOrdersList.push(formatted);
// // // // //         }
// // // // //       }
// // // // //     }

// // // // //     return res.status(200).json({
// // // // //       currentShift: {
// // // // //         shiftType: currentShiftType,
// // // // //         shiftDate: currentShiftDate,
// // // // //         totalOrders: currentShiftOrders.length,
// // // // //         orders: currentShiftOrders,
// // // // //       },
// // // // //       nextShift: {
// // // // //         shiftType: nextShiftType,
// // // // //         shiftDate: nextShiftDate,
// // // // //         totalOrders: nextShiftOrders.length,
// // // // //         orders: nextShiftOrders,
// // // // //       },
// // // // //       futureOrders: {
// // // // //         totalOrders: futureOrdersList.length,
// // // // //         orders: futureOrdersList,
// // // // //       },
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error("Error fetching all active orders:", error);
// // // // //     return res.status(500).json({
// // // // //       message: "Error fetching all active orders",
// // // // //       error: error.message,
// // // // //     });
// // // // //   }
// // // // // };

// // // // // // ─── Completed Orders ─────────────────────────────────────────────────────────

// // // // // /**
// // // // //  * GET /api/operational-handling/completed-orders
// // // // //  *
// // // // //  * Allocations where status === "Completed".
// // // // //  * Resources shown separately per allocation.
// // // // //  */
// // // // // const getCompletedOrders = async (req, res) => {
// // // // //   try {
// // // // //     const { page = 1, limit = 10, from_date, to_date } = req.query;
// // // // //     const offset = (parseInt(page) - 1) * parseInt(limit);

// // // // //     const dateFilter = {};
// // // // //     if (from_date) dateFilter[Op.gte] = from_date;
// // // // //     if (to_date) dateFilter[Op.lte] = to_date;

// // // // //     const { count, rows } = await ActiveAllocationModel.findAndCountAll({
// // // // //       where: {
// // // // //         status: "Completed",
// // // // //         ...(Object.keys(dateFilter).length > 0 && { allocation_date: dateFilter }),
// // // // //       },
// // // // //       include: buildIncludes(),
// // // // //       offset,
// // // // //       limit: parseInt(limit),
// // // // //       order: [["allocation_date", "DESC"]],
// // // // //       distinct: true,
// // // // //     });

// // // // //     const formatted = rows
// // // // //       .filter(
// // // // //         (alloc) =>
// // // // //           (alloc.equipmentAllocations?.length || 0) > 0 ||
// // // // //           (alloc.manpowerAllocations?.length || 0) > 0 ||
// // // // //           (alloc.attachmentAllocations?.length || 0) > 0
// // // // //       )
// // // // //       .map((alloc) => formatAllocationResponse(alloc));

// // // // //     return res.status(200).json({
// // // // //       totalOrders: count,
// // // // //       currentPage: parseInt(page),
// // // // //       totalPages: Math.ceil(count / parseInt(limit)),
// // // // //       orders: formatted,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error("Error fetching completed orders:", error);
// // // // //     return res.status(500).json({
// // // // //       message: "Error fetching completed orders",
// // // // //       error: error.message,
// // // // //     });
// // // // //   }
// // // // // };

// // // // // /**
// // // // //  * GET /api/operational-handling/orders/:id
// // // // //  * Single allocation by allocation_id.
// // // // //  */
// // // // // const getOrderById = async (req, res) => {
// // // // //   try {
// // // // //     const { id } = req.params;

// // // // //     const alloc = await ActiveAllocationModel.findByPk(id, {
// // // // //       include: buildIncludes(),
// // // // //     });

// // // // //     if (!alloc) {
// // // // //       return res.status(404).json({ message: "Allocation record not found" });
// // // // //     }

// // // // //     const raw = alloc.toJSON();
// // // // //     const scheduledDate = raw.salesOrder
// // // // //       ? await fetchScheduledDateForSO(raw.salesOrder.id)
// // // // //       : null;

// // // // //     return res.status(200).json(
// // // // //       formatAllocationResponse(alloc, {
// // // // //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // // //       })
// // // // //     );
// // // // //   } catch (error) {
// // // // //     console.error("Error fetching order by ID:", error);
// // // // //     return res.status(500).json({ message: "Error fetching order", error: error.message });
// // // // //   }
// // // // // };

// // // // // /**
// // // // //  * GET /api/operational-handling/orders/by-sales-order/:so_id
// // // // //  * All allocations for a specific Sales Order.
// // // // //  */
// // // // // const getOrdersBySalesOrder = async (req, res) => {
// // // // //   try {
// // // // //     const { so_id } = req.params;

// // // // //     const allocations = await ActiveAllocationModel.findAll({
// // // // //       where: { sales_order_id: so_id },
// // // // //       include: buildIncludes(),
// // // // //       order: [["allocation_date", "ASC"]],
// // // // //     });

// // // // //     if (!allocations.length) {
// // // // //       return res.status(404).json({
// // // // //         message: "No allocations found for this sales order",
// // // // //         orders: [],
// // // // //       });
// // // // //     }

// // // // //     const scheduledDate = await fetchScheduledDateForSO(parseInt(so_id));

// // // // //     const formatted = allocations.map((alloc) =>
// // // // //       formatAllocationResponse(alloc, {
// // // // //         [alloc.allocation_id]: { scheduled_date: scheduledDate },
// // // // //       })
// // // // //     );

// // // // //     return res.status(200).json({
// // // // //       so_id: parseInt(so_id),
// // // // //       totalAllocations: formatted.length,
// // // // //       orders: formatted,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     console.error("Error fetching orders by SO:", error);
// // // // //     return res.status(500).json({
// // // // //       message: "Error fetching orders by sales order",
// // // // //       error: error.message,
// // // // //     });
// // // // //   }
// // // // // };

// // // // // module.exports = {
// // // // //   getShiftInfo,
// // // // //   getCurrentShiftOrders,
// // // // //   getNextShiftOrders,
// // // // //   getFutureOrders,
// // // // //   getAllActiveOrders,
// // // // //   getCompletedOrders,
// // // // //   getOrderById,
// // // // //   getOrdersBySalesOrder,
// // // // // };

// // // // /**
// // // //  * Operational Handling Controller
// // // //  *
// // // //  * Uses existing allocation tables (no new tables needed):
// // // //  *   - tbl_active_allocation_original  → ActiveAllocationModel
// // // //  *   - tbl_allocation_equipment        → AllocationEquipmentModel
// // // //  *   - tbl_allocation_manpower         → AllocationManpowerModel
// // // //  *   - tbl_allocation_attachment       → AllocationAttachmentModel
// // // //  *
// // // //  * Active Order Criteria (from scenario):
// // // //  *   - Order must have at least one resource allocated (equipment/manpower/attachment)
// // // //  *   - scheduled_date (from EquipmentScheduledModel) = order start
// // // //  *   - lpo_end_date   (lpo_validity_date or extended_lpo_validity_date) = order end
// // // //  *   - current date must be between scheduled_date and lpo_end_date (inclusive)
// // // //  *
// // // //  * Shift Windows:
// // // //  *   Day   Shift : 06:00 – 17:59
// // // //  *   Night Shift : 18:00 – 05:59 (next calendar day)
// // // //  *
// // // //  * Each allocation's resources are returned SEPARATELY (equipment list, manpower
// // // //  * list, attachment list) so the frontend can display them one-by-one.
// // // //  *
// // // //  * Completed Orders:
// // // //  *   - allocation.status === "Completed"  (tbl_active_allocation_original.status)
// // // //  */

// // // // const { Op } = require("sequelize");
// // // // const {
// // // //   ActiveAllocationModel,
// // // //   AllocationEquipmentModel,
// // // //   AllocationManpowerModel,
// // // //   AllocationAttachmentModel,
// // // // } = require("../../models/fleet-management/ActiveAllocationsOriginalModel");
// // // // const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// // // // const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// // // // const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
// // // // const EmployeeModel = require("../../models/hr/employees/EmployeeModel");
// // // // const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
// // // // const JobLocationModel = require("../../models/fleet-management/JobLocationModel");
// // // // const EquipmentScheduledModel = require("../../models/fleet-management/EquipmentScheduledModel");
// // // // const ManpowerScheduledModel = require("../../models/fleet-management/ManpowerScheduledModel");
// // // // const AttachmentScheduledModel = require("../../models/fleet-management/AttachmentScheduledModel");
// // // // const OperatorTypeModel = require("../../models/fleet-management/OperatorTypeModel");

// // // // // ─── Shift Helpers ────────────────────────────────────────────────────────────

// // // // /** Format Date → "YYYY-MM-DD" */
// // // // const toDateStr = (d) => d.toISOString().split("T")[0];

// // // // /**
// // // //  * Returns current shift context based on server time.
// // // //  * Day  Shift: 06:00–17:59
// // // //  * Night Shift: 18:00–05:59
// // // //  */
// // // // const getShiftContext = () => {
// // // //   const now = new Date();
// // // //   const hours = now.getHours();
// // // //   const isDay = hours >= 6 && hours <= 17;

// // // //   const today = toDateStr(now);
// // // //   const tomorrow = toDateStr(
// // // //     new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
// // // //   );

// // // //   if (isDay) {
// // // //     return {
// // // //       currentShiftType: "Day",
// // // //       currentShiftDate: today,
// // // //       nextShiftType: "Night",
// // // //       nextShiftDate: today,     // Night shift starts same calendar day at 18:00
// // // //       futureAfterDate: today,
// // // //     };
// // // //   } else {
// // // //     return {
// // // //       currentShiftType: "Night",
// // // //       currentShiftDate: today,
// // // //       nextShiftType: "Day",
// // // //       nextShiftDate: tomorrow,  // Next Day shift = tomorrow
// // // //       futureAfterDate: tomorrow,
// // // //     };
// // // //   }
// // // // };

// // // // /** Get effective LPO end date for a Sales Order */
// // // // const getLpoEndDate = (so) =>
// // // //   so.extended_lpo_validity_date || so.lpo_validity_date || null;

// // // // // ─── Include Builder ──────────────────────────────────────────────────────────

// // // // /**
// // // //  * Builds Sequelize includes.
// // // //  * Returns salesOrder + all three resource types in separate associations.
// // // //  */
// // // // const buildIncludes = () => [
// // // //   {
// // // //     model: SalesOrdersModel,
// // // //     as: "salesOrder",
// // // //     attributes: [
// // // //       "id",
// // // //       "so_number",
// // // //       "client",
// // // //       "project_name",
// // // //       "delivery_address",
// // // //       "shift",
// // // //       "lpo_number",
// // // //       "lpo_validity_date",
// // // //       "extended_lpo_validity_date",
// // // //       "expected_mobilization_date",
// // // //       "expected_demobilization_date",
// // // //       "ops_status",
// // // //       "so_status",
// // // //     ],
// // // //     include: [
// // // //       {
// // // //         model: JobLocationModel,
// // // //         as: "jobLocation",
// // // //         attributes: ["job_location_id", "job_location_name"],
// // // //       },
// // // //     ],
// // // //   },
// // // //   // ── Equipment ──
// // // //   {
// // // //     model: AllocationEquipmentModel,
// // // //     as: "equipmentAllocations",
// // // //     include: [
// // // //       {
// // // //         model: EquipmentModel,
// // // //         as: "equipment",
// // // //         attributes: [
// // // //           "serial_number",
// // // //           "reg_number",
// // // //           "vehicle_type",
// // // //           "equipment_status",
// // // //           "equipment_status_note",
// // // //         ],
// // // //       },
// // // //     ],
// // // //   },
// // // //   // ── Manpower ──
// // // //   {
// // // //     model: AllocationManpowerModel,
// // // //     as: "manpowerAllocations",
// // // //     include: [
// // // //       {
// // // //         model: EmployeeModel,
// // // //         as: "employee",
// // // //         attributes: ["id", "personalDetails"],
// // // //         include: [
// // // //           {
// // // //             // Alias must match ManpowerModel association: as: "manpower"
// // // //             model: ManpowerModel,
// // // //             as: "manpower",
// // // //             attributes: ["employeeNo", "manpower_status", "operator_type_id"],
// // // //             include: [
// // // //               {
// // // //                 model: OperatorTypeModel,
// // // //                 as: "operator_type",
// // // //                 attributes: ["operator_type_id", "operator_type"],
// // // //               },
// // // //             ],
// // // //           },
// // // //         ],
// // // //       },
// // // //     ],
// // // //   },
// // // //   // ── Attachments ──
// // // //   {
// // // //     model: AllocationAttachmentModel,
// // // //     as: "attachmentAllocations",
// // // //     include: [
// // // //       {
// // // //         model: AttachmentModel,
// // // //         as: "attachment",
// // // //         attributes: [
// // // //           "attachment_id",
// // // //           "attachment_number",
// // // //           "product_name",
// // // //           "serial_number",
// // // //           "attachment_status",
// // // //         ],
// // // //       },
// // // //     ],
// // // //   },
// // // // ];

// // // // // ─── Response Formatter ───────────────────────────────────────────────────────

// // // // /**
// // // //  * Formats one ActiveAllocation record into the Operational Handling response.
// // // //  *
// // // //  * Resources are exposed SEPARATELY so the frontend can render each one
// // // //  * individually (one-by-one) under Equipment / Manpower / Attachments sections.
// // // //  *
// // // //  * Output shape:
// // // //  * {
// // // //  *   allocation_id, allocation_date, status, service_option, user_remarks,
// // // //  *   salesOrder: { ...fields, jobLocation },
// // // //  *   resources: {
// // // //  *     equipment:    [ { resource_type, allocation_detail, equipment_info } ],
// // // //  *     manpower:     [ { resource_type, allocation_detail, employee_info } ],
// // // //  *     attachments:  [ { resource_type, allocation_detail, attachment_info } ],
// // // //  *     summary: { total_equipment, total_manpower, total_attachments, total_resources }
// // // //  *   },
// // // //  *   scheduled_dates: { scheduled_date } | null
// // // //  * }
// // // //  */
// // // // const formatAllocationResponse = (allocation, scheduledDatesMap = {}) => {
// // // //   const raw = allocation.toJSON ? allocation.toJSON() : allocation;

// // // //   // ── Equipment list — one entry per allocated equipment ──
// // // //   const equipmentList = (raw.equipmentAllocations || []).map((eq) => ({
// // // //     resource_type: "equipment",
// // // //     allocation_detail: {
// // // //       id: eq.id,
// // // //       allocation_id: eq.allocation_id,
// // // //       serial_number: eq.serial_number,
// // // //       eqt_stu: eq.eqt_stu,
// // // //       status: eq.status,
// // // //       note: eq.note,
// // // //       is_selected: eq.is_selected,
// // // //     },
// // // //     equipment_info: eq.equipment
// // // //       ? {
// // // //           serial_number: eq.equipment.serial_number,
// // // //           reg_number: eq.equipment.reg_number,
// // // //           vehicle_type: eq.equipment.vehicle_type,
// // // //           equipment_status: eq.equipment.equipment_status,
// // // //           equipment_status_note: eq.equipment.equipment_status_note,
// // // //         }
// // // //       : null,
// // // //   }));

// // // //   // ── Manpower list — one entry per allocated employee ──
// // // //   const manpowerList = (raw.manpowerAllocations || []).map((mp) => ({
// // // //     resource_type: "manpower",
// // // //     allocation_detail: {
// // // //       id: mp.id,
// // // //       allocation_id: mp.allocation_id,
// // // //       employee_id: mp.employee_id,
// // // //       man_stu: mp.man_stu,
// // // //       status: mp.status,
// // // //       note: mp.note,
// // // //       is_selected: mp.is_selected,
// // // //     },
// // // //     employee_info: mp.employee
// // // //       ? {
// // // //           id: mp.employee.id,
// // // //           full_name: mp.employee.personalDetails?.fullNameEnglish || null,
// // // //           employee_no: mp.employee.manpower?.[0]?.employeeNo || null,
// // // //           manpower_status: mp.employee.manpower?.[0]?.manpower_status || null,
// // // //           operator_type: mp.employee.manpower?.[0]?.operator_type?.operator_type || null,
// // // //         }
// // // //       : null,
// // // //   }));

// // // //   // ── Attachment list — one entry per allocated attachment ──
// // // //   const attachmentList = (raw.attachmentAllocations || []).map((att) => ({
// // // //     resource_type: "attachment",
// // // //     allocation_detail: {
// // // //       id: att.id,
// // // //       allocation_id: att.allocation_id,
// // // //       attachment_id: att.attachment_id,
// // // //       att_stu: att.att_stu,
// // // //       status: att.status,
// // // //       note: att.note,
// // // //       is_selected: att.is_selected,
// // // //     },
// // // //     attachment_info: att.attachment
// // // //       ? {
// // // //           attachment_id: att.attachment.attachment_id,
// // // //           attachment_number: att.attachment.attachment_number,
// // // //           product_name: att.attachment.product_name,
// // // //           serial_number: att.attachment.serial_number,
// // // //           attachment_status: att.attachment.attachment_status,
// // // //         }
// // // //       : null,
// // // //   }));

// // // //   return {
// // // //     allocation_id: raw.allocation_id,
// // // //     allocation_date: raw.allocation_date,
// // // //     status: raw.status,
// // // //     service_option: raw.service_option,
// // // //     user_remarks: raw.user_remarks,
// // // //     salesOrder: raw.salesOrder,
// // // //     resources: {
// // // //       equipment: equipmentList,
// // // //       manpower: manpowerList,
// // // //       attachments: attachmentList,
// // // //       summary: {
// // // //         total_equipment: equipmentList.length,
// // // //         total_manpower: manpowerList.length,
// // // //         total_attachments: attachmentList.length,
// // // //         total_resources:
// // // //           equipmentList.length + manpowerList.length + attachmentList.length,
// // // //       },
// // // //     },
// // // //     scheduled_dates: scheduledDatesMap[raw.allocation_id] || null,
// // // //   };
// // // // };

// // // // /**
// // // //  * Fetch the earliest scheduled_date for a SO across all resource types.
// // // //  *
// // // //  * Strategy:
// // // //  *   1. Try is_selected = true records first (across equipment/manpower/attachment scheduled tables)
// // // //  *   2. Fallback: any scheduled record for this SO (is_selected = false or unset)
// // // //  *   3. If still none found, return null → caller uses allocation_date as fallback
// // // //  */
// // // // const fetchScheduledDateForSO = async (soId) => {
// // // //   const findEarliest = async (Model) => {
// // // //     let record = await Model.findOne({
// // // //       where: { so_id: soId, is_selected: true },
// // // //       order: [["scheduled_date", "ASC"]],
// // // //       attributes: ["scheduled_date"],
// // // //     });
// // // //     if (!record) {
// // // //       record = await Model.findOne({
// // // //         where: { so_id: soId },
// // // //         order: [["scheduled_date", "ASC"]],
// // // //         attributes: ["scheduled_date"],
// // // //       });
// // // //     }
// // // //     return record?.scheduled_date || null;
// // // //   };

// // // //   const [eqDate, mpDate, attDate] = await Promise.all([
// // // //     findEarliest(EquipmentScheduledModel),
// // // //     findEarliest(ManpowerScheduledModel),
// // // //     findEarliest(AttachmentScheduledModel),
// // // //   ]);

// // // //   const dates = [eqDate, mpDate, attDate].filter(Boolean).sort();
// // // //   return dates[0] || null;
// // // // };

// // // // /**
// // // //  * Checks if a Sales Order is within its active window on a given reference date.
// // // //  *
// // // //  * Start : scheduledDate if available, else allocationDate, else referenceDate itself
// // // //  * End   : lpo_end_date (extended_lpo_validity_date OR lpo_validity_date)
// // // //  *         If no lpo end date is set → treat as open-ended (valid as long as started)
// // // //  *
// // // //  * Condition: effectiveStart <= referenceDate AND (no lpoEnd OR lpoEnd >= referenceDate)
// // // //  */
// // // // const isInActiveWindow = (salesOrder, scheduledDate, referenceDate, allocationDate = null) => {
// // // //   const lpoEndDate = getLpoEndDate(salesOrder);
// // // //   const effectiveStart = scheduledDate || allocationDate || referenceDate;

// // // //   if (!lpoEndDate) {
// // // //     // No LPO end date: order is active as long as it has started
// // // //     return effectiveStart <= referenceDate;
// // // //   }

// // // //   return effectiveStart <= referenceDate && lpoEndDate >= referenceDate;
// // // // };

// // // // // ─── Controller Functions ─────────────────────────────────────────────────────

// // // // /**
// // // //  * GET /api/operational-handling/shift-info
// // // //  */
// // // // const getShiftInfo = async (req, res) => {
// // // //   try {
// // // //     const info = getShiftContext();
// // // //     return res.status(200).json({
// // // //       serverTime: new Date().toISOString(),
// // // //       ...info,
// // // //       shiftWindows: {
// // // //         day: "06:00 – 17:59",
// // // //         night: "18:00 – 05:59 (next day)",
// // // //       },
// // // //     });
// // // //   } catch (error) {
// // // //     return res.status(500).json({ message: error.message });
// // // //   }
// // // // };

// // // // /**
// // // //  * GET /api/operational-handling/active-orders/current-shift
// // // //  *
// // // //  * Allocations belonging to the shift currently in progress.
// // // //  * Filters by: allocation_date == currentShiftDate AND SO shift matches current shift type.
// // // //  * Only includes orders with resources and within active date window.
// // // //  */
// // // // const getCurrentShiftOrders = async (req, res) => {
// // // //   try {
// // // //     const { page = 1, limit = 10 } = req.query;
// // // //     const { currentShiftType, currentShiftDate } = getShiftContext();

// // // //     const allocations = await ActiveAllocationModel.findAll({
// // // //       where: {
// // // //         allocation_date: currentShiftDate,
// // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // //       },
// // // //       include: buildIncludes(),
// // // //       order: [["createdAt", "ASC"]],
// // // //     });

// // // //     const result = [];

// // // //     for (const alloc of allocations) {
// // // //       const raw = alloc.toJSON();

// // // //       const hasResources =
// // // //         raw.equipmentAllocations.length > 0 ||
// // // //         raw.manpowerAllocations.length > 0 ||
// // // //         raw.attachmentAllocations.length > 0;

// // // //       if (!hasResources || !raw.salesOrder) continue;

// // // //       // SO shift must include current shift type
// // // //       const soShift = raw.salesOrder.shift || "";
// // // //       const matchesShift =
// // // //         soShift === currentShiftType ||
// // // //         soShift === "Full" ||
// // // //         soShift === "Day and Night";

// // // //       if (!matchesShift) continue;

// // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // //       if (!isInActiveWindow(raw.salesOrder, scheduledDate, currentShiftDate, raw.allocation_date)) continue;

// // // //       result.push(
// // // //         formatAllocationResponse(alloc, {
// // // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // //         })
// // // //       );
// // // //     }

// // // //     const total = result.length;
// // // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // // //     return res.status(200).json({
// // // //       shiftType: currentShiftType,
// // // //       shiftDate: currentShiftDate,
// // // //       totalOrders: total,
// // // //       currentPage: parseInt(page),
// // // //       totalPages: Math.ceil(total / parseInt(limit)),
// // // //       orders: paginated,
// // // //     });
// // // //   } catch (error) {
// // // //     console.error("Error fetching current shift orders:", error);
// // // //     return res.status(500).json({
// // // //       message: "Error fetching current shift orders",
// // // //       error: error.message,
// // // //     });
// // // //   }
// // // // };

// // // // /**
// // // //  * GET /api/operational-handling/active-orders/next-shift
// // // //  *
// // // //  * Allocations for the shift immediately following the current one.
// // // //  */
// // // // const getNextShiftOrders = async (req, res) => {
// // // //   try {
// // // //     const { page = 1, limit = 10 } = req.query;
// // // //     const { nextShiftType, nextShiftDate } = getShiftContext();

// // // //     const allocations = await ActiveAllocationModel.findAll({
// // // //       where: {
// // // //         allocation_date: nextShiftDate,
// // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // //       },
// // // //       include: buildIncludes(),
// // // //       order: [["createdAt", "ASC"]],
// // // //     });

// // // //     const result = [];

// // // //     for (const alloc of allocations) {
// // // //       const raw = alloc.toJSON();

// // // //       const hasResources =
// // // //         raw.equipmentAllocations.length > 0 ||
// // // //         raw.manpowerAllocations.length > 0 ||
// // // //         raw.attachmentAllocations.length > 0;

// // // //       if (!hasResources || !raw.salesOrder) continue;

// // // //       const soShift = raw.salesOrder.shift || "";
// // // //       const matchesShift =
// // // //         soShift === nextShiftType ||
// // // //         soShift === "Full" ||
// // // //         soShift === "Day and Night";

// // // //       if (!matchesShift) continue;

// // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // //       if (!isInActiveWindow(raw.salesOrder, scheduledDate, nextShiftDate, raw.allocation_date)) continue;

// // // //       result.push(
// // // //         formatAllocationResponse(alloc, {
// // // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // //         })
// // // //       );
// // // //     }

// // // //     const total = result.length;
// // // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // // //     return res.status(200).json({
// // // //       shiftType: nextShiftType,
// // // //       shiftDate: nextShiftDate,
// // // //       totalOrders: total,
// // // //       currentPage: parseInt(page),
// // // //       totalPages: Math.ceil(total / parseInt(limit)),
// // // //       orders: paginated,
// // // //     });
// // // //   } catch (error) {
// // // //     console.error("Error fetching next shift orders:", error);
// // // //     return res.status(500).json({
// // // //       message: "Error fetching next shift orders",
// // // //       error: error.message,
// // // //     });
// // // //   }
// // // // };

// // // // /**
// // // //  * GET /api/operational-handling/active-orders/future-orders
// // // //  *
// // // //  * Allocations scheduled AFTER the next shift window.
// // // //  * allocation_date > nextShiftDate
// // // //  */
// // // // const getFutureOrders = async (req, res) => {
// // // //   try {
// // // //     const { page = 1, limit = 10 } = req.query;
// // // //     const { nextShiftDate } = getShiftContext();

// // // //     const allocations = await ActiveAllocationModel.findAll({
// // // //       where: {
// // // //         allocation_date: { [Op.gt]: nextShiftDate },
// // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // //       },
// // // //       include: buildIncludes(),
// // // //       order: [["allocation_date", "ASC"]],
// // // //     });

// // // //     const result = [];

// // // //     for (const alloc of allocations) {
// // // //       const raw = alloc.toJSON();

// // // //       const hasResources =
// // // //         raw.equipmentAllocations.length > 0 ||
// // // //         raw.manpowerAllocations.length > 0 ||
// // // //         raw.attachmentAllocations.length > 0;

// // // //       if (!hasResources || !raw.salesOrder) continue;

// // // //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// // // //       if (!lpoEndDate || lpoEndDate < raw.allocation_date) continue;

// // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // //       result.push(
// // // //         formatAllocationResponse(alloc, {
// // // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // //         })
// // // //       );
// // // //     }

// // // //     const total = result.length;
// // // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // // //     return res.status(200).json({
// // // //       totalOrders: total,
// // // //       currentPage: parseInt(page),
// // // //       totalPages: Math.ceil(total / parseInt(limit)),
// // // //       orders: paginated,
// // // //     });
// // // //   } catch (error) {
// // // //     console.error("Error fetching future orders:", error);
// // // //     return res.status(500).json({
// // // //       message: "Error fetching future orders",
// // // //       error: error.message,
// // // //     });
// // // //   }
// // // // };

// // // // /**
// // // //  * GET /api/operational-handling/active-orders
// // // //  *
// // // //  * All three groups in one combined response.
// // // //  */
// // // // const getAllActiveOrders = async (req, res) => {
// // // //   try {
// // // //     const { currentShiftType, currentShiftDate, nextShiftType, nextShiftDate } =
// // // //       getShiftContext();

// // // //     const allAllocations = await ActiveAllocationModel.findAll({
// // // //       where: {
// // // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // // //       },
// // // //       include: buildIncludes(),
// // // //       order: [["allocation_date", "ASC"]],
// // // //     });

// // // //     const currentShiftOrders = [];
// // // //     const nextShiftOrders = [];
// // // //     const futureOrdersList = [];

// // // //     for (const alloc of allAllocations) {
// // // //       const raw = alloc.toJSON();

// // // //       const hasResources =
// // // //         raw.equipmentAllocations.length > 0 ||
// // // //         raw.manpowerAllocations.length > 0 ||
// // // //         raw.attachmentAllocations.length > 0;

// // // //       if (!hasResources || !raw.salesOrder) continue;

// // // //       const soShift = raw.salesOrder.shift || "";
// // // //       const allocDate = raw.allocation_date;
// // // //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// // // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // // //       const formatted = formatAllocationResponse(alloc, {
// // // //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // //       });

// // // //       const matchesCurrentShift =
// // // //         soShift === currentShiftType || soShift === "Full" || soShift === "Day and Night";
// // // //       const matchesNextShift =
// // // //         soShift === nextShiftType || soShift === "Full" || soShift === "Day and Night";

// // // //       // Current Shift
// // // //       if (allocDate === currentShiftDate && matchesCurrentShift) {
// // // //         if (isInActiveWindow(raw.salesOrder, scheduledDate, currentShiftDate, raw.allocation_date)) {
// // // //           currentShiftOrders.push(formatted);
// // // //         }
// // // //       }
// // // //       // Next Shift
// // // //       else if (allocDate === nextShiftDate && matchesNextShift) {
// // // //         if (isInActiveWindow(raw.salesOrder, scheduledDate, nextShiftDate, raw.allocation_date)) {
// // // //           nextShiftOrders.push(formatted);
// // // //         }
// // // //       }
// // // //       // Future Orders
// // // //       else if (allocDate > nextShiftDate) {
// // // //         if (lpoEndDate && lpoEndDate >= allocDate) {
// // // //           futureOrdersList.push(formatted);
// // // //         }
// // // //       }
// // // //     }

// // // //     return res.status(200).json({
// // // //       currentShift: {
// // // //         shiftType: currentShiftType,
// // // //         shiftDate: currentShiftDate,
// // // //         totalOrders: currentShiftOrders.length,
// // // //         orders: currentShiftOrders,
// // // //       },
// // // //       nextShift: {
// // // //         shiftType: nextShiftType,
// // // //         shiftDate: nextShiftDate,
// // // //         totalOrders: nextShiftOrders.length,
// // // //         orders: nextShiftOrders,
// // // //       },
// // // //       futureOrders: {
// // // //         totalOrders: futureOrdersList.length,
// // // //         orders: futureOrdersList,
// // // //       },
// // // //     });
// // // //   } catch (error) {
// // // //     console.error("Error fetching all active orders:", error);
// // // //     return res.status(500).json({
// // // //       message: "Error fetching all active orders",
// // // //       error: error.message,
// // // //     });
// // // //   }
// // // // };

// // // // // ─── Completed Orders ─────────────────────────────────────────────────────────

// // // // /**
// // // //  * GET /api/operational-handling/completed-orders
// // // //  *
// // // //  * Allocations where status === "Completed".
// // // //  * Resources shown separately per allocation.
// // // //  */
// // // // const getCompletedOrders = async (req, res) => {
// // // //   try {
// // // //     const { page = 1, limit = 10, from_date, to_date } = req.query;
// // // //     const offset = (parseInt(page) - 1) * parseInt(limit);

// // // //     const dateFilter = {};
// // // //     if (from_date) dateFilter[Op.gte] = from_date;
// // // //     if (to_date) dateFilter[Op.lte] = to_date;

// // // //     const { count, rows } = await ActiveAllocationModel.findAndCountAll({
// // // //       where: {
// // // //         status: "Completed",
// // // //         ...(Object.keys(dateFilter).length > 0 && { allocation_date: dateFilter }),
// // // //       },
// // // //       include: buildIncludes(),
// // // //       offset,
// // // //       limit: parseInt(limit),
// // // //       order: [["allocation_date", "DESC"]],
// // // //       distinct: true,
// // // //     });

// // // //     const formatted = rows
// // // //       .filter(
// // // //         (alloc) =>
// // // //           (alloc.equipmentAllocations?.length || 0) > 0 ||
// // // //           (alloc.manpowerAllocations?.length || 0) > 0 ||
// // // //           (alloc.attachmentAllocations?.length || 0) > 0
// // // //       )
// // // //       .map((alloc) => formatAllocationResponse(alloc));

// // // //     return res.status(200).json({
// // // //       totalOrders: count,
// // // //       currentPage: parseInt(page),
// // // //       totalPages: Math.ceil(count / parseInt(limit)),
// // // //       orders: formatted,
// // // //     });
// // // //   } catch (error) {
// // // //     console.error("Error fetching completed orders:", error);
// // // //     return res.status(500).json({
// // // //       message: "Error fetching completed orders",
// // // //       error: error.message,
// // // //     });
// // // //   }
// // // // };

// // // // /**
// // // //  * GET /api/operational-handling/orders/:id
// // // //  * Single allocation by allocation_id.
// // // //  */
// // // // const getOrderById = async (req, res) => {
// // // //   try {
// // // //     const { id } = req.params;

// // // //     const alloc = await ActiveAllocationModel.findByPk(id, {
// // // //       include: buildIncludes(),
// // // //     });

// // // //     if (!alloc) {
// // // //       return res.status(404).json({ message: "Allocation record not found" });
// // // //     }

// // // //     const raw = alloc.toJSON();
// // // //     const scheduledDate = raw.salesOrder
// // // //       ? await fetchScheduledDateForSO(raw.salesOrder.id)
// // // //       : null;

// // // //     return res.status(200).json(
// // // //       formatAllocationResponse(alloc, {
// // // //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// // // //       })
// // // //     );
// // // //   } catch (error) {
// // // //     console.error("Error fetching order by ID:", error);
// // // //     return res.status(500).json({ message: "Error fetching order", error: error.message });
// // // //   }
// // // // };

// // // // /**
// // // //  * GET /api/operational-handling/orders/by-sales-order/:so_id
// // // //  * All allocations for a specific Sales Order.
// // // //  */
// // // // const getOrdersBySalesOrder = async (req, res) => {
// // // //   try {
// // // //     const { so_id } = req.params;

// // // //     const allocations = await ActiveAllocationModel.findAll({
// // // //       where: { sales_order_id: so_id },
// // // //       include: buildIncludes(),
// // // //       order: [["allocation_date", "ASC"]],
// // // //     });

// // // //     if (!allocations.length) {
// // // //       return res.status(404).json({
// // // //         message: "No allocations found for this sales order",
// // // //         orders: [],
// // // //       });
// // // //     }

// // // //     const scheduledDate = await fetchScheduledDateForSO(parseInt(so_id));

// // // //     const formatted = allocations.map((alloc) =>
// // // //       formatAllocationResponse(alloc, {
// // // //         [alloc.allocation_id]: { scheduled_date: scheduledDate },
// // // //       })
// // // //     );

// // // //     return res.status(200).json({
// // // //       so_id: parseInt(so_id),
// // // //       totalAllocations: formatted.length,
// // // //       orders: formatted,
// // // //     });
// // // //   } catch (error) {
// // // //     console.error("Error fetching orders by SO:", error);
// // // //     return res.status(500).json({
// // // //       message: "Error fetching orders by sales order",
// // // //       error: error.message,
// // // //     });
// // // //   }
// // // // };


// // // // /**
// // // //  * GET /api/operational-handling/debug
// // // //  * TEMPORARY: Shows exactly why each allocation is being filtered out.
// // // //  * Remove this endpoint before production.
// // // //  */
// // // // const debugOrders = async (req, res) => {
// // // //   try {
// // // //     const { currentShiftType, currentShiftDate, nextShiftType, nextShiftDate } = getShiftContext();

// // // //     // Step 1: Fetch ALL allocations — no filters at all
// // // //     const allAllocations = await ActiveAllocationModel.findAll({
// // // //       include: buildIncludes(),
// // // //       order: [["allocation_date", "ASC"]],
// // // //     });

// // // //     const debugReport = [];

// // // //     for (const alloc of allAllocations) {
// // // //       const raw = alloc.toJSON();
// // // //       const report = {
// // // //         allocation_id: raw.allocation_id,
// // // //         allocation_date: raw.allocation_date,
// // // //         status: raw.status,
// // // //         sales_order_id: raw.sales_order_id,
// // // //         checks: {},
// // // //       };

// // // //       // Check 1: status
// // // //       report.checks.statusOk = !["Completed", "Cancelled"].includes(raw.status);

// // // //       // Check 2: salesOrder joined
// // // //       report.checks.salesOrderLoaded = !!raw.salesOrder;
// // // //       if (raw.salesOrder) {
// // // //         report.salesOrder = {
// // // //           id: raw.salesOrder.id,
// // // //           shift: raw.salesOrder.shift,
// // // //           lpo_validity_date: raw.salesOrder.lpo_validity_date,
// // // //           extended_lpo_validity_date: raw.salesOrder.extended_lpo_validity_date,
// // // //           ops_status: raw.salesOrder.ops_status,
// // // //           so_status: raw.salesOrder.so_status,
// // // //         };
// // // //       }

// // // //       // Check 3: has resources
// // // //       const eqCount = raw.equipmentAllocations?.length || 0;
// // // //       const mpCount = raw.manpowerAllocations?.length || 0;
// // // //       const attCount = raw.attachmentAllocations?.length || 0;
// // // //       report.checks.hasResources = eqCount > 0 || mpCount > 0 || attCount > 0;
// // // //       report.resourceCounts = { equipment: eqCount, manpower: mpCount, attachments: attCount };

// // // //       // Check 4: shift matching
// // // //       if (raw.salesOrder) {
// // // //         const soShift = raw.salesOrder.shift || "";
// // // //         report.checks.matchesCurrentShift =
// // // //           soShift === currentShiftType || soShift === "Full" || soShift === "Day and Night";
// // // //         report.checks.matchesNextShift =
// // // //           soShift === nextShiftType || soShift === "Full" || soShift === "Day and Night";
// // // //         report.checks.soShiftValue = soShift;
// // // //         report.checks.currentShiftType = currentShiftType;
// // // //       }

// // // //       // Check 5: allocation_date matching
// // // //       report.checks.allocationDateMatchesCurrentShift = raw.allocation_date === currentShiftDate;
// // // //       report.checks.allocationDateMatchesNextShift = raw.allocation_date === nextShiftDate;
// // // //       report.checks.currentShiftDate = currentShiftDate;
// // // //       report.checks.nextShiftDate = nextShiftDate;

// // // //       // Check 6: active window
// // // //       if (raw.salesOrder) {
// // // //         const soId = raw.salesOrder.id;
// // // //         const scheduledDate = await fetchScheduledDateForSO(soId);
// // // //         const lpoEndDate = getLpoEndDate(raw.salesOrder);
// // // //         const effectiveStart = scheduledDate || raw.allocation_date || currentShiftDate;

// // // //         report.checks.scheduledDate = scheduledDate;
// // // //         report.checks.lpoEndDate = lpoEndDate;
// // // //         report.checks.effectiveStart = effectiveStart;
// // // //         report.checks.activeWindowForCurrentShift = isInActiveWindow(
// // // //           raw.salesOrder, scheduledDate, currentShiftDate, raw.allocation_date
// // // //         );
// // // //         report.checks.activeWindowForNextShift = isInActiveWindow(
// // // //           raw.salesOrder, scheduledDate, nextShiftDate, raw.allocation_date
// // // //         );
// // // //       }

// // // //       // Final verdict
// // // //       report.wouldAppearInCurrentShift =
// // // //         report.checks.statusOk &&
// // // //         report.checks.salesOrderLoaded &&
// // // //         report.checks.hasResources &&
// // // //         report.checks.matchesCurrentShift &&
// // // //         report.checks.allocationDateMatchesCurrentShift &&
// // // //         report.checks.activeWindowForCurrentShift;

// // // //       report.wouldAppearInNextShift =
// // // //         report.checks.statusOk &&
// // // //         report.checks.salesOrderLoaded &&
// // // //         report.checks.hasResources &&
// // // //         report.checks.matchesNextShift &&
// // // //         report.checks.allocationDateMatchesNextShift &&
// // // //         report.checks.activeWindowForNextShift;

// // // //       debugReport.push(report);
// // // //     }

// // // //     return res.status(200).json({
// // // //       serverTime: new Date().toISOString(),
// // // //       shiftContext: { currentShiftType, currentShiftDate, nextShiftType, nextShiftDate },
// // // //       totalAllocationsInDB: debugReport.length,
// // // //       allocations: debugReport,
// // // //     });
// // // //   } catch (error) {
// // // //     console.error("Debug error:", error);
// // // //     return res.status(500).json({ message: "Debug error", error: error.message, stack: error.stack });
// // // //   }
// // // // };

// // // // module.exports = {
// // // //   getShiftInfo,
// // // //   getCurrentShiftOrders,
// // // //   getNextShiftOrders,
// // // //   getFutureOrders,
// // // //   getAllActiveOrders,
// // // //   getCompletedOrders,
// // // //   getOrderById,
// // // //   getOrdersBySalesOrder,
// // // //   debugOrders,   // TEMP: remove before production
// // // // };

// // // const { Op } = require("sequelize");
// // // const {
// // //   ActiveAllocationModel,
// // //   AllocationEquipmentModel,
// // //   AllocationManpowerModel,
// // //   AllocationAttachmentModel,
// // // } = require("../../models/fleet-management/ActiveAllocationsOriginalModel");
// // // const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// // // const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// // // const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
// // // const EmployeeModel = require("../../models/hr/employees/EmployeeModel");
// // // const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
// // // const JobLocationModel = require("../../models/fleet-management/JobLocationModel");
// // // const EquipmentScheduledModel = require("../../models/fleet-management/EquipmentScheduledModel");
// // // const ManpowerScheduledModel = require("../../models/fleet-management/ManpowerScheduledModel");
// // // const AttachmentScheduledModel = require("../../models/fleet-management/AttachmentScheduledModel");
// // // const OperatorTypeModel = require("../../models/fleet-management/OperatorTypeModel");

// // // // ─── Shift Helpers ────────────────────────────────────────────────────────────

// // // const toDateStr = (d) => d.toISOString().split("T")[0];

// // // const getShiftContext = () => {
// // //   const now = new Date();
// // //   const hours = now.getHours();
// // //   const isDay = hours >= 6 && hours <= 17;

// // //   const today = toDateStr(now);
// // //   const tomorrow = toDateStr(
// // //     new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
// // //   );

// // //   if (isDay) {
// // //     return {
// // //       currentShiftType: "Day",
// // //       currentShiftDate: today,
// // //       nextShiftType: "Night",
// // //       nextShiftDate: today,
// // //       futureAfterDate: today,
// // //     };
// // //   } else {
// // //     return {
// // //       currentShiftType: "Night",
// // //       currentShiftDate: today,
// // //       nextShiftType: "Day",
// // //       nextShiftDate: tomorrow,
// // //       futureAfterDate: tomorrow,
// // //     };
// // //   }
// // // };

// // // const getLpoEndDate = (so) =>
// // //   so.extended_lpo_validity_date || so.lpo_validity_date || null;

// // // // ─── Include Builder ──────────────────────────────────────────────────────────

// // // const buildIncludes = () => [
// // //   {
// // //     model: SalesOrdersModel,
// // //     as: "salesOrder",
// // //     attributes: [
// // //       "id",
// // //       "so_number",
// // //       "client",
// // //       "project_name",
// // //       "delivery_address",
// // //       "shift",
// // //       "lpo_number",
// // //       "lpo_validity_date",
// // //       "extended_lpo_validity_date",
// // //       "expected_mobilization_date",
// // //       "expected_demobilization_date",
// // //       "ops_status",
// // //       "so_status",
// // //     ],
// // //     include: [
// // //       {
// // //         model: JobLocationModel,
// // //         as: "jobLocation",
// // //         attributes: ["job_location_id", "job_location_name"],
// // //       },
// // //     ],
// // //   },
// // //   {
// // //     model: AllocationEquipmentModel,
// // //     as: "equipmentAllocations",
// // //     include: [
// // //       {
// // //         model: EquipmentModel,
// // //         as: "equipment",
// // //         attributes: [
// // //           "serial_number",
// // //           "reg_number",
// // //           "vehicle_type",
// // //           "equipment_status",
// // //           "equipment_status_note",
// // //         ],
// // //       },
// // //     ],
// // //   },
// // //   {
// // //     model: AllocationManpowerModel,
// // //     as: "manpowerAllocations",
// // //     include: [
// // //       {
// // //         model: EmployeeModel,
// // //         as: "employee",
// // //         attributes: ["id", "personalDetails"],
// // //         include: [
// // //           {
// // //             model: ManpowerModel,
// // //             as: "manpower",
// // //             attributes: ["employeeNo", "manpower_status", "operator_type_id"],
// // //             include: [
// // //               {
// // //                 model: OperatorTypeModel,
// // //                 as: "operator_type",
// // //                 attributes: ["operator_type_id", "operator_type"],
// // //               },
// // //             ],
// // //           },
// // //         ],
// // //       },
// // //     ],
// // //   },
// // //   {
// // //     model: AllocationAttachmentModel,
// // //     as: "attachmentAllocations",
// // //     include: [
// // //       {
// // //         model: AttachmentModel,
// // //         as: "attachment",
// // //         attributes: [
// // //           "attachment_id",
// // //           "attachment_number",
// // //           "product_name",
// // //           "serial_number",
// // //           "attachment_status",
// // //         ],
// // //       },
// // //     ],
// // //   },
// // // ];

// // // // ─── Response Formatter ───────────────────────────────────────────────────────

// // // /**
// // //  * Formats one allocation into the standard response shape.
// // //  *
// // //  * Response shape:
// // //  * {
// // //  *   allocation_id, allocation_date, status, service_option, user_remarks,
// // //  *   salesOrder,
// // //  *   resources: {
// // //  *     equipment:   [ { resource_type, allocation_detail, equipment_info } ],
// // //  *     manpower:    [ { resource_type, allocation_detail, employee_info   } ],
// // //  *     attachments: [ { resource_type, allocation_detail, attachment_info } ],
// // //  *     summary: { total_equipment, total_manpower, total_attachments, total_resources }
// // //  *   },
// // //  *   scheduled_dates: { scheduled_date } | null
// // //  * }
// // //  */
// // // const formatAllocationResponse = (allocation, scheduledDatesMap = {}) => {
// // //   const raw = allocation.toJSON ? allocation.toJSON() : allocation;

// // //   const equipmentList = (raw.equipmentAllocations || []).map((eq) => ({
// // //     resource_type: "equipment",
// // //     allocation_detail: {
// // //       id: eq.id,
// // //       allocation_id: eq.allocation_id,
// // //       serial_number: eq.serial_number,
// // //       eqt_stu: eq.eqt_stu,
// // //       status: eq.status,
// // //       note: eq.note,
// // //       is_selected: eq.is_selected,
// // //     },
// // //     equipment_info: eq.equipment
// // //       ? {
// // //           serial_number: eq.equipment.serial_number,
// // //           reg_number: eq.equipment.reg_number,
// // //           vehicle_type: eq.equipment.vehicle_type,
// // //           equipment_status: eq.equipment.equipment_status,
// // //           equipment_status_note: eq.equipment.equipment_status_note,
// // //         }
// // //       : null,
// // //   }));

// // //   const manpowerList = (raw.manpowerAllocations || []).map((mp) => ({
// // //     resource_type: "manpower",
// // //     allocation_detail: {
// // //       id: mp.id,
// // //       allocation_id: mp.allocation_id,
// // //       employee_id: mp.employee_id,
// // //       man_stu: mp.man_stu,
// // //       status: mp.status,
// // //       note: mp.note,
// // //       is_selected: mp.is_selected,
// // //     },
// // //     employee_info: mp.employee
// // //       ? {
// // //           id: mp.employee.id,
// // //           full_name: mp.employee.personalDetails?.fullNameEnglish || null,
// // //           employee_no: mp.employee.manpower?.[0]?.employeeNo || null,
// // //           manpower_status: mp.employee.manpower?.[0]?.manpower_status || null,
// // //           operator_type:
// // //             mp.employee.manpower?.[0]?.operator_type?.operator_type || null,
// // //         }
// // //       : null,
// // //   }));

// // //   const attachmentList = (raw.attachmentAllocations || []).map((att) => ({
// // //     resource_type: "attachment",
// // //     allocation_detail: {
// // //       id: att.id,
// // //       allocation_id: att.allocation_id,
// // //       attachment_id: att.attachment_id,
// // //       att_stu: att.att_stu,
// // //       status: att.status,
// // //       note: att.note,
// // //       is_selected: att.is_selected,
// // //     },
// // //     attachment_info: att.attachment
// // //       ? {
// // //           attachment_id: att.attachment.attachment_id,
// // //           attachment_number: att.attachment.attachment_number,
// // //           product_name: att.attachment.product_name,
// // //           serial_number: att.attachment.serial_number,
// // //           attachment_status: att.attachment.attachment_status,
// // //         }
// // //       : null,
// // //   }));

// // //   return {
// // //     allocation_id: raw.allocation_id,
// // //     allocation_date: raw.allocation_date,
// // //     status: raw.status,
// // //     service_option: raw.service_option,
// // //     user_remarks: raw.user_remarks,
// // //     salesOrder: raw.salesOrder,
// // //     resources: {
// // //       equipment: equipmentList,
// // //       manpower: manpowerList,
// // //       attachments: attachmentList,
// // //       summary: {
// // //         total_equipment: equipmentList.length,
// // //         total_manpower: manpowerList.length,
// // //         total_attachments: attachmentList.length,
// // //         total_resources:
// // //           equipmentList.length + manpowerList.length + attachmentList.length,
// // //       },
// // //     },
// // //     scheduled_dates: scheduledDatesMap[raw.allocation_id] || null,
// // //   };
// // // };

// // // const fetchScheduledDateForSO = async (soId) => {
// // //   const findEarliest = async (Model) => {
// // //     let record = await Model.findOne({
// // //       where: { so_id: soId, is_selected: true },
// // //       order: [["scheduled_date", "ASC"]],
// // //       attributes: ["scheduled_date"],
// // //     });
// // //     if (!record) {
// // //       record = await Model.findOne({
// // //         where: { so_id: soId },
// // //         order: [["scheduled_date", "ASC"]],
// // //         attributes: ["scheduled_date"],
// // //       });
// // //     }
// // //     return record?.scheduled_date || null;
// // //   };

// // //   const [eqDate, mpDate, attDate] = await Promise.all([
// // //     findEarliest(EquipmentScheduledModel),
// // //     findEarliest(ManpowerScheduledModel),
// // //     findEarliest(AttachmentScheduledModel),
// // //   ]);

// // //   const dates = [eqDate, mpDate, attDate].filter(Boolean).sort();
// // //   return dates[0] || null;
// // // };

// // // const isInActiveWindow = (
// // //   salesOrder,
// // //   scheduledDate,
// // //   referenceDate,
// // //   allocationDate = null
// // // ) => {
// // //   const lpoEndDate = getLpoEndDate(salesOrder);
// // //   const effectiveStart = scheduledDate || allocationDate || referenceDate;

// // //   if (!lpoEndDate) {
// // //     return effectiveStart <= referenceDate;
// // //   }

// // //   return effectiveStart <= referenceDate && lpoEndDate >= referenceDate;
// // // };

// // // // ─── Controller Functions ─────────────────────────────────────────────────────

// // // const getShiftInfo = async (req, res) => {
// // //   try {
// // //     const info = getShiftContext();
// // //     return res.status(200).json({
// // //       serverTime: new Date().toISOString(),
// // //       ...info,
// // //       shiftWindows: {
// // //         day: "06:00 – 17:59",
// // //         night: "18:00 – 05:59 (next day)",
// // //       },
// // //     });
// // //   } catch (error) {
// // //     return res.status(500).json({ message: error.message });
// // //   }
// // // };

// // // const getCurrentShiftOrders = async (req, res) => {
// // //   try {
// // //     const { page = 1, limit = 10 } = req.query;
// // //     const { currentShiftType, currentShiftDate } = getShiftContext();

// // //     const allocations = await ActiveAllocationModel.findAll({
// // //       where: {
// // //         allocation_date: currentShiftDate,
// // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // //       },
// // //       include: buildIncludes(),
// // //       order: [["createdAt", "ASC"]],
// // //     });

// // //     const result = [];

// // //     for (const alloc of allocations) {
// // //       const raw = alloc.toJSON();

// // //       const hasResources =
// // //         raw.equipmentAllocations.length > 0 ||
// // //         raw.manpowerAllocations.length > 0 ||
// // //         raw.attachmentAllocations.length > 0;

// // //       if (!hasResources || !raw.salesOrder) continue;

// // //       const soShift = raw.salesOrder.shift || "";
// // //       const matchesShift =
// // //         soShift === currentShiftType ||
// // //         soShift === "Full" ||
// // //         soShift === "Day and Night";

// // //       if (!matchesShift) continue;

// // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // //       if (
// // //         !isInActiveWindow(
// // //           raw.salesOrder,
// // //           scheduledDate,
// // //           currentShiftDate,
// // //           raw.allocation_date
// // //         )
// // //       )
// // //         continue;

// // //       result.push(
// // //         formatAllocationResponse(alloc, {
// // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // //         })
// // //       );
// // //     }

// // //     const total = result.length;
// // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // //     return res.status(200).json({
// // //       shiftType: currentShiftType,
// // //       shiftDate: currentShiftDate,
// // //       totalOrders: total,
// // //       currentPage: parseInt(page),
// // //       totalPages: Math.ceil(total / parseInt(limit)),
// // //       orders: paginated,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching current shift orders:", error);
// // //     return res.status(500).json({
// // //       message: "Error fetching current shift orders",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // const getNextShiftOrders = async (req, res) => {
// // //   try {
// // //     const { page = 1, limit = 10 } = req.query;
// // //     const { nextShiftType, nextShiftDate } = getShiftContext();

// // //     const allocations = await ActiveAllocationModel.findAll({
// // //       where: {
// // //         allocation_date: nextShiftDate,
// // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // //       },
// // //       include: buildIncludes(),
// // //       order: [["createdAt", "ASC"]],
// // //     });

// // //     const result = [];

// // //     for (const alloc of allocations) {
// // //       const raw = alloc.toJSON();

// // //       const hasResources =
// // //         raw.equipmentAllocations.length > 0 ||
// // //         raw.manpowerAllocations.length > 0 ||
// // //         raw.attachmentAllocations.length > 0;

// // //       if (!hasResources || !raw.salesOrder) continue;

// // //       const soShift = raw.salesOrder.shift || "";
// // //       const matchesShift =
// // //         soShift === nextShiftType ||
// // //         soShift === "Full" ||
// // //         soShift === "Day and Night";

// // //       if (!matchesShift) continue;

// // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // //       if (
// // //         !isInActiveWindow(
// // //           raw.salesOrder,
// // //           scheduledDate,
// // //           nextShiftDate,
// // //           raw.allocation_date
// // //         )
// // //       )
// // //         continue;

// // //       result.push(
// // //         formatAllocationResponse(alloc, {
// // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // //         })
// // //       );
// // //     }

// // //     const total = result.length;
// // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // //     return res.status(200).json({
// // //       shiftType: nextShiftType,
// // //       shiftDate: nextShiftDate,
// // //       totalOrders: total,
// // //       currentPage: parseInt(page),
// // //       totalPages: Math.ceil(total / parseInt(limit)),
// // //       orders: paginated,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching next shift orders:", error);
// // //     return res.status(500).json({
// // //       message: "Error fetching next shift orders",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // const getFutureOrders = async (req, res) => {
// // //   try {
// // //     const { page = 1, limit = 10 } = req.query;
// // //     const { nextShiftDate } = getShiftContext();

// // //     const allocations = await ActiveAllocationModel.findAll({
// // //       where: {
// // //         allocation_date: { [Op.gt]: nextShiftDate },
// // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // //       },
// // //       include: buildIncludes(),
// // //       order: [["allocation_date", "ASC"]],
// // //     });

// // //     const result = [];

// // //     for (const alloc of allocations) {
// // //       const raw = alloc.toJSON();

// // //       const hasResources =
// // //         raw.equipmentAllocations.length > 0 ||
// // //         raw.manpowerAllocations.length > 0 ||
// // //         raw.attachmentAllocations.length > 0;

// // //       if (!hasResources || !raw.salesOrder) continue;

// // //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// // //       if (!lpoEndDate || lpoEndDate < raw.allocation_date) continue;

// // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // //       result.push(
// // //         formatAllocationResponse(alloc, {
// // //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// // //         })
// // //       );
// // //     }

// // //     const total = result.length;
// // //     const offset = (parseInt(page) - 1) * parseInt(limit);
// // //     const paginated = result.slice(offset, offset + parseInt(limit));

// // //     return res.status(200).json({
// // //       totalOrders: total,
// // //       currentPage: parseInt(page),
// // //       totalPages: Math.ceil(total / parseInt(limit)),
// // //       orders: paginated,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching future orders:", error);
// // //     return res.status(500).json({
// // //       message: "Error fetching future orders",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // /**
// // //  * GET /api/operational-handling/active-orders
// // //  *
// // //  * Combined response structure:
// // //  * {
// // //  *   currentShift: {
// // //  *     shiftType, shiftDate, totalOrders,
// // //  *     equipment:   { totalOrders, orders: [ ...formatted ] },
// // //  *     manpower:    { totalOrders, orders: [ ...formatted ] },
// // //  *     attachments: { totalOrders, orders: [ ...formatted ] },
// // //  *   },
// // //  *   nextShift: { ... same ... },
// // //  *   futureOrders: { totalOrders, equipment, manpower, attachments }
// // //  * }
// // //  *
// // //  * Each "order" inside equipment/manpower/attachments tabs still carries the full
// // //  * allocation object (so the frontend can show SO details) but the tab determines
// // //  * which resource type is being highlighted/listed.
// // //  */
// // // const getAllActiveOrders = async (req, res) => {
// // //   try {
// // //     const {
// // //       currentShiftType,
// // //       currentShiftDate,
// // //       nextShiftType,
// // //       nextShiftDate,
// // //     } = getShiftContext();

// // //     const allAllocations = await ActiveAllocationModel.findAll({
// // //       where: {
// // //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // //       },
// // //       include: buildIncludes(),
// // //       order: [["allocation_date", "ASC"]],
// // //     });

// // //     // Buckets per shift → per resource type
// // //     const buckets = {
// // //       currentShift: { equipment: [], manpower: [], attachments: [] },
// // //       nextShift: { equipment: [], manpower: [], attachments: [] },
// // //       futureOrders: { equipment: [], manpower: [], attachments: [] },
// // //     };

// // //     for (const alloc of allAllocations) {
// // //       const raw = alloc.toJSON();

// // //       const hasResources =
// // //         raw.equipmentAllocations.length > 0 ||
// // //         raw.manpowerAllocations.length > 0 ||
// // //         raw.attachmentAllocations.length > 0;

// // //       if (!hasResources || !raw.salesOrder) continue;

// // //       const soShift = raw.salesOrder.shift || "";
// // //       const allocDate = raw.allocation_date;
// // //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // //       const formatted = formatAllocationResponse(alloc, {
// // //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// // //       });

// // //       const matchesCurrentShift =
// // //         soShift === currentShiftType ||
// // //         soShift === "Full" ||
// // //         soShift === "Day and Night";
// // //       const matchesNextShift =
// // //         soShift === nextShiftType ||
// // //         soShift === "Full" ||
// // //         soShift === "Day and Night";

// // //       let targetBucket = null;

// // //       if (allocDate === currentShiftDate && matchesCurrentShift) {
// // //         if (
// // //           isInActiveWindow(
// // //             raw.salesOrder,
// // //             scheduledDate,
// // //             currentShiftDate,
// // //             raw.allocation_date
// // //           )
// // //         ) {
// // //           targetBucket = buckets.currentShift;
// // //         }
// // //       } else if (allocDate === nextShiftDate && matchesNextShift) {
// // //         if (
// // //           isInActiveWindow(
// // //             raw.salesOrder,
// // //             scheduledDate,
// // //             nextShiftDate,
// // //             raw.allocation_date
// // //           )
// // //         ) {
// // //           targetBucket = buckets.nextShift;
// // //         }
// // //       } else if (allocDate > nextShiftDate) {
// // //         if (lpoEndDate && lpoEndDate >= allocDate) {
// // //           targetBucket = buckets.futureOrders;
// // //         }
// // //       }

// // //       if (!targetBucket) continue;

// // //       // Push into resource-type tabs
// // //       if (formatted.resources.equipment.length > 0)
// // //         targetBucket.equipment.push(formatted);
// // //       if (formatted.resources.manpower.length > 0)
// // //         targetBucket.manpower.push(formatted);
// // //       if (formatted.resources.attachments.length > 0)
// // //         targetBucket.attachments.push(formatted);
// // //     }

// // //     const buildShiftResponse = (bucket, extra = {}) => ({
// // //       ...extra,
// // //       totalOrders:
// // //         new Set([
// // //           ...bucket.equipment.map((o) => o.allocation_id),
// // //           ...bucket.manpower.map((o) => o.allocation_id),
// // //           ...bucket.attachments.map((o) => o.allocation_id),
// // //         ]).size,
// // //       equipment: {
// // //         totalOrders: bucket.equipment.length,
// // //         orders: bucket.equipment,
// // //       },
// // //       manpower: {
// // //         totalOrders: bucket.manpower.length,
// // //         orders: bucket.manpower,
// // //       },
// // //       attachments: {
// // //         totalOrders: bucket.attachments.length,
// // //         orders: bucket.attachments,
// // //       },
// // //     });

// // //     return res.status(200).json({
// // //       currentShift: buildShiftResponse(buckets.currentShift, {
// // //         shiftType: currentShiftType,
// // //         shiftDate: currentShiftDate,
// // //       }),
// // //       nextShift: buildShiftResponse(buckets.nextShift, {
// // //         shiftType: nextShiftType,
// // //         shiftDate: nextShiftDate,
// // //       }),
// // //       futureOrders: buildShiftResponse(buckets.futureOrders),
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching all active orders:", error);
// // //     return res.status(500).json({
// // //       message: "Error fetching all active orders",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // // ─── Completed Orders ─────────────────────────────────────────────────────────

// // // /**
// // //  * GET /api/operational-handling/completed-orders
// // //  *
// // //  * Response structure:
// // //  * {
// // //  *   totalOrders,
// // //  *   currentPage,
// // //  *   totalPages,
// // //  *   equipment:   { totalOrders, orders: [...] },
// // //  *   manpower:    { totalOrders, orders: [...] },
// // //  *   attachments: { totalOrders, orders: [...] },
// // //  * }
// // //  *
// // //  * Each tab lists full allocation objects where that resource type exists.
// // //  */
// // // const getCompletedOrders = async (req, res) => {
// // //   try {
// // //     const { page = 1, limit = 10, from_date, to_date } = req.query;
// // //     const offset = (parseInt(page) - 1) * parseInt(limit);

// // //     const dateFilter = {};
// // //     if (from_date) dateFilter[Op.gte] = from_date;
// // //     if (to_date) dateFilter[Op.lte] = to_date;

// // //     const { count, rows } = await ActiveAllocationModel.findAndCountAll({
// // //       where: {
// // //         status: "Completed",
// // //         ...(Object.keys(dateFilter).length > 0 && {
// // //           allocation_date: dateFilter,
// // //         }),
// // //       },
// // //       include: buildIncludes(),
// // //       offset,
// // //       limit: parseInt(limit),
// // //       order: [["allocation_date", "DESC"]],
// // //       distinct: true,
// // //     });

// // //     const validRows = rows.filter(
// // //       (alloc) =>
// // //         (alloc.equipmentAllocations?.length || 0) > 0 ||
// // //         (alloc.manpowerAllocations?.length || 0) > 0 ||
// // //         (alloc.attachmentAllocations?.length || 0) > 0
// // //     );

// // //     const formatted = validRows.map((alloc) => formatAllocationResponse(alloc));

// // //     // Split into resource-type tabs
// // //     const equipmentOrders = formatted.filter(
// // //       (o) => o.resources.equipment.length > 0
// // //     );
// // //     const manpowerOrders = formatted.filter(
// // //       (o) => o.resources.manpower.length > 0
// // //     );
// // //     const attachmentOrders = formatted.filter(
// // //       (o) => o.resources.attachments.length > 0
// // //     );

// // //     return res.status(200).json({
// // //       totalOrders: count,
// // //       currentPage: parseInt(page),
// // //       totalPages: Math.ceil(count / parseInt(limit)),
// // //       equipment: {
// // //         totalOrders: equipmentOrders.length,
// // //         orders: equipmentOrders,
// // //       },
// // //       manpower: {
// // //         totalOrders: manpowerOrders.length,
// // //         orders: manpowerOrders,
// // //       },
// // //       attachments: {
// // //         totalOrders: attachmentOrders.length,
// // //         orders: attachmentOrders,
// // //       },
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching completed orders:", error);
// // //     return res.status(500).json({
// // //       message: "Error fetching completed orders",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // // ─── Single & SO-level Lookup ─────────────────────────────────────────────────

// // // const getOrderById = async (req, res) => {
// // //   try {
// // //     const { id } = req.params;

// // //     const alloc = await ActiveAllocationModel.findByPk(id, {
// // //       include: buildIncludes(),
// // //     });

// // //     if (!alloc) {
// // //       return res.status(404).json({ message: "Allocation record not found" });
// // //     }

// // //     const raw = alloc.toJSON();
// // //     const scheduledDate = raw.salesOrder
// // //       ? await fetchScheduledDateForSO(raw.salesOrder.id)
// // //       : null;

// // //     return res.status(200).json(
// // //       formatAllocationResponse(alloc, {
// // //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// // //       })
// // //     );
// // //   } catch (error) {
// // //     console.error("Error fetching order by ID:", error);
// // //     return res
// // //       .status(500)
// // //       .json({ message: "Error fetching order", error: error.message });
// // //   }
// // // };

// // // const getOrdersBySalesOrder = async (req, res) => {
// // //   try {
// // //     const { so_id } = req.params;

// // //     const allocations = await ActiveAllocationModel.findAll({
// // //       where: { sales_order_id: so_id },
// // //       include: buildIncludes(),
// // //       order: [["allocation_date", "ASC"]],
// // //     });

// // //     if (!allocations.length) {
// // //       return res.status(404).json({
// // //         message: "No allocations found for this sales order",
// // //         orders: [],
// // //       });
// // //     }

// // //     const scheduledDate = await fetchScheduledDateForSO(parseInt(so_id));

// // //     const formatted = allocations.map((alloc) =>
// // //       formatAllocationResponse(alloc, {
// // //         [alloc.allocation_id]: { scheduled_date: scheduledDate },
// // //       })
// // //     );

// // //     return res.status(200).json({
// // //       so_id: parseInt(so_id),
// // //       totalAllocations: formatted.length,
// // //       orders: formatted,
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching orders by SO:", error);
// // //     return res.status(500).json({
// // //       message: "Error fetching orders by sales order",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // // ─── Filter: Active Orders ─────────────────────────────────────────────────────

// // // /**
// // //  * GET /api/operational-handling/active-orders/filter
// // //  *
// // //  * Filters active orders across Current Shift / Next Shift / Future Orders.
// // //  * Returns three resource-type tabs per shift group.
// // //  *
// // //  * Query params:
// // //  *   so_number          – partial match on SO number
// // //  *   service_option     – exact match on allocation service_option
// // //  *   shift              – SO shift (Day|Night|Full|Day and Night)
// // //  *   scheduled_date_from / scheduled_date_to – scheduled_date range
// // //  *   reg_number         – partial match on equipment reg_number (equipment tab)
// // //  *   employee_no        – partial match on employee number (manpower tab)
// // //  *   attachment_number  – partial match on attachment_number (attachment tab)
// // //  *   page / limit
// // //  */
// // // const getAllFilterActiveOrders = async (req, res) => {
// // //   try {
// // //     const {
// // //       so_number = "",
// // //       service_option = "",
// // //       shift = "",
// // //       scheduled_date_from = "",
// // //       scheduled_date_to = "",
// // //       reg_number = "",
// // //       employee_no = "",
// // //       attachment_number = "",
// // //       page = 1,
// // //       limit = 10,
// // //     } = req.query;

// // //     const {
// // //       currentShiftType,
// // //       currentShiftDate,
// // //       nextShiftType,
// // //       nextShiftDate,
// // //     } = getShiftContext();

// // //     // ── Build SO-level where clause ──
// // //     const soWhere = {};
// // //     if (so_number)
// // //       soWhere.so_number = { [Op.like]: `%${so_number}%` };
// // //     if (shift) soWhere.shift = shift;

// // //     // ── Build equipment sub-include where ──
// // //     const equipmentInclude = {
// // //       model: AllocationEquipmentModel,
// // //       as: "equipmentAllocations",
// // //       include: [
// // //         {
// // //           model: EquipmentModel,
// // //           as: "equipment",
// // //           attributes: [
// // //             "serial_number",
// // //             "reg_number",
// // //             "vehicle_type",
// // //             "equipment_status",
// // //             "equipment_status_note",
// // //           ],
// // //           ...(reg_number && {
// // //             where: { reg_number: { [Op.like]: `%${reg_number}%` } },
// // //           }),
// // //         },
// // //       ],
// // //     };

// // //     // ── Build manpower sub-include where ──
// // //     const manpowerInclude = {
// // //       model: AllocationManpowerModel,
// // //       as: "manpowerAllocations",
// // //       include: [
// // //         {
// // //           model: EmployeeModel,
// // //           as: "employee",
// // //           attributes: ["id", "personalDetails"],
// // //           include: [
// // //             {
// // //               model: ManpowerModel,
// // //               as: "manpower",
// // //               attributes: ["employeeNo", "manpower_status", "operator_type_id"],
// // //               ...(employee_no && {
// // //                 where: { employeeNo: { [Op.like]: `%${employee_no}%` } },
// // //               }),
// // //               include: [
// // //                 {
// // //                   model: OperatorTypeModel,
// // //                   as: "operator_type",
// // //                   attributes: ["operator_type_id", "operator_type"],
// // //                 },
// // //               ],
// // //             },
// // //           ],
// // //         },
// // //       ],
// // //     };

// // //     // ── Build attachment sub-include where ──
// // //     const attachmentInclude = {
// // //       model: AllocationAttachmentModel,
// // //       as: "attachmentAllocations",
// // //       include: [
// // //         {
// // //           model: AttachmentModel,
// // //           as: "attachment",
// // //           attributes: [
// // //             "attachment_id",
// // //             "attachment_number",
// // //             "product_name",
// // //             "serial_number",
// // //             "attachment_status",
// // //           ],
// // //           ...(attachment_number && {
// // //             where: {
// // //               attachment_number: { [Op.like]: `%${attachment_number}%` },
// // //             },
// // //           }),
// // //         },
// // //       ],
// // //     };

// // //     const includes = [
// // //       {
// // //         model: SalesOrdersModel,
// // //         as: "salesOrder",
// // //         attributes: [
// // //           "id",
// // //           "so_number",
// // //           "client",
// // //           "project_name",
// // //           "delivery_address",
// // //           "shift",
// // //           "lpo_number",
// // //           "lpo_validity_date",
// // //           "extended_lpo_validity_date",
// // //           "expected_mobilization_date",
// // //           "expected_demobilization_date",
// // //           "ops_status",
// // //           "so_status",
// // //         ],
// // //         where: Object.keys(soWhere).length ? soWhere : undefined,
// // //         include: [
// // //           {
// // //             model: JobLocationModel,
// // //             as: "jobLocation",
// // //             attributes: ["job_location_id", "job_location_name"],
// // //           },
// // //         ],
// // //       },
// // //       equipmentInclude,
// // //       manpowerInclude,
// // //       attachmentInclude,
// // //     ];

// // //     // ── allocation-level where ──
// // //     const allocWhere = {
// // //       status: { [Op.notIn]: ["Completed", "Cancelled"] },
// // //     };
// // //     if (service_option) allocWhere.service_option = service_option;

// // //     const allAllocations = await ActiveAllocationModel.findAll({
// // //       where: allocWhere,
// // //       include: includes,
// // //       order: [["allocation_date", "ASC"]],
// // //     });

// // //     // Buckets
// // //     const buckets = {
// // //       currentShift: { equipment: [], manpower: [], attachments: [] },
// // //       nextShift: { equipment: [], manpower: [], attachments: [] },
// // //       futureOrders: { equipment: [], manpower: [], attachments: [] },
// // //     };

// // //     for (const alloc of allAllocations) {
// // //       const raw = alloc.toJSON();
// // //       if (!raw.salesOrder) continue;

// // //       // Apply scheduled_date range filter
// // //       if (scheduled_date_from || scheduled_date_to) {
// // //         const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
// // //         if (!scheduledDate) continue;
// // //         if (scheduled_date_from && scheduledDate < scheduled_date_from)
// // //           continue;
// // //         if (scheduled_date_to && scheduledDate > scheduled_date_to) continue;
// // //       }

// // //       const hasResources =
// // //         raw.equipmentAllocations.length > 0 ||
// // //         raw.manpowerAllocations.length > 0 ||
// // //         raw.attachmentAllocations.length > 0;
// // //       if (!hasResources) continue;

// // //       // When resource-level filter is active, skip allocations with no matching resources
// // //       if (reg_number && raw.equipmentAllocations.length === 0) {
// // //         // don't skip entirely – still show in manpower/attachment tabs
// // //       }

// // //       const soShift = raw.salesOrder.shift || "";
// // //       const allocDate = raw.allocation_date;
// // //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// // //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// // //       const formatted = formatAllocationResponse(alloc, {
// // //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// // //       });

// // //       const matchesCurrentShift =
// // //         soShift === currentShiftType ||
// // //         soShift === "Full" ||
// // //         soShift === "Day and Night";
// // //       const matchesNextShift =
// // //         soShift === nextShiftType ||
// // //         soShift === "Full" ||
// // //         soShift === "Day and Night";

// // //       let targetBucket = null;

// // //       if (allocDate === currentShiftDate && matchesCurrentShift) {
// // //         if (
// // //           isInActiveWindow(
// // //             raw.salesOrder,
// // //             scheduledDate,
// // //             currentShiftDate,
// // //             raw.allocation_date
// // //           )
// // //         ) {
// // //           targetBucket = buckets.currentShift;
// // //         }
// // //       } else if (allocDate === nextShiftDate && matchesNextShift) {
// // //         if (
// // //           isInActiveWindow(
// // //             raw.salesOrder,
// // //             scheduledDate,
// // //             nextShiftDate,
// // //             raw.allocation_date
// // //           )
// // //         ) {
// // //           targetBucket = buckets.nextShift;
// // //         }
// // //       } else if (allocDate > nextShiftDate) {
// // //         if (lpoEndDate && lpoEndDate >= allocDate) {
// // //           targetBucket = buckets.futureOrders;
// // //         }
// // //       }

// // //       if (!targetBucket) continue;

// // //       // Only push into a tab if that resource type has entries
// // //       // (respects resource-level filters applied via Sequelize includes)
// // //       if (formatted.resources.equipment.length > 0)
// // //         targetBucket.equipment.push(formatted);
// // //       if (formatted.resources.manpower.length > 0)
// // //         targetBucket.manpower.push(formatted);
// // //       if (formatted.resources.attachments.length > 0)
// // //         targetBucket.attachments.push(formatted);
// // //     }

// // //     // Paginate each tab inside each shift group
// // //     const paginateTab = (orders) => {
// // //       const total = orders.length;
// // //       const offset = (parseInt(page) - 1) * parseInt(limit);
// // //       return {
// // //         totalOrders: total,
// // //         currentPage: parseInt(page),
// // //         totalPages: Math.ceil(total / parseInt(limit)),
// // //         orders: orders.slice(offset, offset + parseInt(limit)),
// // //       };
// // //     };

// // //     const buildShiftResponse = (bucket, extra = {}) => ({
// // //       ...extra,
// // //       equipment: paginateTab(bucket.equipment),
// // //       manpower: paginateTab(bucket.manpower),
// // //       attachments: paginateTab(bucket.attachments),
// // //     });

// // //     return res.status(200).json({
// // //       currentShift: buildShiftResponse(buckets.currentShift, {
// // //         shiftType: currentShiftType,
// // //         shiftDate: currentShiftDate,
// // //       }),
// // //       nextShift: buildShiftResponse(buckets.nextShift, {
// // //         shiftType: nextShiftType,
// // //         shiftDate: nextShiftDate,
// // //       }),
// // //       futureOrders: buildShiftResponse(buckets.futureOrders),
// // //     });
// // //   } catch (error) {
// // //     console.error("Error filtering active orders:", error);
// // //     return res.status(500).json({
// // //       message: "Error filtering active orders",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // // ─── Filter: Completed Orders ─────────────────────────────────────────────────

// // // /**
// // //  * GET /api/operational-handling/completed-orders/filter
// // //  *
// // //  * Filters completed orders and returns resource-type tabs.
// // //  *
// // //  * Query params:
// // //  *   so_number          – partial match
// // //  *   service_option     – exact match
// // //  *   shift              – SO shift
// // //  *   scheduled_date_from / scheduled_date_to
// // //  *   reg_number         – equipment tab filter
// // //  *   employee_no        – manpower tab filter
// // //  *   attachment_number  – attachment tab filter
// // //  *   from_date / to_date – allocation_date range
// // //  *   page / limit
// // //  */
// // // const getFilterCompletedOrders = async (req, res) => {
// // //   try {
// // //     const {
// // //       so_number = "",
// // //       service_option = "",
// // //       shift = "",
// // //       scheduled_date_from = "",
// // //       scheduled_date_to = "",
// // //       reg_number = "",
// // //       employee_no = "",
// // //       attachment_number = "",
// // //       from_date = "",
// // //       to_date = "",
// // //       page = 1,
// // //       limit = 10,
// // //     } = req.query;

// // //     // ── SO-level filter ──
// // //     const soWhere = {};
// // //     if (so_number) soWhere.so_number = { [Op.like]: `%${so_number}%` };
// // //     if (shift) soWhere.shift = shift;

// // //     // ── Resource-level includes with optional filters ──
// // //     const equipmentInclude = {
// // //       model: AllocationEquipmentModel,
// // //       as: "equipmentAllocations",
// // //       include: [
// // //         {
// // //           model: EquipmentModel,
// // //           as: "equipment",
// // //           attributes: [
// // //             "serial_number",
// // //             "reg_number",
// // //             "vehicle_type",
// // //             "equipment_status",
// // //             "equipment_status_note",
// // //           ],
// // //           ...(reg_number && {
// // //             where: { reg_number: { [Op.like]: `%${reg_number}%` } },
// // //           }),
// // //         },
// // //       ],
// // //     };

// // //     const manpowerInclude = {
// // //       model: AllocationManpowerModel,
// // //       as: "manpowerAllocations",
// // //       include: [
// // //         {
// // //           model: EmployeeModel,
// // //           as: "employee",
// // //           attributes: ["id", "personalDetails"],
// // //           include: [
// // //             {
// // //               model: ManpowerModel,
// // //               as: "manpower",
// // //               attributes: ["employeeNo", "manpower_status", "operator_type_id"],
// // //               ...(employee_no && {
// // //                 where: { employeeNo: { [Op.like]: `%${employee_no}%` } },
// // //               }),
// // //               include: [
// // //                 {
// // //                   model: OperatorTypeModel,
// // //                   as: "operator_type",
// // //                   attributes: ["operator_type_id", "operator_type"],
// // //                 },
// // //               ],
// // //             },
// // //           ],
// // //         },
// // //       ],
// // //     };

// // //     const attachmentInclude = {
// // //       model: AllocationAttachmentModel,
// // //       as: "attachmentAllocations",
// // //       include: [
// // //         {
// // //           model: AttachmentModel,
// // //           as: "attachment",
// // //           attributes: [
// // //             "attachment_id",
// // //             "attachment_number",
// // //             "product_name",
// // //             "serial_number",
// // //             "attachment_status",
// // //           ],
// // //           ...(attachment_number && {
// // //             where: {
// // //               attachment_number: { [Op.like]: `%${attachment_number}%` },
// // //             },
// // //           }),
// // //         },
// // //       ],
// // //     };

// // //     const includes = [
// // //       {
// // //         model: SalesOrdersModel,
// // //         as: "salesOrder",
// // //         attributes: [
// // //           "id",
// // //           "so_number",
// // //           "client",
// // //           "project_name",
// // //           "delivery_address",
// // //           "shift",
// // //           "lpo_number",
// // //           "lpo_validity_date",
// // //           "extended_lpo_validity_date",
// // //           "expected_mobilization_date",
// // //           "expected_demobilization_date",
// // //           "ops_status",
// // //           "so_status",
// // //         ],
// // //         where: Object.keys(soWhere).length ? soWhere : undefined,
// // //         include: [
// // //           {
// // //             model: JobLocationModel,
// // //             as: "jobLocation",
// // //             attributes: ["job_location_id", "job_location_name"],
// // //           },
// // //         ],
// // //       },
// // //       equipmentInclude,
// // //       manpowerInclude,
// // //       attachmentInclude,
// // //     ];

// // //     // ── Allocation-level where ──
// // //     const allocWhere = { status: "Completed" };
// // //     if (service_option) allocWhere.service_option = service_option;
// // //     if (from_date || to_date) {
// // //       allocWhere.allocation_date = {};
// // //       if (from_date) allocWhere.allocation_date[Op.gte] = from_date;
// // //       if (to_date) allocWhere.allocation_date[Op.lte] = to_date;
// // //     }

// // //     const allAllocations = await ActiveAllocationModel.findAll({
// // //       where: allocWhere,
// // //       include: includes,
// // //       order: [["allocation_date", "DESC"]],
// // //     });

// // //     const allFormatted = [];

// // //     for (const alloc of allAllocations) {
// // //       const raw = alloc.toJSON();
// // //       if (!raw.salesOrder) continue;

// // //       // Scheduled date range filter
// // //       if (scheduled_date_from || scheduled_date_to) {
// // //         const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
// // //         if (!scheduledDate) continue;
// // //         if (scheduled_date_from && scheduledDate < scheduled_date_from)
// // //           continue;
// // //         if (scheduled_date_to && scheduledDate > scheduled_date_to) continue;
// // //       }

// // //       const hasResources =
// // //         raw.equipmentAllocations.length > 0 ||
// // //         raw.manpowerAllocations.length > 0 ||
// // //         raw.attachmentAllocations.length > 0;
// // //       if (!hasResources) continue;

// // //       allFormatted.push(formatAllocationResponse(alloc));
// // //     }

// // //     // Split into tabs
// // //     const equipmentOrders = allFormatted.filter(
// // //       (o) => o.resources.equipment.length > 0
// // //     );
// // //     const manpowerOrders = allFormatted.filter(
// // //       (o) => o.resources.manpower.length > 0
// // //     );
// // //     const attachmentOrders = allFormatted.filter(
// // //       (o) => o.resources.attachments.length > 0
// // //     );

// // //     const paginateTab = (orders) => {
// // //       const total = orders.length;
// // //       const offset = (parseInt(page) - 1) * parseInt(limit);
// // //       return {
// // //         totalOrders: total,
// // //         currentPage: parseInt(page),
// // //         totalPages: Math.ceil(total / parseInt(limit)),
// // //         orders: orders.slice(offset, offset + parseInt(limit)),
// // //       };
// // //     };

// // //     return res.status(200).json({
// // //       equipment: paginateTab(equipmentOrders),
// // //       manpower: paginateTab(manpowerOrders),
// // //       attachments: paginateTab(attachmentOrders),
// // //     });
// // //   } catch (error) {
// // //     console.error("Error filtering completed orders:", error);
// // //     return res.status(500).json({
// // //       message: "Error filtering completed orders",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // // ─── Debug (TEMP) ─────────────────────────────────────────────────────────────

// // // const debugOrders = async (req, res) => {
// // //   try {
// // //     const {
// // //       currentShiftType,
// // //       currentShiftDate,
// // //       nextShiftType,
// // //       nextShiftDate,
// // //     } = getShiftContext();

// // //     const allAllocations = await ActiveAllocationModel.findAll({
// // //       include: buildIncludes(),
// // //       order: [["allocation_date", "ASC"]],
// // //     });

// // //     const debugReport = [];

// // //     for (const alloc of allAllocations) {
// // //       const raw = alloc.toJSON();
// // //       const report = {
// // //         allocation_id: raw.allocation_id,
// // //         allocation_date: raw.allocation_date,
// // //         status: raw.status,
// // //         sales_order_id: raw.sales_order_id,
// // //         checks: {},
// // //       };

// // //       report.checks.statusOk = !["Completed", "Cancelled"].includes(
// // //         raw.status
// // //       );
// // //       report.checks.salesOrderLoaded = !!raw.salesOrder;

// // //       if (raw.salesOrder) {
// // //         report.salesOrder = {
// // //           id: raw.salesOrder.id,
// // //           shift: raw.salesOrder.shift,
// // //           lpo_validity_date: raw.salesOrder.lpo_validity_date,
// // //           extended_lpo_validity_date: raw.salesOrder.extended_lpo_validity_date,
// // //           ops_status: raw.salesOrder.ops_status,
// // //           so_status: raw.salesOrder.so_status,
// // //         };
// // //       }

// // //       const eqCount = raw.equipmentAllocations?.length || 0;
// // //       const mpCount = raw.manpowerAllocations?.length || 0;
// // //       const attCount = raw.attachmentAllocations?.length || 0;
// // //       report.checks.hasResources = eqCount > 0 || mpCount > 0 || attCount > 0;
// // //       report.resourceCounts = {
// // //         equipment: eqCount,
// // //         manpower: mpCount,
// // //         attachments: attCount,
// // //       };

// // //       if (raw.salesOrder) {
// // //         const soShift = raw.salesOrder.shift || "";
// // //         report.checks.matchesCurrentShift =
// // //           soShift === currentShiftType ||
// // //           soShift === "Full" ||
// // //           soShift === "Day and Night";
// // //         report.checks.matchesNextShift =
// // //           soShift === nextShiftType ||
// // //           soShift === "Full" ||
// // //           soShift === "Day and Night";
// // //         report.checks.soShiftValue = soShift;
// // //         report.checks.currentShiftType = currentShiftType;
// // //       }

// // //       report.checks.allocationDateMatchesCurrentShift =
// // //         raw.allocation_date === currentShiftDate;
// // //       report.checks.allocationDateMatchesNextShift =
// // //         raw.allocation_date === nextShiftDate;
// // //       report.checks.currentShiftDate = currentShiftDate;
// // //       report.checks.nextShiftDate = nextShiftDate;

// // //       if (raw.salesOrder) {
// // //         const soId = raw.salesOrder.id;
// // //         const scheduledDate = await fetchScheduledDateForSO(soId);
// // //         const lpoEndDate = getLpoEndDate(raw.salesOrder);
// // //         const effectiveStart =
// // //           scheduledDate || raw.allocation_date || currentShiftDate;

// // //         report.checks.scheduledDate = scheduledDate;
// // //         report.checks.lpoEndDate = lpoEndDate;
// // //         report.checks.effectiveStart = effectiveStart;
// // //         report.checks.activeWindowForCurrentShift = isInActiveWindow(
// // //           raw.salesOrder,
// // //           scheduledDate,
// // //           currentShiftDate,
// // //           raw.allocation_date
// // //         );
// // //         report.checks.activeWindowForNextShift = isInActiveWindow(
// // //           raw.salesOrder,
// // //           scheduledDate,
// // //           nextShiftDate,
// // //           raw.allocation_date
// // //         );
// // //       }

// // //       report.wouldAppearInCurrentShift =
// // //         report.checks.statusOk &&
// // //         report.checks.salesOrderLoaded &&
// // //         report.checks.hasResources &&
// // //         report.checks.matchesCurrentShift &&
// // //         report.checks.allocationDateMatchesCurrentShift &&
// // //         report.checks.activeWindowForCurrentShift;

// // //       report.wouldAppearInNextShift =
// // //         report.checks.statusOk &&
// // //         report.checks.salesOrderLoaded &&
// // //         report.checks.hasResources &&
// // //         report.checks.matchesNextShift &&
// // //         report.checks.allocationDateMatchesNextShift &&
// // //         report.checks.activeWindowForNextShift;

// // //       debugReport.push(report);
// // //     }

// // //     return res.status(200).json({
// // //       serverTime: new Date().toISOString(),
// // //       shiftContext: {
// // //         currentShiftType,
// // //         currentShiftDate,
// // //         nextShiftType,
// // //         nextShiftDate,
// // //       },
// // //       totalAllocationsInDB: debugReport.length,
// // //       allocations: debugReport,
// // //     });
// // //   } catch (error) {
// // //     console.error("Debug error:", error);
// // //     return res.status(500).json({
// // //       message: "Debug error",
// // //       error: error.message,
// // //       stack: error.stack,
// // //     });
// // //   }
// // // };

// // // module.exports = {
// // //   getShiftInfo,
// // //   getCurrentShiftOrders,
// // //   getNextShiftOrders,
// // //   getFutureOrders,
// // //   getAllActiveOrders,
// // //   getCompletedOrders,
// // //   getOrderById,
// // //   getOrdersBySalesOrder,
// // //   getAllFilterActiveOrders,   // NEW
// // //   getFilterCompletedOrders,  // NEW
// // //   debugOrders,               // TEMP: remove before production
// // // };

// // const { Op } = require("sequelize");
// // const {
// //   ActiveAllocationModel,
// //   AllocationEquipmentModel,
// //   AllocationManpowerModel,
// //   AllocationAttachmentModel,
// // } = require("../../models/fleet-management/ActiveAllocationsOriginalModel");
// // const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// // const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// // const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
// // const EmployeeModel = require("../../models/hr/employees/EmployeeModel");
// // const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
// // const JobLocationModel = require("../../models/fleet-management/JobLocationModel");
// // const EquipmentScheduledModel = require("../../models/fleet-management/EquipmentScheduledModel");
// // const ManpowerScheduledModel = require("../../models/fleet-management/ManpowerScheduledModel");
// // const AttachmentScheduledModel = require("../../models/fleet-management/AttachmentScheduledModel");
// // const OperatorTypeModel = require("../../models/fleet-management/OperatorTypeModel");

// // // ─── Shift Helpers ────────────────────────────────────────────────────────────

// // const toDateStr = (d) => d.toISOString().split("T")[0];

// // const getShiftContext = () => {
// //   const now = new Date();
// //   const hours = now.getHours();
// //   const isDay = hours >= 6 && hours <= 17;

// //   const today = toDateStr(now);
// //   const tomorrow = toDateStr(
// //     new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
// //   );

// //   if (isDay) {
// //     return {
// //       currentShiftType: "Day",
// //       currentShiftDate: today,
// //       nextShiftType: "Night",
// //       nextShiftDate: today,
// //       futureAfterDate: today,
// //     };
// //   } else {
// //     return {
// //       currentShiftType: "Night",
// //       currentShiftDate: today,
// //       nextShiftType: "Day",
// //       nextShiftDate: tomorrow,
// //       futureAfterDate: tomorrow,
// //     };
// //   }
// // };

// // const getLpoEndDate = (so) =>
// //   so.extended_lpo_validity_date || so.lpo_validity_date || null;

// // // ─── Include Builder ──────────────────────────────────────────────────────────

// // const buildIncludes = () => [
// //   {
// //     model: SalesOrdersModel,
// //     as: "salesOrder",
// //     attributes: [
// //       "id",
// //       "so_number",
// //       "client",
// //       "project_name",
// //       "delivery_address",
// //       "shift",
// //       "lpo_number",
// //       "lpo_validity_date",
// //       "extended_lpo_validity_date",
// //       "expected_mobilization_date",
// //       "expected_demobilization_date",
// //       "ops_status",
// //       "so_status",
// //     ],
// //     include: [
// //       {
// //         model: JobLocationModel,
// //         as: "jobLocation",
// //         attributes: ["job_location_id", "job_location_name"],
// //       },
// //     ],
// //   },
// //   {
// //     model: AllocationEquipmentModel,
// //     as: "equipmentAllocations",
// //     include: [
// //       {
// //         model: EquipmentModel,
// //         as: "equipment",
// //         attributes: [
// //           "serial_number",
// //           "reg_number",
// //           "vehicle_type",
// //           "equipment_status",
// //           "equipment_status_note",
// //         ],
// //       },
// //     ],
// //   },
// //   {
// //     model: AllocationManpowerModel,
// //     as: "manpowerAllocations",
// //     include: [
// //       {
// //         model: EmployeeModel,
// //         as: "employee",
// //         attributes: ["id", "personalDetails"],
// //         include: [
// //           {
// //             model: ManpowerModel,
// //             as: "manpower",
// //             attributes: ["employeeNo", "manpower_status", "operator_type_id"],
// //             include: [
// //               {
// //                 model: OperatorTypeModel,
// //                 as: "operator_type",
// //                 attributes: ["operator_type_id", "operator_type"],
// //               },
// //             ],
// //           },
// //         ],
// //       },
// //     ],
// //   },
// //   {
// //     model: AllocationAttachmentModel,
// //     as: "attachmentAllocations",
// //     include: [
// //       {
// //         model: AttachmentModel,
// //         as: "attachment",
// //         attributes: [
// //           "attachment_id",
// //           "attachment_number",
// //           "product_name",
// //           "serial_number",
// //           "attachment_status",
// //         ],
// //       },
// //     ],
// //   },
// // ];

// // // ─── Response Formatter ───────────────────────────────────────────────────────

// // /**
// //  * Formats one allocation into the standard response shape.
// //  *
// //  * Response shape:
// //  * {
// //  *   allocation_id, allocation_date, status, service_option, user_remarks,
// //  *   salesOrder,
// //  *   resources: {
// //  *     equipment:   [ { resource_type, allocation_detail, equipment_info } ],
// //  *     manpower:    [ { resource_type, allocation_detail, employee_info   } ],
// //  *     attachments: [ { resource_type, allocation_detail, attachment_info } ],
// //  *     summary: { total_equipment, total_manpower, total_attachments, total_resources }
// //  *   },
// //  *   scheduled_dates: { scheduled_date } | null
// //  * }
// //  */
// // const formatAllocationResponse = (allocation, scheduledDatesMap = {}) => {
// //   const raw = allocation.toJSON ? allocation.toJSON() : allocation;

// //   const equipmentList = (raw.equipmentAllocations || []).map((eq) => ({
// //     resource_type: "equipment",
// //     allocation_detail: {
// //       id: eq.id,
// //       allocation_id: eq.allocation_id,
// //       serial_number: eq.serial_number,
// //       eqt_stu: eq.eqt_stu,
// //       status: eq.status,
// //       note: eq.note,
// //       is_selected: eq.is_selected,
// //     },
// //     equipment_info: eq.equipment
// //       ? {
// //           serial_number: eq.equipment.serial_number,
// //           reg_number: eq.equipment.reg_number,
// //           vehicle_type: eq.equipment.vehicle_type,
// //           equipment_status: eq.equipment.equipment_status,
// //           equipment_status_note: eq.equipment.equipment_status_note,
// //         }
// //       : null,
// //   }));

// //   const manpowerList = (raw.manpowerAllocations || []).map((mp) => ({
// //     resource_type: "manpower",
// //     allocation_detail: {
// //       id: mp.id,
// //       allocation_id: mp.allocation_id,
// //       employee_id: mp.employee_id,
// //       man_stu: mp.man_stu,
// //       status: mp.status,
// //       note: mp.note,
// //       is_selected: mp.is_selected,
// //     },
// //     employee_info: mp.employee
// //       ? {
// //           id: mp.employee.id,
// //           full_name: mp.employee.personalDetails?.fullNameEnglish || null,
// //           employee_no: mp.employee.manpower?.[0]?.employeeNo || null,
// //           manpower_status: mp.employee.manpower?.[0]?.manpower_status || null,
// //           operator_type:
// //             mp.employee.manpower?.[0]?.operator_type?.operator_type || null,
// //         }
// //       : null,
// //   }));

// //   const attachmentList = (raw.attachmentAllocations || []).map((att) => ({
// //     resource_type: "attachment",
// //     allocation_detail: {
// //       id: att.id,
// //       allocation_id: att.allocation_id,
// //       attachment_id: att.attachment_id,
// //       att_stu: att.att_stu,
// //       status: att.status,
// //       note: att.note,
// //       is_selected: att.is_selected,
// //     },
// //     attachment_info: att.attachment
// //       ? {
// //           attachment_id: att.attachment.attachment_id,
// //           attachment_number: att.attachment.attachment_number,
// //           product_name: att.attachment.product_name,
// //           serial_number: att.attachment.serial_number,
// //           attachment_status: att.attachment.attachment_status,
// //         }
// //       : null,
// //   }));

// //   return {
// //     allocation_id: raw.allocation_id,
// //     allocation_date: raw.allocation_date,
// //     status: raw.status,
// //     service_option: raw.service_option,
// //     user_remarks: raw.user_remarks,
// //     salesOrder: raw.salesOrder,
// //     resources: {
// //       equipment: equipmentList,
// //       manpower: manpowerList,
// //       attachments: attachmentList,
// //       summary: {
// //         total_equipment: equipmentList.length,
// //         total_manpower: manpowerList.length,
// //         total_attachments: attachmentList.length,
// //         total_resources:
// //           equipmentList.length + manpowerList.length + attachmentList.length,
// //       },
// //     },
// //     scheduled_dates: scheduledDatesMap[raw.allocation_id] || null,
// //   };
// // };

// // const fetchScheduledDateForSO = async (soId) => {
// //   const findEarliest = async (Model) => {
// //     let record = await Model.findOne({
// //       where: { so_id: soId, is_selected: true },
// //       order: [["scheduled_date", "ASC"]],
// //       attributes: ["scheduled_date"],
// //     });
// //     if (!record) {
// //       record = await Model.findOne({
// //         where: { so_id: soId },
// //         order: [["scheduled_date", "ASC"]],
// //         attributes: ["scheduled_date"],
// //       });
// //     }
// //     return record?.scheduled_date || null;
// //   };

// //   const [eqDate, mpDate, attDate] = await Promise.all([
// //     findEarliest(EquipmentScheduledModel),
// //     findEarliest(ManpowerScheduledModel),
// //     findEarliest(AttachmentScheduledModel),
// //   ]);

// //   const dates = [eqDate, mpDate, attDate].filter(Boolean).sort();
// //   return dates[0] || null;
// // };

// // const isInActiveWindow = (
// //   salesOrder,
// //   scheduledDate,
// //   referenceDate,
// //   allocationDate = null
// // ) => {
// //   const lpoEndDate = getLpoEndDate(salesOrder);
// //   const effectiveStart = scheduledDate || allocationDate || referenceDate;

// //   if (!lpoEndDate) {
// //     return effectiveStart <= referenceDate;
// //   }

// //   return effectiveStart <= referenceDate && lpoEndDate >= referenceDate;
// // };

// // // ─── Controller Functions ─────────────────────────────────────────────────────

// // const getShiftInfo = async (req, res) => {
// //   try {
// //     const info = getShiftContext();
// //     return res.status(200).json({
// //       serverTime: new Date().toISOString(),
// //       ...info,
// //       shiftWindows: {
// //         day: "06:00 – 17:59",
// //         night: "18:00 – 05:59 (next day)",
// //       },
// //     });
// //   } catch (error) {
// //     return res.status(500).json({ message: error.message });
// //   }
// // };

// // const getCurrentShiftOrders = async (req, res) => {
// //   try {
// //     const { page = 1, limit = 10 } = req.query;
// //     const { currentShiftType, currentShiftDate } = getShiftContext();

// //     const allocations = await ActiveAllocationModel.findAll({
// //       where: {
// //         allocation_date: currentShiftDate,
// //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// //       },
// //       include: buildIncludes(),
// //       order: [["createdAt", "ASC"]],
// //     });

// //     const result = [];

// //     for (const alloc of allocations) {
// //       const raw = alloc.toJSON();

// //       const hasResources =
// //         raw.equipmentAllocations.length > 0 ||
// //         raw.manpowerAllocations.length > 0 ||
// //         raw.attachmentAllocations.length > 0;

// //       if (!hasResources || !raw.salesOrder) continue;

// //       const soShift = raw.salesOrder.shift || "";
// //       const matchesShift =
// //         soShift === currentShiftType ||
// //         soShift === "Full" ||
// //         soShift === "Day and Night";

// //       if (!matchesShift) continue;

// //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// //       if (
// //         !isInActiveWindow(
// //           raw.salesOrder,
// //           scheduledDate,
// //           currentShiftDate,
// //           raw.allocation_date
// //         )
// //       )
// //         continue;

// //       result.push(
// //         formatAllocationResponse(alloc, {
// //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// //         })
// //       );
// //     }

// //     const total = result.length;
// //     const offset = (parseInt(page) - 1) * parseInt(limit);
// //     const paginated = result.slice(offset, offset + parseInt(limit));

// //     return res.status(200).json({
// //       shiftType: currentShiftType,
// //       shiftDate: currentShiftDate,
// //       totalOrders: total,
// //       currentPage: parseInt(page),
// //       totalPages: Math.ceil(total / parseInt(limit)),
// //       orders: paginated,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching current shift orders:", error);
// //     return res.status(500).json({
// //       message: "Error fetching current shift orders",
// //       error: error.message,
// //     });
// //   }
// // };

// // const getNextShiftOrders = async (req, res) => {
// //   try {
// //     const { page = 1, limit = 10 } = req.query;
// //     const { nextShiftType, nextShiftDate } = getShiftContext();

// //     const allocations = await ActiveAllocationModel.findAll({
// //       where: {
// //         allocation_date: nextShiftDate,
// //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// //       },
// //       include: buildIncludes(),
// //       order: [["createdAt", "ASC"]],
// //     });

// //     const result = [];

// //     for (const alloc of allocations) {
// //       const raw = alloc.toJSON();

// //       const hasResources =
// //         raw.equipmentAllocations.length > 0 ||
// //         raw.manpowerAllocations.length > 0 ||
// //         raw.attachmentAllocations.length > 0;

// //       if (!hasResources || !raw.salesOrder) continue;

// //       const soShift = raw.salesOrder.shift || "";
// //       const matchesShift =
// //         soShift === nextShiftType ||
// //         soShift === "Full" ||
// //         soShift === "Day and Night";

// //       if (!matchesShift) continue;

// //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// //       if (
// //         !isInActiveWindow(
// //           raw.salesOrder,
// //           scheduledDate,
// //           nextShiftDate,
// //           raw.allocation_date
// //         )
// //       )
// //         continue;

// //       result.push(
// //         formatAllocationResponse(alloc, {
// //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// //         })
// //       );
// //     }

// //     const total = result.length;
// //     const offset = (parseInt(page) - 1) * parseInt(limit);
// //     const paginated = result.slice(offset, offset + parseInt(limit));

// //     return res.status(200).json({
// //       shiftType: nextShiftType,
// //       shiftDate: nextShiftDate,
// //       totalOrders: total,
// //       currentPage: parseInt(page),
// //       totalPages: Math.ceil(total / parseInt(limit)),
// //       orders: paginated,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching next shift orders:", error);
// //     return res.status(500).json({
// //       message: "Error fetching next shift orders",
// //       error: error.message,
// //     });
// //   }
// // };

// // const getFutureOrders = async (req, res) => {
// //   try {
// //     const { page = 1, limit = 10 } = req.query;
// //     const { nextShiftDate } = getShiftContext();

// //     const allocations = await ActiveAllocationModel.findAll({
// //       where: {
// //         allocation_date: { [Op.gt]: nextShiftDate },
// //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// //       },
// //       include: buildIncludes(),
// //       order: [["allocation_date", "ASC"]],
// //     });

// //     const result = [];

// //     for (const alloc of allocations) {
// //       const raw = alloc.toJSON();

// //       const hasResources =
// //         raw.equipmentAllocations.length > 0 ||
// //         raw.manpowerAllocations.length > 0 ||
// //         raw.attachmentAllocations.length > 0;

// //       if (!hasResources || !raw.salesOrder) continue;

// //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// //       if (!lpoEndDate || lpoEndDate < raw.allocation_date) continue;

// //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// //       result.push(
// //         formatAllocationResponse(alloc, {
// //           [raw.allocation_id]: { scheduled_date: scheduledDate },
// //         })
// //       );
// //     }

// //     const total = result.length;
// //     const offset = (parseInt(page) - 1) * parseInt(limit);
// //     const paginated = result.slice(offset, offset + parseInt(limit));

// //     return res.status(200).json({
// //       totalOrders: total,
// //       currentPage: parseInt(page),
// //       totalPages: Math.ceil(total / parseInt(limit)),
// //       orders: paginated,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching future orders:", error);
// //     return res.status(500).json({
// //       message: "Error fetching future orders",
// //       error: error.message,
// //     });
// //   }
// // };

// // /**
// //  * GET /api/operational-handling/active-orders
// //  *
// //  * Combined response structure:
// //  * {
// //  *   currentShift: {
// //  *     shiftType, shiftDate, totalOrders,
// //  *     equipment:   { totalOrders, orders: [ ...formatted ] },
// //  *     manpower:    { totalOrders, orders: [ ...formatted ] },
// //  *     attachments: { totalOrders, orders: [ ...formatted ] },
// //  *   },
// //  *   nextShift: { ... same ... },
// //  *   futureOrders: { totalOrders, equipment, manpower, attachments }
// //  * }
// //  *
// //  * Each "order" inside equipment/manpower/attachments tabs still carries the full
// //  * allocation object (so the frontend can show SO details) but the tab determines
// //  * which resource type is being highlighted/listed.
// //  */
// // const getAllActiveOrders = async (req, res) => {
// //   try {
// //     const {
// //       currentShiftType,
// //       currentShiftDate,
// //       nextShiftType,
// //       nextShiftDate,
// //     } = getShiftContext();

// //     const allAllocations = await ActiveAllocationModel.findAll({
// //       where: {
// //         status: { [Op.notIn]: ["Completed", "Cancelled"] },
// //       },
// //       include: buildIncludes(),
// //       order: [["allocation_date", "ASC"]],
// //     });

// //     // Buckets per shift → per resource type
// //     const buckets = {
// //       currentShift: { equipment: [], manpower: [], attachments: [] },
// //       nextShift: { equipment: [], manpower: [], attachments: [] },
// //       futureOrders: { equipment: [], manpower: [], attachments: [] },
// //     };

// //     for (const alloc of allAllocations) {
// //       const raw = alloc.toJSON();

// //       const hasResources =
// //         raw.equipmentAllocations.length > 0 ||
// //         raw.manpowerAllocations.length > 0 ||
// //         raw.attachmentAllocations.length > 0;

// //       if (!hasResources || !raw.salesOrder) continue;

// //       const soShift = raw.salesOrder.shift || "";
// //       const allocDate = raw.allocation_date;
// //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// //       const formatted = formatAllocationResponse(alloc, {
// //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// //       });

// //       const matchesCurrentShift =
// //         soShift === currentShiftType ||
// //         soShift === "Full" ||
// //         soShift === "Day and Night";
// //       const matchesNextShift =
// //         soShift === nextShiftType ||
// //         soShift === "Full" ||
// //         soShift === "Day and Night";

// //       let targetBucket = null;

// //       if (allocDate === currentShiftDate && matchesCurrentShift) {
// //         if (
// //           isInActiveWindow(
// //             raw.salesOrder,
// //             scheduledDate,
// //             currentShiftDate,
// //             raw.allocation_date
// //           )
// //         ) {
// //           targetBucket = buckets.currentShift;
// //         }
// //       } else if (allocDate === nextShiftDate && matchesNextShift) {
// //         if (
// //           isInActiveWindow(
// //             raw.salesOrder,
// //             scheduledDate,
// //             nextShiftDate,
// //             raw.allocation_date
// //           )
// //         ) {
// //           targetBucket = buckets.nextShift;
// //         }
// //       } else if (allocDate > nextShiftDate) {
// //         if (lpoEndDate && lpoEndDate >= allocDate) {
// //           targetBucket = buckets.futureOrders;
// //         }
// //       }

// //       if (!targetBucket) continue;

// //       // Push into resource-type tabs
// //       if (formatted.resources.equipment.length > 0)
// //         targetBucket.equipment.push(formatted);
// //       if (formatted.resources.manpower.length > 0)
// //         targetBucket.manpower.push(formatted);
// //       if (formatted.resources.attachments.length > 0)
// //         targetBucket.attachments.push(formatted);
// //     }

// //     const buildShiftResponse = (bucket, extra = {}) => ({
// //       ...extra,
// //       totalOrders:
// //         new Set([
// //           ...bucket.equipment.map((o) => o.allocation_id),
// //           ...bucket.manpower.map((o) => o.allocation_id),
// //           ...bucket.attachments.map((o) => o.allocation_id),
// //         ]).size,
// //       equipment: {
// //         totalOrders: bucket.equipment.length,
// //         orders: bucket.equipment,
// //       },
// //       manpower: {
// //         totalOrders: bucket.manpower.length,
// //         orders: bucket.manpower,
// //       },
// //       attachments: {
// //         totalOrders: bucket.attachments.length,
// //         orders: bucket.attachments,
// //       },
// //     });

// //     return res.status(200).json({
// //       currentShift: buildShiftResponse(buckets.currentShift, {
// //         shiftType: currentShiftType,
// //         shiftDate: currentShiftDate,
// //       }),
// //       nextShift: buildShiftResponse(buckets.nextShift, {
// //         shiftType: nextShiftType,
// //         shiftDate: nextShiftDate,
// //       }),
// //       futureOrders: buildShiftResponse(buckets.futureOrders),
// //     });
// //   } catch (error) {
// //     console.error("Error fetching all active orders:", error);
// //     return res.status(500).json({
// //       message: "Error fetching all active orders",
// //       error: error.message,
// //     });
// //   }
// // };

// // // ─── Completed Orders ─────────────────────────────────────────────────────────

// // /**
// //  * GET /api/operational-handling/completed-orders
// //  *
// //  * Response structure:
// //  * {
// //  *   totalOrders,
// //  *   currentPage,
// //  *   totalPages,
// //  *   equipment:   { totalOrders, orders: [...] },
// //  *   manpower:    { totalOrders, orders: [...] },
// //  *   attachments: { totalOrders, orders: [...] },
// //  * }
// //  *
// //  * Each tab lists full allocation objects where that resource type exists.
// //  */
// // const getCompletedOrders = async (req, res) => {
// //   try {
// //     const { page = 1, limit = 10, from_date, to_date } = req.query;
// //     const offset = (parseInt(page) - 1) * parseInt(limit);

// //     const dateFilter = {};
// //     if (from_date) dateFilter[Op.gte] = from_date;
// //     if (to_date) dateFilter[Op.lte] = to_date;

// //     const { count, rows } = await ActiveAllocationModel.findAndCountAll({
// //       where: {
// //         status: "Completed",
// //         ...(Object.keys(dateFilter).length > 0 && {
// //           allocation_date: dateFilter,
// //         }),
// //       },
// //       include: buildIncludes(),
// //       offset,
// //       limit: parseInt(limit),
// //       order: [["allocation_date", "DESC"]],
// //       distinct: true,
// //     });

// //     const validRows = rows.filter(
// //       (alloc) =>
// //         (alloc.equipmentAllocations?.length || 0) > 0 ||
// //         (alloc.manpowerAllocations?.length || 0) > 0 ||
// //         (alloc.attachmentAllocations?.length || 0) > 0
// //     );

// //     const formatted = validRows.map((alloc) => formatAllocationResponse(alloc));

// //     // Split into resource-type tabs
// //     const equipmentOrders = formatted.filter(
// //       (o) => o.resources.equipment.length > 0
// //     );
// //     const manpowerOrders = formatted.filter(
// //       (o) => o.resources.manpower.length > 0
// //     );
// //     const attachmentOrders = formatted.filter(
// //       (o) => o.resources.attachments.length > 0
// //     );

// //     return res.status(200).json({
// //       totalOrders: count,
// //       currentPage: parseInt(page),
// //       totalPages: Math.ceil(count / parseInt(limit)),
// //       equipment: {
// //         totalOrders: equipmentOrders.length,
// //         orders: equipmentOrders,
// //       },
// //       manpower: {
// //         totalOrders: manpowerOrders.length,
// //         orders: manpowerOrders,
// //       },
// //       attachments: {
// //         totalOrders: attachmentOrders.length,
// //         orders: attachmentOrders,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Error fetching completed orders:", error);
// //     return res.status(500).json({
// //       message: "Error fetching completed orders",
// //       error: error.message,
// //     });
// //   }
// // };

// // // ─── Single & SO-level Lookup ─────────────────────────────────────────────────

// // const getOrderById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const alloc = await ActiveAllocationModel.findByPk(id, {
// //       include: buildIncludes(),
// //     });

// //     if (!alloc) {
// //       return res.status(404).json({ message: "Allocation record not found" });
// //     }

// //     const raw = alloc.toJSON();
// //     const scheduledDate = raw.salesOrder
// //       ? await fetchScheduledDateForSO(raw.salesOrder.id)
// //       : null;

// //     return res.status(200).json(
// //       formatAllocationResponse(alloc, {
// //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// //       })
// //     );
// //   } catch (error) {
// //     console.error("Error fetching order by ID:", error);
// //     return res
// //       .status(500)
// //       .json({ message: "Error fetching order", error: error.message });
// //   }
// // };

// // const getOrdersBySalesOrder = async (req, res) => {
// //   try {
// //     const { so_id } = req.params;

// //     const allocations = await ActiveAllocationModel.findAll({
// //       where: { sales_order_id: so_id },
// //       include: buildIncludes(),
// //       order: [["allocation_date", "ASC"]],
// //     });

// //     if (!allocations.length) {
// //       return res.status(404).json({
// //         message: "No allocations found for this sales order",
// //         orders: [],
// //       });
// //     }

// //     const scheduledDate = await fetchScheduledDateForSO(parseInt(so_id));

// //     const formatted = allocations.map((alloc) =>
// //       formatAllocationResponse(alloc, {
// //         [alloc.allocation_id]: { scheduled_date: scheduledDate },
// //       })
// //     );

// //     return res.status(200).json({
// //       so_id: parseInt(so_id),
// //       totalAllocations: formatted.length,
// //       orders: formatted,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching orders by SO:", error);
// //     return res.status(500).json({
// //       message: "Error fetching orders by sales order",
// //       error: error.message,
// //     });
// //   }
// // };

// // // ─── Filter: Active Orders ─────────────────────────────────────────────────────

// // /**
// //  * GET /api/operational-handling/active-orders/filter
// //  *
// //  * Filters active orders across Current Shift / Next Shift / Future Orders.
// //  * Returns three resource-type tabs per shift group.
// //  *
// //  * Query params:
// //  *   so_number          – partial match on SO number
// //  *   service_option     – exact match on allocation service_option
// //  *   shift              – SO shift (Day|Night|Full|Day and Night)
// //  *   scheduled_date_from / scheduled_date_to – scheduled_date range
// //  *   reg_number         – partial match on equipment reg_number (equipment tab)
// //  *   employee_no        – partial match on employee number (manpower tab)
// //  *   attachment_number  – partial match on attachment_number (attachment tab)
// //  *   page / limit
// //  */
// // const getAllFilterActiveOrders = async (req, res) => {
// //   try {
// //     const {
// //       so_number = "",
// //       service_option = "",
// //       shift = "",
// //       scheduled_date_from = "",
// //       scheduled_date_to = "",
// //       reg_number = "",
// //       employee_no = "",
// //       attachment_number = "",
// //       page = 1,
// //       limit = 10,
// //     } = req.query;

// //     const {
// //       currentShiftType,
// //       currentShiftDate,
// //       nextShiftType,
// //       nextShiftDate,
// //     } = getShiftContext();

// //     // ── Build SO-level where clause ──
// //     const soWhere = {};
// //     if (so_number)
// //       soWhere.so_number = { [Op.like]: `%${so_number}%` };
// //     if (shift) soWhere.shift = shift;

// //     // ── Build equipment sub-include where ──
// //     const equipmentInclude = {
// //       model: AllocationEquipmentModel,
// //       as: "equipmentAllocations",
// //       include: [
// //         {
// //           model: EquipmentModel,
// //           as: "equipment",
// //           attributes: [
// //             "serial_number",
// //             "reg_number",
// //             "vehicle_type",
// //             "equipment_status",
// //             "equipment_status_note",
// //           ],
// //           ...(reg_number && {
// //             where: { reg_number: { [Op.like]: `%${reg_number}%` } },
// //           }),
// //         },
// //       ],
// //     };

// //     // ── Build manpower sub-include where ──
// //     const manpowerInclude = {
// //       model: AllocationManpowerModel,
// //       as: "manpowerAllocations",
// //       include: [
// //         {
// //           model: EmployeeModel,
// //           as: "employee",
// //           attributes: ["id", "personalDetails"],
// //           include: [
// //             {
// //               model: ManpowerModel,
// //               as: "manpower",
// //               attributes: ["employeeNo", "manpower_status", "operator_type_id"],
// //               ...(employee_no && {
// //                 where: { employeeNo: { [Op.like]: `%${employee_no}%` } },
// //               }),
// //               include: [
// //                 {
// //                   model: OperatorTypeModel,
// //                   as: "operator_type",
// //                   attributes: ["operator_type_id", "operator_type"],
// //                 },
// //               ],
// //             },
// //           ],
// //         },
// //       ],
// //     };

// //     // ── Build attachment sub-include where ──
// //     const attachmentInclude = {
// //       model: AllocationAttachmentModel,
// //       as: "attachmentAllocations",
// //       include: [
// //         {
// //           model: AttachmentModel,
// //           as: "attachment",
// //           attributes: [
// //             "attachment_id",
// //             "attachment_number",
// //             "product_name",
// //             "serial_number",
// //             "attachment_status",
// //           ],
// //           ...(attachment_number && {
// //             where: {
// //               attachment_number: { [Op.like]: `%${attachment_number}%` },
// //             },
// //           }),
// //         },
// //       ],
// //     };

// //     const includes = [
// //       {
// //         model: SalesOrdersModel,
// //         as: "salesOrder",
// //         attributes: [
// //           "id",
// //           "so_number",
// //           "client",
// //           "project_name",
// //           "delivery_address",
// //           "shift",
// //           "lpo_number",
// //           "lpo_validity_date",
// //           "extended_lpo_validity_date",
// //           "expected_mobilization_date",
// //           "expected_demobilization_date",
// //           "ops_status",
// //           "so_status",
// //         ],
// //         where: Object.keys(soWhere).length ? soWhere : undefined,
// //         include: [
// //           {
// //             model: JobLocationModel,
// //             as: "jobLocation",
// //             attributes: ["job_location_id", "job_location_name"],
// //           },
// //         ],
// //       },
// //       equipmentInclude,
// //       manpowerInclude,
// //       attachmentInclude,
// //     ];

// //     // ── allocation-level where ──
// //     const allocWhere = {
// //       status: { [Op.notIn]: ["Completed", "Cancelled"] },
// //     };
// //     if (service_option) allocWhere.service_option = service_option;

// //     const allAllocations = await ActiveAllocationModel.findAll({
// //       where: allocWhere,
// //       include: includes,
// //       order: [["allocation_date", "ASC"]],
// //     });

// //     // Buckets
// //     const buckets = {
// //       currentShift: { equipment: [], manpower: [], attachments: [] },
// //       nextShift: { equipment: [], manpower: [], attachments: [] },
// //       futureOrders: { equipment: [], manpower: [], attachments: [] },
// //     };

// //     for (const alloc of allAllocations) {
// //       const raw = alloc.toJSON();
// //       if (!raw.salesOrder) continue;

// //       // Apply scheduled_date range filter
// //       if (scheduled_date_from || scheduled_date_to) {
// //         const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
// //         if (!scheduledDate) continue;
// //         if (scheduled_date_from && scheduledDate < scheduled_date_from)
// //           continue;
// //         if (scheduled_date_to && scheduledDate > scheduled_date_to) continue;
// //       }

// //       const hasResources =
// //         raw.equipmentAllocations.length > 0 ||
// //         raw.manpowerAllocations.length > 0 ||
// //         raw.attachmentAllocations.length > 0;
// //       if (!hasResources) continue;

// //       // When resource-level filter is active, skip allocations with no matching resources
// //       if (reg_number && raw.equipmentAllocations.length === 0) {
// //         // don't skip entirely – still show in manpower/attachment tabs
// //       }

// //       const soShift = raw.salesOrder.shift || "";
// //       const allocDate = raw.allocation_date;
// //       const lpoEndDate = getLpoEndDate(raw.salesOrder);
// //       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

// //       const formatted = formatAllocationResponse(alloc, {
// //         [raw.allocation_id]: { scheduled_date: scheduledDate },
// //       });

// //       const matchesCurrentShift =
// //         soShift === currentShiftType ||
// //         soShift === "Full" ||
// //         soShift === "Day and Night";
// //       const matchesNextShift =
// //         soShift === nextShiftType ||
// //         soShift === "Full" ||
// //         soShift === "Day and Night";

// //       let targetBucket = null;

// //       if (allocDate === currentShiftDate && matchesCurrentShift) {
// //         if (
// //           isInActiveWindow(
// //             raw.salesOrder,
// //             scheduledDate,
// //             currentShiftDate,
// //             raw.allocation_date
// //           )
// //         ) {
// //           targetBucket = buckets.currentShift;
// //         }
// //       } else if (allocDate === nextShiftDate && matchesNextShift) {
// //         if (
// //           isInActiveWindow(
// //             raw.salesOrder,
// //             scheduledDate,
// //             nextShiftDate,
// //             raw.allocation_date
// //           )
// //         ) {
// //           targetBucket = buckets.nextShift;
// //         }
// //       } else if (allocDate > nextShiftDate) {
// //         if (lpoEndDate && lpoEndDate >= allocDate) {
// //           targetBucket = buckets.futureOrders;
// //         }
// //       }

// //       if (!targetBucket) continue;

// //       // Only push into a tab if that resource type has entries
// //       // (respects resource-level filters applied via Sequelize includes)
// //       if (formatted.resources.equipment.length > 0)
// //         targetBucket.equipment.push(formatted);
// //       if (formatted.resources.manpower.length > 0)
// //         targetBucket.manpower.push(formatted);
// //       if (formatted.resources.attachments.length > 0)
// //         targetBucket.attachments.push(formatted);
// //     }

// //     // Paginate each tab inside each shift group
// //     const paginateTab = (orders) => {
// //       const total = orders.length;
// //       const offset = (parseInt(page) - 1) * parseInt(limit);
// //       return {
// //         totalOrders: total,
// //         currentPage: parseInt(page),
// //         totalPages: Math.ceil(total / parseInt(limit)),
// //         orders: orders.slice(offset, offset + parseInt(limit)),
// //       };
// //     };

// //     const buildShiftResponse = (bucket, extra = {}) => ({
// //       ...extra,
// //       equipment: paginateTab(bucket.equipment),
// //       manpower: paginateTab(bucket.manpower),
// //       attachments: paginateTab(bucket.attachments),
// //     });

// //     return res.status(200).json({
// //       currentShift: buildShiftResponse(buckets.currentShift, {
// //         shiftType: currentShiftType,
// //         shiftDate: currentShiftDate,
// //       }),
// //       nextShift: buildShiftResponse(buckets.nextShift, {
// //         shiftType: nextShiftType,
// //         shiftDate: nextShiftDate,
// //       }),
// //       futureOrders: buildShiftResponse(buckets.futureOrders),
// //     });
// //   } catch (error) {
// //     console.error("Error filtering active orders:", error);
// //     return res.status(500).json({
// //       message: "Error filtering active orders",
// //       error: error.message,
// //     });
// //   }
// // };

// // // ─── Filter: Completed Orders ─────────────────────────────────────────────────

// // /**
// //  * GET /api/operational-handling/completed-orders/filter
// //  *
// //  * Filters completed orders and returns resource-type tabs.
// //  *
// //  * Query params:
// //  *   so_number          – partial match
// //  *   service_option     – exact match
// //  *   shift              – SO shift
// //  *   scheduled_date_from / scheduled_date_to
// //  *   reg_number         – equipment tab filter
// //  *   employee_no        – manpower tab filter
// //  *   attachment_number  – attachment tab filter
// //  *   from_date / to_date – allocation_date range
// //  *   page / limit
// //  */
// // const getFilterCompletedOrders = async (req, res) => {
// //   try {
// //     const {
// //       so_number = "",
// //       service_option = "",
// //       shift = "",
// //       scheduled_date_from = "",
// //       scheduled_date_to = "",
// //       reg_number = "",
// //       employee_no = "",
// //       attachment_number = "",
// //       from_date = "",
// //       to_date = "",
// //       page = 1,
// //       limit = 10,
// //     } = req.query;

// //     // ── SO-level filter ──
// //     const soWhere = {};
// //     if (so_number) soWhere.so_number = { [Op.like]: `%${so_number}%` };
// //     if (shift) soWhere.shift = shift;

// //     // ── Resource-level includes with optional filters ──
// //     const equipmentInclude = {
// //       model: AllocationEquipmentModel,
// //       as: "equipmentAllocations",
// //       include: [
// //         {
// //           model: EquipmentModel,
// //           as: "equipment",
// //           attributes: [
// //             "serial_number",
// //             "reg_number",
// //             "vehicle_type",
// //             "equipment_status",
// //             "equipment_status_note",
// //           ],
// //           ...(reg_number && {
// //             where: { reg_number: { [Op.like]: `%${reg_number}%` } },
// //           }),
// //         },
// //       ],
// //     };

// //     const manpowerInclude = {
// //       model: AllocationManpowerModel,
// //       as: "manpowerAllocations",
// //       include: [
// //         {
// //           model: EmployeeModel,
// //           as: "employee",
// //           attributes: ["id", "personalDetails"],
// //           include: [
// //             {
// //               model: ManpowerModel,
// //               as: "manpower",
// //               attributes: ["employeeNo", "manpower_status", "operator_type_id"],
// //               ...(employee_no && {
// //                 where: { employeeNo: { [Op.like]: `%${employee_no}%` } },
// //               }),
// //               include: [
// //                 {
// //                   model: OperatorTypeModel,
// //                   as: "operator_type",
// //                   attributes: ["operator_type_id", "operator_type"],
// //                 },
// //               ],
// //             },
// //           ],
// //         },
// //       ],
// //     };

// //     const attachmentInclude = {
// //       model: AllocationAttachmentModel,
// //       as: "attachmentAllocations",
// //       include: [
// //         {
// //           model: AttachmentModel,
// //           as: "attachment",
// //           attributes: [
// //             "attachment_id",
// //             "attachment_number",
// //             "product_name",
// //             "serial_number",
// //             "attachment_status",
// //           ],
// //           ...(attachment_number && {
// //             where: {
// //               attachment_number: { [Op.like]: `%${attachment_number}%` },
// //             },
// //           }),
// //         },
// //       ],
// //     };

// //     const includes = [
// //       {
// //         model: SalesOrdersModel,
// //         as: "salesOrder",
// //         attributes: [
// //           "id",
// //           "so_number",
// //           "client",
// //           "project_name",
// //           "delivery_address",
// //           "shift",
// //           "lpo_number",
// //           "lpo_validity_date",
// //           "extended_lpo_validity_date",
// //           "expected_mobilization_date",
// //           "expected_demobilization_date",
// //           "ops_status",
// //           "so_status",
// //         ],
// //         where: Object.keys(soWhere).length ? soWhere : undefined,
// //         include: [
// //           {
// //             model: JobLocationModel,
// //             as: "jobLocation",
// //             attributes: ["job_location_id", "job_location_name"],
// //           },
// //         ],
// //       },
// //       equipmentInclude,
// //       manpowerInclude,
// //       attachmentInclude,
// //     ];

// //     // ── Allocation-level where ──
// //     const allocWhere = { status: "Completed" };
// //     if (service_option) allocWhere.service_option = service_option;
// //     if (from_date || to_date) {
// //       allocWhere.allocation_date = {};
// //       if (from_date) allocWhere.allocation_date[Op.gte] = from_date;
// //       if (to_date) allocWhere.allocation_date[Op.lte] = to_date;
// //     }

// //     const allAllocations = await ActiveAllocationModel.findAll({
// //       where: allocWhere,
// //       include: includes,
// //       order: [["allocation_date", "DESC"]],
// //     });

// //     const allFormatted = [];

// //     for (const alloc of allAllocations) {
// //       const raw = alloc.toJSON();
// //       if (!raw.salesOrder) continue;

// //       // Scheduled date range filter
// //       if (scheduled_date_from || scheduled_date_to) {
// //         const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
// //         if (!scheduledDate) continue;
// //         if (scheduled_date_from && scheduledDate < scheduled_date_from)
// //           continue;
// //         if (scheduled_date_to && scheduledDate > scheduled_date_to) continue;
// //       }

// //       const hasResources =
// //         raw.equipmentAllocations.length > 0 ||
// //         raw.manpowerAllocations.length > 0 ||
// //         raw.attachmentAllocations.length > 0;
// //       if (!hasResources) continue;

// //       allFormatted.push(formatAllocationResponse(alloc));
// //     }

// //     // Split into tabs
// //     const equipmentOrders = allFormatted.filter(
// //       (o) => o.resources.equipment.length > 0
// //     );
// //     const manpowerOrders = allFormatted.filter(
// //       (o) => o.resources.manpower.length > 0
// //     );
// //     const attachmentOrders = allFormatted.filter(
// //       (o) => o.resources.attachments.length > 0
// //     );

// //     const paginateTab = (orders) => {
// //       const total = orders.length;
// //       const offset = (parseInt(page) - 1) * parseInt(limit);
// //       return {
// //         totalOrders: total,
// //         currentPage: parseInt(page),
// //         totalPages: Math.ceil(total / parseInt(limit)),
// //         orders: orders.slice(offset, offset + parseInt(limit)),
// //       };
// //     };

// //     return res.status(200).json({
// //       equipment: paginateTab(equipmentOrders),
// //       manpower: paginateTab(manpowerOrders),
// //       attachments: paginateTab(attachmentOrders),
// //     });
// //   } catch (error) {
// //     console.error("Error filtering completed orders:", error);
// //     return res.status(500).json({
// //       message: "Error filtering completed orders",
// //       error: error.message,
// //     });
// //   }
// // };

// // // ─── Debug (TEMP) ─────────────────────────────────────────────────────────────

// // const debugOrders = async (req, res) => {
// //   try {
// //     const {
// //       currentShiftType,
// //       currentShiftDate,
// //       nextShiftType,
// //       nextShiftDate,
// //     } = getShiftContext();

// //     const allAllocations = await ActiveAllocationModel.findAll({
// //       include: buildIncludes(),
// //       order: [["allocation_date", "ASC"]],
// //     });

// //     const debugReport = [];

// //     for (const alloc of allAllocations) {
// //       const raw = alloc.toJSON();
// //       const report = {
// //         allocation_id: raw.allocation_id,
// //         allocation_date: raw.allocation_date,
// //         status: raw.status,
// //         sales_order_id: raw.sales_order_id,
// //         checks: {},
// //       };

// //       report.checks.statusOk = !["Completed", "Cancelled"].includes(
// //         raw.status
// //       );
// //       report.checks.salesOrderLoaded = !!raw.salesOrder;

// //       if (raw.salesOrder) {
// //         report.salesOrder = {
// //           id: raw.salesOrder.id,
// //           shift: raw.salesOrder.shift,
// //           lpo_validity_date: raw.salesOrder.lpo_validity_date,
// //           extended_lpo_validity_date: raw.salesOrder.extended_lpo_validity_date,
// //           ops_status: raw.salesOrder.ops_status,
// //           so_status: raw.salesOrder.so_status,
// //         };
// //       }

// //       const eqCount = raw.equipmentAllocations?.length || 0;
// //       const mpCount = raw.manpowerAllocations?.length || 0;
// //       const attCount = raw.attachmentAllocations?.length || 0;
// //       report.checks.hasResources = eqCount > 0 || mpCount > 0 || attCount > 0;
// //       report.resourceCounts = {
// //         equipment: eqCount,
// //         manpower: mpCount,
// //         attachments: attCount,
// //       };

// //       if (raw.salesOrder) {
// //         const soShift = raw.salesOrder.shift || "";
// //         report.checks.matchesCurrentShift =
// //           soShift === currentShiftType ||
// //           soShift === "Full" ||
// //           soShift === "Day and Night";
// //         report.checks.matchesNextShift =
// //           soShift === nextShiftType ||
// //           soShift === "Full" ||
// //           soShift === "Day and Night";
// //         report.checks.soShiftValue = soShift;
// //         report.checks.currentShiftType = currentShiftType;
// //       }

// //       report.checks.allocationDateMatchesCurrentShift =
// //         raw.allocation_date === currentShiftDate;
// //       report.checks.allocationDateMatchesNextShift =
// //         raw.allocation_date === nextShiftDate;
// //       report.checks.currentShiftDate = currentShiftDate;
// //       report.checks.nextShiftDate = nextShiftDate;

// //       if (raw.salesOrder) {
// //         const soId = raw.salesOrder.id;
// //         const scheduledDate = await fetchScheduledDateForSO(soId);
// //         const lpoEndDate = getLpoEndDate(raw.salesOrder);
// //         const effectiveStart =
// //           scheduledDate || raw.allocation_date || currentShiftDate;

// //         report.checks.scheduledDate = scheduledDate;
// //         report.checks.lpoEndDate = lpoEndDate;
// //         report.checks.effectiveStart = effectiveStart;
// //         report.checks.activeWindowForCurrentShift = isInActiveWindow(
// //           raw.salesOrder,
// //           scheduledDate,
// //           currentShiftDate,
// //           raw.allocation_date
// //         );
// //         report.checks.activeWindowForNextShift = isInActiveWindow(
// //           raw.salesOrder,
// //           scheduledDate,
// //           nextShiftDate,
// //           raw.allocation_date
// //         );
// //       }

// //       report.wouldAppearInCurrentShift =
// //         report.checks.statusOk &&
// //         report.checks.salesOrderLoaded &&
// //         report.checks.hasResources &&
// //         report.checks.matchesCurrentShift &&
// //         report.checks.allocationDateMatchesCurrentShift &&
// //         report.checks.activeWindowForCurrentShift;

// //       report.wouldAppearInNextShift =
// //         report.checks.statusOk &&
// //         report.checks.salesOrderLoaded &&
// //         report.checks.hasResources &&
// //         report.checks.matchesNextShift &&
// //         report.checks.allocationDateMatchesNextShift &&
// //         report.checks.activeWindowForNextShift;

// //       debugReport.push(report);
// //     }

// //     return res.status(200).json({
// //       serverTime: new Date().toISOString(),
// //       shiftContext: {
// //         currentShiftType,
// //         currentShiftDate,
// //         nextShiftType,
// //         nextShiftDate,
// //       },
// //       totalAllocationsInDB: debugReport.length,
// //       allocations: debugReport,
// //     });
// //   } catch (error) {
// //     console.error("Debug error:", error);
// //     return res.status(500).json({
// //       message: "Debug error",
// //       error: error.message,
// //       stack: error.stack,
// //     });
// //   }
// // };

// // module.exports = {
// //   getShiftInfo,
// //   getCurrentShiftOrders,
// //   getNextShiftOrders,
// //   getFutureOrders,
// //   getAllActiveOrders,
// //   getCompletedOrders,
// //   getOrderById,
// //   getOrdersBySalesOrder,
// //   getAllFilterActiveOrders,   // NEW
// //   getFilterCompletedOrders,  // NEW
// //   debugOrders,               // TEMP: remove before production
// // };

// const { Op } = require("sequelize");
// const {
//   ActiveAllocationModel,
//   AllocationEquipmentModel,
//   AllocationManpowerModel,
//   AllocationAttachmentModel,
// } = require("../../models/fleet-management/ActiveAllocationsOriginalModel");
// const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
// const EmployeeModel = require("../../models/hr/employees/EmployeeModel");
// const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
// const JobLocationModel = require("../../models/fleet-management/JobLocationModel");
// const EquipmentScheduledModel = require("../../models/fleet-management/EquipmentScheduledModel");
// const ManpowerScheduledModel = require("../../models/fleet-management/ManpowerScheduledModel");
// const AttachmentScheduledModel = require("../../models/fleet-management/AttachmentScheduledModel");
// const OperatorTypeModel = require("../../models/fleet-management/OperatorTypeModel");

// // ─── Shift Helpers ────────────────────────────────────────────────────────────

// const toDateStr = (d) => d.toISOString().split("T")[0];

// const getShiftContext = () => {
//   const now = new Date();
//   const hours = now.getHours();
//   const isDay = hours >= 6 && hours <= 17;

//   const today = toDateStr(now);
//   const tomorrow = toDateStr(
//     new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
//   );

//   if (isDay) {
//     return {
//       currentShiftType: "Day",
//       currentShiftDate: today,
//       nextShiftType: "Night",
//       nextShiftDate: today,
//       futureAfterDate: today,
//     };
//   } else {
//     return {
//       currentShiftType: "Night",
//       currentShiftDate: today,
//       nextShiftType: "Day",
//       nextShiftDate: tomorrow,
//       futureAfterDate: tomorrow,
//     };
//   }
// };

// const getLpoEndDate = (so) =>
//   so.extended_lpo_validity_date || so.lpo_validity_date || null;

// // ─── Include Builder ──────────────────────────────────────────────────────────

// const buildIncludes = () => [
//   {
//     model: SalesOrdersModel,
//     as: "salesOrder",
//     attributes: [
//       "id",
//       "so_number",
//       "client",
//       "project_name",
//       "delivery_address",
//       "shift",
//       "lpo_number",
//       "lpo_validity_date",
//       "extended_lpo_validity_date",
//       "expected_mobilization_date",
//       "expected_demobilization_date",
//       "ops_status",
//       "so_status",
//     ],
//     include: [
//       {
//         model: JobLocationModel,
//         as: "jobLocation",
//         attributes: ["job_location_id", "job_location_name"],
//       },
//     ],
//   },
//   {
//     model: AllocationEquipmentModel,
//     as: "equipmentAllocations",
//     include: [
//       {
//         model: EquipmentModel,
//         as: "equipment",
//         attributes: [
//           "serial_number",
//           "reg_number",
//           "vehicle_type",
//           "equipment_status",
//           "equipment_status_note",
//         ],
//       },
//     ],
//   },
//   {
//     model: AllocationManpowerModel,
//     as: "manpowerAllocations",
//     include: [
//       {
//         model: EmployeeModel,
//         as: "employee",
//         attributes: ["id", "personalDetails"],
//         include: [
//           {
//             model: ManpowerModel,
//             as: "manpower",
//             attributes: ["employeeNo", "manpower_status", "operator_type_id"],
//             include: [
//               {
//                 model: OperatorTypeModel,
//                 as: "operator_type",
//                 attributes: ["operator_type_id", "operator_type"],
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     model: AllocationAttachmentModel,
//     as: "attachmentAllocations",
//     include: [
//       {
//         model: AttachmentModel,
//         as: "attachment",
//         attributes: [
//           "attachment_id",
//           "attachment_number",
//           "product_name",
//           "serial_number",
//           "attachment_status",
//         ],
//       },
//     ],
//   },
// ];

// // ─── Response Formatter ───────────────────────────────────────────────────────

// /**
//  * Formats one ActiveAllocation into the standard response shape.
//  * Resources are exposed SEPARATELY so the frontend can render each individually.
//  */
// const formatAllocationResponse = (allocation, scheduledDatesMap = {}) => {
//   const raw = allocation.toJSON ? allocation.toJSON() : allocation;

//   const equipmentList = (raw.equipmentAllocations || []).map((eq) => ({
//     resource_type: "equipment",
//     allocation_detail: {
//       id: eq.id,
//       allocation_id: eq.allocation_id,
//       serial_number: eq.serial_number,
//       eqt_stu: eq.eqt_stu,
//       status: eq.status,
//       note: eq.note,
//       is_selected: eq.is_selected,
//     },
//     equipment_info: eq.equipment
//       ? {
//           serial_number: eq.equipment.serial_number,
//           reg_number: eq.equipment.reg_number,
//           vehicle_type: eq.equipment.vehicle_type,
//           equipment_status: eq.equipment.equipment_status,
//           equipment_status_note: eq.equipment.equipment_status_note,
//         }
//       : null,
//   }));

//   const manpowerList = (raw.manpowerAllocations || []).map((mp) => ({
//     resource_type: "manpower",
//     allocation_detail: {
//       id: mp.id,
//       allocation_id: mp.allocation_id,
//       employee_id: mp.employee_id,
//       man_stu: mp.man_stu,
//       status: mp.status,
//       note: mp.note,
//       is_selected: mp.is_selected,
//     },
//     employee_info: mp.employee
//       ? {
//           id: mp.employee.id,
//           full_name: mp.employee.personalDetails?.fullNameEnglish || null,
//           employee_no: mp.employee.manpower?.[0]?.employeeNo || null,
//           manpower_status: mp.employee.manpower?.[0]?.manpower_status || null,
//           operator_type:
//             mp.employee.manpower?.[0]?.operator_type?.operator_type || null,
//         }
//       : null,
//   }));

//   const attachmentList = (raw.attachmentAllocations || []).map((att) => ({
//     resource_type: "attachment",
//     allocation_detail: {
//       id: att.id,
//       allocation_id: att.allocation_id,
//       attachment_id: att.attachment_id,
//       att_stu: att.att_stu,
//       status: att.status,
//       note: att.note,
//       is_selected: att.is_selected,
//     },
//     attachment_info: att.attachment
//       ? {
//           attachment_id: att.attachment.attachment_id,
//           attachment_number: att.attachment.attachment_number,
//           product_name: att.attachment.product_name,
//           serial_number: att.attachment.serial_number,
//           attachment_status: att.attachment.attachment_status,
//         }
//       : null,
//   }));

//   return {
//     allocation_id: raw.allocation_id,
//     allocation_date: raw.allocation_date,
//     status: raw.status,
//     service_option: raw.service_option,
//     user_remarks: raw.user_remarks,
//     salesOrder: raw.salesOrder,
//     resources: {
//       equipment: equipmentList,
//       manpower: manpowerList,
//       attachments: attachmentList,
//       summary: {
//         total_equipment: equipmentList.length,
//         total_manpower: manpowerList.length,
//         total_attachments: attachmentList.length,
//         total_resources:
//           equipmentList.length + manpowerList.length + attachmentList.length,
//       },
//     },
//     scheduled_dates: scheduledDatesMap[raw.allocation_id] || null,
//   };
// };

// /**
//  * Fetch the earliest scheduled_date for a SO across all resource types.
//  */
// const fetchScheduledDateForSO = async (soId) => {
//   const findEarliest = async (Model) => {
//     let record = await Model.findOne({
//       where: { so_id: soId, is_selected: true },
//       order: [["scheduled_date", "ASC"]],
//       attributes: ["scheduled_date"],
//     });
//     if (!record) {
//       record = await Model.findOne({
//         where: { so_id: soId },
//         order: [["scheduled_date", "ASC"]],
//         attributes: ["scheduled_date"],
//       });
//     }
//     return record?.scheduled_date || null;
//   };

//   const [eqDate, mpDate, attDate] = await Promise.all([
//     findEarliest(EquipmentScheduledModel),
//     findEarliest(ManpowerScheduledModel),
//     findEarliest(AttachmentScheduledModel),
//   ]);

//   const dates = [eqDate, mpDate, attDate].filter(Boolean).sort();
//   return dates[0] || null;
// };

// /**
//  * Checks if a Sales Order is within its active window on a given reference date.
//  */
// const isInActiveWindow = (
//   salesOrder,
//   scheduledDate,
//   referenceDate,
//   allocationDate = null
// ) => {
//   const lpoEndDate = getLpoEndDate(salesOrder);
//   const effectiveStart = scheduledDate || allocationDate || referenceDate;

//   if (!lpoEndDate) {
//     return effectiveStart <= referenceDate;
//   }
//   return effectiveStart <= referenceDate && lpoEndDate >= referenceDate;
// };

// // ─── Controller Functions ─────────────────────────────────────────────────────

// /**
//  * GET /api/operational-handling/shift-info
//  */
// const getShiftInfo = async (req, res) => {
//   try {
//     const info = getShiftContext();
//     return res.status(200).json({
//       serverTime: new Date().toISOString(),
//       ...info,
//       shiftWindows: {
//         day: "06:00 – 17:59",
//         night: "18:00 – 05:59 (next day)",
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// // ─── Individual shift endpoints (flat list) ───────────────────────────────────

// const getCurrentShiftOrders = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const { currentShiftType, currentShiftDate } = getShiftContext();

//     const allocations = await ActiveAllocationModel.findAll({
//       where: {
//         allocation_date: currentShiftDate,
//         status: { [Op.notIn]: ["Completed", "Cancelled"] },
//       },
//       include: buildIncludes(),
//       order: [["createdAt", "ASC"]],
//     });

//     const result = [];
//     for (const alloc of allocations) {
//       const raw = alloc.toJSON();
//       const hasResources =
//         raw.equipmentAllocations.length > 0 ||
//         raw.manpowerAllocations.length > 0 ||
//         raw.attachmentAllocations.length > 0;
//       if (!hasResources || !raw.salesOrder) continue;

//       const soShift = raw.salesOrder.shift || "";
//       const matchesShift =
//         soShift === currentShiftType ||
//         soShift === "Full" ||
//         soShift === "Day and Night";
//       if (!matchesShift) continue;

//       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
//       if (
//         !isInActiveWindow(
//           raw.salesOrder,
//           scheduledDate,
//           currentShiftDate,
//           raw.allocation_date
//         )
//       )
//         continue;

//       result.push(
//         formatAllocationResponse(alloc, {
//           [raw.allocation_id]: { scheduled_date: scheduledDate },
//         })
//       );
//     }

//     const total = result.length;
//     const offset = (parseInt(page) - 1) * parseInt(limit);
//     const paginated = result.slice(offset, offset + parseInt(limit));

//     return res.status(200).json({
//       shiftType: currentShiftType,
//       shiftDate: currentShiftDate,
//       totalOrders: total,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(total / parseInt(limit)),
//       orders: paginated,
//     });
//   } catch (error) {
//     console.error("Error fetching current shift orders:", error);
//     return res.status(500).json({
//       message: "Error fetching current shift orders",
//       error: error.message,
//     });
//   }
// };

// const getNextShiftOrders = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const { nextShiftType, nextShiftDate } = getShiftContext();

//     const allocations = await ActiveAllocationModel.findAll({
//       where: {
//         allocation_date: nextShiftDate,
//         status: { [Op.notIn]: ["Completed", "Cancelled"] },
//       },
//       include: buildIncludes(),
//       order: [["createdAt", "ASC"]],
//     });

//     const result = [];
//     for (const alloc of allocations) {
//       const raw = alloc.toJSON();
//       const hasResources =
//         raw.equipmentAllocations.length > 0 ||
//         raw.manpowerAllocations.length > 0 ||
//         raw.attachmentAllocations.length > 0;
//       if (!hasResources || !raw.salesOrder) continue;

//       const soShift = raw.salesOrder.shift || "";
//       const matchesShift =
//         soShift === nextShiftType ||
//         soShift === "Full" ||
//         soShift === "Day and Night";
//       if (!matchesShift) continue;

//       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
//       if (
//         !isInActiveWindow(
//           raw.salesOrder,
//           scheduledDate,
//           nextShiftDate,
//           raw.allocation_date
//         )
//       )
//         continue;

//       result.push(
//         formatAllocationResponse(alloc, {
//           [raw.allocation_id]: { scheduled_date: scheduledDate },
//         })
//       );
//     }

//     const total = result.length;
//     const offset = (parseInt(page) - 1) * parseInt(limit);
//     const paginated = result.slice(offset, offset + parseInt(limit));

//     return res.status(200).json({
//       shiftType: nextShiftType,
//       shiftDate: nextShiftDate,
//       totalOrders: total,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(total / parseInt(limit)),
//       orders: paginated,
//     });
//   } catch (error) {
//     console.error("Error fetching next shift orders:", error);
//     return res.status(500).json({
//       message: "Error fetching next shift orders",
//       error: error.message,
//     });
//   }
// };

// const getFutureOrders = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const { nextShiftDate } = getShiftContext();

//     const allocations = await ActiveAllocationModel.findAll({
//       where: {
//         allocation_date: { [Op.gt]: nextShiftDate },
//         status: { [Op.notIn]: ["Completed", "Cancelled"] },
//       },
//       include: buildIncludes(),
//       order: [["allocation_date", "ASC"]],
//     });

//     const result = [];
//     for (const alloc of allocations) {
//       const raw = alloc.toJSON();
//       const hasResources =
//         raw.equipmentAllocations.length > 0 ||
//         raw.manpowerAllocations.length > 0 ||
//         raw.attachmentAllocations.length > 0;
//       if (!hasResources || !raw.salesOrder) continue;

//       const lpoEndDate = getLpoEndDate(raw.salesOrder);
//       if (!lpoEndDate || lpoEndDate < raw.allocation_date) continue;

//       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
//       result.push(
//         formatAllocationResponse(alloc, {
//           [raw.allocation_id]: { scheduled_date: scheduledDate },
//         })
//       );
//     }

//     const total = result.length;
//     const offset = (parseInt(page) - 1) * parseInt(limit);
//     const paginated = result.slice(offset, offset + parseInt(limit));

//     return res.status(200).json({
//       totalOrders: total,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(total / parseInt(limit)),
//       orders: paginated,
//     });
//   } catch (error) {
//     console.error("Error fetching future orders:", error);
//     return res.status(500).json({
//       message: "Error fetching future orders",
//       error: error.message,
//     });
//   }
// };

// // ─── getAllActiveOrders ────────────────────────────────────────────────────────

// /**
//  * GET /api/operational-handling/active-orders
//  *
//  * Response structure (resource-type FIRST, then shift groups inside):
//  * {
//  *   equipment: {
//  *     currentShift: { shiftType, shiftDate, totalOrders, orders: [...] },
//  *     nextShift:    { shiftType, shiftDate, totalOrders, orders: [...] },
//  *     futureOrders: { totalOrders, orders: [...] }
//  *   },
//  *   manpower: {
//  *     currentShift: { ... },
//  *     nextShift:    { ... },
//  *     futureOrders: { ... }
//  *   },
//  *   attachments: {
//  *     currentShift: { ... },
//  *     nextShift:    { ... },
//  *     futureOrders: { ... }
//  *   }
//  * }
//  *
//  * Each order inside a shift group is the full AllocationOrder object.
//  * An allocation appears in a resource tab only if it has ≥1 resource of that type.
//  */
// const getAllActiveOrders = async (req, res) => {
//   try {
//     const {
//       currentShiftType,
//       currentShiftDate,
//       nextShiftType,
//       nextShiftDate,
//     } = getShiftContext();

//     const allAllocations = await ActiveAllocationModel.findAll({
//       where: { status: { [Op.notIn]: ["Completed", "Cancelled"] } },
//       include: buildIncludes(),
//       order: [["allocation_date", "ASC"]],
//     });

//     // Buckets: resource type → shift group → orders array
//     const buckets = {
//       equipment: { currentShift: [], nextShift: [], futureOrders: [] },
//       manpower: { currentShift: [], nextShift: [], futureOrders: [] },
//       attachments: { currentShift: [], nextShift: [], futureOrders: [] },
//     };

//     for (const alloc of allAllocations) {
//       const raw = alloc.toJSON();

//       const hasResources =
//         raw.equipmentAllocations.length > 0 ||
//         raw.manpowerAllocations.length > 0 ||
//         raw.attachmentAllocations.length > 0;
//       if (!hasResources || !raw.salesOrder) continue;

//       const soShift = raw.salesOrder.shift || "";
//       const allocDate = raw.allocation_date;
//       const lpoEndDate = getLpoEndDate(raw.salesOrder);
//       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

//       const formatted = formatAllocationResponse(alloc, {
//         [raw.allocation_id]: { scheduled_date: scheduledDate },
//       });

//       const matchesCurrentShift =
//         soShift === currentShiftType ||
//         soShift === "Full" ||
//         soShift === "Day and Night";
//       const matchesNextShift =
//         soShift === nextShiftType ||
//         soShift === "Full" ||
//         soShift === "Day and Night";

//       // Determine shift group
//       let shiftGroup = null;

//       if (allocDate === currentShiftDate && matchesCurrentShift) {
//         if (
//           isInActiveWindow(
//             raw.salesOrder,
//             scheduledDate,
//             currentShiftDate,
//             raw.allocation_date
//           )
//         ) {
//           shiftGroup = "currentShift";
//         }
//       } else if (allocDate === nextShiftDate && matchesNextShift) {
//         if (
//           isInActiveWindow(
//             raw.salesOrder,
//             scheduledDate,
//             nextShiftDate,
//             raw.allocation_date
//           )
//         ) {
//           shiftGroup = "nextShift";
//         }
//       } else if (allocDate > nextShiftDate) {
//         if (lpoEndDate && lpoEndDate >= allocDate) {
//           shiftGroup = "futureOrders";
//         }
//       }

//       if (!shiftGroup) continue;

//       // Push into appropriate resource-type bucket + shift group
//       if (formatted.resources.equipment.length > 0) {
//         buckets.equipment[shiftGroup].push(formatted);
//       }
//       if (formatted.resources.manpower.length > 0) {
//         buckets.manpower[shiftGroup].push(formatted);
//       }
//       if (formatted.resources.attachments.length > 0) {
//         buckets.attachments[shiftGroup].push(formatted);
//       }
//     }

//     return res.status(200).json({
//       equipment: {
//         currentShift: {
//           shiftType: currentShiftType,
//           shiftDate: currentShiftDate,
//           totalOrders: buckets.equipment.currentShift.length,
//           orders: buckets.equipment.currentShift,
//         },
//         nextShift: {
//           shiftType: nextShiftType,
//           shiftDate: nextShiftDate,
//           totalOrders: buckets.equipment.nextShift.length,
//           orders: buckets.equipment.nextShift,
//         },
//         futureOrders: {
//           totalOrders: buckets.equipment.futureOrders.length,
//           orders: buckets.equipment.futureOrders,
//         },
//       },
//       manpower: {
//         currentShift: {
//           shiftType: currentShiftType,
//           shiftDate: currentShiftDate,
//           totalOrders: buckets.manpower.currentShift.length,
//           orders: buckets.manpower.currentShift,
//         },
//         nextShift: {
//           shiftType: nextShiftType,
//           shiftDate: nextShiftDate,
//           totalOrders: buckets.manpower.nextShift.length,
//           orders: buckets.manpower.nextShift,
//         },
//         futureOrders: {
//           totalOrders: buckets.manpower.futureOrders.length,
//           orders: buckets.manpower.futureOrders,
//         },
//       },
//       attachments: {
//         currentShift: {
//           shiftType: currentShiftType,
//           shiftDate: currentShiftDate,
//           totalOrders: buckets.attachments.currentShift.length,
//           orders: buckets.attachments.currentShift,
//         },
//         nextShift: {
//           shiftType: nextShiftType,
//           shiftDate: nextShiftDate,
//           totalOrders: buckets.attachments.nextShift.length,
//           orders: buckets.attachments.nextShift,
//         },
//         futureOrders: {
//           totalOrders: buckets.attachments.futureOrders.length,
//           orders: buckets.attachments.futureOrders,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching all active orders:", error);
//     return res.status(500).json({
//       message: "Error fetching all active orders",
//       error: error.message,
//     });
//   }
// };

// // ─── getCompletedOrders ───────────────────────────────────────────────────────

// /**
//  * GET /api/operational-handling/completed-orders
//  *
//  * Response structure (resource-type FIRST):
//  * {
//  *   equipment: {
//  *     totalOrders, currentPage, totalPages,
//  *     orders: [ ...AllocationOrder ]
//  *   },
//  *   manpower: {
//  *     totalOrders, currentPage, totalPages,
//  *     orders: [ ...AllocationOrder ]
//  *   },
//  *   attachments: {
//  *     totalOrders, currentPage, totalPages,
//  *     orders: [ ...AllocationOrder ]
//  *   }
//  * }
//  */
// const getCompletedOrders = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, from_date, to_date } = req.query;
//     const offset = (parseInt(page) - 1) * parseInt(limit);

//     const dateFilter = {};
//     if (from_date) dateFilter[Op.gte] = from_date;
//     if (to_date) dateFilter[Op.lte] = to_date;

//     const { count, rows } = await ActiveAllocationModel.findAndCountAll({
//       where: {
//         status: "Completed",
//         ...(Object.keys(dateFilter).length > 0 && {
//           allocation_date: dateFilter,
//         }),
//       },
//       include: buildIncludes(),
//       offset,
//       limit: parseInt(limit),
//       order: [["allocation_date", "DESC"]],
//       distinct: true,
//     });

//     const validRows = rows.filter(
//       (alloc) =>
//         (alloc.equipmentAllocations?.length || 0) > 0 ||
//         (alloc.manpowerAllocations?.length || 0) > 0 ||
//         (alloc.attachmentAllocations?.length || 0) > 0
//     );

//     const formatted = validRows.map((alloc) => formatAllocationResponse(alloc));

//     // Split by resource type
//     const equipmentOrders = formatted.filter(
//       (o) => o.resources.equipment.length > 0
//     );
//     const manpowerOrders = formatted.filter(
//       (o) => o.resources.manpower.length > 0
//     );
//     const attachmentOrders = formatted.filter(
//       (o) => o.resources.attachments.length > 0
//     );

//     return res.status(200).json({
//       equipment: {
//         totalOrders: equipmentOrders.length,
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(count / parseInt(limit)),
//         orders: equipmentOrders,
//       },
//       manpower: {
//         totalOrders: manpowerOrders.length,
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(count / parseInt(limit)),
//         orders: manpowerOrders,
//       },
//       attachments: {
//         totalOrders: attachmentOrders.length,
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(count / parseInt(limit)),
//         orders: attachmentOrders,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching completed orders:", error);
//     return res.status(500).json({
//       message: "Error fetching completed orders",
//       error: error.message,
//     });
//   }
// };

// // ─── Single & SO-level Lookup ─────────────────────────────────────────────────

// const getOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const alloc = await ActiveAllocationModel.findByPk(id, {
//       include: buildIncludes(),
//     });

//     if (!alloc) {
//       return res.status(404).json({ message: "Allocation record not found" });
//     }

//     const raw = alloc.toJSON();
//     const scheduledDate = raw.salesOrder
//       ? await fetchScheduledDateForSO(raw.salesOrder.id)
//       : null;

//     return res.status(200).json(
//       formatAllocationResponse(alloc, {
//         [raw.allocation_id]: { scheduled_date: scheduledDate },
//       })
//     );
//   } catch (error) {
//     console.error("Error fetching order by ID:", error);
//     return res
//       .status(500)
//       .json({ message: "Error fetching order", error: error.message });
//   }
// };

// const getOrdersBySalesOrder = async (req, res) => {
//   try {
//     const { so_id } = req.params;

//     const allocations = await ActiveAllocationModel.findAll({
//       where: { sales_order_id: so_id },
//       include: buildIncludes(),
//       order: [["allocation_date", "ASC"]],
//     });

//     if (!allocations.length) {
//       return res.status(404).json({
//         message: "No allocations found for this sales order",
//         orders: [],
//       });
//     }

//     const scheduledDate = await fetchScheduledDateForSO(parseInt(so_id));

//     const formatted = allocations.map((alloc) =>
//       formatAllocationResponse(alloc, {
//         [alloc.allocation_id]: { scheduled_date: scheduledDate },
//       })
//     );

//     return res.status(200).json({
//       so_id: parseInt(so_id),
//       totalAllocations: formatted.length,
//       orders: formatted,
//     });
//   } catch (error) {
//     console.error("Error fetching orders by SO:", error);
//     return res.status(500).json({
//       message: "Error fetching orders by sales order",
//       error: error.message,
//     });
//   }
// };

// // ─── getAllFilterActiveOrders ─────────────────────────────────────────────────

// /**
//  * GET /api/operational-handling/active-orders/filter
//  *
//  * Same structure as getAllActiveOrders (resource-type FIRST, shift groups inside)
//  * but with filter support. Each resource-type section has its own paginated results.
//  *
//  * Response structure:
//  * {
//  *   equipment: {
//  *     currentShift: { shiftType, shiftDate, totalOrders, currentPage, totalPages, orders: [...] },
//  *     nextShift:    { ... },
//  *     futureOrders: { totalOrders, currentPage, totalPages, orders: [...] }
//  *   },
//  *   manpower:    { currentShift, nextShift, futureOrders },
//  *   attachments: { currentShift, nextShift, futureOrders }
//  * }
//  *
//  * Filter params:
//  *   so_number          – partial match on SO number
//  *   service_option     – exact match on allocation service_option
//  *   shift              – SO shift filter (Day|Night|Full|Day and Night)
//  *   scheduled_date_from / scheduled_date_to – scheduled_date range
//  *   reg_number         – partial match on equipment reg_number  → equipment tab only
//  *   employee_no        – partial match on employee number       → manpower tab only
//  *   attachment_number  – partial match on attachment_number     → attachments tab only
//  *   page / limit       – applied per resource-type section
//  */
// const getAllFilterActiveOrders = async (req, res) => {
//   try {
//     const {
//       so_number = "",
//       service_option = "",
//       shift = "",
//       scheduled_date_from = "",
//       scheduled_date_to = "",
//       reg_number = "",
//       employee_no = "",
//       attachment_number = "",
//       page = 1,
//       limit = 10,
//     } = req.query;

//     const {
//       currentShiftType,
//       currentShiftDate,
//       nextShiftType,
//       nextShiftDate,
//     } = getShiftContext();

//     // ── SO-level where ──
//     const soWhere = {};
//     if (so_number) soWhere.so_number = { [Op.like]: `%${so_number}%` };
//     if (shift) soWhere.shift = shift;

//     // ── Resource-level includes with optional filters ──
//     const equipmentInclude = {
//       model: AllocationEquipmentModel,
//       as: "equipmentAllocations",
//       include: [
//         {
//           model: EquipmentModel,
//           as: "equipment",
//           attributes: [
//             "serial_number",
//             "reg_number",
//             "vehicle_type",
//             "equipment_status",
//             "equipment_status_note",
//           ],
//           ...(reg_number && {
//             where: { reg_number: { [Op.like]: `%${reg_number}%` } },
//           }),
//         },
//       ],
//     };

//     const manpowerInclude = {
//       model: AllocationManpowerModel,
//       as: "manpowerAllocations",
//       include: [
//         {
//           model: EmployeeModel,
//           as: "employee",
//           attributes: ["id", "personalDetails"],
//           include: [
//             {
//               model: ManpowerModel,
//               as: "manpower",
//               attributes: ["employeeNo", "manpower_status", "operator_type_id"],
//               ...(employee_no && {
//                 where: { employeeNo: { [Op.like]: `%${employee_no}%` } },
//               }),
//               include: [
//                 {
//                   model: OperatorTypeModel,
//                   as: "operator_type",
//                   attributes: ["operator_type_id", "operator_type"],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     };

//     const attachmentInclude = {
//       model: AllocationAttachmentModel,
//       as: "attachmentAllocations",
//       include: [
//         {
//           model: AttachmentModel,
//           as: "attachment",
//           attributes: [
//             "attachment_id",
//             "attachment_number",
//             "product_name",
//             "serial_number",
//             "attachment_status",
//           ],
//           ...(attachment_number && {
//             where: {
//               attachment_number: { [Op.like]: `%${attachment_number}%` },
//             },
//           }),
//         },
//       ],
//     };

//     const includes = [
//       {
//         model: SalesOrdersModel,
//         as: "salesOrder",
//         attributes: [
//           "id",
//           "so_number",
//           "client",
//           "project_name",
//           "delivery_address",
//           "shift",
//           "lpo_number",
//           "lpo_validity_date",
//           "extended_lpo_validity_date",
//           "expected_mobilization_date",
//           "expected_demobilization_date",
//           "ops_status",
//           "so_status",
//         ],
//         where: Object.keys(soWhere).length ? soWhere : undefined,
//         include: [
//           {
//             model: JobLocationModel,
//             as: "jobLocation",
//             attributes: ["job_location_id", "job_location_name"],
//           },
//         ],
//       },
//       equipmentInclude,
//       manpowerInclude,
//       attachmentInclude,
//     ];

//     // ── Allocation-level where ──
//     const allocWhere = {
//       status: { [Op.notIn]: ["Completed", "Cancelled"] },
//     };
//     if (service_option) allocWhere.service_option = service_option;

//     const allAllocations = await ActiveAllocationModel.findAll({
//       where: allocWhere,
//       include: includes,
//       order: [["allocation_date", "ASC"]],
//     });

//     // Buckets: resource type → shift group → orders array
//     const buckets = {
//       equipment: { currentShift: [], nextShift: [], futureOrders: [] },
//       manpower: { currentShift: [], nextShift: [], futureOrders: [] },
//       attachments: { currentShift: [], nextShift: [], futureOrders: [] },
//     };

//     for (const alloc of allAllocations) {
//       const raw = alloc.toJSON();
//       if (!raw.salesOrder) continue;

//       // Scheduled date range filter
//       if (scheduled_date_from || scheduled_date_to) {
//         const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
//         if (!scheduledDate) continue;
//         if (scheduled_date_from && scheduledDate < scheduled_date_from)
//           continue;
//         if (scheduled_date_to && scheduledDate > scheduled_date_to) continue;
//       }

//       const hasResources =
//         raw.equipmentAllocations.length > 0 ||
//         raw.manpowerAllocations.length > 0 ||
//         raw.attachmentAllocations.length > 0;
//       if (!hasResources) continue;

//       const soShift = raw.salesOrder.shift || "";
//       const allocDate = raw.allocation_date;
//       const lpoEndDate = getLpoEndDate(raw.salesOrder);
//       const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);

//       const formatted = formatAllocationResponse(alloc, {
//         [raw.allocation_id]: { scheduled_date: scheduledDate },
//       });

//       const matchesCurrentShift =
//         soShift === currentShiftType ||
//         soShift === "Full" ||
//         soShift === "Day and Night";
//       const matchesNextShift =
//         soShift === nextShiftType ||
//         soShift === "Full" ||
//         soShift === "Day and Night";

//       // Determine shift group
//       let shiftGroup = null;

//       if (allocDate === currentShiftDate && matchesCurrentShift) {
//         if (
//           isInActiveWindow(
//             raw.salesOrder,
//             scheduledDate,
//             currentShiftDate,
//             raw.allocation_date
//           )
//         ) {
//           shiftGroup = "currentShift";
//         }
//       } else if (allocDate === nextShiftDate && matchesNextShift) {
//         if (
//           isInActiveWindow(
//             raw.salesOrder,
//             scheduledDate,
//             nextShiftDate,
//             raw.allocation_date
//           )
//         ) {
//           shiftGroup = "nextShift";
//         }
//       } else if (allocDate > nextShiftDate) {
//         if (lpoEndDate && lpoEndDate >= allocDate) {
//           shiftGroup = "futureOrders";
//         }
//       }

//       if (!shiftGroup) continue;

//       // Push into resource-type bucket only if that type has matching entries
//       // (Sequelize already filtered resources via where clause in includes)
//       if (formatted.resources.equipment.length > 0) {
//         buckets.equipment[shiftGroup].push(formatted);
//       }
//       if (formatted.resources.manpower.length > 0) {
//         buckets.manpower[shiftGroup].push(formatted);
//       }
//       if (formatted.resources.attachments.length > 0) {
//         buckets.attachments[shiftGroup].push(formatted);
//       }
//     }

//     // Paginate helper
//     const paginateGroup = (orders) => {
//       const total = orders.length;
//       const offset = (parseInt(page) - 1) * parseInt(limit);
//       return {
//         totalOrders: total,
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(total / parseInt(limit)) || 1,
//         orders: orders.slice(offset, offset + parseInt(limit)),
//       };
//     };

//     return res.status(200).json({
//       equipment: {
//         currentShift: {
//           shiftType: currentShiftType,
//           shiftDate: currentShiftDate,
//           ...paginateGroup(buckets.equipment.currentShift),
//         },
//         nextShift: {
//           shiftType: nextShiftType,
//           shiftDate: nextShiftDate,
//           ...paginateGroup(buckets.equipment.nextShift),
//         },
//         futureOrders: paginateGroup(buckets.equipment.futureOrders),
//       },
//       manpower: {
//         currentShift: {
//           shiftType: currentShiftType,
//           shiftDate: currentShiftDate,
//           ...paginateGroup(buckets.manpower.currentShift),
//         },
//         nextShift: {
//           shiftType: nextShiftType,
//           shiftDate: nextShiftDate,
//           ...paginateGroup(buckets.manpower.nextShift),
//         },
//         futureOrders: paginateGroup(buckets.manpower.futureOrders),
//       },
//       attachments: {
//         currentShift: {
//           shiftType: currentShiftType,
//           shiftDate: currentShiftDate,
//           ...paginateGroup(buckets.attachments.currentShift),
//         },
//         nextShift: {
//           shiftType: nextShiftType,
//           shiftDate: nextShiftDate,
//           ...paginateGroup(buckets.attachments.nextShift),
//         },
//         futureOrders: paginateGroup(buckets.attachments.futureOrders),
//       },
//     });
//   } catch (error) {
//     console.error("Error filtering active orders:", error);
//     return res.status(500).json({
//       message: "Error filtering active orders",
//       error: error.message,
//     });
//   }
// };

// // ─── getFilterCompletedOrders ─────────────────────────────────────────────────

// /**
//  * GET /api/operational-handling/completed-orders/filter
//  *
//  * Same structure as getCompletedOrders (resource-type FIRST)
//  * but with filter support. Each resource-type section is paginated independently.
//  *
//  * Response structure:
//  * {
//  *   equipment: {
//  *     totalOrders, currentPage, totalPages,
//  *     orders: [ ...AllocationOrder ]
//  *   },
//  *   manpower:    { totalOrders, currentPage, totalPages, orders: [...] },
//  *   attachments: { totalOrders, currentPage, totalPages, orders: [...] }
//  * }
//  *
//  * Filter params:
//  *   so_number          – partial match on SO number
//  *   service_option     – exact match on allocation service_option
//  *   shift              – SO shift filter
//  *   from_date / to_date              – allocation_date range
//  *   scheduled_date_from / scheduled_date_to – scheduled_date range
//  *   reg_number         – equipment tab only (partial match on reg_number)
//  *   employee_no        – manpower tab only (partial match on employeeNo)
//  *   attachment_number  – attachments tab only (partial match on attachment_number)
//  *   page / limit       – applied per resource-type section
//  */
// const getFilterCompletedOrders = async (req, res) => {
//   try {
//     const {
//       so_number = "",
//       service_option = "",
//       shift = "",
//       scheduled_date_from = "",
//       scheduled_date_to = "",
//       reg_number = "",
//       employee_no = "",
//       attachment_number = "",
//       from_date = "",
//       to_date = "",
//       page = 1,
//       limit = 10,
//     } = req.query;

//     // ── SO-level where ──
//     const soWhere = {};
//     if (so_number) soWhere.so_number = { [Op.like]: `%${so_number}%` };
//     if (shift) soWhere.shift = shift;

//     // ── Resource-level includes with optional filters ──
//     const equipmentInclude = {
//       model: AllocationEquipmentModel,
//       as: "equipmentAllocations",
//       include: [
//         {
//           model: EquipmentModel,
//           as: "equipment",
//           attributes: [
//             "serial_number",
//             "reg_number",
//             "vehicle_type",
//             "equipment_status",
//             "equipment_status_note",
//           ],
//           ...(reg_number && {
//             where: { reg_number: { [Op.like]: `%${reg_number}%` } },
//           }),
//         },
//       ],
//     };

//     const manpowerInclude = {
//       model: AllocationManpowerModel,
//       as: "manpowerAllocations",
//       include: [
//         {
//           model: EmployeeModel,
//           as: "employee",
//           attributes: ["id", "personalDetails"],
//           include: [
//             {
//               model: ManpowerModel,
//               as: "manpower",
//               attributes: ["employeeNo", "manpower_status", "operator_type_id"],
//               ...(employee_no && {
//                 where: { employeeNo: { [Op.like]: `%${employee_no}%` } },
//               }),
//               include: [
//                 {
//                   model: OperatorTypeModel,
//                   as: "operator_type",
//                   attributes: ["operator_type_id", "operator_type"],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     };

//     const attachmentInclude = {
//       model: AllocationAttachmentModel,
//       as: "attachmentAllocations",
//       include: [
//         {
//           model: AttachmentModel,
//           as: "attachment",
//           attributes: [
//             "attachment_id",
//             "attachment_number",
//             "product_name",
//             "serial_number",
//             "attachment_status",
//           ],
//           ...(attachment_number && {
//             where: {
//               attachment_number: { [Op.like]: `%${attachment_number}%` },
//             },
//           }),
//         },
//       ],
//     };

//     const includes = [
//       {
//         model: SalesOrdersModel,
//         as: "salesOrder",
//         attributes: [
//           "id",
//           "so_number",
//           "client",
//           "project_name",
//           "delivery_address",
//           "shift",
//           "lpo_number",
//           "lpo_validity_date",
//           "extended_lpo_validity_date",
//           "expected_mobilization_date",
//           "expected_demobilization_date",
//           "ops_status",
//           "so_status",
//         ],
//         where: Object.keys(soWhere).length ? soWhere : undefined,
//         include: [
//           {
//             model: JobLocationModel,
//             as: "jobLocation",
//             attributes: ["job_location_id", "job_location_name"],
//           },
//         ],
//       },
//       equipmentInclude,
//       manpowerInclude,
//       attachmentInclude,
//     ];

//     // ── Allocation-level where ──
//     const allocWhere = { status: "Completed" };
//     if (service_option) allocWhere.service_option = service_option;
//     if (from_date || to_date) {
//       allocWhere.allocation_date = {};
//       if (from_date) allocWhere.allocation_date[Op.gte] = from_date;
//       if (to_date) allocWhere.allocation_date[Op.lte] = to_date;
//     }

//     const allAllocations = await ActiveAllocationModel.findAll({
//       where: allocWhere,
//       include: includes,
//       order: [["allocation_date", "DESC"]],
//     });

//     // Collect all valid formatted orders
//     const equipmentOrders = [];
//     const manpowerOrders = [];
//     const attachmentOrders = [];

//     for (const alloc of allAllocations) {
//       const raw = alloc.toJSON();
//       if (!raw.salesOrder) continue;

//       // Scheduled date range filter
//       if (scheduled_date_from || scheduled_date_to) {
//         const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
//         if (!scheduledDate) continue;
//         if (scheduled_date_from && scheduledDate < scheduled_date_from)
//           continue;
//         if (scheduled_date_to && scheduledDate > scheduled_date_to) continue;
//       }

//       const hasResources =
//         raw.equipmentAllocations.length > 0 ||
//         raw.manpowerAllocations.length > 0 ||
//         raw.attachmentAllocations.length > 0;
//       if (!hasResources) continue;

//       const formatted = formatAllocationResponse(alloc);

//       if (formatted.resources.equipment.length > 0) {
//         equipmentOrders.push(formatted);
//       }
//       if (formatted.resources.manpower.length > 0) {
//         manpowerOrders.push(formatted);
//       }
//       if (formatted.resources.attachments.length > 0) {
//         attachmentOrders.push(formatted);
//       }
//     }

//     // Paginate helper
//     const paginateList = (orders) => {
//       const total = orders.length;
//       const offset = (parseInt(page) - 1) * parseInt(limit);
//       return {
//         totalOrders: total,
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(total / parseInt(limit)) || 1,
//         orders: orders.slice(offset, offset + parseInt(limit)),
//       };
//     };

//     return res.status(200).json({
//       equipment: paginateList(equipmentOrders),
//       manpower: paginateList(manpowerOrders),
//       attachments: paginateList(attachmentOrders),
//     });
//   } catch (error) {
//     console.error("Error filtering completed orders:", error);
//     return res.status(500).json({
//       message: "Error filtering completed orders",
//       error: error.message,
//     });
//   }
// };

// // ─── Debug (TEMP) ─────────────────────────────────────────────────────────────

// const debugOrders = async (req, res) => {
//   try {
//     const {
//       currentShiftType,
//       currentShiftDate,
//       nextShiftType,
//       nextShiftDate,
//     } = getShiftContext();

//     const allAllocations = await ActiveAllocationModel.findAll({
//       include: buildIncludes(),
//       order: [["allocation_date", "ASC"]],
//     });

//     const debugReport = [];

//     for (const alloc of allAllocations) {
//       const raw = alloc.toJSON();
//       const report = {
//         allocation_id: raw.allocation_id,
//         allocation_date: raw.allocation_date,
//         status: raw.status,
//         sales_order_id: raw.sales_order_id,
//         checks: {},
//       };

//       report.checks.statusOk = !["Completed", "Cancelled"].includes(
//         raw.status
//       );
//       report.checks.salesOrderLoaded = !!raw.salesOrder;

//       if (raw.salesOrder) {
//         report.salesOrder = {
//           id: raw.salesOrder.id,
//           shift: raw.salesOrder.shift,
//           lpo_validity_date: raw.salesOrder.lpo_validity_date,
//           extended_lpo_validity_date: raw.salesOrder.extended_lpo_validity_date,
//           ops_status: raw.salesOrder.ops_status,
//           so_status: raw.salesOrder.so_status,
//         };
//       }

//       const eqCount = raw.equipmentAllocations?.length || 0;
//       const mpCount = raw.manpowerAllocations?.length || 0;
//       const attCount = raw.attachmentAllocations?.length || 0;
//       report.checks.hasResources = eqCount > 0 || mpCount > 0 || attCount > 0;
//       report.resourceCounts = {
//         equipment: eqCount,
//         manpower: mpCount,
//         attachments: attCount,
//       };

//       if (raw.salesOrder) {
//         const soShift = raw.salesOrder.shift || "";
//         report.checks.matchesCurrentShift =
//           soShift === currentShiftType ||
//           soShift === "Full" ||
//           soShift === "Day and Night";
//         report.checks.matchesNextShift =
//           soShift === nextShiftType ||
//           soShift === "Full" ||
//           soShift === "Day and Night";
//         report.checks.soShiftValue = soShift;
//         report.checks.currentShiftType = currentShiftType;
//       }

//       report.checks.allocationDateMatchesCurrentShift =
//         raw.allocation_date === currentShiftDate;
//       report.checks.allocationDateMatchesNextShift =
//         raw.allocation_date === nextShiftDate;
//       report.checks.currentShiftDate = currentShiftDate;
//       report.checks.nextShiftDate = nextShiftDate;

//       if (raw.salesOrder) {
//         const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
//         const lpoEndDate = getLpoEndDate(raw.salesOrder);
//         const effectiveStart =
//           scheduledDate || raw.allocation_date || currentShiftDate;

//         report.checks.scheduledDate = scheduledDate;
//         report.checks.lpoEndDate = lpoEndDate;
//         report.checks.effectiveStart = effectiveStart;
//         report.checks.activeWindowForCurrentShift = isInActiveWindow(
//           raw.salesOrder,
//           scheduledDate,
//           currentShiftDate,
//           raw.allocation_date
//         );
//         report.checks.activeWindowForNextShift = isInActiveWindow(
//           raw.salesOrder,
//           scheduledDate,
//           nextShiftDate,
//           raw.allocation_date
//         );
//       }

//       report.wouldAppearInCurrentShift =
//         report.checks.statusOk &&
//         report.checks.salesOrderLoaded &&
//         report.checks.hasResources &&
//         report.checks.matchesCurrentShift &&
//         report.checks.allocationDateMatchesCurrentShift &&
//         report.checks.activeWindowForCurrentShift;

//       report.wouldAppearInNextShift =
//         report.checks.statusOk &&
//         report.checks.salesOrderLoaded &&
//         report.checks.hasResources &&
//         report.checks.matchesNextShift &&
//         report.checks.allocationDateMatchesNextShift &&
//         report.checks.activeWindowForNextShift;

//       debugReport.push(report);
//     }

//     return res.status(200).json({
//       serverTime: new Date().toISOString(),
//       shiftContext: {
//         currentShiftType,
//         currentShiftDate,
//         nextShiftType,
//         nextShiftDate,
//       },
//       totalAllocationsInDB: debugReport.length,
//       allocations: debugReport,
//     });
//   } catch (error) {
//     console.error("Debug error:", error);
//     return res.status(500).json({
//       message: "Debug error",
//       error: error.message,
//       stack: error.stack,
//     });
//   }
// };

// module.exports = {
//   getShiftInfo,
//   getCurrentShiftOrders,
//   getNextShiftOrders,
//   getFutureOrders,
//   getAllActiveOrders,
//   getCompletedOrders,
//   getOrderById,
//   getOrdersBySalesOrder,
//   getAllFilterActiveOrders,
//   getFilterCompletedOrders,
//   debugOrders, // TEMP: remove before production
// };
const { Op } = require("sequelize");
const {
  ActiveAllocationModel,
  AllocationEquipmentModel,
  AllocationManpowerModel,
  AllocationAttachmentModel,
} = require("../models/ActiveAllocationsOriginalModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const EquipmentModel = require("../models/EquipmentModel");
const AttachmentModel = require("../models/AttachmentModel");
const EmployeeModel = require("../../../hr-service/src/models/employees/EmployeeModel");
const ManpowerModel = require("../models/ManpowerModel");
const JobLocationModel = require("../models/JobLocationModel");
const EquipmentScheduledModel = require("../models/EquipmentScheduledModel");
const ManpowerScheduledModel = require("../models/ManpowerScheduledModel");
const AttachmentScheduledModel = require("../models/AttachmentScheduledModel");
const OperatorTypeModel = require("../models/OperatorTypeModel");
const { DeliveryNoteModel, DeliveryNoteTripModel } = require("../models/DeliveryNoteModel");
const { OffHireNoteModel, OffHireNoteTripModel } = require("../models/OffHireNoteModel");

// ─── Shift Helpers ────────────────────────────────────────────────────────────

const toDateStr = (d) => d.toISOString().split("T")[0];

const getShiftContext = () => {
  const now = new Date();
  const hours = now.getHours();
  const isDay = hours >= 6 && hours <= 17;

  const today = toDateStr(now);
  const tomorrow = toDateStr(
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  );

  if (isDay) {
    return {
      currentShiftType: "Day",
      currentShiftDate: today,
      nextShiftType: "Night",
      nextShiftDate: today,
      futureAfterDate: today,
    };
  } else {
    return {
      currentShiftType: "Night",
      currentShiftDate: today,
      nextShiftType: "Day",
      nextShiftDate: tomorrow,
      futureAfterDate: tomorrow,
    };
  }
};

const getLpoEndDate = (so) =>
  so.extended_lpo_validity_date || so.lpo_validity_date || null;

// ─── Include Builder ──────────────────────────────────────────────────────────

const buildIncludes = () => [
  {
    model: SalesOrdersModel,
    as: "salesOrder",
    attributes: [
      "id",
      "so_number",
      "client",
      "project_name",
      "delivery_address",
      "shift",
      "lpo_number",
      "lpo_validity_date",
      "extended_lpo_validity_date",
      "expected_mobilization_date",
      "expected_demobilization_date",
      "ops_status",
      "so_status",
    ],
    include: [
      {
        model: JobLocationModel,
        as: "jobLocation",
        attributes: ["job_location_id", "job_location_name"],
      },
    ],
  },
  {
    model: AllocationEquipmentModel,
    as: "equipmentAllocations",
    include: [
      {
        model: EquipmentModel,
        as: "equipment",
        attributes: [
          "serial_number",
          "reg_number",
          "vehicle_type",
          "equipment_status",
          "equipment_status_note",
        ],
      },
    ],
  },
  {
    model: AllocationManpowerModel,
    as: "manpowerAllocations",
    include: [
      {
        model: EmployeeModel,
        as: "employee",
        attributes: ["id", "personalDetails"],
        include: [
          {
            model: ManpowerModel,
            as: "manpower",
            attributes: ["employeeNo", "manpower_status", "operator_type_id"],
            include: [
              {
                model: OperatorTypeModel,
                as: "operator_type",
                attributes: ["operator_type_id", "operator_type"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    model: AllocationAttachmentModel,
    as: "attachmentAllocations",
    include: [
      {
        model: AttachmentModel,
        as: "attachment",
        attributes: [
          "attachment_id",
          "attachment_number",
          "product_name",
          "serial_number",
          "attachment_status",
        ],
      },
    ],
  },
];

// ─── Section-specific Response Formatters ────────────────────────────────────
//
// Each formatter produces an order object shaped for its own section:
//
//  Equipment section order:
//    { allocation_id, allocation_date, status, service_option, user_remarks,
//      salesOrder, equipment: { reg_number }, scheduled_dates }
//
//  Manpower section order:
//    { ..., employee_no, scheduled_dates }
//
//  Attachment section order:
//    { ..., attachment_number, scheduled_dates }
//
// The full resources detail (for drill-down / detail views) is still available
// via GET /orders/:id which uses the standard full formatter.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Base fields for active order section formatters (includes scheduled_dates).
 */
const baseOrderFields = (raw, scheduledDatesMap) => ({
  allocation_id: raw.allocation_id,
  allocation_date: raw.allocation_date,
  status: raw.status,
  service_option: raw.service_option,
  user_remarks: raw.user_remarks,
  salesOrder: raw.salesOrder,
  scheduled_dates: scheduledDatesMap[raw.allocation_id] || null,
});

/**
 * Base fields for completed order section formatters
 * (replaces scheduled_dates with DN/OHN trip dates).
 */
const baseCompletedOrderFields = (raw, tripDatesMap) => ({
  allocation_id: raw.allocation_id,
  allocation_date: raw.allocation_date,
  status: raw.status,
  service_option: raw.service_option,
  user_remarks: raw.user_remarks,
  salesOrder: raw.salesOrder,
  delivery_note_trip_date: tripDatesMap[raw.allocation_id]?.delivery_note_trip_date || null,
  off_hire_note_trip_date: tripDatesMap[raw.allocation_id]?.off_hire_note_trip_date || null,
});

// Equipment — active (unchanged shape, just uses baseOrderFields)
const formatForEquipmentSection = (allocation, scheduledDatesMap = {}) => {
  const raw = allocation.toJSON ? allocation.toJSON() : allocation;
  const equipmentItems = (raw.equipmentAllocations || []).map((eq) => ({
    serial_number: eq.serial_number,
    reg_number: eq.equipment?.reg_number || null,
    vehicle_type: eq.equipment?.vehicle_type || null,
    equipment_status: eq.equipment?.equipment_status || null,
    equipment_status_note: eq.equipment?.equipment_status_note || null,
    eqt_stu: eq.eqt_stu,
    status: eq.status,
    note: eq.note,
    is_selected: eq.is_selected,
  }));
  return {
    ...baseOrderFields(raw, scheduledDatesMap),
    equipment: {
      reg_number: equipmentItems[0]?.reg_number || null,
      items: equipmentItems,
    },
  };
};

// Equipment — completed (uses trip dates instead of scheduled_dates)
const formatForEquipmentSectionCompleted = (allocation, tripDatesMap = {}) => {
  const raw = allocation.toJSON ? allocation.toJSON() : allocation;
  const equipmentItems = (raw.equipmentAllocations || []).map((eq) => ({
    serial_number: eq.serial_number,
    reg_number: eq.equipment?.reg_number || null,
    vehicle_type: eq.equipment?.vehicle_type || null,
    equipment_status: eq.equipment?.equipment_status || null,
    equipment_status_note: eq.equipment?.equipment_status_note || null,
    eqt_stu: eq.eqt_stu,
    status: eq.status,
    note: eq.note,
    is_selected: eq.is_selected,
  }));
  return {
    ...baseCompletedOrderFields(raw, tripDatesMap),
    equipment: {
      reg_number: equipmentItems[0]?.reg_number || null,
      items: equipmentItems,
    },
  };
};

// Manpower — active
const formatForManpowerSection = (allocation, scheduledDatesMap = {}) => {
  const raw = allocation.toJSON ? allocation.toJSON() : allocation;
  const manpowerItems = (raw.manpowerAllocations || []).map((mp) => ({
    employee_id: mp.employee_id,
    employee_no: mp.employee?.manpower?.[0]?.employeeNo || null,
    full_name: mp.employee?.personalDetails?.fullNameEnglish || null,
    manpower_status: mp.employee?.manpower?.[0]?.manpower_status || null,
    operator_type: mp.employee?.manpower?.[0]?.operator_type?.operator_type || null,
    man_stu: mp.man_stu,
    status: mp.status,
    note: mp.note,
    is_selected: mp.is_selected,
  }));
  return {
    ...baseOrderFields(raw, scheduledDatesMap),
    employee_no: manpowerItems[0]?.employee_no || null,
    manpower: { items: manpowerItems },
  };
};

// Manpower — completed
const formatForManpowerSectionCompleted = (allocation, tripDatesMap = {}) => {
  const raw = allocation.toJSON ? allocation.toJSON() : allocation;
  const manpowerItems = (raw.manpowerAllocations || []).map((mp) => ({
    employee_id: mp.employee_id,
    employee_no: mp.employee?.manpower?.[0]?.employeeNo || null,
    full_name: mp.employee?.personalDetails?.fullNameEnglish || null,
    manpower_status: mp.employee?.manpower?.[0]?.manpower_status || null,
    operator_type: mp.employee?.manpower?.[0]?.operator_type?.operator_type || null,
    man_stu: mp.man_stu,
    status: mp.status,
    note: mp.note,
    is_selected: mp.is_selected,
  }));
  return {
    ...baseCompletedOrderFields(raw, tripDatesMap),
    employee_no: manpowerItems[0]?.employee_no || null,
    manpower: { items: manpowerItems },
  };
};

// Attachment — active
const formatForAttachmentSection = (allocation, scheduledDatesMap = {}) => {
  const raw = allocation.toJSON ? allocation.toJSON() : allocation;
  const attachmentItems = (raw.attachmentAllocations || []).map((att) => ({
    attachment_id: att.attachment?.attachment_id || null,
    attachment_number: att.attachment?.attachment_number || null,
    product_name: att.attachment?.product_name || null,
    serial_number: att.attachment?.serial_number || null,
    attachment_status: att.attachment?.attachment_status || null,
    att_stu: att.att_stu,
    status: att.status,
    note: att.note,
    is_selected: att.is_selected,
  }));
  return {
    ...baseOrderFields(raw, scheduledDatesMap),
    attachment_number: attachmentItems[0]?.attachment_number || null,
    attachments: { items: attachmentItems },
  };
};

// Attachment — completed
const formatForAttachmentSectionCompleted = (allocation, tripDatesMap = {}) => {
  const raw = allocation.toJSON ? allocation.toJSON() : allocation;
  const attachmentItems = (raw.attachmentAllocations || []).map((att) => ({
    attachment_id: att.attachment?.attachment_id || null,
    attachment_number: att.attachment?.attachment_number || null,
    product_name: att.attachment?.product_name || null,
    serial_number: att.attachment?.serial_number || null,
    attachment_status: att.attachment?.attachment_status || null,
    att_stu: att.att_stu,
    status: att.status,
    note: att.note,
    is_selected: att.is_selected,
  }));
  return {
    ...baseCompletedOrderFields(raw, tripDatesMap),
    attachment_number: attachmentItems[0]?.attachment_number || null,
    attachments: { items: attachmentItems },
  };
};

// /**
//  * Base fields shared by all three section formatters.
//  */
// const baseOrderFields = (raw, scheduledDatesMap) => ({
//   allocation_id: raw.allocation_id,
//   allocation_date: raw.allocation_date,
//   status: raw.status,
//   service_option: raw.service_option,
//   user_remarks: raw.user_remarks,
//   salesOrder: raw.salesOrder,
//   scheduled_dates: scheduledDatesMap[raw.allocation_id] || null,
// });

// /**
//  * Formats an allocation for the EQUIPMENT section.
//  * Adds `equipment` field with reg_number of each allocated equipment.
//  *
//  * Shape:
//  * {
//  *   allocation_id, allocation_date, status, service_option, user_remarks,
//  *   salesOrder, scheduled_dates,
//  *   equipment: { reg_number: string | null }   ← first equipment's reg_number
//  *              or array if multiple: [{ reg_number }, ...]
//  * }
//  *
//  * We return one order entry per allocation (not per equipment item).
//  * reg_number is from the first allocated equipment; if multiple exist,
//  * all reg_numbers are included as an array.
//  */
// const formatForEquipmentSection = (allocation, scheduledDatesMap = {}) => {
//   const raw = allocation.toJSON ? allocation.toJSON() : allocation;

//   const equipmentItems = (raw.equipmentAllocations || []).map((eq) => ({
//     serial_number: eq.serial_number,
//     reg_number: eq.equipment?.reg_number || null,
//     vehicle_type: eq.equipment?.vehicle_type || null,
//     equipment_status: eq.equipment?.equipment_status || null,
//     equipment_status_note: eq.equipment?.equipment_status_note || null,
//     eqt_stu: eq.eqt_stu,
//     status: eq.status,
//     note: eq.note,
//     is_selected: eq.is_selected,
//   }));

//   return {
//     ...baseOrderFields(raw, scheduledDatesMap),
//     equipment: {
//       // Convenience field: first reg_number for quick display
//       reg_number: equipmentItems[0]?.reg_number || null,
//       // All allocated equipment for this allocation
//       items: equipmentItems,
//     },
//   };
// };

// /**
//  * Formats an allocation for the MANPOWER section.
//  * Adds `employee_no` field from the first allocated employee.
//  *
//  * Shape:
//  * {
//  *   allocation_id, allocation_date, status, service_option, user_remarks,
//  *   salesOrder, scheduled_dates,
//  *   employee_no: string | null,   ← first employee's employee number
//  *   manpower: { items: [...] }    ← all allocated manpower
//  * }
//  */
// const formatForManpowerSection = (allocation, scheduledDatesMap = {}) => {
//   const raw = allocation.toJSON ? allocation.toJSON() : allocation;

//   const manpowerItems = (raw.manpowerAllocations || []).map((mp) => ({
//     employee_id: mp.employee_id,
//     employee_no: mp.employee?.manpower?.[0]?.employeeNo || null,
//     full_name: mp.employee?.personalDetails?.fullNameEnglish || null,
//     manpower_status: mp.employee?.manpower?.[0]?.manpower_status || null,
//     operator_type:
//       mp.employee?.manpower?.[0]?.operator_type?.operator_type || null,
//     man_stu: mp.man_stu,
//     status: mp.status,
//     note: mp.note,
//     is_selected: mp.is_selected,
//   }));

//   return {
//     ...baseOrderFields(raw, scheduledDatesMap),
//     // Convenience field: first employee_no for quick display
//     employee_no: manpowerItems[0]?.employee_no || null,
//     manpower: {
//       items: manpowerItems,
//     },
//   };
// };

// /**
//  * Formats an allocation for the ATTACHMENTS section.
//  * Adds `attachment_number` field from the first allocated attachment.
//  *
//  * Shape:
//  * {
//  *   allocation_id, allocation_date, status, service_option, user_remarks,
//  *   salesOrder, scheduled_dates,
//  *   attachment_number: string | null,   ← first attachment's number
//  *   attachments: { items: [...] }       ← all allocated attachments
//  * }
//  */
// const formatForAttachmentSection = (allocation, scheduledDatesMap = {}) => {
//   const raw = allocation.toJSON ? allocation.toJSON() : allocation;

//   const attachmentItems = (raw.attachmentAllocations || []).map((att) => ({
//     attachment_id: att.attachment?.attachment_id || null,
//     attachment_number: att.attachment?.attachment_number || null,
//     product_name: att.attachment?.product_name || null,
//     serial_number: att.attachment?.serial_number || null,
//     attachment_status: att.attachment?.attachment_status || null,
//     att_stu: att.att_stu,
//     status: att.status,
//     note: att.note,
//     is_selected: att.is_selected,
//   }));

//   return {
//     ...baseOrderFields(raw, scheduledDatesMap),
//     // Convenience field: first attachment_number for quick display
//     attachment_number: attachmentItems[0]?.attachment_number || null,
//     attachments: {
//       items: attachmentItems,
//     },
//   };
// };

/**
 * Full formatter — used by getOrderById, getOrdersBySalesOrder,
 * getCurrentShiftOrders, getNextShiftOrders, getFutureOrders.
 * Returns all three resource arrays under `resources`.
 */
const formatAllocationResponse = (allocation, scheduledDatesMap = {}) => {
  const raw = allocation.toJSON ? allocation.toJSON() : allocation;

  const equipmentList = (raw.equipmentAllocations || []).map((eq) => ({
    resource_type: "equipment",
    allocation_detail: {
      id: eq.id,
      allocation_id: eq.allocation_id,
      serial_number: eq.serial_number,
      eqt_stu: eq.eqt_stu,
      status: eq.status,
      note: eq.note,
      is_selected: eq.is_selected,
    },
    equipment_info: eq.equipment
      ? {
          serial_number: eq.equipment.serial_number,
          reg_number: eq.equipment.reg_number,
          vehicle_type: eq.equipment.vehicle_type,
          equipment_status: eq.equipment.equipment_status,
          equipment_status_note: eq.equipment.equipment_status_note,
        }
      : null,
  }));

  const manpowerList = (raw.manpowerAllocations || []).map((mp) => ({
    resource_type: "manpower",
    allocation_detail: {
      id: mp.id,
      allocation_id: mp.allocation_id,
      employee_id: mp.employee_id,
      man_stu: mp.man_stu,
      status: mp.status,
      note: mp.note,
      is_selected: mp.is_selected,
    },
    employee_info: mp.employee
      ? {
          id: mp.employee.id,
          full_name: mp.employee.personalDetails?.fullNameEnglish || null,
          employee_no: mp.employee.manpower?.[0]?.employeeNo || null,
          manpower_status: mp.employee.manpower?.[0]?.manpower_status || null,
          operator_type:
            mp.employee.manpower?.[0]?.operator_type?.operator_type || null,
        }
      : null,
  }));

  const attachmentList = (raw.attachmentAllocations || []).map((att) => ({
    resource_type: "attachment",
    allocation_detail: {
      id: att.id,
      allocation_id: att.allocation_id,
      attachment_id: att.attachment_id,
      att_stu: att.att_stu,
      status: att.status,
      note: att.note,
      is_selected: att.is_selected,
    },
    attachment_info: att.attachment
      ? {
          attachment_id: att.attachment.attachment_id,
          attachment_number: att.attachment.attachment_number,
          product_name: att.attachment.product_name,
          serial_number: att.attachment.serial_number,
          attachment_status: att.attachment.attachment_status,
        }
      : null,
  }));

  return {
    allocation_id: raw.allocation_id,
    allocation_date: raw.allocation_date,
    status: raw.status,
    service_option: raw.service_option,
    user_remarks: raw.user_remarks,
    salesOrder: raw.salesOrder,
    resources: {
      equipment: equipmentList,
      manpower: manpowerList,
      attachments: attachmentList,
      summary: {
        total_equipment: equipmentList.length,
        total_manpower: manpowerList.length,
        total_attachments: attachmentList.length,
        total_resources:
          equipmentList.length + manpowerList.length + attachmentList.length,
      },
    },
    scheduled_dates: scheduledDatesMap[raw.allocation_id] || null,
  };
};

// ─── Scheduled Date Helper ────────────────────────────────────────────────────

// ─── Scheduled Date Helper ────────────────────────────────────────────────────

const fetchScheduledDateForSO = async (soId) => {
  if (!soId) return null;

  const findEarliest = async (Model) => {
    let record = await Model.findOne({
      where: { so_id: soId, is_selected: true },
      order: [["scheduled_date", "ASC"]],
      attributes: ["scheduled_date"],
    });
    if (!record) {
      record = await Model.findOne({
        where: { so_id: soId },
        order: [["scheduled_date", "ASC"]],
        attributes: ["scheduled_date"],
      });
    }
    return record ? record.get("scheduled_date") : null;
  };

  const [eqDate, mpDate, attDate] = await Promise.all([
    findEarliest(EquipmentScheduledModel),
    findEarliest(ManpowerScheduledModel),
    findEarliest(AttachmentScheduledModel),
  ]);

  const dates = [eqDate, mpDate, attDate].filter(Boolean).sort();
  return dates[0] || null;
};

const isInActiveWindow = (
  salesOrder,
  scheduledDate,
  referenceDate,
  allocationDate = null
) => {
  const lpoEndDate = getLpoEndDate(salesOrder);
  const effectiveStart = scheduledDate || allocationDate || referenceDate;
  if (!lpoEndDate) return effectiveStart <= referenceDate;
  return effectiveStart <= referenceDate && lpoEndDate >= referenceDate;
};

// ─── Fetch DN / OHN trip dates for a completed allocation ────────────────────

const fetchTripDatesForAllocation = async (allocationId) => {
  if (!allocationId) return { delivery_note_trip_date: null, off_hire_note_trip_date: null };

  // Earliest DN trip date for this allocation
  const dnTrip = await DeliveryNoteTripModel.findOne({
    include: [
      {
        model: DeliveryNoteModel,
        as: "deliveryNote",
        where: { allocation_id: allocationId },
        attributes: [],
      },
    ],
    order: [["trip_date", "ASC"]],
    attributes: ["trip_date"],
  });

  // Latest OHN trip date for this allocation
  const ohnTrip = await OffHireNoteTripModel.findOne({
    include: [
      {
        model: OffHireNoteModel,
        as: "offHireNote",
        where: { allocation_id: allocationId },
        attributes: [],
      },
    ],
    order: [["trip_date", "DESC"]],
    attributes: ["trip_date"],
  });

  return {
    delivery_note_trip_date: dnTrip ? dnTrip.get("trip_date") : null,
    off_hire_note_trip_date: ohnTrip ? ohnTrip.get("trip_date") : null,
  };
};

// ─── Controller Functions ─────────────────────────────────────────────────────

const getShiftInfo = async (req, res) => {
  try {
    const info = getShiftContext();
    return res.status(200).json({
      serverTime: new Date().toISOString(),
      ...info,
      shiftWindows: {
        day: "06:00 – 17:59",
        night: "18:00 – 05:59 (next day)",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ─── Individual shift endpoints (flat list – full formatter) ──────────────────

const getCurrentShiftOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { currentShiftType, currentShiftDate } = getShiftContext();

    const allocations = await ActiveAllocationModel.findAll({
      where: {
        allocation_date: currentShiftDate,
        status: { [Op.notIn]: ["Completed", "Cancelled"] },
      },
      include: buildIncludes(),
      order: [["createdAt", "ASC"]],
    });

    const result = [];
    for (const alloc of allocations) {
      const raw = alloc.toJSON();
      const hasResources =
        raw.equipmentAllocations.length > 0 ||
        raw.manpowerAllocations.length > 0 ||
        raw.attachmentAllocations.length > 0;
      if (!hasResources || !raw.salesOrder) continue;

      const soShift = raw.salesOrder.shift || "";
      const matchesShift =
        soShift === currentShiftType ||
        soShift === "Full" ||
        soShift === "Day and Night";
      if (!matchesShift) continue;

      const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
      if (
        !isInActiveWindow(
          raw.salesOrder,
          scheduledDate,
          currentShiftDate,
          raw.allocation_date
        )
      )
        continue;

      result.push(
        formatAllocationResponse(alloc, {
          [raw.allocation_id]: { scheduled_date: scheduledDate },
        })
      );
    }

    const total = result.length;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    return res.status(200).json({
      shiftType: currentShiftType,
      shiftDate: currentShiftDate,
      totalOrders: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      orders: result.slice(offset, offset + parseInt(limit)),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching current shift orders",
      error: error.message,
    });
  }
};

const getNextShiftOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { nextShiftType, nextShiftDate } = getShiftContext();

    const allocations = await ActiveAllocationModel.findAll({
      where: {
        allocation_date: nextShiftDate,
        status: { [Op.notIn]: ["Completed", "Cancelled"] },
      },
      include: buildIncludes(),
      order: [["createdAt", "ASC"]],
    });

    const result = [];
    for (const alloc of allocations) {
      const raw = alloc.toJSON();
      const hasResources =
        raw.equipmentAllocations.length > 0 ||
        raw.manpowerAllocations.length > 0 ||
        raw.attachmentAllocations.length > 0;
      if (!hasResources || !raw.salesOrder) continue;

      const soShift = raw.salesOrder.shift || "";
      const matchesShift =
        soShift === nextShiftType ||
        soShift === "Full" ||
        soShift === "Day and Night";
      if (!matchesShift) continue;

      const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
      if (
        !isInActiveWindow(
          raw.salesOrder,
          scheduledDate,
          nextShiftDate,
          raw.allocation_date
        )
      )
        continue;

      result.push(
        formatAllocationResponse(alloc, {
          [raw.allocation_id]: { scheduled_date: scheduledDate },
        })
      );
    }

    const total = result.length;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    return res.status(200).json({
      shiftType: nextShiftType,
      shiftDate: nextShiftDate,
      totalOrders: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      orders: result.slice(offset, offset + parseInt(limit)),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching next shift orders",
      error: error.message,
    });
  }
};

const getFutureOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { nextShiftDate } = getShiftContext();

    const allocations = await ActiveAllocationModel.findAll({
      where: {
        allocation_date: { [Op.gt]: nextShiftDate },
        status: { [Op.notIn]: ["Completed", "Cancelled"] },
      },
      include: buildIncludes(),
      order: [["allocation_date", "ASC"]],
    });

    const result = [];
    for (const alloc of allocations) {
      const raw = alloc.toJSON();
      const hasResources =
        raw.equipmentAllocations.length > 0 ||
        raw.manpowerAllocations.length > 0 ||
        raw.attachmentAllocations.length > 0;
      if (!hasResources || !raw.salesOrder) continue;

      const lpoEndDate = getLpoEndDate(raw.salesOrder);
      if (!lpoEndDate || lpoEndDate < raw.allocation_date) continue;

      const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
      result.push(
        formatAllocationResponse(alloc, {
          [raw.allocation_id]: { scheduled_date: scheduledDate },
        })
      );
    }

    const total = result.length;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    return res.status(200).json({
      totalOrders: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)) || 1,
      orders: result.slice(offset, offset + parseInt(limit)),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching future orders",
      error: error.message,
    });
  }
};

// ─── Core helper: build allocation buckets ────────────────────────────────────

/**
 * Iterates all allocations and fills resource-type buckets using section-specific
 * formatters so each section's orders carry the correct identifier field.
 *
 * Returns:
 * {
 *   equipment:   { currentShift: [], nextShift: [], futureOrders: [] },
 *   manpower:    { currentShift: [], nextShift: [], futureOrders: [] },
 *   attachments: { currentShift: [], nextShift: [], futureOrders: [] },
 * }
 */
const buildActiveBuckets = async (allAllocations, shiftCtx) => {
  const { currentShiftType, currentShiftDate, nextShiftType, nextShiftDate } =
    shiftCtx;

  const buckets = {
    equipment: { currentShift: [], nextShift: [], futureOrders: [] },
    manpower: { currentShift: [], nextShift: [], futureOrders: [] },
    attachments: { currentShift: [], nextShift: [], futureOrders: [] },
  };

  for (const alloc of allAllocations) {
    const raw = alloc.toJSON();
    if (!raw.salesOrder) continue;

    const hasResources =
      raw.equipmentAllocations.length > 0 ||
      raw.manpowerAllocations.length > 0 ||
      raw.attachmentAllocations.length > 0;
    if (!hasResources) continue;

    const soShift = raw.salesOrder.shift || "";
    const allocDate = raw.allocation_date;
    const lpoEndDate = getLpoEndDate(raw.salesOrder);
    const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
    const sdMap = { [raw.allocation_id]: { scheduled_date: scheduledDate } };

    const matchesCurrentShift =
      soShift === currentShiftType ||
      soShift === "Full" ||
      soShift === "Day and Night";
    const matchesNextShift =
      soShift === nextShiftType ||
      soShift === "Full" ||
      soShift === "Day and Night";

    let shiftGroup = null;

    if (allocDate === currentShiftDate && matchesCurrentShift) {
      if (
        isInActiveWindow(
          raw.salesOrder,
          scheduledDate,
          currentShiftDate,
          allocDate
        )
      )
        shiftGroup = "currentShift";
    } else if (allocDate === nextShiftDate && matchesNextShift) {
      if (
        isInActiveWindow(
          raw.salesOrder,
          scheduledDate,
          nextShiftDate,
          allocDate
        )
      )
        shiftGroup = "nextShift";
    } else if (allocDate > nextShiftDate) {
      if (lpoEndDate && lpoEndDate >= allocDate) shiftGroup = "futureOrders";
    }

    if (!shiftGroup) continue;

    if (raw.equipmentAllocations.length > 0)
      buckets.equipment[shiftGroup].push(formatForEquipmentSection(alloc, sdMap));
    if (raw.manpowerAllocations.length > 0)
      buckets.manpower[shiftGroup].push(formatForManpowerSection(alloc, sdMap));
    if (raw.attachmentAllocations.length > 0)
      buckets.attachments[shiftGroup].push(formatForAttachmentSection(alloc, sdMap));
  }

  return buckets;
};

// ─── getAllActiveOrders ───────────────────────────────────────────────────────

/**
 * GET /api/operational-handling/active-orders
 *
 * Response:
 * {
 *   equipment: {
 *     currentShift: { shiftType, shiftDate, totalOrders, orders: [{ ..., equipment: { reg_number, items } }] },
 *     nextShift:    { ... },
 *     futureOrders: { totalOrders, orders: [...] }
 *   },
 *   manpower: {
 *     currentShift: { shiftType, shiftDate, totalOrders, orders: [{ ..., employee_no, manpower: { items } }] },
 *     ...
 *   },
 *   attachments: {
 *     currentShift: { shiftType, shiftDate, totalOrders, orders: [{ ..., attachment_number, attachments: { items } }] },
 *     ...
 *   }
 * }
 */
const getAllActiveOrders = async (req, res) => {
  try {
    const shiftCtx = getShiftContext();
    const { currentShiftType, currentShiftDate, nextShiftType, nextShiftDate } =
      shiftCtx;

    const allAllocations = await ActiveAllocationModel.findAll({
      where: { status: { [Op.notIn]: ["Completed", "Cancelled"] } },
      include: buildIncludes(),
      order: [["allocation_date", "ASC"]],
    });

    const buckets = await buildActiveBuckets(allAllocations, shiftCtx);

    const makeShiftGroup = (orders, shiftType, shiftDate) => ({
      shiftType,
      shiftDate,
      totalOrders: orders.length,
      orders,
    });

    const makeFutureGroup = (orders) => ({
      totalOrders: orders.length,
      orders,
    });

    return res.status(200).json({
      equipment: {
        currentShift: makeShiftGroup(
          buckets.equipment.currentShift,
          currentShiftType,
          currentShiftDate
        ),
        nextShift: makeShiftGroup(
          buckets.equipment.nextShift,
          nextShiftType,
          nextShiftDate
        ),
        futureOrders: makeFutureGroup(buckets.equipment.futureOrders),
      },
      manpower: {
        currentShift: makeShiftGroup(
          buckets.manpower.currentShift,
          currentShiftType,
          currentShiftDate
        ),
        nextShift: makeShiftGroup(
          buckets.manpower.nextShift,
          nextShiftType,
          nextShiftDate
        ),
        futureOrders: makeFutureGroup(buckets.manpower.futureOrders),
      },
      attachments: {
        currentShift: makeShiftGroup(
          buckets.attachments.currentShift,
          currentShiftType,
          currentShiftDate
        ),
        nextShift: makeShiftGroup(
          buckets.attachments.nextShift,
          nextShiftType,
          nextShiftDate
        ),
        futureOrders: makeFutureGroup(buckets.attachments.futureOrders),
      },
    });
  } catch (error) {
    console.error("Error fetching all active orders:", error);
    return res.status(500).json({
      message: "Error fetching all active orders",
      error: error.message,
    });
  }
};

// ─── getCompletedOrders ───────────────────────────────────────────────────────

/**
 * GET /api/operational-handling/completed-orders
 *
 * Response:
 * {
 *   equipment:   { totalOrders, currentPage, totalPages, orders: [{ ..., equipment: { reg_number, items } }] },
 *   manpower:    { totalOrders, currentPage, totalPages, orders: [{ ..., employee_no, manpower: { items } }] },
 *   attachments: { totalOrders, currentPage, totalPages, orders: [{ ..., attachment_number, attachments: { items } }] }
 * }
 */
const getCompletedOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, from_date, to_date } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let filteredAllocationIds = null;

    if (from_date || to_date) {
      const dnTrips = from_date
        ? await DeliveryNoteTripModel.findAll({
            where: { trip_date: { [Op.gte]: from_date } },
            include: [{ model: DeliveryNoteModel, as: "deliveryNote", attributes: ["allocation_id"] }],
            attributes: ["dn_id"],
          })
        : [];

      const ohnTrips = to_date
        ? await OffHireNoteTripModel.findAll({
            where: { trip_date: { [Op.lte]: to_date } },
            include: [{ model: OffHireNoteModel, as: "offHireNote", attributes: ["allocation_id"] }],
            attributes: ["ohn_id"],
          })
        : [];

      const dnAllocationIds = dnTrips.map((t) => t.deliveryNote?.allocation_id).filter(Boolean);
      const ohnAllocationIds = ohnTrips.map((t) => t.offHireNote?.allocation_id).filter(Boolean);

      if (from_date && to_date) {
        const dnSet = new Set(dnAllocationIds);
        filteredAllocationIds = ohnAllocationIds.filter((id) => dnSet.has(id));
      } else if (from_date) {
        filteredAllocationIds = dnAllocationIds;
      } else {
        filteredAllocationIds = ohnAllocationIds;
      }

      if (filteredAllocationIds.length === 0) {
        return res.status(200).json({
          equipment:   { totalOrders: 0, currentPage: parseInt(page), totalPages: 1, orders: [] },
          manpower:    { totalOrders: 0, currentPage: parseInt(page), totalPages: 1, orders: [] },
          attachments: { totalOrders: 0, currentPage: parseInt(page), totalPages: 1, orders: [] },
        });
      }
    }

    const whereClause = {
      ...(filteredAllocationIds && {
        allocation_id: { [Op.in]: filteredAllocationIds },
      }),
    };

    const includes = buildIncludes();
    includes[0] = {
      ...includes[0],
      where: { ops_status: "Completed" },
      required: true,
    };

    const { count, rows } = await ActiveAllocationModel.findAndCountAll({
      where: whereClause,
      include: includes,
      offset,
      limit: parseInt(limit),
      order: [["allocation_date", "DESC"]],
      distinct: true,
    });

    const equipmentOrders = [];
    const manpowerOrders = [];
    const attachmentOrders = [];

    for (const alloc of rows) {
      const raw = alloc.toJSON();
      const hasResources =
        (raw.equipmentAllocations?.length || 0) > 0 ||
        (raw.manpowerAllocations?.length || 0) > 0 ||
        (raw.attachmentAllocations?.length || 0) > 0;
      if (!hasResources) continue;

      // Fetch trip dates for this allocation
      const tripDates = await fetchTripDatesForAllocation(raw.allocation_id);
      const tripDatesMap = { [raw.allocation_id]: tripDates };

      if (raw.equipmentAllocations?.length > 0)
        equipmentOrders.push(formatForEquipmentSectionCompleted(alloc, tripDatesMap));
      if (raw.manpowerAllocations?.length > 0)
        manpowerOrders.push(formatForManpowerSectionCompleted(alloc, tripDatesMap));
      if (raw.attachmentAllocations?.length > 0)
        attachmentOrders.push(formatForAttachmentSectionCompleted(alloc, tripDatesMap));
    }

    const totalPages = Math.ceil(count / parseInt(limit)) || 1;

    return res.status(200).json({
      equipment:   { totalOrders: equipmentOrders.length, currentPage: parseInt(page), totalPages, orders: equipmentOrders },
      manpower:    { totalOrders: manpowerOrders.length,  currentPage: parseInt(page), totalPages, orders: manpowerOrders },
      attachments: { totalOrders: attachmentOrders.length, currentPage: parseInt(page), totalPages, orders: attachmentOrders },
    });
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    return res.status(500).json({
      message: "Error fetching completed orders",
      error: error.message,
    });
  }
};
// const getCompletedOrders = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, from_date, to_date } = req.query;
//     const offset = (parseInt(page) - 1) * parseInt(limit);

//     const dateFilter = {};
//     if (from_date) dateFilter[Op.gte] = from_date;
//     if (to_date) dateFilter[Op.lte] = to_date;

//     const { count, rows } = await ActiveAllocationModel.findAndCountAll({
//       where: {
//         status: "Completed",
//         ...(Object.keys(dateFilter).length > 0 && {
//           allocation_date: dateFilter,
//         }),
//       },
//       include: buildIncludes(),
//       offset,
//       limit: parseInt(limit),
//       order: [["allocation_date", "DESC"]],
//       distinct: true,
//     });

//     const equipmentOrders = [];
//     const manpowerOrders = [];
//     const attachmentOrders = [];

//     for (const alloc of rows) {
//       const raw = alloc.toJSON();
//       const hasResources =
//         (raw.equipmentAllocations?.length || 0) > 0 ||
//         (raw.manpowerAllocations?.length || 0) > 0 ||
//         (raw.attachmentAllocations?.length || 0) > 0;
//       if (!hasResources) continue;

//       if (raw.equipmentAllocations?.length > 0)
//         equipmentOrders.push(formatForEquipmentSection(alloc));
//       if (raw.manpowerAllocations?.length > 0)
//         manpowerOrders.push(formatForManpowerSection(alloc));
//       if (raw.attachmentAllocations?.length > 0)
//         attachmentOrders.push(formatForAttachmentSection(alloc));
//     }

//     const totalPages = Math.ceil(count / parseInt(limit)) || 1;

//     return res.status(200).json({
//       equipment: {
//         totalOrders: equipmentOrders.length,
//         currentPage: parseInt(page),
//         totalPages,
//         orders: equipmentOrders,
//       },
//       manpower: {
//         totalOrders: manpowerOrders.length,
//         currentPage: parseInt(page),
//         totalPages,
//         orders: manpowerOrders,
//       },
//       attachments: {
//         totalOrders: attachmentOrders.length,
//         currentPage: parseInt(page),
//         totalPages,
//         orders: attachmentOrders,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching completed orders:", error);
//     return res.status(500).json({
//       message: "Error fetching completed orders",
//       error: error.message,
//     });
//   }
// };

// ─── Single & SO-level Lookup ─────────────────────────────────────────────────

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const alloc = await ActiveAllocationModel.findByPk(id, {
      include: buildIncludes(),
    });
    if (!alloc)
      return res.status(404).json({ message: "Allocation record not found" });

    const raw = alloc.toJSON();
    const scheduledDate = raw.salesOrder
      ? await fetchScheduledDateForSO(raw.salesOrder.id)
      : null;

    return res.status(200).json(
      formatAllocationResponse(alloc, {
        [raw.allocation_id]: { scheduled_date: scheduledDate },
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

const getOrdersBySalesOrder = async (req, res) => {
  try {
    const { so_id } = req.params;
    const allocations = await ActiveAllocationModel.findAll({
      where: { sales_order_id: so_id },
      include: buildIncludes(),
      order: [["allocation_date", "ASC"]],
    });

    if (!allocations.length)
      return res.status(404).json({
        message: "No allocations found for this sales order",
        orders: [],
      });

    const scheduledDate = await fetchScheduledDateForSO(parseInt(so_id));
    const formatted = allocations.map((alloc) =>
      formatAllocationResponse(alloc, {
        [alloc.allocation_id]: { scheduled_date: scheduledDate },
      })
    );

    return res.status(200).json({
      so_id: parseInt(so_id),
      totalAllocations: formatted.length,
      orders: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching orders by sales order",
      error: error.message,
    });
  }
};

// ─── getAllFilterActiveOrders ─────────────────────────────────────────────────

/**
 * GET /api/operational-handling/active-orders/filter
 *
 * Same structure as getAllActiveOrders (resource-type first, shift groups inside).
 * Each section's shift groups are individually paginated.
 *
 * Filter params:
 *   so_number          – partial SO number match (all sections)
 *   service_option     – exact allocation service_option match (all sections)
 *   shift              – exact SO shift match (all sections)
 *   scheduled_date_from / scheduled_date_to – scheduled_date range (all sections)
 *   reg_number         – partial equipment reg_number → equipment section only
 *   employee_no        – partial employeeNo           → manpower section only
 *   attachment_number  – partial attachment_number    → attachments section only
 *   page / limit       – pagination per section
 */
const getAllFilterActiveOrders = async (req, res) => {
  try {
    const {
      so_number = "",
      service_option = "",
      shift = "",
      scheduled_date_from = "",
      scheduled_date_to = "",
      reg_number = "",
      employee_no = "",
      attachment_number = "",
      page = 1,
      limit = 10,
    } = req.query;

    const shiftCtx = getShiftContext();
    const { currentShiftType, currentShiftDate, nextShiftType, nextShiftDate } =
      shiftCtx;

    // ── SO-level where ──
    const soWhere = {};
    if (so_number) soWhere.so_number = { [Op.like]: `%${so_number}%` };
    if (shift) soWhere.shift = shift;

    // ── Build includes with resource-level filters ──
    const equipmentInclude = {
      model: AllocationEquipmentModel,
      as: "equipmentAllocations",
      include: [
        {
          model: EquipmentModel,
          as: "equipment",
          attributes: [
            "serial_number",
            "reg_number",
            "vehicle_type",
            "equipment_status",
            "equipment_status_note",
          ],
          ...(reg_number && {
            where: { reg_number: { [Op.like]: `%${reg_number}%` } },
          }),
        },
      ],
    };

    const manpowerInclude = {
      model: AllocationManpowerModel,
      as: "manpowerAllocations",
      include: [
        {
          model: EmployeeModel,
          as: "employee",
          attributes: ["id", "personalDetails"],
          include: [
            {
              model: ManpowerModel,
              as: "manpower",
              attributes: ["employeeNo", "manpower_status", "operator_type_id"],
              ...(employee_no && {
                where: { employeeNo: { [Op.like]: `%${employee_no}%` } },
              }),
              include: [
                {
                  model: OperatorTypeModel,
                  as: "operator_type",
                  attributes: ["operator_type_id", "operator_type"],
                },
              ],
            },
          ],
        },
      ],
    };

    const attachmentInclude = {
      model: AllocationAttachmentModel,
      as: "attachmentAllocations",
      include: [
        {
          model: AttachmentModel,
          as: "attachment",
          attributes: [
            "attachment_id",
            "attachment_number",
            "product_name",
            "serial_number",
            "attachment_status",
          ],
          ...(attachment_number && {
            where: {
              attachment_number: { [Op.like]: `%${attachment_number}%` },
            },
          }),
        },
      ],
    };

    const includes = [
      {
        model: SalesOrdersModel,
        as: "salesOrder",
        attributes: [
          "id",
          "so_number",
          "client",
          "project_name",
          "delivery_address",
          "shift",
          "lpo_number",
          "lpo_validity_date",
          "extended_lpo_validity_date",
          "expected_mobilization_date",
          "expected_demobilization_date",
          "ops_status",
          "so_status",
        ],
        where: Object.keys(soWhere).length ? soWhere : undefined,
        include: [
          {
            model: JobLocationModel,
            as: "jobLocation",
            attributes: ["job_location_id", "job_location_name"],
          },
        ],
      },
      equipmentInclude,
      manpowerInclude,
      attachmentInclude,
    ];

    const allocWhere = {
      status: { [Op.notIn]: ["Completed", "Cancelled"] },
    };
    if (service_option) allocWhere.service_option = service_option;

    const allAllocations = await ActiveAllocationModel.findAll({
      where: allocWhere,
      include: includes,
      order: [["allocation_date", "ASC"]],
    });

    // Buckets: resource type → shift group → orders array
    const buckets = {
      equipment: { currentShift: [], nextShift: [], futureOrders: [] },
      manpower: { currentShift: [], nextShift: [], futureOrders: [] },
      attachments: { currentShift: [], nextShift: [], futureOrders: [] },
    };

    for (const alloc of allAllocations) {
      const raw = alloc.toJSON();
      if (!raw.salesOrder) continue;

      // Scheduled date range filter
      if (scheduled_date_from || scheduled_date_to) {
        const sd = await fetchScheduledDateForSO(raw.salesOrder.id);
        if (!sd) continue;
        if (scheduled_date_from && sd < scheduled_date_from) continue;
        if (scheduled_date_to && sd > scheduled_date_to) continue;
      }

      const hasResources =
        raw.equipmentAllocations.length > 0 ||
        raw.manpowerAllocations.length > 0 ||
        raw.attachmentAllocations.length > 0;
      if (!hasResources) continue;

      const soShift = raw.salesOrder.shift || "";
      const allocDate = raw.allocation_date;
      const lpoEndDate = getLpoEndDate(raw.salesOrder);
      const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
      const sdMap = { [raw.allocation_id]: { scheduled_date: scheduledDate } };

      const matchesCurrentShift =
        soShift === currentShiftType ||
        soShift === "Full" ||
        soShift === "Day and Night";
      const matchesNextShift =
        soShift === nextShiftType ||
        soShift === "Full" ||
        soShift === "Day and Night";

      let shiftGroup = null;
      if (allocDate === currentShiftDate && matchesCurrentShift) {
        if (
          isInActiveWindow(
            raw.salesOrder,
            scheduledDate,
            currentShiftDate,
            allocDate
          )
        )
          shiftGroup = "currentShift";
      } else if (allocDate === nextShiftDate && matchesNextShift) {
        if (
          isInActiveWindow(
            raw.salesOrder,
            scheduledDate,
            nextShiftDate,
            allocDate
          )
        )
          shiftGroup = "nextShift";
      } else if (allocDate > nextShiftDate) {
        if (lpoEndDate && lpoEndDate >= allocDate) shiftGroup = "futureOrders";
      }

      if (!shiftGroup) continue;

      if (raw.equipmentAllocations.length > 0)
        buckets.equipment[shiftGroup].push(
          formatForEquipmentSection(alloc, sdMap)
        );
      if (raw.manpowerAllocations.length > 0)
        buckets.manpower[shiftGroup].push(
          formatForManpowerSection(alloc, sdMap)
        );
      if (raw.attachmentAllocations.length > 0)
        buckets.attachments[shiftGroup].push(
          formatForAttachmentSection(alloc, sdMap)
        );
    }

    // Paginate helper
    const paginate = (orders) => {
      const total = orders.length;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      return {
        totalOrders: total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)) || 1,
        orders: orders.slice(offset, offset + parseInt(limit)),
      };
    };

    const makeSection = (bucket, sType, sDate) => ({
      currentShift: { shiftType: sType, shiftDate: sDate, ...paginate(bucket.currentShift) },
      nextShift: {
        shiftType: nextShiftType,
        shiftDate: nextShiftDate,
        ...paginate(bucket.nextShift),
      },
      futureOrders: paginate(bucket.futureOrders),
    });

    return res.status(200).json({
      equipment: makeSection(
        buckets.equipment,
        currentShiftType,
        currentShiftDate
      ),
      manpower: makeSection(
        buckets.manpower,
        currentShiftType,
        currentShiftDate
      ),
      attachments: makeSection(
        buckets.attachments,
        currentShiftType,
        currentShiftDate
      ),
    });
  } catch (error) {
    console.error("Error filtering active orders:", error);
    return res.status(500).json({
      message: "Error filtering active orders",
      error: error.message,
    });
  }
};

// ─── getFilterCompletedOrders ─────────────────────────────────────────────────

/**
 * GET /api/operational-handling/completed-orders/filter
 *
 * Same structure as getCompletedOrders (resource-type first).
 * Each section is independently paginated.
 *
 * Filter params:
 *   so_number / service_option / shift (all sections)
 *   from_date / to_date               – allocation_date range
 *   scheduled_date_from / scheduled_date_to
 *   reg_number         → equipment section only
 *   employee_no        → manpower section only
 *   attachment_number  → attachments section only
 *   page / limit
 */
const getFilterCompletedOrders = async (req, res) => {
  try {
    const {
      so_number = "",
      service_option = "",
      shift = "",
      reg_number = "",
      employee_no = "",
      attachment_number = "",
      from_date = "",
      to_date = "",
      page = 1,
      limit = 10,
    } = req.query;

    const soWhere = { ops_status: "Completed" };
    if (so_number) soWhere.so_number = { [Op.like]: `%${so_number}%` };
    if (shift) soWhere.shift = shift;

    const equipmentInclude = {
      model: AllocationEquipmentModel,
      as: "equipmentAllocations",
      include: [
        {
          model: EquipmentModel,
          as: "equipment",
          attributes: ["serial_number", "reg_number", "vehicle_type", "equipment_status", "equipment_status_note"],
          ...(reg_number && { where: { reg_number: { [Op.like]: `%${reg_number}%` } } }),
        },
      ],
    };

    const manpowerInclude = {
      model: AllocationManpowerModel,
      as: "manpowerAllocations",
      include: [
        {
          model: EmployeeModel,
          as: "employee",
          attributes: ["id", "personalDetails"],
          include: [
            {
              model: ManpowerModel,
              as: "manpower",
              attributes: ["employeeNo", "manpower_status", "operator_type_id"],
              ...(employee_no && { where: { employeeNo: { [Op.like]: `%${employee_no}%` } } }),
              include: [
                { model: OperatorTypeModel, as: "operator_type", attributes: ["operator_type_id", "operator_type"] },
              ],
            },
          ],
        },
      ],
    };

    const attachmentInclude = {
      model: AllocationAttachmentModel,
      as: "attachmentAllocations",
      include: [
        {
          model: AttachmentModel,
          as: "attachment",
          attributes: ["attachment_id", "attachment_number", "product_name", "serial_number", "attachment_status"],
          ...(attachment_number && { where: { attachment_number: { [Op.like]: `%${attachment_number}%` } } }),
        },
      ],
    };

    const includes = [
      {
        model: SalesOrdersModel,
        as: "salesOrder",
        attributes: [
          "id", "so_number", "client", "project_name", "delivery_address", "shift",
          "lpo_number", "lpo_validity_date", "extended_lpo_validity_date",
          "expected_mobilization_date", "expected_demobilization_date", "ops_status", "so_status",
        ],
        where: soWhere,
        required: true,
        include: [
          { model: JobLocationModel, as: "jobLocation", attributes: ["job_location_id", "job_location_name"] },
        ],
      },
      equipmentInclude,
      manpowerInclude,
      attachmentInclude,
    ];

    const allocWhere = {};
    if (service_option) allocWhere.service_option = service_option;

    // DN/OHN based date filtering
    let filteredAllocationIds = null;

    if (from_date || to_date) {
      const dnTrips = from_date
        ? await DeliveryNoteTripModel.findAll({
            where: { trip_date: { [Op.gte]: from_date } },
            include: [{ model: DeliveryNoteModel, as: "deliveryNote", attributes: ["allocation_id"] }],
            attributes: ["dn_id"],
          })
        : [];

      const ohnTrips = to_date
        ? await OffHireNoteTripModel.findAll({
            where: { trip_date: { [Op.lte]: to_date } },
            include: [{ model: OffHireNoteModel, as: "offHireNote", attributes: ["allocation_id"] }],
            attributes: ["ohn_id"],
          })
        : [];

      const dnAllocationIds = dnTrips.map((t) => t.deliveryNote?.allocation_id).filter(Boolean);
      const ohnAllocationIds = ohnTrips.map((t) => t.offHireNote?.allocation_id).filter(Boolean);

      if (from_date && to_date) {
        const dnSet = new Set(dnAllocationIds);
        filteredAllocationIds = ohnAllocationIds.filter((id) => dnSet.has(id));
      } else if (from_date) {
        filteredAllocationIds = dnAllocationIds;
      } else {
        filteredAllocationIds = ohnAllocationIds;
      }

      if (filteredAllocationIds.length === 0) {
        return res.status(200).json({
          equipment:   { totalOrders: 0, currentPage: parseInt(page), totalPages: 1, orders: [] },
          manpower:    { totalOrders: 0, currentPage: parseInt(page), totalPages: 1, orders: [] },
          attachments: { totalOrders: 0, currentPage: parseInt(page), totalPages: 1, orders: [] },
        });
      }

      allocWhere.allocation_id = { [Op.in]: filteredAllocationIds };
    }

    const allAllocations = await ActiveAllocationModel.findAll({
      where: allocWhere,
      include: includes,
      order: [["allocation_date", "DESC"]],
    });

    const equipmentOrders = [];
    const manpowerOrders = [];
    const attachmentOrders = [];

    for (const alloc of allAllocations) {
      const raw = alloc.toJSON();
      if (!raw.salesOrder) continue;

      const hasResources =
        raw.equipmentAllocations.length > 0 ||
        raw.manpowerAllocations.length > 0 ||
        raw.attachmentAllocations.length > 0;
      if (!hasResources) continue;

      // Fetch trip dates for this allocation
      const tripDates = await fetchTripDatesForAllocation(raw.allocation_id);
      const tripDatesMap = { [raw.allocation_id]: tripDates };

      if (raw.equipmentAllocations.length > 0)
        equipmentOrders.push(formatForEquipmentSectionCompleted(alloc, tripDatesMap));
      if (raw.manpowerAllocations.length > 0)
        manpowerOrders.push(formatForManpowerSectionCompleted(alloc, tripDatesMap));
      if (raw.attachmentAllocations.length > 0)
        attachmentOrders.push(formatForAttachmentSectionCompleted(alloc, tripDatesMap));
    }

    const paginate = (orders) => {
      const total = orders.length;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      return {
        totalOrders: total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)) || 1,
        orders: orders.slice(offset, offset + parseInt(limit)),
      };
    };

    return res.status(200).json({
      equipment:   paginate(equipmentOrders),
      manpower:    paginate(manpowerOrders),
      attachments: paginate(attachmentOrders),
    });
  } catch (error) {
    console.error("Error filtering completed orders:", error);
    return res.status(500).json({
      message: "Error filtering completed orders",
      error: error.message,
    });
  }
};
// const getFilterCompletedOrders = async (req, res) => {
//   try {
//     const {
//       so_number = "",
//       service_option = "",
//       shift = "",
//       scheduled_date_from = "",
//       scheduled_date_to = "",
//       reg_number = "",
//       employee_no = "",
//       attachment_number = "",
//       from_date = "",
//       to_date = "",
//       page = 1,
//       limit = 10,
//     } = req.query;

//     const soWhere = {};
//     if (so_number) soWhere.so_number = { [Op.like]: `%${so_number}%` };
//     if (shift) soWhere.shift = shift;

//     const equipmentInclude = {
//       model: AllocationEquipmentModel,
//       as: "equipmentAllocations",
//       include: [
//         {
//           model: EquipmentModel,
//           as: "equipment",
//           attributes: [
//             "serial_number",
//             "reg_number",
//             "vehicle_type",
//             "equipment_status",
//             "equipment_status_note",
//           ],
//           ...(reg_number && {
//             where: { reg_number: { [Op.like]: `%${reg_number}%` } },
//           }),
//         },
//       ],
//     };

//     const manpowerInclude = {
//       model: AllocationManpowerModel,
//       as: "manpowerAllocations",
//       include: [
//         {
//           model: EmployeeModel,
//           as: "employee",
//           attributes: ["id", "personalDetails"],
//           include: [
//             {
//               model: ManpowerModel,
//               as: "manpower",
//               attributes: ["employeeNo", "manpower_status", "operator_type_id"],
//               ...(employee_no && {
//                 where: { employeeNo: { [Op.like]: `%${employee_no}%` } },
//               }),
//               include: [
//                 {
//                   model: OperatorTypeModel,
//                   as: "operator_type",
//                   attributes: ["operator_type_id", "operator_type"],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     };

//     const attachmentInclude = {
//       model: AllocationAttachmentModel,
//       as: "attachmentAllocations",
//       include: [
//         {
//           model: AttachmentModel,
//           as: "attachment",
//           attributes: [
//             "attachment_id",
//             "attachment_number",
//             "product_name",
//             "serial_number",
//             "attachment_status",
//           ],
//           ...(attachment_number && {
//             where: {
//               attachment_number: { [Op.like]: `%${attachment_number}%` },
//             },
//           }),
//         },
//       ],
//     };

//     const includes = [
//       {
//         model: SalesOrdersModel,
//         as: "salesOrder",
//         attributes: [
//           "id",
//           "so_number",
//           "client",
//           "project_name",
//           "delivery_address",
//           "shift",
//           "lpo_number",
//           "lpo_validity_date",
//           "extended_lpo_validity_date",
//           "expected_mobilization_date",
//           "expected_demobilization_date",
//           "ops_status",
//           "so_status",
//         ],
//         where: Object.keys(soWhere).length ? soWhere : undefined,
//         include: [
//           {
//             model: JobLocationModel,
//             as: "jobLocation",
//             attributes: ["job_location_id", "job_location_name"],
//           },
//         ],
//       },
//       equipmentInclude,
//       manpowerInclude,
//       attachmentInclude,
//     ];

//     const allocWhere = { status: "Completed" };
//     if (service_option) allocWhere.service_option = service_option;
//     if (from_date || to_date) {
//       allocWhere.allocation_date = {};
//       if (from_date) allocWhere.allocation_date[Op.gte] = from_date;
//       if (to_date) allocWhere.allocation_date[Op.lte] = to_date;
//     }

//     const allAllocations = await ActiveAllocationModel.findAll({
//       where: allocWhere,
//       include: includes,
//       order: [["allocation_date", "DESC"]],
//     });

//     const equipmentOrders = [];
//     const manpowerOrders = [];
//     const attachmentOrders = [];

//     for (const alloc of allAllocations) {
//       const raw = alloc.toJSON();
//       if (!raw.salesOrder) continue;

//       if (scheduled_date_from || scheduled_date_to) {
//         const sd = await fetchScheduledDateForSO(raw.salesOrder.id);
//         if (!sd) continue;
//         if (scheduled_date_from && sd < scheduled_date_from) continue;
//         if (scheduled_date_to && sd > scheduled_date_to) continue;
//       }

//       const hasResources =
//         raw.equipmentAllocations.length > 0 ||
//         raw.manpowerAllocations.length > 0 ||
//         raw.attachmentAllocations.length > 0;
//       if (!hasResources) continue;

//       if (raw.equipmentAllocations.length > 0)
//         equipmentOrders.push(formatForEquipmentSection(alloc));
//       if (raw.manpowerAllocations.length > 0)
//         manpowerOrders.push(formatForManpowerSection(alloc));
//       if (raw.attachmentAllocations.length > 0)
//         attachmentOrders.push(formatForAttachmentSection(alloc));
//     }

//     const paginate = (orders) => {
//       const total = orders.length;
//       const offset = (parseInt(page) - 1) * parseInt(limit);
//       return {
//         totalOrders: total,
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(total / parseInt(limit)) || 1,
//         orders: orders.slice(offset, offset + parseInt(limit)),
//       };
//     };

//     return res.status(200).json({
//       equipment: paginate(equipmentOrders),
//       manpower: paginate(manpowerOrders),
//       attachments: paginate(attachmentOrders),
//     });
//   } catch (error) {
//     console.error("Error filtering completed orders:", error);
//     return res.status(500).json({
//       message: "Error filtering completed orders",
//       error: error.message,
//     });
//   }
// };

// ─── Debug (TEMP) ─────────────────────────────────────────────────────────────

const debugOrders = async (req, res) => {
  try {
    const {
      currentShiftType,
      currentShiftDate,
      nextShiftType,
      nextShiftDate,
    } = getShiftContext();

    const allAllocations = await ActiveAllocationModel.findAll({
      include: buildIncludes(),
      order: [["allocation_date", "ASC"]],
    });

    const debugReport = [];

    for (const alloc of allAllocations) {
      const raw = alloc.toJSON();
      const report = {
        allocation_id: raw.allocation_id,
        allocation_date: raw.allocation_date,
        status: raw.status,
        sales_order_id: raw.sales_order_id,
        checks: {},
      };

      report.checks.statusOk = !["Completed", "Cancelled"].includes(raw.status);
      report.checks.salesOrderLoaded = !!raw.salesOrder;

      if (raw.salesOrder) {
        report.salesOrder = {
          id: raw.salesOrder.id,
          shift: raw.salesOrder.shift,
          lpo_validity_date: raw.salesOrder.lpo_validity_date,
          extended_lpo_validity_date: raw.salesOrder.extended_lpo_validity_date,
          ops_status: raw.salesOrder.ops_status,
          so_status: raw.salesOrder.so_status,
        };
      }

      const eqCount = raw.equipmentAllocations?.length || 0;
      const mpCount = raw.manpowerAllocations?.length || 0;
      const attCount = raw.attachmentAllocations?.length || 0;
      report.checks.hasResources = eqCount > 0 || mpCount > 0 || attCount > 0;
      report.resourceCounts = { equipment: eqCount, manpower: mpCount, attachments: attCount };

      if (raw.salesOrder) {
        const soShift = raw.salesOrder.shift || "";
        report.checks.matchesCurrentShift =
          soShift === currentShiftType || soShift === "Full" || soShift === "Day and Night";
        report.checks.matchesNextShift =
          soShift === nextShiftType || soShift === "Full" || soShift === "Day and Night";
        report.checks.soShiftValue = soShift;
        report.checks.currentShiftType = currentShiftType;
      }

      report.checks.allocationDateMatchesCurrentShift = raw.allocation_date === currentShiftDate;
      report.checks.allocationDateMatchesNextShift = raw.allocation_date === nextShiftDate;
      report.checks.currentShiftDate = currentShiftDate;
      report.checks.nextShiftDate = nextShiftDate;

      if (raw.salesOrder) {
        const scheduledDate = await fetchScheduledDateForSO(raw.salesOrder.id);
        const lpoEndDate = getLpoEndDate(raw.salesOrder);
        const effectiveStart = scheduledDate || raw.allocation_date || currentShiftDate;
        report.checks.scheduledDate = scheduledDate;
        report.checks.lpoEndDate = lpoEndDate;
        report.checks.effectiveStart = effectiveStart;
        report.checks.activeWindowForCurrentShift = isInActiveWindow(
          raw.salesOrder, scheduledDate, currentShiftDate, raw.allocation_date
        );
        report.checks.activeWindowForNextShift = isInActiveWindow(
          raw.salesOrder, scheduledDate, nextShiftDate, raw.allocation_date
        );
      }

      report.wouldAppearInCurrentShift =
        report.checks.statusOk &&
        report.checks.salesOrderLoaded &&
        report.checks.hasResources &&
        report.checks.matchesCurrentShift &&
        report.checks.allocationDateMatchesCurrentShift &&
        report.checks.activeWindowForCurrentShift;

      report.wouldAppearInNextShift =
        report.checks.statusOk &&
        report.checks.salesOrderLoaded &&
        report.checks.hasResources &&
        report.checks.matchesNextShift &&
        report.checks.allocationDateMatchesNextShift &&
        report.checks.activeWindowForNextShift;

      debugReport.push(report);
    }

    return res.status(200).json({
      serverTime: new Date().toISOString(),
      shiftContext: { currentShiftType, currentShiftDate, nextShiftType, nextShiftDate },
      totalAllocationsInDB: debugReport.length,
      allocations: debugReport,
    });
  } catch (error) {
    console.error("Debug error:", error);
    return res.status(500).json({
      message: "Debug error",
      error: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  getShiftInfo,
  getCurrentShiftOrders,
  getNextShiftOrders,
  getFutureOrders,
  getAllActiveOrders,
  getCompletedOrders,
  getOrderById,
  getOrdersBySalesOrder,
  getAllFilterActiveOrders,
  getFilterCompletedOrders,
  debugOrders, // TEMP: remove before production
};
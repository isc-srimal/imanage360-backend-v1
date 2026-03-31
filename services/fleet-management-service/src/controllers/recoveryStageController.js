const RecoveryStageModel = require("../models/RecoveryStageModel");
const SalesOrderModel = require("../models/SalesOrdersModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const SalesOrderRecoveryModel = require("../models/SalesOrderRecoveryModel");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createRecoveryStage = async (req, res) => {
  const { so_id, so_recovery_id, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    const recoveryStage = await RecoveryStageModel.create({
      so_id,
      so_recovery_id: so_recovery_id || null, 
      stage_name,
      closure_status,
      completion_date,
      remarks,
    });

    res.status(201).json({ 
      message: "Recovery stage created successfully", 
      recoveryStage 
    });
  } catch (error) {
    console.error("Error creating recovery stage:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateRecoveryStage = async (req, res) => {
  const { recovery_stage_id } = req.params;
  const { so_id, so_recovery_id, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    const recoveryStageToUpdate = await RecoveryStageModel.findByPk(recovery_stage_id);

    if (!recoveryStageToUpdate) {
      return res.status(404).json({ message: "Recovery stage not found" });
    }

    recoveryStageToUpdate.so_id = so_id !== undefined ? so_id : recoveryStageToUpdate.so_id;
    recoveryStageToUpdate.so_recovery_id = so_recovery_id !== undefined ? so_recovery_id : recoveryStageToUpdate.so_recovery_id;
    recoveryStageToUpdate.stage_name = stage_name || recoveryStageToUpdate.stage_name;
    recoveryStageToUpdate.closure_status = closure_status || recoveryStageToUpdate.closure_status;
    recoveryStageToUpdate.completion_date = completion_date || recoveryStageToUpdate.completion_date;
    recoveryStageToUpdate.remarks = remarks || recoveryStageToUpdate.remarks;

    await recoveryStageToUpdate.save();
    res.status(200).json({
      message: "Recovery stage updated successfully",
      recoveryStage: recoveryStageToUpdate,
    });
  } catch (error) {
    console.error("Error updating recovery stage:", error);
    res.status(500).json({ 
      message: "Error updating recovery stage", 
      error: error.message 
    });
  }
};

const deleteRecoveryStage = async (req, res) => {
  const { recovery_stage_id } = req.params;

  try {
    const recoveryStageToDelete = await RecoveryStageModel.findByPk(recovery_stage_id);

    if (!recoveryStageToDelete) {
      return res.status(404).json({ message: "Recovery stage not found" });
    }

    await recoveryStageToDelete.destroy();
    res.status(200).json({ message: "Recovery stage deleted successfully" });
  } catch (error) {
    console.error("Error deleting recovery stage:", error);
    res.status(500).json({ 
      message: "Error deleting recovery stage", 
      error: error.message 
    });
  }
};

const getRecoveryStageById = async (req, res) => {
  try {
    const { recovery_stage_id } = req.params;
    const recoveryStage = await RecoveryStageModel.findByPk(recovery_stage_id, {
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: SalesOrderRecoveryModel, as: 'so_recovery' }
      ]
    });

    if (!recoveryStage) {
      return res.status(404).json({ message: "Recovery stage not found" });
    }

    res.status(200).json(recoveryStage);
  } catch (error) {
    console.error("Error retrieving recovery stage:", error);
    res.status(500).json({ 
      message: "Error retrieving recovery stage", 
      error: error.message 
    });
  }
};

const getAllRecoveryStages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalRecoveryStages, rows: recoveryStages } = await RecoveryStageModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: SalesOrderRecoveryModel, as: 'so_recovery' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      totalRecoveryStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRecoveryStages / limit),
      recoveryStages,
    });
  } catch (error) {
    console.error("Error retrieving recovery stages:", error);
    res.status(500).json({ 
      message: "Error retrieving recovery stages", 
      error: error.message 
    });
  }
};

const filterRecoveryStages = async (req, res) => {
  try {
    const { closure_status = "All", so_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (closure_status !== "All") {
      where.closure_status = closure_status;
    }

    if (so_id) {
      where.so_id = so_id;
    }

    const { count: totalRecoveryStages, rows: recoveryStages } = await RecoveryStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: SalesOrderRecoveryModel, as: 'so_recovery' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      totalRecoveryStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRecoveryStages / limit),
      recoveryStages,
    });
  } catch (error) {
    console.error("Error filtering recovery stages:", error);
    res.status(500).json({ 
      message: "Error filtering recovery stages", 
      error: error.message 
    });
  }
};

const getRecoveryStagesBySalesOrder = async (req, res) => {
  try {
    const { so_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalRecoveryStages, rows: recoveryStages } = await RecoveryStageModel.findAndCountAll({
      where: { so_id },
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: SalesOrderRecoveryModel, as: 'so_recovery' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      totalRecoveryStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRecoveryStages / limit),
      recoveryStages,
    });
  } catch (error) {
    console.error("Error retrieving recovery stages for sales order:", error);
    res.status(500).json({ 
      message: "Error retrieving recovery stages for sales order", 
      error: error.message 
    });
  }
};

const exportFilteredRecoveryStagesToCSV = async (req, res) => {
  try {
    const { closure_status = "All", so_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (closure_status !== "All") {
      where.closure_status = closure_status;
    }

    if (so_id) {
      where.so_id = so_id;
    }

    const { rows: recoveryStages } = await RecoveryStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: SalesOrderRecoveryModel, as: 'so_recovery' }
      ],
      order: [['created_at', 'DESC']]
    });

    if (!recoveryStages || recoveryStages.length === 0) {
      return res.status(404).json({
        message: "No recovery stages found matching the filters",
      });
    }

    const recoveryStagesData = recoveryStages.map((stage) => {
      return {
        recoveryStageId: stage.recovery_stage_id,
        soId: stage.so_id,
        soRecoveryId: stage.so_recovery_id,
        stageName: stage.stage_name,
        closureStatus: stage.closure_status,
        completionDate: stage.completion_date,
        remarks: stage.remarks,
        createdAt: stage.created_at,
        updatedAt: stage.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(recoveryStagesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_recovery_stages.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting recovery stages to CSV:", error);
    res.status(500).json({
      message: "Error exporting recovery stages to CSV",
      error: error.message,
    });
  }
};

const exportFilteredRecoveryStagesToPDF = async (req, res) => {
  try {
    const { closure_status = "All", so_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (closure_status !== "All") {
      where.closure_status = closure_status;
    }

    if (so_id) {
      where.so_id = so_id;
    }

    const { rows: recoveryStages } = await RecoveryStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: SalesOrderRecoveryModel, as: 'so_recovery' }
      ],
      order: [['created_at', 'DESC']]
    });

    if (!recoveryStages || recoveryStages.length === 0) {
      return res.status(404).json({ 
        message: "No recovery stages found matching the filters" 
      });
    }

    const recoveryStagesData = recoveryStages.map((stage) => {
      return [
        stage.recovery_stage_id || "N/A",
        stage.so_id || "N/A",
        stage.so_recovery_id || "N/A",
        stage.stage_name || "N/A",
        stage.closure_status || "N/A",
        stage.completion_date || "N/A",
        stage.remarks ? stage.remarks.substring(0, 50) + (stage.remarks.length > 50 ? '...' : '') : "N/A",
        stage.created_at ? new Date(stage.created_at).toLocaleDateString() : "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Recovery Stages Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [50, 50, 60, 80, 70, 70, 100, 70],
            body: [
              ["ID", "SO ID", "Recovery ID", "Stage Name", "Status", "Completion", "Remarks", "Created"],
              ...recoveryStagesData,
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
    res.attachment("recovery_stages_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting recovery stages to PDF:", error);
    res.status(500).json({
      message: "Error exporting recovery stages to PDF",
      error: error.message,
    });
  }
};

// FIX: This function now properly filters by so_recovery_id
const getRecoveryStagesByRecoveryId = async (req, res) => {
  try {
    const { so_recovery_id } = req.params;
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    console.log(`Fetching stages for Recovery ID: ${so_recovery_id}`);

    const { count: totalRecoveryStages, rows: recoveryStages } = await RecoveryStageModel.findAndCountAll({
      where: { so_recovery_id }, 
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: SalesOrderRecoveryModel, as: 'so_recovery' }
      ],
    });

    console.log(`Found ${totalRecoveryStages} stages for Recovery ID: ${so_recovery_id}`);

    res.status(200).json({
      totalRecoveryStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRecoveryStages / limit),
      recoveryStages,
    });
  } catch (error) {
    console.error("Error retrieving recovery stages for recovery ID:", error);
    res.status(500).json({ 
      message: "Error retrieving recovery stages for recovery ID", 
      error: error.message 
    });
  }
};

module.exports = {
  createRecoveryStage,
  updateRecoveryStage,
  deleteRecoveryStage,
  getRecoveryStageById,
  getAllRecoveryStages,
  filterRecoveryStages,
  getRecoveryStagesBySalesOrder,
  exportFilteredRecoveryStagesToCSV,
  exportFilteredRecoveryStagesToPDF,
  getRecoveryStagesByRecoveryId,
};
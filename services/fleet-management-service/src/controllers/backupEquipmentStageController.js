const BackupEquipmentStageModel = require("../models/BackupEquipmentStageModel");
const SalesOrderModel = require("../models/SalesOrdersModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const EquipmentModel = require("../models/EquipmentModel");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createBackupEquipmentStage = async (req, res) => {
  const { so_id, serial_number, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    const backupEquipmentStage = await BackupEquipmentStageModel.create({
      so_id,
      serial_number: serial_number || null, 
      stage_name,
      closure_status,
      completion_date,
      remarks,
    });

    res.status(201).json({ 
      message: "Backup equipment stage created successfully", 
      backupEquipmentStage 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBackupEquipmentStage = async (req, res) => {
  const { backup_equipment_stage_id } = req.params;
  const { so_id, serial_number, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    const backupEquipmentStageToUpdate = await BackupEquipmentStageModel.findByPk(backup_equipment_stage_id);

    if (!backupEquipmentStageToUpdate) {
      return res.status(404).json({ message: "Backup equipment stage not found" });
    }

    backupEquipmentStageToUpdate.so_id = so_id !== undefined ? so_id : backupEquipmentStageToUpdate.so_id;
    backupEquipmentStageToUpdate.serial_number = serial_number !== undefined ? serial_number : backupEquipmentStageToUpdate.serial_number;
    backupEquipmentStageToUpdate.stage_name = stage_name || backupEquipmentStageToUpdate.stage_name;
    backupEquipmentStageToUpdate.closure_status = closure_status || backupEquipmentStageToUpdate.closure_status;
    backupEquipmentStageToUpdate.completion_date = completion_date || backupEquipmentStageToUpdate.completion_date;
    backupEquipmentStageToUpdate.remarks = remarks || backupEquipmentStageToUpdate.remarks;

    await backupEquipmentStageToUpdate.save();
    res.status(200).json({
      message: "Backup equipment stage updated successfully",
      backupEquipmentStage: backupEquipmentStageToUpdate,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating backup equipment stage", 
      error: error.message 
    });
  }
};

const deleteBackupEquipmentStage = async (req, res) => {
  const { backup_equipment_stage_id } = req.params;

  try {
    const backupEquipmentStageToDelete = await BackupEquipmentStageModel.findByPk(backup_equipment_stage_id);

    if (!backupEquipmentStageToDelete) {
      return res.status(404).json({ message: "Backup equipment stage not found" });
    }

    await backupEquipmentStageToDelete.destroy();
    res.status(200).json({ message: "Backup equipment stage deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting backup equipment stage", 
      error: error.message 
    });
  }
};

const getBackupEquipmentStageById = async (req, res) => {
  try {
    const { backup_equipment_stage_id } = req.params;
    const backupEquipmentStage = await BackupEquipmentStageModel.findByPk(backup_equipment_stage_id, {
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ]
    });

    if (!backupEquipmentStage) {
      return res.status(404).json({ message: "Backup equipment stage not found" });
    }

    res.status(200).json(backupEquipmentStage);
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving backup equipment stage", 
      error: error.message 
    });
  }
};

const getAllBackupEquipmentStages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalBackupEquipmentStages, rows: backupEquipmentStages } = await BackupEquipmentStageModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
    });

    res.status(200).json({
      totalBackupEquipmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBackupEquipmentStages / limit),
      backupEquipmentStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving backup equipment stages", 
      error: error.message 
    });
  }
};

const filterBackupEquipmentStages = async (req, res) => {
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

    const { count: totalBackupEquipmentStages, rows: backupEquipmentStages } = await BackupEquipmentStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
    });

    res.status(200).json({
      totalBackupEquipmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBackupEquipmentStages / limit),
      backupEquipmentStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error filtering backup equipment stages", 
      error: error.message 
    });
  }
};

const getBackupEquipmentStagesBySalesOrder = async (req, res) => {
  try {
    const { so_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalBackupEquipmentStages, rows: backupEquipmentStages } = await BackupEquipmentStageModel.findAndCountAll({
      where: { so_id },
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
    });

    res.status(200).json({
      totalBackupEquipmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBackupEquipmentStages / limit),
      backupEquipmentStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving backup equipment stages for sales order", 
      error: error.message 
    });
  }
};

const exportFilteredBackupEquipmentStagesToCSV = async (req, res) => {
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

    const { rows: backupEquipmentStages } = await BackupEquipmentStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
    });

    if (!backupEquipmentStages || backupEquipmentStages.length === 0) {
      return res.status(404).json({
        message: "No backup equipment stages found matching the filters",
      });
    }

    const backupEquipmentStagesData = backupEquipmentStages.map((stage) => {
      return {
        backupEquipmentStageId: stage.backup_equipment_stage_id,
        soId: stage.so_id,
        serial_number: stage.serial_number,
        stageName: stage.stage_name,
        closureStatus: stage.closure_status,
        completionDate: stage.completion_date,
        remarks: stage.remarks,
        createdAt: stage.created_at,
        updatedAt: stage.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(backupEquipmentStagesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_backup_equipment_stages.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting backup equipment stages to CSV:", error);
    res.status(500).json({
      message: "Error exporting backup equipment stages to CSV",
      error: error.message,
    });
  }
};

const exportFilteredBackupEquipmentStagesToPDF = async (req, res) => {
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

    const { rows: backupEquipmentStages } = await BackupEquipmentStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
    });

    if (!backupEquipmentStages || backupEquipmentStages.length === 0) {
      return res.status(404).json({ 
        message: "No backup equipment stages found matching the filters" 
      });
    }

    const backupEquipmentStagesData = backupEquipmentStages.map((stage) => {
      return [
        stage.backup_equipment_stage_id || "N/A",
        stage.so_id || "N/A",
        stage.serial_number || "N/A",
        stage.stage_name || "N/A",
        stage.closure_status || "N/A",
        stage.completion_date || "N/A",
        stage.remarks ? stage.remarks.substring(0, 50) + (stage.remarks.length > 50 ? '...' : '') : "N/A",
        stage.created_at ? new Date(stage.created_at).toLocaleDateString() : "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Backup Equipment Stages Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [60, 60, 60, 80, 80, 80, 120, 80],
            body: [
              ["ID", "SO ID", "Serial Number", "Stage Name", "Closure Status", "Completion Date", "Remarks", "Created At"],
              ...backupEquipmentStagesData,
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
    res.attachment("backup_equipment_stages_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting backup equipment stages to PDF:", error);
    res.status(500).json({
      message: "Error exporting backup equipment stages to PDF",
      error: error.message,
    });
  }
};

const getBackupEquipmentStagesByEquipmentId = async (req, res) => {
  try {
    const { serial_number } = req.params;
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    console.log(`Fetching backup stages for Equipment ID: ${serial_number}`);

    const { count: totalBackupEquipmentStages, rows: BackupEquipmentStages } = await BackupEquipmentStageModel.findAndCountAll({
      where: { serial_number },
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
    });

    console.log(`Found ${totalBackupEquipmentStages} stages for Equipment ID: ${serial_number}`);

    res.status(200).json({
      totalBackupEquipmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBackupEquipmentStages / limit),
      BackupEquipmentStages,
    });
  } catch (error) {
    console.error("Error retrieving backup equipment stages for equipment ID:", error);
    res.status(500).json({ 
      message: "Error retrieving backup equipment stages for equipment ID", 
      error: error.message 
    });
  }
};

module.exports = {
  createBackupEquipmentStage,
  updateBackupEquipmentStage,
  deleteBackupEquipmentStage,
  getBackupEquipmentStageById,
  getAllBackupEquipmentStages,
  filterBackupEquipmentStages,
  getBackupEquipmentStagesBySalesOrder,
  exportFilteredBackupEquipmentStagesToCSV,
  exportFilteredBackupEquipmentStagesToPDF,
  getBackupEquipmentStagesByEquipmentId,
};
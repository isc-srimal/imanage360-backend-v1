const BackupManpowerStageModel = require("../models/BackupManpowerStageModel");
const SalesOrderModel = require("../models/SalesOrdersModel");
const ManpowerModel = require("../models/ManpowerModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createBackupManpowerStage = async (req, res) => {
  const { so_id, manpower_id, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    const backupManpowerStage = await BackupManpowerStageModel.create({
      so_id,
      manpower_id: manpower_id || null, 
      stage_name,
      closure_status,
      completion_date,
      remarks,
    });

    res.status(201).json({ 
      message: "Backup manpower stage created successfully", 
      backupManpowerStage 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBackupManpowerStage = async (req, res) => {
  const { backup_manpower_stage_id } = req.params;
  const { so_id, manpower_id, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    const backupManpowerStageToUpdate = await BackupManpowerStageModel.findByPk(backup_manpower_stage_id);

    if (!backupManpowerStageToUpdate) {
      return res.status(404).json({ message: "Backup manpower stage not found" });
    }

    backupManpowerStageToUpdate.so_id = so_id !== undefined ? so_id : backupManpowerStageToUpdate.so_id;
    backupManpowerStageToUpdate.manpower_id = manpower_id !== undefined ? manpower_id : backupManpowerStageToUpdate.manpower_id;
    backupManpowerStageToUpdate.stage_name = stage_name || backupManpowerStageToUpdate.stage_name;
    backupManpowerStageToUpdate.closure_status = closure_status || backupManpowerStageToUpdate.closure_status;
    backupManpowerStageToUpdate.completion_date = completion_date || backupManpowerStageToUpdate.completion_date;
    backupManpowerStageToUpdate.remarks = remarks || backupManpowerStageToUpdate.remarks;

    await backupManpowerStageToUpdate.save();
    res.status(200).json({
      message: "Backup manpower stage updated successfully",
      backupManpowerStage: backupManpowerStageToUpdate,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating backup manpower stage", 
      error: error.message 
    });
  }
};

const deleteBackupManpowerStage = async (req, res) => {
  const { backup_manpower_stage_id } = req.params;

  try {
    const backupManpowerStageToDelete = await BackupManpowerStageModel.findByPk(backup_manpower_stage_id);

    if (!backupManpowerStageToDelete) {
      return res.status(404).json({ message: "Backup manpower stage not found" });
    }

    await backupManpowerStageToDelete.destroy();
    res.status(200).json({ message: "Backup manpower stage deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting backup manpower stage", 
      error: error.message 
    });
  }
};

const getBackupManpowerStageById = async (req, res) => {
  try {
    const { backup_manpower_stage_id } = req.params;
    const backupManpowerStage = await BackupManpowerStageModel.findByPk(backup_manpower_stage_id, {
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ]
    });

    if (!backupManpowerStage) {
      return res.status(404).json({ message: "Backup manpower stage not found" });
    }

    res.status(200).json(backupManpowerStage);
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving backup manpower stage", 
      error: error.message 
    });
  }
};

const getAllBackupManpowerStages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalBackupManpowerStages, rows: backupManpowerStages } = await BackupManpowerStageModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
    });

    res.status(200).json({
      totalBackupManpowerStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBackupManpowerStages / limit),
      backupManpowerStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving backup manpower stages", 
      error: error.message 
    });
  }
};

const filterBackupManpowerStages = async (req, res) => {
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

    const { count: totalBackupManpowerStages, rows: backupManpowerStages } = await BackupManpowerStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
    });

    res.status(200).json({
      totalBackupManpowerStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBackupManpowerStages / limit),
      backupManpowerStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error filtering backup manpower stages", 
      error: error.message 
    });
  }
};

const getBackupManpowerStagesBySalesOrder = async (req, res) => {
  try {
    const { so_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalBackupManpowerStages, rows: backupManpowerStages } = await BackupManpowerStageModel.findAndCountAll({
      where: { so_id },
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
    });

    res.status(200).json({
      totalBackupManpowerStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBackupManpowerStages / limit),
      backupManpowerStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving backup manpower stages for sales order", 
      error: error.message 
    });
  }
};

const exportFilteredBackupManpowerStagesToCSV = async (req, res) => {
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

    const { rows: backupManpowerStages } = await BackupManpowerStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
    });

    if (!backupManpowerStages || backupManpowerStages.length === 0) {
      return res.status(404).json({
        message: "No backup manpower stages found matching the filters",
      });
    }

    const backupManpowerStagesData = backupManpowerStages.map((stage) => {
      return {
        backupManpowerStageId: stage.backup_manpower_stage_id,
        soId: stage.so_id,
        manpower_id: stage.manpower_id,
        stageName: stage.stage_name,
        closureStatus: stage.closure_status,
        completionDate: stage.completion_date,
        remarks: stage.remarks,
        createdAt: stage.created_at,
        updatedAt: stage.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(backupManpowerStagesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_backup_manpower_stages.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting backup manpower stages to CSV:", error);
    res.status(500).json({
      message: "Error exporting backup manpower stages to CSV",
      error: error.message,
    });
  }
};

const exportFilteredBackupManpowerStagesToPDF = async (req, res) => {
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

    const { rows: backupManpowerStages } = await BackupManpowerStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
    });

    if (!backupManpowerStages || backupManpowerStages.length === 0) {
      return res.status(404).json({ 
        message: "No backup manpower stages found matching the filters" 
      });
    }

    const backupManpowerStagesData = backupManpowerStages.map((stage) => {
      return [
        stage.backup_manpower_stage_id || "N/A",
        stage.so_id || "N/A",
        stage.manpower_id || "N/A",
        stage.stage_name || "N/A",
        stage.closure_status || "N/A",
        stage.completion_date || "N/A",
        stage.remarks ? stage.remarks.substring(0, 50) + (stage.remarks.length > 50 ? '...' : '') : "N/A",
        stage.created_at ? new Date(stage.created_at).toLocaleDateString() : "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Backup Manpower Stages Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [60, 60, 60, 80, 80, 80, 120, 80],
            body: [
              ["ID", "SO ID", "Manpower ID", "Stage Name", "Closure Status", "Completion Date", "Remarks", "Created At"],
              ...backupManpowerStagesData,
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
    res.attachment("backup_manpower_stages_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting backup manpower stages to PDF:", error);
    res.status(500).json({
      message: "Error exporting backup manpower stages to PDF",
      error: error.message,
    });
  }
};

const getBackupManopowerStagesByManpowerId = async (req, res) => {
  try {
    const { manpower_id } = req.params;
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    console.log(`Fetching backup stages for Manpower ID: ${manpower_id}`);

    const { count: totalBackupManpowerStages, rows: backupManpowerStages } = await BackupManpowerStageModel.findAndCountAll({
      where: { manpower_id }, // Filter by manpower_id
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
    });

    console.log(`Found ${totalBackupManpowerStages} stages for Manpower ID: ${manpower_id}`);

    res.status(200).json({
      totalBackupManpowerStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBackupManpowerStages / limit),
      backupManpowerStages,
    });
  } catch (error) {
    console.error("Error retrieving backup manpower stages for manpower ID:", error);
    res.status(500).json({ 
      message: "Error retrieving backup manpower stages for manpower ID", 
      error: error.message 
    });
  }
};

module.exports = {
  createBackupManpowerStage,
  updateBackupManpowerStage,
  deleteBackupManpowerStage,
  getBackupManpowerStageById,
  getAllBackupManpowerStages,
  filterBackupManpowerStages,
  getBackupManpowerStagesBySalesOrder,
  exportFilteredBackupManpowerStagesToCSV,
  exportFilteredBackupManpowerStagesToPDF,
  getBackupManopowerStagesByManpowerId,
};
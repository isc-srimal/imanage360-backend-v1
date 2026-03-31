const EquipmentStageModel = require("../models/EquipmentStageModel");
const SalesOrderModel = require("../models/SalesOrdersModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const EquipmentModel = require("../models/EquipmentModel");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createEquipmentStage = async (req, res) => {
  const { so_id, serial_number, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    const equipmentStage = await EquipmentStageModel.create({
      so_id,
      serial_number: serial_number || null, 
      stage_name,
      closure_status,
      completion_date,
      remarks,
    });

    res.status(201).json({ 
      message: "Equipment stage created successfully", 
      equipmentStage 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEquipmentStage = async (req, res) => {
  const { equipment_stage_id } = req.params;
  const { so_id, serial_number, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    const equipmentStageToUpdate = await EquipmentStageModel.findByPk(equipment_stage_id);

    if (!equipmentStageToUpdate) {
      return res.status(404).json({ message: "Equipment stage not found" });
    }

    equipmentStageToUpdate.so_id = so_id !== undefined ? so_id : equipmentStageToUpdate.so_id;
    equipmentStageToUpdate.serial_number = serial_number !== undefined ? serial_number : equipmentStageToUpdate.serial_number;
    equipmentStageToUpdate.stage_name = stage_name || equipmentStageToUpdate.stage_name;
    equipmentStageToUpdate.closure_status = closure_status || equipmentStageToUpdate.closure_status;
    equipmentStageToUpdate.completion_date = completion_date || equipmentStageToUpdate.completion_date;
    equipmentStageToUpdate.remarks = remarks || equipmentStageToUpdate.remarks;

    await equipmentStageToUpdate.save();
    res.status(200).json({
      message: "Equipment stage updated successfully",
      equipmentStage: equipmentStageToUpdate,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating equipment stage", 
      error: error.message 
    });
  }
};

const deleteEquipmentStage = async (req, res) => {
  const { equipment_stage_id } = req.params;

  try {
    const equipmentStageToDelete = await EquipmentStageModel.findByPk(equipment_stage_id);

    if (!equipmentStageToDelete) {
      return res.status(404).json({ message: "Equipment stage not found" });
    }

    await equipmentStageToDelete.destroy();
    res.status(200).json({ message: "Equipment stage deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting equipment stage", 
      error: error.message 
    });
  }
};

const getEquipmentStageById = async (req, res) => {
  try {
    const { equipment_stage_id } = req.params;
    const equipmentStage = await EquipmentStageModel.findByPk(equipment_stage_id, {
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ]
    });

    if (!equipmentStage) {
      return res.status(404).json({ message: "Equipment stage not found" });
    }

    res.status(200).json(equipmentStage);
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving equipment stage", 
      error: error.message 
    });
  }
};

const getAllEquipmentStages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalEquipmentStages, rows: equipmentStages } = await EquipmentStageModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      totalEquipmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalEquipmentStages / limit),
      equipmentStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving equipment stages", 
      error: error.message 
    });
  }
};

const filterEquipmentStages = async (req, res) => {
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

    const { count: totalEquipmentStages, rows: equipmentStages } = await EquipmentStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      totalEquipmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalEquipmentStages / limit),
      equipmentStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error filtering equipment stages", 
      error: error.message 
    });
  }
};

const getEquipmentStagesBySalesOrder = async (req, res) => {
  try {
    const { so_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalEquipmentStages, rows: equipmentStages } = await EquipmentStageModel.findAndCountAll({
      where: { so_id },
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      totalEquipmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalEquipmentStages / limit),
      equipmentStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving equipment stages for sales order", 
      error: error.message 
    });
  }
};

const exportFilteredEquipmentStagesToCSV = async (req, res) => {
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

    const { rows: equipmentStages } = await EquipmentStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
      order: [['created_at', 'DESC']]
    });

    if (!equipmentStages || equipmentStages.length === 0) {
      return res.status(404).json({
        message: "No equipment stages found matching the filters",
      });
    }

    const equipmentStagesData = equipmentStages.map((stage) => {
      return {
        equipmentStageId: stage.equipment_stage_id,
        serial_number: stage.serial_number,
        soId: stage.so_id,
        stageName: stage.stage_name,
        closureStatus: stage.closure_status,
        completionDate: stage.completion_date,
        remarks: stage.remarks,
        createdAt: stage.created_at,
        updatedAt: stage.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(equipmentStagesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_equipment_stages.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting equipment stages to CSV:", error);
    res.status(500).json({
      message: "Error exporting equipment stages to CSV",
      error: error.message,
    });
  }
};

const exportFilteredEquipmentStagesToPDF = async (req, res) => {
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

    const { rows: equipmentStages } = await EquipmentStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
      order: [['created_at', 'DESC']]
    });

    if (!equipmentStages || equipmentStages.length === 0) {
      return res.status(404).json({ 
        message: "No equipment stages found matching the filters" 
      });
    }

    const equipmentStagesData = equipmentStages.map((stage) => {
      return [
        stage.equipment_stage_id || "N/A",
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
        { text: "Equipment Stages Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [60, 60, 60, 80, 80, 80, 120, 80],
            body: [
              ["ID", "SO ID", "Serial Number", "Stage Name", "Closure Status", "Completion Date", "Remarks", "Created At"],
              ...equipmentStagesData,
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
    res.attachment("equipment_stages_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting equipment stages to PDF:", error);
    res.status(500).json({
      message: "Error exporting equipment stages to PDF",
      error: error.message,
    });
  }
};

const getEquipmentStagesByEquipmentId = async (req, res) => {
  try {
    const { serial_number } = req.params;
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    console.log(`Fetching stages for Equipment ID: ${serial_number}`);

    const { count: totalEquipmentStages, rows: EquipmentStages } = await EquipmentStageModel.findAndCountAll({
      where: { serial_number },
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: EquipmentModel, as: 'equipment' }
      ],
    });

    console.log(`Found ${totalEquipmentStages} stages for Equipment ID: ${serial_number}`);

    res.status(200).json({
      totalEquipmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalEquipmentStages / limit),
      EquipmentStages,
    });
  } catch (error) {
    console.error("Error retrieving equipment stages for equipment ID:", error);
    res.status(500).json({ 
      message: "Error retrieving equipment stages for equipment ID", 
      error: error.message 
    });
  }
};

module.exports = {
  createEquipmentStage,
  updateEquipmentStage,
  deleteEquipmentStage,
  getEquipmentStageById,
  getAllEquipmentStages,
  filterEquipmentStages,
  getEquipmentStagesBySalesOrder,
  exportFilteredEquipmentStagesToCSV,
  exportFilteredEquipmentStagesToPDF,
  getEquipmentStagesByEquipmentId,
};
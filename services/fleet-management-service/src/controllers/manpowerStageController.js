const ManpowerStageModel = require("../models/ManpowerStageModel");
const SalesOrderModel = require("../models/SalesOrdersModel");
const ManpowerModel = require("../models/ManpowerModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createManpowerStage = async (req, res) => {
  const { so_id, manpower_id, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    const manpowerStage = await ManpowerStageModel.create({
      so_id,
      manpower_id: manpower_id || null, 
      stage_name,
      closure_status,
      completion_date,
      remarks,
    });

    res.status(201).json({ 
      message: "Manpower stage created successfully", 
      manpowerStage 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateManpowerStage = async (req, res) => {
  const { manpower_stage_id } = req.params;
  const { so_id, manpower_id, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    const manpowerStageToUpdate = await ManpowerStageModel.findByPk(manpower_stage_id);

    if (!manpowerStageToUpdate) {
      return res.status(404).json({ message: "Manpower stage not found" });
    }

    manpowerStageToUpdate.so_id = so_id !== undefined ? so_id : manpowerStageToUpdate.so_id;
    manpowerStageToUpdate.manpower_id = manpower_id !== undefined ? manpower_id : manpowerStageToUpdate.manpower_id;
    manpowerStageToUpdate.stage_name = stage_name || manpowerStageToUpdate.stage_name;
    manpowerStageToUpdate.closure_status = closure_status || manpowerStageToUpdate.closure_status;
    manpowerStageToUpdate.completion_date = completion_date || manpowerStageToUpdate.completion_date;
    manpowerStageToUpdate.remarks = remarks || manpowerStageToUpdate.remarks;

    await manpowerStageToUpdate.save();
    res.status(200).json({
      message: "Manpower stage updated successfully",
      manpowerStage: manpowerStageToUpdate,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating manpower stage", 
      error: error.message 
    });
  }
};

const deleteManpowerStage = async (req, res) => {
  const { manpower_stage_id } = req.params;

  try {
    const manpowerStageToDelete = await ManpowerStageModel.findByPk(manpower_stage_id);

    if (!manpowerStageToDelete) {
      return res.status(404).json({ message: "Manpower stage not found" });
    }

    await manpowerStageToDelete.destroy();
    res.status(200).json({ message: "Manpower stage deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting manpower stage", 
      error: error.message 
    });
  }
};

const getManpowerStageById = async (req, res) => {
  try {
    const { manpower_stage_id } = req.params;
    const manpowerStage = await ManpowerStageModel.findByPk(manpower_stage_id, {
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ]
    });

    if (!manpowerStage) {
      return res.status(404).json({ message: "Manpower stage not found" });
    }

    res.status(200).json(manpowerStage);
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving manpower stage", 
      error: error.message 
    });
  }
};

const getAllManpowerStages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalManpowerStages, rows: manpowerStages } = await ManpowerStageModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      totalManpowerStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalManpowerStages / limit),
      manpowerStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving manpower stages", 
      error: error.message 
    });
  }
};

const filterManpowerStages = async (req, res) => {
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

    const { count: totalManpowerStages, rows: manpowerStages } = await ManpowerStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      totalManpowerStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalManpowerStages / limit),
      manpowerStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error filtering manpower stages", 
      error: error.message 
    });
  }
};

const getManpowerStagesBySalesOrder = async (req, res) => {
  try {
    const { so_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalManpowerStages, rows: manpowerStages } = await ManpowerStageModel.findAndCountAll({
      where: { so_id },
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      totalManpowerStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalManpowerStages / limit),
      manpowerStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving manpower stages for sales order", 
      error: error.message 
    });
  }
};

const exportFilteredManpowerStagesToCSV = async (req, res) => {
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

    const { rows: manpowerStages } = await ManpowerStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
      order: [['created_at', 'DESC']]
    });

    if (!manpowerStages || manpowerStages.length === 0) {
      return res.status(404).json({
        message: "No manpower stages found matching the filters",
      });
    }

    const manpowerStagesData = manpowerStages.map((stage) => {
      return {
        manpowerStageId: stage.manpower_stage_id,
        manpower_id: stage.manpower_id,
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
    const csv = json2csvParser.parse(manpowerStagesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_manpower_stages.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting manpower stages to CSV:", error);
    res.status(500).json({
      message: "Error exporting manpower stages to CSV",
      error: error.message,
    });
  }
};

const exportFilteredManpowerStagesToPDF = async (req, res) => {
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

    const { rows: manpowerStages } = await ManpowerStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
      order: [['created_at', 'DESC']]
    });

    if (!manpowerStages || manpowerStages.length === 0) {
      return res.status(404).json({ 
        message: "No manpower stages found matching the filters" 
      });
    }

    const manpowerStagesData = manpowerStages.map((stage) => {
      return [
        stage.manpower_stage_id || "N/A",
        stage.manpower_id || "N/A",
        stage.so_id || "N/A",
        stage.stage_name || "N/A",
        stage.closure_status || "N/A",
        stage.completion_date || "N/A",
        stage.remarks ? stage.remarks.substring(0, 50) + (stage.remarks.length > 50 ? '...' : '') : "N/A",
        stage.created_at ? new Date(stage.created_at).toLocaleDateString() : "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Manpower Stages Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [60, 60, 60, 80, 80, 80, 120, 80],
            body: [
              ["ID", "SO ID", "Manpower ID", "Stage Name", "Closure Status", "Completion Date", "Remarks", "Created At"],
              ...manpowerStagesData,
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
    res.attachment("manpower_stages_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting manpower stages to PDF:", error);
    res.status(500).json({
      message: "Error exporting manpower stages to PDF",
      error: error.message,
    });
  }
};

const getManopowerStagesByManpowerId = async (req, res) => {
  try {
    const { manpower_id } = req.params;
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    console.log(`Fetching stages for Manpower ID: ${manpower_id}`);

    const { count: totalManpowerStages, rows: manpowerStages } = await ManpowerStageModel.findAndCountAll({
      where: { manpower_id }, 
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ManpowerModel, as: 'manpower' }
      ],
    });

    console.log(`Found ${totalManpowerStages} stages for Manpower ID: ${manpower_id}`);

    res.status(200).json({
      totalManpowerStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalManpowerStages / limit),
      manpowerStages,
    });
  } catch (error) {
    console.error("Error retrieving manpower stages for manpower ID:", error);
    res.status(500).json({ 
      message: "Error retrieving manpower stages for manpower ID", 
      error: error.message 
    });
  }
};

module.exports = {
  createManpowerStage,
  updateManpowerStage,
  deleteManpowerStage,
  getManpowerStageById,
  getAllManpowerStages,
  filterManpowerStages,
  getManpowerStagesBySalesOrder,
  exportFilteredManpowerStagesToCSV,
  exportFilteredManpowerStagesToPDF,
  getManopowerStagesByManpowerId,
};
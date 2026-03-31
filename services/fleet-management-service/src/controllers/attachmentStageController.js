const AttachmentStageModel = require("../models/AttachmentStageModel");
const SalesOrderModel = require("../models/SalesOrdersModel");
const AttachmentModel = require("../models/AttachmentModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createAttachmentStage = async (req, res) => {
  const {
    so_id,
    attachment_id,
    stage_name,
    closure_status,
    completion_date,
    remarks,
  } = req.body;

  try {
    // Validate so_id exists
    if (so_id) {
      const salesOrder = await SalesOrderModel.findByPk(so_id);
      if (!salesOrder) {
        return res.status(404).json({
          error: `Sales Order with ID ${so_id} does not exist`,
        });
      }
    }

    // Validate attachment_id exists if provided
    if (attachment_id) {
      const attachment = await AttachmentModel.findByPk(attachment_id);
      if (!attachment) {
        return res.status(404).json({
          error: `Attachment with ID ${attachment_id} does not exist`,
        });
      }
    }

    const attachmentStage = await AttachmentStageModel.create({
      so_id,
      attachment_id: attachment_id || null,
      stage_name,
      closure_status,
      completion_date,
      remarks,
    });

    res.status(201).json({
      message: "Attachment stage created successfully",
      attachmentStage,
    });
  } catch (error) {
    console.error("Error creating attachment stage:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateAttachmentStage = async (req, res) => {
  const { attachment_stage_id } = req.params;
  const {
    so_id,
    attachment_id,
    stage_name,
    closure_status,
    completion_date,
    remarks,
  } = req.body;

  try {
    const attachmentStageToUpdate = await AttachmentStageModel.findByPk(
      attachment_stage_id
    );

    if (!attachmentStageToUpdate) {
      return res.status(404).json({ message: "Attachment stage not found" });
    }

    attachmentStageToUpdate.so_id =
      so_id !== undefined ? so_id : attachmentStageToUpdate.so_id;
    attachmentStageToUpdate.attachment_id =
      attachment_id !== undefined
        ? attachment_id
        : attachmentStageToUpdate.attachment_id;
    attachmentStageToUpdate.stage_name =
      stage_name || attachmentStageToUpdate.stage_name;
    attachmentStageToUpdate.closure_status =
      closure_status || attachmentStageToUpdate.closure_status;
    attachmentStageToUpdate.completion_date =
      completion_date || attachmentStageToUpdate.completion_date;
    attachmentStageToUpdate.remarks =
      remarks || attachmentStageToUpdate.remarks;

    await attachmentStageToUpdate.save();
    res.status(200).json({
      message: "Attachment stage updated successfully",
      attachmentStage: attachmentStageToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating attachment stage",
      error: error.message,
    });
  }
};

const deleteAttachmentStage = async (req, res) => {
  const { attachment_stage_id } = req.params;

  try {
    const attachmentStageToDelete = await AttachmentStageModel.findByPk(
      attachment_stage_id
    );

    if (!attachmentStageToDelete) {
      return res.status(404).json({ message: "Attachment stage not found" });
    }

    await attachmentStageToDelete.destroy();
    res.status(200).json({ message: "Attachment stage deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting attachment stage",
      error: error.message,
    });
  }
};

const getAttachmentStageById = async (req, res) => {
  try {
    const { attachment_stage_id } = req.params;
    const attachmentStage = await AttachmentStageModel.findByPk(
      attachment_stage_id,
      {
        include: [
          { model: SalesOrderModel, as: "sales_order" },
          { model: AttachmentModel, as: "attachment" },
        ],
      }
    );

    if (!attachmentStage) {
      return res.status(404).json({ message: "Attachment stage not found" });
    }

    res.status(200).json(attachmentStage);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving attachment stage",
      error: error.message,
    });
  }
};

const getAllAttachmentStages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalAttachmentStages, rows: attachmentStages } =
      await AttachmentStageModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          { model: SalesOrderModel, as: "sales_order" },
          { model: AttachmentModel, as: "attachment" },
        ],
      });

    res.status(200).json({
      totalAttachmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAttachmentStages / limit),
      attachmentStages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving attachment stages",
      error: error.message,
    });
  }
};

const filterAttachmentStages = async (req, res) => {
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

    const { count: totalAttachmentStages, rows: attachmentStages } =
      await AttachmentStageModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          { model: SalesOrderModel, as: "sales_order" },
          { model: AttachmentModel, as: "attachment" },
        ],
      });

    res.status(200).json({
      totalAttachmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAttachmentStages / limit),
      attachmentStages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering attachment stages",
      error: error.message,
    });
  }
};

const getAttachmentStagesBySalesOrder = async (req, res) => {
  try {
    const { so_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalAttachmentStages, rows: attachmentStages } =
      await AttachmentStageModel.findAndCountAll({
        where: { so_id },
        offset,
        limit: parseInt(limit),
        include: [
          { model: SalesOrderModel, as: "sales_order" },
          { model: AttachmentModel, as: "attachment" },
        ],
      });

    res.status(200).json({
      totalAttachmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAttachmentStages / limit),
      attachmentStages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving attachment stages for sales order",
      error: error.message,
    });
  }
};

const exportFilteredAttachmentStagesToCSV = async (req, res) => {
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

    const { rows: attachmentStages } =
      await AttachmentStageModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          { model: SalesOrderModel, as: "sales_order" },
          { model: AttachmentModel, as: "attachment" },
        ],
      });

    if (!attachmentStages || attachmentStages.length === 0) {
      return res.status(404).json({
        message: "No attachment stages found matching the filters",
      });
    }

    const attachmentStagesData = attachmentStages.map((stage) => {
      return {
        attachmentStageId: stage.attachment_stage_id,
        soId: stage.so_id,
        attachment_id: stage.attachment_id,
        stageName: stage.stage_name,
        closureStatus: stage.closure_status,
        completionDate: stage.completion_date,
        remarks: stage.remarks,
        createdAt: stage.created_at,
        updatedAt: stage.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(attachmentStagesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_attachment_stages.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting attachment stages to CSV:", error);
    res.status(500).json({
      message: "Error exporting attachment stages to CSV",
      error: error.message,
    });
  }
};

const exportFilteredAttachmentStagesToPDF = async (req, res) => {
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

    const { rows: attachmentStages } =
      await AttachmentStageModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          { model: SalesOrderModel, as: "sales_order" },
          { model: AttachmentModel, as: "attachment" },
        ],
      });

    if (!attachmentStages || attachmentStages.length === 0) {
      return res.status(404).json({
        message: "No attachment stages found matching the filters",
      });
    }

    const attachmentStagesData = attachmentStages.map((stage) => {
      return [
        stage.attachment_stage_id || "N/A",
        stage.so_id || "N/A",
        stage.attachment_id || "N/A",
        stage.stage_name || "N/A",
        stage.closure_status || "N/A",
        stage.completion_date || "N/A",
        stage.remarks
          ? stage.remarks.substring(0, 50) +
            (stage.remarks.length > 50 ? "..." : "")
          : "N/A",
        stage.created_at
          ? new Date(stage.created_at).toLocaleDateString()
          : "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Attachment Stages Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [60, 60, 60, 80, 80, 80, 120, 80],
            body: [
              [
                "ID",
                "SO ID",
                "Attachment ID",
                "Stage Name",
                "Closure Status",
                "Completion Date",
                "Remarks",
                "Created At",
              ],
              ...attachmentStagesData,
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
    res.attachment("attachment_stages_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting attachment stages to PDF:", error);
    res.status(500).json({
      message: "Error exporting attachment stages to PDF",
      error: error.message,
    });
  }
};

const getAttachmentStagesByAttcahmentId = async (req, res) => {
  try {
    const { attachment_id } = req.params;
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    console.log(`Fetching stages for Attachment ID: ${attachment_id}`);

    const { count: totalAttachmentStages, rows: AttachmentStages } =
      await AttachmentStageModel.findAndCountAll({
        where: { attachment_id }, // Filter by attachment_id
        offset,
        limit: parseInt(limit),
        include: [
          { model: SalesOrderModel, as: "sales_order" },
          { model: AttachmentModel, as: "attachment" },
        ],
      });

    console.log(
      `Found ${totalAttachmentStages} stages for Attachment ID: ${attachment_id}`
    );

    res.status(200).json({
      totalAttachmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAttachmentStages / limit),
      AttachmentStages,
    });
  } catch (error) {
    console.error(
      "Error retrieving attachment stages for attachment ID:",
      error
    );
    res.status(500).json({
      message: "Error retrieving attachment stages for attachment ID",
      error: error.message,
    });
  }
};

module.exports = {
  createAttachmentStage,
  updateAttachmentStage,
  deleteAttachmentStage,
  getAttachmentStageById,
  getAllAttachmentStages,
  filterAttachmentStages,
  getAttachmentStagesBySalesOrder,
  exportFilteredAttachmentStagesToCSV,
  exportFilteredAttachmentStagesToPDF,
  getAttachmentStagesByAttcahmentId,
};

// const SubProductAttachmentStageModel = require("../../models/fleet-management/SubProductAttachmentStageModel");
// const SalesOrderModel = require("../../models/fleet-management/SalesOrdersModel");
// const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
// const { Parser } = require("json2csv");
// const PdfPrinter = require("pdfmake");
// const path = require("path");

// const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

// const createSubProductAttachmentStage = async (req, res) => {
//   const { so_id, attachment_id, stage_name, closure_status, completion_date, remarks } = req.body;

//   try {
//     const subProductAttachmentStage = await SubProductAttachmentStageModel.create({
//       so_id,
//       attachment_id: attachment_id || null, // Handle undefined/null properly
//       stage_name,
//       closure_status,
//       completion_date,
//       remarks,
//     });

//     res.status(201).json({ 
//       message: "Sub product attachment stage created successfully", 
//       subProductAttachmentStage 
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateSubProductAttachmentStage = async (req, res) => {
//   const { sub_product_attachment_stage_id } = req.params;
//   const { so_id, attachment_id, stage_name, closure_status, completion_date, remarks } = req.body;

//   try {
//     const subProductAttachmentStageToUpdate = await SubProductAttachmentStageModel.findByPk(sub_product_attachment_stage_id);

//     if (!subProductAttachmentStageToUpdate) {
//       return res.status(404).json({ message: "Sub product attachment stage not found" });
//     }

//     subProductAttachmentStageToUpdate.so_id = so_id !== undefined ? so_id : subProductAttachmentStageToUpdate.so_id;
//     subProductAttachmentStageToUpdate.attachment_id = attachment_id !== undefined ? attachment_id : subProductAttachmentStageToUpdate.attachment_id;
//     subProductAttachmentStageToUpdate.stage_name = stage_name || subProductAttachmentStageToUpdate.stage_name;
//     subProductAttachmentStageToUpdate.closure_status = closure_status || subProductAttachmentStageToUpdate.closure_status;
//     subProductAttachmentStageToUpdate.completion_date = completion_date || subProductAttachmentStageToUpdate.completion_date;
//     subProductAttachmentStageToUpdate.remarks = remarks || subProductAttachmentStageToUpdate.remarks;

//     await subProductAttachmentStageToUpdate.save();
//     res.status(200).json({
//       message: "Sub product attachment stage updated successfully",
//       subProductAttachmentStage: subProductAttachmentStageToUpdate,
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       message: "Error updating sub product attachment stage", 
//       error: error.message 
//     });
//   }
// };

// const deleteSubProductAttachmentStage = async (req, res) => {
//   const { sub_product_attachment_stage_id } = req.params;

//   try {
//     const subProductAttachmentStageToDelete = await SubProductAttachmentStageModel.findByPk(sub_product_attachment_stage_id);

//     if (!subProductAttachmentStageToDelete) {
//       return res.status(404).json({ message: "Sub product attachment stage not found" });
//     }

//     await subProductAttachmentStageToDelete.destroy();
//     res.status(200).json({ message: "Sub product attachment stage deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ 
//       message: "Error deleting sub product attachment stage", 
//       error: error.message 
//     });
//   }
// };

// const getSubProductAttachmentStageById = async (req, res) => {
//   try {
//     const { sub_product_attachment_stage_id } = req.params;
//     const subProductAttachmentStage = await SubProductAttachmentStageModel.findByPk(sub_product_attachment_stage_id, {
//       include: [
//         { model: SalesOrderModel, as: 'sales_order' },
//         { model: AttachmentModel, as: 'attachment' }
//       ]
//     });

//     if (!subProductAttachmentStage) {
//       return res.status(404).json({ message: "Sub product attachment stage not found" });
//     }

//     res.status(200).json(subProductAttachmentStage);
//   } catch (error) {
//     res.status(500).json({ 
//       message: "Error retrieving sub product attachment stage", 
//       error: error.message 
//     });
//   }
// };

// const getAllSubProductAttachmentStages = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * parseInt(limit);

//     const { count: totalSubProductAttachmentStages, rows: subProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
//       offset,
//       limit: parseInt(limit),
//       include: [
//         { model: SalesOrderModel, as: 'sales_order' },
//         { model: AttachmentModel, as: 'attachment' }
//       ],
//     });

//     res.status(200).json({
//       totalSubProductAttachmentStages,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalSubProductAttachmentStages / limit),
//       subProductAttachmentStages,
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       message: "Error retrieving sub product attachment stages", 
//       error: error.message 
//     });
//   }
// };

// const filterSubProductAttachmentStages = async (req, res) => {
//   try {
//     const { closure_status = "All", so_id, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * parseInt(limit);

//     const where = {};

//     if (closure_status !== "All") {
//       where.closure_status = closure_status;
//     }

//     if (so_id) {
//       where.so_id = so_id;
//     }

//     const { count: totalSubProductAttachmentStages, rows: subProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
//       where,
//       offset,
//       limit: parseInt(limit),
//       include: [
//         { model: SalesOrderModel, as: 'sales_order' },
//         { model: AttachmentModel, as: 'attachment' }
//       ],
//     });

//     res.status(200).json({
//       totalSubProductAttachmentStages,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalSubProductAttachmentStages / limit),
//       subProductAttachmentStages,
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       message: "Error filtering sub product attachment stages", 
//       error: error.message 
//     });
//   }
// };

// const getSubProductAttachmentStagesBySalesOrder = async (req, res) => {
//   try {
//     const { so_id } = req.params;
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * parseInt(limit);

//     const { count: totalSubProductAttachmentStages, rows: subProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
//       where: { so_id },
//       offset,
//       limit: parseInt(limit),
//       include: [
//         { model: SalesOrderModel, as: 'sales_order' },
//         { model: AttachmentModel, as: 'attachment' }
//       ],
//     });

//     res.status(200).json({
//       totalSubProductAttachmentStages,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalSubProductAttachmentStages / limit),
//       subProductAttachmentStages,
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       message: "Error retrieving sub product attachment stages for sales order", 
//       error: error.message 
//     });
//   }
// };

// const exportFilteredSubProductAttachmentStagesToCSV = async (req, res) => {
//   try {
//     const { closure_status = "All", so_id, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * parseInt(limit);

//     const where = {};

//     if (closure_status !== "All") {
//       where.closure_status = closure_status;
//     }

//     if (so_id) {
//       where.so_id = so_id;
//     }

//     const { rows: subProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
//       where,
//       offset,
//       limit: parseInt(limit),
//       include: [
//         { model: SalesOrderModel, as: 'sales_order' },
//         { model: AttachmentModel, as: 'attachment' }
//       ],
//     });

//     if (!subProductAttachmentStages || subProductAttachmentStages.length === 0) {
//       return res.status(404).json({
//         message: "No sub product attachment stages found matching the filters",
//       });
//     }

//     const subProductAttachmentStagesData = subProductAttachmentStages.map((stage) => {
//       return {
//         subProductAttachmentStageId: stage.sub_product_attachment_stage_id,
//         soId: stage.so_id,
//         attachment_id: stage.attachment_id,
//         stageName: stage.stage_name,
//         closureStatus: stage.closure_status,
//         completionDate: stage.completion_date,
//         remarks: stage.remarks,
//         createdAt: stage.created_at,
//         updatedAt: stage.updated_at,
//       };
//     });

//     const json2csvParser = new Parser();
//     const csv = json2csvParser.parse(subProductAttachmentStagesData);

//     res.header("Content-Type", "text/csv");
//     res.attachment("filtered_sub_product_attachment_stages.csv");
//     res.send(csv);
//   } catch (error) {
//     console.error("Error exporting sub product attachment stages to CSV:", error);
//     res.status(500).json({
//       message: "Error exporting sub product attachment stages to CSV",
//       error: error.message,
//     });
//   }
// };

// const exportFilteredSubProductAttachmentStagesToPDF = async (req, res) => {
//   try {
//     const { closure_status = "All", so_id, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * parseInt(limit);

//     const where = {};

//     if (closure_status !== "All") {
//       where.closure_status = closure_status;
//     }

//     if (so_id) {
//       where.so_id = so_id;
//     }

//     const { rows: subProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
//       where,
//       offset,
//       limit: parseInt(limit),
//       include: [
//         { model: SalesOrderModel, as: 'sales_order' },
//         { model: AttachmentModel, as: 'attachment' }
//       ],
//     });

//     if (!subProductAttachmentStages || subProductAttachmentStages.length === 0) {
//       return res.status(404).json({ 
//         message: "No sub product attachment stages found matching the filters" 
//       });
//     }

//     const subProductAttachmentStagesData = subProductAttachmentStages.map((stage) => {
//       return [
//         stage.sub_product_attachment_stage_id || "N/A",
//         stage.so_id || "N/A",
//         stage.attachment_id || "N/A",
//         stage.stage_name || "N/A",
//         stage.closure_status || "N/A",
//         stage.completion_date || "N/A",
//         stage.remarks ? stage.remarks.substring(0, 50) + (stage.remarks.length > 50 ? '...' : '') : "N/A",
//         stage.created_at ? new Date(stage.created_at).toLocaleDateString() : "N/A",
//       ];
//     });

//     const docDefinition = {
//       content: [
//         { text: "Sub Product Attachment Stages Data", style: "header" },
//         {
//           table: {
//             headerRows: 1,
//             widths: [60, 60, 60, 80, 80, 80, 120, 80],
//             body: [
//               ["ID", "SO ID", "Attachment ID", "Stage Name", "Closure Status", "Completion Date", "Remarks", "Created At"],
//               ...subProductAttachmentStagesData,
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
//     res.attachment("sub_product_attachment_stages_data.pdf");

//     pdfDoc.pipe(res);
//     pdfDoc.end();
//   } catch (error) {
//     console.error("Error exporting sub product attachment stages to PDF:", error);
//     res.status(500).json({
//       message: "Error exporting sub product attachment stages to PDF",
//       error: error.message,
//     });
//   }
// };

// const getSubProductAttachmentStagesByAttcahmentId = async (req, res) => {
//   try {
//     const { attachment_id } = req.params;
//     const { page = 1, limit = 100 } = req.query;
//     const offset = (page - 1) * parseInt(limit);

//     console.log(`Fetching stages for Sub Product Attachment ID: ${attachment_id}`);

//     const { count: totalSubProductAttachmentStages, rows: SubProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
//       where: { attachment_id }, // Filter by attachment_id
//       offset,
//       limit: parseInt(limit),
//       include: [
//         { model: SalesOrderModel, as: 'sales_order' },
//         { model: AttachmentModel, as: 'attachment' }
//       ],
//     });

//     console.log(`Found ${totalSubProductAttachmentStages} stages for Sub Product Attachment ID: ${attachment_id}`);

//     res.status(200).json({
//       totalSubProductAttachmentStages,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(totalSubProductAttachmentStages / limit),
//       SubProductAttachmentStages,
//     });
//   } catch (error) {
//     console.error("Error retrieving sub product attachment stages for attachment ID:", error);
//     res.status(500).json({ 
//       message: "Error retrieving sub product attachment stages for attachment ID", 
//       error: error.message 
//     });
//   }
// };

// module.exports = {
//   createSubProductAttachmentStage,
//   updateSubProductAttachmentStage,
//   deleteSubProductAttachmentStage,
//   getSubProductAttachmentStageById,
//   getAllSubProductAttachmentStages,
//   filterSubProductAttachmentStages,
//   getSubProductAttachmentStagesBySalesOrder,
//   exportFilteredSubProductAttachmentStagesToCSV,
//   exportFilteredSubProductAttachmentStagesToPDF,
//   getSubProductAttachmentStagesByAttcahmentId,
// };

const SubProductAttachmentStageModel = require("../models/SubProductAttachmentStageModel");
const SalesOrderModel = require("../models/SalesOrdersModel");
const ProductModel = require("../models/ProductModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createSubProductAttachmentStage = async (req, res) => {
  const { so_id, product_id, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    // Validate so_id exists
    if (so_id) {
      const salesOrder = await SalesOrderModel.findByPk(so_id);
      if (!salesOrder) {
        return res.status(404).json({ 
          error: `Sales Order with ID ${so_id} does not exist` 
        });
      }
    }

    // Validate product_id exists if provided
    if (product_id) {
      const product = await ProductModel.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ 
          error: `Product with ID ${product_id} does not exist` 
        });
      }
    }

    const subProductAttachmentStage = await SubProductAttachmentStageModel.create({
      so_id,
      product_id: product_id || null,
      stage_name,
      closure_status,
      completion_date,
      remarks,
    });

    res.status(201).json({ 
      message: "Sub product attachment stage created successfully", 
      subProductAttachmentStage 
    });
  } catch (error) {
    console.error("Error creating sub product attachment stage:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateSubProductAttachmentStage = async (req, res) => {
  const { sub_product_attachment_stage_id } = req.params;
  const { so_id, product_id, stage_name, closure_status, completion_date, remarks } = req.body;

  try {
    const subProductAttachmentStageToUpdate = await SubProductAttachmentStageModel.findByPk(sub_product_attachment_stage_id);

    if (!subProductAttachmentStageToUpdate) {
      return res.status(404).json({ message: "Sub product attachment stage not found" });
    }

    subProductAttachmentStageToUpdate.so_id = so_id !== undefined ? so_id : subProductAttachmentStageToUpdate.so_id;
    subProductAttachmentStageToUpdate.product_id = product_id !== undefined ? product_id : subProductAttachmentStageToUpdate.product_id;
    subProductAttachmentStageToUpdate.stage_name = stage_name || subProductAttachmentStageToUpdate.stage_name;
    subProductAttachmentStageToUpdate.closure_status = closure_status || subProductAttachmentStageToUpdate.closure_status;
    subProductAttachmentStageToUpdate.completion_date = completion_date || subProductAttachmentStageToUpdate.completion_date;
    subProductAttachmentStageToUpdate.remarks = remarks || subProductAttachmentStageToUpdate.remarks;

    await subProductAttachmentStageToUpdate.save();
    res.status(200).json({
      message: "Sub product attachment stage updated successfully",
      subProductAttachmentStage: subProductAttachmentStageToUpdate,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating sub product attachment stage", 
      error: error.message 
    });
  }
};

const deleteSubProductAttachmentStage = async (req, res) => {
  const { sub_product_attachment_stage_id } = req.params;

  try {
    const subProductAttachmentStageToDelete = await SubProductAttachmentStageModel.findByPk(sub_product_attachment_stage_id);

    if (!subProductAttachmentStageToDelete) {
      return res.status(404).json({ message: "Sub product attachment stage not found" });
    }

    await subProductAttachmentStageToDelete.destroy();
    res.status(200).json({ message: "Sub product attachment stage deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting sub product attachment stage", 
      error: error.message 
    });
  }
};

const getSubProductAttachmentStageById = async (req, res) => {
  try {
    const { sub_product_attachment_stage_id } = req.params;
    const subProductAttachmentStage = await SubProductAttachmentStageModel.findByPk(sub_product_attachment_stage_id, {
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ProductModel, as: 'product' }
      ]
    });

    if (!subProductAttachmentStage) {
      return res.status(404).json({ message: "Sub product attachment stage not found" });
    }

    res.status(200).json(subProductAttachmentStage);
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving sub product attachment stage", 
      error: error.message 
    });
  }
};

const getAllSubProductAttachmentStages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalSubProductAttachmentStages, rows: subProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ProductModel, as: 'product' }
      ],
    });

    res.status(200).json({
      totalSubProductAttachmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSubProductAttachmentStages / limit),
      subProductAttachmentStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving sub product attachment stages", 
      error: error.message 
    });
  }
};

const filterSubProductAttachmentStages = async (req, res) => {
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

    const { count: totalSubProductAttachmentStages, rows: subProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ProductModel, as: 'product' }
      ],
    });

    res.status(200).json({
      totalSubProductAttachmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSubProductAttachmentStages / limit),
      subProductAttachmentStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error filtering sub product attachment stages", 
      error: error.message 
    });
  }
};

const getSubProductAttachmentStagesBySalesOrder = async (req, res) => {
  try {
    const { so_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalSubProductAttachmentStages, rows: subProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
      where: { so_id },
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ProductModel, as: 'product' }
      ],
    });

    res.status(200).json({
      totalSubProductAttachmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSubProductAttachmentStages / limit),
      subProductAttachmentStages,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving sub product attachment stages for sales order", 
      error: error.message 
    });
  }
};

const getSubProductAttachmentStagesByProductId = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    console.log(`Fetching stages for Product ID: ${product_id}`);

    const { count: totalSubProductAttachmentStages, rows: SubProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
      where: { product_id },
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ProductModel, as: 'product' }
      ],
    });

    console.log(`Found ${totalSubProductAttachmentStages} stages for Product ID: ${product_id}`);

    res.status(200).json({
      totalSubProductAttachmentStages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSubProductAttachmentStages / limit),
      SubProductAttachmentStages,
    });
  } catch (error) {
    console.error("Error retrieving sub product attachment stages for product ID:", error);
    res.status(500).json({ 
      message: "Error retrieving sub product attachment stages for product ID", 
      error: error.message 
    });
  }
};

const exportFilteredSubProductAttachmentStagesToCSV = async (req, res) => {
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

    const { rows: subProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ProductModel, as: 'product' }
      ],
    });

    if (!subProductAttachmentStages || subProductAttachmentStages.length === 0) {
      return res.status(404).json({
        message: "No sub product attachment stages found matching the filters",
      });
    }

    const subProductAttachmentStagesData = subProductAttachmentStages.map((stage) => {
      return {
        subProductAttachmentStageId: stage.sub_product_attachment_stage_id,
        soId: stage.so_id,
        productId: stage.product_id,
        stageName: stage.stage_name,
        closureStatus: stage.closure_status,
        completionDate: stage.completion_date,
        remarks: stage.remarks,
        createdAt: stage.created_at,
        updatedAt: stage.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(subProductAttachmentStagesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_sub_product_attachment_stages.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting sub product attachment stages to CSV:", error);
    res.status(500).json({
      message: "Error exporting sub product attachment stages to CSV",
      error: error.message,
    });
  }
};

const exportFilteredSubProductAttachmentStagesToPDF = async (req, res) => {
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

    const { rows: subProductAttachmentStages } = await SubProductAttachmentStageModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: SalesOrderModel, as: 'sales_order' },
        { model: ProductModel, as: 'product' }
      ],
    });

    if (!subProductAttachmentStages || subProductAttachmentStages.length === 0) {
      return res.status(404).json({ 
        message: "No sub product attachment stages found matching the filters" 
      });
    }

    const subProductAttachmentStagesData = subProductAttachmentStages.map((stage) => {
      return [
        stage.sub_product_attachment_stage_id || "N/A",
        stage.so_id || "N/A",
        stage.product_id || "N/A",
        stage.stage_name || "N/A",
        stage.closure_status || "N/A",
        stage.completion_date || "N/A",
        stage.remarks ? stage.remarks.substring(0, 50) + (stage.remarks.length > 50 ? '...' : '') : "N/A",
        stage.created_at ? new Date(stage.created_at).toLocaleDateString() : "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Sub Product Attachment Stages Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [60, 60, 60, 80, 80, 80, 120, 80],
            body: [
              ["ID", "SO ID", "Product ID", "Stage Name", "Closure Status", "Completion Date", "Remarks", "Created At"],
              ...subProductAttachmentStagesData,
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
    res.attachment("sub_product_attachment_stages_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting sub product attachment stages to PDF:", error);
    res.status(500).json({
      message: "Error exporting sub product attachment stages to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createSubProductAttachmentStage,
  updateSubProductAttachmentStage,
  deleteSubProductAttachmentStage,
  getSubProductAttachmentStageById,
  getAllSubProductAttachmentStages,
  filterSubProductAttachmentStages,
  getSubProductAttachmentStagesBySalesOrder,
  exportFilteredSubProductAttachmentStagesToCSV,
  exportFilteredSubProductAttachmentStagesToPDF,
  getSubProductAttachmentStagesByProductId,
};
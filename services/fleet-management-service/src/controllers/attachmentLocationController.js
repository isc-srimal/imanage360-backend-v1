const AttachmentLocationModel = require("../models/AttachmentLocationModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createAttachmentLocation = async (req, res) => {
  const { attachment_location, status = "Active" } = req.body;

  try {
    const attachmentLocation = await AttachmentLocationModel.create({
      attachment_location,
      status,
    });

    res.status(201).json({ 
      message: "Attachment location created successfully", 
      attachmentLocation 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAttachmentLocation = async (req, res) => {
  const { id } = req.params;
  const { attachment_location, status } = req.body;

  try {
    const attachmentLocationToUpdate = await AttachmentLocationModel.findByPk(id);

    if (!attachmentLocationToUpdate) {
      return res.status(404).json({ message: "Attachment location not found" });
    }

    attachmentLocationToUpdate.attachment_location = attachment_location || attachmentLocationToUpdate.attachment_location;
    attachmentLocationToUpdate.status = status || attachmentLocationToUpdate.status;

    await attachmentLocationToUpdate.save();
    res.status(200).json({
      message: "Attachment location updated successfully",
      attachmentLocation: attachmentLocationToUpdate,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating attachment location", 
      error: error.message 
    });
  }
};

const deleteAttachmentLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const attachmentLocationToDelete = await AttachmentLocationModel.findByPk(id);

    if (!attachmentLocationToDelete) {
      return res.status(404).json({ message: "Attachment location not found" });
    }

    await attachmentLocationToDelete.destroy();
    res.status(200).json({ message: "Attachment location deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting attachment location", 
      error: error.message 
    });
  }
};

const getAttachmentLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const attachmentLocation = await AttachmentLocationModel.findByPk(id);

    if (!attachmentLocation) {
      return res.status(404).json({ message: "Attachment location not found" });
    }

    res.status(200).json(attachmentLocation);
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving attachment location", 
      error: error.message 
    });
  }
};

const getAllAttachmentLocations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalAttachmentLocations, rows: attachmentLocations } =
      await AttachmentLocationModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        order: [['created_at', 'DESC']]
      });

    res.status(200).json({
      totalAttachmentLocations,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAttachmentLocations / limit),
      attachmentLocations,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving attachment locations", 
      error: error.message 
    });
  }
};

const filterAttachmentLocations = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalAttachmentLocations, rows: attachmentLocations } =
      await AttachmentLocationModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalAttachmentLocations,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAttachmentLocations / limit),
      attachmentLocations,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error filtering attachment locations", 
      error: error.message 
    });
  }
};

const exportFilteredAttachmentLocationsToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: attachmentLocations } = await AttachmentLocationModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!attachmentLocations || attachmentLocations.length === 0) {
      return res.status(404).json({
        message: "No attachment locations found matching the filters",
      });
    }

    const attachmentLocationsData = attachmentLocations.map((location) => {
      return {
        attachmentLocationId: location.attachment_location_id,
        attachmentLocation: location.attachment_location,
        status: location.status,
        createdAt: location.created_at,
        updatedAt: location.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(attachmentLocationsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_attachment_locations.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting attachment locations to CSV:", error);
    res.status(500).json({
      message: "Error exporting attachment locations to CSV",
      error: error.message,
    });
  }
};

const exportFilteredAttachmentLocationsToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: attachmentLocations } = await AttachmentLocationModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!attachmentLocations || attachmentLocations.length === 0) {
      return res.status(404).json({ 
        message: "No attachment locations found matching the filters" 
      });
    }

    const attachmentLocationsData = attachmentLocations.map((location) => {
      return [
        location.attachment_location_id || "N/A",
        location.attachment_location || "N/A",
        location.status || "N/A",
        new Date(location.created_at).toLocaleDateString() || "N/A",
        new Date(location.updated_at).toLocaleDateString() || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Attachment Locations Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [80, "*", 60, 80, 80],
            body: [
              ["ID", "Attachment Location", "Status", "Created At", "Updated At"],
              ...attachmentLocationsData,
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
    res.attachment("attachment_locations_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting attachment locations to PDF:", error);
    res.status(500).json({
      message: "Error exporting attachment locations to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createAttachmentLocation,
  updateAttachmentLocation,
  deleteAttachmentLocation,
  getAttachmentLocationById,
  getAllAttachmentLocations,
  filterAttachmentLocations,
  exportFilteredAttachmentLocationsToCSV,
  exportFilteredAttachmentLocationsToPDF,
};
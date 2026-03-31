const JobLocationModel = require("../models/JobLocationModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createJobLocation = async (req, res) => {
  const { job_location_name, status = "Active" } = req.body;

  try {
    const jobLocation = await JobLocationModel.create({
      job_location_name,
      status,
    });

    res
      .status(201)
      .json({ message: "Job location created successfully", jobLocation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateJobLocation = async (req, res) => {
  const { job_location_id } = req.params;
  const { job_location_name, status } = req.body;

  try {
    const jobLocationToUpdate = await JobLocationModel.findByPk(job_location_id);

    if (!jobLocationToUpdate) {
      return res.status(404).json({ message: "Job location not found" });
    }

    jobLocationToUpdate.job_location_name = job_location_name || jobLocationToUpdate.job_location_name;
    jobLocationToUpdate.status = status || jobLocationToUpdate.status;

    await jobLocationToUpdate.save();
    res.status(200).json({
      message: "Job location updated successfully",
      jobLocation: jobLocationToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating job location", error: error.message });
  }
};

const deleteJobLocation = async (req, res) => {
  const { job_location_id } = req.params;

  try {
    const jobLocationToDelete = await JobLocationModel.findByPk(job_location_id);

    if (!jobLocationToDelete) {
      return res.status(404).json({ message: "Job location not found" });
    }

    await jobLocationToDelete.destroy();
    res.status(200).json({ message: "Job location deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting job location", error: error.message });
  }
};

const getJobLocationById = async (req, res) => {
  try {
    const { job_location_id } = req.params;
    const jobLocation = await JobLocationModel.findByPk(job_location_id);

    if (!jobLocation) {
      return res.status(404).json({ message: "Job location not found" });
    }

    res.status(200).json(jobLocation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving job location", error: error.message });
  }
};

const getAllJobLocations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalJobLocations, rows: jobLocations } =
      await JobLocationModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalJobLocations,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalJobLocations / limit),
      jobLocations,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving job locations", error: error.message });
  }
};

const filterJobLocations = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalJobLocations, rows: jobLocations } =
      await JobLocationModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalJobLocations,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalJobLocations / limit),
      jobLocations,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering job locations", error: error.message });
  }
};

const exportFilteredJobLocationsToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: jobLocations } = await JobLocationModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!jobLocations || jobLocations.length === 0) {
      return res.status(404).json({
        message: "No job locations found matching the filters",
      });
    }

    const jobLocationsData = jobLocations.map((location) => {
      return {
        jobLocationId: location.job_location_id,
        jobLocationName: location.job_location_name,
        status: location.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(jobLocationsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_job_locations.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting job locations to CSV:", error);
    res.status(500).json({
      message: "Error exporting job locations to CSV",
      error: error.message,
    });
  }
};

const exportFilteredJobLocationsToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: jobLocations } = await JobLocationModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!jobLocations || jobLocations.length === 0) {
      return res
        .status(404)
        .json({ message: "No job locations found matching the filters" });
    }

    const jobLocationsData = jobLocations.map((location) => {
      return [
        location.job_location_id || "N/A",
        location.job_location_name || "N/A",
        location.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Job Locations Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Job Location ID", "Job Location Name", "Status"],
              ...jobLocationsData,
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
        body: {
          fontSize: 8,
          bold: true,
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
    res.attachment("job_locations_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting job locations to PDF:", error);
    res.status(500).json({
      message: "Error exporting job locations to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createJobLocation,
  updateJobLocation,
  deleteJobLocation,
  getJobLocationById,
  getAllJobLocations,
  filterJobLocations,
  exportFilteredJobLocationsToCSV,
  exportFilteredJobLocationsToPDF,
};
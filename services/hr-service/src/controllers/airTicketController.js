const airTicket = require("../models/AirTicketModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createAirTicket = async (req, res) => {
  const {
    destinationCountry,
    adultPackageAmount,
    infantAmount,
    status = "Active",
  } = req.body;

  try {
    const airTickets = await airTicket.create({
      destinationCountry,
      adultPackageAmount,
      infantAmount,
      status,
    });

    res
      .status(201)
      .json({ message: "Air ticket created successfully", airTickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAirTickets = async (req, res) => {
  const { id } = req.params;
  const { destinationCountry, adultPackageAmount, infantAmount, status } =
    req.body;

  try {
    const airTicketToUpdate = await airTicket.findByPk(id);

    if (!airTicketToUpdate) {
      return res.status(404).json({ message: "Air ticket not found" });
    }

    airTicketToUpdate.destinationCountry = destinationCountry || airTicketToUpdate.destinationCountry;
    airTicketToUpdate.adultPackageAmount = adultPackageAmount || airTicketToUpdate.adultPackageAmount;
    airTicketToUpdate.infantAmount = infantAmount || airTicketToUpdate.infantAmount;
    airTicketToUpdate.status = status || airTicketToUpdate.status;

    await airTicketToUpdate.save();
    res.status(200).json({
      message: "Air ticket updated successfully",
      airTickets: airTicketToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating air ticket", error: error.message });
  }
};

const deleteAirTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const airTicketToDelete = await airTicket.findByPk(id);

    if (!airTicketToDelete) {
      return res.status(404).json({ message: "Air ticket not found" });
    }

    await airTicketToDelete.destroy();
    res.status(200).json({ message: "Air ticket deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting air ticket", error: error.message });
  }
};

const getAirTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const airTickets = await airTicket.findByPk(id);

    if (!airTickets) {
      return res.status(404).json({ message: "Air ticket not found" });
    }

    res.status(200).json(airTickets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving air ticket", error: error.message });
  }
};

const getAllAirTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalAirTickets, rows: airTickets } =
      await airTicket.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalAirTickets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAirTickets / limit),
      airTickets,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving air tickets", error: error.message });
  }
};

const filterAirTickets = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalBankDetails, rows: airTickets } =
      await airTicket.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalBankDetails,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBankDetails / limit),
      airTickets,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering air tickets", error: error.message });
  }
};

const exportFilteredAirTicketsToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: airTickets } = await airTicket.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    console.log(airTickets);

    if (!airTickets || airTickets.length === 0) {
      return res.status(404).json({
        message: "No air tickets found matching the filters",
      });
    }

    const airTicketsData = airTickets.map((airTicketz) => {
      return {
        airTicketId: airTicketz.id,
        destinationCountry: airTicketz.destinationCountry,
        adultPackageAmount: airTicketz.adultPackageAmount,
        infantAmount: airTicketz.infantAmount,
        status: airTicketz.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(airTicketsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_air_tickets.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting air tickets to CSV:", error);
    res.status(500).json({
      message: "Error exporting air tickets to CSV",
      error: error.message,
    });
  }
};

const exportFilteredAirTicketsToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: airTickets } = await airTicket.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!airTickets || airTickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No air tickets found matching the filters" });
    }

    const airTicketsData = airTickets.map((airTicketz) => {
      return [
        airTicketz.id || "N/A",
        airTicketz.destinationCountry || "N/A",
        airTicketz.adultPackageAmount || "N/A",
        airTicketz.infantAmount || "N/A",
        airTicketz.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Air Tickets Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*"],
            body: [
              ["Air Ticket ID", "Destination Country", "Adult Package Amount", "Infant Amount", "Status"],
              ...airTicketsData,
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
    res.attachment("air_tickets_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting air tickets to PDF:", error);
    res.status(500).json({
      message: "Error exporting air tickets to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createAirTicket,
  updateAirTickets,
  deleteAirTicket,
  getAirTicketById,
  getAllAirTickets,
  filterAirTickets,
  exportFilteredAirTicketsToCSV,
  exportFilteredAirTicketsToPDF,
};

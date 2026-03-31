const SalesOrderOld = require("../models/SalesOrderModelOld");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createSalesOrder = async (req, res) => {
  const {
    client,
    projectSite,
    factors,
    mobilizationDate,
    workStartDate,
    workEndDate,
    billingModel,
    serviceOptions,
    specialInstructions,
    estimatedValue,
    status = "Pending",
  } = req.body;

  try {
    const salesOrder = await SalesOrderOld.create({
      client,
      projectSite,
      factors,
      mobilizationDate,
      workStartDate,
      workEndDate,
      billingModel,
      serviceOptions,
      specialInstructions,
      estimatedValue,
      status,
    });

    res
      .status(201)
      .json({ message: "Sales order created successfully", salesOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSalesOrder = async (req, res) => {
  const { id } = req.params;
  const {
    client,
    projectSite,
    factors,
    mobilizationDate,
    workStartDate,
    workEndDate,
    billingModel,
    serviceOptions,
    specialInstructions,
    estimatedValue,
    status,
  } = req.body;

  try {
    const salesOrderToUpdate = await SalesOrderOld.findByPk(id);

    if (!salesOrderToUpdate) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    salesOrderToUpdate.client = client || salesOrderToUpdate.client;
    salesOrderToUpdate.projectSite =
      projectSite || salesOrderToUpdate.projectSite;
    salesOrderToUpdate.factors = factors || salesOrderToUpdate.factors;
    salesOrderToUpdate.mobilizationDate =
      mobilizationDate || salesOrderToUpdate.mobilizationDate;
    salesOrderToUpdate.workStartDate =
      workStartDate || salesOrderToUpdate.workStartDate;
    salesOrderToUpdate.workEndDate =
      workEndDate || salesOrderToUpdate.workEndDate;
    salesOrderToUpdate.billingModel =
      billingModel || salesOrderToUpdate.billingModel;
    salesOrderToUpdate.serviceOptions =
      serviceOptions || salesOrderToUpdate.serviceOptions;
    salesOrderToUpdate.specialInstructions =
      specialInstructions || salesOrderToUpdate.specialInstructions;
    salesOrderToUpdate.estimatedValue =
      estimatedValue || salesOrderToUpdate.estimatedValue;
    salesOrderToUpdate.status = status || salesOrderToUpdate.status;

    await salesOrderToUpdate.save();
    res.status(200).json({
      message: "Sales order updated successfully",
      salesOrder: salesOrderToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating sales order", error: error.message });
  }
};

const deleteSalesOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const salesOrderToDelete = await SalesOrderOld.findByPk(id);

    if (!salesOrderToDelete) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    await salesOrderToDelete.destroy();
    res.status(200).json({ message: "Sales order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting sales order", error: error.message });
  }
};

const getSalesOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const salesOrder = await SalesOrderOld.findByPk(id, {
      include: [
        {
          model: require("../../models/fleet-management/JobLocationModel"),
          as: "jobLocation",
        },
      ],
    });

    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    res.status(200).json(salesOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving sales order", error: error.message });
  }
};

const getAllSalesOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalSalesOrders, rows: salesOrders } =
      await SalesOrderOld.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: require("../../models/fleet-management/JobLocationModel"),
            as: "jobLocation",
          },
        ],
      });

    res.status(200).json({
      totalSalesOrders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSalesOrders / limit),
      salesOrders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving sales orders", error: error.message });
  }
};

const filterSalesOrders = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where.status = status;
    }

    const { count: totalSalesOrders, rows: salesOrders } =
      await SalesOrderOld.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: require("../../models/fleet-management/JobLocationModel"),
            as: "jobLocation",
          },
        ],
      });

    res.status(200).json({
      totalSalesOrders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSalesOrders / limit),
      salesOrders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering sales orders", error: error.message });
  }
};

const exportFilteredSalesOrdersToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where.status = status;
    }

    const { rows: salesOrders } = await SalesOrderOld.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: require("../../models/fleet-management/JobLocationModel"),
          as: "jobLocation",
        },
      ],
    });

    if (!salesOrders || salesOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No sales orders found matching the filters" });
    }

    const salesOrdersData = salesOrders.map((order) => ({
      salesOrderId: order.id,
      client: order.client,
      projectSite: order.projectSite,
      factors: order.factors,
      mobilizationDate: order.mobilizationDate,
      workStartDate: order.workStartDate,
      workEndDate: order.workEndDate,
      billingModel: order.billingModel,
      serviceOptions: JSON.stringify(order.serviceOptions),
      specialInstructions: order.specialInstructions,
      estimatedValue: order.estimatedValue,
      status: order.status,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(salesOrdersData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_sales_orders.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting sales orders to CSV:", error);
    res.status(500).json({
      message: "Error exporting sales orders to CSV",
      error: error.message,
    });
  }
};

const exportFilteredSalesOrdersToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where.status = status;
    }

    const { rows: salesOrders } = await SalesOrderOld.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: require("../../models/fleet-management/JobLocationModel"),
          as: "jobLocation",
        },
      ],
    });

    if (!salesOrders || salesOrders.length === 0) {
      return res
        .status(404)
        .json({ message: "No sales orders found matching the filters" });
    }

    const salesOrdersData = salesOrders.map((order) => [
      order.id || "N/A",
      order.client || "N/A",
      order.projectSite || "N/A",
      order.factors || "N/A",
      order.mobilizationDate.toISOString().split("T")[0] || "N/A",
      order.workStartDate.toISOString().split("T")[0] || "N/A",
      order.workEndDate.toISOString().split("T")[0] || "N/A",
      order.billingModel || "N/A",
      JSON.stringify(order.serviceOptions) || "N/A",
      order.specialInstructions || "N/A",
      order.estimatedValue || "N/A",
      order.status || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Sales Orders Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "*",
              "*",
              "auto",
              "auto",
              "auto",
            ],
            body: [
              [
                "Sales Order ID",
                "Client",
                "Project Site",
                "Factors",
                "Mobilization Date",
                "Work Start Date",
                "Work End Date",
                "Billing Model",
                "Service Options",
                "Special Instructions",
                "Estimated Value",
                "Status",
              ],
              ...salesOrdersData,
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
    res.attachment("sales_orders_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting sales orders to PDF:", error);
    res.status(500).json({
      message: "Error exporting sales orders to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  getSalesOrderById,
  getAllSalesOrders,
  filterSalesOrders,
  exportFilteredSalesOrdersToCSV,
  exportFilteredSalesOrdersToPDF,
};

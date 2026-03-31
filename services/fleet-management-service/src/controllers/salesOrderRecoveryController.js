const SalesOrderRecoveryModel = require("../models/SalesOrderRecoveryModel");
const SalesOrderModel = require("../models/SalesOrdersModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createBulkSalesOrderRecoveries = async (req, res) => {
  const { recoveries, so_id } = req.body;

  try {
    // Validate that the sales order exists
    if (so_id) {
      const salesOrder = await SalesOrderModel.findByPk(so_id);
      if (!salesOrder) {
        return res.status(404).json({ message: "Sales order not found" });
      }
    }

    // Validate recoveries array
    if (!Array.isArray(recoveries) || recoveries.length === 0) {
      return res.status(400).json({ message: "Recoveries array is required and must not be empty" });
    }

    // Create all recoveries
    const createdRecoveries = await SalesOrderRecoveryModel.bulkCreate(
      recoveries.map(recovery => ({
        ...recovery,
        so_id
      }))
    );

    res.status(201).json({
      message: `${createdRecoveries.length} recovery entries created successfully`,
      recoveries: createdRecoveries
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add this new function for getting recoveries by sales order
const getRecoveriesBySalesOrder = async (req, res) => {
  try {
    const { so_id } = req.params;

    const recoveries = await SalesOrderRecoveryModel.findAll({
      where: { so_id },
    });

    res.status(200).json({
      count: recoveries.length,
      recoveries
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving recoveries",
      error: error.message
    });
  }
};

const createSalesOrderRecovery = async (req, res) => {
  const {
    recovery_supplier,
    recovery_vehicle_type,
    no_of_trips,
    estimated_cost,
    is_selected,
    so_id
  } = req.body;

  try {
    // Validate that the sales order exists if so_id is provided
    if (so_id) {
      const salesOrder = await SalesOrderModel.findByPk(so_id);
      if (!salesOrder) {
        return res.status(404).json({ message: "Sales order not found" });
      }
    }

    const salesOrderRecovery = await SalesOrderRecoveryModel.create({
      recovery_supplier,
      recovery_vehicle_type,
      no_of_trips,
      estimated_cost,
      is_selected,
      so_id
    });

    res.status(201).json({
      message: "Sales order recovery created successfully",
      salesOrderRecovery
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSalesOrderRecovery = async (req, res) => {
  const { id } = req.params;
  const {
    recovery_supplier,
    recovery_vehicle_type,
    no_of_trips,
    estimated_cost,
    so_id
  } = req.body;

  try {
    const recoveryToUpdate = await SalesOrderRecoveryModel.findByPk(id);

    if (!recoveryToUpdate) {
      return res.status(404).json({ message: "Sales order recovery not found" });
    }

    // Validate that the sales order exists if so_id is provided
    if (so_id) {
      const salesOrder = await SalesOrderModel.findByPk(so_id);
      if (!salesOrder) {
        return res.status(404).json({ message: "Sales order not found" });
      }
    }

    recoveryToUpdate.recovery_supplier = recovery_supplier || recoveryToUpdate.recovery_supplier;
    recoveryToUpdate.recovery_vehicle_type = recovery_vehicle_type || recoveryToUpdate.recovery_vehicle_type;
    recoveryToUpdate.no_of_trips = no_of_trips || recoveryToUpdate.no_of_trips;
    recoveryToUpdate.estimated_cost = estimated_cost || recoveryToUpdate.estimated_cost;
    recoveryToUpdate.so_id = so_id !== undefined ? so_id : recoveryToUpdate.so_id;

    await recoveryToUpdate.save();
    res.status(200).json({
      message: "Sales order recovery updated successfully",
      salesOrderRecovery: recoveryToUpdate
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating sales order recovery",
      error: error.message
    });
  }
};

const deleteSalesOrderRecovery = async (req, res) => {
  const { id } = req.params;

  try {
    const recoveryToDelete = await SalesOrderRecoveryModel.findByPk(id);

    if (!recoveryToDelete) {
      return res.status(404).json({ message: "Sales order recovery not found" });
    }

    await recoveryToDelete.destroy();
    res.status(200).json({ message: "Sales order recovery deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting sales order recovery",
      error: error.message
    });
  }
};

const getSalesOrderRecoveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const salesOrderRecovery = await SalesOrderRecoveryModel.findByPk(id, {
      include: [{
        model: SalesOrderModel,
        as: "sales_order",
        attributes: ["id"] 
      }]
    });

    if (!salesOrderRecovery) {
      return res.status(404).json({ message: "Sales order recovery not found" });
    }

    res.status(200).json(salesOrderRecovery);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving sales order recovery",
      error: error.message
    });
  }
};

const getAllSalesOrderRecoveries = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalRecoveries, rows: recoveries } = await SalesOrderRecoveryModel.findAndCountAll({
      include: [{
        model: SalesOrderModel,
        as: "sales_order",
        attributes: ["id"]
      }],
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      totalRecoveries,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRecoveries / limit),
      recoveries
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving sales order recoveries",
      error: error.message
    });
  }
};

const filterSalesOrderRecoveries = async (req, res) => {
  try {
    const {
      recovery_supplier,
      recovery_vehicle_type,
      so_id,
      page = 1,
      limit = 10
    } = req.query;
    
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (recovery_supplier) {
      where.recovery_supplier = { [Op.like]: `%${recovery_supplier}%` };
    }

    if (recovery_vehicle_type) {
      where.recovery_vehicle_type = { [Op.like]: `%${recovery_vehicle_type}%` };
    }

    if (so_id) {
      where.so_id = so_id;
    }

    const { count: totalRecoveries, rows: recoveries } = await SalesOrderRecoveryModel.findAndCountAll({
      where,
      include: [{
        model: SalesOrderModel,
        as: "sales_order",
        attributes: ["id"]
      }],
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      totalRecoveries,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRecoveries / limit),
      recoveries
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering sales order recoveries",
      error: error.message
    });
  }
};

const exportFilteredSalesOrderRecoveriesToCSV = async (req, res) => {
  try {
    const {
      recovery_supplier,
      recovery_vehicle_type,
      so_id,
      page = 1,
      limit = 10
    } = req.query;
    
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (recovery_supplier) {
      where.recovery_supplier = { [Op.like]: `%${recovery_supplier}%` };
    }

    if (recovery_vehicle_type) {
      where.recovery_vehicle_type = { [Op.like]: `%${recovery_vehicle_type}%` };
    }

    if (so_id) {
      where.so_id = so_id;
    }

    const { rows: recoveries } = await SalesOrderRecoveryModel.findAndCountAll({
      where,
      include: [{
        model: SalesOrderModel,
        as: "sales_order",
        attributes: ["id"]
      }],
      offset,
      limit: parseInt(limit),
    });

    if (!recoveries || recoveries.length === 0) {
      return res.status(404).json({
        message: "No sales order recoveries found matching the filters"
      });
    }

    const recoveriesData = recoveries.map((recovery) => {
      return {
        soRecoveryId: recovery.so_recovery_id,
        recoverySupplier: recovery.recovery_supplier,
        recoveryVehicleType: recovery.recovery_vehicle_type,
        noOfTrips: recovery.no_of_trips,
        estimatedCost: recovery.estimated_cost,
        salesOrderId: recovery.so_id,
        createdAt: recovery.created_at,
        updatedAt: recovery.updated_at
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(recoveriesData);

    res.header("Content-Type", "text/csv");
    res.attachment("sales_order_recoveries.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting sales order recoveries to CSV:", error);
    res.status(500).json({
      message: "Error exporting sales order recoveries to CSV",
      error: error.message
    });
  }
};

const exportFilteredSalesOrderRecoveriesToPDF = async (req, res) => {
  try {
    const {
      recovery_supplier,
      recovery_vehicle_type,
      so_id,
      page = 1,
      limit = 10
    } = req.query;
    
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (recovery_supplier) {
      where.recovery_supplier = { [Op.like]: `%${recovery_supplier}%` };
    }

    if (recovery_vehicle_type) {
      where.recovery_vehicle_type = { [Op.like]: `%${recovery_vehicle_type}%` };
    }

    if (so_id) {
      where.so_id = so_id;
    }

    const { rows: recoveries } = await SalesOrderRecoveryModel.findAndCountAll({
      where,
      include: [{
        model: SalesOrderModel,
        as: "sales_order",
        attributes: ["id"]
      }],
      offset,
      limit: parseInt(limit),
    });

    if (!recoveries || recoveries.length === 0) {
      return res.status(404).json({
        message: "No sales order recoveries found matching the filters"
      });
    }

    const recoveriesData = recoveries.map((recovery) => {
      return [
        recovery.so_recovery_id || "N/A",
        recovery.recovery_supplier || "N/A",
        recovery.recovery_vehicle_type || "N/A",
        recovery.no_of_trips || "N/A",
        recovery.estimated_cost || "N/A",
        recovery.so_id || "N/A",
        recovery.created_at ? new Date(recovery.created_at).toLocaleDateString() : "N/A"
      ];
    });

    const docDefinition = {
      content: [
        { text: "Sales Order Recoveries Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [60, 80, 80, 60, 70, 60, 70],
            body: [
              [
                "Recovery ID",
                "Supplier",
                "Vehicle Type",
                "No. of Trips",
                "Est. Cost",
                "SO ID",
                "Created Date"
              ],
              ...recoveriesData
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20]
        }
      },
      defaultStyle: {
        fontSize: 8
      }
    };

    const printer = new PdfPrinter({
      Roboto: {
        normal: path.join(sourceDir, "Roboto-Regular.ttf"),
        bold: path.join(sourceDir, "Roboto-Medium.ttf"),
        italics: path.join(sourceDir, "Roboto-Italic.ttf"),
        bolditalics: path.join(sourceDir, "Roboto-MediumItalic.ttf")
      }
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    res.header("Content-Type", "application/pdf");
    res.attachment("sales_order_recoveries.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting sales order recoveries to PDF:", error);
    res.status(500).json({
      message: "Error exporting sales order recoveries to PDF",
      error: error.message
    });
  }
};

module.exports = {
  createSalesOrderRecovery,
  createBulkSalesOrderRecoveries,
  updateSalesOrderRecovery,
  deleteSalesOrderRecovery,
  getSalesOrderRecoveryById,
  getAllSalesOrderRecoveries,
  getRecoveriesBySalesOrder,
  filterSalesOrderRecoveries,
  exportFilteredSalesOrderRecoveriesToCSV,
  exportFilteredSalesOrderRecoveriesToPDF
};
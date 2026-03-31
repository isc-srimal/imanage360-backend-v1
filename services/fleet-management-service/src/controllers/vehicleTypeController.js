const VehicleTypeModel = require("../models/VehicleTypeModel");
const AssetCategoryModel = require("../../../fixed-assets-service/src/models/AssetCategoryModel");
const AssetSubcategoryModel = require("../../../fixed-assets-service/src/models/AssetSubcategoryModel");
const AssetCapacityModel = require("../../../fixed-assets-service/src/models/AssetCapacityModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createVehicleType = async (req, res) => {
  const { category_id, subcategory_id, capacity_id, status = "Active" } = req.body;

  try {
    const category = await AssetCategoryModel.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategory = await AssetSubcategoryModel.findByPk(subcategory_id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const capacity = await AssetCapacityModel.findByPk(capacity_id);
    if (!capacity) {
      return res.status(404).json({ message: "Capacity not found" });
    }

    const vehicle_type_name = `${category.category_name} ${subcategory.subcategory_name} ${capacity.capacity_value}`;

    const vehicleType = await VehicleTypeModel.create({
      category_id,
      subcategory_id,
      capacity_id,
      vehicle_type_name,
      status,
    });

    res
      .status(201)
      .json({ message: "Vehicle type created successfully", vehicleType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVehicleType = async (req, res) => {
  const { vehicle_type_id } = req.params;
  const { category_id, subcategory_id, capacity_id, status } = req.body;

  try {
    const vehicleTypeToUpdate = await VehicleTypeModel.findByPk(vehicle_type_id);

    if (!vehicleTypeToUpdate) {
      return res.status(404).json({ message: "Vehicle type not found" });
    }

    let vehicle_type_name = vehicleTypeToUpdate.vehicle_type_name;

    if (category_id || subcategory_id || capacity_id) {
      const newCategoryId = category_id || vehicleTypeToUpdate.category_id;
      const newSubcategoryId = subcategory_id || vehicleTypeToUpdate.subcategory_id;
      const newCapacityId = capacity_id || vehicleTypeToUpdate.capacity_id;

      const category = await AssetCategoryModel.findByPk(newCategoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const subcategory = await AssetSubcategoryModel.findByPk(newSubcategoryId);
      if (!subcategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      const capacity = await AssetCapacityModel.findByPk(newCapacityId);
      if (!capacity) {
        return res.status(404).json({ message: "Capacity not found" });
      }

      vehicle_type_name = `${category.category_name} ${subcategory.subcategory_name} ${capacity.capacity_value}`;
    }

    vehicleTypeToUpdate.category_id = category_id || vehicleTypeToUpdate.category_id;
    vehicleTypeToUpdate.subcategory_id = subcategory_id || vehicleTypeToUpdate.subcategory_id;
    vehicleTypeToUpdate.capacity_id = capacity_id || vehicleTypeToUpdate.capacity_id;
    vehicleTypeToUpdate.vehicle_type_name = vehicle_type_name;
    vehicleTypeToUpdate.status = status || vehicleTypeToUpdate.status;

    await vehicleTypeToUpdate.save();
    res.status(200).json({
      message: "Vehicle type updated successfully",
      vehicleType: vehicleTypeToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating vehicle type", error: error.message });
  }
};

const deleteVehicleType = async (req, res) => {
  const { vehicle_type_id } = req.params;

  try {
    const vehicleTypeToDelete = await VehicleTypeModel.findByPk(vehicle_type_id);

    if (!vehicleTypeToDelete) {
      return res.status(404).json({ message: "Vehicle type not found" });
    }

    await vehicleTypeToDelete.destroy();
    res.status(200).json({ message: "Vehicle type deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting vehicle type", error: error.message });
  }
};

const getVehicleTypeById = async (req, res) => {
  try {
    const { vehicle_type_id } = req.params;
    const vehicleType = await VehicleTypeModel.findByPk(vehicle_type_id, {
      include: [
        { model: AssetCategoryModel, as: "category" },
        { model: AssetSubcategoryModel, as: "subcategory" },
        { model: AssetCapacityModel, as: "capacity" },
      ],
    });

    if (!vehicleType) {
      return res.status(404).json({ message: "Vehicle type not found" });
    }

    res.status(200).json(vehicleType);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving vehicle type", error: error.message });
  }
};

const getAllVehicleTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalVehicleTypes, rows: vehicleTypes } =
      await VehicleTypeModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          { model: AssetCategoryModel, as: "category" },
          { model: AssetSubcategoryModel, as: "subcategory" },
          { model: AssetCapacityModel, as: "capacity" },
        ],
      });

    res.status(200).json({
      totalVehicleTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalVehicleTypes / limit),
      vehicleTypes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving vehicle types", error: error.message });
  }
};

const filterVehicleTypes = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalVehicleTypes, rows: vehicleTypes } =
      await VehicleTypeModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          { model: AssetCategoryModel, as: "category" },
          { model: AssetSubcategoryModel, as: "subcategory" },
          { model: AssetCapacityModel, as: "capacity" },
        ],
      });

    res.status(200).json({
      totalVehicleTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalVehicleTypes / limit),
      vehicleTypes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering vehicle types", error: error.message });
  }
};

const exportFilteredVehicleTypesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: vehicleTypes } = await VehicleTypeModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: AssetCategoryModel, as: "category" },
        { model: AssetSubcategoryModel, as: "subcategory" },
        { model: AssetCapacityModel, as: "capacity" },
      ],
    });

    if (!vehicleTypes || vehicleTypes.length === 0) {
      return res.status(404).json({
        message: "No vehicle types found matching the filters",
      });
    }

    const vehicleTypesData = vehicleTypes.map((type) => {
      return {
        vehicleTypeId: type.vehicle_type_id,
        categoryId: type.category_id,
        subcategoryId: type.subcategory_id,
        capacityId: type.capacity_id,
        vehicleTypeName: type.vehicle_type_name,
        status: type.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(vehicleTypesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_vehicle_types.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting vehicle types to CSV:", error);
    res.status(500).json({
      message: "Error exporting vehicle types to CSV",
      error: error.message,
    });
  }
};

const exportFilteredVehicleTypesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: vehicleTypes } = await VehicleTypeModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: AssetCategoryModel, as: "category" },
        { model: AssetSubcategoryModel, as: "subcategory" },
        { model: AssetCapacityModel, as: "capacity" },
      ],
    });

    if (!vehicleTypes || vehicleTypes.length === 0) {
      return res
        .status(404)
        .json({ message: "No vehicle types found matching the filters" });
    }

    const vehicleTypesData = vehicleTypes.map((type) => {
      return [
        type.vehicle_type_id || "N/A",
        type.category_id || "N/A",
        type.subcategory_id || "N/A",
        type.capacity_id || "N/A",
        type.vehicle_type_name || "N/A",
        type.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Vehicle Types Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [80, 80, 80, 80, "*", 80],
            body: [
              ["ID", "Category ID", "Subcategory ID", "Capacity ID", "Vehicle Type Name", "Status"],
              ...vehicleTypesData,
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
    res.attachment("vehicle_types_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting vehicle types to PDF:", error);
    res.status(500).json({
      message: "Error exporting vehicle types to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createVehicleType,
  updateVehicleType,
  deleteVehicleType,
  getVehicleTypeById,
  getAllVehicleTypes,
  filterVehicleTypes,
  exportFilteredVehicleTypesToCSV,
  exportFilteredVehicleTypesToPDF,
};
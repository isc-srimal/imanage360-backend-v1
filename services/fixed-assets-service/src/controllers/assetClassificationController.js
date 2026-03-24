const AssetClassificationModel = require('../models/AssetClassificationModel');
const AssetCategoryModel = require('../models/AssetCategoryModel');
const AssetSubcategoryModel = require('../models/AssetSubcategoryModel');
const AssetCapacityModel = require('../models/AssetCapacityModel');
const { Parser } = require('json2csv');
const PdfPrinter = require('pdfmake');
const path = require('path');
const { Op } = require('sequelize');

const sourceDir = path.join(__dirname, '..', '..', 'assets', 'fonts');

const validateUnitsOfProduction = (req) => {
  const { default_dep_method, units_of_measurement, total_output } = req.body;
  
  if (default_dep_method === 'units_of_production') {
    if (!units_of_measurement || !['Km', 'Hrs', 'Units'].includes(units_of_measurement)) {
      return 'Units of measurement is required and must be one of: Km, Hrs, Units';
    }
    
    if (!total_output || total_output <= 0) {
      return 'Total output must be a positive numeric value';
    }
  }
  
  return null;
};

const calculateDDBValues = (depMethod, depRate, usefulLife) => {
  let calculatedRate = null;
  let calculatedLife = null;

  if (depMethod === 'declining_balance') {
    if (depRate && !usefulLife) {
      const straightLineRate = depRate / 2;
      calculatedLife = Math.round(1 / (straightLineRate / 100));
    } else if (usefulLife && !depRate) {
      const straightLineRate = 1 / usefulLife;
      calculatedRate = parseFloat((2 * straightLineRate * 100).toFixed(2));
    }
  }

  return { calculatedRate, calculatedLife };
};

const createAssetClassification = async (req, res) => {
  const { 
    classification_name,
    category_id,
    subcategory_id,
    capacity_id,
    default_dep_method,
    default_dep_rate,
    default_useful_life,
    units_of_measurement,
    total_output,
    gl_account_id 
  } = req.body;

  try {
    // Validation
    if (!classification_name) {
      return res.status(400).json({ message: 'Classification name is required' });
    }
    if (!category_id) {
      return res.status(400).json({ message: 'Category ID is required' });
    }
    if (!subcategory_id) {
      return res.status(400).json({ message: 'Subcategory ID is required' });
    }
    if (!capacity_id) {
      return res.status(400).json({ message: 'Capacity ID is required' });
    }
    if (!default_dep_method || !['straight_line', 'declining_balance', 'units_of_production'].includes(default_dep_method)) {
      return res.status(400).json({ message: 'Invalid depreciation method' });
    }
    if (!gl_account_id) {
      return res.status(400).json({ message: 'GL account ID is required' });
    }

    // Check if referenced records exist
    const category = await AssetCategoryModel.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const subcategory = await AssetSubcategoryModel.findByPk(subcategory_id);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    const capacity = await AssetCapacityModel.findByPk(capacity_id);
    if (!capacity) {
      return res.status(404).json({ message: 'Capacity not found' });
    }

    const unitsValidation = validateUnitsOfProduction(req);
    if (unitsValidation) {
      return res.status(400).json({ message: unitsValidation });
    }

    if (default_dep_rate && default_dep_rate <= 0) {
      return res.status(400).json({ message: 'Depreciation rate must be positive' });
    }
    if (default_useful_life && default_useful_life <= 0) {
      return res.status(400).json({ message: 'Useful life must be positive' });
    }

    let finalDepRate = default_dep_rate;
    let finalUsefulLife = default_useful_life;
    let finalUnitsOfMeasurement = units_of_measurement;
    let finalTotalOutput = total_output;

    if (default_dep_method === 'units_of_production') {
      finalDepRate = null;
      finalUsefulLife = null;
    } else {
      finalUnitsOfMeasurement = null;
      finalTotalOutput = null;

      if (default_dep_method === 'declining_balance') {
        const { calculatedRate, calculatedLife } = calculateDDBValues(
          default_dep_method,
          default_dep_rate,
          default_useful_life
        );

        if (calculatedRate !== null) {
          finalDepRate = calculatedRate;
        }
        if (calculatedLife !== null) {
          finalUsefulLife = calculatedLife;
        }

        if (!finalDepRate && !finalUsefulLife) {
          return res.status(400).json({ 
            message: 'For declining balance method, either depreciation rate or useful life must be provided' 
          });
        }
      }
    }

    const classification = await AssetClassificationModel.create({
      classification_name,
      category_id,
      subcategory_id,
      capacity_id,
      default_dep_method,
      default_dep_rate: finalDepRate,
      default_useful_life: finalUsefulLife,
      units_of_measurement: finalUnitsOfMeasurement,
      total_output: finalTotalOutput,
      gl_account_id,
    });

    res.status(201).json({ 
      message: 'Asset classification created successfully', 
      classification,
      calculated_values: {
        final_dep_rate: finalDepRate,
        final_useful_life: finalUsefulLife,
        units_of_measurement: finalUnitsOfMeasurement,
        total_output: finalTotalOutput
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating asset classification', error: error.message });
  }
};

const updateAssetClassification = async (req, res) => {
  const { classification_id } = req.params;
  const { 
    classification_name,
    category_id,
    subcategory_id,
    capacity_id,
    default_dep_method,
    default_dep_rate,
    default_useful_life,
    units_of_measurement,
    total_output,
    gl_account_id 
  } = req.body;

  try {
    const classification = await AssetClassificationModel.findByPk(classification_id);
    if (!classification) {
      return res.status(404).json({ message: 'Asset classification not found' });
    }

    // Validation
    if (classification_name !== undefined && !classification_name) {
      return res.status(400).json({ message: 'Classification name is required' });
    }
    if (category_id) {
      const category = await AssetCategoryModel.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }
    if (subcategory_id) {
      const subcategory = await AssetSubcategoryModel.findByPk(subcategory_id);
      if (!subcategory) {
        return res.status(404).json({ message: 'Subcategory not found' });
      }
    }
    if (capacity_id) {
      const capacity = await AssetCapacityModel.findByPk(capacity_id);
      if (!capacity) {
        return res.status(404).json({ message: 'Capacity not found' });
      }
    }
    if (default_dep_method && !['straight_line', 'declining_balance', 'units_of_production'].includes(default_dep_method)) {
      return res.status(400).json({ message: 'Invalid depreciation method' });
    }
    if (gl_account_id !== undefined && !gl_account_id) {
      return res.status(400).json({ message: 'GL account ID is required' });
    }

    const unitsValidation = validateUnitsOfProduction(req);
    if (unitsValidation) {
      return res.status(400).json({ message: unitsValidation });
    }

    if (default_dep_rate && default_dep_rate <= 0) {
      return res.status(400).json({ message: 'Depreciation rate must be positive' });
    }
    if (default_useful_life && default_useful_life <= 0) {
      return res.status(400).json({ message: 'Useful life must be positive' });
    }

    let finalDepRate = default_dep_rate !== undefined ? default_dep_rate : classification.default_dep_rate;
    let finalUsefulLife = default_useful_life !== undefined ? default_useful_life : classification.default_useful_life;
    let finalUnitsOfMeasurement = units_of_measurement !== undefined ? units_of_measurement : classification.units_of_measurement;
    let finalTotalOutput = total_output !== undefined ? total_output : classification.total_output;
    const finalDepMethod = default_dep_method || classification.default_dep_method;

    if (finalDepMethod === 'units_of_production') {
      finalDepRate = null;
      finalUsefulLife = null;
    } else {
      finalUnitsOfMeasurement = null;
      finalTotalOutput = null;

      if (finalDepMethod === 'declining_balance') {
        const { calculatedRate, calculatedLife } = calculateDDBValues(
          finalDepMethod,
          default_dep_rate,
          default_useful_life
        );

        if (calculatedRate !== null) {
          finalDepRate = calculatedRate;
        }
        if (calculatedLife !== null) {
          finalUsefulLife = calculatedLife;
        }
      }
    }

    await classification.update({
      classification_name: classification_name !== undefined ? classification_name : classification.classification_name,
      category_id: category_id || classification.category_id,
      subcategory_id: subcategory_id || classification.subcategory_id,
      capacity_id: capacity_id || classification.capacity_id,
      default_dep_method: finalDepMethod,
      default_dep_rate: finalDepRate,
      default_useful_life: finalUsefulLife,
      units_of_measurement: finalUnitsOfMeasurement,
      total_output: finalTotalOutput,
      gl_account_id: gl_account_id !== undefined ? gl_account_id : classification.gl_account_id,
    });

    res.status(200).json({ 
      message: 'Asset classification updated successfully', 
      classification: await classification.reload(),
      calculated_values: {
        final_dep_rate: finalDepRate,
        final_useful_life: finalUsefulLife,
        units_of_measurement: finalUnitsOfMeasurement,
        total_output: finalTotalOutput
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating asset classification', error: error.message });
  }
};

const deleteAssetClassification = async (req, res) => {
  const { classification_id } = req.params;

  try {
    const classification = await AssetClassificationModel.findByPk(classification_id);
    if (!classification) {
      return res.status(404).json({ message: 'Asset classification not found' });
    }

    await classification.destroy();
    res.status(200).json({ message: 'Asset classification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting asset classification', error: error.message });
  }
};

const getAssetClassificationById = async (req, res) => {
  try {
    const { classification_id } = req.params;
    const classification = await AssetClassificationModel.findByPk(classification_id, {
      include: [
        { model: AssetCategoryModel, as: 'category' },
        { model: AssetSubcategoryModel, as: 'subcategory' },
        { model: AssetCapacityModel, as: 'capacity' }
      ],
    });
    if (!classification) {
      return res.status(404).json({ message: 'Asset classification not found' });
    }
    res.status(200).json(classification);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving asset classification', error: error.message });
  }
};

const getAllAssetClassifications = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      category_id,
      subcategory_id,
      capacity_id,
      default_dep_method,
      default_useful_life,
      classification_name
    } = req.query;
    
    const offset = (page - 1) * parseInt(limit);

    const whereClause = {};
    
    if (category_id && category_id !== 'all' && category_id !== '') {
      whereClause.category_id = parseInt(category_id);
    }
    if (subcategory_id && subcategory_id !== 'all' && subcategory_id !== '') {
      whereClause.subcategory_id = parseInt(subcategory_id);
    }
    if (capacity_id && capacity_id !== 'all' && capacity_id !== '') {
      whereClause.capacity_id = parseInt(capacity_id);
    }
    if (default_dep_method && default_dep_method !== 'All' && default_dep_method !== '') {
      whereClause.default_dep_method = default_dep_method;
    }
    if (default_useful_life && default_useful_life !== 'All' && default_useful_life !== '') {
      whereClause.default_useful_life = parseInt(default_useful_life);
    }
    if (classification_name && classification_name.trim() !== '') {
      whereClause.classification_name = {
        [Op.iLike]: `%${classification_name.trim()}%` 
      };
    }

    const { count: totalClassifications, rows: classifications } = await AssetClassificationModel.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
      include: [
        { model: AssetCategoryModel, as: 'category' },
        { model: AssetSubcategoryModel, as: 'subcategory' },
        { model: AssetCapacityModel, as: 'capacity' }
      ],
      order: [['classification_id', 'ASC']]
    });

    res.status(200).json({
      totalClassifications,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalClassifications / parseInt(limit)),
      classifications,
      success: true
    });
  } catch (error) {
    console.error('Get all asset classifications error:', error);
    res.status(500).json({ 
      message: 'Error retrieving asset classifications', 
      error: error.message,
      success: false 
    });
  }
};

const exportAssetClassificationsToCSV = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const classifications = await AssetClassificationModel.findAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: AssetCategoryModel, as: 'category' },
        { model: AssetSubcategoryModel, as: 'subcategory' },
        { model: AssetCapacityModel, as: 'capacity' }
      ],
    });

    if (!classifications || classifications.length === 0) {
      return res.status(404).json({ message: 'No asset classifications found' });
    }

    const classificationData = classifications.map(classification => ({
      classification_id: classification.classification_id,
      classification_name: classification.classification_name,
      category_name: classification.category ? classification.category.category_name : 'N/A',
      subcategory_name: classification.subcategory ? classification.subcategory.subcategory_name : 'N/A',
      capacity_name: classification.capacity ? classification.capacity.capacity_name : 'N/A',
      default_dep_method: classification.default_dep_method,
      default_dep_rate: classification.default_dep_rate,
      default_useful_life: classification.default_useful_life,
      units_of_measurement: classification.units_of_measurement,
      total_output: classification.total_output,
      gl_account_id: classification.gl_account_id,
      created_at: classification.created_at,
      updated_at: classification.updated_at,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(classificationData);

    res.header('Content-Type', 'text/csv');
    res.attachment('asset_classifications.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting asset classifications to CSV', error: error.message });
  }
};

const exportAssetClassificationsToPDF = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 100, 
      category_id,
      subcategory_id,
      capacity_id,
      default_dep_method,
      default_useful_life,
      classification_name
    } = req.query;
    
    const isExport = !req.query.page; 
    const offset = isExport ? 0 : (page - 1) * parseInt(limit);
    const queryLimit = isExport ? null : parseInt(limit);

    const whereClause = {};
    
    if (category_id && category_id !== 'all' && category_id !== '') {
      whereClause.category_id = parseInt(category_id);
    }
    if (subcategory_id && subcategory_id !== 'all' && subcategory_id !== '') {
      whereClause.subcategory_id = parseInt(subcategory_id);
    }
    if (capacity_id && capacity_id !== 'all' && capacity_id !== '') {
      whereClause.capacity_id = parseInt(capacity_id);
    }
    if (default_dep_method && default_dep_method !== 'All' && default_dep_method !== '') {
      whereClause.default_dep_method = default_dep_method;
    }
    if (default_useful_life && default_useful_life !== 'All' && default_useful_life !== '') {
      whereClause.default_useful_life = parseInt(default_useful_life);
    }
    if (classification_name && classification_name.trim() !== '') {
      whereClause.classification_name = {
        [Op.iLike]: `%${classification_name.trim()}%` 
      };
    }

    const queryOptions = {
      where: whereClause,
      include: [
        { model: AssetCategoryModel, as: 'category' },
        { model: AssetSubcategoryModel, as: 'subcategory' },
        { model: AssetCapacityModel, as: 'capacity' }
      ],
      order: [['classification_id', 'ASC']] 
    };

    if (!isExport) {
      queryOptions.offset = offset;
      queryOptions.limit = queryLimit;
    }

    const classifications = await AssetClassificationModel.findAll(queryOptions);

    if (!classifications || classifications.length === 0) {
      return res.status(404).json({ 
        message: 'No asset classifications found',
        success: false 
      });
    }

    const classificationData = classifications.map(classification => [
      classification.classification_id?.toString() || 'N/A',
      classification.classification_name || 'N/A',
      classification.category?.category_name || 'N/A',
      classification.subcategory?.subcategory_name || 'N/A',
      classification.capacity?.capacity_value || 'N/A', 
      classification.default_dep_method ? 
        classification.default_dep_method.replace(/_/g, ' ').toUpperCase() : 'N/A',
      classification.default_dep_rate ? `${classification.default_dep_rate}%` : 'N/A',
      classification.default_useful_life ? `${classification.default_useful_life} years` : 'N/A'
    ]);

    const docDefinition = {
      content: [
        { 
          text: 'Asset Classifications Report', 
          style: 'header' 
        },
        { 
          text: `Generated on: ${new Date().toLocaleDateString()}`, 
          style: 'subheader',
          margin: [0, 0, 0, 20]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'ID', style: 'tableHeader' },
                { text: 'Classification Name', style: 'tableHeader' },
                { text: 'Category', style: 'tableHeader' },
                { text: 'Subcategory', style: 'tableHeader' },
                { text: 'Capacity', style: 'tableHeader' },
                { text: 'Dep. Method', style: 'tableHeader' },
                { text: 'Dep. Rate', style: 'tableHeader' },
                { text: 'Useful Life', style: 'tableHeader' }
              ],
              ...classificationData,
            ],
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex === 0) ? '#CCCCCC' : null;
            },
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i) {
              return 'gray';
            }
          }
        },
        {
          text: `Total Records: ${classifications.length}`,
          style: 'footer',
          margin: [0, 20, 0, 0]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
          color: '#2563eb'
        },
        subheader: {
          fontSize: 12,
          alignment: "center",
          italics: true,
          color: '#666666'
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: 'black',
          fillColor: '#f3f4f6'
        },
        footer: {
          fontSize: 10,
          alignment: 'right',
          italics: true
        }
      },
      defaultStyle: {
        fontSize: 9, 
        columnGap: 5
      },
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [30, 50, 30, 40],
    };

    let fonts;
    try {
      const robotoRegular = path.join(sourceDir, 'Roboto-Regular.ttf');
      if (fs.existsSync(robotoRegular)) {
        fonts = {
          Roboto: {
            normal: robotoRegular,
            bold: path.join(sourceDir, 'Roboto-Medium.ttf'),
            italics: path.join(sourceDir, 'Roboto-Italic.ttf'),
            bolditalics: path.join(sourceDir, 'Roboto-MediumItalic.ttf'),
          }
        };
      } else {
        fonts = {
          Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
          }
        };
        docDefinition.defaultStyle.font = 'Helvetica';
      }
    } catch (error) {
      console.warn('Font loading error, using default fonts:', error.message);
      fonts = {
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique'
        }
      };
      docDefinition.defaultStyle.font = 'Helvetica';
    }

    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=asset_classifications.pdf');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');
    
    pdfDoc.on('error', (err) => {
      console.error('PDF generation error:', err);
      if (!res.headersSent) {
        res.status(500).json({ 
          message: 'Error generating PDF', 
          error: err.message 
        });
      }
    });

    pdfDoc.pipe(res);
    pdfDoc.end();

  } catch (error) {
    console.error('PDF Export Error:', error);

    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Error exporting asset classifications to PDF', 
        error: error.message,
        success: false
      });
    }
  }
};

module.exports = {
  createAssetClassification,
  updateAssetClassification,
  deleteAssetClassification,
  getAssetClassificationById,
  getAllAssetClassifications,
  exportAssetClassificationsToCSV,
  exportAssetClassificationsToPDF,
};
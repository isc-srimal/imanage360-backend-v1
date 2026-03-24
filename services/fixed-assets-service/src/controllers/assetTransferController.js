const AssetTransferModel = require('../models/AssetTransferModel');
const AssetModel = require('../models/AssetModel');
const SubAssetModel = require('../models/SubAssetModel');
const DepartmentModel = require('../../../hr-service/src/models/DepartmentModel');
const CostCenterIDModel = require('../models/CostCenterIDModel');
const CustodianIDModel = require('../models/CustodianIDModel');
const LocationIDModel = require('../models/LocationIDModel');
const { Parser } = require('json2csv');
const PdfPrinter = require('pdfmake');
const path = require('path');

const sourceDir = path.join(__dirname, '..', '..', 'assets', 'fonts');

const postToGeneralLedger = async (data) => {
  try {
    console.log(`Posting to GL: ${JSON.stringify(data)}`);
    return { journal_entry_id: `JE-${Date.now()}` };
  } catch (error) {
    throw new Error(`GL Posting failed: ${error.message}`);
  }
};

const notifyCustodian = async (custodian_id, asset_number) => {
  console.log(`Notifying custodian ${custodian_id} for asset ${asset_number}`);
};

const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
};

const createAssetTransfer = async (req, res) => {
  const {
    asset_number, sub_asset_descriptions, to_location_name, to_department_name, to_cost_center_name, transfer_date,
    transfer_reason, initiated_by, approved_by, approval_date, status
  } = req.body;

  try {
     // Parse and validate sub_asset_descriptions
    let parsedSubAssetDescriptions = [];
    if (sub_asset_descriptions) {
      try {
        parsedSubAssetDescriptions = typeof sub_asset_descriptions === 'string' ? JSON.parse(sub_asset_descriptions) : sub_asset_descriptions;
        if (!Array.isArray(parsedSubAssetDescriptions)) {
          throw new Error('sub_asset_descriptions must be an array');
        }
        parsedSubAssetDescriptions = parsedSubAssetDescriptions.filter(desc => typeof desc === 'string' && desc.trim() !== '');
      } catch (error) {
        return res.status(400).json({ message: 'Invalid sub_asset_descriptions format' });
      }
    }

    const asset = await AssetModel.findOne({
      where: { asset_number: asset_number },
    });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Fetch sub-assets to validate descriptions and calculate net book value
    let subAssets = [];
    if (parsedSubAssetDescriptions.length > 0) {
      subAssets = await SubAssetModel.findAll({
        where: {
          asset_number: asset.asset_number,
          description: parsedSubAssetDescriptions,
        },
      });
      if (subAssets.length !== parsedSubAssetDescriptions.length) {
        return res.status(404).json({ message: 'One or more sub-asset descriptions not found' });
      }
    }


    const fromLocation = await LocationIDModel.findOne({ 
      where: { location_name: asset.location_name } 
    });
    if (!fromLocation) {
      return res.status(400).json({ message: 'Source location does not exist' });
    }

    const fromDepartment = await DepartmentModel.findOne({ 
      where: { departmentName: asset.departmentName } 
    });
    if (!fromDepartment) {
      return res.status(400).json({ message: 'Source department does not exist' });
    }

    const fromCostCenter = await CostCenterIDModel.findOne({ 
      where: { cost_center_name: asset.cost_center_name } 
    });
    if (!fromCostCenter) {
      return res.status(400).json({ message: 'Source cost center does not exist' });
    }

    if (!isValidDate(transfer_date)) {
      return res.status(400).json({ message: 'Invalid transfer date format (use YYYY-MM-DD)' });
    }
    if (new Date(transfer_date) > new Date()) {
      return res.status(400).json({ message: 'Transfer date cannot be in the future' });
    }

    if (!to_location_name || !to_department_name || !to_cost_center_name) {
      return res.status(400).json({ message: 'Target location, department, and cost center are required' });
    }
    if (!['pending', 'approved', 'manager_approved', 'finance_approved', 'rejected'].includes(status || 'pending')) {
      return res.status(400).json({ message: 'Invalid transfer status' });
    }

    const toLocation = await LocationIDModel.findOne({ where: { location_name: to_location_name } });
    if (!toLocation) {
      return res.status(400).json({ message: 'Target location does not exist' });
    }

    const toDepartment = await DepartmentModel.findOne({ where: { departmentName: to_department_name } });
    if (!toDepartment) {
      return res.status(400).json({ message: 'Target department does not exist' });
    }

    const toCostCenter = await CostCenterIDModel.findOne({ where: { cost_center_name: to_cost_center_name } });
    if (!toCostCenter) {
      return res.status(400).json({ message: 'Target cost center does not exist' });
    }

    const transfer = await AssetTransferModel.create({
      asset_number,
      sub_asset_descriptions: parsedSubAssetDescriptions,
      from_location_name: fromLocation.location_name,
      from_department_name: fromDepartment.departmentName,
      from_cost_center_name: fromCostCenter.cost_center_name,
      to_location_name,
      to_department_name,
      to_cost_center_name,
      transfer_date,
      transfer_reason,
      initiated_by,
      approved_by,
      approval_date: approval_date && isValidDate(approval_date) ? approval_date : null,
      status: status || 'pending',
    });

    if (status === 'finance_approved') {
      await asset.update({
        location_name: to_location_name,
        departmentName: to_department_name,
        cost_center_name: to_cost_center_name,
        status: 'transferred',
      });
      const glResponse = await postToGeneralLedger({
        type: 'asset_transfer',
        asset_number,
        sub_asset_descriptions: parsedSubAssetDescriptions,
        transfer_id: transfer.transfer_id,
        account: 'fixed_asset',
        contra_account: 'fixed_asset',
      });
      await transfer.update({ journal_entry_id: glResponse.journal_entry_id });
      await notifyCustodian(asset.custodian_id, asset_number);
    }

    res.status(201).json({ message: 'Asset transfer created successfully', transfer });
  } catch (error) {
    console.error('Error creating asset transfer:', error);
    res.status(500).json({ message: 'Error creating asset transfer', error: error.message });
  }
};

const updateAssetTransfer = async (req, res) => {
  const { transfer_id } = req.params;
  const {
    to_location_name, to_department_name, to_cost_center_name, transfer_date,
    transfer_reason, initiated_by, approved_by, finance_approved_by, approval_date, finance_approval_date, status
  } = req.body;

  try {
    const transfer = await AssetTransferModel.findByPk(transfer_id, {
      include: [{ model: AssetModel, as: 'asset' }],
    });
    if (!transfer) {
      return res.status(404).json({ message: 'Asset transfer not found' });
    }

    if (transfer_date && !isValidDate(transfer_date)) {
      return res.status(400).json({ message: 'Invalid transfer date format (use YYYY-MM-DD)' });
    }
    if (transfer_date && new Date(transfer_date) > new Date()) {
      return res.status(400).json({ message: 'Transfer date cannot be in the future' });
    }

    if (status && !['pending', 'approved', 'manager_approved', 'finance_approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid transfer status' });
    }
    if ((to_location_name || to_department_name || to_cost_center_name) &&
        (!to_location_name || !to_department_name || !to_cost_center_name)) {
      return res.status(400).json({ message: 'Target location, department, and cost center must all be provided' });
    }

    await transfer.update({
      to_location_name: to_location_name || transfer.to_location_name,
      to_department_name: to_department_name || transfer.to_department_name,
      to_cost_center_name: to_cost_center_name || transfer.to_cost_center_name,
      transfer_date: transfer_date || transfer.transfer_date,
      transfer_reason: transfer_reason || transfer.transfer_reason,
      initiated_by: initiated_by || transfer.initiated_by,
      approved_by: approved_by || transfer.approved_by,
      finance_approved_by: finance_approved_by || transfer.finance_approved_by,
      approval_date: approval_date && isValidDate(approval_date) ? approval_date : transfer.approval_date,
      finance_approval_date: finance_approval_date && isValidDate(finance_approval_date) ? finance_approval_date : transfer.finance_approval_date,
      status: status || transfer.status,
    });

    if (status === 'finance_approved' && transfer.status !== 'finance_approved') {
      const asset = await AssetModel.findOne({ where: { tag_number: transfer._tag_number } });
      await asset.update({
        location_name: to_location_name || transfer.to_location_name,
        departmentName: to_department_name || transfer.to_department_name,
        cost_center_name: to_cost_center_name || transfer.to_cost_center_name,
        status: 'transferred',
      });
      const glResponse = await postToGeneralLedger({
        type: 'asset_transfer',
        tag_number: transfer.tag_number,
        transfer_id: transfer.transfer_id,
        account: 'fixed_asset',
        contra_account: 'fixed_asset',
      });
      await transfer.update({ journal_entry_id: glResponse.journal_entry_id });
      await notifyCustodian(asset.custodian_id, transfer.tag_number);
    }

    res.status(200).json({ message: 'Asset transfer updated successfully', transfer });
  } catch (error) {
    res.status(500).json({ message: 'Error updating asset transfer', error: error.message });
  }
};

const deleteAssetTransfer = async (req, res) => {
  const { transfer_id } = req.params;

  try {
    const transfer = await AssetTransferModel.findByPk(transfer_id);
    if (!transfer) {
      return res.status(404).json({ message: 'Asset transfer not found' });
    }

    await transfer.destroy();
    res.status(200).json({ message: 'Asset transfer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting asset transfer', error: error.message });
  }
};

const approveAssetTransfer = async (req, res) => {
  const { transfer_id } = req.params;

  try {
    const transfer = await AssetTransferModel.findByPk(transfer_id);
    if (!transfer) {
      return res.status(404).json({ message: 'Asset transfer not found' });
    }

    await transfer.update({ status: 'Approved' });
    res.status(200).json({ message: 'Asset transfer approved successfully', transfer });
  } catch (error) {
    res.status(500).json({ message: 'Error approving asset transfer', error: error.message });
  }
};


const rejectAssetTransfer = async (req, res) => {
  const { transfer_id } = req.params;

  try {
    const transfer = await AssetTransferModel.findByPk(transfer_id);
    if (!transfer) {
      return res.status(404).json({ message: 'Asset transfer not found' });
    }

    await transfer.update({ status: 'Rejected' });
    res.status(200).json({ message: 'Asset transfer rejected successfully', transfer });
  } catch (error) {
    res.status(500).json({ message: 'Error Asset transfer schedule', error: error.message });
  }
};

const getAssetTransferById = async (req, res) => {
  try {
    const { transfer_id } = req.params;
    const transfer = await AssetTransferModel.findByPk(transfer_id, {
      include: [
        { model: AssetModel, as: 'asset' },
        { model: LocationIDModel, as: 'from_location' },
        { model: LocationIDModel, as: 'to_location' },
        { model: DepartmentModel, as: 'from_department' },
        { model: DepartmentModel, as: 'to_department' },
        { model: CostCenterIDModel, as: 'from_cost_center' },
        { model: CostCenterIDModel, as: 'to_cost_center' },
      ],
    });
    if (!transfer) {
      return res.status(404).json({ message: 'Asset transfer not found' });
    }
    res.status(200).json(transfer);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving asset transfer', error: error.message });
  }
};

const getAllAssetTransfers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * parseInt(limit);

    // Build where clause for filtering
    let whereClause = {};
    let includeWhere = {};

    // Status filter
    if (status && status !== 'All') {
      whereClause.status = status;
    }

    // Search filter - search across asset number and transfer reason
    if (search && search.trim() !== '') {
      const { Op } = require('sequelize');
      
      whereClause[Op.or] = [
        {
          transfer_reason: {
            [Op.iLike]: `%${search.trim()}%`
          }
        }
      ];

      // Also search in asset number through include
      includeWhere.asset_number = {
        [Op.iLike]: `%${search.trim()}%`
      };
    }

    const { count: totalTransfers, rows: transfers } = await AssetTransferModel.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
      include: [
        { 
          model: AssetModel, 
          as: 'asset',
          where: Object.keys(includeWhere).length > 0 ? includeWhere : undefined,
          required: Object.keys(includeWhere).length > 0 ? true : false
        },
        { model: LocationIDModel, as: 'from_location' },
        { model: LocationIDModel, as: 'to_location' },
        { model: DepartmentModel, as: 'from_department' },
        { model: DepartmentModel, as: 'to_department' },
        { model: CostCenterIDModel, as: 'from_cost_center' },
        { model: CostCenterIDModel, as: 'to_cost_center' },
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      totalTransfers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTransfers / parseInt(limit)),
      transfers,
    });
  } catch (error) {
    console.error('Error retrieving asset transfers:', error);
    res.status(500).json({ message: 'Error retrieving asset transfers', error: error.message });
  }
};

const exportAssetTransfersToCSV = async (req, res) => {
  try {
    const { status = 'All', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);
    const where = status !== 'All' ? { status } : {};

    const transfers = await AssetTransferModel.findAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: AssetModel, as: 'asset' },
        { model: LocationIDModel, as: 'from_location' },
        { model: LocationIDModel, as: 'to_location' },
        { model: DepartmentModel, as: 'from_department' },
        { model: DepartmentModel, as: 'to_department' },
        { model: CostCenterIDModel, as: 'from_cost_center' },
        { model: CostCenterIDModel, as: 'to_cost_center' },
      ],
    });

    if (!transfers || transfers.length === 0) {
      return res.status(404).json({ message: 'No asset transfers found' });
    }

    const transferData = transfers.map(transfer => ({
      transfer_id: transfer.transfer_id,
      asset_number: transfer.asset_number,
      from_location_name: transfer.from_location?.location_name || transfer.from_location_name,
      to_location_name: transfer.to_location?.location_name || transfer.to_location_name,
      from_department_name: transfer.from_department?.departmentName || transfer.from_department_name,
      to_department_name: transfer.to_department?.departmentName || transfer.to_department_name,
      from_cost_center_name: transfer.from_cost_center?.cost_center_name || transfer.from_cost_center_name,
      to_cost_center_name: transfer.to_cost_center?.cost_center_name || transfer.to_cost_center_name,
      transfer_date: transfer.transfer_date,
      status: transfer.status,
      // approval_status: transfer.approval_status,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(transferData);

    res.header('Content-Type', 'text/csv');
    res.attachment('asset_transfers.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting asset transfers to CSV', error: error.message });
  }
};

const exportAssetTransfersToPDF = async (req, res) => {
  try {
    const { status = 'All', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);
    const where = status !== 'All' ? { status } : {};

    const transfers = await AssetTransferModel.findAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: AssetModel, as: 'asset' },
        { model: LocationIDModel, as: 'from_location' },
        { model: LocationIDModel, as: 'to_location' },
        { model: DepartmentModel, as: 'from_department' },
        { model: DepartmentModel, as: 'to_department' },
        { model: CostCenterIDModel, as: 'from_cost_center' },
        { model: CostCenterIDModel, as: 'to_cost_center' },
      ],
    });

    if (!transfers || transfers.length === 0) {
      return res.status(404).json({ message: 'No asset transfers found' });
    }

    const transferData = transfers.map(transfer => [
      transfer.transfer_id || 'N/A',
      transfer.asset_number || 'N/A',
      transfer.transfer_date || 'N/A',
      transfer.status || 'N/A',
      transfer.approved_by || 'N/A',
    ]);

    const docDefinition = {
      content: [
        { text: 'Asset Transfers', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [
                'Transfer ID', 'Asset Number',
                'Transfer Date', 'Status', 'Approved By'
              ],
              ...transferData,
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
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
        normal: path.join(sourceDir, 'Roboto-Regular.ttf'),
        bold: path.join(sourceDir, 'Roboto-Medium.ttf'),
        italics: path.join(sourceDir, 'Roboto-Italic.ttf'),
        bolditalics: path.join(sourceDir, 'Roboto-MediumItalic.ttf'),
      },
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.header('Content-Type', 'application/pdf');
    res.attachment('asset_transfers.pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error exporting asset transfers to PDF', error: error.message });
  }
};

module.exports = {
  createAssetTransfer,
  updateAssetTransfer,
  deleteAssetTransfer,
  approveAssetTransfer,
  rejectAssetTransfer,
  getAssetTransferById,
  getAllAssetTransfers,
  exportAssetTransfersToCSV,
  exportAssetTransfersToPDF,
};
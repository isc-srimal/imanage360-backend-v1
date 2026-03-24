const AssetDisposalModel = require('../models/AssetDisposalModel');
const AssetModel = require('../models/AssetModel');
const SubAssetModel = require('../models/SubAssetModel');
const { Parser } = require('json2csv');
const PdfPrinter = require('pdfmake');
const path = require('path');
const fs = require('fs').promises;

const sourceDir = path.join(__dirname, '..', '..', 'assets', 'fonts');

const postToGeneralLedger = async (data) => {
  try {
    console.log(`Posting to GL: ${JSON.stringify(data)}`);
    return { journal_entry_id: `JE-${Date.now()}` };
  } catch (error) {
    throw new Error(`GL Posting failed: ${error.message}`);
  }
};

const createAssetDisposal = async (req, res) => {
  const { asset_id, sub_asset_descriptions, disposal_date, disposal_type, disposal_amount, disposal_reason, approved_by_gm, approved_by_fm, invoice_number } = req.body;
  const document_proof = req.file ? req.file.path : null;

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

    // Validation
    const assetId = parseInt(asset_id);
    if (!Number.isInteger(assetId)) {
      return res.status(400).json({ message: 'Invalid asset_id' });
    }

    const asset = await AssetModel.findOne({ where: { asset_id: assetId } });
    if (!asset) {
      return res.status(404).json({ message: 'Main asset not found' });
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

    if (new Date(disposal_date) > new Date()) {
      return res.status(400).json({ message: 'Disposal date cannot be in the future' });
    }

    if (disposal_amount && disposal_amount < 0) {
      return res.status(400).json({ message: 'Disposal amount cannot be negative' });
    }

    if (!['sale', 'scrap', 'donation', 'write_off'].includes(disposal_type)) {
      return res.status(400).json({ message: 'Invalid disposal type' });
    }

    // Calculate net book value
    let totalNetBookValue = asset.acquisition_cost - (asset.accumulated_depreciation || 0);
    if (subAssets.length > 0) {
      totalNetBookValue = subAssets.reduce((sum, subAsset) => {
        return sum + (subAsset.acquisition_cost - (subAsset.current_value || 0));
      }, 0);
    }

    const gain_loss = disposal_amount ? (parseFloat(disposal_amount) - totalNetBookValue) : -totalNetBookValue;

    const disposal = await AssetDisposalModel.create({
      asset_id: assetId,
      sub_asset_descriptions: parsedSubAssetDescriptions,
      disposal_date,
      disposal_type,
      disposal_amount: disposal_amount ? parseFloat(disposal_amount) : 0,
      net_book_value: totalNetBookValue,
      gain_loss,
      invoice_number,
      document_proof,
      approved_by_gm: parseInt(approved_by_gm),
      approved_by_fm: parseInt(approved_by_fm),
      disposal_reason,
    });

    // Update asset and sub-asset statuses
    await AssetModel.update(
      { status: 'disposed' },
      { where: { asset_id: assetId } }
    );
    if (subAssets.length > 0) {
      await SubAssetModel.update(
        { status: 'disposed' },
        { where: { asset_number: asset.asset_number, description: parsedSubAssetDescriptions } }
      );
    }

    const glResponse = await postToGeneralLedger({
      type: 'asset_disposal',
      asset_id,
      sub_asset_descriptions: parsedSubAssetDescriptions,
      disposal_id: disposal.disposal_id,
      gain_loss,
      account: gain_loss >= 0 ? 'gain_on_disposal' : 'loss_on_disposal',
      contra_account: 'fixed_asset',
    });

    await disposal.update({ journal_entry_id: glResponse.journal_entry_id });

    res.status(201).json({ message: 'Asset disposal created successfully', disposal });
  } catch (error) {
    res.status(500).json({ message: 'Error creating asset disposal', error: error.message });
  }
};

const updateAssetDisposal = async (req, res) => {
  const { disposal_id } = req.params;
  const { asset_id, sub_asset_ids, disposal_date, disposal_type, disposal_amount, disposal_reason, approved_by_gm, approved_by_fm, invoice_number } = req.body;
  const document_proof = req.file ? req.file.path : null;

  try {
    const disposal = await AssetDisposalModel.findByPk(disposal_id);
    if (!disposal) {
      return res.status(404).json({ message: 'Asset disposal not found' });
    }

    // Parse and validate sub_asset_ids
    let parsedSubAssetIds = disposal.sub_asset_ids || [];
    if (sub_asset_ids) {
      try {
        parsedSubAssetIds = typeof sub_asset_ids === 'string' ? JSON.parse(sub_asset_ids) : sub_asset_ids;
        if (!Array.isArray(parsedSubAssetIds)) {
          throw new Error('sub_asset_ids must be an array');
        }
        parsedSubAssetIds = parsedSubAssetIds.map(id => parseInt(id)).filter(id => !isNaN(id));
      } catch (error) {
        return res.status(400).json({ message: 'Invalid sub_asset_ids format' });
      }
    }

    // Validation
    const assetIds = parsedSubAssetIds.length > 0 ? parsedSubAssetIds : [parseInt(asset_id) || disposal.asset_id];
    if (!assetIds.every(id => Number.isInteger(id))) {
      return res.status(400).json({ message: 'Invalid asset_id or sub_asset_ids' });
    }

    const assets = await AssetModel.findAll({
      where: { asset_id: assetIds },
    });

    if (assets.length !== assetIds.length) {
      return res.status(404).json({ message: 'One or more assets not found' });
    }

    if (disposal_date && new Date(disposal_date) > new Date()) {
      return res.status(400).json({ message: 'Disposal date cannot be in the future' });
    }

    if (disposal_amount && disposal_amount < 0) {
      return res.status(400).json({ message: 'Disposal amount cannot be negative' });
    }

    if (disposal_type && !['sale', 'scrap', 'donation', 'write_off'].includes(disposal_type)) {
      return res.status(400).json({ message: 'Invalid disposal type' });
    }

    // Calculate net book value and gain/loss
    let totalNetBookValue = 0;
    assets.forEach(asset => {
      const netBookValue = asset.acquisition_cost - (asset.accumulated_depreciation || 0);
      totalNetBookValue += netBookValue;
    });
    const gain_loss = disposal_amount ? (parseFloat(disposal_amount) - totalNetBookValue) : -totalNetBookValue;

    await disposal.update({
      asset_id: parseInt(asset_id) || disposal.asset_id,
      sub_asset_ids: parsedSubAssetIds,
      disposal_date: disposal_date || disposal.disposal_date,
      disposal_type: disposal_type || disposal.disposal_type,
      disposal_amount: disposal_amount ? parseFloat(disposal_amount) : disposal.disposal_amount,
      net_book_value: totalNetBookValue,
      gain_loss,
      invoice_number: invoice_number || disposal.invoice_number,
      document_proof: document_proof || disposal.document_proof,
      approved_by_gm: parseInt(approved_by_gm) || disposal.approved_by_gm,
      approved_by_fm: parseInt(approved_by_fm) || disposal.approved_by_fm,
      disposal_reason: disposal_reason || disposal.disposal_reason,
    });

    res.status(200).json({ message: 'Asset disposal updated successfully', disposal });
  } catch (error) {
    res.status(500).json({ message: 'Error updating asset disposal', error: error.message });
  }
};

const deleteAssetDisposal = async (req, res) => {
  const { disposal_id } = req.params;

  try {
    const disposal = await AssetDisposalModel.findByPk(disposal_id);
    if (!disposal) {
      return res.status(404).json({ message: 'Asset disposal not found' });
    }

    // Delete document proof file if exists
    if (disposal.document_proof) {
      await fs.unlink(disposal.document_proof).catch(err => console.error('Error deleting file:', err));
    }

    await disposal.destroy();
    res.status(200).json({ message: 'Asset disposal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting asset disposal', error: error.message });
  }
};

const getAssetDisposalById = async (req, res) => {
  try {
    const { disposal_id } = req.params;
    const disposal = await AssetDisposalModel.findByPk(disposal_id, {
      include: [{ model: AssetModel, as: 'asset' }],
    });
    if (!disposal) {
      return res.status(404).json({ message: 'Asset disposal not found' });
    }
    res.status(200).json(disposal);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving asset disposal', error: error.message });
  }
};

const getAllAssetDisposals = async (req, res) => {
  try {
    const { page = 1, limit = 10, searchTerm, disposal_type } = req.query;
    const offset = (page - 1) * parseInt(limit);

    // Build where clause for filtering
    let whereClause = {};
    let includeWhere = {};

    // Disposal type filter
    if (disposal_type && disposal_type !== 'all') {
      whereClause.disposal_type = disposal_type;
    }

    // Search filter - search across asset number and disposal reason
    if (searchTerm && searchTerm.trim() !== '') {
      const { Op } = require('sequelize');
      
      whereClause[Op.or] = [
        {
          disposal_reason: {
            [Op.iLike]: `%${searchTerm.trim()}%`
          }
        }
      ];

      // Also search in asset number through include
      includeWhere.asset_number = {
        [Op.iLike]: `%${searchTerm.trim()}%`
      };
    }

    const { count: totalDisposals, rows: disposals } = await AssetDisposalModel.findAndCountAll({
      where: whereClause,
      offset,
      limit: parseInt(limit),
      include: [
        { 
          model: AssetModel, 
          as: 'asset',
          where: Object.keys(includeWhere).length > 0 ? includeWhere : undefined,
          required: Object.keys(includeWhere).length > 0 ? true : false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      totalDisposals,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDisposals / parseInt(limit)),
      disposals,
    });
  } catch (error) {
    console.error('Error retrieving asset disposals:', error);
    res.status(500).json({ message: 'Error retrieving asset disposals', error: error.message });
  }
};

const exportAssetDisposalsToCSV = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const disposals = await AssetDisposalModel.findAll({
      offset,
      limit: parseInt(limit),
      include: [{ model: AssetModel, as: 'asset' }],
    });

    if (!disposals || disposals.length === 0) {
      return res.status(404).json({ message: 'No asset disposals found' });
    }

    const disposalData = disposals.map(disposal => ({
      disposal_id: disposal.disposal_id,
      asset_id: disposal.asset_id,
      sub_asset_ids: JSON.stringify(disposal.sub_asset_ids || []),
      disposal_date: disposal.disposal_date,
      disposal_type: disposal.disposal_type,
      disposal_amount: disposal.disposal_amount,
      net_book_value: disposal.net_book_value,
      gain_loss: disposal.gain_loss,
      invoice_number: disposal.invoice_number,
      document_proof: disposal.document_proof,
      approved_by_gm: disposal.approved_by_gm,
      approved_by_fm: disposal.approved_by_fm,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(disposalData);

    res.header('Content-Type', 'text/csv');
    res.attachment('asset_disposals.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Error exporting asset disposals to CSV', error: error.message });
  }
};

const exportAssetDisposalsToPDF = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const disposals = await AssetDisposalModel.findAll({
      offset,
      limit: parseInt(limit),
      include: [{ model: AssetModel, as: 'asset' }],
    });

    if (!disposals || disposals.length === 0) {
      return res.status(404).json({ message: 'No asset disposals found' });
    }

    const disposalData = disposals.map(disposal => [
      disposal.disposal_id || 'N/A',
      disposal.asset_id || 'N/A',
      JSON.stringify(disposal.sub_asset_ids || []) || 'N/A',
      disposal.disposal_date || 'N/A',
      disposal.disposal_type || 'N/A',
      disposal.disposal_amount || '0.00',
      disposal.net_book_value || '0.00',
      disposal.gain_loss || '0.00',
      disposal.invoice_number || 'N/A',
      disposal.document_proof || 'N/A',
      disposal.approved_by_gm || 'N/A',
      disposal.approved_by_fm || 'N/A',
    ]);

    const docDefinition = {
      content: [
        { text: 'Asset Disposals', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'],
            body: [
              ['Disposal ID', 'Asset ID', 'Sub Asset IDs', 'Disposal Date', 'Disposal Type', 'Disposal Amount', 'Net Book Value', 'Gain/Loss', 'Invoice Number', 'Document Proof', 'Approved by GM', 'Approved by FM'],
              ...disposalData,
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
        normal: path.join(sourceDir, 'Roboto-Regular.ttf'),
        bold: path.join(sourceDir, 'Roboto-Medium.ttf'),
        italics: path.join(sourceDir, 'Roboto-Italic.ttf'),
        bolditalics: path.join(sourceDir, 'Roboto-MediumItalic.ttf'),
      },
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.header('Content-Type', 'application/pdf');
    res.attachment('asset_disposals.pdf');
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error exporting asset disposals to PDF', error: error.message });
  }
};

module.exports = {
  createAssetDisposal,
  updateAssetDisposal,
  deleteAssetDisposal,
  getAssetDisposalById,
  getAllAssetDisposals,
  exportAssetDisposalsToCSV,
  exportAssetDisposalsToPDF,
};
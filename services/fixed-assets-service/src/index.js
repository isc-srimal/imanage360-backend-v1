// services/fixed-assets-service/src/index.js
const express = require('express');
const cors = require('cors');
const path = require("path");
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ─── Routes ────────────────────────────────────────────────────
const assests                 = require('./routes/assetRoutes');
const assetTransfers          = require('./routes/assetTransferRoutes');
const assetDisposals          = require('./routes/assetDisposalRoutes');
const assetCategories         = require('./routes/assetCategoryRoutes');
const depreciationSchedules   = require('./routes/depreciationScheduleRoutes');
const assetSubCategories      = require('./routes/assetSubcategoryRoutes');
const assetCapacities         = require('./routes/assetCapacityRoutes');
const assetClassifications    = require('./routes/assetClassificationRoutes');
const locationID              = require('./routes/locationIDRoutes');
const custodianID             = require('./routes/custodianIdRoutes');
const costCenterID            = require('./routes/costCenterIDRoutes');
const supplierID              = require('./routes/supplierIdRoutes');
const subAssets               = require('./routes/subAssetRoutes');
const modelAssetRoutes        = require('./routes/modelAssetRoutes');
const manufacturerRoutes      = require('./routes/manufacturerRoutes');

// File Upload (If applicable)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/assets',                  assests);
app.use('/api/sub-assets',              subAssets);
app.use('/api/asset-transfers',         assetTransfers);
app.use('/api/asset-disposals',         assetDisposals);
app.use('/api/asset-categories',        assetCategories);
app.use('/api/depreciation-schedules',  depreciationSchedules);
app.use('/api/asset-subcategories',     assetSubCategories);
app.use('/api/asset-capacities',        assetCapacities);
app.use('/api/asset-classifications',   assetClassifications);
app.use('/api/locations',               locationID);
app.use('/api/custodians',              custodianID);
app.use('/api/costcenters',             costCenterID);
app.use('/api/suppliers',               supplierID);
app.use('/api/model-assets',            modelAssetRoutes);
app.use('/api/manufacturers',           manufacturerRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'fixed-assets-service', status: 'OK' });
});

const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`🏢 Fixed Assets Service running on port ${PORT}`);
});
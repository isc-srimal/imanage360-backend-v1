// services/sales-crm-service/src/index.js
const express = require('express');
const cors = require('cors');
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
const crmLeadsRoutes             = require('./routes/leadRoutes');
const crmSalesPipelineRoutes     = require('./routes/salesPipelineRoutes');
const crmProspectRoutes          = require('./routes/prospectRoutes');
const crmFormRoutes              = require('./routes/formRoutes');
const crmFormFieldRoutes         = require('./routes/formFieldRoutes');

app.use('/api/crm/leads',          crmLeadsRoutes);
app.use('/api/crm/sales-pipelines', crmSalesPipelineRoutes);
app.use('/api/crm/prospects',      crmProspectRoutes);
app.use('/api/crm/forms',          crmFormRoutes);
app.use('/api/crm/form-fields',    crmFormFieldRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'sales-crm-service', status: 'OK' });
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`📊 Sales CRM Service running on port ${PORT}`);
});
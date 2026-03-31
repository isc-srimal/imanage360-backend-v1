const express = require('express');
const cors = require('cors');
const path = require("path");
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ─── Routes ────────────────────────────────────────────────────
const dailyScheduleRoutes                  = require('./routes/dailyScheduleRoutes');
const equipmentRoutes                      = require('./routes/equipmentRoutes');
const jobLocationRoutes                    = require('./routes/jobLocationRoutes');
const mainCategoryRoutes                   = require('./routes/mainCategoryRoutes');
const nextServiceTypeRoutes                = require('./routes/nextServiceTypeRoutes');
const operatorTypeRoutes                   = require('./routes/operatorTypeRoutes');
const serviceCategoryRoutes                = require('./routes/serviceCategoryRoutes');
const serviceProviderRoutes                = require('./routes/serviceProviderRoutes');
const servicesRoutes                       = require('./routes/servicesRoutes');
const serviceTypeOneRoutes                 = require('./routes/serviceTypeOneRoutes');
const serviceTypeTwoRoutes                 = require('./routes/serviceTypeTwoRoutes');
const fleetMaintenanceRoutes               = require('./routes/maintenanceRoutes');
const salesOrderOld                        = require('./routes/SalesOrderOld');
const salesOrdersRoutes                    = require('./routes/salesOrdersRoutes');
const operationalHandlingRoutes            = require('./routes/operationalHandlingRoutes');
const vehicleOwnerRoutes                   = require('./routes/vehicleOwnerRoutes');
const manpowerRoutes                       = require('./routes/manpowerRoutes');
const activeAllocationsOriginalRoutes      = require('./routes/activeAllocationsOriginalRoutes');
const serviceEntryTypeRoutes               = require('./routes/serviceEntryTypeRoutes');
const vehicleTypeRoutes                    = require('./routes/vehicleTypeRoutes');
const fleetProductRoutes                   = require('./routes/productRoutes');
const fleetAttachmentRoutes                = require('./routes/attachmentRoutes');
const attachmentLocationRoutes             = require('./routes/attachmentLocationRoutes');
const salesOrderRecoveryRoutes             = require('./routes/salesOrderRecoveryRoutes');
const attachmentStageRoutes                = require('./routes/attachmentStageRoutes');
const equipmentStageRoutes                 = require('./routes/equipmentStageRoutes');
const manpowerStageRoutes                  = require('./routes/manpowerStageRoutes');
const recoveryStageRoutes                  = require('./routes/recoveryStageRoutes');
const backupEquipmentStageRoutes           = require('./routes/backupEquipmentStageRoutes');
const backupManpowerStageRoutes            = require('./routes/backupManpowerStageRoutes');
const subProductAttachmentStageRoutes      = require('./routes/subProductAttachmentStageRoutes');
const deliveryNoteRoutes                   = require('./routes/deliveryNoteRoutes');
const masterChecklistRoutes                = require('./routes/masterChecklistRoutes');
const operationalModificationRoutes        = require('./routes/operationalModificationRoutes');
const attachmentSwapRoutes                 = require('./routes/attachmentSwapRoutes');
const equipmentSwapRoutes                  = require('./routes/equipmentSwapRoutes');
const operatorChangeRoutes                 = require('./routes/operatorChangeRoutes');
const swapReasonRoutes                     = require('./routes/swapReasonRoutes');
const subProductSwapRoutes                 = require('./routes/sub-product-swap-routes');
const OffHireNotesRoutes                   = require('./routes/offHireNoteRoutes');
const ChargeableTypeRoutes                 = require('./routes/chargeableTypeRoutes');
const SwapRequestRoutes                    = require('./routes/swap-requests-routes');
const subProductAttachmentAssignmentRoutes = require('./routes/sub-product-attachment-assignment-routes');
const pushRoutes                           = require('./routes/pushRoutes');

// LPO Push Notifications Cron
const { sendLPOReminderNotifications } = require('./controllers/pushSubscriptionController');

const _runLPOReminderJob = async () => {
  return new Promise((resolve, reject) => {
    const fakeReq = {};
    const fakeRes = {
      status: () => ({
        json: (data) => {
          console.log('📬 [LPO Push] Result:', data);
          resolve(data);
        },
      }),
    };
    sendLPOReminderNotifications(fakeReq, fakeRes).catch(reject);
  });
};

cron.schedule('0 9 * * *', async () => {
  console.log('🔔 [CRON] Running LPO reminder push notifications...');
  try {
    await _runLPOReminderJob();
    console.log('✅ [CRON] LPO reminder push notifications completed.');
  } catch (error) {
    console.error('❌ [CRON] LPO reminder push notification error:', error);
  }
});

console.log('⏰ LPO reminder push notification cron scheduled (daily 9:00 AM)');

// File Upload (If applicable)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/schedules',                          dailyScheduleRoutes);
app.use('/api/equipment',                          equipmentRoutes);
app.use('/api/joblocations',                       jobLocationRoutes);
app.use('/api/main-categories',                    mainCategoryRoutes);
app.use('/api/nextservicetypes',                   nextServiceTypeRoutes);
app.use('/api/operatortypes',                      operatorTypeRoutes);
app.use('/api/servicecategories',                  serviceCategoryRoutes);
app.use('/api/serviceproviders',                   serviceProviderRoutes);
app.use('/api/services',                           servicesRoutes);
app.use('/api/servicetypeones',                    serviceTypeOneRoutes);
app.use('/api/servicetypetwos',                    serviceTypeTwoRoutes);
app.use('/api/maintenance',                        fleetMaintenanceRoutes);
app.use('/api/sales-order-old',                    salesOrderOld);
app.use('/api/sales-orders',                       salesOrdersRoutes);
app.use('/api/operational-handling',               operationalHandlingRoutes);
app.use('/api/vehicle-owners',                     vehicleOwnerRoutes);
app.use('/api/manpower',                           manpowerRoutes);
app.use('/api/active-allocations',                 activeAllocationsOriginalRoutes);
app.use('/api/service-entry-types',                serviceEntryTypeRoutes);
app.use('/api/vehicle-types',                      vehicleTypeRoutes);
app.use('/api/products',                           fleetProductRoutes);
app.use('/api/attachments',                        fleetAttachmentRoutes);
app.use('/api/attachment-locations',               attachmentLocationRoutes);
app.use('/api/sales-order-recoveries',             salesOrderRecoveryRoutes);
app.use('/api/attachment-stages',                  attachmentStageRoutes);
app.use('/api/equipment-stages',                   equipmentStageRoutes);
app.use('/api/manpower-stages',                    manpowerStageRoutes);
app.use('/api/recovery-stages',                    recoveryStageRoutes);
app.use('/api/backup-equipment-stages',            backupEquipmentStageRoutes);
app.use('/api/backup-manpower-stages',             backupManpowerStageRoutes);
app.use('/api/sub-product-attachment-stages',      subProductAttachmentStageRoutes);
app.use('/api/delivery-notes',                     deliveryNoteRoutes);
app.use('/api/master-checklist',                   masterChecklistRoutes);
app.use('/api/operational-modifications',          operationalModificationRoutes);
app.use('/api/attachment-swaps',                   attachmentSwapRoutes);
app.use('/api/equipment-swaps',                    equipmentSwapRoutes);
app.use('/api/operator-changes',                   operatorChangeRoutes);
app.use('/api/swapreasons',                        swapReasonRoutes);
app.use('/api/sub-product-swaps',                  subProductSwapRoutes);
app.use('/api/off-hire-notes',                     OffHireNotesRoutes);
app.use('/api/chargeable-types',                   ChargeableTypeRoutes);
app.use('/api/swap-requests',                      SwapRequestRoutes);
app.use('/api/sub-product-attachment-assignments', subProductAttachmentAssignmentRoutes);
app.use('/api/push',                               pushRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'fleet-management-service', status: 'OK' });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4004;
app.listen(PORT, async () => {
  console.log(`🚛 Fleet Management Service running on port ${PORT}`);
 
  // ✅ Development only: run LPO push job once on startup to verify it works
  // if (process.env.NODE_ENV === 'development') {
    console.log('🧪 [DEV] Running initial LPO reminder push check...');
    try {
      await _runLPOReminderJob();
    } catch (err) {
      console.error('❌ [DEV] Initial LPO push check failed:', err.message);
    }
 // }
});

// const PORT = process.env.PORT || 4004;
// app.listen(PORT, () => {
//   console.log(`🚛 Fleet Management Service running on port ${PORT}`);
// });
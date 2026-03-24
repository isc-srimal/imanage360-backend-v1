const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Routes ────────────────────────────────────────────────────
const dailyScheduleRoutes                  = require('./routes/fleet-management/dailyScheduleRoutes');
const equipmentRoutes                      = require('./routes/fleet-management/equipmentRoutes');
const jobLocationRoutes                    = require('./routes/fleet-management/jobLocationRoutes');
const mainCategoryRoutes                   = require('./routes/fleet-management/mainCategoryRoutes');
const nextServiceTypeRoutes                = require('./routes/fleet-management/nextServiceTypeRoutes');
const operatorTypeRoutes                   = require('./routes/fleet-management/operatorTypeRoutes');
const serviceCategoryRoutes                = require('./routes/fleet-management/serviceCategoryRoutes');
const serviceProviderRoutes                = require('./routes/fleet-management/serviceProviderRoutes');
const servicesRoutes                       = require('./routes/fleet-management/servicesRoutes');
const serviceTypeOneRoutes                 = require('./routes/fleet-management/serviceTypeOneRoutes');
const serviceTypeTwoRoutes                 = require('./routes/fleet-management/serviceTypeTwoRoutes');
const fleetMaintenanceRoutes               = require('./routes/fleet-management/maintenanceRoutes');
const salesOrderOld                        = require('./routes/fleet-management/SalesOrderOld');
const salesOrdersRoutes                    = require('./routes/fleet-management/salesOrdersRoutes');
const operationalHandlingRoutes            = require('./routes/fleet-management/operationalHandlingRoutes');
const vehicleOwnerRoutes                   = require('./routes/fleet-management/vehicleOwnerRoutes');
const manpowerRoutes                       = require('./routes/fleet-management/manpowerRoutes');
const activeAllocationsOriginalRoutes      = require('./routes/fleet-management/activeAllocationsOriginalRoutes');
const serviceEntryTypeRoutes               = require('./routes/fleet-management/serviceEntryTypeRoutes');
const vehicleTypeRoutes                    = require('./routes/fleet-management/vehicleTypeRoutes');
const fleetProductRoutes                   = require('./routes/fleet-management/productRoutes');
const fleetAttachmentRoutes                = require('./routes/fleet-management/attachmentRoutes');
const attachmentLocationRoutes             = require('./routes/fleet-management/attachmentLocationRoutes');
const salesOrderRecoveryRoutes             = require('./routes/fleet-management/salesOrderRecoveryRoutes');
const attachmentStageRoutes                = require('./routes/fleet-management/attachmentStageRoutes');
const equipmentStageRoutes                 = require('./routes/fleet-management/equipmentStageRoutes');
const manpowerStageRoutes                  = require('./routes/fleet-management/manpowerStageRoutes');
const recoveryStageRoutes                  = require('./routes/fleet-management/recoveryStageRoutes');
const backupEquipmentStageRoutes           = require('./routes/fleet-management/backupEquipmentStageRoutes');
const backupManpowerStageRoutes            = require('./routes/fleet-management/backupManpowerStageRoutes');
const subProductAttachmentStageRoutes      = require('./routes/fleet-management/subProductAttachmentStageRoutes');
const deliveryNoteRoutes                   = require('./routes/fleet-management/deliveryNoteRoutes');
const masterChecklistRoutes                = require('./routes/fleet-management/masterChecklistRoutes');
const operationalModificationRoutes        = require('./routes/fleet-management/operationalModificationRoutes');
const attachmentSwapRoutes                 = require('./routes/fleet-management/attachmentSwapRoutes');
const equipmentSwapRoutes                  = require('./routes/fleet-management/equipmentSwapRoutes');
const operatorChangeRoutes                 = require('./routes/fleet-management/operatorChangeRoutes');
const swapReasonRoutes                     = require('./routes/fleet-management/swapReasonRoutes');
const subProductSwapRoutes                 = require('./routes/fleet-management/sub-product-swap-routes');
const OffHireNotesRoutes                   = require('./routes/fleet-management/offHireNoteRoutes');
const ChargeableTypeRoutes                 = require('./routes/fleet-management/chargeableTypeRoutes');
const SwapRequestRoutes                    = require('./routes/fleet-management/swap-requests-routes');
const subProductAttachmentAssignmentRoutes = require('./routes/fleet-management/sub-product-attachment-assignment-routes');
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

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`🚛 Fleet Management Service running on port ${PORT}`);
});
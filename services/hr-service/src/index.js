// services/hr-service/src/index.js
const express = require('express');
const cors = require('cors');
const cron = require('node-cron'); 
const path = require("path");
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: '*' })); // Gateway handles auth
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ─── Import Routes (copy from original project) ──────────────────────────
const employeeRoutes           = require('./routes/employeeRoutes');
const departmentRoutes         = require('./routes/departmentRoutes');
const contractTypeRoutes       = require('./routes/contractTypeRoutes');
const designationRoutes        = require('./routes/designationRoutes');
const leaveTypeRoutes          = require('./routes/leaveTypeRoutes');
const workplaceRoutes          = require('./routes/workplaceRoutes');
const bankDetailsRoutes        = require('./routes/bankDetailsRoutes');
const penaltyTypesRoutes       = require('./routes/penaltyTypeRoutes');
const airTicketsRoutes         = require('./routes/airTicketRoutes');
const payrollRoutes            = require('./routes/payrollRoutes');
const attendenceRoutes         = require('./routes/attendenceRoutes');
const jobPostingRoutes         = require('./routes/jobPostingRoutes');
const leaveRequestRoutes       = require('./routes/leaveRequestRoutes');
const leaveApprovalRoutes      = require('./routes/leaveApprovalRoutes');
const loanRequestRoutes        = require('./routes/loanRequestRoutes');
const loanApprovalRoutes       = require('./routes/loanApprovalRoutes');
const penaltyRoutes            = require('./routes/penaltyRoutes');
const commissionRoutes         = require('./routes/commissionRoutes');
const performanceManagement    = require('./routes/performanceManagementRoutes');
const trainingAndDevelopment   = require('./routes/trainingAndDevelopmentRoutes');
const countries                = require('./routes/countriesRoutes');
const gratuity                 = require('./routes/gratuityRoutes');
const provisions               = require('./routes/provisionRoutes');
const payrollsDeductions       = require('./routes/payrollDeductionRoutes');
const certificationTypeRoutes  = require('./routes/certificationTypeRoutes');
const certificationNameRoutes  = require('./routes/certificationNameRoutes');
const certificationBodyRoutes  = require('./routes/certificationBodyRoutes');
const industryRoutes           = require('./routes/industryRoutes');
const trainingDetailsRoutes    = require('./routes/trainingDetailsRoutes');
const jobOnboardingRoutes      = require('./routes/jobOnboardingRoutes');
const employeeContractRoutes   = require('./routes/employeeContractRoutes');
const gatePassLocationRoutes   = require('./routes/gatePassLocationRoutes');

const { schedulePayrollCalculation } = require("./cronJobs/payrollScheduler");

// Payroll
schedulePayrollCalculation();

// File Upload (If applicable)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/manageEmployee',       employeeRoutes);
app.use('/api/department',           departmentRoutes);
app.use('/api/contractType',         contractTypeRoutes);
app.use('/api/designation',          designationRoutes);
app.use('/api/leaveType',            leaveTypeRoutes);
app.use('/api/workplace',            workplaceRoutes);
app.use('/api/bank',                 bankDetailsRoutes);
app.use('/api/penalties',            penaltyTypesRoutes);
app.use('/api/air',                  airTicketsRoutes);
app.use('/api/payroll',              payrollRoutes);
app.use('/api/attendence',           attendenceRoutes);
app.use('/api/jobPosting',           jobPostingRoutes);
app.use('/api/leave',                leaveRequestRoutes);
app.use('/api/applyLeave',           leaveApprovalRoutes);
app.use('/api/loan',                 loanRequestRoutes);
app.use('/api/loanApproval',         loanApprovalRoutes);
app.use('/api/penalty',              penaltyRoutes);
app.use('/api/commissions',          commissionRoutes);
app.use('/api/performance',          performanceManagement);
app.use('/api/goal',                 performanceManagement);
app.use('/api/kpi',                  performanceManagement);
app.use('/api/trainingDevelopment',  trainingAndDevelopment);
app.use('/api/countries',            countries);
app.use('/api/gratuity',             gratuity);
app.use('/api/provision',            provisions);
app.use('/api/payroll-deductions',   payrollsDeductions);
app.use('/api/certifications-types', certificationTypeRoutes);
app.use('/api/certifications-names', certificationNameRoutes);
app.use('/api/certifications-bodies',certificationBodyRoutes);
app.use('/api/industries',           industryRoutes);
app.use('/api/trainingDetails',      trainingDetailsRoutes);
app.use('/api/jobOnboarding',        jobOnboardingRoutes);
app.use('/api/contracts',            employeeContractRoutes);
app.use('/api/gatepass',             gatePassLocationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ service: 'hr-service', status: 'OK' });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`👥 HR Service running on port ${PORT}`);
});
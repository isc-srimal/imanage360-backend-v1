const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Routes ────────────────────────────────────────────────────
const authRoutes             = require('./routes/user/authRoutes');
const manageUserRoutes       = require('./routes/user/manageUserRoutes');
const choicesListRoutes      = require('./routes/choicesListRoutes');
const companySettingsRoutes  = require('./routes/user/companySettingsRoutes');
const usersManagement        = require('./routes/user-security-management/usersRoutes');
const usersTypes             = require('./routes/user-security-management/userTypesRoutes');
const userGroupsRoutes       = require('./routes/user-security-management/userGroupsRoutes');
const userRolesRoutes        = require('./routes/user-security-management/rolesRoutes');
const permissionRoutes       = require('./routes/user-security-management/permissionsRoutes');
const passwordRulesRoutes    = require('./routes/user-security-management/passwordRulesRoutes');
const rolePermissionsRoutes  = require('./routes/user-security-management/rolePermissionsRoutes');
const organizations          = require('./routes/subscription/organizationsRoutes');
const tenants                = require('./routes/subscription/tenantsRoutes');
const branchesRoutes         = require('./routes/subscription/branchesRoutes');
const modulesRoutes          = require('./routes/subscription/modulesRoutes');
const subscriptionPlansRoutes = require('./routes/subscription/subscriptionPlansRoutes');

app.use('/api/auth',              authRoutes);
app.use('/api/manageUser',        manageUserRoutes);
app.use('/api/choicesList',       choicesListRoutes);
app.use('/api/manageCompany',     companySettingsRoutes);
app.use('/api/users',             usersManagement);
app.use('/api/user-types',        usersTypes);
app.use('/api/user-groups',       userGroupsRoutes);
app.use('/api/roles',             userRolesRoutes);
app.use('/api/permissions',       permissionRoutes);
app.use('/api/password-rules',    passwordRulesRoutes);
app.use('/api/role-permissions',  rolePermissionsRoutes);
app.use('/api/organizations',     organizations);
app.use('/api/tenants',           tenants);
app.use('/api/branches',          branchesRoutes);
app.use('/api/modules',           modulesRoutes);
app.use('/api/subscription-plans', subscriptionPlansRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'user-management-service', status: 'OK' });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🔐 User Management Service running on port ${PORT}`);
});
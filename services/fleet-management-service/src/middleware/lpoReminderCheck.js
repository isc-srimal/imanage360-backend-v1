// middleware/lpoReminderCheck.js
const SalesOrdersModel = require('../models/SalesOrdersModel');

const checkLPOReminders = async (req, res, next) => {
  try {
    // Only check for authenticated users
    if (req.user) {
      // This runs in background, doesn't block the request
      setTimeout(async () => {
        try {
          const salesOrders = await SalesOrdersModel.findAll({
            where: {
              status: 'Active',
              so_status: ['Revision Under Approval', 'Approved', 'Revision Rejected']
            }
          });
          
          for (const order of salesOrders) {
            await checkAndHandleLPOReminders(order);
          }
        } catch (error) {
          console.error('Background LPO check error:', error);
        }
      }, 0);
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = checkLPOReminders;
// cron/lpoReminders.js
const cron = require('node-cron');
const SalesOrdersModel = require('../models/SalesOrdersModel');

// Run every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  try {
    console.log('Checking for LPO reminders...');
    
    const salesOrders = await SalesOrdersModel.findAll({
      where: {
        status: 'Active',
        so_status: ['Revision Under Approval', 'Approved', 'Revision Rejected']
      }
    });
    
    let remindersSent = 0;
    
    for (const order of salesOrders) {
      const reminderInfo = await checkAndHandleLPOReminders(order);
      
      if (reminderInfo.hasReminders) {
        remindersSent++;
        
        // Here you could send email notifications to sales person
        // or trigger other notification mechanisms
        console.log(`Reminder needed for SO: ${order.so_number}`);
      }
    }
    
    console.log(`LPO reminder check completed. ${remindersSent} reminders needed.`);
  } catch (error) {
    console.error('Error in LPO reminder cron job:', error);
  }
});

console.log('LPO reminder cron job scheduled to run daily at 9:00 AM');
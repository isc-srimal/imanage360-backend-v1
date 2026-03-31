// cron/lpoReminderCron.js
// Requires: npm install node-cron
const cron = require("node-cron");
const { sendLPOReminderNotifications } = require("../controllers/pushSubscriptionController");

/**
 * Schedule LPO reminder push notifications.
 * Runs every day at 8:00 AM server time.
 * Adjust the cron expression as needed:
 *   "0 8 * * *"        = daily at 8:00 AM
 *   "0 8,14 * * 1-5"   = 8 AM and 2 PM, weekdays only
 */
const scheduleLPOReminders = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("[CRON] Running LPO reminder push notifications...");
    try {
      // Fake req/res to reuse the controller function
      const fakeReq = {};
      const fakeRes = {
        status: (code) => ({
          json: (data) => console.log(`[CRON] Result (${code}):`, data),
        }),
      };
      await sendLPOReminderNotifications(fakeReq, fakeRes);
    } catch (err) {
      console.error("[CRON] LPO reminder notification error:", err);
    }
  });

  console.log("[CRON] LPO reminder scheduler registered (daily 8:00 AM)");
};

module.exports = { scheduleLPOReminders };
// controllers/pushSubscriptionController.js
const PushSubscriptionModel = require("../../../fleet-management-service/src/models/PushSubscriptionModel"); // adjust path
const UsersModel = require("../../../user-management-service/src/models/UsersModel"); // adjust path
const { sendPushToMany } = require("../services/pushNotificationService");
const SalesOrdersModel = require("../models/SalesOrdersModel"); // adjust path
const { checkAndHandleLPOReminders } = require("./salesOrdersController"); // adjust path

/**
 * POST /api/push/subscribe
 * Save or update a push subscription for the authenticated user
 */
const subscribe = async (req, res) => {
  try {
    const userId = req.user?.uid;   
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { subscription } = req.body;
    if (!subscription?.endpoint) {
      return res.status(400).json({ message: "Invalid subscription object" });
    }

    // Upsert: update if endpoint exists, else create
    const [record, created] = await PushSubscriptionModel.findOrCreate({
      where: { endpoint: subscription.endpoint },
      defaults: {
        user_id: userId,
        endpoint: subscription.endpoint,
        subscription_data: subscription,
        user_agent: req.headers["user-agent"] || null,
      },
    });

    if (!created) {
      // Update subscription data (keys may have rotated) and reassign to current user
      await record.update({
        user_id: userId,
        subscription_data: subscription,
        user_agent: req.headers["user-agent"] || null,
      });
    }

    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Error saving push subscription:", error);
    res.status(500).json({ message: "Error saving subscription", error: error.message });
  }
};

/**
 * POST /api/push/unsubscribe
 * Remove a push subscription
 */
const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) return res.status(400).json({ message: "Endpoint required" });

    await PushSubscriptionModel.destroy({ where: { endpoint } });
    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing subscription", error: error.message });
  }
};

/**
 * GET /api/push/vapid-public-key
 * Return VAPID public key to the frontend
 */
const getVapidPublicKey = (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

/**
 * POST /api/push/send-lpo-reminders  (internal / cron)
 * Check all active sales orders and send push notifications for LPO issues.
 * Call this from a cron job instead of polling from the browser.
 */
const sendLPOReminderNotifications = async (req, res) => {
  try {
    const salesOrders = await SalesOrdersModel.findAll({
      where: {
        so_status: ["Approved", "Revision Under Approval", "Revision Rejected"],
        is_draft: false,
      },
    });

    const notificationMap = {}; // userId -> [notifications]

    for (const order of salesOrders) {
      const reminderInfo = await checkAndHandleLPOReminders(order);

      if (reminderInfo.hasReminders && reminderInfo.requiresAction) {
        // sales_person_id = EmployeeModel.id
        // We need UsersModel.uid where employeeId = sales_person_id
        const user = await UsersModel.findOne({
          where: { employeeId: order.sales_person_id },
          attributes: ["uid"],
        });

        if (!user) continue;   // no user account linked to this employee

        const userId = user.uid;
        if (!notificationMap[userId]) notificationMap[userId] = [];

        reminderInfo.reminders.forEach((r) => {
          if (r.requiresAction) {
            notificationMap[userId].push({
              salesOrderId: order.id,
              soNumber: order.so_number,
              client: order.client,
              type: r.type,
              message: r.message,
            });
          }
        });
      }
    }

    let totalSent = 0;
    const allExpiredEndpoints = [];

    for (const [userId, reminders] of Object.entries(notificationMap)) {
      const subscriptions = await PushSubscriptionModel.findAll({
        where: { user_id: userId },
      });

      if (!subscriptions.length) continue;

      const payload = {
        title: `LPO Reminder – ${reminders.length} action(s) required`,
        body: reminders.map((r) => `${r.soNumber}: ${r.message}`).join("\n"),
        icon: "/icons/icon-192x192.png", // adjust to your app's icon path
        badge: "/icons/badge-72x72.png",
        tag: `lpo-reminder-${userId}`,   // replaces previous notification with same tag
        renotify: true,
        data: {
          url: "/fleet-management/sales-order",
          reminders,
          type: "lpo_reminder",
        },
      };

      const expired = await sendPushToMany(subscriptions, payload);
      allExpiredEndpoints.push(...expired);
      totalSent += subscriptions.length - expired.length;
    }

    // Clean up expired subscriptions
    if (allExpiredEndpoints.length > 0) {
      await PushSubscriptionModel.destroy({
        where: { endpoint: allExpiredEndpoints },
      });
    }

    res.status(200).json({
      message: "LPO reminder notifications sent",
      totalSent,
      expiredRemoved: allExpiredEndpoints.length,
    });
  } catch (error) {
    console.error("Error sending LPO reminder notifications:", error);
    res.status(500).json({ message: "Error sending notifications", error: error.message });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getVapidPublicKey,
  sendLPOReminderNotifications,
};
// routes/pushRoutes.js
const express = require("express");
const {
  subscribe,
  unsubscribe,
  getVapidPublicKey,
  sendLPOReminderNotifications,
} = require("../controllers/pushSubscriptionController"); 
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware"); 

const router = express.Router();

/**
 * @swagger
 * /api/push/vapid-public-key:
 *   get:
 *     summary: Get VAPID public key for push subscription
 *     tags: [Push Notifications]
 *     responses:
 *       200:
 *         description: VAPID public key
 */
router.get("/vapid-public-key", getVapidPublicKey);

/**
 * @swagger
 * /api/push/subscribe:
 *   post:
 *     summary: Subscribe to push notifications
 *     tags: [Push Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.post("/subscribe", verifyToken, subscribe);

/**
 * @swagger
 * /api/push/unsubscribe:
 *   post:
 *     summary: Unsubscribe from push notifications
 *     tags: [Push Notifications]
 */
router.post("/unsubscribe", unsubscribe);

/**
 * @swagger
 * /api/push/send-lpo-reminders:
 *   post:
 *     summary: Trigger LPO reminder push notifications (cron/internal)
 *     tags: [Push Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.post("/send-lpo-reminders", verifyToken, sendLPOReminderNotifications);

module.exports = router;
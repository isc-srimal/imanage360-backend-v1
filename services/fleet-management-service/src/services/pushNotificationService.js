// services/pushNotificationService.js
const webpush = require("web-push");

// Generate VAPID keys once and store in .env:
// Run: node -e "const webpush=require('web-push'); const keys=webpush.generateVAPIDKeys(); console.log(keys);"
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL || "iteq-admin@iteqsolution.com"}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

/**
 * Send push notification to a single subscription
 */
const sendPushNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    if (error.statusCode === 410 || error.statusCode === 404) {
      // Subscription expired/invalid - caller should remove it
      return { success: false, expired: true, error: error.message };
    }
    return { success: false, expired: false, error: error.message };
  }
};

/**
 * Send push notification to multiple subscriptions
 * Returns list of expired subscription endpoints to clean up
 */
const sendPushToMany = async (subscriptions, payload) => {
  const expiredEndpoints = [];

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const result = await sendPushNotification(sub.subscription_data, payload);
      if (result.expired) {
        expiredEndpoints.push(sub.endpoint);
      }
    })
  );

  return expiredEndpoints;
};

module.exports = { sendPushNotification, sendPushToMany };
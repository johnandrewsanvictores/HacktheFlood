import User from '../models/User.js';
import Notification from '../models/Notification.js';
import axios from 'axios';

let webpush = null;
const loadWebPush = async () => {
  if (webpush === null) {
    try {
      const webpushModule = await import('web-push');
      webpush = webpushModule.default || webpushModule;
    } catch (error) {
      console.warn('web-push package not installed. Push notifications will be disabled.');
      webpush = false;
    }
  }
  return webpush;
};

const sendSMSNotification = async (phoneNumbers, message) => {
  try {
    const smsApiUrl = 'https://api.sms-gate.app/3rdparty/v1/message';
    const smsApiUsername = process.env.SMS_API_USERNAME;
    const smsApiPassword = process.env.SMS_API_PASSWORD;

    if (!smsApiUsername || !smsApiPassword) {
      console.warn('SMS API credentials not configured. Skipping SMS notification.');
      return { success: false, error: 'SMS API not configured' };
    }

    await axios.post(
      smsApiUrl,
      {
        textMessage: { text: message },
        phoneNumbers,
        simNumber: 1,
      },
      {
        auth: {
          username: smsApiUsername,
          password: smsApiPassword,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    return { success: false, error: error.message };
  }
};

const sendPushNotification = async (subscription, payload) => {
  try {
    const webpushLib = await loadWebPush();
    if (!webpushLib) {
      return { success: false, error: 'web-push package not installed' };
    }

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return { success: false, error: 'Invalid subscription' };
    }

    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@projectwaze.ph';

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.warn('VAPID keys not configured. Skipping push notification.');
      return { success: false, error: 'VAPID keys not configured' };
    }

    webpushLib.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

    await webpushLib.sendNotification(subscription, JSON.stringify(payload));

    return { success: true };
  } catch (error) {
    console.error('Error sending push notification:', error.message);
    if (error.statusCode === 410) {
      return { success: false, error: 'Subscription expired', expired: true };
    }
    return { success: false, error: error.message };
  }
};

export const notifyAllUsers = async (projectName, reportType = 'issue', projectId = null, reportId = null) => {
  try {
    const users = await User.find({}).select('phone_number push_subscription _id');
    
    if (users.length === 0) {
      return { success: true, message: 'No users to notify' };
    }

    const message = `New ${reportType} report submitted for project: ${projectName}. Check ProjectWaze PH for details.`;
    const title = 'New Project Report';
    
    const phoneNumbers = users
      .map(user => user.phone_number)
      .filter(phone => phone && phone.trim() !== '');

    const smsResults = [];
    if (phoneNumbers.length > 0) {
      const smsResult = await sendSMSNotification(phoneNumbers, message);
      smsResults.push(smsResult);
    }

    const notificationPromises = [];
    const pushResults = [];
    
    for (const user of users) {
      const notificationData = {
        user_id: user._id,
        type: 'report',
        title,
        message,
        project_id: projectId,
        report_id: reportId,
        is_read: false
      };
      
      notificationPromises.push(Notification.create(notificationData));

      if (user.push_subscription && user.push_subscription.endpoint) {
        const payload = {
          title,
          body: message,
          icon: '/vite.svg',
          badge: '/vite.svg',
          data: {
            url: '/dashboard',
            projectName,
            reportType,
            notificationId: null
          },
        };

        const result = await sendPushNotification(user.push_subscription, payload);
        
        if (result.expired) {
          await User.findByIdAndUpdate(user._id, {
            $unset: { push_subscription: 1 },
          });
        }
        
        pushResults.push(result);
      }
    }

    await Promise.all(notificationPromises);

    const successfulSMS = smsResults.filter(r => r.success).length;
    const successfulPush = pushResults.filter(r => r.success).length;

    return {
      success: true,
      sms: {
        sent: successfulSMS,
        total: phoneNumbers.length,
      },
      push: {
        sent: successfulPush,
        total: pushResults.length,
      },
    };
  } catch (error) {
    console.error('Error notifying users:', error);
    return { success: false, error: error.message };
  }
};


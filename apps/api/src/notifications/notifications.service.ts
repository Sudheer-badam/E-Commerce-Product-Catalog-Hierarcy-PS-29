import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  async sendOrderUpdateNotification(fcmToken: string, orderId: string, status: string) {
    const payload = {
      notification: {
        title: 'Order Status Updated',
        body: `Your order #${orderId} is now ${status}.`,
      },
      data: {
        orderId,
        click_action: 'FLUTTER_NOTIFICATION_CLICK', // In case they use a mobile app later
      },
    };

    try {
      // In production, this will actually send via FCM:
      // await admin.messaging().sendToDevice(fcmToken, payload);
      console.log(`[FCM Mock] Sent notification to token ${fcmToken}: Order ${orderId} is ${status}`);
      return { success: true };
    } catch (error) {
      console.error('Error sending FCM notification:', error);
      return { success: false, error };
    }
  }

  async sendAdminPaymentAlert(orderId: string, amount: number) {
    const payload = {
      notification: {
        title: 'New Payment Review',
        body: `Order #${orderId} has uploaded a QR payment screenshot for $${amount}. Action required.`,
      },
      topic: 'admin_alerts', // Broadcast to all admins subscribed to this topic
    };

    try {
      // await admin.messaging().send(payload);
      console.log(`[FCM Mock] Sent admin alert for Order ${orderId} payment review.`);
      return { success: true };
    } catch (error) {
      console.error('Error sending admin alert:', error);
      return { success: false, error };
    }
  }
}

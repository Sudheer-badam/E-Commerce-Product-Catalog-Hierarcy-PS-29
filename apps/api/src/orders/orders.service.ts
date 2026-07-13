import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from '../chat/chat.gateway';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly prisma: PrismaService,
    private readonly chatGateway: ChatGateway,
    private readonly mailService: MailService,
  ) {}

  async createOrder(customerId: string, items: any[], totalAmount: number) {
    const newOrder = await this.prisma.order.create({
      data: {
        customerId,
        items,
        totalAmount,
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
      }
    });
    return newOrder;
  }

  async submitPaymentScreenshot(orderId: string, screenshotUrl: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentScreenshotUrl: screenshotUrl }
    });
    
    this.notificationsService.sendAdminPaymentAlert(order.id, order.totalAmount);
    
    this.chatGateway.server.emit('admin_alert', {
      orderId: order.id,
      shortId: order.id.substr(0, 8).toUpperCase(),
      title: 'New Payment Review',
      message: `Order #${order.id.substr(0, 8).toUpperCase()} has uploaded a QR payment screenshot. Action required.`,
      amount: order.totalAmount
    });
    
    return updatedOrder;
  }

  async updatePaymentStatus(orderId: string, status: 'Paid' | 'Rejected') {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    
    const newOrderStatus = status === 'Paid' ? 'Confirmed' : order.orderStatus;

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { 
        paymentStatus: status,
        orderStatus: newOrderStatus
      }
    });
    
    this.notificationsService.sendOrderUpdateNotification('mock-customer-fcm-token', order.id, updatedOrder.orderStatus);
    
    return updatedOrder;
  }

  async dispatchOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: 'Shipped' }
    });

    // Notify customer via Chat
    const chatMsg = await this.prisma.chatMessage.create({
      data: {
        sender: 'System',
        text: `📦 Great news! Your order #${orderId.substr(0, 8).toUpperCase()} has been dispatched and is on its way.`,
        room: 'support_room',
      }
    });

    this.chatGateway.server.to('support_room').emit('receive_message', {
      id: chatMsg.id,
      sender: chatMsg.sender,
      text: chatMsg.text,
      createdAt: chatMsg.createdAt,
    });

    this.chatGateway.server.emit('dispatch_alert', { 
      orderId, 
      shortId: orderId.substr(0, 8).toUpperCase() 
    });

    // Send email notification
    const parts = order.customerId.split(' | ');
    const emailRaw = parts.find((p: string) => p.startsWith('EMAIL:'));
    const customerEmail = emailRaw ? emailRaw.replace('EMAIL:', '').trim() : null;

    if (customerEmail && customerEmail !== 'N/A') {
      const html = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Your Order is on its way! 📦</h2>
          <p>Great news! Your order <b>#${orderId.substr(0, 8).toUpperCase()}</b> has been dispatched and is on its way to you.</p>
          <p>You can track your order status in your ShopSmart dashboard.</p>
          <br/>
          <p>Thank you for shopping with us!</p>
          <p>- The ShopSmart Team</p>
        </div>
      `;
      await this.mailService.sendMail(customerEmail, 'ShopSmart: Your Order has been Dispatched!', html);
    }

    return updatedOrder;
  }

  async sendInvoice(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    // Parse customer details from the combined customerId string
    const parts = order.customerId.split(' | ');
    const name    = parts[0] || 'Customer';
    const phone   = parts[1] || 'N/A';
    const method  = parts[2] || 'N/A';
    const addrRaw = parts.find((p: string) => p.startsWith('ADDR:'));
    const txnRaw  = parts.find((p: string) => p.startsWith('TXN:'));
    const emailRaw = parts.find((p: string) => p.startsWith('EMAIL:'));
    const address = addrRaw ? addrRaw.replace('ADDR:', '').trim() : 'N/A';
    const txnId   = txnRaw  ? txnRaw.replace('TXN:', '').trim()   : 'N/A';
    const email   = emailRaw ? emailRaw.replace('EMAIL:', '').trim() : null;

    const invoiceData = {
      orderId,
      shortId: orderId.substr(0, 8).toUpperCase(),
      name,
      phone,
      address,
      paymentMethod: method,
      transactionId: txnId,
      items: order.items,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      issuedAt: new Date().toISOString(),
    };

    // Broadcast invoice to all connected users via WebSocket
    this.chatGateway.broadcastInvoice(invoiceData);

    // Send email to customer
    if (email && email !== 'N/A') {
      const itemsHtml = ((order.items as any[]) || []).map(item => 
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name || item.id} × ${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
        </tr>`
      ).join('');

      const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #F59E0B; text-align: center;">ShopSmart Invoice</h2>
          <p style="text-align: center;">Order #${invoiceData.shortId}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Item</th>
                <th style="text-align: right; padding: 8px; border-bottom: 2px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 12px 8px; font-weight: bold; text-align: right;">Total Paid:</td>
                <td style="padding: 12px 8px; font-weight: bold; text-align: right; color: #4ADE80;">₹${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 20px; background: #f9f9f9; padding: 15px; border-radius: 6px;">
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${address}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${method}</p>
            <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${txnId}</p>
          </div>

          <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #777;">Thank you for your purchase!</p>
        </div>
      `;
      await this.mailService.sendMail(email, `Your ShopSmart Invoice (Order #${invoiceData.shortId})`, html);
    }

    return { success: true, invoiceData };
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}

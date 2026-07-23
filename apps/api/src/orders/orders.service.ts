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

    const trackingId = `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { 
        orderStatus: 'Shipped',
        trackingId: trackingId
      }
    });

    // Notify customer via Chat
    const chatMsg = await this.prisma.chatMessage.create({
      data: {
        sender: 'System',
        text: `📦 Great news! Your order #${orderId.substr(0, 8).toUpperCase()} has been dispatched. Tracking ID: ${trackingId}`,
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
      shortId: orderId.substr(0, 8).toUpperCase(),
      trackingId
    });

    // Send email notification
    const parts = order.customerId.split(' | ');
    const emailRaw = parts.find((p: string) => p.startsWith('EMAIL:'));
    const customerEmail = emailRaw ? emailRaw.replace('EMAIL:', '').trim() : null;
    console.log(`[DISPATCH EMAIL] orderId=${orderId} | found email: ${customerEmail}`);

    if (customerEmail && customerEmail !== 'N/A') {
      const text = `Your Order is on its way!

Great news! Your order #${orderId.substr(0, 8).toUpperCase()} has been dispatched and is on its way to you.
Tracking ID: ${trackingId}

You can track your order status in your ShopSmart dashboard.

Thank you for shopping with us!
- The ShopSmart Team`;
      console.log(`[DISPATCH EMAIL] Attempting to send email to: ${customerEmail}`);
      const result = await this.mailService.sendMail(customerEmail, 'ShopSmart: Your Order has been Dispatched!', text);
      console.log(`[DISPATCH EMAIL] sendMail result: ${result}`);
    } else {
      console.log(`[DISPATCH EMAIL] Skipping email - no valid email found in customerId`);
    }

    return updatedOrder;
  }

  async deliverOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: 'Delivered' }
    });
    return updatedOrder;
  }

  async enableReturn(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { isReturnEnabled: true }
    });
    return updatedOrder;
  }

  async requestReturn(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    if (order.orderStatus !== 'Delivered') {
      throw new Error('Order must be delivered to request a return.');
    }
    if (!order.isReturnEnabled) {
      throw new Error('Returns are not enabled for this order.');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: 'Return Requested' }
    });
    
    // Notify admin
    this.chatGateway.server.emit('admin_alert', {
      orderId: order.id,
      shortId: order.id.substr(0, 8).toUpperCase(),
      title: 'Return Requested',
      message: `Customer requested a return for Order #${order.id.substr(0, 8).toUpperCase()}`,
    });

    return updatedOrder;
  }

  async findByUser(uid: string) {
    return this.prisma.order.findMany({
      where: {
        customerId: {
          contains: `UID:${uid}`
        }
      },
      orderBy: { createdAt: 'desc' }
    });
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
    console.log(`[INVOICE EMAIL] orderId=${orderId} | found email: ${email}`);
    if (email && email !== 'N/A') {
      const itemsText = ((order.items as any[]) || []).map(item => 
        `- ${item.name || item.id} x ${item.quantity}: Rs.${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`
      ).join('\n');

      const text = `ShopSmart Invoice
Order #${invoiceData.shortId}
----------------------------------------

Items Ordered:
${itemsText}

Total Paid: Rs.${order.totalAmount.toFixed(2)}

----------------------------------------
Customer: ${name}
Address: ${address}
Payment Method: ${method}
Transaction ID: ${txnId}

Thank you for your purchase!`;
      console.log(`[INVOICE EMAIL] Attempting to send invoice email to: ${email}`);
      const result = await this.mailService.sendMail(email, `Your ShopSmart Invoice (Order #${invoiceData.shortId})`, text);
      console.log(`[INVOICE EMAIL] sendMail result: ${result}`);
    } else {
      console.log(`[INVOICE EMAIL] Skipping - no valid email found in customerId`);
    }

    return { success: true, invoiceData };
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}

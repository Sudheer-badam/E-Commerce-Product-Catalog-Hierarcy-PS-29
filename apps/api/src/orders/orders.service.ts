import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly prisma: PrismaService,
    private readonly chatGateway: ChatGateway,
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
    const address = addrRaw ? addrRaw.replace('ADDR:', '').trim() : 'N/A';
    const txnId   = txnRaw  ? txnRaw.replace('TXN:', '').trim()   : 'N/A';

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

    return { success: true, invoiceData };
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}

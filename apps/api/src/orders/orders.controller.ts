import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() body: any) {
    return await this.ordersService.createOrder(body.customerId, body.items, body.totalAmount);
  }

  @Post(':id/payment-screenshot')
  async uploadPaymentScreenshot(@Param('id') id: string, @Body('screenshotUrl') url: string) {
    return await this.ordersService.submitPaymentScreenshot(id, url);
  }

  @Patch(':id/status')
  async updatePaymentStatus(@Param('id') id: string, @Body('status') status: 'Paid' | 'Rejected') {
    return await this.ordersService.updatePaymentStatus(id, status);
  }

  @Patch(':id/dispatch')
  async dispatchOrder(@Param('id') id: string) {
    return await this.ordersService.dispatchOrder(id);
  }

  @Patch(':id/deliver')
  async deliverOrder(@Param('id') id: string) {
    return await this.ordersService.deliverOrder(id);
  }

  @Patch(':id/enable-return')
  async enableReturn(@Param('id') id: string) {
    return await this.ordersService.enableReturn(id);
  }

  @Patch(':id/request-return')
  async requestReturn(@Param('id') id: string) {
    return await this.ordersService.requestReturn(id);
  }

  @Post(':id/send-invoice')
  async sendInvoice(@Param('id') id: string) {
    return await this.ordersService.sendInvoice(id);
  }

  @Get('user/:uid')
  async getOrdersByUser(@Param('uid') uid: string) {
    return await this.ordersService.findByUser(uid);
  }

  @Get()
  async getAllOrders() {
    return await this.ordersService.findAll();
  }
}

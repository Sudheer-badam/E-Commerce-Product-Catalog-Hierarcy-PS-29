import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule, 
    OrdersModule, 
    AuthModule,
    ChatModule,
    NotificationsModule,
    MailModule
  ],
})
export class AppModule {}
